# Takeaways v3: the fleet outgrows one person, then the agents arrive

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Started 2026-11-17, from `takeaways-v2` (which stays as it is). What changed, at the
user's direction:
- **Our own starting estate:** dev, staging, ny4, and ch4 as ny4's DR, all on-prem; then
  EKS for dev, qa and ftb; a second exchange doubles on-prem; the cloud migration lands
  AWS clusters in chunks; multi-region resilience adds a second AWS region; and,
  "fingers crossed for no AWS outage", a second cloud.
- **No agents in the first half.** AI arrives only after the fleet problems are solved.
- **Multi-cloud placement and Karmada** get their own act: four demo apps, then twenty,
  with the numbers side by side.
- **A second half on AI:** AI lands on the on-prem dev clusters, then AWS; autonomous
  agents on elastic compute; sandboxing (gVisor, Kata); building infra through MCP tools
  (Obot, ToolHive, or our own); credentials kept out of the agent; Kyverno as a
  cross-cutting policy layer for people and agents alike; OTel and the lake; and the AI
  rollout phases with realistic dates.

Sources: GOALS §0, §1.4, §1.7, §2, §3.1, §3.5, §3.6, §4.2, §5.1, §5.2, §6, §7, §9;
`GOALS-GAPS.md` §1.1 + §2.3, §3.5; `EKS-VS-ECS.md` §4; `CLAUDE-AGENT-PLATFORM.md`.

## Brief

- **Audience:** engineering, leads included: the people who run the clusters, the people
  who will run agents, and the people who decide what both teams work on.
- **Setting:** live, about 30 minutes in two halves (fleet, then agents), then sent round.
  The notes carry the full argument for readers.
- **They believe now:** upgrades are routine work one experienced person handles. Putting
  apps across clouds is a deployment detail. AI is a separate initiative, and its risks
  are mostly about the model.
- **They believe after:** the fleet's work grows faster than the fleet, so clusters and
  platform tools roll out like software (in waves, behind gates, inside windows), and
  apps are placed by policy across clouds. Agents are a new kind of user that spawns on
  demand, so they arrive sandboxed, with short-lived identity, through one tool gateway,
  under the same policy and telemetry as people. We climb the AI ladder one camp at a time.
- **The one sentence:** the fleet will outgrow one person with a runbook, and agents will
  outgrow trust by default, so clusters, tools, apps and agents all go through one
  automated path with gates, policy and telemetry.
- **The ask:** (1) no new hand-built clusters; (2) splunk-otel-collector through the wave
  pipeline this quarter; (3) name the apps that can't run active/active across clouds, and
  trial Karmada on those; (4) agents get a sandbox, a gateway, short-lived identity and
  Kyverno before stage 1; (5) alert triage (AI stage 1) by Q2 2027.

## Shape

- **Structure:** chronicle with a turn, told twice. The first half watches the estate
  grow until one person's year runs out, then fixes the clusters, the tools and the app
  placement in turn. The second half returns to the same map, adds AI, and builds the
  safety around it before climbing.
- **Acts:**
  - I: *watch it grow* (6): four clusters → three clouds, still one person.
  - II: *add it up* (3): the runbook, the tools, the overrun.
  - III: *stop doing it by hand* (4): kubeadm's place, waves, gates, windows.
  - IV: *place apps by policy* (3): four demo apps, twenty, Karmada.
  - V: *the agents arrive* (6): AI on the map, elastic agents, sandbox, MCP tools,
    credentials, policy.
  - VI: *see it, then climb* (3): OTel, the lake, the AI phases.
  - Close (2): the same person; the ask.
- **The peak:** `karmada`, slide 16 of 27 (59%). Slide 6 says "fingers crossed for no AWS
  outage". Here AWS goes dark, and the apps that can't run active/active move to the
  second cloud by policy, without a person. It pays off the setup and closes the first
  half. `gates` (12) and `ai-phases` (25) are the secondary highs.
- **The close:** the deck opens on four clusters and one person. It closes on the same map,
  seven times the size, with agents on it. The same person approves waves, while the
  pipeline, the policy layer and the telemetry do the rest.

## Editorial notes

- **The toil and placement numbers are illustrative models, not our measurements.**
  Toil inputs are the same as v2 (12 h per kubeadm cluster per minor, 6 h per managed
  cluster, three minors a year, 4 tools upgraded 4 times a year at 1.5 h per cluster,
  850 h of one person's year). By stage: 240 → 366 → 606 → 858 → 1,110 → 1,362; one
  person is overrun at the migration. A second person holds until AI arrives (2,256 with
  three AI clusters and four more tools: AI gateway, MCP gateway, sandbox runtime, agent
  controller). Placement model: 6 placements, 2 provider variants and 1.5 outage moves
  per app, so 4 apps → 24 / 8 / 6 and 20 apps → 120 / 40 / 30. **Replace with real numbers
  before this goes beyond the team.**
- **Karmada: this deck goes further than GOALS §5.1 and the path3 tool card (⚪ Watch).**
  §5.1's rule is that Karmada earns its place only for workloads that can't run
  active/active, and that's the trigger here: the second cloud exists for an AWS outage,
  and some apps (singletons, leader-elected, streaming, exchange-adjacent batch) can only
  run in one place at a time. The slide says so, and recommends a trial on the named set,
  not a fleet-wide adoption. **GOALS §5.1, the decisions table and path3's Karmada card
  need reconciling** if this wording is adopted. ⚠️ The PropagationPolicy snippet
  (`placement.clusterAffinities` with `affinityName` and `labelSelector`) must be checked
  against the Karmada docs before it goes on a shared slide.
- **MCP gateway:** GOALS-GAPS §3.5's line stands: decide the enforcement point first.
  Obot is open-core with directory-managed permissions; ToolHive (Stacklok) is OSS and
  pairs with the Cedar analysis work; building our own is a thin proxy plus everything
  they already do. A bake-off, not a default.
- **Credentials:** the patterns come from GOALS §3.6 and §9. No vendor is recommended
  for the secret store (§9 is still 🔵 Decide).
- **AI phases:** the dates are GOALS §6's committed targets (stage 1 by Q2 2027, stage 2
  by end of 2027). Stages 3+ carry no date, deliberately.
- Series rule: **no failure-case references.** The AWS outage on `karmada` and the failed
  canary on `gates` are our own illustrations.
- kubeadm, stated honestly (from v2): Cluster API still runs kubeadm underneath; the
  hands go, not the tool. EKS Auto Mode runs Karpenter itself.
- ⚠️ `tools-too` release cadences are approximate (see v2's note).
- ny4, ch4, dev, staging, qa, ftb are the user's names for our clusters. The second
  exchange's clusters are unnamed until the user gives names.

## Visual direction

Carried over from `takeaways-v2` (approved there): Three Peaks brand; the background range
whose peaks emerge per topic, with each path's word at its base; survey lines for OTel;
the estate map that grows; the one person in alpenglow; the tarn for the lake; ripple
rings for waves and gates. See v2's narrative for the palette, type, layout and
key-frame notes. Theme files are copied from v2 (`theme.css`, `range.js`, `estate.js`),
with the estate table rewritten for this deck's clusters.

What v3 adds:
- **A second cross-cutting layer: the fence line.** Policy (Kyverno) is drawn as a fence
  with gate posts along the foot of all three peaks: every trail passes the same gate,
  whoever walks it. Survey lines (OTel) measure the range; the fence line guards it. They
  appear together on `policy-layer` (fence only), `otel-common-layer` and `the-lake`
  (survey only), and on `same-person` and `the-ask` (both).
- **The map, re-cut for our estate.** On-prem holds four columns (dev, staging, ny4, ch4,
  with ny4–ch4 tied in lockstep; the second exchange's four below, with its own tie). AWS
  splits into region 1 and region 2 with a dashed divider from `multi-region` on. The
  second cloud keeps its own zone. Named clusters keep their labels throughout: these are
  our clusters, not cattle yet.
- **Apps as chips.** In Act IV the four demo apps are coloured chips (A–D) placed on the
  clusters they run on. Twenty apps become 120 small ticks, which is the point.
- **Karmada peak motion:** three clicks. The apps sit on AWS (primary affinity). AWS goes
  dark, with its zone dimmed and an alpenglow outage mark. The apps that can't run
  active/active slide to the second cloud (fallback affinity). The policy snippet stays
  still beside it.
- **AI on the map:** teal, as before. First the on-prem dev cluster turns teal (click),
  then AWS dev and three new AWS AI clusters.
- **Agents as diamonds** (teal), now only in the second half: spawning and vanishing on
  `elastic-agents`, inside nested shells on `sandbox`, behind the gateway on `mcp-tools`,
  holding a short-lived pass on `credentials`.
- **AI phases** as an expedition profile (camps 0–5): 0–2 on a surveyed, dated slope, 3–5
  pale and dashed, with each camp's safety gate written at its foot.

## Beats

### day-one

- **Act:** I
- **Job:** cold open: our own estate, small, and the one-person thread
- **Headline:** Four clusters, ny4 with ch4 as its DR, and one person who upgrades them.
- **Visual:** the on-prem zone only: dev, staging, ny4, ch4, with ny4–ch4 tied in
  lockstep. The one person with the runbook. Tally: 4 clusters, 4 apps, a handful of
  people
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
  three kinds of place, still one person, still four apps. A small line by the second
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
  Argo CD, Prometheus, splunk-otel and Karpenter down the side, version skew in the cells
- **Energy:** 3
- **Into next:** add the clusters and the tools together, against one person's year.

### overrun

- **Act:** II
- **Job:** the turn of the first half: the work outgrows the person
- **Headline:** Keep doing it this way, and one person's year runs out at the migration.
- **Visual:** stacked bars for the six stages against one person's line (850 h); the
  migration bar crosses it. Click: a second person's line (1,700 h) holds through the
  second cloud, and a dashed seventh bar, "+ AI (part 2)", goes through both. Marked
  illustrative
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

### four-apps

- **Act:** IV
- **Job:** a breather that sets up the placement problem at a size you can hold in your head
- **Headline:** With four apps, you can still place every one by hand.
- **Visual:** the full map from `second-cloud`, quiet, with four coloured chips (A–D)
  on the clusters each app runs on: A on ny4 and ch4 (exchange-facing), B and D across
  both AWS regions with a standby in the second cloud, C in AWS only. Beside it: 24
  placements, 8 per-cloud variants, 6 moves if AWS goes down
- **Energy:** 2
- **Into next:** four is a demo. We run twenty.
- **Data:** placement model, see Editorial notes

### twenty-apps

- **Act:** IV
- **Job:** the numbers at real size, side by side
- **Headline:** At twenty apps, hand placement means 120 deployments and 30 moves in an outage.
- **Visual:** the same map, now with 120 small ticks across the clusters. Beside it, the
  two columns of numbers next to each other: 4 apps → 24 / 8 / 6; 20 apps → 120 / 40 /
  30. Marked illustrative
- **Energy:** 4
- **Into next:** and the 30 is the number that matters on the worst day.
- **Data:** placement model

### karmada

- **Act:** IV
- **Job:** the peak: policy-driven placement and failover across clouds, with its limits stated
- **Headline:** Karmada places apps by policy, and moves them when a cloud goes down.
- **Visual:** left: a PropagationPolicy, primary affinity AWS, fallback the second
  cloud. Right: the map. Click: apps sit on AWS. Click: AWS goes dark. Click: the apps
  that can't run active/active move to the second cloud on their own. One honest line
  underneath: only for those apps, since live-live apps never move (their traffic does),
  and Karmada is one more control plane that goes through the same pipeline
- **Energy:** 5
- **Into next:** that's the first half solved, on paper. Now look at the map again,
  because something new is arriving on it.
- **Source:** GOALS §5.1 (ordered clusterAffinities, taint-driven rescheduling,
  application failover, Divided replicas; Bloomberg runs its streaming platform on it);
  *Karmada Updates and Use Cases* (Bloomberg, Huawei; no deck)

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

### otel-common-layer

- **Act:** VI
- **Job:** OTel as the layer classic and AI workloads share
- **Headline:** OTel isn't beating Prometheus; it's the one layer our classic and AI workloads share.
- **Visual:** as v2
- **Energy:** 3
- **Into next:** and everything it collects lands somewhere the agents can read.

### the-lake

- **Act:** VI
- **Job:** AI decides from data: one read-only lake
- **Headline:** Agents decide from a read-only lake, not from credentials to production.
- **Visual:** as v2
- **Energy:** 3
- **Into next:** with all of that in place, here's how far we let them climb, and when.

### ai-phases

- **Act:** VI
- **Job:** the AI rollout ladder with realistic dates and the safety gate for each camp
- **Headline:** Climb one camp at a time: alert triage by Q2 2027, agent PRs by end of 2027.
- **Visual:** an expedition profile. Camp 0 (local prompts, we are here), camp 1 (alert
  triage: explain, never act; Q2 2027), camp 2 (agents propose PRs; end of 2027) on a
  surveyed, dated slope; camps 3–5 (always-on analysis, agents that fix, teams' own
  agents) pale and dashed, undated. Under each camp, the safety gate it needs: the lake
  and OTel for 1; policy in CI and traceability for 2; identity and a track record for 3;
  sandbox, rollback and windows for 4
- **Energy:** 4
- **Into next:** so here's the same person, with the same map.
- **Source:** GOALS §6; Verkada ($0.33 an alert); Salesforce's honest 25% first try

### same-person

- **Act:** Close
- **Job:** echo the opening, changed
- **Headline:** Same person, seven times the clusters: he approves the waves, and the pipeline runs them.
- **Visual:** the full map with AI, every cluster lit; the one person at his gate; behind
  it, all three peaks with survey lines and the fence line
- **Energy:** 4
- **Into next:** five things get us there.

### the-ask

- **Act:** Close
- **Job:** the ask
- **Headline:** Stop building clusters by hand, pipeline one tool this quarter, and gate agents before they scale.
- **Visual:** five numbered lines in path colours: no new hand-built clusters; splunk-otel
  through the pipeline this quarter; name the cross-cloud singletons and trial Karmada on
  them; sandbox + gateway + short-lived identity + Kyverno before stage 1; alert triage by
  Q2 2027
- **Energy:** 3
- **Into next:** end
