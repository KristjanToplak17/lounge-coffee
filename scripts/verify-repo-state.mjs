import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const repoStatePath = path.join(repoRoot, "docs", "repo-state.json");

if (!existsSync(repoStatePath)) {
  console.error("[verify:repo-state] Missing docs/repo-state.json.");
  process.exit(1);
}

/** @type {{
 * phase: string,
 * scenes: Record<string, { status: string }>,
 * verification: {
 *   requiredCommands: string[],
 *   browserSmokeImplemented: boolean,
 *   desktopSmokeRequired: boolean,
 *   mobileSmokeRequired: boolean,
 *   reducedMotionRequired: boolean,
 *   visualCheckpointsImplemented?: boolean,
 *   runtimeMotionProbesImplemented?: boolean,
 *   expectedCurrentSceneAfterIntro?: string,
 *   expectedIntroCompleteValue?: string,
 *   browserScenarios?: Array<Record<string, unknown>>
 * },
 * assetBudgets?: Record<string, { warnBytes: number, failBytes: number }>,
 * buildOutput?: {
 *   required: boolean,
 *   absoluteBudgets: Record<string, { warnBytes: number, failBytes: number }>,
 *   growthBudgets: Record<string, { warnBytes: number, failBytes: number }>,
 *   baseline: Record<string, number>
 * },
 * assetExceptions: Array<{ path: string, reason: string, owner: string, createdAt: string, reviewBy: string }>,
 * temporaryWaivers: Array<{ id: string, reason: string, owner: string, createdAt: string, reviewBy: string }>
 * }} */
const repoState = JSON.parse(readFileSync(repoStatePath, "utf8"));

const failures = [];
const validSceneStatuses = new Set(["planned", "partial", "implemented"]);
const expectedScenes = ["introReveal", "heroComposition", "freshnessTransition"];
const packageJson = JSON.parse(readFileSync(path.join(repoRoot, "package.json"), "utf8"));
const packageScripts = packageJson.scripts || {};

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

assert(typeof repoState.phase === "string" && repoState.phase.length > 0, "phase must be a non-empty string");
assert(repoState.scenes && typeof repoState.scenes === "object", "scenes must be present");
assert(repoState.verification && typeof repoState.verification === "object", "verification must be present");
assert(repoState.assetBudgets && typeof repoState.assetBudgets === "object", "assetBudgets must be present");
assert(repoState.buildOutput && typeof repoState.buildOutput === "object", "buildOutput must be present");
assert(Array.isArray(repoState.assetExceptions), "assetExceptions must be an array");
assert(Array.isArray(repoState.temporaryWaivers), "temporaryWaivers must be an array");

for (const sceneName of expectedScenes) {
  assert(Boolean(repoState.scenes?.[sceneName]), `missing scene entry for ${sceneName}`);
}

for (const [sceneName, sceneConfig] of Object.entries(repoState.scenes || {})) {
  assert(
    typeof sceneConfig?.status === "string" && validSceneStatuses.has(sceneConfig.status),
    `scene '${sceneName}' must use one of: planned, partial, implemented`
  );
}

const requiredCommands = repoState.verification?.requiredCommands;
assert(Array.isArray(requiredCommands), "verification.requiredCommands must be an array");

for (const commandName of requiredCommands || []) {
  assert(Boolean(packageScripts[commandName]), `required command '${commandName}' is missing from package.json scripts`);
}

for (const booleanKey of [
  "browserSmokeImplemented",
  "desktopSmokeRequired",
  "mobileSmokeRequired",
  "reducedMotionRequired"
]) {
  assert(
    typeof repoState.verification?.[booleanKey] === "boolean",
    `verification.${booleanKey} must be a boolean`
  );
}

for (const optionalBooleanKey of [
  "visualCheckpointsImplemented",
  "runtimeMotionProbesImplemented"
]) {
  const value = repoState.verification?.[optionalBooleanKey];
  if (value !== undefined) {
    assert(typeof value === "boolean", `verification.${optionalBooleanKey} must be a boolean when present`);
  }
}

assert(
  typeof repoState.verification?.expectedCurrentSceneAfterIntro === "string",
  "verification.expectedCurrentSceneAfterIntro must be a string"
);
assert(
  typeof repoState.verification?.expectedIntroCompleteValue === "string",
  "verification.expectedIntroCompleteValue must be a string"
);
assert(
  Array.isArray(repoState.verification?.browserScenarios) && repoState.verification.browserScenarios.length > 0,
  "verification.browserScenarios must be a non-empty array"
);

for (const scenario of repoState.verification?.browserScenarios || []) {
  assert(typeof scenario.name === "string" && scenario.name.length > 0, "each browser scenario must have a name");
  assert(
    typeof scenario.viewport?.width === "number" && typeof scenario.viewport?.height === "number",
    `browser scenario '${scenario.name ?? "unknown"}' must have numeric viewport width/height`
  );
  assert(
    typeof scenario.expectedMotionProfile === "string",
    `browser scenario '${scenario.name ?? "unknown"}' must define expectedMotionProfile`
  );
  assert(
    typeof scenario.timeoutMs === "number" &&
      typeof scenario.maxCls === "number" &&
      typeof scenario.maxLongestLongTaskMs === "number",
    `browser scenario '${scenario.name ?? "unknown"}' must define timeout and runtime thresholds`
  );
}

for (const assetClass of ["primary", "secondary", "tertiary"]) {
  const budget = repoState.assetBudgets?.[assetClass];
  assert(Boolean(budget), `assetBudgets.${assetClass} must be present`);
  assert(
    typeof budget?.warnBytes === "number" && typeof budget?.failBytes === "number",
    `assetBudgets.${assetClass} must include numeric warnBytes and failBytes`
  );
  assert(
    typeof budget?.warnBytes === "number" &&
      typeof budget?.failBytes === "number" &&
      budget.warnBytes < budget.failBytes,
    `assetBudgets.${assetClass} warnBytes must be less than failBytes`
  );
}

assert(typeof repoState.buildOutput?.required === "boolean", "buildOutput.required must be a boolean");

for (const budgetGroup of ["absoluteBudgets", "growthBudgets"]) {
  assert(
    repoState.buildOutput?.[budgetGroup] && typeof repoState.buildOutput[budgetGroup] === "object",
    `buildOutput.${budgetGroup} must be present`
  );

  for (const metricName of ["totalBytes", "jsBytes", "cssBytes", "mediaBytes"]) {
    const budget = repoState.buildOutput?.[budgetGroup]?.[metricName];
    assert(Boolean(budget), `buildOutput.${budgetGroup}.${metricName} must be present`);
    assert(
      typeof budget?.warnBytes === "number" && typeof budget?.failBytes === "number",
      `buildOutput.${budgetGroup}.${metricName} must include numeric warnBytes and failBytes`
    );
    assert(
      typeof budget?.warnBytes === "number" &&
        typeof budget?.failBytes === "number" &&
        budget.warnBytes < budget.failBytes,
      `buildOutput.${budgetGroup}.${metricName} warnBytes must be less than failBytes`
    );
  }
}

assert(
  repoState.buildOutput?.baseline && typeof repoState.buildOutput.baseline === "object",
  "buildOutput.baseline must be present"
);

for (const metricName of ["totalBytes", "jsBytes", "cssBytes", "mediaBytes", "htmlBytes", "fileCount"]) {
  assert(
    typeof repoState.buildOutput?.baseline?.[metricName] === "number",
    `buildOutput.baseline.${metricName} must be numeric`
  );
}

for (const assetException of repoState.assetExceptions) {
  for (const fieldName of ["path", "reason", "owner", "createdAt", "reviewBy"]) {
    assert(
      typeof assetException?.[fieldName] === "string" && assetException[fieldName].length > 0,
      `asset exception entries must include non-empty ${fieldName}`
    );
  }
}

for (const waiver of repoState.temporaryWaivers) {
  for (const fieldName of ["id", "reason", "owner", "createdAt", "reviewBy"]) {
    assert(
      typeof waiver?.[fieldName] === "string" && waiver[fieldName].length > 0,
      `temporary waiver entries must include non-empty ${fieldName}`
    );
  }
}

if (repoState.verification?.browserSmokeImplemented === false) {
  assert(
    !("verify:browser" in packageScripts),
    "verify:browser should not be declared as implemented while repo-state says browser smoke is false"
  );
} else {
  assert(
    Boolean(packageScripts["verify:browser"]),
    "verify:browser must exist when repo-state says browser smoke is implemented"
  );
}

if (repoState.buildOutput?.required === false) {
  assert(
    !("verify:build-output" in packageScripts),
    "verify:build-output should not be declared as implemented while repo-state says build output tracking is false"
  );
} else {
  assert(
    Boolean(packageScripts["verify:build-output"]),
    "verify:build-output must exist when repo-state says build output tracking is required"
  );
}

if (failures.length > 0) {
  console.error("[verify:repo-state] Repo state validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("[verify:repo-state] docs/repo-state.json is internally consistent.");
