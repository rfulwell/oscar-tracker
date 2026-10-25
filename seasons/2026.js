// 98th Academy Awards (2026)
//
// Everything the app needs to know about one awards season. index.html loads
// the current season's file before app.js.
//
// Once nominations are final, never reorder categories or nominees, and never
// change an id: share links store each pick as its position in its category,
// and saved data stores ids.
//
// Each nominee's `film` links it to an entry in `films`. Marking a film as
// watched marks every nominee linked to it. A nominee with no `film` isn't in
// the films list and is marked on its own.
const AWARDS_SEASON = {
    season: '2026',
    ceremonyNumber: 98,
    // 7pm Eastern
    ceremonyDate: '2026-03-15T19:00:00-05:00',
    broadcaster: 'ABC',
    // Official nominations page, linked as "source" from every category
    sourceUrl: 'https://www.oscars.org/oscars/ceremonies/2026',

    // Films in the watched list, in the order ties are shown. streaming is a
    // key of STREAMING_SERVICES in app.js (subscription streaming only).
    films: {
        'sinners': { title: 'Sinners', streaming: 'max' },
        'one-battle-after-another': { title: 'One Battle After Another', streaming: 'max' },
        'marty-supreme': { title: 'Marty Supreme' },
        'sentimental-value': { title: 'Sentimental Value' },
        'frankenstein': { title: 'Frankenstein', streaming: 'netflix' },
        'hamnet': { title: 'Hamnet' },
        'train-dreams': { title: 'Train Dreams', streaming: 'netflix' },
        'f1': { title: 'F1', streaming: 'appletv' },
        'secret-agent': { title: 'The Secret Agent' },
        'bugonia': { title: 'Bugonia', streaming: 'peacock' },
        'sirat': { title: 'Sirât' },
        'blue-moon': { title: 'Blue Moon' },
        'it-was-just-an-accident': { title: 'It Was Just an Accident' },
        'kpop-demon-hunters': { title: 'KPop Demon Hunters', streaming: 'netflix' },
        'avatar-fire-and-ash': { title: 'Avatar: Fire and Ash' },
        'arco': { title: 'Arco' },
        'little-amelie': { title: 'Little Amélie or the Character of Rain' },
        'voice-of-hind-rajab': { title: 'The Voice of Hind Rajab' },
        'if-i-had-legs': { title: "If I Had Legs I'd Kick You", streaming: 'max' },
        'song-sung-blue': { title: 'Song Sung Blue' },
        'elio': { title: 'Elio', streaming: 'disneyplus' },
        'zootopia-2': { title: 'Zootopia 2' },
        'alabama-solution': { title: 'The Alabama Solution', streaming: 'max' },
        'come-see-me': { title: 'Come See Me in the Good Light', streaming: 'appletv' },
        'perfect-neighbor': { title: 'The Perfect Neighbor', streaming: 'netflix' },
        'smashing-machine': { title: 'The Smashing Machine', streaming: 'max' },
        'ugly-stepsister': { title: 'The Ugly Stepsister', streaming: 'hulu' },
        'jurassic-world-rebirth': { title: 'Jurassic World Rebirth', streaming: 'peacock' },
        'lost-bus': { title: 'The Lost Bus', streaming: 'appletv' },
        'weapons': { title: 'Weapons' }
    },

    categories: [
        {
            id: 'best-picture',
            name: 'Best Picture',
            nominees: [
                { id: 'bugonia', title: 'Bugonia', subtitle: 'Focus Features', film: 'bugonia' },
                { id: 'f1', title: 'F1', subtitle: 'Apple Original Films', film: 'f1' },
                { id: 'frankenstein', title: 'Frankenstein', subtitle: 'Netflix', film: 'frankenstein' },
                { id: 'hamnet', title: 'Hamnet', subtitle: 'Focus Features', film: 'hamnet' },
                { id: 'marty-supreme', title: 'Marty Supreme', subtitle: 'A24', film: 'marty-supreme' },
                { id: 'one-battle-after-another', title: 'One Battle After Another', subtitle: 'Warner Bros.', film: 'one-battle-after-another' },
                { id: 'secret-agent', title: 'The Secret Agent', subtitle: 'Neon', film: 'secret-agent' },
                { id: 'sentimental-value', title: 'Sentimental Value', subtitle: 'Neon', film: 'sentimental-value' },
                { id: 'sinners', title: 'Sinners', subtitle: 'Warner Bros.', film: 'sinners' },
                { id: 'train-dreams', title: 'Train Dreams', subtitle: 'Netflix', film: 'train-dreams' }
            ]
        },
        {
            id: 'best-director',
            name: 'Best Director',
            nominees: [
                { id: 'dir-coogler', title: 'Ryan Coogler', subtitle: 'Sinners', film: 'sinners' },
                { id: 'dir-anderson', title: 'Paul Thomas Anderson', subtitle: 'One Battle After Another', film: 'one-battle-after-another' },
                { id: 'dir-safdie', title: 'Josh Safdie', subtitle: 'Marty Supreme', film: 'marty-supreme' },
                { id: 'dir-zhao', title: 'Chloé Zhao', subtitle: 'Hamnet', film: 'hamnet' },
                { id: 'dir-trier', title: 'Joachim Trier', subtitle: 'Sentimental Value', film: 'sentimental-value' }
            ]
        },
        {
            id: 'best-actor',
            name: 'Best Actor',
            nominees: [
                { id: 'actor-chalamet', title: 'Timothée Chalamet', subtitle: 'Marty Supreme', film: 'marty-supreme' },
                { id: 'actor-dicaprio', title: 'Leonardo DiCaprio', subtitle: 'One Battle After Another', film: 'one-battle-after-another' },
                { id: 'actor-hawke', title: 'Ethan Hawke', subtitle: 'Blue Moon', film: 'blue-moon' },
                { id: 'actor-jordan', title: 'Michael B. Jordan', subtitle: 'Sinners', film: 'sinners' },
                { id: 'actor-moura', title: 'Wagner Moura', subtitle: 'The Secret Agent', film: 'secret-agent' }
            ]
        },
        {
            id: 'best-actress',
            name: 'Best Actress',
            nominees: [
                { id: 'actress-buckley', title: 'Jessie Buckley', subtitle: 'Hamnet', film: 'hamnet' },
                { id: 'actress-byrne', title: 'Rose Byrne', subtitle: "If I Had Legs I'd Kick You", film: 'if-i-had-legs' },
                { id: 'actress-hudson', title: 'Kate Hudson', subtitle: 'Song Sung Blue', film: 'song-sung-blue' },
                { id: 'actress-reinsve', title: 'Renate Reinsve', subtitle: 'Sentimental Value', film: 'sentimental-value' },
                { id: 'actress-stone', title: 'Emma Stone', subtitle: 'Bugonia', film: 'bugonia' }
            ]
        },
        {
            id: 'best-supporting-actor',
            name: 'Best Supporting Actor',
            nominees: [
                { id: 'supp-actor-elordi', title: 'Jacob Elordi', subtitle: 'Frankenstein', film: 'frankenstein' },
                { id: 'supp-actor-deltoro', title: 'Benicio Del Toro', subtitle: 'One Battle After Another', film: 'one-battle-after-another' },
                { id: 'supp-actor-penn', title: 'Sean Penn', subtitle: 'One Battle After Another', film: 'one-battle-after-another' },
                { id: 'supp-actor-lindo', title: 'Delroy Lindo', subtitle: 'Sinners', film: 'sinners' },
                { id: 'supp-actor-skarsgard', title: 'Stellan Skarsgård', subtitle: 'Sentimental Value', film: 'sentimental-value' }
            ]
        },
        {
            id: 'best-supporting-actress',
            name: 'Best Supporting Actress',
            nominees: [
                { id: 'supp-actress-taylor', title: 'Teyana Taylor', subtitle: 'One Battle After Another', film: 'one-battle-after-another' },
                { id: 'supp-actress-mosaku', title: 'Wunmi Mosaku', subtitle: 'Sinners', film: 'sinners' },
                { id: 'supp-actress-fanning', title: 'Elle Fanning', subtitle: 'Sentimental Value', film: 'sentimental-value' },
                { id: 'supp-actress-lilleaas', title: 'Inga Ibsdotter Lilleaas', subtitle: 'Sentimental Value', film: 'sentimental-value' },
                { id: 'supp-actress-madigan', title: 'Amy Madigan', subtitle: 'Weapons', film: 'weapons' }
            ]
        },
        {
            id: 'best-original-screenplay',
            name: 'Best Original Screenplay',
            nominees: [
                { id: 'orig-sinners', title: 'Sinners', subtitle: 'Ryan Coogler', film: 'sinners' },
                { id: 'orig-sentimental', title: 'Sentimental Value', subtitle: 'Eskil Vogt & Joachim Trier', film: 'sentimental-value' },
                { id: 'orig-bluemoon', title: 'Blue Moon', subtitle: 'Robert Kaplow', film: 'blue-moon' },
                { id: 'orig-marty', title: 'Marty Supreme', subtitle: 'Ronald Bronstein & Josh Safdie', film: 'marty-supreme' },
                { id: 'orig-accident', title: 'It Was Just an Accident', subtitle: 'Jafar Panahi', film: 'it-was-just-an-accident' }
            ]
        },
        {
            id: 'best-adapted-screenplay',
            name: 'Best Adapted Screenplay',
            nominees: [
                { id: 'adapt-onebattle', title: 'One Battle After Another', subtitle: 'Paul Thomas Anderson', film: 'one-battle-after-another' },
                { id: 'adapt-traindreams', title: 'Train Dreams', subtitle: 'Clint Bentley & Greg Kwedar', film: 'train-dreams' },
                { id: 'adapt-frankenstein', title: 'Frankenstein', subtitle: 'Guillermo del Toro', film: 'frankenstein' },
                { id: 'adapt-hamnet', title: 'Hamnet', subtitle: 'Chloé Zhao', film: 'hamnet' },
                { id: 'adapt-bugonia', title: 'Bugonia', subtitle: 'Will Tracy', film: 'bugonia' }
            ]
        },
        {
            id: 'best-animated-feature',
            name: 'Best Animated Feature',
            nominees: [
                { id: 'anim-arco', title: 'Arco', subtitle: 'Neon', film: 'arco' },
                { id: 'anim-elio', title: 'Elio', subtitle: 'Disney/Pixar', film: 'elio' },
                { id: 'anim-kpop', title: 'KPop Demon Hunters', subtitle: 'Netflix', film: 'kpop-demon-hunters' },
                { id: 'anim-amelie', title: 'Little Amélie or the Character of Rain', subtitle: 'GKIDS', film: 'little-amelie' },
                { id: 'anim-zootopia2', title: 'Zootopia 2', subtitle: 'Disney', film: 'zootopia-2' }
            ]
        },
        {
            id: 'best-international-feature',
            name: 'Best International Feature',
            nominees: [
                { id: 'intl-sentimental', title: 'Sentimental Value', subtitle: 'Norway', film: 'sentimental-value' },
                { id: 'intl-secretagent', title: 'The Secret Agent', subtitle: 'Brazil', film: 'secret-agent' },
                { id: 'intl-sirat', title: 'Sirât', subtitle: 'Spain', film: 'sirat' },
                { id: 'intl-hind', title: 'The Voice of Hind Rajab', subtitle: 'Tunisia', film: 'voice-of-hind-rajab' },
                { id: 'intl-accident', title: 'It Was Just an Accident', subtitle: 'France', film: 'it-was-just-an-accident' }
            ]
        },
        {
            id: 'best-documentary-feature',
            name: 'Best Documentary Feature',
            nominees: [
                { id: 'doc-alabama', title: 'The Alabama Solution', subtitle: 'Andrew Jarecki & Charlotte Kaufman', film: 'alabama-solution' },
                { id: 'doc-goodlight', title: 'Come See Me in the Good Light', subtitle: 'Ryan White', film: 'come-see-me' },
                { id: 'doc-rocks', title: 'Cutting through Rocks', subtitle: 'Sara Khaki & Mohammadreza Eyni' },
                { id: 'doc-putin', title: 'Mr. Nobody against Putin', subtitle: 'David Borenstein, Pavel Talankin, Helle Faber & Alžběta Karásková' },
                { id: 'doc-neighbor', title: 'The Perfect Neighbor', subtitle: 'Geeta Gandbhir, Alisa Payne, Nikon Kwantu & Sam Bisbee', film: 'perfect-neighbor' }
            ]
        },
        {
            id: 'best-cinematography',
            name: 'Best Cinematography',
            nominees: [
                { id: 'cin-frankenstein', title: 'Frankenstein', subtitle: 'Dan Laustsen', film: 'frankenstein' },
                { id: 'cin-marty', title: 'Marty Supreme', subtitle: 'Darius Khondji', film: 'marty-supreme' },
                { id: 'cin-onebattle', title: 'One Battle After Another', subtitle: 'Michael Bauman', film: 'one-battle-after-another' },
                { id: 'cin-sinners', title: 'Sinners', subtitle: 'Autumn Durald Arkapaw', film: 'sinners' },
                { id: 'cin-traindreams', title: 'Train Dreams', subtitle: 'Adolpho Veloso', film: 'train-dreams' }
            ]
        },
        {
            id: 'best-film-editing',
            name: 'Best Film Editing',
            nominees: [
                { id: 'edit-f1', title: 'F1', subtitle: 'Stephen Mirrione', film: 'f1' },
                { id: 'edit-marty', title: 'Marty Supreme', subtitle: 'Ronald Bronstein & Josh Safdie', film: 'marty-supreme' },
                { id: 'edit-onebattle', title: 'One Battle After Another', subtitle: 'Andy Jurgensen', film: 'one-battle-after-another' },
                { id: 'edit-sentimental', title: 'Sentimental Value', subtitle: 'Olivier Bugge Coutté', film: 'sentimental-value' },
                { id: 'edit-sinners', title: 'Sinners', subtitle: 'Michael P. Shawver', film: 'sinners' }
            ]
        },
        {
            id: 'best-production-design',
            name: 'Best Production Design',
            nominees: [
                { id: 'prod-frankenstein', title: 'Frankenstein', subtitle: 'Tamara Deverell & Shane Vieau', film: 'frankenstein' },
                { id: 'prod-hamnet', title: 'Hamnet', subtitle: 'Fiona Crombie & Alice Felton', film: 'hamnet' },
                { id: 'prod-marty', title: 'Marty Supreme', subtitle: 'Jack Fisk & Adam Willis', film: 'marty-supreme' },
                { id: 'prod-onebattle', title: 'One Battle After Another', subtitle: 'Florencia Martin & Anthony Carlino', film: 'one-battle-after-another' },
                { id: 'prod-sinners', title: 'Sinners', subtitle: 'Hannah Beachler & Monique Champagne', film: 'sinners' }
            ]
        },
        {
            id: 'best-costume-design',
            name: 'Best Costume Design',
            nominees: [
                { id: 'cost-avatar', title: 'Avatar: Fire and Ash', subtitle: 'Deborah L. Scott', film: 'avatar-fire-and-ash' },
                { id: 'cost-frankenstein', title: 'Frankenstein', subtitle: 'Kate Hawley', film: 'frankenstein' },
                { id: 'cost-hamnet', title: 'Hamnet', subtitle: 'Malgosia Turzanska', film: 'hamnet' },
                { id: 'cost-marty', title: 'Marty Supreme', subtitle: 'Miyako Bellizzi', film: 'marty-supreme' },
                { id: 'cost-sinners', title: 'Sinners', subtitle: 'Ruth E. Carter', film: 'sinners' }
            ]
        },
        {
            id: 'best-makeup-hairstyling',
            name: 'Best Makeup and Hairstyling',
            nominees: [
                { id: 'makeup-frankenstein', title: 'Frankenstein', subtitle: 'Mike Hill, Jordan Samuel & Cliona Furey', film: 'frankenstein' },
                { id: 'makeup-kokuho', title: 'Kokuho', subtitle: 'Kyoko Toyokawa, Naomi Hibino & Tadashi Nishimatsu' },
                { id: 'makeup-sinners', title: 'Sinners', subtitle: 'Ken Diaz, Mike Fontaine & Shunika Terry', film: 'sinners' },
                { id: 'makeup-smashing', title: 'The Smashing Machine', subtitle: 'Kazu Hiro, Glen Griffin & Bjoern Rehbein', film: 'smashing-machine' },
                { id: 'makeup-ugly', title: 'The Ugly Stepsister', subtitle: 'Thomas Foldberg & Anne Cathrine Sauerberg', film: 'ugly-stepsister' }
            ]
        },
        {
            id: 'best-original-score',
            name: 'Best Original Score',
            nominees: [
                { id: 'score-bugonia', title: 'Bugonia', subtitle: 'Jerskin Fendrix', film: 'bugonia' },
                { id: 'score-frankenstein', title: 'Frankenstein', subtitle: 'Alexandre Desplat', film: 'frankenstein' },
                { id: 'score-hamnet', title: 'Hamnet', subtitle: 'Max Richter', film: 'hamnet' },
                { id: 'score-onebattle', title: 'One Battle After Another', subtitle: 'Jonny Greenwood', film: 'one-battle-after-another' },
                { id: 'score-sinners', title: 'Sinners', subtitle: 'Ludwig Göransson', film: 'sinners' }
            ]
        },
        {
            id: 'best-original-song',
            name: 'Best Original Song',
            nominees: [
                { id: 'song-dearme', title: '"Dear Me"', subtitle: 'Diane Warren: Relentless' },
                { id: 'song-golden', title: '"Golden"', subtitle: 'KPop Demon Hunters', film: 'kpop-demon-hunters' },
                { id: 'song-ilied', title: '"I Lied to You"', subtitle: 'Sinners', film: 'sinners' },
                { id: 'song-sweetdreams', title: '"Sweet Dreams of Joy"', subtitle: 'Viva Verdi!' },
                { id: 'song-traindreams', title: '"Train Dreams"', subtitle: 'Train Dreams', film: 'train-dreams' }
            ]
        },
        {
            id: 'best-sound',
            name: 'Best Sound',
            nominees: [
                { id: 'sound-f1', title: 'F1', subtitle: 'Gareth John, Al Nelson, Gwendolyn Yates Whittle, Gary A. Rizzo & Juan Peralta', film: 'f1' },
                { id: 'sound-frankenstein', title: 'Frankenstein', subtitle: 'Greg Chapman, Nathan Robitaille, Nelson Ferreira, Christian Cooke & Brad Zoern', film: 'frankenstein' },
                { id: 'sound-onebattle', title: 'One Battle After Another', subtitle: 'José Antonio García, Christopher Scarabosio & Tony Villaflor', film: 'one-battle-after-another' },
                { id: 'sound-sinners', title: 'Sinners', subtitle: 'Chris Welcker, Benjamin A. Burtt, Felipe Pacheco, Brandon Proctor & Steve Boeddeker', film: 'sinners' },
                { id: 'sound-sirat', title: 'Sirât', subtitle: 'Amanda Villavieja, Laia Casanovas & Yasmina Praderas', film: 'sirat' }
            ]
        },
        {
            id: 'best-visual-effects',
            name: 'Best Visual Effects',
            nominees: [
                { id: 'vfx-avatar', title: 'Avatar: Fire and Ash', subtitle: 'Joe Letteri, Richard Baneham, Eric Saindon & Daniel Barrett', film: 'avatar-fire-and-ash' },
                { id: 'vfx-f1', title: 'F1', subtitle: 'Ryan Tudhope, Nicolas Chevallier, Robert Harrington & Keith Dawson', film: 'f1' },
                { id: 'vfx-jurassic', title: 'Jurassic World Rebirth', subtitle: 'David Vickery, Stephen Aplin, Charmaine Chan & Neil Corbould', film: 'jurassic-world-rebirth' },
                { id: 'vfx-lostbus', title: 'The Lost Bus', subtitle: 'Charlie Noble, David Zaretti, Russell Bowen & Brandon K. McLaughlin', film: 'lost-bus' },
                { id: 'vfx-sinners', title: 'Sinners', subtitle: 'Michael Ralla, Espen Nordahl, Guido Wolter & Donnie Dean', film: 'sinners' }
            ]
        },
        {
            id: 'best-casting',
            name: 'Best Casting',
            nominees: [
                { id: 'cast-hamnet', title: 'Hamnet', subtitle: 'Nina Gold', film: 'hamnet' },
                { id: 'cast-marty', title: 'Marty Supreme', subtitle: 'Jennifer Venditti', film: 'marty-supreme' },
                { id: 'cast-onebattle', title: 'One Battle After Another', subtitle: 'Cassandra Kulukundis', film: 'one-battle-after-another' },
                { id: 'cast-secretagent', title: 'The Secret Agent', subtitle: 'Gabriel Domingues', film: 'secret-agent' },
                { id: 'cast-sinners', title: 'Sinners', subtitle: 'Francine Maisler', film: 'sinners' }
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
    ]
};
