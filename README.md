# Duopona

A Duolingo-style web app for learning **Toki Pona**. It runs entirely in the browser:
no account, no backend, and progress is saved on your device (`localStorage`). It can be
installed to the home screen (browser menu → "Install app" / "Add to Home Screen") and works
offline after the first visit, including every lesson.

**Try it:** https://jcavalin.github.io/duopona/

## The course

17 lessons that follow the chapter order of *Toki Pona: The Language of Good* by Sonja Lang
([tokipona.org](https://tokipona.org)), skipping its Proper Names and Numbers chapters, plus two
"More Words" lessons that complete the book's dictionary. Each lesson opens with its new words
and a short grammar explanation, then multiple-choice and word-bank exercises. Lessons unlock in
order: finish one to open the next; finished lessons can be replayed any time.

Two buttons on the home screen keep old material fresh:

- **Practice**: 10 random exercises from the lessons you have finished.
- **Review weak words**: 10 exercises built around the words you get wrong most. Every first
  answer to an exercise counts: a wrong one adds a mistake to each Toki Pona word in it, a
  right one removes one (but not from words you already missed in the same session). A word
  stays "weak" until its mistakes are back to zero.

Practice never changes lesson progress. Progress is saved under `duopona:progress` and word
mistakes under `duopona:words`, both in `localStorage`.

The app has one dark, Duolingo-style look: a lesson path on the home screen, chunky buttons
and colored feedback sheets. Design reference, mockups and color tokens:
[docs/design/ui-redesign.md](docs/design/ui-redesign.md).

All sentences, exercises and explanations are original to Duopona; only the chapter order, word
lists and grammar topics follow the book.

## Getting started

Requires Node.js 20.19+ or 22.12+ (CI uses 26).

```bash
npm install
npm run dev      # start the dev server, open the printed URL
npm test         # run the test suite once (npm run test:watch to keep watching)
npm run lint     # lint
npm run build    # production build into dist/ (static files, host anywhere)
npm run preview  # serve dist/ at http://localhost:4173 — offline support and install work here
npm run test:pwa # after a build: checks dist/ (manifest, icons, offline file list)
```

The service worker (offline copy) only exists in production builds; `npm run dev` never
registers one, so there is no stale cache during development. A new version is downloaded in
the background and used from the next launch, after every Duopona window is closed.

## Hosting

The build uses relative paths, so `dist/` works at any path: a site root or a sub-folder such
as `/duopona/`. It is static and can go on any static host, as long as:

- it is served over **HTTPS** (browsers allow installing and offline use only on HTTPS or
  `localhost`);
- ideally, `index.html`, `sw.js` and `manifest.webmanifest` are served with
  `Cache-Control: no-cache` so updates are found quickly; the hashed files in `assets/` can be
  cached for a year.

GitHub Pages, the reference host, serves every file with a fixed 10-minute cache that cannot
be changed. That is fine: browsers check `sw.js` for a new version past the HTTP cache, so
learners still get a new version within two launches.

## Deployment

`.github/workflows/deploy.yml` runs `npm ci`, the tests, lint, the build and `test:pwa` on
every push, pull request and manual start. On `main` only, when all of them pass, it publishes
the checked `dist/` to GitHub Pages at https://jcavalin.github.io/duopona/. Nothing is
published from other branches, pull requests or failing runs. Runs on `main` queue, so the
newest commit always ends up published.

One-time setup: the repository must be public, and Settings → Pages → Build and deployment →
Source must be **GitHub Actions** (until then, the deploy step fails with a message saying so).

To publish again without a commit: Actions → "Check and deploy" → "Run workflow" on `main`.

## Project layout

- `src/content/lessons/` — one file per lesson, in course order (`index.ts`)
- `src/content/vocabulary.ts` — every course word with its meaning
- Content rules (no word before it is taught, every new word used, …) are checked by
  `tests/unit/courseContent.test.ts`; see `specs/002-book-course/contracts/lesson-content.md`
- `src/store/` — Redux state: current lesson or practice session, saved progress, word
  mistake records, persistence
- `src/lib/practice.ts` — how Practice and Review choose exercises; `src/content/words.ts` —
  which words an exercise tests
- `src/components/`, `src/routes/` — UI and pages (`#/` lesson path, `#/lesson/:id`,
  `#/practice/practice` and `#/practice/review`);
  `src/components/icons.tsx` holds the inline SVG icons, `src/index.css` the color tokens and
  shared layout classes
- `public/` — app icons (`icon.svg` is the source; regenerate the PNGs with
  `npx @vite-pwa/assets-generator@2`, config in `pwa-assets.config.mjs`); `public/fonts/` —
  the Nunito font (Latin subset, SIL Open Font License in `OFL.txt`), self-hosted so it works
  offline
- `vite.config.ts` — build, PWA manifest and service-worker settings
  (see `specs/003-pwa-offline-mobile/contracts/`)
- `tests/` — unit and integration tests (Vitest + React Testing Library); `tests/build/` checks
  the production build (`npm run test:pwa`)
- `.github/workflows/deploy.yml` — checks and GitHub Pages deployment
  (`specs/005-github-pages-deploy/`)
- `specs/` — Spec Kit feature specs, plans and tasks
- `.specify/memory/constitution.md` — project principles
