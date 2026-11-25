# Feature Specification: Wrong-Answer Sheet Layout Fix

**Feature Branch**: `016-feedback-sheet-layout`

**Created**: 2026-11-25

**Status**: Implemented (phone check M2 deferred by owner decision, task T007)

**Input**: User description: "Wrong-answer feedback sheet layout fix. On a phone (360px wide), the
"Why?" toggle sits in the same row as the "Not quite / Correct answer: X" text, at the right, so
the text is squeezed into a ~110px column and wraps word by word while the space under the toggle
stays empty. Fix: the title and correct answer use the full width beside the icon; the
"Why?"/"Hide" toggle always sits on its own line under the answer, aligned with the start of the
text. Must look the same and good in all study/UI languages (English, Portuguese, French) and for
long answers. Colours, sizes, Continue button and explanation card are unchanged. Approved mockup:
docs/design/mockups/04c-wrong-answer-layout-fix.png."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read the wrong-answer feedback at a glance (Priority: P1)

A learner on a phone answers an exercise wrong. The sheet that slides up shows the title ("Not
quite", "Não é bem isso", "Pas tout à fait") on one line, then the "Correct answer:" label and the
correct answer across the width next to the red icon. Today the text is squeezed into a narrow
column beside the "Why?" button: the title breaks after every word or two, and the area under the
button stays empty. After the fix the "Why?" button sits on its own line under the answer, lined
up with the text, so the learner reads the feedback in two or three lines and still finds the
button right below it.

**Why this priority**: This is the whole feature. The sheet appears after every wrong answer, and
a title split over three lines makes the feedback harder to read and looks broken.

**Independent Test**: On a 360 px wide screen, answer a multiple-choice exercise wrong in each
language and compare the sheet with mockup 04c. Then answer a word-bank exercise wrong (long
answer) and compare again.

**Acceptance Scenarios**:

1. **Given** a 360 px wide screen and any study language (English, Portuguese, French), **When**
   the learner answers wrong and the correct answer is a single word, **Then** the title is on one
   line, the label and the answer each take one line next to the icon, and the "Why?" button is on
   its own line below the answer, starting where the text starts.
2. **Given** a wrong answer whose correct answer is a long sentence, **When** the sheet opens,
   **Then** the answer wraps across the full text width (not into a narrow column) and the "Why?"
   button is still below it, starting where the text starts.
3. **Given** the sheet in any language, **When** the learner taps "Why?", **Then** the button turns
   into "Hide" in the same place and the explanation card opens below the text, as today.
4. **Given** a wrong answer with no explanation to show, **When** the sheet opens, **Then** no
   button is shown and no empty line is left where it would be.
5. **Given** a right answer, **When** the sheet opens, **Then** it looks exactly as it does today.

---

### Edge Cases

- **Long title in a language** (French "Pas tout à fait" is the longest): it still fits on one line
  at 360 px; on a narrower screen it may wrap, but it still uses the full text width.
- **Very long correct answer** (word-bank sentence): it wraps within the text width, and the sheet
  keeps its current height limit, with only the explanation card scrolling.
- **Explanation open with a long answer**: Continue stays visible, as today.
- **Wider screens** (tablet, desktop): the same layout, with the button below the answer rather
  than pushed to the far right.
- **Large text setting**: the text and the button wrap without overlapping and without sideways
  scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On the wrong-answer sheet, the title, the "Correct answer:" label and the correct
  answer MUST use the whole width between the icon and the right edge of the sheet.
- **FR-002**: The "Why?"/"Hide" button MUST appear on its own line directly below the correct
  answer, aligned with the start of the text (not under the icon), in every language and for every
  answer length.
- **FR-003**: The layout MUST be the same in English, Portuguese and French, with no
  language-specific positioning.
- **FR-004**: When there is no explanation, the sheet MUST show no button and no empty space for
  it.
- **FR-005**: The button's behaviour (opens and closes the explanation, label switches between
  "Why?" and "Hide", the explanation starts closed on every new wrong answer), what screen readers
  announce, and where focus goes MUST stay as today.
- **FR-006**: Colours, text sizes, the icon, the Continue button, the explanation card and the
  right-answer sheet MUST stay as today.
- **FR-007**: At 360 px wide there MUST be no sideways scrolling and nothing overlapping, in any
  language, with the explanation open or closed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 360 px wide, the wrong-answer title takes 1 line in all three languages (today:
  3 lines in Portuguese).
- **SC-002**: At 360 px wide with a one-word answer, the text part of the sheet (title, label,
  answer, button) is the same height in all three languages. Measured on mockup 04c: 151 px in
  every language, against 179 px today in Portuguese and French (28 px shorter) and 116 px today
  in English (35 px taller, the accepted cost of a layout that is the same in every language).
- **SC-003**: The sheet matches mockup 04c in English, Portuguese and French, both closed and open,
  and with a long answer.
- **SC-004**: All existing checks of the feedback sheet's behaviour still pass unchanged.

## Assumptions

- Mockup `docs/design/mockups/04c-wrong-answer-layout-fix.png`, approved by the owner on
  2026-11-25, is the reference design. It supersedes the position of the "Why?" button shown in
  mockups 04a/04b and in the 010 sheet contract (C1/C2); everything else in that contract stays.
- The only languages are English, Portuguese and French (features 014 and 015).
- 360 px is the narrowest phone width the app is designed for, as in earlier features.
- Phone checks may be deferred by the owner, as in earlier features.
