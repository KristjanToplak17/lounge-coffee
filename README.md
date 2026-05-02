# Lounge Coffee

Lounge Coffee is a fictional premium coffee brand built as a motion-first landing page concept. The goal is to recreate the feeling of modern immersive product websites through cinematic reveal sequences, rich product composition, and controlled storytelling through scroll.

This is not a full ecommerce platform. It is a focused personal sprint project designed to produce a visually impressive, tightly art-directed single-page experience without unnecessary architectural complexity.

## Experience Arc

The v1 experience is built around one connected sequence:

1. **Intro Sequence**: a dramatic loader with a hero coffee bean and a cinematic reveal
2. **Hero Composition**: a premium floating product layout with headline, CTA, and supporting accents
3. **Freshness Transition**: one hero cup remains pinned and carries the visitor into the next storytelling section

The page should feel warm, premium, alive, product-focused, and cinematic throughout.

## Current Status

The repository currently contains:

- the asset library in [`assets/`](./assets)
- the current Vite + React implementation in [`src/`](./src)
- the documentation source of truth in [`docs/`](./docs)
- the repo-local verification harness declared in [`package.json`](./package.json)

Dependencies are installed in the local workspace.

The current implementation state is:

- intro loader scene is implemented
- hero and freshness animation modules still need real implementation
- the repository now has an active harness-engineered workflow with repo-state, browser smoke verification, checkpoint capture, and runtime guardrails

## Chosen Stack

- Vite
- React
- Plain CSS
- GSAP for timeline and scroll choreography

This stack was chosen because the project is a single art-directed landing page where most complexity comes from sequencing, composition, and motion rather than routing, backend logic, or application state.

## Documentation Map

The docs are intended to be read as a connected system, not as separate notes.

- [`docs/README.md`](./docs/README.md): documentation map and ownership rules
- [`docs/project-brief.md`](./docs/project-brief.md): brand fiction, audience, emotional goal, and scope
- [`docs/design-system.md`](./docs/design-system.md): visual rules, token direction, and responsive design principles
- [`docs/scene-map.md`](./docs/scene-map.md): what each scene communicates and what appears in it
- [`docs/motion-system.md`](./docs/motion-system.md): how the scenes move and transition
- [`docs/asset-inventory.md`](./docs/asset-inventory.md): asset roles, scene assignments, and usage priority
- [`docs/app-architecture.md`](./docs/app-architecture.md): code ownership, scene mounting strategy, and file responsibilities
- [`docs/content-contract.md`](./docs/content-contract.md): required UI/content structure and placeholder copy direction
- [`docs/implementation-phases.md`](./docs/implementation-phases.md): phased build order, deliverables, and definition of done

## Project Structure

- `docs/`: source of truth for product, motion, design, and implementation rules
- `src/scenes/`: top-level scene containers
- `src/components/`: reusable visual building blocks
- `src/animations/`: GSAP timeline and scroll modules
- `src/styles/`: tokens, globals, layout, and motion styles
- `src/content/`: placeholder content and metrics
- `src/utils/`: shared configuration and asset mapping

## Current Milestone

The current milestone is to finish the remaining landing-page scene implementation on top of the harness baseline that is already in place.

Immediate next implementation steps after docs are stable:

1. Build the hero composition
2. Implement the reveal handoff into the hero
3. Build the freshness transition
4. Decide whether screenshot checkpoints stay review-only or become true visual regression baselines
5. Expand browser verification as hero and freshness scenes become real

## Repo Hygiene

Generated output, local QA artifacts, DOM dumps, and dev logs should not be treated as source files.

The repo baseline now expects these to stay ignored:

- build output such as `dist/`
- temporary QA folders such as `qa-*` and `tmp-*`
- local browser dumps such as `dump-dom.html`
- local Vite logs and preview logs
