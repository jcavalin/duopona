<!--
Sync Impact Report
- Version change: template (unversioned) → 1.0.0
- Modified principles: all placeholders replaced (initial ratification)
  - [PRINCIPLE_1_NAME] → I. Keep It Simple (KISS)
  - [PRINCIPLE_2_NAME] → II. Frontend-Only, Local-First
  - [PRINCIPLE_3_NAME] → III. Standard React Stack
  - [PRINCIPLE_4_NAME] → IV. Tests After Code, Before Done
  - [PRINCIPLE_5_NAME] → removed (project defines four principles)
- Added sections: Technology Constraints, Development Workflow
- Removed sections: none
- Deferred TODOs: none
-->

# Duopona Constitution

Duopona is a Duolingo-style web application dedicated exclusively to teaching Toki Pona.

## Core Principles

### I. Keep It Simple (KISS)

- The simplest solution that satisfies the spec MUST be chosen.
- Abstractions, generic utilities, and configuration layers MUST NOT be introduced until there are
  at least two concrete, current uses for them (YAGNI).
- New dependencies MUST be justified by a clear need that cannot be met with a few lines of code.
- Any added complexity MUST be recorded and justified in the plan's Complexity Tracking section.

**Rationale**: A small, single-purpose app stays maintainable only if complexity is earned,
not anticipated.

### II. Frontend-Only, Local-First

- Duopona MUST run entirely in the browser as a single-page application; there is no backend.
- All user data (progress, settings, streaks) MUST be persisted in browser `localStorage`.
- Persisted data MUST be stored under versioned keys so that format changes can be migrated
  or safely reset without crashing the app.
- The app MUST NOT send user data to any external service.

**Rationale**: No server means no hosting cost, no accounts, and no privacy surface.

### III. Standard React Stack

- The UI MUST be built with React.
- Shared application state MUST be managed with Redux (Redux Toolkit is the default way to use
  it); purely local UI state MAY stay in component state.
- Libraries MUST be mainstream, actively maintained members of the React ecosystem.

**Rationale**: Well-known tools keep the codebase predictable and easy to get help with.

### IV. Tests After Code, Before Done

- Tests are written after the implementation, not test-first.
- A feature is NOT complete until its user-facing behavior and its state logic (reducers,
  selectors, persistence) are covered by automated tests that pass.
- Tests MUST target behavior, not implementation details.

**Rationale**: Writing tests after keeps iteration fast, while the "before done" gate keeps
regressions out.

## Technology Constraints

- Platform: modern evergreen desktop and mobile browsers.
- Language/UI: React; state: Redux (Redux Toolkit).
- Storage: `localStorage` only; no backend, database, or server-side code.
- Course content (Toki Pona vocabulary, lessons, exercises) is shipped with the app as static data.

## Development Workflow

- Every feature follows the Spec Kit flow: specify → (clarify) → plan → tasks → implement.
- Plans MUST include a Constitution Check confirming compliance with all four principles.
- A feature is merged only when its tests pass and its spec's acceptance criteria are met.

## Governance

- This constitution supersedes other practices; conflicts are resolved in its favor.
- Amendments are made via `/speckit-constitution`, with the change and rationale recorded in the
  Sync Impact Report.
- Versioning follows semantic versioning: MAJOR for removed or redefined principles, MINOR for
  added principles or sections, PATCH for clarifications.
- Every plan and review MUST verify compliance with the Core Principles.

**Version**: 1.0.0 | **Ratified**: 2026-11-01 | **Last Amended**: 2026-11-01
