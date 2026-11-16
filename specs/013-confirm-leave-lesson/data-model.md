# Data Model: Confirm Before Leaving a Lesson

No stored data and no Redux state change (FR-010).

## Leave confirmation (transient UI state)

- Comes from React Router's blocker in `ExerciseScreen`:

  | Blocker state | Dialog |
  |---------------|--------|
  | `unblocked` | closed |
  | `blocked` | open |
  | `proceeding` | gone (navigating away) |
- Transitions:
  - X or Back on the exercise screen: `unblocked → blocked`.
  - "Keep learning", Escape or backdrop: `blocked → unblocked` (`reset`); the session is untouched.
  - "Leave": `blocked → proceeding` (`proceed`). The route unmounts and the existing cleanup
    dispatches `quitLesson`, so the session becomes `null`.
  - Back while blocked: stays `blocked` (research R3).
- The session (`sessionSlice`) is not read or changed by the dialog. Exercise-local state
  (selected option, placed tiles, explanation toggle) survives because nothing unmounts.
