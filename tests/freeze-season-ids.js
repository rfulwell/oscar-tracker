/**
 * Record a season's category and nominee ids, in order, so tests fail if they
 * ever change. Share links store each pick as its position in its category and
 * saved data stores ids, so once a season has shipped they must stay fixed.
 *
 * Run once a season's nominations are final and released:
 *     node tests/freeze-season-ids.js 2027
 * Writes tests/fixtures/season-<year>-ids.json. Never edit or regenerate it after.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const year = process.argv[2];
if (!/^\d{4}$/.test(year || '')) {
    console.error('Usage: node tests/freeze-season-ids.js <year>');
    process.exit(1);
}

const root = path.join(__dirname, '..');
const season = vm.runInNewContext(fs.readFileSync(path.join(root, 'seasons', `${year}.js`), 'utf8') + '\n;AWARDS_SEASON');
const out = path.join(__dirname, 'fixtures', `season-${year}-ids.json`);
if (fs.existsSync(out)) {
    console.error(`${path.relative(root, out)} already exists. A season's ids are frozen once released.`);
    process.exit(1);
}

const frozen = season.categories.map((category) => ({
    id: category.id,
    nominees: category.nominees.map((nominee) => nominee.id)
}));
fs.writeFileSync(out, JSON.stringify(frozen, null, 4) + '\n');
console.log(`Wrote ${path.relative(root, out)} (${frozen.length} categories)`);
