import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoStatePath = path.join(process.cwd(), "docs", "repo-state.json");
const repoState = JSON.parse(readFileSync(repoStatePath, "utf8"));

describe("repo-state", () => {
  it("tracks the current build-output phase", () => {
    expect(repoState.phase).toBe("phase_7_build_output_tracking");
  });

  it("declares browser smoke and motion quality guards as implemented", () => {
    expect(repoState.verification.browserSmokeImplemented).toBe(true);
    expect(repoState.verification.visualCheckpointsImplemented).toBe(true);
    expect(repoState.verification.runtimeMotionProbesImplemented).toBe(true);
  });

  it("defines at least one browser scenario", () => {
    expect(Array.isArray(repoState.verification.browserScenarios)).toBe(true);
    expect(repoState.verification.browserScenarios.length).toBeGreaterThan(0);
  });

  it("defines build output budgets and a baseline snapshot", () => {
    expect(repoState.buildOutput.required).toBe(true);
    expect(repoState.buildOutput.absoluteBudgets.totalBytes.failBytes).toBeGreaterThan(
      repoState.buildOutput.absoluteBudgets.totalBytes.warnBytes
    );
    expect(repoState.buildOutput.growthBudgets.totalBytes.failBytes).toBeGreaterThan(
      repoState.buildOutput.growthBudgets.totalBytes.warnBytes
    );
    expect(repoState.buildOutput.baseline.totalBytes).toBeGreaterThan(0);
  });
});
