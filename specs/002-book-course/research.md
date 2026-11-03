# Research: Book-Based Toki Pona Course

No new libraries are needed; this feature is mostly content plus three small UI changes. Guiding
rules: Constitution I (KISS) and V (mobile-first).

## 1. Where lesson content lives

- **Decision**: One typed TypeScript module per lesson in `src/content/lessons/`
  (`01-words-and-sentences.ts` … `17-more-words-2.ts`), collected in order by
  `src/content/lessons/index.ts`. A single `src/content/vocabulary.ts` holds every course word
  with its dictionary meaning.
- **Rationale**: 17 lessons × ~12 exercises is ~200 exercises; one file per lesson keeps each
  reviewable on its own and maps 1:1 to a book chapter. TypeScript types catch malformed
  exercises at build time (same choice as feature 001).
- **Alternatives considered**: One big `lessons.ts` (unreadable at this size); JSON/YAML files
  (no type checking without adding a schema validator dependency).

## 2. Enforcing the content rules automatically

- **Decision**: A content test suite (`tests/unit/courseContent.test.ts`) checks every lesson
  against the rules in [contracts/lesson-content.md](contracts/lesson-content.md):
  exercise counts, every new word used, no word used before it is introduced, grammar point
  practised in ≥2 word-bank exercises, options/distractors well-formed, every word in
  `vocabulary.ts`.
- **"Introduced before" check**: Toki Pona tokens are taken from the Toki Pona side of each
  exercise (prompt for `tp-en`; options/answer/distractors for `en-tp`), lower-cased, split on
  spaces, punctuation stripped. Each token must be in the union of `newWords` of this and all
  earlier lessons.
- **Grammar practice check**: word-bank exercises that practise the lesson's grammar point carry
  `practisesGrammar: true`; the test requires ≥2 per lesson. Whether the flag is truthful is a
  human review item (it cannot be checked generically, e.g. adjective order has no marker word).
- **Rationale**: SC-002/SC-003 must be "verifiable automatically"; with ~200 hand-written
  exercises, mistakes are certain without a test.

## 3. Word meanings

- **Decision**: Meanings in `vocabulary.ts` are 1–3 common senses written in our own words,
  checked for meaning against the book's Official Toki Pona Dictionary.
- **Rationale**: FR-007; a word's meaning is a fact, but a dictionary's wording is protected
  expression, so we do not copy it. (The dictionary's licence was not verified, so we do not
  rely on it being public domain.)

## 4. Original content and the book's copyright

- **Decision**: All example sentences, exercises and grammar explanations are written fresh for
  Duopona. The book is used only for chapter order, chapter titles, which words each chapter
  introduces, and which grammar point it covers (facts, not expression). Nothing is copied from
  lessons 4–19; we also do not copy text from lessons 1–3 (CC BY-NC) to avoid the non-commercial
  restriction on the app.
- **Review step**: before merging, each lesson is checked by hand against the book to confirm no
  sentence is copied (quickstart scenario).
- **Credit**: the lesson list footer credits the book and tokipona.org (FR-011).

## 5. Lesson unlocking

- **Decision**: Derived, not stored: lesson *n* is unlocked if *n* = 1 or lesson *n−1* is in
  `completedLessons`. A selector `selectIsUnlocked(lessonId)` is used by the list and by
  `LessonRoute` (locked → redirect to `#/`).
- **Rationale**: No new persisted state; storage format v1 stays unchanged.
- **Old progress**: the saved `basics-1` entry from feature 001 simply never matches a course
  lesson and is ignored (spec assumption). No migration.

## 6. Lesson introduction screen

- **Decision**: `LessonRoute` keeps a local `started` flag (component state, allowed by
  Principle III for UI-local state). Until "Start" is pressed it renders `LessonIntro`; pressing
  Start dispatches `startLesson`. Leaving the route still dispatches `quitLesson`.
- **Rationale**: Smallest change to the existing flow; the session slice is untouched.
- **Alternatives considered**: An `intro` status in the session slice — more state and tests for
  no benefit.

## 7. Mobile requirements (Constitution V) for this feature

- **Decision**: All screens touched by this feature (lesson list, intro, exercise screen,
  summary) meet the screen-level rules now: targets ≥ 44×44 px (the current "Quit" button is
  ~40 px tall and is fixed), usable at 360 px, no horizontal scroll, safe-area padding via
  `viewport-fit=cover` + `env(safe-area-inset-*)`.
- **Deferred**: installability (manifest, icons) and offline (service worker) are the next
  roadmap feature, by owner decision ("lessons first, then PWA"). See plan Complexity Tracking.

## 8. Lesson ids

- **Decision**: Stable kebab-case slugs from the lesson title (e.g., `words-and-sentences`,
  `pi`, `more-words-1`). Used in URLs (`#/lesson/pi`) and saved progress keys, so they MUST NOT
  change after release.
