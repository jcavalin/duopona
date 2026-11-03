# Data Model: Automatic Deployment to GitHub Pages

This feature adds no app data: the `localStorage` key `duopona:progress` (v1) and the offline
copy (feature 003) are unchanged. The entities below live on GitHub, not in the app.

## Pipeline run

One execution of `.github/workflows/deploy.yml` for one commit.

| Field | Values | Notes |
|-------|--------|-------|
| trigger | `push`, `pull_request`, `workflow_dispatch` | [contracts/pipeline.md](contracts/pipeline.md) P1–P5 |
| ref | `refs/heads/<branch>` or `refs/pull/<n>/merge` | decides whether it can publish |
| check results | pass / fail / skipped per step C1–C8 | first failure stops the job |
| publish result | not applicable / skipped / success / failure | only for `main` |

**State transitions**

```text
queued ─► check running ─┬─► check failed ──────────────► done (nothing published)
                          └─► check passed ─┬─ not main ─► done (nothing published)
                                            └─ main ─────► deploy ─┬─► published
                                                                   └─► deploy failed (previous version stays)
```

On `main`, a newer queued run replaces an older queued one (Q2); on other refs a newer run
cancels the older (Q3).

## Published version

The `dist/` of one `main` commit, served at `https://jcavalin.github.io/duopona/`.

| Field | Notes |
|-------|-------|
| commit | the `main` commit whose run passed `check` |
| files | exactly the uploaded artifact (D2) |
| lifetime | until the next successful deploy replaces it; a failed run never replaces it |

Learners' devices pick up a new published version through the 003 update rule (new worker
installs in the background, used from the next launch), unchanged by this feature.
