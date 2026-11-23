# Implementation Plan: Study in Brazilian Portuguese

**Branch**: `014-portuguese-language` | **Date**: 2026-11-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/014-portuguese-language/spec.md`

## Summary

Learners can study the whole course in Brazilian Portuguese as well as English. The app starts in
the device language, and a gear on the home screen opens a settings dialog to choose the language.

How it works:
- **Interface text** comes from a typed strings table with one object per language (research R1).
  A missing Portuguese text is a compile error.
- **Course content**: complete parallel Portuguese lesson files and vocabulary under
  `src/content/pt-BR/` (R2). A unit test keeps their Toki Pona side identical to the English one
  (contract [course-content-pt.md](contracts/course-content-pt.md)).
- **Session language**: each session stores its language when it starts, so answer checking and
  feedback use the right lesson data (R3).
- **Settings and detection**: a new `settings` slice holds the language. It comes from a saved
  choice, or else from the device's preferred languages; only a manual choice is saved, under
  `duopona:settings` (R4, contract [settings-storage.md](contracts/settings-storage.md)).
- **Settings UI**: a nested `#/settings` route renders a native `<dialog>` over the home screen,
  with two radio options. Back, Escape, X and a backdrop tap close it (R6, contract
  [ui-settings.md](contracts/ui-settings.md)).
- **Document language**: `document.documentElement.lang` follows the active language (R7).
- **Unchanged**: progress, mistakes, streak and practice picking use only ids and Toki Pona, so they
  don't change (R5).

The largest part of the work is writing the Portuguese course: 17 lessons, about 200 exercises
and 144 glosses, following the conventions in R8. The owner then reviews it (quickstart M5).

## Technical Context

**Language/Version**: TypeScript 6, React 19

**Primary Dependencies**: React, Redux Toolkit, React Router 8 (already present); no new
dependencies

**Storage**: `localStorage`, one new versioned key `duopona:settings`, written only after a
manual choice

**Testing**: Vitest + Testing Library (jsdom). Language detection is tested by stubbing
`navigator.languages`. Content rules run for both languages. Device language, offline, layout and
the owner's language review are manual checks in quickstart.md

**Target Platform**: PWA on iOS Safari and Android Chrome (browser and installed), plus desktop
browsers

**Project Type**: Frontend-only single-page web app

**Performance Goals**: The language switch is instant: a synchronous state change and re-render,
with all content already in the bundle

**Constraints**: 360 px width, 44 px targets, safe areas, offline, contrast ≥ 4.5:1, current dark
theme tokens, exact-match answer checking (one correct order per word bank)

**Scale/Scope**: About 60 interface strings × 2 languages; 17 Portuguese lesson files and 1
vocabulary file; a new slice, a dialog component, a route, a gear icon; most components switch
from literal text to `useStrings()`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. KISS | ✅ | No i18n library: a typed object per language and a hook (R1). Content uses the existing `Lesson` type, with no overlay or merge layer (R2). The strings layer has two real users (en, pt-BR), as Principle I requires. The settings dialog reuses the 013 native-dialog pattern |
| II. Frontend-only, local-first | ✅ | Language detection uses the browser only. The new key `duopona:settings` is versioned, and an invalid value falls back to the device rule (contract settings-storage.md). Nothing is sent anywhere |
| III. Standard React stack | ✅ | The language is shared app state, so it lives in a Redux slice. The dialog's open state is the route, and the radio state comes from Redux |
| IV. Tests after code, before done | ✅ | Unit tests: detection, slice, persistence, strings completeness, content rules P1–P3/P6–P8 for both languages. Integration tests: a Portuguese session, settings open/switch/close/Back, persistence, unchanged progress. Device language, offline, 360 px and phone checks are manual (M1–M4, M6). The owner's language review is M5 |
| V. Mobile-first PWA | ✅ | The gear and radio rows are ≥ 44 px, and the dialog fits 360 px with safe areas. The Portuguese content ships in the bundle, so offline works unchanged. Longer Portuguese text is checked at 360 px (M3) |

Post-design re-check: still passes. Complexity Tracking has one note about content duplication.

## Project Structure

### Documentation (this feature)

```text
specs/014-portuguese-language/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ui-settings.md
│   ├── settings-storage.md
│   └── course-content-pt.md
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── i18n/
│   ├── language.ts                   # new: Language type, detectLanguage (R4)
│   ├── strings.ts                    # new: en + ptBR interface strings (R1)
│   └── useStrings.ts                 # new: hook returning the active language's strings
├── content/
│   ├── lessons/index.ts              # courses by language; getLesson/getExercise take a language (R2)
│   ├── vocabulary.ts                 # getMeaning takes a language
│   ├── explanations.ts               # explainMistake takes a language
│   └── pt-BR/                        # new: 17 lesson files, lessons/index.ts, vocabulary.ts (R8)
├── store/
│   ├── settingsSlice.ts              # new: language + chosen, languageChosen, selectLanguage
│   ├── persistence.ts                # loadSettings/saveSettings (contract settings-storage.md)
│   ├── index.ts                      # preload + save settings
│   └── sessionSlice.ts               # session.language (R3)
├── router.tsx                        # '/settings' child of '/'; RootLayout sets <html lang> (R6, R7)
├── routes/
│   ├── HomeRoute.tsx                 # renders <Outlet/> for the dialog
│   ├── LessonRoute.tsx               # passes the language; localized lesson
│   └── PracticeRoute.tsx             # passes the language; strings
├── components/
│   ├── SettingsDialog.tsx            # new: native dialog with the language radios
│   ├── icons.tsx                     # GearIcon
│   ├── LessonList.tsx                # gear link; strings; localized lesson titles
│   └── LessonIntro, ExerciseScreen, MultipleChoice, WordBank, FeedbackBanner,
│       LessonSummary, LeaveDialog    # literal text → useStrings()
└── index.css                         # settings dialog + radio row styles
tests/
├── unit/
│   ├── language.test.ts              # detectLanguage
│   ├── settingsSlice.test.ts
│   ├── persistence.test.ts           # + settings key
│   ├── strings.test.ts               # completeness (R1)
│   ├── courseContent.test.ts         # rules run for both languages; P1–P3, P6–P8
│   └── explanations.test.ts          # + Portuguese
└── integration/
    ├── settingsFlow.test.tsx         # gear, switch, close paths, Back, persistence, progress kept
    └── portugueseFlow.test.tsx       # pt-BR device: lesson, wrong answer + Why?, leave dialog, summary, leak check
```

**Structure Decision**: Single frontend project with the existing layout. The new `src/i18n/`
folder holds the language-wide pieces. The Portuguese course mirrors `src/content/` under `pt-BR/`.

## Complexity Tracking

| Item | Why needed | Simpler alternative rejected because |
|------|------------|--------------------------------------|
| The Toki Pona side of each exercise is written in both the English and Portuguese lesson files | Each language's lesson stays a plain, complete `Lesson`, so it is easy to read and review, and no merge code is needed | An overlay or bilingual fields need merge code or more complex types (R2). The duplication is guarded by rule P1's unit test |
