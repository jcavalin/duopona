# Research: Mistake Explanations

No open technical questions remained after the spec's clarification (notes on the 49 grammar
exercises only). These are the design decisions.

## R1. Derive the explanation, don't store it

- **Decision**: A pure function `explainMistake(key: string, given: string | string[])` in
  `src/content/explanations.ts` returns an `Explanation` (see
  [data-model.md](data-model.md)) or `null` when the key is unknown. It is called by
  `FeedbackBanner` only when the answer was wrong. Lesson lookup uses the lesson id in the
  exercise key (`lessonId/exerciseId`), so practice and review sessions name the right lesson
  (FR-004).
- **Rationale**: Everything except grammar notes already exists (glossary, tested words, lesson
  grammar title and chapter). Deriving keeps one source of truth and nothing to persist
  (FR-008, Principle I/II).
- **Alternatives**: Writing a full explanation per exercise (214 texts, duplicates glossary);
  computing it in the reducer and storing it in `Feedback` (bigger state for no gain).

## R2. Grammar notes as an optional exercise field

- **Decision**: Add `grammarNote?: string` to `WordBankExercise`. All 49 `practisesGrammar`
  exercises are word banks, so the field lives only there. Rules, enforced by
  `courseContent.test.ts`: every exercise with `practisesGrammar: true` has a non-empty
  `grammarNote` of at most 2 sentences and at most 160 characters; no other exercise has one.
- **Rationale**: Keeps the note next to the exercise it explains, in the same files the owner
  can skim; tests make the 100 % coverage of SC-002 automatic.
- **Alternatives**: A separate notes map keyed by exercise key (drifts when exercises are
  edited); making the field required with a type-level union (heavier types for a rule a test
  covers).

## R3. Which words, and the wrong pick

- **Decision**: Words = `testedWords(exercise)` (006 FR-007: course words of the Toki Pona side,
  distinct, first-seen order), each with `vocabulary[word]`. Wrong pick: only for
  multiple-choice; `given` lower-cased and trimmed, shown when it is a key of `vocabulary` and
  differs from the answer. Word-bank wrong answers show no per-tile meanings (the right
  sentence's words already cover the tiles that matter).
- **Rationale**: Same word set as weak-word tracking, so the two features agree; no tokenizer
  beyond the existing one.
- **Alternatives**: Glossing every word of a wrong word-bank answer (noisy, often lists
  distractors the learner did not use); glossing English words (no English → Toki Pona glossary).

## R4. Carrying the learner's answer

- **Decision**: `Feedback` becomes `{ correct, correctAnswer, given }`; `submitAnswer` stores
  `action.payload` as `given`. The session is never persisted, so no storage change.
- **Rationale**: The sheet already reads `Feedback` from the store; one field avoids a second
  channel (see plan Complexity Tracking).
- **Alternatives**: Passing the pick from `MultipleChoice` up through `ExerciseScreen` state.

## R5. Sheet layout with longer content

- **Decision**: The sheet stays a bottom sheet. The text area (title, correct answer,
  explanation) becomes one live region (`role="status"` on a `div`, since it now contains a
  list); the row holding the icon and status region scrolls inside the sheet when needed; the sheet is capped at `max-height: 75dvh`
  and the Continue button stays outside the scroll area, always visible. Explanation text is
  17 px regular weight under the bold answer, words as a list of "word: meaning" lines, the
  grammar part as a small heading (grammar title), a lesson line ("Lesson 4 · You and I") and
  the note.
- **Rationale**: FR-007/FR-009/SC-004. Existing tests read `getByRole('status')` and match by
  substring, so they keep passing.
- **Alternatives**: A separate "Why?" expandable (extra tap; the spec wants it shown); a modal
  (breaks the existing flow and focus order).

## R6. Writing the notes

- **Decision**: Notes are written during implementation, one task per lesson file group, in
  plain English, original, tied to the lesson's grammar text (e.g. "With mi alone as the
  subject, li is left out."). Each states why the right answer follows the rule, not just the
  rule's name. The owner may review them in the lesson files.
- **Rationale**: Spec clarification 2026-11-04; FR-006 (original, consistent with the book).
- **Alternatives**: Generating notes from the grammar explanation paragraphs (too long, not
  specific to the exercise).
