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

// Streaming service availability for films
// Based on research: Netflix and Max are the top 2 services with Oscar nominees
const FILM_STREAMING = {
    'sinners': 'max',
    'one-battle-after-another': 'max',
    'frankenstein': 'netflix',
    'train-dreams': 'netflix',
    'kpop-demon-hunters': 'netflix'
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
const tipContent = document.getElementById('tip-content');

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

// Initialize
function init() {
    loadWatchedItems();
    loadCurrentCategory();
    renderCategoryOptions();
    renderNominees();
    updateProgress();
    setupEventListeners();
    registerServiceWorker();
    startTipRotation();
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
        'kpop-demon-hunters': 'KPop Demon Hunters'
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
            icon: 'icons/netflix.svg',
            name: 'Netflix'
        },
        max: {
            url: `https://play.max.com/search?q=${encodedTitle}`,
            icon: 'icons/max.svg',
            name: 'Max'
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

    filmsList.innerHTML = category.nominees.map(nominee => {
        const streamingIcon = getStreamingIconHtml(nominee.id);
        const hasStreaming = streamingIcon !== '';
        return `
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
            <div class="streaming-box ${hasStreaming ? '' : 'empty'}">
                ${streamingIcon}
            </div>
        </li>
    `}).join('');

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

// Update progress display
function updateProgress() {
    const category = getCurrentCategory();
    const watched = category.nominees.filter(n => watchedItems.has(n.id)).length;
    const total = category.nominees.length;
    const progressText = `${watched} / ${total}`;
    progressEl.textContent = progressText;
    progressElBottom.textContent = progressText;

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

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'SELECT') return;

        if (e.key === 'ArrowLeft') {
            prevCategory(false);
        } else if (e.key === 'ArrowRight') {
            nextCategory(false);
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
