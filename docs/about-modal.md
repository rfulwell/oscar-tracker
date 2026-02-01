# About Modal Feature

## Overview

A lightweight about modal accessible via a discreet link in the footer area. Displays version info, feature highlights, and attribution.

## Requirements

### Trigger Location

- **Position**: Below the lower navbar, above the hard refresh button
- **Style**: Small, subtle link matching existing UI aesthetic
- **Text**: "About" or "v1.2.3" (showing current version)

### Version Numbering

#### Semantic Versioning (semver)

Format: `MAJOR.MINOR.PATCH`

| Type | When to bump | Example |
|------|--------------|---------|
| MAJOR | Breaking changes (not planned) | 1.0.0 → 2.0.0 |
| MINOR | New features (sharing, new modes) | 1.0.0 → 1.1.0 |
| PATCH | Bug fixes, small tweaks | 1.0.0 → 1.0.1 |

#### Automated Version Bumping

**Option 1: Git tag-based**
```bash
# Version derived from latest git tag
git describe --tags --abbrev=0  # → v1.2.3
```

**Option 2: package.json version**
```json
{
  "version": "1.2.3"
}
```
Bump via: `npm version patch|minor|major`

**Option 3: GitHub Actions automation**
- On push to main, analyze commit messages
- `feat:` → minor bump
- `fix:` → patch bump
- Auto-create git tag

**Recommended**: Option 2 + Option 3 hybrid
- Store version in `package.json`
- GitHub Action bumps on merge to main
- Build injects version into app

### Modal Content

```
┌─────────────────────────────────────┐
│              Oscar Tracker          │
│                v1.2.3               │
│                                     │
│  Track your Oscar watch progress    │
│  and make predictions for the       │
│  98th Academy Awards (2026).        │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  📤 Share Predictions               │
│  Share your picks with friends      │
│  via a simple link - no account     │
│  required!                          │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Created by [Your Name]             │
│  github.com/rfulwell/oscar-tracker  │
│                                     │
│            [ Close ]                │
└─────────────────────────────────────┘
```

### Content Sections

#### 1. Header
- App name: "Oscar Tracker"
- Version badge: "v1.2.3"

#### 2. Description
Brief tagline about the app's purpose.

#### 3. Feature Highlights
Rotating or static list of features:
- **Share Predictions** - Share your picks with friends (coming soon / available now)
- **Offline Support** - Works without internet once loaded
- **Cross-Device Sync** - Your data stays in your browser (privacy note)

#### 4. Attribution
- Creator name with link to GitHub repo
- Optional: "Built with ❤️ for movie lovers"

#### 5. Footer
- Close button
- Optional: Links to report issues, view source

### Brainstormed Additional Content

| Content | Priority | Notes |
|---------|----------|-------|
| Keyboard shortcuts | Medium | Arrow keys, Enter/Space |
| Privacy note | Medium | "Data stored locally, never sent to servers" |
| PWA install hint | Low | "Add to home screen for app-like experience" |
| Oscar ceremony date | Low | "March 2, 2026" countdown? |
| Changelog link | Low | Link to GitHub releases |
| Credits/acknowledgments | Low | Data sources, icon credits |
| Dark/light mode toggle | Low | If we add theming later |
| Tip jar / support link | Optional | Ko-fi, GitHub sponsors |

### UI Design

#### Trigger Link
```css
.about-link {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-decoration: none;
  opacity: 0.7;
}
.about-link:hover {
  opacity: 1;
  text-decoration: underline;
}
```

#### Modal Overlay
- Semi-transparent dark backdrop
- Centered modal card
- Max-width: 320px (mobile-friendly)
- Matches existing app styling (gold accents, dark theme)
- Close on backdrop click or × button
- Close on Escape key

### Technical Implementation

#### Version Injection

**Build-time injection:**
```javascript
// Generated at build time or read from package.json
const APP_VERSION = '1.2.3';
```

**Runtime fetch (if no build step):**
```javascript
// Fetch version from package.json or version.json
fetch('/version.json')
  .then(r => r.json())
  .then(data => { APP_VERSION = data.version; });
```

**Simple approach (manual):**
```javascript
// Top of app.js
const APP_VERSION = '1.2.3'; // Update manually with releases
```

#### Modal HTML Structure
```html
<div id="about-modal" class="modal" hidden>
  <div class="modal-backdrop"></div>
  <div class="modal-content">
    <button class="modal-close" aria-label="Close">×</button>
    <h2>Oscar Tracker</h2>
    <span class="version-badge">v1.2.3</span>
    <p>Track your Oscar watch progress...</p>
    <!-- Feature sections -->
    <footer>
      <a href="https://github.com/rfulwell/oscar-tracker">
        Created by rfulwell
      </a>
    </footer>
  </div>
</div>
```

#### Modal JavaScript
```javascript
function showAboutModal() {
  document.getElementById('about-modal').hidden = false;
  document.body.classList.add('modal-open');
}

function hideAboutModal() {
  document.getElementById('about-modal').hidden = true;
  document.body.classList.remove('modal-open');
}
```

### Accessibility

- Modal traps focus when open
- Close button is focusable
- Escape key closes modal
- `aria-modal="true"` on modal
- `aria-labelledby` pointing to heading
- Return focus to trigger element on close

### File Changes Required

| File | Changes |
|------|---------|
| `index.html` | Add about link, modal HTML |
| `style.css` | Modal styles, about link styles |
| `app.js` | Modal open/close logic, version constant |
| `package.json` | Ensure version field exists |

### Version Automation (GitHub Actions)

```yaml
# .github/workflows/version-bump.yml
name: Version Bump

on:
  push:
    branches: [main]

jobs:
  bump:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Bump version
        run: |
          if git log -1 --pretty=%B | grep -q "^feat:"; then
            npm version minor --no-git-tag-version
          else
            npm version patch --no-git-tag-version
          fi
      - name: Commit version bump
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add package.json
          git commit -m "chore: bump version"
          git push
```

## Implementation Phases

### Phase 1: Basic Modal
- [ ] Add about link to footer
- [ ] Create modal HTML structure
- [ ] Add modal CSS styles
- [ ] Implement open/close JavaScript
- [ ] Add static version number

### Phase 2: Content
- [ ] Write app description
- [ ] Add sharing feature teaser
- [ ] Add GitHub repo link
- [ ] Add keyboard shortcuts section (optional)

### Phase 3: Version Automation
- [ ] Set up package.json version field
- [ ] Create GitHub Action for auto-bump
- [ ] Inject version into app at build/deploy time

## Open Questions

1. **Version display**: Show "v1.2.3" in the about link itself, or just "About"?
2. **Changelog**: Link to GitHub releases, or embed recent changes?
3. **Ceremony countdown**: Include countdown to Oscar night?
4. **PWA prompt**: Include "Add to Home Screen" instructions?
