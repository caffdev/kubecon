# Takeaways v2: the fleet outgrows one person (ten-slide cut)

> This is the story of draft `ten`, the default: ten slides, about 13 minutes.
> The full-length version is draft `main` (17 slides); its story is in `narrative-main.md`.
> Both drafts share `theme/`; slides `ten` changed were forked to `<slug>-ten` or given new
> slugs, so `main` still renders exactly as before.

Cut 2026-11-20 from the 17-slide `main` after feedback that the readout decks run long. Same
story, same sources (GOALS §0, §1.4, §1.7, §2.3, §4.2, §5.2; `EKS-VS-ECS.md` §4;
`GOALS-GAPS.md` §1.1 + §2.3), told in ten beats.

## Brief

- **Audience:** engineering, leads included: the people who run the clusters and the people
  who decide what that team works on. Most of them have never seen an upgrade from the
  inside; the platform team has done every one.
- **Setting:** live, about 13 minutes, then sent round. The notes carry the full argument
  for readers.
- **They believe now:** upgrades are routine maintenance that one experienced person
  handles. More clusters means a bit more of the same work. OTel vs Prometheus is a
  tooling preference.
- **They believe after:** the work grows faster than the fleet, because every new cluster
  multiplies kubeadm runs *and* tool rollouts. Hiring buys one stage. What lasts is
  rebuilding clusters from code, and rolling platform tools out like software: in waves,
  behind gates, inside change windows, rolling themselves back. OTel is the layer our
  classic and AI workloads share, not a replacement for Prometheus, and what it collects
  lands in one read-only lake that the agents decide from.
- **The one sentence:** the fleet will outgrow one person with a runbook, so clusters
  and the tools on them have to roll out like software: in waves, behind gates, inside
  windows, rolling themselves back.
- **The ask:** (1) no new hand-built kubeadm clusters: EKS Auto Mode in AWS, Cluster API
  on-prem; (2) put one platform tool (splunk-otel-collector first) through a wave pipeline
  with gates and auto-rollback this quarter, then Argo CD, Prometheus and Karpenter. Then
  (3) change windows as a policy that Argo CD and Kyverno both read; (4) the OTel collector
  as the standard telemetry layer on every cluster, AI workloads included, feeding one
  read-only lake the agents read instead of holding production credentials.

## Shape

- **Structure:** chronicle with a turn, as in `main`, compressed. The six growth slides of
  `main` became one map that steps through all six stages on clicks; the runbook and the
  four tools became one picture of a cluster's year; waves and gates became one peak; OTel
  and the lake became one flow that ends in the lake.
- **Acts:** I: *watch it grow* (2 slides: the claim, then the map that grows) / II: *add it
  up* (2 slides: one cluster's year, then the overrun) / III: *stop doing it by hand* (4
  slides: clusters from code, the peak, windows, the shared layer and its lake), then the
  close and the ask.
- **The peak:** `gates-ten`, slide 6 of 10 (60%). A Prometheus upgrade reaches the canary,
  its gate fails, and it rolls itself back before wave one starts. `overrun-ten` (slide 4)
  is the second high point.
- **The close:** slide 1 shows one person, two lit clusters and twenty-six dashed outlines
  in a row. Slide 9 is the same row, all twenty-eight lit, cut into test, canary and three
  waves by gates, with the same person at the head approving the wave.
- **Pacing:** 3 4 3 4 3 5 2 3 4 3. A breather (`change-windows-ten`) follows the peak.

### What was cut, and where it went

- `two-clusters`, `dr`, `eks`, `more-of-everything`, `ai-users`, `second-cloud`: six
  slides of one map → `estate-grows`, one slide with five builds. Their detail (lockstep
  DR, two runbooks, Mastercard's 30 EKS clusters, Salesforce's 1,000, multi-cloud as the
  norm) is in its notes. The opening scene became the title, `fleet-outgrows`.
- `one-runbook` + `tools-too` → `every-cluster-multiplies`. The six-command node runbook
  is spoken in the notes; the seeded version-skew grid is gone (it was illustrative and
  doubled the point); the ⚠️ release cadences are no longer on any slide.
- `waves` → folded into `gates-ten` (same ring geometry; ApplicationSet progressive sync,
  the `rollout-wave` label and Auto Mode's Karpenter are in the notes).
- `otel-common-layer` + `the-lake` → `one-layer-one-lake`.
- `overrun`, `kubeadm-past`, `gates`, `change-windows`, `same-person`, `the-ask`: kept as
  `-ten` forks, trimmed; `same-person-ten` and `the-ask-ten` redrawn (see Visual direction).

## Editorial notes

- **The toil numbers are an illustrative model, not our measurements.** Every slide that
  shows them says so (`overrun-ten`; the tool timing on `every-cluster-multiplies`).
  Inputs in `assets/toil-model.json`: 3 Kubernetes minors a year (fact); 12 h per kubeadm
  cluster per minor by hand; 6 h per managed cluster per minor; 4 upgrades a year per tool
  at 1.5 h per tool per cluster; 850 h a year of one person's time for upgrade work.
  Result by stage: 120 h → 180 → 306 → 678 → 1,188 → 1,620. One person is overrun at
  "+ AI"; a second person runs out at "+ 2nd cloud". **Replace with our real numbers
  before this goes beyond the team.** The ask's notes say so out loud.
- The estate's counts (28 clusters, 140 apps, 52 people, 40 agents) are illustrative like
  the model; they come from `theme/estate.js`.
- Series rule: **no failure-case references.** The failed canary is our illustration.
- kubeadm, stated honestly: Cluster API's default bootstrap and control-plane providers
  *are* kubeadm. The tool stays; the hands go.
- ⚠️ Auto Mode pricing and the extended-support fee (from the path decks) appear nowhere.
- ⚠️ The tool release cadences from `main`'s `tools-too` are not on any slide in this cut.
  `every-cluster-multiplies` shows four rollouts a year per tool (the model's input),
  placed at illustrative times and labelled so.
- Meta's ~100 clusters / ~15 engineers is in the `same-person-ten` notes as scale only, not
  as a ratio we match.

## Visual direction

Unchanged from `main` (see `narrative-main.md` for the full plan): the **Three Peaks**
series brand; night `#070b0e` ground, dusk for the dense or decisive slides, snowfield
`#e9f1f0` for two evidence slides; haze `#68b6c3` the fleet, mint `#9cf0e1` delivery,
teal `#36baa2` agents and AI; **alpenglow `#f4a261` only for the one person, the line where
his year runs out, the failed gate and the ask.** Barlow Condensed 600 headlines, Barlow
body, JetBrains Mono only for literal version strings. Margins 120 / 96. The background
range on every slide, peaks rising when the slide touches their path; survey lines for the
OTel layer.

What this cut adds:

- **The row of twenty-eight.** A new signature for the open and the close. Slide 1: the
  one person, two lit clusters (test and prod) and twenty-six dashed outlines running to
  the right margin. Slide 9: the same row, all lit mint, cut into test, canary, wave 1,
  wave 2 and prod (1 + 1 + 6 + 9 + 11 = 28, the same counts as the gate rings), a mint
  gate with a tick between each group, and an alpenglow gate where he stands.
- **One map, six states.** `estate-grows` stacks six renders of `Estate.draw` and shows
  one per build (CSS on `.at-N`; hidden states use `visibility: hidden` so the audit
  ignores them). A rail under the headline names the six steps with the same labels as
  the overrun chart's x-axis, so slide 4 reads as the sum of slide 2.
- **A cluster's year as five lanes.** `every-cluster-multiplies`: a Jan–Dec axis;
  Kubernetes as three 9 × 6 blocks (the same block `kubeadm-past-ten` collapses into a
  diff); four tool lanes with four mint marks each; "× 28" set at 230px as the focal point.
  Haze for cluster work, mint for tool work, the same split as the overrun's bars.
- **The overflow.** `overrun-ten` hatches, in alpenglow, the part of each bar above his
  line, and puts the climber mark at the line's start.
- **The peak, larger.** `gates-ten` rings run off the foot of the slide (deliberate bleed),
  with bigger gates and marks; same three-click choreography as `main`.
- **One flow into one lake.** `one-layer-one-lake`: two workload groups → the collector
  → Prometheus and Splunk (small, top right) and the tarn (the focal point, sky blue).
  Agents on the shore; an alpenglow dashed path back to the workloads, struck through.
- **The ask as a route.** Camps 1 and 2 lit in alpenglow and roped solid (today); 3 and 4
  open and dashed (then).

Grounds in order: night, night, dusk, night, snowfield, dusk (peak), snowfield, dusk,
night, dusk.

```
opening (fleet-outgrows)          peak (gates-ten)                  close (same-person-ten)
┌──────────────────────────┐     ┌──────────────────────────┐     ┌──────────────────────────┐
│ The fleet will outgrow   │     │ Platform tools roll out  │     │ Same person, fourteen…   │
│ one person with a        │     │ in waves…                │     │                          │
│ runbook.                 │     │   )  )  )   ✓ test       │     │ ☻| ▲|▲|▲▲▲▲▲▲|▲▲…|▲▲▲…  │
│ lede                     │     │ ▲|✓▲|✗ |  | ✗ canary     │     │   test canary w1  w2 prod│
│ ☻ ▲▲△△△△△△△△△△△△△△△△    │     │  ↺       )  )  ↺ back    │     │                          │
│ ___/\haze_________       │     │ ___/\mint___  gate list  │     │ __/\__/\__/\ survey____  │
└──────────────────────────┘     └──────────────────────────┘     └──────────────────────────┘
```

- **Motion moment:** unchanged: on `gates-ten`, test passes, the canary's gate fails
  (alpenglow), the version travels back. The map on `estate-grows` drops in each stage's
  new clusters as its click lands.
- **Audit exceptions, accepted:** `overrun-ten` (≈105 words, mostly axis ticks and bar
  totals), `gates-ten` (≈94: the run log and the four gates are the evidence),
  `kubeadm-past-ten` (93), `change-windows-ten` (83), `the-ask-ten` (79),
  `one-layer-one-lake` (74). Each is the evidence its headline needs; the notes carry the
  argument.

## Beats

### fleet-outgrows

- **Act:** I
- **Job:** title and cold open: state the claim, plant the one person and the row that will fill
- **Headline:** The fleet will outgrow one person with a runbook.
- **Visual:** the claim at hero size. Below it, one row: the climber in alpenglow, two lit
  clusters (test and prod), twenty-six dashed outlines running to the right margin, "28 by
  the end of this story"
- **Energy:** 3
- **Into next:** here's how it grows.

### estate-grows

- **Act:** I
- **Job:** six reasonable growth steps, each obvious on its own, adding up to 28 clusters and one person
- **Headline:** Six reasonable steps turned two clusters into twenty-eight. One person still upgrades them.
- **Visual:** the estate map from `main`, one slide, five clicks: day one → + DR → + EKS →
  + teams → + AI → + 2nd cloud. New clusters drop in coloured; earlier ones grey. The
  census in the corner climbs to 28 clusters, 140 apps, 52 people, 40 agents; a rail
  under the headline lights the current step
- **Energy:** 4
- **Into next:** so what does one upgrade actually cost him?
- **Source:** GOALS §0 claim 2 (Mastercard: an LLM drives 30 EKS clusters; Salesforce: 1,000
  clusters under agentic AIOps); GOALS §0.1 (multi-provider is the norm at scale)

### every-cluster-multiplies

- **Act:** II
- **Job:** make the per-cluster work concrete, and show that every new cluster brings all of it again
- **Headline:** Every cluster carries five release trains, and each stop is done by hand.
- **Visual:** one cluster's year on a Jan–Dec axis. Kubernetes: three 54-step blocks (April,
  August, December), "kubeadm can't skip a minor". Argo CD, Prometheus, splunk-otel,
  Karpenter: four mint rollouts each, at times that line up with nothing. On the right,
  "× 28 clusters". Tool timing labelled illustrative
- **Energy:** 3
- **Into next:** so add it all up, and put it against one person's year.
- **Source:** kubeadm upgrade docs (skipping minors is unsupported); Kubernetes ships three
  minors a year; tool rollouts per the model's input

### overrun-ten

- **Act:** II
- **Job:** the turn: the work outgrows the person, and hiring only buys a stage
- **Headline:** Keep doing it this way, and one person's year runs out at the AI stage.
- **Visual:** stacked bars per stage (clusters haze, tools mint) against his 850 h line; the
  part of each bar above the line hatched in alpenglow. Click: a second person's line at
  1,700 h. Marked "Illustrative model, not our measurements"
- **Energy:** 4
- **Into next:** so what do the people with three hundred clusters do?
- **Data:** illustrative model, see Editorial notes

### kubeadm-past-ten

- **Act:** III
- **Job:** retire hand-run kubeadm, honestly: the tool stays, the hands go
- **Headline:** kubeadm by hand is the past: the fleets on stage rebuild clusters from code.
- **Visual:** the 54-step block from slide 3 collapses into a two-line version diff in a
  pull request. Two routes: Cluster API on-prem (still kubeadm underneath), EKS Auto Mode in
  AWS (Karpenter comes with it). Evidence line: LinkedIn (300 clusters, KEP-4330, six fleet
  waves to one), NVIDIA (~5,600 nodes in 30 minutes)
- **Energy:** 3
- **Into next:** that's the clusters. The tools on them need the same treatment.
- **Source:** LinkedIn KEP-4330 talk; NVIDIA fleet node changes; `EKS-VS-ECS.md` §4 rules 1–2

### gates-ten

- **Act:** III
- **Job:** the peak: tools roll out in waves, and automated gates and rollback make the waves safe to leave alone
- **Headline:** Platform tools roll out in waves, and a failed gate rolls itself back.
- **Visual:** half-rings rippling right from the test cluster (canary, wave 1, wave 2, prod)
  and running off the slide; a gate between each ring. Three clicks: test passes (mint ✓),
  the canary's gate fails (alpenglow ✗), the canary rolls back by itself; the prod rings
  stay grey. Right: the run log, and one gate per tool (Argo CD, Prometheus, splunk-otel,
  Karpenter)
- **Energy:** 5
- **Into next:** and the pipeline also needs to know when not to run at all.
- **Source:** GOALS §1.4 (ApplicationSets, progressive sync), §1.7; LinkedIn canary pipeline
  (Argo CD PostSync Job: exit 0 advances, exit 1 fails; ~1 week → ~1 hour per release)

### change-windows-ten

- **Act:** III
- **Job:** time gating: freezes enforced by policy, not by a person; the breather after the peak
- **Headline:** Nothing rolls during a freeze, because the window is a policy, not a promise.
- **Visual:** a week as a strip of hours, frozen hours hatched; wave 1 Tuesday, wave 2
  Wednesday, prod starts Thursday, pauses at the window's edge and resumes Monday. Two
  locks: Argo CD sync windows, Kyverno reading the same window
- **Energy:** 2
- **Into next:** one more layer runs on every cluster we just rolled to.
- **Source:** GOALS §2.3; `GOALS-GAPS.md` §1.1 + §2.3; NVIDIA maintenance scheduler; Agility
  Robotics (admission gate on top of sync windows)

### one-layer-one-lake

- **Act:** III
- **Job:** reframe OTel as the layer classic and AI workloads share, and land its data where agents can only read
- **Headline:** Classic and AI workloads share one OTel layer, and agents only read its lake.
- **Visual:** classic (haze) and AI (teal) workloads flow into one collector on every
  cluster (stamps cluster, namespace, team); a thin line out to Prometheus and Splunk,
  which stay as backends; a stream into the tarn, "one lake, read-only", agents on its
  shore, and an alpenglow dashed path back to the workloads struck through: no write path
  back to prod. The honest limit, small: a lake is a snapshot; a gate mid-rollout reads live
  metrics through one narrow tool
- **Energy:** 3
- **Into next:** so here's the same person, with the same fleet.
- **Source:** GOALS §4.2, §7; *Seeing Inside LLM Inference* (IBM, JPMorgan Chase); *No RAG,
  No Regrets* (Mastercard, the counter-argument); *Beyond Dashboards* (NVIDIA, Workday)

### same-person-ten

- **Act:** III
- **Job:** close: echo the opening row, changed
- **Headline:** Same person, fourteen times the clusters: now he approves waves, and the pipeline runs them.
- **Visual:** the row from slide 1, all 28 lit mint, cut by gates into test, canary, wave
  1, wave 2 and prod; the same climber at the head of the line behind an alpenglow gate,
  "one person approves"
- **Energy:** 4
- **Into next:** here's what gets us there.

### the-ask-ten

- **Act:** III
- **Job:** the ask, small enough to say yes to in the room
- **Headline:** Stop building clusters by hand, and put one tool through the pipeline this quarter.
- **Visual:** a route of four camps. 1 and 2 lit in alpenglow and roped solid, set large:
  no new hand-built clusters; splunk-otel-collector through the pipeline this quarter.
  3 and 4 open and dashed, smaller: change windows as policy; the OTel collector on every
  cluster, feeding the read-only lake
- **Energy:** 3
- **Into next:** end
