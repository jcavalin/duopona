# Feature Specification: Dark Duolingo-Style UI Redesign

**Feature Branch**: `004-ui-redesign`

**Created**: 2026-11-03

**Status**: Implemented (DevTools checks V8, V10–V13 and phone checks D1–D3 skipped by owner decision, tasks T027, T030–T031)

**Input**: User description: "Restyle Duopona to the dark Duolingo-style design in docs/design/ui-redesign.md"

**Design reference**: [docs/design/ui-redesign.md](../../docs/design/ui-redesign.md): seven
mockups in `docs/design/mockups/` (the source of truth for look and layout), color tokens, type
and shape rules. This spec states *what* must be true; the reference states how each screen looks.

## Clarifications

### Session 2026-11-03

- Q: Dark only, or dark + light following the device setting? → A: Dark only; light mode may
  become a later roadmap item.
- Q: Should number keys select multiple-choice options? → A: Yes, keys 1–n select the matching
  option; the numbers are shown on the cards.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play a lesson in the new look (Priority: P1)

A learner opens a lesson and plays it on their phone. The introduction shows the new words as
cards and the grammar point in a tinted card, with a large Start button at the bottom. Each
exercise has a top bar with a close (X) button, a progress bar and an "n/total" counter; the
prompt sits in a bubble next to an icon; options are large cards and the Check button stays at
the bottom of the screen. After Check, a colored sheet slides up from the bottom: green with
"pona! Correct." or red with "Not quite" and the correct answer, each with its own Continue
button. Everything works exactly as before; only the presentation changes.

**Why this priority**: Lesson play is where learners spend nearly all their time. Restyling it
delivers most of the redesign's value even if the lesson path is still the old list.

**Independent Test**: Open any unlocked lesson, play it to the end with at least one wrong
answer, and compare each screen with mockups 02–06.

**Acceptance Scenarios**:

1. **Given** an unlocked lesson, **When** the learner opens it, **Then** the introduction shows
   the book chapter and exercise count, the lesson title, every new word with its meaning as a
   card in two columns, the grammar point in a tinted card, a close (X) button that returns to
   the lesson path, and a full-width Start button fixed at the bottom (mockup 02).
2. **Given** an exercise is showing, **When** the learner looks at the top of the screen,
   **Then** they see a close (X) button, a progress bar and an "n/total" counter with the same
   values as today's progress display (FR-007 of 001).
3. **Given** a multiple-choice exercise, **When** the learner taps an option, **Then** that
   option is shown as selected (green border and tint) and the bottom Check button becomes
   active (mockup 03). Pressing that option's number key on a keyboard does the same.
4. **Given** a word-bank exercise, **When** the learner taps a tile, **Then** it moves onto the
   ruled answer lines and leaves a grey placeholder of the same size in the bank; tapping it in
   the answer returns it (mockup 05).
5. **Given** a word-bank exercise that practises the lesson's grammar point, **When** it is
   shown, **Then** a "Grammar" tag appears next to the instruction (mockup 05).
6. **Given** the learner submits a wrong answer, **When** feedback appears, **Then** a red sheet
   replaces the bottom bar with "Not quite", the correct answer and a red Continue button; the
   options can no longer be changed and the chosen option is shown in red (mockup 04).
7. **Given** the learner submits a correct answer, **When** feedback appears, **Then** a green
   sheet replaces the bottom bar with "pona! Correct." and a Continue button (mockup 06).
8. **Given** any lesson screen, **When** the learner plays it through, **Then** the lesson flow
   (retry of missed exercises, scoring, quitting, saving progress) behaves exactly as before
   the redesign.

---

### User Story 2 - Follow the course on a lesson path (Priority: P2)

A learner opens Duopona and sees a top bar with the "duopona" wordmark and a "done / total"
counter, a green course banner ("Course · 1 of 17 done", "Learn Toki Pona", following the
book), and below it the 17 lessons as round nodes along a zigzag path. Completed lessons are
gold with a check, the next lesson to play is green with a star, a ring and a "Start" label,
and locked lessons are grey with a lock. Tapping a completed or current node opens that lesson.

**Why this priority**: The path is the first screen and makes progress through the course
visible at a glance, but the lesson list already works, so it can follow lesson play.

**Independent Test**: With a few lessons completed, open the app and compare the home screen
with mockup 01; tap each kind of node.

**Acceptance Scenarios**:

1. **Given** the learner has completed N of the 17 lessons, **When** they open the app, **Then**
   the top bar shows "N / 17" and the banner shows "N of 17 done".
2. **Given** the lesson path is showing, **When** the learner looks at the nodes, **Then** each
   completed lesson is a gold node with a check, the first not-yet-completed unlocked lesson is
   the highlighted current node with a "Start" label, and every locked lesson is a grey node
   with a lock; each node shows its lesson title beneath it.
3. **Given** a completed or current node, **When** the learner taps it, **Then** that lesson's
   introduction opens.
4. **Given** a locked node, **When** the learner taps it, **Then** nothing starts and the node
   is announced to assistive technology as locked.
5. **Given** the current lesson is further down than the first screen, **When** the learner
   opens the path, **Then** the current node is scrolled into view.
6. **Given** the path is showing, **When** the learner scrolls to the end, **Then** the course
   credit line naming the book and tokipona.org is still shown.

---

### User Story 3 - Celebrate the end of a lesson (Priority: P3)

When a learner finishes a lesson, they see a gold star badge, "Lesson complete!" with the lesson
title, a gold "Correct X / Y" card and, when there is a next lesson, a green "Unlocked <next
lesson>" card. A Continue button returns to the path, and "Replay lesson" plays the same lesson
again from its introduction.

**Why this priority**: It rewards finishing and tells the learner what is next, but the plain
summary already reports the score.

**Independent Test**: Finish a lesson that has a next lesson, check the screen against mockup
07, then use each of its two buttons.

**Acceptance Scenarios**:

1. **Given** the learner finishes a lesson, **When** the summary appears, **Then** it shows the
   badge, "Lesson complete!", the lesson title and "Correct X / Y" where X is first-try correct
   answers and Y the number of exercises (FR-008 of 001).
2. **Given** the finished lesson has a next lesson, **When** the summary appears, **Then** an
   "Unlocked" card names that next lesson.
3. **Given** the finished lesson is the last one of the course, **When** the summary appears,
   **Then** no "Unlocked" card is shown and the "Correct" card fills the row.
4. **Given** the summary is showing, **When** the learner taps Continue, **Then** the lesson path
   opens with the progress updated.
5. **Given** the summary is showing, **When** the learner taps "Replay lesson", **Then** the same
   lesson's introduction opens, ready to play again.

---

### Edge Cases

- **Long text**: long lesson titles, word meanings, prompts and options wrap inside their cards
  and nodes at 360 px width without horizontal scrolling or text overflowing its card.
- **Many tiles**: a word bank with many tiles wraps onto more lines; the answer area grows
  instead of overlapping the bank.
- **Small or short screens**: when content is taller than the screen (e.g. a long grammar
  explanation), it scrolls, and the fixed bottom bar or feedback sheet never covers the last
  item for good: the learner can scroll it into view above the bar.
- **Safe areas**: the top bar, bottom bars and feedback sheets stay clear of notches and the
  home indicator, in portrait and landscape, installed and in the browser.
- **All lessons done**: there is no current node; all 17 nodes are gold, the counter reads
  "17 / 17" and every node opens its lesson.
- **No lessons done**: lesson 1 is the current node, the rest are locked, and the counter reads
  "0 / 17".
- **Replaying a completed lesson**: the summary still shows the "Unlocked" card naming the next
  lesson (it stays unlocked) and progress keeps the latest score as before.
- **Offline / first visit**: the app's font and icons are part of the app, so the new look is
  the same offline and nothing is fetched from another site.
- **Larger screens**: on tablets and desktop the layout stays a centered column no wider than
  today's, with the bottom bars aligned to it.

## Requirements *(mandatory)*

### Functional Requirements

**Look and theme**

- **FR-001**: Every screen MUST follow the matching mockup in `docs/design/mockups/` for layout,
  colors (the dark-theme tokens of the design reference), typeface and the "chunky" 3D button
  style. Small differences are acceptable where a real lesson's content differs from the mockup.
- **FR-002**: The app MUST use the dark theme on every screen, whatever the device's light/dark
  setting; there is no light theme. The browser's own UI (status bar, address bar, installed
  app's title bar) MUST match the dark background.
- **FR-003**: The typeface MUST be shipped with the app so it displays offline and causes no
  request to another site (Constitution II and V).
- **FR-004**: Text and icons MUST keep a contrast of at least 4.5:1 against their background for
  body text and 3:1 for large text and icons.

**Lesson path (home)**

- **FR-005**: The home screen MUST show a top bar with the "duopona" wordmark and the number of
  completed lessons out of the course total, a course banner with the same count, and all 17
  lessons in course order as nodes along a zigzag path, followed by the existing credit line.
- **FR-006**: Each node MUST show one of three states: completed (gold, check), current (the
  first unlocked, not-yet-completed lesson: green, star, ring and "Start" label) or locked
  (grey, lock); every node MUST show its lesson title. Completed lessons MUST stay replayable
  (FR-014 of 002) and locked lessons MUST NOT be startable (FR-012 of 002).
- **FR-007**: Each node's accessible name MUST include the lesson title and its state, and for
  completed lessons the latest score (e.g. "Words and Sentences, completed, 12 of 13").
- **FR-008**: On opening the home screen, the current node MUST be scrolled into view.

**Lesson introduction**

- **FR-009**: The introduction MUST show the book chapter and number of exercises, the lesson
  title, the new words with meanings as cards in two columns, and the grammar point in a tinted
  card; a close (X) button MUST return to the path and a full-width Start button MUST be fixed
  at the bottom.

**Exercises**

- **FR-010**: Every exercise MUST show a top bar with a close (X) button that quits the lesson
  as today, a progress bar and an "n/total" counter with today's values.
- **FR-011**: The instruction MUST be the screen title, and the prompt MUST be shown in a bubble
  next to an icon tile; the icon MUST differ between word prompts and sentence prompts.
- **FR-012**: Multiple-choice options MUST be full-width cards showing their position number
  (1, 2, 3 …); the selected option MUST be visibly marked. On a keyboard, pressing a number key
  MUST select the option with that number; number keys MUST do nothing while feedback is shown
  or when no option has that number.
- **FR-013**: The word bank MUST show the answer on ruled lines; a tile moved to the answer
  MUST leave a same-size grey placeholder in the bank; exercises that practise the grammar point
  MUST show a "Grammar" tag.
- **FR-014**: The Check button MUST be full-width in a bar fixed at the bottom, disabled until
  an answer is given.

**Feedback**

- **FR-015**: After Check, a feedback sheet MUST replace the bottom bar: green with "pona!
  Correct." for a right answer, red with "Not quite" and the correct answer for a wrong one,
  each with a Continue button in the matching color. While it shows, the answer MUST NOT be
  changeable, and in multiple choice the chosen option MUST be shown green or red to match.
- **FR-016**: The feedback text MUST be announced to screen readers, and keyboard focus MUST
  move to Continue, as today.

**Lesson complete**

- **FR-017**: The summary MUST show a star badge, "Lesson complete!", the lesson title, a
  "Correct X / Y" card and, when the course has a lesson after this one, an "Unlocked" card
  naming it.
- **FR-018**: The summary MUST offer Continue (to the lesson path) and "Replay lesson" (to the
  same lesson's introduction).

**Unchanged behavior and platform**

- **FR-019**: Lesson content, lesson flow, scoring, unlocking and saved progress MUST behave
  exactly as before; no saved data format changes.
- **FR-020**: All interactive targets MUST be at least 44×44 px, all layouts MUST work from
  360 px width without horizontal scrolling and respect safe areas, and the app MUST stay fully
  usable offline and when installed (Constitution V).
- **FR-021**: Every action MUST remain usable with a keyboard alone, with a visible focus
  indicator on the dark background.
- **FR-022**: Animations (e.g. the feedback sheet sliding in) MUST be skipped when the device
  asks for reduced motion.

### Key Entities

No new data. The screens read existing data only: the course's lessons (title, book chapter,
new words, grammar, exercises), the learner's saved progress (completed lessons and their
latest scores) and the current lesson session (position, answers, feedback).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Each of the seven mockup screens, recreated with the same data in the app at
  390×844, matches its mockup in layout, colors and text on side-by-side review, with no
  difference the owner considers a defect.
- **SC-002**: 100% of the existing automated lesson-flow, progress and course-content checks
  pass after the redesign, updated only for changed wording.
- **SC-003**: A learner can go from opening the app to the first exercise of the current lesson
  in 2 taps (current node, Start).
- **SC-004**: On a 360 px wide screen, none of the 17 lessons' screens (introduction, every
  exercise, both feedback sheets, summary) scrolls horizontally or hides text.
- **SC-005**: All text and icon color pairs used meet the contrast levels in FR-004.
- **SC-006**: With the network off after one online visit, every screen looks the same as
  online, including the typeface.
- **SC-007**: The redesign is checked on an iPhone (Safari) and an Android phone (Chrome), in the
  browser and installed, with no layout defect left open.

## Assumptions

- The mockups are the source of truth; where this spec and a mockup disagree on looks, the
  mockup wins, and where they disagree on behavior, this spec wins.
- The instruction wording changes to the mockups' style ("Choose the Toki Pona", "Choose the
  meaning", "Write this in Toki Pona", "Write this in English"); the meaning of each exercise
  type is unchanged.
- The prompt icon depends only on the prompt kind, not on what the words mean: multiple-choice
  prompts (words and short phrases) get one icon, word-bank prompts (sentences) another; no
  per-word artwork is needed.
- The current-node "Start" label is part of the node, not a separate action.
- The per-lesson score, today visible on the lesson card, moves to the node's accessible name
  (FR-007) and the summary; the path does not show it visually, as in the mockup.
- No sounds, hearts, XP, streaks or animations beyond the feedback sheet and button presses are
  in scope; streaks remain a later roadmap item.
- Feature 003's remaining manual phone checks (its T014, T016–T021) are deferred by the owner's
  choice (2026-11-03) and do not block this feature. They can be run together with this
  feature's phone check (SC-007), which covers the new screens on the installed app.
