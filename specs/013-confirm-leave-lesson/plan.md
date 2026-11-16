# Implementation Plan: Confirm Before Leaving a Lesson

**Branch**: `013-confirm-leave-lesson` | **Date**: 2026-11-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/013-confirm-leave-lesson/spec.md`

## Summary

On the exercise screen of a lesson, practice or review session, X and browser/device Back no
longer end the session straight away. They open a "Leave this lesson?" dialog with "Keep
learning" and "Leave" buttons (contract [ui-leave-dialog.md](contracts/ui-leave-dialog.md)).

How it works:
- One React Router `useBlocker` in `ExerciseScreen` catches every navigation away from the
  exercise screen. That covers X (which already navigates home) and Back, which the data router
  undoes and holds as "blocked" (research R1).
- While the blocker is blocked, `ExerciseScreen` renders a native `<dialog>` opened with
  `showModal()`. The browser makes the screen behind it inert and draws the backdrop. Escape
  closes it (R2).
- "Leave" calls `blocker.proceed()`; the navigation finishes and the existing route cleanup
  discards the session, as today.
- "Keep learning", Escape and a tap on the backdrop call `blocker.reset()`, then focus goes back
  to X.

No store, route or saved-data changes; the intro and summary screens are untouched.

## Technical Context

**Language/Version**: TypeScript 6, React 19

**Primary Dependencies**: React, Redux Toolkit, React Router 8 (`useBlocker`, already a
dependency); no new dependencies

**Storage**: N/A (nothing stored; `localStorage` untouched)

**Testing**: Vitest + Testing Library (jsdom), with a small `showModal`/`close` stub in
`tests/setup.ts` because jsdom has no modal dialog support (R6). Manual device check of Back
gesture, focus and layout in quickstart.md

**Target Platform**: PWA on iOS Safari (15.4+ for `<dialog>`) and Android Chrome, plus desktop
browsers

**Project Type**: Frontend-only single-page web app

**Performance Goals**: The dialog opens on the same tap (synchronous state, no data work)

**Constraints**: 360 px width, 44 px targets, safe areas, offline, contrast ≥ 4.5:1, dark theme
tokens only

**Scale/Scope**: One new component (`LeaveDialog`), `ExerciseScreen`, a one-line guard in
`MultipleChoice`, CSS, the test setup, and the integration tests that quit sessions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. KISS | ✅ | One router hook already in the stack, plus the browser's own `<dialog>`. The router handles X and Back in one place, with no custom history handling, focus trap or portal. One small component, used by both lesson and practice through the shared `ExerciseScreen` |
| II. Frontend-only, local-first | ✅ | Nothing stored or sent (FR-010) |
| III. Standard React stack | ✅ | Blocker state lives in the router and open/closed is derived from it. No Redux state needed; this is purely local UI state |
| IV. Tests after code, before done | ✅ | Integration tests cover X, Back (memory router `navigate(-1)`), Keep learning, Leave, Escape, backdrop, practice wording, intro/summary unaffected, number keys ignored. The real Android back gesture and iOS rendering are browser/device-only, so they go in the quickstart manual check (M1–M4) |
| V. Mobile-first PWA | ✅ | Buttons reuse `.primary-button` (52 px) and `.text-button` (44 px); dialog width fits 360 px; safe-area margins; no new assets, so offline is unchanged |

Post-design re-check: still passes; no Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/013-confirm-leave-lesson/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-leave-dialog.md
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── index.css                         # dialog + backdrop styles (R5)
├── components/
│   ├── LeaveDialog.tsx               # new: native <dialog>, title, message, two buttons (R2, R4)
│   ├── ExerciseScreen.tsx            # useBlocker, renders LeaveDialog, X ref for focus return (R1, R4)
│   └── MultipleChoice.tsx            # number keys ignored while a dialog is open (R7)
└── routes/
    └── PracticeRoute.tsx             # passes the practice title (US3)
tests/
├── setup.ts                          # showModal/close stub for jsdom (R6)
└── integration/
    ├── lessonFlow.test.tsx           # existing quit/Back tests confirm "Leave"; new 013 tests
    ├── practiceFlow.test.tsx         # existing quit tests confirm "Leave"; practice wording test
    └── streakFlow.test.tsx           # its quit step confirms "Leave"
```

**Structure Decision**: Single frontend project, existing layout. One new component file.

## Complexity Tracking

None.
