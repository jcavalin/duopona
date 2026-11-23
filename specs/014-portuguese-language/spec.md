# Feature Specification: Study in Brazilian Portuguese

**Feature Branch**: `014-portuguese-language`

**Created**: 2026-11-23

**Status**: Implemented (owner language review M5 deferred by owner decision, task T038; phone checks M4 and M6 deferred by owner decision, task T040)

**Input**: User description: "Today the user can only study Toki Pona using English; I want to also
add Portuguese. So the user will be able to select which language they prefer; by default it
should use the device language." Follow-up: "it must be Brazilian Portuguese."

## Clarifications

### Session 2026-11-23

- Q: Where does the language choice live? → A: Hidden behind a settings button on the home
  screen, not shown directly on it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Study the whole course in Portuguese (Priority: P1)

A Brazilian learner who does not read English well opens Duopona and studies Toki Pona entirely
through Brazilian Portuguese: the home screen, buttons, lesson titles, new-word meanings, grammar
explanations, exercise prompts and answers, feedback, the "Why?" explanations, the leave
confirmation and the session summary are all in Portuguese. Only Toki Pona itself stays as it is.

**Why this priority**: This is the feature. Without a complete Portuguese course, choosing
Portuguese would give a half-English app that a Portuguese-only learner cannot use.

**Independent Test**: With Portuguese active, play every lesson, a practice and a weak-word
review, answer some exercises wrong and open "Why?"; check that no English text appears anywhere
and that every exercise can be answered correctly in Portuguese.

**Acceptance Scenarios**:

1. **Given** Portuguese is active, **When** the learner opens any screen (home, lesson
   introduction, exercise, feedback, explanation, leave dialog, summary), **Then** all interface
   text is in Brazilian Portuguese.
2. **Given** Portuguese is active, **When** the learner opens a lesson introduction, **Then** the
   lesson title, chapter reference, new-word meanings and grammar explanation are in Portuguese,
   and the Toki Pona words and example sentences are unchanged.
3. **Given** Portuguese is active, **When** a Toki Pona → meaning exercise is shown, **Then** the
   options are Portuguese meanings, and exactly one of them is correct.
4. **Given** Portuguese is active, **When** a meaning → Toki Pona exercise is shown, **Then** the
   prompt is a natural Portuguese word or sentence and the Toki Pona options are the same as in
   English.
5. **Given** Portuguese is active, **When** a word-bank exercise asks to build a Portuguese
   sentence from Toki Pona, **Then** the tiles are Portuguese words that form one natural
   Portuguese sentence in correct Portuguese word order and agreement, and no distractor allows
   a second correct answer.
6. **Given** Portuguese is active, **When** the learner answers wrong and opens "Why?", **Then**
   word meanings, the grammar point, the lesson reference and the grammar note are in Portuguese.

---

### User Story 2 - The app starts in the device language (Priority: P1)

A learner whose phone is set to Portuguese opens Duopona for the first time and it is already in
Portuguese, without looking for a setting. A learner whose phone is in English, or in any other
language, gets English, as today.

**Why this priority**: Most learners never open settings; the right language on first launch is
what makes Portuguese actually reach Portuguese speakers.

**Independent Test**: With no saved choice, set the device/browser language to Portuguese
(Brazil), then to Portuguese (Portugal), English and French, and open the app each time; check
Portuguese, Portuguese, English and English.

**Acceptance Scenarios**:

1. **Given** no language was ever chosen and the device language is any form of Portuguese,
   **When** the app opens, **Then** it is in Brazilian Portuguese.
2. **Given** no language was ever chosen and the device language is English, **When** the app
   opens, **Then** it is in English.
3. **Given** no language was ever chosen and the device language is neither English nor
   Portuguese, **When** the app opens, **Then** it is in English.
4. **Given** the device lists several preferred languages, **When** the app opens with no saved
   choice, **Then** it uses the first of them that is English or Portuguese, or English if none is.

---

### User Story 3 - Choose the language myself (Priority: P2)

A learner wants a different language from the device's: a Brazilian practising English on an
English-language phone, or the other way round. On the home screen they tap the settings button,
which opens the settings with the language choice, pick "Português" or "English", and the app
switches immediately. The choice is
remembered on that device and wins over the device language from then on.

**Why this priority**: The device default covers most people; the manual choice covers the rest
and lets anyone switch back.

**Independent Test**: On an English device, open settings from the home screen and choose
Português; check the app switches at once; reload and check it is still Portuguese; switch back to English and check again.

**Acceptance Scenarios**:

1. **Given** the home screen, **Then** the language choice is not shown on it directly; only a
   settings button (gear icon with an accessible name) is.
2. **Given** the home screen, **When** the learner taps the settings button, **Then** the settings
   open and show the language choice, listing "English" and "Português", each written in its own
   language, with the active one marked.
3. **Given** the settings are open, **When** the learner closes them (close control, Back, Escape
   or tapping outside), **Then** they return to the home screen unchanged.
4. **Given** the language choice, **When** the learner picks the other language, **Then** the
   whole app switches to it immediately (including the settings themselves), with no reload and
   no loss of progress.
5. **Given** the learner chose a language, **When** they close and reopen the app (including
   offline and as an installed app), **Then** it opens in the chosen language, whatever the
   device language.
6. **Given** the learner switched language, **Then** lesson progress, unlocked lessons, word
   mistakes, streak and daily goal are exactly as before.

---

### Edge Cases

- Settings are reachable only from the home screen, so the language never changes in the middle of a lesson,
  practice or review.
- Saved progress and weak-word mistakes are about Toki Pona words and exercises, not about the
  language; they carry over unchanged in both directions.
- A Portuguese meaning that is ambiguous between two options (e.g. two Toki Pona words whose
  Portuguese glosses coincide) must not appear as two options of the same exercise; each
  Portuguese exercise keeps exactly one correct answer, like the English ones.
- A word-bank sentence may have a different number of tiles in Portuguese than in English
  (e.g. articles and verb forms differ); the Portuguese version is its own sentence, not a
  word-for-word copy of the English tiles.
- Device language set to Portuguese (Portugal) or another Portuguese variant: Brazilian
  Portuguese is used, since it is the only Portuguese offered.
- Saved choice unreadable or from an unknown language: fall back to the device language rule,
  without crashing.
- Offline: both languages work fully offline after the first visit (Principle V).
- 360 px width: the settings button, the settings and all Portuguese text (often longer than English) fit
  with no horizontal scrolling and no clipped buttons.
- Screen readers: the page's language is announced correctly so Portuguese text is read with
  Portuguese pronunciation, and Toki Pona text is not misannounced as broken English beyond what
  happens today.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST offer two study languages: English (as today) and Brazilian
  Portuguese.
- **FR-002**: In Portuguese, every piece of text the learner sees that is not Toki Pona MUST be in
  Brazilian Portuguese: interface text, lesson titles and chapter references, word meanings,
  grammar explanations, exercise prompts, options and tiles, feedback, mistake explanations and
  grammar notes, the leave dialog, the summary, the daily-goal and streak texts, and accessible
  names/labels.
- **FR-003**: Toki Pona content (words, sentences, word-bank Toki Pona tiles) MUST be identical in
  both languages; each exercise MUST practise the same Toki Pona and the same grammar point in
  both languages.
- **FR-004**: Every Portuguese exercise MUST have exactly one correct answer, and Portuguese
  word-bank answers MUST be natural, grammatical Brazilian Portuguese sentences.
- **FR-005**: Portuguese course text MUST be original to Duopona, like the English text, and keep
  the existing length limits (e.g. grammar notes ≤ 2 sentences, ≤ 160 characters).
- **FR-006**: When no language has been chosen, the app MUST use the learner's preferred device
  languages in order: the first that is English or any Portuguese variant decides; if none is,
  English.
- **FR-007**: The home screen MUST provide a settings button; the language choice MUST NOT be
  shown on the home screen itself. The settings button MUST open the settings, which contain the
  language choice listing "English" and "Português", showing which is active; choosing one MUST
  switch the whole app immediately. The settings MUST be closable back to the home screen.
- **FR-008**: The chosen language MUST be saved on the device and used on every later launch
  instead of the device language; it MUST be the only new saved data, stored versioned
  (Principle II).
- **FR-009**: Changing language MUST NOT change or reset any progress, mistakes, streak or daily
  goal.
- **FR-010**: The document language MUST match the active language, so browsers and screen
  readers treat the text as English or Portuguese.
- **FR-011**: The settings button, the settings and the language choice MUST be usable by touch,
  mouse and keyboard, have targets of at least 44×44 CSS px, fit at 360 px width, and be
  announced to screen readers with accessible names (Principle V).
- **FR-012**: Both languages MUST work offline after the first visit.
- **FR-013**: Automated checks MUST confirm that every course item (lesson, word meaning,
  grammar explanation, exercise, grammar note) and every interface text exists in both
  languages, so a missing Portuguese translation is caught before release.

### Key Entities

- **Study language**: the language used for everything except Toki Pona; English or Brazilian
  Portuguese.
- **Language preference**: the learner's saved choice, or none (then the device language rule
  applies).
- **Course text per language**: for each lesson, word and exercise, the English and Portuguese
  versions of its non-Toki Pona text; the exercise identity and its Toki Pona side are shared.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With Portuguese active, 0 English strings appear on any screen across all 17
  lessons, practice, review, explanations and the leave dialog.
- **SC-002**: 100% of course items have a Portuguese version (checked automatically).
- **SC-003**: On first launch, 100% of devices whose first supported language is Portuguese open
  in Portuguese, and all others in English.
- **SC-004**: A learner switches language in at most 2 taps from the home screen (settings, then
  the language), and the switch is visible at once.
- **SC-005**: After switching language any number of times, progress, mistakes and streak are
  unchanged.
- **SC-006**: A native Brazilian Portuguese speaker reviewing the course finds every exercise
  answerable with exactly one correct answer and the text natural (owner review).

## Assumptions

- "Portuguese" means Brazilian Portuguese (owner decision); European Portuguese is not offered,
  and devices set to any Portuguese variant get Brazilian Portuguese.
- Only English and Portuguese are in scope; no further languages are planned in this feature,
  though the design should not make adding one later much harder.
- The settings button sits on the home screen (e.g. a gear in the top bar) and is not shown inside
  a lesson. For now the settings contain only the language choice; whether they open as a dialog
  or a screen is decided in planning.
- There is no "follow device language" option once a language was chosen manually; picking the
  device's language again has the same practical effect.
- The app name "Duopona" and the mascot stay the same in both languages. The installed app's
  name and description stay in English (they are fixed at install time).
- Chapter references are translated (e.g. "Lesson 5" → "Lição 5") and still refer to the
  English book *Toki Pona: The Language of Good*, whose chapter order the course follows.
- Portuguese translations are written as part of this feature and reviewed by the owner; that
  review is the check for naturalness (SC-006).
- The README and project docs stay in English.
