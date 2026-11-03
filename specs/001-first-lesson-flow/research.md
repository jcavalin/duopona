# Research: First Lesson Flow

All Technical Context unknowns are resolved below. Guiding rule: Constitution Principle I (KISS).

## 1. Language

- **Decision**: TypeScript (strict mode).
- **Rationale**: Lesson content and saved progress have fixed shapes; types catch content typos
  and persistence mismatches at build time with near-zero runtime cost. Vite supports it out of
  the box.
- **Alternatives considered**: Plain JavaScript — slightly less setup, but loses compile-time
  checking of lesson data, which is the most error-prone part of this app.

## 2. Build tool / scaffolding

- **Decision**: Vite with the `react-ts` template.
- **Rationale**: Standard, fast, minimal configuration; produces a static bundle that can be
  hosted anywhere (Principle II: no backend).
- **Alternatives considered**: Next.js / Remix — server features we explicitly do not need.
  Create React App — deprecated.

## 3. State management

- **Decision**: Redux Toolkit (`@reduxjs/toolkit`) + `react-redux`, with two slices:
  `progress` (persisted) and `session` (current lesson run, not persisted).
- **Rationale**: Mandated by Principle III; Redux Toolkit is the official, least-boilerplate way
  to use Redux. Lesson logic (answer checking, retry queue) lives in reducers, which are pure
  and easy to test.
- **Alternatives considered**: Plain React state/context — simpler, but the constitution requires
  Redux for shared state.

## 4. Persistence

- **Decision**: A ~20-line hand-written module: load `progress` from `localStorage` once when
  the store is created; save it on change via `store.subscribe`. Key: `duopona:progress`,
  value carries `version: 1`. Unreadable/incompatible data → empty progress. All storage calls
  wrapped in `try/catch`.
- **Rationale**: Only one small slice needs saving. Covers FR-009, FR-012 and the
  "storage disabled/full" edge case without a dependency.
- **Alternatives considered**: `redux-persist` — extra dependency and configuration for a single
  slice; unmaintained for long periods (rejected under Principle I).

## 5. Navigation

- **Decision**: React Router (v8, `react-router` package; planned as v7, v8 was current
  at install with the same APIs) with a hash router
  (`createHashRouter`). Routes: `#/` → lesson list; `#/lesson/:lessonId` → exercise screen,
  which shows the summary once the session is finished. Unknown lesson ids redirect to `#/`.
  Entering the lesson route starts a fresh session; leaving it (Quit, Back button) discards it.
  The route list lives in `src/router.tsx`; `main.tsx` wraps it in `createHashRouter`, and
  tests wrap the same list in `createMemoryRouter`.
- **Rationale**: Chosen by the project owner. Gives working browser Back/Forward and
  bookmarkable lesson URLs, and scales to future screens. Hash URLs work on any static host
  (e.g., GitHub Pages) with no server rewrite rules, keeping Principle II trivial to satisfy.
- **Alternatives considered**: No router (state-driven screens) — simpler, but Back button
  would not work. Browser history router (`createBrowserRouter`) — cleaner URLs, but needs an
  SPA fallback rewrite on the host; can be switched later in one line.

## 6. Testing

- **Decision**: Vitest + React Testing Library + `@testing-library/user-event`, jsdom
  environment. Tests are written after implementation (Principle IV).
- **Rationale**: Vitest shares Vite's configuration (no separate Babel/Jest setup). RTL tests
  behavior from the user's point of view, as required by Principle IV.
- **Test levels**:
  - Unit: `session` and `progress` reducers, answer checking, persistence load/save.
  - Component/integration: full lesson flow rendered with a real store (answer right/wrong,
    retry queue, summary, completion marked, reload simulated by recreating the store from
    `localStorage`).
- **Alternatives considered**: Jest — needs extra transform config with Vite. Playwright E2E —
  valuable later, overkill for one screen flow now.

## 7. Styling

- **Decision**: Plain CSS with CSS Modules (built into Vite). Mobile-first layout.
- **Rationale**: No dependency; scoped class names; enough for a handful of components.
- **Alternatives considered**: Tailwind, styled-components, component libraries — not needed
  yet.

## 8. Lesson content

- **Decision**: The first lesson is a typed TypeScript module (`src/content/lessons.ts`),
  ~10 exercises covering *mi, sina, ona, jan, pona, ike, moku, telo, toki, li*.
- **Rationale**: Content is static (spec assumption); type-checked; no loading or fetching.
- **Alternatives considered**: JSON file — no type checking without a schema validator.

## 9. Randomness

- **Decision**: Multiple-choice options and word-bank tiles are shuffled when an exercise is
  shown, using a shuffle function that accepts an injectable random source so tests are
  deterministic. Exercise order within the lesson is fixed (as authored).
- **Rationale**: Prevents "correct answer is always first" while keeping tests stable.

## 10. Answer checking

- **Decision**: Multiple choice — the selected option must equal the correct option. Word bank —
  the sequence of tapped words must exactly equal the expected word sequence (case-insensitive,
  order matters). One accepted answer per exercise (SC-005).
- **Rationale**: Word-bank input removes typing/punctuation ambiguity, so exact matching is
  sufficient.
