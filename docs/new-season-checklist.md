# New Season Checklist

How to switch the app to a new year's Oscars. Nominations are usually announced in late January, with the ceremony in March.

Everything about a season lives in one file, `seasons/<year>.js`. The app, the page text and the counts all come from it.

## 1. Before you start

- [ ] Run the full suite on `main` (`npx playwright test`). Fix anything failing first, in its own PR.

## 2. Save the official nominations page

- [ ] Open `https://www.oscars.org/oscars/ceremonies/<year>` once nominations are announced.
- [ ] Save it as HTML in the repo root as **`The <Nth> Academy Awards _ <year>.html`**, for example `The 99th Academy Awards _ 2027.html`. A browser's "Save Page As" gives this name. The tests check every nominee's title and credits against this page.

## 3. Create the season file

- [ ] Copy the latest season file to `seasons/<year>.js`, and update its header comment.
- [ ] Update `season`, `ceremonyNumber` (year − 1928), `ceremonyDate` (local time with its UTC offset, e.g. `2027-03-14T19:00:00-04:00`; check daylight saving), `broadcaster` and `sourceUrl`.
- [ ] Replace `categories` with the new nominations:
  - Keep the categories in the order they should appear, and each category's nominees in the official page's order.
  - Every `id` is lowercase words joined by hyphens (`actor-chalamet`), unique within the season. Ids may repeat earlier seasons'. Saved data is kept per season.
  - `title` and `subtitle` should match the official page. Join several people with `, ` and `&` (`A, B & C`).
  - Categories whose subtitles name a studio rather than people (Best Picture, Animated Feature) get `creditType: 'studio'`.
  - A category can hold at most 10 nominees, because share links store one digit per category.
- [ ] Replace `films` with the feature films a viewer can watch, in the order ties should appear in the films list. Give each nominee from one of these films `film: '<film key>'`. Marking a film watched marks all of its nominees.
- [ ] Add `streaming` to films on a subscription service. The value must be a key of `STREAMING_SERVICES` in `app.js`; add a service there (and its icon) if needed.

## 4. Point the app at it

- [ ] In `index.html`, change `<script src="seasons/<old year>.js">` to the new file.
- [ ] In `sw.js`, change the same file in `ASSETS_TO_CACHE`.

## 5. Test

- [ ] `npx playwright test tests/season-files.spec.js` checks the new file's structure, its film links and every title and credit against the saved page. Fix the season file until it passes.
- [ ] Run the full suite. The other browser tests always run on the 2026 data (`tests/fixtures/test.js`), so they shouldn't need changes.

## 6. Ship it

- [ ] Open a PR. Its preview at `https://awardstracker.app/preview/pr-<number>/` runs the new season. Check:
  - the header ("99th Academy Awards · 2027"), the date line and the About box countdown
  - a few categories and the films list
  - that a share link includes `y=<year>`
- [ ] Merge. Installed apps pick up the new season the next time they open. Last season's watched films and picks stay saved under that season's keys, and old share links show a "from the <year> Oscars" message.

## 7. Once the nominations are final and released

- [ ] Freeze the season's ids, in a small PR of its own:

  ```bash
  node tests/freeze-season-ids.js <year>
  ```

  This writes `tests/fixtures/season-<year>-ids.json`. From then on, tests fail if any category or nominee id changes or moves.

- [ ] After that, never reorder, remove or rename categories or nominees. Share links store each pick as a position, and saved data stores ids. Fixing a title, credit or streaming service is fine.
- [ ] Never edit a frozen ids file, or an earlier season's file's ids. `seasons/2026.js` also stays as the data the browser tests run on.
