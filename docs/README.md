# Docs Map

This folder is the source of truth for Lounge Coffee. Each file has a distinct responsibility so future agents do not have to guess which document should win.

## Ownership Rules

- `project-brief.md`: defines what the project is, who it is for, what it should feel like, and what is in scope
- `design-system.md`: defines how the experience should look
- `scene-map.md`: defines what exists in each scene and what each scene communicates
- `motion-system.md`: defines how scene elements move, transition, and behave over time or scroll
- `loader.md`: defines the technical implementation strategy for the intro loader and bean-break reveal
- `asset-inventory.md`: defines which assets exist, what role they play, and whether they are in v1 scope
- `app-architecture.md`: defines how the codebase should be organized and which layer owns which responsibility
- `content-contract.md`: defines the minimum required copy, UI, and structural content for v1
- `implementation-phases.md`: defines build order, prerequisites, and definition of done
- `harness-engineering-plan.md`: defines how the repository should be upgraded to support stronger agent workflows, verification, and repo-local control systems
- `repo-operations.md`: defines the operational runbook for scripts, verification flow, repo hygiene, and execution rules
- `repo-health.md`: defines the current repo health snapshot, open harness debt, and temporary waivers
- `repo-state.json`: defines the machine-readable repo state used by scripts and verification
- `plans/`: stores active execution plans and short completed summaries without replacing canonical docs

## Reading Order

1. `project-brief.md`
2. `scene-map.md`
3. `motion-system.md`
4. `loader.md` for intro-loader technical implementation guidance
5. `design-system.md`
6. `asset-inventory.md`
7. `app-architecture.md`
8. `content-contract.md`
9. `implementation-phases.md`
10. `repo-operations.md` when the task involves scripts, repo workflow, verification, or repo hygiene
11. `repo-health.md` and `repo-state.json` when the task depends on current repo status or harness debt
12. `harness-engineering-plan.md` for the long-term harness roadmap and incomplete phases

## Decision Status

Use the following labels when adding or updating decisions:

- `Locked`: should be implemented as specified
- `Preferred`: recommended default unless implementation constraints force a change
- `Open`: intentionally undecided and needs confirmation before implementation

## Maintenance Rule

If two docs ever disagree:

1. `project-brief.md` wins for product intent and scope
2. `scene-map.md` wins for scene structure
3. `motion-system.md` wins for behavior and transition logic
4. `design-system.md` wins for visual and token rules
5. `app-architecture.md` wins for code ownership and file structure

Narrow exception:

- `loader.md` owns intro-loader implementation timing, phase choreography, and intro-specific technical tuning under the broader motion-system umbrella
- `motion-system.md` remains authoritative for high-level motion intent, cross-scene behavior, and global transition rules

When one doc changes another doc's subject area, update both in the same pass.

Operational exception:

- `repo-operations.md` owns how work is run and verified
- `repo-state.json` is the machine-readable source of truth for scriptable repo state
