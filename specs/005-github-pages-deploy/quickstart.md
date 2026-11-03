# Quickstart: Automatic Deployment to GitHub Pages

Validation guide. Contracts: [pipeline.md](contracts/pipeline.md),
[sub-path.md](contracts/sub-path.md). Record results in tasks.md.

## Local checks (owner's machine)

```bash
npm ci
npm test && npm run lint     # unchanged suites
npm run build                # dist/ with ./ paths
npm run test:pwa             # 003/004 checks + sub-path rules S1–S6
```

All pass. Then, for SC-006 / S8:

| # | Steps | Expected | Covers |
|---|-------|----------|--------|
| L1 | `npm run dev`, open the printed URL, play a lesson | Works as before | SC-006 |
| L2 | `npm run preview`, open `http://localhost:4173/` | Lesson path loads; DevTools → Application shows manifest and an active worker; offline reload works | FR-007, S8 |
| L3 | `npx vite preview --base /duopona/`, open `http://localhost:4173/duopona/` | Same as L2; Network tab shows every request under `/duopona/`, none to `/assets`, `/fonts`, `/sw.js` at the root | FR-007, S8 |
| L4 | In L3, open `…/duopona/#/lesson/<id>` of an unlocked lesson and reload | The lesson opens, never a "not found" page | FR-009, S7 |
| L5 | Optional: `actionlint .github/workflows/deploy.yml` (if installed) | No errors | — |

## One-time GitHub setup (owner)

1. Repository `jcavalin/duopona` is public.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Push the branch with the workflow; merge to `main` and push.

Before step 2, a `main` run must fail at `deploy` with a message about enabling Pages (D5).

## Pipeline checks (GitHub, manual)

| # | Steps | Expected | Covers |
|---|-------|----------|--------|
| G1 | Push this feature branch | Run "check" passes; no "deploy" job; no artifact | P2, US2-3 |
| G2 | On a scratch branch, break one test; push and open a PR | Run fails at "npm test" with the failing test in the log; no deploy; delete the branch afterwards | US2-1, US2-2, US2-3 |
| G3 | Merge to `main` and push; note the time | "check" then "deploy" pass; `https://jcavalin.github.io/duopona/` shows the new version within 10 min | US1-1, SC-001, M1 |
| G4 | Actions → the workflow → "Run workflow" on `main` | Same checks; publishes | US3-1, M4 |
| G5 | Push two small commits to `main` within a minute | Second run waits for the first (or replaces it while queued); site ends on the second commit | FR-006, M5 |
| G6 | Make a commit on `main` that fails `npm run lint`; push (revert right after) | Deploy skipped; site still shows the previous version | US2-1, SC-002, M2 |

## Public address checks (phones and desktop)

| # | Steps | Expected | Covers |
|---|-------|----------|--------|
| W1 | Desktop Chrome: open the public address; DevTools → Network | Every request is to `jcavalin.github.io/duopona/…`; none elsewhere | SC-005 |
| W2 | iPhone Safari and Android Chrome: open the public address | Lesson path over HTTPS; play a lesson; progress kept after reload | US1-2, SC-003 |
| W3 | Install ("Add to Home Screen" / "Install app"); open from the icon | Duopona name, icon, dark colors; opens on the lesson path | US1-4, SC-003 |
| W4 | Airplane mode; open the installed app; play a lesson | Works fully offline | US1-3, SC-003 |
| W5 | Reload on a lesson; open a bookmarked `#/lesson/<id>` | Lesson or lesson path, never "page not found" | US1-5, FR-009 |
| W6 | After a new version is published (G3/G4): close the app, open it, close, open again | New version visible by the second launch; progress intact | SC-004, FR-008 |

W2–W5 also serve as the open phone checks of 003 (T016–T021) and 004 (T030–T031); those are
recorded in their own tasks.md files, not here.
