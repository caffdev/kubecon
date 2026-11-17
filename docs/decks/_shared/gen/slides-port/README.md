# slides-port: kit deck → Claude Slides

Ports slides from a kit deck (`docs/decks/<deck>/slides/*.html`) into a Claude Slides artifact
(`artifact.json` names it). A pilot, run on seven takeaways-v3 slides.

```sh
node extract.mjs takeaways-v3 title day-one …   # out/<slug>.json + PNG layers, from the live kit slides
node gen.mjs                                     # deck/project/: deck.json, deck.css, slides/*.html
node preview.mjs [--at <ms>] [slug …]            # out/preview/<slug>.png beside <slug>.orig.png
node sheet.mjs out/sheet.png out/preview/*.png   # contact sheet
node bind.mjs                                    # {{asset:…}} → the /_blob urls in artifact.json
```

Then publish `deck/project/*` to the artifact (index, css and cover first, then slides).

How a kit slide maps:

- **Drawings** (every top-level `<svg>`, drawn by the slide's scripts) become script-free inline
  SVG with computed colours baked in. Their kit entrance animations are read from the running
  page and re-expressed as CSS inside the SVG. Slides plays those on arrival.
- **SVG labels** become editable `<p>`s over the drawing (fonts don't load inside a Slides SVG),
  unless a drawing has more than 16. Then they become one transparent PNG at 2x.
- **Build steps** (`data-step`) become one PNG per step, shown as `class="fragment"`.
- **HTML text** is ported by hand in `gen.mjs`, but its words, inline markup and heading line
  breaks come from the live slide at extraction time. Re-running picks up edits made to the deck.
- **New motion** that the kit didn't have: census count-ups, staggered app squares, stacked bars,
  rings drawing outward, chart lines drawing on. The range only raises a peak that wasn't up on
  the previous slide.

Limits: Slides caps an inline SVG at 52 KB, 200 elements per slide and 24 pinned children per
container. Fonts in `deck.json` are Google Fonts links (Barlow, Barlow Condensed).
