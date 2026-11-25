# Research: Wrong-Answer Sheet Layout Fix

## R1. Where the toggle goes

**Decision**: The toggle always sits on its own line under the correct answer, at the start of
the text column (under the title, not under the icon). The title, label and answer take the full
width beside the icon.

**Rationale**: The toggle is about 130 px wide. In its own column it leaves the text about 110 px
at 360 px, which splits "Não é bem isso" over three lines. Below the answer it costs one line but
frees the whole width, and the result is the same in every language. Measured on the mockup at
360 px with a one-word answer, the text area is 151 px tall in all three languages; today it is
179 px in Portuguese and French and 116 px in English.

**Alternatives considered**:
- *Toggle on the answer's line, wrapping under it when there is no room* (first mockup draft).
  Rejected: with the wide labels "Resposta correta:" and "Bonne réponse :" the toggle wrapped even
  for a one-word answer in Portuguese and French but fit in English, so the sheet looked different
  per language.
- *Toggle in the title row with a shorter label or an icon only*. Rejected: an icon-only "Why?" is
  less clear, and the title would still be squeezed by the remaining button.
- *Toggle next to Continue*. Rejected: it would compete with the main action and move away from the
  text it explains.

## R2. Keeping accessibility unchanged

**Decision**: Wrap the existing `role="status"` element and the toggle in a new column element
(`.sheetBody`). The toggle stays a sibling after the status element, not inside it.

**Rationale**: 010 C1/C2 require that only the title and answer are announced, and that the card
follows the heading in DOM order. The DOM order stays status text → toggle → card, so the
announcement, `aria-controls` and the tab order (toggle, then Continue) are unchanged. Focus still
starts on Continue.

**Alternatives considered**: Moving the toggle into the status element. Rejected: its label would
be read out with every wrong answer.

## R3. How to verify the layout

**Decision**: An integration test checks the structure: the toggle and the status region share
one parent inside the heading row, the toggle comes after the status region and is not inside it.
The visual result is checked at 360 px in headless Chrome against the built app in English,
Portuguese and French (manual check M1, run by the implementer and recorded in tasks.md), with a
phone check M2 that the owner may waive, as in earlier features.

**Rationale**: jsdom has no layout (009 R10), so line counts and widths cannot be tested there.
Adding a browser-test stack for one layout check would go against Principle I; the constitution's
browser-only exception covers this with a written check.

**Alternatives considered**: Reading the stylesheet in a unit test (as 011 did for colours).
Rejected: it would test CSS text, not the result, and adds little over the structure test plus M1.
