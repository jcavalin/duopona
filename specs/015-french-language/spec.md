# Feature Specification: Study in French

**Feature Branch**: `015-french-language`

**Created**: 2026-11-23

**Status**: Implemented (owner language review M5 deferred by owner decision, task T024; phone checks M4 and M6 deferred by owner decision, task T026)

**Input**: User description: "Use the spec kit to add French as well" (after feature 014, which
added Brazilian Portuguese next to English). Add French as a third study language: the whole
course (interface, lesson texts, word meanings, exercises, explanations) can be followed in
French; it appears as a third option in the existing settings dialog with a flag like the other
languages; devices set to French start in French by default.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Study the whole course in French (Priority: P1)

A French-speaking learner opens Duopona and studies Toki Pona entirely through French: the home
screen, buttons, lesson titles, new-word meanings, grammar explanations, exercise prompts and
answers, feedback, the "Why?" explanations, the leave confirmation and the session summary are all
in French. Only Toki Pona itself stays as it is.

**Why this priority**: This is the feature. A half-English French mode would not serve a learner
who reads only French.

**Independent Test**: With French active, play every lesson, a practice and a weak-word review,
answer some exercises wrong and open "Why?"; check that no English or Portuguese text appears and
that every exercise can be answered correctly in French.

**Acceptance Scenarios**:

1. **Given** French is active, **When** the learner opens any screen (home, settings, lesson
   introduction, exercise, feedback, explanation, leave dialog, summary), **Then** all interface
   text is in French.
2. **Given** French is active, **When** the learner opens a lesson introduction, **Then** the
   lesson title, chapter reference, new-word meanings and grammar explanation are in French, and
   the Toki Pona words and example sentences are unchanged.
3. **Given** French is active, **When** a Toki Pona → meaning exercise is shown, **Then** the
   options are French meanings, and exactly one of them is correct.
4. **Given** French is active, **When** a meaning → Toki Pona exercise is shown, **Then** the
   prompt is a natural French word or sentence and the Toki Pona options are the same as in the
   other languages.
5. **Given** French is active, **When** a word-bank exercise asks to build a French sentence from
   Toki Pona, **Then** the tiles are French words that form one natural French sentence with
   correct word order, articles and agreement, and no distractor allows a second correct answer.
6. **Given** French is active, **When** the learner answers wrong and opens "Why?", **Then** word
   meanings, the grammar point, the lesson reference and the grammar note are in French.

---

### User Story 2 - French devices start in French (Priority: P1)

A learner whose phone is set to French opens Duopona for the first time and it is already in
French. Devices in English or Portuguese keep behaving as today; devices in any other language get
English.

**Why this priority**: Most learners never open settings; starting in the right language is what
makes French reach French speakers.

**Independent Test**: With no saved choice, set the browser language to French (France), French
(Canada), Portuguese (Brazil), English and German in turn, and open the app each time; check
French, French, Portuguese, English and English.

**Acceptance Scenarios**:

1. **Given** no language was ever chosen and the device language is any form of French, **When**
   the app opens, **Then** it is in French.
2. **Given** the device lists several preferred languages, **When** the app opens with no saved
   choice, **Then** it uses the first of them that is English, Portuguese or French, or English if
   none is.
3. **Given** no language was ever chosen and the device language is English or Portuguese,
   **When** the app opens, **Then** it behaves exactly as before this feature.

---

### User Story 3 - Choose French in settings (Priority: P2)

A learner opens the settings from the home-screen gear and sees three languages: English,
Français and Português, each with its flag and written in its own language. Picking Français
switches the app at once, and the choice is remembered, as for the other languages.

**Why this priority**: The device default covers most people; the manual choice covers the rest
and is already in place, so this only adds an option.

**Independent Test**: On an English device, open settings and choose Français; check the app
switches at once; reload and check it is still French; switch to Português and back to English.

**Acceptance Scenarios**:

1. **Given** the settings are open, **Then** the language choice lists English, Français and
   Português, each with a flag and its own name, with the active one marked.
2. **Given** the settings, **When** the learner picks Français, **Then** the whole app switches to
   French immediately (including the settings themselves), with no reload and no loss of progress.
3. **Given** the learner chose French, **When** they close and reopen the app (including offline
   and as an installed app), **Then** it opens in French whatever the device language.
4. **Given** the learner switched among the three languages, **Then** lesson progress, word
   mistakes, streak and daily goal are exactly as before.
5. **Given** a learner who had chosen English or Portuguese before this feature, **When** they
   open the updated app, **Then** their choice is kept.

---

### Edge Cases

- Device set to a regional French (Canada, Belgium, Switzerland…): standard French is used, since
  it is the only French offered.
- The settings now hold three options: they still fit at 360 px width with no scrolling inside the
  dialog and targets of at least 44 px.
- French text is often longer than English (e.g. "Revoir les mots difficiles"): buttons, the top
  bar and the leave dialog must not clip or scroll horizontally at 360 px.
- French typography: the non-breaking space before "?", "!" and ":" must not leave a punctuation
  mark alone at the start of a line.
- A French meaning that coincides for two Toki Pona words must not appear as two options of one
  exercise; each French exercise keeps exactly one correct answer.
- A word-bank sentence may have a different number of tiles in French (articles, elision such as
  "l'animal", "j'ai"); an elided word and the word it attaches to form one tile, so no tile is
  a bare "l'" or "j'".
- Saved choice unreadable or an unknown language: fall back to the device language rule.
- Offline: all three languages work fully offline after the first visit (Principle V).
- Screen readers: the page language is French while French is active.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST offer three study languages: English, Brazilian Portuguese and French.
- **FR-002**: In French, every piece of text the learner sees that is not Toki Pona MUST be in
  French: interface text, lesson titles and chapter references, word meanings, grammar
  explanations, exercise prompts, options and tiles, feedback, mistake explanations and grammar
  notes, the settings, the leave dialog, the summary, the daily-goal and streak texts, and
  accessible names.
- **FR-003**: Toki Pona content MUST be identical in all three languages; each exercise MUST
  practise the same Toki Pona and the same grammar point in every language.
- **FR-004**: Every French exercise MUST have exactly one correct answer, and French word-bank
  answers MUST be natural, grammatical French sentences.
- **FR-005**: French course text MUST be original to Duopona and keep the existing length limits
  (e.g. grammar notes ≤ 2 sentences, ≤ 160 characters).
- **FR-006**: When no language has been chosen, the app MUST use the learner's preferred device
  languages in order: the first that is English, any Portuguese variant or any French variant
  decides; if none is, English.
- **FR-007**: The settings MUST list English, Français and Português, each with a decorative flag
  and its own name; choosing one MUST switch the whole app immediately.
- **FR-008**: A French choice MUST be saved and restored like the other languages; existing saved
  choices MUST keep working with no migration step visible to the learner (Principle II).
- **FR-009**: Changing language MUST NOT change or reset any progress, mistakes, streak or daily
  goal.
- **FR-010**: The document language MUST be French while French is active.
- **FR-011**: All French screens and the three-option settings MUST fit at 360 px width, keep
  targets of at least 44×44 CSS px and stay keyboard and screen-reader usable (Principle V).
- **FR-012**: French MUST work offline after the first visit.
- **FR-013**: The automated checks that cover English and Portuguese (completeness, one correct
  answer, untranslated text, identical Toki Pona, length limits) MUST also cover French.

### Key Entities

- **Study language**: now English, Brazilian Portuguese or French.
- **Language preference**: unchanged; it may now also hold French.
- **Course text per language**: each lesson, word and exercise gains a French version; the
  exercise identity and its Toki Pona side stay shared.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With French active, 0 English or Portuguese strings appear on any screen across all
  17 lessons, practice, review, explanations, settings and the leave dialog.
- **SC-002**: 100% of course items have a French version (checked automatically).
- **SC-003**: On first launch, 100% of devices whose first supported language is French open in
  French; English and Portuguese devices behave as before.
- **SC-004**: A learner switches to French in at most 2 taps from the home screen.
- **SC-005**: After switching among the three languages any number of times, progress, mistakes
  and streak are unchanged.
- **SC-006**: A French speaker reviewing the course finds every exercise answerable with exactly
  one correct answer and the text natural (owner review; may be deferred by owner decision).

## Assumptions

- "French" means standard (France) French; it is shown with the flag of France. Devices set to any
  French variant get it.
- The learner is addressed with "tu", the friendly register common in language-learning apps;
  *sina* is glossed with both "tu" and "vous" forms where the meaning needs it.
- Options are listed English, Français, Português (English first, then by name).
- Feature 014's approach (a complete parallel course per language, the settings dialog, device
  language detection) is reused; this feature adds a language to it, not a new mechanism.
- Chapter references are translated (e.g. "Lesson 5" → "Leçon 5") and still refer to the English
  book *Toki Pona: The Language of Good*.
- The app name, mascot, installed-app name and description stay as they are.
- French translations are written as part of this feature; the owner's review is the check for
  naturalness (SC-006).
- The README and project docs stay in English.
