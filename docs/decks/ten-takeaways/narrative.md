# Ten takeaways, ten slides

> The full-length version (12 slides, one rule per slide) is draft `main`; its story is in
> `narrative-main.md`. This file is the story of draft `ten`, the default: the same ten
> rules in ten slides, title and close included.

Reworked 2026-11-20 from the 12-slide `main` draft after feedback that the readout decks run
long. Nothing new was added to the argument; it was boiled down. Two pairs of rules that
answer the same question now share a slide, every slide lost its explanatory paragraph to
the notes, and each world was redrawn around one focal point.

Rebuild with `node docs/decks/_kit/deck.mjs export ten-takeaways` (the default draft is
`ten`; `--draft main` exports the long one).

## Brief

- **Audience:** anyone in engineering who didn't go: an all-hands or guild lightning slot.
- **Setting:** a live talk of about 13 minutes. Browsed afterwards as a set of looks, so the
  notes carry the detail the slides dropped.
- **They believe now:** KubeCon is a blur of tool names, and following up means evaluating
  tools.
- **They believe after:** the week comes down to ten rules we can adopt, most of them need
  no new tool, and three can start on Monday.
- **The one sentence:** everything we brought home fits on ten rules, none of them is a
  product, and three of them cost a meeting, not a purchase.
- **The ask:** one owner each for the three meeting-not-purchase rules: mark the CDK-to-
  Crossplane seam, audit reclaim policies and time one restore, and turn telemetry on and
  list what we use AI for.

## Shape

- **Structure:** ladder, as in `main`. Ten concrete rules, each making the next easier to
  accept: the ground the fleet stands on, the path change takes across it, what agents need
  before they're let in. The close names the principle (rules, not products) and the ask.
- **Why ten rules on eight slides, and not eight rules:** the two merges are pairs that
  answer one question each, not two topics on one page.
  - *Signal + rule* (GOALS §1 + §2): the gate that lets a change leave is the policy, and
    the policy checks the change, not the author. One sentence carries both: nothing leaves
    without a signal, whoever's driving.
  - *Cage + pass* (GOALS §3 + §9, §3.6): both are the boundary around an agent, where it
    runs and who it is. GOALS already files identity (§3.6) under sandboxing (§3). One
    artifact carries both: a containment-lab door sign, with the level on top and the entry
    pass below.
  Keeping the count at ten keeps the frame: the cold open's ridge of ten peaks and the
  close that names them.
- **Acts:** I — *the ground* (upgrade, seam, restore) / II — *the spine* (signal, whoever's
  driving) / III — *the agents* (cage and pass, base camp, reading room, receipt).
- **The peak:** `base-camp-first-ten`, slide 7 of 10 (70%). The two slides before it step
  down a notch (the cage-and-pass slide is energy 3) so it lands; the two after it are what
  base camp needs, so they read as consequences.
- **The close:** the cold open promised ten rules and no products. The close returns to the
  same range at dawn, names every peak, lights the three that cost a meeting, and asks for
  owners.

Pacing: 3 · 4 · 3 · 2 · 4 · 3 · 5 · 2 · 3 · 4.

## Visual direction

Builds on `main` (see `narrative-main.md`): each rule keeps its own visual world, and the
frame slides wear the series brand, Three Peaks (`docs/decks/_shared/`). What changed for
`ten`: every world is redrawn so the artifact *is* the slide, and its single focal point is
the rule's evidence, not a paragraph about it.

- **The frame:** the cold open is the range at night: ten peaks capped by path (haze for
  the ground three, mint for the spine two, teal for the agent five), grouped by three thin
  brackets. The close is the same range at dawn: a low alpenglow haze on the horizon, every
  peak named and numbered, and the three meeting-not-purchase peaks catching the alpenglow.
- **The eight worlds in `ten`:**

  | Slide | World | Focal point |
  |---|---|---|
  | `upgrade-like-an-app-ten` | Swiss poster | forty business-day bars, seven of them red |
  | `mark-the-seam-ten` | cyanotype section drawing | the amber seam, run edge to edge as a datum line |
  | `restore-or-rumor-ten` | ISO 7010 safe-condition placard | the DRILL panel, inverted, with a stopwatch |
  | `signal-any-driver` | split-flap departure board | our amber row, under a standing notice to all drivers |
  | `cage-and-pass` | containment-lab door sign | level 3 printed in reverse; the entry pass clipped under the headline |
  | `base-camp-first-ten` | expedition elevation profile | two date flags on the surveyed slope |
  | `reading-room-ten` | library catalogue card | the READ ONLY stamp |
  | `itemize-ten` | thermal till receipt, printing from the top edge | OUR TAB: NOT YET, TOTAL KNOWN $ — |

  The statute book and the boarding pass from `main` are folded in: the statute's clause
  became the board's standing notice, and the pass became the badge on the door sign.
- **Rule for the worlds** (unchanged): a label that looks like an eyebrow must be something
  the real artifact carries: a board's header, a drawing's title block, a receipt's header.
- **Type floor:** body 28px or more; nothing under 22px; captions and sources at 24px only.
  Every world was cut to roughly 70 words or fewer on screen.
- **Motion moment:** on `base-camp-first-ten`, the surveyed route draws to camp 2 and the
  date flags plant; the click brings in the dashed, undated slope above.
- **Theme:** `theme/theme.css` is shared with `main`, so the `ten` compositions live in each
  slide's own `<style>` and nothing in the theme was changed.
- **Considered and dropped:** a rope from each Monday ask down to its peak on the close (it
  would cross the other labels; matching numbers do the linking instead); a rule-number
  marker on every slide (template chrome the real artifacts don't carry); the sky-to-mint
  disc on the close (its gradient sits under the peak labels and kills their contrast; a
  low alpenglow haze on the horizon does the "dawn" instead).
- **Gotcha:** `_shared/brand.css` defines `.camp` (the round stage marker, used on the
  close). Don't reuse that class name for anything else; the profile's camp labels are
  `.cmp`.
- **Audit exceptions, accepted:** `dense` on `signal-any-driver` (~77 words: a board of
  short tokens), `base-camp-first-ten` (~73), `itemize-ten` (~81: a receipt) and
  `three-on-monday-ten` (~95: it names all ten rules, which is its job). The catalogue
  card on `reading-room-ten` keeps `data-audit="off"` because it is rotated, as in `main`.

## Beats

### cold-open-ten

- **Act:** I
- **Job:** set the promise: ten rules, no shopping list, in three groups
- **Headline:** We came home with ten rules, and none of them is a product.
- **Visual:** the Three Peaks range at night: ten peaks capped by path, three thin brackets above them naming the groups (the ground, the spine, the agents)
- **Energy:** 3
- **Into next:** the first rule is about the thing that gets big whatever we do.

### upgrade-like-an-app-ten

- **Act:** I
- **Job:** the fleet rule (GOALS §5): upgrades are a rollout with a check, not a project
- **Headline:** Upgrade the fleet like you ship an app.
- **Visual:** Swiss poster. A strip of forty business-day bars, the first seven in signal red: LinkedIn's v1.31 → v1.34, one minor at a time (40) against one skip-level rollout (7). Three smaller figures below: NVIDIA 30 minutes for ~5,600 nodes, Meta ~15 engineers for ~100 clusters, Salesforce 1,000 clusters
- **Energy:** 4
- **Into next:** a fleet that big is built from code, so where does one tool's code stop?
- **Source:** LinkedIn deck p.2 (`deck-assets/13-skip-level-upgrades/p02`), NVIDIA deck, Meta and Salesforce abstracts

### mark-the-seam-ten

- **Act:** I
- **Job:** the AWS rule (GOALS §10): draw the CDK-to-Crossplane handoff before building on it
- **Headline:** Mark the seam before we pour.
- **Visual:** cyanotype section. LZA and CDK below, Crossplane and the apps above, the seam as an amber datum line run across the whole sheet. Dimension arrows on the left read "changes rarely" and "changes constantly". A title block, bottom right, carries status (DECIDE, decision 3) and what the decision needs: a diagram with the seam marked
- **Energy:** 3
- **Into next:** and under the foundation, the one thing we can't get back.
- **Source:** GOALS §10.1–§10.3; decisions table row 3; the seam is our proposal

### restore-or-rumor-ten

- **Act:** I
- **Job:** the data-protection rule (GOALS §8): the restore drill is the point
- **Headline:** Backups are a rumor until you restore.
- **Visual:** ISO 7010 safe-condition placard. Database-and-restore pictogram, then three panels in sequence (retain, back up, drill), the DRILL panel inverted with a stopwatch. One evidence line: Nutanix's latest Velero snapshot, when they needed it, was 12 hours old, partial and untested
- **Energy:** 2
- **Into next:** that's the ground. Now the path every change takes across it.
- **Source:** GOALS §8; Nutanix, "GitOps Meltdown" (`deck-assets/01-gitops-meltdown/p19`); Velero project update (Red Hat); Data Protection WG (Broadcom)

### signal-any-driver

- **Act:** II
- **Job:** the delivery and policy rules together (GOALS §1, §2): one gate, and it checks the change, not the author. Merged from `signal` and `rule-not-driver`
- **Headline:** Nothing leaves the station without a signal, whoever's driving.
- **Visual:** a full-bleed split-flap departure board. Rows: LinkedIn (canary namespaces, PostSync gate: 1 week → 1 hour), Transfix (agents earn the right to merge: shadow → grant), Ford (CI as the net under AI-written GitOps), and our row in amber (Kargo or GitOps Promoter: held for a 2-week spike). Along the foot, the statute's clause as the station's standing notice to all drivers, human or agent
- **Energy:** 4
- **Into next:** the drivers that aren't people need more than a rule. They need a boundary.
- **Source:** LinkedIn, Transfix, Ford sessions; GOALS §2.1–§2.2; decision 1. Cut from `main`: the Meta row (Meta is on slide 2) and the five annotated cases (AT&T, Google, JPMorganChase, Grainger, Nirmata + Nutanix), now in the notes

### cage-and-pass

- **Act:** III
- **Job:** the sandboxing and identity rules together (GOALS §3, §9, §3.6): an agent's boundary is where it runs and who it is. Merged from `not-a-cage` and `boarding-pass`
- **Headline:** Every agent gets its own kernel and a pass that expires.
- **Visual:** a containment-lab door sign in safety yellow. On the right, the level ladder (container: not a cage; gVisor: trial; Kata microVM, its own kernel: trial, printed in reverse; agent substrate: decide). On the left, under the headline and clipped to the sign as the entry requirement, an illustrative pass: SPIFFE ID, valid 15 minutes, no static secret on file (Cedar or OpenFGA as the checker, in the notes)
- **Energy:** 3
- **Into next:** so how far up the mountain do we let agents go, and when?
- **Source:** Red Hat, Microsoft, Google, Solo.io, NTT, vCluster sessions; Coinbase, Google + Microsoft, RBC, Veritas Automata, Infisical (notes). The pass is illustrative

### base-camp-first-ten

- **Act:** III
- **Job:** the peak: the AI rollout ladder (GOALS §6), two dated camps and an undated route above
- **Headline:** Base camp first.
- **Visual:** an expedition elevation profile across the full sheet, faint contours behind. Camps 0–2 on a dark, surveyed slope; flags planted at camp 1 (Q2 2027, Verkada $0.33 an alert) and camp 2 (end 2027, Podium 30% of merged PRs). Camps 3–5 pale, dashed and undated
- **Energy:** 5
- **Into next:** camp 1 needs two things: something to read and a way to count.
- **Source:** GOALS §6 and decision 6; Verkada, Podium; Salesforce, Mastercard, IBM, Google in the notes

### reading-room-ten

- **Act:** III
- **Job:** the data-access rule (GOALS §7): agents read a copy of production, never hold its credentials
- **Headline:** Reading room only.
- **Visual:** a library catalogue card on green baize, larger than in `main`, with a red READ ONLY stamp. Holdings: cluster state in a database, Prometheus, narrow audited tool calls. See also: NVIDIA + Upbound, Mastercard
- **Energy:** 2
- **Into next:** and every page they read goes on the receipt.
- **Source:** NVIDIA + Upbound; Mastercard

### itemize-ten

- **Act:** III
- **Job:** the observability rule (GOALS §4): we can't manage AI spend we haven't itemised
- **Headline:** Itemize it, or it didn't happen.
- **Visual:** a thermal till receipt printing down from the top edge. What we saw itemised (Verkada, Nubank, Yahoo), then our tab: three lines reading NOT YET, and TOTAL KNOWN $ —
- **Energy:** 3
- **Into next:** ten rules. Three of them we can start on Monday.
- **Source:** Verkada title (the $1,551 is our arithmetic), Nubank, Yahoo. Adobe's eBPF line moved to the notes

### three-on-monday-ten

- **Act:** III
- **Job:** close: echo the promise, name all ten, make the ask
- **Headline:** Ten rules; three of them cost a meeting, not a purchase.
- **Visual:** the cold open's range at dawn: a low alpenglow haze behind it, every peak numbered and named, three capped in alpenglow (2 mark the seam, 3 restore, 10 itemize). Above, the three asks, numbered to match, each with an owner line
- **Energy:** 4
- **Into next:** end
