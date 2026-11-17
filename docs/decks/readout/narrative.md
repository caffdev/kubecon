# One range, three climbs: KubeCon NA 2026 readout

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Started 2026-11-17. Reworked from the superseded single-deck "KubeCon NA 2026 Readout"
artifact (33 slides, Nov 12) into the umbrella talk for the three paths. The three path decks
(`path1-deployments`, `path2-agents`, `path3-fleet`) carry the detail; this one carries the
argument and the ask.

Published as a private Claude artifact (the `main` draft, single-file export): https://claude.ai/artifact/3gNPsU22eQdj1o59V7AaSt
Rebuild with `node docs/decks/_kit/deck.mjs export readout` and republish `dist/`.

## Brief

- **Audience:** engineering leadership, plus the platform, SRE and security leads who will
  staff the work. They know our estate (on-prem Kubernetes plus EKS live-live, Argo CD on
  manual sync, Claude Code on laptops). They didn't go. They are wary of conference hype
  and of anything that sounds like "build an AI platform", and they want to know what they
  are deciding and what it costs.
- **Setting:** both. A 20-minute slot live, then sent round as the record. Designed for the
  room; the notes carry the full argument for readers.
- **They believe now:** KubeCon was mostly AI noise. Our platform is fine as it is. Agents
  are a separate initiative that someone else will run.
- **They believe after:** fleet toil and agents are one problem with one fix: a path to
  production that decides for itself. It splits into three climbs we can staff in
  parallel, with one ordering we have to protect.
- **The one sentence:** whether a person or an agent wrote the change, it should reach a
  cluster by one path that decides for itself, and we can build that path as three climbs
  that start this quarter.
- **The ask:** name an owner for each path today; protect Path 1 stage B (policy in CI and
  at admission) as the work that gates the others; commit to AI ladder stage 1 (alert
  triage) by Q2 2027 and stage 2 (agents open PRs) by the end of 2027.

## Shape

- **Structure:** answer first. This is a decision meeting with executives in it; they want
  the recommendation, then the support. The answer is slide 2, straight after a cold open.
- **Acts:** I — *the answer, and what the week showed* (the two forces, the evidence, the one
  line everybody said) / II — *from base camp* (where we stand, the three climbs, the rope
  that ties them, one slide per path) / III — *what we commit to* (dates, the echo, the ask).
- **The peak:** `the-rope`, at about 60%. The three climbs look independent until the rope
  draws: no agent opens a PR until policy runs in CI. That one ordering is why stage B gets
  protected headcount, so it is the turn of the talk.
- **The close:** the cold open was a hundred clusters run by fifteen people. The echo shows
  the same field with one path running through it: that ratio is what a finished path looks
  like. Then the ask, which is the last thing on screen.

## Visual direction

Series brand, decided with the user: **Three Peaks**, the Wasatch ridgeline from the show's
own artwork (the earlier "Three Peaks — visual concepts" artifact). It lives in
`docs/decks/_shared/` (`brand.css` for tokens and pieces, `peaks.js` to draw the mountains).
This deck is the one that shows the whole range.

- **Subject world:** the Wasatch above Salt Lake City as the show drew it: flat silhouette
  peaks, one ridge-shadow stripe per face, a sky-to-mint disc. Around it, expedition
  material: route topos with numbered pitches, base camp, ropes, summit registers.
- **Palette:** night `#070b0e` (ground) · snow `#e8f4f2` (ink) · lichen `#9fb4b6` (quiet text,
  9:1) · mint `#9cf0e1` = Path 1 · teal `#36baa2` = Path 2 · haze `#68b6c3` = Path 3 ·
  alpenglow `#f4a261`, the one warm accent: the rope, the dates, the ask · snowfield
  `#e9f1f0` light ground for evidence, with slate `#0f1e29` ink · sky `#1f6fb2` for the disc
  only (3.7:1, never text).
- **Type:** Barlow Condensed 600 for headlines (the narrow cut of US highway and trail
  signage, readable from the back of a room); Barlow 400/500 for body; JetBrains Mono only
  for literal code.
- **Layout:** margins 120 / 96, left-aligned. Hero slides put the range on the bottom edge
  with the headline in the sky above it. Content slides: headline top-left in at most two
  lines, picture in the right two-thirds or across the lower band. Evidence slides go on
  snowfield, so the deck alternates night and day.

  ```
  opening (the-answer)              densest (fleets, snowfield)       peak (the-rope)
  ┌───────────────────────────┐    ┌───────────────────────────┐    ┌───────────────────────────┐
  │ One path to production…   │    │ Nobody presenting at our… │    │ No agent opens a PR until │
  │                    (disc) │    │  1,000                    │    │ policy runs in CI.        │
  │  P3      P1         P2    │    │   /\   300                │    │   4     E                 │
  │  /\      /\         /\    │    │  /  \  /\  100 80 79 30 9 │    │  3     D       3          │
  │ /  \    /  \       /  \   │    │ /____\/__\_/\_/\_/\_/\_/\ │    │ 2     C ~~~~~> 2          │
  │/____\__/____\_____/____\_ │    │ [our band]                │    │1     A B       0 1        │
  └───────────────────────────┘    └───────────────────────────┘    └══ base camp ══════════════┘
  ```
- **Signature element:** the three-peak range, with mint, teal and haze snow caps on the
  disc. It appears only where the range means something: the answer, the route map, the
  rope, the path slides, the echo, the ask.
- **Concepts as pictures:** altitude is progress; camps are stages (numbered circles in the
  path colour; filled = where we are, dashed = undated); ropes are dependencies (alpenglow,
  dashed); fields of small peak glyphs are counts (one glyph = one cluster); the base-camp
  band at the foot is today.
- **Motion moment:** on `the-rope`, the rope draws itself from Path 1 B–C across to Path 2
  phase 2, then the thinner label rope from Path 3 stage 1 to Path 1 D.
- **Anti-default check, and what changed:**
  - *Near-black with a bright accent* is the show's own artwork, so it stays, but: three
    accents with fixed meanings instead of one decorative accent; the warm accent reserved
    for decisions; the evidence slides moved to a snowfield ground.
  - *Inter* (every earlier deck) replaced by Barlow Condensed, chosen from signage.
  - *Template chrome:* no eyebrow labels, act labels, page numbers, logos or mono labels.
    Sources appear only where a claim needs one.
  - *Big number, small label:* fleet sizes drawn as peaks scaled to size, not stat cards.
  - *Card grids:* none. Structure comes from the range and the camps.

- **Audit exceptions, accepted:** the path slides (path-1, path-2, path-3) and the-ask run 95–105 words; they summarise a whole deck each and are left up for discussion.

## Beats

### cold-open

- **Act:** I
- **Job:** earn the first ten seconds with the ratio a room of engineers can't ignore
- **Headline:** Meta runs about a hundred clusters with fifteen engineers.
- **Visual:** a hundred small peak glyphs in a field, fifteen climber marks beneath them. No chart; the count is the picture
- **Energy:** 3
- **Into next:** that ratio only works if nobody is clicking anything. Here's what we think it means for us.
- **Source:** "We Have GitOps at Home" keynote abstract (Meta)

### the-answer

- **Act:** I
- **Job:** put the recommendation up front so everything after it is support
- **Headline:** One path to production for every change, built as three climbs that start this quarter.
- **Visual:** the range. Three silhouetted summits on the gradient disc, each named: Path 1 Deployments as a service (mint, centre, tallest), Path 2 Claude agent platform (teal, sharpest), Path 3 EKS fleet + Crossplane (haze, broadest). This is the title slide
- **Energy:** 4
- **Into next:** why one path? Because two things got loud this week, and they turn out to be the same problem.

### two-forces

- **Act:** I
- **Job:** show that fleet toil and agents converge on the same fix
- **Headline:** Fleet toil and AI agents are one problem: change has to reach a cluster without a human reading every diff.
- **Visual:** two routes climbing either side of a ridge, "more clusters than hands" and "agents that want to change infrastructure", meeting at one col labelled GitOps + policy + progressive delivery
- **Energy:** 3
- **Into next:** the first force first: the fleets.

### fleets

- **Act:** I
- **Job:** turn "fleet toil is unsustainable" from an opinion into evidence, and place us in it
- **Headline:** Nobody presenting at our scale was single-cluster or upgrading by hand.
- **Visual:** disclosed fleet sizes drawn as a ridge profile on a log scale: Salesforce 1,000 · LinkedIn 300 · Meta ~100 · Hertz 80 ⚠️ · Coinbase 79 · Mastercard 30 · Verkada 9. Our shape marked as a band mid-ridge
- **Energy:** 3
- **Into next:** the second force arrived as a user, not just a workload.
- **Source:** GOALS §0.1. Hertz's 80 is from the room, not the abstract; say so if asked

### agents-arrive

- **Act:** I
- **Job:** show that the week was built for agents and controllers, not for the person at the terminal
- **Headline:** Only 17 of 501 sessions treated the human developer as the open problem.
- **Visual:** 501 dots, 17 lit. The rest are the machine audience: agents, controllers, policy engines
- **Energy:** 3
- **Into next:** the whole show said it in one line.
- **Source:** GOALS §0.2, regex over titles and abstracts. Relative signal. The 26% agents/MCP figure isn't robust and stays off the slide

### the-line

- **Act:** I
- **Job:** a breather that gives the room the sentence to carry out of the meeting
- **Headline:** Let agents propose. Let progressive delivery and policy decide.
- **Visual:** the sentence alone, set large in the night sky above the ridge
- **Energy:** 2
- **Into next:** so where are we standing when we start?

### base-camp

- **Act:** II
- **Job:** state where we are without defensiveness, so the room agrees on the starting point
- **Headline:** Base camp today: Argo on manual sync, clusters named by hand, Claude on laptops.
- **Visual:** the foot of the range as a camp. Three markers, one under each face, each labelled with today's state
- **Energy:** 2
- **Into next:** from here there are three climbs, each with its own stages.

### three-climbs

- **Act:** II
- **Job:** show the whole plan at a glance, with the real stage names
- **Headline:** Three climbs from one base camp, each with its own stages.
- **Visual:** route map. Path 1 stages A–E up the centre face, Path 2 phases 0–3 on the right, Path 3 stages 1–4 on the left, waypoints as numbered circles
- **Energy:** 4
- **Into next:** they look independent. Two ropes say they aren't.

### the-rope

- **Act:** II
- **Job:** the turn: reveal the one ordering that decides what we protect
- **Headline:** No agent opens a PR until policy runs in CI.
- **Visual:** the route map again. On click a rope draws from Path 1 B–C to Path 2 phase 2 ("policy in CI + promotion as a PR: the belay for an agent PR"); then a second, thinner rope from Path 3 stage 1 to Path 1 D ("cluster labels → fleet-wide rollout")
- **Energy:** 5
- **Into next:** each climb in one slide, starting with the one the others are belayed to.

### path-1

- **Act:** II
- **Job:** say what Path 1 changes for a developer and what teams get back
- **Headline:** Path 1: teams stop clicking sync and get change control back in a better form.
- **Visual:** the mint summit on its own, stages A–E as camps up its face, the trade written beside it
- **Energy:** 3
- **Into next:** Path 2 is the one everyone is looking at.
- **Source:** `path1-deployments`

### path-2

- **Act:** II
- **Job:** say what Path 2 is, and what it deliberately isn't
- **Headline:** Path 2: Claude leaves the laptop for a throwaway pod with an identity, a gateway and a log.
- **Visual:** the teal summit, phases 0–3. The pod drawn as a small enclosure whose only exits are two gateways
- **Energy:** 3
- **Into next:** and Path 3 is the ground the other two stand on.
- **Source:** `CLAUDE-AGENT-PLATFORM.md`, `path2-agents`

### path-3

- **Act:** II
- **Job:** say what Path 3 is, and why its first stage is nearly free
- **Headline:** Path 3: clusters become cattle, and developers never write a cluster name.
- **Visual:** the haze-blue summit, broadest base, stages 1–4
- **Energy:** 3
- **Into next:** two of these camps get dates. The rest don't, on purpose.
- **Source:** `EKS-VS-ECS.md`, GOALS §5 and §10, `path3-fleet`

### dates

- **Act:** III
- **Job:** show what we commit to and when, with time drawn to scale
- **Headline:** Two dates we'll commit to; everything above them is gated, not scheduled.
- **Visual:** a timeline from Nov 2026 to 2028 with real spacing. Path 1 stage A by Jan 2027 and stage B in Q1 2027; AI stage 1 (triage) by Q2 2027; stage 2 (agent PRs) by end 2027; Path 1 stage E and Path 2 phase 3 in 2028, dashed. The two AI dates are flags
- **Energy:** 3
- **Into next:** which brings us back to Meta.

### echo

- **Act:** III
- **Job:** close the loop on the opening ratio, reframed as what a finished path looks like
- **Headline:** A hundred clusters and fifteen engineers is what a finished path looks like.
- **Visual:** the cold-open field again, now with one line (the path) running through all hundred peaks
- **Energy:** 2
- **Into next:** here's what it takes to start.

### the-ask

- **Act:** III
- **Job:** make the ask small enough to say yes to in the room
- **Headline:** Name three owners today, protect stage B, and commit to the two dates.
- **Visual:** three summit markers, each with an empty owner line; stage B ringed; the two dates as flags. A quiet footnote for what's on no path: Gateway API (Ingress NGINX is retired) and secrets
- **Energy:** 4
- **Into next:** end. Leave this up for the discussion.
