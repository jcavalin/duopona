# Research: Study in French

Feature 014 built the multi-language structure (its research R1–R9). This feature adds a third
language to it. Each decision below says what changes and what is reused.

## R1. Reuse 014's structure; no new mechanism

- **Decision**: Add `'fr'` to `Language` and to `LANGUAGES`, then fill in every place where the
  type checker asks for it:
  - `strings.ts`: `fr: Strings`;
  - `courses`: `fr: lessonsFr`, from `src/content/fr/lessons/`;
  - `vocabularies`: `fr: vocabularyFr`, from `src/content/fr/vocabulary.ts`;
  - `SettingsDialog`'s `OPTIONS`: a third row.

  `getLesson`, `getExercise`, `getMeaning`, `explainMistake`, the session language, the
  `<html lang>` effect and the route stay as they are.
- **Rationale**:
  - The three maps are `Record<Language, …>`, so a missing French table is a **compile error**.
  - The content-rule suite already runs `describe.each(LANGUAGES)`, so every 002/008 rule covers
    French as soon as `'fr'` is in the list (FR-013).
  - Principle I is met by reusing what exists. Three languages are now real uses of the strings
    layer.
- **Alternatives considered**:
  - Merging the Portuguese and French files into one "translations" overlay over English: the
    same reasons as 014 R2 apply (merge code, harder review), and it would rewrite a feature that
    just shipped.

## R2. Device language detection

- **Decision**: In `detectLanguage`, a tag whose primary subtag is `fr` (fr, fr-FR, fr-CA, fr-BE,
  fr-CH, …) returns `'fr'`. The rule stays "the first supported tag wins, else English". So
  `['fr-CA', 'en']` gives French and `['en-US', 'fr']` gives English.
- **Rationale**: FR-006. Any device list with no French tag before its first English or
  Portuguese tag gets the same result as before (US2 scenario 3). Only lists where French comes
  first change, which is the point of the feature.
- **Alternatives considered**: Using only the first tag. Rejected for the same reason as in 014.

## R3. Saved choice: same key, same version

- **Decision**: `duopona:settings` keeps `version: 1`; `language` may now also be `"fr"`. The
  check `isLanguage` follows `LANGUAGES`, so it accepts `"fr"` automatically.
- **Rationale**: Adding an accepted value does not change any value already saved, so existing
  `"en"` and `"pt-BR"` choices load as before (FR-008, US3 scenario 5). The app only moves
  forward (no downgrade path), so an older build never meets `"fr"`.
- **Alternatives considered**: Bumping to `version: 2` with a migration. It would turn a
  compatible change into a migration that does nothing.

## R4. Settings dialog with three options

- **Decision**: Options in this order: English (US flag), Français (France flag), Português
  (Brazil flag). Add `FlagFR` to `icons.tsx`: three vertical bands, blue `#002654`, white, red
  `#ce1126`, drawn with the existing `Flag` frame. Each label keeps `lang` set to its own language.
  - The dialog stays as it is. Three rows of 52 px plus gaps need about 290 px of height, which
    fits a 360 × 640 screen.
  - The arrow keys already move through the native radio group.
- **Rationale**: FR-007, FR-011. English first matches the default, and the other two are in the
  order of their own names.
- **Alternatives considered**: A select menu. It hides the flags, and it adds a step to change
  the language (SC-004).

## R5. Interface strings in French

- **Decision**:
  - **Register**: address the learner as "tu" ("Choisis le sens", "Écris ceci en français").
  - **Typography**: put a narrow no-break space (U+202F) before `?`, `!`, `;` and `:`. Write
    French quotation marks as `« … »`, with U+202F inside. This keeps a punctuation mark from
    starting a new line (spec edge case). The space is written in the source as ` `, so it
    can be seen in review.
  - **Plurals**: French uses the singular for 0 and 1 ("0 jour", "1 jour", "2 jours"). The French
    plural functions use `n <= 1`, which differs from the English `n === 1`.
  - **Punctuation written in components**: if any component writes `":"` or `"?"` itself (e.g.
    "word: meaning" in "Why?"), that text moves into the strings table, so French gets
    `"word : meaning"`. This is checked while converting.
- **Rationale**: SC-001, the typography edge case. "tu" matches the friendly register of most
  language apps (spec assumption).

## R6. Writing the French course

- **Decision**: Translate from the English course, using the Portuguese course to cross-check
  sentence choices. Conventions, contract [course-content-fr.md](contracts/course-content-fr.md):
  - **Glosses**: same senses and order as the English gloss, 1–3 senses separated by " / ", verbs
    in the infinitive ("manger / boire"). *sina*: "tu / toi / vous"; *mi*: "je / moi / nous".
  - **Word-bank answers**:
    - always include the subject pronoun;
    - articles are their own tiles. An elided article or pronoun is one tile with its word
      ("l'animal", "j'ai", "c'est", "qu'est-ce"), and contractions are one tile ("du", "au",
      "des");
    - adjectives go where French puts them: after the noun in general, but before it for the
      common short ones (grand, petit, bon, beau, nouveau, vieux, mauvais). Each sentence has only
      one natural order. Where both orders are possible ("un grand homme" / "un homme grand" mean
      different things), the sentence is chosen so that the other order is clearly wrong or
      impossible with the tiles given.
  - **Distractors**: must not allow another correct sentence. Watch for gender pairs (le / la) and
    for "tu" / "vous", which could replace each other.
  - **Multiple-choice options**: distinct after translation.
  - **Titles and chapters**: titles are translated, except Toki Pona titles ("pi"). Chapters are
    "Leçon N" (the English book's numbers) or "Dictionnaire".
  - **Length**: grammar notes ≤ 2 sentences and ≤ 160 characters, and 1–4 grammar paragraphs.
    French typically runs 15–20% longer than English. Notes are rewritten shorter rather than
    loosening the limit.
- **Rationale**: Exact-match checking accepts one order (014 R8). Elision and adjective position
  are where French could otherwise allow two orders or produce a bare "l'" tile.

## R7. Tests

- **Decision**:
  - **Generalize 014's Portuguese-only checks to every non-English language**: the P1–P3, P6 and
    P7 describe in `courseContent.test.ts` and the parity test in `strings.test.ts` become
    `describe.each(['pt-BR', 'fr'])`, with a per-language allow-list of texts allowed to equal
    English. P7's chapter pattern becomes per language ("Lição N" / "Leçon N", "Dicionário" /
    "Dictionnaire").
  - **New French rules**:
    - F1, typography: no plain space and no missing space before `?`, `!`, `;` or `:`, in both
      French strings and French course text.
    - F2, elision tiles: no word-bank tile ends with an apostrophe.
  - **Detection**: `fr`, `fr-CA`, `['de', 'fr-BE']` give `fr`; `['en', 'fr']` gives `en`.
  - **Storage**: `"fr"` loads; `"en"` and `"pt-BR"` still load.
  - **Integration**: `frenchFlow.test.tsx`, with the same steps as `portugueseFlow` (home, a full
    lesson, a wrong answer with "Why?", the leave dialog, the summary, practice). The leak check
    covers English and Portuguese texts. `settingsFlow` gets the three options and a switch to
    Français.
- **Rationale**: FR-013. Generalizing keeps one rule set for all translations instead of copying
  the Portuguese block.
