---

description: "Task list for First Lesson Flow"
---

# Tasks: First Lesson Flow

**Input**: Design documents from `/specs/001-first-lesson-flow/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included. Per Constitution Principle IV, tests are written **after** the
implementation within each story, and a story is not done until its tests pass.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested
independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1, US2)
- Paths are relative to the repository root (single frontend project, see plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and tooling

- [X] T001 Create `package.json` (name `duopona`, `"type": "module"`, `"private": true`) with scripts `dev: vite`, `build: tsc -b && vite build`, `preview: vite preview`, `test: vitest run`, `test:watch: vitest`, `lint: eslint .`; install runtime deps `react`, `react-dom`, `@reduxjs/toolkit`, `react-redux`, `react-router` (v7) and dev deps `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- [X] T002 Create `tsconfig.json` with `"strict": true`, `"target": "ES2022"`, `"jsx": "react-jsx"`, `"moduleResolution": "bundler"`, `"types": ["vitest/globals", "@testing-library/jest-dom"]`, including `src` and `tests`
- [X] T003 Create `vite.config.ts` with the React plugin and a `test` block: `environment: "jsdom"`, `globals: true`, `setupFiles: ["tests/setup.ts"]`
- [X] T004 [P] Create `tests/setup.ts` importing `@testing-library/jest-dom/vitest` and clearing `localStorage` in `afterEach`
- [X] T005 [P] Create `index.html` (title "Duopona", `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<div id="root">`, module script `/src/main.tsx`) and `src/index.css` with mobile-first base styles (system font, max content width 600px centered, usable at 360px width)
- [X] T006 [P] Create `.gitignore` containing `node_modules/`, `dist/`, `coverage/`, `*.local`
- [X] T007 [P] Configure ESLint flat config in `eslint.config.js` using `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks` (add as dev deps)

**Checkpoint**: `npm run build` and `npm test` (no tests yet, passes with `--passWithNoTests` or empty) run without config errors

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Content types, lesson data, store, and routing shell that both stories need

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 [P] Define content types in `src/content/types.ts` per data-model.md: `Lesson { id: string; title: string; exercises: Exercise[] }`; `MultipleChoiceExercise { id; type: "multipleChoice"; prompt; direction: "tp-en" | "en-tp"; options: string[]; answer: string }`; `WordBankExercise { id; type: "wordBank"; prompt; direction: "tp-en" | "en-tp"; answer: string[]; distractors: string[] }`; `Exercise = MultipleChoiceExercise | WordBankExercise`
- [X] T009 [P] Write the "Basic Words" lesson in `src/content/lessons.ts` (export `lessons: Lesson[]` and `getLesson(id): Lesson | undefined`), id `"basics-1"`, title `"Basic Words"`, these exercises in this order:
  1. MC tp-en `jan` → `person`; options `person, water, food, bad`
  2. MC tp-en `pona` → `good`; options `good, bad, you, water`
  3. MC en-tp `water` → `telo`; options `telo, moku, jan, ike`
  4. MC tp-en `sina` → `you`; options `you, I / me, person, food`
  5. WB en-tp `I am good` → `["mi","pona"]`; distractors `["sina","ike"]`
  6. MC en-tp `food / to eat` → `moku`; options `moku, telo, toki, ona`
  7. MC tp-en `ike` → `bad`; options `bad, good, language, person`
  8. MC en-tp `hello / language` → `toki`; options `toki, pona, sina, telo`
  9. MC tp-en `ona` → `he / she / it`; options `he / she / it, you, I / me, water`
  10. WB tp-en `sina pona` → `["you","are","good"]`; distractors `["bad","I"]`
  11. WB en-tp `The person is good` → `["jan","li","pona"]`; distractors `["mi","telo"]`
  Rules from data-model.md: "options: 3–4 items, no duplicates", "answer MUST be one of options", "distractors: none may make an alternative correct answer"
- [X] T010 [P] Implement `shuffle<T>(items: T[], random: () => number = Math.random): T[]` (Fisher–Yates, returns a new array) in `src/lib/shuffle.ts`
- [X] T011 Create the store in `src/store/index.ts`: `makeStore()` using `configureStore` with an (initially empty) reducer map, export `AppStore`, `RootState`, `AppDispatch`, and typed hooks `useAppDispatch` / `useAppSelector` in `src/store/hooks.ts`
- [X] T012 Create the hash router in `src/router.tsx` with `createHashRouter`: route `/` → `HomeRoute`, route `/lesson/:lessonId` → `LessonRoute`, catch-all `*` → `<Navigate to="/" replace />`; create placeholder `src/routes/HomeRoute.tsx` and `src/routes/LessonRoute.tsx`
- [X] T013 Create `src/main.tsx`: import `index.css`, create the store with `makeStore()`, render `<Provider store><RouterProvider router /></Provider>` into `#root`
- [X] T014 [P] Unit test `shuffle` (same items, new array, deterministic with a seeded/fixed `random`) in `tests/unit/shuffle.test.ts`
- [X] T015 [P] Unit test lesson content integrity in `tests/unit/lessons.test.ts`: unique exercise ids; every MC has 3–4 unique options containing `answer`; every WB answer non-empty and no distractor appears in `answer` (SC-005)

**Checkpoint**: `npm run dev` shows the placeholder home route; `#/anything` redirects to `#/`; tests pass

---

## Phase 3: User Story 1 - Complete the first lesson (Priority: P1) 🎯 MVP

**Goal**: Learner picks "Basic Words", answers multiple-choice and word-bank exercises with immediate right/wrong feedback, missed exercises repeat at the end, and a summary is shown.

**Independent Test**: Open the app, start the lesson, answer every exercise (some wrong), confirm feedback after each answer, that missed ones come back, and the summary at the end.

### Implementation for User Story 1

- [X] T016 [US1] Implement `src/store/sessionSlice.ts` per data-model.md "LessonSession" and "State transitions": state `LessonSession | null` with `lessonId`, `queue: string[]`, `missedOnce: string[]`, `feedback: null | { correct: boolean; correctAnswer: string }`, `status: "answering" | "feedback" | "finished"`. Actions: `startLesson(lessonId)` (queue = all exercise ids in order, using `getLesson`); `submitAnswer(answer: string | string[])` (MC: equals `answer`; WB: same length and every word equal case-insensitively, order matters; wrong → add id to `missedOnce` once and move head to end of queue; correct → mark head for removal; `correctAnswer` for WB is `answer.join(" ")`; status → `"feedback"`); `continueLesson()` (remove head if last answer correct; status → `"finished"` if queue empty else `"answering"`; clear feedback); `quitLesson()` (state → null). Export selectors `selectCurrentExercise`, `selectPosition` (`{ done: total − queue.length, total }`), `selectFirstTryCorrect` (`total − missedOnce.length`). Register it in `src/store/index.ts`
- [X] T017 [P] [US1] Implement `src/components/MultipleChoice.tsx` (+ `.module.css`): props `exercise`, `disabled`, `onSubmit(answer: string)`; shows instruction "Select the correct meaning" (tp-en) or "Select the Toki Pona word" (en-tp); options shuffled once per exercise via `shuffle` (memoized on exercise id); options as buttons with `aria-pressed`; "Check" button disabled until one is selected
- [X] T018 [P] [US1] Implement `src/components/WordBank.tsx` (+ `.module.css`): props `exercise`, `disabled`, `onSubmit(answer: string[])`; instruction "Translate this sentence"; tiles = `answer` + `distractors` shuffled once per exercise; tapping a bank tile appends it to the answer line, tapping an answer-line tile returns it to the bank; "Check" disabled until at least one tile is placed
- [X] T019 [P] [US1] Implement `src/components/FeedbackBanner.tsx` (+ `.module.css`): `role="status"`; text "Correct!" or "Wrong — correct answer: {correctAnswer}"; "Continue" button calling `onContinue`
- [X] T020 [P] [US1] Implement `src/components/LessonSummary.tsx`: heading "Lesson complete!", text "You got {firstTryCorrect} of {total} right on the first try.", "Back to lessons" button calling `onBack`
- [X] T021 [US1] Implement `src/components/ExerciseScreen.tsx` (+ `.module.css`): reads session via selectors; shows "{done + 1} of {total}" and a `<progress>` bar (FR-007); "Quit" button calling `onQuit`; renders `MultipleChoice` or `WordBank` keyed by exercise id + queue position (so retries reset local UI state); inputs disabled while `status === "feedback"`; shows `FeedbackBanner` on feedback; dispatches `submitAnswer` / `continueLesson`
- [X] T022 [US1] Implement `src/components/LessonList.tsx` (+ `.module.css`): heading "Duopona"; one card per lesson in `lessons` (only "Basic Words") as a `<Link to="/lesson/{id}">`; wire into `src/routes/HomeRoute.tsx`
- [X] T023 [US1] Implement `src/routes/LessonRoute.tsx`: read `lessonId` param; if `getLesson` returns undefined render `<Navigate to="/" replace />`; on mount dispatch `startLesson(lessonId)` and on unmount dispatch `quitLesson()` (useEffect cleanup — covers Quit, Back button, and navigation, FR-013); render `ExerciseScreen` while answering/feedback, `LessonSummary` when finished; Quit and "Back to lessons" call `navigate("/")`
- [X] T024 [P] [US1] Unit test `sessionSlice` in `tests/unit/sessionSlice.test.ts`: start sets queue in order; correct MC answer → feedback correct, continue removes head; wrong answer → `missedOnce` contains id once, exercise moved to end, `correctAnswer` set; WB wrong order is wrong, case-insensitive match is right; lesson finishes only when queue empty (FR-015); `selectFirstTryCorrect` correct after mixed answers; `quitLesson` resets to null
- [X] T025 [US1] Integration test the UI flow in `tests/integration/lessonFlow.test.tsx` (render with `makeStore()` + `createMemoryRouter` using the same routes): lesson list shows only "Basic Words"; start lesson shows "1 of 11"; Check disabled before answering; correct MC → "Correct!"; wrong MC → "Wrong — correct answer: …"; word-bank tile add/remove/submit; a missed exercise reappears before the summary; summary shows first-try count; Quit returns to list; unknown `/lesson/nope` redirects to list

**Checkpoint**: User Story 1 fully playable via `npm run dev` and its tests pass — this is the MVP

---

## Phase 4: User Story 2 - Progress survives a reload (Priority: P2)

**Goal**: Completing a lesson marks it completed (with latest score) on the lesson list, and this survives page reloads and browser restarts.

**Independent Test**: Complete the lesson, reload, and confirm the lesson is still shown as completed; corrupted saved data loads as empty progress.

### Implementation for User Story 2

- [X] T026 [P] [US2] Implement `src/store/progressSlice.ts` per data-model.md "LearnerProgress": state `{ completedLessons: Record<string, { firstTryCorrect: number; total: number; completedAt: string }> }`; action `completeLesson({ lessonId, firstTryCorrect, total, completedAt })` overwrites any previous result ("Re-completing a lesson overwrites its LessonResult"); selector `selectLessonResult(lessonId)`
- [X] T027 [P] [US2] Implement `src/store/persistence.ts` per contracts/progress-storage.md: key `"duopona:progress"`; `loadProgress()` returns empty progress when key missing, invalid JSON, `version !== 1`, wrong shape, or `localStorage` throws; `saveProgress(progress)` writes `{ version: 1, completedLessons }` and swallows any error
- [X] T028 [US2] Wire persistence in `src/store/index.ts`: register `progress` reducer; `makeStore()` uses `loadProgress()` as `preloadedState.progress`; `store.subscribe` saves only when the `progress` state reference changes
- [X] T029 [US2] Record completion: in `src/store/sessionSlice.ts` (or a thunk in `src/store/lessonThunks.ts`) make continuing from the last exercise dispatch `completeLesson` with `firstTryCorrect`, `total`, and `new Date().toISOString()` when status becomes `"finished"` (FR-009); update `ExerciseScreen` to dispatch it
- [X] T030 [US2] Show completion on the lesson card in `src/components/LessonList.tsx`: "Completed" badge and latest score "{firstTryCorrect}/{total}" when a result exists (FR-010)
- [X] T031 [P] [US2] Unit test `progressSlice` in `tests/unit/progressSlice.test.ts`: completing adds result; re-completing overwrites
- [X] T032 [P] [US2] Unit test persistence in `tests/unit/persistence.test.ts`: every row of the "Read rules" table in contracts/progress-storage.md, plus save writes version 1 and a throwing `setItem` does not throw
- [X] T033 [US2] Extend `tests/integration/lessonFlow.test.tsx`: complete the lesson, back to list shows "Completed" + score; simulate reload by creating a new store with `makeStore()` and re-rendering → still completed (SC-004); quitting mid-lesson does not mark completed; garbage in `localStorage["duopona:progress"]` → app renders with no progress (FR-012)

**Checkpoint**: Both stories work and all tests pass

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T034 [P] Add a short `README.md`: what Duopona is, `npm install`, `npm run dev`, `npm test`, `npm run build`
- [X] T035 [P] Check layout at 360px width and keyboard use (Tab to options/tiles, Enter/Space to select, visible focus) in `src/components/*.module.css`; fix issues
- [X] T036 Run `npm run lint`, `npm test`, `npm run build`; fix all errors in `src/` and `tests/`
- [X] T037 Walk through every manual scenario in `specs/001-first-lesson-flow/quickstart.md` and confirm expected results

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none
- **Foundational (Phase 2)**: depends on Setup — blocks both stories
- **US1 (Phase 3)**: depends on Foundational
- **US2 (Phase 4)**: depends on Foundational; T029 and T033 also depend on US1 (completion happens at the end of the lesson flow). T026, T027, T031, T032 can start as soon as Foundational is done
- **Polish (Phase 5)**: after the desired stories are complete

### Within Each Story

- Implementation first, then tests (Constitution Principle IV), story is done when tests pass
- Slice → components → route wiring → tests

### Parallel Opportunities

- Setup: T004, T005, T006, T007 together (after T001–T003)
- Foundational: T008, T009, T010 together; then T014, T015 together
- US1: after T016, T017–T020 together; T024 can run alongside T021–T023
- US2: T026 and T027 together; T031 and T032 together

## Parallel Example: User Story 1

```text
# After T016 (sessionSlice) is done, build the leaf components together:
T017 MultipleChoice.tsx
T018 WordBank.tsx
T019 FeedbackBanner.tsx
T020 LessonSummary.tsx
```

## Parallel Example: User Story 2

```text
T026 progressSlice.ts
T027 persistence.ts
# then
T031 progressSlice.test.ts
T032 persistence.test.ts
```

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 Setup → Phase 2 Foundational
2. Phase 3 (US1) → **stop and validate**: the lesson is fully playable
3. Commit / demo

### Incremental Delivery

1. MVP (US1) → playable lesson
2. US2 → saved progress and completed badge
3. Polish → README, accessibility check, final validation

---

## Phase 6: Convergence

- [X] T038 CRITICAL: Render the exercise prompt as a heading (`<h2>`) in `src/components/MultipleChoice.tsx` and `src/components/WordBank.tsx`, and replace the CSS-class selector `[class*="prompt"]` in `tests/integration/lessonFlow.test.tsx` with a role-based query (`getByRole('heading', { level: 2 })`) so tests target behavior, not implementation details, per Constitution IV (contradicts)
- [X] T039 Update the "State transitions" section of `specs/001-first-lesson-flow/data-model.md` to say a missed exercise is moved to the end of the queue on `continue` (not on `submit`), matching `src/store/sessionSlice.ts`, per T016 (partial)
