# Data Model: Study in French

Changes to the 014 data model ([014 data-model.md](../014-portuguese-language/data-model.md)) only.

## Language

- `type Language = 'en' | 'pt-BR' | 'fr'`; `LANGUAGES = ['en', 'pt-BR', 'fr']`. The values are
  also the document `lang` values.

## Settings

- Unchanged shape `{ language, chosen }`. `language` may be `'fr'`, from a saved choice, from
  detection (research R2) or from `languageChosen('fr')`.

## Session

- Unchanged. `session.language` may be `'fr'`, and a French session resolves its exercises in
  the French course.

## Course content

- `courses.fr`: 17 lessons, with the same ids, order and Toki Pona side as English (rule P1).
- `vocabularies.fr`: the same 144 keys as English.

## Saved data

- `duopona:settings` keeps `version: 1` and accepts `"fr"` (contract
  [settings-storage.md](contracts/settings-storage.md)). Other keys are unchanged.
