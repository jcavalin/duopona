# Duopona Roadmap

Ideas and planned features not yet specified. When one is picked up, start it with
`/speckit-specify <description>` and move it to **In progress** (with its `specs/` folder).

## In progress

- **PWA & mobile compliance** (required by Constitution Principle V; allowed to slip past 002
  only under Governance "Transitional compliance", v1.2.0, so it MUST be the next feature): web
  app manifest and icons (installable), service worker for full offline use including all lesson
  content, checked on iOS Safari and Android Chrome, installed and in the browser. (Safe-area
  insets and 44×44 px touch targets were done in 002.)
  Spec: `specs/003-pwa-offline-mobile/`. Status: built and checked in desktop Chrome; remaining:
  desktop install check and real iPhone/Android checks (tasks T014, T016–T021).
- **UI redesign: Duolingo-style, dark mode**: restyle all screens to the approved mockups:
  lesson path, intro, exercises, feedback sheets, summary. Reference:
  [docs/design/ui-redesign.md](docs/design/ui-redesign.md). Spec: `specs/004-ui-redesign/`.
  Status: built, tested and checked in desktop Chrome; remaining: DevTools checks (360 px,
  reduced motion, offline) and real iPhone/Android checks (tasks T027, T030–T031).

## Next

- (none)

## Done

- **001 – First lesson flow** (`specs/001-first-lesson-flow/`).
- **002 – Book-based course**: 17 lessons following *Toki Pona: The Language of Good*, with
  unlocking and lesson introductions (`specs/002-book-course/`).
- **005 – GitHub Pages deployment**: checks on every push, `main` published to
  https://jcavalin.github.io/duopona/ (`specs/005-github-pages-deploy/`). The pipeline's
  failure, pull-request, manual-run and overlap checks were skipped by owner decision.

## Later

- **Practice session**: a "Practice" button that builds a ~10-exercise session mixed from all
  completed lessons, using the existing lesson flow. Small; reuses current exercises.
- **Review weak words**: practice that favours words the learner got wrong before. Needs
  per-word mistake tracking (builds on Practice session).
- **Daily goal / streak**: encourage a little practice every day.

## Ideas (not yet evaluated)

- Progress counter alternatives (count every attempt, or progress bar only); see FR-007 of
  feature 001.
- Audio pronunciation (would enable the book's Lesson 1, "Letters and Sounds").
- sitelen pona (Toki Pona glyphs).
- Light theme following the device setting (004 ships dark only; the light palette is in the
  design canvas history).
