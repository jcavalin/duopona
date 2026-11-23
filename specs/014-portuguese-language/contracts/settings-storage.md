# Contract: Settings Storage

Key: `duopona:settings` in `localStorage`. It is independent of the other `duopona:*` keys.

```json
{ "version": 1, "language": "pt-BR" }
```

| Field | Rule |
|-------|------|
| `version` | `1` |
| `language` | `"en"` or `"pt-BR"` |

- **Written** only after the learner chooses a language in settings, and again on every later
  choice. It is never written for a detected language.
- **Read** once at startup. If the key is missing, the JSON is invalid, the version is wrong or the
  language is unknown, the app behaves as if nothing was saved: it uses the device language rule,
  `chosen: false`, and leaves the stored value as it is until the next choice overwrites it.
- **Write failures** (storage full or disabled) are ignored. The choice then lasts only for this
  session, as with the other keys.
