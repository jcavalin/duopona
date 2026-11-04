# Implementation Plan: Mascot and App Icon

**Branch**: `012-mascot-app-icon` | **Date**: 2026-11-04 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/012-mascot-app-icon/spec.md`

## Summary

The four mascot drawings go into `src/assets/mascot/` and are shown by a small `Mascot` component,
which renders a decorative `<img alt="">` for one expression. It is used in three places:

- the prompt row of `MultipleChoice` and `WordBank`, where it replaces `DropIcon`/`BubbleIcon`.
  The prompt becomes a speech bubble with a tail;
- `LessonSummary`, where the celebrating mascot replaces the star badge.

The expression comes from the `result` prop that `ExerciseScreen` already passes to
`MultipleChoice`. `WordBank` gets the same prop. Vite emits the drawings as hashed assets, and
adding `svg` to the service-worker precache patterns makes them work offline. The five ready-made
icon files from `docs/design/app-icon/` replace those in `public/`.

## Technical Context

**Language/Version**: TypeScript 6, React 19, CSS modules

**Primary Dependencies**: unchanged; no new dependencies

**Storage**: N/A (no data changes)

**Testing**: Vitest + Testing Library (jsdom); build-output tests `npm run test:pwa`; manual
check against mockups and on a phone (quickstart)

**Target Platform**: PWA on iOS Safari and Android Chrome, plus desktop browsers

**Project Type**: Frontend-only single-page web app

**Performance Goals**: The drawings are about 9 KB each (4 files, precached). The expression
switch is a `src` change on an already-cached image

**Constraints**: 360 px with no horizontal scroll; offline; decorative (hidden from assistive
technology); reduced motion (no animation)

**Scale/Scope**: new `Mascot.tsx` and 4 SVG assets. Edits to `MultipleChoice.tsx`, `WordBank.tsx`,
`ExerciseScreen.tsx`, `LessonSummary.tsx`, `Exercise.module.css`, `icons.tsx` (remove unused
icons), `vite.config.ts` (precache pattern) and `pwa-assets.config.mjs` (comment). The 5 icon
files in `public/`. Tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. KISS | ✅ | One tiny component with three current uses. The drawings are plain image files, not converted to JSX. No animation (spec default) |
| II. Frontend-only, local-first | ✅ | No data stored or sent |
| III. Standard React stack | ✅ | Expression is derived from the existing `result` prop; no new state |
| IV. Tests after code, before done | ✅ | Integration tests for expression per state (lesson and practice), summary mascot, no old icons, mascot hidden from a11y tree. Build tests for precached mascot SVGs and the new icon files. Looks and home-screen icons are manual checks (quickstart) |
| V. Mobile-first PWA | ✅ | 360 px layout check; precached for offline; maskable icon keeps the mascot inside the safe zone |

Post-design re-check: still passes; no Complexity Tracking entries.

## Project Structure

### Documentation (this feature)

```text
specs/012-mascot-app-icon/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/ui-mascot.md
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
public/                               # 5 icon files replaced from docs/design/app-icon/ (R5)
pwa-assets.config.mjs                 # comment: icons are hand-made, don't regenerate (R5)
vite.config.ts                        # workbox globPatterns + svg (R4)
src/
├── assets/mascot/                    # NEW: mascot-{idle,sad,happy,celebrate}.svg (R1)
└── components/
    ├── Mascot.tsx                    # NEW: <img alt=""> per expression (R2)
    ├── MultipleChoice.tsx            # Mascot replaces DropIcon (R3)
    ├── WordBank.tsx                  # Mascot replaces BubbleIcon; new `result` prop (R3)
    ├── ExerciseScreen.tsx            # pass `result` to WordBank (R3)
    ├── LessonSummary.tsx             # celebrate Mascot replaces the star badge (R3)
    ├── Exercise.module.css           # promptRow/bubble tail, mascot sizes; drop badge styles (R6)
    └── icons.tsx                     # remove DropIcon if unused (R3)
tests/
├── integration/lessonFlow.test.tsx   # expressions, summary mascot (R7)
├── integration/practiceFlow.test.tsx # expressions in practice (R7)
├── integration/wordBank.test.tsx     # renders WordBank directly: pass `result` where needed (R7)
└── build/pwa.test.ts                 # mascot SVGs precached; icons are the new files (R7)
```

**Structure Decision**: Single frontend project, existing layout. One new component and one new
asset folder.

## Complexity Tracking

None.
