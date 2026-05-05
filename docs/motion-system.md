# Motion System

## Motion Goal

The motion language should feel premium, cinematic, soft, and intentional. Motion should guide attention, carry the story between scenes, and reinforce product importance.

For the intro specifically, motion must read as a physical reveal born from the bean seam and side-owned reveal groups, not as a crack-mask trick or an opacity-led reveal.

## Motion Hierarchy

`Locked`:

- hero object motion is the slowest and most authoritative
- supporting product motion is coordinated but secondary
- sticker and accent motion is shorter, later, and subordinate unless a scene-specific exception is explicitly approved
- scene transition motion is structural and editorial, not decorative
- intro reveal-group motion is the structural driver of the intro

Approved exception for the current hero reveal:

- the mascot badge may join the synchronized hero reveal timing when needed to preserve the approved loader-to-hero handoff and final poster composition

## Allowed Motion Types

- fade
- translate
- scale
- rotate
- wipe reveal
- pinned or sticky scroll transitions

For the intro, the preferred reveal mechanism is physical reveal-group separation aligned to the bean seam.

## Motion To Avoid

- large bounce
- cartoon-like spring behavior
- random timing offsets
- noisy looping motion
- effects that compete with the featured product
- full-bean-swap reveal logic
- separate central crack-layer storytelling
- underlay-opacity-led hero reveal
- blur-heavy effects that make objects unreadable

## Trigger Model

`Locked`:

- intro sequence: time-based
- hero entrance: time-based
- freshness transition: scroll-based

`Locked` hero reveal synchronization for the current v1 hero:

- the hero reveal begins when the loader enters `midToEnd`
- the hero reveal finishes when loader `midToEnd` finishes
- hero reveal must not wait for `introComplete`
- the current static hero layout remains the final end state

## Intro Sequence Decisions

`Locked`:

- the loading indicator is theatrical, not tied to real asset streaming progress
- the intro should feel held and deliberate rather than fast
- the intro must use side-owned reveal groups as the main moving units
- left and right reveal groups are the visual source of truth during the intro
- the reveal should feel like the next scene emerges from inside the bean / crack
- `loader.md` owns intro-specific timing buckets, easing defaults, and tuning guidance within the source-of-truth scope

`Locked`:

- each reveal group contains its reveal panel SVG, matching bean half, and assigned fragments
- bean halves must not animate on a separate motion system after initial local alignment
- parent reveal groups and their child bean halves must move and scale together through `start`, `mid`, and `end`

`Locked`:

- subtle leaf-shadow atmosphere is part of the approved intro target
- fragments are part of the approved intro target

`Preferred`:

- the progress line should fade before reveal-group separation becomes dominant
- the reveal should feel like a camera push-in, not only lateral motion

## Intro Visual Model

### Start

`Locked`:

- full orange loader screen
- centered white logo
- visible progress line
- centered bean formed by the two reveal groups meeting cleanly
- no visible seam gap
- no visible side gutters
- subtle leaf shadows in the background
- fragments hidden behind or near the seam / bean area

### Mid

`Locked`:

- loader UI is gone
- logo is gone or nearly gone
- the crack is clearly open from top to bottom
- reveal groups are visibly separated
- bean halves are larger than at `start`
- fragments are visible and drifting subtly from the seam area

Mid should read as a controlled opening beat, not yet the final full reveal.

### End

`Locked`:

- reveal groups are far enough apart to expose the next scene or placeholder reveal state
- reveal-group motion remains the main reveal effect
- fragments exit with their side
- the bean halves feel extremely large before leaving frame

Target end feeling:

- visible bean mass approaches roughly `80%` of viewport height before full exit

## Section Timing Direction

### Intro Sequence

`Locked`:

- phase names and sequencing should follow [`loader.md`](./loader.md) and [`loader-refinement-plan.md`](./loader-refinement-plan.md)
- `initialHold` is about `300ms`
- `loaderFill` is about `1000ms` or slightly longer
- `loaderCompleteHold` is about `500ms`
- `startToMid` is about `1550ms`
- `midHold` is about `600ms`
- `midToEnd` is about `2000ms`

`Preferred`:

- progress line fades before the split becomes dominant
- the reveal should breathe rather than rush
- the midpoint should feel intentionally held before the final exit

## Scene Motion Responsibilities

### Intro Sequence

Owns:

- progress indicator timing
- logo fade
- reveal-group separation
- reveal-group scale-up
- side-owned bean motion through parent groups
- fragment emergence and side-assigned drift
- subtle leaf-shadow coordination when needed

Does not own:

- full-bean swap choreography
- separate crack-mask storytelling
- independent bean-half drift after local alignment
- opacity-led substitute reveal logic

### Hero Composition

Owns:

- cup entrance choreography
- sticker entrance choreography
- headline and CTA reveal

### Freshness Transition

Owns:

- hero handoff out of view
- orange cup pin and reposition
- reveal of the first freshness panel

## Motion Ownership Rules

`Locked`:

- parent reveal groups are the main split/reveal drivers
- child bean halves inherit transform and scale from their parent groups
- fragments are assigned by side and support the split rather than replacing it
- bean halves must not visually drift off their parent motion track

## Easing Direction

`Locked`:

- intro easing should support physical authored group motion
- avoid generic default easing
- avoid springy or playful snap

`Preferred`:

- loader fade should feel soft but decisive
- `startToMid` should emphasize controlled widening
- `midToEnd` should support confident cinematic reveal completion
- fragment motion should feel slow-motion and premium during the hold, not chaotic

Implementation-level easing defaults live in [`loader.md`](./loader.md).

## Coverage And Scale Direction

`Locked`:

- intro reveal groups must visually cover the viewport at `start`
- no side gutters may appear at `start`
- the opening must read top-to-bottom across the viewport
- scaling and travel should stay synchronized

Responsive planning must treat coverage and visual mass as first-class motion requirements.

## Blur And Readability Direction

`Preferred`:

- use blur on fragments only if it improves realism on faster exits
- blur should be directional, subtle, and speed-related
- moving objects should remain recognizable
- prefer stronger transform timing, scale coordination, and easing before adding blur

## Reduced Motion

`Locked`:

- intro should simplify to line fill, short hold, line fade, logo fade, gentler crack opening, and softer reveal-group departure
- hero or placeholder reveal should still appear because the opening moves away
- fragment treatment may be simplified but should not contradict the side-owned model

Reduced motion must still avoid:

- full-bean swap
- separate bean-half motion tracks
- fake central crack layers

## Cross-Doc Rule

If these docs differ on the intro:

- [`loader-refinement-plan.md`](./loader-refinement-plan.md) wins for intro architecture and scope
- this file wins for high-level motion intent
- [`loader.md`](./loader.md) wins for intro-specific implementation guidance inside the approved scope
