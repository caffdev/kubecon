# One range, three climbs: KubeCon NA 2026 readout

> The full-length version (15 slides) is draft `main`; its story is in `narrative-main.md`.
> This file is the story of draft `ten`, the default: the same argument in ten slides.

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Started 2026-11-17 as the umbrella talk for the three paths. Cut to ten slides on 2026-11-20
because the readout decks were running long. The three path decks (`path1-deployments`,
`path2-agents`, `path3-fleet`) carry the detail; this one carries the argument and the ask.

Published as a private Claude artifact (the `main` draft, single-file export): https://claude.ai/artifact/3gNPsU22eQdj1o59V7AaSt
Rebuild with `node docs/decks/_kit/deck.mjs export readout` (now exports `ten`) and republish `dist/`.

## Brief

- **Audience:** engineering leadership, plus the platform, SRE and security leads who will
  staff the work. They know our estate (on-prem Kubernetes plus EKS live-live, Argo CD on
  manual sync, Claude Code on laptops). They didn't go. They are wary of conference hype
  and of anything that sounds like "build an AI platform", and they want to know what they
  are deciding and what it costs.
- **Setting:** both. A 12–15 minute slot live, then sent round as the record. Designed for
  the room; the notes carry the full argument for readers.
- **They believe now:** KubeCon was mostly AI noise. Our platform is fine as it is. Agents
  are a separate initiative that someone else will run.
- **They believe after:** fleet toil and agents are one problem with one fix: a path to
  production that decides for itself. It splits into three climbs we can staff in
  parallel, with one ordering we have to protect.
- **The one sentence:** whether a person or an agent wrote the change, it should reach a
  cluster by one path that decides for itself; we build it as three climbs starting this
  quarter, and we protect policy in CI because every agent PR is belayed to it.
- **The ask:** name an owner for each path today; protect Path 1 stage B (policy in CI and
  at admission) as the work that gates the others; commit to AI stage 1 (alert triage) by
  Q2 2027 and stage 2 (agents open PRs) by the end of 2027.

## Shape

- **Structure:** answer first. A decision meeting with executives in it: the recommendation
  on slide 2, straight after a cold open, then the support.
- **Acts:** I — *the answer, and why* (cold open, the answer, one piece of evidence per force,
  the line they converge on) / II — *the climbs* (the rope that ties them, then one slide per
  path) / III — *the ask*, on one timeline.
- **The peak:** `the-belay`, slide 6 of 10. The three climbs from base camp look independent
  until the rope draws: no agent opens a PR until policy runs in CI. That one ordering is why
  stage B gets protected headcount, so it is the turn of the talk.
- **The close:** the ask, drawn as the plan itself: three lanes with an empty owner line each,
  stage B ringed, the two dates flagged, everything later dashed. The notes open by echoing
  the cold open (a hundred clusters and fifteen engineers is what a finished path looks like).
- **What the cut took out** (all still in `main`): `two-forces` and `the-line` became one slide;
  `base-camp`, `three-climbs` and `the-rope` became one; `dates` and `the-ask` became one;
  `echo` went to the notes. The ask's footnote on Gateway API and secrets went entirely: the
  Ingress NGINX move is already planned and isn't ours to pitch here.

## Visual direction

Series brand, decided with the user: **Three Peaks**, the Wasatch ridgeline from the show's
own artwork. It lives in `docs/decks/_shared/` (`brand.css` for tokens and pieces, `peaks.js`
to draw the mountains). This deck is the one that shows the whole range. The ten-slide cut
keeps the identity and raises it in three places.

- **Subject world:** the Wasatch above Salt Lake City as the show drew it: flat silhouette
  peaks, one ridge-shadow stripe per face, a sky-to-mint disc. Around it, expedition
  material: route topos with numbered pitches, base camp, ropes, summit registers.
- **Palette:** night `#070b0e` (ground) · snow `#e8f4f2` (ink) · lichen `#9fb4b6` (quiet text,
  9:1) · mint `#9cf0e1` = Path 1 · teal `#36baa2` = Path 2 · haze `#68b6c3` = Path 3 ·
  alpenglow `#f4a261`, the one warm accent · snowfield `#e9f1f0` light ground for evidence,
  with slate `#0f1e29` ink · sky `#1f6fb2` for the disc only (3.7:1, never text).
- **Type:** Barlow Condensed 600 for headlines (the narrow cut of trail signage); Barlow
  400/500 for body; JetBrains Mono only for literal code.
- **Layout:** margins 120 / 96, left-aligned. Hero slides put the range on the bottom edge
  with the headline in the sky above it. Path slides: headline top-left, the idea as a
  picture on the left, the path's own summit on the right with its camps. Evidence slides
  go on snowfield, so the deck alternates night and day.

  ```
  opening (the-answer)              densest (the-ask-dated)           peak (the-belay)
  ┌───────────────────────────┐    ┌───────────────────────────┐    ┌───────────────────────────┐
  │ One path to production…   │    │ Name three owners today,… │    │ No agent opens a PR       │
  │                    (disc) │    │ P1 ____  [A][(B)][C,D]- - │    │ until policy runs  (disc) │
  │  P3      P1         P2    │    │ P2 ____  [0][ 1 ]⚑[2]⚑- - │    │  4    E    The belay      │
  │  /\      /\         /\    │    │ P3 ____  [  1  ]- - - - - │    │  3   D C ~~~~~~~> 2       │
  │ /  \    /  \       /  \   │    │          now  2027  2028  │    │ 1~~~~~B A        0 1      │
  │/____\__/____\_____/____\_ │    │                           │    │ P3 today  P1 today  P2 …  │
  └───────────────────────────┘    └───────────────────────────┘    └═══════════════════════════┘
  ```
- **Signature element:** the three-peak range, with mint, teal and haze snow caps. The disc
  rises behind it twice only: on the answer, and on the belay, the turn.
- **Alpenglow traces the ask.** From `one-line` on, the warm accent marks only what we will
  ask for, so the room sees each ask before it is asked: the col where both forces meet
  (`one-line`), the rope and its camps (`the-belay`), stage B (`path-1-ten`), the two dated
  phases (`path-2-ten`), stage 1 starting now (`path-3-ten`). On `the-ask-dated` the warm
  marks land on one timeline: stage B ringed and the two date flags. (The kept evidence
  slides use it for their own signal: the 17 lit dots, the ⚠️ on Hertz.)
- **Concepts as pictures:** altitude is progress; camps are stages (numbered circles in the
  path colour; warm = what we protect or date); ropes are dependencies (dashed); fields of
  small peak glyphs are counts (one glyph = one cluster); the base-camp band at the foot is
  today; the timeline is to scale (one month = the same width everywhere).
- **Motion moment:** on `the-belay`, the rope draws from Path 1 B–C across to Path 2 phase 2
  and every camp it doesn't touch steps back; then the thinner label rope draws from Path 3
  stage 1 to Path 1 D. The dimming is presentation-only, so the PDF keeps the whole map.
- **Anti-default check, and what changed:**
  - *Near-black with a bright accent* is the show's own artwork, so it stays, but: three
    accents with fixed meanings instead of one decorative accent; the warm accent reserved
    for the ask; the evidence slides on a snowfield ground.
  - *Title and bullets* on the old ask (three text columns) replaced by the plan drawn to
    scale with the asks marked on it.
  - *Template chrome:* no eyebrow labels, act labels, page numbers, logos or mono labels.
    Sources appear only where a claim needs one.
  - *Big number, small label:* fleet sizes drawn as peaks scaled to size, not stat cards.
- **Audit exceptions, accepted:** `fleets` (kept as is from `main`) runs 72 words: seven
  labelled fleets plus the Hertz caveat, which has to stay on the slide. Every other slide is
  at or under 70.
- **What the cut changed visually:** the old ask's three text columns became the timeline
  with the asks drawn on it, each lane ending at its own small summit (undated); the rope
  got a dark casing like a road on a map, so the dashes read over rock; the turn got the
  disc; path slides lost their "detail is in its own deck" line (now in the notes).

## Beats

### cold-open

- **Act:** I
- **Job:** earn the first ten seconds with the ratio a room of engineers can't ignore
- **Headline:** Meta runs about a hundred clusters with fifteen engineers.
- **Visual:** a hundred small peak glyphs in a field, fifteen climber marks beneath them. No chart; the count is the picture
- **Energy:** 3
- **Into next:** that ratio only works if nobody is clicking anything. Here's what we think it means for us.
- **Source:** "We Have GitOps at Home" keynote abstract (Meta)
- **Status:** kept as is

### the-answer

- **Act:** I
- **Job:** put the recommendation up front so everything after it is support
- **Headline:** One path to production for every change, built as three climbs that start this quarter.
- **Visual:** the range. Three silhouetted summits on the gradient disc, each named: Path 1 Deployments as a service (mint, centre, tallest), Path 2 Claude agent platform (teal, sharpest), Path 3 EKS fleet + Crossplane (haze, broadest). This is the title slide
- **Energy:** 4
- **Into next:** why one path? Because two things got loud this week, and they turn out to be the same problem.
- **Status:** kept as is

### fleets

- **Act:** I
- **Job:** the first force as evidence: fleet toil is real at our scale, and we sit inside the range
- **Headline:** Nobody presenting at our scale was single-cluster or upgrading by hand.
- **Visual:** disclosed fleet sizes drawn as a ridge profile on a log scale: Salesforce 1,000 · LinkedIn 300 · Meta ~100 · Hertz 80 ⚠️ · Coinbase 79 · Mastercard 30 · Verkada 9. Our shape marked as a band mid-ridge
- **Energy:** 3
- **Into next:** the second force arrived as a user, not just a workload.
- **Source:** GOALS §0.1. Hertz's 80 is from the room, not the abstract; the ⚠️ stays on the slide
- **Status:** kept as is

### agents-arrive

- **Act:** I
- **Job:** the second force as evidence: the week was built for agents and controllers, not the person at the terminal
- **Headline:** Only 17 of 501 sessions treated the human developer as the open problem.
- **Visual:** 501 dots, 17 lit. The rest are the machine audience: agents, controllers, policy engines
- **Energy:** 3
- **Into next:** the whole show said it in one line.
- **Source:** GOALS §0.2, regex over titles and abstracts. Relative signal, labelled as such. The 26% agents/MCP figure isn't robust and stays off the slide
- **Status:** kept as is

### one-line

- **Act:** I
- **Job:** show both forces arriving at the same fix, and give the room the sentence to carry out
- **Headline:** Let agents propose. Let progressive delivery and policy decide.
- **Visual:** the line set large in the night sky. Below it a ridge: a haze route climbs from the left foot ("more clusters than hands"), a teal route from the right ("agents that change infrastructure"); both draw themselves up to one col that glows alpenglow, labelled GitOps, policy, progressive delivery
- **Energy:** 2
- **Into next:** so where are we standing when we start, and what ties the climbs together?
- **Merged from:** `two-forces` (the convergence picture) and `the-line` (the sentence)

### the-belay

- **Act:** II
- **Job:** the turn: from today's base camp, three climbs, and the one ordering that decides what we protect
- **Headline:** No agent opens a PR until policy runs in CI.
- **Visual:** the route map on the full range with the disc behind Path 1. A base-camp band along the foot says where each path starts today. Camps are lettered; only the camps the ropes touch are named. Click: the alpenglow rope draws from Path 1 B–C to Path 2 phase 2 ("the belay") and the other camps step back. Click: a thinner haze rope from Path 3 stage 1 to Path 1 D
- **Energy:** 5
- **Into next:** each climb in one slide, starting with the one the others are belayed to.
- **Merged from:** `base-camp` (today, now the band), `three-climbs` (the route map) and `the-rope` (the ropes)

### path-1-ten

- **Act:** II
- **Job:** say what Path 1 changes for a developer and what teams get back
- **Headline:** Path 1: teams trade the sync button for better change control.
- **Visual:** the mint summit on its own, stages A–E as camps up its face with dates; stage B lit in alpenglow, the one we protect. On the left, the trade: three things teams get back, each tagged with the stage that delivers it (two of the three are stage B)
- **Energy:** 3
- **Into next:** Path 2 is the one everyone is looking at.
- **Source:** `path1-deployments`
- **Status:** forked from `path-1`: headline tightened into the trade itself, fewer words, stage B warm, deck pointer moved to the notes

### path-2-ten

- **Act:** II
- **Job:** say what Path 2 is, and what it deliberately isn't
- **Headline:** Path 2: Claude leaves the laptop for a throwaway pod with an identity, a gateway and a log.
- **Visual:** the teal summit, phases 0–3; phases 1 and 2 lit in alpenglow, the two dates. On the left, the pod as a dashed enclosure whose only exits are a gateway and telemetry
- **Energy:** 3
- **Into next:** and Path 3 is the ground the other two stand on.
- **Source:** `CLAUDE-AGENT-PLATFORM.md`, `path2-agents`
- **Status:** forked from `path-2`: fewer words, the dated phases warm

### path-3-ten

- **Act:** II
- **Job:** say what Path 3 is, and why its first stage is nearly free
- **Headline:** Path 3: clusters become cattle, and developers never write a cluster name.
- **Visual:** the haze summit, stages 1–4; stage 1 lit in alpenglow because it starts now. On the left, twelve identical numbered clusters and the one line of placement an app writes instead of a cluster name
- **Energy:** 3
- **Into next:** so here's what we need from this room.
- **Source:** `EKS-VS-ECS.md`, GOALS §5 and §10, `path3-fleet`
- **Status:** forked from `path-3`: fewer words, stage 1 warm, new transition into the ask

### the-ask-dated

- **Act:** III
- **Job:** make the ask small enough to say yes to in the room, and show it is the plan, not a wish list
- **Headline:** Name three owners today, protect stage B, and commit to two dates.
- **Visual:** the three paths as lanes on a timeline to scale, Nov 2026 to the end of 2028. Each lane starts with its name and an empty owner line, and ends at its own small summit. Stage B is filled and ringed in alpenglow; Path 2 carries the two date flags (alert triage by Q2 2027, agent PRs by the end of 2027); Path 3 stage 1 "starts now". Everything later is dashed: gated, not scheduled
- **Energy:** 4
- **Into next:** end. Leave this up for the discussion.
- **Merged from:** `dates` (the timeline), `the-ask` (owners, stage B, the dates) and `echo` (now the opening line of the notes)
