# Data Model: Purple Brand Colours

No stored data changes: no `localStorage` keys, Redux state or course content are added or
changed.

The only "model" is the colour token set in `src/index.css` `:root`. The values are in
[docs/design/purple-theme.md](../../docs/design/purple-theme.md), and the meaning of each token
is in [contracts/ui-colours.md](contracts/ui-colours.md).

| Group | Tokens | Change |
|-------|--------|--------|
| Neutral | `--bg`, `--text`, `--text-muted`, `--line`, `--line-deep`, `--icon-muted` | New violet-grey values |
| Brand | `--primary`, `--primary-deep`, `--primary-text`, `--primary-text-strong`, `--primary-tint`, `--grammar-tint` | Green → purple/lilac |
| Correct | `--success`, `--success-deep`, `--success-text` | New (old green values) |
| Correct | `--success-tint` | Unchanged |
| Others | `--error*`, `--explain-*`, `--gold*`, `--streak*` | Unchanged |
