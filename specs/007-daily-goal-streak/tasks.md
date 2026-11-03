---

description: "Task list for feature 007: Daily Goal and Streak"
---

# Tasks: Daily Goal and Streak

**Input**: Design documents from `/specs/007-daily-goal-streak/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R7), data-model.md,
contracts/ui-screens.md (U1–U3), contracts/streak-storage.md, quickstart.md (S1–S9, S-D1)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. Phone behavior is validated manually (IV exception) with
quickstart S-D1, results recorded under the matching task.

**Organization**: Tasks are grouped by user story: US1 (P1, streak of practice days), US2 (P2,
daily goal progress and summary announcement). Both need the foundational streak record and
its recording on session finish.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1, US2)

## Path Conventions

Single frontend project: `src/`, `tests/` at the repository root. Run commands from the
repository root.

## Environment notes (read before any task)

- **npm in the sandbox**: prefix `npm`/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`
  (`~/.npm` is read-only). No new packages are needed.
- **Dev/preview server**: a server started from the sandbox is not reachable from Chrome. Ask
  the user to run `npm run dev` (http://localhost:5173) or `npm run build && npm run preview`
  (http://localhost:4173) themselves, then drive Chrome against it.
- **Days**: always `YYYY-MM-DD` strings of the **local** date (research R1). Never use
  `toISOString()` for days. Reducers and selectors receive the day as an argument; only the
  thunk and components call `today()`.
- **Dates in tests**: `vi.useFakeTimers({ toFake: ['Date'] })` + `vi.setSystemTime(new Date(2026, 10, 3, 12))`
  (fake only `Date`, so React/RTL timers keep working); `vi.useRealTimers()` in `afterEach`.
- **Do not change** `duopona:progress` or `duopona:words` or their read/write functions'
  behaviour (`src/store/persistence.ts`); tests/setup.ts already clears `localStorage` per test.

---

## Phase 1: Setup

- [ ] T001 On branch `007-daily-goal-streak` (already created from `main`), run `npm test` and `npm run lint` and record the passing test count under this task as the baseline

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The streak record, its storage, and recording the goal when any session finishes.
No visible change yet.

- [ ] T002 [P] Create src/lib/days.ts (research R1): `export function today(now: Date = new Date()): string` returning the local date as `YYYY-MM-DD` (`getFullYear()`, `getMonth() + 1`, `getDate()`, month/day zero-padded to 2 digits); `export function dayBefore(day: string): string` that parses `y-m-d`, builds `new Date(y, m - 1, d - 1)` and returns `today(thatDate)`; `export const DAILY_GOAL = 1` with a comment "finished sessions per day (FR-010)"
- [ ] T003 Create src/store/streakSlice.ts (data-model "Streak record"), importing `dayBefore` from src/lib/days.ts:
  - `export interface StreakRecord { lastDay: string | null; current: number; best: number }` with doc comments: `lastDay` "Last day the daily goal was met; null = never", `current` "Streak length on lastDay; 0 only when lastDay is null", `best` "Longest streak ever reached (FR-007)"
  - `export const emptyStreak = (): StreakRecord => ({ lastDay: null, current: 0, best: 0 })`
  - reducer `goalMet(state, action: PayloadAction<string>)` implementing the data-model transition table exactly: `lastDay === null` → `lastDay = day, current = 1`; `lastDay === dayBefore(day)` → `lastDay = day, current += 1`; `lastDay < dayBefore(day)` → `lastDay = day, current = 1`; `lastDay >= day` → unchanged (return without touching state); after a change `best = Math.max(best, current)`
  - selectors on `{ streak: StreakRecord }`: `selectMetToday(day)` → `lastDay !== null && lastDay >= day`; `selectStreak(day)` → `lastDay !== null && lastDay >= dayBefore(day) ? current : 0`; `selectBestStreak` → `best`. Selector factories take the day (like `selectIsUnlocked(lessonId)` in progressSlice)
- [ ] T004 [P] Add streak storage to src/store/persistence.ts per contracts/streak-storage.md: `export const STREAK_KEY = 'duopona:streak'`, `const STREAK_VERSION = 1`; `loadStreak(): StreakRecord` returning `emptyStreak()` for: key missing, invalid JSON, non-object, `version !== 1`, `lastDay` neither `null` nor a string matching `/^\d{4}-\d{2}-\d{2}$/`, `current` or `best` not an integer ≥ 0, `best < current`, `current === 0` with a non-null `lastDay`, `current > 0` with `lastDay === null`, or `localStorage` throwing; valid → `{ lastDay, current, best }`. `saveStreak(streak)` writes `{ version: 1, lastDay, current, best }`, catching and ignoring errors (same style as `saveWords`). Depends on T003 for the type
- [ ] T005 Wire the slice into src/store/index.ts: add `streak: streakReducer` to `combineReducers`, `streak: loadStreak()` to `preloadedState`, and a `lastStreak` change check in the existing `store.subscribe` that calls `saveStreak` (same pattern as words); update the `makeStore` doc comment to mention the streak
- [ ] T006 [P] In src/store/sessionSlice.ts add `goalMet: boolean` to `LessonSession` (doc comment: "This session's finish met today's daily goal (007 research R5); not saved"), `goalMet: false` in `newSession`, and reducer `markGoalMet(state)` that sets `state.goalMet = true` only when `state?.status === 'finished'`; export it
- [ ] T007 In src/store/lessonThunks.ts `continueAndRecord` (research R5): after `dispatch(continueLesson())`, when `session?.status === 'finished'` for **any** kind (keep the existing lesson-only `completeLesson` branch as is): `const day = today()`; `const metBefore = selectMetToday(day)(getState())`; `dispatch(goalMet(day))`; `if (!metBefore) dispatch(markGoalMet())`. Update the function's doc comment (FR-001: only finished sessions count; quitting never reaches `finished`)
- [ ] T008 Run `npm run lint` and `npm run build`; then `npm test`: existing suites must pass unchanged (no UI change yet)

**Checkpoint**: Finishing any session updates `duopona:streak`; nothing visible changed

---

## Phase 3: User Story 1 - Streak of practice days (Priority: P1) 🎯 MVP

**Goal**: The home screen top bar shows the streak, distinguishing practised today from not
yet (FR-005, FR-006).

**Independent Test**: With the date set to successive days, finish one session per day for
three days → counter 1, 2, 3; skip a day → 0, then 1 after the next finished session.

### Implementation for User Story 1

- [ ] T009 [P] [US1] Add `FlameIcon` to src/components/icons.tsx: inline SVG flame using `currentColor`, same `IconProps`/`size` pattern and `aria-hidden` as `BubbleIcon`
- [ ] T010 [P] [US1] Add a `--streak` colour token next to `--gold` in src/index.css (research R6: orange, start from `#ff9600`; check contrast ≥ 4.5:1 against `--bg` `#131f24` and ≥ 3:1 for the icon; adjust if needed and note the final value in research.md R6)
- [ ] T011 [US1] In src/components/LessonList.tsx top bar (contract U1): compute `const day = today()`, `streak = useAppSelector(selectStreak(day))`, `metToday = useAppSelector(selectMetToday(day))`; wrap the existing counter and a new streak counter in one flex group on the right; the streak counter is a `<p>` with `FlameIcon` (size 26) + `streak`, class `counter` plus a `streakMet`/`streakIdle` modifier, and `aria-label` exactly `` `${streak} day streak, practised today` `` or `` `${streak} day streak, not practised today` `` (singular "day" also for 1 — the label reads "1 day streak"); not interactive
- [ ] T012 [US1] Styles in src/components/LessonList.module.css: right-hand counter group (`display: flex; gap: 16px`), `.streakMet svg { color: var(--streak) }`, `.streakIdle { color: var(--text-muted) }` and `.streakIdle svg { color: var(--icon-muted) }`; at 360 px the wordmark and both counters stay on one line (reduce gaps before font sizes)
- [ ] T013 [US1] Run `npm run lint`, `npm run build`, `npm test`; fix any existing test that queried the top bar by text and now matches two counters

### Tests for User Story 1

- [ ] T014 [P] [US1] Create tests/unit/days.test.ts: `today()` zero-pads (`2026-01-05`), uses local date late in the evening (`new Date(2026, 10, 3, 23, 59)` → `2026-11-03`); `dayBefore` across month end (`2026-03-01` → `2026-02-28`), leap day (`2028-03-01` → `2028-02-29`), year end (`2027-01-01` → `2026-12-31`), and the DST change days in March and October (result is the previous calendar day)
- [ ] T015 [P] [US1] Create tests/unit/streakSlice.test.ts: every row of the data-model transition table; `best` follows `current` and never drops; same-day repeat unchanged; clock backwards (`goalMet('2026-11-02')` after `lastDay` `2026-11-03`) unchanged; selectors: shown streak kept on "yesterday", 0 after a missed day, `metToday` true for same day and for a `lastDay` later than `day`. **SC-003**: simulate 40 days from a seeded list of "practised"/"skipped"/"clock back one day" events, dispatching `goalMet` on practised days, and after each day compare `selectStreak(day)` with a reference count computed independently from the list of practised days
- [ ] T016 [P] [US1] Extend tests/unit/persistence.test.ts with streak storage: round trip through `saveStreak`/`loadStreak`; each invalid case from contracts/streak-storage.md read rules → `emptyStreak()`; `localStorage.getItem` throwing → empty; `garbage` in `duopona:streak` leaves `loadProgress()` and `loadWords()` results intact, and garbage in those leaves `loadStreak()` intact (SC-005)
- [ ] T017 [P] [US1] Extend tests/unit/sessionSlice.test.ts: `goalMet` is `false` after `startLesson` and `startPractice`; `markGoalMet` sets it only on a finished session
- [ ] T018 [US1] Create tests/integration/streakFlow.test.tsx (render with `makeStore` and the router like tests/integration/practiceFlow.test.tsx; fake `Date` per Environment notes): fresh learner → label "0 day streak, not practised today"; finish lesson 1 and return home → "1 day streak, practised today"; set system time to the next day and remount → "1 day streak, not practised today"; finish a practice session (seed completed lessons as in practiceFlow) → "2 day streak, practised today"; set time two days later and remount → "0 day streak, not practised today"; starting and quitting a lesson counts nothing; lesson progress (`duopona:progress`) and words (`duopona:words`) unchanged by streak updates apart from what the sessions themselves record (FR-014)

### Validation for User Story 1

- [ ] T019 [US1] Manual check in Chrome with the user running `npm run dev`: quickstart S1, S5, S6, S7 (top-bar part) at 360×740; record results under this task

**Checkpoint**: Streak visible and correct; MVP shippable

---

## Phase 4: User Story 2 - Daily goal progress (Priority: P2)

**Goal**: Home shows today's goal (0 / 1 or done) and best streak; the summary of the session
that met the goal says so and shows the streak (FR-007 to FR-009).

**Independent Test**: On a new day, finish a session → summary shows "Daily goal met" and
Streak; home shows "Done for today"; a second session the same day shows a plain summary;
next day the card is back to "0 / 1 session today".

### Implementation for User Story 2

- [ ] T020 [US2] Add the daily-goal card to src/components/LessonList.tsx between the banner and the practice row (contract U2): label `Daily goal` (class `label`); text `0 / 1 session today` when not met, `Done for today` when met (use `DAILY_GOAL` from src/lib/days.ts for the "1"); a progress bar `<div role="progressbar" aria-label="Daily goal" aria-valuemin={0} aria-valuemax={1} aria-valuenow={metToday ? 1 : 0}>` with an inner fill; when `best >= 1` the line `` `Best streak: ${best} ${best === 1 ? 'day' : 'days'}` `` (`selectBestStreak`)
- [ ] T021 [US2] Card styles in src/components/LessonList.module.css: same horizontal margins and radius as `.banner`, bordered card on `--bg` (like the stat cards), progress track `--line`, fill `--streak`, 10 px tall rounded; fits 360 px without horizontal scroll
- [ ] T022 [US2] In src/components/LessonSummary.tsx add optional prop `streak?: number` (doc: "Set only on the summary of the session that met today's daily goal (contract U3)"); when defined: a `<p>` `Daily goal met` under the subtitle, and a third stat card after the others with label `Streak` and value `` `${streak} ${streak === 1 ? 'day' : 'days'}` `` using a new `statStreak` class
- [ ] T023 [US2] In src/components/Exercise.module.css add `.statStreak` (border and label background `--streak`, value text `--streak`, mirroring `.statUnlocked`) and a `.goalMet` text style; make `.stats` wrap when three cards do not fit at 360 px (e.g. `grid-template-columns: repeat(auto-fit, minmax(96px, 1fr))` instead of the auto-flow column) and check the two-card summaries look unchanged
- [ ] T024 [US2] Pass the streak from both routes: in src/routes/LessonRoute.tsx and src/routes/PracticeRoute.tsx read `const streak = useAppSelector(selectStreak(today()))` and pass `streak={session.goalMet ? streak : undefined}` to `LessonSummary`
- [ ] T025 [US2] Run `npm run lint`, `npm run build`, `npm test`; existing lesson/practice flow tests must pass (a first finished session in a test now shows the extra card; fix only queries that became ambiguous, e.g. `getByText('1 day')`)

### Tests for User Story 2

- [ ] T026 [US2] Extend tests/integration/streakFlow.test.tsx: fresh learner home shows "Daily goal", "0 / 1 session today", progressbar `aria-valuenow` 0, no "Best streak" line; finish lesson 1 → summary has "Daily goal met" and Streak "1 day"; Continue → "Done for today", `aria-valuenow` 1, "Best streak: 1 day"; Replay and finish again (or run Practice) → summary without "Daily goal met" and without Streak card; next simulated day → "0 / 1 session today" and best streak kept; a review session that meets the goal also announces it

### Validation for User Story 2

- [ ] T027 [US2] Manual check in Chrome with the user running `npm run dev`: quickstart S1–S4 and S8 at 360×740; record results under this task, including the owner's opinion of the colours and card look (no mockup exists)

**Checkpoint**: Daily goal and announcement complete

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T028 [P] Update README.md: in the course section mention the daily goal (one finished lesson, practice or review a day) and the streak; next to `duopona:progress`/`duopona:words` add that the streak is saved under `duopona:streak`
- [ ] T029 Quickstart S9 (offline) with the user running `npm run build && npm run preview`: one online load, then offline in DevTools, finish a session; record under this task
- [ ] T030 Ask the user to run quickstart S-D1 on iPhone (Safari) and Android (Chrome), installed; record results under this task (the owner may skip it, as for 003–006; then mark `[~]` with the owner-decision note)
- [ ] T031 Set spec.md **Status** to `Implemented` (or `Implemented (…)` naming skipped or open manual checks); tick checklists/requirements.md if anything changed; update ROADMAP.md: move the item from **In progress** to **Done** as `**007 – Daily goal & streak**: one finished session a day, streak and best streak on the home screen (\`specs/007-daily-goal-streak/\`).`, leaving **In progress** as `(none)`
- [ ] T032 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa` all pass; record the test count vs. T001's baseline under this task

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: first
- **Foundational (Phase 2)**: after T001; blocks both stories. T002 and T006 in parallel; T003 → T004 → T005; T007 after T003 and T006; T008 last
- **US1 (Phase 3)**: after Phase 2
- **US2 (Phase 4)**: after Phase 2; T021 after T012 (same CSS file); T020 after T011 (same component). Otherwise independent of US1
- **Polish (Phase 5)**: after both stories; T030 needs the user and real phones

### Within Each Story

- Implementation → lint/build → tests (Constitution IV: tests after code) → manual validation
- Same-file order: src/components/LessonList.tsx (T011 → T020), src/components/LessonList.module.css (T012 → T021), tests/integration/streakFlow.test.tsx (T018 → T026), src/store/sessionSlice.ts (T006) before src/store/lessonThunks.ts (T007)

### Parallel Opportunities

- Phase 2: T002 (days.ts) and T006 (sessionSlice.ts)
- US1: T009 (icons) and T010 (index.css) alongside T011; tests T014–T017 together
- US2: T022–T023 (summary) alongside T020–T021 (home card)
- T028 (README) any time after T024

---

## Parallel Example: User Story 1 tests

```text
Task: "T014 Create tests/unit/days.test.ts"
Task: "T015 Create tests/unit/streakSlice.test.ts"
Task: "T016 Extend tests/unit/persistence.test.ts with streak storage"
Task: "T017 Extend tests/unit/sessionSlice.test.ts with goalMet"
```

## Parallel Example: User Story 2

```text
Task: "T020–T021 Daily-goal card in src/components/LessonList.tsx and its CSS"
Task: "T022–T023 Streak block in src/components/LessonSummary.tsx and Exercise.module.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 + Phase 2: streak recorded and saved, no UI change
2. Phase 3 (US1): top-bar streak counter
3. **STOP and VALIDATE**: T019; the streak is shippable on its own

### Incremental Delivery

1. Setup + Foundational → no visible change, existing tests pass
2. US1 → streak counter (MVP)
3. US2 → daily-goal card, best streak, summary announcement
4. Polish → README, offline check, phones, final gate
