# Feature Specification: Reorder Answer Tiles

**Feature Branch**: `009-reorder-answer-tiles`

**Created**: 2026-11-04

**Status**: Implemented (phone check S-D1 deferred by owner decision, task T020)

**Input**: User description: "It would be nice to be possible to drag and drop the option when we
are formulating a phrase. Imagine that the user selected an incorrect order at the beginning of
the sentence, but noticed it before checking the answer. Now the user has to remove everything
and start to select from the scratch."

## Clarifications

### Session 2026-11-04

- Q: Should learners also be able to drag a word from the word bank straight into a chosen spot
  in the sentence? → A: Yes; bank words can be dragged into a chosen spot (User Story 3), and a
  tap still adds at the end.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Drag a placed word to a new spot (Priority: P1)

A learner is building a sentence in a word-bank exercise and has placed "mi li wawa" when they
notice the words are out of order. Instead of tapping every word back into the bank and starting
over, they press on a word in the answer line, drag it to where it belongs, and let go. The other
words make room for it, and the sentence now reads in the new order. A quick tap on a placed word
still sends it back to the bank, as it does today.

**Why this priority**: This is the problem the learner reported: fixing one misplaced word
currently means rebuilding the whole sentence. Dragging within the answer line solves it on its
own.

**Independent Test**: In a word-bank exercise, place three words, drag the first to the end, and
check that the answer line shows the new order and that Check grades that order.

**Acceptance Scenarios**:

1. **Given** the answer line reads "wawa mi" (in that order), **When** the learner drags "mi"
   in front of "wawa" and lets go, **Then** the answer line reads "mi wawa" and checking it is
   graded as "mi wawa".
2. **Given** a placed word, **When** the learner taps it without moving it, **Then** it goes back
   to the word bank, as today.
3. **Given** a word is being dragged, **When** the learner moves it over the answer line, **Then**
   the spot where it will land is shown by the other words making room, before they let go.
4. **Given** the answer line wraps onto a second row, **When** the learner drags a word from the
   second row to the start of the first row, **Then** it lands at the start.
5. **Given** the learner drags a placed word and drops it on the word bank, **Then** the word goes
   back to the bank (the same as tapping it).

---

### User Story 2 - Reorder without dragging (Priority: P2)

A learner who uses a keyboard or a screen reader moves to a placed word and uses the left and
right arrow keys to move it one place earlier or later in the answer line. Focus stays on the
word they moved, so they can keep moving it. Screen readers say how to move or remove a placed
word.

**Why this priority**: Dragging is a pointer-only gesture; the same fix needs a non-pointer way
for the app to stay usable by everyone. It builds on Story 1's order change.

**Independent Test**: With the keyboard only, place three words, focus the first one, press the
right arrow twice, and check that it is now last and still focused.

**Acceptance Scenarios**:

1. **Given** "wawa mi" is placed and "mi" has focus, **When** the learner presses the left arrow,
   **Then** the line reads "mi wawa" and "mi" still has focus.
2. **Given** the first placed word has focus, **When** the learner presses the left arrow,
   **Then** nothing changes.
3. **Given** a placed word has focus, **When** a screen reader reads it, **Then** it hears the
   word and a hint that it can be removed, dragged, or moved with the arrow keys.

---

### User Story 3 - Drop a bank word into a chosen spot (Priority: P3)

A learner has placed "kulupu wawa" and sees that "sina" belongs between the two words. They
press on "sina" in the word bank, drag it into the answer line between the two placed words, and
let go. The word lands there, and its place in the bank becomes empty, as when it is tapped. A
quick tap on a bank word still adds it at the end, as today.

**Why this priority**: It saves the extra reorder step after adding a word, and it makes every
word on the screen behave the same way (any word can be dragged). Stories 1 and 2 already let
the learner fix the order, so this is a convenience on top.

**Independent Test**: Place two words, drag a third word from the bank between them, and check
that the answer line shows it in the middle and that the bank shows its empty place.

**Acceptance Scenarios**:

1. **Given** "kulupu wawa" is placed, **When** the learner drags "sina" from the bank between
   them and lets go, **Then** the answer line reads "kulupu sina wawa" and the bank shows an empty
   place where "sina" was.
2. **Given** a bank word, **When** the learner taps it without moving it, **Then** it is added at
   the end of the answer line, as today.
3. **Given** a bank word is being dragged, **When** it is over the answer line, **Then** the
   placed words make room where it will land (as in Story 1); **When** the learner lets go outside
   the answer line, **Then** the word stays in the bank.
4. **Given** the learner uses the keyboard, **Then** adding a bank word (it goes to the end) and
   moving it with the arrow keys (Story 2) reaches any position a drag can.

---

### Edge Cases

- A press that moves only a few pixels (a shaky tap) counts as a tap and removes the word; it
  does not start a drag.
- Repeated words (e.g. two "li" tiles) stay distinct: moving one never moves or merges the other.
- Dragging a word and letting go in the same spot leaves the order unchanged and does not remove
  the word.
- A bank word dragged over the answer line and then away again (dropped elsewhere) returns to
  its place in the bank; the answer line goes back to how it was.
- Dropping a placed word outside both the answer line and the word bank (e.g. over the instruction text) keeps
  the word in the answer line at the last spot shown.
- If the drag is interrupted (an incoming call, the browser cancelling the gesture), the word
  stays in the answer line; nothing is lost.
- After Check, placed words can no longer be moved or removed, as today.
- On a phone, pressing and dragging a placed word moves the word, not the page. Scrolling still
  works when the gesture starts anywhere else on the screen.
- The word being dragged stays visible under the finger and is not hidden by the finger alone:
  the learner can see where it will land from the gap in the answer line.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: In a word-bank exercise, before Check, learners MUST be able to move a placed word
  to any other position in the answer line by pressing on it, dragging it, and letting go, with
  touch and with a mouse.
- **FR-002**: While a word is dragged, the answer line MUST show where it will land by moving the
  other placed words to make room, updating as the pointer moves, including across wrapped rows.
- **FR-003**: A press on a placed word that ends without a drag MUST remove it to the word bank,
  unchanged from today. A drag MUST NOT also remove the word, except when it is dropped on the
  word bank (FR-004).
- **FR-004**: Dropping a dragged placed word on the word bank MUST send it back to the bank.
- **FR-004a**: Before Check, learners MUST be able to drag a word from the word bank into any
  position of the answer line; while dragged over the answer line, the landing spot MUST be shown
  as in FR-002. Dropped elsewhere, the word MUST stay in the bank. A press on a bank word that ends
  without a drag MUST add it at the end, unchanged from today.
- **FR-005**: Learners MUST be able to move a focused placed word one position earlier or later
  with the left and right arrow keys; focus MUST stay on the moved word.
- **FR-006**: Placed words MUST expose to assistive technology that they can be removed, dragged,
  or moved with the arrow keys.
- **FR-007**: The order Check grades MUST be the order shown in the answer line at the moment
  Check is pressed.
- **FR-008**: Reordering MUST NOT be possible after Check (while feedback shows).
- **FR-009**: Reordering MUST NOT change scoring, mistake tracking, progress, streaks or any saved
  data; no new data is stored.
- **FR-010**: Reordering MUST work at 360 px width, offline, and on current iOS Safari and Android
  Chrome, in the browser and installed (Principle V). Dragging a placed word MUST NOT scroll the
  page.

### Key Entities

- **Answer line** (on screen, not stored): the ordered list of words the learner has placed. This
  feature lets the learner change that order; what Check receives is unchanged in kind.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A learner can fix one misplaced word in a placed sentence with a single drag (one
  gesture), where today it takes removing and re-adding every word from that point on.
- **SC-002**: 100% of taps on placed words (press and release without moving) still remove the
  word, so the existing way of answering keeps working.
- **SC-002a**: A learner can add a word at any position of the sentence with a single drag from
  the bank, and 100% of taps on bank words still add the word at the end.
- **SC-003**: Every reordering that can be done by dragging can also be done with the keyboard
  alone.
- **SC-004**: At 360 px width on a phone, the learner can move a word from the end of a two-row
  answer line to its start without the page scrolling and without a word ending in the wrong
  spot (owner's device check).

## Assumptions

- Only word-bank exercises are affected; multiple-choice exercises have no order to change.
- The grading of answers is unchanged: Check grades the shown order exactly as it grades the
  tapped order today.
- No smooth animation is required: words make room by shifting into their new places as the
  dragged word moves. A movement animation may be added later if it feels abrupt.
- Starting a drag needs a small movement (a few pixels) rather than a long press, so dragging
  feels immediate. This is what lets taps keep removing words.
- Phone checks follow Principle IV: what the test environment can simulate (order changes,
  keyboard moves, taps vs drags) is tested automatically; the touch gesture on real phones is a
  written manual check in the quickstart, which the owner may waive.
- The page jump after Check (reported together with this request on 2026-11-04) is a separate
  bug fix, not part of this feature.
