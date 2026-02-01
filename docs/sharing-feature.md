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

## Test Plan

### Unit Tests (Encoding/Decoding)

```javascript
// tests/sharing.spec.js

describe('Prediction Encoding', () => {
  test('encodes full predictions to 21-char string', () => {
    const predictions = {
      'best-picture': 'sinners',        // index 8
      'best-director': 'dir-coogler',   // index 0
      'best-actor': 'actor-chalamet',   // index 0
      // ... all 21 categories
    };
    const encoded = encodePredictions(predictions);
    expect(encoded).toHaveLength(21);
    expect(encoded[0]).toBe('8');  // best-picture
    expect(encoded[1]).toBe('0');  // best-director
  });

  test('encodes empty categories as dash', () => {
    const predictions = { 'best-picture': 'sinners' };
    const encoded = encodePredictions(predictions);
    expect(encoded[0]).toBe('8');
    expect(encoded[1]).toBe('-');  // no director selected
  });

  test('decodes string back to predictions object', () => {
    const encoded = '80314203124021321032-';
    const decoded = decodePredictions(encoded);
    expect(decoded['best-picture']).toBeDefined();
    expect(decoded['best-director']).toBeDefined();
  });

  test('roundtrip encode/decode preserves data', () => {
    const original = { 'best-picture': 'sinners', 'best-actor': 'actor-jordan' };
    const encoded = encodePredictions(original);
    const decoded = decodePredictions(encoded);
    expect(decoded['best-picture']).toBe(original['best-picture']);
    expect(decoded['best-actor']).toBe(original['best-actor']);
  });

  test('handles all 21 categories', () => {
    // Full predictions for all categories
    const encoded = encodePredictions(fullPredictions);
    expect(encoded).toHaveLength(21);
    expect(encoded).not.toContain('-');
  });

  test('handles empty predictions', () => {
    const encoded = encodePredictions({});
    expect(encoded).toBe('---------------------');
  });

  test('handles invalid encoded string gracefully', () => {
    expect(decodePredictions('')).toEqual({});
    expect(decodePredictions('abc')).toEqual({});
    expect(decodePredictions(null)).toEqual({});
  });
});
```

### E2E Tests (Playwright)

```javascript
// tests/sharing.spec.js

describe('Share Button', () => {
  test('share button visible only in predictions mode', async ({ page }) => {
    await page.goto('/');

    // Not visible in watched mode
    await expect(page.locator('#share-btn')).not.toBeVisible();

    // Switch to predictions mode
    await page.selectOption('#mode-select', 'predictions');
    await expect(page.locator('#share-btn')).toBeVisible();
  });

  test('clicking share prompts for name', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('#mode-select', 'predictions');

    // Make a prediction first
    await page.click('#films-list .film:first-child');

    // Mock the prompt dialog
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept('TestUser');
    });

    await page.click('#share-btn');
  });

  test('copies URL to clipboard after sharing', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');
    await page.selectOption('#mode-select', 'predictions');
    await page.click('#films-list .film:first-child');

    page.on('dialog', dialog => dialog.accept('TestUser'));
    await page.click('#share-btn');

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('?p=');
    expect(clipboardText).toContain('&name=TestUser');
  });

  test('shows confirmation toast after copying', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('#mode-select', 'predictions');
    await page.click('#films-list .film:first-child');

    page.on('dialog', dialog => dialog.accept('TestUser'));
    await page.click('#share-btn');

    await expect(page.locator('.toast')).toBeVisible();
    await expect(page.locator('.toast')).toContainText('copied');
  });
});

describe('Shared URL Loading', () => {
  test('loads shared predictions from URL', async ({ page }) => {
    // 8 = sinners for best-picture, rest empty
    await page.goto('/?p=8--------------------&name=Sarah');

    // Should auto-switch to shared mode
    await expect(page.locator('#mode-select')).toHaveValue('shared');

    // Should show Sarah's name in dropdown
    await expect(page.locator('#mode-select option[value="shared"]')).toContainText("Sarah's Picks");
  });

  test('displays shared predictions as read-only', async ({ page }) => {
    await page.goto('/?p=80-------------------&name=Sarah');

    // First film should be marked as predicted
    const firstFilm = page.locator('#films-list .film:first-child');
    await expect(firstFilm).toHaveClass(/predicted/);

    // Clicking should NOT change state (read-only)
    const initialState = await firstFilm.getAttribute('aria-checked');
    await firstFilm.click();
    const afterClick = await firstFilm.getAttribute('aria-checked');
    expect(afterClick).toBe(initialState);
  });

  test('shows read-only banner in shared mode', async ({ page }) => {
    await page.goto('/?p=8--------------------&name=Sarah');

    await expect(page.locator('.shared-banner')).toBeVisible();
    await expect(page.locator('.shared-banner')).toContainText("Sarah's");
  });

  test('user can switch to their own predictions', async ({ page }) => {
    await page.goto('/?p=8--------------------&name=Sarah');

    // Switch to own predictions
    await page.selectOption('#mode-select', 'predictions');

    // Should no longer show shared banner
    await expect(page.locator('.shared-banner')).not.toBeVisible();

    // Films should be interactive again
    const firstFilm = page.locator('#films-list .film:first-child');
    await firstFilm.click();
    await expect(firstFilm).toHaveAttribute('aria-checked', 'true');
  });

  test('preserves local predictions when viewing shared', async ({ page }) => {
    await page.goto('/');

    // Make local prediction
    await page.selectOption('#mode-select', 'predictions');
    await page.click('#films-list .film:nth-child(2)');

    // Navigate to shared URL
    await page.goto('/?p=8--------------------&name=Sarah');

    // Switch back to own predictions
    await page.selectOption('#mode-select', 'predictions');

    // Local prediction should still be there
    await expect(page.locator('#films-list .film:nth-child(2)')).toHaveClass(/predicted/);
  });
});

describe('Edge Cases', () => {
  test('handles missing name parameter', async ({ page }) => {
    await page.goto('/?p=8--------------------');

    // Should default to "Friend"
    await expect(page.locator('#mode-select option[value="shared"]')).toContainText("Friend's Picks");
  });

  test('handles invalid prediction string', async ({ page }) => {
    await page.goto('/?p=invalid&name=Sarah');

    // Should not crash, should fall back to watched mode
    await expect(page.locator('#mode-select')).toHaveValue('watched');
  });

  test('handles empty prediction string', async ({ page }) => {
    await page.goto('/?p=---------------------&name=Sarah');

    // Should show empty state message
    await expect(page.locator('.empty-shared-message')).toBeVisible();
  });

  test('URL-decodes special characters in name', async ({ page }) => {
    await page.goto('/?p=8--------------------&name=Sarah%20%26%20John');

    await expect(page.locator('#mode-select option[value="shared"]')).toContainText("Sarah & John");
  });

  test('handles very long names gracefully', async ({ page }) => {
    const longName = 'A'.repeat(100);
    await page.goto(`/?p=8--------------------&name=${longName}`);

    // Name should be truncated in UI
    const optionText = await page.locator('#mode-select option[value="shared"]').textContent();
    expect(optionText.length).toBeLessThan(50);
  });
});

describe('Share with No Predictions', () => {
  test('share button disabled when no predictions made', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('#mode-select', 'predictions');

    // No predictions made yet
    await expect(page.locator('#share-btn')).toBeDisabled();
  });

  test('share button enabled after making prediction', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('#mode-select', 'predictions');

    await page.click('#films-list .film:first-child');

    await expect(page.locator('#share-btn')).toBeEnabled();
  });
});
```

### Performance Tests

```javascript
describe('Sharing Performance', () => {
  test('encode/decode completes in under 5ms', async ({ page }) => {
    await page.goto('/');

    const timing = await page.evaluate(() => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        const encoded = encodePredictions(fullPredictions);
        decodePredictions(encoded);
      }
      return performance.now() - start;
    });

    expect(timing / 1000).toBeLessThan(5); // <5ms per operation
  });

  test('URL parsing does not block page load', async ({ page }) => {
    const start = Date.now();
    await page.goto('/?p=80314203124021321032&name=Sarah');
    await page.waitForSelector('#films-list .film');
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(1000); // Page loads in <1s
  });
});
```

## Final Mock-up

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                         OSCAR TRACKER                               │
│                     98th Academy Awards                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ◄  Best [ Picture            ▼]  ►      ○        [SHARE]   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Mode: [ Sarah's Picks        ▼]                              │   │
│  │       ├─ Watched                                             │   │
│  │       ├─ Predictions                                         │   │
│  │       └─ Sarah's Picks ←                                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  👁 Viewing Sarah's predictions (read-only)            [×]  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ★  Sinners                                            MAX  │   │
│  │     Warner Bros.                                            │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │  ☆  Bugonia                                                 │   │
│  │     Focus Features                                          │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │  ☆  F1                                                 🍎   │   │
│  │     Apple Original Films                                    │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │  ☆  Frankenstein                                       N    │   │
│  │     Netflix                                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                        ... more nominees ...                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Legend:
  ★  = Gold star (Sarah's prediction)
  ☆  = Empty star (not predicted)
  [SHARE] = Share button (only in user's Predictions mode)
```

### Mobile Layout

```
┌─────────────────────────────┐
│       OSCAR TRACKER         │
│     98th Academy Awards     │
├─────────────────────────────┤
│                             │
│  ◄ Best [Picture      ▼] ► │
│           ○                 │
│                             │
│  Mode: [Sarah's Picks  ▼]  │
│                             │
│ ┌─────────────────────────┐ │
│ │ 👁 Viewing Sarah's      │ │
│ │    predictions     [×]  │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ ★  Sinners         MAX  │ │
│ │    Warner Bros.         │ │
│ ├─────────────────────────┤ │
│ │ ☆  Bugonia              │ │
│ │    Focus Features       │ │
│ ├─────────────────────────┤ │
│ │ ☆  F1               🍎  │ │
│ │    Apple Original       │ │
│ └─────────────────────────┘ │
│                             │
│ ◄ Best [Picture      ▼] ► │
│           ○                 │
│                             │
├─────────────────────────────┤
│ Tip: Switch modes to make  │
│      your own predictions   │
│                             │
│           About             │
│                             │
│ OSCAR® is a trademark...   │
│            🔄               │
└─────────────────────────────┘
```

### Share Flow Mock-up

```
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: User in Predictions Mode                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Mode: [ Predictions        ▼]              [SHARE]                 │
│                                              ↑                      │
│                                         Share button                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ★  Sinners (selected)                                      │   │
│  │  ☆  Bugonia                                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: Name Prompt                                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │   Share your predictions                                    │   │
│  │                                                             │   │
│  │   Your name: [Sarah____________]                            │   │
│  │                                                             │   │
│  │              [Cancel]  [Copy Link]                          │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: Success Toast                                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ✓ Link copied! Share it with your friends.                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  URL in clipboard:                                                  │
│  https://awardstracker.app/?p=8--------------------&name=Sarah      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Share Button States

```
┌───────────────────────────────────────────────────────────────┐
│  SHARE BUTTON STATES                                          │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Disabled (no predictions):                                   │
│  ┌─────────────┐                                              │
│  │   SHARE     │  ← grayed out, cursor: not-allowed          │
│  └─────────────┘                                              │
│                                                               │
│  Enabled (has predictions):                                   │
│  ┌─────────────┐                                              │
│  │   SHARE     │  ← gold border, hover highlight             │
│  └─────────────┘                                              │
│                                                               │
│  Hidden (watched or shared mode):                             │
│  (button not rendered)                                        │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Shared Banner Design

```
┌───────────────────────────────────────────────────────────────┐
│  SHARED BANNER VARIANTS                                       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Default (dismissible):                                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  👁 Viewing Sarah's predictions (read-only)        [×]  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  After dismiss (compact):                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  👁 Sarah's Picks                                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  Empty shared (no predictions):                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Sarah hasn't made any predictions yet!                 │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## CSS for Shared Mode

```css
/* Read-only film items in shared mode */
.film.shared-view {
  cursor: default;
  pointer-events: none;
}

.film.shared-view .checkbox {
  opacity: 0.9;
}

/* Shared banner */
.shared-banner {
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid var(--color-gold);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--color-gold);
}

.shared-banner-icon {
  margin-right: 8px;
}

.shared-banner-close {
  background: none;
  border: none;
  color: var(--color-gold);
  cursor: pointer;
  padding: 4px;
}

/* Share button */
.share-btn {
  background: transparent;
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-btn:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.15);
}

.share-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Toast notification */
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-gold);
  color: var(--color-black);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  animation: toast-in 0.3s ease, toast-out 0.3s ease 2.7s;
  z-index: 1000;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes toast-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

