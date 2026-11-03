# Content Review Checklist: Book-Based Toki Pona Course

**Purpose**: Human review of the content rules that cannot be fully automated
([contracts/lesson-content.md](../contracts/lesson-content.md), quickstart "Content review").
**Reviewer**: someone with the book (`resources/`, git-ignored) open.

**Already automated** (`tests/unit/courseContent.test.ts`): C1–C4, C5 count, C6 existence, C7 shape,
C8 distractors, C10 banned words, C11 ids/prompts.

**Automated pre-check for C9 (2026-11-03)**: every run of 3+ Toki Pona words in the lesson files
(exercises, options, explanations) was compared with the sentences of the book's text layer. Ten
short sentences that matched book exercise sentences were rewritten; the rescan found no
whole-sentence matches. Short phrases that only occur *inside* longer book sentences (e.g.
*mi moku e kili*, *mi kama sona*) were kept as ordinary constructions. Pages that are images
only are not covered by this scan.

For each lesson tick when checked; fix issues in the lesson file and note them below the lesson.

**Review 2026-11-03**: done by Claude, the author of the content, so it is a careful self-review,
not an independent one. Every exercise was read against the five rules; every gloss was compared
with the book's dictionary entry; the C9 scan was rerun after fixes. Fixes are noted per lesson.
A Toki Pona speaker spot-checking a few lessons (especially word-bank orders) is still worthwhile.

- C5: every `practisesGrammar: true` word bank really needs the lesson's grammar point (review lessons 14–17: combines two or more earlier points)
- C6: each meaning in `src/content/vocabulary.ts` for the lesson's new words agrees with the book's dictionary and is not copied from it
- C7: no multiple-choice exercise has a second correct option
- C8: every word bank has only one correct tile order for its prompt
- C9: no sentence, exercise or explanation is copied from the book

## 1. Words and Sentences (`src/content/lessons/01-words-and-sentences.ts`)

- [x] CR001 C5 grammar flags truthful
- [x] CR002 C6 meanings consistent, not copied
- [x] CR003 C7 single correct option
- [x] CR004 C8 single tile order
- [x] CR005 C9 nothing copied

## 2. Nouns and Adjectives (`src/content/lessons/02-nouns-and-adjectives.ts`)

- [x] CR006 C5 grammar flags truthful
- [x] CR007 C6 meanings consistent, not copied
- [x] CR008 C7 single correct option
- [x] CR009 C8 single tile order
- [x] CR010 C9 nothing copied
- Note: *The big house is a good thing.* also reads naturally as *tomo suli li pona* (leaving *ijo* unused). Kept: the prompt names "thing" explicitly. Judgment call.
- Fixed C6: *pona* gloss "fix" is not in the book's dictionary; now "good / useful / simple".

## 3. You and I (`src/content/lessons/03-you-and-i.ts`)

- [x] CR011 C5 grammar flags truthful
- [x] CR012 C6 meanings consistent, not copied
- [x] CR013 C7 single correct option
- [x] CR014 C8 single tile order
- [x] CR015 C9 nothing copied

## 4. Verbs (`src/content/lessons/04-verbs.ts`)

- [x] CR016 C5 grammar flags truthful
- [x] CR017 C6 meanings consistent, not copied
- [x] CR018 C7 single correct option
- [x] CR019 C8 single tile order
- [x] CR020 C9 nothing copied
- Fixed C8: *jan li pali e tomo* answer was "the person makes a house", which also works as "a person makes the house"; now "the person makes the house".

## 5. More Adjectives (`src/content/lessons/05-more-adjectives.ts`)

- [x] CR021 C5 grammar flags truthful
- [x] CR022 C6 meanings consistent, not copied
- [x] CR023 C7 single correct option
- [x] CR024 C8 single tile order
- [x] CR025 C9 nothing copied
- Fixed C6: *ike* gloss "complicated" is not in the book's dictionary; now "bad / negative".
- Fixed C8: "many small animals" (en→tp) also accepts *soweli mute lili*; now a tp→en word bank for *soweli lili mute*.
- Fixed C7/C8: distractor *ike* in "The water is not good." allowed the near-correct *telo li ike*; distractor is now *mute*.

## 6. Questions and Answers (`src/content/lessons/06-questions-and-answers.ts`)

- [x] CR026 C5 grammar flags truthful
- [x] CR027 C6 meanings consistent, not copied
- [x] CR028 C7 single correct option
- [x] CR029 C8 single tile order
- [x] CR030 C9 nothing copied

## 7. Prepositions (`src/content/lessons/07-prepositions.ts`)

- [x] CR031 C5 grammar flags truthful
- [x] CR032 C6 meanings consistent, not copied
- [x] CR033 C7 single correct option
- [x] CR034 C8 single tile order
- [x] CR035 C9 nothing copied

## 8. Greetings and Feelings (`src/content/lessons/08-greetings-and-feelings.ts`)

- [x] CR036 C5 grammar flags truthful
- [x] CR037 C6 meanings consistent, not copied
- [x] CR038 C7 single correct option
- [x] CR039 C8 single tile order
- [x] CR040 C9 nothing copied

## 9. pi (`src/content/lessons/09-pi.ts`)

- [x] CR041 C5 grammar flags truthful
- [x] CR042 C6 meanings consistent, not copied
- [x] CR043 C7 single correct option
- [x] CR044 C8 single tile order
- [x] CR045 C9 nothing copied

## 10. Pre-Verbs (`src/content/lessons/10-pre-verbs.ts`)

- [x] CR046 C5 grammar flags truthful
- [x] CR047 C6 meanings consistent, not copied
- [x] CR048 C7 single correct option
- [x] CR049 C8 single tile order
- [x] CR050 C9 nothing copied

## 11. Colours and la (`src/content/lessons/11-colours-and-la.ts`)

- [x] CR051 C5 grammar flags truthful
- [x] CR052 C6 meanings consistent, not copied
- [x] CR053 C7 single correct option
- [x] CR054 C8 single tile order
- [x] CR055 C9 nothing copied

## 12. Spatial Nouns (`src/content/lessons/12-spatial-nouns.ts`)

- [x] CR056 C5 grammar flags truthful
- [x] CR057 C6 meanings consistent, not copied
- [x] CR058 C7 single correct option
- [x] CR059 C8 single tile order
- [x] CR060 C9 nothing copied

## 13. Particles and Perspective (`src/content/lessons/13-particles-and-perspective.ts`)

- [x] CR061 C5 grammar flags truthful
- [x] CR062 C6 meanings consistent, not copied
- [x] CR063 C7 single correct option
- [x] CR064 C8 single tile order
- [x] CR065 C9 nothing copied
- Note: *I like sweet fruit.* (perspective *tawa*) is flagged as grammar practice. It is this lesson's taught role of *tawa*, though not *en*/*taso*; the two *taso* word banks meet FR-006 on their own.

## 14. Hunting (`src/content/lessons/14-hunting.ts`)

- [x] CR066 C5 grammar flags truthful
- [x] CR067 C6 meanings consistent, not copied
- [x] CR068 C7 single correct option
- [x] CR069 C8 single tile order
- [x] CR070 C9 nothing copied
- Fixed C6: *palisa* gloss copied the dictionary's "long hard thing"; *weka* had "to remove" (not in the dictionary).

## 15. Cooking (`src/content/lessons/15-cooking.ts`)

- [x] CR071 C5 grammar flags truthful
- [x] CR072 C6 meanings consistent, not copied
- [x] CR073 C7 single correct option
- [x] CR074 C8 single tile order
- [x] CR075 C9 nothing copied

## 16. More Words 1 (`src/content/lessons/16-more-words-1.ts`)

- [x] CR076 C5 grammar flags truthful
- [x] CR077 C6 meanings consistent, not copied
- [x] CR078 C7 single correct option
- [x] CR079 C8 single tile order
- [x] CR080 C9 nothing copied
- Fixed C8: "At the market, I hear many sounds." also accepts *mi kute e kalama mute lon esun* (no *la*); now "In a fight, I hear many sounds." (*utala la …*).
- Fixed C6: *jaki* gloss "waste" is not in the dictionary; now "dirty / gross / toxic".

## 17. More Words 2 (`src/content/lessons/17-more-words-2.ts`)

- [x] CR081 C5 grammar flags truthful
- [x] CR082 C6 meanings consistent, not copied
- [x] CR083 C7 single correct option
- [x] CR084 C8 single tile order
- [x] CR085 C9 nothing copied
- Fixed C8: "I put the money inside the box." also accepted distractor *tawa*, and "put" is not a taught sense of *pana*; now "The money is inside the box." (distractor *sewi*).
- Fixed C6: *mun* gloss copied the dictionary's "night sky object"; now "moon / star".

