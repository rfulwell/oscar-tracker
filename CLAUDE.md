# Oscar Tracker - Project Notes

> **Note**: Keep this document updated with learnings from development sessions. Document important decisions, patterns, gotchas, and configuration details discovered during implementation.

## UI Design

The current UI design is polished and should be preserved. Avoid making unnecessary visual changes. Only modify styles when strictly required for a specific feature request.

## Data Storage

All changes to stored data (localStorage) must be backwards compatible. Do not modify the format of existing data. When adding new features that require additional data, use new keys/tables rather than changing existing ones. This ensures users' existing watched items and preferences remain valid as the app evolves.

### Seasons

- **`SEASON` in `app.js`** names the awards year the build tracks. Watched films, predictions, favorites and shared lists are stored per season via `seasonKey()`.
- **2026 keeps the original keys** (`oscar-tracker-watched`, etc.). Later seasons use suffixed keys (`oscar-tracker-watched-2027`). Never write to another season's keys.
- **Global keys** (not per season): mode, current category, sharer name, the copy-modal dismissals and `sidebarCollapsed`.
- **Picks can name nominees that no longer exist** (data corrections after a user saved them). Count picks with `countValidPicks()` / check them with `isValidPick()` rather than `Object.keys()`, and don't delete them from storage.
- **season-storage.spec.js** covers loading 2026 data from the original keys, stale picks, and a new season starting fresh without touching 2026 data.

## Testing

This project uses Playwright for automated E2E testing with headless Chromium. Tests are located in the `tests/` directory.

### Running Tests

```bash
# Run all tests
npx playwright test

# Run tests with visible browser (headed mode)
npx playwright test --headed

# Run specific test file
npx playwright test tests/predictions.spec.js

# Run with debug mode
npx playwright test --debug
```

### Test Structure

Tests start a local HTTP server on port 3000 and run against the live app. Each test clears localStorage to ensure isolation.

### Coverage

- **predictions.spec.js**: Predictions mode functionality (mode switching, single-select behavior, persistence, progress display, performance regression tests)
- **sharing.spec.js**: Sharing predictions via URL (first-time visitors, returning visitors, shared list management, name sanitization, invalid links)
- **favorites.spec.js**: Favorites mode (heart icons, single-select, cross-population modals, persistence, mode switching)

### Performance Profiling

Performance analysis scripts use Chrome DevTools Protocol (CDP) via Playwright:

```bash
# Full performance analysis (metrics, profiling, timeline)
node tests/performance-profile.js

# DOM churn measurement (compares optimized vs full re-render)
node tests/measure-dom-churn.js
```

These scripts measure:
- JavaScript execution time
- Layout/style recalculation counts
- DOM node creation/destruction
- Memory usage

## Versioning & Deployment

- **Deploy branch**: Only pushes to `main` deploy to production (awardstracker.app). Do feature work on a branch and merge to `main` via PR; feature branches never deploy.

The app uses automated versioning via GitHub Actions:

- **Version format**: `1.2.{run_number}` (e.g., `1.2.118`)
- **Location**: `APP_VERSION` constant in `app.js`
- **Automation**: The deploy workflow (`.github/workflows/deploy.yml`) auto-injects the version at deploy time using the workflow run number
- **No manual bumping**: Version increments automatically with each deployment

The version is displayed in the About modal and helps identify which build is deployed.

## Service Worker

- **Never bump `SW_VERSION` by hand.** The deploy workflow replaces it with the commit's short SHA, so `sw.js` changes on every deploy and installed clients always pick up the new worker. Locally it reads `'dev'`.
- **`sw.js` must stay at `/sw.js`.** Installed clients check that exact URL for updates; moving it strands them on their old worker.
- **Caching strategy**: pages and `.html`/`.js`/`.css`/`.json` files are network-first, falling back to the cache after 3 seconds or when offline. Images are cache-first. Google Fonts use their own `awards-tracker-fonts` cache that survives updates.
- **Query strings are ignored for cache keys**, so share links (`/?p=...`) are served from the one cached copy of the app.
- **New data files** (`.js`/`.json`) are network-first automatically. Add them to `ASSETS_TO_CACHE` so they work offline on first launch.
- **service-worker.spec.js** covers precaching, online/offline/slow-network behavior and upgrading from the v9 worker (`tests/fixtures/sw-v9.js`, the version on clients before automatic versioning).
- Set `CHROMIUM_PATH` to run tests against a preinstalled Chromium instead of Playwright's own browser.
