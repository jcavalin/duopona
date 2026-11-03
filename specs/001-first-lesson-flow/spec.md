# Feature Specification: First Lesson Flow

**Feature Branch**: `001-first-lesson-flow`

**Created**: 2026-11-01

**Status**: Draft

**Input**: User description: "A learner can open the app, pick the first lesson (basic Toki Pona words), answer a series of multiple-choice and translation exercises, see right/wrong feedback, and have their completed lessons saved so they're still there after reloading the page."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete the first lesson (Priority: P1)

A learner opens the app, sees the lesson list, and starts the first lesson ("Basic Words").
The lesson presents a series of exercises, one at a time: multiple-choice questions (pick the
correct meaning of a Toki Pona word, or the Toki Pona word for an English meaning) and
translation exercises built from a word bank. After each answer the learner immediately sees whether it was right or
wrong, and when it was wrong, what the correct answer is. After the last exercise the learner
sees a lesson-complete summary.

**Why this priority**: This is the core learning loop. Without it the app teaches nothing.

**Independent Test**: Open the app, start the first lesson, answer every exercise (some right,
some wrong), and confirm the feedback after each answer and the summary at the end.

**Acceptance Scenarios**:

1. **Given** the app is open on the lesson list, **When** the learner selects the first
   lesson, **Then** the first exercise of that lesson is shown.
2. **Given** a multiple-choice exercise is shown, **When** the learner picks the correct
   option and confirms, **Then** the app shows "correct" feedback and lets them continue.
3. **Given** any exercise is shown, **When** the learner submits a wrong answer, **Then** the
   app shows "wrong" feedback together with the correct answer.
4. **Given** a translation exercise is shown, **When** the learner answers it, **Then** the
   answer is checked as described in FR-005 and feedback is shown.
5. **Given** the learner answers the last exercise, **When** they continue, **Then** a
   lesson-complete summary shows how many exercises they answered correctly on the first try.
6. **Given** a wrong answer was given during the lesson, **When** the learner reaches the end
   of the exercises, **Then** each missed exercise is presented again, repeating until it is answered correctly,
   and only then is the lesson-complete summary shown.

---

### User Story 2 - Progress survives a reload (Priority: P2)

After completing the first lesson, the learner reloads the page (or closes the browser and
comes back later on the same device and browser). The lesson list still shows the first lesson
as completed.

**Why this priority**: Saved progress is what makes the app usable across sessions, but it
only matters once a lesson can be completed.

**Independent Test**: Complete the first lesson, reload the page, and confirm the lesson is
still marked completed.

**Acceptance Scenarios**:

1. **Given** the learner has completed the first lesson, **When** they reload the page,
   **Then** the lesson list shows the first lesson as completed.
2. **Given** the learner has never completed a lesson, **When** they open the app, **Then**
   no lesson is shown as completed.
3. **Given** the learner leaves a lesson part-way through, **When** they reload the page,
   **Then** the lesson is not marked completed and starting it again begins from the first
   exercise.

---

### Edge Cases

- The learner tries to submit without selecting an option or typing anything: submission is
  not possible until an answer is given.
- A word-bank answer uses the right words in the wrong order: it is wrong.
- The learner gets the same exercise wrong repeatedly: it keeps coming back until answered
  correctly; there is no limit on attempts.
- Saved progress cannot be read (missing, corrupted, or from an incompatible older format): the
  app starts with no progress instead of failing to load.
- The browser does not allow saving data (e.g., storage disabled or full): the lesson can still
  be completed in the current session, and the app does not crash.
- The learner completes the same lesson again: it stays marked completed; the summary reflects
  the latest attempt.
- The learner leaves a lesson mid-way (navigates back to the lesson list): partial progress is
  discarded.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST show a lesson list on open, containing at least the first lesson,
  "Basic Words".
- **FR-002**: Learners MUST be able to start the first lesson from the lesson list.
- **FR-003**: The first lesson MUST contain a fixed series of exercises mixing multiple-choice
  and translation exercises, covering a set of basic Toki Pona words (e.g., *mi, sina, ona,
  jan, pona, ike, moku, telo, toki, li*).
- **FR-004**: Multiple-choice exercises MUST present one prompt and 3–4 options, exactly one of
  which is correct, in both directions (Toki Pona → English and English → Toki Pona).
- **FR-005**: Translation exercises MUST ask the learner to translate a short word or phrase,
  answered by tapping words from a word bank (the correct words plus distractors) to assemble
  the answer in order; tapped words can be removed before submitting.
- **FR-006**: The app MUST show right/wrong feedback immediately after each submitted answer,
  and MUST show the correct answer when the learner's answer was wrong.
- **FR-007**: The app MUST show the learner's position in the lesson (e.g., "exercise 3 of 10"
  or a progress bar).
- **FR-008**: The app MUST show a lesson-complete summary with the number of exercises answered
  correctly on the first try.
- **FR-009**: The app MUST mark a lesson as completed when the learner reaches its summary, and
  MUST persist completed lessons on the learner's device so they survive page reloads and
  browser restarts.
- **FR-010**: The lesson list MUST visually distinguish completed lessons from not-yet-completed
  ones.
- **FR-011**: The app MUST work without an account or sign-in and MUST NOT send learner data
  off the device.
- **FR-012**: If saved progress is unreadable, the app MUST start with empty progress rather
  than fail.
- **FR-013**: Learners MUST be able to leave a lesson in progress and return to the lesson
  list.
- **FR-014**: The lesson list MUST show only the first lesson; no placeholder or locked future
  lessons are shown.
- **FR-015**: Exercises answered wrong MUST be repeated at the end of the lesson until answered
  correctly; the lesson completes only when every exercise has been answered correctly once.

### Key Entities

- **Lesson**: A titled, ordered collection of exercises teaching a small set of words. Has an
  identifier, a title, and its exercises. Shipped with the app; not created by learners.
- **Exercise**: One question within a lesson. Has a type (multiple choice or translation), a
  prompt, the correct answer, and, for multiple choice, the answer options.
- **Learner Progress**: What the learner has achieved on this device: the set of completed
  lessons and, for each, the result of the latest attempt.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can go from opening the app to answering the first exercise
  in under 30 seconds, with no instructions.
- **SC-002**: A learner can complete the first lesson in under 5 minutes.
- **SC-003**: Feedback for each answer appears in under 1 second after submitting.
- **SC-004**: 100% of completed lessons are still shown as completed after a page reload or
  browser restart on the same device and browser.
- **SC-005**: Every exercise in the first lesson has exactly one accepted correct answer , verified before release.

## Assumptions

- The learner is a beginner with no prior Toki Pona knowledge; the interface language is
  English.
- Progress is per device and per browser; there is no syncing between devices.
- A single learner uses the app per browser; there are no user profiles.
- Lesson content is written by the project and shipped with the app; no content editor is
  needed.
- Gamification beyond the lesson summary (XP, streaks, hearts/lives, leaderboards) is out of
  scope for this feature.
- Audio, pronunciation, and Toki Pona glyph writing systems (sitelen pona) are out of scope.
- The app is used on modern desktop and mobile browsers and remains usable at phone width.

## Clarifications

### Session 2026-11-01

- Q: What happens to exercises answered wrong? → A: They are repeated at the end until answered
  correctly; the lesson finishes only when every exercise has been answered correctly.
- Q: How are translation exercises answered? → A: By tapping words from a word bank.
- Q: What does the lesson list show? → A: Only the first lesson.
