import { readdirSync } from "node:fs";

const repoRoot = process.cwd();

const allowedRootFiles = new Set([
  ".editorconfig",
  ".gitignore",
  ".nvmrc",
  "AGENTS.md",
  "README.md",
  "index.html",
  "package-lock.json",
  "package.json",
  "vite.config.js"
]);

const allowedRootDirectories = new Set([
  ".git",
  "assets",
  "docs",
  "node_modules",
  "public",
  "scripts",
  "src",
  "tests"
]);

const ignoreByPattern = [
  /^vite.*\.log$/i,
  /^.*\.err\.log$/i,
  /^.*\.out\.log$/i,
  /^tmp_figma_.*\.png$/i,
  /^dump-dom\.html$/i
];

const cleanupDirectoryPatterns = [
  /^dist$/i,
  /^output$/i,
  /^qa-.*$/i,
  /^tmp-.*$/i
];

const rootEntries = readdirSync(repoRoot, { withFileTypes: true });
const warnings = [];

for (const entry of rootEntries) {
  if (entry.isDirectory()) {
    if (cleanupDirectoryPatterns.some((pattern) => pattern.test(entry.name))) {
      warnings.push(`${entry.name} (generated directory should stay ignored or be cleaned up)`);
      continue;
    }

    if (!allowedRootDirectories.has(entry.name)) {
      warnings.push(`${entry.name} (unexpected root directory)`);
    }
    continue;
  }

  if (allowedRootFiles.has(entry.name)) {
    continue;
  }

  if (ignoreByPattern.some((pattern) => pattern.test(entry.name))) {
    warnings.push(`${entry.name} (should stay ignored or be cleaned up)`);
    continue;
  }

  warnings.push(`${entry.name} (unexpected root file)`);
}

if (warnings.length > 0) {
  console.log("[check:repo-hygiene] Root items to review:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
  process.exit(0);
}

console.log("[check:repo-hygiene] Root contents are aligned with the current hygiene policy.");
