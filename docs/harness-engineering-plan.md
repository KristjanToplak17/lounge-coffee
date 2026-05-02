# Harness Engineering Plan v2

## Purpose

This document is the implementation plan for upgrading Lounge Coffee into a repo that supports reliable agent-first work.

It is intentionally scoped to this project:

- single-page landing page
- motion-heavy frontend
- no backend
- no ecommerce flow
- premium visual quality matters more than feature breadth

This plan upgrades the repository harness around the existing v1 scope. It does **not** expand product scope.

## Why This Plan Exists

Status note:

- Phases 1 through 5 are now substantially implemented in the repo
- this plan should be read as the roadmap and acceptance model for remaining work, not as a literal description of the repo's current missing baseline
- for current operational truth, defer to `repo-operations.md`, `repo-health.md`, and `repo-state.json`

The repo started with a good documentation split but originally lacked the operational layer that makes agent work dependable:

- no confirmed Git workflow in the current workspace state
- no CI or machine-enforced repo policy
- no standard verify path beyond `build`
- no browser-based validation harness
- no doc freshness enforcement
- no structured source of truth for implementation status
- no repo hygiene rules for generated artifacts and temporary files

For this repo, harness engineering should optimize for:

- agent legibility
- small safe changes
- visual and motion verification
- documentation freshness
- low-maintenance controls

It should **not** turn a small landing-page repo into a process-heavy platform project.

## Target Outcome

After this plan is complete, an agent should be able to:

- understand the current repo state from repo-local files
- know which scenes exist, which are partial, and which verification paths apply
- run one standard verification command before claiming completion
- validate key desktop and mobile/touch flows
- catch obvious doc drift, repo drift, asset creep, and motion regressions

## Design Principles

### 1. Keep the harness proportional

Every added rule or document should materially improve reliability for this specific repo.

### 2. Prefer one source of truth over prose inference

If automation needs to know repo state, that state should live in a small structured file rather than being guessed from multiple markdown documents.

### 3. Prefer mechanical enforcement over reminders

If a rule matters repeatedly, encode it as a script, lint, checklist, or CI check.

### 4. Make motion and visual behavior testable

Build success alone is not enough for a motion-first landing page.

### 5. Favor a small set of strong docs

The repo should have fewer, clearer operational docs rather than many overlapping ones.

## v2 Structural Changes

This version deliberately reduces the doc surface proposed in v1.

## Proposed Documentation Model

### Keep

- `AGENTS.md`
- current product, design, motion, asset, loader, architecture, and implementation docs
- this plan

### Create

- `docs/repo-operations.md`
- `docs/repo-health.md`
- `docs/plans/README.md`
- `docs/plans/active/`
- `docs/plans/completed/`

### Do Not Create In v2

- separate `quality-score.md`
- separate `tech-debt-tracker.md`
- separate `definition-of-done.md`
- separate `verification-matrix.md`

Those concerns should be consolidated first. They can be split later only if the repo genuinely outgrows the simpler model.

## Ownership Model

### `repo-operations.md`

Owns:

- required scripts
- runtime and package-manager conventions
- local and CI verification workflow
- browser verification expectations
- blocking versus non-blocking checks
- waiver and exception rules
- repo hygiene rules

This is the main operational runbook for agents.

### `repo-health.md`

Owns:

- current repo quality snapshot
- open technical debt list
- known harness gaps
- accepted temporary waivers
- recurring cleanup notes

This replaces separate scorecard and debt docs in the first harness iteration.

### `docs/plans/`

Owns:

- active execution plans for non-trivial work
- completed plans as short historical summaries only

Rules:

- active plans must link to the canonical docs they rely on
- completed plans must summarize what changed and point back to canonical docs that were updated
- completed plans are history, not new sources of truth

## Add A Small Structured Source Of Truth

This is the most important addition missing from v1.

Create one small machine-readable file, for example:

- `docs/repo-state.json`

It should encode only the state that scripts and verification need to know.

### Suggested fields

- current repo phase
- implemented scenes
- partial scenes
- active verification targets
- browser smoke paths
- mobile/touch verification requirements
- reduced-motion requirement
- approved asset exceptions
- active temporary waivers

### Why this matters

Without a structured source of truth, doc checks and browser checks will have to guess from prose and will become brittle fast.

## Proposed Repository Structure

```text
AGENTS.md
README.md
package.json
.gitignore
.editorconfig
.nvmrc
.github/
  workflows/
docs/
  README.md
  project-brief.md
  design-system.md
  scene-map.md
  motion-system.md
  loader.md
  asset-inventory.md
  app-architecture.md
  content-contract.md
  implementation-phases.md
  harness-engineering-plan.md
  repo-operations.md
  repo-health.md
  repo-state.json
  plans/
    README.md
    active/
    completed/
scripts/
  verify-docs.mjs
  verify-repo-state.mjs
  check-repo-hygiene.mjs
  check-asset-budgets.mjs
  audit-repo.mjs
tests/
  smoke/
  visual/
```

## Required Harness Components

## 1. Source Control And Repo Hygiene Baseline

### Goal

Make the repo safe for iterative agent work.

### Needed changes

- ensure the project is a real Git repository
- add `.gitignore`
- add `.editorconfig`
- add runtime pinning such as `.nvmrc`
- ignore `dist/`, DOM dumps, temp images, and Vite logs
- define which generated artifacts are allowed in-repo and which are not

### Why it matters

Agent throughput is only useful if working state is clean and reproducible.

## 2. Reproducible Runtime And Install Rules

### Goal

Make local and CI behavior match.

### Needed changes

- define required Node version
- define the install command used locally and in CI
- define preview-server startup behavior for verification
- define how browser tests discover the preview URL

### Why it matters

This is more foundational than many policy docs. If runtime behavior drifts across environments, the harness becomes noisy and untrustworthy.

## 3. Standard Script Surface

### Goal

Give agents one obvious command surface.

### Minimum required scripts

- `build`
- `lint`
- `test`
- `verify`
- `verify:docs`
- `verify:browser`
- `verify:assets`
- `audit:repo`

### Notes

- `verify` is the umbrella command
- `test` can stay lightweight
- `verify:browser` should start small and deterministic
- do not add `verify:motion` as a separate top-level script until there is a real need for it

## 4. Mechanical Doc And State Enforcement

### Goal

Catch drift without over-scraping prose.

### Needed changes

- verify docs referenced by `AGENTS.md` exist
- verify major docs are linked from `docs/README.md`
- verify `repo-state.json` is internally consistent
- verify status claims in `README.md` and operational docs match structured repo state where applicable

### Rule

Scripts should read structured state first and prose second.

## 5. Browser Verification Harness

### Goal

Make the experience executable for agents.

### Blocking browser smoke scope

Keep blocking CI narrow:

- app boots in preview mode
- no fatal console errors on initial load
- intro path completes
- reduced-motion path completes
- one mobile viewport smoke pass completes

### Non-blocking deeper verification

Run on schedule or on demand:

- touch-scroll handoff check
- hero to freshness transition check once implemented
- screenshot checkpoint capture
- deeper visual regression review

### Why this split matters

Small repos benefit from fast deterministic blocking checks and deeper non-blocking audits.

## 6. Motion Testability Hooks

### Goal

Avoid flaky animation verification.

### Needed changes

The app should expose stable hooks for verification, such as:

- scene identity markers
- intro complete marker
- reduced-motion path marker
- handoff complete marker
- current motion state marker where useful

Example forms:

- `data-scene`
- `data-motion-state`
- `data-intro-complete`

### Rule

Browser checks should prefer explicit app-emitted markers over timing guesses.

## 7. Visual Verification

### Goal

Protect the premium art direction without overbuilding a full visual regression lab.

### First checkpoint set

- intro resting frame on desktop
- post-reveal hero state on desktop
- mobile intro or hero checkpoint
- freshness handoff checkpoint once that flow exists

### Policy

- keep the screenshot baseline small
- use it as a high-signal supplement to smoke tests
- decide in `repo-operations.md` which snapshots are blocking and which are review-only

## 8. Asset And Performance Guardrails

### Goal

Protect the landing page from both weight creep and motion jank.

### Asset controls

- flag oversized non-hero assets
- define monitored hero-asset exceptions
- track built asset size changes
- tie budgets to asset classes already used by the repo

### Runtime motion-health controls

Add a small practical set of checks for:

- no major layout shift during intro/handoff
- no obvious long-task spikes during initial motion where measurable
- acceptable stability during intro and pinned transitions

### Rule

For this repo, runtime motion health matters at least as much as static asset weight.

## 9. Waivers And Exception Model

### Goal

Keep enforcement useful instead of noisy.

### Needed changes

Define in `repo-operations.md`:

- which checks are blocking
- which checks are warning-only
- how approved exceptions are recorded
- how temporary waivers expire
- where hero-asset exceptions live

### Rule

Every exception should have:

- reason
- owner
- created date
- expiry or review date

## Recommended CI Shape

Keep CI small and fast.

### Blocking PR checks

- install
- lint
- build
- verify:docs
- verify:assets
- verify:browser

### Scheduled or non-blocking checks

- screenshot checkpoint capture
- deeper mobile/touch review
- deeper performance review
- repo health refresh

## Implementation Phases

## Phase 1: Stabilize The Operating Surface

### Goal

Create a clean, reproducible baseline.

### Deliverables

- Git baseline confirmed
- `.gitignore`
- `.editorconfig`
- `.nvmrc`
- clean-root artifact policy
- basic script names reserved in `package.json`

### Definition of done

- working state is cleaner
- runtime expectations are explicit
- generated artifacts are not treated like source

## Phase 2: Add The Repo Backbone

### Goal

Create the smallest reliable system of record for operations.

### Deliverables

- `repo-operations.md`
- `repo-health.md`
- `repo-state.json`
- `docs/plans/` structure

### Definition of done

- scripts have a structured state file to read
- operational guidance has one main home
- health and debt are tracked in one place

## Phase 3: Add Mechanical Verification

### Goal

Catch repo and doc drift automatically.

### Deliverables

- doc reference checker
- repo-state checker
- repo hygiene checker
- initial repo audit command

### Definition of done

- stale references and obvious drift surface early
- checks rely on structured state instead of prose scraping

## Phase 4: Build The Deterministic Browser Harness

### Goal

Make the key experience paths executable.

### Deliverables

- preview boot verification
- desktop intro smoke path
- reduced-motion smoke path
- one mobile smoke path
- app-exposed motion test hooks

### Definition of done

- agents can verify the current landing-page experience without relying only on human eyeballing

## Phase 5: Add Visual And Runtime Quality Guardrails

### Goal

Protect art direction and smoothness.

### Deliverables

- small screenshot checkpoint set
- asset budget script
- runtime motion-health checks or probes where practical
- hero-asset exception policy

### Definition of done

- both visual regressions and weight creep are easier to catch
- the harness covers smoothness as well as static output

## Phase 6: Start Lightweight Continuous Cleanup

### Goal

Keep the repo coherent without ceremony.

### Deliverables

- repo-health refresh cadence
- short active-plan discipline
- waiver review cadence

### Definition of done

- cleanup is continuous
- maintenance docs stay small enough to remain current

## Concrete Checks To Add

### Docs and state checks

- every file referenced by `AGENTS.md` exists
- every major doc is linked from `docs/README.md`
- `repo-state.json` matches the repo’s declared scene and verification state
- status claims in key docs do not silently contradict structured state

### Repo hygiene checks

- build output and temp artifacts are ignored correctly
- unexpected root junk is surfaced

### Browser checks

- preview boots
- no fatal console errors on first load
- intro completion path succeeds
- reduced-motion path succeeds
- one mobile viewport path succeeds

### Visual checks

- checkpoint screenshots can be captured for the current implemented flow

### Asset and performance checks

- non-hero assets over budget are flagged
- hero exceptions are explicit
- large build output changes are surfaced

## Non-Goals

This plan does not recommend:

- backend testing stacks
- enterprise observability systems
- heavy monorepo structure
- large suites of shallow unit tests
- broad blocking visual-regression coverage from the start

## Immediate First Pass

The first implementation pass should focus on:

1. Git/runtime/repo hygiene baseline
2. `repo-operations.md` and `repo-state.json`
3. doc/state verification scripts
4. deterministic desktop + reduced-motion + mobile browser smoke
5. lightweight asset and screenshot guardrails

That first pass creates the core leverage for this repo without overbuilding the control system.
