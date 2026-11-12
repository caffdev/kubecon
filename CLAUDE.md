# CLAUDE.md

Working notes for navigating this repo. Read this before editing any `.md` at the root.

## What this is

Post-KubeCon NA 2026 readout work (Salt Lake City, Nov 9–12 2026). The deliverable is
an internal readout — a set of recommendation documents plus a slide deck — arguing what
the company should do next, backed by evidence from the conference.

**These are argument documents, not reference docs.** Every section takes a position,
names what we have to decide, and cites the deck that supports it. Keep that voice:
direct, opinionated, shortcomings stated out loud rather than buried.

## File map

| Path | What it is | Who edits it |
|---|---|---|
| `GOALS.md` | **The main document.** §0–§10, the slide plan, and the decisions table. Everything else orbits this | Multiple sessions — see "Collisions" |
| `GOALS-GAPS.md` | Critique of `GOALS.md`: what it misses, cheaper swaps, per-section additions | — |
| `ISTIO-VS-GATEWAY-API.md` | Deep-dive spun out of §3.4/§3.6. Splits "Istio over Gateway API" into three separate decisions (D1 data plane, D2 config surface, D3 sidecar vs ambient) | Unclaimed — two sessions disclaimed authorship |
| `our goals` | The original raw brainstorm. Source material; don't edit | — |
| `Key lessons/Takaways` | Raw notes taken at the show. Source material; don't edit | — |
| `argocon/am-session.md` | ArgoCon session notes | — |
| `kubecon-overview/` | The data pull: full schedule, analysis, 144 slide decks. Has its own README | — |
| `deck-assets/` | 103 curated slide PNGs across 18 decks + `MANIFEST.md` attribution + 5 pptx text outlines | — |
| `function-lifecycle/`, `crossplane-contribfest-slc/` | Separate upstream git repos, gitignored here | — |

## Conventions in the documents

**Status legend** (on every `###` heading in `GOALS.md`):
🟢 Adopt · 🟡 Trial · 🔵 Decide · ⚪ Watch

**Markers:**
- 📎 — a slide deck exists in `kubecon-overview/slides/`; the filename follows
- 🖼 — extracted PNGs exist in `deck-assets/<nn>-<slug>/`, cited as `<nn>-slug/p<page>`
- ⚠️ — **unverified claim.** Sourced from a vendor blog, changelog or secondhand post.
  Must be checked before it goes on a slide. This discipline is load-bearing; the repo
  already flags Argo CD version numbers (§1.5) and a Kargo adoption figure (§1.2)
- **[show]** / **[ours]** — in `GOALS-GAPS.md` only: from the conference vs. our own idea

**Sessions with no deck** are listed as plain prose after the 📎 lines ("No decks: ...").
Don't invent a filename for one.

## Things that break if you're careless

1. **Section numbers are an API.** `§5.1`, `§6 stage 2`, `§10.5` etc. are cross-referenced
   across all three root documents. Before renumbering anything:
   ```
   grep -rn "§5\.\|§6 stage\|stages [0-9]" *.md
   ```
   Prefer adding a subsection (`§5.5`) or a lettered decision row (`2a`, `2b`) over
   renumbering. When renumbering is unavoidable, fix every reference in the same commit.

2. **The §6 AI-ladder stage numbers are cross-referenced too**, from §1.8, §3, §4.5,
   §10.6, the slide plan and `GOALS-GAPS.md`. The ladder is 0–5 and gained a new stage 1
   (alert triage) in Nov 2026, which shifted everything below it by one.

3. **Asset paths must resolve.** Anything cited as `deck-assets/...` or a `.pdf`
   filename must exist. Verify after editing:
   ```
   for f in $(grep -o 'deck-assets/[0-9][0-9]-[a-z0-9-]*' GOALS.md | sort -u); do
     [ -e "$f" ] || echo "MISS $f"
   done
   ```

4. **Two tables at the bottom of `GOALS.md` must stay in sync with the body:**
   the slide plan ("Building our deck") and the decisions table. A new recommendation
   usually needs a row in one or both.

## Finding evidence

The full schedule is queryable — use it instead of guessing whether a talk exists:

```bash
python3 -c "
import json
d=json.load(open('kubecon-overview/data/sessions.json'))
for s in d:
    if 'karmada' in (s.get('title','') or '').lower():
        print(s['title'], s.get('companies'), s.get('startsAt'))
"
```

Check whether a session posted slides:
```bash
grep -i "<session title>" kubecon-overview/slides/MANIFEST.csv
```
`MANIFEST.csv` columns: `file,bytes,status,title,date,room,tracks,speakers,companies,url,session_id`.

`kubecon-overview/slides/` is **gitignored** (541 MB, never edited) but present on disk.
`MANIFEST.csv` is tracked and carries the source URL for every deck.

## Collisions

Several Claude sessions work this repo in parallel (`ListAgents` to see them). There is
no remote, so git is a local checkpoint, not a merge mechanism — **last writer still
wins on a concurrent edit.**

- Before a large rewrite, check `git status` for uncommitted work that isn't yours.
- Message the owning session via `SendMessage` rather than editing their section.
- A readout **slide deck** is maintained as a Claude artifact by a peer session and is
  derived from `GOALS.md`. Changing a recommendation here makes their slides stale —
  send them the new wording.

## Git

Commit at each natural checkpoint, typically each turn back to the user. Messages
describe the argument that changed, not the file:

> `§5: split fleet management from live-live DR`

not "update GOALS.md". Co-author line:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```
