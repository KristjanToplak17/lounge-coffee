# Plans

## Purpose

This folder holds short-lived execution plans for non-trivial work.

Use it to make active implementation legible without turning plans into a second source of truth.

## Structure

- `active/`: plans currently being executed
- `completed/`: short historical summaries after work is done

## Rules

- active plans must link back to the canonical docs they depend on
- completed plans must summarize what changed and point back to the canonical docs that were updated
- completed plans are history only and should not become the new source of truth
- if a plan changes a canonical doc area, update that canonical doc in the same pass
- create an active plan for non-trivial multi-step work that is likely to span more than one focused implementation pass
- move an active plan to `completed/` once the work is done or intentionally superseded
- do not leave stale plans sitting in `active/` after the repo-health refresh cadence runs

## Naming

Use concise kebab-case names with a date prefix when helpful.

Examples:

- `2026-05-loader-browser-smoke.md`
- `hero-handoff-verification.md`
