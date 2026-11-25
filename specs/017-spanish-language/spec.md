# Feature Specification: Study in Spanish

**Feature Branch**: `017-spanish-language`

**Created**: 2026-11-25

**Status**: Implemented (owner language review M5 deferred by owner decision, task T023; phone checks M4 and M6 deferred by owner decision, task T025)

**Input**: User description: "lets use spec kit to add spanish as a language option" (after
features 014 and 015, which added Brazilian Portuguese and French next to English). Add Spanish
as a fourth study language: the whole course (interface, lesson texts, word meanings, exercises,
explanations) can be followed in Spanish; it appears as a fourth option in the existing settings
dialog with a flag like the other languages; devices set to Spanish start in Spanish by default.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Study the whole course in Spanish (Priority: P1)

A Spanish-speaking learner opens Duopona and studies Toki Pona entirely through Spanish: the home
screen, buttons, lesson titles, new-word meanings, grammar explanations, exercise prompts and
answers, feedback, the "Why?" explanations, the leave confirmation and the session summary are all
in Spanish. Only Toki Pona itself stays as it is.

**Why this priority**: This is the feature. A half-English Spanish mode would not serve a learner
who reads only Spanish.

**Independent Test**: With Spanish active, play every lesson, a practice and a weak-word review,
answer some exercises wrong and open "Why?"; check that no English, Portuguese or French text
appears and that every exercise can be answered correctly in Spanish.

**Acceptance Scenarios**:

1. **Given** Spanish is active, **When** the learner opens any screen (home, settings, lesson
   introduction, exercise, feedback, explanation, leave dialog, summary), **Then** all interface
   text is in Spanish.
2. **Given** Spanish is active, **When** the learner opens a lesson introduction, **Then** the
   lesson title, chapter reference, new-word meanings and grammar explanation are in Spanish, and
   the Toki Pona words and example sentences are unchanged.
3. **Given** Spanish is active, **When** a Toki Pona → meaning exercise is shown, **Then** the
   options are Spanish meanings, and exactly one of them is correct.
4. **Given** Spanish is active, **When** a meaning → Toki Pona exercise is shown, **Then** the
   prompt is a natural Spanish word or sentence and the Toki Pona options are the same as in the
   other languages.
5. **Given** Spanish is active, **When** a word-bank exercise asks to build a Spanish sentence from
   Toki Pona, **Then** the tiles are Spanish words that form one natural Spanish sentence with
   correct word order, articles and agreement, and no distractor allows a second correct answer.
6. **Given** Spanish is active, **When** the learner answers wrong and opens "Why?", **Then** word
   meanings, the grammar point, the lesson reference and the grammar note are in Spanish.

---

### User Story 2 - Spanish devices start in Spanish (Priority: P1)

A learner whose phone is set to Spanish opens Duopona for the first time and it is already in
Spanish. Devices in English, Portuguese or French keep behaving as today; devices in any other
language get English.

**Why this priority**: Most learners never open settings; starting in the right language is what
makes Spanish reach Spanish speakers.

**Independent Test**: With no saved choice, set the browser language to Spanish (Spain), Spanish
(Mexico), Spanish (Argentina), French, Portuguese (Brazil), English and German in turn, and open
the app each time; check Spanish, Spanish, Spanish, French, Portuguese, English and English.

**Acceptance Scenarios**:

1. **Given** no language was ever chosen and the device language is any form of Spanish, **When**
   the app opens, **Then** it is in Spanish.
2. **Given** the device lists several preferred languages, **When** the app opens with no saved
   choice, **Then** it uses the first of them that is English, Portuguese, French or Spanish, or
   English if none is.
3. **Given** no language was ever chosen and the device language is English, Portuguese or
   French, **When** the app opens, **Then** it behaves exactly as before this feature.

---

### User Story 3 - Choose Spanish in settings (Priority: P2)

A learner opens the settings from the home-screen gear and sees four languages: English,
Español, Français and Português, each with its flag and written in its own language. Picking
Español switches the app at once, and the choice is remembered, as for the other languages.

**Why this priority**: The device default covers most people; the manual choice covers the rest
and is already in place, so this only adds an option.

**Independent Test**: On an English device, open settings and choose Español; check the app
switches at once; reload and check it is still Spanish; switch to each other language and back.

**Acceptance Scenarios**:

1. **Given** the settings are open, **Then** the language choice lists English, Español, Français
   and Português, each with a flag and its own name, with the active one marked.
2. **Given** the settings, **When** the learner picks Español, **Then** the whole app switches to
   Spanish immediately (including the settings themselves), with no reload and no loss of
   progress.
3. **Given** the learner chose Spanish, **When** they close and reopen the app (including offline
   and as an installed app), **Then** it opens in Spanish whatever the device language.
4. **Given** the learner switched among the four languages, **Then** lesson progress, word
   mistakes, streak and daily goal are exactly as before.
5. **Given** a learner who had chosen English, Portuguese or French before this feature, **When**
   they open the updated app, **Then** their choice is kept.

---

### Edge Cases

- Device set to any regional Spanish (Spain, Mexico, Argentina, US Spanish…): the single Spanish
  offered is used.
- The settings now hold four options: they still fit at 360 px width with no scrolling inside the
  dialog and targets of at least 44 px.
- Spanish text is often longer than English (e.g. "Repasar palabras difíciles"): buttons, the top
  bar and the leave dialog must not clip or scroll horizontally at 360 px.
- Spanish punctuation: questions and exclamations use the opening marks "¿" and "¡"; in word-bank
  exercises an opening mark is part of the first word's tile, never a tile on its own.
- Contractions "al" and "del" are single tiles; no answer requires the learner to build them from
  "a el" or "de el".
- A Spanish meaning that coincides for two Toki Pona words must not appear as two options of one
  exercise; each Spanish exercise keeps exactly one correct answer.
- Spanish often drops the subject pronoun ("como fruta" for *mi moku e kili*). Word-bank answers
  always include it ("yo como fruta"), so each word-bank exercise keeps one correct sentence and a
  tile that matches the Toki Pona subject.
- Saved choice unreadable or an unknown language: fall back to the device language rule.
- Offline: all four languages work fully offline after the first visit (Principle V).
- Screen readers: the page language is Spanish while Spanish is active.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST offer four study languages: English, Brazilian Portuguese, French and
  Spanish.
- **FR-002**: In Spanish, every piece of text the learner sees that is not Toki Pona MUST be in
  Spanish: interface text, lesson titles and chapter references, word meanings, grammar
  explanations, exercise prompts, options and tiles, feedback, mistake explanations and grammar
  notes, the settings, the leave dialog, the summary, the daily-goal and streak texts, and
  accessible names.
- **FR-003**: Toki Pona content MUST be identical in all four languages; each exercise MUST
  practise the same Toki Pona and the same grammar point in every language.
- **FR-004**: Every Spanish exercise MUST have exactly one correct answer, and Spanish word-bank
  answers MUST be natural, grammatical Spanish sentences.
- **FR-005**: Spanish course text MUST be original to Duopona and keep the existing length limits
  (e.g. grammar notes ≤ 2 sentences, ≤ 160 characters).
- **FR-006**: When no language has been chosen, the app MUST use the learner's preferred device
  languages in order: the first that is English, any Portuguese variant, any French variant or
  any Spanish variant decides; if none is, English.
- **FR-007**: The settings MUST list English, Español, Français and Português, each with a
  decorative flag and its own name; choosing one MUST switch the whole app immediately.
- **FR-008**: A Spanish choice MUST be saved and restored like the other languages; existing saved
  choices MUST keep working with no migration step visible to the learner (Principle II).
- **FR-009**: Changing language MUST NOT change or reset any progress, mistakes, streak or daily
  goal.
- **FR-010**: The document language MUST be Spanish while Spanish is active.
- **FR-011**: All Spanish screens and the four-option settings MUST fit at 360 px width, keep
  targets of at least 44×44 CSS px and stay keyboard and screen-reader usable (Principle V).
- **FR-012**: Spanish MUST work offline after the first visit.
- **FR-013**: The automated checks that cover the existing languages (completeness, one correct
  answer, untranslated text, identical Toki Pona, length limits) MUST also cover Spanish.
- **FR-014**: The Spanish text MUST be neutral Spanish that reads naturally to speakers from any
  country: "ustedes" for plural "you" (no "vosotros"), and no regionally marked vocabulary or
  idioms. It is shown with the flag of Spain.

### Key Entities

- **Study language**: now English, Brazilian Portuguese, French or Spanish.
- **Language preference**: unchanged; it may now also hold Spanish.
- **Course text per language**: each lesson, word and exercise gains a Spanish version; the
  exercise identity and its Toki Pona side stay shared.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With Spanish active, 0 English, Portuguese or French strings appear on any screen
  across all 17 lessons, practice, review, explanations, settings and the leave dialog.
- **SC-002**: 100% of course items have a Spanish version (checked automatically).
- **SC-003**: On first launch, 100% of devices whose first supported language is Spanish open in
  Spanish; English, Portuguese and French devices behave as before.
- **SC-004**: A learner switches to Spanish in at most 2 taps from the home screen.
- **SC-005**: After switching among the four languages any number of times, progress, mistakes
  and streak are unchanged.
- **SC-006**: A Spanish speaker reviewing the course finds every exercise answerable with exactly
  one correct answer and the text natural (owner review; may be deferred by owner decision).

## Clarifications

### Session 2026-11-25

- Q: Which Spanish variety and flag? → A: Neutral Spanish ("ustedes", no "vosotros", no
  regional vocabulary) with the Spain flag (FR-014).

## Assumptions

- The learner is addressed with "tú", the friendly register common in language-learning apps;
  *sina* is glossed with both "tú" and "usted" forms where the meaning needs it.
- Options are listed English first, then by their own name: English, Español, Français,
  Português.
- The approach of features 014 and 015 (a complete parallel course per language, the settings
  dialog, device language detection) is reused; this feature adds a language to it, not a new
  mechanism.
- Chapter references are translated (e.g. "Lesson 5" → "Lección 5") and still refer to the
  English book *Toki Pona: The Language of Good*.
- The app name, mascot, installed-app name and description stay as they are.
- Spanish translations are written as part of this feature; the owner's review is the check for
  naturalness (SC-006).
- The README and project docs stay in English (the README's language list is updated).
