// Oscar Tracker App
// 98th Academy Awards (2026)

// Version and Changelog
const APP_VERSION = '1.1.0';
const CHANGELOG = [
    { version: '1.1.0', description: 'Share predictions with friends via URL' },
    { version: '1.0.0', description: 'Initial release - track watched films and make predictions' }
];

// Oscar ceremony date (March 15, 2026, 7pm ET)
const OSCAR_DATE = new Date('2026-03-15T19:00:00-05:00');

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
    },
    {
        id: 'best-documentary-feature',
        name: 'Best Documentary Feature',
        nominees: [
            { id: 'doc-alabama', title: 'The Alabama Solution', subtitle: 'Andrew Jarecki & Charlotte Kaufman' },
            { id: 'doc-goodlight', title: 'Come See Me in the Good Light', subtitle: 'Ryan White' },
            { id: 'doc-rocks', title: 'Cutting through Rocks', subtitle: 'Sara Khaki & Mohammadreza Eyni' },
            { id: 'doc-putin', title: 'Mr. Nobody against Putin', subtitle: 'Vera Krichevskaya' },
            { id: 'doc-seeds', title: 'Seeds', subtitle: 'Brittany Shyne' }
        ]
    },
    {
        id: 'best-cinematography',
        name: 'Best Cinematography',
        nominees: [
            { id: 'cin-frankenstein', title: 'Frankenstein', subtitle: 'Dan Laustsen' },
            { id: 'cin-marty', title: 'Marty Supreme', subtitle: 'Darius Khondji' },
            { id: 'cin-onebattle', title: 'One Battle After Another', subtitle: 'Ari Wegner' },
            { id: 'cin-sinners', title: 'Sinners', subtitle: 'Autumn Durald Arkapaw' },
            { id: 'cin-traindreams', title: 'Train Dreams', subtitle: 'Lol Crawley' }
        ]
    },
    {
        id: 'best-film-editing',
        name: 'Best Film Editing',
        nominees: [
            { id: 'edit-f1', title: 'F1', subtitle: 'Stephen Mirrione' },
            { id: 'edit-marty', title: 'Marty Supreme', subtitle: 'Ronald Bronstein & Josh Safdie' },
            { id: 'edit-onebattle', title: 'One Battle After Another', subtitle: 'Andy Jurgensen' },
            { id: 'edit-sentimental', title: 'Sentimental Value', subtitle: 'Olivier Bugge Coutté' },
            { id: 'edit-sinners', title: 'Sinners', subtitle: 'Michael P. Shawver' }
        ]
    },
    {
        id: 'best-production-design',
        name: 'Best Production Design',
        nominees: [
            { id: 'prod-frankenstein', title: 'Frankenstein', subtitle: 'Tamara Deverell & Shane Vieau' },
            { id: 'prod-hamnet', title: 'Hamnet', subtitle: 'Fiona Crombie & Alice Felton' },
            { id: 'prod-marty', title: 'Marty Supreme', subtitle: 'Jack Fisk & Adam Willis' },
            { id: 'prod-onebattle', title: 'One Battle After Another', subtitle: 'Florencia Martin & Anthony Carlino' },
            { id: 'prod-sinners', title: 'Sinners', subtitle: 'Hannah Beachler & Monique Champagne' }
        ]
    },
    {
        id: 'best-costume-design',
        name: 'Best Costume Design',
        nominees: [
            { id: 'cost-avatar', title: 'Avatar: Fire and Ash', subtitle: 'Deborah L. Scott' },
            { id: 'cost-frankenstein', title: 'Frankenstein', subtitle: 'Luis Sequeira' },
            { id: 'cost-hamnet', title: 'Hamnet', subtitle: 'Sandy Powell' },
            { id: 'cost-marty', title: 'Marty Supreme', subtitle: 'Courtney Hoffman' },
            { id: 'cost-sinners', title: 'Sinners', subtitle: 'Ruth E. Carter' }
        ]
    },
    {
        id: 'best-makeup-hairstyling',
        name: 'Best Makeup and Hairstyling',
        nominees: [
            { id: 'makeup-frankenstein', title: 'Frankenstein', subtitle: 'Mike Hill, Jordan Samuel & Cliona Furey' },
            { id: 'makeup-kokuho', title: 'Kokuho', subtitle: 'Kyoko Toyokawa, Naomi Hibino & Tadashi Nishimatsu' },
            { id: 'makeup-sinners', title: 'Sinners', subtitle: 'Ken Diaz, Mike Fontaine & Shunika Terry' },
            { id: 'makeup-smashing', title: 'The Smashing Machine', subtitle: 'Kazu Hiro, Glen Griffin & Bjoern Rehbein' },
            { id: 'makeup-ugly', title: 'The Ugly Stepsister', subtitle: 'Thomas Foldberg & Anne Cathrine Sauerberg' }
        ]
    },
    {
        id: 'best-original-score',
        name: 'Best Original Score',
        nominees: [
            { id: 'score-bugonia', title: 'Bugonia', subtitle: 'Jerskin Fendrix' },
            { id: 'score-frankenstein', title: 'Frankenstein', subtitle: 'Alexandre Desplat' },
            { id: 'score-hamnet', title: 'Hamnet', subtitle: 'Max Richter' },
            { id: 'score-onebattle', title: 'One Battle After Another', subtitle: 'Jonny Greenwood' },
            { id: 'score-sinners', title: 'Sinners', subtitle: 'Ludwig Göransson' }
        ]
    },
    {
        id: 'best-original-song',
        name: 'Best Original Song',
        nominees: [
            { id: 'song-dearme', title: '"Dear Me"', subtitle: 'Diane Warren: Relentless' },
            { id: 'song-golden', title: '"Golden"', subtitle: 'KPop Demon Hunters' },
            { id: 'song-ilied', title: '"I Lied to You"', subtitle: 'Sinners' },
            { id: 'song-sweetdreams', title: '"Sweet Dreams of Joy"', subtitle: 'Viva Verdi!' },
            { id: 'song-traindreams', title: '"Train Dreams"', subtitle: 'Train Dreams' }
        ]
    },
    {
        id: 'best-sound',
        name: 'Best Sound',
        nominees: [
            { id: 'sound-f1', title: 'F1', subtitle: 'Mark Weingarten & James H. Mather' },
            { id: 'sound-frankenstein', title: 'Frankenstein', subtitle: 'Randy Thom & Gary Rydstrom' },
            { id: 'sound-onebattle', title: 'One Battle After Another', subtitle: 'Richard King' },
            { id: 'sound-sinners', title: 'Sinners', subtitle: 'Steve Boeddeker & Brandon Proctor' },
            { id: 'sound-sirat', title: 'Sirât', subtitle: 'Olivier Goinard' }
        ]
    },
    {
        id: 'best-visual-effects',
        name: 'Best Visual Effects',
        nominees: [
            { id: 'vfx-avatar', title: 'Avatar: Fire and Ash', subtitle: 'Joe Letteri & Eric Saindon' },
            { id: 'vfx-f1', title: 'F1', subtitle: 'Alex Wuttke' },
            { id: 'vfx-jurassic', title: 'Jurassic World Rebirth', subtitle: 'David Vickery' },
            { id: 'vfx-lostbus', title: 'The Lost Bus', subtitle: 'Charmaine Chan' },
            { id: 'vfx-sinners', title: 'Sinners', subtitle: 'Erik Henry' }
        ]
    },
    {
        id: 'best-casting',
        name: 'Best Casting',
        nominees: [
            { id: 'cast-hamnet', title: 'Hamnet', subtitle: 'Nina Gold' },
            { id: 'cast-marty', title: 'Marty Supreme', subtitle: 'Francine Maisler' },
            { id: 'cast-onebattle', title: 'One Battle After Another', subtitle: 'Cassandra Kulukundis' },
            { id: 'cast-sentimental', title: 'Sentimental Value', subtitle: 'Kjersti Paulsen' },
            { id: 'cast-sinners', title: 'Sinners', subtitle: 'Kim Coleman' }
        ]
    }
];

const STORAGE_KEY = 'oscar-tracker-watched';
const CATEGORY_KEY = 'oscar-tracker-category';
const PREDICTIONS_KEY = 'oscar-tracker-predictions';
const MODE_KEY = 'oscar-tracker-mode';
const SHARED_LISTS_KEY = 'oscar-tracker-shared-lists';
const SHARER_NAME_KEY = 'oscar-tracker-sharer-name';

// Film-to-nominees mapping for cross-category tracking
// When a film is checked, all related nominees are also checked
const FILM_NOMINEES = {
    'sinners': ['sinners', 'dir-coogler', 'actor-jordan', 'supp-actor-lindo', 'supp-actress-mosaku', 'orig-sinners', 'cin-sinners', 'edit-sinners', 'prod-sinners', 'cost-sinners', 'makeup-sinners', 'score-sinners', 'song-ilied', 'sound-sinners', 'vfx-sinners', 'cast-sinners'],
    'one-battle-after-another': ['one-battle-after-another', 'dir-anderson', 'actor-dicaprio', 'supp-actor-deltoro', 'supp-actor-penn', 'supp-actress-taylor', 'adapt-onebattle', 'cin-onebattle', 'edit-onebattle', 'prod-onebattle', 'score-onebattle', 'sound-onebattle', 'cast-onebattle'],
    'marty-supreme': ['marty-supreme', 'dir-safdie', 'actor-chalamet', 'supp-actress-paltrow', 'orig-marty', 'cin-marty', 'edit-marty', 'prod-marty', 'cost-marty', 'cast-marty'],
    'hamnet': ['hamnet', 'dir-zhao', 'actress-buckley', 'adapt-hamnet', 'prod-hamnet', 'cost-hamnet', 'score-hamnet', 'cast-hamnet'],
    'frankenstein': ['frankenstein', 'supp-actor-elordi', 'adapt-frankenstein', 'cin-frankenstein', 'prod-frankenstein', 'cost-frankenstein', 'makeup-frankenstein', 'score-frankenstein', 'sound-frankenstein'],
    'sentimental-value': ['sentimental-value', 'dir-trier', 'actress-reinsve', 'supp-actor-skarsgard', 'supp-actress-fanning', 'supp-actress-lilleaas', 'orig-sentimental', 'intl-sentimental', 'edit-sentimental', 'cast-sentimental'],
    'train-dreams': ['train-dreams', 'adapt-traindreams', 'cin-traindreams', 'song-traindreams'],
    'bugonia': ['bugonia', 'actress-stone', 'score-bugonia'],
    'f1': ['f1', 'edit-f1', 'sound-f1', 'vfx-f1'],
    'secret-agent': ['secret-agent', 'actor-moura', 'adapt-secretagent'],
    'it-was-just-an-accident': ['orig-accident', 'intl-accident'],
    'arco': ['anim-arco', 'intl-arco'],
    'little-amelie': ['anim-amelie', 'intl-amelie'],
    'kpop-demon-hunters': ['anim-kpop', 'song-golden'],
    'avatar-fire-and-ash': ['cost-avatar', 'vfx-avatar'],
    'blue-moon': ['actor-hawke', 'orig-bluemoon'],
    'im-still-here': ['intl-stillhere']
};

// Build reverse lookup: nominee ID -> film key
const NOMINEE_TO_FILM = {};
for (const [filmKey, nomineeIds] of Object.entries(FILM_NOMINEES)) {
    for (const nomineeId of nomineeIds) {
        NOMINEE_TO_FILM[nomineeId] = filmKey;
    }
}

// All unique films with titles and nomination counts (sorted by nominations desc)
const ALL_FILMS = [
    { key: 'sinners', title: 'Sinners', nominations: 16 },
    { key: 'one-battle-after-another', title: 'One Battle After Another', nominations: 13 },
    { key: 'marty-supreme', title: 'Marty Supreme', nominations: 10 },
    { key: 'frankenstein', title: 'Frankenstein', nominations: 9 },
    { key: 'sentimental-value', title: 'Sentimental Value', nominations: 10 },
    { key: 'hamnet', title: 'Hamnet', nominations: 8 },
    { key: 'train-dreams', title: 'Train Dreams', nominations: 4 },
    { key: 'f1', title: 'F1', nominations: 4 },
    { key: 'bugonia', title: 'Bugonia', nominations: 3 },
    { key: 'secret-agent', title: 'The Secret Agent', nominations: 3 },
    { key: 'blue-moon', title: 'Blue Moon', nominations: 2 },
    { key: 'it-was-just-an-accident', title: 'It Was Just an Accident', nominations: 2 },
    { key: 'arco', title: 'Arco', nominations: 2 },
    { key: 'little-amelie', title: 'The Little Amelie', nominations: 2 },
    { key: 'kpop-demon-hunters', title: 'KPop Demon Hunters', nominations: 2 },
    { key: 'avatar-fire-and-ash', title: 'Avatar: Fire and Ash', nominations: 2 },
    { key: 'im-still-here', title: "I'm Still Here", nominations: 1 }
].sort((a, b) => b.nominations - a.nominations);

// Streaming service availability for films
// Based on research: Netflix, Max, and Apple TV+ are top services with Oscar nominees
const FILM_STREAMING = {
    'sinners': 'max',
    'one-battle-after-another': 'max',
    'frankenstein': 'netflix',
    'train-dreams': 'netflix',
    'kpop-demon-hunters': 'netflix',
    'f1': 'appletv'
};

// Get streaming service for a nominee (if available)
function getStreamingService(nomineeId) {
    const filmKey = NOMINEE_TO_FILM[nomineeId];
    if (filmKey && FILM_STREAMING[filmKey]) {
        return FILM_STREAMING[filmKey];
    }
    return null;
}

// Get all related nominee IDs for a given nominee
function getRelatedNominees(nomineeId) {
    const filmKey = NOMINEE_TO_FILM[nomineeId];
    if (filmKey) {
        return FILM_NOMINEES[filmKey];
    }
    return [nomineeId];
}

// State
let watchedItems = new Set();
let currentCategoryIndex = 0;
let predictions = {}; // { categoryId: nomineeId }
let currentMode = 'watched'; // 'watched' | 'predictions' | 'shared:{id}'
let sharedLists = []; // Array of { id, name, predictions, receivedAt }
let currentSharedId = null; // ID of currently viewed shared list
let pendingSharedData = null; // Temp storage for duplicate handling

// DOM Elements
const filmsList = document.getElementById('films-list');
const progressEl = document.getElementById('progress');
const progressElBottom = document.getElementById('progress-bottom');
const categorySelect = document.getElementById('category-select');
const categorySelectBottom = document.getElementById('category-select-bottom');
const prevBtn = document.getElementById('prev-category');
const nextBtn = document.getElementById('next-category');
const prevBtnBottom = document.getElementById('prev-category-bottom');
const nextBtnBottom = document.getElementById('next-category-bottom');
const hardRefreshBtn = document.getElementById('hard-refresh');
const categoryHeader = document.querySelector('.category-header');
const onboardingScreen = document.getElementById('onboarding-screen');
const categoryScreen = document.getElementById('category-screen');
const allFilmsList = document.getElementById('all-films-list');
const browseByCategory = document.getElementById('browse-by-category');
const tipContent = document.getElementById('tip-content');
const modeSelect = document.getElementById('mode-select');
const aboutLink = document.getElementById('about-link');
const aboutModal = document.getElementById('about-modal');
const aboutClose = document.getElementById('about-close');
const modalBackdrop = aboutModal?.querySelector('.modal-backdrop');
const versionBadge = document.getElementById('version-badge');
const countdownDays = document.getElementById('countdown-days');
const changelogList = document.getElementById('changelog-list');

// Tips for rotation
const TIPS = [
    'Tap a film to mark as watched',
    'Use arrow keys to navigate categories',
    'Your progress is saved automatically',
    'Swipe left/right to change categories',
    'Films you watch appear across all categories',
    'Tap streaming icons to find where to watch'
];
let currentTipIndex = 0;
let tipRotationInterval = null;

// Update tip display
function updateTip() {
    // Always show first tip if user hasn't watched anything
    if (watchedItems.size === 0) {
        tipContent.textContent = TIPS[0];
        return;
    }

    tipContent.textContent = TIPS[currentTipIndex];
}

// Rotate to next tip
function rotateTip() {
    // Skip rotation if user hasn't watched anything
    if (watchedItems.size === 0) {
        return;
    }

    currentTipIndex = (currentTipIndex + 1) % TIPS.length;
    updateTip();
}

// Start tip rotation
function startTipRotation() {
    updateTip();
    tipRotationInterval = setInterval(rotateTip, 8000);
}

// Check if a film is watched (by checking any of its nominees)
function isFilmWatched(filmKey) {
    const nominees = FILM_NOMINEES[filmKey];
    return nominees && nominees.some(id => watchedItems.has(id));
}

// Toggle film watched state (for all-films view)
function toggleFilmWatched(filmKey, filmEl) {
    const nominees = FILM_NOMINEES[filmKey];
    if (!nominees) return;

    const isCurrentlyWatched = isFilmWatched(filmKey);

    if (isCurrentlyWatched) {
        nominees.forEach(id => watchedItems.delete(id));
        filmEl.classList.remove('watched');
        filmEl.setAttribute('aria-checked', 'false');
    } else {
        nominees.forEach(id => watchedItems.add(id));
        filmEl.classList.add('watched');
        filmEl.setAttribute('aria-checked', 'true');
    }

    saveWatchedItems();
    updateTip();
}

// Render all films list (for onboarding screen)
function renderAllFilms() {
    allFilmsList.innerHTML = ALL_FILMS.map(film => {
        const watched = isFilmWatched(film.key);
        const nomText = film.nominations === 1 ? '1 nom' : `${film.nominations} noms`;
        return `
        <li class="film ${watched ? 'watched' : ''}"
            data-film-key="${film.key}"
            role="checkbox"
            aria-checked="${watched}"
            tabindex="0">
            <div class="checkbox">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="film-info">
                <div class="film-title">${film.title}</div>
            </div>
            <span class="nomination-badge">${nomText}</span>
        </li>
    `}).join('');

    // Add event listeners
    allFilmsList.querySelectorAll('.film').forEach(el => {
        el.addEventListener('click', (e) => {
            const filmKey = el.dataset.filmKey;
            toggleFilmWatched(filmKey, el);
        });
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const filmKey = el.dataset.filmKey;
                toggleFilmWatched(filmKey, el);
            }
        });
    });
}

// Show onboarding screen
function showOnboardingScreen() {
    onboardingScreen.style.display = '';
    categoryScreen.style.display = 'none';
    renderAllFilms();
}

// Show category screen
function showCategoryScreen() {
    onboardingScreen.style.display = 'none';
    categoryScreen.style.display = '';
    renderNominees();
    updateProgress();
}

// ============================================
// SHARING FEATURE
// ============================================

// Encode predictions to compact string (21 chars, one per category)
function encodePredictions(preds) {
    return CATEGORIES.map(cat => {
        const nomineeId = preds[cat.id];
        if (!nomineeId) return '-';
        const index = cat.nominees.findIndex(n => n.id === nomineeId);
        return index >= 0 && index <= 9 ? index.toString() : '-';
    }).join('');
}

// Decode compact string to predictions object
function decodePredictions(encoded) {
    if (!encoded || typeof encoded !== 'string' || encoded.length !== 21) {
        return {};
    }
    const preds = {};
    for (let i = 0; i < CATEGORIES.length && i < encoded.length; i++) {
        const char = encoded[i];
        if (char !== '-' && char >= '0' && char <= '9') {
            const index = parseInt(char, 10);
            const category = CATEGORIES[i];
            if (category && category.nominees[index]) {
                preds[category.id] = category.nominees[index].id;
            }
        }
    }
    return preds;
}

// Check if encoded string is valid
function isValidEncodedString(str) {
    if (!str || typeof str !== 'string' || str.length !== 21) return false;
    return /^[0-9\-]{21}$/.test(str);
}

// Generate full share URL
function generateShareURL(preds, name) {
    const encoded = encodePredictions(preds);
    const encodedName = encodeURIComponent(name || 'Friend');
    return `${window.location.origin}${window.location.pathname}?p=${encoded}&name=${encodedName}`;
}

// Parse URL parameters for shared predictions
function parseShareParams() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('p');
    const name = params.get('name');

    if (!encoded) return null;
    if (!isValidEncodedString(encoded)) return null;

    const preds = decodePredictions(encoded);
    // Sanitize incoming name - remove non-printing chars and limit length
    const sanitized = sanitizeName(decodeURIComponent(name || 'Friend')).substring(0, 30) || 'Friend';
    return {
        predictions: preds,
        name: sanitized,
        encoded: encoded
    };
}

// Check if predictions have any selections
function hasAnyPredictions(preds) {
    return Object.keys(preds || predictions).length > 0;
}

// Sanitize name - remove non-printing characters and trim whitespace
function sanitizeName(name) {
    if (!name) return '';
    // Remove non-printing characters (control chars, zero-width chars, etc.)
    return name.replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, '').trim();
}

// Normalize name for comparison (lowercase + sanitized)
function normalizeName(name) {
    return sanitizeName(name).toLowerCase();
}

// Check if two prediction objects match
function predictionsMatch(a, b) {
    const encodedA = encodePredictions(a || {});
    const encodedB = encodePredictions(b || {});
    return encodedA === encodedB;
}

// Find existing shared list by name
function findExistingByName(name) {
    const normalized = normalizeName(name);
    return sharedLists.find(list => normalizeName(list.name) === normalized);
}

// Load shared lists from localStorage
function loadSharedLists() {
    try {
        const stored = localStorage.getItem(SHARED_LISTS_KEY);
        if (stored) {
            sharedLists = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Could not load shared lists:', e);
        sharedLists = [];
    }
}

// Save shared lists to localStorage
function saveSharedLists() {
    try {
        localStorage.setItem(SHARED_LISTS_KEY, JSON.stringify(sharedLists));
    } catch (e) {
        console.warn('Could not save shared lists:', e);
    }
}

// Add a new shared list
function addSharedList(name, preds) {
    const id = normalizeName(name) + '-' + Date.now();
    const newList = {
        id: id,
        name: name,
        predictions: preds,
        receivedAt: new Date().toISOString()
    };
    sharedLists.push(newList);
    saveSharedLists();
    return newList;
}

// Update an existing shared list
function updateSharedList(id, preds) {
    const list = sharedLists.find(l => l.id === id);
    if (list) {
        list.predictions = preds;
        list.receivedAt = new Date().toISOString();
        saveSharedLists();
    }
}

// Remove a shared list
function removeSharedList(id) {
    sharedLists = sharedLists.filter(l => l.id !== id);
    saveSharedLists();
}

// Get next available name with number suffix
function getNextAvailableName(baseName) {
    let count = 2;
    let newName = `${baseName} (${count})`;
    while (findExistingByName(newName)) {
        count++;
        newName = `${baseName} (${count})`;
    }
    return newName;
}

// Load saved sharer name
function loadSharerName() {
    try {
        return localStorage.getItem(SHARER_NAME_KEY) || '';
    } catch (e) {
        return '';
    }
}

// Save sharer name
function saveSharerName(name) {
    try {
        localStorage.setItem(SHARER_NAME_KEY, name);
    } catch (e) {
        console.warn('Could not save sharer name:', e);
    }
}

// Show toast notification
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (e) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch (e2) {
            document.body.removeChild(textarea);
            return false;
        }
    }
}

// Check if currently in a shared view mode
function isSharedMode() {
    return currentMode.startsWith('shared:');
}

// Get current shared list (if viewing one)
function getCurrentSharedList() {
    if (!isSharedMode()) return null;
    const id = currentMode.substring(7); // Remove 'shared:' prefix
    return sharedLists.find(l => l.id === id);
}

// Switch to shared list view
function switchToSharedList(id) {
    currentMode = `shared:${id}`;
    currentSharedId = id;
    saveMode();
    updateModeDropdown();
    renderNominees();
    updateProgress();
    updateShareDeleteButton();
    updateSharedBanner();
}

// Handle incoming shared URL
function handleIncomingShare(shareData) {
    const existing = findExistingByName(shareData.name);

    if (!existing) {
        // New person - add and switch
        const newList = addSharedList(shareData.name, shareData.predictions);
        updateModeDropdown();
        switchToSharedList(newList.id);
        // Clear URL params
        window.history.replaceState({}, '', window.location.pathname);
    } else if (predictionsMatch(existing.predictions, shareData.predictions)) {
        // Same predictions - just switch to existing
        switchToSharedList(existing.id);
        window.history.replaceState({}, '', window.location.pathname);
    } else {
        // Different predictions - show duplicate modal
        pendingSharedData = shareData;
        pendingSharedData.existingId = existing.id;
        showDuplicateModal(shareData.name);
    }
}

// Update mode dropdown with shared lists
function updateModeDropdown() {
    const select = modeSelect;
    if (!select) return;

    // Clear existing options
    select.innerHTML = '';

    // Add base options
    const watchedOpt = document.createElement('option');
    watchedOpt.value = 'watched';
    watchedOpt.textContent = 'Watched';
    select.appendChild(watchedOpt);

    const predictionsOpt = document.createElement('option');
    predictionsOpt.value = 'predictions';
    predictionsOpt.textContent = 'Predictions';
    select.appendChild(predictionsOpt);

    // Add separator and shared lists if any
    if (sharedLists.length > 0) {
        const separator = document.createElement('option');
        separator.disabled = true;
        separator.textContent = '──────────';
        select.appendChild(separator);

        sharedLists.forEach(list => {
            const opt = document.createElement('option');
            opt.value = `shared:${list.id}`;
            opt.textContent = `${list.name}'s Picks`;
            select.appendChild(opt);
        });
    }

    // Set current value
    select.value = currentMode;
}

// Update share/delete button visibility and state
function updateShareDeleteButton() {
    const shareBtn = document.getElementById('share-btn');
    const deleteBtn = document.getElementById('delete-btn');

    if (currentMode === 'predictions') {
        // Show share button
        if (shareBtn) {
            shareBtn.style.display = '';
            shareBtn.disabled = !hasAnyPredictions(predictions);
        }
        if (deleteBtn) deleteBtn.style.display = 'none';
    } else if (isSharedMode()) {
        // Show delete button
        if (shareBtn) shareBtn.style.display = 'none';
        if (deleteBtn) deleteBtn.style.display = '';
    } else {
        // Watched mode - hide both
        if (shareBtn) shareBtn.style.display = 'none';
        if (deleteBtn) deleteBtn.style.display = 'none';
    }
}

// Update shared banner visibility
function updateSharedBanner() {
    const banner = document.getElementById('shared-banner');
    if (!banner) return;

    if (isSharedMode()) {
        const list = getCurrentSharedList();
        if (list) {
            const textSpan = document.getElementById('shared-banner-text');
            if (textSpan) {
                textSpan.textContent = `👁 Viewing ${list.name}'s predictions (read-only)`;
            }
            banner.style.display = '';
        }
    } else {
        banner.style.display = 'none';
    }
}

// Show share modal
function showShareModal() {
    const modal = document.getElementById('share-modal');
    if (!modal) return;

    const nameInput = document.getElementById('share-name-input');
    if (nameInput) {
        nameInput.value = loadSharerName() || '';
    }

    // Enable the share button (we have a default of "Friend" if empty)
    const shareBtn = document.getElementById('share-copy');
    if (shareBtn) {
        shareBtn.disabled = false;
    }

    modal.hidden = false;
    document.body.classList.add('modal-open');

    if (nameInput) nameInput.focus();
}

// Hide share modal
function hideShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
    }
}

// Check if Web Share API is available
function canUseWebShare() {
    return typeof navigator.share === 'function';
}

// Handle share button click
async function handleShare() {
    const nameInput = document.getElementById('share-name-input');
    const name = sanitizeName(nameInput?.value) || 'Friend';

    saveSharerName(name);

    const url = generateShareURL(predictions, name);

    hideShareModal();

    // Try native share first (Android, iOS, some desktop browsers)
    if (canUseWebShare()) {
        try {
            await navigator.share({
                title: 'Oscar Predictions',
                text: `Check out ${name}'s Oscar predictions for the 98th Academy Awards!`,
                url: url
            });
            // Native share was successful (user may have shared or cancelled)
            return;
        } catch (e) {
            // User cancelled or share failed - fall back to clipboard
            if (e.name === 'AbortError') {
                // User cancelled - don't show toast
                return;
            }
            // Other error - fall through to clipboard copy
            console.warn('Web Share failed, falling back to clipboard:', e);
        }
    }

    // Fallback: copy to clipboard
    const success = await copyToClipboard(url);

    if (success) {
        showToast('Link copied! Share it with your friends.');
    } else {
        showToast('Could not copy link. Please try again.');
    }
}

// Show duplicate modal
function showDuplicateModal(name) {
    const modal = document.getElementById('duplicate-modal');
    if (!modal) return;

    const nameSpan = modal.querySelector('.duplicate-name');
    if (nameSpan) nameSpan.textContent = name;

    modal.hidden = false;
    document.body.classList.add('modal-open');
}

// Hide duplicate modal
function hideDuplicateModal() {
    const modal = document.getElementById('duplicate-modal');
    if (modal) {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
    }
    pendingSharedData = null;
}

// Handle duplicate update action
function handleDuplicateUpdate() {
    if (!pendingSharedData) return;

    updateSharedList(pendingSharedData.existingId, pendingSharedData.predictions);
    switchToSharedList(pendingSharedData.existingId);
    window.history.replaceState({}, '', window.location.pathname);
    hideDuplicateModal();
}

// Handle duplicate keep both action
function handleDuplicateKeepBoth() {
    if (!pendingSharedData) return;

    const newName = getNextAvailableName(pendingSharedData.name);
    const newList = addSharedList(newName, pendingSharedData.predictions);
    updateModeDropdown();
    switchToSharedList(newList.id);
    window.history.replaceState({}, '', window.location.pathname);
    hideDuplicateModal();
}

// Handle duplicate cancel action
function handleDuplicateCancel() {
    if (pendingSharedData) {
        // Switch to existing list instead
        switchToSharedList(pendingSharedData.existingId);
    }
    window.history.replaceState({}, '', window.location.pathname);
    hideDuplicateModal();
}

// Show delete confirmation modal
function showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (!modal) return;

    const list = getCurrentSharedList();
    if (!list) return;

    const nameSpan = modal.querySelector('.delete-name');
    if (nameSpan) nameSpan.textContent = list.name;

    modal.hidden = false;
    document.body.classList.add('modal-open');
}

// Hide delete modal
function hideDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
    }
}

// Handle delete confirm
function handleDeleteConfirm() {
    const list = getCurrentSharedList();
    if (!list) return;

    removeSharedList(list.id);

    // Switch to watched mode
    currentMode = 'watched';
    currentSharedId = null;
    saveMode();

    updateModeDropdown();
    renderNominees();
    updateProgress();
    updateShareDeleteButton();
    updateSharedBanner();

    hideDeleteModal();
    showToast('Shared list removed');
}

// Initialize


function init() {
    loadWatchedItems();
    loadPredictions();
    loadCurrentCategory();
    loadSharedLists();
    loadMode();
    renderCategoryOptions();
    updateModeDropdown();
    setupEventListeners();
    registerServiceWorker();
    startTipRotation();

    // Check for incoming shared URL
    const shareData = parseShareParams();
    if (shareData) {
        // Always show category screen for shared links
        showCategoryScreen();
        handleIncomingShare(shareData);
        return;
    }

    // Validate current mode (shared list might have been deleted)
    if (isSharedMode()) {
        const list = getCurrentSharedList();
        if (!list) {
            currentMode = 'watched';
            saveMode();
        }
    }

    updateModeDropdown();
    updateShareDeleteButton();
    updateSharedBanner();

    // Show onboarding if no films watched and in watched mode, otherwise show category view
    if (currentMode === 'watched' && watchedItems.size === 0) {
        showOnboardingScreen();
    } else {
        showCategoryScreen();
    }
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

// Load predictions from localStorage
function loadPredictions() {
    try {
        const stored = localStorage.getItem(PREDICTIONS_KEY);
        if (stored) {
            predictions = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Could not load predictions:', e);
    }
}

// Save predictions to localStorage
function savePredictions() {
    try {
        localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions));
    } catch (e) {
        console.warn('Could not save predictions:', e);
    }
}

// Load current mode from localStorage
function loadMode() {
    try {
        const stored = localStorage.getItem(MODE_KEY);
        if (stored && (stored === 'watched' || stored === 'predictions')) {
            currentMode = stored;
            modeSelect.value = currentMode;
        }
    } catch (e) {
        console.warn('Could not load mode:', e);
    }
}

// Save current mode to localStorage
function saveMode() {
    try {
        localStorage.setItem(MODE_KEY, currentMode);
    } catch (e) {
        console.warn('Could not save mode:', e);
    }
}

// Get current category
function getCurrentCategory() {
    return CATEGORIES[currentCategoryIndex];
}

// Render category options in both selects
function renderCategoryOptions() {
    const optionsHtml = CATEGORIES.map((cat, index) => {
        // Remove "Best " prefix since it's shown as a separate label
        const displayName = cat.name.replace(/^Best /, '');
        return `<option value="${index}" ${index === currentCategoryIndex ? 'selected' : ''}>${displayName}</option>`;
    }).join('');
    categorySelect.innerHTML = optionsHtml;
    categorySelectBottom.innerHTML = optionsHtml;
}

// Get the display title for a film (for streaming links)
function getFilmTitle(nomineeId) {
    const filmKey = NOMINEE_TO_FILM[nomineeId];
    if (!filmKey) return null;

    // Map film keys to their display titles
    const filmTitles = {
        'sinners': 'Sinners',
        'one-battle-after-another': 'One Battle After Another',
        'frankenstein': 'Frankenstein',
        'train-dreams': 'Train Dreams',
        'kpop-demon-hunters': 'KPop Demon Hunters',
        'f1': 'F1'
    };
    return filmTitles[filmKey] || null;
}

// Generate streaming icon HTML with link
function getStreamingIconHtml(nomineeId) {
    const service = getStreamingService(nomineeId);
    if (!service) return '';

    const filmTitle = getFilmTitle(nomineeId);
    if (!filmTitle) return '';

    const encodedTitle = encodeURIComponent(filmTitle);

    const serviceConfig = {
        netflix: {
            url: `https://www.netflix.com/search?q=${encodedTitle}`,
            icon: '/icons/netflix.svg',
            name: 'Netflix'
        },
        max: {
            url: `https://play.max.com/search?q=${encodedTitle}`,
            icon: '/icons/max.svg',
            name: 'Max'
        },
        appletv: {
            url: `https://tv.apple.com/search?term=${encodedTitle}`,
            icon: '/icons/appletv.svg',
            name: 'Apple TV+'
        }
    };

    const config = serviceConfig[service];
    if (!config) return '';

    return `<a href="${config.url}" target="_blank" rel="noopener noreferrer" class="streaming-icon" title="Watch on ${config.name}" onclick="event.stopPropagation()">
        <img src="${config.icon}" alt="${config.name}">
    </a>`;
}

// Render nominees list
function renderNominees() {
    const category = getCurrentCategory();
    const isPredictionsMode = currentMode === 'predictions';
    const isSharedView = isSharedMode();
    const sharedList = isSharedView ? getCurrentSharedList() : null;

    // Get the predictions to display
    let displayPredictions = predictions;
    if (isSharedView && sharedList) {
        displayPredictions = sharedList.predictions;
    }
    const predictedNominee = displayPredictions[category.id];

    filmsList.innerHTML = category.nominees.map(nominee => {
        const streamingIcon = getStreamingIconHtml(nominee.id);
        const hasStreaming = streamingIcon !== '';

        // Determine state based on mode
        let isSelected, stateClass, role;
        if (isPredictionsMode || isSharedView) {
            isSelected = predictedNominee === nominee.id;
            stateClass = 'predicted';
            role = 'radio';
        } else {
            isSelected = watchedItems.has(nominee.id);
            stateClass = 'watched';
            role = 'checkbox';
        }

        // Add shared-view class for read-only styling
        const sharedViewClass = isSharedView ? ' shared-view' : '';

        // Icon: star for predictions/shared, checkmark for watched
        const iconSvg = (isPredictionsMode || isSharedView)
            ? `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
               </svg>`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
               </svg>`;

        return `
        <li class="film ${isSelected ? stateClass : ''}${sharedViewClass}"
            data-id="${nominee.id}"
            role="${role}"
            aria-checked="${isSelected}"
            tabindex="${isSharedView ? -1 : 0}">
            <div class="checkbox">
                ${iconSvg}
            </div>
            <div class="film-info">
                <div class="film-title">${nominee.title}</div>
                <div class="film-studio">${nominee.subtitle}</div>
            </div>
            <div class="streaming-box ${hasStreaming ? '' : 'empty'}">
                ${streamingIcon}
            </div>
        </li>
    `}).join('');

    // Add event listeners (only for non-shared modes)
    if (!isSharedView) {
        document.querySelectorAll('#films-list .film').forEach(el => {
            el.addEventListener('click', handleNomineeClick);
            el.addEventListener('keydown', handleNomineeKeydown);
        });
    }
}

// Handle nominee click
function handleNomineeClick(e) {
    const filmEl = e.currentTarget;
    const nomineeId = filmEl.dataset.id;

    if (currentMode === 'predictions') {
        togglePrediction(nomineeId);
    } else {
        toggleNominee(nomineeId, filmEl);
    }
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
    const relatedNominees = getRelatedNominees(nomineeId);
    const isCurrentlyWatched = watchedItems.has(nomineeId);

    if (isCurrentlyWatched) {
        // Uncheck all related nominees
        relatedNominees.forEach(id => watchedItems.delete(id));
        filmEl.classList.remove('watched');
        filmEl.setAttribute('aria-checked', 'false');
    } else {
        // Check all related nominees
        relatedNominees.forEach(id => watchedItems.add(id));
        filmEl.classList.add('watched');
        filmEl.setAttribute('aria-checked', 'true');
    }

    saveWatchedItems();
    updateProgress();
    updateTip();
}

// Toggle prediction for a nominee (single-select per category)
function togglePrediction(nomineeId) {
    const category = getCurrentCategory();
    const currentPrediction = predictions[category.id];

    // Remove predicted state from previous selection
    if (currentPrediction) {
        const prevEl = document.querySelector(`.film[data-id="${currentPrediction}"]`);
        if (prevEl) {
            prevEl.classList.remove('predicted');
            prevEl.setAttribute('aria-checked', 'false');
        }
    }

    if (currentPrediction === nomineeId) {
        // Clicking the same nominee clears the prediction
        delete predictions[category.id];
    } else {
        // Set new prediction
        predictions[category.id] = nomineeId;
        // Add predicted state to new selection
        const newEl = document.querySelector(`.film[data-id="${nomineeId}"]`);
        if (newEl) {
            newEl.classList.add('predicted');
            newEl.setAttribute('aria-checked', 'true');
        }
    }

    savePredictions();
    updateProgress();
    updateShareDeleteButton();
}

// Update progress display
function updateProgress() {
    const category = getCurrentCategory();
    let progressText;
    let titleProgress;

    if (currentMode === 'predictions') {
        // For predictions: show how many categories have predictions
        const predictedCount = Object.keys(predictions).length;
        const totalCategories = CATEGORIES.length;
        const hasPrediction = predictions[category.id] ? '✓' : '○';
        progressText = hasPrediction;
        titleProgress = predictedCount > 0 ? `${predictedCount}/${totalCategories}` : null;
    } else if (isSharedMode()) {
        // For shared view: show progress for shared predictions
        const sharedList = getCurrentSharedList();
        if (sharedList) {
            const predictedCount = Object.keys(sharedList.predictions).length;
            const totalCategories = CATEGORIES.length;
            const hasPrediction = sharedList.predictions[category.id] ? '✓' : '○';
            progressText = hasPrediction;
            titleProgress = `${predictedCount}/${totalCategories}`;
        } else {
            progressText = '○';
            titleProgress = null;
        }
    } else {
        // For watched: show watched count for this category
        const watched = category.nominees.filter(n => watchedItems.has(n.id)).length;
        const total = category.nominees.length;
        progressText = `${watched} / ${total}`;

        const totalWatched = CATEGORIES.reduce((sum, cat) =>
            sum + cat.nominees.filter(n => watchedItems.has(n.id)).length, 0
        );
        const totalNominees = CATEGORIES.reduce((sum, cat) => sum + cat.nominees.length, 0);
        titleProgress = totalWatched > 0 ? `${totalWatched}/${totalNominees}` : null;
    }

    progressEl.textContent = progressText;
    progressElBottom.textContent = progressText;

    // Update document title with progress
    document.title = titleProgress
        ? `Oscar Tracker (${titleProgress})`
        : 'Oscar Tracker';
}

// Navigate to category
function navigateToCategory(index, scrollToTop = false) {
    currentCategoryIndex = index;
    saveCurrentCategory();
    categorySelect.value = index;
    categorySelectBottom.value = index;
    renderNominees();
    updateProgress();
    if (scrollToTop) {
        const headerTop = categoryHeader.getBoundingClientRect().top + window.scrollY;
        const offset = 16; // Small margin above the header
        window.scrollTo({ top: headerTop - offset, behavior: 'smooth' });
    }
}

// Go to previous category
function prevCategory(scrollToTop = false) {
    const newIndex = currentCategoryIndex === 0
        ? CATEGORIES.length - 1
        : currentCategoryIndex - 1;
    navigateToCategory(newIndex, scrollToTop);
}

// Go to next category
function nextCategory(scrollToTop = false) {
    const newIndex = currentCategoryIndex === CATEGORIES.length - 1
        ? 0
        : currentCategoryIndex + 1;
    navigateToCategory(newIndex, scrollToTop);
}

// Handle mode change
function handleModeChange(e) {
    currentMode = e.target.value;
    currentSharedId = isSharedMode() ? currentMode.substring(7) : null;
    saveMode();
    renderNominees();
    updateProgress();
    updateShareDeleteButton();
    updateSharedBanner();
}

// Setup event listeners
function setupEventListeners() {
    categorySelect.addEventListener('change', (e) => {
        navigateToCategory(parseInt(e.target.value, 10));
    });

    categorySelectBottom.addEventListener('change', (e) => {
        navigateToCategory(parseInt(e.target.value, 10), true);
    });

    prevBtn.addEventListener('click', () => prevCategory(false));
    nextBtn.addEventListener('click', () => nextCategory(false));
    prevBtnBottom.addEventListener('click', () => prevCategory(true));
    nextBtnBottom.addEventListener('click', () => nextCategory(true));
    hardRefreshBtn.addEventListener('click', hardRefresh);
    browseByCategory.addEventListener('click', showCategoryScreen);
    modeSelect.addEventListener('change', handleModeChange);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Close modals on Escape
        if (e.key === 'Escape') {
            if (aboutModal && !aboutModal.hidden) {
                hideAboutModal();
                return;
            }
            const shareModal = document.getElementById('share-modal');
            if (shareModal && !shareModal.hidden) {
                hideShareModal();
                return;
            }
            const deleteModal = document.getElementById('delete-modal');
            if (deleteModal && !deleteModal.hidden) {
                hideDeleteModal();
                return;
            }
            const duplicateModal = document.getElementById('duplicate-modal');
            if (duplicateModal && !duplicateModal.hidden) {
                hideDuplicateModal();
                return;
            }
        }

        if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;

        if (e.key === 'ArrowLeft') {
            prevCategory(false);
        } else if (e.key === 'ArrowRight') {
            nextCategory(false);
        }
    });

    // About modal event listeners
    if (aboutLink) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAboutModal();
        });
    }

    if (aboutClose) {
        aboutClose.addEventListener('click', hideAboutModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', hideAboutModal);
    }

    // Share button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', showShareModal);
    }

    // Share modal events
    const shareModalClose = document.querySelector('#share-modal .modal-close');
    if (shareModalClose) {
        shareModalClose.addEventListener('click', hideShareModal);
    }

    const shareModalBackdrop = document.querySelector('#share-modal .modal-backdrop');
    if (shareModalBackdrop) {
        shareModalBackdrop.addEventListener('click', hideShareModal);
    }

    const shareCancelBtn = document.getElementById('share-cancel');
    if (shareCancelBtn) {
        shareCancelBtn.addEventListener('click', hideShareModal);
    }

    const shareBtn2 = document.getElementById('share-copy');
    if (shareBtn2) {
        shareBtn2.addEventListener('click', handleShare);
    }

    // Delete button
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', showDeleteModal);
    }

    // Delete modal events
    const deleteModalClose = document.querySelector('#delete-modal .modal-close');
    if (deleteModalClose) {
        deleteModalClose.addEventListener('click', hideDeleteModal);
    }

    const deleteModalBackdrop = document.querySelector('#delete-modal .modal-backdrop');
    if (deleteModalBackdrop) {
        deleteModalBackdrop.addEventListener('click', hideDeleteModal);
    }

    const deleteCancelBtn = document.getElementById('delete-cancel');
    if (deleteCancelBtn) {
        deleteCancelBtn.addEventListener('click', hideDeleteModal);
    }

    const deleteConfirmBtn = document.getElementById('delete-confirm');
    if (deleteConfirmBtn) {
        deleteConfirmBtn.addEventListener('click', handleDeleteConfirm);
    }

    // Duplicate modal events
    const duplicateModalClose = document.querySelector('#duplicate-modal .modal-close');
    if (duplicateModalClose) {
        duplicateModalClose.addEventListener('click', handleDuplicateCancel);
    }

    const duplicateModalBackdrop = document.querySelector('#duplicate-modal .modal-backdrop');
    if (duplicateModalBackdrop) {
        duplicateModalBackdrop.addEventListener('click', handleDuplicateCancel);
    }

    const duplicateUpdateBtn = document.getElementById('duplicate-update');
    if (duplicateUpdateBtn) {
        duplicateUpdateBtn.addEventListener('click', handleDuplicateUpdate);
    }

    const duplicateKeepBothBtn = document.getElementById('duplicate-keep-both');
    if (duplicateKeepBothBtn) {
        duplicateKeepBothBtn.addEventListener('click', handleDuplicateKeepBoth);
    }

    const duplicateCancelBtn = document.getElementById('duplicate-cancel');
    if (duplicateCancelBtn) {
        duplicateCancelBtn.addEventListener('click', handleDuplicateCancel);
    }

    // Shared banner close button
    const sharedBannerClose = document.querySelector('#shared-banner .shared-banner-close');
    if (sharedBannerClose) {
        sharedBannerClose.addEventListener('click', () => {
            const banner = document.getElementById('shared-banner');
            if (banner) banner.style.display = 'none';
        });
    }
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

// About Modal Functions
function showAboutModal() {
    updateCountdown();
    renderChangelog();
    if (versionBadge) versionBadge.textContent = `v${APP_VERSION}`;
    if (aboutModal) {
        aboutModal.hidden = false;
        document.body.classList.add('modal-open');
    }
}

function hideAboutModal() {
    if (aboutModal) {
        aboutModal.hidden = true;
        document.body.classList.remove('modal-open');
    }
}

function updateCountdown() {
    if (!countdownDays) return;

    const now = new Date();
    const diff = OSCAR_DATE - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days > 1) {
        countdownDays.textContent = `${days} days remaining`;
    } else if (days === 1) {
        countdownDays.textContent = 'Tomorrow!';
    } else if (days === 0) {
        countdownDays.textContent = 'Tonight!';
    } else {
        countdownDays.textContent = 'The ceremony has aired';
    }
}

function renderChangelog() {
    if (!changelogList) return;

    changelogList.innerHTML = CHANGELOG.map(entry => `
        <div class="changelog-entry">
            <strong>v${entry.version}</strong> - ${entry.description}
        </div>
    `).join('');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
