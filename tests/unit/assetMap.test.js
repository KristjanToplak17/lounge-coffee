import { describe, expect, it } from "vitest";
import { assetMap } from "../../src/utils/assetMap";

describe("assetMap", () => {
  it("exposes the required intro assets", () => {
    expect(assetMap.logos.dark).toBeTruthy();
    expect(assetMap.logos.light).toBeTruthy();
    expect(assetMap.revealPanels.left).toBeTruthy();
    expect(assetMap.revealPanels.right).toBeTruthy();
    expect(assetMap.beans.full).toBeTruthy();
  });

  it("keeps four fragments per reveal side", () => {
    expect(assetMap.beanFragments.left).toHaveLength(4);
    expect(assetMap.beanFragments.right).toHaveLength(4);
  });

  it("keeps all four cup variants available", () => {
    expect(Object.keys(assetMap.cups).sort()).toEqual(["black", "orange", "red", "yellow"]);
  });
});
