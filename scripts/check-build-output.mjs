import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const distPath = path.join(repoRoot, "dist");
const repoStatePath = path.join(repoRoot, "docs", "repo-state.json");
const repoState = JSON.parse(readFileSync(repoStatePath, "utf8"));
const buildOutputConfig = repoState.buildOutput;

if (!buildOutputConfig?.required) {
  console.log("[verify:build-output] Build output tracking is not required in repo-state.");
  process.exit(0);
}

const totals = {
  totalBytes: 0,
  jsBytes: 0,
  cssBytes: 0,
  mediaBytes: 0,
  htmlBytes: 0,
  fileCount: 0
};

function walk(directoryPath) {
  for (const entry of readdirSync(directoryPath, { withFileTypes: true })) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    const size = statSync(fullPath).size;
    const ext = path.extname(entry.name).toLowerCase();

    totals.totalBytes += size;
    totals.fileCount += 1;

    if (ext === ".js") {
      totals.jsBytes += size;
    } else if (ext === ".css") {
      totals.cssBytes += size;
    } else if (ext === ".html") {
      totals.htmlBytes += size;
    } else {
      totals.mediaBytes += size;
    }
  }
}

try {
  walk(distPath);
} catch (error) {
  console.error("[verify:build-output] Failed to read dist/. Run `npm run build` first.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const warnings = [];
const failures = [];

function formatBytes(bytes) {
  return `${bytes.toLocaleString("en-US")} B`;
}

function compareBudget(metricName, currentBytes, baselineBytes, absoluteBudget, growthBudget) {
  if (currentBytes >= absoluteBudget.failBytes) {
    failures.push(
      `${metricName} is ${formatBytes(currentBytes)} which exceeds absolute fail budget ${formatBytes(absoluteBudget.failBytes)}`
    );
  } else if (currentBytes >= absoluteBudget.warnBytes) {
    warnings.push(
      `${metricName} is ${formatBytes(currentBytes)} which exceeds absolute warn budget ${formatBytes(absoluteBudget.warnBytes)}`
    );
  }

  const growthBytes = currentBytes - baselineBytes;

  if (growthBytes >= growthBudget.failBytes) {
    failures.push(
      `${metricName} grew by ${formatBytes(growthBytes)} from baseline ${formatBytes(baselineBytes)}, exceeding fail growth budget ${formatBytes(growthBudget.failBytes)}`
    );
  } else if (growthBytes >= growthBudget.warnBytes) {
    warnings.push(
      `${metricName} grew by ${formatBytes(growthBytes)} from baseline ${formatBytes(baselineBytes)}, exceeding warn growth budget ${formatBytes(growthBudget.warnBytes)}`
    );
  }
}

for (const metricName of ["totalBytes", "jsBytes", "cssBytes", "mediaBytes"]) {
  compareBudget(
    metricName,
    totals[metricName],
    buildOutputConfig.baseline[metricName],
    buildOutputConfig.absoluteBudgets[metricName],
    buildOutputConfig.growthBudgets[metricName]
  );
}

console.log("[verify:build-output] Current dist footprint:");
console.log(
  `- total=${formatBytes(totals.totalBytes)} js=${formatBytes(totals.jsBytes)} css=${formatBytes(totals.cssBytes)} media=${formatBytes(totals.mediaBytes)} html=${formatBytes(totals.htmlBytes)} files=${totals.fileCount}`
);
console.log(
  `- baseline total=${formatBytes(buildOutputConfig.baseline.totalBytes)} js=${formatBytes(buildOutputConfig.baseline.jsBytes)} css=${formatBytes(buildOutputConfig.baseline.cssBytes)} media=${formatBytes(buildOutputConfig.baseline.mediaBytes)} html=${formatBytes(buildOutputConfig.baseline.htmlBytes)} files=${buildOutputConfig.baseline.fileCount}`
);

if (warnings.length > 0) {
  console.warn("[verify:build-output] Warnings:");
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (failures.length > 0) {
  console.error("[verify:build-output] Build output check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("[verify:build-output] Build output is within configured absolute and growth budgets.");
