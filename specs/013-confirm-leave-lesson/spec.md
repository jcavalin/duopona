# Feature Specification: Confirm Before Leaving a Lesson

**Feature Branch**: `013-confirm-leave-lesson`

**Created**: 2026-11-16

**Status**: Implemented (phone checks M2 and M3 deferred by owner decision, task T019)

**Input**: User description: "When the user is doing a lesson and clicks to leave, it can be
accidental, and they would lose all their progress in that lesson. Add a confirmation callout
asking the user to confirm they want to leave the lesson before exiting."

## Clarifications

### Session 2026-11-16

- Q: Should browser Back / Android back gesture during a lesson also show the confirmation, or
  only the X button? → A: Both X and Back show the confirmation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accidental quit is caught (Priority: P1)

A learner is part-way through a lesson and taps the X (quit) button in the top bar by mistake,
for example while reaching for the progress bar or the first answer option. Today the lesson ends
at once and every answer given so far is lost. With this feature, a confirmation callout appears
over the exercise instead: "Leave this lesson?" with a short note that their progress in this
lesson will be lost, and two choices, "Keep learning" and "Leave". The learner taps
"Keep learning" and is back on the same exercise exactly as they left it.

**Why this priority**: This is the whole problem being solved: one stray tap must not throw
away a lesson in progress.

**Independent Test**: Start a lesson, answer two exercises, tap X, then choose "Keep learning";
check that the callout closes and the lesson is on the same exercise with the same progress
(position, progress bar, any answer already picked or shown feedback).

**Acceptance Scenarios**:

1. **Given** a learner on any exercise of a lesson, **When** they tap X, **Then** the lesson does
   not end and a callout appears asking them to confirm leaving, stating that progress in this
   lesson will be lost, with "Keep learning" and "Leave" choices.
2. **Given** the callout is open, **When** the learner chooses "Keep learning", **Then** the
   callout closes and the lesson is exactly as before X was tapped: same exercise, same
   position and progress bar, same selected option or placed tiles, and the same feedback sheet
   if one was showing.
3. **Given** the callout is open, **When** the learner taps outside it or presses Escape,
   **Then** it behaves like "Keep learning".
4. **Given** the callout is open, **Then** the exercise behind it cannot be answered, checked or
   continued until the callout is closed.

---

### User Story 2 - Intentional quit still works (Priority: P1)

A learner who really wants to stop taps X and then "Leave". The lesson ends and they return to
the lesson path, as quitting does today.

**Why this priority**: The confirmation must not trap the learner; leaving on purpose must stay
quick (one extra tap).

**Independent Test**: Start a lesson, answer one exercise, tap X, choose "Leave"; check that the
home lesson path is shown and that nothing from the abandoned session was saved, as today.

**Acceptance Scenarios**:

1. **Given** the callout is open, **When** the learner chooses "Leave", **Then** they return to
   the lesson path and the session is discarded exactly as quitting does today (no lesson
   completion, no unlock, no streak or daily-goal change from the abandoned session).
2. **Given** the learner left a lesson, **When** they open the same lesson again, **Then** it
   starts from its introduction as a fresh session, as today.

---

### User Story 3 - Practice sessions are protected too (Priority: P2)

Practice and weak-word review sessions use the same exercise screen and the same X button
("Quit practice"), and quitting them loses the session the same way. The same confirmation
applies, worded for practice ("Leave this practice?").

**Why this priority**: Same risk and same screen; leaving practice unprotected would feel
inconsistent, but lessons are the main case the owner raised.

**Independent Test**: Start a practice session, tap X; check the callout appears with practice
wording; "Keep learning" resumes, "Leave" goes home.

**Acceptance Scenarios**:

1. **Given** a learner in a practice or review session, **When** they tap X, **Then** the same
   callout appears, referring to the practice rather than the lesson.
2. **Given** that callout, **When** they choose "Keep learning" or "Leave", **Then** the outcome
   matches User Stories 1 and 2.

---

### User Story 4 - Device and browser Back (Priority: P2)

A learner on Android swipes the back gesture by accident (or presses the browser Back button)
during an exercise. Today this ends the lesson immediately. With this feature, Back opens the same
confirmation callout as X, and the learner stays on the exercise until they choose.

**Why this priority**: The back gesture is a common source of accidental exits on phones,
especially in the installed app, but X is the case the owner reported first.

**Independent Test**: Start a lesson, answer an exercise, press browser Back; check that the
callout appears and the lesson is still on the same exercise; choose "Keep learning" and check
nothing changed; press Back again and choose "Leave" and check the lesson path is shown.

**Acceptance Scenarios**:

1. **Given** a learner on any exercise of a lesson or practice, **When** they press browser Back
   or use the device back gesture, **Then** the session does not end and the same callout
   appears.
2. **Given** that callout, **When** they choose "Keep learning", **Then** the session is unchanged
   and a later Back asks again.
3. **Given** that callout, **When** they choose "Leave", **Then** they return to the lesson path
   as in User Story 2.
4. **Given** the callout is already open, **When** they press Back again, **Then** the callout
   stays open and they do not leave (changed in planning, research R3).

---

### Edge Cases

- X tapped while the feedback sheet (correct or wrong answer) is showing: the callout still
  appears; "Keep learning" returns to the same sheet with the explanation toggle in the same
  state.
- X tapped on the very first exercise before any answer: the callout still appears (one simple
  rule: any exercise screen asks).
- The lesson introduction (before Start) and the lesson-complete summary have nothing to lose:
  their X / Continue / Replay keep leaving immediately, with no callout.
- Double tap on X: only one callout opens; the second tap does not count as "Leave".
- Keyboard: when the callout opens, focus moves into it, on "Keep learning"; Tab stays inside the
  callout; Enter on the focused choice activates it; when it closes via "Keep learning", focus
  returns to the X button.
- Screen readers: the callout is announced as a dialog with its title and message.
- Closing the tab, reloading or the app being killed by the OS is out of scope (see Assumptions).
- 360 px width: the callout fits with no horizontal scrolling and both choices are fully visible.
- Offline: works like the rest of the app (no network involved).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On the exercise screen of a lesson, activating the quit (X) control MUST NOT end the
  session; it MUST open a confirmation callout instead.
- **FR-002**: The callout MUST show a title ("Leave this lesson?"), a message that the progress
  made in this lesson will be lost, and two choices: "Keep learning" (the primary, visually
  emphasised choice) and "Leave".
- **FR-003**: "Keep learning", tapping outside the callout and pressing Escape MUST close the
  callout and leave the session completely unchanged (current exercise, position, progress,
  in-progress answer, feedback sheet and its explanation toggle).
- **FR-004**: "Leave" MUST end the session and return to the lesson path with exactly the same
  effects as quitting has today; nothing from the abandoned session is saved.
- **FR-005**: While the callout is open, the exercise behind it MUST NOT accept input (answer,
  Check, Continue, explanation toggle).
- **FR-006**: The same confirmation MUST apply to practice and weak-word review sessions, with
  the title referring to the practice ("Leave this practice?").
- **FR-007**: The lesson introduction and the completion summary MUST keep leaving without a
  callout.
- **FR-008**: The callout MUST be accessible: announced as a dialog with its title and message,
  initial focus on "Keep learning", focus kept inside while open and returned to X on close, both
  choices usable by mouse, touch and keyboard.
- **FR-009**: Both choices MUST be targets of at least 44×44 CSS px, the callout MUST respect
  safe areas and be fully usable from 360 px width (Principle V), and its colours MUST follow
  the app's current theme with text meeting 4.5:1 contrast.
- **FR-010**: Whether the callout was shown or dismissed MUST NOT be stored; no new saved data.
- **FR-011**: Browser Back and the device back gesture during an exercise MUST open the same
  callout instead of ending the session; Back while the callout is open MUST NOT leave (the
  callout stays open; research R3). Back from the introduction and summary keeps working as today.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0% of single accidental taps on X or Back presses during a lesson or practice end the session;
  every one opens the callout.
- **SC-002**: After "Keep learning", 100% of sessions resume on the same exercise with the same
  progress and in-progress answer.
- **SC-003**: Leaving on purpose takes exactly one more tap than today (X, then "Leave").
- **SC-004**: At 360 px width the callout is fully visible and usable with no horizontal
  scrolling, on iOS Safari and Android Chrome, in the browser and installed.

## Assumptions

- Losing progress on leaving stays as it is; saving a half-finished lesson to resume later is out
  of scope. This feature only prevents leaving by accident.
- Closing the tab, reloading or the OS killing the app is out of scope: browsers only allow a
  generic, unstyled "leave site?" prompt there, and an installed app on a phone rarely shows it.
- No "don't ask again" option; the callout always appears.
- The callout always appears on the exercise screen, even before the first answer, to keep one
  simple, predictable rule.
- The callout is a small centred dialog over a dimmed screen; no new mockup is required, it uses
  the existing theme (purple brand colours, button styles). Adding the mascot to it is optional
  and not required.
- Wording is in English, like the rest of the app's interface.
