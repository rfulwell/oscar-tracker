// Oscar Tracker App
// 98th Academy Awards (2026)

// Version and Changelog
const APP_VERSION = '1.2.0';
const CHANGELOG = [
    { version: '1.2.0', description: 'Streamable list — see what\'s streaming and where' },
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
            { id: 'supp-actress-madigan', title: 'Amy Madigan', subtitle: 'Weapons' }
        ]
    },
    {
        id: 'best-original-screenplay',
        name: 'Best Original Screenplay',
        nominees: [
            { id: 'orig-sinners', title: 'Sinners', subtitle: 'Ryan Coogler' },
            { id: 'orig-sentimental', title: 'Sentimental Value', subtitle: 'Eskil Vogt & Joachim Trier' },
            { id: 'orig-bluemoon', title: 'Blue Moon', subtitle: 'Robert Kaplow' },
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
            { id: 'adapt-bugonia', title: 'Bugonia', subtitle: 'Will Tracy' }
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
            { id: 'intl-secretagent', title: 'The Secret Agent', subtitle: 'Brazil' },
            { id: 'intl-sirat', title: 'Sirât', subtitle: 'Spain' },
            { id: 'intl-hind', title: 'The Voice of Hind Rajab', subtitle: 'Tunisia' },
            { id: 'intl-accident', title: 'It Was Just an Accident', subtitle: 'France' }
        ]
    },
    {
        id: 'best-documentary-feature',
        name: 'Best Documentary Feature',
        nominees: [
            { id: 'doc-alabama', title: 'The Alabama Solution', subtitle: 'Andrew Jarecki & Charlotte Kaufman' },
            { id: 'doc-goodlight', title: 'Come See Me in the Good Light', subtitle: 'Ryan White' },
            { id: 'doc-rocks', title: 'Cutting through Rocks', subtitle: 'Sara Khaki & Mohammadreza Eyni' },
            { id: 'doc-putin', title: 'Mr. Nobody against Putin', subtitle: 'David Borenstein, Pavel Talankin, Helle Faber & Alžběta Karásková' },
            { id: 'doc-neighbor', title: 'The Perfect Neighbor', subtitle: 'Geeta Gandbhir, Alisa Payne, Nikon Kwantu & Sam Bisbee' }
        ]
    },
    {
        id: 'best-cinematography',
        name: 'Best Cinematography',
        nominees: [
            { id: 'cin-frankenstein', title: 'Frankenstein', subtitle: 'Dan Laustsen' },
            { id: 'cin-marty', title: 'Marty Supreme', subtitle: 'Darius Khondji' },
            { id: 'cin-onebattle', title: 'One Battle After Another', subtitle: 'Michael Bauman' },
            { id: 'cin-sinners', title: 'Sinners', subtitle: 'Autumn Durald Arkapaw' },
            { id: 'cin-traindreams', title: 'Train Dreams', subtitle: 'Adolpho Veloso' }
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
            { id: 'cost-frankenstein', title: 'Frankenstein', subtitle: 'Kate Hawley' },
            { id: 'cost-hamnet', title: 'Hamnet', subtitle: 'Malgosia Turzanska' },
            { id: 'cost-marty', title: 'Marty Supreme', subtitle: 'Miyako Bellizzi' },
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
            { id: 'sound-f1', title: 'F1', subtitle: 'Gareth John, Al Nelson, Gwendolyn Yates Whittle, Gary A. Rizzo & Juan Peralta' },
            { id: 'sound-frankenstein', title: 'Frankenstein', subtitle: 'Greg Chapman, Nathan Robitaille, Nelson Ferreira, Christian Cooke & Brad Zoern' },
            { id: 'sound-onebattle', title: 'One Battle After Another', subtitle: 'José Antonio García, Christopher Scarabosio & Tony Villaflor' },
            { id: 'sound-sinners', title: 'Sinners', subtitle: 'Chris Welcker, Benjamin A. Burtt, Felipe Pacheco, Brandon Proctor & Steve Boeddeker' },
            { id: 'sound-sirat', title: 'Sirât', subtitle: 'Amanda Villavieja, Laia Casanovas & Yasmina Praderas' }
        ]
    },
    {
        id: 'best-visual-effects',
        name: 'Best Visual Effects',
        nominees: [
            { id: 'vfx-avatar', title: 'Avatar: Fire and Ash', subtitle: 'Joe Letteri, Richard Baneham, Eric Saindon & Daniel Barrett' },
            { id: 'vfx-f1', title: 'F1', subtitle: 'Ryan Tudhope, Nicolas Chevallier, Robert Harrington & Keith Dawson' },
            { id: 'vfx-jurassic', title: 'Jurassic World Rebirth', subtitle: 'David Vickery, Stephen Aplin, Charmaine Chan & Neil Corbould' },
            { id: 'vfx-lostbus', title: 'The Lost Bus', subtitle: 'Charlie Noble, David Zaretti, Russell Bowen & Brandon K. McLaughlin' },
            { id: 'vfx-sinners', title: 'Sinners', subtitle: 'Michael Ralla, Espen Nordahl, Guido Wolter & Donnie Dean' }
        ]
    },
    {
        id: 'best-casting',
        name: 'Best Casting',
        nominees: [
            { id: 'cast-hamnet', title: 'Hamnet', subtitle: 'Nina Gold' },
            { id: 'cast-marty', title: 'Marty Supreme', subtitle: 'Jennifer Venditti' },
            { id: 'cast-onebattle', title: 'One Battle After Another', subtitle: 'Cassandra Kulukundis' },
            { id: 'cast-secretagent', title: 'The Secret Agent', subtitle: 'Gabriel Domingues' },
            { id: 'cast-sinners', title: 'Sinners', subtitle: 'Francine Maisler' }
        ]
    },
    {
        id: 'best-animated-short',
        name: 'Best Animated Short Film',
        nominees: [
            { id: 'ashort-butterfly', title: 'Butterfly', subtitle: 'Florence Miailhe & Ron Dyens' },
            { id: 'ashort-forevergreen', title: 'Forevergreen', subtitle: 'Nathan Engelhardt & Jeremy Spears' },
            { id: 'ashort-pearls', title: 'The Girl Who Cried Pearls', subtitle: 'Chris Lavis & Maciek Szczerbowski' },
            { id: 'ashort-retirement', title: 'Retirement Plan', subtitle: 'John Kelly & Andrew Freedman' },
            { id: 'ashort-sisters', title: 'The Three Sisters', subtitle: 'Konstantin Bronzit' }
        ]
    },
    {
        id: 'best-documentary-short',
        name: 'Best Documentary Short Film',
        nominees: [
            { id: 'dshort-empty', title: 'All the Empty Rooms', subtitle: 'Joshua Seftel & Conall Jones' },
            { id: 'dshort-camera', title: 'Armed Only with a Camera: The Life and Death of Brent Renaud', subtitle: 'Craig Renaud & Juan Arredondo' },
            { id: 'dshort-children', title: 'Children No More: "Were and Are Gone"', subtitle: 'Hilla Medalia & Sheila Nevins' },
            { id: 'dshort-devil', title: 'The Devil Is Busy', subtitle: 'Christalyn Hampton & Geeta Gandbhir' },
            { id: 'dshort-strange', title: 'Perfectly a Strangeness', subtitle: 'Alison McAlpine' }
        ]
    },
    {
        id: 'best-live-action-short',
        name: 'Best Live Action Short Film',
        nominees: [
            { id: 'lshort-butcher', title: "Butcher's Stain", subtitle: 'Meyer Levinson-Blount & Oron Caspi' },
            { id: 'lshort-dorothy', title: 'A Friend of Dorothy', subtitle: 'Lee Knight & James Dean' },
            { id: 'lshort-austen', title: "Jane Austen's Period Drama", subtitle: 'Julia Aks & Steve Pinder' },
            { id: 'lshort-singers', title: 'The Singers', subtitle: 'Sam A. Davis & Jack Piatt' },
            { id: 'lshort-saliva', title: 'Two People Exchanging Saliva', subtitle: 'Alexandre Singh & Natalie Musteata' }
        ]
    }
];

const STORAGE_KEY = 'oscar-tracker-watched';
const CATEGORY_KEY = 'oscar-tracker-category';
const PREDICTIONS_KEY = 'oscar-tracker-predictions';
const FAVORITES_KEY = 'oscar-tracker-favorites';
const MODE_KEY = 'oscar-tracker-mode';
const SHARED_LISTS_KEY = 'oscar-tracker-shared-lists';
const SHARER_NAME_KEY = 'oscar-tracker-sharer-name';
const FAVORITES_COPY_DISMISSED_KEY = 'oscar-tracker-favorites-copy-dismissed';
const PREDICTIONS_COPY_DISMISSED_KEY = 'oscar-tracker-predictions-copy-dismissed';

// Film-to-nominees mapping for cross-category tracking
// When a film is checked, all related nominees are also checked
const FILM_NOMINEES = {
    'sinners': ['sinners', 'dir-coogler', 'actor-jordan', 'supp-actor-lindo', 'supp-actress-mosaku', 'orig-sinners', 'cin-sinners', 'edit-sinners', 'prod-sinners', 'cost-sinners', 'makeup-sinners', 'score-sinners', 'song-ilied', 'sound-sinners', 'vfx-sinners', 'cast-sinners'],
    'one-battle-after-another': ['one-battle-after-another', 'dir-anderson', 'actor-dicaprio', 'supp-actor-deltoro', 'supp-actor-penn', 'supp-actress-taylor', 'adapt-onebattle', 'cin-onebattle', 'edit-onebattle', 'prod-onebattle', 'score-onebattle', 'sound-onebattle', 'cast-onebattle'],
    'marty-supreme': ['marty-supreme', 'dir-safdie', 'actor-chalamet', 'orig-marty', 'cin-marty', 'edit-marty', 'prod-marty', 'cost-marty', 'cast-marty'],
    'hamnet': ['hamnet', 'dir-zhao', 'actress-buckley', 'adapt-hamnet', 'prod-hamnet', 'cost-hamnet', 'score-hamnet', 'cast-hamnet'],
    'frankenstein': ['frankenstein', 'supp-actor-elordi', 'adapt-frankenstein', 'cin-frankenstein', 'prod-frankenstein', 'cost-frankenstein', 'makeup-frankenstein', 'score-frankenstein', 'sound-frankenstein'],
    'sentimental-value': ['sentimental-value', 'dir-trier', 'actress-reinsve', 'supp-actor-skarsgard', 'supp-actress-fanning', 'supp-actress-lilleaas', 'orig-sentimental', 'intl-sentimental', 'edit-sentimental'],
    'train-dreams': ['train-dreams', 'adapt-traindreams', 'cin-traindreams', 'song-traindreams'],
    'bugonia': ['bugonia', 'actress-stone', 'adapt-bugonia', 'score-bugonia'],
    'f1': ['f1', 'edit-f1', 'sound-f1', 'vfx-f1'],
    'secret-agent': ['secret-agent', 'actor-moura', 'intl-secretagent', 'cast-secretagent'],
    'it-was-just-an-accident': ['orig-accident', 'intl-accident'],
    'arco': ['anim-arco'],
    'little-amelie': ['anim-amelie'],
    'kpop-demon-hunters': ['anim-kpop', 'song-golden'],
    'avatar-fire-and-ash': ['cost-avatar', 'vfx-avatar'],
    'blue-moon': ['actor-hawke', 'orig-bluemoon'],
    'sirat': ['intl-sirat', 'sound-sirat'],
    'voice-of-hind-rajab': ['intl-hind'],
    'if-i-had-legs': ['actress-byrne'],
    'song-sung-blue': ['actress-hudson'],
    'elio': ['anim-elio'],
    'zootopia-2': ['anim-zootopia2'],
    'alabama-solution': ['doc-alabama'],
    'come-see-me': ['doc-goodlight'],
    'perfect-neighbor': ['doc-neighbor'],
    'weapons': ['supp-actress-madigan'],
    'smashing-machine': ['makeup-smashing'],
    'ugly-stepsister': ['makeup-ugly'],
    'jurassic-world-rebirth': ['vfx-jurassic'],
    'lost-bus': ['vfx-lostbus']
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
    { key: 'marty-supreme', title: 'Marty Supreme', nominations: 9 },
    { key: 'sentimental-value', title: 'Sentimental Value', nominations: 9 },
    { key: 'frankenstein', title: 'Frankenstein', nominations: 9 },
    { key: 'hamnet', title: 'Hamnet', nominations: 8 },
    { key: 'train-dreams', title: 'Train Dreams', nominations: 4 },
    { key: 'f1', title: 'F1', nominations: 4 },
    { key: 'secret-agent', title: 'The Secret Agent', nominations: 4 },
    { key: 'bugonia', title: 'Bugonia', nominations: 4 },
    { key: 'sirat', title: 'Sirât', nominations: 2 },
    { key: 'blue-moon', title: 'Blue Moon', nominations: 2 },
    { key: 'it-was-just-an-accident', title: 'It Was Just an Accident', nominations: 2 },
    { key: 'kpop-demon-hunters', title: 'KPop Demon Hunters', nominations: 2 },
    { key: 'avatar-fire-and-ash', title: 'Avatar: Fire and Ash', nominations: 2 },
    { key: 'arco', title: 'Arco', nominations: 1 },
    { key: 'little-amelie', title: 'Little Amélie or the Character of Rain', nominations: 1 },
    { key: 'voice-of-hind-rajab', title: 'The Voice of Hind Rajab', nominations: 1 },
    { key: 'if-i-had-legs', title: 'If I Had Legs I\'d Kick You', nominations: 1 },
    { key: 'song-sung-blue', title: 'Song Sung Blue', nominations: 1 },
    { key: 'elio', title: 'Elio', nominations: 1 },
    { key: 'zootopia-2', title: 'Zootopia 2', nominations: 1 },
    { key: 'alabama-solution', title: 'The Alabama Solution', nominations: 1 },
    { key: 'come-see-me', title: 'Come See Me in the Good Light', nominations: 1 },
    { key: 'perfect-neighbor', title: 'The Perfect Neighbor', nominations: 1 },
    { key: 'smashing-machine', title: 'The Smashing Machine', nominations: 1 },
    { key: 'ugly-stepsister', title: 'The Ugly Stepsister', nominations: 1 },
    { key: 'jurassic-world-rebirth', title: 'Jurassic World Rebirth', nominations: 1 },
    { key: 'lost-bus', title: 'The Lost Bus', nominations: 1 },
    { key: 'weapons', title: 'Weapons', nominations: 1 }
].sort((a, b) => b.nominations - a.nominations);

// Streaming service availability for films (subscription streaming only, not rent/buy)
const FILM_STREAMING = {
    'sinners': 'max',
    'one-battle-after-another': 'max',
    'if-i-had-legs': 'max',
    'smashing-machine': 'max',
    'alabama-solution': 'max',
    'frankenstein': 'netflix',
    'train-dreams': 'netflix',
    'kpop-demon-hunters': 'netflix',
    'perfect-neighbor': 'netflix',
    'f1': 'appletv',
    'come-see-me': 'appletv',
    'lost-bus': 'appletv',
    'bugonia': 'peacock',
    'jurassic-world-rebirth': 'peacock',
    'ugly-stepsister': 'hulu',
    'elio': 'disneyplus'
};

// Streaming service configuration
const STREAMING_SERVICES = {
    netflix: {
        urlTemplate: 'https://www.netflix.com/search?q={title}',
        icon: '/icons/netflix.svg',
        name: 'Netflix'
    },
    max: {
        urlTemplate: 'https://play.max.com/search?q={title}',
        icon: '/icons/max.svg',
        name: 'Max'
    },
    appletv: {
        urlTemplate: 'https://tv.apple.com/search?term={title}',
        icon: '/icons/appletv.svg',
        name: 'Apple TV+'
    },
    peacock: {
        urlTemplate: 'https://www.peacocktv.com/watch/search?q={title}',
        icon: '/icons/peacock.svg',
        name: 'Peacock'
    },
    hulu: {
        urlTemplate: 'https://www.hulu.com/search?q={title}',
        icon: '/icons/hulu.svg',
        name: 'Hulu'
    },
    disneyplus: {
        urlTemplate: 'https://www.disneyplus.com/search/{title}',
        icon: '/icons/disneyplus.svg',
        name: 'Disney+'
    }
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
let favorites = {}; // { categoryId: nomineeId }
let pendingCopyTarget = null; // 'favorites' | 'predictions' - for copy modal

// Search state
let searchActive = false;         // Whether search view is shown
let searchQuery = '';             // Current search text
let searchSourceMode = null;      // Mode to return to after search
let searchSelectedFilm = null;    // Film key being viewed, or null for search input

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
    updateNavCounts();
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
function showCategoryScreen(scrollToTop = true) {
    onboardingScreen.style.display = 'none';
    categoryScreen.style.display = '';
    renderNominees();
    updateProgress();
    if (scrollToTop) {
        const stickyHeader = document.querySelector('.ceremony-info');
        const stickyHeight = stickyHeader ? stickyHeader.offsetHeight : 0;
        const headerTop = categoryHeader.getBoundingClientRect().top + window.scrollY;
        const offset = stickyHeight + 8; // Account for sticky header + small margin
        window.scrollTo({ top: headerTop - offset, behavior: 'smooth' });
    }
}

// ============================================
// SHARING FEATURE
// ============================================

// Encode predictions to compact string (24 chars, one per category)
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
    if (!encoded || typeof encoded !== 'string' || encoded.length !== CATEGORIES.length) {
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
    if (!str || typeof str !== 'string' || str.length !== CATEGORIES.length) return false;
    return /^[0-9\-]+$/.test(str) && str.length === CATEGORIES.length;
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
    renderSharedListsNav();
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
    renderSharedListsNav();
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
    updateActiveMenuItem(currentMode);
    updateCurrentModeLabel(currentMode);
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

// ============================================
// NAVIGATION DRAWER/SIDEBAR
// ============================================

let isDrawerOpen = false;
let isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

function initNavigation() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const drawerClose = document.getElementById('drawer-close');
    const navDrawer = document.getElementById('nav-drawer');
    const navOverlay = document.getElementById('nav-overlay');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const currentModeLabel = document.getElementById('current-mode-label');
    const menuItems = document.querySelectorAll('.menu-item[data-mode]');
    const aboutBtn = document.getElementById('nav-about');
    const shareNavBtn = document.getElementById('nav-share');

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
            handleNavModeSwitch(mode);
        });
    });

    // Search button in nav
    const searchNavBtn = document.getElementById('nav-search');
    searchNavBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        closeDrawer();
        showSearchInput();
    });

    // Share button in nav (always visible, opens share modal)
    shareNavBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        if (!shareNavBtn.classList.contains('disabled')) {
            closeDrawer();
            showShareModal();
        }
    });

    // About button
    aboutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        showAboutModal();
    });

    // Keyboard support
    document.addEventListener('keydown', handleNavKeyDown);

    // Initialize sidebar state on desktop
    if (isSidebarCollapsed) {
        navDrawer?.classList.add('collapsed');
        document.querySelector('.app')?.classList.add('sidebar-collapsed');
        document.getElementById('search-view')?.classList.add('sidebar-collapsed');
        updateSidebarToggleIcon();
    }

    // Initialize active state and shared lists
    renderSharedListsNav();
    updateActiveMenuItem(currentMode);
    updateCurrentModeLabel(currentMode);
    updateNavShareVisibility();
    updateNavCounts();
}

function openDrawer() {
    const navDrawer = document.getElementById('nav-drawer');
    const navOverlay = document.getElementById('nav-overlay');
    const hamburgerBtn = document.getElementById('hamburger-btn');

    navDrawer?.classList.add('open');
    navOverlay?.classList.add('visible');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    isDrawerOpen = true;

    // Focus first menu item for accessibility
    const firstItem = navDrawer?.querySelector('.menu-item');
    firstItem?.focus();
}

function closeDrawer() {
    const navDrawer = document.getElementById('nav-drawer');
    const navOverlay = document.getElementById('nav-overlay');
    const hamburgerBtn = document.getElementById('hamburger-btn');

    navDrawer?.classList.remove('open');
    navOverlay?.classList.remove('visible');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    isDrawerOpen = false;
}

function toggleSidebar() {
    const navDrawer = document.getElementById('nav-drawer');
    const appContainer = document.querySelector('.app');
    const searchView = document.getElementById('search-view');

    isSidebarCollapsed = !isSidebarCollapsed;

    navDrawer?.classList.toggle('collapsed', isSidebarCollapsed);
    appContainer?.classList.toggle('sidebar-collapsed', isSidebarCollapsed);
    searchView?.classList.toggle('sidebar-collapsed', isSidebarCollapsed);

    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.toString());
    updateSidebarToggleIcon();
}

function updateSidebarToggleIcon() {
    const toggle = document.getElementById('sidebar-toggle');
    if (!toggle) return;

    const collapseIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="11 17 6 12 11 7"/>
        <line x1="6" y1="12" x2="18" y2="12"/>
    </svg>`;

    const expandIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="13 7 18 12 13 17"/>
        <line x1="6" y1="12" x2="18" y2="12"/>
    </svg>`;

    toggle.innerHTML = isSidebarCollapsed ? expandIcon : collapseIcon;
    toggle.setAttribute('aria-label', isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
}

function updateActiveMenuItem(mode) {
    // Update all menu items including dynamically added shared lists
    const menuItems = document.querySelectorAll('.menu-item[data-mode]');

    menuItems.forEach(item => {
        const itemMode = item.dataset.mode;
        const isActive = itemMode === mode;
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

    // Handle shared modes
    if (mode.startsWith('shared:')) {
        const list = getCurrentSharedList();
        label.textContent = list ? `${list.name}'s Picks` : 'Shared';
    } else {
        label.textContent = modeNames[mode] || mode;
    }
}

function updateNavShareVisibility() {
    const shareSection = document.getElementById('nav-share-section');
    const shareDivider = document.getElementById('nav-share-divider');
    const shareBtn = document.getElementById('nav-share');

    // Share section is always visible now
    if (shareSection) shareSection.style.display = '';
    if (shareDivider) shareDivider.style.display = 'none'; // Hide the extra divider

    // Update disabled state based on whether predictions exist
    if (shareBtn) {
        const hasPredictions = hasAnyPredictions(predictions);
        shareBtn.classList.toggle('disabled', !hasPredictions);
        shareBtn.setAttribute('aria-disabled', (!hasPredictions).toString());
    }
}

// Update navigation counts for all modes
function updateNavCounts() {
    const watchedCountEl = document.getElementById('nav-count-watched');
    const predictionsCountEl = document.getElementById('nav-count-predictions');
    const favoritesCountEl = document.getElementById('nav-count-favorites');
    const streamableCountEl = document.getElementById('nav-count-streamable');

    // Watched: unique films watched / total unique films
    if (watchedCountEl) {
        const watched = ALL_FILMS.filter(f => isFilmWatched(f.key)).length;
        const total = ALL_FILMS.length;
        watchedCountEl.textContent = `${watched}/${total}`;
    }

    // Predictions: categories predicted / total categories
    if (predictionsCountEl) {
        const predicted = countPredictions();
        const total = CATEGORIES.length;
        predictionsCountEl.textContent = `${predicted}/${total}`;
    }

    // Favorites: categories favorited / total categories
    if (favoritesCountEl) {
        const favorited = countFavorites();
        const total = CATEGORIES.length;
        favoritesCountEl.textContent = `${favorited}/${total}`;
    }

    // Streamable: streamable films watched / total streamable films
    if (streamableCountEl) {
        const watched = getStreamableWatchedCount();
        const total = getStreamableTotalCount();
        streamableCountEl.textContent = `${watched}/${total}`;
    }
}

// Render shared lists in navigation
function renderSharedListsNav() {
    const container = document.getElementById('nav-shared-lists');
    const divider = document.getElementById('nav-shared-divider');

    if (!container) return;

    // Clear existing items
    container.innerHTML = '';

    // Show/hide divider based on whether there are shared lists
    if (divider) {
        divider.style.display = sharedLists.length > 0 ? '' : 'none';
    }

    // Render each shared list
    sharedLists.forEach(list => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'menu-item';
        a.dataset.mode = `shared:${list.id}`;

        // Check if this is the active shared list
        if (currentMode === `shared:${list.id}`) {
            a.classList.add('active');
            a.setAttribute('aria-current', 'page');
        }

        a.innerHTML = `
            <span class="menu-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
            </span>
            <span class="menu-text">${escapeHtml(list.name)}'s Picks</span>
        `;

        a.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavModeSwitch(`shared:${list.id}`);
        });

        li.appendChild(a);
        container.appendChild(li);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function handleNavModeSwitch(mode) {
    // Check if we should show copy modal before switching
    if (mode === 'favorites' && shouldShowCopyToFavoritesModal()) {
        pendingCopyTarget = 'favorites';
        showCopyModal('predictions', countPredictions());
        return;
    } else if (mode === 'predictions' && shouldShowCopyToPredictionsModal()) {
        pendingCopyTarget = 'predictions';
        showCopyModal('favorites', countFavorites());
        return;
    }

    // Update state
    currentMode = mode;
    currentSharedId = isSharedMode() ? currentMode.substring(7) : null;
    saveMode();

    // Close drawer on mobile after selection
    if (isDrawerOpen && window.innerWidth < 768) {
        closeDrawer();
    }

    // Update UI
    updateActiveMenuItem(mode);
    updateCurrentModeLabel(mode);
    updateNavShareVisibility();
    updateStreamableUI();
    renderNominees();
    updateProgress();
    updateShareDeleteButton();
    updateSharedBanner();

    // Handle onboarding screen logic
    if (mode === 'watched' && watchedItems.size === 0) {
        showOnboardingScreen();
    } else {
        showCategoryScreen(false);
    }
}

function handleNavKeyDown(e) {
    if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
        document.getElementById('hamburger-btn')?.focus();
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
                textSpan.textContent = `Viewing ${list.name}'s predictions (read-only)`;
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

    const nameSpan = document.getElementById('delete-name');
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

// Show copy modal
function showCopyModal(source, count) {
    const modal = document.getElementById('copy-modal');
    if (!modal) return;

    const title = document.getElementById('copy-title');
    const countSpan = document.getElementById('copy-count');

    if (title) {
        title.textContent = source === 'predictions'
            ? 'Start with your predictions?'
            : 'Start with your favorites?';
    }
    if (countSpan) {
        countSpan.textContent = count;
    }

    modal.hidden = false;
    document.body.classList.add('modal-open');
}

// Hide copy modal
function hideCopyModal() {
    const modal = document.getElementById('copy-modal');
    if (modal) {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
    }
    pendingCopyTarget = null;
}

// Handle copy yes
function handleCopyYes() {
    if (pendingCopyTarget === 'favorites') {
        copyPredictionsToFavorites();
        dismissCopyModal('favorites');
        currentMode = 'favorites';
    } else if (pendingCopyTarget === 'predictions') {
        copyFavoritesToPredictions();
        dismissCopyModal('predictions');
        currentMode = 'predictions';
    }

    hideCopyModal();
    saveMode();
    updateActiveMenuItem(currentMode);
    updateCurrentModeLabel(currentMode);
    updateNavShareVisibility();
    renderNominees();
    updateProgress();
    updateShareDeleteButton();
    updateSharedBanner();
}

// Handle copy no
function handleCopyNo() {
    if (pendingCopyTarget === 'favorites') {
        dismissCopyModal('favorites');
        currentMode = 'favorites';
    } else if (pendingCopyTarget === 'predictions') {
        dismissCopyModal('predictions');
        currentMode = 'predictions';
    }

    hideCopyModal();
    saveMode();
    updateActiveMenuItem(currentMode);
    updateCurrentModeLabel(currentMode);
    updateNavShareVisibility();
    renderNominees();
    updateProgress();
    updateShareDeleteButton();
    updateSharedBanner();
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

    updateActiveMenuItem(currentMode);
    updateCurrentModeLabel(currentMode);
    updateNavShareVisibility();
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
    loadFavorites();
    loadCurrentCategory();
    loadSharedLists();
    loadMode();
    renderCategoryOptions();
    initNavigation();
    setupEventListeners();
    registerServiceWorker();
    startTipRotation();

    // Check for incoming shared URL
    const shareData = parseShareParams();
    if (shareData) {
        // Always show category screen for shared links
        showCategoryScreen(false);
        handleIncomingShare(shareData);
        return;
    }

    // Validate current mode (shared list might have been deleted)
    if (isSharedMode()) {
        const list = getCurrentSharedList();
        if (!list) {
            currentMode = 'watched';
            saveMode();
            // Update nav after mode fallback
            updateActiveMenuItem(currentMode);
            updateCurrentModeLabel(currentMode);
        }
    }

    updateShareDeleteButton();
    updateSharedBanner();

    // Show onboarding if no films watched and in watched mode, otherwise show category view
    if (currentMode === 'watched' && watchedItems.size === 0) {
        showOnboardingScreen();
    } else {
        showCategoryScreen(false);
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

// Load favorites from localStorage
function loadFavorites() {
    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
            favorites = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Could not load favorites:', e);
        favorites = {};
    }
}

// Save favorites to localStorage
function saveFavorites() {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
        console.warn('Could not save favorites:', e);
    }
}

// Toggle favorite for a category
function toggleFavorite(categoryId, nomineeId) {
    if (favorites[categoryId] === nomineeId) {
        delete favorites[categoryId];
    } else {
        favorites[categoryId] = nomineeId;
    }
    saveFavorites();
}

// Count favorites
function countFavorites() {
    return Object.keys(favorites).length;
}

// Check if favorites copy modal was dismissed
function wasFavoritesCopyDismissed() {
    try {
        return localStorage.getItem(FAVORITES_COPY_DISMISSED_KEY) === 'true';
    } catch (e) {
        return false;
    }
}

// Check if predictions copy modal was dismissed
function wasPredictionsCopyDismissed() {
    try {
        return localStorage.getItem(PREDICTIONS_COPY_DISMISSED_KEY) === 'true';
    } catch (e) {
        return false;
    }
}

// Dismiss copy modal for a target
function dismissCopyModal(target) {
    try {
        if (target === 'favorites') {
            localStorage.setItem(FAVORITES_COPY_DISMISSED_KEY, 'true');
        } else if (target === 'predictions') {
            localStorage.setItem(PREDICTIONS_COPY_DISMISSED_KEY, 'true');
        }
    } catch (e) {
        console.warn('Could not save copy dismissal:', e);
    }
}

// Check if should show copy to favorites modal
function shouldShowCopyToFavoritesModal() {
    // Show if: entering favorites, have predictions, no favorites yet, not dismissed
    return countPredictions() > 0 && countFavorites() === 0 && !wasFavoritesCopyDismissed();
}

// Check if should show copy to predictions modal
function shouldShowCopyToPredictionsModal() {
    // Show if: entering predictions, have favorites, no predictions yet, not dismissed
    return countFavorites() > 0 && countPredictions() === 0 && !wasPredictionsCopyDismissed();
}

// Count predictions
function countPredictions() {
    return Object.keys(predictions).length;
}

// Copy predictions to favorites
function copyPredictionsToFavorites() {
    favorites = { ...predictions };
    saveFavorites();
    updateNavCounts();
}

// Copy favorites to predictions
function copyFavoritesToPredictions() {
    predictions = { ...favorites };
    savePredictions();
    updateNavCounts();
}

// Check if in favorites mode
function isFavoritesMode() {
    return currentMode === 'favorites';
}

// Check if in streamable mode
function isStreamableMode() {
    return currentMode === 'streamable';
}

// Update UI for streamable mode (hide category nav, show streamable header)
function updateStreamableUI() {
    const isStreamable = isStreamableMode();
    const categoryHeader = document.querySelector('.category-header');
    const categoryFooter = document.querySelector('.category-footer');
    const streamableHeader = document.getElementById('streamable-header');

    if (categoryHeader) categoryHeader.style.display = isStreamable ? 'none' : '';
    if (categoryFooter) categoryFooter.style.display = isStreamable ? 'none' : '';

    if (isStreamable) {
        // Show or create streamable header
        if (!streamableHeader) {
            const header = document.createElement('div');
            header.id = 'streamable-header';
            header.className = 'streamable-header';
            const watchedCount = getStreamableWatchedCount();
            const totalCount = getStreamableTotalCount();
            header.innerHTML = `
                <span class="streamable-title">Now Streaming</span>
                <span class="streamable-progress">${watchedCount} / ${totalCount} watched</span>
            `;
            filmsList.parentNode.insertBefore(header, filmsList);
        } else {
            streamableHeader.style.display = '';
            updateStreamableProgress();
        }
    } else if (streamableHeader) {
        streamableHeader.style.display = 'none';
    }
}

function getStreamableTotalCount() {
    return Object.keys(FILM_STREAMING).length;
}

function getStreamableWatchedCount() {
    return Object.keys(FILM_STREAMING).filter(key => isFilmWatched(key)).length;
}

function updateStreamableProgress() {
    const header = document.getElementById('streamable-header');
    if (!header) return;
    const progressEl = header.querySelector('.streamable-progress');
    if (progressEl) {
        progressEl.textContent = `${getStreamableWatchedCount()} / ${getStreamableTotalCount()} watched`;
    }
}

// Load current mode from localStorage
function loadMode() {
    try {
        const stored = localStorage.getItem(MODE_KEY);
        if (stored && (stored === 'watched' || stored === 'favorites' || stored === 'predictions' || stored === 'streamable')) {
            currentMode = stored;
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

    // Look up title from ALL_FILMS
    const film = ALL_FILMS.find(f => f.key === filmKey);
    return film ? film.title : null;
}

// Generate streaming icon HTML with link
function getStreamingIconHtml(nomineeId) {
    const service = getStreamingService(nomineeId);
    if (!service) return '';

    const filmTitle = getFilmTitle(nomineeId);
    if (!filmTitle) return '';

    const config = STREAMING_SERVICES[service];
    if (!config) return '';

    const encodedTitle = encodeURIComponent(filmTitle);
    const url = config.urlTemplate.replace('{title}', encodedTitle);
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="streaming-icon" title="Watch on ${config.name}" onclick="event.stopPropagation()">
        <img src="${config.icon}" alt="${config.name}">
    </a>`;
}

// Generate streaming icon HTML from a film key (not nominee ID)
function getStreamingIconHtmlForFilm(filmKey) {
    const service = FILM_STREAMING[filmKey];
    if (!service) return '';

    const film = ALL_FILMS.find(f => f.key === filmKey);
    if (!film) return '';

    const config = STREAMING_SERVICES[service];
    if (!config) return '';

    const encodedTitle = encodeURIComponent(film.title);
    const url = config.urlTemplate.replace('{title}', encodedTitle);
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="streaming-icon" title="Watch on ${config.name}" onclick="event.stopPropagation()">
        <img src="${config.icon}" alt="${config.name}">
    </a>`;
}

// ========================================
// Search Feature Functions
// ========================================

// Get all categories where a film has nominations
function getFilmCategories(filmKey) {
    const nomineeIds = FILM_NOMINEES[filmKey];
    if (!nomineeIds) return [];

    return nomineeIds.map(nomineeId => {
        const category = CATEGORIES.find(cat =>
            cat.nominees.some(n => n.id === nomineeId)
        );
        if (!category) return null;

        const nominee = category.nominees.find(n => n.id === nomineeId);
        return {
            categoryId: category.id,
            categoryName: category.name,
            categoryIndex: CATEGORIES.indexOf(category),
            nomineeId: nominee.id,
            nomineeTitle: nominee.title,
            nomineeSubtitle: nominee.subtitle
        };
    }).filter(Boolean);
}

// Filter films by search query
function searchFilms(query) {
    const q = query.toLowerCase().trim();
    if (!q) return ALL_FILMS;

    return ALL_FILMS.filter(film =>
        film.title.toLowerCase().includes(q)
    );
}

// Get selection state for a nominee in current mode
function getSearchSelectionState(nomineeId) {
    if (searchSourceMode === 'watched' || searchSourceMode === 'streamable') {
        return watchedItems.has(nomineeId) ? 'watched' : null;
    } else if (searchSourceMode === 'favorites') {
        const category = CATEGORIES.find(cat =>
            cat.nominees.some(n => n.id === nomineeId)
        );
        return category && favorites[category.id] === nomineeId ? 'favorited' : null;
    } else if (searchSourceMode === 'predictions') {
        const category = CATEGORIES.find(cat =>
            cat.nominees.some(n => n.id === nomineeId)
        );
        return category && predictions[category.id] === nomineeId ? 'predicted' : null;
    }
    return null;
}

// Show search input view
function showSearchInput() {
    searchActive = true;
    searchSourceMode = currentMode;
    searchSelectedFilm = null;
    searchQuery = '';

    const searchView = document.getElementById('search-view');
    const searchInput = document.getElementById('search-input');
    const searchFilmHeader = document.getElementById('search-film-header');
    const searchContent = document.getElementById('search-content');
    const searchEmpty = document.getElementById('search-empty');

    searchView.classList.add('active');
    searchView.classList.toggle('sidebar-collapsed', isSidebarCollapsed);
    searchFilmHeader.style.display = 'none';
    searchContent.style.display = 'block';
    searchEmpty.style.display = 'none';

    // Prevent body scroll when search is open
    document.body.classList.add('modal-open');

    searchInput.value = '';
    searchInput.classList.remove('readonly');
    searchInput.readOnly = false;
    searchInput.placeholder = 'Search films...';
    searchInput.focus();

    renderSearchFilmList('');
}

// Show search results for a specific film
function showSearch(filmKey) {
    searchActive = true;
    searchSourceMode = currentMode;
    searchSelectedFilm = filmKey;

    const searchView = document.getElementById('search-view');
    const searchInput = document.getElementById('search-input');
    const searchFilmHeader = document.getElementById('search-film-header');
    const searchContent = document.getElementById('search-content');
    const searchEmpty = document.getElementById('search-empty');

    const film = ALL_FILMS.find(f => f.key === filmKey);
    if (!film) return;

    searchView.classList.add('active');
    searchView.classList.toggle('sidebar-collapsed', isSidebarCollapsed);
    searchFilmHeader.style.display = 'block';
    searchContent.style.display = 'block';
    searchEmpty.style.display = 'none';

    // Prevent body scroll when search is open
    document.body.classList.add('modal-open');

    searchInput.value = film.title;
    searchInput.classList.add('readonly');
    searchInput.readOnly = true;

    renderSearchFilmHeader(filmKey);
    renderSearchCategoryList(filmKey);
}

// Hide search view
function hideSearch() {
    searchActive = false;
    searchSelectedFilm = null;
    searchQuery = '';

    const searchView = document.getElementById('search-view');
    searchView.classList.remove('active');

    // Restore body scroll
    document.body.classList.remove('modal-open');
}

// Go back from film categories to search input
function searchGoBack() {
    if (searchSelectedFilm) {
        // Go back to search input
        searchSelectedFilm = null;
        const searchInput = document.getElementById('search-input');
        const searchFilmHeader = document.getElementById('search-film-header');

        searchInput.value = searchQuery;
        searchInput.classList.remove('readonly');
        searchInput.readOnly = false;
        searchInput.placeholder = 'Search films...';
        searchFilmHeader.style.display = 'none';

        renderSearchFilmList(searchQuery);
        searchInput.focus();
    } else {
        // Close search entirely
        hideSearch();
    }
}

// Render film header in search results
function renderSearchFilmHeader(filmKey) {
    const film = ALL_FILMS.find(f => f.key === filmKey);
    if (!film) return;

    const titleEl = document.getElementById('search-film-title');
    const countEl = document.getElementById('search-film-count');
    const streamingEl = document.getElementById('search-film-streaming');

    titleEl.textContent = film.title;
    const nomText = film.nominations === 1 ? '1 nomination' : `${film.nominations} nominations`;
    countEl.textContent = nomText;

    // Streaming info
    const service = FILM_STREAMING[filmKey];
    if (service) {
        const config = STREAMING_SERVICES[service];
        if (config) {
            streamingEl.innerHTML = `<img src="${config.icon}" alt="${config.name}" class="streaming-icon-small"> Streaming on ${config.name}`;
            streamingEl.style.display = 'inline-flex';
        } else {
            streamingEl.style.display = 'none';
        }
    } else {
        streamingEl.style.display = 'none';
    }
}

// Render list of matching films (search input view)
function renderSearchFilmList(query) {
    const results = searchFilms(query);
    const resultsEl = document.getElementById('search-results');
    const emptyEl = document.getElementById('search-empty');
    const contentEl = document.getElementById('search-content');
    const labelEl = document.getElementById('search-section-label');

    if (results.length === 0) {
        contentEl.style.display = 'none';
        emptyEl.style.display = 'block';
        return;
    }

    contentEl.style.display = 'block';
    emptyEl.style.display = 'none';
    labelEl.textContent = query ? 'Matching films' : 'All films';

    const arrowSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>`;

    resultsEl.innerHTML = results.map(film => {
        const service = FILM_STREAMING[film.key];
        let subtitle = '';
        if (service) {
            const config = STREAMING_SERVICES[service];
            subtitle = config ? `Streaming on ${config.name}` : '';
        }
        if (!subtitle) {
            // Use first category as subtitle
            const categories = getFilmCategories(film.key);
            if (categories.length > 0) {
                subtitle = categories[0].categoryName;
            }
        }

        return `
        <li class="search-result" data-film="${film.key}" role="listitem">
            <div class="search-result-info">
                <div class="search-result-title">${film.title}</div>
                <div class="search-result-subtitle">${subtitle}</div>
            </div>
            <div class="search-result-count">${film.nominations}</div>
            <div class="search-result-arrow">${arrowSvg}</div>
        </li>
    `}).join('');

    // Add click handlers
    resultsEl.querySelectorAll('.search-result').forEach(el => {
        el.addEventListener('click', () => {
            const filmKey = el.dataset.film;
            searchQuery = query; // Save current query for back navigation
            showSearch(filmKey);
        });
    });
}

// Render list of categories for a film (film results view)
function renderSearchCategoryList(filmKey) {
    const categories = getFilmCategories(filmKey);
    const resultsEl = document.getElementById('search-results');
    const labelEl = document.getElementById('search-section-label');

    labelEl.textContent = 'Categories';

    resultsEl.innerHTML = categories.map(cat => {
        const state = getSearchSelectionState(cat.nomineeId);
        const stateClass = state ? 'checked' : 'empty';
        const stateIcon = state ? '✓' : '○';

        // For person categories (director, actor, etc.), show the person name (subtitle is the film)
        // For film categories (picture, screenplay), show the studio/writer (subtitle)
        // Use subtitle if it's different from the film title, otherwise use title
        const film = ALL_FILMS.find(f => f.key === filmKey);
        const displaySubtitle = cat.nomineeSubtitle && cat.nomineeSubtitle !== film?.title
            ? cat.nomineeSubtitle
            : cat.nomineeTitle;

        return `
        <li class="category-result" data-category-index="${cat.categoryIndex}" role="listitem">
            <div class="category-result-state ${stateClass}">${stateIcon}</div>
            <div class="category-result-info">
                <div class="category-result-name">${cat.categoryName}</div>
                <div class="category-result-nominee">${displaySubtitle}</div>
            </div>
        </li>
    `}).join('');

    // Add click handlers
    resultsEl.querySelectorAll('.category-result').forEach(el => {
        el.addEventListener('click', () => {
            const categoryIndex = parseInt(el.dataset.categoryIndex, 10);
            navigateFromSearch(categoryIndex);
        });
    });
}

// Navigate to a category from search results
function navigateFromSearch(categoryIndex) {
    hideSearch();

    // Switch to appropriate mode
    let targetMode = searchSourceMode;
    if (targetMode === 'streamable') {
        targetMode = 'watched'; // Streamable has no category view
    }

    // Switch mode if needed
    if (currentMode !== targetMode && !isSharedMode()) {
        currentMode = targetMode;
        currentSharedId = null;
        saveMode();
        updateActiveMenuItem(targetMode);
        updateCurrentModeLabel(targetMode);
        updateNavShareVisibility();
        updateStreamableUI();
        updateShareDeleteButton();
        updateSharedBanner();
    }

    // Show category screen first
    onboardingScreen.style.display = 'none';
    categoryScreen.style.display = '';

    // Use navigateToCategory which properly updates selects and renders
    navigateToCategory(categoryIndex, false);

    // Scroll to top
    window.scrollTo(0, 0);
}

// Render the streamable flat list (all streamable films in one view)
function renderStreamableList() {
    const streamableFilms = ALL_FILMS.filter(f => FILM_STREAMING[f.key]);

    const playIcon = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="8 5 19 12 8 19 8 5"></polygon>
    </svg>`;

    filmsList.innerHTML = streamableFilms.map(film => {
        const watched = isFilmWatched(film.key);
        const streamingIcon = getStreamingIconHtmlForFilm(film.key);
        const subtitleText = watched ? '✓ Watched' : 'Not yet watched';
        const subtitleClass = watched ? 'film-studio streamable-watched' : 'film-studio streamable-unwatched';
        const watchedClass = watched ? ' streamable-item-watched' : '';

        return `
        <li class="film streamable streamable-view${watchedClass}"
            data-film="${film.key}"
            role="listitem"
            tabindex="-1">
            <div class="checkbox">
                ${playIcon}
            </div>
            <div class="film-info">
                <div class="film-title">${film.title}</div>
                <div class="${subtitleClass}">${subtitleText}</div>
            </div>
            <div class="streaming-box">
                ${streamingIcon}
            </div>
        </li>
    `}).join('');

    // Add click handlers to open search for the film
    filmsList.querySelectorAll('.film.streamable').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => {
            // Don't trigger if clicking on streaming icon link
            if (e.target.closest('.streaming-icon')) return;
            const filmKey = el.dataset.film;
            if (filmKey) showSearch(filmKey);
        });
    });
}

// Render nominees list
function renderNominees() {
    // Streamable mode renders a completely different flat list
    if (isStreamableMode()) {
        renderStreamableList();
        updateStreamableUI();
        return;
    }

    const category = getCurrentCategory();
    const isPredictionsMode = currentMode === 'predictions';
    const isFavMode = isFavoritesMode();
    const isSharedView = isSharedMode();
    const sharedList = isSharedView ? getCurrentSharedList() : null;

    // Get the data to display based on mode
    let displayPredictions = predictions;
    if (isSharedView && sharedList) {
        displayPredictions = sharedList.predictions;
    }
    const predictedNominee = displayPredictions[category.id];
    const favoritedNominee = favorites[category.id];

    filmsList.innerHTML = category.nominees.map(nominee => {
        const streamingIcon = getStreamingIconHtml(nominee.id);
        const hasStreaming = streamingIcon !== '';

        // Determine state based on mode
        let isSelected, stateClass, role;
        if (isFavMode) {
            isSelected = favoritedNominee === nominee.id;
            stateClass = 'favorited';
            role = 'radio';
        } else if (isPredictionsMode || isSharedView) {
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

        // Icon based on mode: heart for favorites, star for predictions/shared, checkmark for watched
        let iconSvg;
        if (isFavMode) {
            // Heart icon
            iconSvg = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
               </svg>`;
        } else if (isPredictionsMode || isSharedView) {
            // Star icon
            iconSvg = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
               </svg>`;
        } else {
            // Checkmark icon
            iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
               </svg>`;
        }

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

    // Add event listeners (only for interactive modes)
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
    } else if (currentMode === 'favorites') {
        toggleFavoriteNominee(nomineeId);
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
    updateNavCounts();
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
    updateNavShareVisibility();
    updateNavCounts();
}

// Toggle favorite for current category
function toggleFavoriteNominee(nomineeId) {
    const category = getCurrentCategory();
    const currentFavorite = favorites[category.id];

    // Remove favorited state from previous selection
    if (currentFavorite) {
        const prevEl = document.querySelector(`.film[data-id="${currentFavorite}"]`);
        if (prevEl) {
            prevEl.classList.remove('favorited');
            prevEl.setAttribute('aria-checked', 'false');
        }
    }

    if (currentFavorite === nomineeId) {
        // Clicking the same nominee clears the favorite
        delete favorites[category.id];
    } else {
        // Set new favorite
        favorites[category.id] = nomineeId;
        // Add favorited state to new selection
        const newEl = document.querySelector(`.film[data-id="${nomineeId}"]`);
        if (newEl) {
            newEl.classList.add('favorited');
            newEl.setAttribute('aria-checked', 'true');
        }
    }

    saveFavorites();
    updateProgress();
    updateNavCounts();
}

// Update progress display
function updateProgress() {
    const category = getCurrentCategory();
    let progressText;
    let titleProgress;

    if (currentMode === 'streamable') {
        // For streamable: show watched/total in document title only
        const watchedCount = getStreamableWatchedCount();
        const totalCount = getStreamableTotalCount();
        progressText = '';
        titleProgress = `${watchedCount}/${totalCount}`;
    } else if (currentMode === 'favorites') {
        // For favorites: show how many categories have favorites
        const favoritedCount = Object.keys(favorites).length;
        const totalCategories = CATEGORIES.length;
        const hasFavorite = favorites[category.id] ? '♥' : '♡';
        progressText = hasFavorite;
        titleProgress = favoritedCount > 0 ? `${favoritedCount}/${totalCategories}` : null;
    } else if (currentMode === 'predictions') {
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
        const stickyHeader = document.querySelector('.ceremony-info');
        const stickyHeight = stickyHeader ? stickyHeader.offsetHeight : 0;
        const headerTop = categoryHeader.getBoundingClientRect().top + window.scrollY;
        const offset = stickyHeight + 8; // Account for sticky header + small margin
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
    browseByCategory.addEventListener('click', showCategoryScreen);

    // Search button event listener
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', showSearchInput);
    }

    // Search input event listener (debounced)
    const searchInput = document.getElementById('search-input');
    let searchDebounceTimer = null;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (searchInput.readOnly) return;
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                renderSearchFilmList(e.target.value);
            }, 150);
        });
    }

    // Search back button
    const searchBack = document.getElementById('search-back');
    if (searchBack) {
        searchBack.addEventListener('click', searchGoBack);
    }

    // Search close button
    const searchClose = document.getElementById('search-close');
    if (searchClose) {
        searchClose.addEventListener('click', hideSearch);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Close search on Escape
        if (e.key === 'Escape' && searchActive) {
            hideSearch();
            return;
        }

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

    // Copy modal events
    const copyModalClose = document.querySelector('#copy-modal .modal-close');
    if (copyModalClose) {
        copyModalClose.addEventListener('click', handleCopyNo);
    }

    const copyModalBackdrop = document.querySelector('#copy-modal .modal-backdrop');
    if (copyModalBackdrop) {
        copyModalBackdrop.addEventListener('click', handleCopyNo);
    }

    const copyYesBtn = document.getElementById('copy-yes');
    if (copyYesBtn) {
        copyYesBtn.addEventListener('click', handleCopyYes);
    }

    const copyNoBtn = document.getElementById('copy-no');
    if (copyNoBtn) {
        copyNoBtn.addEventListener('click', handleCopyNo);
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
    updateSwVersion();
    if (aboutModal) {
        aboutModal.hidden = false;
        document.body.classList.add('modal-open');
    }
}

function updateSwVersion() {
    const swVersionEl = document.getElementById('sw-version');
    if (!swVersionEl) return;

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Ask the active service worker for its version
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
            if (event.data && event.data.type === 'SW_VERSION') {
                swVersionEl.textContent = `SW v${event.data.version}`;
            }
        };
        navigator.serviceWorker.controller.postMessage(
            { type: 'GET_VERSION' },
            [messageChannel.port2]
        );
    } else {
        swVersionEl.textContent = 'SW inactive';
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
