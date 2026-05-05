# Secret Sauce Section Implementation Plan

## 1. Current architecture audit

### Current top-level page structure

- `src/App.jsx` currently mounts only two production scene layers:
  - `HeroComposition`
  - `BakedIntroReveal` as an overlay while `introComplete === false`
- `HeroComposition` is mounted first so the baked loader can reveal directly into it.
- `BakedIntroReveal` calls `onHeroRevealStart` during its `midToEnd` phase, and `App.jsx` forwards that to `heroRevealRef.current.playReveal()`.
- `BakedIntroReveal` then calls `onComplete`, which flips `data-current-scene` from `intro` to `hero`.

### Loader-to-hero coupling that must not break

- The baked intro timing lives in `src/scenes/BakedIntroReveal/useBakedIntroAnimation.js`.
- The hero reveal is intentionally synchronized to the baked loader `midToEnd` label, not to `introComplete`.
- `HeroComposition` exposes only one imperative API today: `playReveal()`.
- Any future freshness or Secret Sauce work must preserve:
  - loader timing buckets
  - `midToEnd` callback timing
  - the current hero reveal animation duration/easing contract
  - the current static hero end composition

### How `HeroComposition` is structured

- `src/scenes/HeroComposition/HeroComposition.jsx` owns:
  - header chrome
  - stats block
  - copy/sticker block
  - cup stage
- Cups are rendered from a `heroCups` array into `.hero-composition__cup-stage`.
- Each cup has:
  - a motion wrapper, e.g. `.hero-composition__cup-motion--black`
  - a ground-shadow element
  - an image element, e.g. `.hero-composition__cup--black`

### Where the black cup lives

- The black cup uses `assetMap.cups.black`.
- The DOM owner is `HeroComposition`.
- The live black cup ref is `blackCupMotionRef`.
- The black cup is currently part of the hero-only cup stage, not a shared cross-scene layer.

### How hero final positions are controlled

- Final poster positions are primarily CSS-driven in `src/scenes/HeroComposition/HeroComposition.css`.
- The black cup desktop anchor is currently defined on `.hero-composition__cup-motion--black`.
- The image itself is `.hero-composition__cup--black`.
- Responsive overrides for the black cup are hardcoded across media queries.
- The image has `transform: rotate(0deg)` in CSS, so the live final hero state is upright in code even if the reference image visually feels slightly perspective-tilted.

### How hero reveal animation works today

- `src/animations/heroCompositionTimeline.js` creates a paused GSAP timeline.
- The black cup reveal animates from:
  - `x: -40`
  - `rotation: 8`
  - `opacity: 0`
- It resolves to:
  - `x: 0`
  - `y: 0`
  - `rotation: 0`
  - `opacity: 1`
- This means the current black cup reveal is a time-based entrance only. It is not scroll-linked.

### How the page currently handles sections below hero

- It does not yet handle them in production.
- `src/scenes/FreshnessTransition/` currently contains only `.gitkeep`.
- `src/styles/layout.css` makes `.app-shell` full-viewport and `overflow: hidden`.
- `HeroComposition.css` makes `.hero-composition` `position: absolute; inset: 0;`.
- Result:
  - there is no natural document scroll below the hero yet
  - a future below-hero section requires a page-flow wrapper change before any Secret Sauce section can actually appear

### Architectural implication for future implementation

- The safest future path is not to rewrite hero internals first.
- Instead:
  - keep the existing hero scene visually intact
  - introduce a new outer page-flow wrapper in `App.jsx`
  - place the existing hero inside a dedicated viewport-height shell
  - let the new Secret Sauce section live below that shell in normal flow
- This preserves the current hero layout while enabling real scroll.

### Source-of-truth reconciliation

- `Secret Sauce` should not be treated as a brand-new fourth scene.
- For implementation planning purposes, `Secret Sauce` is the proposed visual/content direction for the canonical first below-hero scene currently named `Freshness Transition`.
- That means the future implementation should align with the existing scene slot already reserved in:
  - `docs/scene-map.md`
  - `docs/motion-system.md`
  - `docs/app-architecture.md`
- Practical consequence:
  - do not implement both `FreshnessTransition` and `SecretSauceSection` as parallel production scenes
  - do not insert Secret Sauce before a separate future freshness scene
  - treat the Secret Sauce composition as the first freshness panel / first proof panel under hero
- If implementation is approved later, canonical docs should be updated in the same pass so the naming and behavior stay consistent.

## 2. Design requirements

### Section identity

- Scene name: `Secret Sauce`
- Placement: immediately below the hero in natural scroll flow
- Visual intent: continuation of the same cream, premium, editorial world

### Background

- Base feel should stay aligned with current cream stage, close to `#F0E8DC`
- Background should feel like a continuation of the hero, not a hard section break
- Soft haze/glow is allowed if it stays quieter than the black cup

### Top-left label

- Text: `Secret Sauce`
- Font: `Haas Grot Disp Trial`
- Target size: `28px`
- Letter spacing: `-0.5px`
- Color: `#351512`
- Placement: top-left with existing site margin logic

### Top-right label

- Text: `What's our secret?`
- Font: `Haas Grot Disp Trial`
- Weight/style: `55 Roman / Regular`
- Target size: `20px`
- Letter spacing: `-0.5px`
- Color: `#351512`
- Placement: top-right, right-aligned

### Main orange typography

- Font: `Haas Grot Disp Trial`
- Weight: `75 Bold`
- Color: `#E75B20`
- Desktop size target: `96px`
- Letter spacing: `-3px`
- Composition: oversized uppercase statement behind the black cup

### Desktop line composition

- Line 1:
  - `CRAFTED WITH`
  - inline image pill using `masked-cupOfCoffee.webp`
- Line 2:
  - `FRESH BEANS AND FRESHLY`
- Line 3:
  - inline image pill using `masked-croissant.webp`
  - `BAKED DELIGHTS`

### Image pills

- Required assets:
  - `masked-cupOfCoffee.webp`
  - `masked-croissant.webp`
- Desktop target size: `280px x 100px`
- Shape: large oval/pill mask
- Usage rule:
  - they should feel integrated into the type line rhythm
  - they should not overpower the black cup

### Sticker

- Required asset: `sticker-coffeePot`
- Placement target:
  - over or near `FRESHLY`
  - bridging toward `DELIGHTS`
- Rotation:
  - slight authored angle only
- Behavior:
  - integrated punctuation
  - never the primary focal point

### Black cup final section state

- The black cup should settle centered over the large orange type.
- It should sit visually above the orange type, pills, and sticker.
- It should scale to about `1.5x` relative to its hero size on desktop.
- It should end in a completely upright poster state.
- Because the live hero black cup is already upright in CSS, the future implementation should derive the actual start transform from the live DOM state rather than inventing extra hero rotation.

### Spacing and width

- Use the existing max-width logic direction around `1440px`.
- Respect current side spacing rather than introducing a different grid.
- Maintain enough top breathing room for the two labels before the cup enters center stage.

### Layering target

- background atmosphere at the back
- orange type behind the cup
- image pills integrated with the type layer
- sticker above the type/pills
- black cup above all section art layers

### Locked desktop composition targets

| Item | Locked target for `1440x900` review |
| --- | --- |
| Section role | First below-hero proof/freshness panel in natural scroll flow |
| Section min-height | `1120px` minimum, with enough lower breathing room that the centered cup never feels bottom-cramped |
| Content frame width | Use `--hero-stage-max-width` as the outer alignment rule |
| Content frame side padding | `42px` desktop inner padding to align with hero scene edge logic |
| Top padding to label row | `58px` from section start to label text baseline |
| Label row layout | Top-left label aligned to content frame left edge, top-right label aligned to content frame right edge |
| Jumbo text block width | Cap to about `1180px` inside the content frame so the statement reads as one authored field, not full-bleed text |
| Jumbo line gap | `0.88` to `0.92` line-height equivalent; keep it visually tight like a poster lockup |
| Cup final target center | Center point at roughly `50%` of frame width and `56%` of section height |
| Cup final rendered width | `470px` target on desktop, derived from the live hero cup but resolved to a fixed authored settled size |
| Cup overlap tolerance | The cup may cover the orange type, but at least `55%` of each major word should remain legible around it |
| Line 1 | `CRAFTED WITH` + coffee pill inline at the far right of the line |
| Line 2 | `FRESH BEANS AND FRESHLY` |
| Line 3 | croissant pill inline at the far left, then `BAKED DELIGHTS` |
| Pill size | `280px x 100px` |
| Pill baseline alignment | Pill vertical center should sit slightly above text midline so the pill reads embedded, not dropped below the line |
| Sticker zone | Bridge the end of `FRESHLY` and the start of `DELIGHTS`, never floating detached in open space |
| Sticker size | About `108px` to `124px` rendered width on desktop |
| Sticker rotation | Between `-12deg` and `-18deg`; do not use positive rotation on desktop |

### Atmosphere recipe

- The section should inherit the current hero world rather than invent a new background language.
- Reuse the same cream family anchored on `--color-cream-stage`.
- Preferred section atmosphere layers:
  - one soft left haze near the upper-left quadrant using `rgba(223, 193, 168, 0.18)` to `0.24`
  - one warm central glow behind the lower half of the cup using `rgba(238, 200, 138, 0.16)` to `0.22`
  - one very soft right-side falloff using `rgba(223, 193, 168, 0.14)` to `0.18`
- Blur limits:
  - haze blur should stay within roughly `70px` to `110px`
  - no hard-edged card shadows or decorative blobs
- Guardrail:
  - atmosphere must stay quieter than the hero atmosphere and must never compete with the cup silhouette or orange type field
- Visual continuity rule:
  - the section should feel like the hero's cream world continuing downward, not a separate poster pasted underneath it

### Asymmetry guardrail

- Even though the black cup lands centrally, the section must not become visually generic or perfectly symmetrical.
- Asymmetry should still come from:
  - the unequal pill positions
  - the right-shifted sticker punctuation
  - the slight imbalance between line starts/ends
  - the atmospheric weight distribution
- Review failure:
  - if the section reads like a fully centered marketing headline with a centered product, it has drifted away from the site's design system.

## 3. Asset inventory

| Asset | Expected path | Current path if found | Usage | Missing/present | Notes |
| --- | --- | --- | --- | --- | --- |
| Black cup | `assets/coffeeCups/coffeeCup-black.webp` | `assets/coffeeCups/coffeeCup-black.webp` | Hero source cup and future transition source | Present | Already exposed via `assetMap.cups.black` |
| Coffee image pill | `assets/supportingImages/masked-cupOfCoffee.webp` | `assets/supportingImages/masked-cupOfCoffee.webp` | Inline pill on line 1 | Present | On disk but not yet exposed in `src/utils/assetMap.js` |
| Croissant image pill | `assets/supportingImages/masked-croissant.webp` | `assets/supportingImages/masked-croissant.webp` | Inline pill on line 3 | Present | On disk but not yet exposed in `src/utils/assetMap.js` |
| Coffee pot sticker | `assets/stickers/sticker-coffeePot.webp` | `assets/stickers/sticker-coffeePot.webp` | Accent near `FRESHLY` / `DELIGHTS` | Present | On disk but not yet exposed in `src/utils/assetMap.js` |
| Mascot sticker | `assets/stickers/sticker-mascot.webp` | `assets/stickers/sticker-mascot.webp` | Existing hero-only sticker | Present | Useful only as current hero reference; not the Secret Sauce sticker |
| Cream section background | CSS token / atmosphere layers | Current hero cream tokens in `src/styles/tokens.css` | Section surface and haze | Present | Reuse current cream/orange/brown token family rather than inventing a new palette |

### Asset follow-up rule

- No new placeholder assets are needed for the plan.
- If future implementation needs asset-map exposure, the expected addition point is `src/utils/assetMap.js`.
- If any asset import name is normalized later, preserve current on-disk filenames and only alias them in code.

### Performance/loading direction

- The black cup asset should continue reusing the already-preloaded hero black cup source.
- The two supporting image pills and the coffee-pot sticker should be treated as below-the-fold assets and should not be added to the intro/hero preload group by default.
- If later profiling shows visible pop-in on very fast scroll, prefer targeted lazy-preload after hero reveal rather than broad eager preload during the loader.

## 4. Black cup scroll-transition strategy

### Option 1. True shared-element scroll animation using the existing hero black cup element

- Visual quality:
  - potentially excellent if perfectly executed
  - highest theoretical continuity because the same node moves
- Implementation complexity:
  - high
- Risk to hero layout:
  - high
  - the live black cup sits inside the hero composition's absolute poster layout
  - changing its positioning context for scroll can disturb the final hero poster
- Risk to responsiveness:
  - high
  - the black cup position is currently hardcoded per breakpoint in CSS
  - scroll takeover would need careful reconciliation with those rules
- Risk to loader/hero reveal:
  - high
  - the same node is already owned by the hero reveal timeline
  - scroll ownership added too early can conflict with the baked loader handoff
- Realistic smooth movement:
  - yes, but only if transform ownership is perfectly isolated
- Maintainability:
  - weak to medium
  - future hero edits can accidentally break the transition

### Option 2. Duplicate black cup in the Secret Sauce section with crossfade/opacity handoff

- Visual quality:
  - acceptable, but usually less convincing
  - risks reading as a swap instead of one premium object moving through space
- Implementation complexity:
  - low to medium
- Risk to hero layout:
  - low
- Risk to responsiveness:
  - medium
  - two cups must stay visually matched across breakpoints
- Risk to loader/hero reveal:
  - low
- Realistic smooth movement:
  - limited
  - crossfade can hide discontinuities but does not create true physical continuity
- Maintainability:
  - medium
  - simple structure, but visual mismatch risk remains

### Option 3. Dedicated floating black-cup transition layer controlled by scroll

- Visual quality:
  - high
  - can look convincingly continuous when seeded from the hero cup's live measured box
- Implementation complexity:
  - medium
- Risk to hero layout:
  - low to medium
  - the hero cup can remain visually static in its own scene
- Risk to responsiveness:
  - medium
  - requires resize/recalculate discipline, but it avoids rewriting hero layout rules
- Risk to loader/hero reveal:
  - low
  - the hero reveal can finish normally before the floating layer participates
- Realistic smooth movement:
  - yes
  - supports measured translation, scale, and rotation with scrubbed motion
- Maintainability:
  - high
  - transition logic becomes its own layer instead of being buried inside hero CSS

### Option 4. Section-only cup with no continuity logic

- Visual quality:
  - low
  - reads as a new object appearing after the hero
- Implementation complexity:
  - lowest
- Risk to hero layout:
  - lowest
- Risk to responsiveness:
  - low
- Risk to loader/hero reveal:
  - lowest
- Realistic smooth movement:
  - no
- Maintainability:
  - medium
  - structurally easy, visually underpowered

### Recommended approach

- Recommended: `Option 3`, a dedicated floating transition layer, with an optional late handoff to a static settled section cup only after the transition has essentially completed.

### Why it is best

- It protects the current hero static layout.
- It avoids attaching scroll ownership directly to a hero element already involved in loader-timed reveal choreography.
- It allows premium measured motion:
  - move from live hero cup bounds
  - scale to section poster size
  - resolve to upright section state
- It aligns with the repo architecture rule that scene components own their refs and animation modules receive explicit handoffs.

### What could break

- If the floating layer start rect is hardcoded instead of measured, breakpoint drift will appear.
- If the hero cup is hidden too early, the user will see a visual pop.
- If both hero cup and floating cup are visible for too long, the user will see double cups.
- If the floating layer uses document flow instead of a fixed overlay plane, scroll math can become unstable.

### How to avoid transform conflicts

- Do not animate `.hero-composition__cup--black` directly for the scroll transition.
- Do not reuse the hero reveal GSAP timeline for scroll.
- Future implementation should:
  - read the live hero black cup wrapper rect using `getBoundingClientRect()`
  - animate a separate overlay wrapper
  - keep hero reveal ownership inside `heroCompositionTimeline`
  - keep Secret Sauce scroll ownership inside a dedicated scroll timeline module
- If a static section cup is added for the settled end state, it should be a separate node with a very short late-stage opacity handoff.

### How to keep hero final state unchanged

- Keep the hero black cup CSS position rules as the poster truth.
- Keep hero reveal timeline output unchanged.
- Only sample the hero black cup's live box after reveal completion.
- Never rewrite hero breakpoint constants just to fit the Secret Sauce transition.

### How to keep section final state clean

- Treat the centered Secret Sauce cup as its own final target state.
- Use a section anchor ref for the final cup bounds.
- If a late handoff is used:
  - overlay cup fades out only near the last 5 to 10 percent of scrub progress
  - static section cup fades in only after near-perfect overlap

### Exact ownership contract

- `HeroComposition` future responsibility:
  - continue to own the live hero black cup DOM node
  - continue to own hero reveal timing
  - expose a read-only transition API, preferably through the existing imperative ref
- Recommended future hero imperative API additions:
  - `getBlackCupSourceMetrics()`
  - `isRevealSettled()`
- `FreshnessTransition` future responsibility:
  - own the settled target anchor ref for the final cup position
  - own the section DOM, labels, text field, pills, and sticker
  - own the transition-layer ref if the overlay DOM node is rendered within the section root
- `App.jsx` future responsibility:
  - own scene order and top-level ref wiring only
  - render the page-flow shells
  - pass explicit refs/handlers between hero and freshness-transition layers
  - not contain scroll math or animation choreography
- `src/animations/freshnessTransitionScroll.js` future responsibility:
  - receive explicit source metrics access, target refs, and overlay refs
  - build and own the ScrollTrigger lifecycle
  - not query scene DOM globally by selector

### Preferred overlay ownership model

- Preferred model:
  - `App.jsx` renders one top-level transition overlay host as composition infrastructure
  - `FreshnessTransition` owns the cup overlay ref passed into the animation module
  - `HeroComposition` only exposes source metrics and reveal-settled status
- Rationale:
  - this keeps cross-scene composition in `App`
  - keeps scene-specific refs in the owning scene
  - avoids DOM querying and avoids pushing animation logic into `App`

### Transition readiness contract

- Do not define readiness as `introComplete` alone.
- The future implementation should only allow source-box measurement when both conditions are true:
  - the baked intro has reached its completed visible state
  - the hero reveal timeline has settled the black cup into its final poster coordinates
- Preferred future signal:
  - `HeroComposition` exposes `isRevealSettled()` returning `true` after the reveal timeline completes
- Reduced-motion rule:
  - `isRevealSettled()` should resolve immediately once the hero is rendered in its reduced-motion static state

### Exact overlay handoff spec

- Overlay initial state:
  - mounted but hidden
  - pointer-events disabled
  - own ground shadow included from the beginning of visible travel
- At trigger progress `0.00`:
  - overlay snaps to the exact live hero black cup box
  - overlay becomes visible
  - hero black cup remains visible underneath for the first visual frame
- At trigger progress `0.06` to `0.10`:
  - if overlay alignment is visually exact, hero black cup opacity may fade from `1` to `0`
  - if overlay alignment is not exact enough, do not fade yet; fix geometry first
- Mid-travel:
  - overlay fully owns the visible cup
  - hero black cup remains in its original layout but visually hidden
- Final handoff:
  - static settled section cup may exist from mount at `opacity: 0`
  - crossfade should begin only between about `0.90` and `0.96` trigger progress
  - only begin that crossfade when center delta is within about `8px` and size delta within about `1.5%`
- Review failure:
  - any visible double cup, swap flash, or drifting shadow means the handoff is not implementation-ready

## 5. Proposed component structure

### Future files to add or fill in

- `src/scenes/FreshnessTransition/FreshnessTransition.jsx`
- `src/scenes/FreshnessTransition/FreshnessTransition.css`
- `src/animations/freshnessTransitionScroll.js`
- `src/utils/freshnessTransitionGeometry.js`

### Existing files likely to be updated during implementation

- `src/App.jsx`
- `src/styles/layout.css`
- `src/utils/assetMap.js`
- `src/scenes/HeroComposition/HeroComposition.jsx`

### Purpose of each future file

- `FreshnessTransition.jsx`
  - owns the first below-hero proof/freshness panel DOM
  - owns local refs for labels, text lines, pills, sticker, target anchor, and settled cup
- `FreshnessTransition.css`
  - owns layout, type, layering, pill sizing, sticker placement, and responsive rules
- `freshnessTransitionScroll.js`
  - owns ScrollTrigger setup
  - owns floating cup movement and any late handoff logic
- `freshnessTransitionGeometry.js`
  - owns reusable bounds/math helpers
  - keeps transform calculations out of JSX

### App-level future responsibility

- `App.jsx` should own only:
  - scene order
  - cross-scene ref handoff
  - minimal intro-complete gating if needed
- `App.jsx` should not own detailed scroll math.

### Page-flow contract

- Future DOM model should be:
  - `app-shell`
  - `page-flow`
  - `hero-shell`
  - `freshness-transition`
  - `transition-overlay-host`
- `hero-shell` should become the containing block for the current absolute-positioned hero poster.
- `hero-shell` should be `min-height: 100vh` / `100svh`.
- `page-flow` should become the natural scroll parent.
- `transition-overlay-host` should remain a top-level sibling inside `app-shell` so the baked loader and future floating cup can stack predictably without reparenting the hero.
- Loader stacking rule:
  - the baked loader overlay must remain above both hero and transition overlay during intro playback
  - the transition overlay must never appear above the loader while intro is active

## 6. Scroll animation plan

### Whether to use GSAP ScrollTrigger

- Yes.
- `gsap` is already installed in `package.json`.
- `ScrollTrigger` is available through GSAP, but it is not currently used anywhere in audited source files.
- Future implementation should import and register it explicitly.

### Recommended high-level trigger model

- Use one dedicated scroll-controlled handoff timeline for the black cup.
- Keep text, pills, and sticker static in the first pass.
- Let the section itself arrive through normal page flow instead of forcing a pinned cinematic stack immediately.

### Recommended section mounting model before animation

- Introduce a hero shell wrapper in normal flow with viewport height.
- Keep `HeroComposition` visually identical inside that shell.
- Place `FreshnessTransition` directly after the shell, with Secret Sauce as its first panel composition.
- Remove the global page lock by moving `overflow: hidden` responsibility away from the top-level `.app-shell`.

### Recommended ScrollTrigger behavior

- Start:
  - when the first freshness/Secret Sauce panel begins entering the viewport
  - recommended desktop starting rule: `start: "top 85%"`
- End:
  - when the cup has fully claimed center stage and the section composition is visually settled
  - recommended desktop ending rule: `end: "top 35%"`
- Scrub:
  - yes
  - scrubbed movement is necessary for the premium continuous feel

### Scroll pacing rule

- The travel should feel deliberate, not hurried.
- Desktop target:
  - visible cup handoff should breathe across roughly `50vh` of actual scroll distance
- Tablet target:
  - slightly shorter, around `42vh` to `46vh`
- Mobile target:
  - simplify to around `34vh` to `38vh` of travel and reduce the apparent scale jump
- Review failure:
  - if the cup reaches center too early and then sits idle while the user keeps scrolling, the trigger range is too short
  - if the cup is still traveling after the text block has already fully passed into view, the trigger range is too long

### Whether the section should pin

- Recommended initial answer: `No pin in the first implementation pass`.
- Why:
  - pinning adds more complexity on top of a page-flow refactor that does not exist yet
  - pinning increases risk of mobile scroll bugs and layout jumps
  - the visual target can be reached with normal flow plus a scrubbed overlay cup
- Revisit pinning only if the static section feels too short after Phase 3.

### Cup movement plan

- Source state:
  - measured live box of the black hero cup after hero reveal has fully resolved
- Animated properties:
  - translate X/Y
  - scale
  - rotation
  - optional opacity handoff near completion only
- Desktop target:
  - settle centered over the orange statement
  - about `1.5x` hero scale
  - upright

### Text, pills, and sticker behavior

- First implementation pass:
  - keep them statically laid out
  - do not tie their position to the cup scrub
- Optional later polish:
  - very subtle opacity or vertical settle-in
  - only after the cup transition is already stable

### Reduced motion

- Reduced motion should not scrub a large floating travel path.
- Recommended reduced-motion fallback:
  - keep the section static
  - show the settled section cup directly
  - use minimal fade/visibility handoff instead of continuous cup travel
  - preserve content readability and hierarchy
- Do not introduce a smooth-scroll layer for reduced-motion users.

### How to avoid layout jumps

- Pre-allocate the Secret Sauce section height before any timeline runs.
- Keep the floating cup in a dedicated overlay plane, not in normal flow.
- Recompute bounds on resize and call `ScrollTrigger.refresh()`.
- Avoid animating layout properties such as `top`, `left`, `width`, and `height` on live scene nodes during scroll if transform-based motion can do the work.

## 7. Layering plan

### Recommended z-index hierarchy

- `0`: Secret Sauce section background/base cream stage
- `1`: atmosphere/haze layers
- `2`: orange jumbo typography
- `3`: inline image pills
- `4`: coffee-pot sticker
- `6`: static settled section cup if used
- `7`: floating transition cup overlay
- `12`: hero header/chrome while hero remains visible
- `20+`: baked loader overlay while intro is active

### Layering rules

- Orange text must stay behind the cup.
- Pills should sit with the text layer, not above the cup.
- Sticker may overlap text but should still sit below the final cup.
- The transition overlay must not appear above the baked intro overlay during intro playback.

## 8. Responsive plan

### Desktop strategy around 1440px

- Keep the three-line statement close to the provided reference.
- Use `96px` as the base headline target.
- Keep both labels in the top corners using the existing site width logic.
- Preserve the large inline pills at `280px x 100px`.
- Allow the cup to scale toward the full `1.5x` target.

### Locked `1440x900` layout

- Preferred line breaks:
  - line 1: `CRAFTED WITH` + coffee pill
  - line 2: `FRESH BEANS AND FRESHLY`
  - line 3: croissant pill + `BAKED DELIGHTS`
- Cup target width:
  - `470px`
- Sticker behavior:
  - visible
  - integrated between `FRESHLY` and `DELIGHTS`
- Pill behavior:
  - remain inline, never stacked

### Tablet strategy around 1024px

- Reduce headline scale to roughly `72px` to `80px`.
- Reduce pill size to roughly `220px x 78px`.
- Tighten line breaks if needed, but keep the statement reading as one editorial block.
- Reduce cup target scale slightly if `1.5x` causes excessive overlap.
- Keep the section feeling poster-like rather than turning into stacked cards.

### Locked `1024x800` layout

- Preferred line breaks:
  - line 1: `CRAFTED WITH`
  - line 2: coffee pill + `FRESH BEANS`
  - line 3: `AND FRESHLY`
  - line 4: croissant pill + `BAKED DELIGHTS`
- Cup target width:
  - `360px`
- Sticker behavior:
  - still visible but reduced by roughly `15%` from desktop
- Pill behavior:
  - remain inline with their paired line, do not stack as isolated rows

### Mobile strategy around 390px

- Do not force the exact desktop line pattern if it harms readability.
- Allow the layout to re-break into more lines.
- Recommended mobile type range:
  - roughly `42px` to `52px` for the jumbo orange statement
- Recommended mobile pill size:
  - roughly `156px x 56px` to `180px x 64px`
- Reduce sticker size and simplify its overlap.
- Reduce cup travel distance and final scale if needed to preserve readable type and avoid covering the entire viewport.

### Locked `390x844` layout

- Preferred line breaks:
  - line 1: `CRAFTED WITH`
  - line 2: coffee pill
  - line 3: `FRESH BEANS`
  - line 4: `AND FRESHLY`
  - line 5: croissant pill
  - line 6: `BAKED DELIGHTS`
- Cup target width:
  - `250px`
- Sticker behavior:
  - optional
  - if retained, reduce aggressively and keep it tucked near the final word only
  - if it competes with readability, remove it on mobile before compromising the cup or text
- Pill behavior:
  - pills become their own short rows
  - keep them centered within the text field, not full-width

### Mobile motion simplification

- Use shorter travel.
- Prefer less rotation change.
- Consider dropping the late opacity handoff and keeping one settled static cup if that proves cleaner on small screens.

### Readability guardrails

- Never let the cup fully block the phrase.
- Maintain sufficient negative space around both labels.
- Prevent the inline pills from forcing horizontal overflow.
- If needed, prioritize readable composition over literal desktop line duplication.

## 9. Smooth scroll recommendation

### Whether to add global smooth scroll now

- No.

### Whether CSS `scroll-behavior: smooth` is enough

- No, not for this animation goal.
- `scroll-behavior: smooth` only affects programmatic scroll jumps such as anchor navigation.
- It does not smooth native wheel/touch scrolling in the way people usually mean when discussing premium scroll feel.

### Recommended immediate approach

- Start with native browser scrolling plus GSAP `ScrollTrigger`.
- Prove the cup handoff quality first.
- Measure whether the existing browser scroll feel is already good enough.

### Whether to defer JS smooth scroll

- Yes.
- If later needed, evaluate a JS smooth-scroll layer only after the section works well with native scroll.

### Risks of adding a JS smooth-scroll layer later

- Must be wired into `ScrollTrigger` correctly.
- Adds a second scroll/RAF ownership system.
- Can complicate touch behavior and browser accessibility expectations.
- Can create reduced-motion inconsistencies if not explicitly bypassed.
- Can increase debugging cost when layout and scroll positions disagree.

### Recommendation

- Do not add a smooth-scroll library in the Secret Sauce implementation phases by default.
- Revisit only if native scrolling demonstrably prevents the premium handoff from feeling polished.

## 10. Implementation phases

### Phase 1: Static section only, no scroll animation

- Files likely touched:
  - `src/App.jsx`
  - `src/styles/layout.css`
  - `src/scenes/FreshnessTransition/FreshnessTransition.jsx`
  - `src/scenes/FreshnessTransition/FreshnessTransition.css`
  - `src/utils/assetMap.js`
- What must not be touched:
  - `src/scenes/BakedIntroReveal/*`
  - baked intro timing
  - hero final cup positions
  - `heroCompositionTimeline` motion behavior
  - `BakedIntroReveal` callback sequencing
- Verification steps:
  - hero still loads and reveals exactly as before
  - page can now scroll
  - the first freshness/Secret Sauce panel appears below the hero
  - hero final poster looks unchanged before scrolling
  - no horizontal overflow
- Rollback strategy:
  - unmount the new section
  - restore previous `.app-shell` overflow/page-flow behavior
  - keep any asset-map additions only if already needed elsewhere

### Phase 2: Add black cup transition infrastructure, still no visual hero breakage

- Files likely touched:
  - `src/App.jsx`
  - `src/scenes/HeroComposition/HeroComposition.jsx`
  - `src/scenes/FreshnessTransition/FreshnessTransition.jsx`
  - `src/utils/freshnessTransitionGeometry.js`
- What must not be touched:
  - hero CSS poster coordinates
  - baked loader files
  - loader-triggered hero reveal timing
- Verification steps:
  - explicit ref handoff exists for:
    - hero black cup source
    - first freshness/Secret Sauce target anchor
  - no duplicate visible cup at rest
  - no change to hero layout or loader behavior
- Rollback strategy:
  - remove the overlay infrastructure mount points
  - preserve the static section

### Phase 3: Add scroll-linked black cup movement

- Files likely touched:
  - `src/animations/freshnessTransitionScroll.js`
  - `src/App.jsx`
  - `src/scenes/FreshnessTransition/FreshnessTransition.jsx`
  - `src/styles/layout.css`
- What must not be touched:
  - baked intro choreography
  - existing hero reveal animation values unless a bug absolutely forces a ref-only exposure change
- Verification steps:
  - cup appears to move continuously from hero toward section
  - cup settles centered over the orange type
  - hero cup does not disappear early
  - no double-cup ghosting
  - scroll remains smooth on desktop and acceptable on mobile
- Rollback strategy:
  - disable the ScrollTrigger module
  - leave the section static
  - leave page-flow refactor intact if stable

### Phase 4: Responsive polish

- Files likely touched:
  - `src/scenes/FreshnessTransition/FreshnessTransition.css`
  - `src/utils/freshnessTransitionGeometry.js`
  - `src/animations/freshnessTransitionScroll.js`
- What must not be touched:
  - hero poster coordinates unless a severe responsiveness bug proves the wrapper is insufficient
  - baked intro files
- Verification steps:
  - 1440x900 reads close to the reference
  - 1024x800 remains intentional
  - 390x844 remains readable and performant
  - no horizontal scroll at any breakpoint
- Rollback strategy:
  - revert breakpoint-specific refinements while keeping the stable desktop implementation

### Phase 5: Optional smooth scroll decision

- Files likely touched only if explicitly approved later:
  - app bootstrap / scroll integration files
  - `freshnessTransitionScroll.js`
- What must not be touched:
  - section layout logic unless the smooth-scroll layer proves it requires a refresh strategy
  - baked intro files
- Verification steps:
  - compare native scroll versus smoothed scroll
  - verify reduced-motion bypass
  - verify `ScrollTrigger` synchronization
  - verify touch and wheel feel
- Rollback strategy:
  - remove the smooth-scroll layer entirely
  - return to native scroll with no section architecture loss

## 11. Risks and guardrails

- Do not change the hero final layout.
- Do not directly animate elements that already own permanent CSS transforms unless wrappers or separate overlay layers are used.
- Do not break the baked loader to hero reveal synchronization.
- Do not modify `BakedIntroReveal` behavior for Secret Sauce work unless a later implementation proves an explicit compatibility hook is unavoidable.
- Do not make the black cup disappear from hero before the floating layer is visually aligned.
- Do not create double-cup ghosting during the handoff.
- Do not cause horizontal overflow through oversized pills, type, or off-canvas cup math.
- Do not add a heavyweight smooth-scroll system before proving native scroll is insufficient.
- Do not let mobile performance degrade through large pinned scenes, extra blur layers, or expensive continuous layout reads.
- Do not hardcode transition start/end transforms from the reference alone; measure live DOM boxes from the current hero.
- Do not let the centered cup interpretation flatten the section into symmetrical marketing-layout behavior.
- Do not allow the atmosphere to become noisier than the current hero atmosphere treatment.
- Do not treat trigger start/end strings as throwaway defaults; they are part of the authored feel and must be tuned intentionally.

## 12. Verification checklist

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run verify`
- Note for future verification:
  - as of `2026-05-05`, `verify:build-output` passes but emits warnings for total bytes, CSS bytes, CSS growth, and media bytes; Secret Sauce work should avoid worsening those warning categories unnecessarily
- `/` loader still works
- hero reveal still works
- hero final layout unchanged
- section appears below hero
- scroll transition works smoothly
- no horizontal overflow
- reduced motion works
- review at `1440x900`
- review at `1024x800`
- review at `390x844`
- review on the current wide-monitor desktop setup

### Visual acceptance rubric

- The cup remains the focal object at every scroll state.
- The orange text reads as an integrated backdrop, not as a generic centered headline block.
- The sticker reads as punctuation, not as pasted-on decoration.
- The section feels like a continuation of the current cream world and restrained product-first taste.
- The handoff feels like one object moving through space, not a swap.

### Failure modes to reject in review

- generic centered layout
- pills reading like badges or cards
- sticker competing with the cup
- cup obscuring too much of the phrase
- atmosphere flatter or noisier than hero
- cup shadow detaching visibly during scrub
- overlay cup and hero cup ghosting together
- scroll range feeling rushed on desktop wide monitors
- mobile layout shrinking the desktop design instead of recomposing it

## 13. Future implementation prompt placeholder

Future implementation prompt will be written after this plan is reviewed and approved.
