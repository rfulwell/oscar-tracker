# Hamburger Menu & Responsive Navigation

> Feature specification for replacing the mode dropdown with a hamburger menu and responsive sidebar navigation.

## Overview

Replace the current mode selection dropdown with a modern, responsive navigation system:
- **Mobile/Tablet**: Hamburger icon that opens a slide-in drawer from the left
- **Desktop**: Persistent left sidebar that can collapse to icon-only width

This improves discoverability of list types and provides a more intuitive navigation experience across all device sizes.

## Current State

```
┌─────────────────────────────────────────────────────┐
│  🏆  Oscar Tracker®                                 │
│      98th Academy Awards · 2026                     │
│      March 15 on ABC  [Predictions ▼] [Share]       │
└─────────────────────────────────────────────────────┘
```

The mode dropdown (`#mode-select`) is located in the ceremony info section. Users must discover and interact with a small dropdown to switch between Watched, Predictions, Favorites, and Streamable views.

**Problems with current approach:**
- Low discoverability — dropdown blends into header text
- Limited space for future menu items
- No clear visual hierarchy for navigation
- Inconsistent with modern app navigation patterns

---

## Proposed Design

### Mobile View (< 768px)

```
┌─────────────────────────────────────────────────────┐
│  🏆  Oscar Tracker®                                 │
│      98th Academy Awards · 2026                     │
│      March 15 on ABC    Predictions    ☰           │
└─────────────────────────────────────────────────────┘
                                   ↑              ↑
                            Mode label    Hamburger icon
                           (clickable)    (opens drawer)
```

**Hamburger icon:**
- Replaces the dropdown in the same location (right side of header)
- Standard three-line icon (☰)
- Tapping opens the navigation drawer

**Mode label:**
- Static text showing current mode name (e.g., "Predictions")
- Clickable — also opens the navigation drawer
- Provides context without requiring menu interaction

### Navigation Drawer (Mobile)

```
┌──────────────────────┬──────────────────────────────┐
│                      │                              │
│           ✕          │                              │
│                      │      (dimmed overlay)        │
│  ─────────────────   │                              │
│                      │                              │
│  ○  Watched          │                              │
│                      │                              │
│  ○  Predictions  ●───┼── Gold accent (active)       │
│                      │                              │
│  ○  Favorites        │                              │
│                      │                              │
│  ○  Streamable       │                              │
│                      │                              │
│  ─────────────────   │      Tap to close            │
│                      │                              │
│  ↗  Share ───────────┼── Only visible in Predictions│
│                      │                              │
│  ─────────────────   │                              │
│                      │                              │
│  ⓘ  About            │                              │
│                      │                              │
└──────────────────────┴──────────────────────────────┘
        280px                    Remaining width
```

**Drawer behavior:**
- Slides in from left edge
- Width: 280px (comfortable touch targets)
- Background: `--color-black-light` (#1a1a1a)
- Dimmed overlay on content area (tap to close)
- Close button (✕) in top-right corner of drawer
- Smooth animation: 300ms ease-out

**Menu items:**
- List types: Watched, Predictions, Favorites, Streamable
- Visual divider
- Share (conditional — only visible in Predictions mode, disabled if no predictions made)
- Visual divider
- About (opens about modal)

**Selection behavior:**
- Tapping a menu item switches to that mode
- Drawer stays open (user explicitly closes)
- Active item has subtle gold accent

### Desktop View (≥ 768px)

```
┌────────────┬────────────────────────────────────────────────────┐
│            │  🏆  Oscar Tracker®                                │
│   ☰ ←──────┼── Collapse toggle                                  │
│            │      98th Academy Awards · 2026                    │
│            │      March 15 on ABC                   [Share]     │
│  Watched   ├────────────────────────────────────────────────────┤
│            │                                                    │
│▸Predictions│   ┌─────────────────────────────────────────┐      │
│            │   │  ◀  Best Picture  ▶                     │      │
│  Favorites │   │                                         │      │
│            │   │  ┌─────────────────────────────────┐    │      │
│ Streamable │   │  │ ☆ Anora                         │    │      │
│            │   │  │   Directed by Sean Baker        │    │      │
│ ────────── │   │  └─────────────────────────────────┘    │      │
│            │   │                                         │      │
│   About    │   │  ┌─────────────────────────────────┐    │      │
│            │   │  │ ★ The Brutalist               ● │    │      │
│            │   │  │   Directed by Brady Corbet      │    │      │
│            │   │  └─────────────────────────────────┘    │      │
│            │   │                                         │      │
│            │   └─────────────────────────────────────────┘      │
│            │                                                    │
└────────────┴────────────────────────────────────────────────────┘
    200px                        Remaining width
```

**Persistent sidebar:**
- Always visible on desktop
- Width: 200px (expanded)
- Same menu items as mobile drawer
- Active item indicated with gold accent and arrow (▸)

### Collapsed Sidebar (Desktop)

```
┌────┬───────────────────────────────────────────────────────────┐
│    │  🏆  Oscar Tracker®                                       │
│ ☰  │      98th Academy Awards · 2026                           │
│    │      March 15 on ABC                          [Share]     │
│────├───────────────────────────────────────────────────────────┤
│ 👁 │                                                           │
│    │                                                           │
│▸⭐ │      Main content area (wider)                            │
│    │                                                           │
│ ❤️ │                                                           │
│    │                                                           │
│ ▶️ │                                                           │
│    │                                                           │
│────│                                                           │
│ ⓘ │                                                           │
│    │                                                           │
└────┴───────────────────────────────────────────────────────────┘
 56px                        Remaining width
```

**Collapsed state:**
- Width: 56px (icon + padding)
- Shows only icons, no text labels
- Tooltip on hover shows full label
- Toggle button (☰) expands sidebar
- User preference persisted to localStorage

---

## Visual Design

### Color Scheme

Consistent with existing app design tokens:

```css
/* Sidebar/Drawer background */
background: var(--color-black-light);  /* #1a1a1a */

/* Menu item default */
color: var(--color-white-dim);         /* #888 */

/* Menu item hover */
background: var(--color-black-lighter); /* #2a2a2a */
color: var(--color-white);              /* #fafafa */

/* Menu item active */
color: var(--color-gold);               /* #d4af37 */
border-left: 3px solid var(--color-gold);

/* Divider */
border-color: var(--color-black-lighter); /* #2a2a2a */

/* Overlay (mobile) */
background: rgba(0, 0, 0, 0.6);
```

### Typography

```css
/* Menu items */
font-family: var(--font-body);  /* Libre Franklin */
font-size: 1rem;
font-weight: 500;

/* Section divider */
/* No text, just visual separator */
```

### Icons

Each menu item has an associated icon:

| Mode       | Icon | Description           |
|------------|------|-----------------------|
| Watched    | 👁   | Eye (visibility)      |
| Predictions| ⭐   | Star (same as UI)     |
| Favorites  | ❤️   | Heart (same as UI)    |
| Streamable | ▶️   | Play (streaming)      |
| Share      | ↗   | Share/export arrow    |
| About      | ⓘ   | Info circle           |

**Icon implementation:** Use inline SVG for crisp rendering and color control. Match existing icon style (simple, monochrome with gold accent for active state).

### Hamburger Icon

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <line x1="3" y1="6" x2="21" y2="6"/>
  <line x1="3" y1="12" x2="21" y2="12"/>
  <line x1="3" y1="18" x2="21" y2="18"/>
</svg>
```

### Close Icon

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <line x1="18" y1="6" x2="6" y2="18"/>
  <line x1="6" y1="6" x2="18" y2="18"/>
</svg>
```

### Collapse/Expand Toggle

```svg
<!-- Collapse (when expanded) -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polyline points="11 17 6 12 11 7"/>
  <line x1="6" y1="12" x2="18" y2="12"/>
</svg>

<!-- Expand (when collapsed) -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <polyline points="13 7 18 12 13 17"/>
  <line x1="6" y1="12" x2="18" y2="12"/>
</svg>
```

### Share Icon

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
  <polyline points="16 6 12 2 8 6"/>
  <line x1="12" y1="2" x2="12" y2="15"/>
</svg>
```

---

## Animations & Transitions

### Drawer Slide-In (Mobile)

```css
/* Drawer container */
.nav-drawer {
  transform: translateX(-100%);
  transition: transform 300ms ease-out;
}

.nav-drawer.open {
  transform: translateX(0);
}

/* Overlay fade */
.nav-overlay {
  opacity: 0;
  transition: opacity 300ms ease-out;
  pointer-events: none;
}

.nav-overlay.visible {
  opacity: 1;
  pointer-events: auto;
}
```

### Sidebar Collapse (Desktop)

```css
.sidebar {
  width: 200px;
  transition: width 200ms ease-out;
}

.sidebar.collapsed {
  width: 56px;
}

/* Menu item text fades out */
.sidebar .menu-text {
  opacity: 1;
  transition: opacity 150ms ease-out;
}

.sidebar.collapsed .menu-text {
  opacity: 0;
  pointer-events: none;
}
```

### Menu Item Hover

```css
.menu-item {
  transition: background-color 150ms ease, color 150ms ease;
}
```

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| < 768px    | Hamburger menu + slide-in drawer |
| ≥ 768px    | Persistent sidebar (collapsible) |

This aligns with the existing `@media (min-width: 768px)` breakpoint used throughout the app.

---

## Accessibility

### Keyboard Navigation

- `Tab` focuses menu items sequentially
- `Enter` or `Space` activates focused item
- `Escape` closes drawer (mobile) or collapses sidebar (desktop)
- Focus trap within open drawer (mobile)

### ARIA Attributes

```html
<!-- Hamburger button -->
<button
  class="hamburger-btn"
  aria-label="Open navigation menu"
  aria-expanded="false"
  aria-controls="nav-drawer"
>

<!-- Drawer -->
<nav
  id="nav-drawer"
  class="nav-drawer"
  role="navigation"
  aria-label="Main navigation"
>

<!-- Close button -->
<button
  class="drawer-close"
  aria-label="Close navigation menu"
>

<!-- Menu items -->
<a
  class="menu-item active"
  aria-current="page"
>
```

### Screen Reader Announcements

- Announce when drawer opens/closes
- Announce current mode on page load
- Clear labeling of all interactive elements

### Touch Targets

- Minimum 44×44px touch targets for all interactive elements
- Adequate spacing between menu items (16px minimum)

---

## Data Persistence

### Sidebar State (Desktop)

Store collapsed/expanded preference:

```javascript
// Key
'sidebarCollapsed'

// Values
'true' | 'false'

// Default
'false' (expanded)
```

### Backwards Compatibility

The existing `currentMode` localStorage key remains unchanged. The dropdown element is removed from the DOM but mode switching logic is preserved.

---

## Technical Implementation

### HTML Structure

```html
<!-- Header (modified) -->
<header class="header">
  <div class="header-content">
    <!-- Trophy + title unchanged -->
    <div class="ceremony-info">
      <span>March 15 on ABC</span>
      <span class="current-mode-label" id="current-mode-label">Predictions</span>
      <button class="hamburger-btn" id="hamburger-btn" aria-label="Open navigation menu">
        <!-- SVG icon -->
      </button>
      <button class="share-btn" id="share-btn">Share</button>
    </div>
  </div>
</header>

<!-- Navigation Drawer (new) -->
<nav id="nav-drawer" class="nav-drawer" role="navigation" aria-label="Main navigation">
  <div class="drawer-header">
    <button class="drawer-close" id="drawer-close" aria-label="Close navigation menu">
      <!-- X icon -->
    </button>
  </div>

  <ul class="nav-menu">
    <li>
      <a href="#" class="menu-item" data-mode="watched">
        <span class="menu-icon"><!-- Eye SVG --></span>
        <span class="menu-text">Watched</span>
      </a>
    </li>
    <li>
      <a href="#" class="menu-item active" data-mode="predictions">
        <span class="menu-icon"><!-- Star SVG --></span>
        <span class="menu-text">Predictions</span>
      </a>
    </li>
    <li>
      <a href="#" class="menu-item" data-mode="favorites">
        <span class="menu-icon"><!-- Heart SVG --></span>
        <span class="menu-text">Favorites</span>
      </a>
    </li>
    <li>
      <a href="#" class="menu-item" data-mode="streamable">
        <span class="menu-icon"><!-- Play SVG --></span>
        <span class="menu-text">Streamable</span>
      </a>
    </li>
  </ul>

  <div class="nav-divider"></div>

  <!-- Share section (only visible in Predictions mode) -->
  <ul class="nav-menu nav-menu-actions" id="nav-share-section">
    <li>
      <a href="#" class="menu-item" id="nav-share">
        <span class="menu-icon"><!-- Share SVG --></span>
        <span class="menu-text">Share</span>
      </a>
    </li>
  </ul>

  <div class="nav-divider" id="nav-share-divider"></div>

  <ul class="nav-menu nav-menu-secondary">
    <li>
      <a href="#" class="menu-item" id="nav-about">
        <span class="menu-icon"><!-- Info SVG --></span>
        <span class="menu-text">About</span>
      </a>
    </li>
  </ul>
</nav>

<!-- Overlay (mobile only) -->
<div class="nav-overlay" id="nav-overlay"></div>

<!-- Sidebar toggle (desktop only) -->
<button class="sidebar-toggle" id="sidebar-toggle" aria-label="Collapse sidebar">
  <!-- Arrow SVG -->
</button>
```

### CSS Structure

```css
/* =================================
   Navigation Drawer (Mobile)
   ================================= */

.nav-drawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 280px;
  background: var(--color-black-light);
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 300ms ease-out;
  display: flex;
  flex-direction: column;
  padding-top: var(--safe-area-top);
}

.nav-drawer.open {
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-black-lighter);
}

.drawer-close {
  background: none;
  border: none;
  color: var(--color-white-dim);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: color 150ms ease, background-color 150ms ease;
}

.drawer-close:hover {
  color: var(--color-white);
  background: var(--color-black-lighter);
}

.nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 300ms ease-out;
}

.nav-overlay.visible {
  opacity: 1;
  pointer-events: auto;
}

/* =================================
   Navigation Menu Items
   ================================= */

.nav-menu {
  list-style: none;
  margin: 0;
  padding: var(--spacing-sm) 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-white-dim);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  border-left: 3px solid transparent;
  transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease;
}

.menu-item:hover {
  color: var(--color-white);
  background: var(--color-black-lighter);
}

.menu-item.active {
  color: var(--color-gold);
  border-left-color: var(--color-gold);
}

.menu-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-icon svg {
  width: 20px;
  height: 20px;
}

.nav-divider {
  height: 1px;
  background: var(--color-black-lighter);
  margin: var(--spacing-sm) var(--spacing-md);
}

/* =================================
   Header Modifications
   ================================= */

.current-mode-label {
  color: var(--color-white);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  transition: background-color 150ms ease;
}

.current-mode-label:hover {
  background: var(--color-black-lighter);
}

.hamburger-btn {
  background: none;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 150ms ease;
}

.hamburger-btn:hover {
  background: var(--color-black-lighter);
}

/* =================================
   Desktop Sidebar
   ================================= */

@media (min-width: 768px) {
  .hamburger-btn,
  .current-mode-label {
    display: none;
  }

  .nav-overlay {
    display: none;
  }

  .nav-drawer {
    position: fixed;
    transform: translateX(0);
    width: 200px;
    border-right: 1px solid var(--color-black-lighter);
    padding-top: 0;
  }

  .nav-drawer.collapsed {
    width: 56px;
  }

  .drawer-header {
    display: none;
  }

  .nav-drawer .drawer-close {
    display: none;
  }

  .sidebar-toggle {
    display: flex;
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
  }

  .nav-drawer.collapsed .menu-text {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }

  .nav-drawer.collapsed .menu-item {
    justify-content: center;
    padding: var(--spacing-sm);
  }

  /* Adjust main content for sidebar */
  .app-container {
    margin-left: 200px;
    transition: margin-left 200ms ease-out;
  }

  .app-container.sidebar-collapsed {
    margin-left: 56px;
  }
}

/* Hide sidebar toggle on mobile */
.sidebar-toggle {
  display: none;
}
```

### JavaScript Implementation

```javascript
// =================================
// Navigation State
// =================================

let isDrawerOpen = false;
let isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

// =================================
// DOM Elements
// =================================

function initNavigation() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const drawerClose = document.getElementById('drawer-close');
  const navDrawer = document.getElementById('nav-drawer');
  const navOverlay = document.getElementById('nav-overlay');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const currentModeLabel = document.getElementById('current-mode-label');
  const menuItems = document.querySelectorAll('.menu-item[data-mode]');
  const aboutBtn = document.getElementById('nav-about');
  const shareBtn = document.getElementById('nav-share');

  // Open drawer (mobile)
  hamburgerBtn?.addEventListener('click', openDrawer);
  currentModeLabel?.addEventListener('click', openDrawer);

  // Close drawer (mobile)
  drawerClose?.addEventListener('click', closeDrawer);
  navOverlay?.addEventListener('click', closeDrawer);

  // Toggle sidebar (desktop)
  sidebarToggle?.addEventListener('click', toggleSidebar);

  // Menu item clicks
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = item.dataset.mode;
      switchMode(mode);
      updateActiveMenuItem(mode);
      updateCurrentModeLabel(mode);
      updateNavShareVisibility(mode);
    });
  });

  // Share button
  shareBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!shareBtn.classList.contains('disabled')) {
      showShareModal();
    }
  });

  // About button
  aboutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    showAboutModal();
  });

  // Keyboard support
  document.addEventListener('keydown', handleKeyDown);

  // Initialize state
  if (isSidebarCollapsed) {
    navDrawer?.classList.add('collapsed');
    document.querySelector('.app-container')?.classList.add('sidebar-collapsed');
  }

  updateActiveMenuItem(currentMode);
  updateCurrentModeLabel(currentMode);
  updateNavShareVisibility(currentMode);
}

// =================================
// Drawer Controls (Mobile)
// =================================

function openDrawer() {
  const navDrawer = document.getElementById('nav-drawer');
  const navOverlay = document.getElementById('nav-overlay');

  navDrawer?.classList.add('open');
  navOverlay?.classList.add('visible');
  isDrawerOpen = true;

  // Focus first menu item for accessibility
  const firstItem = navDrawer?.querySelector('.menu-item');
  firstItem?.focus();
}

function closeDrawer() {
  const navDrawer = document.getElementById('nav-drawer');
  const navOverlay = document.getElementById('nav-overlay');

  navDrawer?.classList.remove('open');
  navOverlay?.classList.remove('visible');
  isDrawerOpen = false;
}

// =================================
// Sidebar Controls (Desktop)
// =================================

function toggleSidebar() {
  const navDrawer = document.getElementById('nav-drawer');
  const appContainer = document.querySelector('.app-container');

  isSidebarCollapsed = !isSidebarCollapsed;

  navDrawer?.classList.toggle('collapsed', isSidebarCollapsed);
  appContainer?.classList.toggle('sidebar-collapsed', isSidebarCollapsed);

  localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.toString());

  // Update toggle button icon
  updateSidebarToggleIcon();
}

function updateSidebarToggleIcon() {
  const toggle = document.getElementById('sidebar-toggle');
  if (!toggle) return;

  toggle.innerHTML = isSidebarCollapsed ? EXPAND_ICON_SVG : COLLAPSE_ICON_SVG;
  toggle.setAttribute('aria-label', isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
}

// =================================
// Menu State
// =================================

function updateActiveMenuItem(mode) {
  const menuItems = document.querySelectorAll('.menu-item[data-mode]');

  menuItems.forEach(item => {
    const isActive = item.dataset.mode === mode;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}

function updateCurrentModeLabel(mode) {
  const label = document.getElementById('current-mode-label');
  if (!label) return;

  const modeNames = {
    'watched': 'Watched',
    'predictions': 'Predictions',
    'favorites': 'Favorites',
    'streamable': 'Streamable'
  };

  label.textContent = modeNames[mode] || mode;
}

function switchMode(mode) {
  // Reuse existing mode switching logic
  currentMode = mode;
  saveMode();
  updateStreamableUI();
  renderNominees();
  updateProgress();
  updateShareDeleteButton();
}

// =================================
// Share Button Visibility
// =================================

function updateNavShareVisibility(mode) {
  const shareSection = document.getElementById('nav-share-section');
  const shareDivider = document.getElementById('nav-share-divider');
  const shareBtn = document.getElementById('nav-share');

  const isPredictionsMode = mode === 'predictions';

  // Show/hide share section based on mode
  if (shareSection) shareSection.style.display = isPredictionsMode ? '' : 'none';
  if (shareDivider) shareDivider.style.display = isPredictionsMode ? '' : 'none';

  // Update disabled state based on whether predictions exist
  if (shareBtn && isPredictionsMode) {
    const hasPredictions = hasAnyPredictions(predictions);
    shareBtn.classList.toggle('disabled', !hasPredictions);
    shareBtn.setAttribute('aria-disabled', !hasPredictions);
  }
}

// =================================
// Keyboard Support
// =================================

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    if (isDrawerOpen) {
      closeDrawer();
      document.getElementById('hamburger-btn')?.focus();
    }
  }
}

// =================================
// Initialize on DOM Ready
// =================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  // ... other initialization
});
```

---

## Implementation Phases

### Phase 1: Mobile Drawer
1. Add drawer HTML structure to `index.html`
2. Add drawer/overlay CSS styles
3. Implement open/close JavaScript
4. Add hamburger button to header
5. Replace dropdown with mode label
6. Wire up menu item clicks

### Phase 2: Desktop Sidebar
1. Add media query for sidebar behavior
2. Remove drawer animation on desktop
3. Implement collapse/expand toggle
4. Adjust main content margin
5. Add localStorage persistence for collapsed state

### Phase 3: Polish & Accessibility
1. Add SVG icons for menu items
2. Implement keyboard navigation
3. Add ARIA attributes
4. Test with screen readers
5. Add hover tooltips for collapsed state

### Phase 4: Shared Lists Support
1. Add shared lists section to menu (below divider)
2. Show delete option for shared lists
3. Handle dynamic list of shared predictions

---

## Test Plan

### Playwright Tests (`tests/navigation.spec.js`)

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {

  test.describe('Mobile Drawer', () => {

    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
    });

    test('hamburger button opens drawer', async ({ page }) => {
      await page.click('#hamburger-btn');
      await expect(page.locator('#nav-drawer')).toHaveClass(/open/);
      await expect(page.locator('#nav-overlay')).toHaveClass(/visible/);
    });

    test('mode label opens drawer', async ({ page }) => {
      await page.click('#current-mode-label');
      await expect(page.locator('#nav-drawer')).toHaveClass(/open/);
    });

    test('close button closes drawer', async ({ page }) => {
      await page.click('#hamburger-btn');
      await page.click('#drawer-close');
      await expect(page.locator('#nav-drawer')).not.toHaveClass(/open/);
    });

    test('overlay click closes drawer', async ({ page }) => {
      await page.click('#hamburger-btn');
      await page.click('#nav-overlay');
      await expect(page.locator('#nav-drawer')).not.toHaveClass(/open/);
    });

    test('escape key closes drawer', async ({ page }) => {
      await page.click('#hamburger-btn');
      await page.keyboard.press('Escape');
      await expect(page.locator('#nav-drawer')).not.toHaveClass(/open/);
    });

    test('selecting mode switches view', async ({ page }) => {
      await page.click('#hamburger-btn');
      await page.click('.menu-item[data-mode="favorites"]');

      await expect(page.locator('.menu-item[data-mode="favorites"]')).toHaveClass(/active/);
      await expect(page.locator('#current-mode-label')).toHaveText('Favorites');
    });

    test('drawer stays open after selection', async ({ page }) => {
      await page.click('#hamburger-btn');
      await page.click('.menu-item[data-mode="favorites"]');

      await expect(page.locator('#nav-drawer')).toHaveClass(/open/);
    });

    test('about button opens modal', async ({ page }) => {
      await page.click('#hamburger-btn');
      await page.click('#nav-about');

      await expect(page.locator('#about-modal')).toBeVisible();
    });

  });

  test.describe('Desktop Sidebar', () => {

    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto('/');
    });

    test('sidebar is visible by default', async ({ page }) => {
      await expect(page.locator('#nav-drawer')).toBeVisible();
      await expect(page.locator('#hamburger-btn')).not.toBeVisible();
    });

    test('toggle collapses sidebar', async ({ page }) => {
      await page.click('#sidebar-toggle');
      await expect(page.locator('#nav-drawer')).toHaveClass(/collapsed/);
    });

    test('collapsed state persists', async ({ page }) => {
      await page.click('#sidebar-toggle');
      await page.reload();
      await expect(page.locator('#nav-drawer')).toHaveClass(/collapsed/);
    });

    test('toggle expands collapsed sidebar', async ({ page }) => {
      await page.click('#sidebar-toggle');
      await page.click('#sidebar-toggle');
      await expect(page.locator('#nav-drawer')).not.toHaveClass(/collapsed/);
    });

    test('menu items show text when expanded', async ({ page }) => {
      await expect(page.locator('.menu-text').first()).toBeVisible();
    });

    test('menu items hide text when collapsed', async ({ page }) => {
      await page.click('#sidebar-toggle');
      await expect(page.locator('.menu-text').first()).not.toBeVisible();
    });

  });

  test.describe('Mode Switching', () => {

    test('active state matches current mode', async ({ page }) => {
      await page.goto('/');

      // Default should be watched
      await expect(page.locator('.menu-item[data-mode="watched"]')).toHaveClass(/active/);
    });

    test('switching mode updates active state', async ({ page }) => {
      await page.goto('/');
      await page.click('.menu-item[data-mode="predictions"]');

      await expect(page.locator('.menu-item[data-mode="predictions"]')).toHaveClass(/active/);
      await expect(page.locator('.menu-item[data-mode="watched"]')).not.toHaveClass(/active/);
    });

    test('mode persists across page reload', async ({ page }) => {
      await page.goto('/');
      await page.click('.menu-item[data-mode="favorites"]');
      await page.reload();

      await expect(page.locator('.menu-item[data-mode="favorites"]')).toHaveClass(/active/);
    });

  });

  test.describe('Share Menu Item', () => {

    test('share is hidden in watched mode', async ({ page }) => {
      await page.goto('/');
      await page.click('.menu-item[data-mode="watched"]');

      await expect(page.locator('#nav-share-section')).not.toBeVisible();
    });

    test('share is visible in predictions mode', async ({ page }) => {
      await page.goto('/');
      await page.click('.menu-item[data-mode="predictions"]');

      await expect(page.locator('#nav-share-section')).toBeVisible();
    });

    test('share is disabled when no predictions made', async ({ page }) => {
      await page.goto('/');
      await page.click('.menu-item[data-mode="predictions"]');

      await expect(page.locator('#nav-share')).toHaveClass(/disabled/);
    });

    test('share is enabled when predictions exist', async ({ page }) => {
      await page.goto('/');
      await page.click('.menu-item[data-mode="predictions"]');

      // Make a prediction
      await page.click('#films-list .film:first-child');

      await expect(page.locator('#nav-share')).not.toHaveClass(/disabled/);
    });

    test('share button opens share modal', async ({ page }) => {
      await page.goto('/');
      await page.click('.menu-item[data-mode="predictions"]');
      await page.click('#films-list .film:first-child');
      await page.click('#nav-share');

      await expect(page.locator('#share-modal')).toBeVisible();
    });

  });

  test.describe('Accessibility', () => {

    test('hamburger button has aria-label', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      await expect(page.locator('#hamburger-btn')).toHaveAttribute('aria-label', /navigation/i);
    });

    test('active menu item has aria-current', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('.menu-item.active')).toHaveAttribute('aria-current', 'page');
    });

    test('drawer has navigation role', async ({ page }) => {
      await page.goto('/');

      await expect(page.locator('#nav-drawer')).toHaveAttribute('role', 'navigation');
    });

    test('disabled share has aria-disabled', async ({ page }) => {
      await page.goto('/');
      await page.click('.menu-item[data-mode="predictions"]');

      await expect(page.locator('#nav-share')).toHaveAttribute('aria-disabled', 'true');
    });

  });

});
```

---

## Migration Notes

### Backwards Compatibility

1. **Mode dropdown removal**: The `<select id="mode-select">` element is removed. Any code referencing this element must be updated.

2. **Mode switching**: The `handleModeChange` function is replaced by `switchMode`. Internal mode switching logic is preserved.

3. **Shared lists**: Shared lists (stored with `shared:` prefix) continue to work. They appear in the navigation menu below the divider.

4. **localStorage keys**:
   - `currentMode` — unchanged
   - `sidebarCollapsed` — new key for desktop sidebar state

### CSS Class Changes

| Old | New |
|-----|-----|
| `.mode-select` | Removed |
| — | `.nav-drawer` |
| — | `.menu-item` |
| — | `.hamburger-btn` |
| — | `.current-mode-label` |

---

## UX Research References

This design follows established best practices:

- **[Nielsen Norman Group - Vertical Navigation](https://www.nngroup.com/articles/vertical-nav/)**: Left-side vertical navigation scales well and translates naturally between desktop and mobile.

- **[Interaction Design Foundation - Hamburger Menus](https://www.interaction-design.org/literature/article/hamburger-menu-ux)**: Hamburger menus work best for secondary navigation; primary actions should remain visible.

- **[NN/g - Hidden Navigation](https://www.nngroup.com/articles/hamburger-menus/)**: Desktop users benefit from visible navigation; hiding it reduces engagement. Our desktop sidebar addresses this.

- **Mobile Navigation Patterns 2026**: Modern apps supplement hamburgers with persistent navigation elements where space allows.

---

## Open Questions

1. **Shared lists in menu**: Should shared lists appear dynamically in the navigation, or remain accessible only through direct URL?

2. **Category quick-switch**: On desktop, should the sidebar also show category navigation for the current mode?

3. **Gesture support**: Should mobile drawer support swipe-to-open from left edge?

---

## Summary

This feature replaces the dropdown-based mode switcher with a modern, responsive navigation system:

| Device | Navigation Style |
|--------|------------------|
| Mobile (< 768px) | Hamburger icon → Slide-in drawer |
| Desktop (≥ 768px) | Persistent left sidebar (collapsible) |

**Key benefits:**
- Improved discoverability of list types
- Consistent navigation pattern across devices
- Room for future menu items (About included)
- Follows established UX best practices
- Maintains backwards compatibility with existing mode/data storage
