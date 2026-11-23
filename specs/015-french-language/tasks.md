---

description: "Task list for feature 015: Study in French"
---

# Tasks: Study in French

**Input**: Design documents from `/specs/015-french-language/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R7), data-model.md,
contracts/ (ui-settings.md, settings-storage.md, course-content-fr.md), quickstart.md (M1–M6)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. Device language, offline, 360 px, phone checks and the owner's
language review are manual (quickstart M1–M6); record results under the matching task.

**Organization**: Three user stories, as in the spec.
- **US1** (P1): the whole course in French: strings, vocabulary, 17 lessons.
- **US2** (P1): French devices start in French.
- **US3** (P2): Français in the settings dialog, with a flag.

US1 + US2 make the MVP. US1 is testable on its own by saving
`duopona:settings = {"version":1,"language":"fr"}` before creating the store (as
tests/integration/portugueseFlow.test.tsx does for Portuguese).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1–US3)

## Environment notes (read before any task)

- **npm in the sandbox**: prefix `npm`/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`. No new
  packages. Use `rtk bypass npx vitest run` to see the test counts.
- **Dev server**: ask the user to run `npm run dev` (http://localhost:5173). Save the user's dev
  `localStorage` before a Chrome check and restore it after. If a script rewrote a file, touch it
  and check the served code first (Vite may serve an empty cached file).
- **Language values**: `type Language = 'en' | 'pt-BR' | 'fr'`. Use `'fr'`, never `'fr-FR'`.
- **Compile order**: adding `'fr'` to `Language` (T002) makes `tsc` fail until `strings.fr`
  (T005), `vocabularies.fr` and `courses.fr` (T011) exist. That is expected. Do T002 → T005 →
  T006–T010 → T011 without running the build in between. The test suite (Vitest) still runs.
- **Do not change**: saved formats (settings stays `version: 1`), exercise ids, `Direction`
  values, English and Portuguese texts.
- **French writing rules**: contract course-content-fr.md and research R5/R6:
  - "tu" register; *sina* = "tu / toi / vous";
  - U+202F written as ` ` before `?` `!` `;` `:`, and `« »` with U+202F inside;
  - the subject pronoun is always included in word-bank answers;
  - an elided word is one tile with its word ("l'animal", "j'ai"), and contractions ("du", "au",
    "des") are one tile;
  - adjectives go where French puts them (grand, petit, bon, beau, nouveau, vieux and mauvais
    before the noun), with only one possible order per sentence;
  - no distractor that makes another correct sentence (le/la, tu/vous);
  - grammar notes ≤ 2 sentences and ≤ 160 characters;
  - original wording (do not copy any published French translation of the book).

---

## Phase 1: Setup

- [X] T001 Record the baseline: run `npm test`, `npm run lint`, `npm run build`; note the test
  count (expected 1228) and the precache size (expected 604.56 KiB) under this task.
  - **Result (2026-11-23)**: 1228 passed; lint clean; build ok, precache 16 entries, 605.69 KiB (1.1 KiB more than 014's record, from the flag icons).

---

## Phase 2: Foundational (blocks all stories)

- [X] T002 Add `'fr'` in src/i18n/language.ts: `type Language = 'en' | 'pt-BR' | 'fr'` and
  `LANGUAGES = ['en', 'pt-BR', 'fr']` (data-model.md). `isLanguage` follows `LANGUAGES`, so it
  needs no change; check that it does.
- [X] T003 [P] Generalize the Portuguese-only parity test in tests/unit/strings.test.ts to every
  non-English language: `describe.each(LANGUAGES.filter((l) => l !== 'en'))`, with one
  `SAME_AS_ENGLISH: Record<Language, Set<string>>` allow-list per language (keep `wordmark`,
  `bookTitle` for both). Keep the per-language `sourceLabel` and plural cases, and add French
  ones: `sourceLabel('Leçon 5')` = "Livre : Leçon 5"; `sourceLabel('Dictionnaire')` = the
  French extra label; the day plurals 0 → "0 jour", 1 → "1 jour", 2 → "2 jours" (research R5).
  - **Result**: done together with T012. Each translation's strings are compared with **every** other language, not only English (analysis C1); allow-lists: wordmark, bookTitle, footerBy (pt-BR and fr), correct (fr: "Correct." is French too).
- [X] T004 [P] Generalize the "Brazilian Portuguese course" describe in
  tests/unit/courseContent.test.ts to `describe.each(['pt-BR', 'fr'])`, keeping rules P1, P2, P2b,
  P3, P6 and P7:
  - `SAME_IN_BOTH` becomes a per-language allow-list (`'pi/title'` for both);
  - P7 uses a per-language chapter map: pt-BR `Lição N` / `Dicionário`, fr `Leçon N` /
    `Dictionnaire`;
  - the error messages name the language.
  - **Result**: P2b now compares each translated field with the same field in every other language (analysis C1), with one shared allow-list: `pi/title`, and "ou" (or) in `anu.prompt`, `a.options[0]` and the `anu` gloss, which is the same word in Portuguese and French. P3 does the same for glosses.

**Checkpoint**: Portuguese still passes these tests. French fails them until US1, which is
expected.

---

## Phase 3: User Story 1 - Study the whole course in French (Priority: P1) 🎯 MVP

**Goal**: with French active, every non-Toki Pona text is French and every exercise is
answerable in French.

**Independent test**: tests/integration/frenchFlow.test.tsx (T014) and the content rules
(T012).

### Implementation: interface

- [X] T005 [US1] Add `const fr: Strings` to src/i18n/strings.ts and `fr` to the `strings` map.
  - Write every key in French, in the "tu" register, with ` ` before `? ! ; :`
    (research R5). Examples:
    - "Apprends le toki pona", "Objectif du jour", "S'entraîner", "Revoir les mots difficiles";
    - "Vérifier", "Continuer", "Pas tout à fait", "Bonne réponse :", "Pourquoi ?",
      "Masquer";
    - "Quitter cette leçon ?", "Continuer à apprendre", "Leçon terminée !";
    - "Paramètres", "Fermer les paramètres", "Langue";
    - "Choisis le sens", "Écris ceci en français".
  - Plural functions use singular for `n <= 1`.
  - `sourceLabel`: 'Dictionnaire' → "Extra : mots du dictionnaire", else
    `Livre : ${chapter}`.
  - Then move the literal `": "` in src/components/FeedbackBanner.tsx (`{word}: {meaning}`, line
    ~89) into a new strings key, e.g. `wordMeaningSeparator`: en/pt-BR `': '`, fr `' : '`.
    Search src/components and src/routes for any other punctuation written outside the strings
    table and move it the same way. Also check src/content/explanations.ts for text it builds
    itself.
  - **Result**: `fr` strings added. One component wrote punctuation itself: FeedbackBanner's `{word}: {meaning}`, now `s.wordMeaningSeparator` (en/pt-BR `': '`, fr `'\u202f: '`). explanations.ts builds `chapter · title` only (no punctuation needing a space). Literal U+202F characters that slipped into files were converted to the `\u202f` escape everywhere (lint flags them in comments and template literals).

### Implementation: course content (contract course-content-fr.md)

Each lesson file mirrors its English counterpart in src/content/lessons/ (ids, order, types,
directions, `practisesGrammar`, Toki Pona side identical; P1) and translates everything else. Use
the Portuguese file in src/content/pt-BR/lessons/ to cross-check sentence choices.

- [X] T006 [P] [US1] Write src/content/fr/vocabulary.ts: all 144 keys of src/content/vocabulary.ts,
  in the same order, with French glosses (same senses and order, " / " separator, infinitive
  verbs; `mi` "je / moi / nous", `sina` "tu / toi / vous"; marker words explained in French).
- [X] T007 [P] [US1] Write src/content/fr/lessons/01-words-and-sentences.ts …
  05-*.ts (the first five files, same names as the English ones).
- [X] T008 [P] [US1] Write src/content/fr/lessons/06-*.ts … 10-*.ts.
- [X] T009 [P] [US1] Write src/content/fr/lessons/11-*.ts … 14-hunting.ts.
- [X] T010 [P] [US1] Write src/content/fr/lessons/15-cooking.ts, 16-more-words-1.ts,
  17-more-words-2.ts, and src/content/fr/lessons/index.ts exporting `lessons` in the English
  order (copy the shape of src/content/pt-BR/lessons/index.ts).
- [X] T011 [US1] Wire the course: `courses.fr` in src/content/lessons/index.ts and
  `vocabularies.fr` in src/content/vocabulary.ts. Run `npx tsc -b`: it must be clean now.
  - **Result**: `npx tsc -b` clean. The existing per-language content suite (C1–C11, P8, mistake explanations) passed for French at once: 1597 passed; the only failures were two older tests that used `'fr'` as an unknown language (fixed in T018/T019).

### Tests (after the code, Constitution IV)

- [X] T012 [US1] Add the French-only rules to tests/unit/courseContent.test.ts:
  - **F1**: no `?`, `!`, `;` or `:` in French course text (titles, chapters, grammar title and
    paragraphs, prompts, options, answers, distractors, grammar notes, glosses) without U+202F or
    U+00A0 just before it. Allow a colon inside Toki Pona-only text if any;
  - **F2**: no French word-bank tile ends with `'` or `’`.
  - **Result**: F1 and F2 added (F1 in tests/frenchTypography.ts, shared by both test files). F1 exempts a mark right after a Toki Pona word, since Toki Pona text such as `seme?` has no space (analysis U1), and the English book title in strings. Planted errors in fr/04-verbs.ts (an English option, a Portuguese prompt, a plain space before "?", a bare "l’" tile) made P2b (vs en and vs pt-BR), F1 and F2 fail; the file was restored from a backup and checked identical with `cmp`.

  Add F1 to tests/unit/strings.test.ts for every French string, calling function keys with the
  existing `SAMPLE_ARGS`. Run the content suite. Then deliberately break one French lesson (an
  English option; a plain space before "?") and confirm that P2b and F1 fail; restore the file
  and verify the restore.
- [X] T013 [P] [US1] Add a French session case to tests/unit/sessionSlice.test.ts: `startLesson`
  with `'fr'` stores `language: 'fr'`. A wrong answer to `'verbs/jo'` gives the French
  `correctAnswer` (from src/content/fr/lessons/04-verbs.ts). `getLesson('verbs', 'fr').title` is
  the French title.
- [X] T014 [US1] Write tests/integration/frenchFlow.test.tsx, modelled on
  tests/integration/portugueseFlow.test.tsx:
  - save `{version:1, language:'fr'}` before `makeStore`;
  - home in French and `<html lang="fr">`;
  - lesson 1 intro (title, `Livre : Leçon 2 · N exercices`, a French gloss);
  - a wrong answer showing "Pas tout à fait" and the French correct answer, then "Pourquoi ?"
    with the French `word : meaning` row;
  - the X button, "Quitter cette leçon ?", then "Continuer à apprendre";
  - finish the lesson to "Leçon terminée !", with progress saved;
  - practice in French with its leave dialog;
  - a leak check failing on any English-only **or** Portuguese-only interface text (reuse the
    English list from portugueseFlow and add Portuguese ones: "Verificar", "Continuar",
    "Por quê?", "Lição concluída!", "Meta diária", "Praticar").
  - **Result**: the leak check compares single words with whole element texts and searches longer phrases anywhere, so "Continuer" no longer matches "Continue" (analysis I1). Names containing U+202F are matched with `\s`, since accessible names and text matchers collapse it to a space.
- [X] T015 [US1] Run `npm test`, `npm run lint`, `npm run build`; all pass. Record the count.
  - **Result (2026-11-23)**: 1813 passed (23 files); lint and typecheck clean.

**Checkpoint**: French works end to end when set as the saved choice.

---

## Phase 4: User Story 2 - French devices start in French (Priority: P1) 🎯 MVP

**Goal**: with no saved choice, the first supported device language among en / pt / fr decides.

- [X] T016 [US2] In src/i18n/language.ts `detectLanguage`, a primary subtag `fr` returns `'fr'`
  (research R2). Update the doc comment.
- [X] T017 [P] [US2] Tests in tests/unit/language.test.ts:
  - `['fr']`, `['fr-FR']`, `['fr-CA']` and `['FR-be']` give `fr`;
  - `['de', 'fr-CH']` gives `fr`;
  - `['en-US', 'fr']` gives `en`;
  - `['pt-BR', 'fr']` gives `pt-BR`;
  - `['fr', 'pt-BR']` gives `fr`;
  - every existing case is unchanged.
  - **Result**: 014's cases that used French as the unsupported example now use German (`de-DE`, `['de', 'pt-BR']`), keeping what they test.
- [X] T018 [P] [US2] Tests in tests/unit/persistence.test.ts: a saved `"fr"` loads as
  `{language:'fr', chosen:true}`; `"en"` and `"pt-BR"` still load (FR-008); `"fr-FR"` falls back
  to the device language.
- [X] T019 [US2] Add to the "starting in the device language" cases in
  tests/integration/frenchFlow.test.tsx: a French device (`navigator.languages` stubbed to
  `['fr-FR', 'en']`) with nothing saved opens in French and writes nothing; a saved `"pt-BR"`
  wins over a French device. Run `npm test` and `npm run lint`, and record the count.
  - **Result**: portugueseFlow's "a French device opens in English" became "a German device opens in English". 1813 passed.

---

## Phase 5: User Story 3 - Choose French in settings (Priority: P2)

**Goal**: settings list English, Français, Português with flags; choosing Français switches and
saves.

- [X] T020 [P] [US3] Add `FlagFR` to src/components/icons.tsx (research R4): vertical bands blue
  `#002654`, white `#fff`, red `#ce1126`, using the existing `Flag` frame.
- [X] T021 [US3] In src/components/SettingsDialog.tsx `OPTIONS`, use the order English (FlagUS),
  Français (FlagFR, `value: 'fr'`), Português (FlagBR) (contract ui-settings.md). Labels keep
  `lang={value}`.
- [X] T022 [US3] Tests in tests/integration/settingsFlow.test.tsx:
  - the dialog shows three radios in the order English, Français, Português;
  - choosing Français switches the app (home "Apprends le toki pona", dialog "Paramètres", legend
    "Langue", `<html lang="fr">`) and saves `{version:1, language:'fr'}`;
  - the arrow keys move from English to Français;
  - a switch fr → pt-BR → en leaves the progress, words and streak state equal (extend the
    FR-009 case).
  - **Result (2026-11-23)**: the old arrow-key case now steps English → Français → Português. 1815 passed (23 files), twice in a row; lint and typecheck exit 0; build ok, precache 661.31 KiB.

  Run `npm test` and `npm run lint`, and record the count.
- [X] T023 [US3] Manual check in Chrome (quickstart M1–M3), after asking the user to run
  `npm run dev`:
  - save the dev `localStorage` first;
  - M1: Chrome's language list can't be changed from the page, so check the current list's result
    and note that detection is covered by T017/T019;
  - M2: gear → Français, reload, check `duopona:settings`; switch to Português and English;
  - M3: 360 px frame in French (home top bar, "Revoir les mots difficiles", settings with three
    rows, intro, word bank, wrong-answer sheet with "Pourquoi ?", leave dialog, summary), checking
    there is no horizontal overflow and no line starting with `?`, `!` or `:`;
  - restore the `localStorage` and verify it is identical; check the console for errors; close the
    tab.

  Record the results here and fix any layout issue found.
  - **Result (2026-11-23)**: dev localStorage saved (progress, streak, words; no settings key) and
    restored to the same three keys afterwards. The Chrome window can't go below 500 px wide, so
    the frame was 500 px (the 360 px case is covered by 014's layout fixes, which French doesn't
    change). Settings: English, Français, Português with flags, rows 52 px (≥ 44), `lang` per row.
    Choosing Français switched the dialog ("Paramètres", "Fermer les paramètres"), set
    `<html lang="fr">` and saved `{"version":1,"language":"fr"}`. Home, intro ("Livre : Leçon 4 ·
    13 exercices"), exercise, the wrong-answer sheet ("Bonne réponse :", "Masquer", "mi : je / moi /
    nous") and the leave dialog ("Quitter cette leçon ?") all in French, with U+202F before the
    marks and no horizontal overflow. No layout issues found.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [~] T024 Owner review of the French course, quickstart M5 (SC-006). Ask the owner; if they defer
  it, mark `[~]` with the date and the owner decision (Constitution IV waiver). List points worth
  their attention (sentences where the word order was a close call, glosses that were hard to
  pick, any text that wraps awkwardly).
  - **Deferred (2026-11-23)** by owner decision, as for 014, to be run later. Points worth
    attention: the gender of `ona` in prompts ("Elle …" where English has "She"), "tu / toi / vous"
    and "je / moi / nous" as glosses, and the tp→fr word banks where an elided word is one tile
    ("l’eau", "j’aime").
- [X] T025 [P] Update README.md: the course can be studied in English, Brazilian Portuguese or
  French; French devices start in French.
- [~] T026 Ask the user to run quickstart M4 (Android, installed) and M6 (iOS Safari). If waived,
  mark `[~]` with the owner decision.
  - **Deferred (2026-11-23)** by owner decision, to be run later with the 013/014 phone checks.
- [X] T027 Set spec.md **Status** to `Implemented` (naming any deferred checks and their tasks),
  and move 015 from In progress to Done in ROADMAP.md.
- [X] T028 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa`. Compare to
  the T001 baseline (count and precache size) and record the results here.
  - **Result (2026-11-23)**: `npm test` 1815 passed (23 files), up from 1228; lint exit 0;
    build ok, precache 16 entries, 661.31 KiB (+55.6 KiB over the baseline, the French course);
    `npm run test:pwa` 29 passed.

---

## Dependencies & Execution Order

- **T001** first.
- **T002** → T005, T006–T010 → T011 (compile order, see the environment notes). T003 and T004
  can be written any time after T002.
- **US1 tests** (T012–T015) after T011.
- **US2** (T016–T019) needs T002 only for the code; T019 also needs US1, so the French home
  screen renders.
- **US3** (T020–T023) needs T005 (French settings texts). T023 needs US1–US3 done.
- **Polish** last; T027 and T028 after everything else, and after T024/T026 are answered.

### Parallel opportunities

- T003 ∥ T004 (different test files).
- T006 ∥ T007 ∥ T008 ∥ T009 ∥ T010 (different content files).
- T013 ∥ T012 (different files); T017 ∥ T018; T020 alongside US1 or US2.

## Implementation Strategy

1. **MVP (US1 + US2)**: T001–T019. A French device gets the whole course in French.
2. **US3**: T020–T023 add Français to settings. Small, because the dialog already exists.
3. **Polish**: the owner's review, README, phone checks, status, final gate.

Commit only when the user asks. Earlier features used three commits: docs (spec/plan), feature,
and docs (results).
