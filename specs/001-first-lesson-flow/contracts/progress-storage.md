# Contract: Saved Progress (`localStorage`)

The only data Duopona writes to the device. This format is a contract with *future versions of
the app*: any change MUST bump `version` and either migrate or reset.

## Key

`duopona:progress`

## Value (JSON, version 1)

```json
{
  "version": 1,
  "completedLessons": {
    "basics-1": {
      "firstTryCorrect": 8,
      "total": 10,
      "completedAt": "2026-11-01T14:03:00.000Z"
    }
  }
}
```

## Read rules

| Stored value | Result |
|--------------|--------|
| Key missing | Empty progress |
| Not valid JSON | Empty progress |
| `version` ≠ 1 or wrong shape | Empty progress |
| Valid v1 | Loaded as-is |
| `localStorage` throws (disabled/blocked) | Empty progress, app keeps working |

## Write rules

- Written whenever `completedLessons` changes (i.e., when a lesson is completed).
- Write failures (quota, disabled) are caught and ignored; the in-memory state stays correct
  for the current session.
- Nothing else (session state, answers) is ever written.
