# Data Model: Dark Duolingo-Style UI Redesign

**No stored data changes.** `localStorage` key `duopona:progress` (v1), the Redux `progress`
and `session` slices, and the lesson content types stay exactly as they are (FR-019). This
file lists the values the new screens *derive* from existing data.

## Derived values

| Value | Derived from | Used by |
|-------|--------------|---------|
| `doneCount` | number of ids in `progress.completedLessons` that exist in `lessons` (research R11) | Home top bar "N / 17", banner "N of 17 done" |
| `courseTotal` | `lessons.length` (17) | Same |
| Node state | per lesson: **completed** if `completedLessons[id]` exists; else **current** if `selectIsUnlocked(id)`; else **locked** | Lesson path nodes |
| Node score | `completedLessons[id].firstTryCorrect` / `.total` | Node accessible name (completed only) |
| Zigzag offset | lesson index mod 8 → `[0, 1, 2, 1, 0, -1, -2, -1]` × 44 px (research R7) | Node position |
| Prompt icon | exercise `type`: `multipleChoice` → drop, `wordBank` → bubble (research R6) | Exercise prompt row |
| Instruction | exercise `type` + `direction` (table below) | Exercise screen title |
| Option result | `session.feedback.correct` while `session.status === 'feedback'` → `'correct'` / `'wrong'` | Selected option color |
| Next lesson | `lessons[index + 1]` of the finished lesson, if any | Summary "Unlocked" card |

## Node states

Exactly one lesson is **current** while any lesson is unfinished: the first unlocked lesson
without a result. Because each lesson unlocks only when the previous one is completed, this is
also the only unlocked, uncompleted lesson. When all 17 are completed, there is no current node.

```text
locked ──(previous lesson completed)──▶ current ──(lesson completed)──▶ completed
                                                      ▲                      │
                                                      └──── replay keeps ────┘
                                                            it completed
```

## Instruction text

| Type | Direction | Instruction |
|------|-----------|-------------|
| `multipleChoice` | `en-tp` | Choose the Toki Pona |
| `multipleChoice` | `tp-en` | Choose the meaning |
| `wordBank` | `en-tp` | Write this in Toki Pona |
| `wordBank` | `tp-en` | Write this in English |
