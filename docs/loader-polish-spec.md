# Loader Polish Spec

## Purpose

This document turns the current loader audit into a concrete polish target.

Use it to:

- define what is visually wrong in the current loader
- define the target production-quality result
- define exact implementation directives by file and system
- define the review frames that must pass before the loader is considered polished

This document does not replace [`loader-refinement-plan.md`](./loader-refinement-plan.md) or [`loader.md`](./loader.md).

It exists to close the gap between:

- approved loader architecture
- current implementation
- production-ready visual quality

## Scope

This spec covers only the intro loader / reveal sequence:

- `start`
- `startToMid`
- `mid`
- `midToEnd`
- `end`

It does not approve hero implementation changes beyond what is needed to make the reveal land into a credible target.

## Audit Summary

Current loader status: `Structurally close, visually under-tuned`

The current implementation already has:

- side-owned reveal groups
- seam-anchor geometry
- fragment support
- loader timing buckets
- reduced-motion support
- debug poses

But it is still not production ready because:

- the start frame does not feel composed enough
- the bean is visibly pre-split at rest
- reveal coverage is still fragile
- the crack opens too graphically and too immediately
- the motion cadence does not yet feel authored
- the reveal lands into a weak placeholder instead of a satisfying product world
- mobile composition is scaled down rather than intentionally recomposed

## Non-Negotiable Outcome

When polished, the loader must feel:

- cinematic
- premium
- physically authored
- clean at every frozen frame
- product-led rather than effect-led

The reveal must read as:

- tension
- seam release
- widening transformation
- confident surge into the next scene

It must not read as:

- two panels sliding apart
- a poster tear graphic
- a mask trick
- a placeholder preloader

## Review Frames

The loader must be reviewed and approved in five frozen states:

1. `start`
2. `loaderFade`
3. `mid`
4. `end`
5. live full animation

Desktop and mobile both require approval.

Minimum review widths:

- desktop: `1440x900`
- compact: `1024x800`
- mobile: `390x844`

## Visual Problems To Fix

### 1. Start frame hierarchy is weak

Current problems:

- logo sits slightly too high
- bean feels slightly too small
- progress line is too low and too short
- the frame feels centered, not composed

Target:

- logo slightly lower
- bean slightly larger and more dominant
- progress line closer to the bean
- stronger vertical rhythm between logo, bean, and progress

### 2. Bean is visibly split before the reveal starts

Current problem:

- the left and right groups begin with a small opposing offset
- the seam is already open at `start`

Target:

- the bean must read as one object at frame one
- no visible seam gap
- no visual pre-release tension leaking too early

### 3. Crack reads as a flat zig-zag graphic

Current problem:

- the cream opening already reads as a fully formed vertical tear
- it looks like a shape reveal, not a seam-origin split

Target:

- the crack should feel born from the seam
- the opening should begin tight and then widen
- the motion should feel physical, not decorative

### 4. Viewport coverage is not robust enough

Current problem:

- panel coverage still depends on hardcoded asset geometry plus `contain`
- this produces fragile edge behavior
- mobile and wide desktop are not equally trustworthy

Target:

- no visible left or right gutters at `start`
- no accidental edge slivers during `mid`
- no messy clipped corners at `end`

### 5. Fragment choreography is too loud

Current problem:

- fragments pull too much attention away from the bean
- some positions feel random instead of seam-originated

Target:

- fragments should support the split, not compete with it
- they should emerge later, travel less, and stay closer to the seam at first

### 6. Leaf-shadow atmosphere is unbalanced

Current problem:

- top-right shadow dominates the frame
- bottom-left shadow feels clipped and accidental

Target:

- shadows should frame the composition quietly
- they should feel art-directed, not just present

### 7. End-state exit is not clean

Current problem:

- orange slivers remain visible at corners and edges
- giant bean mass clips awkwardly instead of exiting elegantly

Target:

- the loader should leave behind a clean reveal field
- any remaining bean mass at the edge should feel intentional and dramatic

### 8. Reveal destination is too weak

Current problem:

- the loader opens into a generic cream underlay and faint logo
- the payoff feels empty

Target:

- the crack should reveal a believable product world
- even a temporary hero target must feel intentional, not placeholder

## Concrete Change Directives

## A. Geometry And Coverage

Primary files:

- [`src/utils/motionConfig.js`](../src/utils/motionConfig.js)
- [`src/scenes/IntroReveal/IntroReveal.css`](../src/scenes/IntroReveal/IntroReveal.css)
- [`src/scenes/IntroReveal/IntroReveal.jsx`](../src/scenes/IntroReveal/IntroReveal.jsx)

### Required changes

1. Replace fragile panel sizing assumptions.

Current issue:

- panel images use `object-fit: contain`
- group width is driven by a single width scalar

Directive:

- move toward overscanned panel coverage
- panels should be sized and positioned to guarantee full viewport coverage at every breakpoint
- do not rely on `contain` to preserve the reveal edge

2. Recompute local bean placement after coverage changes.

Directive:

- tune `leftBean` and `rightBean` local boxes after panel coverage is corrected
- treat bean alignment as a second-pass solve after panel geometry is trustworthy

3. Introduce breakpoint-specific geometry tuning.

Directive:

- keep seam-anchor architecture
- stop treating desktop geometry as the universal truth
- allow separate composition constants for desktop, compact, and mobile

### Concrete target values to tune first

Start here before deeper refinement:

- increase bean visual size by about `6%` to `10%`
- lower logo by about `12px` to `24px` equivalent at desktop
- move progress line upward by about `28px` to `44px`
- lengthen progress line by about `12%` to `20%`

These are starting directions, not final locked values.

## B. Start-State Closure

Primary files:

- [`src/utils/motionConfig.js`](../src/utils/motionConfig.js)
- [`src/animations/introRevealTimeline.js`](../src/animations/introRevealTimeline.js)

### Required changes

1. Remove visible pre-split offset at `start`.

Current issue:

- `groups.desktop.start.left.xPercent = 0.7`
- `groups.desktop.start.right.xPercent = -0.7`

Directive:

- tune start offsets toward true closure
- the resting state must visually read as one bean
- if microscopic compensation is needed, solve it locally and symmetrically

2. Keep tension without exposing the split.

Directive:

- tension should come from stillness, lighting, and timing
- not from a visible seam gap

## C. Crack Formation

Primary files:

- [`src/scenes/IntroReveal/IntroReveal.css`](../src/scenes/IntroReveal/IntroReveal.css)
- [`src/scenes/IntroReveal/IntroReveal.jsx`](../src/scenes/IntroReveal/IntroReveal.jsx)
- [`src/animations/introRevealTimeline.js`](../src/animations/introRevealTimeline.js)

### Required changes

1. Make the opening feel seam-born.

Directive:

- the opening should begin narrower and become wider
- the viewer should perceive a release from the bean seam, not a static pre-cut opening

2. Do not solve this with a fake center crack layer.

Directive:

- stay within the side-owned reveal model
- if masks or panel clipping are needed, keep them attached to reveal groups rather than adding a center-owned system

3. Reduce the “graphic zig-zag” feeling.

Directive:

- soften the poster-cut read
- preserve organic asymmetry
- make the opening feel more like pressure release than a stencil

## D. Motion Rhythm

Primary file:

- [`src/animations/introRevealTimeline.js`](../src/animations/introRevealTimeline.js)

### Required changes

1. Strengthen the choreography arc.

Target rhythm:

- hold
- fill
- brief completion hold
- soft UI fade
- controlled opening
- intentional midpoint suspension
- stronger surge out

2. Make `startToMid` feel less linear and more authored.

Directive:

- keep the existing timing bucket
- retune visible acceleration inside the same bucket
- opening should feel deliberate first, then more assertive

3. Make `midHold` feel more cinematic.

Directive:

- bean halves should feel locked and heavy
- only fragments may continue subtle drift
- the hold must look intentional, not like the animation paused

4. Clean the final exit.

Directive:

- end travel must fully commit
- avoid almost-offscreen states that leave awkward scraps at corners

## E. Fragment Restraint

Primary files:

- [`src/utils/motionConfig.js`](../src/utils/motionConfig.js)
- [`src/animations/introRevealTimeline.js`](../src/animations/introRevealTimeline.js)

### Required changes

1. Reduce fragment competition.

Directive:

- reduce mid-state spread
- delay the strongest fragment readability slightly
- keep the bean halves as the dominant read at all times

2. Improve seam-origin credibility.

Directive:

- fragment start positions must cluster tighter to the seam
- the first visible movement must feel like break-off, not free-floating debris

3. Rebalance fragment scale hierarchy.

Directive:

- one or two fragments per side may dominate
- the rest should stay secondary

## F. Atmospheric Framing

Primary files:

- [`src/utils/motionConfig.js`](../src/utils/motionConfig.js)
- [`src/scenes/IntroReveal/IntroReveal.css`](../src/scenes/IntroReveal/IntroReveal.css)

### Required changes

1. Recompose both leaf shadows.

Directive:

- top-right should be less visually loud
- bottom-left should either be clearly intentional or reduced enough to stop looking clipped

2. Improve atmosphere without mud.

Directive:

- keep shadows subtle
- prefer cleaner placement and opacity over stronger blur

## G. Reveal Destination

Primary files:

- [`src/App.jsx`](../src/App.jsx)
- [`src/styles/layout.css`](../src/styles/layout.css)

### Required changes

1. Replace the weak placeholder payoff.

Directive:

- the underlay must become a believable reveal target
- even before the full hero is implemented, the crack should open into a more intentional product-world composition

2. Avoid empty cream-field endings.

Directive:

- the reveal should feel rewarding
- the end state should preview desire, not just remove the loader

## Breakpoint-Specific Expectations

## Desktop

Target:

- poster-like calm composition
- broad negative space
- subtle atmosphere
- dramatic but clean split

## Compact

Target:

- preserve desktop composition logic
- keep the bean dominant
- reduce fragment spread before reducing bean authority

## Mobile

Target:

- tighter composition
- shorter visual travel distances
- reduced fragment chaos
- crack width must not overpower the screen
- progress line and logo spacing must be recomposed, not just scaled

## Production Acceptance Criteria

The loader is polished only when all of the following are true:

- `start` reads as one premium composed frame
- no visible seam gap exists at rest
- no left or right gutter appears at `start`
- progress line placement feels intentional and premium
- logo, bean, and line share a strong visual rhythm
- the opening feels born from the seam
- fragments support the bean rather than compete with it
- shadows feel composed and subtle
- `mid` feels like a deliberately held cinematic frame
- `end` does not leave accidental orange scraps or awkward clipped edges
- the reveal lands into a satisfying next-state target
- desktop and mobile both feel designed, not merely scaled

## Implementation Order

Implement in this order:

1. coverage and geometry
2. seam closure at `start`
3. composition retune for logo / bean / progress
4. crack formation quality
5. fragment restraint
6. atmospheric rebalance
7. end-state cleanup
8. stronger reveal destination
9. desktop and mobile final polish

## Review Workflow

Before approving the loader, capture and compare:

- `?introDebug=start`
- live frame around loader fade
- `?introDebug=mid`
- `?introDebug=end`
- live full animation desktop
- live full animation mobile

Polish is not complete until the frozen frames look premium even without motion.
