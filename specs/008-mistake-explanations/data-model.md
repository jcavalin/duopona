# Data Model: Mistake Explanations

Nothing new is persisted. Two content/session fields are added, and one value is derived.

## Course content: `WordBankExercise.grammarNote` (new, optional)

| Field | Type | Rules |
|-------|------|-------|
| `grammarNote` | `string?` | Present **iff** `practisesGrammar === true` (49 exercises). Non-empty, ≤ 2 sentences, ≤ 160 characters, original wording (FR-005, FR-006) |

## Session: `Feedback.given` (new)

| Field | Type | Rules |
|-------|------|-------|
| `correct` | `boolean` | unchanged |
| `correctAnswer` | `string` | unchanged |
| `given` | `string \| string[]` | The answer passed to `submitAnswer`, as given. Session state only; never saved |

## Derived: `Explanation` (returned by `explainMistake(key, given)`)

| Field | Type | Source |
|-------|------|--------|
| `words` | `{ word: string; meaning: string }[]` | `testedWords(exercise)` with `vocabulary` meanings; distinct, first-seen order (FR-002) |
| `wrongPick` | `{ word: string; meaning: string } \| null` | Multiple-choice only: `given` (trimmed, lower-case) when it is a course word ≠ answer (FR-003) |
| `grammar` | `{ title: string; lesson: string; note: string } \| null` | Only when `practisesGrammar`: `lesson.grammar.title`, `"<chapter> · <title>"` of the exercise's own lesson, `grammarNote` (FR-004, FR-005) |

`explainMistake` returns `null` for an unknown key. Every course exercise yields at least one
word or a grammar part (SC-001; asserted over the whole course in tests).

## Not changed

Scoring (`isCorrectAnswer`), `missedOnce`, word mistake records, progress, streaks, storage keys
(FR-008).
