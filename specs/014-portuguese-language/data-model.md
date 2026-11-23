# Data Model: Study in Brazilian Portuguese

## Language

- `type Language = 'en' | 'pt-BR'`. The values are also the document `lang` values (research R7).

## Settings (new Redux slice `settings`)

| Field | Type | Meaning |
|-------|------|---------|
| `language` | `Language` | Active study language |
| `chosen` | `boolean` | `true` once the learner picked a language in settings |

- **Initial state** (at store creation, research R4):
  - a valid saved choice → `{ language: saved, chosen: true }`;
  - otherwise → `{ language: detectLanguage(device tags), chosen: false }`.
- **Transition**: `languageChosen(language)` → `{ language, chosen: true }`. This applies even
  when the chosen language is the active one, because picking it is still a choice.
- **Persistence**: saved only while `chosen` is true; contract
  [settings-storage.md](contracts/settings-storage.md).
- **Selector**: `selectLanguage(state) → Language`.

## Session (`sessionSlice`, changed)

- `LessonSession` gains `language: Language`, set by `startLesson` / `startPractice` and never
  changed during the session (research R3).
- `submitAnswer` and `selectCurrentExercise` resolve the exercise in `session.language`.
  `feedback.correctAnswer` is therefore in the session's language.
- Not saved, as before.

## Course content (per language)

- `courses: Record<Language, Lesson[]>`. Both lists have the same lessons in the same order with
  the same ids. Each lesson's `Exercise` list matches the other language's in its ids, types,
  directions, `practisesGrammar` flags and Toki Pona side (contract
  [course-content-pt.md](contracts/course-content-pt.md), rule P1).
- `vocabularies: Record<Language, Record<string, string>>`, with the same Toki Pona keys in both.
- Direction names keep their values. `'tp-en'` now means "Toki Pona → study language" and
  `'en-tp'` means "study language → Toki Pona". They are not renamed, because ids and tests depend
  on them.

## Unchanged saved data

`duopona:progress`, `duopona:words`, `duopona:streak`: same formats. They contain only lesson ids,
exercise ids and Toki Pona words, so they are valid in both languages (FR-009).
