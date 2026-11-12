# KubeCon + CloudNativeCon North America 2026 — Overview

Salt Lake City · Nov 9–12, 2026 (co-located events Nov 9, main conference Nov 10–12).

A pull of the full official schedule, every publicly posted slide deck, and a
write-up of the themes, tools and concepts for sharing internally.

## Start here

| File | What it is |
|---|---|
| [`analysis/THEMES.md`](analysis/THEMES.md) | **The write-up.** Seven core themes with evidence, plus "what this means for us" and a reading list |
| [`analysis/TOOLS.md`](analysis/TOOLS.md) | Catalog of every tool/project/concept worth knowing, grouped by job, with mention counts |
| [`analysis/SESSIONS-BY-TRACK.md`](analysis/SESSIONS-BY-TRACK.md) | Browsable index of all 501 sessions with speakers, by track; 📎 marks ones with slides |
| [`analysis/term-frequency.txt`](analysis/term-frequency.txt) | Raw term-frequency counts behind the claims |
| [`slides/`](slides/) | Every slide deck posted to the schedule, plus `slides/MANIFEST.csv` |
| [`data/`](data/) | `schedule.json` (raw Sessionize API), `sessions.json` / `sessions.csv` (flattened) |

## Data

Everything comes from the official schedule app
(`https://kubecon-cloudnativecon-north-america-2026.sessionize.com`), pulled from its
`/api/schedule` endpoint on 2026-11-12.

- **603** scheduled items · **501** with speakers · **711** speakers · **37** rooms
- **289** main-conference + maintainer-track talks
- **11** CNCF-hosted co-located events on Day 0 (ArgoCon, Platform Engineering Day,
  Agentics Day: MCP + Agents, Cloud Native AI + Inference Day, Observability Day,
  Open Source SecurityCon, BackstageCon, CiliumCon, FluxCon, OpenTofu Day,
  Kubernetes on Edge Day)

## Slides

**144 decks, 567 MB, all 144 that the schedule exposes — every one downloaded, none failed.**
Formats: 130× .pdf, 9× .pptx, 5× .jpg.

By day: 2026-11-09 (3), 2026-11-10 (53), 2026-11-11 (58), 2026-11-12 (30).

Best-covered tracks: AI Inference + Agentic (26), Maintainer Track (18), Platform Engineering (16), Observability (13), Operations + Performance (11), Security (10), 🚨 Contribfest (6), ⚡ Lightning Talks (6).

Filenames are `YYYY-MM-DD_session-title-slug.ext`. `slides/MANIFEST.csv` maps each file
back to its session, speakers, companies, room, track and original URL.

Only speakers who uploaded a deck to Sessionize are covered — that is the complete set
of slides the schedule exposes. Recordings are published separately on the CNCF YouTube
channel a few weeks after the event and are not covered here.

## Regenerating

```shell
# 1. refresh the raw schedule
curl -s https://kubecon-cloudnativecon-north-america-2026.sessionize.com/api/schedule \
  -o data/schedule.json

# 2. flatten to sessions.json / sessions.csv
python3 scripts/build_index.py

# 3. download any slides not already present (idempotent; skips existing files)
python3 scripts/download_slides.py

# 4. term-frequency analysis (add terms at the top of the script)
python3 scripts/analyze.py                      # all counts
python3 scripts/analyze.py 'Gateway API'        # list the sessions behind one term
```

## Caveats

- Counts in the write-up are regex matches over session titles + abstracts. They show
  relative signal strength, not exact measurement; a few terms are deliberately broad
  (e.g. "Operators / CRDs") and a few are noisy (e.g. "maintainers" matches boilerplate
  in maintainer-track abstracts).
- Session abstracts describe what speakers *intended* to present. Where the write-up
  states an outcome or number, it comes from the title or abstract itself.
- Slide decks are third-party files downloaded from Sessionize. Treat them as untrusted
  input; they live in `slides/` and nothing in this repo executes them.
