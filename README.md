# Oscar Tracker 🏆

A progressive web app for tracking which Oscar-nominated films you've watched.

## Features

- **Best Picture Tracker** - Check off films as you watch them
- **Persistent Storage** - Your progress is saved locally
- **Works Offline** - Full PWA with service worker caching
- **iOS Optimized** - Includes all Apple-specific PWA tags and splash screens
- **Beautiful UI** - Elegant gold and black awards-show aesthetic

## Installation

### As a PWA

**iOS Safari:**
1. Open the site in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

**Android Chrome:**
1. Open the site in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home screen" or "Install app"

### For Development

Just serve the files with any static server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node
npx serve

# Using PHP
php -S localhost:8000
```

## Deploying to GitHub Pages

1. Create a new repository on GitHub
2. Push this code to the repository
3. Go to Settings → Pages
4. Set source to "Deploy from a branch" and select `main` / `root`
5. Your site will be available at `https://username.github.io/repo-name`

## File Structure

```
oscar-tracker/
├── index.html          # Main HTML with PWA meta tags
├── style.css           # Styles with CSS variables
├── app.js              # App logic and localStorage
├── sw.js               # Service worker for offline support
├── manifest.json       # Web app manifest
├── icons/              # App icons (all sizes)
│   ├── icon-*.png
│   └── icon-maskable-*.png
└── splash/             # iOS splash screens
    └── splash-*.png
```

## Customization

### Adding More Categories

Edit `app.js` and add more film arrays:

```javascript
const BEST_DIRECTOR = [
    { id: 'director1', title: 'Film Name', studio: 'Director Name' },
    // ...
];
```

### Changing Colors

Edit the CSS variables in `style.css`:

```css
:root {
    --color-gold: #d4af37;
    --color-black: #0a0a0a;
    /* ... */
}
```

## Tech Stack

- Vanilla HTML/CSS/JavaScript (no build step)
- Service Worker for offline caching
- localStorage for data persistence
- CSS custom properties for theming
- Google Fonts (Playfair Display + Libre Franklin)

## License

MIT
