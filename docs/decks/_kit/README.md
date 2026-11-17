# docs/decks

Slide decks live here as code: one folder per deck, one HTML file per slide, with the story written first in `narrative.md`.

```
<deck>/
  narrative.md      the story: audience, the one sentence, a beat for every slide
  deck.json         title and drafts (named slide orders)
  theme/theme.css   this deck's look
  slides/*.html     one slide per file; each opens on its own in a browser
  index.html        overview, player and presenter (generated)
  dist/             exported PDF and single-file HTML
```

## Use a deck

Open `docs/decks/<deck>/index.html` in a browser, or run the live server:

```sh
node docs/decks/_kit/deck.mjs serve --open
```

- **Overview:** drag slides to reorder them (saved to `deck.json` while the server runs), drag them onto the bench to set them aside, and switch drafts.
- **Present:** click a slide, or press Enter. → / Space next, ← back, F full screen, P presenter view (notes, next slide, timer), O overview, ? keys.

## Commands

```sh
node docs/decks/_kit/deck.mjs help
node docs/decks/_kit/deck.mjs status <deck>          # order, pacing, headlines, problems
node docs/decks/_kit/deck.mjs move <deck> <slug> --before <slug>
node docs/decks/_kit/deck.mjs draft <deck> new short --from main
node docs/decks/_kit/deck.mjs export <deck>          # dist/<deck>.pdf and dist/<deck>.html
```

Requires Node 22+. Screenshots and exports use your local Chrome (set `CHROME_PATH` if it isn't found). There's nothing to install.

## Edit a slide

Each slide is plain HTML on a fixed 1920×1080 stage. Shared look lives in `theme/theme.css`; anything specific to one slide goes in its own `<style>`. Speaker notes go in `<aside class="notes">`. Elements with `data-step` appear one click at a time.

Reviewing a deck works like reviewing code: comment on the line in `narrative.md` or `slides/*.html` you want changed.
