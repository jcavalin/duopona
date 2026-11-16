# Research: Confirm Before Leaving a Lesson

## R1. Catching X and Back in one place: React Router `useBlocker`

- **Decision**: Call `useBlocker` in `ExerciseScreen`. It blocks when the next pathname differs
  from the current one. X keeps calling the route's existing `onQuit` (`navigate('/')`), and
  that navigation is what gets blocked.
- **Rationale**:
  - The app uses a data router (`createHashRouter`, and `createMemoryRouter` in tests), which is
    what `useBlocker` needs.
  - For a PUSH (X), the router holds the navigation.
  - For a POP (browser Back, Android back gesture), the router undoes it with `history.go(-delta)`
    and replays it on `proceed()` (verified in `react-router/dist/development/lib/router/router.js`).
  - `ExerciseScreen` only mounts while exercises are showing, so the intro and summary are never
    blocked (FR-007) without any extra condition.
  - "Leave" goes through the normal navigation, so the route's existing cleanup
    (`quitLesson`) discards the session exactly as today (FR-004).
- **Alternatives considered**:
  - A local `confirmOpen` state for X plus a hand-written `popstate` listener for Back: two code
    paths, and fiddly history fixes. Rejected.
  - `beforeunload`: only covers closing the tab and shows the browser's generic prompt. Out of
    scope per the spec.

## R2. The callout: native `<dialog>` with `showModal()`

- **Decision**: Add a `LeaveDialog` component. It renders `<dialog aria-labelledby aria-describedby>`
  and calls `showModal()` when it mounts. `ExerciseScreen` renders it only while
  `blocker.state === 'blocked'`.
- **Rationale**: The browser provides, for free:
  - the top layer and the `::backdrop`;
  - making the rest of the page inert, so focus stays inside and nothing behind can be clicked
    (FR-005, FR-008);
  - Escape, which fires `cancel`/`close`;
  - announcing it as a dialog.

  It is supported on iOS Safari 15.4+ and Android Chrome. No focus-trap code or portal is needed
  (Principle I).
- **Alternatives considered**:
  - A `div role="dialog"` with our own inert/focus trap: more code that only re-creates the
    native behaviour.
  - A dialog library: a new dependency that isn't needed.

## R3. Back while the dialog is open

- **Decision**: A second Back while the dialog is open keeps it open and does not leave.
- **Rationale**: The router moves the blocker from "blocked" to "blocked" again and undoes the
  POP, so the learner stays put. The spec's original wording said a second Back would close the
  callout. That would need extra state to tell the two Backs apart, for no real gain: the point
  is "Back never leaves without confirming". The spec (US4 scenario 4, FR-011) is updated to match.
- **Edge**: If the lesson is the first history entry (for example, the installed app was opened
  straight on a lesson URL), Android Back closes the app and no page can intercept that. In
  normal use you always reach a lesson from the path, so there is a history entry to go back to.
  This is noted in quickstart M2.

## R4. Closing paths and focus

- **Decision**:
  - "Keep learning" gets initial focus, set explicitly with `focus()` right after `showModal()`.
  - "Keep learning", Escape (the dialog's `close` event) and a click on the backdrop (a click
    whose target is the `<dialog>` element itself; the content sits in an inner wrapper with the
    padding) all call `onStay`.
  - `onStay` calls `blocker.reset()`. An effect in `ExerciseScreen` focuses X once the blocker
    goes from `blocked` back to `unblocked`, after the dialog has unmounted. While the modal is
    open, X is inert and `focus()` on it is ignored by browsers (analysis C1); jsdom does not
    enforce this, so quickstart M1 checks it.
  - "Leave" calls `blocker.proceed()`.
- **Rationale**: The dialog is unmounted rather than closed, so the browser's automatic focus
  return can't be relied on. Focusing X ourselves meets FR-008. `close` is used instead of
  `cancel` because Chrome may skip `cancel` when Escape is pressed again and again.

## R5. Look

- **Decision**:
  - Centred card, `max-width: 340px`, `width: calc(100% - 32px)` so it fits at 360 px.
  - `--line` border, `--bg`-darker surface (`--line-deep`), radius 16 px.
  - Title 20 px/900, message in `--text-muted`.
  - "Keep learning" as `.primary-button`, "Leave" as `.text-button` in `--error-text`.
  - Backdrop `rgb(0 0 0 / 60%)`.
- **Rationale**: Only existing tokens and button classes are used. The red text on "Leave" marks
  the destructive choice while "Keep learning" stays the obvious default. `--error-text` on
  `--line-deep` is about 6.9:1, which meets FR-009. No mascot (spec: optional; KISS).

## R6. Testing in jsdom

- **Decision**: In `tests/setup.ts`, stub `HTMLDialogElement.prototype.showModal` and `close`
  (set/remove `open` and fire `close`), but only if jsdom lacks them.
- **Rationale**: jsdom 30 has no modal support. Escape is tested by dispatching the `cancel`/`close`
  event a browser would fire. The real Escape, inertness and focus behaviour go in manual check M3.
- `router.navigate(-1)` on the memory router goes through the same blocker path as browser Back,
  so it is tested automatically.

## R7. Global number-key shortcut

- **Decision**: In `MultipleChoice`'s window `keydown` handler, return early when
  `event.target` is inside a `<dialog>`.
- **Rationale**: `inert` stops focus and clicks, but not window-level key listeners. Without
  this, pressing "1" while the dialog is open would change the selected option behind it
  (FR-005).

## R8. Existing tests

- **Decision**: The existing tests that tap "Quit lesson"/"Quit practice" or call
  `router.navigate(-1)` mid-session now also confirm with "Leave". The tests still check
  "discards the session", which is still true after confirming.
