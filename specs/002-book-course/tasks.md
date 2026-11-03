---

description: "Task list for feature 002: Book-Based Toki Pona Course"
---

# Tasks: Book-Based Toki Pona Course

**Input**: Design documents from `/specs/002-book-course/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/lesson-content.md, contracts/ui-screens.md, quickstart.md

**Tests**: Included. Constitution IV ("Tests after code, before done") and plan.md require the
content-rules suite plus unlock/intro/progress tests. Each test task comes **after** the code it
covers.

**Organization**: Tasks are grouped by user story so each story can be built and tested on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story the task belongs to (US1, US2, US3)

## Path Conventions

Single frontend project: `src/`, `tests/`, `index.html` at the repository root.
Run commands from the repository root: `npm test`, `npm run lint`, `npm run build`.

---

## Lesson authoring rules (apply to every lesson file task: T004, T010–T025)

Every lesson file `src/content/lessons/NN-<id>.ts` default-exports one `Lesson`
(`import type { Lesson } from '../types'`) and MUST follow these rules
(from contracts/lesson-content.md, data-model.md and spec.md):

1. **Fields**: `id` (stable kebab-case slug given in the task; never rename later), `title`
   (exact book chapter title from the task), `chapter` (e.g. `"Lesson 2"`, or `"Dictionary"` for
   More Words), `newWords` (exactly the list given in the task, same order), `grammar`
   `{ title, explanation }` where `explanation` is 1–4 short original paragraphs (strings), and
   `exercises`.
2. **Count**: 10–15 exercises; at least 3 `wordBank`; mix multiple choice in both directions
   (`tp-en` and `en-tp`) and word bank in both directions.
3. **Coverage (C3)**: every word in `newWords` appears on the Toki Pona side of at least one
   exercise. Toki Pona side = `prompt` for `tp-en` (MC and word bank); `options` for MC `en-tp`;
   `answer` + `distractors` for word bank `en-tp`.
4. **No word before it is taught (C4)**: every Toki Pona token on the Toki Pona side MUST be in
   `newWords` of this lesson or an earlier one. Tokenizing: lower-case, strip `.,!?` and quotes,
   split on whitespace. Only these words are available (cumulative, by lesson):
   - L1: ijo jan kili lipu meli ni soweli li
   - L2: + telo tomo lili pona suli
   - L3: + mi mije sina kulupu sin wawa
   - L4: + jo kute moku pali sona toki e
   - L5: + ala ike mute pu sewi wan mama
   - L6: + ilo kala ona anu seme
   - L7: + pana tawa lon kepeken tan
   - L8: + a mu o pilin
   - L9: + kasi sijelo suno tenpo awen pi
   - L10: + kama ken wile lukin
   - L11: + jelo laso loje pimeja walo la
   - L12: + insa monsi noka poka sinpin
   - L13: + anpa ante en lete lupa open sama suwi taso
   - L14: + alasa lawa len linja pakala palisa pipi waso weka
   - L15: + lape olin pan pini seli supa uta
   - L16: + ma nasin nena nimi utala akesi jaki kalama kiwen ale esun
   - L17: + kon kule mani moli mun musi nasa selo sike sitelen ko poki
5. **Grammar practice (C5)**: at least 2 word-bank exercises that genuinely require this lesson's
   grammar point to answer correctly carry `practisesGrammar: true`.
6. **Multiple choice (C7)**: 3–4 unique `options`, `answer` is one of them, and no other option is
   also a correct translation. English options should use the glosses from
   `src/content/vocabulary.ts`.
7. **Word bank (C8)**: `answer` is the ordered list of tiles; 1–3 `distractors`, none of which
   appears in `answer`; write sentences so that **only one tile order** is correct (avoid
   sentences whose words could be swapped into another valid sentence that matches the prompt).
   The answer reversed MUST NOT equal the answer (no palindromes such as `["jan", "li", "jan"]`).
8. **Ids and prompts (C11)**: exercise `id`s unique within the lesson (short kebab-case, e.g.
   `ni-li-kili`); `prompt`s unique within the lesson (the integration tests identify the current
   exercise by its prompt).
9. **Exclusions (C10, FR-002)**: no proper names, no capitalised unofficial words, no number
   system; never use *unpa*, *tu*, *luka*, *nanpa*.
10. **Originality (C9, FR-008)**: write every sentence, exercise and explanation fresh. Do NOT copy
    or paraphrase sentences, exercises or explanations from the book (`resources/`, team reference
    only, git-ignored). Use the book only for chapter order, titles, word lists and grammar topic.
11. **Length (SC-001)**: a learner who knows the material finishes in under 7 minutes; keep
    sentences short (≤ 7 Toki Pona words; word-bank answers ≤ 8 tiles, checked by T006).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Record a known-good baseline before changing anything

- [X] T001 Run `npm test`, `npm run lint` and `npm run build` on branch `002-book-course` and confirm all pass; record the gzipped size of the main JS chunk printed by `vite build` (from `dist/assets/`) in a comment at the top of the Polish phase below, for the bundle-growth check in T049

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extended content types, vocabulary, the `lessons/` folder with lesson 1, the content
rules test suite, and existing tests moved off the removed `basics-1` lesson

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Extend the content types in src/content/types.ts: add to `Lesson` the fields `chapter: string` (book reference, e.g. `"Lesson 2"` or `"Dictionary"`), `newWords: string[]` (words first taught here; a word taught earlier MAY be listed again only if this lesson teaches a new role for it), `grammar: { title: string; explanation: string[] }` (1–4 short original paragraphs); add to `WordBankExercise` the optional field `practisesGrammar?: boolean` with a doc comment "true when answering requires the lesson's grammar point; ≥ 2 per lesson"
- [X] T003 [P] Create src/content/vocabulary.ts exporting `export const vocabulary: Record<string, string>` mapping each lower-case Toki Pona word to a short English gloss (1–3 common senses, separated by ` / `, e.g. `jan: 'person / someone'`) written in our own words, consistent in meaning with the book's Official Toki Pona Dictionary (`resources/Toki Pona Dictitonary.pdf`, git-ignored); do not copy definitions word for word, plus `export function getMeaning(word: string): string | undefined`. Include exactly these 116 words: ijo jan kili lipu meli ni soweli li telo tomo lili pona suli mi mije sina kulupu sin wawa jo kute moku pali sona toki e ala ike mute pu sewi wan mama ilo kala ona anu seme pana tawa lon kepeken tan a mu o pilin kasi sijelo suno tenpo awen pi kama ken wile lukin jelo laso loje pimeja walo la insa monsi noka poka sinpin anpa ante en lete lupa open sama suwi taso alasa lawa len linja pakala palisa pipi waso weka lape olin pan pini seli supa uta ma nasin nena nimi utala akesi jaki kalama kiwen kon kule mani moli mun musi nasa selo sike sitelen ale esun ko poki. For the particles give a function gloss (e.g. `li: 'marks the predicate (after a subject other than mi / sina)'`, `e: 'marks the direct object'`, `pi: 'groups the following modifiers'`, `la: 'marks a context phrase'`). Do NOT include unpa, tu, luka, nanpa, nor the variant forms ali, kin, oko, namako
- [X] T004 [P] Create src/content/lessons/01-words-and-sentences.ts following the Lesson authoring rules: `id: 'words-and-sentences'`, `title: 'Words and Sentences'`, `chapter: 'Lesson 2'`, `newWords: ['ijo', 'jan', 'kili', 'lipu', 'meli', 'ni', 'soweli', 'li']`; grammar point "NOUN *li* NOUN" (a sentence is subject + *li* + predicate noun; *ni* = this/that), e.g. original sentences like `ni li kili`, `soweli li ijo`; ≥ 2 en-tp word-bank exercises with `practisesGrammar: true` that require placing *li* (useful distractors: other L1 nouns). Only L1 words are available (no *mi*, *sina*, *pona*)
- [X] T005 Create src/content/lessons/index.ts exporting `lessons: Lesson[]` (ordered; for now only the lesson from 01-words-and-sentences.ts) and `getLesson(id: string): Lesson | undefined` (same signature as today); then delete src/content/lessons.ts. Existing imports of `'../content/lessons'` in src/store/sessionSlice.ts, src/routes/LessonRoute.tsx and src/components/LessonList.tsx resolve to the folder index unchanged — verify with `npx tsc -b`
- [X] T006 [P] Create tests/unit/courseContent.test.ts (replaces tests/unit/lessons.test.ts, which is deleted in this task) that loops over `lessons` from src/content/lessons and enforces, per contracts/lesson-content.md: C2 (10–15 exercises, ≥ 3 `wordBank`); C3 (each `newWords` entry appears among the lesson's Toki Pona tokens); C4 (every Toki Pona token is in the union of `newWords` of this and earlier lessons — report the offending exercise id and token in the failure message); C5 (≥ 2 word-bank exercises with `practisesGrammar: true`); C6 (every `newWords` entry has a `getMeaning` result); C7 shape (3–4 unique options, answer among them); C8 distractors (none in `answer`, at least 1 distractor, answer reversed ≠ answer); word-bank `answer` has at most 8 tiles (keeps lessons short for SC-001); C10 (no token in `['unpa', 'tu', 'luka', 'nanpa']`); C11 (exercise ids unique within a lesson, lesson ids unique across the course); and prompts unique within a lesson. Toki Pona side per exercise: MC `tp-en` → `prompt`; MC `en-tp` → `options`; word bank `tp-en` → `prompt`; word bank `en-tp` → `answer` + `distractors`. Tokenize: lower-case, strip `.,!?` and quotes (`"'“”‘’`), split on whitespace, drop empty strings. Also assert `getLesson('nope')` and `getLesson('basics-1')` are `undefined`
- [X] T007 [P] Update tests/unit/sessionSlice.test.ts to the course data: replace `getLesson('basics-1')` / `startLesson('basics-1')` with `lessons[0]` and `startLesson(lessons[0].id)`, and replace hard-coded answers (`'person'`, `'water'`) with answers derived from the current exercise (correct: its `answer`; wrong: an MC option ≠ answer, or for word bank `[exercise.distractors[0]]`). Keep every existing behavior assertion
- [X] T008 [P] Update tests/integration/lessonFlow.test.tsx to lesson 1 of the course: `const lesson = lessons[0]` (import `lessons` from src/content/lessons); `startLesson` helper clicks the link whose name matches `lesson.title`; in `answer(user, false)` for word bank place only `ex.distractors[0]` (instead of the reversed answer); in `answer(user, true)` click `getAllByRole('button', { name: word })[0]` so repeated words work; rewrite the "word bank tiles move between bank and answer line" test to take tile names from the current exercise's `answer`/`distractors` instead of `mi`/`sina`/`pona`; change the wrong-answer message assertion to use the second exercise's formatted answer; change "lesson list shows only Basic Words" to "lesson list shows the first course lesson" (US1 extends it in T033). Keep all other assertions
- [X] T009 Run `npm test`, `npm run lint`, `npm run build`; all MUST pass with only lesson 1 in the course

**Checkpoint**: Foundation ready — the app plays lesson 1 of the course with the feature 001 flow, and content rules are enforced automatically

---

## Phase 3: User Story 1 - Learn through the course in book order (Priority: P1) 🎯 MVP

**Goal**: All 17 lessons in book order, each teaching its words and grammar point, with
sequential unlocking and the credit footer

**Independent Test**: Open the app → 17 lessons in FR-001 order, only lesson 1 startable, the rest
"Locked"; play lesson 1 to the end → lesson 2 unlocks; `npm test` passes the content rules for all
17 lessons

### Implementation for User Story 1 — lesson content (all [P]: one file each)

- [X] T010 [P] [US1] Create src/content/lessons/02-nouns-and-adjectives.ts per the Lesson authoring rules: `id: 'nouns-and-adjectives'`, `title: 'Nouns and Adjectives'`, `chapter: 'Lesson 3'`, `newWords: ['telo', 'tomo', 'lili', 'pona', 'suli']`; grammar: adjectives come after the noun they describe (`tomo suli`), and NOUN *li* ADJECTIVE (`telo li pona`); `practisesGrammar` word banks require correct noun–adjective order or *li* + adjective
- [X] T011 [P] [US1] Create src/content/lessons/03-you-and-i.ts: `id: 'you-and-i'`, `title: 'You and I'`, `chapter: 'Lesson 4'`, `newWords: ['mi', 'mije', 'sina', 'kulupu', 'sin', 'wawa']`; grammar: *mi* and *sina* alone as subject take no *li* (`mi wawa`, `sina pona`), while other subjects still do (`mije li wawa`); `practisesGrammar` word banks use *li* as a distractor where the subject is *mi*/*sina*
- [X] T012 [P] [US1] Create src/content/lessons/04-verbs.ts: `id: 'verbs'`, `title: 'Verbs'`, `chapter: 'Lesson 5'`, `newWords: ['jo', 'kute', 'moku', 'pali', 'sona', 'toki', 'e']`; grammar: VERB + *e* + direct object (`mi moku e kili`, `jan li jo e lipu`); `practisesGrammar` word banks require placing *e* (and *li* where needed)
- [X] T013 [P] [US1] Create src/content/lessons/05-more-adjectives.ts: `id: 'more-adjectives'`, `title: 'More Adjectives'`, `chapter: 'Lesson 6'`, `newWords: ['ala', 'ike', 'mute', 'pu', 'sewi', 'wan', 'mama']`; grammar: *ala* after a word negates it (`mi moku ala`), and several adjectives can follow one noun (`jan lili wawa`); `practisesGrammar` word banks require *ala* placement or multi-adjective order
- [X] T014 [P] [US1] Create src/content/lessons/06-questions-and-answers.ts: `id: 'questions-and-answers'`, `title: 'Questions and Answers'`, `chapter: 'Lesson 7'`, `newWords: ['ilo', 'kala', 'ona', 'anu', 'seme']`; grammar: *seme* replaces the unknown word (`sina moku e seme?`), yes/no questions as VERB *ala* VERB (`sina pona ala pona?`), choice with *anu*; `practisesGrammar` word banks build *seme* and VERB *ala* VERB questions
- [X] T015 [P] [US1] Create src/content/lessons/07-prepositions.ts: `id: 'prepositions'`, `title: 'Prepositions'`, `chapter: 'Lesson 8'`, `newWords: ['pana', 'tawa', 'lon', 'kepeken', 'tan']`; grammar: prepositional phrases after the verb phrase (`mi lon tomo`, `mi pana e kili tawa jan`, `ona li pali kepeken ilo`); `practisesGrammar` word banks require a preposition + noun in the right place
- [X] T016 [P] [US1] Create src/content/lessons/08-greetings-and-feelings.ts: `id: 'greetings-and-feelings'`, `title: 'Greetings and Feelings'`, `chapter: 'Lesson 10'`, `newWords: ['a', 'mu', 'o', 'pilin']`; grammar: *o* for commands (`o moku!`) and for addressing someone (`jan o, ...`), short greeting phrases (`toki!`), *a* for emotion, *pilin* for feelings; `practisesGrammar` word banks require *o* commands or address
- [X] T017 [P] [US1] Create src/content/lessons/09-pi.ts: `id: 'pi'`, `title: 'pi'`, `chapter: 'Lesson 11'`, `newWords: ['kasi', 'sijelo', 'suno', 'tenpo', 'awen', 'tawa', 'pi']`; grammar: *pi* groups the modifiers after it into one unit (`jan pi kulupu suli` vs `jan kulupu suli`); also teach *tawa* in its new role as verb/adjective (moving, to go); `practisesGrammar` word banks require *pi* in the right position, written so the version without *pi* is not an acceptable answer to the prompt
- [X] T018 [P] [US1] Create src/content/lessons/10-pre-verbs.ts: `id: 'pre-verbs'`, `title: 'Pre-Verbs'`, `chapter: 'Lesson 13'`, `newWords: ['kama', 'ken', 'wile', 'lukin', 'sona']`; grammar: a pre-verb comes directly before the main verb (`mi wile moku`, `sina ken toki`, `mi sona pali` = know how to work, `mi lukin pali` = try to work); *sona* is re-listed for its new pre-verb role; `practisesGrammar` word banks require pre-verb + verb order
- [X] T019 [P] [US1] Create src/content/lessons/11-colours-and-la.ts: `id: 'colours-and-la'`, `title: 'Colours and la'`, `chapter: 'Lesson 14'`, `newWords: ['jelo', 'laso', 'loje', 'pimeja', 'walo', 'la']`; grammar: colours as adjectives (`kili jelo`) and a context phrase before *la* (`tenpo suno la mi pali`); `practisesGrammar` word banks require a *la* context phrase at the start
- [X] T020 [P] [US1] Create src/content/lessons/12-spatial-nouns.ts: `id: 'spatial-nouns'`, `title: 'Spatial Nouns'`, `chapter: 'Lesson 15'`, `newWords: ['insa', 'monsi', 'noka', 'poka', 'sewi', 'sinpin']`; grammar: *lon* + spatial noun + noun for location (`soweli li lon insa tomo`, `mi lon poka sina`); *sewi* is re-listed for its new spatial-noun role; `practisesGrammar` word banks require *lon* + spatial noun + noun order
- [X] T021 [P] [US1] Create src/content/lessons/13-particles-and-perspective.ts: `id: 'particles-and-perspective'`, `title: 'Particles and Perspective'`, `chapter: 'Lesson 16'`, `newWords: ['anpa', 'ante', 'en', 'lete', 'lupa', 'open', 'sama', 'suwi', 'taso', 'tawa']`; grammar: *en* joins subjects (`mi en sina li pali` — note *li* is needed with a compound subject), *taso* as "only" (after a word) and "but" (at sentence start), and *tawa* in its perspective role "for / in the opinion of" (`ni li pona tawa mi`); `practisesGrammar` word banks require *en* (with *li*) or *taso*
- [X] T022 [P] [US1] Create src/content/lessons/14-hunting.ts: `id: 'hunting'`, `title: 'Hunting'`, `chapter: 'Lesson 17'`, `newWords: ['alasa', 'lawa', 'len', 'linja', 'pakala', 'palisa', 'pipi', 'waso', 'weka']`; grammar: review of earlier grammar told through an original hunting-themed mini story (exercises follow one storyline); grammar `title` e.g. "Review: a hunting story"; `practisesGrammar` word banks each combine two or more earlier grammar points (FR-006 for review lessons; e.g. *e* + preposition, *pi*, *la*)
- [X] T023 [P] [US1] Create src/content/lessons/15-cooking.ts: `id: 'cooking'`, `title: 'Cooking'`, `chapter: 'Lesson 18'`, `newWords: ['lape', 'olin', 'pan', 'pini', 'seli', 'supa', 'uta']`; grammar: review through an original cooking-themed mini story; `practisesGrammar` word banks each combine two or more earlier grammar points (FR-006 for review lessons; e.g. pre-verb + *e*, *lon* + spatial noun)
- [X] T024 [P] [US1] Create src/content/lessons/16-more-words-1.ts: `id: 'more-words-1'`, `title: 'More Words 1'`, `chapter: 'Dictionary'`, `newWords: ['ma', 'nasin', 'nena', 'nimi', 'utala', 'akesi', 'jaki', 'kalama', 'kiwen', 'ale', 'esun']`; grammar: review of all grammar (FR-006: ≥ 2 word banks each combining two or more earlier grammar points); *ale* means "all / everything" (never a number); the explanation may mention that *ali* is another form of *ale*, but exercises use only *ale*; explanation states these words complete the vocabulary (no proper-names rule: *nimi* used only as "word / name" with official words, never with a proper name); `practisesGrammar` word banks combine earlier grammar points
- [X] T025 [P] [US1] Create src/content/lessons/17-more-words-2.ts: `id: 'more-words-2'`, `title: 'More Words 2'`, `chapter: 'Dictionary'`, `newWords: ['kon', 'kule', 'mani', 'moli', 'mun', 'musi', 'nasa', 'selo', 'sike', 'sitelen', 'ko', 'poki']`; grammar: review of all grammar (FR-006: ≥ 2 word banks each combining two or more earlier grammar points); `practisesGrammar` word banks combine earlier grammar points

### Implementation for User Story 1 — course wiring, unlocking, list

- [X] T026 [US1] Register all 17 lessons in src/content/lessons/index.ts in FR-001 order (01 … 17) (depends on T010–T025)
- [X] T027 [US1] Add rule C1 to tests/unit/courseContent.test.ts: assert `lessons.map(l => [l.id, l.title, l.chapter, l.newWords])` equals the exact FR-001 table (ids, titles, chapters and `newWords` from T004 and T010–T025, in order; *li* in lesson 1, *e* in lesson 4); run `npm test` and fix any content-rule failures in the lesson files
- [X] T028 [US1] Add `selectIsUnlocked(lessonId: string)` to src/store/progressSlice.ts: returns `(state: { progress: LearnerProgress }) => boolean` — `true` if the lesson is the first in `lessons` (import from src/content/lessons) or the previous lesson's id is a key of `state.progress.completedLessons`; `false` for unknown ids. Unlocking is derived, nothing new is persisted (storage stays `duopona:progress` v1)
- [X] T029 [US1] Update src/components/LessonList.tsx per contracts/ui-screens.md: each card shows lesson number (index + 1), title and `Book: ${lesson.chapter}`; unlocked → `Link` to `/lesson/:id` (with "Completed · X/Y" badge when completed, as today); locked → non-link element with `aria-disabled="true"`, a "Locked" label and the hint "Complete the previous lesson to unlock"; add a `<footer>` with "Course based on <cite>Toki Pona: The Language of Good</cite> by Sonja Lang · " and a link "tokipona.org" to `https://tokipona.org` with `target="_blank" rel="noopener"` (FR-011)
- [X] T030 [US1] Update src/components/LessonList.module.css: `.locked` card style (muted colours, no hover border, `cursor: not-allowed`), `.number` and `.chapter` styles, `.footer` (muted, small text, margin-top 24px) with the credit link given `display: inline-flex; align-items: center; min-height: 44px` (Constitution V touch target); cards stay ≥ 44 px tall and wrap long titles at 360 px width
- [X] T031 [US1] Add the locked guard to src/routes/LessonRoute.tsx: read `selectIsUnlocked(lessonId)`; if the lesson is unknown OR locked, render `<Navigate to="/" replace />` and do not start a session (FR-012)
- [X] T032 [P] [US1] Add tests to tests/unit/progressSlice.test.ts for `selectIsUnlocked`: first lesson unlocked with empty progress; second lesson locked with empty progress; second lesson unlocked once the first is in `completedLessons`; third still locked; unknown id returns `false`
- [X] T033 [US1] Add US1 tests to tests/integration/lessonFlow.test.tsx: list shows 17 cards in FR-001 order with titles and "Book: Lesson N"; exactly one link (lesson 1); locked cards have `aria-disabled="true"` and "Locked"; clicking a locked card does not navigate; rendering `/lesson/pi` while locked redirects to the list; completing lesson 1 then returning to the list makes lesson 2 a link; replaying a completed lesson works and updates its score; credit footer link has `href="https://tokipona.org"` and `rel` containing `noopener`
- [X] T034 [US1] Run `npm test`, `npm run lint`, `npm run build`; all MUST pass

**Checkpoint**: The full 17-lesson course is playable in book order with unlocking — MVP

---

## Phase 4: User Story 2 - Progress across the whole course (Priority: P2)

**Goal**: Completion and scores for many lessons survive reloads; old `basics-1` progress is harmless

**Independent Test**: Complete lessons 1 and 2, reload → both "Completed" with scores, lesson 3
unlocked but not completed, lessons 4–17 locked; preload old `basics-1` progress → app loads with
nothing completed

### Implementation for User Story 2

- [X] T035 [US2] Confirm src/components/LessonList.tsx and src/store/persistence.ts need no change for multi-lesson progress: the list reads results only by course lesson ids, and `loadProgress` keeps unknown keys (e.g. `basics-1`) without throwing; if either is not true, fix it in that file
- [X] T036 [US2] Add to tests/integration/lessonFlow.test.tsx (describe "saved progress (US2)"; rewrite its `card()` helper to take a lesson title): complete lessons 1 and 2, simulate reload (`cleanup()` + `renderApp()`), assert both cards show "Completed · X/Y" with their scores, lesson 3 is a link without "Completed", lesson 4 is locked (US2 AC1, SC-005)
- [X] T037 [US2] Add to tests/integration/lessonFlow.test.tsx: set `localStorage[STORAGE_KEY]` to `{"version":1,"completedLessons":{"basics-1":{"firstTryCorrect":1,"total":1,"completedAt":"2026-11-01T00:00:00Z"}}}` before `renderApp()`; assert the list renders 17 cards, none "Completed", only lesson 1 is a link (US2 AC2)
- [X] T038 [P] [US2] Add to tests/unit/progressSlice.test.ts: with only `basics-1` in `completedLessons`, `selectIsUnlocked` is `true` for lesson 1 only
- [X] T039 [US2] Run `npm test`; all MUST pass

**Checkpoint**: US1 and US2 both work; progress for the whole course is durable

---

## Phase 5: User Story 3 - Read the grammar point before practicing (Priority: P3)

**Goal**: Each lesson opens with an introduction (new words + meanings, grammar explanation) and a
"Start" button

**Independent Test**: Open any unlocked lesson → intro lists every new word with its meaning and the
grammar title/paragraphs; "Start" shows exercise 1; replaying shows the intro again

### Implementation for User Story 3

- [X] T040 [P] [US3] Create src/components/LessonIntro.tsx: props `{ lesson: Lesson; onStart: () => void; onBack: () => void }`; renders `<h1>` lesson title, a sub-heading `Book: ${lesson.chapter}`, a "New words" `<h2>` with a list (`<dl>` or `<ul>`) of each `newWords` entry and `getMeaning(word)` from src/content/vocabulary.ts, a grammar section with `<h2>{grammar.title}</h2>` and one `<p>` per `explanation` paragraph, a full-width `className="primary-button"` "Start" button (autoFocus) and a secondary "Back" button
- [X] T041 [P] [US3] Create src/components/LessonIntro.module.css: mobile-first layout usable at 360 px with no horizontal scroll (long words wrap), word list with the Toki Pona word bold and its meaning muted, "Back" button with `min-height: 44px` and at least 44 px wide
- [X] T042 [US3] Update src/routes/LessonRoute.tsx: add local `const [started, setStarted] = useState(false)` (UI-local state, Constitution III); stop dispatching `startLesson` on mount; while `!started` render `<LessonIntro lesson={lesson} onStart={() => { dispatch(startLesson(lesson.id)); setStarted(true) }} onBack={goHome} />`; keep a cleanup effect that dispatches `quitLesson()` when leaving the route; keep the unknown/locked guard from T031 before everything else; after Start, keep the existing exercise/summary rendering (depends on T031, T040)
- [X] T043 [US3] Update tests/integration/lessonFlow.test.tsx: the `startLesson` helper now also clicks "Start" after opening the lesson; add intro tests — opening lesson 1 shows its title, every `newWords` entry with `getMeaning(word)`, the grammar title and each explanation paragraph, and no "Check" button; "Start" shows "1 of N"; "Back" returns to the list with `store.getState().session` null; replaying a completed lesson shows the intro again (US3 AC3); leaving from the intro does not mark the lesson completed
- [X] T044 [US3] Run `npm test`, `npm run lint`, `npm run build`; all MUST pass

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Constitution V screen rules on every touched screen, docs, content review, final validation

<!-- Baseline gzipped main JS size (from T001): 110.15 KB (346.09 KB raw) -->

- [X] T045 [P] Add `viewport-fit=cover` to the viewport meta in index.html (`width=device-width, initial-scale=1, viewport-fit=cover`)
- [X] T046 [P] Add safe-area padding in src/index.css: `#root` padding becomes `max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))`; keep `max-width: 600px`; make sure `.primary-button` stays ≥ 44 px tall
- [X] T047 [P] Fix touch targets in src/components/Exercise.module.css: `.quit` gets `min-height: 44px; min-width: 44px` (currently ~40 px tall); `.tile` and `.tilePlaceholder` get `min-height: 44px` (currently ~36 px); keep `.answerLine`/`.bank` `min-height` large enough that placing a tile does not shift the layout (adjust 62px if tiles grow)
- [X] T048 [P] Update README.md (describe the 17-lesson course, unlocking, intro screen, credit to the book and tokipona.org) and ROADMAP.md (mark the book-based course done; PWA installability/offline remains "Next")
- [X] T049 Run `npm run build` and compare the gzipped main JS chunk with the T001 baseline: growth MUST be < 100 KB gzipped (plan Performance Goals)
- [X] T050 Create specs/002-book-course/checklists/content-review.md with one section per lesson (1–17) and checkboxes for C5 (`practisesGrammar` truthful), C6 (meanings consistent with the book's dictionary and not copied from it), C7 (no second correct MC option), C8 (only one word order correct), C9 (nothing copied from the book); a reviewer with the book (`resources/`) completes it and fixes any issue in the matching file in src/content/lessons/ (quickstart "Content review")
- [ ] T051 Run the manual validation table in specs/002-book-course/quickstart.md (scenarios 1–10) in `npm run dev`, including 360 px width in DevTools for list, intro, exercise and summary (no horizontal scroll, all buttons ≥ 44 px); time lessons 1, 9 and 17 played straight through answering correctly — each MUST finish in under 7 minutes (SC-001); then run `npm run dev -- --host` and open it from a real iPhone (Safari) and a real Android phone (Chrome) on the same network: play one lesson on each and check safe areas (notch, home indicator) and that tiles and buttons are easy to tap (Constitution V); fix any failure in the file responsible
  - Progress 2026-11-03 (in Chrome, phone width 358 px via same-origin iframe; window could not go below 500 px): scenarios 1–8 and 10 pass; all 17 lessons played to completion, each unlocking the next, no horizontal scroll, all targets ≥ 44 px. Fixed: intro `autoFocus` scrolled past the new words; short word tiles were 40 px wide (now `min-width: 44px`). **Remaining**: timing by a human learner (SC-001) and real iPhone/Android check.
- [X] T052 Final gate: `npm test`, `npm run lint`, `npm run build` all pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none
- **Foundational (Phase 2)**: after Setup — BLOCKS all user stories
  - T002 → T004 (lesson 1 uses new types) → T005 → T006/T007/T008 → T009; T003 parallel with T004
- **US1 (Phase 3)**: after Foundational
- **US2 (Phase 4)**: after US1 (needs lessons 2–4 to exist and the unlock selector/locked cards from T028–T029)
- **US3 (Phase 5)**: after Foundational; independent of US1 content, but T042 edits the same file as T031, so do T031 first if both are in flight
- **Polish (Phase 6)**: after the desired stories; T045–T048 can start any time after Foundational

### Within Each User Story

- Content files (T010–T025) before registration (T026) and C1 test (T027)
- Selector (T028) before list (T029) and route guard (T031)
- Code before its tests (Constitution IV); each phase ends with a full test run
- The content-rules suite (T006) is written after lesson 1 and then guards lessons 2–17 as they
  are written. It checks contract rules on data, not behavior, so this is not test-first
  development in the sense of Principle IV

### Same-file sequencing (not parallel)

- src/routes/LessonRoute.tsx: T031 → T042
- tests/integration/lessonFlow.test.tsx: T008 → T033 → T036 → T037 → T043
- tests/unit/progressSlice.test.ts: T032 → T038
- tests/unit/courseContent.test.ts: T006 → T027
- src/content/lessons/index.ts: T005 → T026

---

## Parallel Example: User Story 1

```bash
# All 16 lesson files are independent (one file each):
Task: "T010 Create src/content/lessons/02-nouns-and-adjectives.ts"
Task: "T011 Create src/content/lessons/03-you-and-i.ts"
Task: "T012 Create src/content/lessons/04-verbs.ts"
# ... through
Task: "T025 Create src/content/lessons/17-more-words-2.ts"

# Alongside the content, the unlock selector test can be written once T028 is done:
Task: "T032 selectIsUnlocked tests in tests/unit/progressSlice.test.ts"
```

## Parallel Example: Foundational and US3

```bash
Task: "T003 Create src/content/vocabulary.ts"
Task: "T004 Create src/content/lessons/01-words-and-sentences.ts"
# after Foundational:
Task: "T040 Create src/components/LessonIntro.tsx"
Task: "T041 Create src/components/LessonIntro.module.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup (baseline)
2. Phase 2: Foundational (types, vocabulary, lesson 1, content-rules suite, tests migrated)
3. Phase 3: US1 (16 more lessons, unlocking, list, credit)
4. **STOP and VALIDATE**: `npm test`, quickstart scenarios 1–3 and 5–7
5. Demo

### Incremental Delivery

1. Setup + Foundational → lesson 1 of the course playable
2. + US1 → full course with unlocking (MVP)
3. + US2 → multi-lesson progress verified across reloads
4. + US3 → grammar introduction before each lesson
5. + Polish → mobile screen rules, docs, content review, final validation

### Content authoring tip

Run `npx vitest run tests/unit/courseContent.test.ts` after each lesson file is registered: the C4
failure message names the exercise and the word used too early.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- Lesson ids are permanent (URLs and saved progress keys) — never rename after release
- Storage format `duopona:progress` v1 is unchanged; no migration
- No new dependencies (Constitution I)
- Installability and offline (Constitution V) are deliberately out of scope (plan Complexity Tracking)
- Commit after each task or logical group
