# Contract: French Course Content

The French lessons live in `src/content/fr/` and follow every rule of
[002 lesson-content.md](../../002-book-course/contracts/lesson-content.md) (C1–C11) and of
[014 course-content-pt.md](../../014-portuguese-language/contracts/course-content-pt.md)
(P1–P3 and P6–P8), applied to the French text. In those rules, "Portuguese" means "French". Rules
P4 and P5 are replaced by F3 and F4 below.

| Rule | Requirement | Checked by |
|------|-------------|------------|
| P7 (French) | Chapters are "Leçon N" with the English book's numbers, or "Dictionnaire" | unit test |
| F1 | Typography: `?`, `!`, `;`, `:` are preceded by U+202F (or U+00A0), never by a plain space or by nothing, in French course text and French interface strings | unit test |
| F2 | No word-bank tile ends with an apostrophe: an elided word is one tile with the word it attaches to ("l'animal", "j'ai") | unit test |
| F3 | Register and usage (research R5/R6): "tu" for addressing the learner; *sina* glossed "tu / toi / vous"; standard French | owner review |
| F4 | Word-bank answers: one natural sentence allowing only one order. The subject pronoun is included, articles are their own tiles, contractions are one tile, and adjectives are placed as French requires. No distractor allows another correct sentence (gender pairs, tu/vous) | owner review; unit test for C8 shape rules |
