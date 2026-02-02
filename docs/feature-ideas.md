# Feature Ideas

A collection of potential future features for Oscar Tracker. These are ideas that have been discussed or considered but not yet implemented.

## Table of Contents

- [UI/UX Improvements](#uiux-improvements)
- [Sharing Enhancements](#sharing-enhancements)
- [Progress & Tracking](#progress--tracking)
- [Data & Privacy](#data--privacy)
- [Platform Features](#platform-features)

---

## UI/UX Improvements

### Category Progress Indicators in Dropdown

**Priority**: High
**Complexity**: Low

Show checkmarks or progress indicators next to categories in the category dropdown when in Predictions or Shared mode, making it easy to see which categories have predictions at a glance.

**Current behavior:**
```
Best [ Picture            v]
      Picture
      Director
      Actor
      Actress
      Supporting Actor
      ...
```

**Proposed behavior:**
```
Best [ Picture          v]
      Picture         ✓
      Director        ✓
      Actor           ✓
      Actress
      Supporting Actor ✓
      ...
```

**Implementation notes:**
- Add checkmark (✓) or indicator next to category options that have a prediction
- Works in Predictions mode (shows user's predictions) and Shared mode (shows friend's predictions)
- Could also show partial progress in Watched mode (e.g., "3/10" or a visual indicator)
- Update `renderCategoryOptions()` to include status indicators
- CSS to align checkmarks on the right side of dropdown options

---

### Keyboard Shortcuts

**Priority**: Low
**Complexity**: Low

Display available keyboard shortcuts in the About modal or a dedicated help section.

**Current shortcuts:**
- Arrow Left/Right: Navigate categories
- Enter/Space: Toggle selection (when film focused)
- Escape: Close modals

**Possible additions:**
- `1-9` keys: Select nth nominee in list
- `W` key: Switch to Watched mode
- `P` key: Switch to Predictions mode
- `S` key: Open Share modal
- `?` key: Show shortcuts help

---

### Dark/Light Mode Toggle

**Priority**: Low
**Complexity**: Medium

Add theme switching capability. Currently the app is dark-mode only.

**Considerations:**
- Would require significant CSS work
- Most Oscar tracking happens in the evening (dark mode preferred)
- Could use `prefers-color-scheme` media query for auto-detection
- Store preference in localStorage

---

### Empty State Messaging

**Priority**: Medium
**Complexity**: Low

Better messaging when viewing shared predictions with no selections.

**Current**: Shows empty list
**Proposed**: Show friendly message like "Sarah hasn't made any predictions yet!"

---

### Expanded Tips Rotation

**Priority**: Medium
**Complexity**: Low

Add more tips to the rotating tip display at the bottom of the main screen.

**Current tips:**
- "Tap a film to mark it as watched"

**Proposed additional tips:**
- "Switch to Predictions mode to pick your winners"
- "Switch to Favorites mode to mark your personal favorites"
- "Share your predictions with friends via the Share button"
- "Swipe left/right to browse categories"
- "Install the app for offline access"
- "Your data is stored locally and never leaves your device"
- "Tap a predicted film again to deselect it"
- "You can save predictions from multiple friends"

**Implementation:**
- Add tips array in JavaScript
- Rotate tips on each page load or on a timer
- Consider showing mode-specific tips

---

## Sharing Enhancements

### Source Identification

**Priority**: Medium
**Complexity**: Medium

Improve duplicate detection beyond simple name matching. Currently we match by name (case-insensitive), which has limitations:
- Two different people named "Sarah" would be treated as duplicates
- Someone could impersonate another person's name

**Option 1: Device Fingerprint Hash**
- Generate a short hash from device characteristics (screen size, timezone, etc.)
- Embed in URL: `?p=...&name=Sarah&src=a7b3`
- Same name + different source = different people

**Option 2: Random Sender ID**
- Generate random ID on first share, store in localStorage
- Embed in URL: `?p=...&name=Sarah&id=x9k2m`
- Persistent per-device, allows tracking updates from same source

**Option 3: Prediction Signature**
- Hash the predictions + timestamp
- Detect if exact same link is being re-shared vs. updated predictions

---

### QR Code Generation

**Priority**: Low
**Complexity**: Low

Generate QR codes for sharing predictions in person.

**Features:**
- Button to show QR code in Share modal
- Could embed additional verification metadata
- Useful for Oscar watch parties

**Libraries:**
- `qrcode` npm package
- Canvas-based generation (no server needed)

---

### Comparison View

**Priority**: Medium
**Complexity**: High

Compare your predictions side-by-side with a friend's predictions.

**Features:**
- Split view showing both sets of predictions
- Highlight agreements and disagreements
- Show overall match percentage
- "You both picked Sinners for Best Picture!"

---

### Import/Merge Shared Predictions

**Priority**: Low
**Complexity**: Medium

Allow importing selections from a shared list into your own predictions.

**Use case:** "I like Sarah's picks for the acting categories, let me copy those into my predictions."

**Considerations:**
- Could cause confusion about whose predictions are whose
- Would need clear UI to show what's being imported
- Marked as out of scope for initial implementation

---

## Progress & Tracking

### Overall Progress Dashboard

**Priority**: Medium
**Complexity**: Medium

A summary view showing progress across all categories.

**Features:**
- Grid or list of all 21 categories
- Visual progress indicators per category
- Total watched/predicted counts
- "12 of 21 categories complete"

---

### Watched History

**Priority**: Low
**Complexity**: Medium

Track when films were marked as watched.

**Features:**
- Timestamps for each watch action
- "Recently watched" section
- Calendar view of watching activity
- Useful for tracking viewing pace before ceremony

---

### Awards Night Mode

**Priority**: Medium
**Complexity**: Medium

Special mode for during the ceremony.

**Features:**
- Mark winners as they're announced
- Compare predictions to results in real-time
- Score tracking (how many did you get right?)
- Highlight correct/incorrect predictions

---

### Prediction Lock

**Priority**: Low
**Complexity**: Low

Allow users to "lock" their predictions before the ceremony.

**Features:**
- Set a cutoff date/time
- Locked predictions cannot be edited
- Shows locked status to viewers of shared predictions
- Proves predictions weren't changed after results

---

## Data & Privacy

### ~~Privacy Note~~ ✅ IMPLEMENTED

Added in About modal with lock emoji icon.

**Text:** "Your data is stored locally on your device and never sent to any server."

---

### Data Export

**Priority**: Low
**Complexity**: Low

Allow users to export their data.

**Features:**
- Export watched items as JSON
- Export predictions as JSON
- Export shared lists
- Useful for backup or migrating devices

---

### Data Import

**Priority**: Low
**Complexity**: Medium

Allow importing previously exported data.

**Features:**
- Import from JSON file
- Merge with existing data (don't overwrite)
- Validate data format before import

---

## Platform Features

### Native App Wrapper

**Priority**: Low
**Complexity**: High

Package the PWA as native apps.

**Options:**
- Capacitor (iOS + Android)
- Electron (Desktop)
- PWA Builder (Microsoft Store)

**Benefits:**
- App store presence
- Better notifications
- Native share sheet integration

**Considerations:**
- Maintenance overhead
- App store policies
- Currently PWA works well for most users

---

### Push Notifications

**Priority**: Low
**Complexity**: High

Remind users about upcoming ceremony or incomplete predictions.

**Types:**
- "Oscar ceremony is in 3 days! You've predicted 18/21 categories."
- "Sarah just updated their predictions!"
- "Don't forget to watch [Film] before the ceremony"

**Requirements:**
- Service worker notification support
- User permission
- Could work with PWA (no server needed for basic reminders)

---

### Widget Support

**Priority**: Low
**Complexity**: High

iOS/Android home screen widgets.

**Features:**
- Show countdown to ceremony
- Show prediction progress
- Quick access to app

**Requirements:**
- Would need native app wrapper
- Platform-specific implementations

---

## Out of Scope (Intentionally)

These features have been discussed and intentionally excluded:

| Feature | Reason |
|---------|--------|
| Server-side storage | Adds complexity, cost, privacy concerns |
| User accounts | Unnecessary for core use case |
| Real-time sync | Requires server infrastructure |
| Editing shared predictions | Could cause confusion |
| Social features (comments, likes) | Out of scope for simple tracker |
| Tip jar / donations | Not needed for personal project |
| Advertising | Against project philosophy |

---

## Contributing Ideas

Have a feature idea? Open an issue on GitHub: [github.com/rfulwell/oscar-tracker/issues](https://github.com/rfulwell/oscar-tracker/issues)
