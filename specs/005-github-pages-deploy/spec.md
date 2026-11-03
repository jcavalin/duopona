# Feature Specification: Automatic Deployment to GitHub Pages

**Feature Branch**: `005-github-pages-deploy`

**Created**: 2026-11-03

**Status**: Implemented (pipeline checks G1, G2, G4, G5, G6 and phone check W6 skipped by owner decision, tasks T010a, T014, T015, T017, T017a, T018)

**Input**: User description: "Add a GitHub Actions pipeline that tests, builds and deploys Duopona to GitHub Pages"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Every change on main goes live by itself (Priority: P1)

The owner merges a feature into `main` and pushes it. Without any further step, the project's
checks run, and if they all pass, the new version of Duopona is published at its public web
address within a few minutes. Learners who open the address get the new version (on their next
launch, as the offline rules of feature 003 already define).

**Why this priority**: A public, always-current HTTPS address is the point of the feature: it
lets anyone use Duopona and lets the owner run the open phone checks of features 003 and 004.

**Independent Test**: Push a commit with a small visible change to `main`; within 10 minutes the
public address shows the change.

**Acceptance Scenarios**:

1. **Given** a push to `main` whose checks all pass, **When** the pipeline finishes, **Then**
   the public address serves exactly that version.
2. **Given** the published app, **When** a learner opens the public address on a phone, **Then**
   the lesson path loads over HTTPS, every lesson can be played, and progress is kept on the
   device as before.
3. **Given** the published app was opened once, **When** the learner opens it again with no
   connection, **Then** it works fully offline, as in feature 003.
4. **Given** the public address, **When** the learner uses "Add to Home Screen" / "Install app",
   **Then** the app installs with its name, icon and dark colors and opens on the lesson path.
5. **Given** the learner reloads the page or opens a bookmarked lesson address, **When** the
   page loads, **Then** the app shows that lesson or the lesson path, never a "page not found".

---

### User Story 2 - A broken build never reaches learners (Priority: P2)

If any check fails (automated tests, lint, build, or the build-output checks), nothing is
published: the previous version stays online, and the owner sees which check failed.

**Why this priority**: Protects learners from a broken app; without it, US1 could publish
regressions automatically.

**Independent Test**: Push a commit with a deliberately failing test to a branch and open a
pull request; the run fails, names the failing check, and the public address still serves the
previous version.

**Acceptance Scenarios**:

1. **Given** a push to `main` where a check fails, **When** the pipeline finishes, **Then**
   nothing is published and the public address keeps serving the last good version.
2. **Given** a failed run, **When** the owner opens it, **Then** the failing step and its error
   output are shown.
3. **Given** a pull request or a push to any other branch, **When** it is pushed, **Then** the
   same checks run and report their result, but nothing is published.

---

### User Story 3 - Publish again on demand (Priority: P3)

The owner can start the pipeline by hand for the current `main` (for example after enabling
Pages for the first time, or to retry after a hosting hiccup) without making a new commit.

**Why this priority**: Convenience; the automatic path (US1) covers normal use.

**Independent Test**: Start the pipeline by hand from the repository's actions page; it runs the
checks and publishes `main`.

**Acceptance Scenarios**:

1. **Given** the repository page, **When** the owner starts the pipeline by hand for `main`,
   **Then** it runs the same checks and publishes if they pass.

---

### Edge Cases

- **Two pushes in quick succession**: only the newest version ends up published; an older run
  never overwrites a newer one.
- **App served under a sub-path** (`https://<user>.github.io/duopona/`): every file the app
  needs (scripts, styles, fonts, icons, manifest, offline worker) loads from under that path;
  nothing points to the site root.
- **Local use unchanged**: `npm run dev`, `npm run build` and `npm run preview` still work on the
  owner's machine, and the app still works when served from a site root.
- **Offline copy across hosting change**: a learner who installed the app from the public
  address keeps their progress across new versions (same rule as 003).
- **Pages not yet enabled** in the repository settings: the run fails with a clear message
  instead of silently succeeding.
- **Caching by the host**: the host's own cache rules (which the owner cannot change) must not
  prevent a new version from reaching learners within the two launches of 003's SC-004.

## Requirements *(mandatory)*

### Functional Requirements

**Checks**

- **FR-001**: On every push to any branch and on every pull request, the pipeline MUST run the
  project's automated tests, lint, production build and build-output checks, in that order of
  dependency, and report pass or fail per step.
- **FR-002**: The pipeline MUST use the same dependency versions as the repository's lock file
  and a supported Node.js version (the range in the README).

**Publishing**

- **FR-003**: When all checks pass on `main` (by push or by a manual start), the pipeline MUST
  publish exactly the production build that was checked, without rebuilding it in between.
- **FR-004**: Nothing MUST be published from any branch other than `main`, or when any check
  fails.
- **FR-005**: The owner MUST be able to start the pipeline by hand for `main`.
- **FR-006**: When runs for `main` overlap, only the latest MUST be published.
- **FR-007**: The published app MUST work when served under the repository's sub-path
  (`/duopona/`) and MUST still work when served from a site root (local preview).

**The published app**

- **FR-008**: The published app MUST behave exactly like the local production build: lesson
  play, progress, offline use after the first visit, installation, update on next launch, and
  dark identity (features 001–004).
- **FR-009**: Reloading any app address or opening a bookmarked lesson address MUST load the
  app, never a host "not found" page.
- **FR-010**: The build-output checks MUST also verify that no app file is referenced from the
  site root, so a sub-path problem fails the pipeline instead of reaching learners.

**Documentation**

- **FR-011**: The README MUST give the public address, describe what the pipeline does, and list
  the one-time repository settings the owner must make (enable Pages with the pipeline as its
  source).

### Key Entities

- **Pipeline run**: one execution for a commit; has a trigger (push, pull request, manual), a
  branch, a result per check, and, for `main`, a publish result.
- **Published version**: the production build of one `main` commit, served at the public
  address until the next successful publish replaces it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A push to `main` with passing checks is live at the public address within 10
  minutes, with no manual step.
- **SC-002**: 100% of runs with a failing check publish nothing; the previous version stays
  online.
- **SC-003**: Opening the public address on an iPhone and an Android phone shows the lesson path
  over HTTPS, and the app installs and works offline afterwards (enables the open phone checks
  of 003 and 004).
- **SC-004**: After a new version is published, a learner who reopens the app sees it within two
  launches, with progress intact (003 SC-004 holds on the public host).
- **SC-005**: The published app makes no request outside its own address (Constitution II).
- **SC-006**: Local commands (`dev`, `build`, `preview`, `test`, `test:pwa`) keep working
  unchanged on the owner's machine.

## Assumptions

- The repository is `jcavalin/duopona` on GitHub, public (free GitHub Pages needs a public
  repository), and the app is served at `https://jcavalin.github.io/duopona/`. A custom domain
  is out of scope; it can be added later without changing the pipeline's behavior.
- The owner pushes to GitHub and changes repository settings (enable Pages, source "GitHub
  Actions") themselves; Claude cannot push or log in.
- GitHub Pages is a static host: it fits Constitution II (no backend). Its fixed cache headers
  are accepted; the update-on-next-launch design of 003 is expected to cope with them, and
  SC-004 verifies it.
- Runs on branches and pull requests are for checks only; there are no preview deployments.
- No secrets are needed: publishing uses the repository's own built-in permissions.
- The open phone checks of 003 (T016–T021) and 004 (T030–T031) are done by the owner against
  the public address once this feature is live; they are not part of this feature's scope.
