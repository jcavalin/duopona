# Duopona

A Duolingo-style web app for learning **Toki Pona**. It runs entirely in the browser:
no account, no backend, and progress is saved on your device (`localStorage`).

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
```

## Project layout

- `src/content/lessons/` — one file per lesson, in course order (`index.ts`)
- `src/content/vocabulary.ts` — every course word with its meaning
- Content rules (no word before it is taught, every new word used, …) are checked by
  `tests/unit/courseContent.test.ts`; see `specs/002-book-course/contracts/lesson-content.md`
- `src/store/` — Redux state: current lesson session, saved progress, persistence
- `src/components/`, `src/routes/` — UI and pages (`#/` lesson list, `#/lesson/:id`)
- `tests/` — unit and integration tests (Vitest + React Testing Library)
- `specs/` — Spec Kit feature specs, plans and tasks
- `.specify/memory/constitution.md` — project principles
