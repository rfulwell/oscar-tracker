# Oscar Tracker - Project Notes

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

- **predictions.spec.js**: Predictions mode functionality (mode switching, single-select behavior, persistence, progress display)
