import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const filesToCheck = [
  "AGENTS.md",
  path.join("docs", "README.md"),
  path.join("docs", "repo-operations.md"),
  path.join("docs", "repo-health.md"),
  path.join("docs", "plans", "README.md")
];

const missingPaths = [];
const markdownLinkPattern = /\[[^\]]+\]\((\.\/[^)]+)\)/g;
const requiredDocs = [
  "project-brief.md",
  "design-system.md",
  "scene-map.md",
  "motion-system.md",
  "loader.md",
  "asset-inventory.md",
  "app-architecture.md",
  "content-contract.md",
  "implementation-phases.md",
  "harness-engineering-plan.md",
  "repo-operations.md",
  "repo-health.md",
  "repo-state.json"
];
const repoState = JSON.parse(readFileSync(path.join(repoRoot, "docs", "repo-state.json"), "utf8"));

for (const relativeFile of filesToCheck) {
  const absoluteFile = path.join(repoRoot, relativeFile);
  const content = readFileSync(absoluteFile, "utf8");
  const baseDir = path.dirname(absoluteFile);
  const matches = content.matchAll(markdownLinkPattern);

  for (const match of matches) {
    const relativeTarget = match[1];
    const absoluteTarget = path.resolve(baseDir, relativeTarget);

    if (!existsSync(absoluteTarget)) {
      missingPaths.push(`${relativeFile} -> ${relativeTarget}`);
    }
  }
}

const docsReadme = readFileSync(path.join(repoRoot, "docs", "README.md"), "utf8");
const rootReadme = readFileSync(path.join(repoRoot, "README.md"), "utf8");
const repoOperations = readFileSync(path.join(repoRoot, "docs", "repo-operations.md"), "utf8");
const docsDirectoryEntries = requiredDocs.map((filename) => path.join("docs", filename));
const missingRequiredDocs = docsDirectoryEntries.filter((relativePath) => !existsSync(path.join(repoRoot, relativePath)));
const unlistedRequiredDocs = requiredDocs.filter((filename) => !docsReadme.includes(filename));
const staleReadmePhrases = [
  "moving toward a harness-engineered workflow",
  "The current milestone is to finish the documentation pass"
];

if (missingPaths.length > 0) {
  console.error("[verify:docs] Missing linked files:");
  for (const missingPath of missingPaths) {
    console.error(`- ${missingPath}`);
  }
  process.exit(1);
}

if (missingRequiredDocs.length > 0) {
  console.error("[verify:docs] Missing required docs:");
  for (const relativePath of missingRequiredDocs) {
    console.error(`- ${relativePath}`);
  }
  process.exit(1);
}

if (unlistedRequiredDocs.length > 0) {
  console.error("[verify:docs] docs/README.md is missing required doc mentions:");
  for (const filename of unlistedRequiredDocs) {
    console.error(`- ${filename}`);
  }
  process.exit(1);
}

if (!repoOperations.includes(repoState.phase)) {
  console.error("[verify:docs] docs/repo-operations.md does not mention the current repo-state phase.");
  process.exit(1);
}

const matchedStalePhrases = staleReadmePhrases.filter((phrase) => rootReadme.includes(phrase));
if (matchedStalePhrases.length > 0) {
  console.error("[verify:docs] README.md still contains stale status phrases:");
  for (const phrase of matchedStalePhrases) {
    console.error(`- ${phrase}`);
  }
  process.exit(1);
}

console.log("[verify:docs] Link targets and required docs are in place.");
