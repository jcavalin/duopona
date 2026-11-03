# Implementation Plan: Practice Session and Review Weak Words

**Branch**: `006-practice-weak-words` | **Date**: 2026-11-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-practice-weak-words/spec.md`

## Summary

Add two home-screen actions, **Practice** (10 random exercises from completed lessons) and
**Review weak words** (10 exercises favouring the words most often missed), played through the
existing lesson screens, feedback and retry rule. To make one session span several lessons, the
session queue switches to `lessonId/exerciseId` keys and gains a `kind`. A new `words` Redux
slice counts outstanding mistakes per course word, updated on the first answer to each exercise
in lessons and practice alike, and saved under its own `localStorage` key `duopona:words` v1.
Which words an exercise tests is derived from its Toki Pona text and the course vocabulary; no
content changes. Lesson progress and its storage format are untouched.

## Technical Context

**Language/Version**: TypeScript 6 (strict)

**Primary Dependencies**: React 19, Redux Toolkit 2, react-redux 9, React Router 8, Vite 8,
vite-plugin-pwa 2; **no new dependencies**

**Storage**: `localStorage`: `duopona:progress` v1 unchanged; new `duopona:words` v1
([contracts/words-storage.md](contracts/words-storage.md))

**Testing**: Vitest + React Testing Library. New unit tests for word extraction, exercise
selection, the words slice and word storage; session slice tests updated for keys; new
integration test `tests/integration/practiceFlow.test.tsx`; existing lesson-flow tests must
pass unchanged. Manual checks per quickstart P1–P10, P-D1

**Target Platform**: iOS Safari and Android Chrome (browser and installed); desktop browsers

**Project Type**: Frontend-only single-page web app (PWA)

**Performance Goals**: One tap from home to the first practice exercise (SC-001); session
selection over ~214 exercises is instant

**Constraints**: Offline (no new assets, precache unchanged); 360 px width, 44 px targets;
lesson progress never altered by practice (FR-005, SC-005)

**Scale/Scope**: 1 new route, 2 new home buttons, 1 new slice, 1 new storage key, 2 new pure
modules (word extraction, selection), 2 components given label props (ExerciseScreen, LessonSummary); 0 new screens designs
beyond a button row

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. KISS | No dependencies. Words derived from existing content instead of new data (R1). Practice reuses the session slice, exercise screen and summary via keys and label props instead of copies (R2, R6). Selection is two short pure functions (R3). No shared storage helper for only two keys (R5) | ✅ Pass |
| II. Frontend-only, local-first | Word records in `localStorage` under a new versioned key `duopona:words` v1 with reset-on-invalid rules; nothing sent anywhere; progress key and format untouched (R5) | ✅ Pass |
| III. Standard React stack | Word records are shared state (home, route, thunks) → new Redux Toolkit slice. Random choice in a thunk, reducers stay pure. Route-local state only for UI | ✅ Pass |
| IV. Tests after code, before done | Unit tests for every new reducer, selector, pure function and storage rule; integration tests for practice, review and quitting; lesson-flow suite as regression. Phone check P-D1 under the IV exception | ✅ Pass |
| V. Mobile-first PWA | Button row designed at 360 px, ≥ 44 px targets, stacks when narrow; no new assets so offline works from the existing precache (R7); device row P-D1 | ✅ Pass |
| Governance: Transitional compliance | 003 and 004 are merged; only their manual phone checks remain open (owner's choice). No new gap; recorded below | ✅ Pass (noted in Complexity Tracking) |

**Post-design re-check (after Phase 1)**: unchanged. The design adds one versioned storage
key with a written contract, one slice, and no abstraction with fewer than two uses (the label
props on `ExerciseScreen` and `LessonSummary` serve lesson and practice).

## Project Structure

### Documentation (this feature)

```text
specs/006-practice-weak-words/
├── plan.md
├── research.md                 # R1–R7
├── data-model.md               # session changes, word record
├── quickstart.md               # automated coverage, P1–P10, P-D1
├── contracts/
│   ├── ui-screens.md           # home buttons, practice route, labels, summary texts
│   └── words-storage.md        # duopona:words v1
├── checklists/requirements.md
└── tasks.md                    # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── content/
│   ├── lessons/index.ts        # + exerciseKey(), getExercise(key) (R2)
│   └── words.ts                # new: testedWords(exercise) (R1)
├── lib/
│   └── practice.ts             # new: availableKeys, pickPractice, pickReview (R3)
├── store/
│   ├── index.ts                # + words reducer, preload and save (R5)
│   ├── persistence.ts          # + loadWords / saveWords, WORDS_KEY
│   ├── wordsSlice.ts           # new: wordsMissed, wordsKnown, selectWeakWords, selectCanReview (uses lib/practice, content/words) (R4)
│   ├── sessionSlice.ts         # keys, kind, total, startPractice (R2)
│   ├── lessonThunks.ts         # + submitAndRecord, startPracticeSession; completion only for lessons
│   └── progressSlice.ts        # + selectCanPractice (FR-001)
├── router.tsx                  # + /practice/:kind
├── routes/
│   ├── LessonRoute.tsx         # passes lesson labels/summary texts
│   └── PracticeRoute.tsx       # new (R6)
└── components/
    ├── LessonList.tsx          # + practice row and hint (S1)
    ├── LessonList.module.css   # + row styles
    ├── ExerciseScreen.tsx      # quit/progress labels as props; submitAndRecord
    └── LessonSummary.tsx       # heading, replayLabel props
tests/
├── unit/
│   ├── words.test.ts           # new
│   ├── practice.test.ts        # new
│   ├── wordsSlice.test.ts      # new
│   ├── persistence.test.ts     # + word storage cases
│   └── sessionSlice.test.ts    # updated for keys
└── integration/
    ├── practiceFlow.test.tsx   # new
    └── lessonFlow.test.tsx     # unchanged, must pass
```

**Structure Decision**: Existing single-project layout. New logic goes into two pure modules
and one slice; UI reuses the lesson components with label props and adds one small route.

## Complexity Tracking

| Item | Why Needed | Simpler Alternative Rejected Because |
|------|------------|-------------------------------------|
| 003/004 manual device checks still open while this feature starts | Owner's choice to continue; both features are merged and Principle V is implemented, only recorded phone verification is pending. This feature's P-D1 can run in the same phone session | Blocking practice on phone sessions the owner prefers to batch |
| Session queue changed from exercise ids to `lessonId/exerciseId` keys | Exercise ids repeat across lessons (`toki`), and one code path for lesson and practice sessions avoids duplicating the retry/feedback logic (R2) | A separate practice slice duplicates that logic; keeping ids for lessons and keys for practice means two lookup paths |
| Second `localStorage` key | Keeps word records independent of progress: no progress migration, and a bad word record can never reset lesson progress (R5, FR-012) | Extending `duopona:progress` to v2 needs a migration and couples their failure modes |
