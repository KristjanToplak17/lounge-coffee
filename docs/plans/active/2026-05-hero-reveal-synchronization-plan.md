# Hero Reveal Synchronization Plan

## Purpose

This plan covers only the future implementation of synchronized hero reveal motion during the loader's `midToEnd` phase.

It does not approve:

- hero layout redesign
- cup repositioning
- cup resizing
- permanent rotation changes
- loader crack geometry changes
- loader panel choreography changes
- broad scene refactors

The goal is to add a safe hero reveal system that preserves the current hero desktop composition as the final static end state.

Every hero element must finish exactly where it already sits today.

## Canonical Dependencies

- [`docs/project-brief.md`](../../project-brief.md)
- [`docs/scene-map.md`](../../scene-map.md)
- [`docs/motion-system.md`](../../motion-system.md)
- [`docs/loader.md`](../../loader.md)
- [`docs/loader-polish-spec.md`](../../loader-polish-spec.md)
- [`docs/design-system.md`](../../design-system.md)
- [`docs/app-architecture.md`](../../app-architecture.md)

Primary implementation files for the later pass:

- [`src/App.jsx`](../../../src/App.jsx)
- [`src/scenes/HeroComposition/HeroComposition.jsx`](../../../src/scenes/HeroComposition/HeroComposition.jsx)
- [`src/scenes/HeroComposition/HeroComposition.css`](../../../src/scenes/HeroComposition/HeroComposition.css)
- [`src/animations/heroCompositionTimeline.js`](../../../src/animations/heroCompositionTimeline.js)
- [`src/scenes/IntroReveal/IntroReveal.jsx`](../../../src/scenes/IntroReveal/IntroReveal.jsx)
- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)
- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)

## Scope-Locked Outcome

When this plan is implemented later, the hero reveal must behave like one synchronized authored event:

- header/nav/chrome comes down into place
- red cup comes down into place
- stats block moves in from the right
- copy group comes up into place
- yellow, black, and orange cups move in from the left
- yellow, black, and orange cups begin with a temporary extra right-leaning rotation offset
- all hero reveal elements start at the same moment
- all hero reveal elements use the same ease feeling
- all hero reveal elements arrive at the same moment
- the reveal finishes exactly when loader `midToEnd` finishes

The animation must feel subtle, premium, clean, and fast enough to live fully inside the loader `midToEnd` window.

This requested overlap introduces two intentional spec changes that must be documented before or during implementation:

- hero reveal starts during loader `midToEnd`, not only after reveal completion
- mascot motion participates in the synchronized hero reveal instead of arriving later as a subordinate accent

Because those two points conflict with older wording in [`docs/motion-system.md`](../../motion-system.md), the later implementation pass must update that canonical doc in the same pass so the plan and motion spec do not drift.

## Current Architecture Audit

### 1. Mounting relationship

Current mounting in [`src/App.jsx`](../../../src/App.jsx):

- `HeroComposition` is always mounted behind the intro reveal
- `IntroReveal` is conditionally mounted above it until `introComplete` flips to `true`
- the hero already exists in the DOM during the entire intro

This is the key enabler for the requested synchronization:

- the hero does not need to mount late
- the hero can begin moving while the loader is still on screen

### 2. Why no hero reveal system exists yet

Current hero animation ownership exists only on paper:

- [`src/animations/heroCompositionTimeline.js`](../../../src/animations/heroCompositionTimeline.js) currently returns `null`
- `HeroComposition` does not create animation refs
- no hero GSAP timeline is created
- no callback or event path exists from intro motion to hero motion
- no reduced-motion reveal strategy exists for hero entrance

Therefore:

- the hero is currently static only
- there is no live hero reveal system to tune or coordinate

### 3. Exact loader moment that corresponds to `midToEnd`

The exact handoff point already exists in the loader timeline:

- `timeline.addLabel("midToEnd")` in [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)

That label is currently the start point for:

- reveal-group final travel
- shadow final travel
- fragment exit travel

Current config values:

- `midToEnd` duration: `3340ms` in [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)
- `midToEnd` ease: `cubic-bezier(0.23, 1, 0.32, 1)` in [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)

This label is the correct future trigger point for the hero reveal.

### 4. Safest callback / event handoff

The safest future handoff is:

- keep scene DOM ownership local
- keep intro timeline ownership local
- let `App` coordinate the trigger contract
- fire a callback at the exact GSAP label instead of duplicating time math elsewhere

Recommended structure:

1. `App` creates a hero reveal trigger contract
2. `HeroComposition` exposes a `playReveal()` or equivalent scene-owned trigger path
3. `IntroReveal` receives an `onMidToEndStart` callback prop
4. `introRevealTimeline` calls that callback at label `"midToEnd"`

This is safer than:

- `setTimeout`
- waiting for `introComplete`
- letting the intro animation file query hero DOM directly

## Motion Ownership Contract

The future implementation must separate three concerns:

### 1. Layout / final state

Owned by existing scene CSS and visual elements:

- final positioning
- final width
- final rotation
- final shadows and filters
- final responsive behavior

### 2. Temporary reveal motion

Owned by motion wrappers and GSAP:

- temporary x offset
- temporary y offset
- temporary wrapper rotation offset
- temporary opacity

### 3. Timing / ease

Owned by one hero master timeline:

- one shared duration
- one shared ease
- one shared start time
- one shared end time

## Hero Target Inventory

The later implementation must support reveal targets for all of the following:

### Chrome / header / nav

- `.hero-composition__chrome`
- includes logo, nav, and utilities

### Stats block

- `.hero-composition__stats`
- contains:
  - Flavors
  - Reviews
  - Pastries

### Copy block

- `.hero-composition__copy`
- contains:
  - mascot sticker
  - headline
  - CTA

### Cup targets

- red cup
- yellow cup
- black cup
- orange cup

### Breakpoint participation rule

Not every target participates visually at every breakpoint.

Current CSS behavior must remain authoritative:

- stats are hidden below `640px`
- red cup is hidden below `640px`
- orange cup is hidden below `640px`

The future hero timeline must tolerate:

- targets that are mounted but visually hidden
- breakpoint-specific omission from the visible reveal
- null or non-participating refs without timing drift or runtime errors

## Transform And Positioning Risk Audit

### Elements already using transforms or transform-adjacent behavior

In [`src/scenes/HeroComposition/HeroComposition.css`](../../../src/scenes/HeroComposition/HeroComposition.css):

- `.hero-composition__sticker` uses `transform: scaleX(-1)`
- `.hero-composition__cta:active` uses `transform: scale(0.975)`
- `.hero-composition__cup--yellow` uses `transform: rotate(0deg)`
- `.hero-composition__cup--black` uses `transform: rotate(0deg)`
- `.hero-composition__cup--orange` uses `transform: rotate(-11deg)`
- `.hero-composition__stats` uses responsive `transform: scale(...)` at compact breakpoints
- cup images use `filter: drop-shadow(...)`
- most reveal targets use absolute positioning

### Direct-animation safety map

Safe to animate directly only if no wrapper is introduced:

- `.hero-composition__chrome`

Unsafe to animate directly and should use motion wrappers:

- `.hero-composition__stats`
- `.hero-composition__copy`
- `.hero-composition__sticker`
- `.hero-composition__cta`
- yellow cup visual element
- black cup visual element
- orange cup visual element

Red cup should also use a wrapper for consistency even though it has no permanent rotation today.

### Why wrappers are required

Wrappers prevent GSAP from overwriting:

- final CSS rotation
- responsive scale behavior
- active/hover transforms
- image-local transform ownership

Rule:

- permanent visual transforms stay on the visual element
- temporary reveal transforms live on a parent motion wrapper

## Motion Wrapper Plan

The implementation pass should add wrapper elements with no visual change before animation code is added.

Recommended wrappers:

- `hero-composition__chrome-motion`
- `hero-composition__stats-motion`
- `hero-composition__copy-motion`
- `hero-composition__sticker-motion`
- `hero-composition__cup-motion hero-composition__cup-motion--red`
- `hero-composition__cup-motion hero-composition__cup-motion--yellow`
- `hero-composition__cup-motion hero-composition__cup-motion--black`
- `hero-composition__cup-motion hero-composition__cup-motion--orange`

Wrapper responsibilities:

- outer absolute placement
- inset and z-index ownership for animated targets
- breakpoint visibility ownership for animated targets
- GSAP translation
- GSAP opacity
- temporary GSAP rotation offset

Inner visual element responsibilities:

- final image sizing
- final rotation
- drop shadow
- sticker flip
- CTA interaction transform
- responsive visual styling

Nested non-animated shell responsibilities where needed:

- permanent stats scale behavior
- any permanent transform that must not be overwritten by the reveal tween

No-visual-change guarantee:

- wrapper introduction must not move, resize, or restyle the final hero
- static before/after screenshots must match
- every breakpoint-specific `display`, `position`, `inset`, and `z-index` rule must resolve to the same final layout as today

## Proposed Motion Directions

These are safe starting directions for later implementation, not locked final values.

### Chrome / header / nav

- from `y: -24`
- to `y: 0`
- from `opacity: 0`
- to `opacity: 1`

### Red cup

- from `y: -28` to `-36`
- to `y: 0`
- from `opacity: 0`
- to `opacity: 1`

### Stats block

- from `x: 24` to `32`
- to `x: 0`
- from `opacity: 0`
- to `opacity: 1`

### Copy group

- from `y: 24` to `32`
- to `y: 0`
- from `opacity: 0`
- to `opacity: 1`

The synchronized copy reveal includes:

- headline
- CTA

### Mascot / sticker

Because the current request explicitly includes the mascot badge in the synchronized reveal, the mascot must be animated as its own reveal target with the same start time and end time as the other hero elements.

Starting direction:

- from `y: 24` to `32`
- to `y: 0`
- from `opacity: 0`
- to `opacity: 1`

Important:

- the sticker must not be animated directly on the flipped visual element
- the temporary reveal motion must live on `hero-composition__sticker-motion`
- implementation must update [`docs/motion-system.md`](../../motion-system.md) to reflect this approved exception to the older subordinate-sticker guideline

### Yellow / black / orange cups

- from `x: -28` to `-36`
- to `x: 0`
- from `opacity: 0`
- to `opacity: 1`
- from wrapper rotation offset roughly `+4deg` to `+6deg`
- to wrapper rotation `0deg`

Important:

- the rotation offset must be temporary wrapper rotation only
- the inner cup's final CSS rotation must remain unchanged

## Hero Timeline Structure

The future hero reveal should use one scene-owned master GSAP timeline.

Requirements:

- one label or start position for all tweens
- one shared duration
- one shared ease
- no stagger
- no offset arrivals
- no per-object finish drift

Recommended timeline contract:

- `heroCompositionTimeline({ elements, duration, ease, reducedMotion })`

Recommended animation behavior:

- set initial wrapper states once
- animate all reveal targets from the same timeline start
- complete all tweens exactly when loader `midToEnd` completes
- create the hero timeline ahead of the trigger moment so playback does not depend on a React re-render

## Loader-To-Hero Synchronization Plan

### Required trigger behavior

The hero reveal must:

- start at the same moment loader `midToEnd` begins
- finish at the same moment loader `midToEnd` ends
- not wait for intro unmount
- not wait for `introComplete`

### Safest future mechanism

Use the loader timeline label directly:

- add `onMidToEndStart` to `IntroReveal`
- pass it into `introRevealTimeline`
- call it via `timeline.call(onMidToEndStart, null, "midToEnd")`

Then:

- `App` relays that signal without using a render-driven state update
- `HeroComposition` starts its own scene-owned timeline immediately through an imperative or preinitialized trigger path
- the hero reveal must be able to start on the same frame as the loader label callback

Implementation constraint:

- do not use a state update in `App` as the primary mechanism for starting the hero reveal
- do not require a React render pass between loader callback and hero timeline start
- the reveal start path must be one-shot and idempotent
- intro cleanup and unmount must not retrigger or rewind the hero reveal

### Why this is the preferred approach

It preserves the repo's ownership rule from [`docs/app-architecture.md`](../../app-architecture.md):

- scene components own refs
- animation modules receive refs from their owning scene
- no animation file should mutate another scene's DOM without explicit handoff

## Reduced-Motion Plan

Reduced motion must keep the same structural truth:

- hero is already mounted behind the intro
- intro still opens away
- hero should already be visually ready underneath

Recommended reduced-motion behavior:

- default visible hero groups to their final transforms immediately
- either use no hero travel animation, or
- use only a very short low-travel shared settle on already-visible wrappers

Reduced-motion rules:

- no cup rotation reveal offsets
- no blur or filter animation
- no delayed pop after intro unmount
- no object-by-object sequence
- no opacity-led late reveal for hero groups that should already be visible under the opening
- mobile-hidden hero targets must remain hidden
- reduced motion must not fall back to `introComplete` as the hero-start trigger
- if reduced motion does not use loader label `midToEnd`, it must define an equivalent explicit hero-start moment

## Exact Implementation Phases

### Phase 0. Contract and ownership pass

Files:

- [`src/App.jsx`](../../../src/App.jsx)
- [`src/scenes/HeroComposition/HeroComposition.jsx`](../../../src/scenes/HeroComposition/HeroComposition.jsx)
- [`src/scenes/IntroReveal/IntroReveal.jsx`](../../../src/scenes/IntroReveal/IntroReveal.jsx)
- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)

Work:

- define the loader-to-hero trigger contract
- keep the intro and hero DOM ownership separate
- avoid cross-scene DOM querying
- define the hero reveal start path before any tuning
- define the reduced-motion equivalent trigger at the same contract layer
- document the required motion-system update for the overlapping hero reveal and synchronized mascot reveal

Acceptance:

- one exact trigger path exists from loader `midToEnd` to hero reveal start
- the trigger uses the GSAP label, not duplicated timing math
- `introComplete` remains unmount-only behavior, not reveal-start behavior
- hero reveal can start without waiting for a React render cycle
- hero reveal start is one-shot and idempotent
- intro cleanup and unmount cannot retrigger or rewind the hero reveal
- reduced-motion intro has an explicit equivalent hero-start trigger
- implementation pass includes the required canonical doc update in [`docs/motion-system.md`](../../motion-system.md)

### Phase 1. Wrapper parity pass

Files:

- [`src/scenes/HeroComposition/HeroComposition.jsx`](../../../src/scenes/HeroComposition/HeroComposition.jsx)
- [`src/scenes/HeroComposition/HeroComposition.css`](../../../src/scenes/HeroComposition/HeroComposition.css)

Work:

- introduce motion wrappers only
- preserve final layout exactly
- move transform ownership where needed from wrapper-conflicting targets to visual children
- keep breakpoint visibility behavior identical to current CSS
- ensure hidden mobile targets remain hidden after wrapper insertion

Acceptance:

- no visible layout change at desktop, compact, or mobile
- CTA active state still works
- sticker flip still works
- cup final rotations still match current state exactly
- stats responsive scale still behaves correctly
- stats remain hidden below `640px`
- red and orange cups remain hidden below `640px`
- no wrapper causes hidden targets to flash visible

### Phase 2. Hero timeline foundation pass

Files:

- [`src/animations/heroCompositionTimeline.js`](../../../src/animations/heroCompositionTimeline.js)
- [`src/scenes/HeroComposition/HeroComposition.jsx`](../../../src/scenes/HeroComposition/HeroComposition.jsx)

Work:

- implement scene-owned hero timeline
- define initial wrapper states
- define one shared duration and one shared ease
- animate all reveal targets together

Acceptance:

- all reveal targets start together
- all reveal targets finish together
- no stagger exists
- final state is the existing static composition

### Phase 3. Loader synchronization pass

Files:

- [`src/scenes/IntroReveal/IntroReveal.jsx`](../../../src/scenes/IntroReveal/IntroReveal.jsx)
- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)
- [`src/App.jsx`](../../../src/App.jsx)

Work:

- trigger hero reveal at exact loader label `midToEnd`
- match hero reveal duration to loader `midToEnd`
- preserve loader motion architecture

Acceptance:

- hero reveal begins on the same frame as loader `midToEnd`
- hero reveal ends when loader `midToEnd` ends
- no visible hero jump occurs when intro unmounts

### Phase 4. Reduced-motion pass

Files:

- [`src/animations/heroCompositionTimeline.js`](../../../src/animations/heroCompositionTimeline.js)
- [`src/App.jsx`](../../../src/App.jsx)

Work:

- add reduced-motion branch
- ensure the hero remains structurally correct under a gentler intro
- preserve final-state-first visibility for hero groups that should already be readable beneath the opening

Acceptance:

- reduced-motion hero does not lag after intro
- no transform conflicts appear
- the scene feels calm and intentional
- no visible hero group is initialized at hidden opacity and then revealed late
- mobile-hidden targets stay hidden

### Phase 5. Verification and tuning pass

Files:

- implementation files above
- verification artifacts as needed

Work:

- confirm wrapper parity
- confirm sync accuracy
- confirm hover and active behavior
- confirm breakpoint integrity
- run repo verification

Acceptance:

- all verification checks in this plan pass

## Verification Checklist

Before approving the implementation later, verify all of the following:

### Static parity

- compare static hero before and after wrappers at `1440x900`
- compare static hero before and after wrappers at `1024x800`
- compare static hero before and after wrappers at `390x844`
- confirm final hero still matches the current composition

### Motion sync

- confirm hero reveal starts exactly at loader `midToEnd`
- confirm all hero objects start together
- confirm all hero objects finish together
- confirm hero reveal ends exactly when loader `midToEnd` ends

### Transform safety

- confirm no cup final rotation changed
- confirm no cup final size changed
- confirm CTA active scale still works
- confirm sticker transform still works
- confirm stats responsive scale still works
- confirm no wrapper causes hidden mobile targets to become visible

### Scene handoff integrity

- confirm no object jumps when intro unmounts
- confirm no hero element becomes visible late due to mount timing
- confirm reduced-motion path remains coherent
- confirm hero reveal starts without waiting for a React render-driven state relay
- confirm the hero trigger is one-shot and does not replay on intro cleanup

### Repo verification

- run `npm run verify`

### Documentation integrity

- update [`docs/motion-system.md`](../../motion-system.md) in the same implementation pass to record:
  - the approved overlap between loader `midToEnd` and hero reveal
  - the approved synchronized mascot reveal exception for this hero sequence

## Files To Change Later

Implementation files expected to change:

- [`src/App.jsx`](../../../src/App.jsx)
- [`src/scenes/HeroComposition/HeroComposition.jsx`](../../../src/scenes/HeroComposition/HeroComposition.jsx)
- [`src/scenes/HeroComposition/HeroComposition.css`](../../../src/scenes/HeroComposition/HeroComposition.css)
- [`src/animations/heroCompositionTimeline.js`](../../../src/animations/heroCompositionTimeline.js)
- [`src/scenes/IntroReveal/IntroReveal.jsx`](../../../src/scenes/IntroReveal/IntroReveal.jsx)
- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)
- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js) only if the hero timing contract needs a shared config home

Canonical docs that may need follow-up update after implementation:

- [`docs/motion-system.md`](../../motion-system.md) must be updated in the same pass
- [`docs/app-architecture.md`](../../app-architecture.md) if the trigger contract becomes a durable pattern

## Files And Values Not To Touch

Do not change:

- current final hero layout positions
- current final hero desktop composition
- current final cup sizes
- current final cup rotations
- current loader crack geometry
- current loader panel motion behavior
- blur or filter animation behavior
- hero reveal by animating CTA, sticker, or rotated cup visuals directly
- intro trigger timing by waiting for `introComplete`

## Definition Of Done

This later implementation is complete only when:

- the hero still ends exactly in the current static layout
- all hero reveal elements start together
- all hero reveal elements finish together
- the reveal is subtle and premium rather than dramatic
- the reveal begins exactly at loader `midToEnd`
- the reveal ends exactly with loader `midToEnd`
- no transform conflicts remain
- reduced motion is supported
- `npm run verify` passes
