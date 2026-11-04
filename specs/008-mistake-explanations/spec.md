# Feature Specification: Mistake Explanations

**Feature Branch**: `008-mistake-explanations`

**Created**: 2026-11-04

**Status**: Implemented (phone check S-D1 skipped by owner decision, task T025)

**Input**: User description: "Mistake explanations: when the learner answers an exercise wrong,
explain why the right answer is right (e.g. the grammar point or word meaning involved, tied to
the book lesson it comes from), not only show the correct answer." (ROADMAP.md, Ideas.)

## Clarifications

### Session 2026-11-04

- Q: Which exercises get a written grammar note? → A: Only the exercises marked as practising
  grammar (49); notes are written during implementation, the owner may review them.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Word meanings behind the right answer (Priority: P1)

A learner answers an exercise wrong. Under "Correct answer", the feedback sheet now also lists
the course words in the right answer with their meanings (e.g. "kulupu: group / community"), so
the learner sees *why* that answer is right rather than just what it is. When the learner picked
a wrong option that is itself a course word, the sheet also says what that word means (e.g.
"sin means new / fresh / extra"), so the confusion is cleared up on the spot.

**Why this priority**: Most exercises (word meaning and short sentences) are missed because of
a word the learner did not know or mixed up. Showing the meanings fixes the commonest mistake and
needs no extra course writing, since every course word already has a meaning.

**Independent Test**: Answer any exercise wrong and check that the feedback sheet lists each
course word of the right answer with its meaning, and, for a wrong pick that is a course word,
that word's meaning.

**Acceptance Scenarios**:

1. **Given** the Lesson 4 exercise "group / community" (choose the Toki Pona word), **When** the
   learner picks "tomo", **Then** the sheet shows the correct answer "kulupu", the line
   "kulupu: group / community", and "tomo means house / building / room".
2. **Given** the sentence exercise "kulupu sina li wawa" (build the English), **When** the
   learner answers wrong, **Then** the sheet lists kulupu, sina, li and wawa with their meanings,
   in sentence order.
3. **Given** any exercise, **When** the learner answers correctly, **Then** the sheet is
   unchanged from today (no explanation shown).

---

### User Story 2 - The grammar point and its lesson (Priority: P2)

When the missed exercise practises its lesson's grammar point (e.g. "mi and sina need no li"),
the sheet names that grammar point and the book lesson it comes from ("Lesson 4 · You and I"),
together with a short note on why the right answer follows it. In practice and weak-word review
sessions, which mix lessons, the lesson named is the one the exercise belongs to.

**Why this priority**: Grammar mistakes (word order, a missing or extra li) are not explained by
word meanings alone, and naming the lesson lets the learner go back to the right introduction.
It depends on writing short notes, so it comes after Story 1.

**Independent Test**: Answer a grammar exercise wrong (e.g. "I am strong." built as
"mi li wawa") and check that the sheet names the grammar point, the book lesson, and a note on
why the right answer is right.

**Acceptance Scenarios**:

1. **Given** the Lesson 4 exercise "I am strong." **When** the learner builds "mi li wawa",
   **Then** the sheet shows "mi wawa", the grammar point "mi and sina need no li" with
   "Lesson 4 · You and I", and a note such as "With mi alone as the subject, li is left out."
2. **Given** a practice session mixing several lessons, **When** the learner misses a grammar
   exercise from Lesson 9, **Then** the sheet names Lesson 9 and its grammar point.
3. **Given** a missed exercise that does not practise a grammar point, **Then** only the word
   meanings (Story 1) are shown, with no grammar section.

---

### Edge Cases

- The words listed are always those of the exercise's Toki Pona side: the prompt for Toki Pona →
  English, the answer for English → Toki Pona (the words 006 counts as tested). Words that appear
  only in the English side are not listed.
- A word appearing twice in a sentence is listed once.
- A wrong pick that is not a single course word (an English option, or a wrong Toki Pona phrase
  such as "sin lipu"): no "means" line for the pick; the right-answer explanation still shows.
- The sheet grows taller with the explanation: at 360 px width it MUST stay fully readable and
  the Continue button MUST stay reachable without horizontal scrolling; long content scrolls
  inside the sheet.
- The same exercise missed again later in the session (retry) shows the same explanation.
- Offline: explanations work offline like all other lesson content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: After a wrong answer, the feedback sheet MUST keep showing the correct answer as
  today and MUST add an explanation below it. After a right answer, no explanation is shown.
- **FR-002**: The explanation MUST list each distinct course word of the exercise's Toki Pona
  text (as defined by 006 FR-007) with its course meaning, in order of first appearance.
- **FR-003**: For a multiple-choice exercise, when the learner's pick is a single course word
  different from the right answer, the explanation MUST also state that word's meaning.
- **FR-004**: When the missed exercise practises its lesson's grammar point, the explanation
  MUST name the grammar point's title and the exercise's lesson: its chapter reference (e.g.
  "Lesson 4", or "Dictionary" for the extra lessons) and title, in every session kind (lesson, practice, review).
- **FR-005**: Each of the course's exercises marked as practising grammar (49) MUST carry a short
  note (one or two sentences) on why its right answer follows the grammar point, shown with the
  grammar point after a wrong answer. Other exercises get no note. Notes are written as part of
  this feature, like the existing lesson content.
- **FR-006**: Explanation text MUST be original writing for Duopona, consistent with the book
  but not copied from it (as with existing glosses and grammar text).
- **FR-007**: Explanations MUST be readable by screen readers as part of the feedback
  announcement, and MUST NOT delay or hide the Continue button.
- **FR-008**: Explanations MUST NOT change scoring, mistake tracking, progress, streaks or any
  saved data; no new data is stored.
- **FR-009**: Explanations MUST work offline and at 360 px width (Principle V).

### Key Entities

- **Explanation** (shown, not stored): built for a missed exercise from the exercise's course
  words and their meanings, the learner's wrong pick (when a course word), and, for grammar
  exercises, the lesson's grammar point, book lesson and a short note.
- **Grammar note** (course content): a short sentence attached to an exercise saying why its
  right answer follows the lesson's grammar point.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the course's exercises show at least one explanation line (a word meaning
  or a grammar point) when answered wrong.
- **SC-002**: 100% of exercises marked as practising grammar name their grammar point and book
  lesson, and show their note, when answered wrong.
- **SC-003**: For every multiple-choice exercise whose options are single course words, a wrong
  pick shows that word's meaning.
- **SC-004**: At 360 px width, the feedback sheet with the longest explanation in the course is
  fully readable and Continue is reachable without horizontal scrolling.
- **SC-005**: Explanations stay short enough to read and continue within about 15 seconds: at
  most one line per course word plus a grammar note of ≤ 2 sentences and ≤ 160 characters
  (enforced by course content tests; judged by the owner in the 360 px check).

## Assumptions

- Word meanings come from the existing course glossary (one short meaning per word), so Story 1 needs no new
  course writing.
- "Course word" and "the exercise's words" reuse 006's tested-words rule, so explanations and
  weak-word tracking agree on which words an exercise involves.
- The book lesson shown is the lesson the exercise is defined in, with its chapter reference
  (e.g. "Lesson 4") and title.
- No link or button to reopen the lesson introduction from the sheet in this feature; naming the
  lesson is enough. A "review this lesson" link can be a later idea.
- Explanations are shown only after wrong answers, as requested; no "explain" option after right
  answers.
- English is the only interface language, as today.
