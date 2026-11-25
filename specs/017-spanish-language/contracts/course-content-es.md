# Contract: Spanish Course Content

The Spanish lessons live in `src/content/es/`. They follow every rule of
[002 lesson-content.md](../../002-book-course/contracts/lesson-content.md) (C1–C11) and of
[014 course-content-pt.md](../../014-portuguese-language/contracts/course-content-pt.md)
(P1–P3 and P6–P8), applied to the Spanish text; in those rules, read "Portuguese" as "Spanish".
Rules P4 and P5 are replaced by S3 and S4 below. The French rules F1–F4 do not apply.

| Rule | Requirement | Checked by |
|------|-------------|------------|
| P2b (Spanish) | Every Spanish text differs from the same field in English, French and Portuguese, except for the shared fields allowed for every pair of languages (`SAME_ACROSS`) and, against Portuguese only, the fields listed with a reason in `SAME_ES_PT` (research R7). An entry whose texts now differ fails the test | unit test |
| P7 (Spanish) | Chapters are "Lección N" with the English book's numbers, or "Diccionario" | unit test |
| S1 | Opening marks: in Spanish course text and Spanish interface strings, a sentence ending in "?" or "!" has a matching "¿" or "¡" before it, and there is no space before "?" or "!". A mark right after a Toki Pona word is Toki Pona punctuation and is exempt | unit test |
| S2 | Tiles: no word-bank tile is "¿" or "¡" alone; no answer has "a" + "el" or "de" + "el" as neighbouring tiles (use "al" / "del") | unit test |
| S5 | Neutral Spanish, partly automated: no whole word `vosotros`, `vosotras`, `vuestro/a/os/as` or `os` in Spanish course text, glosses or interface strings | unit test |
| S3 | Register and usage (research R5/R6, spec FR-014): "tú" for addressing the learner; "ustedes", never "vosotros"; no "vos"; no regionally marked words. *sina* glossed "tú / ti / usted" | owner review |
| S4 | Word-bank answers: one natural sentence that allows only one order. The subject pronoun is always included. Articles are their own tiles; "al" and "del" are one tile; adjectives come after the noun. No distractor allows another correct sentence (gender pairs, tú/usted, ser/estar) | owner review; unit test for C8 shape rules and S2 |
