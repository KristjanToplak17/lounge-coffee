import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const repoRoot = process.cwd();
const distIndexPath = path.join(repoRoot, "dist", "index.html");
const viteBinPath = path.join(repoRoot, "node_modules", "vite", "bin", "vite.js");
const repoState = JSON.parse(readFileSync(path.join(repoRoot, "docs", "repo-state.json"), "utf8"));
const previewPort = 4173 + Math.floor(Math.random() * 200);
const previewUrl = `http://127.0.0.1:${previewPort}`;
const artifactsDir = path.join(repoRoot, "output", "playwright");
const checkpointsDir = path.join(artifactsDir, "checkpoints");
const browserScenarios = repoState.verification?.browserScenarios || [];

if (!existsSync(distIndexPath)) {
  console.error("[verify:browser] Missing dist/index.html. Run `npm run build` before browser verification.");
  process.exit(1);
}

if (!existsSync(viteBinPath)) {
  console.error("[verify:browser] Missing local Vite binary. Run `npm install` before browser verification.");
  process.exit(1);
}

mkdirSync(artifactsDir, { recursive: true });
mkdirSync(checkpointsDir, { recursive: true });

function startPreviewServer() {
  const serverProcess = spawn(
    process.execPath,
    [viteBinPath, "preview", "--host", "127.0.0.1", "--port", String(previewPort), "--strictPort"],
    {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true
    }
  );

  serverProcess.stdout.on("data", () => {});
  serverProcess.stderr.on("data", () => {});

  return serverProcess;
}

async function waitForPreviewServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until the preview server is ready.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Preview server did not become ready within ${timeoutMs}ms`);
}

async function runScenario(browser, scenario) {
  const context = await browser.newContext({
    viewport: scenario.viewport,
    isMobile: scenario.isMobile ?? false,
    hasTouch: scenario.hasTouch ?? false,
    reducedMotion: scenario.reducedMotion
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  try {
    await page.addInitScript(() => {
      window.__loungeMetrics = {
        cls: 0,
        longTaskCount: 0,
        longestLongTaskMs: 0,
        observersSupported: {
          layoutShift: false,
          longTask: false
        }
      };

      if ("PerformanceObserver" in window) {
        try {
          const layoutShiftObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                window.__loungeMetrics.cls += entry.value;
              }
            }
          });

          layoutShiftObserver.observe({ type: "layout-shift", buffered: true });
          window.__loungeMetrics.observersSupported.layoutShift = true;
        } catch {
          // Layout-shift observer is not available in this environment.
        }

        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              window.__loungeMetrics.longTaskCount += 1;
              window.__loungeMetrics.longestLongTaskMs = Math.max(
                window.__loungeMetrics.longestLongTaskMs,
                entry.duration
              );
            }
          });

          longTaskObserver.observe({ type: "longtask", buffered: true });
          window.__loungeMetrics.observersSupported.longTask = true;
        } catch {
          // Long-task observer is not available in this environment.
        }
      }
    });

    await page.goto(previewUrl, { waitUntil: "networkidle" });
    await page.waitForSelector('[data-app="lounge-coffee"]', { timeout: 10_000 });

    await page.waitForFunction(
        ({ expectedMotionProfile, expectedCurrentScene, expectedIntroCompleteValue }) => {
          const appNode = document.querySelector('[data-app="lounge-coffee"]');
          return (
            appNode?.getAttribute("data-motion-profile") === expectedMotionProfile &&
            appNode?.getAttribute("data-intro-complete") === expectedIntroCompleteValue &&
            appNode?.getAttribute("data-current-scene") === expectedCurrentScene
          );
        },
      {
        expectedMotionProfile: scenario.expectedMotionProfile,
        expectedCurrentScene: repoState.verification.expectedCurrentSceneAfterIntro,
        expectedIntroCompleteValue: repoState.verification.expectedIntroCompleteValue
      },
      { timeout: scenario.timeoutMs }
    );

    const introSceneCount = await page.locator('[data-scene="intro"]').count();
    if (introSceneCount !== 0) {
      throw new Error("Intro scene still exists after intro completion marker was reached.");
    }

    const metrics = await page.evaluate(() => window.__loungeMetrics);

    if (metrics?.observersSupported?.layoutShift && metrics.cls > scenario.maxCls) {
      throw new Error(`Layout shift too high: ${metrics.cls.toFixed(4)} > ${scenario.maxCls}`);
    }

    if (
      metrics?.observersSupported?.longTask &&
      metrics.longestLongTaskMs > scenario.maxLongestLongTaskMs
    ) {
      throw new Error(
        `Longest long task too high: ${metrics.longestLongTaskMs.toFixed(1)}ms > ${scenario.maxLongestLongTaskMs}ms`
      );
    }

    const checkpointPath = path.join(checkpointsDir, `${scenario.name}.png`);
    await page.screenshot({ path: checkpointPath, fullPage: true });

    if (pageErrors.length > 0) {
      throw new Error(`Page errors detected: ${pageErrors.join(" | ")}`);
    }

    if (consoleErrors.length > 0) {
      throw new Error(`Console errors detected: ${consoleErrors.join(" | ")}`);
    }

    console.log(
      `[verify:browser] Metrics ${scenario.name}: cls=${metrics.cls.toFixed(4)}, longestLongTaskMs=${metrics.longestLongTaskMs.toFixed(1)}`
    );
  } catch (error) {
    const screenshotPath = path.join(artifactsDir, `${scenario.name}-failure.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
    throw new Error(`${scenario.name}: ${error.message} (screenshot: ${screenshotPath})`);
  } finally {
    await context.close();
  }
}

if (!Array.isArray(browserScenarios) || browserScenarios.length === 0) {
  console.error("[verify:browser] repo-state.json is missing verification.browserScenarios.");
  process.exit(1);
}

const previewServer = startPreviewServer();

try {
  await waitForPreviewServer(previewUrl, 20_000);

  const browser = await chromium.launch({ headless: true });
  try {
    for (const scenario of browserScenarios) {
      await runScenario(browser, scenario);
      console.log(`[verify:browser] Passed ${scenario.name}`);
    }
  } finally {
    await browser.close();
  }
} catch (error) {
  console.error(`[verify:browser] ${error.message}`);
  process.exitCode = 1;
} finally {
  previewServer.kill();
}
