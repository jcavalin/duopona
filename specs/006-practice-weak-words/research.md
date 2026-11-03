# Research: Practice Session and Review Weak Words

No open NEEDS CLARIFICATION in the Technical Context; the stack is unchanged. These decisions
resolve the design questions the spec leaves to planning.

## R1 – Which words an exercise tests (FR-007)

**Decision**: A pure function `testedWords(exercise)` takes the exercise's Toki Pona text
(the `prompt` for `tp-en`; the `answer` for `en-tp`, joined with spaces for word banks),
lowercases it, splits on anything that is not a letter, and keeps the distinct tokens that are
keys of `vocabulary` (`src/content/vocabulary.ts`). Computed at runtime; no content changes.

**Rationale**: The course data already holds everything needed; tagging 214 exercises by hand
would duplicate it and could drift. Filtering by `vocabulary` drops English words, punctuation
and anything not taught.

**Alternatives considered**: a `words` field per exercise (manual, error-prone, content-test
burden); counting only the words that differ from the learner's answer (needs answer analysis
per exercise type, rejected by the spec's assumption).

## R2 – Exercises from several lessons in one session

**Decision**: The session queue holds **exercise keys** `"<lessonId>/<exerciseId>"` for every
kind of session (lesson, practice, review). The session gains `kind: 'lesson' | 'practice' |
'review'` and `total` (queue length at start); `lessonId` stays, set only for lessons
(`null` otherwise). `selectCurrentExercise` resolves a key with a small `getExercise(key)`
helper next to `getLesson` in `src/content/lessons/index.ts`.

**Rationale**: Exercise ids are only unique within a lesson (`toki` exists in two lessons), so
a session spanning lessons needs the lesson in each entry. Using keys everywhere keeps one code
path for submit/continue/retry, so practice gets lesson behavior for free (FR-003).
`missedOnce` holds keys too.

**Alternatives considered**: a separate practice slice (duplicates the retry/feedback logic);
queue of `{lessonId, exerciseId}` objects (works, but string keys are simpler to compare and
match the existing `string[]` fields).

## R3 – Choosing exercises (FR-002, FR-014, FR-015)

**Decision**: Pure functions in `src/lib/practice.ts`, with `random` injectable like
`shuffle()`:

- `availableKeys(completedLessonIds)`: keys of all exercises in completed lessons.
- `pickPractice(keys, random)`: `shuffle(keys).slice(0, 10)`.
- `pickReview(keys, mistakes, random)`:
  1. Weak words that appear in some available exercise, ordered by mistake count (highest
     first), ties in random order (shuffle, then stable sort).
  2. **First round**: for each weak word in that order, add one random not-yet-chosen exercise
     that tests it (skip if none left), until 10 are chosen.
  3. **Then** add the remaining exercises that test any weak word, in random order, until 10.
  4. **Then** fill with random other available exercises, until 10 or none left.
  5. Shuffle the chosen list so the order is not "worst word first".

**Rationale**: The first round spreads the session across many weak words, so one word that
appears in dozens of sentences (e.g. *li*) cannot fill the whole session, while still
guaranteeing that the most-missed words are included (US3 scenario 3). Steps 2–3 only ever add
exercises with weak words, so SC-003 holds whenever there are at least 10 of them.

**Alternatives considered**: rank exercises by their worst word's count and take the top 10
(simple, but one frequent weak word crowds out the rest); weighted random sampling (harder to
test, no clear gain at this size).

Random choice runs in a thunk (`startPracticeSession(kind)`), not in a reducer, which receives
the chosen keys. Reducers stay pure and tests pass fixed keys.

## R4 – Recording answers per word (FR-008 to FR-010)

**Decision**: A new `words` slice holds `mistakes: Record<word, number>` with only positive
counts. Answers go through a thunk `submitAndRecord(answer)` that replaces the direct
`submitAnswer` dispatch in `ExerciseScreen`:

1. `firstTry = !session.missedOnce.includes(currentKey)`. An exercise answered correctly
   leaves the queue for good, so "not yet missed" means "first answer in this session".
2. Dispatch `submitAnswer(answer)`.
3. If `firstTry`: dispatch `wordsMissed(words)` when the answer was wrong, else `wordsKnown(words)`
   (−1 each, entries removed at 0).

Retries of an already-missed exercise change nothing (FR-008, FR-009). For a correct first
answer, words tested by any exercise already in `missedOnce` are left out, so a mistake survives
the session it was made in (owner decision 2026-11-03, after the Chrome check showed a miss on
*ijo li lipu* cleared by later *li*/*ijo*/*lipu* exercises in the same session). Derived from
`missedOnce`, so no extra session state.

**Rationale**: Mirrors the existing `continueAndRecord` thunk; the session reducer stays
unaware of words, the words reducer stays unaware of sessions. Recording at submit time keeps
answers already given when the learner quits (US2 scenario 4).

**Alternatives considered**: `extraReducers` in the words slice listening to `submitAnswer`
(it would need the session state and exercise lookup, which a slice reducer cannot see);
recording at session end (loses data on quit, contradicting the spec).

## R5 – Saving word records (FR-012)

**Decision**: Separate `localStorage` key `duopona:words`, version 1, value
`{ "version": 1, "mistakes": { "<word>": <positive integer> } }`. `loadWords()` / `saveWords()`
live in `src/store/persistence.ts` next to the progress functions and follow the same read and
write rules (anything invalid → empty, write errors ignored). The store subscription saves
each slice when its object changes. Contract: `contracts/words-storage.md`.

**Rationale**: A separate key means a corrupt or reset word record never touches lesson
progress, and the progress format (v1) does not change, so no migration (Constitution II).

**Alternatives considered**: adding `mistakes` to `duopona:progress` as v2 (needs a migration
and couples the two; a bad word record could reset progress); a shared generic storage helper
(two uses only, each about 15 lines; not worth an abstraction yet, Principle I).

## R6 – Screens and routes

**Decision**:

- New route `/practice/:kind` with `kind` = `practice` or `review`, element `PracticeRoute`.
  On mount it dispatches `startPracticeSession(kind)`; leaving the route quits the session,
  as `LessonRoute` does. If the kind is unknown or not available (no completed lesson / no
  reviewable weak word), it redirects to `/`. No intro screen: practice starts straight on the
  first exercise (SC-001).
- `LessonList` (home) gets a row of two buttons under the banner: **Practice** and
  **Review weak words**. When unavailable a button is `aria-disabled` with a visible hint
  under the row ("Finish a lesson to unlock practice." / "No weak words yet."), not the
  native `disabled` attribute, so it stays focusable and the reason is announced.
- `ExerciseScreen` takes the quit and progress labels from its caller ("Quit lesson" /
  "Lesson progress" stay for lessons; "Quit practice" / "Practice progress" for practice).
- `LessonSummary` gets a `heading` and `replayLabel` prop and an optional `nextLessonTitle`
  (already optional) instead of a new summary component: "Practice complete!" + "Practise
  again" for practice and review. Subtitle is "Practice" or "Weak words".
- `continueAndRecord` records lesson completion only when `session.kind === 'lesson'`
  (FR-005).

**Rationale**: Reuses every lesson screen with label props instead of copies; the only new
screen code is the small route and two buttons. A route per session keeps browser Back and the
existing "leaving discards the session" rule working without new code.

**Alternatives considered**: a modal or in-page practice on the home route (breaks Back);
a separate `PracticeSummary` component (near-duplicate of `LessonSummary`).

## R7 – Device and offline

**Decision**: No new assets, so the precache is unchanged and practice works offline as soon as
the new build is cached. The two buttons use existing button styles and are ≥ 44 px tall and
fit side by side at 360 px (each ≥ 150 px wide; they stack if the text does not fit). One
manual phone row in the quickstart (P-D1) covers the new buttons on iPhone and Android.
