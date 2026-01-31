// Oscar Tracker App
// 98th Academy Awards - Best Picture Nominees (2026)

const FILMS = [
    { id: 'bugonia', title: 'Bugonia', studio: 'Focus Features' },
    { id: 'f1', title: 'F1', studio: 'Apple Original Films' },
    { id: 'frankenstein', title: 'Frankenstein', studio: 'Netflix' },
    { id: 'hamnet', title: 'Hamnet', studio: 'Focus Features' },
    { id: 'marty-supreme', title: 'Marty Supreme', studio: 'A24' },
    { id: 'one-battle-after-another', title: 'One Battle After Another', studio: 'Warner Bros.' },
    { id: 'secret-agent', title: 'The Secret Agent', studio: 'Neon' },
    { id: 'sentimental-value', title: 'Sentimental Value', studio: 'Neon' },
    { id: 'sinners', title: 'Sinners', studio: 'Warner Bros.' },
    { id: 'train-dreams', title: 'Train Dreams', studio: 'Netflix' }
];

const STORAGE_KEY = 'oscar-tracker-watched';

// State
let watchedFilms = new Set();

// DOM Elements
const filmsList = document.getElementById('films-list');
const progressEl = document.getElementById('progress');

// Initialize
function init() {
    loadWatchedFilms();
    renderFilms();
    updateProgress();
    registerServiceWorker();
}

// Load watched films from localStorage
function loadWatchedFilms() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            watchedFilms = new Set(JSON.parse(stored));
        }
    } catch (e) {
        console.warn('Could not load watched films:', e);
    }
}

// Save watched films to localStorage
function saveWatchedFilms() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...watchedFilms]));
    } catch (e) {
        console.warn('Could not save watched films:', e);
    }
}

// Render films list
function renderFilms() {
    filmsList.innerHTML = FILMS.map(film => `
        <li class="film ${watchedFilms.has(film.id) ? 'watched' : ''}" 
            data-id="${film.id}"
            role="checkbox"
            aria-checked="${watchedFilms.has(film.id)}"
            tabindex="0">
            <div class="checkbox">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="film-info">
                <div class="film-title">${film.title}</div>
                <div class="film-studio">${film.studio}</div>
            </div>
        </li>
    `).join('');

    // Add event listeners
    document.querySelectorAll('.film').forEach(el => {
        el.addEventListener('click', handleFilmClick);
        el.addEventListener('keydown', handleFilmKeydown);
    });
}

// Handle film click
function handleFilmClick(e) {
    const filmEl = e.currentTarget;
    const filmId = filmEl.dataset.id;
    
    toggleFilm(filmId, filmEl);
}

// Handle keyboard interaction
function handleFilmKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFilmClick(e);
    }
}

// Toggle film watched state
function toggleFilm(filmId, filmEl) {
    if (watchedFilms.has(filmId)) {
        watchedFilms.delete(filmId);
        filmEl.classList.remove('watched');
        filmEl.setAttribute('aria-checked', 'false');
    } else {
        watchedFilms.add(filmId);
        filmEl.classList.add('watched');
        filmEl.setAttribute('aria-checked', 'true');
    }
    
    saveWatchedFilms();
    updateProgress();
}

// Update progress display
function updateProgress() {
    const watched = watchedFilms.size;
    const total = FILMS.length;
    progressEl.textContent = `${watched} / ${total}`;
    
    // Update document title with progress
    document.title = watched > 0 
        ? `Oscar Tracker (${watched}/${total})` 
        : 'Oscar Tracker';
}

// Register service worker for PWA
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const registration = await navigator.serviceWorker.register('sw.js');
                console.log('ServiceWorker registered:', registration.scope);
            } catch (e) {
                console.warn('ServiceWorker registration failed:', e);
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
