# Contract: Pipeline (`.github/workflows/deploy.yml`)

What the workflow guarantees. Rows marked **manual** are checked on GitHub (quickstart.md,
"Pipeline checks"); none can run in the local test environment (research R10).

## Triggers

| ID | Trigger | Runs `check` | Uploads artifact | Runs `deploy` |
|----|---------|:-:|:-:|:-:|
| P1 | `push` to `main` | yes | yes | yes, if `check` passed |
| P2 | `push` to any other branch | yes | no | no |
| P3 | `pull_request` (any base) | yes | no | no |
| P4 | `workflow_dispatch` on `main` | yes | yes | yes, if `check` passed |
| P5 | `workflow_dispatch` on another branch | yes | no | no |

"On `main`" means `github.ref == 'refs/heads/main'` **and** `github.event_name != 'pull_request'`.

## `check` job: steps, in order (FR-001, FR-002)

| ID | Step | Fails the run when |
|----|------|--------------------|
| C1 | Checkout the commit | — |
| C2 | Set up Node.js 26 with npm cache | — |
| C3 | `npm ci` | lock file and `package.json` disagree, or install fails |
| C4 | `npm test` | any unit/integration test fails |
| C5 | `npm run lint` | any lint error |
| C6 | `npm run build` | type errors or build error |
| C7 | `npm run test:pwa` | any build-output check fails (incl. [sub-path.md](sub-path.md)) |
| C8 | Upload `dist/` as Pages artifact (on `main` only) | upload fails |

Each step shows as its own entry in the run log with its output; the first failure stops the
job (US2-2).

## `deploy` job (FR-003–FR-006)

| ID | Rule |
|----|------|
| D1 | `needs: check`: never runs unless every `check` step passed (SC-002) |
| D2 | Publishes the artifact from C8 of the same run; never builds again (FR-003) |
| D3 | Runs in environment `github-pages`; its URL is the public address |
| D4 | Only job with `pages: write` and `id-token: write`; workflow default is `contents: read`; no secrets |
| D5 | When Pages is not enabled with source "GitHub Actions", the job fails with the action's error (edge case) |

## Concurrency (FR-006)

| ID | Rule |
|----|------|
| Q1 | One group per ref: `deploy-${{ github.ref }}` |
| Q2 | On `main`: runs queue in push order; a newer pending run replaces an older pending one; a running run is never cancelled |
| Q3 | On other refs: a new run cancels the in-progress one for the same ref |

## Outcomes (manual)

| ID | Expectation | Covers |
|----|-------------|--------|
| M1 | Passing push to `main` is live at `https://jcavalin.github.io/duopona/` within 10 min of the push | US1-1, SC-001 |
| M2 | Run with a failing check: `deploy` skipped, public address unchanged | US2-1, SC-002 |
| M3 | Branch push / PR: checks reported, no deploy | US2-3 |
| M4 | Manual run on `main` publishes | US3-1 |
| M5 | Two quick pushes to `main`: the public address ends on the second commit | FR-006 |
