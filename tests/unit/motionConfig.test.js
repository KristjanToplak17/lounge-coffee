import { describe, expect, it } from "vitest";
import { getLoaderViewportTier } from "../../src/utils/motionConfig";

describe("getLoaderViewportTier", () => {
  it("returns mobile at or below the mobile breakpoint", () => {
    expect(getLoaderViewportTier(720)).toBe("mobile");
    expect(getLoaderViewportTier(400)).toBe("mobile");
  });

  it("returns compact above mobile and at or below compact breakpoint", () => {
    expect(getLoaderViewportTier(721)).toBe("compact");
    expect(getLoaderViewportTier(1120)).toBe("compact");
  });

  it("returns desktop above the compact breakpoint", () => {
    expect(getLoaderViewportTier(1121)).toBe("desktop");
  });
});
