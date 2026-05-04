# Loader Motion Sequence Fix Plan

## Purpose

This plan covers only the current loader motion-sequence defects visible in live playback.

It does not approve:

- hero redesign
- new assets
- architecture changes outside the intro loader / reveal

The goal is to make the full animation feel cohesive and premium in motion, not just acceptable in frozen debug states.

The implementation target is not only "bug free."
It is one believable physical reveal where:

- one closed bean becomes two side-owned reveal worlds
- the center immediately belongs to the destination world
- fragments read as seam-born debris, not decorative particles
- the whole sequence feels premium, cinematic, restrained, and physical

## Audit Basis

Reviewed:

- `?introDebug=start`
- `?introDebug=mid`
- `?introDebug=end`
- live capture sequence at:
  - `0000ms`
  - `1700ms`
  - `2100ms`
  - `2400ms`
  - `3200ms`
  - `4200ms`
  - `6200ms`

Wide review size:

- `1910x901`

Primary source files:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)
- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)
- [`src/scenes/IntroReveal/IntroReveal.jsx`](../../../src/scenes/IntroReveal/IntroReveal.jsx)
- [`src/scenes/IntroReveal/IntroReveal.css`](../../../src/scenes/IntroReveal/IntroReveal.css)
- [`src/styles/layout.css`](../../../src/styles/layout.css)

## Audit Findings

### 1. Start-to-mid still shows live-sequence flicker / side-space leakage

Frozen `start` looks clean, but live playback still shows instability as soon as the split begins.

Observed in motion:

- early crack frames still expose a left/right light edge read before the split fully commits
- the first visible opening is not fully stable from frame to frame
- the center release reads as a visual swap instead of one continuous structural split

Root cause:

- `start` is compositionally solved, but the first moving frames are not using an equally stable coverage state
- reveal-panel masks, bean halves, and underlay are not fully synchronized during the very first release frames
- `underlay` visibility begins while the orange side-owned world is still visually re-solving

Additional interpretation:

- this is not only a coverage bug
- it is a release-beat ownership problem
- the first moving frames do not preserve start-frame parity closely enough

### 2. Shadows are not tied to the reveal groups

Observed in live playback and `end`:

- shadows remain on screen after the side-owned reveal elements have left
- they do not travel with the same authored motion as the reveal groups
- they read like scene overlays instead of part of the left/right orange world

Root cause:

- shadows were moved to viewport anchoring, which improved still composition
- but they are still animated as independent scene elements rather than belonging to the left and right reveal motion systems

Consequence:

- shadow placement is cleaner at rest but physically disconnected in motion
- this weakens the feeling that the orange sides are coherent worlds

### 3. Bean halves still show a visible orange frame/fill when separation begins

Observed clearly in the first split frames:

- each bean half appears to sit inside a faint orange rectangle
- the right bean especially shows a visible panel/fill block behind it

Root cause:

- the panel field is now correctly masked, but the local panel area behind each bean is still readable during early separation
- bean image local bounds and panel mask visibility are still too tightly coupled
- the panel world around the bean has not yet been reduced enough at crack onset

Additional interpretation:

- this is not just a rectangle artifact
- it is supporting panel field contamination behind the bean silhouette

### 4. Bean / loader vertical composition is too high for the scale-up path

Observed in motion:

- as the beans scale up and exit, the dominant mass rises too high in the viewport
- the scale-up reads like it is climbing toward the top instead of exploding from the center

Root cause:

- bean, seam, and progress-line composition is currently centered slightly too high for the end-motion arc
- end scaling increases size, but the visual center of mass is not low enough to keep the surge centered

### 5. Crack opening still delays the cream reveal

Observed around the first visible split:

- when the bean starts separating, the center does not immediately read as the hero/cream destination
- orange still occupies the central reveal moment too long

Root cause:

- the reveal panels are still visually dominant in the crack zone during the first separation frames
- underlay timing is improved from before, but not yet immediate enough relative to crack onset

Additional interpretation:

- the viewer should read "opening into the next scene" before reading "orange panels moving apart"
- right now center ownership flips too late

### 6. Fragment choreography is still too synthetic

Observed in live sequence:

- fragments do not feel born from the crack at the exact moment of release
- they either appear too suddenly or are already too far along their path by the time the eye notices them
- the burst feels staged rather than organic

Root cause:

- fragment motion begins as a tween timed against the main split, but not yet with the right onset and spread curve
- fragments move through the start-to-mid phase too quickly relative to the bean opening
- there is not enough staged emergence:
  - first break-off
  - then outward acceleration
  - then side-owned drift

Additional interpretation:

- fragments are currently too decorative
- they must read as structural debris born from the seam

### 7. Overall sequence is still too fast for the desired premium feel

Observed in full playback:

- the motion technically works, but the sequence still feels too eager and slightly budget-animation-like
- the eye does not get enough time to register the bean release, fragment burst, hold, and surge as one authored sequence

Root cause:

- current timing buckets are still too compressed for the desired cinematic feeling
- `startToMid`, `midHold`, and `midToEnd` need a global slowdown and rebalancing, not just isolated easing edits

Target direction:

- make the full sequence roughly `20%` slower overall

Important qualifier:

- do not apply a flat blanket slowdown
- reallocate time by beat so the sequence gains continuity and tension instead of just becoming longer

### 8. The reveal still lacks a believable world transition

Observed in live playback:

- the sequence still reads as layered assets coordinating instead of one object becoming two side worlds and a revealed destination world
- this is why the loader can look acceptable in debug states but still feel wrong in motion

Root cause:

- ownership is split across scene overlays, side groups, and destination underlay without a strict motion ownership contract
- the code structure mirrors that ambiguity

## Motion Ownership Contract

All implementation work in this pass must preserve one clear ownership model:

- `loader chrome`: logo + progress line
- `left reveal world`: left panel + left bean + left fragments + left shadow
- `right reveal world`: right panel + right bean + right fragments + right shadow
- `destination world`: cream reveal field

Rules:

- every moving element must belong to exactly one of these ownership buckets
- no element that visually belongs to a reveal side may be animated as an unrelated scene overlay
- the first readable seam opening must behave like a transfer from one closed object into three ownership zones:
  - left world
  - right world
  - destination world

## Motion Beat Map

This pass must treat the sequence as four authored beats, not a loose list of defects:

1. `pre-release`
   - closed bean
   - stable orange world
   - no visible ownership mismatch
2. `release`
   - crack begins
   - center ownership flips to destination
   - fragments break off from the seam
   - bean halves begin separating with the same release impulse
3. `open-hold`
   - the split reaches readable width
   - fragments still carry visible energy
   - the hold retains tension rather than feeling paused
4. `surge-exit`
   - side worlds accelerate outward with continuity
   - scale-up intensifies through the middle of the viewport
   - side-owned atmosphere and debris leave with their world

Motion hierarchy for all four beats:

- primary motion: bean split
- secondary motion: destination reveal
- tertiary motion: fragments
- atmospheric motion: shadows, logo fade, progress disappearance

## Scope-Locked Implementation Plan

Implementation rules:

- prefer simplifying ownership and timeline responsibility over adding more compensating offsets, opacity patches, or one-off timing constants
- no new visual tuning constants should be introduced until ownership cleanup is complete unless a blocker is proven

### Phase 0. Loader ownership simplification pass

Files:

- [`src/scenes/IntroReveal/IntroReveal.jsx`](../../../src/scenes/IntroReveal/IntroReveal.jsx)
- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)
- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)

Work:

- define the canonical side-owned element set for each reveal side in code
- move or formally associate shadows with their owning side
- remove ambiguous or dead geometry branches that no longer participate in rendering
- clarify which values are:
  - layout geometry
  - motion poses
  - decorative poses
  - debug behavior
- reduce duplicated ownership logic before further tuning

Acceptance:

- every moving element belongs to either `left reveal world`, `right reveal world`, `destination world`, or `loader chrome`
- no element that should travel with a side is rendered outside that side's ownership model
- no unused bean geometry path remains in active config
- render ownership for side elements is explainable in one short paragraph

Implementation-order note:

- if this phase reveals that current DOM structure is the source of Phases 1 to 3, perform the minimal JSX ownership cleanup first, then continue with visual tuning

### Phase 1. Release beat unification pass

Files:

- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)
- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)
- [`src/scenes/IntroReveal/IntroReveal.css`](../../../src/scenes/IntroReveal/IntroReveal.css)

Work:

- stabilize the first visible split frames so `start` and the first moving frames share the same closure logic
- unify crack onset, cream reveal onset, fragment ignition, and bean separation into one authored release beat
- eliminate any side-space leakage during crack onset
- ensure there is no visible orange/cream coverage jitter in the first separation beat
- ensure no sub-element visually finishes far ahead of the main split during this beat

Acceptance:

- no left/right white or cream slivers appear during crack onset
- first visible release reads continuous, not flickery
- the first visible moving frame is visually equivalent to `start` except for intentional seam separation
- no new coverage, tint, or ownership change appears during crack onset
- the center reads as destination cream on the first readable crack frame
- opacity does not read as a visible swap mechanism

### Phase 2. Side-owned atmosphere pass

Files:

- [`src/scenes/IntroReveal/IntroReveal.jsx`](../../../src/scenes/IntroReveal/IntroReveal.jsx)
- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)
- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)

Work:

- reattach left and right leaf shadows to the side-owned reveal motion
- formalize decorative ownership expectations for:
  - shadows
  - fragments
  - panel-mask atmosphere
- keep the corner composition, but make each decorative element travel and exit with its owning side
- prevent shadows from lingering after the reveal groups are gone

Acceptance:

- bottom-left shadow belongs to the left reveal side
- top-right shadow belongs to the right reveal side
- both leave with the orange reveal world
- all decorative elements that visually belong to a side use the same movement parent or an equivalent ownership contract

### Phase 3. Bean / panel identity cleanup

Files:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)
- [`src/scenes/IntroReveal/IntroReveal.jsx`](../../../src/scenes/IntroReveal/IntroReveal.jsx)

Work:

- reduce or eliminate the visible local orange panel rectangle behind each bean half
- eliminate supporting panel field contamination behind the bean silhouette
- retune local bean placement and panel visibility relationship during crack onset
- keep the seam edge but remove the "bean inside a box" look
- prefer reducing panel/bean coupling through ownership and layering changes before adding more crop offsets

Acceptance:

- no visible orange frame/fill block around the bean during separation
- no supporting panel field reads as a separate rectangular or tinted object behind either bean half during first release, mid, or surge frames

### Phase 4. Vertical composition and scale-center pass

Files:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)

Work:

- move bean / progress composition slightly lower
- keep the scale-up centered more in the middle of the viewport
- increase end-scale further so the surge feels more dramatic
- preserve velocity continuity into the surge so the larger scale-up reads as the same event, not a new one

Acceptance:

- scaling reads as exploding through the middle of the screen
- end surge feels larger and more cinematic than current

### Phase 5. Immediate cream reveal pass

Files:

- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)
- [`src/scenes/IntroReveal/IntroReveal.css`](../../../src/scenes/IntroReveal/IntroReveal.css)

Work:

- make the hero/cream destination visible at the exact beginning of the separation
- reduce the orange-delay between crack onset and destination reveal
- preserve the side-owned orange walls without letting them occupy the center too long
- treat this as a world-replacement problem, not only an underlay timing tweak

Acceptance:

- as soon as the bean cracks, the center reads as cream, not orange
- on the first frame where the seam gap is readable, the center already belongs to the destination world

### Phase 6. Fragment explosion choreography pass

Files:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)
- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)

Work:

- start fragment emergence immediately with crack onset
- make the initial burst read as break-off rather than teleport
- stage fragment motion as:
  - break-off
  - outward acceleration
  - side-owned drift
- slow the fragment path so it feels organic and synchronized with the bean opening
- preserve outward energy while avoiding rushed travel
- ensure fragments are still carrying visible energy when the bean halves reach MID

Acceptance:

- fragments appear immediately with the crack
- movement feels organic, not mechanical or rushed
- fragments support the split as one event
- fragments originate visually from the seam
- fragments clear the bean edge before becoming fully legible
- fragments never read as stickers hovering over the bean face

### Phase 7. Beat reallocation and tempo pass

Files:

- [`src/utils/motionConfig.js`](../../../src/utils/motionConfig.js)
- [`src/animations/introRevealTimeline.js`](../../../src/animations/introRevealTimeline.js)

Work:

- slow the whole loader about `20%`
- rebalance:
  - `loaderFill`
  - `loaderCompleteHold`
  - `startToMid`
  - `midHold`
  - `midToEnd`
- keep the cinematic arc while giving the eye more time to register each beat
- preserve beat hierarchy:
  - crack release
  - fragment read
  - brief breath
  - surge
- preserve velocity continuity across:
  - `startToMid`
  - `midHold`
  - `midToEnd`

Acceptance:

- sequence feels immersive and premium
- hold and surge read intentionally, not hurried
- the hold retains stored tension; no major element looks fully finished during hold
- the sequence reads as one continuous physical event, not three adjacent tweens
- no dead zones appear during slowed playback

## Verification Requirements

Must review:

1. `?introDebug=start`
2. `?introDebug=mid`
3. `?introDebug=end`
4. live motion captures at:
   - first visible crack
   - first cream-readable frame
   - first visible fragment emergence
   - first fragment-clear frame
   - full open / hold
   - surge-initiation beat
   - mid-to-end surge
   - last frame with orange world visible
   - final exit

Required widths:

- `1910x901`
- `1440x900`
- `390x844`

Required playback modes:

- normal speed
- slowed review at `0.25x` or equivalent

Required slow-playback checks:

- first-frame parity
- center-world ownership
- fragment clearance from bean silhouette
- shadow exit with side worlds
- absence of tinted support fields behind beans
- energy continuity with no dead tail in `startToMid`

## Definition Of Done

This pass is complete only when:

- no side-space leakage appears during live crack onset
- no visible flicker remains in the first moving frames
- shadows move with their reveal side and fully leave the scene
- no orange panel-fill box is visible behind the bean halves
- crack opening immediately reveals the cream destination
- fragments burst immediately but move organically
- the bean surge is lower-centered and larger
- the entire sequence feels about `20%` slower and more premium
- the reveal reads as one believable object becoming two side worlds plus a destination world

## Maintainability Acceptance

This pass is not complete if it improves visuals by making the loader harder to reason about.

Must preserve:

- no duplicated left/right motion logic is introduced
- no new unused geometry keys are added
- the next loader tweak should be possible without editing both sides in separate code blocks unless the assets truly differ
- ownership and timeline responsibilities become easier to explain, not harder
