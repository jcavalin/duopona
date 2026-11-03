<!--
Sync Impact Report
- Version change: 1.1.0 → 1.2.0 (MINOR: new governance rule added)
- Modified principles: none
- Added sections: Governance → "Transitional compliance" rule
- Removed sections: none
- Templates: none changed (plan template's Constitution Check already covers all principles)
- Deferred TODOs: none. Applies now to the Principle V installability/offline gap: allowed for
  feature 002-book-course (recorded in its plan's Complexity Tracking), fixed by the next
  feature ("PWA & mobile compliance" in ROADMAP.md "Next").
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

### V. Mobile-First Progressive Web App

- Duopona MUST be an installable Progressive Web App: a web app manifest with name, icons and
  standalone display mode.
- After the first visit, the app (including all lesson content) MUST work fully offline via a
  service worker that caches the app shell and content.
- Layouts MUST be designed mobile-first and be fully usable from 360px viewport width, with no
  horizontal scrolling.
- Interactive targets MUST be at least 44×44 CSS px, and content MUST respect device safe areas
  (notches, home indicators).
- Every feature MUST work on current iOS Safari and Android Chrome, in the browser and when
  installed.

**Rationale**: Language practice happens in short sessions on phones; an installable, offline
app makes Duopona feel native while keeping it backend-free (Principle II).

## Technology Constraints

- Platform: Progressive Web App for modern evergreen browsers; primary targets are iOS Safari and
  Android Chrome (installed and in-browser), with desktop browsers also supported.
- Language/UI: React; state: Redux (Redux Toolkit).
- Storage: `localStorage` only; no backend, database, or server-side code.
- Course content (Toki Pona vocabulary, lessons, exercises) is shipped with the app as static data.

## Development Workflow

- Every feature follows the Spec Kit flow: specify → (clarify) → plan → tasks → implement.
- Plans MUST include a Constitution Check confirming compliance with all Core Principles.
- A feature is merged only when its tests pass and its spec's acceptance criteria are met.

## Governance

- This constitution supersedes other practices; conflicts are resolved in its favor.
- Amendments are made via `/speckit-constitution`, with the change and rationale recorded in the
  Sync Impact Report.
- Versioning follows semantic versioning: MAJOR for removed or redefined principles, MINOR for
  added principles or sections, PATCH for clarifications.
- Every plan and review MUST verify compliance with the Core Principles.
- **Transitional compliance**: When a principle is added or tightened, existing gaps MAY remain
  for at most one further feature, provided the plan's Complexity Tracking records the gap and
  ROADMAP.md lists the fix as the next feature. New gaps MUST NOT be introduced.

**Version**: 1.2.0 | **Ratified**: 2026-11-01 | **Last Amended**: 2026-11-03
