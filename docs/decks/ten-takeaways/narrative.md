# Ten takeaways, ten looks

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Started 2026-11-17. Reworked from the "Ten Takeaways, Ten Looks" artifact (10 slides,
Nov 17): one takeaway per GOALS section, each set in its own visual world. The rework adds
a cold open and a close, and reorders the ten into an arc that follows the three paths:
the ground (the fleet), the spine (delivery), the agents.

Published as a private Claude artifact (the `main` draft, single-file export): https://claude.ai/artifact/GqpdZH7gt8yL68ZNu5ZtbG
Rebuild with `node docs/decks/_kit/deck.mjs export ten-takeaways` and republish `dist/`.

## Brief

- **Audience:** anyone in engineering who didn't go: an all-hands or guild lightning slot.
  Also the design reference for the series, since every slide trials a visual language.
- **Setting:** a live lightning talk, about 12 minutes, roughly one minute per takeaway.
  Also browsed afterwards as a set of looks.
- **They believe now:** KubeCon is a blur of tool names, and following up means evaluating
  tools.
- **They believe after:** the week comes down to ten rules we can adopt, and most of them
  don't need a new tool.
- **The one sentence:** everything we brought home fits on ten rules, and none of them is a
  product.
- **The ask:** start the three rules that cost a meeting rather than a purchase: mark the
  AWS seam, audit reclaim policies and drill one restore, and inventory what we use AI for.

## Shape

- **Structure:** ladder. Ten concrete rules, each one a rung, ordered so each makes the next
  easier to accept: first the ground the fleet stands on, then the path change takes, then
  what agents need. The close names the general principle (rules, not products) and the ask.
- **Acts:** I — *the ground* (fleet, seam, restore) / II — *the spine* (signal, rule) / III
  — *the agents* (pass, cage, base camp, reading room, receipt).
- **The peak:** `base-camp-first`, slide 9 of 12 (75%), the AI ladder as an expedition
  profile. The two slides after it are what base camp needs (a reading room and a receipt),
  so they land as consequences rather than more items on a list.
- **The close:** the cold open promised ten rules and no products. The close lists all ten
  in one column, marks the three that need no purchase, and asks for owners.

## Visual direction

Each takeaway keeps its own visual world: that is the point of this deck. The cold open and
close use the series brand, Three Peaks (`docs/decks/_shared/`), so the deck still belongs
to the set.

- **The frame:** the cold open is a range of ten small peaks, one per rule, capped in the
  colour of the path each rule belongs to (haze for the fleet three, mint for the spine
  two, teal for the agent five), in the order the talk takes them. The close returns to the
  same range with each peak labelled and the three no-purchase rules lit.
- **The ten worlds** (carried over from the original artifact, one per slide, all in
  `theme/theme.css` scoped by a class on `.slide`):

  | Slide | World | Type | Ground |
  |---|---|---|---|
  | `upgrade-like-an-app` (§5) | Swiss poster: four-column grid, numbers as image | Archivo 900 | off-white `#EFEDE8`, signal red `#D8291B` |
  | `mark-the-seam` (§10) | cyanotype blueprint in section, title block | Oswald, JetBrains Mono | Prussian blue `#1C3D6C`, amber seam |
  | `restore-or-rumor` (§8) | ISO 7010 safe-condition placard | Archivo 900 | safety green `#0E6A44` |
  | `signal` (§1) | split-flap departure board | Oswald | board black `#131418`, amber `#F5B800` |
  | `rule-not-driver` (§2) | annotated statute book | EB Garamond | paper `#F3EEE2`, rubric red |
  | `boarding-pass` (§9, §3.6) | airline boarding pass with a stub | Oswald, Archivo, mono | counter grey `#DAD5C9`, band blue |
  | `not-a-cage` (§3) | biocontainment notice, level ladder | Oswald 700 | safety yellow `#F2C12E`, hazard stripes |
  | `base-camp-first` (§6) | expedition elevation profile | Archivo, EB Garamond italic | map paper `#ECE6D6` |
  | `reading-room` (§7) | library catalogue card and stamp | EB Garamond, Courier | baize green `#1F3A2F` |
  | `itemize` (§4) | thermal till receipt | JetBrains Mono | counter brown `#2B2723` |

- **Rule for the worlds:** each label that looks like an eyebrow must be something the real
  artifact carries (a board's header, a statute's running head, a receipt's header). The
  old "TAKEAWAY 0N" numbers become GOALS section references, since the order changed.
- **Motion moment:** on `base-camp-first`, the profile draws to camp 2, then the dashed
  undated slope appears.
- **Anti-default check:** ten different worlds is itself the anti-template move. The risk is
  the opposite: that it reads as a sampler. The frame (one range, ten peaks, coloured by
  path, in order) is what holds it together as one talk.

- **Audit exceptions, accepted:** itemize and reading-room are exempted from the overlap audit (data-audit="off") because their receipt and card are rotated; several worlds run 90–130 words, as the original artifact did.

## Beats

### cold-open

- **Act:** I
- **Job:** set the promise: ten rules, no shopping list
- **Headline:** We came home with ten rules, and none of them is a product.
- **Visual:** the Three Peaks ridge, with ten small summit flags along it, unlabelled
- **Energy:** 3
- **Into next:** the first rule is about the thing that's going to get big whatever we do.

### upgrade-like-an-app

- **Act:** I
- **Job:** the fleet takeaway (GOALS §5)
- **Headline:** Upgrade the fleet like you ship an app.
- **Visual:** Swiss poster: off-white, one heavy grotesk, one signal red, four numbers that carry the slide: 7 business days (was 40), 30 minutes for about 5,600 nodes, 15 engineers, 1,000 clusters
- **Energy:** 4
- **Into next:** a fleet that big is built from code, so where does one tool's code stop?
- **Source:** LinkedIn deck p.2, NVIDIA deck, Meta and Salesforce abstracts

### mark-the-seam

- **Act:** I
- **Job:** the AWS takeaway (GOALS §10)
- **Headline:** Mark the seam before we pour.
- **Visual:** cyanotype blueprint. A building in section: LZA and CDK below, the seam as a dashed amber line, Crossplane and the apps above, and a title block holding status and references
- **Energy:** 3
- **Into next:** and under the foundation, the one thing we can't get back.
- **Source:** GOALS §10.1–§10.3; the seam is our proposal (decision 3)

### restore-or-rumor

- **Act:** I
- **Job:** the data-protection takeaway (GOALS §8)
- **Headline:** Backups are a rumor until you restore.
- **Visual:** an ISO 7010 safe-condition placard. Safety green, a database-with-restore pictogram, three numbered panels: retain, back up, drill
- **Energy:** 2
- **Into next:** that's the ground. Now the path change takes across it.
- **Source:** Velero project update (Red Hat); Data Protection WG (Broadcom)

### signal

- **Act:** II
- **Job:** the delivery takeaway (GOALS §1)
- **Headline:** Nothing leaves the station without a signal.
- **Visual:** split-flap departure board. Rows are operators, what they ran and the result; our row comes last, in amber: Kargo or GitOps Promoter, held for a two-week spike
- **Energy:** 4
- **Into next:** and the signal is decided by a rule that doesn't care who wrote the change.
- **Source:** LinkedIn, Meta, Transfix, Ford sessions; GOALS decision 1

### rule-not-driver

- **Act:** II
- **Job:** the policy takeaway (GOALS §2)
- **Headline:** The rule doesn't ask who's driving.
- **Visual:** a page from an annotated statute book. One operative clause ("No workload shall run privileged… whoever authored the change"), lettered sub-clauses, and an annotations column of cases heard
- **Energy:** 3
- **Into next:** which matters most for the drivers that aren't people.
- **Source:** AT&T + Nirmata, Google, JPMorganChase + Nirmata, W.W. Grainger, Nirmata + Nutanix

### boarding-pass

- **Act:** III
- **Job:** the identity and secrets takeaway (GOALS §9, §3.6)
- **Headline:** Boarding passes, not house keys.
- **Visual:** an airline boarding pass for a triage agent: SPIFFE ID, valid for 15 minutes, read-only seat, checked by Cedar or OpenFGA, no static secret on file. The stub lists the other passengers (Coinbase, Google and Microsoft, RBC, Veritas Automata, Infisical)
- **Energy:** 3
- **Into next:** an identity says who the agent is. It doesn't say where it can run.
- **Source:** the pass is illustrative; sessions on the stub

### not-a-cage

- **Act:** III
- **Job:** the sandboxing takeaway (GOALS §3)
- **Headline:** A container is not a cage.
- **Visual:** biocontainment notice. Safety yellow, hazard stripes, and a four-level containment ladder (container, gVisor, Kata microVM, agent substrate) with a verdict per level
- **Energy:** 4
- **Into next:** so how far up do we let agents go, and when?
- **Source:** Red Hat, Microsoft, Google, Solo.io, NTT, vCluster sessions

### base-camp-first

- **Act:** III
- **Job:** the peak: the AI rollout ladder (GOALS §6)
- **Headline:** Base camp first.
- **Visual:** an expedition elevation profile. Camps 0–2 on a surveyed, dated slope (today; Q2 2027; end 2027); camps 3–5 pale, dashed and undated
- **Energy:** 5
- **Into next:** camp 1 needs two things: something to read and a way to count.
- **Source:** GOALS §6; Verkada, Podium, Salesforce, Mastercard, IBM, Google

### reading-room

- **Act:** III
- **Job:** the data-access takeaway (GOALS §7)
- **Headline:** Reading room only.
- **Visual:** a library catalogue card on a green baize desk, with a red READ ONLY stamp. Holdings: cluster state in a database, Prometheus, narrow audited tools
- **Energy:** 2
- **Into next:** and every page they read goes on the receipt.
- **Source:** NVIDIA + Upbound; Mastercard

### itemize

- **Act:** III
- **Job:** the observability takeaway (GOALS §4)
- **Headline:** Itemize it, or it didn't happen.
- **Visual:** a thermal till receipt. What we saw itemised (Verkada, Nubank, Yahoo, Adobe), then our tab, three lines reading NOT YET, and TOTAL KNOWN $ —
- **Energy:** 3
- **Into next:** ten rules. Three of them we can start on Monday.
- **Source:** Verkada title (the $1,551 is our arithmetic), Nubank, Yahoo, Adobe

### three-on-monday

- **Act:** III
- **Job:** close: echo the promise and make the ask
- **Headline:** Ten rules; three of them cost a meeting, not a purchase.
- **Visual:** back on the ridge. The ten flags now carry their rules; three are lit (mark the seam, restore, itemize), each with an owner line
- **Energy:** 4
- **Into next:** end
