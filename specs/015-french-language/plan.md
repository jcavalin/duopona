# Implementation Plan: Study in French

**Branch**: `015-french-language` | **Date**: 2026-11-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/015-french-language/spec.md`

## Summary

French becomes the third study language, next to English and Brazilian Portuguese. It uses the
structure feature 014 built:
- `'fr'` is added to the `Language` type;
- the three `Record<Language, …>` maps (interface strings, courses, vocabularies) get a French
  entry, and the type checker catches any missing one (research R1);
- `detectLanguage` maps any `fr-*` tag to French (R2);
- the saved setting accepts `"fr"` with no version change (R3);
- the settings dialog gets a third radio with a France flag (R4).

The largest part of the work is writing the French course: 17 lessons, about 214 exercises and
144 glosses, following the conventions in R5 and R6 (the "tu" register, French typography,
elision tiles, adjective placement).

The tests generalize 014's Portuguese-only checks to every translation and add two
French-specific rules, F1 (typography) and F2 (elision tiles) (R7).

## Technical Context

**Language/Version**: TypeScript 6, React 19

**Primary Dependencies**: React, Redux Toolkit, React Router 8 (already present); no new
dependencies

**Storage**: `localStorage` `duopona:settings`, still version 1; `"fr"` is a new accepted value

**Testing**: Vitest + Testing Library (jsdom). The content rules run for all three languages.
Device language, offline, 360 px and the owner's review are manual (quickstart.md)

**Target Platform**: PWA on iOS Safari and Android Chrome, plus desktop browsers

**Project Type**: Frontend-only single-page web app

**Performance Goals**: The switch stays instant. The bundle grows by about 30 KiB of French
content (014's Portuguese added about 60 KiB, including the shared code)

**Constraints**: 360 px width, 44 px targets, offline, exact-match answers (one order per word
bank), U+202F before French high punctuation

**Scale/Scope**: About 60 French interface strings; 17 French lesson files and 1 vocabulary
file; small edits to `language.ts`, `strings.ts`, `lessons/index.ts`, `vocabulary.ts`,
`SettingsDialog.tsx`, `icons.tsx`; tests generalized and extended

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. KISS | ✅ | No new mechanism: one more entry in the existing maps (R1). The test generalization replaces a Portuguese-only block instead of copying it (R7). No dependency |
| II. Frontend-only, local-first | ✅ | Same key and version. Old values stay valid, and an unknown value still falls back to the device rule (R3). Nothing is sent anywhere |
| III. Standard React stack | ✅ | No new state: the existing `settings` slice and session language carry `'fr'` |
| IV. Tests after code, before done | ✅ | Unit: detection, storage, strings parity, content rules for fr (C1–C11, P1–P3, P6–P8, F1, F2). Integration: French session, settings with three options. Manual: M1–M6 (owner may waive M4–M6 and defer M5, as for 014) |
| V. Mobile-first PWA | ✅ | Three 52 px rows fit 360 × 640. Longer French text is checked at 360 px (M3). The content is in the bundle, so offline works unchanged |

Post-design re-check: still passes. Complexity Tracking: nothing new; 014's note on duplicating
the Toki Pona side now covers three files per lesson, guarded by P1.

## Project Structure

### Documentation (this feature)

```text
specs/015-french-language/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ui-settings.md          # change: third option, French texts
│   ├── settings-storage.md     # change: "fr" accepted
│   └── course-content-fr.md    # French rules (P-rules + F1–F4)
├── checklists/requirements.md
└── tasks.md                    # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── i18n/
│   ├── language.ts             # 'fr' in Language/LANGUAGES; detectLanguage maps fr-* (R2)
│   └── strings.ts              # fr: Strings (R5)
├── content/
│   ├── lessons/index.ts        # courses.fr
│   ├── vocabulary.ts           # vocabularies.fr
│   └── fr/                     # new: 17 lesson files, lessons/index.ts, vocabulary.ts (R6)
└── components/
    ├── SettingsDialog.tsx      # third option, order en / fr / pt-BR (R4)
    ├── icons.tsx               # FlagFR
    └── (any component writing ":" or "?" itself → moves to strings, R5)
tests/
├── unit/
│   ├── language.test.ts        # fr tags
│   ├── persistence.test.ts     # "fr" loads; old values still load
│   ├── strings.test.ts         # parity for every non-English language; F1 on strings
│   └── courseContent.test.ts   # translation rules for pt-BR and fr; P7 per language; F1, F2
└── integration/
    ├── frenchFlow.test.tsx     # new: French device, full lesson, Why?, leave, summary, practice, leak check
    └── settingsFlow.test.tsx   # three options; switch to Français
```

**Structure Decision**: Same layout as 014; the French course mirrors `src/content/pt-BR/` under
`src/content/fr/`.

## Complexity Tracking

No new entries. See 014's plan for the duplicated Toki Pona side, which is still guarded by
rule P1.
