# Contract: Settings (home screen)

## Settings button (home top bar)

- A gear icon link, placed at the end of the top bar after the streak and lessons counters, and at
  least 44×44 CSS px.
- Accessible name: "Settings" / "Configurações".
- Goes to `#/settings` without resetting the scroll position.
- Shown only on the home screen.

## Settings dialog (`#/settings`)

The home screen stays rendered underneath. The dialog is a native modal `<dialog>`, labelled by
its title.

| Part | English | Português |
|------|---------|-----------|
| Title (h2) | Settings | Configurações |
| Close button (icon, accessible name) | Close settings | Fechar configurações |
| Fieldset legend | Language | Idioma |
| Option 1 (radio, `lang="en"`) | English | English |
| Option 2 (radio, `lang="pt-BR"`) | Português | Português |

The option labels are always written in their own language, whichever language is active.

## Behaviour

- **Opening**: the radio of the active language is checked and gets focus.
- **Choosing a radio**: switches the app language at once, by click, tap, or arrow keys inside the
  group. The dialog stays open and re-renders in the new language, and focus stays on the chosen
  radio. The choice is saved (contract settings-storage.md).
- **Closing**: the close button, Escape, a tap on the backdrop, or browser/device Back closes the
  dialog and shows the home screen at the same scroll position. Focus returns to the settings
  button.
- **Opened directly** (`#/settings` as the first page): closing replaces the URL with `#/`.
- **Size and placement**: each radio row is at least 44 px tall and the whole row is clickable. The
  dialog fits a 360 px width with no horizontal scrolling and respects safe areas.
- **Styling**: reuses the leave-dialog look (`.leave-dialog` tokens), in the current theme, with
  text contrast of at least 4.5:1.

## Language switch scope

After a switch, all text on the home screen, the dialog and every later screen is in the new
language: lesson titles, counters' accessible names, daily goal, practice buttons and hint,
banner, footer, and the "Start" pill. Toki Pona text is unchanged.
