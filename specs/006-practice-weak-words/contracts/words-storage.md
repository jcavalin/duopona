# Contract: Saved Word Records (`localStorage`)

Second piece of data Duopona writes to the device, next to
[saved progress](../../001-first-lesson-flow/contracts/progress-storage.md), which is
unchanged. Any change to this format MUST bump `version` and either migrate or reset.

## Key

`duopona:words`

## Value (JSON, version 1)

```json
{
  "version": 1,
  "mistakes": {
    "kili": 2,
    "wawa": 1
  }
}
```

- Keys are course words (lower case). Values are integers ≥ 1; words with no outstanding
  mistakes are absent.
- Words no longer in the course are kept but never chosen (spec edge cases).

## Read rules

| Stored value | Result |
|--------------|--------|
| Key missing | No weak words |
| Not valid JSON | No weak words |
| `version` ≠ 1, or `mistakes` not an object, or any value not an integer ≥ 1 | No weak words |
| Valid v1 | Loaded as-is |
| `localStorage` throws | No weak words, app keeps working |

A failure here never changes how `duopona:progress` is read, and the reverse (FR-012, SC-006).

## Write rules

- Written whenever the word records change (after a first answer to an exercise that tests at
  least one course word).
- Write failures are caught and ignored; in-memory records stay correct for the current run.
