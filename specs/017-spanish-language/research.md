# Research: Study in Spanish

Feature 014 built the multi-language structure, and feature 015 showed that a language can be
added to it with no new mechanism. This feature adds a fourth language the same way. Each
decision below says what changes and what is reused.

## R1. Reuse the existing structure; no new mechanism

- **Decision**: Add `'es'` to `Language` and to `LANGUAGES`, then fill in every place where the
  type checker asks for it:
  - `strings.ts`: `es: Strings`;
  - `courses`: `es: lessonsEs`, from `src/content/es/lessons/`;
  - `vocabularies`: `es: vocabularyEs`, from `src/content/es/vocabulary.ts`;
  - `SettingsDialog`'s `OPTIONS`: a fourth row.

  `getLesson`, `getExercise`, `getMeaning`, `explainMistake`, the session language, the
  `<html lang>` effect and the route stay as they are.
- **Rationale**:
  - The maps are `Record<Language, …>`, so a missing Spanish table is a **compile error**.
  - The content rules already run `describe.each(LANGUAGES)` and `describe.each(TRANSLATIONS)`,
    so the 002/008 rules and P1–P3/P6–P7 cover Spanish as soon as `'es'` is in the list
    (FR-013). Two test tables (`CHAPTERS` and `SAME_ACROSS` in `strings.test.ts`) are typed
    `Record<Translation, …>`, so they also fail to compile until Spanish is added.
- **Alternatives considered**: None new; 015 R1 covers them.

## R2. Device language detection

- **Decision**: In `detectLanguage`, a tag whose primary subtag is `es` (es, es-ES, es-MX,
  es-419, es-AR, es-US, …) returns `'es'`. The rule stays "the first supported tag wins, else
  English". So `['es-MX', 'en']` gives Spanish and `['en-US', 'es']` gives English.
- **Rationale**: FR-006. A device list where no Spanish tag comes before its first English,
  Portuguese or French tag gets the same result as before (US2 scenario 3).
- **Alternatives considered**: None new; 014 rejected using only the first tag.

## R3. Saved choice: same key, same version

- **Decision**: `duopona:settings` keeps `version: 1`; `language` may now also be `"es"`.
  `isLanguage` follows `LANGUAGES`, so it accepts `"es"` automatically.
- **Rationale**: Same as 015 R3. Existing `"en"`, `"pt-BR"` and `"fr"` choices load as before
  (FR-008, US3 scenario 5).

## R4. Settings dialog with four options

- **Decision**: Options in this order: English (US flag), Español (Spain flag), Français (France
  flag), Português (Brazil flag).
  - Add `FlagES` to `icons.tsx`, drawn in the existing `Flag` frame: three horizontal bands in
    the ratio 1 : 2 : 1, red `#aa151b`, yellow `#f1bf00`, red. The coat of arms is left out; at
    flag-icon size it would be an unreadable blob, and the plain red–yellow–red is widely
    recognised. Each label keeps `lang` set to its own language.
  - The dialog layout stays as it is. Four rows of 52 px plus gaps need about 350 px of height,
    which fits a 360 × 640 screen with room to spare (FR-011; checked in M3).
- **Rationale**: FR-007, and the order rule in the spec's Assumptions: English first, then the
  others by their own names. Português stays last and Français moves one place down, so the
  existing settings test needs its expected order updated.
- **Alternatives considered**: A select menu. Rejected again, as in 015 R4: it hides the flags
  and adds a step (SC-004).

## R5. Interface strings in Spanish

- **Decision**:
  - **Register**: address the learner as "tú": "Elige el significado", "Escribe esto en
    español". Use neutral forms: "tú" and not "vos" ("tienes", not "tenés"); "ustedes" when
    talking to several people.
  - **Opening marks**: every question begins with "¿" and every exclamation with "¡"
    ("¿Por qué?", "¿Salir de esta lección?"). There is no space before "?" or "!", as in English.
  - **Plurals**: Spanish uses the singular only for 1 ("0 días", "1 día", "2 días"). The
    existing English-style `plural` helper (`n === 1`) fits and is reused.
  - **Vocabulary**: words common to all regions are preferred ("computadora" vs "ordenador" does
    not occur in this course; if a word has strong regional variants, a neutral rewording is
    used).
- **Rationale**: SC-001, FR-014, the spec's "tú" assumption.

## R6. Writing the Spanish course

- **Decision**: Translate from the English course. The Portuguese course helps cross-check
  sentence choices, since the two languages have a similar grammar. Conventions, contract
  [course-content-es.md](contracts/course-content-es.md):
  - **Glosses**: same senses and order as the English gloss, 1–3 senses separated by " / ", verbs
    in the infinitive ("comer / beber"). *sina*: "tú / ti / usted"; *mi*: "yo / mí / nosotros".
  - **Word-bank answers**:
    - Spanish often drops the subject pronoun, but the answer always includes it. The tiles then
      carry the meaning of *mi* / *sina* / *ona*, and the rule stays the same in every exercise.
      With the pronoun always present, a learner who leaves it out has simply not finished, so
      only one sentence is correct (spec edge case).
    - Articles are their own tiles. The contractions "al" and "del" are one tile each, and no
      answer asks for "a el" or "de el".
    - An opening "¿" or "¡" is joined to the first word's tile ("¿Qué", "¡Hola"). It is never a
      tile of its own.
    - Adjectives go after the noun, as in neutral Spanish ("una casa grande"). Sentences are
      chosen so that the order before the noun is not also natural with the tiles given.
  - **Distractors**: must not allow another correct sentence. Watch for gender pairs (el / la,
    bueno / buena), "tú" / "usted", and "ser" / "estar" where both could fit.
  - **Multiple-choice options**: distinct after translation.
  - **Titles and chapters**: titles are translated, except Toki Pona titles ("pi"). Chapters are
    "Lección N" (with the English book's numbers) or "Diccionario".
  - **Length**: grammar notes ≤ 2 sentences and ≤ 160 characters, and 1–4 grammar paragraphs.
    Spanish runs about 15–25% longer than English, so long notes are rewritten shorter instead
    of loosening the limit.
- **Rationale**: Answers are checked by exact match, which accepts one order (014 R8). Pronoun
  dropping, opening marks and contractions are where Spanish could otherwise allow two answers
  or produce odd tiles.
- **Alternatives considered**: Leaving the pronoun out of word-bank answers (the more natural
  Spanish). Rejected: the verb ending alone would then show who acts ("como" for *mi moku*,
  "come" for *ona li moku*). Each word bank would then need its own check that a pronoun tile in
  the distractors does not make a second answer correct. Learners would also lose the pronoun
  tile that matches the Toki Pona subject.

## R7. Tests

- **Decision**:
  - **Existing translation rules** run for Spanish through `TRANSLATIONS`. Add
    `CHAPTERS.es = { lesson: 'Lección', dictionary: 'Diccionario' }` and `SAME_ACROSS.es` in
    `strings.test.ts` (the app name, the book title, and any key whose Spanish text equals
    another language's, each with a reason).
  - **Spanish–Portuguese overlap (P2b)**: P2b fails when a field's text equals the same field in
    any other language. Spanish and Portuguese share many short words and glosses ("comer /
    beber", "casa", "uno"). Two rejected options:
    - dropping the Portuguese comparison for Spanish, which would no longer catch Portuguese text
      copied into Spanish;
    - adding the shared texts to the global `SAME_ACROSS` set, which would also excuse those
      fields between all other pairs.

    The decision is a separate `SAME_ES_PT` set in `courseContent.test.ts`, used only when the
    two languages compared are `es` and `pt-BR`, in either order. The pt-BR pass compares with
    Spanish too, so the exception must work both ways. `strings.test.ts` gets the same kind of
    pair list for interface strings. A match with English or French is reworded instead of
    allowed. Each entry is a field key with a short reason
    ("same word in both"). A test also fails if an entry is stale, that is, if the two texts now
    differ, so the list cannot grow silently.
  - **New Spanish rules**:
    - S1, opening marks: in Spanish course text and Spanish strings, each sentence ending in "?"
      contains a "¿" before it, each one ending in "!" contains a "¡" before it, and no space
      comes before "?" or "!". A "?" right after a Toki Pona word ("seme?") is Toki Pona
      punctuation and is exempt, as in F1. The helper goes in `tests/spanishTypography.ts`.
    - S2, tiles: no word-bank tile is "¿" or "¡" alone, and no answer has the tile pairs
      "a" + "el" or "de" + "el" next to each other.
  - **Detection**: `es`, `es-MX`, `es-419` and `['de', 'es-AR']` give `es`; `['en', 'es']` gives
    `en`; `['fr', 'es']` gives `fr`.
  - **Storage**: `"es"` loads; `"en"`, `"pt-BR"` and `"fr"` still load.
  - **Integration**: `spanishFlow.test.tsx` has the same steps as `frenchFlow`: home, a full
    lesson, a wrong answer with "Why?", the leave dialog, the summary and practice. Its leak check
    covers English, Portuguese and French texts, using phrases long enough not to collide with
    Spanish. `settingsFlow` gets the four options in order and a switch to Español.
- **Rationale**: FR-013. The Spanish rules reuse the shape of F1/F2, and the overlap list limits
  the exception to the one pair of languages where it is needed.
