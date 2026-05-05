# App Architecture

## Purpose

This document defines how the codebase should be organized so future agents can build scenes and motion without inventing structure.

## Top-Level Ownership

- `src/App.jsx`: scene composition and top-level page order
- `src/scenes/`: owns scene-level DOM and layout boundaries
- `src/components/`: owns reusable display pieces used by scenes
- `src/animations/`: owns GSAP timelines and ScrollTrigger logic
- `src/styles/`: owns global tokens, resets, layout rules, and motion-safe CSS support
- `src/content/`: owns placeholder copy and metric data
- `src/utils/`: owns asset maps and shared config values

## Scene Ownership

### Intro Sequence

Own in `src/scenes/BakedIntroReveal/`

- intro stage layout
- side-owned baked panel groups
- split bean reveal composition
- loading logo and progress line

Animation ownership:

- shared baked intro motion helpers inside `src/scenes/BakedIntroReveal/`
- production wrapper in `src/scenes/BakedIntroReveal/BakedIntroReveal.jsx`
- `/test` harness wrapper in `src/scenes/TestRevealExperiment/TestRevealExperiment.jsx`

### Hero Composition

Own in `src/scenes/HeroComposition/`

- floating cup composition
- headline and CTA block
- lightweight header chrome
- sticker placements

Animation ownership:

- `src/animations/heroCompositionTimeline.js`

### Freshness Transition

Own in `src/scenes/FreshnessTransition/`

- first freshness panel layout
- pinned cup landing region
- supporting type and copy block

Animation ownership:

- `src/animations/freshnessTransitionScroll.js`

## Mounting Strategy

`Locked`:

- all three v1 scenes live in one page flow under `App`
- the intro sequence is a top-level opening scene, not a separate route
- the hero scene exists behind the intro reveal and becomes the primary visible scene once the intro finishes
- the freshness section exists below the hero in the natural scroll flow

## GSAP Ownership Rule

`Locked`:

- scene components own refs
- animation modules receive refs or elements from the owning scene
- no global animation file should query or mutate another scene's DOM without an explicit handoff

## Cross-Scene State

`Locked`:

- keep cross-scene state minimal
- prefer local scene refs and simple top-level state for intro completion only
- do not introduce a global state library for v1

## CSS Organization

`Preferred`:

- global tokens and reset stay in shared styles
- scene-specific layout and visual rules should eventually live next to scene components or in clearly named scene style files
- motion-critical values that are shared across scenes may live in config utilities
