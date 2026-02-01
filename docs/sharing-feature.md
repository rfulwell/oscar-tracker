# Sharing Predictions Feature

## Overview

Enable users to share their Oscar predictions with friends via URL. This is a client-side only feature with no server interaction.

## Requirements

### Core Functionality

1. **Share Button**: User can generate a shareable URL containing their predictions
2. **URL Encoding**: Predictions encoded as compact query parameters
3. **Name Parameter**: Sharer's name included in URL for attribution
4. **Read-Only Viewing**: Recipients view shared predictions without editing
5. **Separate Mode**: Shared predictions appear as a new entry in the mode dropdown

### User Experience

#### Sharing Flow (Sender)
1. User makes predictions in "Predictions" mode
2. User clicks "Share" button
3. Prompt asks for their name (optional, default "Friend")
4. URL is generated and copied to clipboard
5. User shares URL via text/email/social

#### Viewing Flow (Recipient)
1. Recipient opens shared URL
2. App detects `?p=` and `&name=` parameters
3. Mode dropdown shows new option: "[Name]'s Predictions"
4. App automatically switches to this view mode
5. Predictions displayed read-only (no click interaction)
6. User can switch to their own "Watched" or "Predictions" modes anytime

### Mode Dropdown States

**Without shared link:**
```
[ Watched        ▼]
  Watched
  Predictions
```

**With shared link (`?p=...&name=Sarah`):**
```
[ Sarah's Picks  ▼]
  Watched
  Predictions
  Sarah's Picks    ← new, read-only
```

## Technical Design

### URL Format

```
https://awardstracker.app/?p=80314203124021321032&name=Sarah
```

| Parameter | Description | Example |
|-----------|-------------|---------|
| `p` | Encoded predictions (21 chars) | `80314203124021321032-` |
| `name` | Sharer's display name (URL encoded) | `Sarah` |

### Encoding Scheme

**Format**: 21-character string, one character per category (in order)

| Character | Meaning |
|-----------|---------|
| `0-9` | Nominee index (0 = first nominee, 9 = 10th) |
| `-` | No selection for this category |

**Category Order** (matches `CATEGORIES` array):
```
0:  Best Picture
1:  Best Director
2:  Best Actor
3:  Best Actress
4:  Best Supporting Actor
5:  Best Supporting Actress
6:  Best Original Screenplay
7:  Best Adapted Screenplay
8:  Best Animated Feature
9:  Best International Feature
10: Best Documentary Feature
11: Best Cinematography
12: Best Film Editing
13: Best Production Design
14: Best Costume Design
15: Best Makeup and Hairstyling
16: Best Original Score
17: Best Original Song
18: Best Sound
19: Best Visual Effects
20: Best Casting
```

**Example**:
```
Predictions: {
  "best-picture": "sinners" (index 8),
  "best-director": "dir-coogler" (index 0),
  "best-actor": (none),
  ...
}

Encoded: "80-..."
```

### Functions to Implement

```javascript
// Encode predictions object to URL string
function encodePredictions(predictions) → string

// Decode URL string to predictions object
function decodePredictions(encoded) → object

// Generate full share URL with name
function generateShareURL(predictions, name) → string

// Parse URL parameters on page load
function parseShareParams() → { predictions, name } | null
```

### State Management

**New state variables:**
```javascript
let sharedPredictions = null;  // { name: string, predictions: object }
let currentMode = 'watched';   // 'watched' | 'predictions' | 'shared'
```

**LocalStorage**: Shared predictions are NOT saved to localStorage (ephemeral, URL-only)

### UI Changes

1. **Share Button**: Add to predictions mode UI (location TBD)
2. **Name Prompt**: Simple browser `prompt()` or inline input
3. **Mode Dropdown**: Dynamically add shared option when URL params present
4. **Read-Only Indicator**: Visual cue that shared view cannot be edited
5. **Copy Confirmation**: Toast/feedback when URL copied to clipboard

### Visual Treatment for Shared Mode

- Same gold star styling as predictions
- Disabled/muted click states (no hover effects)
- Optional banner: "Viewing [Name]'s predictions"
- Items not clickable (or clicks do nothing)

## Open Questions

1. **Share button location**: In header? Footer? Floating action button?
2. **Name prompt UX**: Browser prompt vs inline input vs modal?
3. **Banner design**: Persistent banner or dismissible?
4. **Empty states**: What if shared link has no predictions?

## Out of Scope

- Server-side storage
- User accounts
- Real-time sync
- Editing shared predictions
- Merging/importing shared predictions into own

## Implementation Phases

### Phase 1: Core Encoding
- [ ] Implement `encodePredictions()`
- [ ] Implement `decodePredictions()`
- [ ] Unit tests for encode/decode roundtrip

### Phase 2: URL Handling
- [ ] Implement `generateShareURL()`
- [ ] Implement `parseShareParams()` on page load
- [ ] Handle URL parameter detection in `init()`

### Phase 3: UI Integration
- [ ] Add "Share" button to predictions mode
- [ ] Add shared mode to dropdown
- [ ] Implement read-only view rendering
- [ ] Add copy-to-clipboard functionality

### Phase 4: Polish
- [ ] Name prompt UX
- [ ] Visual feedback (toast, banner)
- [ ] Edge case handling (invalid URLs, missing params)
