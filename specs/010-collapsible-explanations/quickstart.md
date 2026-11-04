# Quickstart: Collapsible Mistake Explanations

## Automated

```sh
npm test          # unit + integration (includes the 010 sheet tests)
npm run lint
npm run build
```

Expected: all pass. The integration tests cover:

- the explanation is hidden by default;
- "Why?" / "Hide" and `aria-expanded`;
- it resets on the next mistake and on the retry;
- no toggle after a right answer;
- focus stays on Continue, and the toggle works from the keyboard;
- the status region holds only the title and the correct answer;
- the 008 content shows unchanged once opened, in lesson and practice sessions;
- no saved data changes.

## Manual check (layout; jsdom cannot measure it)

Run `npm run dev` and open the app in a desktop browser with device emulation.

| # | Check | Expected |
|---|-------|----------|
| M1 | 390 × 844: second lesson on the path ("Nouns and Adjectives"), answer "good water" wrong with "pona telo" | Matches mockup 4a apart from theme and mascot: "Why? ⌄" top right of the sheet, no explanation |
| M2 | Tap "Why?" | Matches 4b: "Hide ⌃" with filled background, darker card with the telo and pona meanings. This multiple-choice exercise has no grammar note, unlike the mockup |
| M2b | Same lesson, miss a word-bank exercise marked Grammar, tap "Why?" | Card adds a divider, grammar title, "FROM LESSON 3 · NOUNS AND ADJECTIVES" (the course's chapter; mockup 4b's "Lesson 2" is a mockup error) and the note, styled as 4b |
| M3 | 360 × 640, the longest explanation (a multi-word grammar sentence) opened | Sheet stops at about 60% of the height; only the card scrolls; heading, toggle and Continue stay visible; no horizontal scroll |
| M4 | Keyboard only: wrong answer → Shift+Tab → Enter → Tab → Enter | Focus starts on Continue; Shift+Tab reaches the toggle, Enter opens it; Tab (through the card when it scrolls, as Chrome makes scrollable areas focusable) back to Continue, Enter continues |
| M5 | Reduced motion on, toggle | Chevron flips without animation |
| M6 | Phone (iOS Safari or Android Chrome, in the browser or installed): M1, M2 and M3 | Same as above; the sheet stays clear of the home indicator; the 60% cap holds as the browser bars show and hide |

Record results (or an owner waiver) in tasks.md, as Principle IV requires.
