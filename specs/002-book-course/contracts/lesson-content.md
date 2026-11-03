# Contract: Lesson Content Rules

Every lesson file in `src/content/lessons/` MUST satisfy these rules. Rules marked **auto** are
enforced by `tests/unit/courseContent.test.ts`; rules marked **review** are checked by a person
before merge.

| # | Rule | Source | Check |
|---|------|--------|-------|
| C1 | Lessons appear in the FR-001 order with the FR-001 titles and `newWords` (plus the particles *li* in lesson 1 and *e* in lesson 4, see below) | FR-001 | auto |
| C2 | 10–15 exercises per lesson, at least 3 word-bank | FR-003 | auto |
| C3 | Every word in `newWords` appears on the Toki Pona side of at least one exercise of that lesson | FR-004, SC-002 | auto |
| C4 | Every Toki Pona token in a lesson is in the `newWords` of that lesson or an earlier one | FR-005, SC-003 | auto |
| C5 | At least 2 word-bank exercises have `practisesGrammar: true` | FR-006 | auto (count) + review (truthful) |
| C6 | Every `newWords` entry exists in `vocabulary.ts`; meanings are consistent with the book's dictionary and not copied from it | FR-007 | auto (exists) + review (meaning) |
| C7 | Multiple choice: 3–4 unique options, answer among them, no second correct option | FR-004 (001), SC-004 | auto (shape) + review (meaning) |
| C8 | Word bank: no distractor appears in the answer; only one word order is a correct answer | SC-004 | auto (distractors) + review (order) |
| C9 | No sentence, exercise or explanation copied from the book | FR-008 | review |
| C10 | No proper-name or number-system exercises; *unpa*, *tu*, *luka*, *nanpa* not used | FR-002 | auto (words) + review |
| C11 | Exercise ids unique within a lesson; lesson ids unique across the course | — | auto |

## Toki Pona side of an exercise (for C3/C4/C10)

| Exercise | Toki Pona text checked |
|----------|------------------------|
| multiple choice `tp-en` | `prompt` |
| multiple choice `en-tp` | `options` (includes `answer`) |
| word bank `tp-en` | `prompt` |
| word bank `en-tp` | `answer` + `distractors` |

Tokenizing: lower-case, strip `.,!?` and quotes, split on whitespace.

## Grammar particles

*li* is introduced in lesson 1 (Words and Sentences) and *e* in lesson 4 (Verbs); both are listed
in those lessons' `newWords` for the C4 check even though they are particles, not vocabulary.
