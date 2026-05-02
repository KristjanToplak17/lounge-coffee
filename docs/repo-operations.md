# Repo Operations

## Purpose

This document is the operational runbook for agent work in Lounge Coffee.

It owns:

- required scripts
- runtime and package-manager conventions
- local and CI verification flow
- browser verification expectations
- blocking versus non-blocking checks
- waiver and exception rules
- repo hygiene rules

For product, design, motion, and scene decisions, defer to the existing project docs. This file is about how work is executed and verified.

## Runtime Baseline

`Locked`:

- use the Node version declared in [`.nvmrc`](../.nvmrc)
- use `npm` as the package manager
- use `npm install` / `npm ci` style flows consistently once CI is added
- use the scripts in [`package.json`](../package.json) as the main command surface

## Required Commands

Current baseline:

- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run verify`
- `npm run verify:docs`
- `npm run verify:repo-state`
- `npm run verify:assets`
- `npm run verify:build-output`
- `npm run verify:browser`
- `npm run audit:repo`

Notes:

- `lint` runs ESLint across repo source, scripts, and tests
- `test` runs the lightweight Vitest suite
- `verify` is the main pre-completion command
- `verify:build-output` checks the emitted `dist/` footprint against repo-local absolute budgets and growth budgets
- future browser verification will be added under this command surface rather than creating ad hoc shell steps

## Verification Policy

### Blocking checks

These are the checks that should pass before work is considered complete once they exist:

- build
- docs verification
- asset verification
- build-output verification
- deterministic browser smoke checks

### Non-blocking checks

These can begin as warning-only or scheduled checks:

- deeper visual snapshot review
- deeper mobile/touch verification
- runtime performance review
- broader repo health refresh

### Agent rule

Before claiming implementation work is done, run the strongest available verification path for the task. At the current repo phase that means at least:

- `npm run verify`
- `npm run audit:repo` after repo-structure or tooling work

## Browser Verification Expectations

Browser verification is implemented for the current intro-focused flow and should expand as more scenes become real.

`Locked`:

- browser checks must prefer explicit app markers over timing guesses
- one deterministic desktop smoke flow is required
- one deterministic mobile viewport smoke flow is required
- reduced-motion behavior must be verified

`Preferred`:

- deeper touch-scroll checks run separately from the smallest blocking smoke path
- screenshot checkpoints supplement smoke tests rather than replacing them
- runtime motion-health probes stay lightweight and focused on obvious layout-shift or long-task regressions

## Repo State Source Of Truth

`Locked`:

- scripts should read [`repo-state.json`](./repo-state.json) before inferring state from prose
- when repo status changes materially, update `repo-state.json` in the same pass
- markdown status text should not silently contradict structured repo state

## Repo Hygiene Rules

Generated or local-only artifacts should not be treated as source.

Ignore or clean up:

- `dist/`
- `output/`
- local QA folders such as `qa-*` and `tmp-*`
- browser dumps such as `dump-dom.html`
- local Vite logs and preview logs

Keep the root focused on real source, docs, scripts, and configuration.

## Waivers And Exceptions

Use waivers sparingly.

Every waiver or exception should include:

- reason
- owner
- created date
- expiry or review date

Examples:

- a large approved hero asset
- a temporary warning-only browser check
- a short-lived mismatch between docs and implementation during an active refactor

Temporary waivers belong in [`repo-health.md`](./repo-health.md) and machine-readable exceptions belong in [`repo-state.json`](./repo-state.json) when scripts need them.

Waiver review cadence:

- review temporary waivers during every repo-health refresh
- remove expired waivers in the same pass when possible
- do not allow a waiver to remain without a `reviewBy` date

## Cleanup Cadence

`Locked`:

- refresh `repo-health.md` after each completed harness phase or major repo-tooling pass
- move non-trivial finished plans from `docs/plans/active/` to `docs/plans/completed/` in the same pass
- run `npm run check:repo-hygiene` after cleanup-oriented work
- run `npm run audit:repo` after repo structure or verification changes

## Current Phase Expectations

Current repo phase: `phase_7_build_output_tracking`

At this phase:

- command scaffolding exists
- doc verification exists
- asset scanning exists
- repo-state validation exists
- repo hygiene checking exists
- deterministic browser verification exists for desktop, reduced-motion, and one mobile viewport path
- screenshot checkpoints are generated into `output/playwright/checkpoints/`
- lightweight motion-health probes run during browser verification
- built output size movement is tracked against a repo-local baseline in `repo-state.json`
- repo state should now be maintained in `repo-state.json`
