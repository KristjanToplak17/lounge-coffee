import { describe, expect, it } from "vitest";
import { heroRevealMotion } from "../../src/utils/heroRevealMotion";

describe("heroRevealMotion", () => {
  it("keeps the baked loader handoff duration stable", () => {
    expect(heroRevealMotion.durationSeconds).toBe(1.6);
  });

  it("keeps the baked loader handoff easing stable", () => {
    expect(heroRevealMotion.ease).toBe("cubic-bezier(0.23, 1, 0.32, 1)");
  });
});
