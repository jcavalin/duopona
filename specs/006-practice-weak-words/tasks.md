---

description: "Task list for feature 006: Practice Session and Review Weak Words"
---

# Tasks: Practice Session and Review Weak Words

**Input**: Design documents from `/specs/006-practice-weak-words/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R7), data-model.md,
contracts/ui-screens.md, contracts/words-storage.md, quickstart.md (P1–P10, P-D1)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. Phone behavior is validated manually (IV exception) with
quickstart P-D1, results recorded under the matching task.

**Organization**: Tasks are grouped by user story: US1 (P1, practice session), US2 (P2, word
mistake records), US3 (P3, review weak words).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1, US2, US3)

## Path Conventions

Single frontend project: `src/`, `tests/` at the repository root. Run commands from the
repository root.

## Environment notes (read before any task)

- **npm in the sandbox**: prefix `npm`/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`
  (`~/.npm` is read-only). No new packages are needed.
- **Dev/preview server**: a server started from the sandbox is not reachable from Chrome. Ask
  the user to run `npm run dev` (http://localhost:5173) or `npm run build && npm run preview`
  (http://localhost:4173) themselves, then drive Chrome against it.
- **Exercise keys**: `"<lessonId>/<exerciseId>"` (data-model "Exercise key"). Exercise ids
  repeat across lessons (`toki`), so never look an exercise up by id alone outside one lesson.
- **Do not change** `duopona:progress` or its format (`src/store/persistence.ts` progress
  functions, `specs/001-first-lesson-flow/contracts/progress-storage.md`).

---

## Phase 1: Setup

- [X] T001 Create and switch to the branch `006-practice-weak-words` from `main` (`git switch -c 006-practice-weak-words`); run `npm test` and `npm run lint` and record the passing test count under this task as the baseline
  - **Result (2026-11-03)**: branch created; baseline `npm test` 444 passed, lint clean

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Sessions that can hold exercises from several lessons, and lesson components that
accept practice labels. Lesson behavior must stay exactly as it is.

- [X] T002 Add exercise keys to src/content/lessons/index.ts (research R2): `export function exerciseKey(lessonId: string, exerciseId: string): string` returning `` `${lessonId}/${exerciseId}` ``, and `export function getExercise(key: string): Exercise | undefined` that splits on the **first** `/`, finds the lesson with `getLesson` and the exercise by id in it; unknown lesson, unknown exercise or no `/` → `undefined`
- [X] T003 Rework src/store/sessionSlice.ts for keys (data-model "Session"):
  - `LessonSession` gains `kind: 'lesson' | 'practice' | 'review'` and `total: number`; `lessonId` becomes `string | null` ("set only when `kind === 'lesson'`"); `queue` and `missedOnce` hold exercise keys
  - `startLesson(lessonId)`: `kind: 'lesson'`, `queue` = the lesson's exercises mapped with `exerciseKey(lesson.id, e.id)`, `total` = `queue.length`; unknown lesson → `null` (unchanged)
  - new `startPractice(state, action: PayloadAction<{ kind: 'practice' | 'review'; keys: string[] }>)`: `keys` empty → return `null`; otherwise `lessonId: null`, `queue: [...keys]`, `total: keys.length`, `missedOnce: []`, `feedback: null`, `status: 'answering'`, `step: 0`
  - replace `findExercise(lessonId, id)` with `getExercise(key)` in `submitAnswer` and `selectCurrentExercise`; `missedOnce` stores the key
  - `selectTotal` returns `state.session?.total ?? 0`; `selectPosition` and `selectFirstTryCorrect` keep their formulas on top of it
  - add `export function selectCurrentKey(state): string | undefined` (head of `queue`)
  - export `startPractice`
- [X] T004 In src/store/lessonThunks.ts make `continueAndRecord` dispatch `completeLesson` only when `state.session.status === 'finished' && state.session.kind === 'lesson' && state.session.lessonId` (FR-005)
- [X] T005 [P] In src/components/ExerciseScreen.tsx add optional props `quitLabel = 'Quit lesson'` and `progressLabel = 'Lesson progress'` used for the close button's `aria-label` and the `<progress>` `aria-label` (contract "S3. Exercise in practice")
- [X] T006 [P] In src/components/LessonSummary.tsx add props `heading` (default `'Lesson complete!'`) and `replayLabel` (default `'Replay lesson'`); rename `lessonTitle` to `subtitle` and update the caller in src/routes/LessonRoute.tsx (contract "S5. Practice complete"). The Unlocked card stays conditional on `nextLessonTitle`
- [X] T007 Run `npm run lint` and `npm run build`; fix errors from T002–T006
- [X] T008 Update tests/unit/sessionSlice.test.ts for keys: build expected queues with `exerciseKey(lesson.id, id)`, assert `kind: 'lesson'`, `lessonId`, and `total`; add cases: `startPractice({ kind: 'practice', keys: [] })` → `null`; `startPractice` with the keys `verbs/toki` and `greetings-and-feelings/toki` (the same exercise id in two lessons) plus one more key → `selectCurrentExercise` resolves the right lesson's exercise, a wrong answer moves the key to the end and records it in `missedOnce`, the session finishes after all are answered right, `selectPosition().total` equals the key count. Add tests for `getExercise` (valid key, unknown lesson, unknown exercise, no slash) in tests/unit/courseContent.test.ts or a new tests/unit/exerciseKey.test.ts. Run `npm test`: tests/integration/lessonFlow.test.tsx MUST pass unchanged

**Checkpoint**: Lessons behave exactly as before; the session can run any list of exercise keys

---

## Phase 3: User Story 1 - Mixed practice from completed lessons (Priority: P1) 🎯 MVP

**Goal**: A Practice button on the home screen plays 10 random exercises from completed lessons
with the lesson flow and a practice summary, without touching lesson progress

**Independent Test**: Complete two lessons, tap Practice, play to the end, confirm every
exercise came from those lessons, the summary shows the first-try score, and the lesson list is
unchanged (quickstart P1, P3, P4, P9)

### Implementation for User Story 1

- [X] T009 [P] [US1] Create src/lib/practice.ts (research R3) with `export const SESSION_SIZE = 10`, `availableKeys(completedLessonIds: readonly string[]): string[]` (keys of every exercise of every course lesson whose id is in the list, in course order; ids not in the course are ignored) and `pickPractice(keys: readonly string[], random = Math.random): string[]` = `shuffle(keys, random).slice(0, SESSION_SIZE)` using `shuffle` from src/lib/shuffle.ts
- [X] T010 [US1] In src/store/lessonThunks.ts add `startPracticeSession(kind: 'practice' | 'review')` thunk: computes `availableKeys(Object.keys(state.progress.completedLessons))`; for `'practice'` dispatches `startPractice({ kind, keys: pickPractice(keys) })` (review is added in T029; until then `'review'` dispatches nothing). Add `selectCanPractice` to src/store/progressSlice.ts: true when at least one key of `completedLessons` is a course lesson id (FR-001)
- [X] T011 [US1] Create src/routes/PracticeRoute.tsx (research R6, contract "Route `#/practice/:kind`"): read `kind` from `useParams`; if `kind !== 'practice'` (review added in T030) or `!selectCanPractice` → `<Navigate to="/" replace />`. `useEffect(() => { dispatch(startPracticeSession(kind)); return () => { dispatch(quitLesson()) } }, [kind, dispatch])`. Render nothing until the session exists with `kind === kind`; when `status === 'finished'` render `LessonSummary` with `heading="Practice complete!"`, `subtitle` "Practice" (`'Weak words'` for review), no `nextLessonTitle`, `replayLabel="Practise again"`, `onContinue` → `navigate('/')`, `onReplay` → `dispatch(startPracticeSession(kind))`; otherwise `<ExerciseScreen onQuit={() => navigate('/')} quitLabel="Quit practice" progressLabel="Practice progress" />`
- [X] T012 [US1] Add `{ path: '/practice/:kind', element: <PracticeRoute /> }` to src/router.tsx before the `*` route
- [X] T013 [US1] In src/components/LessonList.tsx add the practice row under the banner (contract S1): a `<div className={styles.practiceRow}>` with a **Practice** `button`. Available (`selectCanPractice`): `navigate('/practice/practice')` on click. Unavailable: `aria-disabled="true"`, click does nothing, `aria-describedby` an element `<p id="practice-hint">Finish a lesson to unlock practice.</p>` shown under the row. Leave room for the second button (T029). Styles in src/components/LessonList.module.css: flex row, `gap: 12px`, `flex-wrap: wrap`, each button `flex: 1 1 150px`, `min-height: 52px`, **Practice** uses `primary-button`; **Review weak words** uses `primary-button` plus a new `styles.outline` class in LessonList.module.css (background `var(--bg)`, border `2px solid var(--line)`, `border-bottom-width: 4px`, text `var(--primary-text)`); `[aria-disabled='true']` uses the muted locked-node colors (`var(--line)` background, `var(--text-muted)` text); hint in `var(--text-muted)` 15px. No horizontal scroll at 360 px
- [X] T014 [US1] Run `npm run lint` and `npm run build`; fix errors

### Tests for User Story 1

- [X] T015 [P] [US1] Create tests/unit/practice.test.ts for `availableKeys` and `pickPractice`: only keys of the given lessons; unknown ids ignored; empty list → `[]`; `pickPractice` returns `min(10, keys.length)` distinct keys, all from the input; two calls with different seeded `random` functions give different results; with fewer than 10 keys returns all of them. Add 20 runs with `Math.random` asserting SC-002 (all from completed lessons, no duplicates)
- [X] T016 [US1] Create tests/integration/practiceFlow.test.tsx (same `renderApp` pattern as tests/integration/lessonFlow.test.tsx; preload progress by writing a valid `duopona:progress` v1 value to `localStorage` before `makeStore()`, and clear `localStorage` in `beforeEach`). Find the current exercise via `selectCurrentExercise(store.getState())` (prompts are not unique across lessons). Cases:
  - no completed lesson: "Practice" has `aria-disabled="true"`, its description is "Finish a lesson to unlock practice.", clicking it stays on `/`; visiting `/practice/practice` redirects to `/`
  - lessons 1 and 2 completed: click Practice → first exercise shown, "Quit practice" button and "Practice progress" progressbar with max 10; every exercise played belongs to lesson 1 or 2 (check the session keys); answer one wrong, the rest right → summary heading "Practice complete!", text "Practice", "9 / 10"; the stored `duopona:progress` value and the lesson list labels are identical before and after (SC-005)
  - "Practise again" starts a new session of 10 ("1/10" shown)
  - Quit mid-session → back on `/`, `store.getState().session` is `null`, progress unchanged
  - `/practice/unknown` redirects to `/`
  Run `npm test` and `npm run lint`

### Validation for User Story 1

- [~] T017 [US1] With the user running the dev server, check quickstart P1 (Practice part), P3, P4, P9 and P10 in Chrome (360×740 where possible). Fix failures in T009–T013's files. Record each row's result under this task
  - **Won't do (owner decision 2026-11-03)**: remaining P9 (360 px) and P10 (offline) DevTools checks not run
  - **Partial (2026-11-03)**: Chrome against `npm run preview`, window 500×800 (Chrome's minimum width; DevTools device mode not available to the extension). The old service worker served the previous build until it was unregistered on localhost. P1 pass: both buttons muted, hint "Finish a lesson to unlock practice.", click does nothing. P3 pass: first exercise at once, "1/10". P4 pass for the session itself: missed exercise repeated at the end, "Practice complete!", "Practice", "9 / 10", Continue → home, progress unchanged. **Finding:** Review stayed muted after P4, because later first-try correct answers in the same session cleared the missed words (see T027). At 500 px both buttons are side by side, 80 px tall ("Review weak words" wraps to two lines), no horizontal scroll. Not run here: P9 at 360×740 and P10 offline (need DevTools); owner to check. P4 re-checked after the T027 change: Review becomes active after a session with a miss

**Checkpoint**: Practice is usable end to end (MVP); no word tracking yet

---

## Phase 4: User Story 2 - Words the learner gets wrong are remembered (Priority: P2)

**Goal**: Every first answer to an exercise, in lessons and practice, updates per-word mistake
counts that are saved under `duopona:words` v1

**Independent Test**: Miss a *kili* exercise in a lesson, reload, confirm *kili* is saved with
1 mistake; answer *kili* exercises right first time and confirm it is removed (quickstart P5,
P7, P8)

### Implementation for User Story 2

- [X] T018 [P] [US2] Create src/content/words.ts with `testedWords(exercise: Exercise): string[]` (research R1, FR-007): text = `exercise.prompt` when `direction === 'tp-en'`; else the answer (`exercise.answer` for multiple choice, `exercise.answer.join(' ')` for word bank). Lower-case, split on `/[^a-z]+/`, keep tokens that are own keys of `vocabulary` (src/content/vocabulary.ts, use `Object.hasOwn`), remove duplicates, keep first-seen order
- [X] T019 [P] [US2] Create src/store/wordsSlice.ts (data-model "Word record"): state `WordStats = { mistakes: Record<string, number> }` ("only counts ≥ 1 are kept"), `export const emptyWords = (): WordStats => ({ mistakes: {} })`; reducers `wordsMissed(PayloadAction<string[]>)`: each word +1; `wordsKnown(PayloadAction<string[]>)`: each word present −1, `delete` at 0, absent words unchanged; selector `selectWeakWords(state) = state.words.mistakes`
- [X] T020 [P] [US2] Add word storage to src/store/persistence.ts per contracts/words-storage.md: `export const WORDS_KEY = 'duopona:words'`, version 1; `loadWords(): WordStats` returns `emptyWords()` when the key is missing, JSON is invalid, `version !== 1`, `mistakes` is not a plain object, or any value is not an integer ≥ 1 (`Number.isInteger(v) && v >= 1`), or `localStorage` throws; `saveWords(words)` writes `{ version: 1, mistakes }` and ignores errors. Do not touch the progress functions
- [X] T021 [US2] In src/store/index.ts add `words: wordsReducer` to `rootReducer`, `words: loadWords()` to `preloadedState`, and in the subscription save `words` with `saveWords` when its object changes (separate `lastWords`, same pattern as progress)
- [X] T022 [US2] In src/store/lessonThunks.ts add `submitAndRecord(answer: string | string[])` (research R4): read `key = selectCurrentKey(state)` and `firstTry = !state.session.missedOnce.includes(key)` before dispatching `submitAnswer(answer)`; afterwards, if `firstTry` and the session is in `feedback` status, `words = testedWords(getExercise(key)!)`; if `words.length > 0` dispatch `wordsMissed(words)` when `feedback.correct` is false, else `wordsKnown(words)`. *(Changed 2026-11-03 after T027: `wordsKnown` leaves out words tested by any exercise already in `missedOnce`; covered by a new integration test.)* In src/components/ExerciseScreen.tsx dispatch `submitAndRecord(a)` instead of `submitAnswer(a)` for both exercise types
- [X] T023 [US2] Run `npm run lint` and `npm run build`; fix errors

### Tests for User Story 2

- [X] T024 [P] [US2] Create tests/unit/words.test.ts for `testedWords`: tp-en multiple choice uses the prompt (e.g. lesson "you-and-i" exercise `mi` → `['mi']`); en-tp multiple choice uses the answer (`lipu-sin` → `['lipu', 'sin']`); en-tp word bank uses the answer array (`mije-li-wawa` → `['mije', 'li', 'wawa']`); tp-en word bank uses the prompt (`kulupu-sina-li-wawa` → `['kulupu', 'sina', 'li', 'wawa']`); punctuation and capitals ignored; repeated words returned once; English-only text → `[]`. Add a course-wide check: every exercise of every lesson yields at least one word
- [X] T025 [P] [US2] Create tests/unit/wordsSlice.test.ts (miss +1, two misses = 2, known −1, removal at 0, known on an absent word leaves it absent, never negative; SC-004: miss then known → not weak) and extend tests/unit/persistence.test.ts with word storage: round trip; each invalid case in the contract's read table reads as empty; a garbage `duopona:words` leaves `loadProgress()` intact and a garbage `duopona:progress` leaves `loadWords()` intact (SC-006); `setItem` throwing is ignored
- [X] T026 [US2] Add a `describe('word records (006 US2)')` to tests/integration/practiceFlow.test.tsx:
  - in lesson 1, answer the first exercise wrong, then right on retry → its `testedWords` each have 1 in `store.getState().words.mistakes` (not 2) and `duopona:words` in `localStorage` holds the same
  - a first-try correct answer on an exercise testing a weak word (preload `duopona:words` with that word at 1) removes it
  - quit a lesson after one wrong answer → the mistake is kept (US2 scenario 4)
  - a new store made after the above (`makeStore()` again) loads the same mistakes (reload)
  - the same recording happens in a practice session
  Run `npm test` and `npm run lint`

### Validation for User Story 2

- [X] T027 [US2] With the user running the dev server, check quickstart P5, P7 and P8 in Chrome (inspect `duopona:words` in DevTools → Application). Record each row's result under this task
  - **Result (2026-11-03)**: P5: `duopona:words` saved as `{"version":1,"mistakes":{…}}`, works as specified; but a miss on *ijo li lipu* was cleared within the same 10-exercise session by first-try correct answers on *lipu*, *That is an animal.* (li) and *ni li ijo* (ijo), leaving `{}`. Matches FR-009 but makes a single miss rarely survive a session; **Owner decision (2026-11-03): mistakes are only cleared in a later session**; T022 changed, new integration test (fails under the old rule), spec FR-009/SC-004 updated. Re-check after rebuild: missed *That is an animal.* (ni, li, soweli +1), then *ijo li lipu* right → li stays 1; back home Review active. P7 pass: one wrong (*ni li meli* → ni, li, meli +1), one right (*ijo li kili* → li −1), quit → records `{ni:1, meli:1}` kept, progress unchanged. P8 pass: `garbage` → app loads, Review muted, progress intact

**Checkpoint**: Mistakes are tracked and saved everywhere; no review button yet

---

## Phase 5: User Story 3 - Review weak words (Priority: P3)

**Goal**: A separate "Review weak words" button plays 10 exercises chosen from the most-missed
words, available only when there is something to review

**Independent Test**: With weak words saved and several lessons completed, start the review;
every exercise contains a weak word (when ≥ 10 exist), the most-missed words are included, and
answering them right first time makes the review unavailable (quickstart P2, P6)

### Implementation for User Story 3

- [X] T028 [US3] Add `pickReview(keys: readonly string[], mistakes: Record<string, number>, random = Math.random): string[]` to src/lib/practice.ts (research R3): (1) for each key compute `testedWords(getExercise(key)!)`; weak words = words with `mistakes[w] >= 1` that appear in at least one key, ordered by count descending, ties random (shuffle with `random` then stable sort); (2) first round: for each weak word in order, add one random not-yet-chosen key that tests it, until `SESSION_SIZE`; (3) then add the remaining keys that test any weak word, in random order, until `SESSION_SIZE`; (4) then fill with random other keys until `SESSION_SIZE` or none left; (5) return `shuffle(chosen, random)`. Also add `hasReviewable(keys, mistakes): boolean` = some key tests a word with `mistakes[w] >= 1`
- [X] T029 [US3] Wire review into the store: in src/store/lessonThunks.ts make `startPracticeSession('review')` dispatch `startPractice({ kind: 'review', keys: pickReview(keys, state.words.mistakes) })`; add `selectCanReview(state)` to src/store/wordsSlice.ts = `hasReviewable(availableKeys(Object.keys(state.progress.completedLessons)), state.words.mistakes)` (FR-013)
- [X] T030 [US3] In src/routes/PracticeRoute.tsx accept `kind === 'review'` (redirect to `/` when `!selectCanReview`); subtitle "Weak words"; "Practise again" for review: when `selectCanReview` is now false, `navigate('/')` instead of starting a session (contract S5). Check availability **only before this route has started a session** (route-local `started` flag, set when `startPracticeSession` is dispatched). Once started, never redirect: neither mid-session, when a correct first answer may remove the last weak word, nor on the summary
- [X] T031 [US3] In src/components/LessonList.tsx add the **Review weak words** `button` next to Practice (contract S1): available → `navigate('/practice/review')`; unavailable → `aria-disabled="true"`, no action, `aria-describedby` the hint. Hint text: "Finish a lesson to unlock practice." when practice is unavailable, otherwise "No weak words yet." when review is unavailable, otherwise no hint; both unavailable buttons point to the same hint element
- [X] T032 [US3] Run `npm run lint` and `npm run build`; fix errors

### Tests for User Story 3

- [X] T033 [P] [US3] Extend tests/unit/practice.test.ts for `pickReview` and `hasReviewable` (fixed `random`): no weak words → behaves like random fill (10 distinct keys); ≥ 10 keys with weak words → every pick tests a weak word (SC-003); with places for one word only (use 10 keys all testing word A count 3 and others testing B count 1, plus a constructed case where the first round decides), the higher-count word is included (US3 scenario 3); fewer weak-word keys than 10 → all of them included plus random fill, no duplicates; weak words not in any key are ignored; result length `min(10, keys.length)`; `hasReviewable` true/false cases; two different seeded `random` functions give a different `pickReview` result for the same input (FR-015)
- [X] T034 [US3] Add a `describe('review weak words (006 US3)')` to tests/integration/practiceFlow.test.tsx:
  - lesson 1 completed, no mistakes: "Review weak words" `aria-disabled="true"`, description "No weak words yet."; `/practice/review` redirects to `/`
  - preload a weak word from lesson 1: button enabled; review session shows "Quit practice"; every exercise in the first pass tests a weak word or, once those run out, comes from a completed lesson; answering all right first time → summary "Practice complete!" with "Weak words"; back home the button is `aria-disabled` again when no weak words remain
  - "Practise again" with no weak words left goes to `/`
  - preload exactly one weak word that appears in only one completed-lesson exercise; start the review and answer that exercise right first time: the session continues to the summary with no redirect, and back home the button is `aria-disabled`
  Run `npm test` and `npm run lint`

### Validation for User Story 3

- [X] T035 [US3] With the user running the dev server, check quickstart P1 (Review part), P2 and P6 in Chrome. Record each row's result under this task
  - **Result (2026-11-03)**: P2 pass: lesson 1 done, no mistakes → Practice active, Review muted, hint "No weak words yet.". P6 pass: with {ni:1, meli:1} the review opened on the *meli* and *ni* exercises, all from lesson 1; both cleared mid-session with no redirect; summary "Practice complete!", "Weak words", "10 / 10"; Practise again → home with Review muted. Owner's original localhost data was restored afterwards

**Checkpoint**: All three stories work and are tested

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T036 [P] Update README.md: mention Practice and Review weak words among the features, and the second `localStorage` key `duopona:words` wherever saved data is described
- [X] T037 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa` all pass; record the test count (vs T001's baseline) under this task
  - **Result (2026-11-03)**: `npm test` 498 passed (baseline 444, +54; re-run after the T027 change), lint clean, build OK (precache 12 entries, 486.42 KiB, unchanged count), `npm run test:pwa` 26 passed
- [~] T038 Ask the user to run quickstart P-D1 on an iPhone (Safari) and an Android phone (Chrome), in the browser and installed, ideally together with 003's open T014–T021 and 004's T027/T030. Record device, OS/browser versions and results under this task; fix failures in the files of T013/T031 and re-run T037
  - **Won't do (owner decision 2026-11-03)**: remaining phone check P-D1 on iPhone and Android not run
- [X] T039 Set spec.md **Status** to `Implemented` (or `Implemented (pending: …)` naming open manual checks); update ROADMAP.md: move "Practice session & review weak words" to **Done** as `**006 – Practice & weak words**: Practice and Review weak words buttons, per-word mistake tracking (\`specs/006-practice-weak-words/\`).` only when T017, T027, T035 and T038 are recorded, otherwise update its status line with what remains
  - **Result (2026-11-03)**: spec status `Implemented`; open manual checks (T017 P9/P10, T038) closed as won't do by the owner; ROADMAP moved to Done

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: first
- **Foundational (Phase 2)**: after T001; blocks all stories. T002 → T003 → T004; T005 and T006 in parallel with T002–T004; T007 → T008 last
- **US1 (Phase 3)**: after Phase 2
- **US2 (Phase 4)**: after Phase 2. Independent of US1 except T026's practice-session case (needs US1) and T022 editing src/store/lessonThunks.ts after T010
- **US3 (Phase 5)**: after US1 (route, practice.ts, button row) and US2 (word records)
- **Polish (Phase 6)**: after all stories; T038 needs the user and real phones

### Within Each Story

- Implementation → lint/build → tests (Constitution IV: tests after code) → manual validation
- Tasks on the same file run in order: src/store/lessonThunks.ts (T004 → T010 → T022 → T029), src/lib/practice.ts (T009 → T028), src/components/LessonList.tsx (T013 → T031), src/routes/PracticeRoute.tsx (T011 → T030), tests/integration/practiceFlow.test.tsx (T016 → T026 → T034)

### Parallel Opportunities

- Phase 2: T005 (ExerciseScreen) and T006 (LessonSummary) alongside T002–T004
- US1: T009 (practice.ts) alongside T010's selector work; T015 alongside T016
- US2: T018 (words.ts), T019 (wordsSlice.ts), T020 (persistence.ts) together; T024 and T025 together
- US2 implementation (T018–T021) can run alongside US1 (different files)
- T036 (README) any time after T031

---

## Parallel Example: User Story 2

```text
Task: "T018 Create src/content/words.ts with testedWords()"
Task: "T019 Create src/store/wordsSlice.ts"
Task: "T020 Add loadWords/saveWords to src/store/persistence.ts"
```

## Parallel Example: Tests

```text
Task: "T024 Create tests/unit/words.test.ts"
Task: "T025 Create tests/unit/wordsSlice.test.ts and extend tests/unit/persistence.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 + Phase 2: keyed sessions, label props, lessons unchanged
2. Phase 3 (US1): Practice button, route, summary
3. **STOP and VALIDATE**: T017; practice is shippable on its own

### Incremental Delivery

1. Setup + Foundational → no visible change, lessons still pass their tests
2. US1 → Practice (MVP)
3. US2 → mistakes tracked and saved (no new UI)
4. US3 → Review weak words button
5. Polish → README, final gate, phones (with 003/004's open checks)

---

## Notes

- Never write to `duopona:progress` from practice or review (FR-005)
- Keep every interactive target ≥ 44×44 px and no horizontal scroll at 360 px
- Commit after each phase or logical group
