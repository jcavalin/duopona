# Feature Specification: Book-Based Toki Pona Course

**Feature Branch**: `002-book-course`

**Created**: 2026-11-03

**Status**: Implemented (content review and device checks pending, see tasks T050–T051)

**Input**: User description: "Full Toki Pona course following the book 'Toki Pona: The Language of Good' (Sonja Lang). Replace the single 'Basic Words' lesson with a course whose lessons follow the book's lesson order and teach each lesson's new vocabulary and grammar point. Exclude the book's Proper Names (L9) and Numbers (L12) grammar rules entirely. Word meanings come from the Official Toki Pona Dictionary (public domain); example sentences and exercises must be original, not copied from the book's copyrighted lessons 4–19. Same exercise types, same retry/feedback/summary flow, completed lessons still saved per lesson."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Learn through the course in book order (Priority: P1)

A learner opens the app and sees a course of lessons in the same order as the book, from
"Words and Sentences" to "Cooking". Each lesson teaches that chapter's new words and its
grammar point, using the same exercise types as today (multiple choice in both directions and
word bank), the same right/wrong feedback, the same repeat-until-correct rule for missed
exercises, and the same summary. Exercises only use words the learner has met in that lesson
or earlier ones.

**Why this priority**: This is the feature: turning a one-lesson demo into a real course that
follows the reference book.

**Independent Test**: Open the app, confirm the lesson list shows the course lessons in book
order with their titles, play any lesson start to finish, and confirm it teaches that
lesson's words and grammar point.

**Acceptance Scenarios**:

1. **Given** a new learner opens the app, **When** the lesson list loads, **Then** it shows
   the course lessons in book order (see FR-001); only the first lesson can be started, and
   every later lesson is shown as locked.
2. **Given** a learner completes a lesson, **When** they return to the lesson list, **Then**
   the next lesson is unlocked.
3. **Given** a learner has completed a lesson, **When** they start it again, **Then** they can
   replay it at any time (the latest score replaces the previous one).
4. **Given** a learner starts a lesson, **When** they play through it, **Then** every new word
   of that lesson appears in at least one exercise.
5. **Given** a learner plays a lesson, **When** they see any exercise, **Then** every Toki
   Pona word in it was introduced in that lesson or an earlier one.
6. **Given** a lesson introduces a grammar point (e.g., *li*, *e*, *pi*, *la*), **When** the
   learner plays it, **Then** at least two word-bank exercises require using that grammar
   point correctly.
7. **Given** a learner answers wrong, **When** they continue, **Then** the existing feedback,
   retry and summary behavior from feature 001 applies unchanged.

---

### User Story 2 - Progress across the whole course (Priority: P2)

A learner completes several lessons over different visits. The lesson list shows which
lessons are completed (with their latest score), and this survives reloads.

**Why this priority**: A course is only usable over multiple sessions if progress per lesson
is kept; the mechanism already exists and must keep working for many lessons.

**Independent Test** (needs at least the first lessons from US1): Complete two lessons, reload, and confirm both show as completed with
their scores while the others do not.

**Acceptance Scenarios**:

1. **Given** the learner completed lessons 1 and 2 of the course, **When** they reload,
   **Then** both show "Completed" with their scores and the remaining lessons do not.
2. **Given** progress saved by the earlier single-lesson version exists, **When** the app
   loads, **Then** it loads without errors (that old entry is simply not shown).

---

### User Story 3 - Read the grammar point before practicing (Priority: P3)

When a learner starts a lesson, they first see a short introduction: the lesson's new words
with their meanings and a few sentences (original to Duopona) explaining the grammar point.
They then press "Start" to begin the exercises.

**Why this priority**: Helps learners understand *why* answers are right; the course still
works without it.

**Independent Test**: Start a lesson and check what is shown before the first exercise.

**Acceptance Scenarios**:

1. **Given** a learner starts a lesson, **When** the lesson opens, **Then** an introduction
   lists every new word of the lesson with its meaning and explains the grammar point.
2. **Given** the introduction is shown, **When** the learner presses "Start", **Then** the
   first exercise appears.
3. **Given** a learner replays a completed lesson, **When** it opens, **Then** the
   introduction is shown again (it can be skipped with "Start" straight away).

---

### Edge Cases

- A word appears in two book lessons with different roles (e.g., *tawa* as a preposition in
  "Prepositions" and as a verb/adjective later; *sewi* as an adjective and as a spatial noun):
  it counts as introduced at its first lesson; later lessons teach the new role.
- A word bank answer could be correct in more than one word order: exercises MUST be written
  so only one order is accepted (e.g., avoid ambiguous sentences).
- Multiple English translations are valid for one Toki Pona sentence: English→Toki Pona is
  checked against one Toki Pona answer; Toki Pona→English multiple-choice options must not
  include a second correct meaning.
- The learner opens a lesson URL that does not exist (e.g., the old `basics-1`): they are
  returned to the lesson list (existing behavior).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST offer these 17 lessons, in this order, named after the book's chapters,
  with these new words:

  | # | Lesson (book chapter) | New words | Grammar point |
  |---|---|---|---|
  | 1 | Words and Sentences (L2) | ijo, jan, kili, lipu, meli, ni, soweli | NOUN *li* NOUN |
  | 2 | Nouns and Adjectives (L3) | telo, tomo, lili, pona, suli | adjectives after nouns; NOUN *li* ADJECTIVE |
  | 3 | You and I (L4) | mi, mije, sina, kulupu, sin, wawa | *mi* / *sina* as subject without *li* |
  | 4 | Verbs (L5) | jo, kute, moku, pali, sona, toki | VERB with direct object *e* |
  | 5 | More Adjectives (L6) | ala, ike, mute, pu, sewi, wan, mama | negation with *ala*; several adjectives |
  | 6 | Questions and Answers (L7) | ilo, kala, ona, anu, seme | *seme* questions; yes/no as VERB *ala* VERB; *anu* |
  | 7 | Prepositions (L8) | pana, tawa, lon, kepeken, tan | prepositional phrases |
  | 8 | Greetings and Feelings (L10) | a, mu, o, pilin | *o* for commands/addressing; greetings phrases |
  | 9 | pi (L11) | kasi, sijelo, suno, tenpo, awen, tawa, pi | *pi* to group modifiers |
  | 10 | Pre-Verbs (L13) | kama, ken, wile, lukin, sona | pre-verbs before the main verb |
  | 11 | Colours and la (L14) | jelo, laso, loje, pimeja, walo, la | colours; context phrase with *la* |
  | 12 | Spatial Nouns (L15) | insa, monsi, noka, poka, sewi, sinpin | *lon* + spatial noun |
  | 13 | Particles and Perspective (L16) | anpa, ante, en, lete, lupa, open, sama, suwi, taso, tawa | *en* for compound subjects; *taso* |
  | 14 | Hunting (L17) | alasa, lawa, len, linja, pakala, palisa, pipi, waso, weka | review in a themed story |
  | 15 | Cooking (L18) | lape, olin, pan, pini, seli, supa, uta | review in a themed story |
  | 16 | More Words 1 (L9 words + dictionary) | ma, nasin, nena, nimi, utala, akesi, jaki, kalama, kiwen, ale, esun | review of all grammar |
  | 17 | More Words 2 (dictionary) | kon, kule, mani, moli, mun, musi, nasa, selo, sike, sitelen, ko, poki | review of all grammar |

- **FR-002**: The course MUST NOT include the book's Proper Names (L9) or Numbers (L12) grammar
  rules: no exercises on proper names/unofficial words, and no number-system exercises.
  (Lesson 9's ordinary words are taught in "More Words 1" without the proper-names rule.)
- **FR-003**: Each lesson MUST contain between 10 and 15 exercises, mixing multiple-choice
  (both directions) and word-bank exercises, with at least 3 word-bank exercises.
- **FR-004**: Every new word of a lesson MUST appear in at least one of its exercises.
- **FR-005**: Every Toki Pona word in a lesson's exercises MUST have been introduced in that
  lesson or an earlier lesson (the grammar particles *li* and *e* count as introduced in the
  lesson whose grammar point teaches them).
- **FR-006**: Each lesson's grammar point MUST be required by at least two of its word-bank
  exercises. For review lessons (14–17), whose grammar point is "review", this means at least
  two word-bank exercises that each combine two or more grammar points taught earlier.
- **FR-007**: Word meanings shown to the learner MUST be short glosses written for Duopona whose
  meaning is consistent with the book's Official Toki Pona Dictionary; dictionary definitions
  MUST NOT be copied word for word.
- **FR-008**: Example sentences and exercises MUST be original to Duopona and MUST NOT copy
  sentences, exercises or explanatory text from the book's lessons 4–19.
- **FR-009**: Lesson play (feedback, retry of missed exercises, summary, quit) MUST behave
  exactly as in feature 001.
- **FR-010**: Completed lessons and their latest scores MUST be saved per lesson and survive
  reloads, as in feature 001.
- **FR-011**: The app MUST show a short credit line naming the book *Toki Pona: The Language of
  Good* by Sonja Lang and tokipona.org as the basis of the course.
- **FR-012**: The first lesson MUST be available from the start; each later lesson MUST unlock
  when the previous lesson has been completed. Locked lessons MUST be visible in the list but
  not startable, and opening a locked lesson's address MUST return the learner to the list.
- **FR-013**: Each lesson MUST open with an introduction listing its new words with meanings
  and a short original explanation of its grammar point, followed by a "Start" action.
- **FR-014**: Completed lessons MUST remain replayable at any time.

### Key Entities

- **Course**: The ordered list of 17 lessons defined in FR-001.
- **Lesson**: Title, book chapter reference, new words, grammar point, introduction text, and
  its exercises. Locked until the previous lesson is completed.
- **Vocabulary entry**: A Toki Pona word, its meaning(s) from the official dictionary, and the
  lesson that introduces it.
- **Exercise / Learner Progress**: Unchanged from feature 001.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 17 lessons can be completed start to finish, each in under 7 minutes by a
  learner who knows the material.
- **SC-002**: 100% of the new words listed in FR-001 appear in at least one exercise of their
  lesson (verifiable automatically).
- **SC-003**: 0 exercises use a Toki Pona word before the lesson that introduces it
  (verifiable automatically).
- **SC-004**: Every exercise has exactly one accepted answer, verified before release.
- **SC-005**: Completed lessons are still shown as completed after a reload for 100% of
  lessons.

## Assumptions

- Lesson 1 of the book ("Letters and Sounds") is about pronunciation; without audio it is not
  turned into a lesson. Lesson 19 ("The Frontier") and the book's Part 2 texts are reading
  material and are not turned into lessons.
- The course covers every headword of the book's Official Toki Pona Dictionary except the number
  words (*tu, luka, nanpa*, FR-002) and the adult-only *unpa*. *ale* is taught as "all /
  everything", not as a number. The dictionary's variant forms (*ali* for *ale*, *kin* for *a*,
  *oko* for *lukin*, *namako* for *sin*) are not separate entries and are not used in exercises.
  Words outside that dictionary are out of scope.
- Ongoing practice after finishing the course (beyond replaying lessons) is a separate,
  later feature.
- The existing "Basic Words" lesson is removed and replaced by the course; any saved completion
  of it is ignored (only development users have it).
- Exercise types stay the same as feature 001; no new exercise types, audio, or sitelen pona.
- The interface language remains English.
- The book copy in `resources/` is for the team's reference only and is not distributed with
  the app or committed to the repository.

## Clarifications

### Session 2026-11-03

- Q: Are later lessons locked? → A: Yes; each lesson unlocks when the previous one is completed.
  Completed lessons stay replayable.
- Q: Do lessons explain the grammar first? → A: Yes; a short introduction with new words and an
  original grammar explanation, then "Start".
- Q: What about words no book lesson covers? → A: Two extra lessons at the end ("More Words 1 &
  2") cover Lesson 9's words and the remaining dictionary words.
