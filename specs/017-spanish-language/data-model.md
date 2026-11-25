# Data Model: Study in Spanish

Lists only the changes to the 014 data model
([014 data-model.md](../014-portuguese-language/data-model.md)) and to 015's changes to it.

## Language

- `type Language = 'en' | 'pt-BR' | 'fr' | 'es'`; `LANGUAGES = ['en', 'pt-BR', 'fr', 'es']`. The
  values are also the document `lang` values. (The settings dialog has its own display order;
  see contract [ui-settings.md](contracts/ui-settings.md).)

## Settings

- Same shape `{ language, chosen }`. `language` may be `'es'`, from a saved choice, from
  detection (research R2) or from `languageChosen('es')`.

## Session

- Unchanged. `session.language` may be `'es'`, and a Spanish session resolves its exercises in
  the Spanish course.

## Course content

- `courses.es`: 17 lessons, with the same ids, order and Toki Pona side as English (rule P1).
- `vocabularies.es`: the same 144 keys as English.

## Saved data

- `duopona:settings` keeps `version: 1` and accepts `"es"` (contract
  [settings-storage.md](contracts/settings-storage.md)). Other keys are unchanged.
