# Contract: Saved Streak (`localStorage`)

Third piece of data Duopona writes, next to
[saved progress](../../001-first-lesson-flow/contracts/progress-storage.md) and
[word records](../../006-practice-weak-words/contracts/words-storage.md), both unchanged. Any
change to this format MUST bump `version` and either migrate or reset.

## Key

`duopona:streak`

## Value (JSON, version 1)

```json
{
  "version": 1,
  "lastDay": "2026-11-03",
  "current": 3,
  "best": 5
}
```

- `lastDay`: `YYYY-MM-DD` local date the daily goal was last met, or `null`.
- `current`: integer ≥ 0; `0` exactly when `lastDay` is `null`.
- `best`: integer ≥ `current`.

## Read rules

| Stored value | Result |
|--------------|--------|
| Key missing | Empty streak |
| Not valid JSON | Empty streak |
| `version` ≠ 1 | Empty streak |
| `lastDay` neither `null` nor a `YYYY-MM-DD` string; `current`/`best` not integers ≥ 0; `best < current`; `current` 0 with a `lastDay`, or > 0 without | Empty streak |
| Valid v1 | Loaded as-is |
| `localStorage` throws | Empty streak, app keeps working |

A failure here never changes how `duopona:progress` or `duopona:words` are read, and the
reverse (FR-011, FR-012, SC-005).

## Write rules

- Written whenever the streak record changes (first finished session of a day).
- Write failures are caught and ignored; the in-memory streak stays correct for this run.
