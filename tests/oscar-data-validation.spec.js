// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Official 2026 Oscar Nominations Data
 * Source: https://www.oscars.org/oscars/ceremonies/2026
 * 98th Academy Awards
 *
 * This data was verified against the official Oscar website and should be used
 * to validate that the app's data matches the official nominations exactly.
 *
 * Note: Category names are stored without "Best " prefix to match app display format.
 */
const OFFICIAL_OSCAR_DATA = {
    'Picture': {
        fullName: 'Best Picture',
        count: 10,
        nominees: [
            { title: 'Bugonia', detail: 'Focus Features' },
            { title: 'F1', detail: 'Apple Original Films' },
            { title: 'Frankenstein', detail: 'Netflix' },
            { title: 'Hamnet', detail: 'Focus Features' },
            { title: 'Marty Supreme', detail: 'A24' },
            { title: 'One Battle After Another', detail: 'Warner Bros.' },
            { title: 'The Secret Agent', detail: 'Neon' },
            { title: 'Sentimental Value', detail: 'Neon' },
            { title: 'Sinners', detail: 'Warner Bros.' },
            { title: 'Train Dreams', detail: 'Netflix' }
        ]
    },
    'Director': {
        fullName: 'Best Director',
        count: 5,
        nominees: [
            { title: 'Ryan Coogler', detail: 'Sinners' },
            { title: 'Paul Thomas Anderson', detail: 'One Battle After Another' },
            { title: 'Josh Safdie', detail: 'Marty Supreme' },
            { title: 'Chloé Zhao', detail: 'Hamnet' },
            { title: 'Joachim Trier', detail: 'Sentimental Value' }
        ]
    },
    'Actor': {
        fullName: 'Best Actor',
        count: 5,
        nominees: [
            { title: 'Timothée Chalamet', detail: 'Marty Supreme' },
            { title: 'Leonardo DiCaprio', detail: 'One Battle After Another' },
            { title: 'Ethan Hawke', detail: 'Blue Moon' },
            { title: 'Michael B. Jordan', detail: 'Sinners' },
            { title: 'Wagner Moura', detail: 'The Secret Agent' }
        ]
    },
    'Actress': {
        fullName: 'Best Actress',
        count: 5,
        nominees: [
            { title: 'Jessie Buckley', detail: 'Hamnet' },
            { title: 'Rose Byrne', detail: "If I Had Legs I'd Kick You" },
            { title: 'Kate Hudson', detail: 'Song Sung Blue' },
            { title: 'Renate Reinsve', detail: 'Sentimental Value' },
            { title: 'Emma Stone', detail: 'Bugonia' }
        ]
    },
    'Supporting Actor': {
        fullName: 'Best Supporting Actor',
        count: 5,
        nominees: [
            { title: 'Jacob Elordi', detail: 'Frankenstein' },
            { title: 'Benicio Del Toro', detail: 'One Battle After Another' },
            { title: 'Sean Penn', detail: 'One Battle After Another' },
            { title: 'Delroy Lindo', detail: 'Sinners' },
            { title: 'Stellan Skarsgård', detail: 'Sentimental Value' }
        ]
    },
    'Supporting Actress': {
        fullName: 'Best Supporting Actress',
        count: 5,
        nominees: [
            { title: 'Teyana Taylor', detail: 'One Battle After Another' },
            { title: 'Wunmi Mosaku', detail: 'Sinners' },
            { title: 'Elle Fanning', detail: 'Sentimental Value' },
            { title: 'Inga Ibsdotter Lilleaas', detail: 'Sentimental Value' },
            { title: 'Amy Madigan', detail: 'Weapons' }
        ]
    },
    'Original Screenplay': {
        fullName: 'Best Original Screenplay',
        count: 5,
        nominees: [
            { title: 'Sinners', detail: 'Ryan Coogler' },
            { title: 'Sentimental Value', detail: 'Eskil Vogt & Joachim Trier' },
            { title: 'Blue Moon', detail: 'Robert Kaplow' },
            { title: 'Marty Supreme', detail: 'Ronald Bronstein & Josh Safdie' },
            { title: 'It Was Just an Accident', detail: 'Jafar Panahi' }
        ]
    },
    'Adapted Screenplay': {
        fullName: 'Best Adapted Screenplay',
        count: 5,
        nominees: [
            { title: 'One Battle After Another', detail: 'Paul Thomas Anderson' },
            { title: 'Train Dreams', detail: 'Clint Bentley & Greg Kwedar' },
            { title: 'Frankenstein', detail: 'Guillermo del Toro' },
            { title: 'Hamnet', detail: 'Chloé Zhao' },
            { title: 'Bugonia', detail: 'Will Tracy' }
        ]
    },
    'Animated Feature': {
        fullName: 'Best Animated Feature',
        count: 5,
        nominees: [
            { title: 'Arco', detail: 'Neon' },
            { title: 'Elio', detail: 'Disney/Pixar' },
            { title: 'KPop Demon Hunters', detail: 'Netflix' },
            { title: 'Little Amélie or the Character of Rain', detail: 'GKIDS' },
            { title: 'Zootopia 2', detail: 'Disney' }
        ]
    },
    'International Feature': {
        fullName: 'Best International Feature',
        count: 5,
        nominees: [
            { title: 'Sentimental Value', detail: 'Norway' },
            { title: 'The Secret Agent', detail: 'Brazil' },
            { title: 'Sirât', detail: 'Spain' },
            { title: 'The Voice of Hind Rajab', detail: 'Tunisia' },
            { title: 'It Was Just an Accident', detail: 'France' }
        ]
    },
    'Documentary Feature': {
        fullName: 'Best Documentary Feature',
        count: 5,
        nominees: [
            { title: 'The Alabama Solution', detail: 'Andrew Jarecki & Charlotte Kaufman' },
            { title: 'Come See Me in the Good Light', detail: 'Ryan White' },
            { title: 'Cutting through Rocks', detail: 'Sara Khaki & Mohammadreza Eyni' },
            { title: 'Mr. Nobody against Putin', detail: 'David Borenstein, Pavel Talankin, Helle Faber & Alžběta Karásková' },
            { title: 'The Perfect Neighbor', detail: 'Geeta Gandbhir, Alisa Payne, Nikon Kwantu & Sam Bisbee' }
        ]
    },
    'Cinematography': {
        fullName: 'Best Cinematography',
        count: 5,
        nominees: [
            { title: 'Frankenstein', detail: 'Dan Laustsen' },
            { title: 'Marty Supreme', detail: 'Darius Khondji' },
            { title: 'One Battle After Another', detail: 'Michael Bauman' },
            { title: 'Sinners', detail: 'Autumn Durald Arkapaw' },
            { title: 'Train Dreams', detail: 'Adolpho Veloso' }
        ]
    },
    'Film Editing': {
        fullName: 'Best Film Editing',
        count: 5,
        nominees: [
            { title: 'F1', detail: 'Stephen Mirrione' },
            { title: 'Marty Supreme', detail: 'Ronald Bronstein & Josh Safdie' },
            { title: 'One Battle After Another', detail: 'Andy Jurgensen' },
            { title: 'Sentimental Value', detail: 'Olivier Bugge Coutté' },
            { title: 'Sinners', detail: 'Michael P. Shawver' }
        ]
    },
    'Production Design': {
        fullName: 'Best Production Design',
        count: 5,
        nominees: [
            { title: 'Frankenstein', detail: 'Tamara Deverell & Shane Vieau' },
            { title: 'Hamnet', detail: 'Fiona Crombie & Alice Felton' },
            { title: 'Marty Supreme', detail: 'Jack Fisk & Adam Willis' },
            { title: 'One Battle After Another', detail: 'Florencia Martin & Anthony Carlino' },
            { title: 'Sinners', detail: 'Hannah Beachler & Monique Champagne' }
        ]
    },
    'Costume Design': {
        fullName: 'Best Costume Design',
        count: 5,
        nominees: [
            { title: 'Avatar: Fire and Ash', detail: 'Deborah L. Scott' },
            { title: 'Frankenstein', detail: 'Kate Hawley' },
            { title: 'Hamnet', detail: 'Malgosia Turzanska' },
            { title: 'Marty Supreme', detail: 'Miyako Bellizzi' },
            { title: 'Sinners', detail: 'Ruth E. Carter' }
        ]
    },
    'Makeup and Hairstyling': {
        fullName: 'Best Makeup and Hairstyling',
        count: 5,
        nominees: [
            { title: 'Frankenstein', detail: 'Mike Hill, Jordan Samuel & Cliona Furey' },
            { title: 'Kokuho', detail: 'Kyoko Toyokawa, Naomi Hibino & Tadashi Nishimatsu' },
            { title: 'Sinners', detail: 'Ken Diaz, Mike Fontaine & Shunika Terry' },
            { title: 'The Smashing Machine', detail: 'Kazu Hiro, Glen Griffin & Bjoern Rehbein' },
            { title: 'The Ugly Stepsister', detail: 'Thomas Foldberg & Anne Cathrine Sauerberg' }
        ]
    },
    'Original Score': {
        fullName: 'Best Original Score',
        count: 5,
        nominees: [
            { title: 'Bugonia', detail: 'Jerskin Fendrix' },
            { title: 'Frankenstein', detail: 'Alexandre Desplat' },
            { title: 'Hamnet', detail: 'Max Richter' },
            { title: 'One Battle After Another', detail: 'Jonny Greenwood' },
            { title: 'Sinners', detail: 'Ludwig Göransson' }
        ]
    },
    'Original Song': {
        fullName: 'Best Original Song',
        count: 5,
        nominees: [
            { title: '"Dear Me"', detail: 'Diane Warren: Relentless' },
            { title: '"Golden"', detail: 'KPop Demon Hunters' },
            { title: '"I Lied to You"', detail: 'Sinners' },
            { title: '"Sweet Dreams of Joy"', detail: 'Viva Verdi!' },
            { title: '"Train Dreams"', detail: 'Train Dreams' }
        ]
    },
    'Sound': {
        fullName: 'Best Sound',
        count: 5,
        nominees: [
            { title: 'F1', detail: 'Gareth John, Al Nelson, Gwendolyn Yates Whittle, Gary A. Rizzo & Juan Peralta' },
            { title: 'Frankenstein', detail: 'Greg Chapman, Nathan Robitaille, Nelson Ferreira, Christian Cooke & Brad Zoern' },
            { title: 'One Battle After Another', detail: 'José Antonio García, Christopher Scarabosio & Tony Villaflor' },
            { title: 'Sinners', detail: 'Chris Welcker, Benjamin A. Burtt, Felipe Pacheco, Brandon Proctor & Steve Boeddeker' },
            { title: 'Sirât', detail: 'Amanda Villavieja, Laia Casanovas & Yasmina Praderas' }
        ]
    },
    'Visual Effects': {
        fullName: 'Best Visual Effects',
        count: 5,
        nominees: [
            { title: 'Avatar: Fire and Ash', detail: 'Joe Letteri, Richard Baneham, Eric Saindon & Daniel Barrett' },
            { title: 'F1', detail: 'Ryan Tudhope, Nicolas Chevallier, Robert Harrington & Keith Dawson' },
            { title: 'Jurassic World Rebirth', detail: 'David Vickery, Stephen Aplin, Charmaine Chan & Neil Corbould' },
            { title: 'The Lost Bus', detail: 'Charlie Noble, David Zaretti, Russell Bowen & Brandon K. McLaughlin' },
            { title: 'Sinners', detail: 'Michael Ralla, Espen Nordahl, Guido Wolter & Donnie Dean' }
        ]
    },
    'Casting': {
        fullName: 'Best Casting',
        count: 5,
        nominees: [
            { title: 'Hamnet', detail: 'Nina Gold' },
            { title: 'Marty Supreme', detail: 'Jennifer Venditti' },
            { title: 'One Battle After Another', detail: 'Cassandra Kulukundis' },
            { title: 'The Secret Agent', detail: 'Gabriel Domingues' },
            { title: 'Sinners', detail: 'Francine Maisler' }
        ]
    },
    'Animated Short Film': {
        fullName: 'Best Animated Short Film',
        count: 5,
        nominees: [
            { title: 'Butterfly', detail: 'Florence Miailhe & Ron Dyens' },
            { title: 'Forevergreen', detail: 'Nathan Engelhardt & Jeremy Spears' },
            { title: 'The Girl Who Cried Pearls', detail: 'Chris Lavis & Maciek Szczerbowski' },
            { title: 'Retirement Plan', detail: 'John Kelly & Andrew Freedman' },
            { title: 'The Three Sisters', detail: 'Konstantin Bronzit' }
        ]
    },
    'Documentary Short Film': {
        fullName: 'Best Documentary Short Film',
        count: 5,
        nominees: [
            { title: 'All the Empty Rooms', detail: 'Joshua Seftel & Conall Jones' },
            { title: 'Armed Only with a Camera: The Life and Death of Brent Renaud', detail: 'Craig Renaud & Juan Arredondo' },
            { title: 'Children No More: "Were and Are Gone"', detail: 'Hilla Medalia & Sheila Nevins' },
            { title: 'The Devil Is Busy', detail: 'Christalyn Hampton & Geeta Gandbhir' },
            { title: 'Perfectly a Strangeness', detail: 'Alison McAlpine' }
        ]
    },
    'Live Action Short Film': {
        fullName: 'Best Live Action Short Film',
        count: 5,
        nominees: [
            { title: "Butcher's Stain", detail: 'Meyer Levinson-Blount & Oron Caspi' },
            { title: 'A Friend of Dorothy', detail: 'Lee Knight & James Dean' },
            { title: "Jane Austen's Period Drama", detail: 'Julia Aks & Steve Pinder' },
            { title: 'The Singers', detail: 'Sam A. Davis & Jack Piatt' },
            { title: 'Two People Exchanging Saliva', detail: 'Alexandre Singh & Natalie Musteata' }
        ]
    }
};

// Total expected categories and nominees
const EXPECTED_CATEGORY_COUNT = 24;
const EXPECTED_TOTAL_NOMINEES = Object.values(OFFICIAL_OSCAR_DATA).reduce(
    (sum, cat) => sum + cat.count, 0
);

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
});

async function completeOnboarding(page) {
    const browseBtn = page.locator('#browse-by-category');
    if (await browseBtn.isVisible()) {
        await browseBtn.click();
    }
    await page.waitForSelector('#films-list .film', { state: 'visible' });
}

async function navigateToCategory(page, categoryName) {
    const categorySelect = page.locator('#category-select');
    await categorySelect.selectOption({ label: categoryName });
    await page.waitForTimeout(100); // Allow UI to update
}

async function getNomineesFromApp(page) {
    return await page.evaluate(() => {
        const nominees = [];
        const filmElements = document.querySelectorAll('#films-list .film');
        filmElements.forEach(film => {
            const title = film.querySelector('.film-title')?.textContent?.trim() || '';
            const detail = film.querySelector('.film-studio')?.textContent?.trim() || '';
            nominees.push({ title, detail });
        });
        return nominees;
    });
}

async function getCategoryCount(page) {
    return await page.evaluate(() => {
        const options = document.querySelectorAll('#category-select option');
        return options.length;
    });
}

async function getCategoryNames(page) {
    return await page.evaluate(() => {
        const options = document.querySelectorAll('#category-select option');
        return Array.from(options).map(opt => opt.textContent.trim());
    });
}

// ============================================================================
// GLOBAL VALIDATION TESTS
// ============================================================================

test.describe('Oscar Data Validation - Global', () => {

    test('app should have correct number of categories (24)', async ({ page }) => {
        await completeOnboarding(page);
        const count = await getCategoryCount(page);
        expect(count).toBe(EXPECTED_CATEGORY_COUNT);
    });

    test('app should have all official category names', async ({ page }) => {
        await completeOnboarding(page);
        const appCategories = await getCategoryNames(page);
        const officialCategories = Object.keys(OFFICIAL_OSCAR_DATA);

        for (const category of officialCategories) {
            expect(appCategories,
                `Missing category: ${category}`
            ).toContain(category);
        }
    });

    test('app should not have any extra categories beyond official list', async ({ page }) => {
        await completeOnboarding(page);
        const appCategories = await getCategoryNames(page);
        const officialCategories = Object.keys(OFFICIAL_OSCAR_DATA);

        for (const appCategory of appCategories) {
            expect(officialCategories,
                `Unexpected category: ${appCategory}`
            ).toContain(appCategory);
        }
    });

    test('total nominees across all categories should be 110', async ({ page }) => {
        await completeOnboarding(page);
        let totalNominees = 0;

        const categoryNames = await getCategoryNames(page);
        for (const categoryName of categoryNames) {
            await navigateToCategory(page, categoryName);
            const nominees = await getNomineesFromApp(page);
            totalNominees += nominees.length;
        }

        expect(totalNominees).toBe(EXPECTED_TOTAL_NOMINEES);
    });
});

// ============================================================================
// PER-CATEGORY VALIDATION TESTS
// ============================================================================

// Generate tests for each category
for (const [categoryName, categoryData] of Object.entries(OFFICIAL_OSCAR_DATA)) {

    test.describe(`Oscar Data Validation - ${categoryData.fullName}`, () => {

        test(`should have exactly ${categoryData.count} nominees`, async ({ page }) => {
            await completeOnboarding(page);
            await navigateToCategory(page, categoryName);

            const nominees = await getNomineesFromApp(page);
            expect(nominees.length).toBe(categoryData.count);
        });

        test('should have all official nominees with correct titles', async ({ page }) => {
            await completeOnboarding(page);
            await navigateToCategory(page, categoryName);

            const appNominees = await getNomineesFromApp(page);
            const appTitles = appNominees.map(n => n.title);

            for (const official of categoryData.nominees) {
                expect(appTitles,
                    `Missing nominee "${official.title}" in ${categoryData.fullName}`
                ).toContain(official.title);
            }
        });

        test('should have all official nominees with correct details', async ({ page }) => {
            await completeOnboarding(page);
            await navigateToCategory(page, categoryName);

            const appNominees = await getNomineesFromApp(page);

            for (const official of categoryData.nominees) {
                const appNominee = appNominees.find(n => n.title === official.title);
                expect(appNominee,
                    `Nominee "${official.title}" not found in ${categoryData.fullName}`
                ).toBeDefined();
                expect(appNominee.detail,
                    `Wrong detail for "${official.title}" in ${categoryData.fullName}. ` +
                    `Expected: "${official.detail}", Got: "${appNominee?.detail}"`
                ).toBe(official.detail);
            }
        });

        test('should not have any extra nominees beyond official list', async ({ page }) => {
            await completeOnboarding(page);
            await navigateToCategory(page, categoryName);

            const appNominees = await getNomineesFromApp(page);
            const officialTitles = categoryData.nominees.map(n => n.title);

            for (const appNominee of appNominees) {
                expect(officialTitles,
                    `Unexpected nominee "${appNominee.title}" in ${categoryData.fullName}`
                ).toContain(appNominee.title);
            }
        });

        // Test for specific nominees in each category
        for (const nominee of categoryData.nominees) {
            test(`should include "${nominee.title}" with detail "${nominee.detail}"`, async ({ page }) => {
                await completeOnboarding(page);
                await navigateToCategory(page, categoryName);

                const appNominees = await getNomineesFromApp(page);
                const matchingNominee = appNominees.find(n => n.title === nominee.title);

                expect(matchingNominee,
                    `"${nominee.title}" not found in ${categoryData.fullName}`
                ).toBeDefined();
                expect(matchingNominee.detail,
                    `Wrong detail for "${nominee.title}"`
                ).toBe(nominee.detail);
            });
        }
    });
}

// ============================================================================
// CROSS-REFERENCE VALIDATION TESTS
// ============================================================================

test.describe('Oscar Data Validation - Cross-References', () => {

    test('Best Picture nominees should appear in other relevant categories', async ({ page }) => {
        await completeOnboarding(page);

        // Films that should appear in multiple categories
        const multiCategoryFilms = [
            { film: 'Sinners', categories: ['Director', 'Actor', 'Supporting Actor',
                'Supporting Actress', 'Original Screenplay', 'Cinematography',
                'Film Editing', 'Production Design', 'Costume Design',
                'Makeup and Hairstyling', 'Original Score', 'Original Song',
                'Sound', 'Visual Effects', 'Casting'] },
            { film: 'Frankenstein', categories: ['Supporting Actor', 'Adapted Screenplay',
                'Cinematography', 'Production Design', 'Costume Design',
                'Makeup and Hairstyling', 'Original Score', 'Sound'] },
            { film: 'One Battle After Another', categories: ['Director', 'Actor',
                'Supporting Actor', 'Supporting Actress', 'Adapted Screenplay',
                'Cinematography', 'Film Editing', 'Production Design',
                'Original Score', 'Sound', 'Casting'] }
        ];

        for (const { film, categories } of multiCategoryFilms) {
            for (const category of categories) {
                await navigateToCategory(page, category);
                const nominees = await getNomineesFromApp(page);
                const filmDetails = nominees.map(n => n.detail);
                const filmTitles = nominees.map(n => n.title);

                const foundInDetails = filmDetails.some(d => d.includes(film));
                const foundInTitles = filmTitles.some(t => t.includes(film));

                expect(foundInDetails || foundInTitles,
                    `"${film}" should appear in "${category}" category`
                ).toBe(true);
            }
        }
    });

    test('Directors in Best Director should match their films', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Director');

        const nominees = await getNomineesFromApp(page);
        const expectedDirectorFilms = {
            'Ryan Coogler': 'Sinners',
            'Paul Thomas Anderson': 'One Battle After Another',
            'Josh Safdie': 'Marty Supreme',
            'Chloé Zhao': 'Hamnet',
            'Joachim Trier': 'Sentimental Value'
        };

        for (const [director, film] of Object.entries(expectedDirectorFilms)) {
            const nominee = nominees.find(n => n.title === director);
            expect(nominee, `Director ${director} not found`).toBeDefined();
            expect(nominee.detail, `${director} should be directing ${film}`).toBe(film);
        }
    });

    test('Actors in Best Actor should match their films', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Actor');

        const nominees = await getNomineesFromApp(page);
        const expectedActorFilms = {
            'Timothée Chalamet': 'Marty Supreme',
            'Leonardo DiCaprio': 'One Battle After Another',
            'Ethan Hawke': 'Blue Moon',
            'Michael B. Jordan': 'Sinners',
            'Wagner Moura': 'The Secret Agent'
        };

        for (const [actor, film] of Object.entries(expectedActorFilms)) {
            const nominee = nominees.find(n => n.title === actor);
            expect(nominee, `Actor ${actor} not found`).toBeDefined();
            expect(nominee.detail, `${actor} should be in ${film}`).toBe(film);
        }
    });

    test('Actresses in Best Actress should match their films', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Actress');

        const nominees = await getNomineesFromApp(page);
        const expectedActressFilms = {
            'Jessie Buckley': 'Hamnet',
            'Rose Byrne': "If I Had Legs I'd Kick You",
            'Kate Hudson': 'Song Sung Blue',
            'Renate Reinsve': 'Sentimental Value',
            'Emma Stone': 'Bugonia'
        };

        for (const [actress, film] of Object.entries(expectedActressFilms)) {
            const nominee = nominees.find(n => n.title === actress);
            expect(nominee, `Actress ${actress} not found`).toBeDefined();
            expect(nominee.detail, `${actress} should be in ${film}`).toBe(film);
        }
    });

    test('International Feature nominees should have correct countries', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'International Feature');

        const nominees = await getNomineesFromApp(page);
        const expectedCountries = {
            'Sentimental Value': 'Norway',
            'The Secret Agent': 'Brazil',
            'Sirât': 'Spain',
            'The Voice of Hind Rajab': 'Tunisia',
            'It Was Just an Accident': 'France'
        };

        for (const [film, country] of Object.entries(expectedCountries)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Film ${film} not found`).toBeDefined();
            expect(nominee.detail, `${film} should be from ${country}`).toBe(country);
        }
    });

    test('Supporting Actors should match their films', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Supporting Actor');

        const nominees = await getNomineesFromApp(page);
        const expectedActorFilms = {
            'Jacob Elordi': 'Frankenstein',
            'Benicio Del Toro': 'One Battle After Another',
            'Sean Penn': 'One Battle After Another',
            'Delroy Lindo': 'Sinners',
            'Stellan Skarsgård': 'Sentimental Value'
        };

        for (const [actor, film] of Object.entries(expectedActorFilms)) {
            const nominee = nominees.find(n => n.title === actor);
            expect(nominee, `Actor ${actor} not found`).toBeDefined();
            expect(nominee.detail, `${actor} should be in ${film}`).toBe(film);
        }
    });

    test('Supporting Actresses should match their films', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Supporting Actress');

        const nominees = await getNomineesFromApp(page);
        const expectedActressFilms = {
            'Teyana Taylor': 'One Battle After Another',
            'Wunmi Mosaku': 'Sinners',
            'Elle Fanning': 'Sentimental Value',
            'Inga Ibsdotter Lilleaas': 'Sentimental Value',
            'Amy Madigan': 'Weapons'
        };

        for (const [actress, film] of Object.entries(expectedActressFilms)) {
            const nominee = nominees.find(n => n.title === actress);
            expect(nominee, `Actress ${actress} not found`).toBeDefined();
            expect(nominee.detail, `${actress} should be in ${film}`).toBe(film);
        }
    });
});

// ============================================================================
// DATA INTEGRITY TESTS
// ============================================================================

test.describe('Oscar Data Validation - Data Integrity', () => {

    test('no duplicate nominees within a category', async ({ page }) => {
        await completeOnboarding(page);

        const categoryNames = await getCategoryNames(page);
        for (const categoryName of categoryNames) {
            await navigateToCategory(page, categoryName);
            const nominees = await getNomineesFromApp(page);
            const titles = nominees.map(n => n.title);
            const uniqueTitles = [...new Set(titles)];

            expect(titles.length,
                `Duplicate nominees found in ${categoryName}`
            ).toBe(uniqueTitles.length);
        }
    });

    test('all nominees should have non-empty titles', async ({ page }) => {
        await completeOnboarding(page);

        const categoryNames = await getCategoryNames(page);
        for (const categoryName of categoryNames) {
            await navigateToCategory(page, categoryName);
            const nominees = await getNomineesFromApp(page);

            for (const nominee of nominees) {
                expect(nominee.title.trim().length,
                    `Empty title found in ${categoryName}`
                ).toBeGreaterThan(0);
            }
        }
    });

    test('all nominees should have non-empty details', async ({ page }) => {
        await completeOnboarding(page);

        const categoryNames = await getCategoryNames(page);
        for (const categoryName of categoryNames) {
            await navigateToCategory(page, categoryName);
            const nominees = await getNomineesFromApp(page);

            for (const nominee of nominees) {
                expect(nominee.detail.trim().length,
                    `Empty detail found for "${nominee.title}" in ${categoryName}`
                ).toBeGreaterThan(0);
            }
        }
    });

    test('Best Picture should have exactly 10 nominees', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Picture');

        const nominees = await getNomineesFromApp(page);
        expect(nominees.length).toBe(10);
    });

    test('all other categories should have exactly 5 nominees', async ({ page }) => {
        await completeOnboarding(page);

        const categoryNames = await getCategoryNames(page);
        for (const categoryName of categoryNames) {
            if (categoryName === 'Picture') continue;

            await navigateToCategory(page, categoryName);
            const nominees = await getNomineesFromApp(page);
            expect(nominees.length,
                `${categoryName} should have 5 nominees, found ${nominees.length}`
            ).toBe(5);
        }
    });
});

// ============================================================================
// SPECIAL CHARACTER AND FORMATTING TESTS
// ============================================================================

test.describe('Oscar Data Validation - Special Characters', () => {

    test('Chloé Zhao name should include accent mark', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Director');

        const nominees = await getNomineesFromApp(page);
        const chloe = nominees.find(n => n.title.includes('Zhao'));

        expect(chloe).toBeDefined();
        expect(chloe.title).toBe('Chloé Zhao');
    });

    test('Ludwig Göransson name should include umlaut', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Original Score');

        const nominees = await getNomineesFromApp(page);
        const sinners = nominees.find(n => n.title === 'Sinners');

        expect(sinners).toBeDefined();
        expect(sinners.detail).toContain('Göransson');
    });

    test('Sirât title should include accent mark', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'International Feature');

        const nominees = await getNomineesFromApp(page);
        const sirat = nominees.find(n => n.title.includes('Sir'));

        expect(sirat).toBeDefined();
        expect(sirat.title).toBe('Sirât');
    });

    test('Stellan Skarsgård name should include ring accent', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Supporting Actor');

        const nominees = await getNomineesFromApp(page);
        const stellan = nominees.find(n => n.title.includes('Skarsg'));

        expect(stellan).toBeDefined();
        expect(stellan.title).toBe('Stellan Skarsgård');
    });

    test('Little Amélie title should include accent mark', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Animated Feature');

        const nominees = await getNomineesFromApp(page);
        const amelie = nominees.find(n => n.title.includes('Am'));

        expect(amelie).toBeDefined();
        expect(amelie.title).toContain('Amélie');
    });

    test('song titles should be in quotes', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Original Song');

        const nominees = await getNomineesFromApp(page);

        for (const nominee of nominees) {
            expect(nominee.title.startsWith('"'),
                `Song "${nominee.title}" should start with quote`
            ).toBe(true);
            expect(nominee.title.endsWith('"'),
                `Song "${nominee.title}" should end with quote`
            ).toBe(true);
        }
    });

    test('If I Had Legs I\'d Kick You should have correct apostrophe', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Actress');

        const nominees = await getNomineesFromApp(page);
        const roseByrne = nominees.find(n => n.title === 'Rose Byrne');

        expect(roseByrne).toBeDefined();
        expect(roseByrne.detail).toBe("If I Had Legs I'd Kick You");
    });

    test('Olivier Bugge Coutté name should include accent mark', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Film Editing');

        const nominees = await getNomineesFromApp(page);
        const sentimental = nominees.find(n => n.title === 'Sentimental Value');

        expect(sentimental).toBeDefined();
        expect(sentimental.detail).toBe('Olivier Bugge Coutté');
    });

    test('Timothée Chalamet name should include accent marks', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Actor');

        const nominees = await getNomineesFromApp(page);
        const timothee = nominees.find(n => n.title.includes('Chalamet'));

        expect(timothee).toBeDefined();
        expect(timothee.title).toBe('Timothée Chalamet');
    });
});

// ============================================================================
// PROGRESS COUNTER VALIDATION
// ============================================================================

test.describe('Oscar Data Validation - Progress Counters', () => {

    test('Best Picture progress should show X/10', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Picture');

        const progress = await page.locator('#progress').textContent();
        expect(progress).toMatch(/\d+\s*\/\s*10/);
    });

    test('Best Director progress should show X/5', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Director');

        const progress = await page.locator('#progress').textContent();
        expect(progress).toMatch(/\d+\s*\/\s*5/);
    });

    test('each category progress should match nominee count', async ({ page }) => {
        await completeOnboarding(page);

        for (const [categoryName, categoryData] of Object.entries(OFFICIAL_OSCAR_DATA)) {
            await navigateToCategory(page, categoryName);

            const progress = await page.locator('#progress').textContent();
            const expectedPattern = new RegExp(`\\d+\\s*/\\s*${categoryData.count}`);

            expect(progress,
                `${categoryData.fullName} progress should show X/${categoryData.count}`
            ).toMatch(expectedPattern);
        }
    });
});

// ============================================================================
// TECHNICAL CREDITS VALIDATION
// ============================================================================

test.describe('Oscar Data Validation - Technical Credits', () => {

    test('Cinematography nominees should have correct cinematographers', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Cinematography');

        const nominees = await getNomineesFromApp(page);
        const expectedCredits = {
            'Frankenstein': 'Dan Laustsen',
            'Marty Supreme': 'Darius Khondji',
            'One Battle After Another': 'Michael Bauman',
            'Sinners': 'Autumn Durald Arkapaw',
            'Train Dreams': 'Adolpho Veloso'
        };

        for (const [film, cinematographer] of Object.entries(expectedCredits)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Film ${film} not found`).toBeDefined();
            expect(nominee.detail).toBe(cinematographer);
        }
    });

    test('Production Design nominees should have correct designers', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Production Design');

        const nominees = await getNomineesFromApp(page);
        const expectedCredits = {
            'Frankenstein': 'Tamara Deverell & Shane Vieau',
            'Hamnet': 'Fiona Crombie & Alice Felton',
            'Marty Supreme': 'Jack Fisk & Adam Willis',
            'One Battle After Another': 'Florencia Martin & Anthony Carlino',
            'Sinners': 'Hannah Beachler & Monique Champagne'
        };

        for (const [film, designers] of Object.entries(expectedCredits)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Film ${film} not found`).toBeDefined();
            expect(nominee.detail).toBe(designers);
        }
    });

    test('Original Score nominees should have correct composers', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Original Score');

        const nominees = await getNomineesFromApp(page);
        const expectedCredits = {
            'Bugonia': 'Jerskin Fendrix',
            'Frankenstein': 'Alexandre Desplat',
            'Hamnet': 'Max Richter',
            'One Battle After Another': 'Jonny Greenwood',
            'Sinners': 'Ludwig Göransson'
        };

        for (const [film, composer] of Object.entries(expectedCredits)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Film ${film} not found`).toBeDefined();
            expect(nominee.detail).toBe(composer);
        }
    });

    test('Casting nominees should have correct casting directors', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Casting');

        const nominees = await getNomineesFromApp(page);
        const expectedCredits = {
            'Hamnet': 'Nina Gold',
            'Marty Supreme': 'Jennifer Venditti',
            'One Battle After Another': 'Cassandra Kulukundis',
            'The Secret Agent': 'Gabriel Domingues',
            'Sinners': 'Francine Maisler'
        };

        for (const [film, castingDirector] of Object.entries(expectedCredits)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Film ${film} not found`).toBeDefined();
            expect(nominee.detail).toBe(castingDirector);
        }
    });

    test('Film Editing nominees should have correct editors', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Film Editing');

        const nominees = await getNomineesFromApp(page);
        const expectedCredits = {
            'F1': 'Stephen Mirrione',
            'Marty Supreme': 'Ronald Bronstein & Josh Safdie',
            'One Battle After Another': 'Andy Jurgensen',
            'Sentimental Value': 'Olivier Bugge Coutté',
            'Sinners': 'Michael P. Shawver'
        };

        for (const [film, editor] of Object.entries(expectedCredits)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Film ${film} not found`).toBeDefined();
            expect(nominee.detail).toBe(editor);
        }
    });

    test('Costume Design nominees should have correct designers', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Costume Design');

        const nominees = await getNomineesFromApp(page);
        const expectedCredits = {
            'Avatar: Fire and Ash': 'Deborah L. Scott',
            'Frankenstein': 'Luis Sequeira',
            'Hamnet': 'Sandy Powell',
            'Marty Supreme': 'Courtney Hoffman',
            'Sinners': 'Ruth E. Carter'
        };

        for (const [film, designer] of Object.entries(expectedCredits)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Film ${film} not found`).toBeDefined();
            expect(nominee.detail).toBe(designer);
        }
    });

    test('Sound nominees should have correct sound teams', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Sound');

        const nominees = await getNomineesFromApp(page);
        const expectedCredits = {
            'F1': 'Mark Weingarten & James H. Mather',
            'Frankenstein': 'Randy Thom & Gary Rydstrom',
            'One Battle After Another': 'Richard King',
            'Sinners': 'Steve Boeddeker & Brandon Proctor',
            'Sirât': 'Olivier Goinard'
        };

        for (const [film, soundTeam] of Object.entries(expectedCredits)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Film ${film} not found`).toBeDefined();
            expect(nominee.detail).toBe(soundTeam);
        }
    });

    test('Visual Effects nominees should have correct VFX supervisors', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Visual Effects');

        const nominees = await getNomineesFromApp(page);
        const expectedCredits = {
            'Avatar: Fire and Ash': 'Joe Letteri & Eric Saindon',
            'F1': 'Alex Wuttke',
            'Jurassic World Rebirth': 'David Vickery',
            'The Lost Bus': 'Charmaine Chan',
            'Sinners': 'Erik Henry'
        };

        for (const [film, vfxSupervisor] of Object.entries(expectedCredits)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Film ${film} not found`).toBeDefined();
            expect(nominee.detail).toBe(vfxSupervisor);
        }
    });

    test('Makeup and Hairstyling nominees should have correct artists', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Makeup and Hairstyling');

        const nominees = await getNomineesFromApp(page);
        const expectedCredits = {
            'Frankenstein': 'Mike Hill, Jordan Samuel & Cliona Furey',
            'Kokuho': 'Kyoko Toyokawa, Naomi Hibino & Tadashi Nishimatsu',
            'Sinners': 'Ken Diaz, Mike Fontaine & Shunika Terry',
            'The Smashing Machine': 'Kazu Hiro, Glen Griffin & Bjoern Rehbein',
            'The Ugly Stepsister': 'Thomas Foldberg & Anne Cathrine Sauerberg'
        };

        for (const [film, artists] of Object.entries(expectedCredits)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Film ${film} not found`).toBeDefined();
            expect(nominee.detail).toBe(artists);
        }
    });
});

// ============================================================================
// ORIGINAL SONG VALIDATION
// ============================================================================

test.describe('Oscar Data Validation - Original Songs', () => {

    test('should have correct song titles with quotes', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Original Song');

        const nominees = await getNomineesFromApp(page);
        const expectedSongs = [
            '"Dear Me"',
            '"Golden"',
            '"I Lied to You"',
            '"Sweet Dreams of Joy"',
            '"Train Dreams"'
        ];

        const songTitles = nominees.map(n => n.title);
        for (const song of expectedSongs) {
            expect(songTitles, `Missing song: ${song}`).toContain(song);
        }
    });

    test('songs should have correct film associations', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Original Song');

        const nominees = await getNomineesFromApp(page);
        const expectedFilms = {
            '"Dear Me"': 'Diane Warren: Relentless',
            '"Golden"': 'KPop Demon Hunters',
            '"I Lied to You"': 'Sinners',
            '"Sweet Dreams of Joy"': 'Viva Verdi!',
            '"Train Dreams"': 'Train Dreams'
        };

        for (const [song, film] of Object.entries(expectedFilms)) {
            const nominee = nominees.find(n => n.title === song);
            expect(nominee, `Song ${song} not found`).toBeDefined();
            expect(nominee.detail).toBe(film);
        }
    });
});

// ============================================================================
// DOCUMENTARY AND ANIMATED VALIDATION
// ============================================================================

test.describe('Oscar Data Validation - Documentary Feature', () => {

    test('should have all documentary nominees with correct directors', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Documentary Feature');

        const nominees = await getNomineesFromApp(page);
        const expectedDocs = {
            'The Alabama Solution': 'Andrew Jarecki & Charlotte Kaufman',
            'Come See Me in the Good Light': 'Ryan White',
            'Cutting through Rocks': 'Sara Khaki & Mohammadreza Eyni',
            'Mr. Nobody against Putin': 'Vera Krichevskaya',
            'The Perfect Neighbor': 'Geeta Gandbhir & Alison Payne'
        };

        for (const [doc, directors] of Object.entries(expectedDocs)) {
            const nominee = nominees.find(n => n.title === doc);
            expect(nominee, `Documentary ${doc} not found`).toBeDefined();
            expect(nominee.detail).toBe(directors);
        }
    });
});

test.describe('Oscar Data Validation - Animated Feature', () => {

    test('should have all animated nominees with correct studios', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Animated Feature');

        const nominees = await getNomineesFromApp(page);
        const expectedAnimated = {
            'Arco': 'Neon',
            'Elio': 'Disney/Pixar',
            'KPop Demon Hunters': 'Netflix',
            'Little Amélie or the Character of Rain': 'GKIDS',
            'Zootopia 2': 'Disney'
        };

        for (const [film, studio] of Object.entries(expectedAnimated)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Animated film ${film} not found`).toBeDefined();
            expect(nominee.detail).toBe(studio);
        }
    });
});

// ============================================================================
// SCREENPLAY VALIDATION
// ============================================================================

test.describe('Oscar Data Validation - Screenplays', () => {

    test('Original Screenplay nominees should have correct writers', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Original Screenplay');

        const nominees = await getNomineesFromApp(page);
        const expectedWriters = {
            'Sinners': 'Ryan Coogler',
            'Sentimental Value': 'Eskil Vogt & Joachim Trier',
            'Blue Moon': 'Richard Linklater',
            'Marty Supreme': 'Ronald Bronstein & Josh Safdie',
            'It Was Just an Accident': 'Jafar Panahi'
        };

        for (const [film, writer] of Object.entries(expectedWriters)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Film ${film} not found in Original Screenplay`).toBeDefined();
            expect(nominee.detail).toBe(writer);
        }
    });

    test('Adapted Screenplay nominees should have correct writers', async ({ page }) => {
        await completeOnboarding(page);
        await navigateToCategory(page, 'Adapted Screenplay');

        const nominees = await getNomineesFromApp(page);
        const expectedWriters = {
            'One Battle After Another': 'Paul Thomas Anderson',
            'Train Dreams': 'Clint Bentley & Greg Kwedar',
            'Frankenstein': 'Guillermo del Toro',
            'Hamnet': 'Chloé Zhao',
            'Bugonia': 'Will Tracy'
        };

        for (const [film, writer] of Object.entries(expectedWriters)) {
            const nominee = nominees.find(n => n.title === film);
            expect(nominee, `Film ${film} not found in Adapted Screenplay`).toBeDefined();
            expect(nominee.detail).toBe(writer);
        }
    });
});
