# Implementation Phases

## Phase 1: Infrastructure

### Goal

Create the scaffold and documentation source of truth.

### Deliverables

- Vite + React app shell
- docs set
- scene/component/animation/style folder structure

### Definition Of Done

- scaffold exists
- docs are coherent and current
- no production scenes are implemented yet

## Phase 2: Design System

### Goal

Turn the visual direction into an implementable ruleset.

### Deliverables

- named color tokens
- font choice
- spacing and type scale
- layer rules
- responsive simplification rules

### Prerequisites

- Phase 1 complete

### Definition Of Done

- future agents can style the hero without inventing the system from scratch

## Phase 3: Intro Sequence

### Goal

Build the loader stage and reveal-ready structure.

### Deliverables

- intro scene component
- centered bean, logo, and loading line
- atmosphere layer structure
- reveal-ready DOM layering

### Prerequisites

- Phase 2 complete
- dependencies installed

### Definition Of Done

- intro visuals render correctly
- no hero reveal animation yet
- bean and tear layers are prepared for choreography
- `docs/loader.md` should be treated as spanning both this phase and Phase 5: this phase builds the DOM, assets, and config-ready structure only

## Phase 4: Hero Composition

### Goal

Build the main premium product composition behind the intro.

### Deliverables

- hero scene component
- floating cup layout
- headline and CTA block
- brand header chrome
- sticker placement

### Prerequisites

- Phase 2 complete

### Definition Of Done

- hero composition works as a static scene
- the orange cup is visually identified as the featured transition cup

## Phase 5: Connect Intro To Hero

### Goal

Implement the cinematic handoff from intro sequence to hero composition.

### Deliverables

- bean split animation
- crack/reveal opening animation
- hero entrance choreography
- GSAP timeline connection between scenes

### Prerequisites

- Phases 3 and 4 complete

### Definition Of Done

- intro transitions cleanly into hero
- the choreography feels premium and controlled
- reduced-motion fallback exists
- completes the authored motion sequence defined in `docs/loader.md`, including the keypoint hold and hero handoff timing

## Phase 6: Freshness Transition

### Goal

Carry the featured orange cup into the first freshness panel using scroll.

### Deliverables

- pinned transition behavior
- hero handoff out of frame
- first freshness section shell
- first freshness typography and copy block

### Prerequisites

- Phase 5 complete

### Definition Of Done

- the orange cup remains visually continuous between scenes
- the first freshness panel is visible and readable
- the scroll experience feels rewarding rather than blocking

## Phase 7: Polish

### Goal

Refine motion, responsiveness, and performance.

### Deliverables

- motion timing polish
- mobile simplification pass
- performance review
- asset loading review

### Prerequisites

- Phase 6 complete

### Definition Of Done

- the experience feels cohesive on desktop and mobile
- obvious motion rough edges are resolved
- non-essential visual clutter is removed
