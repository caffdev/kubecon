# slides-port: kit deck → Claude Slides

Ports a kit deck (`docs/decks/<deck>/slides/*.html`) into a Claude Slides artifact (`artifact.json`
names both). All 29 takeaways-v3 slides, in the kit deck's current draft order.

```sh
python3 -c "import json;d=json.load(open('../../../takeaways-v3/deck.json'));print('\n'.join(d['drafts'][d['draft']]))" \
  | xargs node extract.mjs takeaways-v3            # out/<slug>.json + PNG layers, from the live kit slides
node gen.mjs                                     # deck/project/: deck.json, deck.css, slides/*.html
node preview.mjs [--at <ms>] [slug …]            # out/preview/<slug>.png beside <slug>.orig.png
node sheet.mjs out/sheet.png out/preview/*.png   # contact sheet
node bind.mjs                                    # {{asset:…}} → the /_blob urls in artifact.json
```

Upload any new PNG layer (`deck/assets.json` lists the ones in use), add its url to `artifact.json`,
run `bind.mjs`, then publish `deck/project/*` to the artifact. Check `list_files` first: if a slide's
sha256 differs from what was last published, someone edited it in Slides; don't overwrite it blind.

How a kit slide maps:

- **Drawings** (every top-level `<svg>`, drawn by the slide's scripts) become script-free inline
  SVG with computed colours baked in. Their kit entrance animations are read from the running
  page and re-expressed as CSS inside the SVG. Slides plays those on arrival.
- **SVG labels** become editable `<p>`s over the drawing at their rendered size (fonts don't load
  inside a Slides SVG). They become one transparent PNG at 2x when a slide would pass 24 pinned
  elements, or when the 24px floor would enlarge them by more than a quarter.
- **Build steps** (`data-step`) become one PNG per step, shown as `class="fragment"`.
- **HTML text** is converted from computed styles: each top-level block is pinned where the kit put
  it; inside, flex and grid stay flex and grid (column-flow grids get explicit cell positions),
  tables become grids, code cards become `<br>` lines, heading breaks are kept (the kit balances
  them). A line in two sizes becomes a row of blocks on one baseline, since Slides keeps only
  colour, bold and italic inside a line. Styles fold into shared classes in `deck.css`.
  `extract.mjs` warns about anything it had to drop (inline code keeps its words, not its face).
- **New motion** that the kit didn't have: big numbers count up; drawings the kit never animated
  build left to right; the estate run moves by magic move with new apps popping in; overrun,
  gates and ai-resize have their own builds (`HOOKS` in `gen.mjs`). The range only raises a
  peak that wasn't up on the previous slide.

Limits: Slides caps an inline SVG at 52 KB, 200 elements per slide and 24 pinned children per
container. Fonts in `deck.json` are Google Fonts links (Barlow, Barlow Condensed, JetBrains Mono).
