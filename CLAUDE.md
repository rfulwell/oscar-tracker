# Oscar Tracker - Project Notes

## UI Design

The current UI design is polished and should be preserved. Avoid making unnecessary visual changes. Only modify styles when strictly required for a specific feature request.

## Data Storage

All changes to stored data (localStorage) must be backwards compatible. Do not modify the format of existing data. When adding new features that require additional data, use new keys/tables rather than changing existing ones. This ensures users' existing watched items and preferences remain valid as the app evolves.
