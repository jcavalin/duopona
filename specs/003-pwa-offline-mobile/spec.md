# Feature Specification: Installable, Offline-Capable PWA

**Feature Branch**: `003-pwa-offline-mobile`

**Created**: 2026-11-03

**Status**: Implemented (pending: T014, T016–T021 manual checks)

**Input**: User description: "Make Duopona an installable, offline-capable PWA that is fully usable on phones"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Learn without a connection (Priority: P1)

A learner has opened Duopona once while online. Later, on a train with no signal, they open it
again (in the browser or from the home screen). The lesson list appears with their progress,
and they can start, play and finish any unlocked lesson exactly as when online. Completing a
lesson saves their progress and unlocks the next one, all offline.

**Why this priority**: Short practice sessions happen on phones in places with poor or no
connection. Offline use is the core value of this feature and is required by Constitution
Principle V.

**Independent Test**: Open the app online once, switch the device to airplane mode, reopen
the app, and play a lesson to the end.

**Acceptance Scenarios**:

1. **Given** the learner has opened the app once while online and the page has finished
   loading, **When** they reopen it with no network connection, **Then** the lesson list
   loads with their saved progress.
2. **Given** the app is open offline, **When** the learner starts any unlocked lesson,
   **Then** its introduction, every exercise, the feedback and the summary all work, for every
   one of the course's 17 lessons, including lessons never opened before.
3. **Given** the learner finishes a lesson offline, **When** they return to the lesson list or
   reopen the app later (online or offline), **Then** the lesson shows as completed with its
   score and the next lesson is unlocked.
4. **Given** the learner opens a direct link to a lesson (e.g., a bookmarked lesson) while
   offline, **When** the app loads, **Then** it shows that lesson (or the lesson list, if the
   lesson is locked), never a browser "no connection" page.

---

### User Story 2 - Install Duopona on the phone (Priority: P2)

A learner wants Duopona on their home screen like a native app. Using the browser's own
install option ("Add to Home Screen" on iPhone, "Install app" on Android), they add it. It
appears with the Duopona name and icon, opens full-screen without browser bars, and works the
same as in the browser, including offline.

**Why this priority**: Installing makes Duopona quick to reach for a short practice session
and is required by Constitution Principle V; offline use (US1) is more important because it
also benefits learners who never install.

**Independent Test**: On an Android phone (Chrome) and an iPhone (Safari), install the app
from the browser menu, open it from the home screen, and play a lesson.

**Acceptance Scenarios**:

1. **Given** a learner visits Duopona in Android Chrome, **When** they open the browser menu,
   **Then** an option to install the app is offered, and after installing, a Duopona icon with
   the name "Duopona" is on the home screen.
2. **Given** a learner uses "Add to Home Screen" in iOS Safari, **When** the shortcut is
   created, **Then** it shows the Duopona icon (not a page screenshot) and the name "Duopona".
3. **Given** the app is installed, **When** the learner opens it from the home screen,
   **Then** it opens full-screen without the browser's address bar, with a background and
   status bar colored to match the app, and shows the lesson list.
4. **Given** the app is installed, **When** the learner moves between the lesson list, a
   lesson and its summary, **Then** they can always get back to the lesson list using
   controls inside the app (no browser Back button is needed).
5. **Given** the app is installed, **When** the learner opens it with no connection, **Then**
   US1 applies unchanged.

---

### User Story 3 - Get new lessons and fixes automatically (Priority: P3)

When a new version of Duopona is published (e.g., new or corrected lessons), a learner who
already has it on their phone gets the new version without doing anything special, never
loses progress, and is never interrupted in the middle of a lesson.

**Why this priority**: Without this, offline storage could keep learners on an old version
forever. It matters only once US1 exists.

**Independent Test**: Open the app, publish a changed version, then close and reopen the app
while online (twice if needed) and confirm the change is visible and progress is intact.

**Acceptance Scenarios**:

1. **Given** a new version has been published, **When** the learner opens the app online,
   **Then** the new version is downloaded in the background and is in use no later than the
   next time the app is opened.
2. **Given** a learner is in the middle of a lesson when a new version finishes downloading,
   **When** they continue, **Then** the lesson is not reloaded or interrupted.
3. **Given** a new version is in use, **When** the lesson list shows, **Then** all progress
   from before the update is still there.
4. **Given** a new version is only partly downloaded when the connection drops, **When** the
   learner reopens the app offline, **Then** the previous complete version still works.

---

### User Story 4 - Comfortable to use on real phones (Priority: P2)

A learner uses Duopona on their own iPhone or Android phone, in the browser and installed.
Everything fits the screen, nothing hides behind the notch or home indicator, buttons and word
tiles are easy to tap, and the screen doesn't jump or zoom unexpectedly.

**Why this priority**: "Fully usable on phones" is part of the request and of Constitution
Principle V. Most layout work was done in feature 002; what remains is confirming it on real
devices, in installed (full-screen) mode where safe areas matter most, and fixing what fails.

**Independent Test**: On a real iPhone and a real Android phone, play one full lesson in the
browser and one in the installed app, in portrait orientation.

**Acceptance Scenarios**:

1. **Given** the app runs installed (full-screen) on a phone with a notch or home indicator,
   **When** any screen is shown, **Then** no text, button or tile is hidden behind the notch,
   status bar or home indicator.
2. **Given** a phone screen 360 px wide or wider, **When** any screen is shown, **Then** there
   is no horizontal scrolling and every button and tile is at least 44×44 px.
3. **Given** the learner taps buttons or tiles quickly, **When** they play, **Then** the page
   does not zoom in on double tap and taps register on the first touch.
4. **Given** the learner rotates the phone to landscape, **When** a screen is shown, **Then**
   it stays usable (no content cut off or unreachable), even if not optimized for that
   orientation.

---

### Edge Cases

- **First visit offline**: a learner who has never opened the app online cannot use it
  offline; the browser's normal "no connection" behavior applies (nothing to show yet).
- **First visit interrupted**: if the connection drops before everything needed for offline
  use is stored, the app works online as before and finishes preparing for offline use on a
  later online visit; it MUST NOT end up in a half-working offline state.
- **Browser clears stored data** (low device storage, user clears site data, iOS removing data
  of sites not used for a long time): the app behaves like a first visit; progress loss in this
  case is accepted (progress lives only on the device, Constitution II).
- **Browser and installed app on iPhone**: iOS keeps the installed app's data separate from
  Safari's, so progress made in Safari does not appear in the installed app and vice versa.
  This is accepted and not worked around (no accounts, no sync).
- **Unknown address inside the app while offline** (e.g., a mistyped lesson link): the app
  shows the lesson list, as it does online.
- **Private / incognito browsing** where offline storage is unavailable: the app still works
  online as before; offline use and installation may simply not be offered.
- **Old version still cached during an update**: the learner sees either the complete old
  version or the complete new version, never a mix (e.g., new lesson list with old lessons).

## Requirements *(mandatory)*

### Functional Requirements

**Offline use**

- **FR-001**: After one complete online visit, the app MUST open and be fully usable with no
  network connection, in the browser and when installed.
- **FR-002**: Offline use MUST cover all course content: all 17 lessons (introductions,
  exercises, feedback, summaries) MUST be playable offline, including lessons the learner has
  never opened.
- **FR-003**: Saving and showing progress (completed lessons, scores, unlocking) MUST work
  offline exactly as online.
- **FR-004**: Opening any in-app address (lesson list or a lesson link) while offline MUST show
  the app, not a browser error page.
- **FR-005**: The app MUST NOT require any network request after the first complete visit to
  function, and MUST NOT send any learner data anywhere (Constitution II).

**Installation**

- **FR-006**: The app MUST be installable through the browser's own install features on
  Android Chrome ("Install app") and iOS Safari ("Add to Home Screen"), and on desktop
  browsers that support installing web apps.
- **FR-007**: The installed app MUST be named "Duopona", MUST show an original Duopona icon
  that looks correct on Android (including round/shaped icon masks) and iOS home screens, and
  MUST open full-screen without browser address bar.
- **FR-008**: The installed app MUST open on the lesson list, use a launch background and
  status/title bar color that match the app's colors, and every screen MUST offer an in-app
  way back to the lesson list.
- **FR-009**: The app MUST NOT show its own install banner, pop-up or nag; installing is done
  through the browser's menu.

**Updates**

- **FR-010**: When a new version is published, a learner who opens the app online MUST get it
  automatically, in use no later than the next time the app is opened after it finishes
  downloading, with no action needed from the learner.
- **FR-011**: An update MUST NOT reload or interrupt a lesson in progress and MUST NOT lose or
  reset saved progress.
- **FR-012**: The learner MUST always run one complete version (app and content together);
  a partly downloaded update MUST NOT replace a working version.

**Phone usability**

- **FR-013**: On phones, in the browser and installed, content MUST stay clear of device safe
  areas (notch, status bar, home indicator) on every screen.
- **FR-014**: All screens MUST be usable from 360 px viewport width with no horizontal
  scrolling, and every interactive target MUST be at least 44×44 px (as established in
  feature 002; MUST still hold in installed mode).
- **FR-015**: Tapping controls MUST NOT trigger double-tap zoom or delayed taps; the layout
  MUST NOT jump when feedback appears.
- **FR-016**: Every user story of features 001 and 002 MUST still pass, in the browser and
  installed, on current iOS Safari and Android Chrome.

### Key Entities

- **App version**: one complete, consistent set of the app and its course content, as
  published. The learner's device keeps at most the version in use plus one being downloaded.
- **Offline copy**: the stored copy of the current app version that lets the app run without
  a network; it holds no learner data.
- **Learner progress**: unchanged from features 001–002 (completed lessons with scores), kept
  separately from the offline copy so that updates never touch it.
- **App identity**: the name, icon, colors and launch screen shown when installed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After one online visit, 100% of the 17 lessons can be played start to finish
  with the device in airplane mode.
- **SC-002**: The installed app opens to a usable lesson list in under 2 seconds on the
  phones used for testing (models recorded with the device checks), online or offline (after
  the first visit).
- **SC-003**: The app can be installed on a real iPhone (Safari) and a real Android phone
  (Chrome), and in both cases it shows the Duopona name and icon and opens full-screen.
- **SC-004**: After publishing a changed version, the change is visible on a device that
  already had the app within two openings of the app while online, with 0 lost progress
  entries.
- **SC-005**: On real iPhone and Android phones, in browser and installed mode, 0 screens have
  content hidden by the notch/home indicator, 0 screens scroll horizontally at 360 px width,
  and 0 interactive targets are smaller than 44×44 px.
- **SC-006**: Making the app work offline adds at most 3 seconds to the first visit's time
  until the lesson list is usable on a typical mobile connection (preparing offline use
  happens in the background).

## Assumptions

- The app is served over HTTPS in production (required by browsers for installation and
  offline use); local development on `localhost` counts as secure. Choosing and setting up
  hosting is outside this feature.
- Installation relies on the browsers' own UI (FR-009); iOS has no install prompt that a web
  app can trigger, and adding an in-app install button is left for a later feature if needed.
- A plain, original icon (e.g., a simple mark in the app's colors) is acceptable; no
  professional branding work is part of this feature.
- The launch (splash) background is set once for all color schemes (white); learners using
  dark mode see a brief light splash before the dark app. Accepted: browsers offer no
  per-scheme splash color, and the planned dark-first UI redesign (ROADMAP) will revisit it.
- Portrait is the primary orientation; landscape only needs to stay usable (US4 scenario 4).
- "Current" iOS Safari and Android Chrome means the latest major version and the one before it
  at the time of testing.
- Push notifications, background sync, sharing, and an in-app "update available" message are
  out of scope (no backend; updates apply silently, FR-010).
- No changes to course content, exercise behavior, or the progress storage format are part of
  this feature.
- This feature also completes the real-device checks left open by feature 002 (task T051):
  the iPhone and Android checks of US4 cover them.
- Testing relies on a real iPhone and a real Android phone being available to the developer.
