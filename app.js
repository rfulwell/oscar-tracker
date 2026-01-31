// Oscar Tracker App
// 98th Academy Awards (2026)

const CATEGORIES = [
    {
        id: 'best-picture',
        name: 'Best Picture',
        nominees: [
            { id: 'bugonia', title: 'Bugonia', subtitle: 'Focus Features' },
            { id: 'f1', title: 'F1', subtitle: 'Apple Original Films' },
            { id: 'frankenstein', title: 'Frankenstein', subtitle: 'Netflix' },
            { id: 'hamnet', title: 'Hamnet', subtitle: 'Focus Features' },
            { id: 'marty-supreme', title: 'Marty Supreme', subtitle: 'A24' },
            { id: 'one-battle-after-another', title: 'One Battle After Another', subtitle: 'Warner Bros.' },
            { id: 'secret-agent', title: 'The Secret Agent', subtitle: 'Neon' },
            { id: 'sentimental-value', title: 'Sentimental Value', subtitle: 'Neon' },
            { id: 'sinners', title: 'Sinners', subtitle: 'Warner Bros.' },
            { id: 'train-dreams', title: 'Train Dreams', subtitle: 'Netflix' }
        ]
    },
    {
        id: 'best-director',
        name: 'Best Director',
        nominees: [
            { id: 'dir-coogler', title: 'Ryan Coogler', subtitle: 'Sinners' },
            { id: 'dir-anderson', title: 'Paul Thomas Anderson', subtitle: 'One Battle After Another' },
            { id: 'dir-safdie', title: 'Josh Safdie', subtitle: 'Marty Supreme' },
            { id: 'dir-zhao', title: 'Chloé Zhao', subtitle: 'Hamnet' },
            { id: 'dir-trier', title: 'Joachim Trier', subtitle: 'Sentimental Value' }
        ]
    },
    {
        id: 'best-actor',
        name: 'Best Actor',
        nominees: [
            { id: 'actor-chalamet', title: 'Timothée Chalamet', subtitle: 'Marty Supreme' },
            { id: 'actor-dicaprio', title: 'Leonardo DiCaprio', subtitle: 'One Battle After Another' },
            { id: 'actor-hawke', title: 'Ethan Hawke', subtitle: 'Blue Moon' },
            { id: 'actor-jordan', title: 'Michael B. Jordan', subtitle: 'Sinners' },
            { id: 'actor-moura', title: 'Wagner Moura', subtitle: 'The Secret Agent' }
        ]
    },
    {
        id: 'best-actress',
        name: 'Best Actress',
        nominees: [
            { id: 'actress-buckley', title: 'Jessie Buckley', subtitle: 'Hamnet' },
            { id: 'actress-byrne', title: 'Rose Byrne', subtitle: 'If I Had Legs I\'d Kick You' },
            { id: 'actress-hudson', title: 'Kate Hudson', subtitle: 'Song Sung Blue' },
            { id: 'actress-reinsve', title: 'Renate Reinsve', subtitle: 'Sentimental Value' },
            { id: 'actress-stone', title: 'Emma Stone', subtitle: 'Bugonia' }
        ]
    },
    {
        id: 'best-supporting-actor',
        name: 'Best Supporting Actor',
        nominees: [
            { id: 'supp-actor-elordi', title: 'Jacob Elordi', subtitle: 'Frankenstein' },
            { id: 'supp-actor-deltoro', title: 'Benicio Del Toro', subtitle: 'One Battle After Another' },
            { id: 'supp-actor-penn', title: 'Sean Penn', subtitle: 'One Battle After Another' },
            { id: 'supp-actor-lindo', title: 'Delroy Lindo', subtitle: 'Sinners' },
            { id: 'supp-actor-skarsgard', title: 'Stellan Skarsgård', subtitle: 'Sentimental Value' }
        ]
    },
    {
        id: 'best-supporting-actress',
        name: 'Best Supporting Actress',
        nominees: [
            { id: 'supp-actress-taylor', title: 'Teyana Taylor', subtitle: 'One Battle After Another' },
            { id: 'supp-actress-mosaku', title: 'Wunmi Mosaku', subtitle: 'Sinners' },
            { id: 'supp-actress-fanning', title: 'Elle Fanning', subtitle: 'Sentimental Value' },
            { id: 'supp-actress-lilleaas', title: 'Inga Ibsdotter Lilleaas', subtitle: 'Sentimental Value' },
            { id: 'supp-actress-paltrow', title: 'Gwyneth Paltrow', subtitle: 'Marty Supreme' }
        ]
    },
    {
        id: 'best-original-screenplay',
        name: 'Best Original Screenplay',
        nominees: [
            { id: 'orig-sinners', title: 'Sinners', subtitle: 'Ryan Coogler' },
            { id: 'orig-sentimental', title: 'Sentimental Value', subtitle: 'Eskil Vogt & Joachim Trier' },
            { id: 'orig-bluemoon', title: 'Blue Moon', subtitle: 'Richard Linklater' },
            { id: 'orig-marty', title: 'Marty Supreme', subtitle: 'Ronald Bronstein & Josh Safdie' },
            { id: 'orig-accident', title: 'It Was Just an Accident', subtitle: 'Jafar Panahi' }
        ]
    },
    {
        id: 'best-adapted-screenplay',
        name: 'Best Adapted Screenplay',
        nominees: [
            { id: 'adapt-onebattle', title: 'One Battle After Another', subtitle: 'Paul Thomas Anderson' },
            { id: 'adapt-traindreams', title: 'Train Dreams', subtitle: 'Clint Bentley & Greg Kwedar' },
            { id: 'adapt-frankenstein', title: 'Frankenstein', subtitle: 'Guillermo del Toro' },
            { id: 'adapt-hamnet', title: 'Hamnet', subtitle: 'Chloé Zhao' },
            { id: 'adapt-secretagent', title: 'The Secret Agent', subtitle: 'Fernando Meirelles' }
        ]
    },
    {
        id: 'best-animated-feature',
        name: 'Best Animated Feature',
        nominees: [
            { id: 'anim-arco', title: 'Arco', subtitle: 'Neon' },
            { id: 'anim-elio', title: 'Elio', subtitle: 'Disney/Pixar' },
            { id: 'anim-kpop', title: 'KPop Demon Hunters', subtitle: 'Netflix' },
            { id: 'anim-amelie', title: 'Little Amélie or the Character of Rain', subtitle: 'GKIDS' },
            { id: 'anim-zootopia2', title: 'Zootopia 2', subtitle: 'Disney' }
        ]
    },
    {
        id: 'best-international-feature',
        name: 'Best International Feature',
        nominees: [
            { id: 'intl-sentimental', title: 'Sentimental Value', subtitle: 'Norway' },
            { id: 'intl-amelie', title: 'Little Amélie or the Character of Rain', subtitle: 'France' },
            { id: 'intl-accident', title: 'It Was Just an Accident', subtitle: 'Iran' },
            { id: 'intl-stillhere', title: 'I\'m Still Here', subtitle: 'Brazil' },
            { id: 'intl-arco', title: 'Arco', subtitle: 'France' }
        ]
    }
];

const STORAGE_KEY = 'oscar-tracker-watched';
const CATEGORY_KEY = 'oscar-tracker-category';

// State
let watchedItems = new Set();
let currentCategoryIndex = 0;

// DOM Elements
const filmsList = document.getElementById('films-list');
const progressEl = document.getElementById('progress');
const categorySelect = document.getElementById('category-select');
const prevBtn = document.getElementById('prev-category');
const nextBtn = document.getElementById('next-category');
const hardRefreshBtn = document.getElementById('hard-refresh');

// Initialize
function init() {
    loadWatchedItems();
    loadCurrentCategory();
    renderCategoryOptions();
    renderNominees();
    updateProgress();
    setupEventListeners();
    registerServiceWorker();
}

// Load watched items from localStorage
function loadWatchedItems() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            watchedItems = new Set(JSON.parse(stored));
        }
    } catch (e) {
        console.warn('Could not load watched items:', e);
    }
}

// Save watched items to localStorage
function saveWatchedItems() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...watchedItems]));
    } catch (e) {
        console.warn('Could not save watched items:', e);
    }
}

// Load current category from localStorage
function loadCurrentCategory() {
    try {
        const stored = localStorage.getItem(CATEGORY_KEY);
        if (stored) {
            const index = CATEGORIES.findIndex(c => c.id === stored);
            if (index !== -1) {
                currentCategoryIndex = index;
            }
        }
    } catch (e) {
        console.warn('Could not load category:', e);
    }
}

// Save current category to localStorage
function saveCurrentCategory() {
    try {
        localStorage.setItem(CATEGORY_KEY, CATEGORIES[currentCategoryIndex].id);
    } catch (e) {
        console.warn('Could not save category:', e);
    }
}

// Get current category
function getCurrentCategory() {
    return CATEGORIES[currentCategoryIndex];
}

// Render category options in select
function renderCategoryOptions() {
    categorySelect.innerHTML = CATEGORIES.map((cat, index) =>
        `<option value="${index}" ${index === currentCategoryIndex ? 'selected' : ''}>${cat.name}</option>`
    ).join('');
}

// Render nominees list
function renderNominees() {
    const category = getCurrentCategory();

    filmsList.innerHTML = category.nominees.map(nominee => `
        <li class="film ${watchedItems.has(nominee.id) ? 'watched' : ''}"
            data-id="${nominee.id}"
            role="checkbox"
            aria-checked="${watchedItems.has(nominee.id)}"
            tabindex="0">
            <div class="checkbox">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="film-info">
                <div class="film-title">${nominee.title}</div>
                <div class="film-studio">${nominee.subtitle}</div>
            </div>
        </li>
    `).join('');

    // Add event listeners
    document.querySelectorAll('.film').forEach(el => {
        el.addEventListener('click', handleNomineeClick);
        el.addEventListener('keydown', handleNomineeKeydown);
    });
}

// Handle nominee click
function handleNomineeClick(e) {
    const filmEl = e.currentTarget;
    const filmId = filmEl.dataset.id;

    toggleNominee(filmId, filmEl);
}

// Handle keyboard interaction
function handleNomineeKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNomineeClick(e);
    }
}

// Toggle nominee watched state
function toggleNominee(nomineeId, filmEl) {
    if (watchedItems.has(nomineeId)) {
        watchedItems.delete(nomineeId);
        filmEl.classList.remove('watched');
        filmEl.setAttribute('aria-checked', 'false');
    } else {
        watchedItems.add(nomineeId);
        filmEl.classList.add('watched');
        filmEl.setAttribute('aria-checked', 'true');
    }

    saveWatchedItems();
    updateProgress();
}

// Update progress display
function updateProgress() {
    const category = getCurrentCategory();
    const watched = category.nominees.filter(n => watchedItems.has(n.id)).length;
    const total = category.nominees.length;
    progressEl.textContent = `${watched} / ${total}`;

    // Update document title with total progress
    const totalWatched = CATEGORIES.reduce((sum, cat) =>
        sum + cat.nominees.filter(n => watchedItems.has(n.id)).length, 0
    );
    const totalNominees = CATEGORIES.reduce((sum, cat) => sum + cat.nominees.length, 0);

    document.title = totalWatched > 0
        ? `Oscar Tracker (${totalWatched}/${totalNominees})`
        : 'Oscar Tracker';
}

// Navigate to category
function navigateToCategory(index) {
    currentCategoryIndex = index;
    saveCurrentCategory();
    categorySelect.value = index;
    renderNominees();
    updateProgress();
}

// Go to previous category
function prevCategory() {
    const newIndex = currentCategoryIndex === 0
        ? CATEGORIES.length - 1
        : currentCategoryIndex - 1;
    navigateToCategory(newIndex);
}

// Go to next category
function nextCategory() {
    const newIndex = currentCategoryIndex === CATEGORIES.length - 1
        ? 0
        : currentCategoryIndex + 1;
    navigateToCategory(newIndex);
}

// Setup event listeners
function setupEventListeners() {
    categorySelect.addEventListener('change', (e) => {
        navigateToCategory(parseInt(e.target.value, 10));
    });

    prevBtn.addEventListener('click', prevCategory);
    nextBtn.addEventListener('click', nextCategory);
    hardRefreshBtn.addEventListener('click', hardRefresh);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'SELECT') return;

        if (e.key === 'ArrowLeft') {
            prevCategory();
        } else if (e.key === 'ArrowRight') {
            nextCategory();
        }
    });
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

// Hard refresh - unregister service worker, clear caches, and reload
async function hardRefresh() {
    try {
        // Unregister all service workers
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(r => r.unregister()));
        }

        // Clear all caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
        }

        // Force reload from server
        window.location.reload(true);
    } catch (e) {
        console.warn('Hard refresh failed:', e);
        window.location.reload(true);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
