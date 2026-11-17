# Takeaways v3: the fleet outgrows one team, then the agents arrive

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Started 2026-11-17, from `takeaways-v2` (which stays as it is). What changed, at the
user's direction:
- **Our own starting estate:** dev, staging, ny4, and ch4 as ny4's DR, all on-prem; then
  EKS for dev, qa and ftb; a second exchange doubles on-prem; the cloud migration lands
  AWS clusters in chunks; multi-region resilience adds a second AWS region; and,
  "fingers crossed for no AWS outage", a second cloud.
- **No agents in the first half.** AI arrives only after the fleet problems are solved.
- **Twenty tools, and Karmada** get their own act: the four platform tools were a demo;
  the real platform runs twenty self-hosted tools (ceph, rook, vault-operator, external
  secrets, grafana, thanos, istio/ALB, kafka-ui, file-viewer and more), with the numbers
  side by side. Then Karmada as the option that lets developers think only in
  constraints, routing work between clusters and regions as they change. Then the point:
  a developer knows no cluster, and a merged PR plus a change record handle the rest.
- **A second half on AI:** AI lands on the on-prem dev clusters, then AWS; autonomous
  agents on elastic compute; sandboxing (gVisor, Kata); building infra through MCP tools
  (Obot, ToolHive, or our own); credentials kept out of the agent; Kyverno as a
  cross-cutting policy layer for people and agents alike; one view from OTel, logs,
  Prometheus and state dumps; the lake; AI resizing pods from the lake's signals; and the
  AI rollout phases.
- **North star over practice.** This deck may go further than GOALS (Karmada, aggressive
  AI resizing, the upper camps of the AI ladder). That's deliberate: it shows where we're
  heading, not only what we've decided. Facts still carry ⚠️ until checked.

Sources: GOALS §0, §1.4, §1.7, §2, §3.1, §3.5, §3.6, §4.2, §5.1, §5.2, §6, §7, §9;
`GOALS-GAPS.md` §1.1 + §2.3, §3.5; `EKS-VS-ECS.md` §4; `CLAUDE-AGENT-PLATFORM.md`.

## Brief

- **Audience:** engineering, leads included: the people who run the clusters, the people
  who will run agents, and the people who decide what both teams work on.
- **Setting:** live, about 32 minutes in two halves (fleet, then agents), then sent round.
  The notes carry the full argument for readers.
- **They believe now:** cluster and app upgrades are routine work one experienced team
  handles. Putting
  apps across clouds is a deployment detail. AI is a separate initiative, and its risks
  are mostly about the model.
- **They believe after:** the fleet's work grows faster than the fleet, so clusters and
  platform tools roll out like software (in waves, behind gates, inside windows), and
  work is placed by constraints across clusters, regions and clouds, so developers never
  pick a cluster. Agents are a new kind of user that spawns on
  demand, so they arrive sandboxed, with short-lived identity, through one tool gateway,
  under the same policy and telemetry as people. We climb the AI ladder one camp at a time.
- **The one sentence:** the fleet will outgrow one team with a runbook, and agents will
  outgrow trust by default, so clusters, tools, apps and agents all go through one
  automated path with gates, policy and telemetry.
- **The ask:** (1) no new hand-built clusters; (2) splunk-otel-collector through the wave
  pipeline this quarter; (3) a Karmada spike: one app placed by constraints across both
  regions and the second cloud; (4) agents get a sandbox, a gateway, short-lived identity and
  Kyverno before stage 1; (5) alert triage (AI stage 1) by Q2 2027.

## Shape

- **Structure:** chronicle with a turn, told twice. The first half watches the estate
  grow until one team's year runs out, then fixes the clusters, the tools and the app
  placement in turn. The second half returns to the same map, adds AI, and builds the
  safety around it before climbing.
- **Acts:**
  - Open (1): the title, "KubeCon 2027 north star: managing our fleet at scale."
  - I: *watch it grow* (6): four clusters → three clouds, apps and pods climbing, still one
    team.
  - II: *add it up* (3): the runbook, the tools, the overrun.
  - III: *stop doing it by hand* (4): kubeadm's place, waves, gates, windows.
  - IV: *at real size* (4): twenty tools, Karmada constraints, Karmada failover, no
    cluster names.
  - V: *the agents arrive* (6): AI on the map, elastic agents, sandbox, MCP tools,
    credentials, policy.
  - VI: *see it, then climb* (4): one view, the lake, AI resizing, the AI phases.
  - Close (2): the same person; the ask.
- **The peak:** `karmada`, slide 17 of 30 (57%). Slide 6 says "fingers crossed for no AWS
  outage". Here a region fails and the work shifts to the other region, then AWS fails and
  it shifts to the second cloud, by the developer's constraints, without a person. It pays
  off the setup; `no-cluster-names` is the release after it, closing the first half.
  `gates` (12) and `ai-phases` (27) are the secondary highs, with `twenty-tools` (14) the run-up to the peak.
- **The close:** the deck opens on four clusters and one team. It closes on the same map,
  eight times the size, with agents on it. The same team approves waves, while the
  pipeline, the policy layer and the telemetry do the rest.

## Editorial notes

- **One team, not one person (user, 2026-11-17).** One team of three owns cluster *and* app
  upgrades; it's drawn as three climbers roped together. The toil model now includes app
  upgrades: 6 a year per app placement at 0.5 h each by hand, plus the cluster and tool
  hours below. Apps and pods by stage: 20 / 640 → 20 / 1,120 → 32 / 1,504 → 50 / 2,320 →
  50 / 3,040 → 65 / 4,000 → (AI) 80 / 4,800; pods = app placements × 8 replicas.
  Hours by stage: 480 → 786 → 1,170 → 1,728 → 2,250 → 2,862 → (AI) 4,056. The team's
  year (3 × 850 = 2,550 h) runs out at the second cloud; a fourth hire (3,400 h) holds
  until AI. Team size is our assumption; replace it.
- **The toil and placement numbers are illustrative models, not our measurements.**
  Toil inputs are the same as v2 (12 h per kubeadm cluster per minor, 6 h per managed
  cluster, three minors a year, 4 tools upgraded 4 times a year at 1.5 h per cluster,
  850 h of one person's year). *Superseded by the one-team note above;* the cluster-and-tool
  hours alone by stage: 240 → 366 → 606 → 858 → 1,110 → 1,362; one
  person is overrun at the migration. A second person holds until AI arrives (2,256 with
  three AI clusters and four more tools: AI gateway, MCP gateway, sandbox runtime, agent
  controller). **Twenty tools** (same rollout inputs): 12 on every cluster (argo-cd,
  prometheus, splunk-otel, external-secrets, thanos, istio/ALB, cert-manager, kyverno,
  velero, reloader, argo-rollouts, keda), ceph and rook on the 8 on-prem clusters,
  karpenter and external-dns on the 21 cloud clusters, and vault-operator, grafana,
  kafka-ui and file-viewer on 3 each. 4 tools → 116 installs, 464 rollouts a year, 696 h
  (0.8 people); 20 tools → 418, 1,672, 2,508 h (2.95 people). Through the pipeline, 20
  tools × 4 releases = 80 wave approvals a year. The eight tools after the user's list
  are our fill-in from GOALS; swap in the real list. **Replace with real numbers before
  this goes beyond the team.**
- **Karmada is shown as the north-star option,** not reconciled with GOALS §5.1 (where it
  is ⚪ Watch and reserved for workloads that can't run active/active). The slides present
  it as the option that lets developers think only in constraints and that routes work
  between clusters, regions and clouds as they change. The practical caveat (static
  placement is already ApplicationSet label selectors; Karmada is one more control plane
  to run) lives in the notes, not the headline. ⚠️ Check the PropagationPolicy snippet
  (`placement.clusterAffinities`, `affinityName`, `labelSelector`, `spreadConstraints`)
  against the Karmada docs before it goes on a shared slide.
- **MCP gateway:** GOALS-GAPS §3.5's line stands: decide the enforcement point first.
  Obot is open-core with directory-managed permissions; ToolHive (Stacklok) is OSS and
  pairs with the Cedar analysis work; building our own is a thin proxy plus everything
  they already do. A bake-off, not a default.
- **Credentials:** the patterns come from GOALS §3.6 and §9. No vendor is recommended
  for the secret store (§9 is still 🔵 Decide).
- **AI phases:** the dates are GOALS §6's committed targets (stage 1 by Q2 2027, stage 2
  by end of 2027). Stages 3+ are the north star: undated, described as where we're
  heading, each with the safety gate it needs.
- **AI resizing:** the chart is illustrative. ⚠️ In-place pod resize: the Solo.io
  abstract says GA in 1.33, which conflicts with our memory of a later GA. The slide
  says "in-place resize, no restart" and names no version until checked.
- **Hertz numbers aren't available.** The Hertz demo posted no slides (no slides_url, not
  in MANIFEST.csv), and no public Hertz or CAST AI case study turned up. At the user's
  request the slide keeps the 61% and labels it illustrative, "the pattern Hertz showed",
  stating that 61% is our model, not Hertz's figure. Hertz's 80 EKS clusters is from the
  room (⚠️, as GOALS §0.1).
- Series rule: **no failure-case references.** The region and AWS outages on `karmada`
  and the failed canary on `gates` are our own illustrations.
- kubeadm, stated honestly (from v2): Cluster API still runs kubeadm underneath; the
  hands go, not the tool. EKS Auto Mode runs Karpenter itself.
- ⚠️ `tools-too` release cadences are approximate (see v2's note).
- ny4, ch4, dev, staging, qa, ftb are the user's names for our clusters. The second
  exchange's clusters are unnamed until the user gives names.

## Visual direction

Carried over from `takeaways-v2` (approved there): Three Peaks brand; the background range
whose peaks emerge per topic, with each path's word at its base; survey lines for OTel;
the estate map that grows; the one team in alpenglow; the tarn for the lake; ripple
rings for waves and gates. See v2's narrative for the palette, type, layout and
key-frame notes. Theme files are copied from v2 (`theme.css`, `range.js`, `estate.js`),
with the estate table rewritten for this deck's clusters.

What v3 adds:
- **A second cross-cutting layer: the fence line.** Policy (Kyverno) is drawn as a fence
  with gate posts along the foot of all three peaks: every trail passes the same gate,
  whoever walks it. Survey lines (OTel) measure the range; the fence line guards it. They
  appear together on `policy-layer` (fence only), `one-view` and `the-lake` (survey
  only), and on `same-person` and `the-ask` (both).
- **The map, re-cut for our estate.** On-prem holds four columns (dev, staging, ny4, ch4,
  with ny4–ch4 tied in lockstep; the second exchange's four below, with its own tie). AWS
  splits into region 1 and region 2 with a dashed divider from `multi-region` on. The
  second cloud keeps its own zone. Named clusters keep their labels throughout: these are
  our clusters, not cattle yet.
- **Twenty tools as rows.** `twenty-tools` grows the four tool rows of `tools-too` to
  twenty, with the two sets of numbers side by side.
- **Karmada as routing.** A developer's constraints on the left; on the right the map,
  with the app's replicas as mint chips that Karmada spreads over the clusters that match.
  Peak motion, three clicks: replicas spread across both AWS regions; region 1 fails (its
  half of the zone dims, alpenglow mark) and the chips slide to region 2; AWS fails and
  they slide to the second cloud. The constraints never change.
- **AI on the map:** teal, as before. First the on-prem dev cluster turns teal (click),
  then AWS dev and three new AWS AI clusters.
- **Agents as diamonds** (teal), now only in the second half: spawning and vanishing on
  `elastic-agents`, inside nested shells on `sandbox`, behind the gateway on `mcp-tools`,
  holding a short-lived pass on `credentials`.
- **The north star** (user, 2026-11-17): a four-pointed star in the top-right corner of
  every slide, drawn by `range.js`. Its brightness follows the beat's Energy (1 = dim, no
  halo; 5 = full, wide halo), read from `data-energy` on `.slide`, which
  `theme/gen/energy.mjs` syncs from this file. **Re-run it after changing an Energy.**
- **The team and the apps.** The one person became one team: three alpenglow climbers on
  a rope. The strip beside them is now one lake-blue square per app (`--lake #4f8fd8`,
  shapes only); the tally reads clusters, apps, pods.
- **AI phases** as an expedition profile (camps 0–5): 0–2 on a surveyed, dated slope, 3–5
  pale and dashed, with each camp's safety gate written at its foot.

- **As built (2026-11-17):**
  - The corner tally counts clusters, apps and pods (it counted tools and people until the
    user asked for apps and pods). Agents never appear on the map in the first half.
  - Named clusters keep their labels at every stage. The ny4–ch4 DR label sits above its
    pair; the second exchange's DR label sits below its own pair, so the two don't read as
    one.
  - The Karmada slides draw the map at about 0.63 scale, with no person, no people row and
    no cluster names, and with zone and region names enlarged so they stay legible. The
    replicas are mint chips. On the peak, the outages are dark overlays with an alpenglow
    mark, revealed with the clicks; the finished state shows AWS down and all six chips in
    the second cloud.
  - Cross-cutting layers as built: the fence on `policy-layer`; survey lines on
    `one-view` and `the-lake`; both on `same-person` and `the-ask`.
  - `ai-resize` uses the user's title, "Lakeside savings in practice.", with the
    assertion as a lede under it. Its 61% is computed from the illustrative week in the
    slide's script.
  - `twenty-tools` builds in two clicks: the sixteen extra tools and the 20-tool column,
    then the 80 approvals.
- **Audit exceptions, accepted:** many slides run 72–161 words, the most on `tools-too`
  (161, nearly all cell labels), `twenty-tools` (129), `sandbox` (118), `overrun` (116) and
  `the-ask` (111). Each is the evidence its headline needs; the notes carry the argument.
  The layout audit is otherwise clean: nothing offstage, clipped or overlapping.

## Beats

### title

- **Act:** Open
- **Job:** the title card: name the north star before the story starts
- **Headline:** KubeCon 2027 north star: managing our fleet at scale.
- **Visual:** the full range risen (fleet, delivery, agents), with the north star bright in
  the top-right corner and the three path words at the peaks' bases. A byline: from
  KubeCon NA 2026, Salt Lake City
- **Energy:** 4
- **Into next:** and it starts small.

### day-one

- **Act:** I
- **Job:** cold open: our own estate, small, and the one-person thread
- **Headline:** Four clusters, ny4 with ch4 as its DR, and one team upgrading clusters and apps.
- **Visual:** the on-prem zone only: dev, staging, ny4, ch4, with ny4–ch4 tied in
  lockstep. The one team, roped together. One square per app. Tally: 4 clusters, 20 apps,
  640 pods
- **Energy:** 3
- **Into next:** then the cloud showed up, for the environments that didn't need to sit
  next to an exchange.

### cloud-dev

- **Act:** I
- **Job:** the second kind of cluster
- **Headline:** EKS arrived for dev, qa and ftb, so now there are two ways to upgrade.
- **Visual:** the AWS zone opens with three clusters: dev, qa, ftb. Header "EKS, one
  region". Two runbooks
- **Energy:** 2
- **Into next:** then the business added an exchange.

### second-exchange

- **Act:** I
- **Job:** on-prem doubles
- **Headline:** A second exchange doubled what we run on our own hardware.
- **Visual:** four new on-prem clusters appear in the second row, the second exchange's
  pair tied in lockstep like ny4 and ch4. Eight on-prem, eleven total
- **Energy:** 3
- **Into next:** and then the migration started.

### cloud-migration

- **Act:** I
- **Job:** AWS grows in chunks
- **Headline:** Then the cloud migration started, and AWS clusters arrived in chunks.
- **Visual:** six AWS clusters land at once in region 1. Seventeen clusters
- **Energy:** 3
- **Into next:** and anything that matters in one region needs a second.

### multi-region

- **Act:** I
- **Job:** resilience multiplies the AWS side
- **Headline:** Resilience meant a second AWS region, mirroring the first.
- **Visual:** the AWS zone splits with a dashed divider; six clusters appear in region 2,
  mirroring region 1's prod. Header "EKS, two regions". Twenty-three clusters
- **Energy:** 3
- **Into next:** and two regions of one provider is still one provider.

### second-cloud

- **Act:** I
- **Job:** the last growth step, and the setup the peak pays off
- **Headline:** Hoping AWS never goes down isn't a plan, so a second cloud joined.
- **Visual:** the second cloud's zone opens with six clusters. Pull back: 29 clusters,
  three kinds of place, still one team, apps and pods climbing. A small line by the second
  cloud: "fingers crossed"
- **Energy:** 4
- **Into next:** six reasonable steps. Now look at what one upgrade costs him.
- **Source:** GOALS §0.1 (multi-provider is the norm at scale)

### one-runbook

- **Act:** II
- **Job:** the cost of one kubeadm upgrade, and why it repeats
- **Headline:** kubeadm upgrades one node and one minor at a time, three times a year.
- **Visual:** as v2: the per-node runbook as literal commands, then three rows of 54
  step blocks (April, August, December)
- **Energy:** 3
- **Into next:** and the clusters are the small part.

### tools-too

- **Act:** II
- **Job:** the multiplication nobody budgets
- **Headline:** Each cluster also carries four platform tools, each on its own release train.
- **Visual:** as v2, re-cut for this fleet: 29 clusters across the top in three zones,
  Argo CD, Prometheus, splunk-otel and Karpenter down the side, version skew in the cells.
  Four tools for now, to keep the picture readable; the real list comes back in Act IV
- **Energy:** 3
- **Into next:** add the clusters, the tools and the apps together, against the team's year.

### overrun

- **Act:** II
- **Job:** the turn of the first half: the work outgrows the person
- **Headline:** Keep doing it this way, and the team's year runs out at the second cloud.
- **Visual:** stacked bars (clusters, tools, apps) for the six stages against the team's
  line (3 × 850 = 2,550 h); the second-cloud bar crosses it. Click: a fourth person's
  line (3,400 h) holds, and a dashed seventh bar, "+ AI (part 2)", goes through both.
  Marked illustrative
- **Energy:** 4
- **Into next:** so what do the people with 300 clusters do?
- **Data:** illustrative model, see Editorial notes

### kubeadm-past

- **Act:** III
- **Job:** retire hand-run kubeadm, honestly
- **Headline:** kubeadm by hand is the past: the fleets on stage rebuild clusters from code.
- **Visual:** as v2: 54 steps collapse into a one-line version change; Cluster API
  on-prem, EKS Auto Mode in AWS
- **Energy:** 3
- **Into next:** that's the clusters. The tools on them need the same treatment.
- **Source:** LinkedIn KEP-4330; NVIDIA; Cluster API primer; Nutanix CAREN

### waves

- **Act:** III
- **Job:** platform tools ship like apps
- **Headline:** Platform tools ship like apps: test first, then a canary cluster, then prod in waves.
- **Visual:** as v2: half-rings rippling from the test cluster; Auto Mode clusters
  outlined (AWS rolls Karpenter)
- **Energy:** 3
- **Into next:** and a ring only moves outward when the tool proves itself.
- **Source:** GOALS §1.4; LinkedIn canary pipeline

### gates

- **Act:** III
- **Job:** automated gates and rollback
- **Headline:** Every wave passes its tool's gate, and a failed gate rolls itself back.
- **Visual:** as v2: a new Prometheus passes test, fails the canary gate, rolls back.
  Three clicks
- **Energy:** 4
- **Into next:** and the pipeline knows when not to run at all.
- **Source:** LinkedIn canary pipeline; GOALS §1.7

### change-windows

- **Act:** III
- **Job:** time gating by policy
- **Headline:** Nothing rolls during a freeze, because the window is a policy, not a promise.
- **Visual:** as v2: an eight-day strip; the prod wave pauses at Thursday's close and
  resumes Monday
- **Energy:** 2
- **Into next:** that's the clusters and the tools. Now the apps on them.
- **Source:** GOALS §2.3; NVIDIA; Agility Robotics

### twenty-tools

- **Act:** IV
- **Job:** four tools was the demo; at the real twenty, hand rollouts are three people's work
- **Headline:** Four tools was the demo: the platform really runs twenty, and the numbers follow.
- **Visual:** the four tool rows from `tools-too` grow to twenty: argo-cd, prometheus,
  splunk-otel, karpenter, then ceph, rook, vault-operator, external-secrets, grafana,
  thanos, istio / ALB, kafka-ui, file-viewer, cert-manager, external-dns, kyverno,
  velero, keda, reloader, argo-rollouts, each with a mark for where it runs (everywhere,
  on-prem only, cloud only, a few). Beside it, the numbers side by side: 4 tools → 116
  installs, 464 rollouts a year, 696 h; 20 tools → 418, 1,672, 2,508 h (three people).
  Through the pipeline: 80 approvals a year
- **Energy:** 4
- **Into next:** and those twenty don't land the same way everywhere, which is the
  developers' problem too.
- **Data:** twenty-tools model, see Editorial notes

### karmada-constraints

- **Act:** IV
- **Job:** Karmada as the option that lets developers think only in constraints
- **Headline:** With Karmada, developers state constraints, and it picks the clusters and regions.
- **Visual:** left, what a developer writes: constraints (regions, compliance, capability,
  residency) and asks (replicas, spread across two regions, a fallback cloud). Right, the
  map: Karmada matches the constraints against cluster labels and capacity and spreads the
  app's replicas, as mint chips, over the clusters that fit. Nothing on the left names a
  cluster
- **Energy:** 3
- **Into next:** and the constraints keep holding when the clusters underneath them don't.
- **Source:** path1 `no-cluster-names` and path3 `thirty-first` (the constraint
  vocabulary); GOALS §5.1 (clusterAffinities, Divided replica scheduling); *Karmada
  Updates and Use Cases* (Bloomberg, Huawei; no deck)

### karmada

- **Act:** IV
- **Job:** the peak: dynamic routing between clusters, regions and clouds, paying off "fingers crossed"
- **Headline:** Lose a region or a cloud, and Karmada moves the work wherever the constraints still hold.
- **Visual:** the same map and constraints. Click: replicas spread across both AWS
  regions. Click: region 1 fails (dimmed, alpenglow mark); its replicas slide to region
  2. Click: AWS fails; the replicas slide to the second cloud. The constraints on the left
  never change
- **Energy:** 5
- **Into next:** so what does a developer actually have to know now?
- **Source:** GOALS §5.1 (cluster taints on NotReady drive rescheduling; application
  failover with a toleration window; Bloomberg's streaming platform)

### no-cluster-names

- **Act:** IV
- **Job:** close the first half: the developer's whole job is a PR and a change record
- **Headline:** A developer now knows no cluster: a merged PR and a change record do the rest.
- **Visual:** a short path, left to right: PR with constraints and asks → merged → change
  record approved → window opens → placed by constraints → waves and gates → running.
  Beneath it, the pack from the path decks, now empty: never learned a cluster name,
  never clicked sync, never read the policy list, never rolled back by hand
- **Energy:** 3
- **Into next:** that's the first half solved. Now look at the map again, because
  something new is arriving on it.
- **Source:** path1 `stage-e` (the empty pack) and `freeze-windows` (change record →
  CRD → policy)

### ai-arrives

- **Act:** V
- **Job:** turn to the second half: AI lands on the map, starting where it's safest
- **Headline:** AI arrived on the on-prem dev clusters first, then in AWS.
- **Visual:** the map, back to its quiet state. Click: the on-prem dev cluster turns
  teal. Click: AWS dev turns teal and three AI clusters appear in region 2. Tally adds
  them
- **Energy:** 3
- **Into next:** and with AI come users that aren't people.

### elastic-agents

- **Act:** V
- **Job:** autonomous agents as a new kind of user: spawned on demand, on elastic compute
- **Headline:** Autonomous agents spawn on elastic nodes on demand, and nobody approves each one.
- **Visual:** a day on a time axis. The node count rises and falls as Karpenter/Auto Mode
  adds and removes nodes; teal agent diamonds spawn on the nodes when events fire
  (an alert, a PR, a schedule) and vanish when done. Count of agents that day, beside a
  count of people
- **Energy:** 3
- **Into next:** and every one of them runs code it may have just written.
- **Source:** GOALS §0 claim 2; `CLAUDE-AGENT-PLATFORM.md` (Jenkins-triggered agent pods)

### sandbox

- **Act:** V
- **Job:** containment: a container shares a kernel
- **Headline:** A container is not a cage, so agents run in gVisor or Kata.
- **Visual:** an agent diamond inside nested shells, from container (shared kernel)
  through gVisor (a user-space kernel in between) to Kata (its own microVM and kernel),
  each with what it stops and what it costs (start-up time, overhead). Kata snapshots
  are how Microsoft made start-up acceptable
- **Energy:** 4
- **Into next:** caged, it still has to do things, and it does them through tools.
- **Source:** GOALS §3.1; "Sandbox Your Agents" keynote (Red Hat); *Groundhog Pod*
  (Microsoft, Kata pod snapshots); *Untrusted Code on Secure Runtimes* (Google; no deck)

### mcp-tools

- **Act:** V
- **Job:** agents build infra through MCP tools; one gateway is the enforcement point
- **Headline:** Agents build infrastructure through MCP tools, so pick the gateway before the tools.
- **Visual:** agents on the left, tools on the right (Git, Jira, read-only kubectl,
  Crossplane for infra), and one gateway between them that checks who may call what,
  from the directory, and logs every call. Below, three ways to get the gateway: Obot
  (open-core, directory permissions), ToolHive (Stacklok, OSS, Cedar), or our own thin
  proxy. A bake-off, decided on enforcement
- **Energy:** 3
- **Into next:** and the gateway is also where the passwords live, so the agent never
  holds one.
- **Source:** GOALS §3.4, §3.5; `GOALS-GAPS.md` §3.5; *Cedar Analysis for MCP Servers*
  (AWS, Stacklok)

### credentials

- **Act:** V
- **Job:** credential patterns that keep passwords out of the agent
- **Headline:** Agents get a short-lived identity; the passwords never enter the agent.
- **Visual:** the agent holds a boarding pass (a workload identity, valid minutes); at
  the gateway it's exchanged for a scoped token per call; the real secret sits in the
  store behind the gateway and never crosses into the agent's context, prompt or image.
  Four patterns down the side: workload identity (EKS Pod Identity, SPIFFE), token
  exchange at the gateway, short-lived dynamic credentials, secrets synced from the store
  rather than written into YAML
- **Energy:** 3
- **Into next:** identity says who the agent is. Policy says what anyone may do.
- **Source:** GOALS §3.6, §9; "DO NOT Give AI Agents Credentials!" (Solo.io, no deck);
  *Stop Writing Secrets Into YAML* (Veritas Automata); SPIFFE Broker API

### policy-layer

- **Act:** V
- **Job:** Kyverno as a cross-cutting layer for user and AI actions
- **Headline:** One policy layer checks every change, whether a person or an agent made it.
- **Visual:** the fence line along the foot of all three peaks. In front: three kinds of
  actor (a person with kubectl, the pipeline, an agent) each sending a change; the same
  rules check each one, in CI first and again at admission. A few example rules: no
  privileged pods, egress only to approved models and MCP tools, nothing outside the
  change window
- **Energy:** 3
- **Into next:** policy stops what shouldn't happen. Telemetry shows what did.
- **Source:** GOALS §2.1–§2.4 ("write policies against the action, not the actor");
  AT&T + Nirmata, W.W. Grainger, Nirmata + Nutanix sessions

### one-view

- **Act:** VI
- **Job:** OTel, logs, Prometheus and state dumps become one view for whoever is debugging
- **Headline:** OTel, logs, Prometheus and state dumps give one view to anyone debugging, person or agent.
- **Visual:** four sources on the left (OTel traces, logs, Prometheus metrics, cluster
  state dumps), classic and AI workloads alike, all stamped with the same cluster,
  namespace, team and trace id by the collector layer; one correlated view in the middle;
  two consumers on the right: a person debugging and an agent debugging, reading the same
  thing. Prometheus stays, as a source and a backend
- **Energy:** 3
- **Into next:** and the agents read it from a lake, not from production.
- **Source:** GOALS §4.2, §7; *The Race to Standardize AI Observability* (Google,
  Microsoft); *Seeing Inside LLM Inference* (IBM, JPMorgan Chase); *Beyond Dashboards*
  (NVIDIA, Workday)

### the-lake

- **Act:** VI
- **Job:** AI decides from data: one read-only lake
- **Headline:** Agents decide from a read-only lake, not from credentials to production.
- **Visual:** as v2
- **Energy:** 3
- **Into next:** and one of the first things worth deciding from it is how big every pod
  should be.

### ai-resize

- **Act:** VI
- **Job:** AI reads the lake's signals and resizes pods more aggressively than VPA alone, for cost
- **Headline:** Lakeside savings in practice.
- **Lede (the assertion, under the title):** with the lake's signals, AI resizes pods more aggressively than VPA alone, and cuts the bill.
- **Label:** illustrative: the pattern Hertz showed (AI agents right-sizing across 80 EKS
  clusters); the 61% is our model, not Hertz's figure
- **Visual:** one workload across a trading week (illustrative): actual usage, the flat
  request VPA's recommender settles on, and an AI-shaped request that follows the week:
  tight overnight and at weekends, raised ahead of the open. The shaded gap between the
  two requests is the saving. Under it, how: VPA's recommender as the floor, in-place
  resize so nothing restarts, KEDA for fast signals, Karpenter consolidating the freed
  nodes. And the guardrail: it proposes first (stage 2), then acts inside min/max bounds
  that policy enforces, with rollback (stage 4)
- **Energy:** 3
- **Into next:** which is a good example of how far we let agents climb, and when.
- **Source:** GOALS §10.3; *The New Scaling Matrix* (Solo.io); *In-Place Pod Resizing
  Like I'm 5* (AWS); Hertz + CAST AI (vendor demo); *Agentic Karpenter* (PerfectScale:
  kagent + Claude proposes, a human approves)

### ai-phases

- **Act:** VI
- **Job:** the AI rollout ladder with realistic dates and the safety gate for each camp
- **Headline:** Climb a camp at a time: alert triage by Q2 2027, agent PRs by end of 2027.
- **Visual:** an expedition profile. Camp 0 (local prompts, we are here), camp 1 (alert
  triage: explain, never act; Q2 2027), camp 2 (agents propose PRs; end of 2027) on a
  surveyed, dated slope; camps 3–5 (always-on analysis, agents that fix inside a blast
  radius we drew, teams' own agents) pale and dashed, undated: the north star. Under each camp, the safety gate it needs: the lake
  and OTel for 1; policy in CI and traceability for 2; identity and a track record for 3;
  sandbox, rollback and windows for 4
- **Energy:** 4
- **Into next:** so here's the same person, with the same map.
- **Source:** GOALS §6; Verkada ($0.33 an alert); Salesforce's honest 25% first try

### same-person

- **Act:** Close
- **Job:** echo the opening, changed
- **Headline:** Same team, eight times the clusters: it approves the waves, and the pipeline runs them.
- **Visual:** the full map with AI and agents, every cluster lit; the one team at its
  gate; behind it, all three peaks with survey lines and the fence line
- **Energy:** 4
- **Into next:** five things get us there.

### the-ask

- **Act:** Close
- **Job:** the ask
- **Headline:** Stop building clusters by hand, pipeline one tool this quarter, and gate agents before they scale.
- **Visual:** five numbered lines in path colours: no new hand-built clusters; splunk-otel
  through the pipeline this quarter; a Karmada spike placing one app by constraints;
  sandbox + gateway + short-lived identity + Kyverno before stage 1; alert triage by
  Q2 2027
- **Energy:** 3
- **Into next:** end
