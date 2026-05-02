import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const assetsDir = path.join(repoRoot, "assets");
const repoState = JSON.parse(readFileSync(path.join(repoRoot, "docs", "repo-state.json"), "utf8"));
const assetBudgets = repoState.assetBudgets || {};
const assetExceptions = new Set((repoState.assetExceptions || []).map((entry) => entry.path));

function walkFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath));
      continue;
    }
    files.push(absolutePath);
  }

  return files;
}

const assetFiles = walkFiles(assetsDir);
const warnings = [];
const failures = [];

function getAssetClass(relativePath) {
  const normalizedPath = relativePath.replace(/\\/g, "/");

  if (
    normalizedPath.startsWith("assets/coffeeBean/") ||
    normalizedPath.startsWith("assets/coffeeCups/") ||
    normalizedPath.startsWith("assets/logo/")
  ) {
    return "primary";
  }

  if (
    normalizedPath.startsWith("assets/beanFragments/") ||
    normalizedPath.startsWith("assets/stickers/")
  ) {
    return "secondary";
  }

  return "tertiary";
}

for (const assetFile of assetFiles) {
  const size = statSync(assetFile).size;
  const relativePath = path.relative(repoRoot, assetFile);
  const normalizedPath = relativePath.replace(/\\/g, "/");
  const assetClass = getAssetClass(relativePath);
  const budget = assetBudgets[assetClass];

  if (!budget) {
    warnings.push({ relativePath, size, assetClass, reason: "missing budget profile" });
    continue;
  }

  if (assetExceptions.has(normalizedPath)) {
    warnings.push({ relativePath, size, assetClass, reason: "approved exception" });
    continue;
  }

  if (size > budget.failBytes) {
    failures.push({ relativePath, size, assetClass });
    continue;
  }

  if (size > budget.warnBytes) {
    warnings.push({ relativePath, size, assetClass, reason: "over warning threshold" });
  }
}

function formatSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

if (warnings.length > 0) {
  console.log("[verify:assets] Large assets to monitor:");
  for (const warning of warnings) {
    console.log(`- ${warning.relativePath} [${warning.assetClass}]: ${formatSize(warning.size)} (${warning.reason})`);
  }
}

if (failures.length > 0) {
  console.error("[verify:assets] Asset budget failures:");
  for (const failure of failures) {
    console.error(`- ${failure.relativePath} [${failure.assetClass}]: ${formatSize(failure.size)}`);
  }
  process.exit(1);
}

console.log("[verify:assets] Asset scan completed. No asset exceeded the current class-based hard limit.");
