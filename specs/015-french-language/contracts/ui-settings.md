# Contract: Settings (change)

Extends [014 ui-settings.md](../../014-portuguese-language/contracts/ui-settings.md). The gear,
the dialog, opening, closing and focus behaviour are unchanged.

| Part | English | Português | Français |
|------|---------|-----------|----------|
| Gear accessible name / title (h2) | Settings | Configurações | Paramètres |
| Close button | Close settings | Fechar configurações | Fermer les paramètres |
| Fieldset legend | Language | Idioma | Langue |

Options, in this order, each a radio row ≥ 44 px with a decorative flag (hidden from assistive
technology) and the name in its own language (`lang` set on the label):

1. 🇺🇸 English (`lang="en"`)
2. 🇫🇷 Français (`lang="fr"`)
3. 🇧🇷 Português (`lang="pt-BR"`)

(The flags are inline SVG, not emoji. The emoji above only show the meaning.)

- The dialog fits 360 × 640 with all three rows visible and nothing scrolling.
- Choosing Français switches the app at once, the dialog included, and saves `"fr"`.
