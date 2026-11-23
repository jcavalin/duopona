# Contract: Settings Storage (change)

Extends [014 settings-storage.md](../../014-portuguese-language/contracts/settings-storage.md).

| Field | Rule |
|-------|------|
| `version` | `1` (unchanged) |
| `language` | `"en"`, `"pt-BR"` or `"fr"` |

- Values saved before this feature (`"en"`, `"pt-BR"`) load exactly as before.
- Everything else (when it is written, invalid values, write failures) is unchanged.
