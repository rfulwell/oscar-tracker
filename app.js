// Oscar Tracker App
// 97th Academy Awards - Best Picture Nominees (2025)

const FILMS = [
    { id: 'anora', title: 'Anora', studio: 'Neon' },
    { id: 'brutalist', title: 'The Brutalist', studio: 'A24' },
    { id: 'conclave', title: 'Conclave', studio: 'Focus Features' },
    { id: 'complete-unknown', title: 'A Complete Unknown', studio: 'Searchlight Pictures' },
    { id: 'dune2', title: 'Dune: Part Two', studio: 'Warner Bros.' },
    { id: 'emilia-perez', title: 'Emilia Pérez', studio: 'Netflix' },
    { id: 'im-still-here', title: "I'm Still Here", studio: 'Sony Pictures Classics' },
    { id: 'nickel-boys', title: 'Nickel Boys', studio: 'Amazon MGM Studios' },
    { id: 'substance', title: 'The Substance', studio: 'Mubi' },
    { id: 'wicked', title: 'Wicked', studio: 'Universal Pictures' }
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
