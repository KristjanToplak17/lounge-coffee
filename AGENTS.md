# AGENTS.md

## Purpose

This file is the root instruction entrypoint for agents working in this repository.
It is a thin orchestrator: use it to understand how to behave, where to look next, and which documents own which decisions.
Do not treat this file as the full project spec when a dedicated document already exists.

## Project Snapshot

Lounge Coffee is a motion-first, single-page premium coffee landing page built with Vite, React, plain CSS, and GSAP.
The intended v1 experience arc is:

- Intro Sequence
- Hero Composition
- Freshness Transition

Scope guardrails for v1:

- single landing page only
- no backend
- no ecommerce flow
- no CMS
- no multi-page architecture
- no sections beyond the opening freshness panel unless explicitly requested

## How To Navigate The Source Of Truth

Read [`docs/README.md`](./docs/README.md) first for documentation ownership, reading order, and conflict resolution.

Then route by task:

- Product intent, scope, audience, tone: [`docs/project-brief.md`](./docs/project-brief.md)
- Visual system, tokens, typography, responsive rules: [`docs/design-system.md`](./docs/design-system.md)
- Scene purpose, naming, and on-screen contents: [`docs/scene-map.md`](./docs/scene-map.md)
- Motion behavior, timing, transitions, reduced-motion rules: [`docs/motion-system.md`](./docs/motion-system.md)
- Intro loader technical implementation strategy: [`docs/loader.md`](./docs/loader.md)
- Intro loader visual corrections and production-polish targets: [`docs/loader-polish-spec.md`](./docs/loader-polish-spec.md)
- Asset roles, priorities, scene assignments, usage rules: [`docs/asset-inventory.md`](./docs/asset-inventory.md)
- Code ownership, scene boundaries, architecture decisions: [`docs/app-architecture.md`](./docs/app-architecture.md)
- Copy structure and minimum UI/content requirements: [`docs/content-contract.md`](./docs/content-contract.md)
- Delivery order, prerequisites, and definition of done: [`docs/implementation-phases.md`](./docs/implementation-phases.md)
- Repo restructuring and harness-engineering rollout: [`docs/harness-engineering-plan.md`](./docs/harness-engineering-plan.md)
- Repo workflow, scripts, verification, and hygiene: [`docs/repo-operations.md`](./docs/repo-operations.md)
- Current repo status, harness debt, and waivers: [`docs/repo-health.md`](./docs/repo-health.md) and [`docs/repo-state.json`](./docs/repo-state.json)

## Decision Rules

Follow the ownership and precedence already defined in [`docs/README.md`](./docs/README.md):

1. `project-brief.md` wins for product intent and scope.
2. `scene-map.md` wins for scene structure.
3. `motion-system.md` wins for behavior and transition logic.
4. `design-system.md` wins for visual and token rules.
5. `app-architecture.md` wins for code ownership and file structure.

Additional rules:

- `docs/loader.md` owns intro-loader implementation timing, phase choreography, and intro-specific technical tuning under the broader motion-system umbrella.
- `docs/loader-polish-spec.md` owns the concrete punch list and visual acceptance criteria for polishing the current loader implementation.
- Do not invent behavior when an existing doc already owns that decision.
- Treat `Locked` as implement-as-specified.
- Treat `Preferred` as the default unless implementation constraints force a change.
- Treat `Open` as unresolved and escalate instead of guessing.
- If one change affects another document's subject area, update both in the same documentation pass.

## Repo Working Map

Use the live repository structure as your implementation map:

- `docs/` -> project rules, specs, and implementation guidance
- `assets/` -> image and visual source material
- `src/scenes/` -> top-level scene boundaries and scene-owned DOM
- `src/components/` -> reusable view pieces
- `src/animations/` -> GSAP timelines and ScrollTrigger logic
- `src/styles/` -> tokens, resets, global styles, layout, motion-safe CSS
- `src/content/` -> placeholder copy and metrics
- `src/utils/` -> shared asset/config helpers
- `src/App.jsx` -> top-level scene composition and page order

## Behavior Expectations For Agents

- Inspect the current code before changing architecture assumptions.
- Treat docs as product/design authority and code as implementation truth.
- Preserve the premium, restrained, product-first visual language of the project.
- Favor asymmetry, product dominance, controlled cropping, and quiet UI chrome over generic marketing layouts.
- Keep cross-scene state minimal and follow the ownership split in [`docs/app-architecture.md`](./docs/app-architecture.md).
- Avoid expanding scope beyond the first freshness panel unless the user explicitly asks for it.
- Prefer focused implementation that supports the existing scene arc instead of broad speculative additions.

## Implementation Workflow

- Before UI/layout work, read `project-brief.md`, `scene-map.md`, `design-system.md`, and `motion-system.md`.
- Before animation work, also read `app-architecture.md` and the relevant animation ownership notes.
- Before intro/loader/reveal work, also read `docs/loader.md` and `docs/loader-polish-spec.md` when the task involves quality tuning or visual correction.
- Before copy/content work, read `content-contract.md`.
- Before asset changes or new asset usage, read `asset-inventory.md`.
- Before reorganizing files or ownership, read `app-architecture.md`.
- Before repo/tooling/harness work, read `docs/repo-operations.md`, `docs/repo-state.json`, `docs/repo-health.md`, and then `docs/harness-engineering-plan.md` for roadmap context.
- If docs disagree, follow the precedence chain above and resolve documentation intentionally rather than improvising in code.

## Current State Guardrail

This repository includes both planning docs and partial implementation.
Agents must verify the current code state before assuming that a planned scene, component, or animation already exists.
Use [`docs/repo-state.json`](./docs/repo-state.json) as the machine-readable repo status baseline, then confirm against the actual files when the task depends on current implementation details.
