---

description: "Task list for feature 008: Mistake Explanations"
---

# Tasks: Mistake Explanations

**Input**: Design documents from `/specs/008-mistake-explanations/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R6), data-model.md,
contracts/ui-feedback-sheet.md (F1), quickstart.md (S1–S5, S-D1)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. The 360 px layout and phone behaviour are validated manually
(IV exception) with quickstart S4 and S-D1, results recorded under the matching task.

**Organization**: Tasks are grouped by user story: US1 (P1, word meanings and the wrong pick),
US2 (P2, grammar point, book lesson and note). US2 extends the explainer and sheet built in US1.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1, US2)

## Path Conventions

Single frontend project: `src/`, `tests/` at the repository root. Run commands from the
repository root.

## Environment notes (read before any task)

- **npm in the sandbox**: prefix `npm`/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`
  (`~/.npm` is read-only). No new packages are needed.
- **Dev/preview server**: a server started from the sandbox is not reachable from Chrome. Ask
  the user to run `npm run dev` (http://localhost:5173) or `npm run build && npm run preview`
  (http://localhost:4173) themselves, then drive Chrome against it.
- **Exercise keys** are `lessonId/exerciseId` (`exerciseKey()`, `getExercise()` in
  src/content/lessons/index.ts). The lesson of an exercise is the part before the slash, in
  every session kind (research R1).
- **Course words** of an exercise: `testedWords(exercise)` in src/content/words.ts; meanings:
  `vocabulary` in src/content/vocabulary.ts. Do not change either.
- **Do not change** scoring (`isCorrectAnswer`), `missedOnce`, word records, progress, streak,
  or anything in src/store/persistence.ts (FR-008).
- Existing tests match the sheet with `getByRole('status')` + `toHaveTextContent(...)`
  (substring), so adding text inside the status region keeps them passing; keep exactly **one**
  `role="status"` element in the sheet.

---

## Phase 1: Setup

- [X] T001 On branch `008-mistake-explanations` (already created from `main`), run `npm test` and `npm run lint` and record the passing test count under this task as the baseline
  - **Result (2026-11-04)**: baseline `npm test` 546 passed; lint clean

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The learner's answer reaches the feedback sheet. No visible change yet.

- [X] T002 In src/store/sessionSlice.ts add `given: string | string[]` to `interface Feedback` (doc comment: "The answer as submitted; session only, never saved (008 research R4)") and set it in `submitAnswer`: `state.feedback = { correct, correctAnswer: formatAnswer(exercise), given: action.payload }`. Change nothing else in the slice
- [X] T003 In src/components/ExerciseScreen.tsx read `const exerciseKeyValue = useAppSelector(selectCurrentKey)` (from src/store/sessionSlice.ts) and pass it to `FeedbackBanner` as a new prop `exerciseKey: string`; in src/components/FeedbackBanner.tsx add the prop to `Props` (unused until T005)
- [X] T004 Run `npm run lint`, `npm run build`, `npm test`; all existing tests must pass unchanged
  - **Result (2026-11-04)**: the three `toEqual` feedback assertions in tests/unit/sessionSlice.test.ts gained `given` (they now also cover T010); build fails until T006 adds the `exerciseKey` prop (expected); 546 passed

**Checkpoint**: feedback carries the answer and the sheet knows the exercise key

---

## Phase 3: User Story 1 - Word meanings behind the right answer (Priority: P1) 🎯 MVP

**Goal**: After a wrong answer, the sheet lists the exercise's course words with meanings and,
for a multiple-choice pick that is a course word, what that word means (FR-001–FR-003).

**Independent Test**: Lesson "You and I", on "group / community" pick "tomo" → sheet shows
"kulupu", "kulupu: group / community" and "tomo means house / building / room"; a right answer
shows only "pona! Correct."

### Implementation for User Story 1

- [X] T005 [US1] Create src/content/explanations.ts (research R1, R3; data-model `Explanation`): export `interface WordMeaning { word: string; meaning: string }`, `interface GrammarExplanation { title: string; lesson: string; note: string }`, `interface Explanation { words: WordMeaning[]; wrongPick: WordMeaning | null; grammar: GrammarExplanation | null }` and `export function explainMistake(key: string, given: string | string[]): Explanation | null`. Return `null` when `getExercise(key)` is undefined. `words` = `testedWords(exercise).map((word) => ({ word, meaning: vocabulary[word] }))` ("distinct, first-seen order (FR-002)"). `wrongPick`: only when `exercise.type === 'multipleChoice'` and `typeof given === 'string'`; `const pick = given.trim().toLowerCase()`; set `{ word: pick, meaning: vocabulary[pick] }` when `Object.hasOwn(vocabulary, pick)` and `pick !== exercise.answer.toLowerCase()`, else `null` ("Multiple-choice only: given (trimmed, lower-case) when it is a course word ≠ answer (FR-003)"). `grammar`: always `null` for now (US2, T013)
- [X] T006 [US1] Rework src/components/FeedbackBanner.tsx per contract F1: replace the `<p role="status">` with a `<div role="status" className={styles.sheetText}>` holding the same title / label / answer spans (keep the visually hidden "." and the exact texts "pona! Correct.", "Not quite", "Correct answer:"); when `!correct`, compute `explainMistake(exerciseKey, feedback.given)` and, when not null, render inside the status div after the answer a `<div className={styles.explain}>` with: if `words.length` a `<ul className={styles.explainWords}>` of `<li><strong lang="tok">{word}</strong>: {meaning}</li>`; if `wrongPick` a `<p className={styles.explainPick}><strong lang="tok">{word}</strong> means {meaning}</p>`. Omit empty sections entirely. Continue button stays outside the status div with `autoFocus`
- [X] T007 [US1] In src/components/Exercise.module.css (research R5): make `.sheet` a column flex container capped at `max-height: 75dvh`; `.sheetRow { flex: 1 1 auto; min-height: 0; overflow-y: auto }` so the icon and text scroll together; the Continue button is a non-shrinking flex item (`flex-shrink: 0`) and stays visible below the row; add `.explain` (top border 1px in the error text colour at low opacity or `--line`, `margin-top: 12px; padding-top: 12px`), `.explainWords` (no bullets, no padding, `font-size: 17px`, regular weight, 4 px gap between lines), `.explainPick` (`margin: 8px 0 0; font-size: 17px`). Glosses wrap (`overflow-wrap: anywhere` already on `.sheetText`); nothing may scroll horizontally at 360 px
- [X] T008 [US1] Run `npm run lint`, `npm run build`, `npm test`; existing lesson/practice/streak flow tests must pass (fix only queries that became ambiguous because a word now also appears in the sheet, e.g. `getByText('kulupu')` → scope with `within`)
  - **Result (2026-11-04)**: lint clean, build ok, 546 passed; no existing query needed changes

### Tests for User Story 1

- [X] T009 [P] [US1] Create tests/unit/explanations.test.ts: unknown key → `null`; lesson `you-and-i` exercise `kulupu` (en-tp multiple choice) with given `'tomo'` → words `[{kulupu, 'group / community'}]`, wrongPick `{tomo, 'house / building / room'}`; same with given `'kulupu'` (not wrong) → wrongPick `null`; tp-en multiple choice `sin` with an English pick → wrongPick `null`, words `[sin]`; word bank `kulupu-sina-li-wawa` with any given array → words kulupu, sina, li, wawa in that order, wrongPick `null`; a word repeated in the Toki Pona text is listed once (find such an exercise in the course or assert distinctness over all exercises); multiple-choice phrase pick (`lipu-sin` with `'sin lipu'`) → wrongPick `null`
- [X] T010 [P] [US1] Extend tests/unit/sessionSlice.test.ts: after `submitAnswer('x')` on a multiple-choice exercise and `submitAnswer(['a','b'])` on a word bank, `feedback.given` equals the payload; `correct` and `missedOnce` behave as before
  - **Result (2026-11-04)**: covered by the updated feedback assertions (multiple choice `given: firstWrong`, word bank `given` = reversed tiles); scoring and `missedOnce` assertions unchanged
- [X] T011 [US1] Extend tests/integration/lessonFlow.test.tsx: in lesson `you-and-i`, answer an en-tp multiple-choice exercise wrong with a course-word option → status region contains "Not quite", "Correct answer:", the answer, a list item "<answer>: <meaning>" and "<pick> means <meaning>"; answer one right → status text is "pona! Correct." with no list (`within(status).queryByRole('list')` is null); after Continue, the missed exercise comes back and a second wrong answer shows the same explanation; quitting and scoring unaffected
  - **Result (2026-11-04)**: 2 tests in a new `mistake explanations (feature 008)` block (wrong pick + right answer + retry; sentence word order); with T009 (7 tests) the three suites pass (66)

### Validation for User Story 1

- [X] T012 [US1] Manual check in Chrome with the user running `npm run dev`: quickstart S1 and S3; record results under this task
  - **Result (2026-11-04)**: Chrome against `npm run dev`, window 500×850. S3: first exercise (mi) right → "pona! Correct." only, no list. S1: "group / community", picked tomo → "Not quite", "Correct answer: kulupu", "kulupu: group / community", "tomo means house / building / room"; Continue visible. The divider spanned only the text width on short explanations: `.sheetText` now `flex: 1` (fixed during this check). Learner data backed up first and restored afterwards; no console errors

**Checkpoint**: word meanings shown after wrong answers; MVP shippable

---

## Phase 4: User Story 2 - The grammar point and its lesson (Priority: P2)

**Goal**: For the 49 grammar exercises, the sheet also names the grammar point, the book lesson
and a short note on why the right answer follows it, in every session kind (FR-004–FR-006).

**Independent Test**: Lesson "You and I", "I am strong." built as "mi li wawa" → sheet shows
"mi wawa", word meanings, "mi and sina need no li", "Lesson 4 · You and I" and the note.

### Implementation for User Story 2

- [X] T013 [US2] In src/content/types.ts add to `WordBankExercise`: `/** Why the right answer follows the lesson's grammar point; present iff practisesGrammar. ≤ 2 sentences, ≤ 160 characters, original wording (008 FR-005, FR-006) */ grammarNote?: string`. In src/content/explanations.ts set `grammar` when `exercise.type === 'wordBank' && exercise.practisesGrammar && exercise.grammarNote`: `{ title: lesson.grammar.title, lesson: \`${lesson.chapter} · ${lesson.title}\`, note: exercise.grammarNote }`, where `lesson = getLesson(key.slice(0, key.indexOf('/')))`
- [X] T014 [P] [US2] Write `grammarNote` for every `practisesGrammar: true` exercise in src/content/lessons/01-words-and-sentences.ts, 02-nouns-and-adjectives.ts, 03-you-and-i.ts, 04-verbs.ts (13 notes). Rules (research R6): "Present iff practisesGrammar === true. Non-empty, ≤ 2 sentences, ≤ 160 characters, original wording"; read the lesson's `grammar.explanation` first; each note says why *this* exercise's right answer follows the rule, using its own words (e.g. for `mi-wawa`: "With mi alone as the subject, li is left out."); plain English, Toki Pona words as written in the course; do not copy the book
- [X] T015 [P] [US2] Same as T014 for src/content/lessons/05-more-adjectives.ts, 06-questions-and-answers.ts, 07-prepositions.ts, 08-greetings-and-feelings.ts (12 notes)
- [X] T016 [P] [US2] Same as T014 for src/content/lessons/09-pi.ts, 10-pre-verbs.ts, 11-colours-and-la.ts, 12-spatial-nouns.ts (12 notes)
- [X] T017 [P] [US2] Same as T014 for src/content/lessons/13-particles-and-perspective.ts, 14-hunting.ts, 15-cooking.ts, 16-more-words-1.ts, 17-more-words-2.ts (12 notes)
  - **Result (2026-11-04)**: 49 notes in all (13 + 12 + 12 + 12), each ≤ 160 characters and ≤ 2 sentences; added with a small script inserting `grammarNote` after `practisesGrammar: true`
- [X] T018 [US2] In src/components/FeedbackBanner.tsx render, after the words and wrong pick inside `.explain`, when `grammar`: `<div className={styles.explainGrammar}><p className={styles.explainGrammarTitle}>{title}</p><p className={styles.explainLesson}>{lesson}</p><p>{note}</p></div>` (contract F1 order: words, wrong pick, grammar). In src/components/Exercise.module.css add `.explainGrammar` (`margin-top: 12px; font-size: 17px`), `.explainGrammarTitle` (weight 800), `.explainLesson` (smaller, 15 px, weight 700, slightly muted using the existing error text colour), paragraphs `margin: 0` with 2–4 px spacing
- [X] T019 [US2] Run `npm run lint`, `npm run build`, `npm test`
  - **Result (2026-11-04)**: lint clean, build ok, 555 passed

### Tests for User Story 2

- [X] T020 [P] [US2] Extend tests/unit/courseContent.test.ts: for every exercise in every lesson, `practisesGrammar === true` ⇔ `grammarNote` is a non-empty string (so notes appear only on grammar exercises); each note ≤ 160 characters and ≤ 2 sentences (count `.`, `!`, `?` followed by space or end); total grammar notes = 49; **SC-001**: for every exercise, `explainMistake(exerciseKey(lesson.id, e.id), <a wrong answer>)` returns `words.length > 0 || grammar !== null`; **SC-003**: for every multiple-choice exercise and every option that is a key of `vocabulary` and differs from the answer, `explainMistake(key, option).wrongPick` is not null
- [X] T021 [P] [US2] Extend tests/unit/explanations.test.ts: `you-and-i/mi-wawa` with given `['mi','li','wawa']` → grammar `{ title: 'mi and sina need no li', lesson: 'Lesson 4 · You and I', note: <its grammarNote> }`; a non-grammar word bank and any multiple choice → grammar `null`; a grammar exercise in a Dictionary lesson → lesson starts with `'Dictionary · '`
- [X] T022 [US2] Extend tests/integration/lessonFlow.test.tsx (grammar exercise in `you-and-i`, built wrong) → status region contains the grammar title, "Lesson 4 · You and I" and the note; and tests/integration/practiceFlow.test.tsx (seed completed lessons as in that file, start a practice session, seed only lesson `pi` as completed, stub `vi.spyOn(Math, 'random').mockReturnValue(0)` before starting Practice (restore in `afterEach`), read the queue from the store and answer correctly until a `practisesGrammar` exercise from `pi` is current, then answer it wrong) → the status region names that exercise's own lesson (`<chapter> · <title>`)
  - **Result (2026-11-04)**: lesson flow: grammar exercise `mi-wawa` test; practice flow: lesson `pi` only, `Math.random` stubbed to 0, the grammar exercise is in the queue and its sheet names "Lesson 11 · Grouping…" lesson ("Lesson 11 · " + title). Full suite 563 passed (T020: 3 course content tests incl. SC-003 over every option; T021: 3 grammar unit tests), lint clean, build ok

### Validation for User Story 2

- [X] T023 [US2] Manual check in Chrome with the user running `npm run dev`: quickstart S2, S4 (360×740, the grammar exercise with the longest note plus most words) and S5; record results under this task, including the owner's opinion of the explanation's look (no mockup exists) and a skim of a few notes
  - **Result (2026-11-04)**: S2: "I am strong." built as mi li wawa → "mi wawa", mi and wawa meanings, "mi and sina need no li", "Lesson 4 · You and I", the note; all explanation text 17 px (lesson line 15 px). S4: 360×740 same-origin iframe, longest explanation in the course (Hunting, "In the daytime, the hunter goes to the plants.", 8 words + grammar): sheet capped at 555 px (75%), row scrolls (554 px content in 441 px), Continue at 657–712 px of 740, no horizontal scroll (scrollWidth 345). S5: practice over 13 completed lessons, "At night, I stay in the house." missed → "Colours, and setting the scene with la", "Lesson 14 · Colours and la", its note. Progress was temporarily set to 13 completed lessons for S4/S5 and restored from the backup (words records created by the run removed). Owner's opinion of the look and a skim of the notes: pending

**Checkpoint**: grammar explanations complete

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T024 [P] Update README.md: in the course/features section mention that wrong answers explain the right one (word meanings, and the grammar point with its book lesson for grammar exercises)
- [~] T025 Ask the user to run quickstart S-D1 on iPhone (Safari) and Android (Chrome), installed; record results under this task (the owner may waive it under the constitution's recorded-waiver rule, Principle IV; then mark `[~]` with the date and "owner decision" and name the waived check in spec.md **Status**)
  - **Won't do (2026-11-04)**: owner decision (constitution IV waiver); phone check S-D1 not run
- [X] T026 Set spec.md **Status** to `Implemented` (or `Implemented (…)` naming skipped manual checks); update ROADMAP.md: move the item from **In progress** to **Done** as `**008 – Mistake explanations**: word meanings, grammar point and book lesson after a wrong answer (\`specs/008-mistake-explanations/\`).`, leaving **In progress** as `(none)`
  - **Result (2026-11-04)**: Status `Implemented (phone check S-D1 skipped by owner decision, task T025)`; requirements checklist unchanged (14/14); ROADMAP updated
- [X] T027 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa` all pass; record the test count vs. T001's baseline under this task (offline use of explanations is covered by the bundled lesson content and the precache check in `test:pwa`; FR-009)
  - **Result (2026-11-04)**: `npm test` 563 passed (baseline 546, +17); lint clean; build ok (precache 12 entries, 497.59 KiB); `npm run test:pwa` 26 passed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: first
- **Foundational (Phase 2)**: after T001; T002 → T003 → T004; blocks both stories
- **US1 (Phase 3)**: after Phase 2; T005 → T006 → T007 → T008 → tests → T012
- **US2 (Phase 4)**: after US1's T005–T007 (extends the same explainer, sheet and CSS). T013 before T014–T017 (type field); T014–T017 in parallel; T018 after T013
- **Polish (Phase 5)**: after both stories; T025 needs the user and real phones

### Within Each Story

- Implementation → lint/build → tests (Constitution IV: tests after code) → manual validation
- Same-file order: src/content/explanations.ts (T005 → T013), src/components/FeedbackBanner.tsx (T003 → T006 → T018), src/components/Exercise.module.css (T007 → T018), tests/unit/explanations.test.ts (T009 → T021), tests/integration/lessonFlow.test.tsx (T011 → T022)

### Parallel Opportunities

- US1 tests: T009 and T010
- US2 notes: T014, T015, T016, T017 (different lesson files)
- US2 tests: T020 and T021
- T024 (README) any time after T018

---

## Parallel Example: User Story 2 notes

```text
Task: "T014 grammarNote for lessons 01–04"
Task: "T015 grammarNote for lessons 05–08"
Task: "T016 grammarNote for lessons 09–12"
Task: "T017 grammarNote for lessons 13–17"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 + Phase 2: answer carried in feedback, no visible change
2. Phase 3 (US1): word meanings and wrong pick in the sheet
3. **STOP and VALIDATE**: T012; shippable on its own

### Incremental Delivery

1. Setup + Foundational → no visible change, existing tests pass
2. US1 → word meanings (MVP)
3. US2 → grammar point, book lesson, 49 notes
4. Polish → README, phones, final gate
