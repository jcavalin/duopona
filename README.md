# Duopona

A Duolingo-style web app for learning **Toki Pona**. It runs entirely in the browser:
no account, no backend, and progress is saved on your device (`localStorage`). It can be
installed to the home screen (browser menu → "Install app" / "Add to Home Screen") and works
offline after the first visit, including every lesson.

## The course

17 lessons that follow the chapter order of *Toki Pona: The Language of Good* by Sonja Lang
([tokipona.org](https://tokipona.org)), skipping its Proper Names and Numbers chapters, plus two
"More Words" lessons that complete the book's dictionary. Each lesson opens with its new words
and a short grammar explanation, then multiple-choice and word-bank exercises. Lessons unlock in
order: finish one to open the next; finished lessons can be replayed any time.

All sentences, exercises and explanations are original to Duopona; only the chapter order, word
lists and grammar topics follow the book.

## Getting started

Requires Node.js 20+.

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

`dist/` is static and can go on any static host, as long as:

- it is served over **HTTPS** (browsers allow installing and offline use only on HTTPS or
  `localhost`);
- `index.html`, `sw.js` and `manifest.webmanifest` are served with `Cache-Control: no-cache`
  so updates are found; the hashed files in `assets/` can be cached for a year.

## Project layout

- `src/content/lessons/` — one file per lesson, in course order (`index.ts`)
- `src/content/vocabulary.ts` — every course word with its meaning
- Content rules (no word before it is taught, every new word used, …) are checked by
  `tests/unit/courseContent.test.ts`; see `specs/002-book-course/contracts/lesson-content.md`
- `src/store/` — Redux state: current lesson session, saved progress, persistence
- `src/components/`, `src/routes/` — UI and pages (`#/` lesson list, `#/lesson/:id`)
- `public/` — app icons (`icon.svg` is the source; regenerate the PNGs with
  `npx @vite-pwa/assets-generator@2`, config in `pwa-assets.config.mjs`)
- `vite.config.ts` — build, PWA manifest and service-worker settings
  (see `specs/003-pwa-offline-mobile/contracts/`)
- `tests/` — unit and integration tests (Vitest + React Testing Library); `tests/build/` checks
  the production build (`npm run test:pwa`)
- `specs/` — Spec Kit feature specs, plans and tasks
- `.specify/memory/constitution.md` — project principles
