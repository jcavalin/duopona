# Quickstart: Purple Brand Colours

## Automated

```sh
npm test          # unit + integration (includes tests/unit/theme.test.ts)
npm run lint
npm run build
npm run test:pwa  # manifest and theme-color meta are #16151F
```

Expected: all pass. The tests cover:

- every token has its purple-theme.md value, and the `--success*` tokens exist;
- no old green-brand or blue-slate value is left in any stylesheet, except as a
  `--success*` value;
- the contrast pairs pass;
- the correct sheet's Continue uses the success style, and the wrong sheet's uses danger;
- the manifest and meta colours are `#16151F`.

## Manual check (looks; jsdom does not compute colours)

Run `npm run dev` and open the app in a desktop browser with device emulation (390 × 844).
Compare with [docs/design/mockups/](../../docs/design/mockups/), ignoring the mascot and app
icon.

| # | Check | Expected |
|---|-------|----------|
| M1 | Lesson path (mockup 01) | Violet-grey background; purple banner and current node with tinted ring; lilac headings/wordmark; no green anywhere |
| M2 | Open a lesson intro (02), then a multiple-choice exercise and select an option (03), then a word-bank exercise (05) | Lilac headings, purple-tinted grammar card; purple progress fill and Check button; selected option purple-tinted with lilac text |
| M3 | Answer wrong (04) | Wrong sheet unchanged: red, "Why?" toggle and card as in 010 |
| M4 | Answer right (06), then finish the lesson (07) | Correct sheet green (background, circle, title, Continue) with the purple progress bar above it; summary: gold correct stat, purple unlocked stat |
| M5 | Phone (Android Chrome or iOS Safari, in the browser or installed): M1 and M4, plus the browser bar / launch screen | Same as above; the bar and launch screen are violet-grey `#16151F` |

Record results (or an owner waiver) in tasks.md, as Principle IV requires.
