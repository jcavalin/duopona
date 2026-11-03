# Implementation Plan: Dark Duolingo-Style UI Redesign

**Branch**: `004-ui-redesign` | **Date**: 2026-11-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-ui-redesign/spec.md`

## Summary

Restyle every screen to the seven approved dark mockups (`docs/design/mockups/`) without
changing lesson behavior or saved data. The work is mostly CSS (new dark tokens, Nunito,
"chunky" 3D buttons) plus markup changes in the existing components: the lesson list becomes
a zigzag path of nodes with a counter and banner, lesson screens get a top bar and a sticky
bottom bar that the feedback sheet replaces, and the summary gains stat cards and a Replay
action. Small behavior additions: number-key selection in multiple choice, scrolling to the
current lesson, and Replay. Nunito ships as two self-hosted Latin woff2 files added to the
offline precache; the app becomes dark-only, including theme color and the iOS status bar.

## Technical Context

**Language/Version**: TypeScript 6 (strict)

**Primary Dependencies**: React 19, Redux Toolkit 2, react-redux 9, React Router 8, Vite 8,
vite-plugin-pwa 2; **no new dependencies** (font files and SVG icons are static, research R1, R6)

**Storage**: Unchanged: `localStorage` key `duopona:progress` v1; no store or format changes

**Testing**: Vitest + React Testing Library (`tests/integration/lessonFlow.test.tsx` updated for
new texts and extended for new behavior); `tests/build/pwa.test.ts` extended for font precache
and theme colors; manual visual checks per quickstart V1–V13, D1–D3

**Target Platform**: iOS Safari and Android Chrome (browser and installed); desktop browsers

**Project Type**: Frontend-only single-page web app (PWA)

**Performance Goals**: 2 taps from home to first exercise (SC-003); precache grows by
~81 KB (two font files) and stays < 1 MB (003 contract O7)

**Constraints**: Must match mockups (SC-001); 360 px minimum width, 44 px targets, safe areas
(FR-020); offline font (SC-006); contrast ≥ 4.5:1 / 3:1 (FR-004); reduced motion (FR-022)

**Scale/Scope**: 5 screens restyled across ~9 components and 4 CSS modules; 1 new icons file;
2 font files + license; ~4 head/manifest values; 0 new routes, 0 store changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. KISS | No new dependencies: font copied as two files instead of a package (R1); seven hand-drawn SVG icons instead of an icon library (R6). Only shared abstraction: three global layout classes used by three screens (R4). No theme switcher (dark only) | ✅ Pass |
| II. Frontend-only, local-first | No data changes, no new storage. Font self-hosted, so no third-party request (R1, quickstart V13) | ✅ Pass |
| III. Standard React stack | Same stack. New UI state is route-local (`startedId` reset for Replay, R10); MC keyboard listener is component-local (R5); no Redux changes | ✅ Pass |
| IV. Tests after code, before done | Lesson-flow suite updated for changed texts and extended for: node states and labels, counter, Grammar tag, number keys, option result color class, Unlocked card, Replay, Continue. Build suite asserts font precache and colors. Visual match, contrast, safe areas and device look use the IV exception: quickstart V1–V13, D1–D3 recorded in tasks.md | ✅ Pass |
| V. Mobile-first PWA | Layout designed at 360–390 px; 44 px targets kept (nodes 76×70, buttons 52 px, tiles ≥ 44); safe-area padding moves into top/bottom bars (R4); font precached for offline (R2); status bar handled for installed iOS (R3). Device check D1–D3 | ✅ Pass |
| Governance: Transitional compliance | 003 (Principle V) is merged and implemented; only its manual device checks are open, deferred by the owner. No new gap is introduced; recorded below | ✅ Pass (noted in Complexity Tracking) |

**Post-design re-check (after Phase 1)**: unchanged. Design adds no stored data, no
dependency, no abstraction beyond the three layout classes; contracts list every changed text
so tests can follow them.

## Project Structure

### Documentation (this feature)

```text
specs/004-ui-redesign/
├── plan.md
├── research.md                   # R1–R12
├── data-model.md                 # derived values only; no stored data changes
├── quickstart.md                 # V1–V13 (Chrome), D1–D3 (phones)
├── contracts/
│   ├── ui-screens.md             # roles, names and texts per screen (S1–S5)
│   └── app-identity-changes.md   # dark theme color, status bar, font precache
├── checklists/requirements.md
└── tasks.md                      # /speckit-tasks
```

### Source Code (repository root)

```text
index.html                        # theme-color, status-bar-style (R3)
vite.config.ts                    # manifest colors, woff2 in globPatterns (R2, R3)
public/fonts/
├── nunito-latin-wght-normal.woff2   # new (R1)
├── nunito-latin-wght-italic.woff2   # new (R1)
└── OFL.txt                          # new: font license
src/
├── index.css                     # dark tokens, @font-face, base type, .screen/.screen-body/.bottom-bar,
│                                 #   chunky .primary-button (+ .danger variant), focus ring, reduced motion
├── routes/LessonRoute.tsx        # passes lesson/next lesson to summary; Replay resets startedId (R10)
└── components/
    ├── icons.tsx                 # new: 7 inline SVG icons (R6)
    ├── LessonList.tsx            # top bar, banner, zigzag path, node states/labels, scroll to current (R7, R8, R11)
    ├── LessonList.module.css
    ├── LessonIntro.tsx           # X close, overline, word-card grid, grammar card, bottom bar
    ├── LessonIntro.module.css
    ├── ExerciseScreen.tsx        # top bar (X, progressbar, n/total), passes result to MC (R9)
    ├── MultipleChoice.tsx        # instruction text, prompt row, numbered cards, number keys (R5), result color
    ├── WordBank.tsx              # instruction text, Grammar tag, prompt row, ruled answer lines
    ├── FeedbackBanner.tsx        # bottom sheet, new texts, wrong icon (R9)
    ├── LessonSummary.tsx         # badge, stat cards, Continue + Replay (R10)
    ├── Exercise.module.css       # exercise, feedback sheet and summary styles
    └── (HomeRoute unchanged)
tests/
├── integration/lessonFlow.test.tsx   # updated texts + new behavior tests
└── build/pwa.test.ts                 # font precache, dark colors
specs/003-pwa-offline-mobile/contracts/app-identity.md   # rows updated per contracts/app-identity-changes.md
```

**Structure Decision**: Existing single-project layout; all changes stay in the current
components and their CSS modules, plus one icons file and static font files.

## Complexity Tracking

| Item | Why Needed | Simpler Alternative Rejected Because |
|------|------------|-------------------------------------|
| 003's manual device checks (T014, T016–T021) still open while this feature starts | Owner's choice (2026-11-03) to continue with the redesign; 003's code is merged and Principle V is implemented, only its recorded phone verification is pending | Blocking the redesign on phone sessions: the owner prefers to run 003's device checks together with this feature's D1–D3, which re-test the same installed app with the final look |
| Global layout classes `.screen`, `.screen-body`, `.bottom-bar` | Shared by intro, exercise and summary (3 uses) for the sticky bottom bar (R4) | Duplicating the same rules in three CSS modules; a `<Screen>` component adds a layer CSS does not need |
