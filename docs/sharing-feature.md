# Sharing Predictions Feature

## Overview

Enable users to share their Oscar predictions with friends via URL. This is a client-side only feature with no server interaction.

## Requirements

### Core Functionality

1. **Share Button**: User can generate a shareable URL containing their predictions
2. **URL Encoding**: Predictions encoded as compact query parameters
3. **Name Parameter**: Sharer's name included in URL for attribution
4. **Read-Only Viewing**: Recipients view shared predictions without editing
5. **Separate Mode**: Shared predictions appear as new entries in the mode dropdown
6. **Persistence**: Incoming shared lists are saved to localStorage
7. **Multiple Lists**: Support viewing predictions from multiple friends
8. **Duplicate Handling**: Detect when same person shares updated predictions

### User Experience

#### Sharing Flow (Sender)
1. User makes predictions in "Predictions" mode
2. User clicks "Share" button (to the right of mode dropdown)
3. **Themed modal** opens with title "Share Your Picks!" asking for their name (optional, default "Friend")
4. User clicks "Share" button in modal
5. **Platform-specific behavior**:
   - **Mobile (Android/iOS)**: Uses native Web Share API to open OS share sheet
   - **Desktop (no Web Share API)**: Falls back to copying URL to clipboard
6. Success toast confirms action ("Link copied!" on desktop)
7. User shares URL via native share options or pastes copied link

**Web Share API**:
- Available on Android Chrome, iOS Safari, and some desktop browsers
- Detected via `navigator.share` availability
- Provides native share experience with all installed apps (Messages, WhatsApp, Email, etc.)
- Falls back gracefully to clipboard copy when unavailable

**Share Button State**:
- **Disabled** (grayed out): When no predictions have been made
- **Enabled** (gold): When at least one prediction exists
- **Hidden**: When not in "Predictions" mode

#### Viewing Flow (Recipient)
1. Recipient opens shared URL
2. App detects `?p=` and `&name=` parameters
3. App checks if this person's predictions already exist in localStorage:
   - **New person**: Save to localStorage, add to dropdown
   - **Same person, same predictions**: Load existing (no action needed)
   - **Same person, different predictions**: Show duplicate modal (see below)
4. Mode dropdown shows new option: "[Name]'s Picks"
5. App automatically switches to this view mode
6. Predictions displayed read-only (no click interaction)
7. User can switch to their own modes or other shared lists anytime

#### Duplicate Handling Flow
When receiving updated predictions from someone already in the list:

1. Modal appears: "You already have Sarah's predictions saved"
2. Options:
   - **Update**: Replace existing with new predictions
   - **Keep Both**: Save as "Sarah (2)" or similar
   - **Cancel**: Ignore incoming, keep existing

### Mode Dropdown States

**Without shared lists:**
```
[ Watched        ▼]  [SHARE]
  Watched
  Predictions
```

**With one shared list:**
```
[ Sarah's Picks  ▼]  [SHARE]
  Watched
  Predictions
  ──────────────
  Sarah's Picks    ← read-only
```

**With multiple shared lists:**
```
[ Watched        ▼]  [SHARE]
  Watched
  Predictions
  ──────────────
  Sarah's Picks    ← read-only
  Mike's Picks     ← read-only
  Jordan's Picks   ← read-only
```

**Share button location**: Immediately to the right of the mode dropdown

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
// Encoding/Decoding
function encodePredictions(predictions) → string
function decodePredictions(encoded) → object
function generateShareURL(predictions, name) → string
function parseShareParams() → { predictions, name } | null

// Persistence
function loadSharedLists() → array
function saveSharedLists(lists) → void
function addSharedList(name, predictions) → { id, isDuplicate, existingId }
function removeSharedList(id) → void
function updateSharedList(id, predictions) → void

// Duplicate Detection
function findExistingByName(name) → sharedList | null
function normalizeName(name) → string  // lowercase, trimmed
function predictionsMatch(a, b) → boolean

// Validation
function hasAnyPredictions() → boolean
function isValidEncodedString(str) → boolean
```

### State Management

**New state variables:**
```javascript
let sharedLists = [];  // Array of { id: string, name: string, predictions: object }
let currentMode = 'watched';   // 'watched' | 'predictions' | 'shared:{id}'
```

**LocalStorage**:
- Key: `oscar-tracker-shared-lists`
- Format: Array of shared list objects
- Persisted across sessions

```javascript
// localStorage structure
{
  "oscar-tracker-shared-lists": [
    {
      "id": "sarah-1706123456789",  // name + timestamp for uniqueness
      "name": "Sarah",
      "predictions": { "best-picture": "sinners", ... },
      "receivedAt": "2026-01-25T10:30:00Z"
    },
    {
      "id": "mike-1706123456790",
      "name": "Mike",
      "predictions": { ... },
      "receivedAt": "2026-01-26T14:00:00Z"
    }
  ]
}
```

**Duplicate Detection**:
- Match by normalized name (case-insensitive, trimmed)
- Compare prediction strings to detect if content changed
- Same name + same predictions = no action needed
- Same name + different predictions = show duplicate modal

### UI Changes

1. **Share Button**: To the right of mode dropdown, visible only in Predictions mode
2. **Delete Button**: Replaces Share button when viewing a shared list (same position)
3. **Share Modal**: Themed modal matching app design (not browser prompt)
4. **Duplicate Modal**: Themed modal for overwrite/copy/cancel options
5. **Delete Confirmation Modal**: Themed modal confirming deletion of shared list
6. **Mode Dropdown**: Shows separator + all saved shared lists
7. **Read-Only Banner**: Dismissible banner showing whose predictions are displayed
8. **Copy Confirmation**: Toast notification when URL copied to clipboard

### Visual Treatment for Shared Mode

- Same gold star styling as predictions
- Disabled/muted click states (no hover effects)
- Optional banner: "Viewing [Name]'s predictions"
- Items not clickable (or clicks do nothing)

## Decisions Made

1. **Share button location**: ✅ To the right of mode dropdown
2. **Name prompt UX**: ✅ Themed modal (not browser prompt)
3. **Persistence**: ✅ Save shared lists to localStorage
4. **Multiple lists**: ✅ Support viewing predictions from multiple friends
5. **Duplicates**: ✅ Detect by name, prompt to overwrite/copy/cancel
6. **Share validation**: ✅ Disable share button when no predictions made
7. **Banner design**: ✅ Dismissible (with `[×]` button)
8. **Delete shared lists**: ✅ Delete button replaces Share button when viewing shared list
9. **Delete confirmation**: ✅ Themed confirmation modal before deletion
10. **Maximum lists**: ✅ No limit for now
11. **Name matching**: ✅ Case-insensitive (see Future Ideas for improvements)

## Future Ideas: Source Identification

Currently we match duplicates by name (case-insensitive). This has limitations:
- Two different people named "Sarah" would be treated as duplicates
- Someone could impersonate another person's name

**Potential future improvements:**

1. **Device fingerprint hash**
   - Generate a short hash from device characteristics (screen size, timezone, etc.)
   - Embed in URL: `?p=...&name=Sarah&src=a7b3`
   - Same name + different source = different people

2. **Random sender ID**
   - Generate random ID on first share, store in localStorage
   - Embed in URL: `?p=...&name=Sarah&id=x9k2m`
   - Persistent per-device, allows tracking updates from same source

3. **Prediction signature**
   - Hash the predictions + timestamp
   - Detect if exact same link is being re-shared vs. updated predictions

4. **QR code with embedded metadata**
   - For in-person sharing, encode additional verification data

**For now**: Simple name matching is sufficient for the friend-sharing use case.

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

describe('Persistence', () => {
  test('saves shared list to localStorage on first visit', async ({ page }) => {
    await page.goto('/?p=8--------------------&name=Sarah');

    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('oscar-tracker-shared-lists'))
    );

    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Sarah');
  });

  test('persists shared lists across page reloads', async ({ page }) => {
    // First visit with shared URL
    await page.goto('/?p=8--------------------&name=Sarah');

    // Reload without URL params
    await page.goto('/');

    // Sarah should still be in dropdown
    await expect(page.locator('#mode-select option')).toContainText("Sarah's Picks");
  });

  test('supports multiple shared lists from different people', async ({ page }) => {
    // Add first person
    await page.goto('/?p=8--------------------&name=Sarah');
    await page.goto('/');

    // Add second person
    await page.goto('/?p=0--------------------&name=Mike');
    await page.goto('/');

    // Both should be in dropdown
    const options = await page.locator('#mode-select option').allTextContents();
    expect(options).toContain("Sarah's Picks");
    expect(options).toContain("Mike's Picks");
  });

  test('loads correct predictions when switching between shared lists', async ({ page }) => {
    // Add Sarah's predictions (index 8 = Sinners)
    await page.goto('/?p=8--------------------&name=Sarah');
    await page.goto('/');

    // Add Mike's predictions (index 0 = Bugonia)
    await page.goto('/?p=0--------------------&name=Mike');
    await page.goto('/');

    // View Sarah's
    await page.selectOption('#mode-select', 'shared:sarah');
    const sarahFirst = page.locator('#films-list .film:nth-child(9)'); // Sinners is 9th
    await expect(sarahFirst).toHaveClass(/predicted/);

    // View Mike's
    await page.selectOption('#mode-select', 'shared:mike');
    const mikeFirst = page.locator('#films-list .film:first-child'); // Bugonia is 1st
    await expect(mikeFirst).toHaveClass(/predicted/);
  });
});

describe('Duplicate Handling', () => {
  test('shows duplicate modal when same person shares again with different predictions', async ({ page }) => {
    // First visit from Sarah
    await page.goto('/?p=8--------------------&name=Sarah');
    await page.goto('/');

    // Second visit from Sarah with different predictions
    await page.goto('/?p=0--------------------&name=Sarah');

    // Duplicate modal should appear
    await expect(page.locator('.duplicate-modal')).toBeVisible();
    await expect(page.locator('.duplicate-modal')).toContainText("Sarah's predictions");
  });

  test('duplicate modal Update replaces existing predictions', async ({ page }) => {
    // First visit - Sarah picks index 8
    await page.goto('/?p=8--------------------&name=Sarah');
    await page.goto('/');

    // Second visit - Sarah picks index 0
    await page.goto('/?p=0--------------------&name=Sarah');

    // Click Update
    await page.click('.duplicate-modal button:has-text("Update")');

    // View Sarah's - should show new prediction (index 0)
    await page.selectOption('#mode-select', 'shared:sarah');
    const firstFilm = page.locator('#films-list .film:first-child');
    await expect(firstFilm).toHaveClass(/predicted/);
  });

  test('duplicate modal Keep Both creates copy with numbered name', async ({ page }) => {
    // First visit from Sarah
    await page.goto('/?p=8--------------------&name=Sarah');
    await page.goto('/');

    // Second visit from Sarah
    await page.goto('/?p=0--------------------&name=Sarah');

    // Click Keep Both
    await page.click('.duplicate-modal button:has-text("Keep Both")');

    // Should have both versions
    const options = await page.locator('#mode-select option').allTextContents();
    expect(options).toContain("Sarah's Picks");
    expect(options).toContain("Sarah (2)'s Picks");
  });

  test('duplicate modal Cancel ignores incoming predictions', async ({ page }) => {
    // First visit - Sarah picks index 8
    await page.goto('/?p=8--------------------&name=Sarah');
    await page.goto('/');

    // Second visit - Sarah picks index 0
    await page.goto('/?p=0--------------------&name=Sarah');

    // Click Cancel
    await page.click('.duplicate-modal button:has-text("Cancel")');

    // Sarah's predictions should still be index 8
    await page.selectOption('#mode-select', 'shared:sarah');
    const ninthFilm = page.locator('#films-list .film:nth-child(9)');
    await expect(ninthFilm).toHaveClass(/predicted/);
  });

  test('does not show duplicate modal when predictions are identical', async ({ page }) => {
    // First visit from Sarah
    await page.goto('/?p=8--------------------&name=Sarah');
    await page.goto('/');

    // Second visit with identical predictions
    await page.goto('/?p=8--------------------&name=Sarah');

    // No modal should appear
    await expect(page.locator('.duplicate-modal')).not.toBeVisible();
  });

  test('name matching is case-insensitive', async ({ page }) => {
    // First visit from "Sarah"
    await page.goto('/?p=8--------------------&name=Sarah');
    await page.goto('/');

    // Second visit from "sarah" (lowercase)
    await page.goto('/?p=0--------------------&name=sarah');

    // Should show duplicate modal (same person)
    await expect(page.locator('.duplicate-modal')).toBeVisible();
  });

  test('name matching trims whitespace', async ({ page }) => {
    // First visit from "Sarah"
    await page.goto('/?p=8--------------------&name=Sarah');
    await page.goto('/');

    // Second visit with trailing space
    await page.goto('/?p=0--------------------&name=Sarah%20');

    // Should show duplicate modal (same person)
    await expect(page.locator('.duplicate-modal')).toBeVisible();
  });
});

describe('Removing Shared Lists', () => {
  test('delete button appears when viewing shared list', async ({ page }) => {
    await page.goto('/?p=8--------------------&name=Sarah');

    // Should show delete button instead of share button
    await expect(page.locator('#delete-btn')).toBeVisible();
    await expect(page.locator('#share-btn')).not.toBeVisible();
  });

  test('delete button not visible in predictions mode', async ({ page }) => {
    await page.goto('/?p=8--------------------&name=Sarah');
    await page.goto('/');

    // Switch to predictions mode
    await page.selectOption('#mode-select', 'predictions');

    // Should show share button, not delete
    await expect(page.locator('#share-btn')).toBeVisible();
    await expect(page.locator('#delete-btn')).not.toBeVisible();
  });

  test('clicking delete shows confirmation modal', async ({ page }) => {
    await page.goto('/?p=8--------------------&name=Sarah');

    await page.click('#delete-btn');

    await expect(page.locator('.delete-modal')).toBeVisible();
    await expect(page.locator('.delete-modal')).toContainText("Sarah's predictions");
    await expect(page.locator('.delete-modal')).toContainText('Are you sure');
  });

  test('cancel in delete modal keeps list', async ({ page }) => {
    await page.goto('/?p=8--------------------&name=Sarah');

    await page.click('#delete-btn');
    await page.click('.delete-modal button:has-text("Cancel")');

    // Modal should close
    await expect(page.locator('.delete-modal')).not.toBeVisible();

    // List should still exist
    const options = await page.locator('#mode-select option').allTextContents();
    expect(options).toContain("Sarah's Picks");
  });

  test('confirm delete removes list and switches mode', async ({ page }) => {
    await page.goto('/?p=8--------------------&name=Sarah');

    await page.click('#delete-btn');
    await page.click('.delete-modal button:has-text("Remove")');

    // Should switch to watched mode
    await expect(page.locator('#mode-select')).toHaveValue('watched');

    // Sarah should no longer be in dropdown
    const options = await page.locator('#mode-select option').allTextContents();
    expect(options).not.toContain("Sarah's Picks");
  });

  test('deleting removes from localStorage', async ({ page }) => {
    await page.goto('/?p=8--------------------&name=Sarah');

    await page.click('#delete-btn');
    await page.click('.delete-modal button:has-text("Remove")');

    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('oscar-tracker-shared-lists'))
    );

    expect(stored).toHaveLength(0);
  });

  test('deleting one list preserves others', async ({ page }) => {
    // Add two lists
    await page.goto('/?p=8--------------------&name=Sarah');
    await page.goto('/?p=0--------------------&name=Mike');

    // Delete Mike's
    await page.click('#delete-btn');
    await page.click('.delete-modal button:has-text("Remove")');

    // Sarah should still exist
    const options = await page.locator('#mode-select option').allTextContents();
    expect(options).toContain("Sarah's Picks");
    expect(options).not.toContain("Mike's Picks");
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
│  Mode: [ Predictions        ▼] [SHARE]     ← button right of dropdown│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ★  Sinners (selected)                                      │   │
│  │  ☆  Bugonia                                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: Share Modal (themed to match app)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                         [×] │   │
│  │                  Share Your Picks!                          │   │
│  │                                                             │   │
│  │   Your friends will see your predictions for                │   │
│  │   all 21 categories.                                        │   │
│  │                                                             │   │
│  │   Your name                                                 │   │
│  │   ┌───────────────────────────────────────────────────┐    │   │
│  │   │ Sarah                                             │    │   │
│  │   └───────────────────────────────────────────────────┘    │   │
│  │                                                             │   │
│  │   ┌─────────────────┐  ┌────────────────────────────┐     │   │
│  │   │     Cancel      │  │   📤 Share                 │     │   │
│  │   └─────────────────┘  └────────────────────────────┘     │   │
│  │        (gray)               (gold, primary action)          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   Modal style: Dark background (#1a1a1a), gold accents,            │
│   rounded corners, matches About modal design                       │
│                                                                     │
│   Share button behavior:                                            │
│   - Mobile: Opens native OS share sheet (Web Share API)            │
│   - Desktop: Copies URL to clipboard (fallback)                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: Result                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  MOBILE (Web Share API available):                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Native OS share sheet appears with options:                 │   │
│  │  - Messages, WhatsApp, Email, Copy Link, etc.               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  DESKTOP (Clipboard fallback):                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ✓ Link copied! Share it with your friends.                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  URL format:                                                        │
│  https://oscartracker.app/?p=8--------------------&name=Sarah       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Duplicate Modal Mock-up

```
┌─────────────────────────────────────────────────────────────────────┐
│  When user opens URL from someone already in their saved lists      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                         [×] │   │
│  │                   Updated Predictions                       │   │
│  │                                                             │   │
│  │   You already have Sarah's predictions saved.               │   │
│  │   These new predictions are different.                      │   │
│  │                                                             │   │
│  │   What would you like to do?                                │   │
│  │                                                             │   │
│  │   ┌─────────────────────────────────────────────────────┐  │   │
│  │   │  🔄  Update                                         │  │   │
│  │   │      Replace saved predictions with new ones        │  │   │
│  │   └─────────────────────────────────────────────────────┘  │   │
│  │                                                             │   │
│  │   ┌─────────────────────────────────────────────────────┐  │   │
│  │   │  📋  Keep Both                                      │  │   │
│  │   │      Save as "Sarah (2)"                            │  │   │
│  │   └─────────────────────────────────────────────────────┘  │   │
│  │                                                             │   │
│  │   ┌─────────────────────────────────────────────────────┐  │   │
│  │   │  ✕   Cancel                                         │  │   │
│  │   │      Ignore and keep existing predictions           │  │   │
│  │   └─────────────────────────────────────────────────────┘  │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Share/Delete Button States

```
┌───────────────────────────────────────────────────────────────┐
│  BUTTON STATES (right of mode dropdown)                       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  PREDICTIONS MODE:                                            │
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
│  SHARED LIST MODE (viewing someone else's picks):             │
│  ┌─────────────┐                                              │
│  │   DELETE    │  ← red/danger style, removes this list      │
│  └─────────────┘                                              │
│                                                               │
│  WATCHED MODE:                                                │
│  (no button shown)                                            │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Delete Confirmation Modal

```
┌─────────────────────────────────────────────────────────────────────┐
│  When user clicks Delete button while viewing a shared list         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                         [×] │   │
│  │                    Remove Shared List                       │   │
│  │                                                             │   │
│  │   Are you sure you want to remove Sarah's predictions?      │   │
│  │                                                             │   │
│  │   This will delete them from your saved lists.              │   │
│  │   You can always add them back by opening the               │   │
│  │   shared link again.                                        │   │
│  │                                                             │   │
│  │   ┌─────────────────┐  ┌────────────────────────────┐     │   │
│  │   │     Cancel      │  │   🗑 Remove                │     │   │
│  │   └─────────────────┘  └────────────────────────────┘     │   │
│  │        (gray)               (red/danger style)              │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
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

/* Delete button (replaces share button in shared view mode) */
.delete-btn {
  background: transparent;
  border: 1px solid var(--color-danger, #dc3545);
  color: var(--color-danger, #dc3545);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: rgba(220, 53, 69, 0.15);
}

/* Delete confirmation modal */
.delete-modal .modal-content {
  text-align: center;
}

.delete-modal .btn-danger {
  background: var(--color-danger, #dc3545);
  border: none;
  color: white;
}

.delete-modal .btn-danger:hover {
  background: #c82333;
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

