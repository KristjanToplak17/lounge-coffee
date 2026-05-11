# GSAP Frontend Animation Audit

## Executive Summary

The current frontend has a solid GSAP foundation but is not yet production-safe as a complete motion system.

Strongest areas:

- the intro loader uses scoped refs, `gsap.context()`, and transform-led motion
- the hero reveal is cleanly isolated and avoids unsafe selector reach
- reduced-motion handling exists across the app and Lenis is disabled when reduced motion is enabled

Primary risks:

- the freshness handoff does not match the documented motion model: it transitions the black cup, not the orange cup, and it is not pinned
- the main ScrollTrigger path performs DOM measurement during `onUpdate`, creating avoidable layout-thrashing risk on scroll
- loader timing and easing drift materially from the motion docs, so the intro cadence is faster and less deliberate than the approved system
- the live homepage continues past the documented v1 motion arc into static downstream sections, so the motion language currently loses continuity after freshness

Overall production rating: `Promising foundation, not yet fully production-safe`

## Overall Animation Architecture

What is working well:

- `src/scenes/BakedIntroReveal/useBakedIntroAnimation.js` uses a single scene-owned timeline and cleans up through `gsap.context().revert()`
- `src/scenes/HeroComposition/HeroComposition.jsx` keeps animation ownership local and exposes a narrow imperative API for the cross-scene handoff
- `src/animations/heroCompositionTimeline.js` uses transform and opacity properties almost exclusively, which aligns with GSAP performance guidance
- `src/animations/freshnessTransitionScroll.js` keeps ScrollTrigger at the top level instead of nesting it inside child tweens

Architecture gaps:

- the app has only one live ScrollTrigger sequence, so the motion system currently feels front-loaded into the intro and early handoff
- the downstream live sections, `BestsellersSection` and `MenuSection`, have no GSAP continuity, so the experience shifts abruptly from cinematic motion to mostly static layout
- motion decisions are split between GSAP JS and CSS hover transitions in a reasonable way, but there is not yet a clear “section reveal language” for the full homepage
- `src/App.jsx` mounts `MenuSection` even though the repository docs repeatedly frame v1 around the intro, hero, freshness, and at most bestsellers

## Loader Animation Review

Existing animation:

- time-based GSAP timeline in `src/scenes/BakedIntroReveal/useBakedIntroAnimation.js`
- side-owned reveal groups, seam caps, fragments, progress fill, logo fade, and backdrop fade
- debug states for `start`, `mid`, and `end`

What is good:

- sequence ownership is centralized in one timeline instead of being distributed across multiple unrelated effects
- transform-based motion dominates: `x`, `scale`, `rotation`, and `opacity`
- cleanup is correct and React-safe
- fragment state is deterministic and easy to reason about

Key issues:

- motion timing does not match the approved docs. `LOADER_TIMING` in `src/scenes/BakedIntroReveal/bakedIntroShared.js` is substantially faster than `docs/motion-system.md` and `docs/loader.md`, especially `loaderFill`, `midHold`, and the opening cadence
- easing values in `bakedIntroShared.js` also diverge from the documented easing defaults, which helps explain why the loader can feel more mechanical than cinematic
- `END_SCALE = 6.0` is visually dramatic but expensive for large bitmap assets and may cause texture/raster pressure on weaker GPUs
- the timeline is structurally sound but repetitive; it would benefit from stronger defaults/labels to make the sequence easier to tune without drift

Performance notes:

- generally GPU-safe because the animation is mostly transforms and opacity
- animated fragments and cups still carry `drop-shadow()` filters, so the cost is not zero
- the very large exit scale is the main performance concern in this scene

Reduced-motion notes:

- reduced-motion handling exists and preserves the structural truth of the reveal
- this is a positive implementation choice
- it is handled through React state branching rather than `gsap.matchMedia()`, which is acceptable, but less idiomatic for GSAP-heavy responsive systems

Priority: `High-ROI polish`

## Hero Animation Review

Existing animation:

- paused hero reveal timeline in `src/animations/heroCompositionTimeline.js`
- started by the intro during the `midToEnd` handoff
- all hero entrance elements reveal at timeline position `0`

What is good:

- scene refs are clean and explicit
- hidden mobile-only cups are skipped through `isRenderable()`
- `fromTo()` plus `clearProps: "willChange"` is a good pattern here
- the handoff from intro to hero is conceptually correct and easy to maintain

Key issues:

- the hero reveal is more of a simultaneous fade/translate reset than a designed sequence; it lacks label-based choreography and does not yet feel as authored as the product direction suggests
- the reduced-motion branch returns an empty paused timeline, which is safe, but it means hero motion simply disappears rather than becoming a lighter expressive reveal
- all entrance tweens share nearly identical timing, so the hero currently reads flatter than the intended poster-like composition

Performance notes:

- good property choices overall
- ground shadows animate scale/opacity only, which is safe
- static `filter: drop-shadow()` on large images is acceptable, but still a paint cost on lower-end devices

Cleanup notes:

- cleanup is good through `gsap.context()`
- imperative methods exposed with `useImperativeHandle()` are narrow and safe

Reduced-motion notes:

- safe, but not especially graceful
- the hero would benefit from a very short opacity-only or small `y` reveal variant rather than a full removal of motion

Priority: `High-ROI polish`

## Section-by-Section Animation Review

### Intro Sequence / Loader

- Existing animations: progress fill, logo fade, seam-cap fade, split-group travel, fragment drift, backdrop fade
- GSAP implementation notes: one timeline in `src/scenes/BakedIntroReveal/useBakedIntroAnimation.js`; scene ownership is correct
- ScrollTrigger notes: none, correctly time-based
- Performance risks: large bitmap upscaling at `END_SCALE = 6.0`; fragment shadows add some paint cost
- Cleanup risks: low
- Mobile concerns: geometry is height-scaled, but the docs already warn that mobile composition still needs more intentional recomposition than simple scaling
- Reduced-motion concerns: structurally handled well
- Recommended improvements: align timing/easing with docs, reduce tuning drift, lower end-state cost if mobile testing shows pressure, add timeline defaults/labels for maintainability
- Priority: `High-ROI polish`

### Hero Composition

- Existing animations: chrome, stats, copy, sticker, cups, and cup shadows reveal together
- GSAP implementation notes: timeline is safe and readable but very flat in sequencing
- ScrollTrigger notes: none, correctly intro-driven
- Performance risks: moderate only because of large image layers and drop shadows
- Cleanup risks: low
- Mobile concerns: mobile removes some cups via CSS, which is good, but the reveal design itself does not adapt much
- Reduced-motion concerns: safe but visually abrupt because the motion is effectively skipped
- Recommended improvements: add better sequencing contrast, use labels/defaults, create a lighter reduced-motion hero reveal instead of a no-motion branch
- Priority: `High-ROI polish`

### Freshness Transition

- Existing animations: overlay cup travel from hero to settled cup target, opacity swaps, rotation interpolation
- GSAP implementation notes: implemented in `src/animations/freshnessTransitionScroll.js`
- ScrollTrigger notes: one top-level `ScrollTrigger.create()` with `scrub: 3`, `start: "top bottom"`, `end: "center 70%"`
- Performance risks: highest in the project because `measureElementRect(settledCup)` calls `getBoundingClientRect()` during `onUpdate`, then writes transforms immediately after
- Cleanup risks: low to moderate; cleanup itself is correct, but a layout-heavy trigger on every scroll update is still risky under real scroll load
- Mobile concerns: the trigger does not adapt behavior by breakpoint; it also depends on smooth-scroll state that is only checked once at mount in `src/utils/useSmoothScroll.js`
- Reduced-motion concerns: static fallback is safe
- Recommended improvements:
  - restore the documented orange-cup handoff instead of using the black cup
  - implement the documented pinning behavior for the transition scene
  - cache source and target rects on refresh rather than measuring the target on every `onUpdate`
  - add breakpoint-aware trigger logic
- Priority: `Must-fix`

### Bestsellers Section

- Existing animations: CSS hover lift only
- GSAP implementation notes: no scene-level GSAP
- ScrollTrigger notes: none
- Performance risks: low
- Cleanup risks: none
- Mobile concerns: safe
- Reduced-motion concerns: CSS transitions are reduced by `src/styles/motion.css`
- Recommended improvements: only add GSAP if it stays restrained, for example a single batched entrance for cards or a heading fade-up tied to viewport entry
- Priority: `Nice-to-have`

### Menu Section

- Existing animations: none beyond browser-native/CSS behavior
- GSAP implementation notes: no scene-level GSAP
- ScrollTrigger notes: none
- Performance risks: low
- Cleanup risks: none
- Mobile concerns: safe
- Reduced-motion concerns: safe
- Recommended improvements: only introduce motion if this section remains in scope; otherwise avoid adding more animation debt to a section that already appears outside the documented v1 arc
- Priority: `Experimental`

## Timeline / Sequencing Review

Strengths:

- the loader uses a real GSAP timeline instead of delay-chained loose tweens
- the hero reveal is isolated in its own paused timeline

Weaknesses:

- the loader timeline is not using shared timeline defaults, so timing/ease tuning is more fragile than it needs to be
- the loader has only one semantic label, `midToEnd`; more labels would make the choreography easier to audit and keep aligned with docs
- the hero reveal starts all major tweens at the same position, which limits hierarchy and pacing
- the app-level motion story is strongest before scroll begins and then drops off sharply

Assessment:

- timeline structure is `technically safe`
- sequencing quality is `not yet at production polish`

## ScrollTrigger Review

Current usage:

- one live ScrollTrigger in `src/animations/freshnessTransitionScroll.js`

What is correct:

- ScrollTrigger is registered before use
- the trigger is created at the top level, not nested inside a child tween of a timeline
- cleanup kills the trigger

What is risky or incorrect:

- the documented pinned transition is not implemented
- the trigger measures layout during `onUpdate`, which is not ideal for a scrubbed transition
- the scene is effectively doing an element-to-element handoff without a pin, so the scroll-linked motion reads more like a floating overlay patch than a structural section transition
- the project enables Lenis in `src/utils/useSmoothScroll.js`, but breakpoint eligibility for smooth scrolling is evaluated only once per effect run. A resize across the `961px` threshold can leave scroll behavior out of sync with intended device mode

Assessment:

- ScrollTrigger correctness is `partial`
- ScrollTrigger production readiness is `below target`

## Performance Review

Positive choices:

- most animated properties are transform and opacity
- there are no large numbers of simultaneous ScrollTriggers
- hero and loader both use explicit refs and avoid selector fan-out

Main risks:

- forced layout risk in `src/animations/freshnessTransitionScroll.js` from `getBoundingClientRect()` during scrub updates
- large scaled bitmaps in the loader exit
- animated elements with `filter: drop-shadow()` can still be expensive on weaker hardware
- the app keeps some `will-change` declarations in static inline styles for the overlay cup; this is minor, but should not become a general pattern

Assessment:

- overall performance posture is `good fundamentals, one major scroll-path risk`

## Accessibility / Reduced Motion Review

What is good:

- `src/utils/usePrefersReducedMotion.js` is implemented cleanly
- Lenis is disabled for reduced-motion users
- loader, hero, and freshness transition each have explicit reduced-motion branches
- CSS transition reduction exists in `src/styles/motion.css`

Gaps:

- GSAP responsiveness is not managed with `gsap.matchMedia()`, so motion variants are handled manually across files
- the hero reduced-motion path is very blunt and could preserve more intention with an opacity-led fallback
- because the freshness transition is not pinned, the section handoff is less predictable for users who rely on calmer, more readable scroll behavior

Assessment:

- accessibility support is `better than average`
- reduced-motion polish is `good baseline, not final`

## Cleanup / Memory Safety Review

What is good:

- loader uses `gsap.context()` and reverts correctly
- hero uses `gsap.context()` and tears down its timeline cleanly
- freshness transition returns a destroy function that kills the trigger and resets visual state

Remaining concerns:

- `useSmoothScroll()` does not react to viewport breakpoint changes after initialization, so scroll mode can become stale during resize testing
- cleanup quality is stronger than sequencing quality in this codebase; memory safety is not the main issue right now

Assessment:

- cleanup and memory safety are `generally production-safe`

## Missing Animation Opportunities

Only safe additions are listed below.

| Area | Element | Suggested GSAP animation | Technical reason | UX reason | Risk | Priority |
|---|---|---|---|---|---|---|
| Bestsellers | Heading block | One `from()` fade-up on section enter | Low trigger count and simple transform/opacity workload | Helps the page avoid going visually flat after freshness | Low | Nice-to-have |
| Bestsellers | Product cards | `ScrollTrigger.batch()` with short stagger | More efficient than one trigger per decorative card animation | Gives the section a controlled reveal without making it feel transactional | Low | Nice-to-have |
| Menu | Category titles | Small fade-up or `y` reveal on first entry | Cheap, readable, and easy to batch | Adds continuity if the menu remains in scope | Low | Experimental |
| Freshness | Statement typography only | Light opacity/translate reveal tied to the same structural transition | Keeps motion concentrated in one section instead of many isolated effects | Strengthens the handoff once the pin behavior is corrected | Medium | High-ROI polish |

## Things to Avoid

- overcomplicated nested timelines across scene boundaries
- layout-heavy property animation such as `top`, `left`, `width`, or `height` for major motion beats
- additional ScrollTriggers for purely decorative motion
- attaching ScrollTrigger logic to downstream sections before the freshness transition is structurally corrected
- compensating for missing pinning with more overlay hacks
- adding decorative motion to the menu section if that section may be removed or respecified

## Priority Recommendations

### 1. Must-fix

- Rebuild the freshness handoff so it matches the motion spec: pinned transition, orange-cup continuity, and structurally clean hero-to-freshness behavior
- Remove layout reads from the scrub `onUpdate` path in `src/animations/freshnessTransitionScroll.js`
- Re-test smooth-scroll enablement so breakpoint changes cannot leave desktop/mobile motion behavior stale

### 2. High-ROI polish

- Bring loader timing and easing back into alignment with `docs/motion-system.md` and `docs/loader.md`
- Add clearer label/default structure to the loader timeline so future tuning does not drift again
- Give the hero reveal more sequencing hierarchy and a better reduced-motion fallback

### 3. Nice-to-have

- Add one restrained GSAP entry for the Bestsellers section so the live experience does not stop feeling authored after freshness
- Consider a subtle freshness text reveal once the structural transition is fixed

### 4. Experimental

- Add menu-section motion only if the section is confirmed to stay in scope
- Explore very light downstream motion continuity after the core loader, hero, and freshness system is stable
