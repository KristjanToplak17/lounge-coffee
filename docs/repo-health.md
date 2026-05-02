# Repo Health

## Purpose

This document tracks the current repo health snapshot, open harness debt, known gaps, and temporary waivers.

It intentionally combines scorecard and debt tracking into one small file so the repo stays maintainable.

## Current Snapshot

Date: `2026-05-02`

Overall status: `In Progress`

- Docs system: `Fair`
- Repo hygiene baseline: `Good`
- Structured repo state: `Active`
- Verification harness: `Active`
- Browser verification: `Implemented`
- Asset/performance guardrails: `Active`

## Strengths

- project docs are already split by ownership
- Phase 1 baseline files and command surface are in place
- repo now has initial docs and asset verification commands
- harness plan has been tightened into a more proportional v2
- browser verification now captures a small screenshot checkpoint set
- browser verification now records lightweight motion-health metrics
- build output size drift is now tracked against a repo-local baseline

## Open Harness Debt

### High priority

- update stale "placeholder/scaffold" wording in root guidance where it no longer matches implementation reality
- refine hero and tertiary asset exceptions only if real implementation needs them
- decide whether visual checkpoints remain capture-only or become true baseline/diff checks

### Medium priority

- add docs/plans discipline for non-trivial work
- formalize blocking versus warning-only checks in CI once CI exists
- expand browser verification beyond the current intro-focused flow as hero and freshness scenes become real
- refine screenshot review policy as more checkpoints are added

### Low priority

- add deeper touch-scroll quality probes
- expand runtime metrics once hero and freshness flows exist
- convert visual checkpoints from capture-only artifacts into a true baseline/diff workflow if the repo needs stricter regression control

## Temporary Waivers

Current waivers:

- none yet

## Review Cadence

- last refreshed: `2026-05-02`
- next review by: `2026-05-09`
- refresh after each completed harness phase or major repo-tooling pass
- review temporary waivers during each refresh even when the list is empty

## Cleanup Notes

- root scratch files and old logs were cleared in the latest cleanup pass
- one ignored generated directory, `tmp-loader-qa/`, is still present because an external process kept re-opening `vite.log` during cleanup
- `lint` and `test` now run real tooling instead of placeholders

## Review Notes

- keep this file short
- move resolved items out instead of turning this into a long archive
- when debt becomes canonical repo policy, move it into `repo-operations.md` or another source-of-truth doc
