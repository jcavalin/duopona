# Data Model: First Lesson Flow

Three kinds of data: static **content** (shipped with the app), **progress** (persisted on the
device), and the **session** (the lesson currently being played; in memory only).

## Content (static)

### Lesson

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Unique, stable (used as key in saved progress), e.g. `"basics-1"` |
| `title` | string | Non-empty, e.g. `"Basic Words"` |
| `exercises` | Exercise[] | At least 1; ids unique within the lesson |

### Exercise (one of two variants)

**Multiple choice**

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Unique within the lesson |
| `type` | `"multipleChoice"` | |
| `prompt` | string | The word/phrase shown, e.g. `"jan"` |
| `direction` | `"tp-en"` \| `"en-tp"` | Toki Pona→English or English→Toki Pona |
| `options` | string[] | 3–4 items, no duplicates |
| `answer` | string | MUST be one of `options` |

**Word bank (translation)**

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Unique within the lesson |
| `type` | `"wordBank"` | |
| `prompt` | string | Phrase to translate, e.g. `"I am good"` |
| `direction` | `"tp-en"` \| `"en-tp"` | |
| `answer` | string[] | Ordered words of the correct answer, e.g. `["mi","pona"]` |
| `distractors` | string[] | Extra tiles; none may make an alternative correct answer |

Tiles shown = `answer` + `distractors`, shuffled.

## Progress (persisted)

### LearnerProgress

| Field | Type | Rules |
|-------|------|-------|
| `completedLessons` | Record<lessonId, LessonResult> | Key present ⇔ lesson completed |

### LessonResult

| Field | Type | Rules |
|-------|------|-------|
| `firstTryCorrect` | number | 0 ≤ n ≤ total |
| `total` | number | Number of exercises in the lesson |
| `completedAt` | string | ISO 8601 timestamp of the latest completion |

Re-completing a lesson overwrites its `LessonResult` (spec edge case: summary reflects latest
attempt). Storage format: see [contracts/progress-storage.md](contracts/progress-storage.md).

## Session (in memory, not persisted)

### LessonSession

| Field | Type | Meaning |
|-------|------|---------|
| `lessonId` | string | Lesson being played |
| `queue` | string[] | Exercise ids still to answer correctly; head = current exercise |
| `missedOnce` | string[] | Exercise ids answered wrong at least once |
| `feedback` | `null` \| `{ correct: boolean, correctAnswer: string }` | Shown after submit |
| `status` | `"answering"` \| `"feedback"` \| `"finished"` | See transitions |

Derived values:
- *Position* (FR-007): answered-correctly count = total − `queue.length`.
- *First-try correct* (FR-008): total − `missedOnce.length`.

### State transitions

Navigation drives the session: entering `#/lesson/:lessonId` dispatches `startLesson`;
leaving that route (Quit, Back to lessons, browser Back) dispatches `quitLesson`.

```text
(no session) --startLesson(id)--> answering   queue = all exercise ids in order

answering --submit(correct)--> feedback       head will be removed on continue
answering --submit(wrong)----> feedback       id added to missedOnce; head stays current for feedback

feedback --continue--> (queue update)         correct: head removed; wrong: head moved to queue end
feedback --continue--> answering              if queue not empty
feedback --continue--> finished               if queue empty → progress.completeLesson(...)

finished  --backToList--> (no session)
answering/feedback --quitLesson--> (no session)   nothing saved (FR-013)
```

Validation rules carried from the spec:
- Submit is disabled until an option is selected / at least one tile is placed.
- A lesson is completed only when `queue` is empty (FR-015).
