# Implementation Plan: Mistake Explanations

**Branch**: `008-mistake-explanations` | **Date**: 2026-11-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/008-mistake-explanations/spec.md`

## Summary

After a wrong answer, the feedback sheet explains the right answer: the meanings of the
exercise's course words (006's tested-words rule plus the course glossary), the meaning of a
wrong multiple-choice pick when it is a course word, and, for the 49 grammar exercises, the
lesson's grammar point, its book lesson and a one- or two-sentence note. The explanation is
**derived at render time** by a pure function `explainMistake()` from content that already
exists, plus one new optional content field `grammarNote` on word-bank exercises. The session
`Feedback` gains the learner's `given` answer so the wrong pick can be explained. Nothing new is
stored in `localStorage`; scoring, mistakes, progress and streaks are untouched.

## Technical Context

**Language/Version**: TypeScript 6 (strict)

**Primary Dependencies**: React 19, Redux Toolkit 2, react-redux 9, React Router 8, Vite 8,
vite-plugin-pwa 2; **no new dependencies**

**Storage**: none new; `duopona:progress`, `duopona:words`, `duopona:streak` unchanged (FR-008).
The session (not persisted) gains `feedback.given`

**Testing**: Vitest + React Testing Library. New unit tests for `explainMistake()`; course
content tests extended (every grammar exercise has a valid note, notes only on grammar
exercises); `sessionSlice` test for `feedback.given`; lesson and practice flow integration tests
extended for the explanation block. Manual checks per quickstart S1–S5, S-D1

**Target Platform**: iOS Safari and Android Chrome (browser and installed); desktop browsers

**Project Type**: Frontend-only single-page web app (PWA)

**Performance Goals**: Explanation appears with the feedback sheet, no extra tap; derivation
is a lookup over ≤ ~10 words

**Constraints**: Offline (content is part of the bundled lessons; precache unchanged in kind);
360 px width, Continue always reachable (FR-007, FR-009, SC-004); original text (FR-006)

**Scale/Scope**: 1 new pure module, 1 optional content field filled on 49 exercises, 1 field on
`Feedback`, 1 component reworked (`FeedbackBanner`), CSS for the explanation block; 0 new
routes, 0 new storage keys

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. KISS | No dependencies. Explanation derived on render by one pure function from existing glossary, tested-words rule and lesson data (R1, R3); only new content is one optional string per grammar exercise (R2). No explanation registry or generic text templates | ✅ Pass |
| II. Frontend-only, local-first | No data stored or sent; explanations ship with the static lessons (R1) | ✅ Pass |
| III. Standard React stack | `given` answer added to the existing Redux session `Feedback` (shared state already read by the sheet); explanation itself is derived, not stored (R4) | ✅ Pass |
| IV. Tests after code, before done | Unit tests for `explainMistake()` and content rules; integration tests in lesson and practice flows; 360 px and phone checks as written manual checks (quickstart) | ✅ Pass |
| V. Mobile-first PWA | Sheet capped in height with an internal scroll area, Continue outside it (R5, contract F1); no network assets | ✅ Pass |
| Governance: Transitional compliance | No open gaps | ✅ Pass |

**Post-design re-check (after Phase 1)**: unchanged. One pure function used by the sheet and
its tests, one optional content field, one session field; no abstraction with fewer than two
uses.

## Project Structure

### Documentation (this feature)

```text
specs/008-mistake-explanations/
├── plan.md
├── research.md                 # R1–R6
├── data-model.md               # grammarNote, Feedback.given, Explanation
├── quickstart.md               # automated coverage, S1–S5, S-D1
├── contracts/
│   └── ui-feedback-sheet.md    # F1: wrong-answer sheet with explanation
├── checklists/requirements.md
└── tasks.md                    # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── content/
│   ├── types.ts                # + WordBankExercise.grammarNote?: string (R2)
│   ├── explanations.ts         # new: explainMistake(key, given) → Explanation | null (R1, R3)
│   └── lessons/*.ts            # + grammarNote on each of the 49 practisesGrammar exercises (R6)
├── store/
│   └── sessionSlice.ts         # Feedback + given; submitAnswer stores it (R4)
└── components/
    ├── ExerciseScreen.tsx      # passes the current exercise key to the sheet
    ├── FeedbackBanner.tsx      # renders the explanation after a wrong answer (contract F1)
    └── Exercise.module.css     # explanation block, capped sheet with inner scroll (R5)
tests/
├── unit/
│   ├── explanations.test.ts    # new
│   ├── courseContent.test.ts   # + grammarNote rules (SC-001, SC-002)
│   └── sessionSlice.test.ts    # + feedback.given
└── integration/
    ├── lessonFlow.test.tsx     # + explanation shown on wrong, absent on right
    └── practiceFlow.test.tsx   # + grammar lesson named in a mixed session
```

**Structure Decision**: Existing single-project layout. The explainer sits in `src/content/`
next to `words.ts` (`testedWords`), which it reuses.

## Complexity Tracking

| Item | Why Needed | Simpler Alternative Rejected Because |
|------|------------|-------------------------------------|
| `given` on the session `Feedback` | FR-003 needs the learner's pick after the exercise UI has reported it; the sheet reads feedback from the store | Lifting the pick into `ExerciseScreen` local state duplicates what `submitAnswer` already receives and splits feedback across two places |
