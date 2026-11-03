# Implementation Plan: Automatic Deployment to GitHub Pages

**Branch**: `005-github-pages-deploy` | **Date**: 2026-11-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/005-github-pages-deploy/spec.md`

## Summary

Add one GitHub Actions workflow that, on every push, pull request and manual start, installs
from the lock file and runs tests, lint, the production build and the build-output checks; on
`main` only, it uploads the checked `dist/` and publishes it to GitHub Pages at
`https://jcavalin.github.io/duopona/`. To serve under `/duopona/` and still work at a site
root, the build switches to a relative base (`base: './'`), verified by a test build to produce
only relative paths in the HTML, CSS, worker registration, manifest and precache list. Hash
routing already prevents "not found" pages on reload. The build-output suite gains sub-path
checks so a path mistake fails the pipeline. README documents the address, the pipeline and the
one-time Pages setting. No app/runtime code changes.

## Technical Context

**Language/Version**: TypeScript 6 (strict) for app and tests; YAML for the workflow

**Primary Dependencies**: Unchanged app stack (React 19, Redux Toolkit 2, React Router 8,
Vite 8, vite-plugin-pwa 2). **No new npm dependencies.** CI uses official actions:
`actions/checkout@v7`, `actions/setup-node@v7`, `actions/upload-pages-artifact@v5`,
`actions/deploy-pages@v5` (research R6)

**Storage**: Unchanged (`localStorage` key `duopona:progress` v1; offline copy in Cache Storage)

**Testing**: Existing Vitest suites; `tests/build/pwa.test.ts` updated for relative paths and
extended with sub-path rules S1–S6 ([contracts/sub-path.md](contracts/sub-path.md)); pipeline
and public-address behavior checked manually (quickstart G1–G6, W1–W6) under Constitution IV's
exception (research R10)

**Target Platform**: GitHub Actions `ubuntu-latest`, Node.js 26 (R5); GitHub Pages (static,
HTTPS) at `/duopona/`; app targets unchanged (iOS Safari, Android Chrome, desktop)

**Project Type**: Frontend-only single-page web app (PWA) + CI/CD workflow

**Performance Goals**: Push-to-live ≤ 10 min (SC-001); current local check+build is well under
1 min, so the budget is dominated by runner start and Pages propagation

**Constraints**: Publish only checked output, only from `main` (FR-003/004); newest `main` wins
(FR-006); host cache headers fixed at `max-age=600` (accepted, R8); no secrets; no requests
outside the app's own address (SC-005)

**Scale/Scope**: 1 workflow file (~50 lines), 1 config line, ~4 changed + ~6 new build-output
assertions, README sections; 0 screens, 0 app code

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. KISS | One workflow file with two jobs; no new npm dependency; one build for all hosts via `base: './'` instead of env-dependent config (R1); no `404.html` (R2); no `configure-pages` (R6); no browser automation (R9) | ✅ Pass |
| II. Frontend-only, local-first | GitHub Pages is a static host; no backend, no server code. Progress storage untouched. App makes no request outside its own address (SC-005, W1) | ✅ Pass |
| III. Standard React stack | No app stack change; CI uses only official GitHub actions | ✅ Pass |
| IV. Tests after code, before done | Build-output suite extended (S1–S6) and the four root-path expectations updated; all existing suites must pass in CI. The workflow is infrastructure, not app behavior or state logic, so IV's automated-test rule does not apply to it: its runs are checked manually (G1–G6). The published app's install, offline and update behavior uses the browser/device exception: automated build-output checks + manual rows L1–L4 and W1–W6, recorded in tasks.md | ✅ Pass |
| V. Mobile-first PWA | Install, offline and update behavior preserved under the sub-path (S2–S6, L3, W3–W6); HTTPS public address enables the outstanding real-device checks of 003/004 | ✅ Pass |
| Governance | Plan includes this check; ROADMAP entry already "In progress" | ✅ Pass |

**Post-design re-check (after Phase 1)**: unchanged. Design adds a workflow file, one config
line, test assertions and docs; no abstractions, no dependencies, no runtime code.

## Project Structure

### Documentation (this feature)

```text
specs/005-github-pages-deploy/
├── plan.md              # this file
├── research.md          # R1–R10
├── data-model.md        # pipeline run, published version
├── quickstart.md        # local, pipeline and public-address checks
├── contracts/
│   ├── pipeline.md      # triggers P1–P5, steps C1–C8, deploy D1–D5, concurrency Q1–Q3
│   └── sub-path.md      # path-independent build output S1–S8
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
.github/
└── workflows/
    └── deploy.yml           # NEW: check + deploy jobs (contracts/pipeline.md)
vite.config.ts               # + base: './' (contracts/sub-path.md)
tests/build/pwa.test.ts      # root-path expectations → ./ ; new sub-path describe block
README.md                    # public address, pipeline, one-time Pages setup; Hosting section
ROADMAP.md                   # status update when done
```

Unchanged: `src/` (hash router already), `index.html` and `src/index.css` (Vite rewrites
their `/…` paths), `public/`, `package.json` scripts.

**Structure Decision**: Existing single-project layout; the only new directory is
`.github/workflows/`.

## Complexity Tracking

No violations; nothing to justify.
