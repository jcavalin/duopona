# Implementation Plan: Installable, Offline-Capable PWA

**Branch**: `003-pwa-offline-mobile` | **Date**: 2026-11-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-pwa-offline-mobile/spec.md`

## Summary

Make Duopona installable and fully offline after the first visit, and confirm it on real
phones. A build-time generated service worker (`vite-plugin-pwa`, Workbox `generateSW`)
precaches the whole production build, which already contains all 17 lessons. New versions
install in the background and take over on the next launch, so a lesson is never interrupted
and progress (`localStorage`) is never touched. A web app manifest, an original icon set and a
few `index.html` head tags give the installed app its name, icon and colors. Two CSS lines
remove double-tap zoom and iOS text inflation; the rest of the phone work is real-device
verification (which also closes 002's open T051 device checks). No app/runtime code changes
are expected.

## Technical Context

**Language/Version**: TypeScript 6 (strict)

**Primary Dependencies**: React 19, Redux Toolkit 2, react-redux 9, React Router 8, Vite 8;
**new dev dependencies** `vite-plugin-pwa` ^2.0.0 (brings `workbox-build`, `workbox-window`) and
`@types/node` (build-output test only, research R10)

**Storage**: Unchanged: `localStorage` key `duopona:progress` v1. Browser Cache Storage holds
the offline copy (managed by the generated worker; no learner data)

**Testing**: Vitest + React Testing Library (unchanged suites); new build-output suite
`tests/build/pwa.test.ts` run by `npm run test:pwa` after `npm run build`; manual checks in
Chrome and on a real iPhone and Android phone (quickstart)

**Target Platform**: iOS Safari and Android Chrome (latest two majors), in browser and
installed; desktop Chrome/Edge (installable), Firefox/Safari desktop (offline only)

**Project Type**: Frontend-only single-page web app (PWA)

**Performance Goals**: Installed app shows a usable lesson list in < 2 s offline (SC-002);
first-visit overhead of offline preparation ≤ 3 s (SC-006); precache < 1 MB (contract O7)

**Constraints**: No reload of an open page by updates (FR-011); one complete version at a
time (FR-012); HTTPS hosting (out of scope, documented); no `user-scalable=no`

**Scale/Scope**: ~1 config block, 1 SVG + 4 generated PNGs, ~6 head tags, 2 CSS lines, 1 test
suite, 1 npm script; 0 new screens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. KISS | One new **dev** dependency, justified: atomic, revisioned precache of hashed build files cannot be done in "a few lines" (research R1). No prompt UI, no app code for registration (R2). Icon generator used once via `npx`, not added (R6). No e2e framework (R4) | ✅ Pass (dependency recorded in Complexity Tracking) |
| II. Frontend-only, local-first | Still no backend. Worker only caches the app's own files; never touches `localStorage`, sends no data (contract O13). Progress format unchanged | ✅ Pass |
| III. Standard React stack | `vite-plugin-pwa` is the mainstream PWA tool for Vite, actively maintained (v2.0.0, Oct 2026). No state changes, so Redux untouched | ✅ Pass |
| IV. Tests after code, before done | Build-output suite covers the automatable part (manifest, precache, update config); existing suites must still pass; offline/install/update/device behavior uses the IV exception (v1.3.0): quickstart rows 1–9 and D1–D8, results recorded in T008, T014, T017–T018, T020–T021, T025 | ✅ Pass |
| V. Mobile-first PWA | This feature **closes** the transitional gap: manifest with name, icons, standalone (R5); full offline incl. all lessons (R1); 360 px / 44 px / safe areas re-verified installed on real iOS + Android (quickstart D1–D8) | ✅ Pass |
| Governance: Transitional compliance | The v1.2.0 allowance ends with this feature; after merge, 002 plan's Complexity Tracking row is resolved and ROADMAP moves PWA to Done | ✅ Pass |

**Post-design re-check (after Phase 1)**: unchanged. Design adds config, static assets and one
test suite; no abstractions, no runtime code paths besides the generated worker and its
registration script.

## Project Structure

### Documentation (this feature)

```text
specs/003-pwa-offline-mobile/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── app-identity.md          # manifest fields, icons, head tags
│   └── offline-and-updates.md   # registration, precache, navigation, update rules O1–O13
├── checklists/requirements.md
└── tasks.md                     # /speckit-tasks
```

### Source Code (repository root)

```text
package.json                     # + devDependencies vite-plugin-pwa, @types/node; + script "test:pwa"
vite.config.ts                   # + VitePWA({ registerType: 'prompt', injectRegister: 'script-defer',
                                 #   manifest, workbox: { navigateFallback, cleanupOutdatedCaches,
                                 #   globPatterns } }); test.exclude tests/build/** from `npm test`
pwa-assets.config.mjs            # NEW: icon generator config (no padding), run via npx
index.html                       # + theme-color (light/dark), apple-touch-icon, icon, description,
                                 #   apple-mobile-web-app-title
public/                          # NEW folder
├── icon.svg                     # NEW: original source icon (also the favicon)
├── pwa-192x192.png              # generated once (R6), committed
├── pwa-512x512.png
├── maskable-icon-512x512.png
└── apple-touch-icon-180x180.png
src/
└── index.css                    # + touch-action: manipulation; -webkit-text-size-adjust: 100%
tests/
└── build/
    ├── vitest.config.ts         # NEW: node environment, only tests/build
    └── pwa.test.ts              # NEW: checks dist/ against both contracts (auto rows)
README.md                        # + install/offline notes, test:pwa, preview, hosting notes
ROADMAP.md                       # PWA → Done at the end
```

**Structure Decision**: Same single frontend project. Only config, static assets and a test
suite are added; `src/` changes are limited to CSS (and any device-check fixes). `tests/build/`
is separate because it needs a fresh `dist/` and is excluded from `npm test`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New dev dependencies `vite-plugin-pwa` (+ Workbox) and `@types/node` (test typing only) (Principle I) | Offline use of every lesson needs a per-build list of hashed files with revisions, atomic install and cleanup of old versions (FR-002, FR-012) | A hand-written worker still needs a build step to inject the file list and re-implements Workbox's precache; more code and more ways to ship a broken offline copy |
