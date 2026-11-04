# Implementation Plan: Purple Brand Colours

**Branch**: `011-purple-brand-colours` | **Date**: 2026-11-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/011-purple-brand-colours/spec.md`

## Summary

The green brand becomes purple. "Correct" keeps the old green through its own `--success*`
tokens. Nearly all of the work is token values:

- the neutral and `--primary*` tokens in `src/index.css` take the values from
  [docs/design/purple-theme.md](../../docs/design/purple-theme.md);
- new `--success`, `--success-deep` and `--success-text` tokens sit next to the existing
  `--success-tint`;
- the correct sheet's icon circle, its title and its Continue button switch from `--primary*`
  to `--success*`, using a new `.primary-button.success` modifier that mirrors `.danger`;
- the manifest `background_color`/`theme_color` and the `<meta name="theme-color">` become
  `#16151F`.

A new unit test reads the stylesheets. It checks the token values, that no old green or
blue-slate is left, and the FR-008 contrast pairs.

## Technical Context

**Language/Version**: TypeScript 6, React 19, plain CSS (global `index.css` + CSS modules)

**Primary Dependencies**: unchanged; no new dependencies

**Storage**: N/A (no data changes)

**Testing**: Vitest + Testing Library (jsdom); build-output test `npm run test:pwa`; manual
visual check against the mockups in quickstart.md

**Target Platform**: PWA on iOS Safari and Android Chrome, plus desktop browsers

**Project Type**: Frontend-only single-page web app

**Performance Goals**: N/A (colour values only)

**Constraints**: text contrast ≥ 4.5:1 (FR-008); layout unchanged (FR-009); dark theme only

**Scale/Scope**: `src/index.css`, `Exercise.module.css`, `FeedbackBanner.tsx` (one class name),
`vite.config.ts`, `index.html`, `tests/build/pwa.test.ts`, one new unit test

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. KISS | ✅ | Token values plus one button modifier that copies the existing `.danger` pattern. The test reads CSS with a regex; no CSS parser dependency |
| II. Frontend-only, local-first | ✅ | No data stored or sent |
| III. Standard React stack | ✅ | Unchanged |
| IV. Tests after code, before done | ✅ | Automated: token values, leftover-colour scan, contrast pairs, correct-sheet success classes, manifest and meta colours. Visual match with the mockups and the phone bar colour are manual checks (quickstart M1–M5), which the browser-only exception allows |
| V. Mobile-first PWA | ✅ | No layout change; the manifest and meta colours keep the installed app consistent |

Post-design re-check: still passes; no Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/011-purple-brand-colours/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-colours.md
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
index.html                            # theme-color meta → #16151F (R5)
vite.config.ts                        # manifest background/theme colour → #16151F (R5)
src/
├── index.css                         # new token values, --success* tokens, .primary-button.success (R1, R2)
└── components/
    ├── FeedbackBanner.tsx            # correct Continue gets the success modifier (R2)
    └── Exercise.module.css           # correct icon circle + title → --success* (R2)
tests/
├── unit/theme.test.ts                # NEW: token values, leftovers, contrast (R6)
├── integration/lessonFlow.test.tsx   # correct sheet Continue has the success modifier (R6)
└── build/pwa.test.ts                 # expected colours → #16151F (R5)
```

**Structure Decision**: Single frontend project, existing layout. One new test file.

## Complexity Tracking

None.
