# Implementation Plan: First Lesson Flow

**Branch**: `001-first-lesson-flow` | **Date**: 2026-11-01 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-first-lesson-flow/spec.md`

## Summary

Build the first playable slice of Duopona: a lesson list with one lesson ("Basic Words"), an
exercise screen supporting multiple-choice and word-bank translation exercises with immediate
feedback and a retry queue for missed exercises, a summary screen, and completed-lesson progress
saved in `localStorage`. Implemented as a static React + Redux Toolkit single-page app built with
Vite, with React Router (hash URLs) for navigation; lesson logic lives in pure Redux reducers;
persistence is a small hand-written module.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), targeting ES2022

**Primary Dependencies**: React 19, Redux Toolkit 2, react-redux 9, React Router 7 (hash
router), Vite (build/dev server)

**Storage**: Browser `localStorage`, single key `duopona:progress` (versioned JSON)

**Testing**: Vitest + React Testing Library + @testing-library/user-event (jsdom)

**Target Platform**: Modern evergreen desktop and mobile browsers

**Project Type**: Frontend-only single-page web app (static hosting)

**Performance Goals**: Feedback visible < 1 s after Check (SC-003); first exercise reachable
< 30 s from opening (SC-001)

**Constraints**: No backend, no network calls for data, works offline once loaded, usable at
phone width (≥ 360 px)

**Scale/Scope**: 1 lesson, ~10 exercises, 3 screens, single learner per browser

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. KISS | No persistence library, no UI library, plain CSS Modules; 4 runtime deps (react, redux toolkit, react-redux, react-router). Router is justified by owner requirement for working Back button and lesson URLs; hash mode avoids hosting config | ✅ Pass |
| II. Frontend-only, local-first | Static SPA; progress in `localStorage` under a versioned key; no data leaves the device | ✅ Pass |
| III. Standard React stack | React + Redux Toolkit for shared state; component state only for UI-local bits (selected option, placed tiles) | ✅ Pass |
| IV. Tests after code, before done | Vitest + RTL; reducers, persistence, and full UI flow covered before feature is done | ✅ Pass |

**Post-design re-check (after Phase 1)**: ✅ All principles still pass. The data model adds
no abstractions beyond two slices and one persistence module; the storage contract is
versioned as Principle II requires.

## Project Structure

### Documentation (this feature)

```text
specs/001-first-lesson-flow/
├── plan.md              # This file
├── research.md          # Phase 0: decisions and rationale
├── data-model.md        # Phase 1: content, progress, session, state transitions
├── quickstart.md        # Phase 1: run + validation guide
├── contracts/
│   ├── progress-storage.md   # localStorage format and read/write rules
│   └── ui-screens.md         # What each screen shows and accepts
└── tasks.md             # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
index.html
package.json
vite.config.ts                 # includes Vitest config
tsconfig.json
src/
├── main.tsx                   # entry: create store + router, render
├── router.tsx                 # hash router: "/" and "/lesson/:lessonId"
├── routes/
│   ├── HomeRoute.tsx          # renders LessonList
│   └── LessonRoute.tsx        # starts session on enter, ends on leave; exercise or summary
├── content/
│   ├── types.ts               # Lesson / Exercise types
│   └── lessons.ts             # "Basic Words" lesson data
├── store/
│   ├── index.ts               # configureStore + persistence wiring
│   ├── progressSlice.ts       # completed lessons (persisted)
│   ├── sessionSlice.ts        # current lesson run, retry queue, feedback
│   └── persistence.ts         # load/save progress (try/catch, versioned)
├── lib/
│   └── shuffle.ts             # shuffle with injectable random source
└── components/
    ├── LessonList.tsx (+ .module.css)
    ├── ExerciseScreen.tsx (+ .module.css)
    ├── MultipleChoice.tsx
    ├── WordBank.tsx
    ├── FeedbackBanner.tsx
    └── LessonSummary.tsx
tests/
├── unit/
│   ├── sessionSlice.test.ts
│   ├── progressSlice.test.ts
│   └── persistence.test.ts
└── integration/
    └── lessonFlow.test.tsx    # full flow incl. simulated reload
```

**Structure Decision**: Single frontend project at the repository root (no `frontend/` /
`backend/` split, since there is no backend). Folders are grouped by role (content, store,
components) — few enough files that feature folders would add structure without benefit.

## Complexity Tracking

No constitution violations; nothing to justify.
