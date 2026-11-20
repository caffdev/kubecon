# Path 3: The fleet is going to get big

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

**This is the ten-slide version (draft `ten`, the default).** The full-length version is draft
`main` (16 slides; `with-index` adds the tool catalogue), and its story is in
`narrative-main.md`. The two drafts share slide files: every slide here that differs from
`main` is its own file (a `-ten` fork or a new merged slug), so `main` is untouched.

Started 2026-11-17. Cut to ten on 2026-11-20, after feedback that the readout decks run long.
Reworked from "Running Our Clusters Better" (44 slides, Nov 12). Its delivery half (Argo,
promotion, canary, policy) lives in `path1-deployments`; this deck keeps the fleet half and
folds in `EKS-VS-ECS.md` (Nov 16) and GOALS §5, §8 and §10.

## Brief

- **Audience:** platform and infrastructure leads, SRE, and engineering leadership. Some of
  them see ECS as the simpler option for new workloads. Everyone has lived through a
  hand-run EKS upgrade.
- **Setting:** both. About 13 minutes live, then sent round. The notes carry the full
  argument for readers.
- **They believe now:** clusters are long-lived things we upgrade carefully by hand. ECS
  might be simpler for some workloads. Multi-cluster means buying a scheduler. Developers
  need to know which cluster their app runs in.
- **They believe after:** the fleet grows whatever we decide, so we standardise on EKS and
  spend the effort making clusters cattle: built from code, upgraded by policy, never named
  in an app, with restores drilled.
- **The one sentence:** our EKS fleet is going to get big whatever we decide about ECS, so
  we spend the effort making clusters cattle now, not on a second orchestrator.
- **The ask:** standardise on EKS (no new ECS without a written exception); default new
  clusters to Auto Mode; never let a cluster enter extended support; name an owner for the
  cluster-label schema; bring the list of prod workloads that can't run active-active.

## Shape

- **Structure:** problem → turn → proof → ask, in ten slides. The problem is that the fleet
  outgrows hands. The turn is that ECS isn't the simpler alternative, it's a third platform.
  The proof is four design rules the big fleets already use, ending on the 31st cluster. The
  ask is a route, a floor, and five decisions.
- **Acts:** I — *the fleet grows regardless* (1–3) / II — *design rules for a big fleet*
  (4–7) / III — *our climb* (8–10).
- **The peak:** `thirty-first-ten`, slide 7 of 10 (70%). A new cluster drops into the fleet,
  picks up its labels, and the app YAML beside it doesn't change. Every rule before it exists
  to make that true. The two slides before it sit a notch quieter.
- **The close:** the deck opens on 40 days becoming 7. The ask makes that the policy, not
  the exception, under the same strip of forty squares.
- **What the cut removed** (all still in `main`): `fleets` and `grows-regardless` became one
  slide; `gap-closed` became one line under `two-of-everything`; `upgrade-policy` became the
  clock under `cattle-on-a-clock`; `two-problems` became the placement lane of
  `region-is-a-sum`; `the-seam` became a dashed line on `the-route`; `paved-road` was cut
  (the IDP debate is its own argument; one sentence survives in the route's notes); the tool
  index stays in `with-index` only.

## Editorial notes

- No failure-case references. Data protection is stated as practice (`restore-ten`).
- ⚠️ AWS pricing (the extended-support fee) comes from third-party write-ups; it appears only
  with its flag and the "check the pricing page" line. Hertz's 80 is from the room and keeps
  its flag. LinkedIn's abstract and deck give different fleet sizes, so neither appears beside
  the 40 → 7.
- Our own cluster count isn't disclosed, so no slide draws our fleet at a height or a number:
  `fleet-grows` shows our shape and a direction, not a size.
- Global Accelerator is our recommendation, not something we saw presented; the lane lengths
  on `region-is-a-sum` are illustrative. Both say so on the slide.

## Visual direction

Series brand: Three Peaks (`docs/decks/_shared/`, see the readout's narrative for the full
palette and type). This path's colour is **haze blue** (`#68b6c3` on night, `#22697a` on
snowfield); alpenglow (`#f4a261` / `#a4501a`) is kept for the one warning or cost on a slide.

- **Subject world:** the herd. Clusters as cattle: identical, numbered, replaceable, counted
  rather than named. Time as business days and support months you can count. A route up a
  face, with a seam where one trade hands over to the next.
- **Grounds alternate every slide** (night, snow, night, snow, night, snow, **dusk** for the
  peak, night, snow, night), so the ten read as a rhythm and the peak's ground is the only
  dusk in the deck.
- **Pieces:** **day squares** (one square = one business day; opens and closes the deck);
  **cluster glyphs** (one small peak = one cluster; lit = selected by a label; a pet is the one
  glyph with a name tag and patches); **lanes** (a sum of delays as parallel bars, with the RTO
  line at the slowest lane's end); **the ridge** (disclosed fleet sizes as peaks on a log scale).

  ```
  opening (cold-open)               peak (thirty-first-ten, dusk)        densest (region-is-a-sum, snow)
  ┌──────────────────────────┐     ┌──────────────────────────┐       ┌──────────────────────────┐
  │ LinkedIn took prod 1.31  │     │ Adding the 31st cluster… │       │ Losing a region is a sum…│
  │ → 1.34 in seven days…    │     │ placement:    ▲ ▲ △ ▲ △ ▲│       │ placement ▏solved ←sched.│
  │ ■■■■■■■□□□□□□□□□□□□□     │     │   regions: …  △ ▲ △ ▲ ▲ △│       │ traffic  ▬▬▬▬            │RTO
  │ □□□□□□□□□□□□□□□□□□□□     │     │   compliance… ▲ △ ▲ △ ▲ ◉│       │ state    ▬▬▬▬▬▬          │
  │ 7 now · 40 before        │     │ [0 lines changed]        │       │ capacity ▬▬▬▬▬▬▬▬        │
  └──────────────────────────┘     └──────────────────────────┘       └──────────────────────────┘
  ```
- **Concepts as pictures:** duration is counted squares; cost over time is a step on a clock;
  the fleet is a herd of identical glyphs; selection is lighting the glyphs a label matches;
  a sum of delays is parallel lanes, the slowest setting the line; a second platform is the
  same five jobs drawn again as empty, dashed boxes.
- **Motion moment:** on `thirty-first-ten`, the 31st cluster drops into the herd under a glow
  and lights because its labels match (click 1), then the YAML card is stamped "0 lines
  changed" (click 2).
- **Raised for the ten-slide cut:** one picture per slide, with every label at 26px or more
  and body copy at 28–34px; evidence detail moves to the notes; the peak gets the brand's
  disc as a glow behind cluster 31, the deck's only use of the disc.
- **Anti-default check:** the old deck's topic slides were card grids with a "SEEN AT" mono
  label in each card and an "Our lean" box at the bottom of every slide (a template). Changed:
  one picture per slide; evidence moves to a single source line or the notes; our lean is
  the headline itself. In the ten cut, the "three rules" text blocks under `cattle` and
  `upgrade-policy` became one chart where the herd and the pet sit on either side of month 14.
- **Audit exceptions, accepted:** `two-of-everything`, `region-is-a-sum` and `the-ask-ten`
  run long on words; their diagrams and the five decisions need their labels.

## Beats

### cold-open

- **Act:** I
- **Job:** open on the number that makes upgrade toil felt, and name the talk
- **Headline:** LinkedIn took production from 1.31 to 1.34 in seven business days. It used to take forty.
- **Visual:** forty day-squares in two rows, seven of them lit. The deck title and presenters small at the foot
- **Energy:** 4
- **Into next:** and they're not unusual. Look at who else was presenting, and where we sit.
- **Source:** LinkedIn, "Binary Version Is Not Behavior" (KEP-4330), deck p.2
- **Status:** kept as is (shared with `main`)

### fleet-grows

- **Act:** I
- **Job:** make "fleet toil is unsustainable" evidence, place us in it, and show the growth is already committed
- **Headline:** Our fleet grows either way, toward the sizes nobody upgrades by hand.
- **Visual:** the ridge of disclosed fleet sizes on a log scale (Salesforce 1,000 · LinkedIn 300 · Meta ~100 · Hertz 80 ⚠️ · Coinbase 79 · Mastercard 30 · Verkada 9), our shape bracketed under the mid-table three, and a haze arrow from our bracket up the table carrying the roadmap items that put more clusters on Kubernetes. No height or number for us
- **Energy:** 3
- **Into next:** so "EKS or ECS?" is the wrong question.
- **Source:** GOALS §0.1; `EKS-VS-ECS.md` §1
- **Status:** merged from `fleets` + `grows-regardless`

### two-of-everything

- **Act:** I
- **Job:** the turn: ECS adds a platform rather than replacing one, and "simpler" no longer holds
- **Headline:** ECS wouldn't replace anything; it would be a third container platform.
- **Visual:** five jobs across the top (deploy, policy, identity, observability, agents operating it). Platforms 1 and 2, on-prem Kubernetes and EKS, share one solid haze band of tools. Platform 3, ECS, is the same five jobs again as dashed, empty alpenglow boxes. One line under it closes the "simpler" gap: Auto Mode and ECS Managed Instances both have AWS patch the nodes
- **Energy:** 4
- **Into next:** so we stay on EKS. Here's how the big fleets run one.
- **Source:** `EKS-VS-ECS.md` §0, §2, §3
- **Status:** merged from `third-platform` + `gap-closed`

### cattle-on-a-clock

- **Act:** II
- **Job:** the first design rule, with its cost attached: clusters built from code and upgraded by policy
- **Headline:** Clusters are cattle: built from code, and upgraded inside their 14 months by policy.
- **Visual:** a clock of support months, 0 to 22. Standard support to month 14 at $0.10 an hour; past it, extended support at $0.60 ⚠️, a step on the line. The herd of identical glyphs sits on the cheap side; one pet, named and patched by hand, sits on the step
- **Energy:** 3
- **Into next:** cattle are upgraded in bulk, so every change needs its own proof.
- **Source:** `EKS-VS-ECS.md` §4 rules 1–4; ⚠️ fee from third-party write-ups
- **Status:** merged from `cattle` + `upgrade-policy`

### ship-the-check-ten

- **Act:** II
- **Job:** the automation pattern that has nothing to do with AI
- **Headline:** Ship every change with the check that fails without it, so `kubectl get` is the audit.
- **Visual:** NVIDIA's field of about 5,600 node squares, nearly all verified, a few pending, one failed and retrying (the mix is illustrative). Beside it, ~5,600 set large (30 minutes, 16 clusters), and their real `kubectl get nodewright` row (`in_progress`, `4880/5000`) from deck p5, columns trimmed: the audit is a query
- **Energy:** 3
- **Into next:** that's fleet toil. Losing a region looks like the same problem, and isn't.
- **Source:** "5,000 Nodes in Minutes, Twice in a Week" (NVIDIA); `deck-assets/12-fleet-node-changes`
- **Status:** forked edit of `ship-the-check` (the three text blocks became one number and NVIDIA's own `kubectl get` output)

### region-is-a-sum

- **Act:** II
- **Job:** split surviving a region from fleet management, and show "no visible downtime" is a sum
- **Headline:** Losing a region is a sum of delays, and the scheduler's lane is already solved.
- **Visual:** four lanes as time bars. Placement is a sliver marked solved, and it is the only lane a scheduler like Karmada works on. Traffic (detect, propagate, the client DNS cache struck off by Global Accelerator), state (data converges in the survivor) and capacity (the survivor scales from half to full) run long; the RTO line stands at the slowest lane's end
- **Energy:** 3
- **Into next:** placement being solved is the setup for the best slide in the deck.
- **Source:** GOALS §5.1, §5.1B. Lengths illustrative; Global Accelerator is our recommendation
- **Status:** merged from `two-problems` + `live-live`

### thirty-first-ten

- **Act:** II
- **Job:** the peak: the payoff every rule so far exists for
- **Headline:** Adding the 31st cluster should cost nobody an app change.
- **Visual:** on the left, an app's placement YAML (regions, compliance, capability, residency). On the right, a herd of 30 numbered clusters, the label-matched ones lit. Click 1: a 31st drops in under a glow, takes its labels and lights. Click 2: the YAML card is stamped "0 lines changed"
- **Energy:** 5
- **Into next:** that's the summit. Here's the route up to it.
- **Source:** `EKS-VS-ECS.md` §4 rule 5; GOALS §5.5
- **Status:** forked edit of `thirty-first` (glow, the diff stamp as a second click)

### the-route

- **Act:** III
- **Job:** the route, why stage 1 starts now, and where CDK hands off to Crossplane
- **Headline:** Four stages, and the first is nearly free: labels, fleet delivery, lifecycle, Crossplane.
- **Visual:** the haze face with four camps up it: 1 cluster labels as an API (starts now: a schema, an owner, a join policy); 2 fleet delivery in waves; 3 lifecycle (Auto Mode, the window as policy, Hybrid Nodes at one site); a dashed seam across the face (CDK below, Crossplane above, decision 3); 4 Crossplane for app-owned infrastructure, S3 first. Beside it, the three things that wait on stage 1
- **Energy:** 3
- **Into next:** before we climb, the floor under all of it.
- **Source:** GOALS §5, §10.2, decision 3
- **Status:** merged from `four-stages` + `the-seam` (and one line of `paved-road`, in the notes)

### restore-ten

- **Act:** III
- **Job:** the one area where being wrong is unrecoverable; a breather before the ask
- **Headline:** Backups are a rumor until we restore one.
- **Visual:** the headline set large, and under it a short trail of three camps, retain and back up as outlines, drill lit: restore into a scratch cluster on a calendar, and time it. A low far ridge along the foot: the floor
- **Energy:** 2
- **Into next:** so, five decisions.
- **Source:** GOALS §8; Velero project update (Red Hat); Data Protection WG
- **Status:** forked edit of `restore` (one trail, drill lit; the etcd alert moves to the notes)

### the-ask-ten

- **Act:** III
- **Job:** the ask, echoing forty days becoming seven
- **Headline:** Standardise on EKS, default to Auto Mode, and name an owner for the label schema.
- **Visual:** the forty-square strip from the opening as one row, labelled "policy, not exception", above five decisions with our lean: E1 EKS standard, E2 Auto Mode default, E3 never in extended support, 2c the label-schema owner, 2 the can't-be-active/active list. One line under them: what starts unless someone objects
- **Energy:** 4
- **Into next:** end
- **Status:** forked edit of `the-ask` (larger type, one-row strip)
