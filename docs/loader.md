# Loader Technical Spec

## Purpose

This document translates [`loader-refinement-plan.md`](./loader-refinement-plan.md) into implementation-ready intro guidance.

`loader-refinement-plan.md` remains the primary source of truth.

This file clarifies:

- intro DOM planning
- group contents
- geometry responsibilities
- timing defaults
- motion ownership
- implementation tuning expectations

## Status

- `Locked`: [`loader-refinement-plan.md`](./loader-refinement-plan.md) is the source of truth
- `Locked`: the intro remains side-owned and group-first
- `Locked`: the richer visual target now includes leaf shadows and seam-origin fragments
- `Locked`: do not preserve crack-mask, full-bean-swap, independent-bean-motion, or fake-underlay-reveal assumptions

## Approved Group-First Architecture

The intro is built around two parent reveal groups:

- left reveal group
- right reveal group

Those are the main moving units.

After local alignment:

- the left bean half moves only with the left reveal group
- the right bean half moves only with the right reveal group

Supporting elements may animate independently only when approved:

- left and right fragments
- subtle background leaf shadows

## Group Contents

Each reveal group contains:

- its reveal panel SVG
- its matching bean half
- its assigned fragments

That means:

- left group = `left-reveal.svg` + `coffeeBean-left.webp` + 4 left fragments
- right group = `right-reveal.svg` + `coffeeBean-right.webp` + 4 right fragments

Scene-level supporting elements:

- top-left / bottom-left leaf shadow where appropriate to match the approved art direction
- top-right leaf shadow
- logo
- progress line

Do not add:

- centered full-bean overlays
- separate crack slabs
- center-owned seam stroke layers

## DOM Planning Model

The intended intro DOM should include:

- intro root
- intro stage
- logo
- progress line
- left background leaf shadow
- right background leaf shadow
- left reveal group
- right reveal group

Inside the reveal groups:

- reveal panel
- bean half
- assigned fragments

## Geometry Rules

### Base geometry model

`Locked`:

- geometry is driven by seam-anchor math
- scale is based on viewport height
- bean alignment is solved once locally inside each reveal group
- fragment spawn points are solved relative to the seam / bean area
- parent reveal groups are then positioned in viewport space

### Coverage rule

`Locked`:

- intro must visually cover the full viewport at `start`
- no empty left gutter may appear
- no empty right gutter may appear
- the opening must read from top to bottom of the viewport during the split

Height-based scaling is the base rule, but final placement and sizing must still satisfy full-width coverage.

### Start-state composition targets

Implementation should tune toward:

- smaller bean than the current live version
- logo slightly lower and compositionally calmer than the current live version if needed
- longer progress line, placed closer to the bean than in the current live build
- visible but subtle leaf shadows

### Prohibited geometry shortcuts

Do not use:

- full-bean overlap hacks
- shell-overlap percentage hacks
- centered overlay compensation
- independent bean X/Y drift as motion logic

## Motion Buckets

Keep these bucket names:

1. `initialHold`
2. `loaderFill`
3. `loaderCompleteHold`
4. `loaderFade`
5. `startToMid`
6. `midHold`
7. `midToEnd`

These names remain the config and QA vocabulary.

## Timing Defaults

### Locked timing targets

- `initialHold`: about `300ms`
- `loaderFill`: about `1000ms` or slightly longer
- `loaderCompleteHold`: about `500ms`
- `startToMid`: about `1550ms`
- `midHold`: about `600ms`
- `midToEnd`: about `2000ms`

### Easing defaults

Approved implementation defaults:

- `loaderFade`: `cubic-bezier(0.23, 1, 0.32, 1)`
- `startToMid`: `cubic-bezier(0.5, 0, 0.2, 1)`
- `midToEnd`: `cubic-bezier(0.5, 0.1, 0.5, 1)`

If tuning is needed later, preserve the same motion intent:

- loader fade feels soft but decisive
- `startToMid` feels controlled, authored, and connected
- `midToEnd` feels cinematic and confident, not chaotic

## Motion Choreography

### Start

`Locked`:

- full orange cover fills the viewport
- logo visible
- progress line visible
- bean reads as one object
- no visible seam gap
- no visible side gutters
- fragments hidden
- leaf shadows visible but subtle

### Start To Mid

`Locked`:

- progress line fills and fades first
- logo fades out during this phase
- the full-height crack begins after loader fade
- reveal groups separate visibly, not timidly
- reveal groups and child bean halves scale up together
- fragments emerge from behind / near the seam
- left fragments move outward left
- right fragments move outward right

This phase must feel like:

- a widening opening
- a shared camera push-in
- one synchronized authored event

It must not feel like:

- unrelated object motion
- random particles
- a fake opacity reveal

### Mid Hold

`Locked`:

- bean halves and reveal groups pause
- fragments continue a subtle, slow-motion drift if needed
- the frame should still read mostly as the orange intro world

### Mid To End

`Locked`:

- reveal groups continue moving off their side
- fragments exit with their assigned side
- coordinated scale-up continues
- no fade-out substitute drives the reveal

The key target here is visual mass:

- when the bean halves are the last major intro elements still inside frame, they should feel roughly around `80%` of viewport height / visual mass

Ignore final production hero composition fidelity for this phase of implementation if needed.

The loader may reveal a placeholder end state first, as long as the reveal mechanics and scale/travel behavior are correct.

## Motion Ownership Rules

`Locked`:

- parent reveal groups are the main split/reveal drivers
- child bean halves inherit transform and scale from their parent groups
- fragments support the reveal but remain assigned to their side
- bean halves must not animate independently once locally aligned

## Reduced Motion

Reduced motion should keep the same structural truth in simpler form:

- line fill
- shorter hold
- line fade
- logo fade
- gentler crack opening
- reduced fragment travel or simplified fragment treatment
- softer reveal completion

Reduced motion should not depend on:

- full-bean swap
- separate bean-half drift
- fake central crack systems

## Visual Acceptance Criteria

### Start

- full orange cover fills the viewport
- no visible side gutters
- centered bean reads as one object
- no seam gap
- subtle leaf shadows are present
- logo position feels aligned to the target composition
- progress line length and placement feel closer to the approved reference than the current live build

### Mid

- loader UI is gone
- crack is clearly readable from top to bottom
- groups are separated enough to feel intentional
- fragments are visible and seam-originated
- bean halves are stable during the hold

### End

- reveal groups and their assigned elements have traveled far enough apart
- visible bean mass is large before exit
- the reveal feels like the next scene appears from inside the bean

## Manual Tuning Expectations

The next implementation pass should expect visual tuning in:

- seam-anchor constants
- local bean placement inside each reveal group
- fragment spawn positions
- fragment drift distances and rotations
- width compensation needed to prevent side gutters
- logo vertical offset
- progress line width and vertical offset
- per-breakpoint travel distances
- end-state scale targets
- easing refinement around the approved defaults

## Relationship To Other Docs

- [`loader-refinement-plan.md`](./loader-refinement-plan.md) is the primary intro architecture source
- [`motion-system.md`](./motion-system.md) owns the higher-level motion intent
- this file owns intro-specific implementation guidance inside the approved scope
