# Research: Study in Brazilian Portuguese

## R1. Interface text: a typed strings table, no i18n library

- **Decision**: Add `src/i18n/strings.ts` with one object per language. `en` defines the shape
  (`type Strings = typeof en`), and `ptBR: Strings` must provide every key. Texts with numbers or
  names are small functions, e.g. `bestStreak: (n: number) => ...`, `lessonsDone: (done, total) => ...`.
  Components read them with a `useStrings()` hook that selects the active language from Redux.
- **Rationale**:
  - About 60 short texts and 2 languages. Plain objects plus TypeScript cover it in a few lines.
  - A missing Portuguese text is a **compile error**, so FR-013 holds for the interface without
    a runtime check. A unit test also checks that no Portuguese value is empty or identical to its
    English one, except an allow-list (e.g. "duopona").
  - Plurals are only "day/days", "exercise/exercises" and similar, and the functions handle them
    directly.
- **Alternatives considered**:
  - `react-i18next` / `react-intl`: mainstream, but they add a dependency, message files, ICU syntax
    and a provider for two languages. Principle I says no dependency for what a few lines can do.
  - Browser `Intl.PluralRules`: not needed for English and Portuguese "1 / many".

## R2. Course content: full parallel Portuguese lesson files

- **Decision**: Add `src/content/pt-BR/`, mirroring the English files:
  - `lessons/01-words-and-sentences.ts` … `17-more-words-2.ts` and `lessons/index.ts`, each a
    complete `Lesson` (same type as today);
  - `vocabulary.ts`, with the same keys as the English one.

  `src/content/lessons/index.ts` becomes the lookup point:
  - `courses: Record<Language, Lesson[]>`;
  - `getLesson(id, language = 'en')`;
  - `getExercise(key, language = 'en')`;
  - `getMeaning(word, language = 'en')`.

  The existing English `lessons` export stays.
- **Rationale**:
  - Each Portuguese lesson reads like the English one, so reviewing it is easy (SC-006). A word-bank
    sentence can have a different number and order of tiles from the English one (spec edge case).
  - The code only changes where it chooses the language, not the `Lesson` / `Exercise` types.
  - The `language = 'en'` default keeps the many existing tests and the language-neutral callers
    unchanged (practice picking and `testedWords` only use the Toki Pona side, see R5).
  - The Toki Pona side is written twice (once per language). A unit test (contract
    `course-content-pt.md`, rule P1) fails if the two copies differ, so they cannot drift apart.
- **Alternatives considered**:
  - Bilingual fields inside each exercise (`prompt: { en, pt }`): the type has to know which field
    is Toki Pona for each direction, which makes every exercise harder to read. Rejected.
  - A Portuguese "overlay" keyed by exercise id that is merged over the English lessons: there's no
    Toki Pona duplication, but a merge function, partial types and a completeness test are needed.
    It is also harder to review, because a Portuguese exercise is split from its Toki Pona.
    Rejected.

## R3. Which language a session uses: fixed at the start

- **Decision**: `LessonSession` gains `language: Language`. `startLesson` and `startPractice`
  take it (a `prepare` callback with default `'en'`, so existing calls keep working). The routes
  pass the active language. `submitAnswer` and `selectCurrentExercise` use
  `getExercise(key, session.language)`.
- **Rationale**: Reducers only see their own slice, so the session must know the language to check
  answers (`isCorrectAnswer`) and to build `feedback.correctAnswer`. Fixing it at the start also
  matches the spec: the language can't change during a session (settings exist only on home).
- **Alternatives considered**: Pass the language with every `submitAnswer`. This spreads it across
  more calls and allows mixing languages mid-session in theory. Rejected.

## R4. Detecting and saving the language

- **Decision**:
  - `type Language = 'en' | 'pt-BR'`.
  - `detectLanguage(tags: readonly string[]): Language` walks the tags in order. The first tag whose
    primary subtag is `pt` gives `'pt-BR'`, and the first one that is `en` gives `'en'`. If none
    matches, it returns `'en'`. Tags come from `navigator.languages`, falling back to
    `[navigator.language]`.
  - A new `settingsSlice` holds `{ language: Language; chosen: boolean }`. At store creation
    `loadSettings(deviceTags)` returns either the saved choice (`chosen: true`) or the detected
    language (`chosen: false`).
  - The action `languageChosen(language)` sets both fields. The store subscription saves settings
    only when `chosen` is true, under `duopona:settings`, `{ version: 1, language }` (contract
    `settings-storage.md`).
- **Rationale**:
  - Matches FR-006 (preferred languages in order) and FR-008 (choice wins and persists).
  - Without a choice nothing is written, so a later change of device language still applies.
  - The same versioned-key and validate-or-reset pattern as the other three keys (Principle II).
  - Detection runs once per launch, not in a selector, so selectors stay pure.
- **Alternatives considered**: Saving the detected language on first launch. That would freeze the
  device language forever, against the spec's rule "until the learner picks one". Rejected.

## R5. Language-neutral logic stays as it is

- **Decision**: Leave these unchanged: `testedWords`, word mistakes, practice/review picking,
  progress and streak. They use English lesson data only for its Toki Pona side and exercise ids.
- **Rationale**: Rule P1 makes the Toki Pona side and ids identical in both languages, so the
  results are identical too (FR-009, SC-005). Saved data has no language in it, so nothing to migrate.

## R6. Settings UI: a nested `/settings` route rendered as a native `<dialog>`

- **Decision**:
  - Home is `/` with a child route `settings`. `HomeRoute` renders `LessonList` plus `<Outlet />`.
  - A gear `Link` in the top bar goes to `/settings` with `preventScrollReset`.
  - `SettingsDialog` reuses the 013 pattern: `showModal()` on mount, unmount instead of `close()`,
    and a backdrop click detected via `event.target === event.currentTarget`.
  - It holds a title, a close (X) button and a `fieldset` with two native radio inputs, "English"
    and "Português", each with `lang` set to its own language.
  - Choosing a radio dispatches `languageChosen` at once; the dialog stays open and re-renders in
    the new language.
  - Close (X, Escape via the `close` event, backdrop click) calls `navigate(-1)` when there is
    history inside the app (`location.key !== 'default'`). Otherwise it calls
    `navigate('/', { replace: true })`.
  - Browser/device Back pops `/settings` → `/`, and the dialog unmounts.
- **Rationale**:
  - Back has to close the settings (spec US3 scenario 3). With a route this happens through normal
    history, with no `popstate` code.
  - The native dialog gives inert background, focus containment, Escape and dialog semantics, as in
    013.
  - The home screen stays mounted under the dialog (nested route), so the path does not re-scroll.
  - Native radios give arrow-key navigation, checked state and screen-reader semantics without
    extra code.
- **Alternatives considered**:
  - Dialog driven by local state on home: Back would leave the home page (or exit the installed
    app) instead of closing it, unless we wrote our own history handling. Rejected.
  - A full settings screen at `/settings`: more layout for a single option, and it loses the home
    context. The dialog can still grow into a screen later.

## R7. Document language

- **Decision**: `RootLayout` runs an effect that sets `document.documentElement.lang` to the
  active language (`en` / `pt-BR`). `index.html` keeps `lang="en"` for the first paint. The Toki
  Pona words already marked `lang="tok"` (the "Why?" word list in `FeedbackBanner`) keep it.
  Marking more Toki Pona text is out of scope.
- **Rationale**: FR-010, with screen readers reading Portuguese with Portuguese pronunciation.
  The web app manifest stays English (spec assumption).

## R8. Writing the Brazilian Portuguese course

- **Decision**: Conventions for every Portuguese text (contract `course-content-pt.md`, P4–P8):
  - **Brazilian usage**: "você" for *sina*, "vocês" for plural; Brazilian vocabulary and spelling
    ("time", "ônibus", "celular" where relevant); no European forms ("tu" + verb, "estás",
    "rapariga", "pequeno-almoço").
  - **Glosses**: same senses and order as the English gloss, 1–3 senses separated by " / ". Verbs
    are in the infinitive ("comer / beber"). Grammar-marker glosses are explained in Portuguese,
    e.g. `li`: "marca o predicado (depois de um sujeito que não é mi / sina)".
  - **Word-bank answers in Portuguese**:
    - always include the subject pronoun ("Eu como fruta.", not "Como fruta."), so the answer
      matches the Toki Pona;
    - articles and contractions ("a", "o", "na", "do") are their own tiles, written as one
      contracted tile when Portuguese contracts them;
    - adjectives go after the noun.
  - **Distractors**: must not make another order or another correct sentence, e.g. no second
    article that agrees in gender, and no pronoun that could replace the subject.
  - **Multiple-choice options**: Portuguese options must be distinct after translation; two
    English senses that translate to the same Portuguese word must not be options of the same
    exercise.
  - **Lesson titles and chapters**: titles are translated ("Verbos", "Perguntas e respostas"),
    except titles that are Toki Pona ("pi"). Chapter labels are "Lição N" or "Dicionário".
  - **Length**: grammar notes keep ≤ 2 sentences, ≤ 160 characters, and grammar explanations keep
    1–4 paragraphs.
- **Rationale**: Exact-match answer checking (`isCorrectAnswer`) only accepts one ordering, so the
  Portuguese sentences must be written to have only one. Portuguese allows a dropped subject and
  flexible adjective order, and the rules above remove those alternatives. The owner reviews the
  text for naturalness (quickstart M5).
- **Alternatives considered**: Accepting several correct orders per exercise (an `alternatives`
  list). It would change the answer model for both languages and isn't needed if the sentences are
  written carefully. Kept as a possible later idea.

## R9. Tests

- **Decision**:
  - **Unit tests**: `detectLanguage`, settings persistence (load/save/invalid/unknown language),
    `settingsSlice`, strings completeness (R1), and the existing content-rule suite run for both
    languages.
  - **Unit tests, new**: `course-content-pt.md` rules P1–P3 (Toki Pona side identical, same ids,
    all text present) and `explainMistake` / `getMeaning` in Portuguese.
  - **Integration**: with `navigator.languages` stubbed to `['pt-BR']`, play a lesson, a wrong
    answer with "Why?", the leave dialog and the summary in Portuguese. Change the language in
    settings from home (gear → Português) and check the switch, persistence after a store reload,
    and unchanged progress. Settings close via X, Escape, backdrop and Back (memory router
    `navigate(-1)`).
  - **Leak check**: a sweep in Portuguese checks that a list of English-only interface strings
    never appears.
- **Rationale**: Constitution IV. jsdom defaults `navigator.languages` to English, so existing
  tests keep passing without changes.
