# Intro Reveal Rebuild Plan

## 1. Purpose

This document is the primary source of truth for the intro loader / reveal rebuild.

It replaces the stripped-down first-pass plan.

Use it to:

- define the approved intro architecture
- define the approved visual states
- define the approved motion timing and sequencing
- define which systems must be removed from the current code
- define what the next implementation pass must build

If this document conflicts with earlier intro assumptions, this document wins.

## 2. Status

- `Locked`: do not use the current live intro as design truth
- `Locked`: do not return to the old full-bean-swap model
- `Locked`: do not return to a procedural crack-mask or central crack layer model
- `Locked`: the intro must remain side-owned and group-first
- `Locked`: richer intro atmosphere and fragment behavior are now part of the approved target

Approved reveal-group ownership:

- `leftRevealGroup = left-reveal.svg + coffeeBean-left.webp`
- `rightRevealGroup = right-reveal.svg + coffeeBean-right.webp`

Each bean half must still live only inside its matching reveal group.

After initial local alignment:

- bean halves must not animate independently from their reveal groups
- reveal groups remain the main moving units

## 3. Approved Architecture

The intro is a side-owned reveal system with supporting atmosphere and fragment layers.

Core moving units:

- left reveal group
- right reveal group

Supporting intro elements:

- white logo
- progress line
- two subtle coffee leaf shadow assets in the background
- four left-side fragments
- four right-side fragments

The crack is not a separately animated DOM layer.

Instead:

- the left and right reveal panel SVGs already define the crack edges
- the crack appears because the two reveal groups separate from a seam-aligned closed state
- the opening must read from full viewport height, not just around the bean

## 4. Group Contents

Each reveal group contains:

- its reveal panel SVG
- its matching bean half
- its assigned fragments

Supporting atmosphere that does not need to be parented inside the reveal groups:

- left leaf shadow
- right leaf shadow

Optional seam-light treatment is allowed if needed to match the approved visuals, but it must remain visually attached to its side and must not create a separate center-owned crack system.

Do not add:

- centered full-bean overlays
- full-bean to split swaps
- separate crack slabs
- procedural crack drawing
- seam compensation overlays

## 5. Start State

### Approved visual state

- full-screen warm orange loader background
- white logo visible near the top center
- centered bean formed by the left and right bean halves inside the reveal groups
- bean halves align cleanly so they read as one complete bean
- the seam aligns naturally with the bean edges
- left and right reveal groups fully cover the viewport with no side gutters
- two subtle leaf shadow assets are visible in the background
- fragments are hidden behind or very near the seam/bean area
- progress line is visible below the bean

### Approved motion state

- intro holds static for about `300ms`
- progress line fills over about `1000ms` or slightly longer
- progress line remains complete for about `500ms`
- progress line fades out
- only after loader fade does the split begin

## 6. Start To Mid

This is the opening beat from a closed bean into a clearly readable crack.

### Approved visual behavior

- a cream / white vertical opening appears from top to bottom of the viewport
- the opening aligns with the bean seam
- the opening widens progressively
- bean halves separate slightly and scale with the reveal groups
- fragments emerge from behind / near the bean seam
- left fragments drift outward to the left
- right fragments drift outward to the right
- leaf shadows remain visible as quiet atmosphere

### Approved motion behavior

- duration target: about `1550ms`
- easing target: `cubic-bezier(0.5, 0, 0.2, 1)`
- all main elements should feel synchronized
- reveal groups and their child bean halves must scale progressively during this phase
- the feeling should be a camera push-in, not a static split

### Locked motion ownership

- parent reveal groups drive the split
- bean halves inherit parent movement and scale
- fragments may animate independently, but only as supporting accent motion tied to the seam-origin reveal

## 7. Mid State

### Approved visual state

- the crack is clearly open
- bean halves are noticeably separated
- bean halves are larger than at `start`
- fragments are visible on both sides
- the overall frame still reads primarily as orange intro art, not yet a full hero scene

### Approved hold behavior

- hold for about `600ms`
- bean halves pause and feel stable
- reveal groups pause
- fragments may continue slow floating motion for about `500ms` to `1000ms`

### Important rule

- bean halves must not jitter, wander, or continue drifting during the hold
- only fragments may continue subtle motion

## 8. Mid To End

### Approved visual behavior

- the central opening becomes progressively larger
- left-side content exits left
- right-side content exits right
- left bean half exits with the left reveal group
- right bean half exits with the right reveal group
- left fragments exit with the left side
- right fragments exit with the right side
- leaf shadows may move, scale, or fade in a coordinated way
- the scene continues scaling up

### Approved motion behavior

- duration target: about `2000ms`
- easing target: `cubic-bezier(0.5, 0.1, 0.5, 1)`
- movement and scaling must remain synchronized
- there is no fade-out substitute for the reveal

### End visual goal

- when the last visible part of the bean halves is still inside frame, each visible half should feel extremely large
- target visual mass is roughly `80%` of viewport height
- the reveal should feel like the next scene emerges from inside the bean / crack itself

For now, the intro may reveal a placeholder end state instead of the final production hero, but the reveal mechanism must already be correct.

## 9. Geometry Model

Each group needs:

- panel dimensions
- bean dimensions
- seam anchor
- bean local X/Y
- fragment spawn positions relative to the seam

### Locked local alignment rule

- each bean half is aligned once locally inside its group
- the bean half must visually touch / follow the crack edge at `start`
- after that, GSAP must not animate bean X/Y separately

### Coverage rule

- reveal groups must visually cover the full viewport at `start`
- no left gutter
- no right gutter
- the crack must read as full viewport height during opening

### Required runtime positioning model

- seam-anchor positioning remains the approved base
- viewport-height scaling remains the approved base
- if extra horizontal compensation is needed for coverage, solve it in the reveal-group geometry system

Do not solve coverage with:

- centered overlay hacks
- independent bean drift
- shell overlap tricks

## 10. Fragment Model

Fragments are now approved and required.

### Count

- `4` fragments on the left
- `4` fragments on the right

### Spawn behavior

- fragments begin hidden at `start`
- they originate from behind or very near the central bean seam
- they should not appear randomly from elsewhere on the screen

### Motion behavior

- emerge after loader fade as the crack opens
- drift outward with their assigned side
- hold subtle floating motion during `midHold`
- exit with their assigned side during `midToEnd`

### Visual quality

- keep fragments readable
- use motion blur only if it improves realism on faster exits
- blur must be subtle, directional, and speed-related
- prefer transform, timing, and scale quality over constant blur

## 11. Timeline Rules

Keep these buckets:

1. `initialHold`
2. `loaderFill`
3. `loaderCompleteHold`
4. `loaderFade`
5. `startToMid`
6. `midHold`
7. `midToEnd`

### Locked sequencing rules

- `initialHold` is about `300ms`
- `loaderFill` is about `1000ms` or slightly longer
- `loaderCompleteHold` is about `500ms`
- progress line fades before the split begins
- the full-height crack begins only after loader fade
- `startToMid` targets about `1550ms`
- `midHold` targets about `600ms`
- `midToEnd` targets about `2000ms`

### Approved easing defaults

- `startToMid`: `cubic-bezier(0.5, 0, 0.2, 1)`
- `midToEnd`: `cubic-bezier(0.5, 0.1, 0.5, 1)`

These are strong guides and may be tuned only if the result becomes more cohesive.

## 12. Systems To Delete

Delete these from the implementation:

- centered full-bean overlay shell
- full-bean to split swap choreography
- independent bean-half motion after local alignment
- old crack-mask systems
- separate central crack layers
- seam compensation hacks
- early underlay fade as the main reveal
- duplicate stacked reveal systems

Delete these assumptions from planning:

- fragments being out of scope
- leaf-shadow atmosphere being out of scope
- end-scale needing to remain slight

## 13. Systems To Keep

Keep these:

- top-level intro overlay mount pattern
- GSAP timing bucket structure
- centered logo structure
- progress line structure
- side-owned reveal-group architecture
- debug state model: `start`, `mid`, `end`, `null`
- reduced-motion support
- seam-anchor geometry approach

## 14. Debug State Rules

Debug states must freeze real intro poses.

### `start`

- loader visible
- logo visible
- progress line visible
- reveal groups closed
- no side gutters

### `mid`

- loader gone
- logo gone or nearly gone
- crack clearly open
- groups modestly but visibly separated
- fragments visible

### `end`

- reveal groups far apart
- fragments exiting or gone with their side
- placeholder or real reveal state visible through the opening

Debug mode must not rely on fake overlays or alternate geometry systems.

## 15. Reduced Motion Rules

Reduced motion should preserve the same architectural truth in simpler form:

- line fill
- short hold
- line fade
- logo fade
- gentler group separation
- simplified fragment behavior or reduced fragment travel
- late reveal

Reduced motion must still avoid:

- full-bean swap
- separate bean-half motion tracks
- fake central crack layers

## 16. Acceptance Criteria

The next implementation pass is successful only if all of these are true:

- `start` shows one centered bean with no visible gap
- `start` shows no visible side gutters
- leaf shadows are visible but subtle
- progress line placement and length match the intended composition better than the current live build
- the crack opens from full viewport height
- `startToMid` feels cohesive and synchronized
- fragments emerge from the seam area, not randomly
- `mid` is clearly readable and intentionally held
- reveal groups and their child elements move and scale together
- `midToEnd` grows the reveal aggressively enough that the bean halves feel huge at exit
- the reveal reads as the next scene appearing from inside the bean
- no old crack-mask, full-bean-swap, or fake-opacity-reveal system remains active
