# Oscar Tracker - Project Notes

> **Note**: Keep this document updated with learnings from development sessions. Document important decisions, patterns, gotchas, and configuration details discovered during implementation.

## UI Design

The current UI design is polished and should be preserved. Avoid making unnecessary visual changes. Only modify styles when strictly required for a specific feature request.

## Data Storage

All changes to stored data (localStorage) must be backwards compatible. Do not modify the format of existing data. When adding new features that require additional data, use new keys/tables rather than changing existing ones. This ensures users' existing watched items and preferences remain valid as the app evolves.

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

The app uses automated versioning via GitHub Actions:

- **Version format**: `1.0.{run_number}` (e.g., `1.0.42`)
- **Location**: `APP_VERSION` constant in `app.js`
- **Automation**: The deploy workflow (`.github/workflows/deploy.yml`) auto-injects the version at deploy time using the workflow run number
- **No manual bumping**: Version increments automatically with each deployment

The version is displayed in the About modal and helps identify which build is deployed.
