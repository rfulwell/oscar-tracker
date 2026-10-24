# Search Feature

## Overview

Add a search capability that lets users find specific films and see every category where they're nominated. Users can trigger search by tapping a film in the streamable list, or by using a search bar accessible from any mode. The results page shows all matching categories with the user's current selections, or a friendly empty state when no results are found.

## Requirements

### Core Functionality

1. **Search Input**: A search bar that filters films by title as the user types
2. **Film Tap from Streamable**: Tapping a film in the streamable list opens search results for that film
3. **Results Page**: Shows every category where the searched film has a nomination
4. **Empty State**: Friendly message when no results are found
5. **Navigation**: Tap a category result to jump directly to that category in the current mode

### Entry Points

```
1. Streamable list → Tap film → Search results for that film
2. Any mode → Search icon in header → Search input → Type to filter → Tap result
```

### Search Results Page

For a matched film, show a flat list of every category it appears in, with the nominee's role/subtitle in that category and the user's current selection state (watched, predicted, favorited).

### Empty State

When a search query matches no films, show a centered message:

```
🎬
No nominations found
Better luck next year!
```

## User Experience

### Tapping a Film in the Streamable List

1. User is in Streamable mode viewing the flat list
2. User taps on "Sinners"
3. Search results slide in, showing all 16 categories where Sinners is nominated
4. Each result row shows the category name, nominee subtitle (e.g., "Ryan Coogler" for Director), and the current mode's selection state
5. Tapping a category row navigates to that category in the previously active mode (Watched/Predictions/Favorites)

### Using the Search Bar

1. User taps the search icon (magnifying glass) in the header area
2. Search input appears with focus and keyboard open
3. User types "frank" → results filter to "Frankenstein"
4. User taps "Frankenstein" → results page shows all 9 categories
5. User taps "Best Picture" row → navigates to Best Picture category in current mode

### Search Results for a Film

```
┌─────────────────────────────────────────┐
│   ← Back         Sinners          ✕     │
├─────────────────────────────────────────┤
│                                         │
│   16 nominations                        │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  ✓  Best Picture                │    │
│  │     Warner Bros.                │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  ✓  Best Director               │    │
│  │     Ryan Coogler                │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │     Best Actor                  │    │
│  │     Michael B. Jordan           │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  ✓  Best Supporting Actor       │    │
│  │     Delroy Lindo                │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │     Best Original Screenplay    │    │
│  │     Ryan Coogler                │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  ✓  Best Cinematography         │    │
│  │     Autumn Durald Arkapaw       │    │
│  └─────────────────────────────────┘    │
│            ... more rows ...            │
│                                         │
│     🎵 "I Lied"                        │
│     Best Original Song                  │
│                                         │
│     Streaming on Max         [MAX icon] │
│                                         │
└─────────────────────────────────────────┘
```

### Search Input View

```
┌─────────────────────────────────────────┐
│   ← Back    [ Search films...    ]  ✕   │
├─────────────────────────────────────────┤
│                                         │
│   Matching films:                       │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Sinners                (16)    │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  Sentimental Value      (10)    │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  The Secret Agent        (4)    │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  Sirât                   (2)    │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │  The Smashing Machine    (1)    │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### Empty State

```
┌─────────────────────────────────────────┐
│   ← Back    [ xylophone         ]   ✕   │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│                                         │
│              🎬                         │
│                                         │
│       No nominations found              │
│       Better luck next year!            │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

## Technical Design

### Data Lookups

The app already has the data structures needed:

- `FILM_NOMINEES` maps `filmKey → [nomineeId, ...]`
- `NOMINEE_TO_FILM` maps `nomineeId → filmKey`
- `ALL_FILMS` has `{ key, title, nominations }` for every film
- `CATEGORIES` has the full nominee data per category

New helper function to find all categories for a film:

```javascript
function getFilmCategories(filmKey) {
    const nomineeIds = FILM_NOMINEES[filmKey];
    if (!nomineeIds) return [];

    return nomineeIds.map(nomineeId => {
        const category = CATEGORIES.find(cat =>
            cat.nominees.some(n => n.id === nomineeId)
        );
        if (!category) return null;

        const nominee = category.nominees.find(n => n.id === nomineeId);
        return {
            categoryId: category.id,
            categoryName: category.name,
            categoryIndex: CATEGORIES.indexOf(category),
            nomineeId: nominee.id,
            nomineeTitle: nominee.title,
            nomineeSubtitle: nominee.subtitle
        };
    }).filter(Boolean);
}
```

### Search Filtering

```javascript
function searchFilms(query) {
    const q = query.toLowerCase().trim();
    if (!q) return ALL_FILMS;

    return ALL_FILMS.filter(film =>
        film.title.toLowerCase().includes(q)
    );
}
```

### Selection State in Results

Each result row should reflect the user's state in the **current mode** before entering search:

```javascript
function getSelectionState(nomineeId) {
    if (currentMode === 'watched') {
        return watchedItems.has(nomineeId) ? 'watched' : null;
    } else if (currentMode === 'favorites') {
        const category = CATEGORIES.find(cat =>
            cat.nominees.some(n => n.id === nomineeId)
        );
        return category && favorites[category.id] === nomineeId ? 'favorited' : null;
    } else if (currentMode === 'predictions') {
        const category = CATEGORIES.find(cat =>
            cat.nominees.some(n => n.id === nomineeId)
        );
        return category && predictions[category.id] === nomineeId ? 'predicted' : null;
    }
    return null;
}
```

### State Management

```javascript
let searchActive = false;         // Whether search view is shown
let searchQuery = '';             // Current search text
let searchSourceMode = null;     // Mode to return to after search ('watched', 'favorites', etc.)
let searchSelectedFilm = null;   // Film key being viewed, or null for search input
```

No localStorage needed. Search is ephemeral.

### Functions to Implement

```javascript
// View management
function showSearch(filmKey)         // Open search results for a specific film (from streamable tap)
function showSearchInput()           // Open search input (from search icon tap)
function hideSearch()                // Close search, return to previous view
function renderSearchResults(filmKey)  // Render category list for a film
function renderSearchInput(query)      // Render matching films list
function renderEmptyState()            // Render "no results" message

// Helpers
function getFilmCategories(filmKey) → array   // All categories a film appears in
function searchFilms(query) → array           // Filter ALL_FILMS by title
function getSelectionState(nomineeId) → string|null  // Current mode's state for a nominee

// Navigation
function navigateFromSearch(categoryIndex)  // Jump to category, close search, restore mode
```

### UI Components

#### Search Icon (Header)

Add a magnifying glass icon button next to the mode dropdown:

```html
<button class="search-btn" id="search-btn" aria-label="Search films">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
</button>
```

#### Search View Container

Reuse the existing `#films-list` area or overlay a new container:

```html
<div id="search-view" class="search-view" style="display: none;">
    <div class="search-header">
        <button class="search-back" id="search-back" aria-label="Back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
        <input type="text" class="search-input" id="search-input"
               placeholder="Search films..." autocomplete="off">
        <button class="search-close" id="search-close" aria-label="Close">&times;</button>
    </div>

    <div class="search-film-header" id="search-film-header" style="display: none;">
        <!-- Shown when viewing a specific film's categories -->
    </div>

    <ul class="films search-results" id="search-results">
        <!-- Results rendered here -->
    </ul>

    <div class="search-empty" id="search-empty" style="display: none;">
        <div class="search-empty-icon">🎬</div>
        <div class="search-empty-title">No nominations found</div>
        <div class="search-empty-subtitle">Better luck next year!</div>
    </div>
</div>
```

### CSS Additions

```css
/* Search button in header */
.search-btn {
    background: none;
    border: none;
    color: var(--color-white-dim);
    cursor: pointer;
    padding: 4px;
    width: 24px;
    height: 24px;
    transition: color 0.2s;
}

.search-btn:hover {
    color: var(--color-gold);
}

/* Search view */
.search-view {
    position: relative;
}

.search-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-xs);
    margin-bottom: var(--spacing-sm);
}

.search-input {
    flex: 1;
    background: var(--color-black-light);
    border: 1px solid var(--color-black-lighter);
    border-radius: 8px;
    color: var(--color-white);
    font-family: var(--font-body);
    font-size: 0.9375rem;
    padding: 8px 12px;
    outline: none;
    transition: border-color 0.2s;
}

.search-input:focus {
    border-color: var(--color-gold);
}

.search-input::placeholder {
    color: var(--color-white-dimmer);
}

.search-back,
.search-close {
    background: none;
    border: none;
    color: var(--color-white-dim);
    cursor: pointer;
    padding: 4px;
}

/* Film header in results view */
.search-film-header {
    text-align: center;
    padding: var(--spacing-sm) var(--spacing-xs);
    margin-bottom: var(--spacing-sm);
}

.search-film-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-white);
}

.search-film-count {
    font-family: var(--font-body);
    font-size: 0.8125rem;
    color: var(--color-white-dim);
    margin-top: 2px;
}

.search-film-streaming {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
    font-family: var(--font-body);
    font-size: 0.8125rem;
    color: var(--color-white-dim);
}

/* Result rows */
.search-result {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-black-light);
    border: 1px solid var(--color-black-lighter);
    border-radius: 8px;
    margin-bottom: var(--spacing-xs);
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
}

.search-result:hover {
    background: var(--color-black-lighter);
    border-color: var(--color-gold-dark);
}

.search-result-state {
    width: 20px;
    flex-shrink: 0;
    text-align: center;
    color: var(--color-gold);
    font-size: 0.875rem;
}

.search-result-info {
    flex: 1;
}

.search-result-category {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 0.9375rem;
    color: var(--color-white);
}

.search-result-subtitle {
    font-family: var(--font-body);
    font-size: 0.8125rem;
    color: var(--color-white-dim);
}

.search-result-nominations {
    font-family: var(--font-body);
    font-size: 0.8125rem;
    color: var(--color-white-dimmer);
    flex-shrink: 0;
}

/* Empty state */
.search-empty {
    text-align: center;
    padding: var(--spacing-xl) var(--spacing-md);
}

.search-empty-icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-md);
}

.search-empty-title {
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-white);
    margin-bottom: var(--spacing-xs);
}

.search-empty-subtitle {
    font-family: var(--font-body);
    font-size: 0.875rem;
    color: var(--color-white-dim);
    font-style: italic;
}
```

### Streamable List Integration

Make films in the streamable list tappable (currently they are read-only). In streamable mode only, tapping a film opens the search results for that film instead of toggling selection:

```javascript
// In renderStreamableList(), add click handlers:
document.querySelectorAll('#films-list .film').forEach(el => {
    el.addEventListener('click', (e) => {
        const filmKey = el.dataset.film;
        if (filmKey) showSearch(filmKey);
    });
    el.style.cursor = 'pointer';
});
```

Update CSS to allow pointer events on streamable films:

```css
.film.streamable-view {
    cursor: pointer;  /* Changed from 'default' */
}
```

### Keyboard Support

- `Escape` closes the search view
- `Enter` in the search input selects the first matching film
- Arrow keys navigate through search results

### Accessibility

- Search input has `role="searchbox"` and `aria-label="Search Oscar-nominated films"`
- Results list has `role="list"` with `role="listitem"` on each row
- Film results have `aria-label` describing the category and selection state
- Focus management: focus moves to search input when opened, returns to trigger when closed

## Interaction with Existing Modes

| From Mode | Tap Search Result Row | Behavior |
|-----------|----------------------|----------|
| Watched | Tap "Best Picture" | Navigate to Best Picture in Watched mode |
| Favorites | Tap "Best Director" | Navigate to Best Director in Favorites mode |
| Predictions | Tap "Best Actor" | Navigate to Best Actor in Predictions mode |
| Streamable | Tap "Best Picture" | Navigate to Best Picture in Watched mode (default) |
| Shared | Tap "Best Director" | Navigate to Best Director in Shared mode |

When searching from Streamable mode, category navigation defaults to Watched mode since Streamable has no category view.

## Implementation Phases

### Phase 1: Search from Streamable

- [ ] Add click handlers to streamable list items
- [ ] Build search results view (film header + category list)
- [ ] Show selection state from watched list
- [ ] Navigate to category on row tap (switch to Watched mode)
- [ ] Add streaming info to film header
- [ ] Back button returns to streamable list

### Phase 2: Global Search Input

- [ ] Add search icon to header
- [ ] Build search input view with film filtering
- [ ] Show nomination count for each matching film
- [ ] Tap film to see its categories
- [ ] Empty state for no matches
- [ ] Debounce search input (150ms)

### Phase 3: Polish

- [ ] Keyboard navigation and shortcuts
- [ ] Focus management
- [ ] Smooth transitions (slide in/out)
- [ ] Accessibility audit
- [ ] Performance with rapid typing

## Test Plan

### E2E Tests (Playwright)

```javascript
describe('Search from Streamable', () => {

    test('tapping a film in streamable list opens search results', async ({ page }) => {
        await completeOnboarding(page);
        await switchToStreamable(page);

        await page.locator('#films-list .film', { hasText: 'Sinners' }).click();

        await expect(page.locator('#search-view')).toBeVisible();
        await expect(page.locator('.search-film-title')).toHaveText('Sinners');
    });

    test('search results show all categories for the film', async ({ page }) => {
        await completeOnboarding(page);
        await switchToStreamable(page);

        await page.locator('#films-list .film', { hasText: 'Sinners' }).click();

        const results = page.locator('.search-result');
        // Sinners has 16 nominations
        expect(await results.count()).toBe(16);
    });

    test('search results show category names', async ({ page }) => {
        await completeOnboarding(page);
        await switchToStreamable(page);

        await page.locator('#films-list .film', { hasText: 'F1' }).click();

        const categories = await page.locator('.search-result-category').allTextContents();
        expect(categories).toContain('Best Picture');
        expect(categories).toContain('Best Film Editing');
        expect(categories).toContain('Best Sound');
        expect(categories).toContain('Best Visual Effects');
    });

    test('search results reflect watched state', async ({ page }) => {
        await completeOnboarding(page);

        // Watch Sinners in Best Picture
        await page.locator('#mode-select').selectOption('watched');
        await page.locator('#films-list .film[data-id="sinners"]').click();

        // Open search from streamable
        await switchToStreamable(page);
        await page.locator('#films-list .film', { hasText: 'Sinners' }).click();

        // Best Picture row should show watched state
        const bestPicRow = page.locator('.search-result', { hasText: 'Best Picture' });
        await expect(bestPicRow.locator('.search-result-state')).toContainText('✓');
    });

    test('tapping a result row navigates to that category', async ({ page }) => {
        await completeOnboarding(page);
        await switchToStreamable(page);

        await page.locator('#films-list .film', { hasText: 'Sinners' }).click();
        await page.locator('.search-result', { hasText: 'Best Director' }).click();

        // Should be in Watched mode at Best Director category
        await expect(page.locator('#mode-select')).toHaveValue('watched');
        await expect(page.locator('#category-select')).toHaveValue(/1/);
        await expect(page.locator('#search-view')).toBeHidden();
    });

    test('back button returns to streamable list', async ({ page }) => {
        await completeOnboarding(page);
        await switchToStreamable(page);

        await page.locator('#films-list .film', { hasText: 'Sinners' }).click();
        await page.locator('#search-back').click();

        await expect(page.locator('#search-view')).toBeHidden();
        await expect(page.locator('#streamable-header')).toBeVisible();
    });

    test('shows streaming service info in results header', async ({ page }) => {
        await completeOnboarding(page);
        await switchToStreamable(page);

        await page.locator('#films-list .film', { hasText: 'Sinners' }).click();

        await expect(page.locator('.search-film-streaming')).toContainText('Max');
    });
});

describe('Search Input', () => {

    test('search icon opens search input', async ({ page }) => {
        await completeOnboarding(page);

        await page.locator('#search-btn').click();

        await expect(page.locator('#search-view')).toBeVisible();
        await expect(page.locator('#search-input')).toBeFocused();
    });

    test('typing filters films by title', async ({ page }) => {
        await completeOnboarding(page);
        await page.locator('#search-btn').click();

        await page.locator('#search-input').fill('frank');

        const results = page.locator('.search-result');
        expect(await results.count()).toBe(1);
        await expect(results.first()).toContainText('Frankenstein');
    });

    test('partial match works case-insensitively', async ({ page }) => {
        await completeOnboarding(page);
        await page.locator('#search-btn').click();

        await page.locator('#search-input').fill('SIN');

        const results = page.locator('.search-result');
        expect(await results.count()).toBe(1);
        await expect(results.first()).toContainText('Sinners');
    });

    test('shows nomination count for each matching film', async ({ page }) => {
        await completeOnboarding(page);
        await page.locator('#search-btn').click();

        await page.locator('#search-input').fill('sin');

        await expect(page.locator('.search-result-nominations').first()).toContainText('16');
    });

    test('tapping a film result shows its categories', async ({ page }) => {
        await completeOnboarding(page);
        await page.locator('#search-btn').click();

        await page.locator('#search-input').fill('f1');
        await page.locator('.search-result', { hasText: 'F1' }).click();

        await expect(page.locator('.search-film-title')).toHaveText('F1');
        const categoryResults = page.locator('.search-result');
        expect(await categoryResults.count()).toBe(4);
    });

    test('empty query shows all films', async ({ page }) => {
        await completeOnboarding(page);
        await page.locator('#search-btn').click();

        const results = page.locator('.search-result');
        const count = await results.count();
        // Should show all films from ALL_FILMS
        expect(count).toBeGreaterThan(20);
    });

    test('no match shows empty state', async ({ page }) => {
        await completeOnboarding(page);
        await page.locator('#search-btn').click();

        await page.locator('#search-input').fill('xylophone');

        await expect(page.locator('#search-empty')).toBeVisible();
        await expect(page.locator('.search-empty-title')).toHaveText('No nominations found');
        await expect(page.locator('.search-empty-subtitle')).toContainText('Better luck next year');
    });

    test('Escape closes search', async ({ page }) => {
        await completeOnboarding(page);
        await page.locator('#search-btn').click();

        await page.keyboard.press('Escape');

        await expect(page.locator('#search-view')).toBeHidden();
    });

    test('close button closes search', async ({ page }) => {
        await completeOnboarding(page);
        await page.locator('#search-btn').click();

        await page.locator('#search-close').click();

        await expect(page.locator('#search-view')).toBeHidden();
    });
});

describe('Search Mode Integration', () => {

    test('searching from Watched mode preserves mode on navigate', async ({ page }) => {
        await completeOnboarding(page);
        await page.locator('#mode-select').selectOption('watched');

        await page.locator('#search-btn').click();
        await page.locator('#search-input').fill('sin');
        await page.locator('.search-result', { hasText: 'Sinners' }).click();
        await page.locator('.search-result', { hasText: 'Best Picture' }).click();

        await expect(page.locator('#mode-select')).toHaveValue('watched');
    });

    test('searching from Predictions mode preserves mode on navigate', async ({ page }) => {
        await completeOnboarding(page);
        await page.locator('#mode-select').selectOption('predictions');

        await page.locator('#search-btn').click();
        await page.locator('#search-input').fill('sin');
        await page.locator('.search-result', { hasText: 'Sinners' }).click();
        await page.locator('.search-result', { hasText: 'Best Picture' }).click();

        await expect(page.locator('#mode-select')).toHaveValue('predictions');
    });

    test('searching from Streamable navigates to Watched mode', async ({ page }) => {
        await completeOnboarding(page);
        await switchToStreamable(page);

        await page.locator('#films-list .film', { hasText: 'Sinners' }).click();
        await page.locator('.search-result', { hasText: 'Best Picture' }).click();

        await expect(page.locator('#mode-select')).toHaveValue('watched');
    });
});
```

## Out of Scope

- Searching by nominee name (e.g., "Ryan Coogler") — only film title search
- Filtering by category from within search
- Search history or recent searches
- Fuzzy matching or typo correction

## Future Considerations

- Could add nominee name search ("who is nominated for Best Director?")
- Could highlight the searched film in the category view after navigation
- Could add a "Search" entry to the mode dropdown as an alternative entry point
- Could show aggregate stats in results (e.g., "3 of 16 watched")
