---

description: "Task list for feature 017: Study in Spanish"
---

# Tasks: Study in Spanish

**Input**: Design documents from `/specs/017-spanish-language/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R7), data-model.md,
contracts/ (ui-settings.md, settings-storage.md, course-content-es.md), quickstart.md (M1–M6)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. Device language, offline, 360 px, phone checks and the owner's
language review are manual (quickstart M1–M6); record results under the matching task.

**Organization**: Three user stories, as in the spec.
- **US1** (P1): the whole course in Spanish: strings, vocabulary, 17 lessons.
- **US2** (P1): Spanish devices start in Spanish.
- **US3** (P2): Español in the settings dialog, with a flag.

US1 + US2 make the MVP. US1 can be tested on its own by saving
`duopona:settings = {"version":1,"language":"es"}` before creating the store, as
tests/integration/frenchFlow.test.tsx does for French.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1–US3)

## Environment notes (read before any task)

- **npm in the sandbox**: prefix `npm`/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`. No new
  packages. Use `rtk bypass npx vitest run` to see the test counts.
- **Dev server**: ask the user to run `npm run dev` (http://localhost:5173). Save the user's dev
  `localStorage` before a Chrome check and restore it after. If a script rewrote a file, touch it
  and check the served code first, because Vite may serve an empty cached file.
- **Language values**: `type Language = 'en' | 'pt-BR' | 'fr' | 'es'`. Use `'es'`, never
  `'es-ES'` or `'es-419'`.
- **Compile order**: adding `'es'` to `Language` (T002) makes `tsc` fail until these exist:
  `strings.es` (T003), `vocabularies.es` and `courses.es` (T009), and the `Record<Translation, …>`
  test tables (T010). That is expected. Do T002 → T003 → T004–T008 → T009 → T010 without running
  the build in between. The test suite (Vitest) still runs.
- **Do not change**: saved formats (settings stays `version: 1`), exercise ids, `Direction`
  values, or the English, Portuguese and French texts.
- **Spanish writing rules**: contract course-content-es.md and research R5/R6:
  - neutral Spanish (spec FR-014): "tú" for the learner ("tienes", never "tenés"); "ustedes",
    never "vosotros"; no regionally marked words;
  - *sina* = "tú / ti / usted"; *mi* = "yo / mí / nosotros";
  - every question has "¿…?" and every exclamation "¡…!", with no space before "?" or "!";
  - the subject pronoun is **always** included in word-bank answers;
  - articles are their own tiles; "al" and "del" are one tile, and no answer is built from
    "a el" or "de el";
  - an opening "¿"/"¡" is part of the first word's tile ("¿Qué", "¡Hola"), never a tile alone;
  - adjectives after the noun ("una casa grande"), with only one possible order per sentence;
  - no distractor that makes another correct sentence (el/la, bueno/buena, tú/usted,
    ser/estar);
  - grammar notes ≤ 2 sentences and ≤ 160 characters; 1–4 grammar paragraphs;
  - original wording (do not copy any published Spanish translation of the book).

---

## Phase 1: Setup

- [X] T001 Record the baseline: run `npm test`, `npm run lint`, `npm run build`. Note the test
  count (expected 1816, from 016's record) and the precache size under this task.
  - **Result (2026-11-25)**: 1816 passed (23 files); lint clean; build ok, precache 16 entries, 661.43 KiB.

---

## Phase 2: Foundational (blocks all stories)

- [X] T002 Add `'es'` in src/i18n/language.ts: `type Language = 'en' | 'pt-BR' | 'fr' | 'es'` and
  `LANGUAGES = ['en', 'pt-BR', 'fr', 'es']` (data-model.md). `isLanguage` follows `LANGUAGES`, so
  it should need no change; check that it does not.
  - **Result**: `isLanguage` follows `LANGUAGES`, so it needed no change.

**Checkpoint**: none runnable yet; `tsc` fails until T010 (see the compile order note).

---

## Phase 3: User Story 1 - Study the whole course in Spanish (Priority: P1) 🎯 MVP

**Goal**: with Spanish active, every non-Toki Pona text is Spanish and every exercise is
answerable in Spanish.

**Independent test**: tests/integration/spanishFlow.test.tsx (T013) and the content rules
(T010–T011).

### Implementation: interface

- [X] T003 [US1] Add `const es: Strings` to src/i18n/strings.ts and `es` to the `strings` map.
  - Write every key in neutral Spanish, in the "tú" register, with opening marks (research R5).
    Examples:
    - "Aprende toki pona", "Meta diaria", "Practicar", "Repasar palabras difíciles";
    - "Comprobar", "Continuar", "Casi", "Respuesta correcta:", "¿Por qué?", "Ocultar";
    - "¿Salir de esta lección?", "Seguir aprendiendo", "¡Lección completada!";
    - "Configuración", "Cerrar configuración", "Idioma" (contract ui-settings.md);
    - "Elige el significado", "Escribe esto en español".
  - Use the existing English-style `plural` helper (`n === 1` is singular): "0 días", "1 día",
    "2 días".
  - `sourceLabel`: 'Diccionario' → "Extra: palabras del diccionario"; otherwise
    `Libro: ${chapter}`.
  - `wordMeaningSeparator: ': '`.
  - Some Spanish strings will equal another language's ("Continuar", "Practicar", "Idioma" are
    the same in Portuguese). Note each one for T010's `SAME_ACROSS.es`; where a natural
    alternative exists, prefer it.
  - **Result**: `es` strings added. Choices worth review: "No del todo" for the wrong-answer title (not "Casi", which reads as nearly right), "Solución correcta:", "Racha" for streak, "con práctica hoy" / "sin práctica hoy" (avoids the "practicaste" / "has practicado" regional split). Keys equal to Portuguese: `language` (Idioma), `grammarTag` (Gramática), `hide` (Ocultar), `continue` (Continuar), plus `wordMeaningSeparator`.

### Implementation: course content (contract course-content-es.md)

Each lesson file mirrors its English counterpart in src/content/lessons/: the same ids, order,
types, directions and `practisesGrammar`, and an identical Toki Pona side (P1). Everything else is
translated. Use the Portuguese file in src/content/pt-BR/lessons/ to cross-check sentence
choices. Copy the file shape (imports, export) from src/content/fr/lessons/.

- [X] T004 [P] [US1] Write src/content/es/vocabulary.ts: all 144 keys of
  src/content/vocabulary.ts, in the same order, with Spanish glosses. Keep the same senses and
  order, the " / " separator and infinitive verbs. Use `mi` "yo / mí / nosotros" and `sina`
  "tú / ti / usted", and explain the marker words in Spanish.
  - **Result**: two glosses differ from the plan: *sina* is "tú / usted / ustedes" (it also covers the plural, as *sina* does), and *soweli* is "animal / mamífero terrestre" (more precise, and distinct from Portuguese). *moku*, *pana*, *tan*, *lape*, *pini*, *sama* and *ale* were worded to differ from Portuguese.
- [X] T005 [P] [US1] Write src/content/es/lessons/01-words-and-sentences.ts …
  05-more-adjectives.ts (the first five files, same names as the English ones). Chapters are
  "Lección N" with the English book's numbers.
- [X] T006 [P] [US1] Write src/content/es/lessons/06-questions-and-answers.ts … 10-pre-verbs.ts.
- [X] T007 [P] [US1] Write src/content/es/lessons/11-colours-and-la.ts … 14-hunting.ts.
- [X] T008 [P] [US1] Write src/content/es/lessons/15-cooking.ts, 16-more-words-1.ts and
  17-more-words-2.ts, which use the chapter "Diccionario" wherever English uses "Dictionary". Also
  write src/content/es/lessons/index.ts, exporting `lessons` in the English order (copy the shape
  of src/content/fr/lessons/index.ts).
- [X] T009 [US1] Wire the course: `courses.es` in src/content/lessons/index.ts and
  `vocabularies.es` in src/content/vocabulary.ts.
  - **Result**: `npx tsc -b` left only the two expected `Record<Translation, …>` test-table errors, fixed in T010.

### Tests (after the code, Constitution IV)

- [X] T010 [US1] Extend the translation tables so Spanish compiles and runs through the existing
  rules (research R7):
  - tests/unit/courseContent.test.ts: `CHAPTERS.es = { lesson: 'Lección', dictionary:
    'Diccionario' }`.
  - tests/unit/strings.test.ts: `SAME_ACROSS.es` with `wordmark` and `bookTitle`. The test checks
    each translation against **every** other language, but excuses a key only through the
    checked language's own set. So a key that Spanish shares with Portuguese ("Continuar",
    "Practicar", "Idioma", `wordMeaningSeparator` `': '`) would also fail in the **pt-BR** pass.
    Make the exception work both ways:
    - add a pair list `SAME_ES_PT_STRINGS: Map<string, string>` (key → reason) for the keys noted
      in T003, and skip a key when the two languages compared are `es` and `pt-BR` (in either
      order) and the key is in the list;
    - replace the one-off `wordMeaningSeparator` exception (pt-BR vs en) with a rule that skips
      `wordMeaningSeparator` whenever both texts are `': '`. Spanish shares it with English and
      Portuguese.
  - **Result**: Every existing rule (C1–C11, P1–P3, P6–P8, mistake explanations) passed for `es` at the first run; only P2b/P3 failed, all on es↔pt-BR matches, none against en or fr. `SAME_ES_PT` in courseContent.test.ts has **9** entries (the shared words *Verbos*, *azul / verde*, *amar / amor*, *dentro*, and the fields that reuse them); `SAME_ES_PT` in strings.test.ts has **4** (Idioma, Gramática, Ocultar, Continuar). The one-off `wordMeaningSeparator` exception became a rule for `': '`. Both lists have a stale-entry test.

    Add Spanish cases next to the French ones:
    - `sourceLabel('Lección 5')` = "Libro: Lección 5";
    - `sourceLabel('Diccionario')` = "Extra: palabras del diccionario";
    - the day plural: 0 → "0 días", 1 → "1 día", 2 → "2 días".
  - tests/unit/courseContent.test.ts, **Spanish–Portuguese overlap**: add
    `SAME_ES_PT: Map<string, string>`, mapping a field key (`lessonId/field` or
    `vocabulary/word`) to its reason. In P2b and P3, skip a field only when the two languages
    compared are `es` and `pt-BR` (in either order: the pt-BR pass compares with Spanish too)
    and the key is in `SAME_ES_PT`. Add one test that fails for a **stale** entry, that is, one
    whose Spanish and Portuguese texts now differ. Before adding an entry, check whether a natural
    Spanish alternative exists; if it does, change the Spanish text instead.
  - **Matches with English or French** (e.g. a gloss "animal / …"): do **not** add them to any
    allow-list. Reword the Spanish text instead (another sense, a different but faithful order,
    or a more precise word), as the Portuguese and French courses did.
  - Run `npx tsc -b` (must be clean now) and the content suite. Fix the Spanish content until the
    existing rules (C1–C11, P1–P3, P6–P8, mistake explanations) pass for `es`. Record the size of
    `SAME_ES_PT` under this task.
- [X] T011 [US1] Add the Spanish-only rules (contract course-content-es.md):
  - Create tests/spanishTypography.ts exporting `spanishPunctuationErrors(text): string[]` for
    rule **S1**. It reports these errors:
    - a "?" with no "¿" earlier in the same sentence;
    - a "!" with no "¡" earlier in the same sentence;
    - a space right before "?" or "!".
  - **Result**: S1 and S5 in tests/spanishTypography.ts; S1, S2, S5 on the course and S1, S5 on the strings. Planted errors in es/04-verbs.ts (an English option, a French prompt, "Tú sabes esto?" without ¿, a bare "¿" tile, "de" + "el", "Vosotros") made P2b (vs en and vs fr), S1, S2 and S5 fail; the file was restored from a copy and checked identical with `cmp`.

    A mark right after a Toki Pona word (a key of src/content/vocabulary.ts, as in
    tests/frenchTypography.ts) is exempt.
  - In tests/unit/courseContent.test.ts, add a `describe('Spanish course (017 contract
    course-content-es.md)')` with these tests:
    - **S1** over all Spanish course text and glosses;
    - **S2**: no `wordBank` tile (answer or distractor) is exactly "¿" or "¡", and no answer
      has "a" followed by "el", or "de" followed by "el", as neighbouring tiles;
    - **S5, neutral Spanish** (spec FR-014): no Spanish course text, gloss or interface string
      contains the whole words `vosotros`, `vosotras`, `vuestro`, `vuestra`, `vuestros`,
      `vuestras` or `os`, ignoring case. ("vos" forms are left to the owner review, S3.)
  - In tests/unit/strings.test.ts, add S1 for every Spanish string, calling function keys with
    the existing `SAMPLE_ARGS`.
  - Run the suite. Then break src/content/es/lessons/04-verbs.ts on purpose, after copying it to
    `$TMPDIR` first:
    - an English option;
    - a French prompt;
    - a question without "¿";
    - a bare "¿" tile.

    Confirm that P2b (against en and fr), S1 and S2 fail. Restore the file from the copy and
    check it with `cmp`. Record the result.
- [X] T012 [P] [US1] Add a Spanish session case to tests/unit/sessionSlice.test.ts, next to the
  French one:
  - `startLesson('verbs', 'es')` stores `language: 'es'`;
  - a wrong answer to `'verbs/jo'` gives the Spanish `correctAnswer` (from
    src/content/es/lessons/04-verbs.ts);
  - `getLesson('verbs', 'es')!.title` is the Spanish title.
- [X] T013 [US1] Write tests/integration/spanishFlow.test.tsx, modelled on
  tests/integration/frenchFlow.test.tsx. It covers:
  - save `{version:1, language:'es'}` before `makeStore`;
  - the home screen in Spanish, with `<html lang="es">`;
  - the lesson 1 intro: title, `Libro: Lección 2 · N ejercicios`, a Spanish gloss;
  - a wrong answer showing "Casi" and the Spanish correct answer, then "¿Por qué?" with a Spanish
    `word: meaning` row;
  - the X button, "¿Salir de esta lección?", then "Seguir aprendiendo";
  - finish the lesson to "¡Lección completada!", with progress saved;
  - practice in Spanish with its leave dialog;
  - a leak check that fails on interface text that only exists in English, Portuguese or French.
    Reuse frenchFlow's lists and add French ones ("Vérifier", "Pourquoi", "Leçon terminée",
    "Objectif du jour").
    - Leave out words that are the same in Spanish ("Continuar", "Practicar", "Idioma").
    - Match single words against whole element texts, and longer phrases anywhere (015 analysis
      I1).
  - **Result**: the US1 cases passed at once; the device cases waited for T015. Shared words ("Continuar", "Idioma") are left out of the leak list.
- [X] T014 [US1] Run `npm test`, `npm run lint` and `npm run build`; all must pass. Record the
  count.
  - **Result (2026-11-25)**: 2436 passed (24 files) with T015–T017; lint and typecheck clean. One run had an English lessonFlow test time out at 5 s under load; it passed alone (70/70) and in every later full run.

**Checkpoint**: Spanish works end to end when set as the saved choice.

---

## Phase 4: User Story 2 - Spanish devices start in Spanish (Priority: P1) 🎯 MVP

**Goal**: with no saved choice, the first device language that is en / pt / fr / es decides.

- [X] T015 [US2] In src/i18n/language.ts `detectLanguage`, a primary subtag `es` returns `'es'`
  (research R2). Update the doc comment (add 017 FR-006).
- [X] T016 [P] [US2] Tests in tests/unit/language.test.ts:
  - `['es']`, `['es-ES']`, `['es-MX']`, `['es-419']` and `['ES-ar']` give `es`;
  - `['de', 'es-AR']` gives `es`;
  - `['en-US', 'es']` gives `en`;
  - `['fr', 'es']` gives `fr`;
  - `['es', 'pt-BR']` gives `es`.
  - **Result**: `[['de', 'es'], 'en']` became `[['de', 'it'], 'en']`; no other test used Spanish as the unsupported example.

  The existing case `[['de', 'es'], 'en']` (line ~15) used Spanish as the unsupported example.
  Change it to another unsupported language, e.g. `[['de', 'it'], 'en']`, so it still tests the
  same thing. Every other existing case stays unchanged. Search the other tests for `'es'` used as
  "unsupported" and fix those the same way.
- [X] T017 [P] [US2] Tests in tests/unit/persistence.test.ts:
  - add `'es'` to the `it.each(['en', 'pt-BR', 'fr'])` load case (FR-008);
  - a saved `"es-ES"` falls back to the device language.
- [X] T018 [US2] Add "starting in the device language" cases to
  tests/integration/spanishFlow.test.tsx:
  - a Spanish device (`navigator.languages` stubbed to `['es-MX', 'en']`) with nothing saved
    opens in Spanish and writes nothing;
  - a saved `"fr"` wins over a Spanish device.
  - **Result**: es-MX, es-419 and a saved "fr" over an es-ES device. 2436 passed.

  Run `npm test` and `npm run lint`, and record the count.

---

## Phase 5: User Story 3 - Choose Spanish in settings (Priority: P2)

**Goal**: settings list English, Español, Français, Português with flags; choosing Español
switches and saves.

- [X] T019 [P] [US3] Add `FlagES` to src/components/icons.tsx (research R4), using the existing
  `Flag` frame (30 × 20) and no coat of arms:
  - a red `#aa151b` band at y 0–5;
  - a yellow `#f1bf00` band at y 5–15;
  - a red `#aa151b` band at y 15–20.

  Doc comment: "Spanish: the flag of Spain (without the coat of arms)".
- [X] T020 [US3] In src/components/SettingsDialog.tsx, set `OPTIONS` to this order (contract
  ui-settings.md):
  1. English (FlagUS);
  2. Español (FlagES, `value: 'es'`);
  3. Français (FlagFR);
  4. Português (FlagBR).

  Labels keep `lang={value}`.
- [X] T021 [US3] Tests in tests/integration/settingsFlow.test.tsx:
  - the dialog shows four radios in the order English, Español, Français, Português (update the
    existing three-option order);
  - choosing Español switches the app (home "Aprende toki pona", dialog "Configuración", legend
    "Idioma", `<html lang="es">`) and saves `{version:1, language:'es'}`;
  - the arrow-key case steps English → Español → Français → Português;
  - extend the FR-009 case so a switch es → fr → pt-BR → en leaves progress, words and streak
    equal.
  - **Result (2026-11-25)**: 2437 passed (24 files); lint and typecheck exit 0.

  Run `npm test` and `npm run lint`, and record the count.
- [X] T022 [US3] Manual check in Chrome (quickstart M1–M3), after asking the user to run
  `npm run dev`:
  - save the dev `localStorage` first;
  - M1: Chrome's language list can't be changed from the page, so check what the current list
    gives and note that detection is covered by T016/T018;
  - M2: gear → Español, reload, check `duopona:settings`; switch to each other language and back;
  - M3: at a true 360 × 800, with headless Chrome on the built app (`npm run build`, then
    `npm run preview`). This is the method of 016 T006; the 500 px window minimum found in 015
    does not apply. Save screenshots in specs/017-spanish-language/. Check these Spanish screens
    for horizontal overflow and clipped text:
    - the home top bar and "Repasar palabras difíciles";
    - settings with four rows, with nothing scrolling inside the dialog;
    - a lesson intro;
    - a word bank;
    - the wrong-answer sheet with "¿Por qué?" open;
    - the leave dialog;
    - the summary.
  - restore the `localStorage` and verify it is identical; check the console for errors; close
    the tab.
  - **Result (2026-11-25)**: run on the built app (`vite preview`) in headless Chrome at a true 360 × 800, driven over the DevTools protocol by a scratch script (Chrome had to run outside the command sandbox, which blocks its local socket). Screenshots: [m3-results.png](m3-results.png) (home, settings, intro, wrong answer with "¿Por qué?" open, leave dialog, word bank, summary). On every screen: `lang="es"`, page width 360 (no sideways scroll), nothing past the right edge, every button, link and radio row ≥ 44 × 44, settings dialog with four rows and no inner scroll, no console errors. The only "clipped" elements were the visually hidden tile hint and status text (1 px by design).
  - **Layout issue found and fixed**: the summary's "Desbloqueada" tile broke a long word mid-letter ("Sustantivo / s y adjetivos"). Portuguese ("Substantivos") had the same problem before this feature, and "Preposiciones" is longer still. Added `hyphens: auto` to `.statNext` in src/components/Exercise.module.css, so the word breaks at a syllable with a hyphen using the page language. Desktop Chrome on Linux has no Spanish hyphenation dictionary, so the headless re-run still shows the old break; iOS Safari and Android Chrome hyphenate es/pt/fr. Confirming it is added to the deferred phone checks (T025).
  - The dev `localStorage` was not touched: the check used the built app on its own port and a fresh Chrome profile.
  - M1 and M2 were not run by hand in a browser. M1 (device language) is covered by T016/T018; the headless run confirmed that a saved "es" opens in Spanish with `lang="es"`. M2's saving, switching and progress checks are covered by T021 (settingsFlow, including a reload) and offline caching by `npm run test:pwa` (T027). A reload offline in a real browser is part of the deferred phone checks (T025).

  Record the results here and fix any layout issue found.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [~] T023 Owner review of the Spanish course, quickstart M5 (SC-006). Ask the owner; if they
  defer it, mark `[~]` with the date and "owner decision" (Constitution IV waiver). List points
  worth their attention, for example:
  - the gender of `ona` in prompts;
  - "tú / ti / usted" as a gloss;
  - word banks that always include the subject pronoun;
  - any `SAME_ES_PT` entries;
  - any text that wraps awkwardly.
  - **Deferred (2026-11-25)** by owner decision, as for 014 and 015, to be run later. Points worth attention:
    - word banks always include the subject pronoun ("yo amo el pan caliente", "tú no quieres comer"), which is less natural than dropping it;
    - "soweli lili mute" accepts only "muchos animales pequeños", though "muchos pequeños animales" is also possible Spanish (Portuguese has the same case);
    - glosses *sina* "tú / usted / ustedes", *soweli* "animal / mamífero terrestre", *moku* "alimento / comer / beber";
    - "No del todo" as the wrong-answer title; `ona` translated as "ella" in prompts where English has "she";
    - the `SAME_ES_PT` entries (Verbos, azul / verde, amar / amor, dentro).
- [X] T024 [P] Update README.md: the course can be studied in English, Spanish, French or
  Brazilian Portuguese, and Spanish devices start in Spanish (extend the device-language
  sentence).
- [~] T025 Ask the user to run quickstart M4 (Android, installed) and M6 (iOS Safari). If waived,
  mark `[~]` with the date and the owner decision.
  - **Deferred (2026-11-25)** by owner decision, to be run later with the 013–016 phone checks. Add to them: on a phone in Spanish, finish lesson 1 and check that "Sustantivos y adjetivos" on the summary's Desbloqueada tile breaks with a hyphen, not mid-letter (also in Portuguese).
- [X] T026 Set spec.md **Status** to `Implemented`, naming any deferred checks and their tasks.
  Add a 017 entry to ROADMAP.md in the same style as 015.
- [X] T027 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa`. Compare
  with the T001 baseline (count and precache size) and record the results here.
  - **Result (2026-11-25)**: `npm test` 2437 passed (24 files), up from 1816; lint exit 0; typecheck exit 0; build ok, precache 16 entries, 716.20 KiB (+54.8 KiB over the baseline, the Spanish course); `npm run test:pwa` 29 passed.

---

## Dependencies & Execution Order

- **T001** first.
- **T002** → T003, then T004–T008 → T009 → T010 (compile order; see the environment notes).
- **US1 tests**: T011–T014 after T010. T012 can run alongside T011.
- **US2**: T015–T017 need only T002. T018 also needs US1, so that the Spanish home screen
  renders.
- **US3**: T019 can run any time. T020–T021 need T003 (the Spanish settings texts). T022 needs
  US1–US3.
- **Polish** last. T026 and T027 come after everything else, and after T023 and T025 are
  answered.

### Parallel opportunities

- T004 ∥ T005 ∥ T006 ∥ T007 ∥ T008 (different content files): the bulk of the work. Each can go
  to its own subagent with the writing rules above and the matching English, Portuguese and
  French files.
- T011 ∥ T012; T016 ∥ T017; T019 alongside US1 or US2; T024 any time after US3.

## Implementation Strategy

1. **MVP (US1 + US2)**: T001–T018. A Spanish device gets the whole course in Spanish.
2. **US3**: T019–T022 add Español to settings. This is small, since the dialog already exists.
3. **Polish**: the owner's review, README, phone checks, status, final gate.

Commit only when the user asks. Earlier features used three commits: docs (spec/plan), feature,
and docs (results).
