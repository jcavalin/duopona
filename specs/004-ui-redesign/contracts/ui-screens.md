# UI Contract: Screens, Texts and Accessible Names

What each screen must expose to the learner and to assistive technology. Automated tests
(`tests/integration/lessonFlow.test.tsx`) query by these roles and names; looks follow the
mockups in `docs/design/mockups/` and the tokens in `docs/design/ui-redesign.md`.
"(new)" marks an element or text that did not exist before this feature; "(was …)" marks a
changed text.

## S1. Lesson path (home, `#/`) — mockup 01

| Element | Role / name | Content |
|---------|-------------|---------|
| Wordmark | `heading` level 1, name "duopona" (was "Duopona") | Lower-case wordmark |
| Counter (new) | text, accessible name "N of 17 lessons done" | Bubble icon + "N / 17" |
| Banner (new) | region text | "Course · N of 17 done", "Learn Toki Pona", "Following *Toki Pona: The Language of Good*" |
| Path | `list` | 17 `listitem`s in course order |
| Completed node | `link`, name "<title>, completed, X of Y" | Gold node, check icon, title below; opens `#/lesson/<id>` |
| Current node | `link`, name "<title>, start" | Green node, star, ring, "Start" label above, title below |
| Locked node | `link` with `aria-disabled="true"`, name "<title>, locked"; not focusable as a link target, no navigation | Grey node, lock icon, title below |
| Credit | `contentinfo` | Unchanged text and tokipona.org link (FR-011 of 002) |

## S2. Lesson introduction — mockup 02

| Element | Role / name | Content |
|---------|-------------|---------|
| Close | `button`, name "Back to lessons" (was visible "Back") | X icon; goes to `#/` |
| Overline | text | "<chapter label> · N exercises", e.g. "Book: Lesson 3 · 13 exercises" (upper-cased by style) |
| Title | `heading` level 1 | Lesson title |
| New words | `heading` level 2 "New words" + description list | One card per word: word (`dt`), meaning (`dd`) |
| Grammar | `heading` level 2 = grammar title + paragraphs | Tinted card |
| Start | `button` "Start" | In bottom bar |

## S3. Exercise — mockups 03 and 05

| Element | Role / name | Content |
|---------|-------------|---------|
| Close | `button`, name "Quit lesson" (was visible "Quit") | X icon; quits as today |
| Progress | `progressbar` "Lesson progress", value = done, max = total | Unchanged values |
| Position | text "n/total" (was "n of total") | n = min(done + 1, total) |
| Instruction | `heading` level 1 | Per data-model "Instruction text" |
| Grammar tag (new) | text "Grammar" | Word bank with `practisesGrammar` only |
| Prompt | `heading` level 2 | Prompt text in a bubble; icon tile beside it is `aria-hidden` |
| Options (MC) | `group` "Options" of `button`s with `aria-pressed`; name = option text | Number badge `aria-hidden`; keys 1–n select (research R5) |
| Answer (WB) | `group` "Your answer" of tile `button`s | On ruled lines |
| Bank (WB) | `group` "Word bank" of tile `button`s | Used tiles leave an `aria-hidden` placeholder |
| Check | `button` "Check", disabled until an answer exists | In bottom bar; absent while feedback shows |

## S4. Feedback sheet — mockups 04 and 06

| Case | Role / name | Content |
|------|-------------|---------|
| Correct | `status` text "pona! Correct." (was "Correct!") | Green sheet; `button` "Continue", focused |
| Wrong | `status` text "Not quite. Correct answer: <answer>" (was "Wrong — correct answer: …") | Red sheet, icon; red `button` "Continue", focused |
| Options while shown | all option/tile buttons disabled | Selected MC option green (correct) or red (wrong) |

## S5. Lesson complete — mockup 07

| Element | Role / name | Content |
|---------|-------------|---------|
| Badge | `aria-hidden` | Gold star |
| Title | `heading` level 1 "Lesson complete!" | Unchanged text |
| Lesson | text | Lesson title |
| Correct card | text "Correct" + "X / Y" (was "You got X of Y right on the first try.") | Gold card |
| Unlocked card (new) | text "Unlocked" + next lesson title | Only when a next lesson exists |
| Continue | `button` "Continue" (was "Back to lessons"), focused | Goes to `#/` |
| Replay (new) | `button` "Replay lesson" | Shows this lesson's introduction |

## Keyboard

- Every button and link is reachable with Tab and shows a visible focus ring
  (`primary-text` color, 3 px) on the dark background (FR-021).
- Number keys 1–n select multiple-choice options when no feedback is shown (FR-012).
