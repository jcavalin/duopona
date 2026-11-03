# Data Model: Book-Based Toki Pona Course

Builds on feature 001 ([../001-first-lesson-flow/data-model.md](../001-first-lesson-flow/data-model.md)).
Session and progress models are **unchanged**; this feature extends the static content model.

## Vocabulary (static)

### VocabularyEntry

| Field | Type | Rules |
|-------|------|-------|
| `word` | string | Lower-case Toki Pona word; unique |
| `meaning` | string | Short English gloss consistent with the Official Toki Pona Dictionary |

All words in any lesson's `newWords` MUST have an entry.

## Course content (static)

### Lesson (extended)

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Stable kebab-case slug; unique; never renamed after release |
| `title` | string | Book chapter title, e.g. `"Words and Sentences"` |
| `chapter` | string | Book reference, e.g. `"Lesson 2"`, or `"Dictionary"` for More Words |
| `newWords` | string[] | Words first taught here (FR-001 table); a word already introduced earlier MAY be listed again only if this lesson teaches a new role for it (e.g. *tawa*, *sewi*, *sona*) |
| `grammar` | `{ title: string; explanation: string[] }` | Original text; 1–4 short paragraphs |
| `exercises` | Exercise[] | 10–15 items, ≥ 3 word-bank |

### Exercise (extended)

Unchanged from feature 001, plus:

| Field | Type | Rules |
|-------|------|-------|
| `practisesGrammar` | boolean (optional, word bank only) | `true` when answering requires the lesson's grammar point; ≥ 2 per lesson |

### Course

`lessons: Lesson[]` in teaching order (FR-001). Position in the array defines unlocking.

## Derived state

| Value | Rule |
|-------|------|
| `isUnlocked(lesson)` | first lesson, or previous lesson's id ∈ `progress.completedLessons` |
| `introducedBy(word)` | first lesson whose `newWords` contains the word |

## Progress (persisted)

Unchanged: `duopona:progress` v1
([../001-first-lesson-flow/contracts/progress-storage.md](../001-first-lesson-flow/contracts/progress-storage.md)).
Entries whose key is not a course lesson id (e.g. old `basics-1`) are kept but ignored.

## Lesson route states

```text
#/lesson/:id
  unknown id or locked ──────────────► redirect to #/
  intro (local, not in Redux) ──Start──► session answering … finished (feature 001 flow)
  leaving the route at any point ──────► quitLesson (nothing saved unless finished)
```
