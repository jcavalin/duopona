# Contract: Brazilian Portuguese Course Content

The Portuguese lessons live in `src/content/pt-BR/` and follow every rule of
[002 lesson-content.md](../../002-book-course/contracts/lesson-content.md) (C1–C11), applied to
the Portuguese text. On top of those, these rules apply. "Toki Pona side" is defined as in the
002 contract: the prompt for `tp-en`, the options for `en-tp` multiple choice, and the answer plus
distractors for `en-tp` word banks.

| Rule | Requirement | Checked by |
|------|-------------|------------|
| P1 | Same lessons in the same order; each lesson has the same `id` and `newWords`. Each exercise, in the same order, has the same `id`, `type`, `direction` and `practisesGrammar`, and an identical Toki Pona side. For `en-tp` multiple choice, the answer is the same Toki Pona option | unit test |
| P2 | Every non-Toki Pona field is present and non-empty: title, chapter, grammar title, 1–4 grammar paragraphs, prompts (`en-tp`), options and answer (`tp-en` multiple choice), answer and ≥ 1 distractor (`tp-en` word banks), and `grammarNote` exactly when `practisesGrammar` | unit test |
| P2b | Every non-Toki Pona field differs from its English counterpart (so nothing was left untranslated). Exceptions are only the Toki Pona title "pi" and entries on a commented allow-list | unit test |
| P3 | The Portuguese vocabulary has exactly the same keys as the English one, with non-empty glosses | unit test |
| P4 | Brazilian Portuguese usage (research R8): "você" for *sina*; no European-only forms | owner review |
| P5 | Word-bank answers: one natural sentence that allows only one order, using the tiles in research R8. The subject pronoun is included, articles and contractions are their own tiles, and adjectives come after the noun. No distractor allows another correct sentence | owner review; unit test for C8 shape rules |
| P6 | Multiple-choice options are distinct in Portuguese, and exactly one is correct | unit test (distinct), owner review (one correct) |
| P7 | Chapter labels are "Lição N" with the English book's numbers, or "Dicionário". Lesson titles are translated, except Toki Pona titles ("pi") | unit test |
| P8 | Grammar notes keep ≤ 2 sentences and ≤ 160 characters; all text is original to Duopona | unit test (length), owner review |
