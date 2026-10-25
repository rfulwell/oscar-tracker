# Oscar Tracker - Project Notes

> **Note**: Keep this document updated with learnings from development sessions. Document important decisions, patterns, gotchas, and configuration details discovered during implementation.

## UI Design

The current UI design is polished and should be preserved. Avoid making unnecessary visual changes. Only modify styles when strictly required for a specific feature request.

## Data Storage

All changes to stored data (localStorage) must be backwards compatible. Do not modify the format of existing data. When adding new features that require additional data, use new keys/tables rather than changing existing ones. This ensures users' existing watched items and preferences remain valid as the app evolves.

### Seasons

- **Season data lives in `seasons/<year>.js`** (`AWARDS_SEASON`): ceremony number, date, broadcaster, official source URL, the films list and the categories with their nominees. `index.html` loads the current season's file before `app.js`, and `sw.js` precaches it.
- **Everything else is derived from it**: `SEASON`, `OSCAR_DATE`, `CATEGORIES`, `FILM_NOMINEES` (from each nominee's `film`), `ALL_FILMS` with nomination counts, `FILM_STREAMING`, and the season text and links in `index.html` (`[data-season]`, `[data-season-href]`, filled by `applySeasonText()`). Don't hard-code season details anywhere else.
- **Starting a new season**: add `seasons/<year>.js`, then point the `<script src="seasons/...">` in `index.html` and the entry in `ASSETS_TO_CACHE` in `sw.js` at it (`season-data.spec.js` fails if these disagree).
- **`SEASON` in `app.js`** names the awards year the build tracks. Watched films, predictions, favorites and shared lists are stored per season via `seasonKey()`.
- **2026 keeps the original keys** (`oscar-tracker-watched`, etc.). Later seasons use suffixed keys (`oscar-tracker-watched-2027`). Never write to another season's keys.
- **Global keys** (not per season): mode, current category, sharer name, the copy-modal dismissals and `sidebarCollapsed`.
- **Picks can name nominees that no longer exist** (data corrections after a user saved them). Count picks with `countValidPicks()` / check them with `isValidPick()` rather than `Object.keys()`, and don't delete them from storage.
- **season-storage.spec.js** covers loading 2026 data from the original keys, stale picks, and a new season starting fresh without touching 2026 data.

### Share Links

- **Format**: `/?p=<one character per category>&y=<season>&name=<name>`. Each character is the index of the picked nominee in that category (`-` for no pick), in `CATEGORIES` order.
- **Links without `y` are 2026 links.** Every link shared before seasons were added has no `y`, and they must keep opening in 2026 builds.
- **A link from another season is never read against this season's nominees.** It shows a message instead (`showShareLinkError()`).
- **21-character links** (shared before the short film categories were added on Feb 8, 2026) can't be read reliably, so they show "from an older version of the app".
- **Once a season's nominations are final, never reorder its categories or nominees.** Positions are baked into every link already shared.
- **Share link tests** are in the "Share Link Seasons" section of `sharing.spec.js`.

## Testing

This project uses Playwright for automated E2E testing with headless Chromium. Tests are located in the `tests/` directory.

### Failing Tests Come First

Before starting any other work, run the full suite. If anything fails, fixing it is the first priority: fix it in its own PR and merge that before any feature PR. A feature PR is ready only when the full suite passes on it, not when its failures "also fail on `main`".

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

- **Official data source**: `The 98th Academy Awards _ 2026.html` is a saved copy of the official nominations page. When `oscar-data-validation.spec.js` and `app.js` disagree, check both against it rather than assuming either is right.
- **Opening the category view smooth-scrolls the page.** Layout tests that run while it's still scrolling are flaky. Either wait for it to stop (`waitForScrollToStop()` in `viewport-layout.spec.js`), or measure all the elements you compare in a single `page.evaluate()` (`getBoxes()` in `source-links.spec.js`). Don't use fixed `waitForTimeout()` delays.
- **Share links are one character per category** (24 for 2026). Test links must match `CATEGORIES.length` or the app ignores them.

### CI

- **`.github/workflows/test.yml`** runs the full suite on every pull request. The deploy workflow calls it first, and nothing deploys unless it passes.
- **`package-lock.json` is committed** so CI installs the exact Playwright version (`npm ci`). Update it with `npm install` when changing dependencies.
- **CI retries a failed test twice** (`playwright.config.js`). A test reported as "flaky" passed only on a retry: treat it as a bug and fix it, don't rely on the retry.

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

## PR Previews

- **Every open PR from this repo gets a preview at `/preview/pr-<number>/`**, listed at `/preview/`. The deploy workflow builds them with `.github/scripts/build_previews.py` and also runs on `pull_request_target`, so previews update when PRs open, change or close.
- **Every deploy replaces the whole site**, so every run rebuilds every open preview; a closed PR's preview disappears on the next deploy.
- **Never run PR code in the workflow.** The script runs from `main`'s checkout and only copies the PR's files out of git. Fork PRs are skipped entirely (the workflow can deploy the site).
- **Use relative paths** (`style.css`, `icons/x.svg`), never root-relative ones (`/style.css`): a preview would load the live site's files instead of its own. The index page flags any it finds.
- **Previews share the live site's origin**, so the script keeps them apart: localStorage keys are prefixed `preview-pr-<n>:`, the service worker's `CACHE_PREFIX` becomes `awards-tracker-pr-<n>-`, and the manifest gets its own `id`. Keep `CACHE_PREFIX` in `sw.js`, and have the worker delete only caches with its own prefix.
- **Previews are noindex**, and `robots.txt` disallows `/preview/`.
- **A failed preview** is listed as failed on `/preview/` and never blocks the live deploy.
- **Test the script locally** with `PREVIEW_PRS_JSON=<file> python3 .github/scripts/build_previews.py <out_dir>` (the same JSON `gh pr list --json number,title,url,headRefName,headRefOid,isCrossRepository` returns).

## Service Worker

- **Never bump `SW_VERSION` by hand.** The deploy workflow replaces it with the commit's short SHA, so `sw.js` changes on every deploy and installed clients always pick up the new worker. Locally it reads `'dev'`.
- **`sw.js` must stay at `/sw.js`.** Installed clients check that exact URL for updates; moving it strands them on their old worker.
- **Caching strategy**: pages and `.html`/`.js`/`.css`/`.json` files are network-first, falling back to the cache after 3 seconds or when offline. Images are cache-first. Google Fonts use their own `awards-tracker-fonts` cache that survives updates.
- **Query strings are ignored for cache keys**, so share links (`/?p=...`) are served from the one cached copy of the app.
- **New data files** (`.js`/`.json`) are network-first automatically. Add them to `ASSETS_TO_CACHE` so they work offline on first launch.
- **service-worker.spec.js** covers precaching, online/offline/slow-network behavior and upgrading from the v9 worker (`tests/fixtures/sw-v9.js`, the version on clients before automatic versioning).
- Set `CHROMIUM_PATH` to run tests against a preinstalled Chromium instead of Playwright's own browser.
