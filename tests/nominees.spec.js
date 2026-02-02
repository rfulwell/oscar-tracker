// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Official 98th Academy Awards (2026) Nominee Data
 * Source: Academy of Motion Picture Arts and Sciences (oscars.org)
 * Nominations announced: January 22, 2026
 * Ceremony: March 15, 2026
 */

// Categories indexed by their position in the dropdown (0-indexed)
// These match the CATEGORIES array order in app.js
const CATEGORY_INDICES = {
    'best-picture': 0,
    'best-director': 1,
    'best-actor': 2,
    'best-actress': 3,
    'best-supporting-actor': 4,
    'best-supporting-actress': 5,
    'best-original-screenplay': 6,
    'best-adapted-screenplay': 7,
    'best-animated-feature': 8,
    'best-international-feature': 9,
    'best-documentary-feature': 10,
    'best-cinematography': 11,
    'best-film-editing': 12,
    'best-production-design': 13,
    'best-costume-design': 14,
    'best-makeup-hairstyling': 15,
    'best-original-score': 16,
    'best-original-song': 17,
    'best-sound': 18,
    'best-visual-effects': 19,
    'best-casting': 20
};

const OFFICIAL_NOMINEES = {
    'best-picture': {
        count: 10,
        titles: [
            'Bugonia',
            'F1',
            'Frankenstein',
            'Hamnet',
            'Marty Supreme',
            'One Battle After Another',
            'The Secret Agent',
            'Sentimental Value',
            'Sinners',
            'Train Dreams'
        ]
    },
    'best-director': {
        count: 5,
        titles: [
            'Ryan Coogler',
            'Paul Thomas Anderson',
            'Josh Safdie',
            'Chloé Zhao',
            'Joachim Trier'
        ]
    },
    'best-actor': {
        count: 5,
        titles: [
            'Timothée Chalamet',
            'Leonardo DiCaprio',
            'Ethan Hawke',
            'Michael B. Jordan',
            'Wagner Moura'
        ]
    },
    'best-actress': {
        count: 5,
        titles: [
            'Jessie Buckley',
            'Rose Byrne',
            'Kate Hudson',
            'Renate Reinsve',
            'Emma Stone'
        ]
    },
    'best-supporting-actor': {
        count: 5,
        titles: [
            'Jacob Elordi',
            'Benicio Del Toro',
            'Sean Penn',
            'Delroy Lindo',
            'Stellan Skarsgård'
        ]
    },
    'best-supporting-actress': {
        count: 5,
        titles: [
            'Teyana Taylor',
            'Wunmi Mosaku',
            'Elle Fanning',
            'Inga Ibsdotter Lilleaas',
            'Gwyneth Paltrow'
        ]
    },
    'best-original-screenplay': {
        count: 5,
        titles: [
            'Sinners',
            'Sentimental Value',
            'Blue Moon',
            'Marty Supreme',
            'It Was Just an Accident'
        ]
    },
    'best-adapted-screenplay': {
        count: 5,
        titles: [
            'One Battle After Another',
            'Train Dreams',
            'Frankenstein',
            'Hamnet',
            'The Secret Agent'
        ]
    },
    'best-animated-feature': {
        count: 5,
        titles: [
            'Arco',
            'Elio',
            'KPop Demon Hunters',
            'Little Amélie or the Character of Rain',
            'Zootopia 2'
        ]
    },
    'best-international-feature': {
        count: 5,
        titles: [
            'Sentimental Value',
            'The Secret Agent',
            'Sirât',
            'The Voice of Hind Rajab',
            'It Was Just an Accident'
        ]
    },
    'best-documentary-feature': {
        count: 5,
        titles: [
            'The Alabama Solution',
            'Come See Me in the Good Light',
            'Cutting through Rocks',
            'Mr. Nobody against Putin',
            'The Perfect Neighbor'
        ]
    },
    'best-cinematography': {
        count: 5,
        titles: [
            'Frankenstein',
            'Marty Supreme',
            'One Battle After Another',
            'Sinners',
            'Train Dreams'
        ]
    },
    'best-film-editing': {
        count: 5,
        titles: [
            'F1',
            'Marty Supreme',
            'One Battle After Another',
            'Sentimental Value',
            'Sinners'
        ]
    },
    'best-production-design': {
        count: 5,
        titles: [
            'Frankenstein',
            'Hamnet',
            'Marty Supreme',
            'One Battle After Another',
            'Sinners'
        ]
    },
    'best-costume-design': {
        count: 5,
        titles: [
            'Avatar: Fire and Ash',
            'Frankenstein',
            'Hamnet',
            'Marty Supreme',
            'Sinners'
        ]
    },
    'best-makeup-hairstyling': {
        count: 5,
        titles: [
            'Frankenstein',
            'Kokuho',
            'Sinners',
            'The Smashing Machine',
            'The Ugly Stepsister'
        ]
    },
    'best-original-score': {
        count: 5,
        titles: [
            'Bugonia',
            'Frankenstein',
            'Hamnet',
            'One Battle After Another',
            'Sinners'
        ]
    },
    'best-original-song': {
        count: 5,
        titles: [
            '"Dear Me"',
            '"Golden"',
            '"I Lied to You"',
            '"Sweet Dreams of Joy"',
            '"Train Dreams"'
        ]
    },
    'best-sound': {
        count: 5,
        titles: [
            'F1',
            'Frankenstein',
            'One Battle After Another',
            'Sinners',
            'Sirât'
        ]
    },
    'best-visual-effects': {
        count: 5,
        titles: [
            'Avatar: Fire and Ash',
            'F1',
            'Jurassic World Rebirth',
            'The Lost Bus',
            'Sinners'
        ]
    },
    'best-casting': {
        count: 5,
        titles: [
            'Hamnet',
            'Marty Supreme',
            'One Battle After Another',
            'Sentimental Value',
            'Sinners'
        ]
    }
};

test.describe('98th Academy Awards Nominee Data Verification', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        // Complete onboarding
        const browseBtn = page.locator('#browse-by-category');
        if (await browseBtn.isVisible()) {
            await browseBtn.click();
        }
        await page.waitForSelector('#category-screen', { state: 'visible' });
    });

    // Test each category has exactly the correct number of nominees
    for (const [categoryId, data] of Object.entries(OFFICIAL_NOMINEES)) {
        test(`${categoryId} has correct number of nominees (${data.count})`, async ({ page }) => {
            // Navigate to category using index
            const index = CATEGORY_INDICES[categoryId];
            await page.locator('#category-select').selectOption(String(index));
            await page.waitForTimeout(200);

            // Count nominees
            const nominees = await page.locator('#films-list .film').count();
            expect(nominees).toBe(data.count);
        });
    }

    // Test specific categories that had data issues
    test('International Feature has correct nominees (no animated films)', async ({ page }) => {
        const index = CATEGORY_INDICES['best-international-feature'];
        await page.locator('#category-select').selectOption(String(index));
        await page.waitForTimeout(200);

        const nomineeTitles = await page.locator('#films-list .film-title').allTextContents();

        // Should include these official nominees
        expect(nomineeTitles).toContain('Sentimental Value');
        expect(nomineeTitles).toContain('The Secret Agent');
        expect(nomineeTitles).toContain('Sirât');
        expect(nomineeTitles).toContain('The Voice of Hind Rajab');
        expect(nomineeTitles).toContain('It Was Just an Accident');

        // Should NOT include animated films
        expect(nomineeTitles).not.toContain('Arco');
        expect(nomineeTitles).not.toContain('Little Amélie or the Character of Rain');
        expect(nomineeTitles).not.toContain("I'm Still Here");
    });

    test('International Feature has correct countries', async ({ page }) => {
        const index = CATEGORY_INDICES['best-international-feature'];
        await page.locator('#category-select').selectOption(String(index));
        await page.waitForTimeout(200);

        const subtitles = await page.locator('#films-list .film-studio').allTextContents();

        expect(subtitles).toContain('Norway');
        expect(subtitles).toContain('Brazil');
        expect(subtitles).toContain('Spain');
        expect(subtitles).toContain('Tunisia');
        expect(subtitles).toContain('France');
    });

    test('Documentary Feature has correct nominees', async ({ page }) => {
        const index = CATEGORY_INDICES['best-documentary-feature'];
        await page.locator('#category-select').selectOption(String(index));
        await page.waitForTimeout(200);

        const nomineeTitles = await page.locator('#films-list .film-title').allTextContents();

        // Should include these official nominees
        expect(nomineeTitles).toContain('The Alabama Solution');
        expect(nomineeTitles).toContain('Come See Me in the Good Light');
        expect(nomineeTitles).toContain('Cutting through Rocks');
        expect(nomineeTitles).toContain('Mr. Nobody against Putin');
        expect(nomineeTitles).toContain('The Perfect Neighbor');

        // Should NOT include incorrect nominees
        expect(nomineeTitles).not.toContain('Seeds');
    });

    test('Animated Feature has correct nominees', async ({ page }) => {
        const index = CATEGORY_INDICES['best-animated-feature'];
        await page.locator('#category-select').selectOption(String(index));
        await page.waitForTimeout(200);

        const nomineeTitles = await page.locator('#films-list .film-title').allTextContents();

        expect(nomineeTitles).toContain('Arco');
        expect(nomineeTitles).toContain('Elio');
        expect(nomineeTitles).toContain('KPop Demon Hunters');
        expect(nomineeTitles).toContain('Little Amélie or the Character of Rain');
        expect(nomineeTitles).toContain('Zootopia 2');
    });

    test('Best Picture has exactly 10 nominees', async ({ page }) => {
        const index = CATEGORY_INDICES['best-picture'];
        await page.locator('#category-select').selectOption(String(index));
        await page.waitForTimeout(200);

        const nominees = await page.locator('#films-list .film').count();
        expect(nominees).toBe(10);
    });

    test('All other categories have exactly 5 nominees', async ({ page }) => {
        const fiveNomineeCategories = Object.keys(OFFICIAL_NOMINEES).filter(
            cat => cat !== 'best-picture'
        );

        for (const categoryId of fiveNomineeCategories) {
            const index = CATEGORY_INDICES[categoryId];
            await page.locator('#category-select').selectOption(String(index));
            await page.waitForTimeout(100);

            const nominees = await page.locator('#films-list .film').count();
            expect(nominees, `${categoryId} should have 5 nominees`).toBe(5);
        }
    });

    // Verify total category count (21 categories total)
    test('app has all 21 official categories', async ({ page }) => {
        const categoryOptions = await page.locator('#category-select option').count();
        expect(categoryOptions).toBe(21);
    });

    // Verify Best Casting category exists (new for 2026)
    test('Best Casting category exists (new for 98th Awards)', async ({ page }) => {
        const options = await page.locator('#category-select option').allTextContents();
        expect(options).toContain('Casting');
    });

    // Verify Sinners has record-breaking 16 nominations
    test('Sinners appears in 16 categories (record)', async ({ page }) => {
        let sinnersCount = 0;
        const categoryCount = await page.locator('#category-select option').count();

        for (let i = 0; i < categoryCount; i++) {
            await page.locator('#category-select').selectOption(String(i));
            await page.waitForTimeout(50);

            const nomineeTitles = await page.locator('#films-list .film-title').allTextContents();
            const hasSinners = nomineeTitles.some(title =>
                title === 'Sinners' ||
                title === 'Ryan Coogler' ||
                title === 'Michael B. Jordan' ||
                title === 'Delroy Lindo' ||
                title === 'Wunmi Mosaku' ||
                title === '"I Lied to You"'
            );

            if (hasSinners) sinnersCount++;
        }

        expect(sinnersCount).toBe(16);
    });
});
