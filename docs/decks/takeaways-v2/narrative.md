# Takeaways v2: the fleet outgrows one person

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Started 2026-11-17. A second take on the takeaways. `ten-takeaways` is ten separate rules,
each in its own visual world. This deck tells one story instead: a small team's estate grows
one step at a time until a single person's upgrade runbook can't keep up. Then it shows
what the fleets at KubeCon do instead. Sources: GOALS §0, §1.4, §1.7, §2.3, §4.2, §5.2;
`EKS-VS-ECS.md` §4; `GOALS-GAPS.md` §1.1 + §2.3.

## Brief

- **Audience:** engineering, leads included: the people who run the clusters and the people
  who decide what that team works on. Most of them have never seen an upgrade from the
  inside; the platform team has done every one.
- **Setting:** live, about 15 minutes, then sent round. The notes carry the full argument
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
  with gates and auto-rollback this quarter, then Argo CD, Prometheus and Karpenter;
  (3) change windows as a policy that Argo CD and Kyverno both read; (4) the OTel collector
  as the standard telemetry layer on every cluster, AI workloads included, feeding one
  read-only lake the agents read instead of holding production credentials.

## Shape

- **Structure:** chronicle with a turn. The audience watches the estate grow one step at a
  time (two clusters, DR, EKS, more teams, AI, a second cloud), each step reasonable on
  its own, until the upgrade work no longer fits in one person's year. The turn is that
  chart. After it, the story becomes what the large fleets do instead. A chronicle suits
  this room because everyone has lived some of these steps and nobody has added them up.
- **Acts:** I: *watch it grow* (6 slides, fast, about 3 minutes; one map that gains a
  piece per slide) / II: *add it up* (3 slides: the runbook, the tools, the overrun) /
  III: *stop doing it by hand* (6 slides: kubeadm's place, waves, gates, windows, OTel,
  the lake), then the close and the ask.
- **The peak:** `gates`, slide 12 of 17 (71%). A Prometheus upgrade reaches the canary
  cluster, its gate fails, and it rolls itself back before the prod wave starts. Nobody
  was paged. Everything in Act III builds to that moment. `overrun` (slide 9) is the
  second high point: the problem at its sharpest, followed by two quieter slides.
- **The close:** the deck opens on one person and two clusters. It closes on the same
  person and the fleet from slide 6, fourteen times the size. This time he stands at the
  pipeline's gate rather than at each cluster.

## Editorial notes

- **The toil numbers are an illustrative model, not our measurements.** Every slide that
  shows them says so. Inputs (in `assets/toil-model.json` once built): 3 Kubernetes minors
  a year (fact); 12 h per kubeadm cluster per minor by hand; 6 h per managed cluster per
  minor; 4 upgrades a year per tool at 1.5 h per tool per cluster; 850 h a year of one
  person's time for upgrade work. Result by stage: 120 h → 180 → 306 → 678 → 1,188 →
  1,620. One person is overrun at "+ AI"; a second person runs out at "+ 2nd cloud".
  From "+ AI" on, tool rollouts cost more than cluster upgrades. **Replace with our real
  numbers before this goes beyond the team.**
- Series rule: **no failure-case references** (no 39-cluster cascade). The gate slide's
  failed canary is our own illustration, not someone's incident.
- kubeadm, stated honestly: Cluster API's default bootstrap and control-plane providers
  *are* kubeadm. What's past is a person running it node by node. The tool stays; the
  hands go.
- EKS Auto Mode runs Karpenter as a managed component, so on Auto Mode clusters Karpenter
  drops off our rollout list. Say this on `waves`: the cheapest rollout is one AWS does.
- ⚠️ Carried from the path decks: Auto Mode pricing and the extended-support fee come from
  third-party write-ups. Neither appears on a slide here.

## Visual direction

Series brand: **Three Peaks** (`docs/decks/_shared/`; full palette and type in the
readout's narrative), kept at the user's request. Path colours keep their series meaning:
mint = delivery (Path 1), teal = agents (Path 2), haze = fleet (Path 3).

- **Subject world:** the estate, meaning where our clusters actually live, drawn as a map:
  zones for on-prem, AWS and a second cloud, each holding cluster glyphs. Around it, the
  things the person who runs it handles: a runbook, release trains, version numbers,
  rollout rings, gates, a week planner with frozen hours.
- **Palette (brand, with this deck's roles):** night `#070b0e` ground · snow `#e8f4f2` ink ·
  lichen `#9fb4b6` muted text · haze `#68b6c3` the fleet, which is most of the deck · mint
  `#9cf0e1` delivery: waves, gates, windows · teal `#36baa2` agents and AI workloads ·
  **alpenglow `#f4a261`, the one warm accent: the one person, the line where his year runs
  out, the failed gate, the ask.** Snowfield `#e9f1f0` with slate `#0f1e29` ink for the
  evidence slides.
- **Type:** Barlow Condensed 600 for headlines; Barlow 400/500 for body; JetBrains Mono only
  for literal version strings and commands.
- **Signature 1, for the series: the range in the background.** The three peaks sit on the
  horizon in the same place on every slide (fleet left, delivery centre, agents right), in
  the order the readout uses. A peak **emerges** (rises about 190px and shows its coloured
  cap) only when the slide's topic touches its path. The others stay sunk as dark
  silhouettes. Drawn by `theme/range.js`: `Range.draw('#range', {touch: ['p3'], bands})`.
- **Three peaks plus a survey layer, not four peaks.** The user offered a fourth peak. OTel
  touches every path, so a fourth summit would make observability a separate climb, which
  contradicts the slide's claim. Instead it is drawn as **survey lines**: level bands that
  cross all three peaks at the same heights, one measurement for the whole range. They
  appear on `otel-common-layer`, `the-lake`, `same-person` and `the-ask`, and nowhere else.
- **The data lake is a tarn,** a mountain lake at the foot of the range, fed by a stream
  from each peak (fleet state and metrics, delivery events, agent traces). Agents stand on
  its shore and read; nothing runs from the shore back up the slopes, because agents hold
  no production credentials. Added 2026-11-17 at the user's suggestion.
- **Signature 2, this deck: the estate map that grows.** Drawn by `theme/estate.js` from one
  table of clusters, so slides 1–6 show the same frame with the same positions, one step
  later each time. Things new in this step are in colour; earlier ones go grey. The map
  comes back as rollout rings on `waves` and `gates`, and whole at the close.
- **Concepts as pictures:** a cluster is a small peak glyph (series convention); a person
  is the climber mark; **the one person is the climber in alpenglow**; an agent is a teal
  diamond; lockstep is a tie line between two glyphs; a runbook is a chain of small step
  blocks, one per node action; version skew is a grid of version cells, with stale ones
  hollow; work is hours stacked against the line of his year; waves are rings around the
  test cluster; a gate is a bar across a ring; a change window is shaded hours on a week
  strip.
- **Layout:** margins 120 / 96, left-aligned. Headline top-left, at most two lines. The
  picture fills the band from about y 300 to y 900; the range sits behind it on the bottom
  edge. Grounds: night for Act I (one map, so one ground), then alternating: dusk
  `one-runbook`, snowfield `tools-too`, night `overrun`, snowfield `kubeadm-past`, night
  `waves`, dusk `gates` (the peak gets its own ground), snowfield `change-windows`, night `otel-common-layer`, dusk
  `the-lake`, night `same-person`, dusk `the-ask`.

  ```
  opening (two-clusters)            densest (overrun)                 peak (gates)
  ┌──────────────────────────┐     ┌──────────────────────────┐     ┌──────────────────────────┐
  │ We started with two      │     │ Keep doing it this way…  │     │ Every wave passes its    │
  │ clusters…                │     │            ▇ ▇  ── 2 ppl │     │ tool's gate…             │
  │ ┌on-prem┐                │     │ ── 1 person ▇ ▇          │     │   ◯ prod  ◯ w2  ◯ w1     │
  │ │▲ ▲    │                │     │      ▃ ▅ ▇ ▇ ▇           │     │   ◯ canary ✗ ← rollback  │
  │ └───────┘  ☻(runbook)    │     │  ▁ ▂ ▃ ▅ ▇ ▇  illustr.   │     │   ● test ✓    gate list  │
  │ 2 clusters  3 apps  6 ppl│     │ day1 DR EKS teams AI 2nd │     │                          │
  │ ___/\haze_________       │     │ ___/\___                 │     │ ________/\mint___        │
  └──────────────────────────┘     └──────────────────────────┘     └──────────────────────────┘
  ```
- **Motion moment:** on `gates`, a new Prometheus version passes the test cluster, reaches
  the canary ring, fails its gate (the gate turns alpenglow), and travels back by itself.
  The prod rings never light. Three clicks.
- **Anti-default check, and what changed:**
  - *A map of boxes and arrows* is the default way to draw an estate. Changed: no arrows
    until slide 6 (apps moving), zones as quiet outlines, and the counts are real glyphs,
    one per cluster and one per person, not numbers in boxes.
  - *A stat-card for the toil number:* the overrun is a chart whose bars cross a person,
    not a big "1,620 h" card.
  - *A logo wall of tools:* the four tools appear as a version grid (their skew is the
    point) and as gates (their health checks are the point), never as logos.
  - *A fourth summit for OTel:* replaced by survey lines across all three peaks, as above.
  - *A database cylinder labelled "Data Lake":* replaced by the tarn, which also says
    where it sits (downstream of everything) and that it's read from the shore.
  - No eyebrows, act labels, page numbers or deck title in the chrome; the background
    range is the only element on every slide.

- **Key-frame notes (2026-11-17):**
  - The range sits low (peak height 440, summits at y 800–880) with caps at half opacity,
    and the summits are set right of the text column (fleet x 700, delivery x 1270, agents
    x 1750). The first version put the fleet cap behind the census line, where it
    competed with the subject. Slides keep their right-hand copy above y ≈ 790 so the
    delivery cap stays clear.
  - `gates` first used full concentric rings with the action crammed in the middle and
    callouts far from their marks. It now uses half-rings rippling right, a three-line run
    log that builds with the clicks, and a compact gate list. `waves` should reuse the
    same ripple geometry, since the two slides are deliberately parallel.
  - `overrun`: haze (clusters) and mint (tools) fail the dataviz validator's generic
    lightness and chroma checks, because the brand is soft by design, but pass both
    separation checks (ΔE 17, normal and CVD). Accepted, with direct labels beside the last
    bar as the legend. Columns are 76px, not the 24px dashboard cap, for a projected room.
- **Audit exceptions, accepted:** `gates` (90 words) and `overrun` (110) are the peak and
  the densest evidence slide; the extra words are the gate list and the model's inputs.

## Beats

### two-clusters

- **Act:** I
- **Job:** cold open: a calm, familiar scene that plants the one-person thread
- **Headline:** We started with two clusters, test and prod, and one person who upgrades them.
- **Visual:** the estate map, almost empty: two cluster glyphs labelled test and prod, a
  handful of team members, and one figure standing beside the clusters holding the runbook.
  The map's frame (its regions, its legend) is drawn but mostly empty, so the room can see
  there's space to fill
- **Energy:** 3
- **Into next:** then prod became important enough to need a twin.

### dr

- **Act:** I
- **Job:** the first multiplication: DR is a cluster that has to stay identical to prod
- **Headline:** DR made it three, and the third has to match prod version for version.
- **Visual:** the same map; a DR cluster appears beside prod, joined by a lockstep line.
  The runbook figure now has three clusters to visit
- **Energy:** 2
- **Into next:** then we moved into AWS.

### eks

- **Act:** I
- **Job:** the fleet stops being one kind of cluster
- **Headline:** EKS arrived, so now we upgrade two kinds of cluster two different ways.
- **Visual:** an AWS region opens on the map with three EKS clusters; the on-prem clusters
  keep their kubeadm mark, the EKS ones get theirs. Two runbooks now
- **Energy:** 3
- **Into next:** and once EKS made clusters easy to get, everyone wanted one.

### more-of-everything

- **Act:** I
- **Job:** growth on three axes at once: teams, apps, clusters
- **Headline:** Every new team brought apps, users and, usually, another cluster.
- **Visual:** the map fills: 14 clusters, app dots inside each, user glyphs around the
  edge. Three small counters (teams, apps, clusters) all climbing
- **Energy:** 3
- **Into next:** and then some of the users stopped being people.

### ai-users

- **Act:** I
- **Job:** AI arrives as a workload and as a user class
- **Headline:** Then AI showed up, as workloads on our nodes and as users of our API.
- **Visual:** among the user glyphs, new agent glyphs in a different shape: calling the API
  server, opening PRs, reading metrics. GPU clusters join the map. The counters keep
  climbing
- **Energy:** 4
- **Into next:** and the more we depended on one provider, the more its bad day became ours.
- **Source:** GOALS §0 claim 2; Mastercard (an LLM drives 30 EKS clusters), Salesforce
  (1,000 clusters under agentic AIOps)

### second-cloud

- **Act:** I
- **Job:** the last growth step: a second provider, and apps on the move
- **Headline:** One provider's outage can't be our outage, so a second cloud joined.
- **Visual:** a second provider region opens at the map's edge; arrows show apps moving
  from on-prem and AWS into it. The map is now full: 28 clusters across three kinds of
  place. Pull back to show the whole thing
- **Energy:** 3
- **Into next:** six reasonable steps. Now look at what one upgrade costs.
- **Source:** GOALS §0.1 (multi-provider is the norm at scale: GEICO, Uber, Meta, LinkedIn)

### one-runbook

- **Act:** II
- **Job:** make the cost of one kubeadm upgrade concrete, and why it repeats
- **Headline:** kubeadm upgrades one node and one minor at a time, three times a year.
- **Visual:** the runbook as a timeline for a single cluster: control-plane nodes one by
  one, then each worker (drain, upgrade kubeadm, kubelet, kubectl, restart, uncordon) as a
  long chain of small steps. Below it, three copies of the chain for the year's three
  minors, because kubeadm can't skip one
- **Energy:** 3
- **Into next:** and the clusters are the small part.
- **Source:** kubeadm upgrade docs (skipping minor versions is unsupported); Kubernetes
  ships three minors a year

### tools-too

- **Act:** II
- **Job:** the multiplication nobody budgets: every cluster carries platform tools
- **Headline:** Each cluster also carries four platform tools, each on its own release train.
- **Visual:** a grid: clusters down the side, the four tools across the top, each cell
  showing the version that cluster runs. The versions drift: some current, some two
  behind, a few unknown. This is the skew that hand rollouts leave behind
- **Energy:** 3
- **Into next:** add the clusters and the tools together and put them against one person's year.

### overrun

- **Act:** II
- **Job:** the turn: the work outgrows the person, and hiring only buys a stage
- **Headline:** Keep doing it this way, and one person's year runs out at the AI stage.
- **Visual:** a stacked bar per growth stage (cluster upgrades and tool rollouts), against
  a flat line for one person's upgrade hours. The bars cross the line at "+ AI". Click: a
  second person's line appears and the bars cross it one stage later. Tools become the
  larger share of each bar from "+ AI" on. Marked "illustrative model"
- **Energy:** 4
- **Into next:** so what do the people with 300 clusters do?
- **Data:** illustrative model, see Editorial notes

### kubeadm-past

- **Act:** III
- **Job:** retire hand-run kubeadm, honestly: the tool stays, the hands go
- **Headline:** kubeadm by hand is the past: the fleets on stage rebuild clusters from code.
- **Visual:** the runbook chain from `one-runbook` collapses into a single declarative
  object. Two routes: EKS (managed control plane, Auto Mode replaces nodes) and on-prem
  (Cluster API, which still drives kubeadm under the hood but replaces machines rather
  than patching them). One line of evidence: LinkedIn's three-minor cadence went from six
  fleet waves to one with skip-level upgrades (KEP-4330)
- **Energy:** 3
- **Into next:** that's the clusters. The tools on them need the same treatment.
- **Source:** LinkedIn KEP-4330 talk; Cluster API primer (Mirantis); Nutanix CAREN;
  NVIDIA (~5,600 nodes converged in 30 minutes); `EKS-VS-ECS.md` §4 rules 1–2

### waves

- **Act:** III
- **Job:** platform tools ship like apps: one definition, rolled out in waves
- **Headline:** Platform tools ship like apps: test first, then a canary cluster, then prod in waves.
- **Visual:** the estate map from Act I rearranged into rings: test at the centre, one
  canary cluster, then wave 1, wave 2, prod. One tool version travels outward ring by
  ring. Karpenter greys out on Auto Mode clusters: AWS rolls that one
- **Energy:** 3
- **Into next:** and a ring only advances when the tool proves itself.
- **Source:** GOALS §1.4 (ApplicationSets with progressive sync); LinkedIn's canary
  pipeline for cluster services (a week of manual testing per release cut to about an hour)

### gates

- **Act:** III
- **Job:** the peak: automated gates and rollback make the waves safe to leave alone
- **Headline:** Every wave passes its tool's gate, and a failed gate rolls itself back.
- **Visual:** the rings again. A Prometheus upgrade reaches the canary cluster; its gate
  (targets up, rule evaluation clean, no dropped samples) turns red; the version rolls
  back on its own, and the prod rings never see it. Beside it, one gate per tool: Argo CD
  (apps Synced and Healthy), Prometheus (targets and rules), splunk-otel (export success,
  nothing dropped), Karpenter (pending pods get nodes)
- **Energy:** 5
- **Into next:** and the pipeline knows when not to run at all.
- **Source:** LinkedIn canary pipeline (an Argo CD PostSync Job: exit 0 advances, exit 1
  fails the sync); GOALS §1.7 ("a canary without automated analysis and rollback is just a
  slower outage")

### change-windows

- **Act:** III
- **Job:** time gating: freezes and business windows enforced by policy, not by a person
- **Headline:** Nothing rolls during a freeze, because the window is a policy, not a promise.
- **Visual:** a week as a strip of hours with blocked windows shaded; a wave runs, pauses
  at the window's edge, and resumes after it. Two locks on the same window: Argo CD sync
  windows stop the pipeline, Kyverno stops everything else (kubectl, operators, agents)
- **Energy:** 2
- **Into next:** one more layer runs on every cluster we just rolled to, and it's the one
  that sees both kinds of workload.
- **Source:** GOALS §2.3; `GOALS-GAPS.md` §1.1 + §2.3; NVIDIA's maintenance scheduler
  (factors in business-critical windows); Agility Robotics (an admission gate on top of sync
  windows)

### otel-common-layer

- **Act:** III
- **Job:** reframe OTel: a common layer between classic and AI workloads, not Prometheus's replacement
- **Headline:** OTel isn't beating Prometheus; it's the one layer our classic and AI workloads share.
- **Visual:** two kinds of workload on the left: classic (services, jobs, Prometheus
  metrics, logs) and AI (model servers, agents: tokens, tool calls, GenAI semantic
  conventions). Both flow into one collector layer on every cluster (the
  splunk-otel-collector we already roll out), which stamps the same cluster, namespace and
  team on everything. Out the right: Prometheus, Splunk, Jaeger, and agents reading
  through the same layer. Prometheus stays in the picture, as a backend
- **Energy:** 3
- **Into next:** and everything that layer collects has to land somewhere the agents can read.
- **Source:** GOALS §4.2; *The Race to Standardize AI Observability* (Google, Microsoft);
  *Seeing Inside LLM Inference* (IBM, JPMorgan Chase: vLLM emits OTel *and* is scraped by
  Prometheus); *Beyond Dashboards* (NVIDIA, Workday: OTel → MCP → agents); *OTel
  Blueprints* (Cisco Splunk, New Relic)

### the-lake

- **Act:** III
- **Job:** AI makes decisions from data: give it one read-only lake, not credentials to prod
- **Headline:** Agents decide from a read-only lake, not from credentials to production.
- **Visual:** the tarn at the foot of the range, fed by three streams: from the fleet peak
  (cluster state snapshots, metrics), from the delivery peak (syncs, rollouts, gate
  results), from the agents peak (traces, token and tool-call spans). On the shore, teal
  agent diamonds, each with the decision it makes from the lake: triage this alert, judge
  this canary, pick the quiet hour for this upgrade. No line runs from the shore back up a
  slope. One small honest line underneath: a lake is a snapshot, fine for triage and
  trends; a gate mid-rollout reads live metrics through a narrow tool
- **Energy:** 3
- **Into next:** so here's the same person, with the same fleet.
- **Source:** GOALS §7 (dump cluster state to a database; read-only extraction is a
  security control); *One Recipe, Five Clouds, One Query* (NVIDIA, Upbound: a queryable
  audit layer); *Beyond Dashboards* (NVIDIA, Workday: raw OTel fails with LLMs, so put a
  typed query layer over it); the counter-argument, *No RAG, No Regrets* (Mastercard: live
  APIs through narrow audited tools rather than a stale index)

### same-person

- **Act:** III
- **Job:** close: echo the opening, changed
- **Headline:** Same person, fourteen times the clusters: now he approves waves, and the pipeline runs them.
- **Visual:** the full estate map from `second-cloud`, and the one figure from slide 1, no
  longer beside the clusters but at the pipeline's gate. The overrun chart's last bar,
  small, redrawn under the automated line
- **Energy:** 4
- **Into next:** four things get us there.

### the-ask

- **Act:** III
- **Job:** the ask, small enough to say yes to in the room
- **Headline:** Stop building clusters by hand, and put one tool through the pipeline this quarter.
- **Visual:** four lines, one per decision, each tied to the slide that argued it: no new
  hand-built kubeadm clusters; splunk-otel-collector through waves, gates and rollback
  first; change windows as policy; the OTel collector on every cluster, feeding the
  read-only lake
- **Energy:** 3
- **Into next:** end
