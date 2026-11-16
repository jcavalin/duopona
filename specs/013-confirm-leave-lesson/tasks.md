---

description: "Task list for feature 013: Confirm Before Leaving a Lesson"
---

# Tasks: Confirm Before Leaving a Lesson

**Input**: Design documents from `/specs/013-confirm-leave-lesson/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R8), data-model.md,
contracts/ui-leave-dialog.md, quickstart.md (M1–M4)

**Tests**: Included. Constitution IV ("Tests after code, before done"): each test task comes
**after** the code it covers. Real Back gesture, focus trapping, backdrop and layout on devices
are validated manually (IV exception) with quickstart M1–M4, results recorded under the matching task.

**Organization**: Four user stories. US1 (X opens the dialog, Keep learning) and US2 (Leave)
are both P1 and make up the MVP. US3 (practice wording) and US4 (Back) are P2. Back needs no
extra code, because the router blocker from US1 already catches it (R1); US4 is mostly tests.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1–US4)

## Path Conventions

Single frontend project: `src/`, `tests/` at the repository root. Run commands from the
repository root.

## Environment notes (read before any task)

- **npm in the sandbox**: prefix `npm`/`npx` with `npm_config_cache="$TMPDIR/npm-cache"`
  (`~/.npm` is read-only). No new packages are needed.
- **Dev server**: a server started from the sandbox is not reachable from Chrome. Ask the user to
  run `npm run dev` (http://localhost:5173), then drive Chrome against it. If a file was rewritten
  by a script, touch it and check the served code before testing in Chrome (Vite may serve an
  empty cached file).
- **Router**: the app uses data routers (`createHashRouter` in src/main.tsx, `createMemoryRouter`
  in tests), so `useBlocker` from `react-router` (v8) works. Only one `useBlocker` may be active
  at a time; it lives only in `ExerciseScreen`.
- **Do not change** the session store (src/store/sessionSlice.ts), `quitLesson`, persistence,
  the routes' existing `useEffect` cleanups, src/components/LessonIntro.tsx or
  src/components/LessonSummary.tsx (FR-004, FR-007, FR-010).
- **Do not** add Redux state for the dialog: blocker state is the source of truth (data-model.md).
- **Wording** (contract): title "Leave this lesson?" / "Leave this practice?"; message "Your
  progress in this lesson will be lost." / "Your progress in this practice will be lost.";
  buttons "Keep learning" and "Leave".

---

## Phase 1: Setup

- [X] T001 On branch `013-confirm-leave-lesson`, run `npm test` and `npm run lint` and record the passing test count under this task as the baseline. In ROADMAP.md, replace `(none)` under **In progress** with `- **013 – Confirm before leaving a lesson** (`specs/013-confirm-leave-lesson/`).`
  - **Result (2026-11-16)**: baseline `npm test` 638 passed; lint clean; ROADMAP updated

---

## Phase 2: Foundational

- [X] T002 [P] Create src/components/LeaveDialog.tsx (contract props, R2, R4):
  - **Props**: `{ title: string; message: string; onStay: () => void; onLeave: () => void }`.
  - **Markup**: `<dialog ref={ref} className="leave-dialog" aria-labelledby={titleId} aria-describedby={messageId} onClose={onStay} onClick={(e) => { if (e.target === e.currentTarget) onStay() }}>`.
    Inside it, a `<div className="leave-dialog-body">` (it gets the padding, so a click on the
    padding does not count as a backdrop click) containing:
    - `<h2 id={titleId} className="leave-dialog-title">{title}</h2>`;
    - `<p id={messageId} className="leave-dialog-message">{message}</p>`;
    - `<button type="button" className="primary-button" autoFocus onClick={onStay}>Keep learning</button>`;
    - `<button type="button" className="text-button leave-dialog-leave" onClick={onLeave}>Leave</button>`.
  - **Ids**: `useId()` for `titleId` and `messageId`.
  - **Opening**: in `useEffect(() => { const d = ref.current; if (d && !d.open) d.showModal() }, [])`.
    No cleanup `close()`, because the component is unmounted by its parent; calling `close()`
    would fire `onClose` → `onStay` after Leave.
  - **Escape**: the browser closes the dialog and fires `close`, which calls `onStay` (R4: use
    `close`, not `cancel`).
  - **Doc comment**: "Leave confirmation (013 contract ui-leave-dialog.md); native modal dialog,
    research R2."
  - **Note (2026-11-16)**: `autoFocus` is replaced by an explicit `stayRef.current.focus()` after `showModal()`: React's `autoFocus` did not hold with the jsdom stub, and focusing explicitly is reliable in browsers too.
- [X] T003 [P] Add dialog styles to src/index.css, after the `.text-button` rules (R5):
  - `.leave-dialog`: `width: calc(100% - 32px); max-width: 340px; padding: 0; border: 2px solid var(--line); border-radius: 16px; background: var(--line-deep); color: var(--text);`
    plus `margin: auto` (centred, native top layer).
  - `.leave-dialog::backdrop`: `background: rgb(0 0 0 / 60%);`
  - `.leave-dialog-body`: `padding: 24px 20px 16px; text-align: center;`
  - `.leave-dialog-title`: `margin: 0 0 8px; font-size: 20px; font-weight: 900;`
  - `.leave-dialog-message`: `margin: 0 0 20px; color: var(--text-muted);`
  - `.leave-dialog .text-button.leave-dialog-leave`: `color: var(--error-text);`
  - Comment: "Leave confirmation dialog (013, research R5)".
  - **Note**: also `max-height` minus the safe-area insets (analysis U2).
- [X] T004 [P] In tests/setup.ts, add a jsdom stub (R6), only when `HTMLDialogElement.prototype.showModal` is missing:
  - `showModal() { this.open = true }`;
  - `close() { if (!this.open) return; this.open = false; this.dispatchEvent(new Event('close')) }`.

  Use `function` expressions so `this` is the dialog. Add the comment: "jsdom has no modal
  dialogs (013 research R6)".

---

## Phase 3: User Story 1 - Accidental quit is caught (Priority: P1) 🎯 MVP

**Goal**: X on the exercise screen opens the dialog instead of leaving. "Keep learning",
Escape or the backdrop returns to the untouched exercise, with focus on X.

**Independent Test**: Start Lesson 1, answer once, tap X. The dialog shows; "Keep learning"
returns to the same exercise ("2/n"), with the same selection or feedback sheet.

### Implementation

- [X] T005 [US1] Update src/components/ExerciseScreen.tsx (R1, R4):
  - **New props**: `leaveTitle = 'Leave this lesson?'` and
    `leaveMessage = 'Your progress in this lesson will be lost.'`.
  - **Blocker**: `const blocker = useBlocker(({ currentLocation, nextLocation }) => currentLocation.pathname !== nextLocation.pathname)`
    (import from `react-router`). The hook must sit above the early `return null`, so move every
    hook before it.
  - **Focus ref**: `const quitRef = useRef<HTMLButtonElement>(null)`, set on the X button.
  - **Stay**: `const stay = () => blocker.reset?.()`.
  - **Focus return** (analysis C1): while the modal is open X is inert and `focus()` on it is ignored, so focus X only after the dialog is gone: an effect on `blocker.state` that remembers it was `blocked` and, when it becomes `unblocked`, calls `quitRef.current?.focus()`.
  - **Leave**: `const leave = () => blocker.proceed?.()`.
  - **Render**: after the feedback banner,
    `{blocker.state === 'blocked' && <LeaveDialog title={leaveTitle} message={leaveMessage} onStay={stay} onLeave={leave} />}`.
  - **X button**: keeps calling `onQuit`, which navigates home and so triggers the blocker.
  - **Doc comment**: "X and Back are confirmed first (013)".
- [X] T006 [US1] In src/components/MultipleChoice.tsx, at the start of the window `keydown` handler, add `if (event.target instanceof Element && event.target.closest('dialog')) return`. Comment: "number keys must not change the answer behind the leave dialog (013 R7)".
- [X] T007 [US1] Run `npm run lint`, `npm run build`, `npm test`. Expect the existing tests that quit or go Back mid-session to fail, because they now stop at the dialog:
  - lessonFlow: "Quit returns to the list…", "browser Back from a lesson…" and "quitting mid-lesson does not mark it completed";
  - practiceFlow lines ~131 and ~196;
  - streakFlow line ~127.
  - **Result (2026-11-16)**: lint clean, build ok (precache 16 entries). 5 tests failed as expected: lessonFlow "Quit returns…", "browser Back…", "quitting mid-lesson…"; practiceFlow "quitting discards the session…"; streakFlow "quitting a session counts nothing". practiceFlow "keeps mistakes after quitting" still passed (mistakes are recorded before quitting) but was updated anyway in T011.

  Record which ones fail under this task.

### Tests (after the code, Constitution IV)

- [X] T008 [US1] Add `describe('013 leave confirmation')` to tests/integration/lessonFlow.test.tsx, using the existing helpers (`renderApp`, `startLesson`, `answer`, `total`). Cover:
  - (a) After one answer, clicking "Quit lesson" opens `getByRole('dialog', { name: 'Leave this lesson?' })` with the description "Your progress in this lesson will be lost.". "Keep learning" has focus. The location is still `/lesson/…` and `store.getState().session` is not null.
  - (b) "Keep learning" removes the dialog; `2/${total}` is still shown; the session `step` is unchanged (compare it to a value saved before X); "Quit lesson" has focus.
  - (c) Dispatching the close event on the dialog (`fireEvent(dialog, new Event('close'))`, as a browser does on Escape) behaves like (b).
  - (d) Clicking the dialog element itself (the backdrop) behaves like (b); clicking inside the body text does not close it.
  - (e) X while the wrong-answer feedback sheet is open with "Why?" expanded, then "Keep learning": the sheet is still there with "Continue" and the toggle still reads "Hide" (analysis U1).
  - (e2) On a word-bank exercise, place a tile, X → "Keep learning": the tile is still in the answer (analysis U1).
  - (e3) Double-clicking X opens at most one dialog and never leaves; the session is intact afterwards (analysis I1).
  - (f) On a multiple-choice exercise, with the dialog open, `user.keyboard('1')` does not select an option: after closing the dialog with "Keep learning", no `optionButtons()` entry has `aria-pressed="true"` and "Check" is still disabled (same assertions as the existing "number keys select the matching option…" test).
  - (g) On the lesson intro, the "Back to lessons" button still leaves straight to the list with no dialog. On the summary, Continue leaves with no dialog.

**Checkpoint**: X no longer loses progress.

---

## Phase 4: User Story 2 - Intentional quit still works (Priority: P1) 🎯 MVP

**Goal**: X then "Leave" ends the session exactly as quitting did before.

**Independent Test**: Start a lesson, answer once, X → "Leave". The list shows, nothing is
saved, and reopening the lesson starts fresh at 1/n.

### Implementation

- [X] T009 [US2] No new code beyond T005's `leave` (`blocker.proceed()`). Check in src/routes/LessonRoute.tsx that the cleanup still dispatches `quitLesson()` on unmount and is unchanged.

### Tests (after the code)

- [X] T010 [US2] Update tests/integration/lessonFlow.test.tsx tests "Quit returns to the list and discards the session" and "quitting mid-lesson does not mark it completed": after clicking "Quit lesson", click `getByRole('button', { name: 'Leave' })`. Keep the existing assertions (list heading, session null, `1/${total}` on restart, not completed, nothing in `STORAGE_KEY`).
- [X] T011 [P] [US2] Update tests/integration/streakFlow.test.tsx (~line 127) and tests/integration/practiceFlow.test.tsx (~line 196, the "Quit lesson" that keeps mistakes): click "Leave" after the quit button. Keep the existing assertions.

**Checkpoint**: MVP (US1 + US2) complete.

---

## Phase 5: User Story 3 - Practice sessions are protected too (Priority: P2)

**Goal**: Practice and weak-word review use the practice wording.

**Independent Test**: Open `/practice/practice` with one lesson completed, tap X. You should
see "Leave this practice?"; "Keep learning" resumes and "Leave" goes home.

### Implementation

- [X] T012 [US3] In src/routes/PracticeRoute.tsx, pass `leaveTitle="Leave this practice?"` and `leaveMessage="Your progress in this practice will be lost."` to `ExerciseScreen` (alongside `quitLabel`/`progressLabel`).

### Tests (after the code)

- [X] T013 [US3] In tests/integration/practiceFlow.test.tsx:
  - Update "quitting discards the session and keeps progress" (~line 131): click "Leave" after "Quit practice".
  - Add a test: after one answer in `/practice/practice`, "Quit practice" opens
    `getByRole('dialog', { name: 'Leave this practice?' })` with the description "Your progress
    in this practice will be lost.". "Keep learning" leaves the location at `/practice/practice`,
    with the session not null.
  - Add the same check for `/practice/review`, with a weak word set up the way the existing
    review tests do.

---

## Phase 6: User Story 4 - Device and browser Back (Priority: P2)

**Goal**: Back during an exercise opens the same dialog; a second Back keeps it open (R3).

**Independent Test**: Start a lesson, answer once, `router.navigate(-1)`. The dialog opens and
the location stays on the lesson.

### Implementation

- [X] T014 [US4] No new code: the T005 blocker catches POP navigations (R1). Confirm in src/components/ExerciseScreen.tsx that the blocker function compares pathnames, so that Back to `/` is blocked.

### Tests (after the code)

- [X] T015 [US4] In tests/integration/lessonFlow.test.tsx:
  - Update "browser Back from a lesson discards the session": after `await router.navigate(-1)`, `await screen.findByRole('dialog', { name: 'Leave this lesson?' })`, click "Leave", then keep the existing assertions (list heading, session null).
  - Add to `describe('013 leave confirmation')`:
    - (h) `router.navigate(-1)` mid-lesson opens the dialog. The location stays on the lesson.
      "Keep learning" keeps the session, and a second `router.navigate(-1)` opens the dialog again.
    - (i) With the dialog open, another `router.navigate(-1)` keeps the dialog open and the
      location on the lesson (R3).
    - (j) `router.navigate(-1)` from the lesson intro (before Start) goes straight to the list
      with no dialog.

  Lessons are opened from `/` with `startLesson`, so there is a history entry to go back to.
- [X] T016 Run `npm test` and `npm run lint`; all pass. Record the count.
  - **Result (2026-11-16)**: `npm test` 652 passed (baseline 638, +14: 12 lessonFlow, 2 practiceFlow); lint clean
- [X] T017 Manual check: ask the user to run `npm run dev`, then in Chrome (device emulation) run quickstart M1 and M4 and record results under this task. If the layout is wrong at 360 px, fix the `.leave-dialog*` rules in src/index.css and re-check.
  - **Result (2026-11-16)**, Chrome against the user's `npm run dev` (served code checked first):
    - **M1**: in a 619 px window (Chrome's minimum), X opens "Leave this lesson?" centred over a dimmed screen, and the dialog is `:modal`.
      - The box is 340×225 px; "Keep learning" is 296×55 px and "Leave" 296×44 px.
      - Focus starts on "Keep learning". "Keep learning" (mouse) brings focus back to X, on the same exercise (2/13); this confirms the analysis C1 fix in a real browser.
      - Keyboard: Enter on X opens the box. "1" pressed inside it selects nothing behind. Tab goes to "Leave", then out to the browser's own controls, never to the page behind. Escape closes it with focus on X.
      - A click on the backdrop over an answer option closes the box without selecting the option.
      - Browser Back opens the box and the lesson stays at 2/13. A second Back keeps exactly one box open (R3). "Leave" goes to `#/`.
    - **M4**: in a 360 px-wide frame of the app: wrong answer, "Why?" opened, then X.
      - The box is 313×248 px at x 16–329, with no horizontal scroll, and both buttons fully visible.
      - "Keep learning" brings back the sheet with Continue and "Hide" (`aria-expanded="true"`), and focus is on X.
    - The user's dev `localStorage` was saved before and restored after (verified identical).

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T018 [P] Update README.md: where the features list lessons/quitting, add that leaving a lesson or practice (X or Back) asks for confirmation first
  - **Result**: done in the Polish phase (see README)
- [~] T019 Ask the user to run quickstart M2 (Android back gesture, installed) and M3 (iOS Safari) on phones (Constitution V), and record results under this task. The owner may waive it under the recorded-waiver rule (Principle IV): then mark `[~]` with the date and "owner decision", and name the waived check in spec.md **Status**.
  - **Deferred (2026-11-16)**: owner decision (constitution IV waiver): the owner will run M2 and M3 on phones later.
- [X] T020 Set spec.md **Status** to `Implemented`, or to `Implemented (…)` naming any waived manual check. In ROADMAP.md, move the 013 entry from **In progress** to **Done**, rewording it as a short summary in the style of the other Done items and keeping the specs path. Leave **In progress** as `(none)`.
  - **Result (2026-11-16)**: Status `Implemented (phone checks M2 and M3 deferred by owner decision, task T019)`; ROADMAP updated
- [X] T021 Final gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa` all pass. Record the test count against T001's baseline under this task.
  - **Result (2026-11-16)**: `npm test` 652 passed (baseline 638, +14); lint clean; build ok (precache 16 entries, 544.65 KiB); `npm run test:pwa` 29 passed

---

## Dependencies & Execution Order

- **Setup (T001)**: first
- **Foundational (T002, T003, T004)**: after T001, in parallel (different files)
- **US1**: T005 (needs T002) → T006 → T007 → T008 (needs T004)
- **US2**: T009 → T010 (same file as T008, after it); T011 [P] with T010
- **US3**: T012 (after T005) → T013 (practiceFlow; after T011, same file)
- **US4**: T014 → T015 (lessonFlow; after T010) → T016 → T017
- **Polish**: T018 [P] any time after T016; T019 → T020 → T021

### Parallel opportunities

- T002, T003, T004 together.
- T010 and T011 (different test files).
- T012 can be done right after T005, alongside US1/US2 tests.
- T018 alongside T017/T019.

## Implementation Strategy

- **MVP**: Phases 1–4 (US1 + US2): X asks and Leave/Keep learning work. This already fixes the
  reported problem.
- **Increment 2**: US3 (one prop pair) and US4 (tests only). The Back protection comes with the
  MVP code, so US4 just verifies and locks it in.
- Manual device checks last; the owner may defer them (recorded waiver).
