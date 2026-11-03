# Feature Specification: Practice Session and Review Weak Words

**Feature Branch**: `006-practice-weak-words`

**Created**: 2026-11-03

**Status**: Implemented (360 px/offline DevTools checks and phone check skipped by owner decision, tasks T017, T038)

**Input**: User description: "practice session and review weak words" (ROADMAP.md, Next:
"Practice session: a 'Practice' button that builds a ~10-exercise session mixed from all
completed lessons, using the existing lesson flow. Small; reuses current exercises." and
"Review weak words: practice that favours words the learner got wrong before. Needs per-word
mistake tracking (builds on Practice session).")

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mixed practice from completed lessons (Priority: P1)

A learner who has completed at least one lesson taps **Practice** on the home screen. The app
builds a short session of about 10 exercises drawn at random from all the lessons they have
completed, and plays it with the same exercise screens, feedback, repeat-until-correct rule and
summary as a lesson. When it ends, the learner sees how many they got right first time and
returns to the home screen. Lesson progress and unlocking are not affected.

**Why this priority**: It is the base the weak-word review builds on, and on its own it gives
learners a way to keep old material fresh without replaying whole lessons.

**Independent Test**: Complete two lessons, tap Practice, play the session to the end, and
confirm every exercise came from one of those two lessons, the summary shows the first-try
score, and the lesson list (completed lessons, scores, unlocking) is unchanged.

**Acceptance Scenarios**:

1. **Given** a learner has completed no lessons, **When** they view the home screen, **Then**
   Practice is shown as unavailable with a short hint that it opens after the first lesson.
2. **Given** a learner has completed one or more lessons, **When** they tap Practice, **Then**
   a session starts with 10 exercises, each taken from a completed lesson, with no exercise
   appearing twice in the first pass.
3. **Given** a learner has completed several lessons, **When** they start Practice twice,
   **Then** the two sessions are not the same set in the same order (random selection).
4. **Given** a practice session is running, **When** the learner answers wrong, **Then** they
   get the same feedback as in a lesson and the exercise is repeated at the end of the session
   until answered correctly.
5. **Given** the learner answers the last exercise correctly, **When** they continue, **Then**
   a practice summary shows a "Correct" card with N / 10 (first-try correct) and a button back to the home screen
   and a button to practise again.
6. **Given** a learner finishes or quits a practice session, **When** they return to the lesson
   list, **Then** completed lessons, their saved scores and which lessons are unlocked are
   exactly as before.
7. **Given** a practice session is running, **When** the learner quits (Quit button, browser
   Back), **Then** the session is discarded and they return to the home screen.

---

### User Story 2 - Words the learner gets wrong are remembered (Priority: P2)

Every time a learner answers an exercise wrong, in a lesson or in practice, the app notes the
Toki Pona words that exercise was testing as a mistake for each of those words. When the
learner later answers an exercise with that word correctly on the first try, the word moves
back towards "known". These records are saved on the device and survive reloads.

**Why this priority**: Without per-word mistake records there is nothing for the weak-word
review to favour. It has no visible screen of its own, so on its own it delivers little; it is
split out so it can be built and tested before the review.

**Independent Test**: In a fresh lesson, answer the exercise for *kili* wrong, finish the
lesson, reload, and confirm (through the saved data in tests, or the review becoming available
once US3 exists) that *kili* is recorded as weak; then answer a *kili* exercise right first
time twice and confirm it is no longer weak.

**Acceptance Scenarios**:

1. **Given** an exercise whose Toki Pona text contains the words *kili* and *pona*, **When**
   the learner answers it wrong the first time, **Then** both words gain one mistake.
2. **Given** a word has mistakes, **When** the learner answers an exercise containing it
   correctly at the first try, **Then** that word's mistake count goes down by one, to no
   lower than zero, unless the word was missed earlier in the same session.
   *(Clarified 2026-11-03 after the Chrome check: otherwise a miss was usually cleared by later
   sentences with the same word, e.g. li, before the session ended.)*
3. **Given** the learner answers the same exercise wrong several times in one session (retries),
   **When** the session ends, **Then** its words gained only one mistake for that exercise in
   that session.
4. **Given** the learner quits a lesson or practice session midway, **When** they return
   later, **Then** mistakes and first-try corrects already given in that session are kept.
5. **Given** mistake records are saved, **When** the app is reloaded or reopened offline,
   **Then** they are still there.
6. **Given** saved mistake records are missing, unreadable or from an unknown format, **When**
   the app loads, **Then** it starts with no weak words and lesson progress is unaffected.

---

### User Story 3 - Review weak words (Priority: P3)

A learner who has weak words can start a review session of about 10 exercises chosen to cover
the words they have got wrong most, again only from completed lessons, played with the same
flow as Practice. Getting those exercises right reduces the words' mistake counts, so words
drop out of the review once the learner knows them.

**Why this priority**: It makes practice targeted, but it needs both US1 (the session flow) and
US2 (the mistake records).

**Independent Test**: With a few known weak words (from US2) and several completed lessons,
start the review and confirm that most exercises contain at least one weak word, words with
more mistakes appear before words with fewer, and answering them right first time removes them
from the weak list.

**Acceptance Scenarios**:

1. **Given** a learner has no weak words, **When** they view the home screen, **Then** the
   "Review weak words" button is shown as unavailable with a short reason.
2. **Given** a learner has weak words, **When** they start the review, **Then** every exercise
   in the first pass contains at least one weak word, as long as completed lessons have enough
   such exercises; any remaining places are filled with random exercises from completed lessons.
3. **Given** two weak words with different mistake counts, **When** the review is built and
   there are not enough places for both, **Then** the word with more mistakes is included.
4. **Given** a review session is finished, **When** the learner returns home, **Then** words
   answered right first time have one mistake fewer, and the review becomes unavailable if no
   weak words are left.
5. **Given** a learner has weak words, **When** they view the home screen, **Then** a "Review
   weak words" button is shown next to Practice, separate from it; Practice itself stays a
   purely random mix (FR-002).

---

### Edge Cases

- Fewer than 10 distinct exercises across completed lessons: not possible with the current
  course (every lesson has more than 10), but the session MUST then use all available
  exercises once rather than repeat or fail.
- Fewer exercises containing weak words than places in the review: fill the rest with random
  exercises from completed lessons (no repeats).
- A weak word only appears in exercises of a lesson that is no longer completed (e.g. progress
  reset): it cannot be reviewed; it simply is not chosen.
- Lesson content changes in a later app version so a recorded word no longer appears in any
  exercise: the record is harmless and ignored.
- Mistake records cannot be saved (storage full or disabled): the session still works; records
  are kept in memory until the app is closed, the same as lesson progress today.
- A learner quits a practice or review session: nothing about lesson completion is recorded;
  word records from answers already given are kept (US2 scenario 4).
- Words common to almost every exercise (the particles *li* and *e*): counted like any other
  word; they may become weak if the learner keeps getting sentences wrong.

## Requirements *(mandatory)*

### Functional Requirements

**Practice session**

- **FR-001**: The home screen MUST offer a Practice action, available only when at least one
  lesson is completed; when unavailable it MUST say why.
- **FR-002**: A practice session MUST contain 10 exercises (or every exercise in completed
  lessons if fewer), chosen at random from completed lessons only, with no exercise twice in the
  first pass.
- **FR-003**: Practice sessions MUST use the same exercise screens, feedback, progress display,
  quit behavior and repeat-until-correct rule as lessons.
- **FR-004**: A practice session MUST end with a summary showing the number of exercises
  answered correctly first time out of the total, with a way back to the home screen and a way
  to start another practice session.
- **FR-005**: Practice and review sessions MUST NOT change lesson completion, saved lesson
  scores or lesson unlocking.
- **FR-006**: Practice sessions MUST work offline and on 360 px wide screens like the rest of
  the app.

**Word mistake records**

- **FR-007**: The words an exercise tests MUST be the course words in its Toki Pona text: the
  prompt for Toki Pona → English exercises, the correct answer for English → Toki Pona
  exercises.
- **FR-008**: When an exercise is answered wrong for the first time in a session, every word it
  tests MUST gain one mistake; further wrong answers to the same exercise in the same session
  MUST NOT add more.
- **FR-009**: When an exercise is answered correctly at the first try, every word it tests that
  has mistakes MUST lose one, never going below zero, except words missed earlier in the same
  session: mistakes made in a session are only cleared in a later session.
- **FR-010**: FR-008 and FR-009 MUST apply in lessons, practice sessions and review sessions,
  and take effect as each answer is given (not only at the end of a session).
- **FR-011**: A word MUST count as weak while its mistake count is above zero.
- **FR-012**: Word records MUST be saved on the device, survive reloads, and be stored
  separately from lesson progress so that a problem with one never resets the other.

**Review weak words**

- **FR-013**: The home screen MUST offer "Review weak words" as its own action, next to
  Practice; it MUST be available only when the learner has at least one weak word that appears
  in an exercise of a completed lesson, and when unavailable it MUST say why.
- **FR-014**: A review session MUST contain 10 exercises from completed lessons, choosing
  first exercises that contain the weak words with the highest mistake counts, then filling any
  remaining places at random; no exercise twice in the first pass.
- **FR-015**: Within those rules, the choice and order of exercises MUST vary between sessions.
- **FR-016**: The review MUST use the practice session flow and summary (FR-003 to FR-006).

### Key Entities

- **Practice session**: a temporary run of exercises drawn from several completed lessons;
  kind (practice or review), the chosen exercises (each identified by lesson and exercise),
  which were missed, the current position. Never saved.
- **Word record**: per course word, the number of outstanding mistakes. Saved on the device,
  independent of lesson progress. A word with a count above zero is weak.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A learner with at least one completed lesson can go from the home screen to the
  first practice exercise in one tap.
- **SC-002**: In 20 generated practice sessions, 100% of exercises come from completed lessons
  and none appears twice in a first pass.
- **SC-003**: With at least 10 exercises in completed lessons containing weak words, 100% of
  exercises in a generated review session contain a weak word.
- **SC-004**: A word answered wrong once and then right first time once in a later session is
  no longer weak; within the session of the miss it stays weak.
- **SC-005**: Completing or quitting any number of practice or review sessions leaves lesson
  progress and unlocking unchanged in 100% of cases.
- **SC-006**: Weak-word data survives a reload, and a corrupted copy of it never prevents the
  app from loading or clears lesson progress.

## Assumptions

- Session length is fixed at 10 exercises (the roadmap's "~10"); no setting to change it.
- The practice summary shows only the first-try score; no list of weak words or per-word
  statistics is shown in this feature.
- Mistakes are only recorded from the moment this feature ships; earlier lesson results hold no
  per-word data and are not converted.
- A mistake on a sentence exercise counts against every course word in its Toki Pona text,
  even if the learner only got one of them wrong; this is the simplest rule that needs no
  per-word answer analysis, and first-try corrects bring the counts back down.
- Practice draws only from completed lessons, so it never shows words the learner has not met.
- Daily goal / streak (also on the roadmap) is out of scope.
- No new exercise types or content are added; existing lesson exercises are reused as they
  are.
