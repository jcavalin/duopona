# Implementation Plan: Study in Spanish

**Branch**: `017-spanish-language` | **Date**: 2026-11-25 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/017-spanish-language/spec.md`

## Summary

Spanish becomes the fourth study language, next to English, Brazilian Portuguese and French. It
uses the structure built by features 014 and extended by 015:
- `'es'` is added to the `Language` type and `LANGUAGES`;
- the three `Record<Language, …>` maps (interface strings, courses, vocabularies) get a Spanish
  entry, and the type checker catches any missing one (research R1);
- `detectLanguage` maps any `es-*` tag to Spanish (R2);
- the saved setting accepts `"es"` with no version change (R3);
- the settings dialog gets a fourth radio, Español, with a Spain flag (R4).

The largest part of the work is writing the Spanish course: 17 lessons, about 214 exercises and
144 glosses. It is written in neutral Spanish (spec FR-014) and follows the conventions in R5 and
R6: the "tú" register, opening "¿" and "¡", contractions as one tile, and subject pronouns.

The translation tests already run for every non-English language. This feature adds Spanish's
chapter labels and two Spanish rules, S1 (opening marks) and S2 (tiles). It also handles one new
problem: Spanish and Portuguese share many words, so the "different from every other language"
check (P2b) gets an allow-list for that pair, with a reason for each entry (R7).

## Technical Context

**Language/Version**: TypeScript 6, React 19

**Primary Dependencies**: React, Redux Toolkit, React Router 8 (already present); no new
dependencies

**Storage**: `localStorage` `duopona:settings`, still version 1; `"es"` is a new accepted value

**Testing**: Vitest + Testing Library (jsdom). The content rules run for all four languages.
Device language, offline, 360 px and the owner's review are manual (quickstart.md)

**Target Platform**: PWA on iOS Safari and Android Chrome, plus desktop browsers

**Project Type**: Frontend-only single-page web app

**Performance Goals**: The language switch stays instant. The bundle grows by about 30 KiB of
Spanish content, the same as French did

**Constraints**: 360 px width, 44 px targets, offline, exact-match answers (one order per word
bank), neutral Spanish (no "vosotros", no regional vocabulary)

**Scale/Scope**: About 60 Spanish interface strings; 17 Spanish lesson files and 1 vocabulary
file. Small edits to `language.ts`, `strings.ts`, `lessons/index.ts`, `vocabulary.ts`,
`SettingsDialog.tsx` and `icons.tsx`. Tests extended, plus one new integration flow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. KISS | ✅ | No new mechanism: one more entry in the existing maps (R1). The Spanish–Portuguese allow-list is a data list in the existing test, not new test machinery (R7). No dependency |
| II. Frontend-only, local-first | ✅ | Same key and version. Old values stay valid, and an unknown value still falls back to the device rule (R3). Nothing is sent anywhere |
| III. Standard React stack | ✅ | No new state: the existing `settings` slice and session language carry `'es'` |
| IV. Tests after code, before done | ✅ | Unit tests: detection, storage, strings parity, content rules for es (C1–C11, P1–P3, P6–P8, S1, S2). Integration tests: Spanish session; settings with four options. Manual checks M1–M6; as for 014 and 015, the owner may waive M4 and M6 and defer M5 |
| V. Mobile-first PWA | ✅ | Four 52 px rows fit 360 × 640 (R4). Longer Spanish text is checked at 360 px (M3). The content is in the bundle, so offline works unchanged |

Post-design re-check: still passes. Complexity Tracking: nothing new. 014's note on duplicating
the Toki Pona side now covers four files per lesson, still guarded by P1.

## Project Structure

### Documentation (this feature)

```text
specs/017-spanish-language/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ui-settings.md          # change: fourth option, Spanish texts
│   ├── settings-storage.md     # change: "es" accepted
│   └── course-content-es.md    # Spanish rules (P-rules + S1–S4)
├── checklists/requirements.md
└── tasks.md                    # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── i18n/
│   ├── language.ts             # 'es' in Language/LANGUAGES; detectLanguage maps es-* (R2)
│   └── strings.ts              # es: Strings (R5)
├── content/
│   ├── lessons/index.ts        # courses.es
│   ├── vocabulary.ts           # vocabularies.es
│   └── es/                     # new: 17 lesson files, lessons/index.ts, vocabulary.ts (R6)
└── components/
    ├── SettingsDialog.tsx      # fourth option, order en / es / fr / pt-BR (R4)
    └── icons.tsx               # FlagES
tests/
├── spanishTypography.ts        # new: S1 helper (opening marks), Toki Pona exempt
├── unit/
│   ├── language.test.ts        # es tags
│   ├── persistence.test.ts     # "es" loads; old values still load
│   ├── strings.test.ts         # SAME_ACROSS.es; S1 on strings
│   └── courseContent.test.ts   # CHAPTERS.es; es↔pt-BR allow-list; S1, S2
└── integration/
    ├── spanishFlow.test.tsx    # new: Spanish device, full lesson, Why?, leave, summary, practice, leak check
    └── settingsFlow.test.tsx   # four options; switch to Español
```

**Structure Decision**: Same layout as 014 and 015; the Spanish course mirrors
`src/content/fr/` under `src/content/es/`.

## Complexity Tracking

No new entries. See 014's plan for the duplicated Toki Pona side, which is still guarded by
rule P1.
