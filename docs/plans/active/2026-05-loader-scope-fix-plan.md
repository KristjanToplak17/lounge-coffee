# Loader Scope Fix Plan

## Purpose

This plan covers only the current loader / reveal defects reported on `2026-05-04`.

It does not approve:

- hero redesign
- asset swaps outside the current loader system
- architecture changes beyond the intro loader stack

The goal is to fix the current loader so it behaves like one coherent orange cover that opens into the cream destination without gutters, ghost seams, or inconsistent bean reads.

## Audit Findings

### 1. Left and right reveal panels do not fully cover the viewport

Observed on wide desktop:

- visible lighter vertical gutters remain at far left and far right
- the panel field does not truly extend edge-to-edge
- the panel rectangles are still readable behind the bean zone

Root cause:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js) computes group width from viewport-center math plus a limited `edgeOverscanPx`
- panel asset width remains fixed to the baked image width, so wide screens expose the panel bounds
- [`src/scenes/IntroReveal/IntroReveal.css`](../../../src/scenes/IntroReveal/IntroReveal.css) uses a solid orange scene background that does not exactly hide panel bounds once the panel field opacity/lightness differs from the root

### 2. Central overlap / lower-opacity seam band is still visible

Observed at `start`, `mid`, and live playback:

- a lower-opacity orange band is visible through the center column
- the seam band remains visible even when the bean should read closed

Root cause:

- the current reveal panels are always visible and overlap in the center zone
- the underlay timing in [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js) begins while the orange panel world is still visually present
- the split-scene background and panel orange are too close but not identical in visual density, so overlap reads as a translucent strip instead of a clean closure

### 3. `startToMid` easing is too abrupt at arrival

Observed in live motion:

- the opening decelerates too hard at the end of the phase
- the groups feel like they stop instead of settle

Root cause:

- `startToMid` currently uses `cubic-bezier(0.5, 0, 0.2, 1)` for both group motion and fragments
- there is no secondary easing split between the initial release and the final settle
- the hold begins immediately after the main motion without enough visual glide

### 4. Leaf shadows are not anchored to the corners strongly enough

Observed at `start`:

- top-right shadow floats too far inward
- bottom-left shadow reads like a clipped overlay block rather than a corner atmosphere element

Root cause:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js) uses large shadow boxes positioned off panel-local coordinates instead of true corner anchoring
- the current panel-bound positioning makes the shadows inherit the same rectangular field problem as the reveal panels

### 5. Bean read at `start` and hold is still not fully consistent

Observed between `start` and `mid` / hold:

- the closed bean still reads fuller than the opened halves
- the opened halves feel like slightly different crops rather than the same object separating

Root cause:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js) `fractureClip.left/right` polygons are not yet the tightest complementary pair
- the bean is still clipped from the same full raster but the visual seam width changes too much between the closed and open states
- the panel crack and the bean crack are visually close but not yet matched enough to hide the transition fully

### 6. `midToEnd` scale-up is not strong enough relative to travel

Observed in live motion:

- travel is readable
- scale-up is present but not dramatic enough to feel tied to the acceleration

Root cause:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js) `groups.*.end.scale` values are larger than before, but the visual mass increase is still not dominant enough compared to horizontal travel
- end-state motion is still reading more as lateral exit than as a scale-and-surge reveal

### 7. The opening reveals orange instead of the cream destination

Observed at `mid` and live playback:

- the screen opens into orange-on-orange instead of clearly revealing the cream underlay
- the destination world is visually delayed and too weak

Root cause:

- the reveal panels are still occupying too much of the center visual field during `startToMid` and `mid`
- the underlay is present, but its visibility is suppressed by the panel/world overlap and center banding
- the loader is still visually reading as one orange layer opening inside another orange layer instead of orange opening into cream

## Scope-Locked Fix Plan

### Phase 1. Coverage and layer cleanup

Files:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)
- [`src/scenes/IntroReveal/IntroReveal.css`](../../../src/scenes/IntroReveal/IntroReveal.css)

Work:

- replace current edge-coverage math with stronger overscan per breakpoint
- ensure left and right panel fields cover beyond viewport edges at `start`, `mid`, and early live frames
- remove the readable center overlap band by solving panel closure and field opacity together
- make root scene orange and panel orange visually identical where they must visually merge

Acceptance:

- no visible left gutter
- no visible right gutter
- no visible lower-opacity center strip at `start`

### Phase 2. Shadow anchoring pass

Files:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)

Work:

- reposition top-right shadow so it is truly corner-anchored
- reposition bottom-left shadow so it reads intentional and corner-born
- reduce any block-read caused by panel-local placement

Acceptance:

- top-right shadow feels attached to the corner
- bottom-left shadow no longer looks like a floating square

### Phase 3. `startToMid` easing refinement

Files:

- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)
- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)

Work:

- retune `startToMid` to a softer settle with clearer ease-in/ease-out behavior
- preserve the same bucket structure and broad duration
- if needed, split group motion and fragment motion easing so fragments do not hard-stop with the groups

Acceptance:

- opening begins decisively
- motion settles with visible deceleration instead of abrupt stop

### Phase 4. Bean/parity tightening

Files:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)
- [`src/scenes/IntroReveal/IntroReveal.jsx`](../../../src/scenes/IntroReveal/IntroReveal.jsx)

Work:

- tighten the complementary fracture clips
- reduce the visual delta between the closed bean and the hold/opened halves
- keep the bean looking like the same object through `start`, `mid`, and hold

Acceptance:

- closed bean and opened halves feel like one object separating
- no obvious crop mismatch at top/bottom or seam width shift

### Phase 5. `midToEnd` scale-and-surge pass

Files:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)
- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)

Work:

- increase end-state scale substantially relative to current travel
- keep scale growth tied to lateral travel so the exit feels like a surge, not a slide
- preserve clean offscreen exit

Acceptance:

- `midToEnd` reads as bigger and more cinematic than current
- scale increase is clearly felt, not just implied

### Phase 6. Reveal-destination cleanup

Files:

- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)
- [`src/scenes/IntroReveal/IntroReveal.css`](../../../src/scenes/IntroReveal/IntroReveal.css)
- [`src/styles/layout.css`](../../../src/styles/layout.css)

Work:

- strengthen the cream underlay read during the opening
- remove the orange-in-orange effect during `mid`
- ensure the reveal opens into the hero background field, not a semi-transparent orange column

Acceptance:

- the opening clearly reveals cream
- `mid` no longer looks like orange panels opening over another orange surface

## Verification Frames

Must review:

1. `?introDebug=start`
2. `?introDebug=mid`
3. `?introDebug=end`
4. live frame during first split
5. live frame at hold
6. live frame during `midToEnd`

Required widths:

- `1910x901`
- `1440x900`
- `390x844`

## Definition Of Done

This pass is complete only when:

- no side gutters are visible
- no center overlap band is visible at rest
- `startToMid` settles cleanly
- shadows feel corner-anchored
- bean read is tighter between closed and opened states
- `midToEnd` scale-up is materially stronger
- cream destination is clearly visible during the opening

