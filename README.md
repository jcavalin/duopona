# Duopona

A Duolingo-style web app for learning **Toki Pona**. It runs entirely in the browser:
no account, no backend, and progress is saved on your device (`localStorage`).

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev      # start the dev server, open the printed URL
npm test         # run the test suite once (npm run test:watch to keep watching)
npm run lint     # lint
npm run build    # production build into dist/ (static files, host anywhere)
```

## Project layout

- `src/content/` — lesson data (add or edit exercises here)
- `src/store/` — Redux state: current lesson session, saved progress, persistence
- `src/components/`, `src/routes/` — UI and pages (`#/` lesson list, `#/lesson/:id`)
- `tests/` — unit and integration tests (Vitest + React Testing Library)
- `specs/` — Spec Kit feature specs, plans and tasks
- `.specify/memory/constitution.md` — project principles
