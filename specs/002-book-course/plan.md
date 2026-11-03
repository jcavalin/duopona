# Implementation Plan: Book-Based Toki Pona Course

**Branch**: `002-book-course` | **Date**: 2026-11-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-book-course/spec.md`

## Summary

Replace the single "Basic Words" lesson with a 17-lesson course that follows the book's chapter
order (skipping Proper Names and Numbers), plus two "More Words" lessons. Content is original,
written as one typed module per lesson with a shared vocabulary of dictionary glosses, and
guarded by an automated content test suite. The UI gains sequential unlocking (derived from
existing saved progress), a lesson introduction screen, and a credit footer; screens are brought
up to the mobile screen rules of Constitution V. No new dependencies; storage format unchanged.

## Technical Context

**Language/Version**: TypeScript 6 (strict)

**Primary Dependencies**: Unchanged — React 19, Redux Toolkit 2, react-redux 9, React Router 8,
Vite 8

**Storage**: Unchanged — `localStorage` key `duopona:progress` v1

**Testing**: Vitest + React Testing Library; new content-rules suite

**Target Platform**: Mobile-first web (iOS Safari, Android Chrome) and desktop browsers

**Project Type**: Frontend-only single-page web app

**Performance Goals**: Each lesson completable in < 7 min (SC-001); bundle growth from content
< 100 KB gzipped

**Constraints**: Original content only (FR-008); no word before it is introduced (FR-005);
screens usable at 360 px with ≥ 44 px targets

**Scale/Scope**: 17 lessons, ~115 vocabulary entries, ~200 exercises, 1 new screen (intro)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. KISS | No new deps; unlocking derived from existing progress; intro uses component state; content as plain typed data | ✅ Pass |
| II. Frontend-only, local-first | No backend; storage format unchanged; content shipped with the app | ✅ Pass |
| III. Standard React stack | Redux for progress/session (unchanged); intro `started` flag is UI-local state | ✅ Pass |
| IV. Tests after code, before done | Content rules + unlock + intro covered by tests before done; existing tests updated to course data | ✅ Pass |
| V. Mobile-first PWA | Screen rules (360 px, 44 px targets, safe areas) applied to all touched screens. **Installability + offline not in this feature** | ⚠️ Justified deviation (see Complexity Tracking) |

**Post-design re-check (after Phase 1)**: unchanged. Design adds no abstractions beyond a
vocabulary module and one selector; Principle V deviation remains the only item and is tracked.

## Project Structure

### Documentation (this feature)

```text
specs/002-book-course/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── lesson-content.md     # content rules C1–C11 (auto + review)
│   └── ui-screens.md         # list (locked/credit), intro, guards
└── tasks.md                  # /speckit-tasks
```

### Source Code (repository root)

```text
index.html                         # viewport-fit=cover
src/
├── index.css                      # safe-area padding
├── content/
│   ├── types.ts                   # Lesson + chapter/newWords/grammar; practisesGrammar
│   ├── vocabulary.ts              # NEW: word → dictionary meaning
│   ├── lessons.ts                 # REMOVED (replaced by lessons/)
│   └── lessons/
│       ├── index.ts               # NEW: ordered `lessons`, getLesson()
│       ├── 01-words-and-sentences.ts … 15-cooking.ts
│       └── 16-more-words-1.ts, 17-more-words-2.ts
├── store/
│   └── progressSlice.ts           # + selectIsUnlocked
├── routes/
│   └── LessonRoute.tsx            # locked guard; intro before Start
└── components/
    ├── LessonList.tsx (+ .module.css)   # locked state, number, chapter, credit footer
    ├── LessonIntro.tsx (+ .module.css)  # NEW
    └── Exercise.module.css              # Quit ≥ 44 px
tests/
├── unit/
│   ├── courseContent.test.ts      # NEW: rules C1–C8, C10–C11
│   ├── lessons.test.ts            # REMOVED (superseded by courseContent)
│   ├── progressSlice.test.ts      # + unlock selector
│   └── sessionSlice.test.ts       # updated to course data
└── integration/
    └── lessonFlow.test.tsx        # updated; + locked, intro, unlock, replay
```

**Structure Decision**: Same single frontend project. Lesson content moves from one file to a
`lessons/` folder (one file per lesson) because of its size; everything else is edited in place.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Principle V: app not yet installable/offline (no manifest, no service worker) | Owner prioritised the course first, PWA immediately after (ROADMAP "Next") | Folding PWA into this feature would double its scope; the gap pre-dates this feature and is tracked as the next feature |
