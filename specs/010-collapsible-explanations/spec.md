# Feature Specification: Collapsible Mistake Explanations

**Feature Branch**: `010-collapsible-explanations`

**Created**: 2026-11-04

**Status**: Implemented (phone check M6 deferred by owner decision, task T014)

**Input**: User description: "Collapsible mistake explanations: the explanation shown after a
wrong answer (added in feature 008 – word meanings, grammar point and book lesson) should be
hidden by default. The learner sees a control to reveal it, and when they click/tap it, the
explanation appears."

**Design**: mockups [04a](../../docs/design/mockups/04a-wrong-explanation-hidden.png) (hidden) and
[04b](../../docs/design/mockups/04b-wrong-explanation-shown.png) (shown), with the notes on 4a/4b
and the "Mistake explanation toggle" open point in
[docs/design/ui-redesign.md](../../docs/design/ui-redesign.md). The mockups also show the purple
theme and the mascot; those are separate roadmap items and out of scope here (this feature keeps
the current theme and prompt icons).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explanation hidden until asked for (Priority: P1)

A learner answers an exercise wrong. The feedback sheet shows "Not quite", the correct answer and
the Continue button, as before, but the explanation (word meanings, the wrong pick's meaning, the
grammar point, book lesson and note from 008) is not shown. Instead, a "Why?" toggle with a
down chevron sits beside "Not quite" and the correct answer, at the sheet's top right (mockup 4a). A learner who already understands the mistake simply continues; one who
wants to know why taps "Why?" and the full explanation appears in the sheet.

**Why this priority**: This is the whole feature. A short sheet keeps the rhythm of a session fast
for learners who only slipped, while the explanation stays one tap away for those who need it.

**Independent Test**: Answer any exercise wrong and check that the sheet shows the correct answer
and a "Why?" control but no explanation; tap the toggle and check that the same explanation 008
showed now appears in a card inside the sheet (mockup 4b).

**Acceptance Scenarios**:

1. **Given** the Lesson 4 exercise "group / community" (choose the Toki Pona word), **When** the
   learner picks "tomo", **Then** the sheet shows "Not quite", the correct answer "kulupu", a
   "Why?" control and Continue, and does not show "kulupu: group / community" or "tomo means …".
2. **Given** that sheet, **When** the learner taps "Why?", **Then** the toggle reads "Hide" with an
   up chevron, and the explanation appears in a darker card between the correct answer and
   Continue, with exactly the content 008 shows: word meanings, wrong-pick meaning, and, when the
   exercise has them, a divider then the grammar point title, its source lesson (e.g. "From
   Lesson 3 · Nouns and Adjectives"; mockup 4b's "Lesson 2" label is a mockup error, the app uses
   the course's chapter and title) and the note.
3. **Given** the explanation is shown, **When** the learner taps "Hide", **Then** the explanation is
   hidden and the toggle reads "Why?" again.
4. **Given** the learner revealed the explanation on one exercise, **When** they miss the next
   exercise, **Then** its explanation starts hidden again.
5. **Given** any exercise, **When** the learner answers correctly, **Then** the sheet is unchanged
   (no explanation and no "Why?" control).
6. **Given** a wrong answer, **When** the learner taps Continue without revealing the
   explanation, **Then** the session goes on exactly as before.

---

### Edge Cases

- A wrong answer with nothing to explain (008 shows no explanation block): no "Why?" control is
  shown. 008 SC-001 says every exercise has at least one line, so this is a safeguard only.
- Keyboard: Continue keeps the focus when the sheet opens, as today, so Enter still continues
  straight away; the "Why?" control is reachable from the keyboard (Shift+Tab from Continue) and works with
  Enter and Space.
- Screen readers: the feedback announcement says "Not quite" and the correct answer only; the
  control announces whether the explanation is shown or hidden, and the explanation is next in
  reading order once revealed.
- 360 px width / long explanations: revealed, the sheet grows up to about 60% of the screen
  height; beyond that only the explanation card scrolls, while the heading, correct answer,
  toggle and Continue stay visible.
- The same exercise missed again later in the session (retry) starts with the explanation hidden.
- Offline: works like the rest of the app.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: After a wrong answer, the feedback sheet MUST show the correct answer as today and
  MUST NOT show the 008 explanation until the learner asks for it.
- **FR-002**: When an explanation exists for the missed exercise, the sheet MUST show a toggle
  beside the heading and correct answer, labelled "Why?" with a down chevron while hidden and
  "Hide" with an up chevron while shown (mockups 4a/4b); when none exists, no toggle is shown.
- **FR-003**: Activating the toggle MUST reveal the full 008 explanation, unchanged in content and
  order, in a card inside the sheet between the correct answer and Continue, with a divider
  before the grammar section and the source lesson labelled "From Lesson N · Title"; activating
  it again MUST hide it.
- **FR-003a**: Shown, the sheet MUST NOT grow beyond about 60% of the screen height (with a
  minimum height so very short screens stay usable); longer
  explanations MUST scroll inside the card only, keeping the heading, correct answer, toggle and
  Continue visible.
- **FR-003b**: The toggle and the card MUST follow the colours given for 4a/4b in
  ui-redesign.md (red-family tones of the wrong-answer sheet); the explanation text MUST meet
  4.5:1 contrast.
- **FR-004**: Every new wrong-answer sheet MUST start with the explanation hidden; whether it was
  revealed MUST NOT be remembered between exercises, sessions or app restarts.
- **FR-005**: After a right answer, the sheet MUST be unchanged (no control, no explanation).
- **FR-006**: The control MUST be a target of at least 44×44 CSS px (Principle V), usable by
  mouse, touch and keyboard, and MUST expose its shown/hidden state to screen readers.
- **FR-007**: Continue MUST keep the initial focus and stay reachable whether the explanation is
  hidden or shown; revealing it MUST NOT continue the session or change the answer.
- **FR-008**: Revealing or not revealing the explanation MUST NOT change scoring, mistake
  tracking, progress, streaks or any saved data; no new data is stored.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of wrong-answer sheets open with the explanation hidden and, when an
  explanation exists, a "Why?" control.
- **SC-002**: One tap (or one key press on the focused control) reveals the explanation, with
  the same content 008 shows for that exercise.
- **SC-003**: A learner who does not want the explanation continues in the same single action as
  before this feature (tap Continue or press Enter).
- **SC-004**: At 360 px width, the sheet is fully usable with the explanation hidden and with the
  longest explanation in the course shown, with no horizontal scrolling, and Continue visible
  without scrolling the sheet.
- **SC-005**: The hidden and shown sheets match mockups 4a and 4b (owner judgement in the manual
  check), apart from the purple theme and the mascot.

## Assumptions

- The whole explanation (word meanings, wrong-pick meaning, grammar section) is collapsed and
  revealed together; there is no partial preview.
- No setting to always show explanations; hidden-by-default applies to everyone.
- Purple brand colours and the mascot shown in the mockups come later as their own features
  (ROADMAP "Next"); this feature's toggle and card colours don't depend on the brand colour.
- No animation is required; if one is added it respects reduced-motion settings.
- 008's explanation content and rules stay as they are; its tests are updated only to open the
  explanation first. This feature only changes when the explanation is shown.
