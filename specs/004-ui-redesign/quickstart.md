# Quickstart: Validate the Dark UI Redesign

## Prerequisites

- `npm install` (no new packages; the font files live in `public/fonts/`).
- Automated gate: `npm test`, `npm run lint`, `npm run build`, `npm run test:pwa`, all passing.
- For visual checks: the owner runs `npm run preview` (production build with the service
  worker) or `npm run dev`; checks run in Chrome with DevTools device mode at **390×844** (the
  mockup size) and **360×740** (the narrowest supported width).
- Reference: the seven images in `docs/design/mockups/`, the contract
  [contracts/ui-screens.md](contracts/ui-screens.md) and the tokens in
  `docs/design/ui-redesign.md`.

## Test data

To match mockups 01 and 07, complete lesson 1 ("Words and Sentences"); lesson 2 ("Nouns and
Adjectives") is then the current node. Mockups 03–06 show lesson 2's exercises.

## Desktop / device-mode checks (Chrome)

| # | Steps | Expected |
|---|-------|----------|
| V1 | Open `#/` with lesson 1 done, at 390×844 | Matches mockup 01: wordmark, "1 / 17", green banner "Course · 1 of 17 done", gold node with check, current node with ring and "Start", grey locked nodes, credit at the bottom |
| V2 | Complete lessons until the current node is below the fold (e.g. 6 done), reload `#/` | Page opens scrolled so the current node is visible |
| V3 | Tap the current node | Intro matches mockup 02: overline "Book: Lesson 3 · 13 exercises"-style, word cards in two columns, tinted grammar card, Start fixed at the bottom; X returns to the path |
| V4 | Start; on a multiple-choice exercise select an option with the mouse, then press keys 1, 2, 3 | Matches mockup 03; each key selects that option; Check becomes active. Keys do nothing after Check |
| V5 | Answer one exercise wrong, one right | Red sheet "Not quite" + correct answer (mockup 04), chosen option red; green sheet "pona! Correct." (mockup 06); Continue focused in both |
| V6 | Play a word-bank exercise that practises grammar | Mockup 05: "Grammar" tag, tiles move onto the ruled lines, grey placeholders stay in the bank |
| V7 | Finish the lesson | Mockup 07: star badge, "Correct X / Y", "Unlocked <next>"; Continue → path updated; Replay lesson → intro of the same lesson |
| V8 | At 360×740, open the intro of the lesson with the longest grammar text and play a lesson with the longest prompts/options | No horizontal scroll; text wraps inside cards; the last content scrolls into view above the bottom bar and above the feedback sheet |
| V9 | Measure contrast of each token pair used (text, muted text, labels on banner/nodes/sheets, icons) with DevTools' contrast picker | Body text ≥ 4.5:1, large text and icons ≥ 3:1; record the lowest ratio here |
| V10 | Tab through the path, intro, an exercise, feedback and summary | Every control reachable, visible focus ring on dark background, locked nodes not activatable |
| V11 | DevTools → Rendering → emulate `prefers-reduced-motion: reduce`; trigger feedback | Sheet appears without sliding |
| V12 | DevTools → Rendering → emulate `prefers-color-scheme: light`; reload | Still dark everywhere |
| V13 | After one online load with `npm run preview`, set Network to Offline and reload | Same look, Nunito still used (DevTools → Computed → Rendered fonts: "Nunito"); Network panel shows no request to another origin at any time |

## Real devices (owner; can be combined with 003's open T016–T021)

| # | Steps | Expected |
|---|-------|----------|
| D1 | iPhone Safari and Android Chrome, in the browser: repeat V1, V3–V7 | Matches mockups; browser bars dark (theme color) |
| D2 | Installed app on both phones: open path, intro, an exercise with feedback, summary, in portrait and landscape | Status bar dark (iOS `black-translucent`), nothing under the notch or home indicator, bottom bars clear of the home indicator |
| D3 | Installed, airplane mode | Same look and font as online |

Record results under the matching tasks in `tasks.md`.
