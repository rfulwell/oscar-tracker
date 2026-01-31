/**
 * Oscar Tracker Test Suite
 * Run with: node tests.js
 */

// Colors for terminal output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    gray: '\x1b[90m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

// Test results
let passed = 0;
let failed = 0;
const errors = [];

// Simple test framework
function describe(name, fn) {
    console.log(`\n${colors.bold}${name}${colors.reset}`);
    fn();
}

function test(name, fn) {
    try {
        fn();
        passed++;
        console.log(`  ${colors.green}✓${colors.reset} ${name}`);
    } catch (e) {
        failed++;
        errors.push({ name, error: e.message });
        console.log(`  ${colors.red}✗${colors.reset} ${name}`);
        console.log(`    ${colors.gray}${e.message}${colors.reset}`);
    }
}

function expect(value) {
    return {
        toBe(expected) {
            if (value !== expected) {
                throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(value)}`);
            }
        },
        toEqual(expected) {
            if (JSON.stringify(value) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(value)}`);
            }
        },
        toBeTruthy() {
            if (!value) {
                throw new Error(`Expected truthy value, got ${JSON.stringify(value)}`);
            }
        },
        toBeFalsy() {
            if (value) {
                throw new Error(`Expected falsy value, got ${JSON.stringify(value)}`);
            }
        },
        toBeGreaterThan(expected) {
            if (value <= expected) {
                throw new Error(`Expected ${value} to be greater than ${expected}`);
            }
        },
        toContain(expected) {
            if (Array.isArray(value)) {
                if (!value.includes(expected)) {
                    throw new Error(`Expected array to contain ${JSON.stringify(expected)}`);
                }
            } else if (typeof value === 'string') {
                if (!value.includes(expected)) {
                    throw new Error(`Expected string to contain "${expected}"`);
                }
            }
        },
        toHaveLength(expected) {
            if (value.length !== expected) {
                throw new Error(`Expected length ${expected}, got ${value.length}`);
            }
        }
    };
}

// Load app.js and extract CATEGORIES using regex
const fs = require('fs');
const appCode = fs.readFileSync('./app.js', 'utf8');

// Extract the CATEGORIES array from the source
const categoriesMatch = appCode.match(/const CATEGORIES = (\[[\s\S]*?\n\]);/);
if (!categoriesMatch) {
    console.error('Could not extract CATEGORIES from app.js');
    process.exit(1);
}

// Evaluate the CATEGORIES array
let CATEGORIES;
try {
    CATEGORIES = eval(categoriesMatch[1]);
} catch (e) {
    console.error('Could not parse CATEGORIES:', e.message);
    process.exit(1);
}

// Extract storage keys
const storageKeyMatch = appCode.match(/const STORAGE_KEY = ['"]([^'"]+)['"]/);
const categoryKeyMatch = appCode.match(/const CATEGORY_KEY = ['"]([^'"]+)['"]/);
const STORAGE_KEY = storageKeyMatch ? storageKeyMatch[1] : null;
const CATEGORY_KEY = categoryKeyMatch ? categoryKeyMatch[1] : null;

console.log(`${colors.bold}${colors.yellow}Oscar Tracker Test Suite${colors.reset}\n`);

// Data Structure Tests
describe('Data Structure', () => {
    test('CATEGORIES is defined and is an array', () => {
        expect(typeof CATEGORIES).toBe('object');
        expect(Array.isArray(CATEGORIES)).toBe(true);
    });

    test('CATEGORIES has 21 award categories', () => {
        expect(CATEGORIES.length).toBe(21);
    });

    test('Each category has required properties (id, name, nominees)', () => {
        CATEGORIES.forEach(cat => {
            expect(typeof cat.id).toBe('string');
            expect(typeof cat.name).toBe('string');
            expect(Array.isArray(cat.nominees)).toBe(true);
        });
    });

    test('Best Picture has 10 nominees', () => {
        const bestPicture = CATEGORIES.find(c => c.id === 'best-picture');
        expect(bestPicture.nominees.length).toBe(10);
    });

    test('Other categories have 5 nominees each', () => {
        CATEGORIES.filter(c => c.id !== 'best-picture').forEach(cat => {
            expect(cat.nominees.length).toBe(5);
        });
    });

    test('Total nominees count is 110 (10 + 20×5)', () => {
        const total = CATEGORIES.reduce((sum, cat) => sum + cat.nominees.length, 0);
        expect(total).toBe(110);
    });

    test('All nominees have unique IDs', () => {
        const allIds = CATEGORIES.flatMap(c => c.nominees.map(n => n.id));
        const uniqueIds = new Set(allIds);
        expect(uniqueIds.size).toBe(allIds.length);
    });

    test('All nominees have title and subtitle', () => {
        let allValid = true;
        CATEGORIES.forEach(cat => {
            cat.nominees.forEach(nominee => {
                if (!nominee.id || !nominee.title || !nominee.subtitle) {
                    allValid = false;
                }
            });
        });
        expect(allValid).toBe(true);
    });
});

// Category Verification Tests
describe('Category Content Verification', () => {
    test('Best Picture contains expected films', () => {
        const bp = CATEGORIES.find(c => c.id === 'best-picture');
        const titles = bp.nominees.map(n => n.title);
        expect(titles).toContain('Sinners');
        expect(titles).toContain('Marty Supreme');
        expect(titles).toContain('F1');
        expect(titles).toContain('Frankenstein');
        expect(titles).toContain('Hamnet');
    });

    test('Best Picture films have correct studios', () => {
        const bp = CATEGORIES.find(c => c.id === 'best-picture');
        const sinners = bp.nominees.find(n => n.title === 'Sinners');
        expect(sinners.subtitle).toBe('Warner Bros.');

        const marty = bp.nominees.find(n => n.title === 'Marty Supreme');
        expect(marty.subtitle).toBe('A24');
    });

    test('Best Director contains 5 directors', () => {
        const bd = CATEGORIES.find(c => c.id === 'best-director');
        expect(bd.nominees.length).toBe(5);

        const names = bd.nominees.map(n => n.title);
        expect(names).toContain('Ryan Coogler');
        expect(names).toContain('Josh Safdie');
        expect(names).toContain('Paul Thomas Anderson');
    });

    test('Best Actor nominees are correct', () => {
        const ba = CATEGORIES.find(c => c.id === 'best-actor');
        const names = ba.nominees.map(n => n.title);
        expect(names).toContain('Timothée Chalamet');
        expect(names).toContain('Michael B. Jordan');
        expect(names).toContain('Leonardo DiCaprio');
    });

    test('Best Actress nominees are correct', () => {
        const ba = CATEGORIES.find(c => c.id === 'best-actress');
        const names = ba.nominees.map(n => n.title);
        expect(names).toContain('Emma Stone');
        expect(names).toContain('Jessie Buckley');
        expect(names).toContain('Renate Reinsve');
    });

    test('Best Supporting Actor nominees are correct', () => {
        const bsa = CATEGORIES.find(c => c.id === 'best-supporting-actor');
        const names = bsa.nominees.map(n => n.title);
        expect(names).toContain('Jacob Elordi');
        expect(names).toContain('Delroy Lindo');
    });

    test('Best Supporting Actress nominees are correct', () => {
        const bsa = CATEGORIES.find(c => c.id === 'best-supporting-actress');
        const names = bsa.nominees.map(n => n.title);
        expect(names).toContain('Elle Fanning');
        expect(names).toContain('Wunmi Mosaku');
    });

    test('Best Original Screenplay entries are correct', () => {
        const bos = CATEGORIES.find(c => c.id === 'best-original-screenplay');
        const titles = bos.nominees.map(n => n.title);
        expect(titles).toContain('Sinners');
        expect(titles).toContain('Marty Supreme');
    });

    test('Best Adapted Screenplay entries are correct', () => {
        const bas = CATEGORIES.find(c => c.id === 'best-adapted-screenplay');
        const titles = bas.nominees.map(n => n.title);
        expect(titles).toContain('One Battle After Another');
        expect(titles).toContain('Train Dreams');
    });

    test('Best Animated Feature contains expected films', () => {
        const baf = CATEGORIES.find(c => c.id === 'best-animated-feature');
        const titles = baf.nominees.map(n => n.title);
        expect(titles).toContain('Elio');
        expect(titles).toContain('Zootopia 2');
        expect(titles).toContain('KPop Demon Hunters');
        expect(titles).toContain('Arco');
    });

    test('Best International Feature contains expected films', () => {
        const bif = CATEGORIES.find(c => c.id === 'best-international-feature');
        const countries = bif.nominees.map(n => n.subtitle);
        expect(countries).toContain('Norway');
        expect(countries).toContain('France');
        expect(countries).toContain('Brazil');
        expect(countries).toContain('Iran');
    });
});

// Category ID Validation Tests
describe('Category ID Validation', () => {
    const expectedIds = [
        'best-picture',
        'best-director',
        'best-actor',
        'best-actress',
        'best-supporting-actor',
        'best-supporting-actress',
        'best-original-screenplay',
        'best-adapted-screenplay',
        'best-animated-feature',
        'best-international-feature',
        'best-documentary-feature',
        'best-cinematography',
        'best-film-editing',
        'best-production-design',
        'best-costume-design',
        'best-makeup-hairstyling',
        'best-original-score',
        'best-original-song',
        'best-sound',
        'best-visual-effects',
        'best-casting'
    ];

    test('All expected category IDs exist', () => {
        const actualIds = CATEGORIES.map(c => c.id);
        expectedIds.forEach(id => {
            expect(actualIds).toContain(id);
        });
    });

    test('Category IDs are kebab-case', () => {
        const kebabCaseRegex = /^[a-z]+(-[a-z]+)*$/;
        CATEGORIES.forEach(cat => {
            expect(kebabCaseRegex.test(cat.id)).toBe(true);
        });
    });
});

// Nominee ID Validation Tests
describe('Nominee ID Validation', () => {
    test('Nominee IDs are non-empty strings', () => {
        let allValid = true;
        CATEGORIES.forEach(cat => {
            cat.nominees.forEach(nominee => {
                if (typeof nominee.id !== 'string' || nominee.id.length === 0) {
                    allValid = false;
                }
            });
        });
        expect(allValid).toBe(true);
    });

    test('No duplicate IDs across all categories', () => {
        const allIds = CATEGORIES.flatMap(c => c.nominees.map(n => n.id));
        const duplicates = allIds.filter((id, i) => allIds.indexOf(id) !== i);
        expect(duplicates.length).toBe(0);
    });
});

// Storage Keys Tests
describe('Storage Keys', () => {
    test('STORAGE_KEY is defined correctly', () => {
        expect(STORAGE_KEY).toBe('oscar-tracker-watched');
    });

    test('CATEGORY_KEY is defined correctly', () => {
        expect(CATEGORY_KEY).toBe('oscar-tracker-category');
    });
});

// Print Summary
console.log(`\n${colors.bold}${'─'.repeat(50)}${colors.reset}`);
const total = passed + failed;
if (failed === 0) {
    console.log(`${colors.green}${colors.bold}All ${total} tests passed!${colors.reset}`);
} else {
    console.log(`${colors.red}${colors.bold}${failed} of ${total} tests failed${colors.reset}`);
    console.log(`${colors.green}${passed} passed${colors.reset}`);
}
console.log();

// Exit with error code if tests failed
process.exit(failed > 0 ? 1 : 0);
