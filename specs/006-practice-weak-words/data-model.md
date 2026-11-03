# Data Model: Practice Session and Review Weak Words

## Exercise key (derived, not stored)

`"<lessonId>/<exerciseId>"`, e.g. `you-and-i/mi-wawa`. Unique across the course (lesson ids and
exercise ids within a lesson are already unique, `tests/unit/courseContent.test.ts` C11).
Resolved with `getExercise(key)`; an unknown key resolves to `undefined`.

## Session (Redux `session`, in memory only)

Changes to the existing `LessonSession` (feature 001):

| Field | Type | Change | Notes |
|-------|------|--------|-------|
| `kind` | `'lesson' \| 'practice' \| 'review'` | new | |
| `lessonId` | `string \| null` | now nullable | set only when `kind === 'lesson'` |
| `queue` | `string[]` | now exercise **keys** | head = current exercise; missed ones go to the end |
| `missedOnce` | `string[]` | now exercise keys | |
| `total` | `number` | new | queue length at start; replaces counting the lesson's exercises |
| `feedback`, `status`, `step` | | unchanged | |

**Transitions**: `startLesson(lessonId)` and the new `startPractice({ kind, keys })` → `answering`;
`submitAnswer` → `feedback`; `continueLesson` → `answering` or `finished`; `quitLesson` → `null`.
Unchanged from 001 apart from the start action.

**Rules**:
- `startPractice` with an empty `keys` list leaves the session `null`.
- A lesson is recorded as completed on `finished` only when `kind === 'lesson'` (FR-005).

## Word record (Redux `words`, saved)

```ts
interface WordStats {
  /** Course word → outstanding mistakes; only counts ≥ 1 are kept */
  mistakes: Record<string, number>
}
```

| Action | Payload | Effect |
|--------|---------|--------|
| `wordsMissed` | `string[]` (tested words) | each word +1 |
| `wordsKnown` | `string[]` (tested words) | each word −1; removed at 0; absent words unchanged |

Dispatched only for the **first answer** to an exercise in a session (research R4).
`wordsKnown` leaves out words tested by exercises already missed in the same session.

**Derived**:
- `weak words` = keys of `mistakes`.
- `canReview` = some available exercise (in a completed lesson) tests a weak word (FR-013).
- `canPractice` = at least one completed lesson that exists in the course (FR-001).

Saved under `duopona:words`, see [contracts/words-storage.md](contracts/words-storage.md).

## Lesson progress

Unchanged (`duopona:progress` v1). Practice and review never write to it (FR-005).
