# Contract: Settings Storage (change)

Extends [015 settings-storage.md](../../015-french-language/contracts/settings-storage.md).

| Field | Rule |
|-------|------|
| `version` | `1` (unchanged) |
| `language` | `"en"`, `"pt-BR"`, `"fr"` or `"es"` |

- Values saved before this feature (`"en"`, `"pt-BR"`, `"fr"`) load exactly as before.
- Everything else (when it is written, invalid values, write failures) is unchanged.
