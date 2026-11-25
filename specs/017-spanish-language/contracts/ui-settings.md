# Contract: Settings (change)

Extends [015 ui-settings.md](../../015-french-language/contracts/ui-settings.md). The gear,
the dialog, opening, closing and focus behaviour are unchanged.

| Part | English | Español |
|------|---------|---------|
| Gear accessible name / title (h2) | Settings | Configuración |
| Close button | Close settings | Cerrar configuración |
| Fieldset legend | Language | Idioma |

(The Portuguese and French texts are unchanged; see 015.)

Options, in this order, each a radio row ≥ 44 px with a decorative flag (hidden from assistive
technology) and the name in its own language (`lang` set on the label):

1. 🇺🇸 English (`lang="en"`)
2. 🇪🇸 Español (`lang="es"`)
3. 🇫🇷 Français (`lang="fr"`)
4. 🇧🇷 Português (`lang="pt-BR"`)

(The flags are inline SVG, not emoji. The emoji above only show which flag is meant. The Spain
flag is red–yellow–red, 1 : 2 : 1, without the coat of arms; research R4.)

- The dialog fits 360 × 640 with all four rows visible and nothing scrolling.
- Choosing Español switches the app at once, including the dialog, and saves `"es"`.
