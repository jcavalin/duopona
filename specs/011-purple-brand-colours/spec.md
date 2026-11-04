# Feature Specification: Purple Brand Colours

**Feature Branch**: `011-purple-brand-colours`

**Created**: 2026-11-04

**Status**: Implemented (phone check M5 deferred by owner decision, task T016)

**Input**: User description: "Change Duopona's brand colours to purple as described in
docs/design/purple-theme.md"

**Design**: [docs/design/purple-theme.md](../../docs/design/purple-theme.md) (colour table, new
success colours, manifest colours) and the mockups in
[docs/design/mockups/](../../docs/design/mockups/), which already show the purple theme. The
mockups also show the mascot and the new app icon; those belong to the next roadmap item
("Mascot & app icon") and are out of scope here.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Purple brand across the app (Priority: P1)

A learner opens Duopona and sees a purple brand instead of green: the main buttons, the current
lesson node and its ring, the lesson progress bar, the lesson banner, links, headings and the
wordmark are purple or lilac, on a neutral violet-grey background. Layout, text, shapes and
behaviour do not change; only colours do. The app no longer looks like a Duolingo copy at a
glance.

**Why this priority**: This is the point of the feature: give Duopona its own identity.

**Independent Test**: Open each screen (lesson path, lesson intro, multiple choice, word bank,
wrong answer, lesson complete) and compare it with mockups 01–07, ignoring the mascot.

**Acceptance Scenarios**:

1. **Given** the lesson path, **When** it loads, **Then** the background is the violet-grey of the
   design, the current lesson node is purple with a purple-tinted ring, and the headings and
   wordmark are lilac (mockup 01).
2. **Given** a lesson in progress, **When** the learner looks at the top bar and the Check button,
   **Then** the progress fill and the button are purple with a darker purple bottom edge
   (mockups 03, 05).
3. **Given** a multiple-choice exercise, **When** the learner selects an option, **Then** the
   selected option shows the purple tint with lilac text (mockup 03).
4. **Given** a lesson intro, **When** it opens, **Then** its headings are lilac and the grammar
   card has the purple-tinted background (mockup 02).
5. **Given** the lesson complete screen, **When** a lesson was unlocked, **Then** the "unlocked"
   stat uses the purple brand (mockup 07); the gold "correct" stat is unchanged.
6. **Given** the wrong-answer sheet, **When** it opens, **Then** it looks exactly as before (red
   family), including the "Why?" toggle and explanation card from feature 010.

---

### User Story 2 - "Correct" stays green (Priority: P1)

A learner answers an exercise correctly. The feedback sheet is still green: the green tinted
sheet, the green circle with the check mark, the light green "pona! Correct." title and a green
Continue button. Green now means only "correct" anywhere in the app; it is no longer also the
colour of every normal button.

**Why this priority**: Without this, the swap would turn the correct-answer sheet purple and lose
the familiar right/wrong colour signal. It ships together with User Story 1.

**Independent Test**: Answer any exercise correctly and compare the sheet with mockup 06; then
check that no other screen uses that green.

**Acceptance Scenarios**:

1. **Given** any exercise, **When** the learner answers correctly, **Then** the sheet background,
   check circle, title and Continue button are green as they are today (mockup 06).
2. **Given** the correct sheet is open, **When** the learner looks at the rest of the screen,
   **Then** the progress bar above is purple, not green.
3. **Given** any screen other than the correct-answer sheet, **When** it is shown, **Then** no
   element uses the "correct" green.

---

### User Story 3 - Installed app and browser chrome match (Priority: P2)

A learner who opens Duopona in a phone browser, or installs it, sees the browser bar and the
launch screen in the new violet-grey background colour instead of the old blue-slate.

**Why this priority**: Small but visible on phones; a mismatched bar would look unfinished. The
app icon itself changes in the next feature, not here.

**Independent Test**: Check that the page's theme colour and the installed app's background and
theme colours are the new background colour; on a phone, open the app and see the bar colour.

**Acceptance Scenarios**:

1. **Given** the app is open in Android Chrome, **When** the page loads, **Then** the browser bar
   uses the new background colour.
2. **Given** the app is installed, **When** it launches, **Then** the launch screen background
   uses the new background colour.

---

### Edge Cases

- Focus outlines (keyboard focus ring) use the lilac brand text colour and stay clearly visible
  on the new background and on purple buttons.
- Disabled buttons (e.g. Check with no answer) keep their current grey look.
- Locked and completed lesson nodes keep their current look apart from the background shift;
  only the brand colours change.
- Error (red), gold and streak (orange) colours are unchanged everywhere.
- The wrong-answer "danger" Continue button stays red.
- Offline and installed use: colours are part of the app, so they behave like the rest of it; a
  phone with the old version cached shows purple after the normal update.
- Hard-coded colours that copy the old green or blue-slate (outside the shared colour set) are
  moved to the new values too, so no green or blue-slate is left behind.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app's shared colours MUST change to the purple values in the token table of
  purple-theme.md: background, text, muted text, lines, muted icons, brand, brand edge, brand
  text, strong brand text, brand tint and grammar tint.
- **FR-002**: Every element that today uses the brand green for brand purposes (buttons, current
  node and ring, progress fill, banner, links, headings, wordmark, selected option, unlocked
  stat, focus ring, intro headings and grammar card) MUST show the purple equivalent.
- **FR-003**: The app MUST have its own "correct" colours with the old green values (success,
  success edge, success text, success tint) as listed in purple-theme.md.
- **FR-004**: Everything that means "correct answer" MUST use the "correct" colours: the correct
  sheet background, its check circle, its title and its Continue button (including that button's
  bottom edge).
- **FR-005**: No element outside the "correct" meaning MAY use the "correct" green, and no
  element MAY still show the old green brand or the old blue-slate background.
- **FR-006**: Error, gold, streak and white colours, and the wrong-answer sheet with its 010
  toggle and explanation card, MUST stay unchanged.
- **FR-007**: The browser theme colour and the installed app's background and theme colours MUST
  be the new background colour.
- **FR-008**: All text MUST meet 4.5:1 contrast against its background after the swap (white on
  purple buttons, lilac on the background, light green on the correct sheet).
- **FR-009**: Layout, sizes, type, shapes, behaviour, saved data and course content MUST NOT
  change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Each of mockups 01–07 matches the app's matching screen in colour (owner judgement
  in the manual check), ignoring the mascot and app icon.
- **SC-002**: 0 places in the app's styles still use an old green brand or blue-slate value,
  except the "correct" colours.
- **SC-003**: 100% of text and background pairs listed in FR-008 measure at least 4.5:1.
- **SC-004**: The correct-answer sheet is visibly green and every primary button outside it is
  visibly purple, on every screen.
- **SC-005**: All existing tests still pass; no screen changes in layout or behaviour.

## Assumptions

- The colour values in purple-theme.md are final (they were picked to pass contrast on the new
  background); small adjustments are allowed only if a contrast check fails, and are recorded.
- The app icons stay as they are in this feature; the next feature ("Mascot & app icon")
  replaces them with icon files that already use the purple palette.
- Dark theme only, as today; no light theme.
- No user setting to choose the colour; everyone gets purple.
- The wrong-answer colours added in 010 are red-family and do not depend on the brand colour, so
  they need no change.
