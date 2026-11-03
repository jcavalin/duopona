# Implementation Plan: Daily Goal and Streak

**Branch**: `007-daily-goal-streak` | **Date**: 2026-11-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-daily-goal-streak/spec.md`

## Summary

Count one finished session (lesson, practice or review) per local calendar day as the daily
goal, and keep a streak of consecutive goal days. A new `streak` Redux slice holds
`{ lastDay, current, best }`, saved under its own `localStorage` key `duopona:streak` v1. The
existing finish thunk (`continueAndRecord`) records the goal for every session kind and flags
the session when it was the one that met today's goal, so the summary can say "Daily goal
met". The home screen gains a streak counter in the top bar and a small daily-goal card
(today 0 / 1 or 1 / 1, best streak). Day arithmetic is a small pure module on `YYYY-MM-DD` strings.
Lesson progress, word records and their storage are untouched.

## Technical Context

**Language/Version**: TypeScript 6 (strict)

**Primary Dependencies**: React 19, Redux Toolkit 2, react-redux 9, React Router 8, Vite 8,
vite-plugin-pwa 2; **no new dependencies**

**Storage**: `localStorage`: `duopona:progress` v1 and `duopona:words` v1 unchanged; new
`duopona:streak` v1 ([contracts/streak-storage.md](contracts/streak-storage.md))

**Testing**: Vitest + React Testing Library with fake timers (`vi.setSystemTime`) for dates.
New unit tests for day helpers, the streak slice and its selectors, streak storage; new
integration test `tests/integration/streakFlow.test.tsx`; lesson and practice flow suites must
pass (summary gains content only when the goal is met). Manual checks per quickstart S1–S9,
S-D1

**Target Platform**: iOS Safari and Android Chrome (browser and installed); desktop browsers

**Project Type**: Frontend-only single-page web app (PWA)

**Performance Goals**: Streak and goal visible on the home screen with no extra tap (SC-001);
all calculations are constant-time on three numbers

**Constraints**: Offline (no new assets beyond an inline SVG icon; precache unchanged in
kind); 360 px width, 44 px targets; never changes lesson progress or word records (FR-014)

**Scale/Scope**: 1 new slice, 1 new storage key, 1 new pure module (days), 1 icon, home top
bar + 1 card, 1 optional summary block; 0 new routes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. KISS | No dependencies, no date library (R1). Three stored numbers/strings instead of a day history (R2). Fixed goal of 1 session: today's progress is derived from `lastDay`, no counter (R3). One optional prop on `LessonSummary` reused by both routes (R5) | ✅ Pass |
| II. Frontend-only, local-first | Streak in `localStorage` under new versioned key `duopona:streak` v1 with reset-on-invalid rules; nothing sent anywhere; other keys untouched (R4) | ✅ Pass |
| III. Standard React stack | Streak is shared state (home, both routes, thunk) → Redux Toolkit slice. The current date is read in the thunk and in components, and passed into reducers/selectors as a `YYYY-MM-DD` string, so reducers stay pure (R1) | ✅ Pass |
| IV. Tests after code, before done | Unit tests for day helpers, reducer transitions over ≥ 30 simulated days (SC-003), selectors, storage rules; integration tests for home display, summary announcement, quitting. Phone check S-D1 under the IV exception | ✅ Pass |
| V. Mobile-first PWA | Top-bar counter and goal card designed at 360 px, no new network assets; icon is inline SVG like the others (R6); device row S-D1 | ✅ Pass |
| Governance: Transitional compliance | No open gaps: 003 and 004 closed (manual checks skipped by owner decision, recorded) | ✅ Pass |

**Post-design re-check (after Phase 1)**: unchanged. One versioned key with a written
contract, one slice, one pure module, one optional prop; no abstraction with fewer than two
uses (`today()` is used by the thunk and the home screen; `streakGoalMet` by both routes).

## Project Structure

### Documentation (this feature)

```text
specs/007-daily-goal-streak/
├── plan.md
├── research.md                 # R1–R7
├── data-model.md               # streak record, transitions, derived values
├── quickstart.md               # automated coverage, S1–S9, S-D1
├── contracts/
│   ├── ui-screens.md           # top-bar counter, goal card, summary block
│   └── streak-storage.md       # duopona:streak v1
├── checklists/requirements.md
└── tasks.md                    # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── lib/
│   └── days.ts                 # new: today(), dayBefore(day) on YYYY-MM-DD (R1)
├── store/
│   ├── index.ts                # + streak reducer, preload and save (R4)
│   ├── persistence.ts          # + loadStreak / saveStreak, STREAK_KEY
│   ├── streakSlice.ts          # new: goalMet(day), selectStreak(day), selectMetToday(day), best (R2)
│   ├── sessionSlice.ts         # + goalMet flag, markGoalMet action (R5)
│   └── lessonThunks.ts         # continueAndRecord: record goal for every kind, flag session (R5)
├── routes/
│   ├── LessonRoute.tsx         # passes streak to the summary when session.goalMet
│   └── PracticeRoute.tsx       # same
└── components/
    ├── icons.tsx               # + FlameIcon (R6)
    ├── LessonList.tsx          # + streak counter in top bar, daily-goal card (contract U1, U2)
    ├── LessonList.module.css   # + counter state, card styles
    ├── LessonSummary.tsx       # + optional streak prop: "Daily goal met" + Streak stat (U3)
    └── Exercise.module.css     # + streak stat colour
tests/
├── unit/
│   ├── days.test.ts            # new
│   ├── streakSlice.test.ts     # new (incl. 30-day simulation, SC-003)
│   ├── persistence.test.ts     # + streak storage cases
│   └── sessionSlice.test.ts    # + markGoalMet
└── integration/
    ├── streakFlow.test.tsx     # new
    ├── lessonFlow.test.tsx     # must pass
    └── practiceFlow.test.tsx   # must pass
```

**Structure Decision**: Existing single-project layout, following feature 006's pattern (own
slice + own storage key). No new route or screen; the summary and home screen gain small
blocks.

## Complexity Tracking

| Item | Why Needed | Simpler Alternative Rejected Because |
|------|------------|-------------------------------------|
| Third `localStorage` key | Keeps streak data independent: no migration of progress or words, and bad streak data can never reset them (FR-011, FR-012, SC-005) | Adding fields to `duopona:progress` needs a v2 migration and couples failure modes |
| `goalMet` flag on the session | The summary must announce the goal only for the session that met it (FR-009); after the thunk runs, "met today" is true for every later session too, so it cannot be derived | Comparing before/after in the route needs effect timing tricks; a transient field in the streak slice would leak into what is saved |
