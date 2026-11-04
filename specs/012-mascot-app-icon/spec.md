# Feature Specification: Mascot and App Icon

**Feature Branch**: `012-mascot-app-icon`

**Created**: 2026-11-04

**Status**: Implemented (phone check M7 deferred by owner decision, task T021)

**Input**: User description: "Add the Duopona mascot and new app icon as designed in
docs/design/mascot.md"

**Design**: [docs/design/mascot.md](../../docs/design/mascot.md) (expressions, placement, sizes,
app icon files and open points), the final mascot drawings in
[docs/design/mascot/](../../docs/design/mascot/), the ready-made icon files in
[docs/design/app-icon/](../../docs/design/app-icon/), and mockups 03, 04, 04a, 04b, 05, 06, 07,
08 and 09 in [docs/design/mockups/](../../docs/design/mockups/). It builds on the purple theme
(feature 011).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mascot on exercise screens reacts to answers (Priority: P1)

A learner starts an exercise. Instead of the old drop or speech-bubble icon, a small purple sprout
mascot stands at the left of the prompt, and the prompt sits in a speech bubble whose tail points
at the mascot (mockups 03, 05). When the learner checks the answer, the mascot reacts: it looks
sad after a wrong answer (drooping leaves, frown, sweat drop; mockups 04, 04a, 04b) and happy
after a right one (closed happy eyes, open smile; mockup 06). On the next exercise it is idle
again.

**Why this priority**: This is the main visible change. One friendly character replaces the icon,
which suggested a meaning most sentences don't have, and gives instant emotional feedback on
each answer.

**Independent Test**: Play any lesson. Check that the idle mascot appears beside the prompt on
multiple-choice and word-bank exercises, turns sad on a wrong answer and happy on a right one,
and is idle again on the next exercise.

**Acceptance Scenarios**:

1. **Given** a multiple-choice exercise, **When** it opens, **Then** the idle mascot is at the
   left of the prompt, and the prompt is in a bubble with a tail pointing at the mascot (mockup
   03). The drop icon is gone.
2. **Given** a word-bank exercise, **When** it opens, **Then** the same idle mascot and prompt
   bubble are shown (mockup 05). The speech-bubble icon is gone.
3. **Given** an exercise, **When** the learner checks a wrong answer, **Then** the mascot shows
   the sad expression while the wrong-answer sheet is open (mockup 04).
4. **Given** an exercise, **When** the learner checks a right answer, **Then** the mascot shows
   the happy expression while the correct-answer sheet is open (mockup 06).
5. **Given** the feedback sheet is open, **When** the learner continues, **Then** the next
   exercise shows the idle mascot.
6. **Given** a practice or review-weak-words session, **When** exercises are shown, **Then** the
   mascot behaves the same as in lessons.

---

### User Story 2 - Celebrating mascot on the session summary (Priority: P2)

A learner finishes a lesson or a practice session. The summary shows a larger mascot with arms up
and sparkles, centred above "Lesson complete!", in place of the gold star badge (mockup 07).

**Why this priority**: It rewards the end of a session with the same character. It is less
frequent than the per-answer reactions.

**Independent Test**: Finish a lesson and a practice session, and check that the celebrating
mascot replaces the star badge on both summaries.

**Acceptance Scenarios**:

1. **Given** the learner finishes a lesson, **When** the summary opens, **Then** the celebrating
   mascot appears centred above the title, and the gold star badge is gone (mockup 07).
2. **Given** the learner finishes a practice session, **When** its summary opens, **Then** the
   celebrating mascot appears in the same place.
3. **Given** the summary, **When** it is shown, **Then** everything else on it (title, lesson
   name, stats, buttons) is unchanged.

---

### User Story 3 - Mascot app icon (Priority: P2)

A learner sees the mascot as Duopona's icon: in the browser tab, on the home screen after
installing (Android and iOS), and in the app switcher. The icon is the idle mascot on the dark
violet-grey background (mockup 09).

**Why this priority**: It gives the installed app its own identity, matching the purple theme.
It is independent of the in-app mascot.

**Independent Test**: Open the app and check the browser tab icon; install it on a phone (or
inspect the installed-app icons) and check that the home-screen icon is the mascot.

**Acceptance Scenarios**:

1. **Given** the app is open in a browser, **When** the learner looks at the tab, **Then** the
   tab icon is the mascot on a rounded dark square.
2. **Given** the app is installed on Android, **When** the learner looks at the home screen,
   **Then** the icon is the mascot. Shaped (masked) icons keep the whole mascot inside the shape.
3. **Given** the app is added to the iOS home screen, **When** the learner looks at it, **Then**
   the icon is the mascot on an opaque dark background.

---

### Edge Cases

- **Screen readers**: the mascot is decorative and is not announced. The prompt text and the
  feedback sheet still carry the meaning, exactly as today.
- **Reduced motion**: the expression switches instantly. If any animation is added, it is turned
  off when the device asks for reduced motion.
- **360 px width**: the mascot and the prompt bubble fit side by side without horizontal
  scrolling. A long prompt wraps inside the bubble.
- **Long explanation open (010)**: the sheet can cover the mascot area. The sad expression is
  still the current one when the learner hides the explanation.
- **Retry of a missed exercise later in the session**: it starts idle like any exercise.
- **Offline**: the mascot drawings and the icons are part of the installed app and work offline
  after the first visit.
- **Already-installed app**: the home-screen icon may only update when the browser refreshes it
  or the learner reinstalls. This is expected and not a defect.
- **Lesson path and intro**: no mascot (not designed). The banner and node icons are unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Multiple-choice and word-bank exercises MUST show the mascot at the left of the
  prompt in place of the current prompt icon, with the prompt in a bubble whose tail points at
  the mascot, at the size and placement in mascot.md (about 88 × 100 px; bubble bottom-aligned).
- **FR-002**: The mascot MUST show the idle expression before an answer is checked, the sad
  expression while the wrong-answer sheet is open, and the happy expression while the
  correct-answer sheet is open.
- **FR-003**: Each new exercise, including retries, MUST start with the idle expression.
- **FR-004**: The lesson and practice summaries MUST show the celebrating mascot (about 170 px,
  centred above the title) in place of the gold star badge.
- **FR-005**: The mascot drawings MUST be the four final designs in docs/design/mascot/ (idle,
  sad, happy, celebrate), shown unchanged.
- **FR-006**: The mascot MUST be hidden from assistive technology. Prompt text, feedback
  announcements and focus behaviour MUST stay as they are.
- **FR-007**: Expression changes MUST be instant. Any optional animation MUST be off when reduced
  motion is requested.
- **FR-008**: The app icons (browser tab icon, installed-app icons in all current sizes, maskable
  icon, iOS home-screen icon) MUST be replaced by the mascot icons in docs/design/app-icon/. The
  installed app's name, background and theme colours stay as set by feature 011.
- **FR-009**: The mascot and icons MUST be available offline after the first visit, like the
  rest of the app.
- **FR-010**: Exercises MUST stay fully usable at 360 px width with no horizontal scrolling.
  Answering, checking, continuing and saved data MUST NOT change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of multiple-choice and word-bank exercises show the mascot, and 0 show the old
  prompt icons.
- **SC-002**: In 100% of checked answers, the mascot's expression matches the result (sad for
  wrong, happy for right) while the feedback sheet is open, and it is idle on the next exercise.
- **SC-003**: Every session summary shows the celebrating mascot and no star badge.
- **SC-004**: The tab icon and installed-app icons show the mascot on every target platform
  (desktop browser, Android, iOS), and the masked Android icon shows the whole mascot.
- **SC-005**: The exercise screens and the summary match mockups 03–07 (owner judgement in the
  manual check).
- **SC-006**: All existing tests still pass, and screen-reader output for exercises and
  summaries is unchanged.

## Assumptions

- Open points in mascot.md are settled by these defaults:
  - expressions switch instantly, with no animation;
  - no mascot on the lesson path or intro;
  - the mascot has no name and appears in no copy.
  Each can be a later roadmap item.
- The mascot's leaves stay green (it is a sprout). This is part of the drawing, not a UI
  "correct" colour, so feature 011's rule that green means only "correct" applies to UI colours,
  not to illustrations.
- The icon files in docs/design/app-icon/ are final and keep today's names and sizes.
- The lesson path's own icons (the banner speech bubble, the current-node star) are not the
  exercise prompt icon or the summary badge, and they stay unchanged.
- The summary is shared by lessons and practice sessions, so both get the celebrating mascot.
