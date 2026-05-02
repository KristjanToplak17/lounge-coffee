import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();

const requiredFiles = [
  ".gitignore",
  ".editorconfig",
  ".nvmrc",
  "package.json",
  "AGENTS.md",
  path.join("docs", "harness-engineering-plan.md"),
  path.join("docs", "repo-operations.md"),
  path.join("docs", "repo-health.md"),
  path.join("docs", "repo-state.json"),
  path.join("scripts", "verify-repo-state.mjs"),
  path.join("scripts", "check-repo-hygiene.mjs"),
  path.join("scripts", "check-build-output.mjs")
];

const missingFiles = requiredFiles.filter((relativePath) => !existsSync(path.join(repoRoot, relativePath)));
const repoState = JSON.parse(readFileSync(path.join(repoRoot, "docs", "repo-state.json"), "utf8"));
const packageJson = JSON.parse(readFileSync(path.join(repoRoot, "package.json"), "utf8"));
const packageScripts = packageJson.scripts || {};
const requiredCommands = repoState.verification?.requiredCommands || [];
const missingRequiredCommands = requiredCommands.filter((commandName) => !packageScripts[commandName]);
const nodeBinary = process.execPath;
const composedChecks = [
  { name: "verify-docs", args: [path.join("scripts", "verify-docs.mjs")] },
  { name: "verify-repo-state", args: [path.join("scripts", "verify-repo-state.mjs")] },
  { name: "check-repo-hygiene", args: [path.join("scripts", "check-repo-hygiene.mjs")] }
];

if (missingFiles.length > 0) {
  console.error("[audit:repo] Missing required baseline files:");
  for (const missingFile of missingFiles) {
    console.error(`- ${missingFile}`);
  }
  process.exit(1);
}

if (missingRequiredCommands.length > 0) {
  console.error("[audit:repo] Required commands from repo-state.json are missing:");
  for (const commandName of missingRequiredCommands) {
    console.error(`- ${commandName}`);
  }
  process.exit(1);
}

console.log("[audit:repo] Baseline files and repo-state-required commands are present.");
console.log(`[audit:repo] Current tracked repo phase: ${repoState.phase}`);
console.log(`[audit:repo] Browser smoke implemented: ${repoState.verification?.browserSmokeImplemented ? "yes" : "no"}`);

for (const check of composedChecks) {
  const result = spawnSync(nodeBinary, check.args, {
    cwd: repoRoot,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    console.error(`[audit:repo] ${check.name} failed while composing repo audit.`);
    if (result.stdout?.trim()) {
      console.error(result.stdout.trim());
    }
    if (result.stderr?.trim()) {
      console.error(result.stderr.trim());
    }
    process.exit(1);
  }
}

console.log("[audit:repo] Composed doc/state/hygiene checks passed.");

if (Array.isArray(repoState.temporaryWaivers) && repoState.temporaryWaivers.length > 0) {
  console.log("[audit:repo] Active temporary waivers:");
  for (const waiver of repoState.temporaryWaivers) {
    console.log(`- ${JSON.stringify(waiver)}`);
  }
} else {
  console.log("[audit:repo] No temporary waivers are recorded in repo-state.json.");
}
