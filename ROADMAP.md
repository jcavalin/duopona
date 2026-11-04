# Duopona Roadmap

Ideas and planned features not yet specified. When one is picked up, start it with
`/speckit-specify <description>` and move it to **In progress** (with its `specs/` folder).

## In progress

(none)

## Next

(none; pick from Ideas)

## Done

- **001 – First lesson flow** (`specs/001-first-lesson-flow/`).
- **002 – Book-based course**: 17 lessons following *Toki Pona: The Language of Good*, with
  unlocking and lesson introductions (`specs/002-book-course/`).
- **003 – PWA & mobile**: installable, offline, basic play/install/offline confirmed on iPhone and
  Android (`specs/003-pwa-offline-mobile/`). The desktop install check and the remaining phone
  checks were skipped by owner decision.
- **004 – UI redesign**: dark Duolingo-style screens (`specs/004-ui-redesign/`). The DevTools
  checks (360 px, reduced motion, offline) and phone checks were skipped by owner decision.
- **005 – GitHub Pages deployment**: checks on every push, `main` published to
  https://jcavalin.github.io/duopona/ (`specs/005-github-pages-deploy/`). The pipeline's
  failure, pull-request, manual-run and overlap checks were skipped by owner decision.
- **006 – Practice & weak words**: Practice and Review weak words buttons, per-word mistake
  tracking (`specs/006-practice-weak-words/`). The 360 px, offline and phone checks were skipped
  by owner decision.
- **007 – Daily goal & streak**: one finished session a day, streak and best streak on the home
  screen (`specs/007-daily-goal-streak/`). The phone check was skipped by owner decision.
- **008 – Mistake explanations**: word meanings, grammar point and book lesson after a wrong
  answer (`specs/008-mistake-explanations/`). The phone check was skipped by owner decision.
- **009 – Reorder answer tiles**: drag or arrow-key placed words into a new order, and drag bank
  words into a chosen spot (`specs/009-reorder-answer-tiles/`). The phone check was deferred by
  owner decision (to be run later).

## Ideas (not yet evaluated)

- Progress counter alternatives (count every attempt, or progress bar only); see FR-007 of
  feature 001.
- Audio pronunciation (would enable the book's Lesson 1, "Letters and Sounds"). Being
  brainstormed: speaker buttons, listening exercises and the Letters and Sounds lesson, in
  stages; sound source still open (generated espeak-ng files from phonemes, a more natural
  speech tool, or human recordings).
- sitelen pona (Toki Pona glyphs).
- Light theme following the device setting (004 ships dark only; the light palette is in the
  design canvas history).
