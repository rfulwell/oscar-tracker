# About Modal Feature

## Overview

A lightweight about modal accessible via a discreet link in the footer area. Displays version info, feature highlights, and attribution.

## Requirements

### Trigger Location

- **Position**: Below the lower navbar, above the hard refresh button
- **Style**: Small, subtle link matching existing UI aesthetic
- **Text**: "About" (simple, not version number)

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
│              Oscar Tracker     [×]  │
│                v1.2.3               │
│                                     │
│  Track your Oscar watch progress    │
│  and make predictions for the       │
│  98th Academy Awards.               │
│                                     │
│  🏆 March 15, 2026                  │
│     42 days remaining               │
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
│  📋 What's New                      │
│  ┌───────────────────────────────┐  │
│  │ v1.2.3 - Bug fixes            │  │
│  │ v1.2.0 - Share predictions    │  │
│  │ v1.1.0 - Predictions mode     │  │
│  │ v1.0.0 - Initial release      │  │
│  └───────────────────────────────┘  │
│         (scrollable area)           │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  📱 Install as app                   │
│  iOS · Android · Desktop             │
│                                     │
│  github.com/rfulwell/oscar-tracker  │
│                                     │
└─────────────────────────────────────┘
```

### Content Sections

#### 1. Header
- App name: "Oscar Tracker"
- Version badge: "v1.2.3"
- Close button (×) in top-right corner

#### 2. Description
Brief tagline about the app's purpose.

#### 3. Oscar Countdown
- **Date**: March 15, 2026 (98th Academy Awards)
- **Countdown**: Calculated dynamically in JavaScript
- **Format**: "42 days remaining" or "Tonight!" on the day
- **Post-ceremony**: Hide countdown or show "Awards have aired"

#### 4. Feature Highlights
- **Share Predictions** - Share your picks with friends (coming soon / available now)

#### 5. Changelog (Embedded)
- Scrollable container with max-height (~120px)
- Shows recent versions with brief descriptions
- Styled to match app aesthetic (dark theme, subtle borders)
- Format: `v1.2.3 - Brief description`
- Most recent at top

#### 6. PWA Install Hints
- **Detection**: Show only when NOT running in standalone mode
- **Format**: Small text with links to platform-specific instructions
- **Links**: Authoritative sources (Google, Apple, Microsoft)

| Platform | Detection | Link |
|----------|-----------|------|
| iOS Safari | `navigator.standalone === false` and iOS detection | [Apple Support](https://support.apple.com/guide/iphone/bookmark-favorite-webpages-iph42ab2f3a7/ios#iph4f9a47bbc) |
| Android Chrome | `beforeinstallprompt` event OR manual link | [Google Support](https://support.google.com/chrome/answer/9658361) |
| Desktop Chrome | `beforeinstallprompt` event OR manual link | [Google Support](https://support.google.com/chrome/answer/9658361) |
| macOS Safari | Safari-specific detection | [Apple Support](https://support.apple.com/guide/safari/add-websites-to-the-dock-ibrwe76b959b/mac) |

**Display text**: "Install as app: [iOS](link) · [Android](link) · [Desktop](link)"

#### 7. Attribution
- GitHub repo link: `github.com/rfulwell/oscar-tracker`

### Brainstormed Additional Content

| Content | Status | Notes |
|---------|--------|-------|
| Oscar countdown | ✅ Include | March 15, 2026 with days remaining |
| Changelog | ✅ Include | Embedded scrollable, matches site aesthetic |
| Keyboard shortcuts | Maybe later | Arrow keys, Enter/Space |
| Privacy note | Maybe later | "Data stored locally, never sent to servers" |
| PWA install hint | ✅ Include | Platform-specific links to authoritative sources |
| Credits/acknowledgments | Skip | Keep it simple |
| Dark/light mode toggle | Skip | Not implementing theming |
| Tip jar / support link | Skip | Not needed |

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
<div id="about-modal" class="modal" hidden aria-modal="true" aria-labelledby="about-title">
  <div class="modal-backdrop"></div>
  <div class="modal-content">
    <button class="modal-close" aria-label="Close">×</button>

    <h2 id="about-title">Oscar Tracker</h2>
    <span class="version-badge">v1.2.3</span>

    <p class="about-description">
      Track your Oscar watch progress and make predictions
      for the 98th Academy Awards.
    </p>

    <div class="oscar-countdown">
      <span class="countdown-icon">🏆</span>
      <span class="countdown-date">March 15, 2026</span>
      <span class="countdown-remaining" id="countdown-days">42 days remaining</span>
    </div>

    <div class="about-section">
      <h3>📤 Share Predictions</h3>
      <p>Share your picks with friends via a simple link - no account required!</p>
    </div>

    <div class="about-section">
      <h3>📋 What's New</h3>
      <div class="changelog-scroll">
        <div class="changelog-entry">
          <strong>v1.2.3</strong> - Bug fixes and performance improvements
        </div>
        <div class="changelog-entry">
          <strong>v1.2.0</strong> - Share predictions with friends
        </div>
        <div class="changelog-entry">
          <strong>v1.1.0</strong> - Predictions mode added
        </div>
        <div class="changelog-entry">
          <strong>v1.0.0</strong> - Initial release
        </div>
      </div>
    </div>

    <div class="about-section pwa-hints" id="pwa-hints">
      <h3>📱 Install as App</h3>
      <p class="pwa-links">
        <a href="https://support.apple.com/guide/iphone/bookmark-favorite-webpages-iph42ab2f3a7/ios#iph4f9a47bbc" target="_blank" rel="noopener">iOS</a>
        ·
        <a href="https://support.google.com/chrome/answer/9658361" target="_blank" rel="noopener">Android</a>
        ·
        <a href="https://support.google.com/chrome/answer/9658361" target="_blank" rel="noopener">Desktop</a>
      </p>
    </div>

    <footer class="about-footer">
      <a href="https://github.com/rfulwell/oscar-tracker" target="_blank" rel="noopener">
        github.com/rfulwell/oscar-tracker
      </a>
    </footer>
  </div>
</div>
```

#### Changelog Scroll Styles
```css
.changelog-scroll {
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
}

.changelog-entry {
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.85rem;
}

.changelog-entry:last-child {
  border-bottom: none;
}

.changelog-entry strong {
  color: var(--color-gold);
}
```

#### Oscar Countdown Styles
```css
.oscar-countdown {
  text-align: center;
  padding: 1rem;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  margin: 1rem 0;
}

.countdown-icon {
  font-size: 1.5rem;
}

.countdown-date {
  display: block;
  font-weight: bold;
  color: var(--color-gold);
}

.countdown-remaining {
  display: block;
  font-size: 0.9rem;
  opacity: 0.8;
}
```

#### PWA Hints Styles
```css
.pwa-hints {
  text-align: center;
}

.pwa-links {
  font-size: 0.85rem;
}

.pwa-links a {
  color: var(--color-gold);
  text-decoration: none;
}

.pwa-links a:hover {
  text-decoration: underline;
}

/* Hide PWA hints when already installed as standalone */
@media (display-mode: standalone) {
  .pwa-hints {
    display: none;
  }
}
```

#### Modal JavaScript
```javascript
const OSCAR_DATE = new Date('2026-03-15T19:00:00-05:00'); // 7pm ET

function showAboutModal() {
  updateCountdown();
  document.getElementById('about-modal').hidden = false;
  document.body.classList.add('modal-open');
}

function hideAboutModal() {
  document.getElementById('about-modal').hidden = true;
  document.body.classList.remove('modal-open');
}

function updateCountdown() {
  const now = new Date();
  const diff = OSCAR_DATE - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const el = document.getElementById('countdown-days');

  if (days > 1) {
    el.textContent = `${days} days remaining`;
  } else if (days === 1) {
    el.textContent = 'Tomorrow!';
  } else if (days === 0) {
    el.textContent = 'Tonight!';
  } else {
    el.textContent = 'The ceremony has aired';
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.getElementById('about-modal').hidden) {
    hideAboutModal();
  }
});

// Close on backdrop click
document.querySelector('.modal-backdrop')?.addEventListener('click', hideAboutModal);
```

#### Changelog Data Structure
```javascript
// Could be maintained in a separate file or at top of app.js
const CHANGELOG = [
  { version: '1.2.3', description: 'Bug fixes and performance improvements' },
  { version: '1.2.0', description: 'Share predictions with friends' },
  { version: '1.1.0', description: 'Predictions mode added' },
  { version: '1.0.0', description: 'Initial release' },
];

// Or load from CHANGELOG.md / version.json at build time
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

## Decisions Made

1. **Trigger text**: Just "About" (not version number)
2. **Oscar countdown**: Inline countdown to March 15, 2026 (calculated in JS)
3. **Changelog**: Embedded in scrollable container, matches site aesthetic
4. **PWA prompt**: Skip (too technical for most users)
