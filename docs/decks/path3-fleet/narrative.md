# Path 3: The fleet is going to get big

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Started 2026-11-17. Reworked from "Running Our Clusters Better" (44 slides, Nov 12). Its
delivery half (Argo, promotion, canary, policy) now lives in `path1-deployments`; this deck
keeps the fleet half and folds in `EKS-VS-ECS.md` (Nov 16) and GOALS §5, §8 and §10.

## Brief

- **Audience:** platform and infrastructure leads, SRE, and engineering leadership. Some of
  them see ECS as the simpler option for new workloads. Everyone has lived through a
  hand-run EKS upgrade.
- **Setting:** both. 25 minutes live, then sent round.
- **They believe now:** clusters are long-lived things we upgrade carefully by hand. ECS
  might be simpler for some workloads. Multi-cluster means buying a scheduler. Developers
  need to know which cluster their app runs in.
- **They believe after:** the fleet grows whatever we decide, so we standardise on EKS and
  spend the effort making clusters cattle: built from code, upgraded by policy, never named
  in an app, with the AWS seam marked and restores drilled.
- **The one sentence:** our EKS fleet is going to get big whatever we decide about ECS, so
  we spend the effort making clusters cattle now, not on a second orchestrator.
- **The ask:** standardise on EKS (no new ECS without a written exception); default new
  clusters to Auto Mode; make the 14-month support window a policy; name an owner for the
  cluster-label schema; bring the list of prod workloads that can't run active/active.

## Shape

- **Structure:** problem → turn → proof → ask. The problem is that the fleet outgrows hands.
  The turn is that ECS isn't the simpler alternative, it's a third platform. The proof is
  the design rules the big fleets already use. The ask is four stages and five decisions.
- **Acts:** I — *the fleet grows regardless* / II — *design rules for a big fleet* / III —
  *our climb: four stages, the seam, the floor, the ask*.
- **The peak:** `thirty-first`, slide 11 of 16 (69%). A new cluster drops into the fleet,
  picks up its labels, and the app YAML beside it doesn't change. Every design rule before
  it exists to make that true.
- **The close:** the deck opens on 40 days becoming 7. The ask makes that the policy, not
  the exception.

## Editorial notes

- No failure-case references. Data protection is stated as practice (`restore`).
- ⚠️ AWS pricing (Auto Mode uplift, extended-support fee) comes from third-party write-ups;
  check the pricing pages before quoting. Hertz's 80 is from the room. LinkedIn's abstract
  and deck give different fleet sizes, so neither appears beside the 40 → 7.

## Visual direction

Series brand: Three Peaks (`docs/decks/_shared/`, see the readout's narrative for the full
palette and type). This path's colour is **haze blue** (`#68b6c3` on night, `#22697a` on
snowfield). What this deck adds:

- **Subject world:** the herd. Clusters as cattle: identical, numbered, replaceable, counted
  rather than named. Time as business days you can count. Infrastructure as a building
  drawn in section, with the seam where one trade hands over to the next.
- **Grounds:** night for the argument; snowfield for the evidence and the systems
  (live-live lanes, the seam, the decision grid).
- **Pieces:** **day squares** (one square = one business day); **cluster glyphs** (one small
  peak = one cluster; lit = selected by a label); **lanes** (a sum of delays drawn as
  segments in parallel, with the RTO line at the slowest lane's end).

  ```
  opening (cold-open)               peak (thirty-first)                densest (live-live, snowfield)
  ┌──────────────────────────┐     ┌──────────────────────────┐       ┌──────────────────────────┐
  │ LinkedIn took prod 1.31  │     │ Adding the 31st cluster… │       │ Losing a region is a sum…│
  │ → 1.34 in seven days…    │     │ placement:    ▲ ▲ △ ▲ △ ▲│       │ delivery ▏solved         │
  │ ■■■■■■■□□□□□□□□□□□□□     │     │   regions: …  △ ▲ △ ▲ ▲ △│       │ traffic  ▬▬▬▬            │RTO
  │ □□□□□□□□□□□□□□□□□□□□     │     │   compliance… ▲ △ ▲ △ ▲ ★│       │ state    ▬▬▬▬▬▬          │
  │ 7 now · 40 before        │     │ (unchanged)              │       │ capacity ▬▬▬▬▬▬▬▬        │
  └──────────────────────────┘     └──────────────────────────┘       └──────────────────────────┘
  ```
- **Concepts as pictures:** duration is counted squares; the fleet is a herd of identical
  glyphs; selection is lighting the glyphs a label matches; a sum of delays is parallel
  lanes, with the slowest setting the line.
- **Motion moment:** on `thirty-first`, the 31st cluster drops into the herd, lights up
  because its labels match, and the YAML beside it never moves.
- **Anti-default check:** the old deck's topic slides were card grids with a "SEEN AT" mono
  label in each card and an "Our lean" box at the bottom of every slide (a template). Changed:
  one picture per slide; evidence moves to a single source line or the notes; our lean is
  the headline itself.

## Beats

### cold-open

- **Act:** I
- **Job:** open on the number that makes upgrade toil felt
- **Headline:** LinkedIn took production from 1.31 to 1.34 in seven business days. It used to take forty.
- **Visual:** forty day-squares in a row, seven of them lit. Nothing else
- **Energy:** 4
- **Into next:** and they're not unusual. Look at who else was presenting.
- **Source:** LinkedIn, "Binary Version Is Not Behavior" (KEP-4330), deck p.2

### fleets

- **Act:** I
- **Job:** make "fleet toil is unsustainable" evidence, and place us in it
- **Headline:** Nobody presenting at our scale was hand-upgrading, and our shape sits mid-table.
- **Visual:** disclosed fleet sizes as a ridge profile on a log scale, with our band marked: Salesforce 1,000 · LinkedIn 300 · Meta ~100 · Hertz 80 ⚠️ · Coinbase 79 · Mastercard 30 · Verkada 9
- **Energy:** 3
- **Into next:** and ours is going to grow, whatever we decide.
- **Source:** GOALS §0.1

### grows-regardless

- **Act:** I
- **Job:** show the growth is already committed
- **Headline:** Every roadmap item we brought home lands on Kubernetes, so the fleet grows either way.
- **Visual:** the work from all three paths (agent pods, canary namespaces, live-live regions, Crossplane) each landing as new load on the EKS range, which widens
- **Energy:** 3
- **Into next:** so the question people are asking us, "EKS or ECS?", is the wrong question.
- **Source:** `EKS-VS-ECS.md` §1

### third-platform

- **Act:** I
- **Job:** the turn: ECS adds a platform rather than replacing one
- **Headline:** ECS wouldn't replace anything; it would be a third container platform.
- **Visual:** a 3 × 4 grid. Rows are on-prem Kubernetes, EKS and ECS; columns are deploy, policy, observability and on-call. The ECS row is all new work, outlined and empty
- **Energy:** 4
- **Into next:** and the old argument for ECS, that it's simpler, closed last year.
- **Source:** `EKS-VS-ECS.md` §0, §2

### gap-closed

- **Act:** I
- **Job:** remove the "ECS is simpler" objection
- **Headline:** The "ECS is simpler" gap closed in 2025: Auto Mode and ECS Managed Instances are the same product.
- **Visual:** the two products side by side with matching rows (AWS-managed EC2, a per-instance fee, AWS patches the nodes, GPU fees cut on the same day), and one row that differs: the Kubernetes API, which is the asset
- **Energy:** 3
- **Into next:** so we stay on EKS. Here's how to run a big one.
- **Source:** `EKS-VS-ECS.md` §3; ⚠️ pricing from third-party write-ups

### cattle

- **Act:** II
- **Job:** the first design rule
- **Headline:** Clusters are cattle: built and upgraded from code, with node toil pushed to AWS.
- **Visual:** one cluster drawn twice. As a pet: hand-named, hand-patched, nobody can recreate it. As cattle: created from code (Auto Mode + CDK/Crossplane), numbered, replaceable
- **Energy:** 3
- **Into next:** cattle still need upgrading, and that has to stop being a project.
- **Source:** `EKS-VS-ECS.md` §4 rules 1–3

### upgrade-policy

- **Act:** II
- **Job:** make the upgrade window a rule with a cost attached
- **Headline:** Upgrade cadence is a policy, not a project, and a missed window shows up on the bill.
- **Visual:** a 14-month standard-support bar per cluster; past its end the control-plane fee steps from $0.10 to $0.60 an hour. Skip-level upgrades (KEP-4330) shorten the bar's work
- **Energy:** 3
- **Into next:** and every upgrade change carries its own proof.
- **Source:** `EKS-VS-ECS.md` §4 rule 4; ⚠️ fee from third-party write-ups

### ship-the-check

- **Act:** II
- **Job:** the automation pattern that has nothing to do with AI
- **Headline:** Ship every change with the check that fails without it, so `kubectl get` is the audit.
- **Visual:** NVIDIA's pattern: a change and its check shipped together, a status enum per node, about 5,600 nodes converged in 30 minutes
- **Energy:** 3
- **Into next:** that's fleet toil. Multi-cluster has a second problem that looks similar and isn't.
- **Source:** "5,000 Nodes in Minutes, Twice in a Week" (NVIDIA); `deck-assets/12-fleet-node-changes`

### two-problems

- **Act:** II
- **Job:** split fleet management from surviving a region
- **Headline:** Multi-cluster is two problems, and conflating them buys a scheduler for a traffic problem.
- **Visual:** a fork. One branch is fleet toil (one definition, many clusters: ApplicationSets, CAPI). The other is losing a region (traffic, state, capacity). Karmada sits on neither branch until we can name a workload that needs scheduling
- **Energy:** 4
- **Into next:** the region branch first, because the customers see it.
- **Source:** GOALS §5.1

### live-live

- **Act:** II
- **Job:** show "no visible downtime" is a sum, not a number
- **Headline:** Losing a region is a sum of delays, and the slowest layer sets our RTO.
- **Visual:** four layers stacked as time bars: delivery (solved), traffic (Global Accelerator keeps client DNS caching out of the RTO), state (we can't fail traffic over faster than the data), capacity (2× headroom or Karpenter scale-up inside the RTO)
- **Energy:** 3
- **Into next:** and the developer-facing half is the part nobody budgets.
- **Source:** GOALS §5.1B; Global Accelerator is our recommendation, not something we saw presented

### thirty-first

- **Act:** II
- **Job:** the peak: the payoff every rule so far exists for
- **Headline:** Adding the 31st cluster should cost nobody an app change.
- **Visual:** on the left, an app's placement YAML (regions, compliance, capability, residency). On the right, a field of 30 labelled clusters. On click a 31st drops in, takes its labels, and the selector picks it up. The YAML never changes
- **Energy:** 5
- **Into next:** that's the summit. Here's the route.
- **Source:** `EKS-VS-ECS.md` §4 rule 5; GOALS §5.5

### four-stages

- **Act:** III
- **Job:** the route, and why stage 1 starts now
- **Headline:** Four stages, and the first is nearly free: labels, fleet delivery, lifecycle, Crossplane.
- **Visual:** the haze face with four camps: 1 cluster labels as an API (starts now, costs a schema and an owner); 2 fleet delivery in waves; 3 lifecycle (Auto Mode, upgrade policy, Hybrid Nodes pilot); 4 Crossplane for app-owned infrastructure
- **Energy:** 3
- **Into next:** stage 4 needs one line drawn before anyone builds on it.

### the-seam

- **Act:** III
- **Job:** mark where CDK hands off to Crossplane
- **Headline:** Mark the seam before we pour: landing zone and CDK below, Crossplane above.
- **Visual:** a building in section. Foundation: LZA (accounts, guardrails). CDK (VPCs, EKS clusters). Then the seam, dashed. Above it: Crossplane (S3 first) and the apps
- **Energy:** 3
- **Into next:** and above the seam, developers still have no road.
- **Source:** GOALS §10.2, decision 3

### paved-road

- **Act:** III
- **Job:** the no-IDP slide: road before portal
- **Headline:** We have no paved road, so we build the road before we buy a portal.
- **Visual:** five ways to make deploying simple (portal, orchestrator, workload spec, paved road with no portal, PaaS) laid out by how much they abstract; our lean (templates in Git + label vocabulary + policy-enforced defaults) marked
- **Energy:** 3
- **Into next:** last, the floor under all of it.
- **Source:** old `idp` slide; BackstageCon, Syntasso, WSO2, ŌURA

### restore

- **Act:** III
- **Job:** the one area where being wrong is unrecoverable
- **Headline:** Backups are a rumor until we restore one.
- **Visual:** three steps posted like a procedure: retain (audit every StorageClass; Delete is the wrong default), back up (Velero on a schedule), drill (restore into a scratch cluster on a calendar, and time it). Plus etcd size alerts at 50% and 75%
- **Energy:** 2
- **Into next:** so, five decisions.
- **Source:** GOALS §8; Velero project update (Red Hat); Data Protection WG

### the-ask

- **Act:** III
- **Job:** the ask, echoing forty days becoming seven
- **Headline:** Standardise on EKS, default to Auto Mode, and name an owner for the label schema.
- **Visual:** the forty-to-seven day strip from the opening, labelled "policy, not exception", above five decisions with our lean: E1 EKS standard, E2 Auto Mode default, E3 never in extended support, the label-schema owner, the can't-be-active/active list
- **Energy:** 4
- **Into next:** end
