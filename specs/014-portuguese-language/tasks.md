---

description: "Task list for feature 014: Study in Brazilian Portuguese"
---

# Tasks: Study in Brazilian Portuguese

**Input**: Design documents from `/specs/014-portuguese-language/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R9), data-model.md,
contracts/ (ui-settings.md, settings-storage.md, course-content-pt.md), quickstart.md (M1–M6)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. Device language, offline, 360 px, phone checks and the owner's
language review are manual (quickstart M1–M6); record results under the matching task.

**Organization**: Three user stories.
- **US1** (P1): the whole course in Portuguese. This is the big one: interface strings, session
  language and 17 translated lessons.
- **US2** (P1): start in the device language.
- **US3** (P2): settings dialog behind a gear on the home screen.

US1 + US2 make the MVP: a Portuguese-language device gets a full Portuguese course. US1 is
testable on its own by preloading `settings.language = 'pt-BR'` into the store.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1–US3)

## Path Conventions

Single frontend project: `src/`, `tests/` at the repository root. Run commands from the
repository root.

## Environment notes (read before any task)

- **npm in the sandbox**: prefix `npm`/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`
  (`~/.npm` is read-only). No new packages are needed. Do not add an i18n library (research R1).
- **Dev server**: a server started from the sandbox is not reachable from Chrome. Ask the user to
  run `npm run dev` (http://localhost:5173), then drive Chrome against it. If a file was rewritten
  by a script, touch it and check the served code before testing in Chrome (Vite may serve an
  empty cached file).
- **Language values**: `type Language = 'en' | 'pt-BR'` (data-model.md). Never use `'pt'`.
- **Defaults**: content lookups take `language = 'en'` as a default parameter (research R2), so
  existing tests and the language-neutral code in src/lib/practice.ts, src/content/words.ts and
  src/store/lessonThunks.ts stay unchanged. **UI call sites MUST pass the active language
  explicitly.**
- **Do not change**: saved formats of `duopona:progress`, `duopona:words`, `duopona:streak`;
  exercise ids; the `Direction` values `'tp-en' | 'en-tp'` (they now mean "Toki Pona → study
  language" and back; data-model.md). Update their doc comments only.
- **Existing tests run in English**: jsdom reports `navigator.languages` as English, so existing
  English assertions must keep passing unchanged. If one fails, the change broke English.
- **Portuguese writing rules**: contract course-content-pt.md P4–P8 and research R8. Brazilian
  usage, "você" for *sina*, subject pronoun always in word-bank answers, contractions as one tile,
  adjectives after the noun, no distractor that makes another correct sentence, grammar notes
  ≤ 2 sentences and ≤ 160 characters, original wording (do not copy any published translation of
  the book).

---

## Phase 1: Setup

- [X] T001 On branch `014-portuguese-language`, run `npm test` and `npm run lint` and record the passing test count under this task as the baseline. Check that ROADMAP.md already lists 014 under **In progress** (it was added during specify).
  - **Result (2026-11-23)**: baseline `npm test` 652 passed; lint clean; ROADMAP already lists 014

---

## Phase 2: Foundational (blocks all stories)

- [X] T002 [P] Create src/i18n/language.ts:
  - `export type Language = 'en' | 'pt-BR'`;
  - `export const LANGUAGES: readonly Language[] = ['en', 'pt-BR']`;
  - `export function isLanguage(value: unknown): value is Language`.

  Doc comment: "Study languages (014 data-model)". `detectLanguage` is added in T027 (US2).
- [X] T003 Create src/store/settingsSlice.ts (data-model "Settings"):
  - **State**: `export interface Settings { language: Language; chosen: boolean }`, with
    `export const defaultSettings = (): Settings => ({ language: 'en', chosen: false })`.
  - **Reducer**: `languageChosen(state, action: PayloadAction<Language>)` sets `language` and
    `chosen = true`, even when the language is unchanged.
  - **Selectors**: `export const selectLanguage = (s: { settings: Settings }) => s.settings.language`.
- [X] T004 In src/store/persistence.ts, add settings storage per contracts/settings-storage.md:
  - `export const SETTINGS_KEY = 'duopona:settings'`, `const SETTINGS_VERSION = 1`.
  - `loadSettings(fallback: Language): Settings`:
    - returns `{ language, chosen: true }` only when the stored JSON is an object with
      `version === 1` and `isLanguage(language)`;
    - otherwise (missing key, invalid JSON, wrong version, unknown language, or a throw) it returns
      `{ language: fallback, chosen: false }` and does not write anything.
  - `saveSettings(settings: Settings)`:
    - writes `{ version: 1, language }` only when `settings.chosen` is true;
    - ignores storage errors (same try/catch comment style as the other keys).
- [X] T005 Wire settings into src/store/index.ts:
  - add `settings: settingsReducer` to `combineReducers`;
  - `makeStore(deviceLanguage: Language = 'en')` preloads `settings: loadSettings(deviceLanguage)`;
  - the subscription saves settings when the slice object changes (same pattern as `lastStreak`).

  src/main.tsx keeps calling `makeStore()` for now; T028 passes the detected language.
- [X] T006 Create src/i18n/strings.ts with the English table (research R1). `const en = { ... }` holds every user-visible literal now in the components, as plain strings or small functions; `export type Strings = typeof en`. Add a temporary `export const strings: Record<Language, Strings> = { en, 'pt-BR': en }`; T014 replaces the `'pt-BR'` entry. Minimum keys, with the current English text:
  - **Home**:
    - `wordmark` ("duopona");
    - `streakLabel(streak, metToday)`;
    - `lessonsDoneLabel(done, total)`;
    - `courseProgress(done, total)` ("Course · 2 of 17 done");
    - `bannerTitle` ("Learn Toki Pona");
    - `bannerFollowing` ("Following") with `bookTitle` ("Toki Pona: The Language of Good");
    - `dailyGoal` ("Daily goal");
    - `sessionsToday(done, goal)`;
    - `bestStreak(n)` ("Best streak: 1 day" / "N days");
    - `practice`, `reviewWeakWords`;
    - `hintFinishLesson`, `hintNoWeakWords`;
    - `startPill` ("Start");
    - `lessonLocked(title)`, `lessonStart(title)`, `lessonCompleted(title, correct, total)`;
    - `footerBasedOn` ("Course based on"), `footerBy` ("by Sonja Lang").
  - **Intro**:
    - `backToLessons`;
    - `sourceLabel(chapter)`: returns `'Extra: dictionary words'` for `'Dictionary'` and
      `` `Book: ${chapter}` `` otherwise; the `'pt-BR'` version uses `'Dicionário'`;
    - `exerciseCount(n)`;
    - `newWords`;
    - `start`.
  - **Exercise**:
    - `quitLesson`, `lessonProgress`, `quitPractice`, `practiceProgress`;
    - `chooseMeaning`, `chooseTokiPona`;
    - `writeInStudyLanguage` ("Write this in English"), `writeInTokiPona`;
    - `options`, `yourAnswer`, `wordBank`, `grammarTag`, `check`.
  - **Feedback**:
    - `correct` ("Correct."); keep `pona!` literal in the component, because it is Toki Pona;
    - `correctAnswer`;
    - `why`, `hide`;
    - `means` (used as `{word} means {meaning}`; make it `wordMeans(meaning)` or split as fits
      the markup);
    - `fromLesson(lesson)`;
    - `continue`;
    - any other literal in src/components/FeedbackBanner.tsx.
  - **Leave dialog**: `leaveLessonTitle`, `leaveLessonMessage`, `leavePracticeTitle`, `leavePracticeMessage`, `keepLearning`, `leave`.
  - **Summary**:
    - `lessonComplete`, `practiceComplete`;
    - `replayLesson`, `practiseAgain`;
    - `dailyGoalMet`, `statCorrect`, `statUnlocked`, `statStreak`;
    - `subtitlePractice`, `subtitleWeakWords`;
    - every other literal in src/components/LessonSummary.tsx.
  - **Settings** (contract ui-settings.md): `settings`, `closeSettings`, `language`.

  Grep all of src/components and src/routes for remaining literals and add them. **Do not**
  change components in this task.
- [X] T007 Create src/i18n/useStrings.ts: `export function useStrings(): Strings` returns `strings[useAppSelector(selectLanguage)]`; also export `useLanguage()` returning the language.
- [X] T008 Make content lookups take a language (research R2). The English data stays where it is.
  - **src/content/vocabulary.ts**: keep `vocabulary` (English).
    - Add `import { vocabulary as vocabularyPtBR } from './pt-BR/vocabulary'`.
    - Add `export const vocabularies: Record<Language, Record<string, string>>`.
    - Change `getMeaning(word, language: Language = 'en')`.
    - Until T016 exists, create src/content/pt-BR/vocabulary.ts as
      `export const vocabulary: Record<string, string> = {}` with a TODO comment.
  - **src/content/lessons/index.ts**:
    - Keep `lessons` (English).
    - Add `export const courses: Record<Language, Lesson[]> = { en: lessons, 'pt-BR': lessonsPtBR }`,
      importing from `../pt-BR/lessons`.
    - Until T017–T022 exist, create src/content/pt-BR/lessons/index.ts exporting
      `lessons: Lesson[] = []` with a TODO comment.
    - Change `getLesson(id, language = 'en')` and `getExercise(key, language = 'en')` to look in
      `courses[language]`.
    - Remove `sourceLabel` and move it to the strings (`sourceLabel(chapter)`, T006). Update
      tests/unit/courseContent.test.ts to call `strings.en.sourceLabel(lesson.chapter)`.
  - **src/content/explanations.ts**:
    - Change to `explainMistake(key, given, language: Language = 'en')`, using
      `getExercise(key, language)`, `getLesson(..., language)` and the language's vocabulary.
    - `testedWords` stays language-neutral: compute it on the English exercise
      (`getExercise(key)`), since the Toki Pona side is identical (rule P1).
  - **src/content/types.ts**: update the `Direction` doc comment to "tp-en: Toki Pona → study
    language; en-tp: study language → Toki Pona (014)".
- [X] T009 Session language (research R3, data-model "Session") in src/store/sessionSlice.ts:
  - Add `language: Language` to `LessonSession`, and a `language` parameter to `newSession`.
  - `startLesson`:
    `{ reducer(_s, action: PayloadAction<{ lessonId: string; language: Language }>), prepare(lessonId: string, language: Language = 'en') { return { payload: { lessonId, language } } } }`.
    Use `getLesson(lessonId, language)`.
  - `startPractice`: the payload gains an optional `language?: Language`, defaulting to `'en'`.
  - `submitAnswer`: `getExercise(key, state.language)`.
  - `selectCurrentExercise`: `getExercise(key, state.session.language)`.

  In src/store/lessonThunks.ts, `startPracticeSession` passes `language: selectLanguage(state)`.
  `submitAndRecord` and `wordsOf` stay as they are (language-neutral).
- [X] T010 Run `npm test`, `npm run lint` and `npx tsc -b`. Everything must pass with the same English behaviour. Fix call sites and tests that used `sourceLabel` or the old `startLesson` payload shape; `startLesson('id')` must still work. Record the count.
  - **Result (2026-11-23)**: 652 passed, tsc and lint clean. Done after T011–T015 (LessonIntro needed the moved `sourceLabel`). tests/integration/wordBank.test.tsx now renders inside a store `wrapper`, because WordBank reads its text from Redux

---

## Phase 3: User Story 1 - Study the whole course in Portuguese (Priority: P1) 🎯 MVP

**Goal**: With `settings.language = 'pt-BR'`, every screen and all course text is in Brazilian
Portuguese, and Toki Pona is unchanged.

**Independent Test**: Preload `settings: { language: 'pt-BR', chosen: true }`. Play a lesson,
miss an answer, open "Why?", tap X (leave dialog), finish a practice; no English appears.

### Implementation: interface

- [X] T011 [P] [US1] src/components/LessonList.tsx: replace every literal with `useStrings()` keys from T006. Use `courses[language]` (from `useLanguage()`) for the path's lesson titles, and keep `lessons.length` for counts. The `<cite>` keeps `bookTitle`.
- [X] T012 [P] [US1] src/components/LessonIntro.tsx, src/routes/LessonRoute.tsx:
  - **LessonRoute**:
    - gets `language` from `useLanguage()`;
    - looks the lesson up with `getLesson(lessonId, language)`;
    - dispatches `startLesson(lesson.id, language)`;
    - gets the summary's next-lesson title from `courses[language]`.
  - **LessonIntro**: uses `strings.sourceLabel(lesson.chapter)`, `strings.exerciseCount(n)`,
    `getMeaning(word, language)` and the remaining string keys.
- [X] T013 [P] [US1] Exercise screens to strings. Remove the English default props that exist only for wording; components read strings themselves, and routes say only "lesson" or "practice".
  - **src/components/ExerciseScreen.tsx**: replace the `quitLabel`/`progressLabel`/`leaveTitle`/
    `leaveMessage` props with `kind: 'lesson' | 'practice' = 'lesson'`, and pick the strings by
    kind. The default keeps src/routes/LessonRoute.tsx (edited in T012) compiling without
    changes, so T012 and T013 stay parallel (analysis I1).
  - **src/routes/PracticeRoute.tsx**:
    - passes `kind="practice"`;
    - `SUBTITLES` and the summary labels come from strings.
  - **src/components/MultipleChoice.tsx**, **src/components/WordBank.tsx**: the instruction for
    `'tp-en'` is `writeInStudyLanguage` / `chooseMeaning`.
  - **src/components/FeedbackBanner.tsx**: strings, and pass `language` to `explainMistake`.
  - **src/components/LeaveDialog.tsx**: `keepLearning` and `leave`.
  - **src/components/LessonSummary.tsx**: defaults from strings.

  Keep every accessible name identical in English, because existing tests query by them.
- [X] T014 [US1] (written together with T006) In src/i18n/strings.ts, write `const ptBR: Strings` and set `strings['pt-BR'] = ptBR`. Use natural Brazilian Portuguese, original wording. Suggested key texts:
  - **Home**: "Aprenda Toki Pona", "Meta diária", "Praticar", "Revisar palavras fracas",
    "Começar", "Curso · 2 de 17 concluídas".
  - **Exercise and feedback**: "Escolha o significado", "Escolha em toki pona",
    "Escreva em português", "Escreva em toki pona", "Verificar", "Continuar", "Correto.",
    "Resposta correta:", "Por quê?", "Ocultar".
  - **Leave dialog**: "Sair desta lição?", "Seu progresso nesta lição será perdido.",
    "Continuar aprendendo", "Sair".
  - **Summary**: "Lição concluída!", "Prática concluída!".
  - **Settings**: "Configurações", "Fechar configurações", "Idioma".
  - **Plurals**: "1 dia" / "N dias", "1 exercício" / "N exercícios".
  - **Chapters**: `sourceLabel('Dicionário')` → "Extra: palavras do dicionário", otherwise
    `Livro: ${chapter}`.
  - **Book title**: keep it in English in `<cite>`; the course follows the English edition.
- [X] T015 [US1] Document language (research R7): in src/router.tsx `RootLayout`, `useEffect(() => { document.documentElement.lang = language }, [language])` using `useLanguage()`.

### Implementation: course content (contract course-content-pt.md)

Each lesson task creates the Portuguese file **mirroring the English file of the same name**:
- same `id`, `newWords`, and exercise order;
- the same `id`/`type`/`direction`/`practisesGrammar` per exercise;
- an identical Toki Pona side (P1);
- translated title, chapter ("Lição N" or "Dicionário"), grammar title and paragraphs,
  `en-tp` prompts, `tp-en` options and answers, `tp-en` word-bank answers and distractors, and
  grammar notes.

Read the English file first. Write Portuguese meanings consistent with T016's glosses.

**Limits (analysis R1)**: if a Portuguese word-bank answer needs more than 8 tiles (rule C8), or a
grammar note can't fit 2 sentences and 160 characters (P8), first try a shorter natural
sentence. If none works, **stop and ask the owner**. Never loosen a test or a limit without the
owner's agreement, and record their decision under the task.

- [X] T016 [P] [US1] src/content/pt-BR/vocabulary.ts: same keys and order as src/content/vocabulary.ts, with Brazilian Portuguese glosses (P3). Keep the same senses, 1–3 separated by " / ", and verbs in the infinitive. Keep the header comment, translated in substance ("written for Duopona, not copied").
- [X] T017 [P] [US1] src/content/pt-BR/lessons/01-words-and-sentences.ts, 02-nouns-and-adjectives.ts, 03-you-and-i.ts
- [X] T018 [P] [US1] src/content/pt-BR/lessons/04-verbs.ts, 05-more-adjectives.ts, 06-questions-and-answers.ts
- [X] T019 [P] [US1] src/content/pt-BR/lessons/07-prepositions.ts, 08-greetings-and-feelings.ts, 09-pi.ts (title stays "pi")
- [X] T020 [P] [US1] src/content/pt-BR/lessons/10-pre-verbs.ts, 11-colours-and-la.ts ("Cores e la"), 12-spatial-nouns.ts
- [X] T021 [P] [US1] src/content/pt-BR/lessons/13-particles-and-perspective.ts, 14-hunting.ts, 15-cooking.ts
- [X] T022 [P] [US1] src/content/pt-BR/lessons/16-more-words-1.ts, 17-more-words-2.ts (chapter "Dicionário"; titles "Mais palavras 1/2")
- [X] T023 [US1] src/content/pt-BR/lessons/index.ts: export `lessons: Lesson[]` in the same order as src/content/lessons/index.ts. Remove the T008 TODO placeholders (vocabulary and lessons).

### Tests (after the code, Constitution IV)

- [X] T024 [P] [US1] tests/unit/courseContent.test.ts:
  - Wrap the per-lesson rule suite (C2–C11 shape rules) in `describe.each(LANGUAGES)` over
    `courses[language]` and `getMeaning(w, language)`. C1 (the title/chapter table) stays English;
    add a Portuguese id/newWords check through P1.
  - Add `describe('Portuguese course (014 contract)')`:
    - **P1**: same ids and newWords; per exercise the same id/type/direction/practisesGrammar;
      `tokiPonaText` equal; for `en-tp` multiple choice the same `answer`.
    - **P2**: all non-Toki Pona fields non-empty; `grammarNote` present exactly when
      `practisesGrammar`.
    - **P3**: the vocabulary keys equal the English keys, and the glosses are non-empty.
    - **P6**: the Portuguese multiple-choice options are distinct.
    - **P7**: chapter matches `/^Lição \d+$/` with the same number as the English
      `Lesson N`, or equals `'Dicionário'` where the English is `'Dictionary'`.
    - **P8**: grammar note ≤ 160 characters and ≤ 2 sentences.
    - **P2b, really translated** (analysis C1): every Portuguese non-Toki Pona field (lesson title,
      grammar title and paragraphs, `en-tp` prompts, `tp-en` options and answers, `tp-en`
      word-bank answers and distractors, grammar notes, vocabulary glosses) differs from its
      English counterpart. The allow-list is the lesson title "pi" plus any entry added with a
      comment explaining why it is the same in both languages. For word-bank arrays, compare the
      joined text.
  - Run the existing explanation checks (word meanings, wrongPick) for both languages.
  - **Result (2026-11-23)**: courseContent 831 tests pass. A deliberately broken Portuguese lesson (an English gloss as option, an English prompt) failed C7 and P2b as expected, then was restored. P8 runs through the per-language explanation suite (49 notes, ≤ 160 chars, ≤ 2 sentences); no limit had to be loosened
- [X] T025 [P] [US1] Add the remaining unit and integration tests:
  - **tests/unit/strings.test.ts**: for every key of `strings.en`, `strings['pt-BR']` has the same
    kind (string or function). No Portuguese string value is empty, and none equals its English
    value except an allow-list (`wordmark`, `bookTitle`). Functions return non-empty text for
    sample args. `sourceLabel` works for both languages' chapter formats.
  - **tests/unit/sessionSlice.test.ts**: `startLesson('verbs', 'pt-BR')` stores
    `language: 'pt-BR'`. `submitAnswer` with the Portuguese answer of a `tp-en` exercise is correct,
    and `feedback.correctAnswer` is Portuguese. The English answer for the same exercise is wrong.
    `startLesson('verbs')` defaults to `'en'`.
  - **tests/integration/portugueseFlow.test.tsx** (build the store with
    `settings: { language: 'pt-BR', chosen: true }` saved in localStorage before `makeStore()`):
    - the home screen shows "Aprenda Toki Pona" and the Portuguese lesson titles;
    - `document.documentElement.lang === 'pt-BR'`;
    - open lesson 1: the intro shows Portuguese meanings and grammar;
    - answer an exercise wrong, open "Por quê?": the meanings are Portuguese;
    - X opens "Sair desta lição?"; "Continuar aprendendo" resumes;
    - finish the lesson (answer from the Portuguese data): "Lição concluída!";
    - start a practice and check `quit`/dialog wording for practice;
    - **leak check**: during the flow, assert none of a list of English-only strings ("Check",
      "Continue", "Why?", "Correct answer:", "Leave this lesson?", "Lesson complete!",
      "Daily goal", "Practice") appears in `document.body.textContent` or as an accessible name.
- [X] T026 [US1] Run `npm test`, `npm run lint`, `npm run build`; all pass. Record the count.
  - **Result (2026-11-23)**: 1185 passed (19 files); lint clean; build ok, precache 16 entries, 601.57 KiB

---

## Phase 4: User Story 2 - The app starts in the device language (Priority: P1) 🎯 MVP

**Goal**: With no saved choice, the device's preferred languages decide (FR-006).

**Independent Test**: Stub `navigator.languages` as `['pt-BR']`, `['pt-PT']`, `['en-US']`,
`['fr-FR']` and `['fr-FR', 'pt-BR', 'en']`; build the store; expect pt-BR, pt-BR, en, en, pt-BR.

### Implementation

- [X] T027 [US2] In src/i18n/language.ts, add `export function detectLanguage(tags: readonly string[]): Language` (research R4). Walk the tags in order and take the primary subtag, lower-cased (`tag.split('-')[0]`): `'pt'` → `'pt-BR'`, `'en'` → `'en'`. If none matches, return `'en'`. Also add `export function deviceLanguageTags(): readonly string[]`, returning `navigator.languages` when it is non-empty, else `[navigator.language]`, else `[]`, guarded with `typeof navigator`.
- [X] T028 [US2] src/main.tsx: `makeStore(detectLanguage(deviceLanguageTags()))`. **Do this only after T023**: before then the Portuguese course is the empty T008 placeholder, so a Portuguese device would get an empty lesson path (analysis U1).

### Tests (after the code)

- [X] T029 [P] [US2] Unit tests:
  - **tests/unit/language.test.ts**: `detectLanguage` for `['pt-BR']`, `['pt-PT']`, `['pt']`,
    `['PT-br']`, `['en-GB']`, `['fr-FR']`, `[]`, `['fr', 'pt-BR']`, `['en-US', 'pt-BR']` (→ en),
    `['de', 'es']` (→ en).
  - **tests/unit/persistence.test.ts**: `loadSettings` returns the fallback with `chosen: false`
    for a missing key, invalid JSON, `version: 2`, `language: 'pt'`, `language: 'fr'`, or a
    non-object. It returns the saved language with `chosen: true` for
    `{ version: 1, language: 'pt-BR' }`. `saveSettings({ chosen: false })` writes nothing;
    `chosen: true` writes the contract JSON.
  - **tests/unit/settingsSlice.test.ts**: `languageChosen` sets both fields, including
    re-choosing the same language.
  - **tests/unit/store.test.ts** (or the existing store test, if there is one):
    `makeStore('pt-BR')` with no saved key gives pt-BR, chosen false, and nothing is written.
    A saved `en` beats a device `pt-BR`.
- [X] T030 [US2] Integration: in tests/integration/portugueseFlow.test.tsx, add a case that builds the app the way main.tsx does with `vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['pt-BR'])` and no saved settings, and checks that home is in Portuguese. Run `npm test` and `npm run lint`, and record the count.
  - **Result (2026-11-23)**: 1216 passed (21 files); lint clean. No separate store test file existed, so the store cases are in tests/unit/settingsSlice.test.ts

---

## Phase 5: User Story 3 - Choose the language myself (Priority: P2)

**Goal**: The gear on the home screen opens the settings dialog. Choosing a language switches the
app at once and is saved. Contract ui-settings.md.

**Independent Test**: On an English device, gear → Português: the app switches at once. Rebuild
the store and it is still Portuguese. Progress is unchanged. X, Escape, backdrop and Back close the
dialog.

### Implementation

- [X] T031 [P] [US3] src/components/icons.tsx: add `GearIcon`, a stroke icon in the same style (24×24 viewBox, `Stroke` wrapper), a simple cog: a circle r=3 plus 8 short teeth, or an equivalent single path.
- [X] T032 [US3] Create src/components/SettingsDialog.tsx (contract ui-settings.md, research R6), based on src/components/LeaveDialog.tsx:
  - **Markup**: native `<dialog className="leave-dialog settings-dialog" aria-labelledby={titleId}>`.
    - `showModal()` in a mount effect. Never call `close()` on unmount.
    - `onClose={close}`, and a backdrop click (`event.target === event.currentTarget`) also calls
      `close`.
  - **Body**:
    - a header row with `<h2 id={titleId}>{s.settings}</h2>` and an icon button
      (`aria-label={s.closeSettings}`, CloseIcon) that calls `close`;
    - `<fieldset><legend>{s.language}</legend>` with two label-wrapped radios
      (`name="language"`). Option 1 is `value="en"` with `lang="en"` and text "English"; option 2 is
      `value="pt-BR"` with `lang="pt-BR"` and text "Português". These texts are fixed, not from
      strings.
  - **Radios**: `checked={language === value}`;
    `onChange={() => dispatch(languageChosen(value))}`.
  - **Focus**: on mount, the checked radio.
  - **`close`**:
    `location.key !== 'default' ? navigate(-1) : navigate('/', { replace: true })`, using
    `useLocation` and `useNavigate`.
- [X] T033 [US3] Routing and the gear:
  - **src/router.tsx**: change `{ path: '/', element: <HomeRoute /> }` to
    `{ path: '/', element: <HomeRoute />, children: [{ path: 'settings', element: <SettingsDialog /> }] }`.
  - **src/routes/HomeRoute.tsx**: render `<><LessonList /><Outlet /></>`.
  - **src/components/LessonList.tsx**: add the gear at the end of the top bar:
    `<Link to="/settings" preventScrollReset className={`icon-button ${styles.settings}`} aria-label={s.settings}>`
    with `<GearIcon size={26} />`.
    - The `useEffect` that scrolls the current lesson into view must not run again when the dialog
      opens or closes. It already runs once on mount, and LessonList stays mounted; verify this.
    - Focus returns to the gear after closing: keep a ref and focus it when the pathname goes from
      `/settings` back to `/`. Alternatively rely on the browser's dialog focus return, if it
      works with unmount in Chrome. Check it in T037 and add the ref only if needed.
- [X] T034 [US3] Styles in src/index.css, after the leave-dialog rules ("Settings dialog (014)"):
  - `.settings-dialog-header` (flex, space-between, align center);
  - `.settings-dialog fieldset` (no border, padding 0, margin 0);
  - `legend` (label style);
  - `.settings-option`: a full-width label row with `min-height: 44px`, flex, gap 12px, padding
    0 12px, border-radius 12px, and a border `2px solid var(--line)`; when checked
    (`:has(input:checked)`), the border uses the brand purple token used by the selected
    multiple-choice option;
  - 8px between rows.

  In src/components/LessonList.module.css, add `.settings` (any spacing so the gear sits after
  the counters). Use only existing colour tokens, keep contrast ≥ 4.5:1, and make the layout fit
  360 px.

### Tests (after the code)

- [X] T035 [US3] tests/integration/settingsFlow.test.tsx (memory router at `/`, English device):
  - (a) the home screen has a link named "Settings", and no "English"/"Português" radios are
    visible before it is clicked;
  - (b) clicking it opens a dialog named "Settings" with the "English" radio checked and focused,
    at location `/settings`;
  - (c) choosing "Português" switches the dialog title to "Configurações" and the home screen to
    "Aprenda Toki Pona" at once; `document.documentElement.lang === 'pt-BR'`; localStorage
    `duopona:settings` holds `{"version":1,"language":"pt-BR"}`;
  - (d) after an unmount and a new `makeStore()` + render, the app is still Portuguese;
  - (e) progress, words and streak in the store are deep-equal before and after switching, using
    seeded progress;
  - (f) each close path returns to `/` with no dialog: the close button, the `close` event (Escape),
    a click on the dialog element (backdrop), and `router.navigate(-1)` (Back);
  - (g) opening `/settings` as the first entry, then the close button, goes to `/` with replace;
  - (h) with a `pt-BR` device and no saved choice, choosing "English" saves `en`, and a rebuild
    with the `pt-BR` device stays English.
- [X] T036 [US3] Run `npm test` and `npm run lint`; all pass. Record the count.
  - **Result (2026-11-23)**: 1228 passed (22 files); lint clean; build ok, precache 16 entries, 604.54 KiB. Focus return to the gear is done with a ref in LessonList (tested in T035), since the dialog unmounts instead of closing
- [X] T037 [US3] Manual check: ask the user to run `npm run dev`, then in Chrome run quickstart M1, M2 and M3 and record results under this task. Save the user's dev `localStorage` before and restore it after. Fix any layout or focus issues in src/index.css or SettingsDialog and re-check.
  - **Result (2026-11-23)**, Chrome against the user's `npm run dev` (served code checked first; the user's dev `localStorage` saved before and restored after, verified identical; no console errors):
    - **M1 (English side)**: Chrome's languages are `en-US, en, pt`, so the app opened in English with `lang="en"`, as FR-006 requires (first supported tag wins). The Portuguese-device side was not run in Chrome, because it needs a browser-wide language change; it is covered by tests/unit/language.test.ts and the US2 integration tests.
    - **M2**: the gear opened `#/settings` as a modal dialog over the home screen, which kept its scroll position. Choosing Português switched every visible text at once; the dialog stayed open in Portuguese. Escape closed it with focus back on the gear; `duopona:settings` = `{"version":1,"language":"pt-BR"}`; progress unchanged. After a reload the app was still Portuguese. Browser Back from `#/settings` closed only the dialog (focus on the gear). Offline was not run: the dev server has no service worker; offline precaching is covered by `npm run test:pwa` (T042).
    - **M3 (360 px frame)**: found and fixed one issue. The gear made the "2 / 17" counter wrap onto two lines. Fix in src/components/LessonList.module.css: counters `white-space: nowrap`, gaps 16→10 px (counters) and 8→6 px (icon and number), gear margin-left −12 px; the gear stays 44×44. After the fix: no horizontal overflow on the home screen (even with the frame's 17 px scrollbar), settings dialog (16–327 px, rows 52 px), lesson intro, multiple choice, wrong-answer sheet with "Por quê?" open, leave dialog, and a Portuguese word bank. Note for the owner's review: "Continuar aprendendo" wraps onto two lines in the leave dialog's button (fully visible, nothing clipped).

---

## Phase 6: Polish & Cross-Cutting Concerns

- [~] T038 Owner language review, quickstart M5 (SC-006): ask the owner to read every Portuguese lesson intro and play the exercises (or review the src/content/pt-BR files). Record the corrections they ask for under this task and apply them in the matching src/content/pt-BR file or src/i18n/strings.ts. Re-run T024's tests after the edits. The owner may waive or defer this under the recorded-waiver rule (Principle IV): mark `[~]` with the date and "owner decision", and name it in spec.md **Status**.
  - **Deferred (2026-11-23)**: owner decision (constitution IV waiver): the owner will review the Portuguese course later. Points to look at: word-bank answers that allow only one order ("uma pessoa grande", "muitos animais pequenos"), "minha mãe" for *mama mi*, and the two-line "Continuar aprendendo" button.
- [X] T039 [P] Update README.md:
  - in "The course", say the course can be studied in English or Brazilian Portuguese; the app
    starts in the device language, and the gear on the home screen changes it;
  - in the storage sentence, add that the language choice is saved under `duopona:settings`
    (only after choosing).
- [~] T040 Ask the user to run quickstart M4 (Android, installed) and M6 (iOS Safari) on phones (Constitution V) and record the results under this task. The owner may waive or defer this under the recorded-waiver rule: mark `[~]` with the date and "owner decision", and name the checks in spec.md **Status**.
  - **Deferred (2026-11-23)**: owner decision (constitution IV waiver): the owner will run M4 (Android, installed) and M6 (iOS Safari) on phones later.
- [X] T041 Set spec.md **Status** to `Implemented`, or to `Implemented (…)` naming any waived or deferred checks. In ROADMAP.md, move 014 from **In progress** to **Done** with a short summary in the style of the other items, and set **In progress** back to `(none)`.
- [X] T042 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa` all pass. Record the test count against T001's baseline, and the build's precache size against 013's 544.65 KiB.
  - **Result (2026-11-23)**: 1228 passed (22 files; baseline 652), three full runs in a row; lint and typecheck clean; build ok, precache 16 entries, 604.56 KiB (was 544.65 KiB: +60 KiB for the Portuguese course and strings); `npm run test:pwa` 29 passed. The first full run had two time-outs in tests/integration/streakFlow.test.tsx: those tests take about 3.6 s alone, the same before and after this feature, and went past the 5 s default under the larger parallel run; that file now sets a 15 s limit.

---

## Dependencies & Execution Order

- **Setup (T001)**: first
- **Foundational**:
  - T002 → T003 → T004 → T005; T006 (needs T002) → T007 (needs T003, T006);
  - T008 (needs T002) → T009 (needs T008);
  - T010 after all of these.
- **US1**:
  - interface tasks T011, T012, T013 [P] after T010; then T014 (strings file) and T015;
  - content tasks T016–T022 [P] after T008 (they are independent of the interface tasks);
    T023 after T017–T022;
  - tests T024 (after T023), T025 (after T011–T015, T023); T026 last.
- **US2**: T027 → T028 (needs T023) → T029 [P] → T030. T027 can start right after
  Foundational, in parallel with US1's content tasks; T030's Portuguese assertion needs T014.
- **US3**: T031 [P] any time; T032 (needs T003, T007) → T033 → T034 → T035 (needs T014 for the
  Portuguese assertions) → T036 → T037.
- **Polish**: T038 after T023 (best after T037); T039 [P] any time after T036; T040 → T041 →
  T042.

### Parallel opportunities

- T002 with T006's drafting; T008 alongside T003–T005.
- The seven content tasks T016–T022 together, also alongside T011–T013.
- T024, T025 and T029 (different test files).
- T031 at any point.

## Implementation Strategy

- **MVP**: Phases 1–4 (US1 + US2). A learner on a Portuguese device gets the full course in
  Portuguese with no setup. The content tasks (T016–T022) are most of the effort; landing them one
  lesson group at a time is fine, because P1–P3 fail until all 17 exist. Keep the TODO
  placeholders until T023.
- **Increment 2**: US3, the gear and the settings dialog, so anyone can switch.
- **Last**: the owner's language review (T038) and the device checks. The owner may defer either
  (recorded waiver).
