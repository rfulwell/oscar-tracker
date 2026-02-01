# Favorites List Feature

## Overview

Add a "Favorites" mode that sits between Watched and Predictions in the mode dropdown. Favorites allow users to mark their personal favorite nominees in each category, separate from their predictions of who will win. Styled with heart icons to distinguish from predictions (stars) and watched (checkmarks).

## Requirements

### Core Functionality

1. **New Mode**: "Favorites" appears in mode dropdown between Watched and Predictions
2. **Heart Icons**: Uses heart (♡/♥) instead of star or checkmark
3. **Single-Select**: Like predictions, only one favorite per category
4. **Persistence**: Stored separately in localStorage
5. **Cross-Population**: Offer to copy from predictions/favorites when first entering each mode

### Mode Dropdown Order

```
[ Watched        ▼]
  Watched           ✓ (checkmark icons)
  Favorites         ♥ (heart icons)
  Predictions       ★ (star icons)
  ──────────────
  Sarah's Picks     (shared lists)
```

### User Experience

#### First Time Entering Favorites (with existing Predictions)

1. User has made some predictions
2. User switches to "Favorites" mode for the first time
3. Modal appears: "Start with your predictions?"
4. Options:
   - **Yes**: Copy all predictions to favorites as starting point
   - **No**: Start with empty favorites
5. User can then modify favorites independently

#### First Time Entering Predictions (with existing Favorites)

1. User has marked some favorites
2. User switches to "Predictions" mode for the first time
3. Modal appears: "Start with your favorites?"
4. Options:
   - **Yes**: Copy all favorites to predictions as starting point
   - **No**: Start with empty predictions
5. User can then modify predictions independently

#### Subsequent Visits

- No modal shown after initial setup
- Each list is independent
- Changes to favorites don't affect predictions and vice versa

### Visual Design

#### Heart Icons

```
Empty heart (unselected):  ♡  (outline only)
Filled heart (selected):   ♥  (solid fill)
```

#### Color Scheme

- Use a warm pink/red accent for favorites: `#e91e63` (Material Pink 500)
- Or keep gold but with heart shape for consistency
- **Recommendation**: Use gold hearts to maintain brand consistency

#### Film Card States

```
┌─────────────────────────────────────────────────────────────┐
│  FAVORITES MODE                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Unselected:                                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ♡  Sinners                                    MAX  │    │
│  │     Warner Bros.                                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  Selected (favorited):                                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ♥  Sinners                                    MAX  │    │
│  │     Warner Bros.                                    │    │
│  └─────────────────────────────────────────────────────┘    │
│       ↑ Gold background highlight, filled heart              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Copy Modal Design

```
┌─────────────────────────────────────────────────────────────┐
│                                                         [×] │
│                                                              │
│              Start with your predictions?                    │
│                                                              │
│     You have predictions in 12 categories.                   │
│     Would you like to use them as your favorites?            │
│                                                              │
│     ┌─────────────────┐    ┌─────────────────┐              │
│     │       No        │    │      Yes        │              │
│     └─────────────────┘    └─────────────────┘              │
│          (gray)                 (gold)                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│                                                         [×] │
│                                                              │
│               Start with your favorites?                     │
│                                                              │
│     You have favorites in 8 categories.                      │
│     Would you like to use them as your predictions?          │
│                                                              │
│     ┌─────────────────┐    ┌─────────────────┐              │
│     │       No        │    │      Yes        │              │
│     └─────────────────┘    └─────────────────┘              │
│          (gray)                 (gold)                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Technical Design

### State Management

**New state variables:**
```javascript
let favorites = {};  // { categoryId: nomineeId }
let hasDismissedFavoritesCopy = false;  // Track if user has seen the copy modal
let hasDismissedPredictionsCopy = false;
```

**LocalStorage keys:**
```javascript
const FAVORITES_KEY = 'oscar-tracker-favorites';
const FAVORITES_COPY_DISMISSED_KEY = 'oscar-tracker-favorites-copy-dismissed';
const PREDICTIONS_COPY_DISMISSED_KEY = 'oscar-tracker-predictions-copy-dismissed';
```

### Functions to Implement

```javascript
// Favorites persistence
function loadFavorites() → object
function saveFavorites() → void
function toggleFavorite(categoryId, nomineeId) → void

// Copy modal logic
function shouldShowCopyToFavoritesModal() → boolean
function shouldShowCopyToPredictionsModal() → boolean
function copyPredictionsToFavorites() → void
function copyFavoritesToPredictions() → void
function dismissCopyModal(target) → void  // target: 'favorites' | 'predictions'

// UI updates
function renderFavoritesMode() → void
function updateFavoritesProgress() → void

// Counting helpers
function countFavorites() → number
function countPredictions() → number
```

### Mode Values

```javascript
// Current modes
'watched'     // Checkmark icons, multi-select
'predictions' // Star icons, single-select
'shared:{id}' // Star icons, read-only

// New mode
'favorites'   // Heart icons, single-select
```

### HTML Changes

#### Mode Dropdown Option
```html
<select id="mode-select">
    <option value="watched">Watched</option>
    <option value="favorites">Favorites</option>
    <option value="predictions">Predictions</option>
    <!-- shared lists dynamically added -->
</select>
```

#### Copy Modal
```html
<div id="copy-modal" class="modal" hidden aria-modal="true" aria-labelledby="copy-title">
    <div class="modal-backdrop"></div>
    <div class="modal-content modal-content-copy">
        <button class="modal-close" id="copy-close" aria-label="Close">&times;</button>

        <h2 id="copy-title">Start with your predictions?</h2>
        <p class="modal-description" id="copy-description">
            You have predictions in <strong id="copy-count">0</strong> categories.
            Would you like to use them as your favorites?
        </p>

        <div class="modal-actions">
            <button class="btn btn-secondary" id="copy-no">No</button>
            <button class="btn btn-primary" id="copy-yes">Yes</button>
        </div>
    </div>
</div>
```

#### Heart Icon SVG
```html
<!-- Empty heart -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
</svg>

<!-- Filled heart -->
<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
</svg>
```

### CSS Additions

```css
/* Favorites mode styling */
.film.favorited {
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%);
    border-color: var(--color-gold);
}

.film.favorited .film-title {
    color: var(--color-gold-light);
}

.film.favorited .checkbox {
    background: var(--color-gold);
    border-color: var(--color-gold);
}

/* Heart icon in checkbox */
.checkbox .heart-icon {
    width: 14px;
    height: 14px;
    color: var(--color-black);
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.2s ease;
}

.film.favorited .checkbox .heart-icon {
    opacity: 1;
    transform: scale(1);
}
```

### Progress Display

When in Favorites mode, show progress like predictions:
```
♥ 12 of 21
```

## Decisions

1. **Icon style**: Gold hearts (consistent with brand, distinguishes via shape)
2. **Dropdown order**: Watched → Favorites → Predictions (chronological user journey)
3. **Copy modal**: Simple Yes/No (no "Don't ask again" checkbox needed)
4. **Data independence**: Once created, lists are fully separate
5. **Modal trigger**: Only on first entry to each mode when other list has data
6. **Dismissal persistence**: Remember if user said No, don't ask again

## Implementation Phases

### Phase 1: Core Favorites Mode
- [ ] Add favorites option to mode dropdown
- [ ] Implement favorites state management (load/save)
- [ ] Add heart icon SVG
- [ ] Implement single-select toggle behavior
- [ ] Add progress display for favorites
- [ ] Style favorited film cards

### Phase 2: Copy Modal
- [ ] Add copy modal HTML
- [ ] Implement modal show/hide logic
- [ ] Track dismissal state in localStorage
- [ ] Implement copy functions (predictions→favorites, favorites→predictions)
- [ ] Wire up Yes/No buttons

### Phase 3: Polish
- [ ] Ensure proper transitions between modes
- [ ] Test edge cases (empty lists, full lists)
- [ ] Verify localStorage persistence
- [ ] Accessibility review

## Test Plan

### Unit Tests

```javascript
describe('Favorites State Management', () => {
    test('loadFavorites returns empty object when no data', () => {
        localStorage.clear();
        expect(loadFavorites()).toEqual({});
    });

    test('saveFavorites persists to localStorage', () => {
        favorites = { 'best-picture': 'sinners' };
        saveFavorites();
        const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY));
        expect(stored['best-picture']).toBe('sinners');
    });

    test('toggleFavorite adds new favorite', () => {
        favorites = {};
        toggleFavorite('best-picture', 'sinners');
        expect(favorites['best-picture']).toBe('sinners');
    });

    test('toggleFavorite removes existing favorite when same nominee clicked', () => {
        favorites = { 'best-picture': 'sinners' };
        toggleFavorite('best-picture', 'sinners');
        expect(favorites['best-picture']).toBeUndefined();
    });

    test('toggleFavorite replaces favorite when different nominee clicked', () => {
        favorites = { 'best-picture': 'sinners' };
        toggleFavorite('best-picture', 'anora');
        expect(favorites['best-picture']).toBe('anora');
    });

    test('countFavorites returns correct count', () => {
        favorites = {
            'best-picture': 'sinners',
            'best-director': 'dir-coogler'
        };
        expect(countFavorites()).toBe(2);
    });
});

describe('Copy Modal Logic', () => {
    test('shouldShowCopyToFavoritesModal returns true when predictions exist and modal not dismissed', () => {
        predictions = { 'best-picture': 'sinners' };
        favorites = {};
        hasDismissedFavoritesCopy = false;
        expect(shouldShowCopyToFavoritesModal()).toBe(true);
    });

    test('shouldShowCopyToFavoritesModal returns false when no predictions', () => {
        predictions = {};
        favorites = {};
        hasDismissedFavoritesCopy = false;
        expect(shouldShowCopyToFavoritesModal()).toBe(false);
    });

    test('shouldShowCopyToFavoritesModal returns false when already dismissed', () => {
        predictions = { 'best-picture': 'sinners' };
        favorites = {};
        hasDismissedFavoritesCopy = true;
        expect(shouldShowCopyToFavoritesModal()).toBe(false);
    });

    test('shouldShowCopyToFavoritesModal returns false when favorites already exist', () => {
        predictions = { 'best-picture': 'sinners' };
        favorites = { 'best-director': 'dir-coogler' };
        hasDismissedFavoritesCopy = false;
        expect(shouldShowCopyToFavoritesModal()).toBe(false);
    });

    test('copyPredictionsToFavorites copies all predictions', () => {
        predictions = {
            'best-picture': 'sinners',
            'best-director': 'dir-coogler'
        };
        favorites = {};
        copyPredictionsToFavorites();
        expect(favorites).toEqual(predictions);
    });

    test('copyFavoritesToPredictions copies all favorites', () => {
        favorites = {
            'best-picture': 'sinners',
            'best-actor': 'actor-chalamet'
        };
        predictions = {};
        copyFavoritesToPredictions();
        expect(predictions).toEqual(favorites);
    });
});
```

### E2E Tests (Playwright)

```javascript
// tests/favorites.spec.js

describe('Favorites Mode', () => {

    describe('Mode Switching', () => {

        test('should show favorites option in mode dropdown', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            const modeSelect = page.locator('#mode-select');
            const options = await modeSelect.locator('option').allTextContents();

            expect(options).toContain('Favorites');
        });

        test('should switch to favorites mode via dropdown', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            await page.locator('#mode-select').selectOption('favorites');

            await expect(page.locator('#mode-select')).toHaveValue('favorites');
        });

        test('favorites should appear between watched and predictions', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            const options = await page.locator('#mode-select option').allTextContents();
            const watchedIndex = options.indexOf('Watched');
            const favoritesIndex = options.indexOf('Favorites');
            const predictionsIndex = options.indexOf('Predictions');

            expect(favoritesIndex).toBeGreaterThan(watchedIndex);
            expect(favoritesIndex).toBeLessThan(predictionsIndex);
        });

        test('should show heart icons in favorites mode', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            await page.locator('#mode-select').selectOption('favorites');

            // Check for heart icon in first film
            const heartIcon = page.locator('#films-list .film:first-child .heart-icon');
            await expect(heartIcon).toBeVisible();
        });

        test('should persist favorites mode across page reload', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            await page.locator('#mode-select').selectOption('favorites');
            await page.reload();

            await expect(page.locator('#mode-select')).toHaveValue('favorites');
        });

    });

    describe('Single-Select Behavior', () => {

        test('should select a favorite when clicked', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('favorites');

            await page.locator('#films-list .film:first-child').click();

            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/favorited/);
        });

        test('should deselect when clicking the same nominee again', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('favorites');

            const film = page.locator('#films-list .film:first-child');
            await film.click();
            await expect(film).toHaveClass(/favorited/);

            await film.click();
            await expect(film).not.toHaveClass(/favorited/);
        });

        test('should only allow one favorite per category', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('favorites');

            // Select first film
            await page.locator('#films-list .film:first-child').click();
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/favorited/);

            // Select second film
            await page.locator('#films-list .film:nth-child(2)').click();

            // First should be deselected, second selected
            await expect(page.locator('#films-list .film:first-child')).not.toHaveClass(/favorited/);
            await expect(page.locator('#films-list .film:nth-child(2)')).toHaveClass(/favorited/);
        });

    });

    describe('Persistence', () => {

        test('should persist favorites across page reload', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('favorites');

            // Make a favorite
            await page.locator('#films-list .film:first-child').click();

            // Reload
            await page.reload();

            // Should still be favorited
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/favorited/);
        });

        test('should store favorites separately from predictions', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Make a prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Make a different favorite
            await page.locator('#mode-select').selectOption('favorites');
            // Dismiss copy modal if shown
            const copyModal = page.locator('#copy-modal');
            if (await copyModal.isVisible()) {
                await page.locator('#copy-no').click();
            }
            await page.locator('#films-list .film:nth-child(2)').click();

            // Verify prediction is still first film
            await page.locator('#mode-select').selectOption('predictions');
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/predicted/);
            await expect(page.locator('#films-list .film:nth-child(2)')).not.toHaveClass(/predicted/);

            // Verify favorite is second film
            await page.locator('#mode-select').selectOption('favorites');
            await expect(page.locator('#films-list .film:first-child')).not.toHaveClass(/favorited/);
            await expect(page.locator('#films-list .film:nth-child(2)')).toHaveClass(/favorited/);
        });

    });

    describe('Progress Display', () => {

        test('should show favorites progress count', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);
            await page.locator('#mode-select').selectOption('favorites');

            // Dismiss copy modal if shown
            const copyModal = page.locator('#copy-modal');
            if (await copyModal.isVisible()) {
                await page.locator('#copy-no').click();
            }

            // Make a favorite
            await page.locator('#films-list .film:first-child').click();

            // Check progress shows 1 of 21
            await expect(page.locator('.progress')).toContainText('1 of 21');
        });

    });

});

describe('Copy Modal', () => {

    describe('Favorites from Predictions', () => {

        test('should show copy modal when entering favorites with existing predictions', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Make predictions first
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites
            await page.locator('#mode-select').selectOption('favorites');

            // Modal should appear
            await expect(page.locator('#copy-modal')).toBeVisible();
            await expect(page.locator('#copy-title')).toContainText('predictions');
        });

        test('should show correct count in copy modal', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Make 2 predictions in different categories
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();
            await page.locator('#next-category').click();
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites
            await page.locator('#mode-select').selectOption('favorites');

            // Modal should show count of 2
            await expect(page.locator('#copy-count')).toHaveText('2');
        });

        test('should copy predictions to favorites when clicking Yes', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Make prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites and accept copy
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#copy-yes').click();

            // First film should be favorited
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/favorited/);
        });

        test('should not copy predictions when clicking No', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Make prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites and decline copy
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#copy-no').click();

            // No film should be favorited
            await expect(page.locator('#films-list .film:first-child')).not.toHaveClass(/favorited/);
        });

        test('should not show modal again after dismissal', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Make prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites and decline
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#copy-no').click();

            // Switch away and back
            await page.locator('#mode-select').selectOption('watched');
            await page.locator('#mode-select').selectOption('favorites');

            // Modal should NOT appear
            await expect(page.locator('#copy-modal')).not.toBeVisible();
        });

        test('should not show modal when no predictions exist', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Switch to favorites without making predictions
            await page.locator('#mode-select').selectOption('favorites');

            // Modal should NOT appear
            await expect(page.locator('#copy-modal')).not.toBeVisible();
        });

    });

    describe('Predictions from Favorites', () => {

        test('should show copy modal when entering predictions with existing favorites', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Make favorites first (no modal since no predictions)
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#films-list .film:first-child').click();

            // Switch to predictions
            await page.locator('#mode-select').selectOption('predictions');

            // Modal should appear
            await expect(page.locator('#copy-modal')).toBeVisible();
            await expect(page.locator('#copy-title')).toContainText('favorites');
        });

        test('should copy favorites to predictions when clicking Yes', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Make favorite
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#films-list .film:first-child').click();

            // Switch to predictions and accept copy
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#copy-yes').click();

            // First film should be predicted
            await expect(page.locator('#films-list .film:first-child')).toHaveClass(/predicted/);
        });

        test('should not copy favorites when clicking No', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Make favorite
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#films-list .film:first-child').click();

            // Switch to predictions and decline copy
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#copy-no').click();

            // No film should be predicted
            await expect(page.locator('#films-list .film:first-child')).not.toHaveClass(/predicted/);
        });

    });

    describe('Edge Cases', () => {

        test('should not show modal when favorites already have selections', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Make prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Make favorite (decline copy)
            await page.locator('#mode-select').selectOption('favorites');
            await page.locator('#copy-no').click();
            await page.locator('#films-list .film:nth-child(2)').click();

            // Make another prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#next-category').click();
            await page.locator('#films-list .film:first-child').click();

            // Go back to favorites - should NOT show modal (favorites already has data)
            await page.locator('#mode-select').selectOption('favorites');
            await expect(page.locator('#copy-modal')).not.toBeVisible();
        });

        test('should close modal on X button click', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Make prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites
            await page.locator('#mode-select').selectOption('favorites');
            await expect(page.locator('#copy-modal')).toBeVisible();

            // Close via X button
            await page.locator('#copy-close').click();

            // Modal should close, no copy should happen
            await expect(page.locator('#copy-modal')).not.toBeVisible();
            await expect(page.locator('#films-list .film:first-child')).not.toHaveClass(/favorited/);
        });

        test('should close modal on backdrop click', async ({ page }) => {
            await page.goto('/');
            await completeOnboarding(page);

            // Make prediction
            await page.locator('#mode-select').selectOption('predictions');
            await page.locator('#films-list .film:first-child').click();

            // Switch to favorites
            await page.locator('#mode-select').selectOption('favorites');
            await expect(page.locator('#copy-modal')).toBeVisible();

            // Close via backdrop click
            await page.locator('#copy-modal .modal-backdrop').click();

            // Modal should close
            await expect(page.locator('#copy-modal')).not.toBeVisible();
        });

    });

});

describe('Sharing with Favorites', () => {

    test('should not include favorites in share URL (only predictions)', async ({ page }) => {
        await page.goto('/');
        await completeOnboarding(page);

        // Make different favorites and predictions
        await page.locator('#mode-select').selectOption('favorites');
        await page.locator('#films-list .film:nth-child(2)').click();

        await page.locator('#mode-select').selectOption('predictions');
        const copyModal = page.locator('#copy-modal');
        if (await copyModal.isVisible()) {
            await page.locator('#copy-no').click();
        }
        await page.locator('#films-list .film:first-child').click();

        // Share should only include predictions
        // (Implementation would verify URL contains prediction index, not favorite)
    });

    test('should hide share button in favorites mode', async ({ page }) => {
        await page.goto('/');
        await completeOnboarding(page);

        await page.locator('#mode-select').selectOption('favorites');
        const copyModal = page.locator('#copy-modal');
        if (await copyModal.isVisible()) {
            await page.locator('#copy-no').click();
        }

        // Share button should not be visible in favorites mode
        await expect(page.locator('#share-btn')).not.toBeVisible();
    });

});
```

## Out of Scope

- Sharing favorites (only predictions can be shared)
- Favorites for shared lists (read-only, no favorites)
- Multiple favorites per category (keep single-select like predictions)
- Syncing favorites with predictions automatically after initial copy

## Future Considerations

- Could add ability to compare favorites vs predictions ("You picked X as favorite but Y as prediction")
- Could show favorites icon next to predictions when they differ
- Could add favorites count to About modal stats
