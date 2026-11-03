# Research: Automatic Deployment to GitHub Pages

**Feature**: 005-github-pages-deploy | **Date**: 2026-11-03

Each item: Decision, Rationale, Alternatives considered. No open NEEDS CLARIFICATION remain.

## R1. Serving under `/duopona/` and from a site root (FR-007)

**Decision**: Set Vite `base: './'` (relative base) in `vite.config.ts`. One build works at any
path, so CI and local builds are identical.

**Rationale**: Verified by a test build on 2026-11-03 (`npx vite build --base ./`, Vite 8.3 +
vite-plugin-pwa 2.0.0):

| Output | Result |
|--------|--------|
| `index.html` | `./icon.svg`, `./apple-touch-icon-180x180.png`, `./assets/index-*.js`, `./assets/index-*.css`, `./manifest.webmanifest`, `./registerSW.js` |
| `registerSW.js` | `register('./sw.js', { scope: './' })` |
| CSS fonts | `url(../fonts/nunito-latin-wght-*.woff2)` (relative to the CSS file) |
| `manifest.webmanifest` | unchanged: `start_url: "."`, `scope: "."`, relative icon `src` |
| `sw.js` precache | unchanged: relative URLs (`index.html`, `assets/…`, `fonts/…`), fallback `createHandlerBoundToURL("index.html")` |

Relative URLs are safe here because the document URL is always the app root (`/duopona/` or
`/`): routing is hash-based (`createHashRouter`, R2), so no route ever changes the path part
of the address. The source `index.html` and `src/index.css` keep their `/…` paths; Vite rewrites
them at build time.

**Alternatives considered**:
- `base: '/duopona/'` always: breaks `npm run preview` at the root (SC-006, FR-007).
- `base` from an env var (`process.env.GITHUB_ACTIONS ? '/duopona/' : '/'`): CI build differs
  from the local one, needs a config branch and a second set of expected paths in the tests;
  the relative base needs neither (Principle I).
- Hard-coding `/duopona/` in `index.html`/CSS: same problems, plus manual upkeep.

## R2. Reloads and bookmarked lesson addresses (FR-009)

**Decision**: No change. The app already uses hash routing (`#/`, `#/lesson/:id`,
`src/main.tsx`), so the host only ever receives `/duopona/` (or `/duopona/index.html`); a
reload or bookmark can never hit a missing path. No `404.html` copy is needed.

**Alternatives considered**: Copying `index.html` to `404.html` (the usual Pages SPA trick):
only needed for path-based routing; would also return status 404 for app pages.

## R3. Pipeline shape (FR-001, FR-003, FR-004, FR-005)

**Decision**: One workflow file, `.github/workflows/deploy.yml`, with two jobs:

1. `check` (every trigger): checkout → setup Node with npm cache → `npm ci` → `npm test` →
   `npm run lint` → `npm run build` → `npm run test:pwa` → on `main` only, upload `dist/` as the
   Pages artifact (`actions/upload-pages-artifact`).
2. `deploy` (`needs: check`, only for `main` and not a pull request): `actions/deploy-pages`
   publishes the artifact uploaded by `check`, in the `github-pages` environment.

Triggers: `push` (all branches), `pull_request`, `workflow_dispatch`. Steps run in sequence, so
the first failing step stops the job and is shown with its output (US2-2); `deploy` never runs
when `check` fails (FR-004, SC-002).

**Rationale**: The official Pages-from-Actions flow (artifact upload → deploy) publishes
exactly the files the checks saw, with no rebuild (FR-003). Uploading only on `main` keeps
branch runs free of unused artifacts. One job for the checks: they share one `npm ci` and one
`dist/`, and the job log names the failing step; splitting into parallel jobs would repeat the
install and need `dist/` passed between jobs for `test:pwa`.

**Alternatives considered**:
- Separate CI and deploy workflow files (`workflow_run` chaining): two files and an indirect
  trigger for no gain.
- Publishing to a `gh-pages` branch (e.g. `peaceiris/actions-gh-pages`): third-party action,
  commits build output to the repo, runs Jekyll unless `.nojekyll` is added.
- Parallel jobs for test/lint/build: faster by seconds, more YAML, repeated installs.

**Pull requests from the same repo** run twice (once for the branch push, once for the pull
request). Accepted: FR-001 asks for both and the repo has a single owner; filtering would add
conditions for no user benefit.

## R4. Only the newest `main` is published (FR-006)

**Decision**: Workflow-level `concurrency`:
`group: deploy-${{ github.ref }}`, `cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}`.

**Rationale**: On `main`, runs are queued in push order and a newer pending run replaces an
older pending one, so an older commit can never finish after a newer one, and a deploy is
never cut off midway. On other branches and PRs, a new push cancels the outdated check run.

**Alternatives considered**: Concurrency only on the `deploy` job (GitHub's starter template):
the `check` jobs of two pushes run in parallel and the older one can reach the deploy queue
last, publishing an older version. `cancel-in-progress: true` on `main`: could cancel a
deploy in progress (harmless, but the queue is simpler to reason about).

## R5. Node.js and dependency versions (FR-002)

**Decision**: `actions/setup-node` with `node-version: 26` (current LTS line, the owner's local
version is 26.13) and `cache: npm`; install with `npm ci` (fails if `package-lock.json` and
`package.json` disagree).

**Alternatives considered**: `lts/*` (moves under us without a commit); a version matrix
(20/22/24/26): the README states 20+, but a matrix multiplies run time for a single static
build; can be added later if a Node-specific bug appears.

## R6. Action versions and permissions

**Decision**: Pin official actions by major version, current as of 2026-11-03 (checked via the
GitHub releases API): `actions/checkout@v7`, `actions/setup-node@v7`,
`actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`. Workflow permissions default to
`contents: read`; only the `deploy` job gets `pages: write` and `id-token: write`. No secrets
(spec Assumptions).

**Rationale**: Official, maintained actions (Principle III spirit applied to CI); least
privilege. Major-version pins receive fixes without edits. `actions/configure-pages` is not
used: it only helps static-site generators that need the base URL, which R1 removes.

## R7. Pages not enabled (edge case)

**Decision**: Rely on `actions/deploy-pages`, which fails the `deploy` job with an error saying
Pages must be enabled with source "GitHub Actions" when the repository is not set up. The
README lists the one-time setting (FR-011). The `github-pages` environment's default
protection rule (deployments from the default branch only) is a second guard for FR-004.

**Alternatives considered**: A pre-check step calling the Pages API: duplicates the action's
own error.

## R8. Host caching vs. updates (edge case, SC-004)

**Decision**: Accept GitHub Pages' fixed headers (`Cache-Control: max-age=600` on every file);
no workaround. Update README "Hosting" to say Pages is the reference host and why its headers
are fine.

**Rationale**: Browsers check `sw.js` for updates bypassing the HTTP cache (default
`updateViaCache: 'imports'`), so a new worker is found on the next launch regardless of the
10-minute cache; the worker precaches `index.html` by revision and hashed assets by name, so
the new version is complete once installed. Worst case, a launch within 10 minutes of the
publish sees the old version and the next one gets the new version: within 003's two-launch
rule. Verified by the SC-004 manual check (quickstart).

## R9. Build-output check for root-absolute references (FR-010)

**Decision**: Extend `tests/build/pwa.test.ts`:
- Change the existing expectations that assert root paths (`src="/registerSW.js"`,
  `href="/manifest.webmanifest"`, `href="/icon.svg"`, `href="/apple-touch-icon-180x180.png"`)
  to the relative `./` form.
- Add a "sub-path" group: no `src="/…"`/`href="/…"` in `dist/index.html`; no `url(/…)` in any
  built CSS; `registerSW.js` registers `./sw.js` with scope `./`; no precache URL or manifest
  icon `src`/`start_url`/`scope` starts with `/`.

**Rationale**: Turns a sub-path mistake into a failing pipeline step before publishing (FR-010),
and runs locally too (`npm run test:pwa`). Matches Constitution IV's build-output-check route
for host/browser behavior.

**Alternatives considered**: A headless-browser smoke test against a `/duopona/` preview:
needs a browser-automation stack, which the constitution already rejected (IV rationale).

## R10. Verifying the workflow itself (Constitution IV)

**Decision**: The workflow's behavior (publish on `main`, no publish on failure or branches,
manual start, live within 10 minutes) only exists on GitHub; it is covered by manual checks in
quickstart.md, results recorded in tasks.md, as infrastructure outside IV's scope (the published app's
behavior uses the IV browser/device exception via R9 + the W rows) together with the automated build-output checks of R9. The
workflow file is linted locally with `actionlint` if available (optional, not a dependency).
