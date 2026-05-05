# Production Cleanup Plan

## 1. Current production architecture

- `src/App.jsx` currently makes `BakedIntroReveal` the default loader for `/`.
- `src/App.jsx` still keeps the old `IntroReveal` as a temporary rollback path behind `?loader=old`.
- `src/App.jsx` still keeps `/test` wired to `TestRevealExperiment` when `window.location.pathname === "/test"`.
- `HeroComposition` stays mounted behind the loader at all times, and `App.jsx` owns the top-level `introComplete` flag.
- `App.jsx` passes `onHeroRevealStart` and `onComplete` into the active loader.
- In the baked path, `onHeroRevealStart` triggers `heroRevealRef.current?.playReveal()`, which starts the hero GSAP reveal timeline during baked `midToEnd`.
- `onComplete` is still final-only and flips `introComplete` to `true`, which unmounts the loader after the handoff is already underway.
- `HeroComposition` still derives its reveal duration and ease from `motionConfig.loader`, even though `BakedIntroReveal` now owns its own internal timing constants. That shared timing dependency must be treated as a protected handoff contract during cleanup.
- Old loader rollback still exists in code and still pulls in the old loader scene, timeline, geometry, and preload assets when `?loader=old` is used.
- `/test` still exists and still uses `TestRevealExperiment` plus `assets/test/*`.

## 2. Cleanup goals

- Reduce bundle size and media size so `verify:build-output` can pass again.
- Remove obsolete old-loader code once rollback is no longer needed.
- Remove obsolete old-loader assets and default preload cost once the old path is retired.
- Keep `BakedIntroReveal` stable as the production loader.
- Preserve hero mounting, hero reveal timing, and hero final layout exactly.
- Make the repository easier to understand by removing duplicate loader architectures and stale docs.

## 3. Strict non-goals

- Do not redesign the baked loader.
- Do not change baked loader geometry.
- Do not change baked panel or bean positions.
- Do not change hero final layout.
- Do not change hero animation timing unless an explicit follow-up requires it.
- Do not touch Supabase, env files, secrets, or deployment credentials.
- Do not change unrelated UI or scene behavior.
- Do not update build-output budgets before cleanup and optimization are attempted.

## 4. Reference inventory

| item | current references | production usage | cleanup classification | notes |
| --- | --- | --- | --- | --- |
| `src/App.jsx` baked loader branch | `src/App.jsx` | active production | keep | Owns loader selection, preload routing, hero handoff wiring, and `/test` route. |
| `src/scenes/BakedIntroReveal/BakedIntroReveal.jsx` | imported by `src/App.jsx` | active production | keep | Current production loader implementation. |
| `src/scenes/BakedIntroReveal/BakedIntroReveal.css` | imported by `BakedIntroReveal.jsx` | active production | keep | Production baked loader styles. |
| `src/scenes/HeroComposition/*` | `src/App.jsx`, `src/animations/heroCompositionTimeline.js` | active production | do not touch | Highest-risk sync surface. |
| `src/animations/heroCompositionTimeline.js` | `HeroComposition.jsx` | active production | keep | Still reads `motionConfig.loader` for hero reveal duration/ease, so it is part of the loader-to-hero handoff contract. |
| `src/scenes/IntroReveal/IntroReveal.jsx` | `src/App.jsx` via `?loader=old` | rollback only | safe to remove later | Delete only after rollback is removed and a final reference check passes. |
| `src/scenes/IntroReveal/IntroReveal.css` | `IntroReveal.jsx` | rollback only | safe to remove later | Same dependency boundary as old scene component. |
| `src/animations/introRevealTimeline.js` | `IntroReveal.jsx` | rollback only | safe to remove later | Delete only after old loader scene is removed. |
| `src/utils/motionConfig.js` | `heroCompositionTimeline.js`, `IntroReveal.jsx`, `introRevealTimeline.js`, docs | shared | maybe remove after extra check | High risk. Cannot be deleted or heavily pruned until hero timing/easing dependencies are moved elsewhere and handoff parity is re-verified. |
| `getIntroRevealGeometry` export | `IntroReveal.jsx` | rollback only | maybe remove after extra check | Remove only after old loader code is removed and `motionConfig.js` is refactored. |
| `REVEAL_SIDES` export | `IntroReveal.jsx`, `introRevealTimeline.js` | rollback only | maybe remove after extra check | Same note as `getIntroRevealGeometry`. |
| `assetMap.revealPanels` | `src/App.jsx`, `src/utils/assetMap.js` | rollback preload only | safe to remove later | Removing the `?loader=old` branch alone is not enough; the shared `assetMap` import must also be refactored or the old panel assets will still be bundled. |
| `assetMap.beans.full` | `src/App.jsx`, `IntroReveal.jsx`, `assetMap.js` | rollback only | safe to remove later | Large media cost and likely top cleanup win, but it will stay in the bundle until the shared `assetMap` import path is cleaned up. |
| `assets/revealBackground/*` | `assetMap.js`, docs/plans | rollback only in code | maybe remove after extra check | These assets remain emitted today because `assetMap.js` statically imports them. Remove code references first; then delete only after doc review and asset check. |
| `assets/coffeeBean/coffeeBean-full.webp` | `assetMap.js`, `IntroReveal.jsx`, `App.jsx` preload | rollback only | safe to remove later | Largest obvious obsolete production media candidate after rollback removal. |
| `assets/test/left-reveal.svg` | `App.jsx`, `BakedIntroReveal.jsx`, `TestRevealExperiment.jsx` | active production and `/test` | move/rename later | Production loader currently depends on a file under a test folder. Any move must include manual `/test` verification because `/test` duplicates production geometry/timing logic. |
| `assets/test/right-reveal.svg` | same as above | active production and `/test` | move/rename later | Same as above. |
| `assets/test/coffeeBean-left.webp` | same as above | active production and `/test` | move/rename later | Same bytes as `assets/coffeeBean/coffeeBean-left.webp`; likely organization and dedupe opportunity, but do not assume both source locations are doubling emitted media today. |
| `assets/test/coffeeBean-right.webp` | same as above | active production and `/test` | move/rename later | Same bytes as `assets/coffeeBean/coffeeBean-right.webp`; likely organization and dedupe opportunity, but do not assume both source locations are doubling emitted media today. |
| `src/scenes/TestRevealExperiment/TestRevealExperiment.jsx` | `src/App.jsx` `/test` route | test-only | maybe remove after extra check | Keep while baked loader still benefits from isolated experiment coverage. |
| `src/scenes/TestRevealExperiment/TestRevealExperiment.css` | imported by test scene | test-only | maybe remove after extra check | Pair with `/test` decision. |
| `assetMap.beanFragments.left/right` | `BakedIntroReveal.jsx`, `TestRevealExperiment.jsx`, `IntroReveal.jsx`, `App.jsx` preloads | shared | keep | Shared by old, baked, and `/test`. |
| `assetMap.shadows.coffeeLeaf` | `BakedIntroReveal.jsx`, `TestRevealExperiment.jsx`, `IntroReveal.jsx`, `App.jsx` preloads | shared | keep | Shared atmospheric asset. |
| `assetMap.logos.light/dark` | loader and hero | shared | keep | Used by production baked loader and hero. |
| `loader=old` query support | `src/App.jsx` | temporary rollback | maybe remove after extra check | Remove only after baked production verification is signed off. |
| baked fallback loader selection | `src/App.jsx` | active production | keep | There is no separate `loader=baked` branch in code; baked is the fallback for anything not equal to `old`. |
| `introDebug` query support in baked loader | `BakedIntroReveal.jsx` | active debug surface | keep | Required current debug path. |
| `docs/app-architecture.md` intro ownership section | docs only | outdated prose | maybe remove after extra check | Still describes `IntroReveal` as the intro owner. |
| `docs/repo-state.json` `introReveal` scene status | docs/scripts | structured verifier input | do not touch | Script consumers still require the `introReveal` key today. Any rename or ownership update must happen in the same pass as verifier updates. |
| loader polish / older active plan docs referencing old loader files | docs only | outdated or historical | maybe remove after extra check | Some should be moved to completed, some updated, some kept as history. |

## 5. Old loader cleanup candidates

### `src/scenes/IntroReveal/IntroReveal.jsx`

- Current references:
  - imported by `src/App.jsx`
  - imports `introRevealTimeline`, `getIntroRevealGeometry`, `REVEAL_SIDES`, `assetMap.beans.full`, `assetMap.beanFragments`, `assetMap.shadows`
- Why it might be obsolete:
  - production default now uses `BakedIntroReveal`
  - this scene exists only for `?loader=old`
- Deletion risk:
  - medium
  - removing too early would break rollback and could break any temporary smoke paths that still expect the old loader query
- Required pre-delete check:
  - confirm `?loader=old` is intentionally retired
  - confirm `App.jsx` no longer imports it
  - run full verification after removing rollback wiring

### `src/scenes/IntroReveal/IntroReveal.css`

- Current references:
  - imported only by `src/scenes/IntroReveal/IntroReveal.jsx`
- Why it might be obsolete:
  - tied directly to the old loader DOM
- Deletion risk:
  - low to medium
- Required pre-delete check:
  - confirm `IntroReveal.jsx` is gone
  - confirm no docs/tests/scripts still inspect old class names

### `src/animations/introRevealTimeline.js`

- Current references:
  - imported only by `IntroReveal.jsx`
- Why it might be obsolete:
  - old loader choreography owner
- Deletion risk:
  - medium
  - historical docs and plans still refer to it heavily
- Required pre-delete check:
  - confirm `IntroReveal.jsx` is gone
  - confirm no verification or docs tooling imports it

### `src/utils/motionConfig.js`

- Current references:
  - `src/animations/heroCompositionTimeline.js`
  - `src/scenes/IntroReveal/IntroReveal.jsx`
  - `src/animations/introRevealTimeline.js`
  - multiple docs and plans
- Why it might be partially obsolete:
  - large portions are old-loader geometry and choreography
  - baked loader no longer reads this file directly
- Deletion risk:
  - high
  - hero still uses `motionConfig.loader.timingsMs.midToEnd` and `motionConfig.loader.easing.midToEnd`
- Required pre-delete check:
  - do not delete outright
  - freeze the baked-loader-to-hero handoff contract before touching this file
  - first refactor hero timing/easing to a new shared baked-safe config home
  - only then remove old-loader-only exports such as `getIntroRevealGeometry`, `REVEAL_SIDES`, fracture clip data, and old group geometry

### Old full bean asset: `assets/coffeeBean/coffeeBean-full.webp`

- Current references:
  - `src/utils/assetMap.js`
  - `src/App.jsx` old preload list
  - `src/scenes/IntroReveal/IntroReveal.jsx`
- Why it might be obsolete:
  - baked production path uses split beans instead
  - old full bean is 1,963,036 bytes and likely the single biggest old-loader media cost
- Deletion risk:
  - low after rollback removal
- Required pre-delete check:
  - remove `assetMap.beans.full` references first
  - verify no docs or scripts require the file path

### Old reveal panel assets under `assets/revealBackground/`

- Files to evaluate:
  - `assets/revealBackground/left-reveal-baked.png`
  - `assets/revealBackground/right-reveal-baked.png`
  - `assets/revealBackground/left-reveal-baked.webp`
  - `assets/revealBackground/right-reveal-baked.webp`
  - `assets/revealBackground/left-reveal.svg`
  - `assets/revealBackground/right-reveal.svg`
- Current references:
  - `src/utils/assetMap.js` imports the baked PNG pair
  - docs and plans reference the folder and file names
- Why they might be obsolete:
  - active baked production loader does not import this folder
  - current production baked loader instead imports `assets/test/*`
- Deletion risk:
  - medium
  - docs and historical plan references are widespread
- Required pre-delete check:
  - remove `assetMap.revealPanels` and old preload usage first
  - search docs/plans for any intended future reference value
  - consider archiving or renaming instead of hard deletion if design provenance matters

### Old preload references in `src/App.jsx`

- Current references:
  - `INTRO_PRELOAD_SOURCES`
  - conditional loader preloading path
- Why they might be obsolete:
  - they exist only to support `?loader=old`
- Deletion risk:
  - low after rollback removal
- Required pre-delete check:
  - confirm old rollback path is intentionally removed
  - ensure baked preload list remains complete
  - note that removing this branch alone will not remove old loader media from `dist` while shared `assetMap` imports still reference old assets

### Old docs and plans that reference IntroReveal-era implementation

- Current references:
  - `docs/app-architecture.md`
  - `docs/loader-polish-spec.md`
  - `docs/hero-implementation-plan.md`
  - many files under `docs/plans/active/`
  - `docs/repo-state.json`
- Why they might be obsolete:
  - many still describe `IntroReveal` as production intro owner
- Deletion risk:
  - high if changed carelessly because docs and scripts rely on them
- Required pre-delete check:
  - separate canonical docs from historical plans
  - update `repo-state.json` and canonical docs first
  - only then archive or retire stale active plans

## 6. Baked loader keep list

- `src/scenes/BakedIntroReveal/BakedIntroReveal.jsx`
- `src/scenes/BakedIntroReveal/BakedIntroReveal.css`
- `src/scenes/HeroComposition/HeroComposition.jsx`
- `src/scenes/HeroComposition/HeroComposition.css`
- `src/animations/heroCompositionTimeline.js`
- `src/utils/usePrefersReducedMotion.js`
- `assetMap.logos.light`
- `assetMap.logos.dark`
- `assetMap.beanFragments.left`
- `assetMap.beanFragments.right`
- `assetMap.shadows.coffeeLeaf`
- baked split bean assets currently imported from `assets/test/coffeeBean-left.webp` and `assets/test/coffeeBean-right.webp`
- baked panel assets currently imported from `assets/test/left-reveal.svg` and `assets/test/right-reveal.svg`
- top-level `App.jsx` hero-handoff and `introComplete` wiring
- any future shared timing/easing config that hero and baked loader both need

## 7. `/test` prototype decision

- Recommendation:
  - keep `/test` temporarily through the first cleanup phase
  - do not delete it in the same pass as rollback removal
- Why:
  - it remains a useful isolated geometry and asset harness while the baked loader is still being normalized
  - it is also the current place where test-only HUD and controls live, which are intentionally absent from production
- Later options:
  - keep it as an internal QA harness
  - lazy-load it if bundle impact justifies the complexity
  - remove it only after baked production is stable and asset organization is cleaned up
- Manual verification rule while `/test` is kept:
  - any phase that moves baked assets or changes baked timing/config ownership must also manually verify `/test?state=start`, `/test?state=mid`, and `/test?state=end`
- Recommended phase:
  - decide after old-loader rollback removal and after baked assets are moved out of `assets/test`

## 8. Asset organization plan

- Current state:
  - production `BakedIntroReveal` imports production assets from `assets/test/*`
  - `/test` imports the same asset files
  - `assets/coffeeBean/coffeeBean-left.webp` and `assets/coffeeBean/coffeeBean-right.webp` appear to duplicate the bytes in `assets/test/coffeeBean-left.webp` and `assets/test/coffeeBean-right.webp`
- Recommendation:
  - keep current paths temporarily until rollback cleanup is done
  - then move baked production assets to a production-owned loader folder
- Proposed target paths:
  - `assets/loader/baked/left-reveal.svg`
  - `assets/loader/baked/right-reveal.svg`
  - `assets/loader/baked/coffeeBean-left.webp`
  - `assets/loader/baked/coffeeBean-right.webp`
- Later code touch points:
  - `src/scenes/BakedIntroReveal/BakedIntroReveal.jsx`
  - `src/scenes/TestRevealExperiment/TestRevealExperiment.jsx`
  - `src/App.jsx` baked preload imports
  - `src/utils/assetMap.js` only if the project chooses to centralize baked loader assets there
- Important note:
  - this is a move/rename phase, not an immediate delete phase

## 9. Build-output budget plan

- `verify:build-output` is likely failing because the bundle still contains both:
  - baked production media
  - old-loader rollback media and code
- Known large contributors visible from the current build and asset inventory:
  - `assets/coffeeBean/coffeeBean-full.webp` at 1,963,036 bytes
  - `assets/test/coffeeBean-right.webp` at 1,096,428 bytes
  - `assets/test/coffeeBean-left.webp` at 890,500 bytes
  - old loader code and CSS still shipping because `App.jsx` imports both loader implementations
- Confirmed emitted dead weight today:
  - `coffeeBean-full.webp`
  - `left-reveal-baked.png`
  - `right-reveal-baked.png`
  - these still appear in `dist` because `assetMap.js` statically imports them
- Additional likely contributors:
  - CSS growth from carrying both loader systems
  - shared module imports that keep old-loader media reachable even after runtime selection is removed
- Expected cleanup impact:
  - removing old loader rollback imports and preloads should reduce JS/CSS
  - isolating old-loader asset imports away from shared `assetMap` should produce the first reliable production bundle media drop
  - removing the old full bean should likely be the single biggest media reduction
  - cleaning baked asset paths may reduce confusion and may simplify later optimization work
- If cleanup is not enough:
  - optimize baked split bean assets first
  - evaluate whether duplicate source assets are actually both emitted
  - only update budgets if the final production asset set is intentionally larger and justified

## 10. Phased implementation plan

### Phase 0

Create a safe rollback snapshot and freeze the handoff contract before cleanup begins.

- Likely files touched:
  - none required for the audit itself
  - optional branch/commit only when implementation starts
- What must not be touched:
  - production UI behavior
  - loader timing
  - hero timing
- Verification steps:
  - capture the current expected behavior of `/`, `/?introDebug=start|mid|end`, and `/test?state=start|mid|end`
  - record that hero reveal must still start during baked `midToEnd`
- Rollback strategy:
  - create a dedicated cleanup branch or other explicit rollback snapshot before touching `App.jsx`, `assetMap.js`, `motionConfig.js`, or old intro files
  - do not rely only on an already-dirty worktree plus ad hoc Git restores

### Phase 1a

Remove old-loader runtime selection only after review.

- Likely files touched:
  - `src/App.jsx`
- What must not be touched:
  - `src/utils/assetMap.js`
  - `src/scenes/BakedIntroReveal/*`
  - `src/scenes/HeroComposition/*`
  - hero timing behavior
  - baked geometry
- Verification steps:
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `npm run verify`
  - manual `/`, `/?introDebug=start|mid|end`, reduced motion, 1440x900, 1024x800, 390x844
- Rollback strategy:
  - restore `?loader=old` branch and old preload list from Git if baked-only switch reveals a regression

### Phase 1b

Isolate old-loader asset imports away from shared `assetMap` so the production bundle can actually drop obsolete media.

- Likely files touched:
  - `src/utils/assetMap.js`
  - `src/App.jsx`
  - possibly a new old-loader-specific asset module if the implementation chooses that route
- What must not be touched:
  - `src/scenes/BakedIntroReveal/*`
  - `src/scenes/HeroComposition/*`
  - baked loader timing/geometry
- Verification steps:
  - confirm `dist` no longer emits old full bean or old reveal panel assets once rollback support is gone
  - rerun `npm run verify`
  - compare build-output deltas before and after
- Rollback strategy:
  - restore shared asset imports or the old-loader asset module if any active frontend path unexpectedly depended on them

### Phase 2

Delete old IntroReveal files and old-loader-only assets after reference checks.

- Likely files touched:
  - `src/scenes/IntroReveal/IntroReveal.jsx`
  - `src/scenes/IntroReveal/IntroReveal.css`
  - `src/animations/introRevealTimeline.js`
  - `assets/coffeeBean/coffeeBean-full.webp`
  - old reveal panel assets under `assets/revealBackground/`
- What must not be touched:
  - baked loader files
  - hero files
  - `src/utils/assetMap.js` shared baked/hero branches unless explicitly scoped
  - `src/utils/motionConfig.js` until the hero handoff timing source is deliberately handled
  - `/test` behavior in the same pass unless explicitly scoped
- Verification steps:
  - rerun full repo search for old imports
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `npm run verify`
- Rollback strategy:
  - restore deleted files from Git and re-enable rollback imports if hidden dependencies surface

### Phase 3

Move or rename baked assets from the test folder into a production loader folder if needed.

- Likely files touched:
  - `src/scenes/BakedIntroReveal/BakedIntroReveal.jsx`
  - `src/scenes/TestRevealExperiment/TestRevealExperiment.jsx`
  - `src/App.jsx` baked preload imports
  - possibly `src/utils/assetMap.js`
  - asset files moved from `assets/test/` to `assets/loader/baked/`
- What must not be touched:
  - loader geometry constants
  - hero motion logic
  - baked timing values
- Verification steps:
  - confirm `/` still renders baked loader exactly the same
  - confirm `/test?state=start`, `/test?state=mid`, and `/test?state=end` still render the same if `/test` is intentionally kept
  - rerun full verify
- Rollback strategy:
  - revert asset path changes and restore old file locations

### Phase 4

Update docs and structured repo state.

- Likely files touched:
  - `docs/app-architecture.md`
  - `docs/loader.md` if ownership wording is stale
  - `docs/loader-polish-spec.md` if it still treats old loader code as live implementation
  - `docs/repo-state.json`
  - selected files under `docs/plans/active/` or `docs/plans/completed/`
- What must not be touched:
  - production UI code
  - budgets unless cleanup is done and an explicit follow-up approves budget work
- Verification steps:
  - `npm run verify:docs`
  - `npm run verify:repo-state`
  - targeted repo search for stale production ownership language
- Rollback strategy:
  - revert doc-only changes separately from code if needed

### Phase 5

Optional remove or lazy-load `/test`.

- Likely files touched:
  - `src/App.jsx`
  - `src/scenes/TestRevealExperiment/TestRevealExperiment.jsx`
  - `src/scenes/TestRevealExperiment/TestRevealExperiment.css`
  - `assets/test/*` or their moved successors
- What must not be touched:
  - baked production loader
  - hero sync behavior
- Verification steps:
  - confirm `/` behavior is unchanged
  - confirm any kept QA route still works if retained
  - rerun full verify
- Rollback strategy:
  - restore `/test` route and scene if a dedicated QA harness is still needed

## 11. Verification checklist

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run verify`
- `/` uses baked loader by default
- `/?introDebug=start` works
- `/?introDebug=mid` works
- `/?introDebug=end` works
- hero reveal starts during baked `midToEnd`
- hero does not pop in after loader unmount
- hero final layout unchanged
- reduced motion works
- current wide monitor checked
- `1440x900` checked
- `1024x800` checked
- `390x844` checked

## 12. Execution prompt placeholder

Future implementation prompt will be written after this plan is reviewed and approved.
