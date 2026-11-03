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

- C5: every `practisesGrammar: true` word bank really needs the lesson's grammar point (review lessons 14–17: combines two or more earlier points)
- C6: each meaning in `src/content/vocabulary.ts` for the lesson's new words agrees with the book's dictionary and is not copied from it
- C7: no multiple-choice exercise has a second correct option
- C8: every word bank has only one correct tile order for its prompt
- C9: no sentence, exercise or explanation is copied from the book

## 1. Words and Sentences (`src/content/lessons/01-words-and-sentences.ts`)

- [ ] CR001 C5 grammar flags truthful
- [ ] CR002 C6 meanings consistent, not copied
- [ ] CR003 C7 single correct option
- [ ] CR004 C8 single tile order
- [ ] CR005 C9 nothing copied

## 2. Nouns and Adjectives (`src/content/lessons/02-nouns-and-adjectives.ts`)

- [ ] CR006 C5 grammar flags truthful
- [ ] CR007 C6 meanings consistent, not copied
- [ ] CR008 C7 single correct option
- [ ] CR009 C8 single tile order
- [ ] CR010 C9 nothing copied

## 3. You and I (`src/content/lessons/03-you-and-i.ts`)

- [ ] CR011 C5 grammar flags truthful
- [ ] CR012 C6 meanings consistent, not copied
- [ ] CR013 C7 single correct option
- [ ] CR014 C8 single tile order
- [ ] CR015 C9 nothing copied

## 4. Verbs (`src/content/lessons/04-verbs.ts`)

- [ ] CR016 C5 grammar flags truthful
- [ ] CR017 C6 meanings consistent, not copied
- [ ] CR018 C7 single correct option
- [ ] CR019 C8 single tile order
- [ ] CR020 C9 nothing copied

## 5. More Adjectives (`src/content/lessons/05-more-adjectives.ts`)

- [ ] CR021 C5 grammar flags truthful
- [ ] CR022 C6 meanings consistent, not copied
- [ ] CR023 C7 single correct option
- [ ] CR024 C8 single tile order
- [ ] CR025 C9 nothing copied

## 6. Questions and Answers (`src/content/lessons/06-questions-and-answers.ts`)

- [ ] CR026 C5 grammar flags truthful
- [ ] CR027 C6 meanings consistent, not copied
- [ ] CR028 C7 single correct option
- [ ] CR029 C8 single tile order
- [ ] CR030 C9 nothing copied

## 7. Prepositions (`src/content/lessons/07-prepositions.ts`)

- [ ] CR031 C5 grammar flags truthful
- [ ] CR032 C6 meanings consistent, not copied
- [ ] CR033 C7 single correct option
- [ ] CR034 C8 single tile order
- [ ] CR035 C9 nothing copied

## 8. Greetings and Feelings (`src/content/lessons/08-greetings-and-feelings.ts`)

- [ ] CR036 C5 grammar flags truthful
- [ ] CR037 C6 meanings consistent, not copied
- [ ] CR038 C7 single correct option
- [ ] CR039 C8 single tile order
- [ ] CR040 C9 nothing copied

## 9. pi (`src/content/lessons/09-pi.ts`)

- [ ] CR041 C5 grammar flags truthful
- [ ] CR042 C6 meanings consistent, not copied
- [ ] CR043 C7 single correct option
- [ ] CR044 C8 single tile order
- [ ] CR045 C9 nothing copied

## 10. Pre-Verbs (`src/content/lessons/10-pre-verbs.ts`)

- [ ] CR046 C5 grammar flags truthful
- [ ] CR047 C6 meanings consistent, not copied
- [ ] CR048 C7 single correct option
- [ ] CR049 C8 single tile order
- [ ] CR050 C9 nothing copied

## 11. Colours and la (`src/content/lessons/11-colours-and-la.ts`)

- [ ] CR051 C5 grammar flags truthful
- [ ] CR052 C6 meanings consistent, not copied
- [ ] CR053 C7 single correct option
- [ ] CR054 C8 single tile order
- [ ] CR055 C9 nothing copied

## 12. Spatial Nouns (`src/content/lessons/12-spatial-nouns.ts`)

- [ ] CR056 C5 grammar flags truthful
- [ ] CR057 C6 meanings consistent, not copied
- [ ] CR058 C7 single correct option
- [ ] CR059 C8 single tile order
- [ ] CR060 C9 nothing copied

## 13. Particles and Perspective (`src/content/lessons/13-particles-and-perspective.ts`)

- [ ] CR061 C5 grammar flags truthful
- [ ] CR062 C6 meanings consistent, not copied
- [ ] CR063 C7 single correct option
- [ ] CR064 C8 single tile order
- [ ] CR065 C9 nothing copied

## 14. Hunting (`src/content/lessons/14-hunting.ts`)

- [ ] CR066 C5 grammar flags truthful
- [ ] CR067 C6 meanings consistent, not copied
- [ ] CR068 C7 single correct option
- [ ] CR069 C8 single tile order
- [ ] CR070 C9 nothing copied

## 15. Cooking (`src/content/lessons/15-cooking.ts`)

- [ ] CR071 C5 grammar flags truthful
- [ ] CR072 C6 meanings consistent, not copied
- [ ] CR073 C7 single correct option
- [ ] CR074 C8 single tile order
- [ ] CR075 C9 nothing copied

## 16. More Words 1 (`src/content/lessons/16-more-words-1.ts`)

- [ ] CR076 C5 grammar flags truthful
- [ ] CR077 C6 meanings consistent, not copied
- [ ] CR078 C7 single correct option
- [ ] CR079 C8 single tile order
- [ ] CR080 C9 nothing copied

## 17. More Words 2 (`src/content/lessons/17-more-words-2.ts`)

- [ ] CR081 C5 grammar flags truthful
- [ ] CR082 C6 meanings consistent, not copied
- [ ] CR083 C7 single correct option
- [ ] CR084 C8 single tile order
- [ ] CR085 C9 nothing copied
