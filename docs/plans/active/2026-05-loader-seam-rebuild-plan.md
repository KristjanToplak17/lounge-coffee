# Loader Seam Rebuild Plan v2

## Purpose

This plan defines the execution path for eliminating intro-loader seam flicker and rebuilding the crack-to-bean relationship so the reveal reads as one persistent, physically connected split system.

This is a loader-only plan.

It is intentionally narrow:

- intro loader / reveal only
- no hero redesign
- no new animation libraries
- no broad architecture refactor outside the intro scene

Important scope note:

- this plan does **not** claim full loader-polish completion from [`docs/loader-polish-spec.md`](../../loader-polish-spec.md)
- the weak reveal destination remains a separate polish item outside this seam-rebuild pass
- this plan is complete when seam continuity, start-state stability, and split onset quality are fixed

## Canonical Dependencies

This plan is subordinate to:

- [`docs/loader-refinement-plan.md`](../../loader-refinement-plan.md)
- [`docs/loader.md`](../../loader.md)
- [`docs/loader-polish-spec.md`](../../loader-polish-spec.md)
- [`docs/motion-system.md`](../../motion-system.md)
- [`docs/app-architecture.md`](../../app-architecture.md)
- [`docs/asset-inventory.md`](../../asset-inventory.md)
- [`docs/repo-operations.md`](../../repo-operations.md)
- [`AGENTS.md`](../../../AGENTS.md)

If any conflict appears, the canonical docs above win unless updated in the same pass.

## Locked Decisions

- intro remains side-owned and group-first
- no full-bean swap or full-bean overlay may be used as the active reveal mechanism
- no center-owned crack system may be introduced
- the closed bean at `start` must be formed by the same persistent left/right system used during motion
- the seam source of truth for this plan is **baked edge-source assets**
- fallback to a traced shared master fracture path is allowed only if the baked-asset path fails the decision gate defined below
- switching seam strategy mid-implementation is not allowed without reopening this plan

## Problem Statement

The current intro still fails the premium illusion target because:

- the start frame and the split frame are not yet the same visual system
- the seam edge and bean edge are still only approximately related
- reveal onset still risks shimmer, double-edge reads, or representation-swap artifacts

The result is visually close, but not execution-safe for pixel-precise polish.

## Chosen Strategy

### Default path

Use baked left and right edge-source assets as the seam truth source.

These assets will define:

- the orange field at each side
- the crack edge silhouette
- the exact local relationship between reveal edge and bean-half edge

They do **not** flatten the entire reveal into one giant illustration.

The side-owned group model remains intact:

- left reveal group still owns left side motion
- right reveal group still owns right side motion
- fragments remain separate
- timing remains owned by the current React + GSAP system

### Baked-asset constraints

Baked assets may define the seam edge source, but they may not break the approved motion model.

Required constraints:

- left and right assets must be complementary exports from the same art source
- both assets must use the same export method and edge treatment
- no feathering may be baked into the seam edge
- no shadow blur may be baked into the seam edge
- no decorative texture mismatch may exist between left and right seam edges
- baked assets must preserve breakpoint-safe local bean alignment inside each reveal group
- baked assets must not turn the bean into a fully flattened poster composition that removes product-led child motion control

### Fallback decision gate

Fallback to a traced shared master fracture path is allowed only if **one or more** of the following happen during the asset truth pass:

1. baked seam edges introduce scaling artifacts at required review viewports
2. baked seam edges create visible anti-alias shimmer at first split frame
3. baked assets cannot preserve breakpoint-safe local bean seating
4. baked assets cause unacceptable asset-budget or build-output regressions

If fallback is triggered:

- stop implementation work
- record the trigger in the plan or follow-up notes
- reopen the seam strategy explicitly
- proceed only after the fallback path is restated as the new locked strategy

## Asset Workflow Contract

If the default baked-asset path is used, the implementation must produce a clear asset contract.

Required outputs:

- one left edge-source production asset
- one right edge-source production asset
- explicit file names under `assets/revealBackground/`
- documented export dimensions
- documented transparency behavior
- documented replacement or coexistence rule for current reveal assets

Rules:

- original seam assets must not be deleted until the new path passes verification
- asset names must clearly distinguish production edge-source assets from superseded prototypes
- any asset changes that materially affect source-of-truth usage must update [`docs/asset-inventory.md`](../../asset-inventory.md) in the same pass
- asset/build-output impact must be verified through the repo-standard verification path

## Seam Geometry Contract

The seam may be reviewed visually, but the plan must use explicit checkpoints so “looks close” does not pass.

### Required seam checkpoints

Check seam continuity at these vertical positions:

1. top shoulder
2. upper-mid
3. center
4. lower-mid
5. bottom taper

### Start-state tolerance

At `?introDebug=start` and the required review viewports:

- no visible cream opening is allowed at any checkpoint
- no visible orange slit is allowed between the left/right bean interior and the seam edge
- no gap or overlap larger than `1 CSS px` is allowed at practical review scale

### First-visible-split tolerance

At the first visible split frame:

- no visible double-edge may appear at any checkpoint
- no cream or orange sliver wider than `1 CSS px` may appear between bean edge and reveal edge
- left and right seam edges must remain complementary through the opening

### Coverage contract

At all required viewports:

- no side gutter may appear at `start`
- no corner sliver may appear at `mid`
- no accidental orange scrap may remain at `end`

## Baseline Capture Requirement

Before implementation begins, capture the current loader in:

- `start`
- `mid`
- `end`
- live desktop
- live mobile
- reduced-motion desktop
- reduced-motion mobile

These captures become the regression baseline for the seam rebuild.

## Execution Phases

## Phase 0: Baseline And Decision Gate

Goal:

- lock the seam path before code changes

Tasks:

1. Capture current baseline review frames and live runs.
2. Confirm the baked-asset path remains the locked default.
3. Define the production asset names and replacement/coexistence rule.
4. Confirm whether the current reveal SVGs are:
   - replaced, or
   - kept temporarily during verification

Exit criteria:

- baseline captures exist
- seam strategy is locked
- asset workflow is locked
- no code changes begin before this phase passes

## Phase 1: Asset Truth Pass

Goal:

- establish the seam source of truth using the baked-asset path

Tasks:

1. Build final left/right edge-source assets from one shared art source.
2. Verify that the seam profile matches the intended crack rhythm from the approved reference frames.
3. Keep left/right edge treatment identical.
4. Preserve product-led bean reading inside each side asset.

Deliverables:

- production left edge-source asset
- production right edge-source asset
- updated asset ownership note if the asset contract changes

Exit criteria:

- seam shape is no longer approximate
- left and right assets are complementary exports
- no fallback trigger has fired

## Phase 2: Geometry And Start-State Closure

Goal:

- solve local geometry and closed-start composition before deleting legacy closure behavior

Tasks:

1. Recompute seam anchors and local bean seating.
2. Recompute local fragment origin points relative to the locked seam.
3. Validate desktop, compact, and mobile geometry.
4. Only after geometry passes, remove the old full-bean closure mechanism.

Primary files:

- `src/utils/motionConfig.js`
- `src/scenes/IntroReveal/IntroReveal.jsx`
- `src/scenes/IntroReveal/IntroReveal.css`

Exit criteria:

- closed bean is formed by the persistent left/right system
- no separate full-bean closure mechanism remains
- seam contract passes at all required checkpoints

## Phase 3: Motion Handoff Cleanup

Goal:

- remove representation-swap artifacts from split onset

Tasks:

1. Audit all `startToMid` visibility and opacity changes.
2. Remove opacity transitions used only to disguise system handoff.
3. Preserve only storytelling opacity changes:
   - progress fade
   - logo fade
   - underlay reveal when needed
4. Confirm left and right groups begin moving directly and cleanly.

Primary file:

- `src/animations/introRevealTimeline.js`

Exit criteria:

- no visible shimmer at split onset
- no visible double-edge at first visible split frame
- left reads as one object moving left
- right reads as one object moving right

## Phase 4: Crack Character And Reference Match

Goal:

- align seam character to explicit reference frames, not generic intuition

Reference frames for this pass:

- `assets/revealInspiration/Reveal-1.png` for closed start posture
- `assets/revealInspiration/Reveal-7 (MID STATE).png` for mid opening width and seam rhythm
- `assets/revealInspiration/Reveal-10.png` for end-state taper / exit character

Tasks:

1. Compare frozen frames side by side against the three named references.
2. Tune:
   - top seam posture
   - center opening rhythm
   - lower-third break profile
   - end taper character
3. Keep the crack sharp and physical, not decorative.

Exit criteria:

- crack no longer reads as a generic zig-zag
- start, mid, and end seam posture follow the named references closely
- any remaining differences are documented as intentional art-direction deviations

## Phase 5: Final Motion And Reduced-Motion Parity

Goal:

- confirm the rebuilt seam system still behaves correctly across motion modes

Tasks:

1. Recheck `startToMid`, `midHold`, and `midToEnd`.
2. Verify fragment behavior remains supportive and seam-born.
3. Verify reduced-motion still preserves the same side-owned seam truth.
4. Verify debug states and browser markers still work after DOM/asset changes.

Primary files:

- `src/animations/introRevealTimeline.js`
- `src/utils/motionConfig.js`

Exit criteria:

- full-motion path passes
- reduced-motion path passes
- no timing compensation is hiding geometry defects

## File Ownership Map

Primary implementation files:

- `src/scenes/IntroReveal/IntroReveal.jsx`
- `src/scenes/IntroReveal/IntroReveal.css`
- `src/animations/introRevealTimeline.js`
- `src/utils/motionConfig.js`
- `src/utils/assetMap.js`

Primary asset files:

- `assets/revealBackground/*`

Reference files:

- `assets/revealInspiration/Reveal-1.png`
- `assets/revealInspiration/Reveal-7 (MID STATE).png`
- `assets/revealInspiration/Reveal-10.png`

## Verification Plan

### Required command path

Before claiming this work complete, run:

- `npm run verify`

At minimum this covers:

- build
- lint
- test
- docs verification
- repo-state verification
- asset verification
- build-output verification
- browser verification

### Required manual review

Required URLs:

- `http://127.0.0.1:4173/`
- `http://127.0.0.1:4173/?introDebug=start`
- `http://127.0.0.1:4173/?introDebug=mid`
- `http://127.0.0.1:4173/?introDebug=end`

Required viewports:

- desktop: `1440x900`
- compact: `1024x800`
- mobile: `390x844`

Required modes:

- default motion desktop
- default motion mobile
- reduced-motion desktop
- reduced-motion mobile

Required review captures:

1. `start`
2. `loaderFade`
3. just before crack onset
4. first visible split frame
5. `mid`
6. early `midToEnd`
7. `end`
8. live desktop run
9. live mobile run

Required playback review:

- normal speed
- slowed playback review for split onset

### Pass conditions

- no visible seam gap at `start`
- no visible orange or cream slit wider than `1 CSS px` at required checkpoints
- no visible double-edge at first visible split frame
- no browser-smoke regression
- no reduced-motion regression
- no asset-budget or build-output budget failure
- no corner scraps at `end`

## Risks

1. Baked seam edges may still create aliasing artifacts if export method is inconsistent.
2. Asset replacement can accidentally flatten the side-owned motion model if the asset contract is ignored.
3. Geometry may look correct in debug states but fail at live split onset if the first-visible-split frame is not reviewed explicitly.

## Rollback Path

If the baked-asset path fails after Phase 1 or Phase 2:

1. keep legacy assets in place until the new path passes verification
2. do not delete superseded seam assets before signoff
3. stop implementation and log which fallback trigger fired
4. reopen the plan and restate the traced shared-fracture path as the new locked strategy
5. if asset or build-output budgets require temporary exception handling, document that through the repo’s waiver process

## Stop Conditions

Pause and realign if any of the following happen:

- the seam strategy starts drifting back into a live fork
- start-state closure requires a new concealment trick
- baked assets begin flattening the bean into a panel illustration instead of a product-led child system
- seam quality improves in debug states but regresses in live motion
- baked assets introduce scaling artifacts across required breakpoints
- implementation begins drifting into hero redesign or unrelated loader concepts

## Definition Of Done

This seam-rebuild plan is complete when all of the following are true:

- the full-bean start plate is no longer used as the active reveal mechanism
- the closed bean at `start` is formed by the persistent left/right system
- seam contract passes at all required checkpoints and viewports
- no visible double-edge appears at the first visible split frame
- no browser-smoke, reduced-motion, asset-budget, or build-output regression is introduced
- start, mid, and end seam posture match the named reference frames closely enough that any remaining differences are documented as intentional art-direction deviations rather than geometry mismatches
