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
  Prometheus and state dumps; the lake; and AI resizing pods from the lake's signals.
- **No AI ladder (user, 2026-11-17).** The ladder slide (`ai-phases`, camps 0–5) is
  benched: the user didn't follow it. In its place, OTel is drawn as one plane across all
  three peaks, and the lake sits low in the valley between delivery and agents, fed by a
  stream from every mountain and one more through the OTel plane.
- **Agents arrive three ways (user, 2026-11-18).** The turn into the second half names the
  three roles agents play: as workloads (they run on our nodes), as users (they call our
  tools), and as attackers (theirs find new holes in what we run, daily). The roles become
  second-half group tags, as admins / platform / developers were in the first. The third
  role closes the circle: our agents patch what theirs find, through the first half's waves.
- **A journey up front, and less Karmada (user, 2026-11-18).** Slide 2 (`journey`) states
  the three things the talk proves, one per peak: it's a fleet, so run it as one; no manual
  way keeps up; AI brings problems as it solves them. Multi-region stays the peak, but
  Karmada drops out of the headlines: `karmada-constraints` is benched (the peak slide's
  constraints card already does its job), and the cluster admins gain an AWS slide
  (`region-claim`: a new region is one pull request, Crossplane builds it, EKS Auto Mode
  runs it). The ask's third item becomes that region, not a Karmada spike.
- **North star over practice.** This deck may go further than GOALS (Karmada, aggressive
  AI resizing). That's deliberate: it shows where we're
  heading, not only what we've decided. Facts still carry ⚠️ until checked.

Sources: GOALS §0, §1.4, §1.7, §2, §3.1, §3.5, §3.6, §4.2, §5.1, §5.2, §6, §7, §9;
`GOALS-GAPS.md` §1.1 + §2.3, §3.5; `EKS-VS-ECS.md` §4; `CLAUDE-AGENT-PLATFORM.md`.

## Brief

- **Audience:** engineering, leads included: the people who run the clusters, the people
  who will run agents, and the people who decide what both teams work on.
- **Setting:** live, about 35 minutes in two halves (fleet, then agents), then sent round.
  The notes carry the full argument for readers.
- **They believe now:** cluster and app upgrades are routine work one experienced team
  handles. Putting
  apps across clouds is a deployment detail. AI is a separate initiative, and its risks
  are mostly about the model.
- **They believe after:** the fleet's work grows faster than the fleet, so clusters and
  platform tools roll out like software (in waves, behind gates, inside windows), and
  work is placed by constraints across clusters, regions and clouds, so developers never
  pick a cluster. Agents arrive three ways at once: as workloads that spawn on
  demand, so they run sandboxed; as users, so they get short-lived identity, one tool gateway,
  and the same policy and telemetry as people; and in attackers' hands, finding new holes
  daily, so our own agents patch through the same waves. Every peak feeds one read-only lake,
  directly and through one OTel plane, and agents decide from the lake, not from production.
- **The one sentence:** the fleet will outgrow one team with a runbook, and agents will
  outgrow trust by default, so clusters, tools, apps and agents all go through one
  automated path with gates, policy and telemetry.
- **The ask:** (1) no new hand-built clusters; (2) splunk-otel-collector through the wave
  pipeline this quarter; (3) AWS region 2 from one Crossplane claim, on EKS Auto Mode,
  with one app running in both regions, placed by labels; (4) agents get a sandbox, a gateway, short-lived identity and
  Kyverno before they triage one alert; (5) explain-only alert triage by Q2 2027, reading
  the OTel plane and the lake.

## Shape

- **Structure:** chronicle with a turn, told twice. The first half watches the estate
  grow until one team's year runs out, then fixes the clusters, the tools and the app
  placement in turn. The second half returns to the same map, adds AI, and builds the
  safety around it before climbing.
- **Acts:**
  - Open (2): the title, "KubeCon 2027 north star: managing our fleet at scale."; then the
    journey, the three things the talk proves, one per peak.
  - I: *watch it grow* (6): four clusters → three clouds, apps and pods climbing, still one
    team.
  - II: *add it up* (3): the runbook, the tools, the overrun split three ways (cluster
    admins, platform team, developers).
  - III: *cluster admins* (2): clusters as a fleet, kubeadm from code on-prem; in AWS a
    region from one Crossplane claim, run by EKS Auto Mode.
  - IV: *platform team* (4): twenty tools, waves, gates, windows (the time syncs).
  - V: *developers* (2): multi-region failover by constraints (where and why, scheduling,
    DR patterns), no cluster names.
  - VI: *the agents arrive* (7): AI on the map; three ways (workloads, users, attackers);
    as workloads: elastic agents, sandbox; as users: MCP tools, credentials, policy.
  - VII: *see it* (3): one view (the OTel plane), the lake, lakeside savings. Untagged:
    the plane and the lake serve all three roles.
  - VIII: *agents as attackers* (2): new holes daily; close the circle (our agents patch,
    the waves roll it out).
  - Close (2): the same person; the ask.
- **The peak:** `karmada` (slug kept; the headline no longer names Karmada), slide 18 of 33
  (55%). Slide 6 says "fingers crossed for no AWS
  outage". Here a region fails and the work shifts to the other region, then AWS fails and
  it shifts to the second cloud, by the developer's constraints, without a person. It pays
  off the setup; `no-cluster-names` is the release after it, closing the first half.
  `gates` (16) and `the-lake` (28) are the secondary highs, with `twenty-tools` (14) the
  run-up to the peak, and `three-ways` (21) and `patch-loop` (31) the second half's turn
  and its close. `the-lake` is the second half's one big picture: all three peaks,
  the plane through them, and every stream running into one lake.
- **The close:** the deck opens on four clusters and one team. Before the close,
  `patch-loop` joins the halves: the agents of the second half drive the waves of the first.
  It closes on the same map, eight times the size, with agents on it. The same team approves waves, while the
  pipeline, the policy layer and the telemetry do the rest.

## Editorial notes

- **Three groups (user, 2026-11-17).** The overrun splits the upkeep by who carries it.
  *Cluster admins:* kubeadm and cluster upgrades as before, plus multi-cluster upkeep
  (labels, registrations, failover setup) at 8 h per cluster a year. *Platform team:* platform apps (the tool rollouts),
  progressive rollouts of app upgrades (6 a year per placement at 0.5 h), and time syncs
  (100 h plus 4 h per app). *Developers:* where and why (1 h per placement), scheduling
  (4 h per app), DR patterns (8 h per app with DR: 10, 10, 16, 25, 50, 65, then 80 with
  AI). Totals by stage, admins / platform / developers: 176 / 516 / 240 → 254 / 768 / 300
  → 430 / 1,056 / 444 → 586 / 1,578 / 690 → 742 / 1,992 / 980 → 898 / 2,556 / 1,280 →
  (AI) 976 / 3,756 / 1,560. The team of three is one admin (850 h) and two platform
  engineers (1,700 h); developers have no line. The slides after the chart are grouped
  in that order, each with a group tag.
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
- **Karmada is an option, not a headline (user, 2026-11-18: "too much of a focus on
  Karmada, although multi-region is key").** The peak keeps the failover picture, told
  mechanism-neutral: both regions live by default, placed by labels (ApplicationSets do
  this today), Auto Mode adding nodes in the surviving region; the second-cloud fallback is
  a warm standby or a scheduler that moves work on its own, and Karmada is named only there,
  in one on-screen line and in the notes, with Bloomberg as the evidence. That now sits
  with GOALS §5.1 (⚪ Watch). `karmada-constraints` is on the bench. *Earlier framing,
  kept for the bench slide:* **Karmada was shown as the north-star option,** not reconciled with GOALS §5.1 (where it
  is ⚪ Watch and reserved for workloads that can't run active/active). The slides present
  it as the option that lets developers think only in constraints and that routes work
  between clusters, regions and clouds as they change. The practical caveat (static
  placement is already ApplicationSet label selectors; Karmada is one more control plane
  to run) lives in the notes, not the headline. ⚠️ Check the PropagationPolicy snippet
  (`placement.clusterAffinities`, `affinityName`, `labelSelector`, `spreadConstraints`)
  against the Karmada docs before it goes on a shared slide.
- **AWS automation (region-claim).** From `EKS-VS-ECS.md` §4 design rules 1–3 (clusters
  are cattle: Auto Mode + Crossplane/CDK; push node toil to AWS; EKS Capabilities as the
  next step) and GOALS §10.1–10.2 (Crossplane, the CDK seam). The `Region` claim is our own
  illustrative API, not a real XRD yet. ⚠️ "Every node replaced within 21 days": Auto Mode's
  maximum node lifetime, per `EKS-VS-ECS.md`; check against the EKS Auto Mode user guide
  before sharing.
- **MCP gateway:** GOALS-GAPS §3.5's line stands: decide the enforcement point first.
  Obot is open-core with directory-managed permissions; ToolHive (Stacklok) is OSS and
  pairs with the Cedar analysis work; building our own is a thin proxy plus everything
  they already do. A bake-off, not a default.
- **Credentials:** the patterns come from GOALS §3.6 and §9. No vendor is recommended
  for the secret store (§9 is still 🔵 Decide).
- **AI phases are off the slides.** GOALS §6's ladder still holds the dates (stage 1, alert
  triage, by Q2 2027; stage 2, agent PRs, by end of 2027). The deck keeps only the first
  date, in plain words on `the-ask`, and never numbers a stage or a camp.
- **AI resizing:** the chart is illustrative. ⚠️ In-place pod resize: the Solo.io
  abstract says GA in 1.33, which conflicts with our memory of a later GA. The slide
  says "in-place resize, no restart" and names no version until checked.
- **Hertz numbers aren't available.** The Hertz demo posted no slides (no slides_url, not
  in MANIFEST.csv), and no public Hertz or CAST AI case study turned up. At the user's
  request the slide keeps the 61% and labels it illustrative, "the pattern Hertz showed",
  stating that 61% is our model, not Hertz's figure. Hertz's 80 EKS clusters is from the
  room (⚠️, as GOALS §0.1).
- **The CVE numbers (new-holes).** CVEs a year are read off OpenCVE's yearly chart as shown
  on p6 of *Mythos vs Maintainers* (ControlPlane, Docker; 📎
  `2026-11-10_mythos-vs-maintainers-drowning-in-the-vulnerability-tsunami.pdf`), measured
  from the rendered page: 2016 ≈ 10.3k, 2017 16.7k, 2018 17.4k, 2019 17.3k, 2020 20.8k, 2021
  23.1k, 2022 27.2k, 2023 31.1k, 2024 38.9k, 2025 ≈ 45.0k, 2026 ≈ 78.7k (the year to the talk,
  Nov 2026). ⚠️ Check against app.opencve.io/statistics before this goes beyond the team;
  "over 200 a day" holds whether 2026 counts 300 or 365 days. **220 findings, 22 real** is
  Metal3's 2026 triage tracker (📎 `2026-11-10_ai-found-a-0-day-in-metal3-what-happens-next.pdf`:
  220 findings, 79 invalid or duplicate, 31 hardening, 22 bugs, 22 security, 51 open). Its
  first takeaway, "AI finds bugs fast, and not only for us. Shorten your upgrade cycle", is
  quoted in the notes. **61 days** is our arithmetic: a hole landing on a random day waits on
  average half of a four-month gap (three upgrades a year).
- **Close the circle (patch-loop).** NVIDIA: 16 clusters, ~5,600 nodes converged in 30
  minutes, agent-driven, two kernel CVEs days apart through one controller, "the next CVE is
  a YAML change" (🖼 `12-fleet-node-changes/p07`). KubeEdge: *Fighting Fire with Fire* (no
  deck; abstract: AI review agents interpret disclosures, propose patches, automate
  regression tests). The middle of the loop says **days**, not hours: our own waves run test,
  canary, prod inside windows (see `change-windows`), so hours would contradict the deck.
  Also at the show, for the notes: *Gone in 60 Minutes* (ARMO; Kubescape rule CRD from "CVE
  published" to deployed in under an hour), *Welcome to the Vulnpocalypse!* (panel),
  *How Kubernetes Handles AI Generated Security Reports* (Canonical, NVIDIA). GOALS-GAPS A3
  ("the CVE firehose") is the GOALS-side home for this.
- Series rule: **no failure-case references.** The region and AWS outages on `karmada`
  and the failed canary on `gates` are our own illustrations.
- kubeadm, stated honestly (from v2): Cluster API still runs kubeadm underneath; the
  hands go, not the tool. EKS Auto Mode runs Karpenter itself.
- ⚠️ `tools-too` release cadences are approximate (see v2's note).
- ny4, ch4, dev, staging, qa, ftb are the user's names for our clusters. The second
  exchange's clusters are unnamed until the user gives names.

## Visual direction

Carried over from `takeaways-v2` (approved there): Three Peaks brand; the background range
whose peaks emerge per topic, with each path's word at its base; survey lines for OTel
(now the OTel plane, below);
the estate map that grows; the one team in alpenglow; the tarn for the lake; ripple
rings for waves and gates. See v2's narrative for the palette, type, layout and
key-frame notes. Theme files are copied from v2 (`theme.css`, `range.js`, `estate.js`),
with the estate table rewritten for this deck's clusters.

What v3 adds:
- **A second cross-cutting layer: the fence line.** Policy (Kyverno) is drawn as a fence
  with gate posts along the foot of all three peaks: every trail passes the same gate,
  whoever walks it. The OTel plane measures the range; the fence line guards it. They
  appear together on `policy-layer` (fence only), `one-view` and `the-lake` (plane
  only), and on `same-person` and `the-ask` (both).
- **The OTel plane** (user, 2026-11-17; replaces the per-peak survey lines, which read as
  ladder rungs). One sheet at one altitude, seen from a little above, with a perspective
  survey grid, running across the whole range. Every risen peak pierces it: the part above
  the sheet is redrawn over it and ends in a white collar where mountain meets plane.
  `Range.plane()` draws it at any scale; `{ survey: true }` puts it along the footer.
- **The lake in the valley** (`the-lake`): the range drawn large as the picture, the plane
  through all three peaks, and the lake low where delivery's right flank meets agents'
  left. Each mountain runs its own stream from a spring below the plane (fleet: cluster
  state; delivery: syncs, gate results; agents: tool calls, via the gateway). OTel gathers
  along the plane's front from every collar to one pour point and falls into the lake.
  Agents read on the near shore; an alpenglow dashed path back up the mountain is crossed
  out.
- **The map, re-cut for our estate.** On-prem holds four columns (dev, staging, ny4, ch4,
  with ny4–ch4 tied in lockstep; the second exchange's four below, with its own tie). AWS
  splits into region 1 and region 2 with a dashed divider from `multi-region` on. The
  second cloud keeps its own zone. Named clusters keep their labels throughout: these are
  our clusters, not cattle yet.
- **Twenty tools as rows.** `twenty-tools` grows the four tool rows of `tools-too` to
  twenty, with the two sets of numbers side by side.
- **Failover as routing** (the peak). A developer's constraints on the left; on the right the map,
  with the app's replicas as mint chips that the platform spreads over the clusters that match.
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
- **Group tags.** After the overrun, each fix slide carries a small tag above the headline
  (`Range.group('admins' | 'platform' | 'developers')`): three bars in the chart's group
  colours, this group's lit, and the group's name. Admins haze, platform mint, developers
  lake blue (darker inks on snowfield). It encodes the chart's split, so it isn't chrome.
- **The journey** (`journey`, 2026-11-18): the range drawn large, each summit under its
  truth (numbered 1–3 in its cap colour), and the team's dotted alpenglow trail climbing
  over all three toward the star. Three clicks, one truth each. No camps: the benched ladder
  confused; this is a map of the talk, not a schedule.
- **Second-half tags** (2026-11-18): the same tag, a second set. `Range.group('workloads' |
  'users' | 'attackers')`: teal, mint, alpenglow (inks on snowfield). Alpenglow because it
  already marks danger here (the failed gate, the outage, the crossed-out path). Their
  agents are alpenglow diamonds; ours stay teal. `one-view`, `the-lake` and `ai-resize`
  carry no tag: the plane and the lake serve all three roles.
- **The loop** (`patch-loop`): a full ring, the waves' ripple closed into a circle, five
  stations clockwise from the top (their agent's hole, the lake, our agent's PR, the team,
  the waves), "days" in the middle. The ring draws itself on entry.
- **The team and the apps.** The one person became one team: three alpenglow climbers on
  a rope. The strip beside them is now one lake-blue square per app (`--lake #4f8fd8`,
  shapes only); the tally reads clusters, apps, pods.

- **As built (2026-11-17):**
  - The corner tally counts clusters, apps and pods (it counted tools and people until the
    user asked for apps and pods). Agents never appear on the map in the first half.
  - Named clusters keep their labels at every stage. The ny4–ch4 DR label sits above its
    pair; the second exchange's DR label sits below its own pair, so the two don't read as
    one.
  - The failover slide (`karmada`) draws the map at about 0.63 scale, with no person, no people row and
    no cluster names, and with zone and region names enlarged so they stay legible. The
    replicas are mint chips. On the peak, the outages are dark overlays with an alpenglow
    mark, revealed with the clicks; the finished state shows AWS down and all six chips in
    the second cloud.
  - Cross-cutting layers as built: the fence on `policy-layer`; the OTel plane along the
    footer of `one-view`, large on `the-lake`; plane and fence on `same-person` and
    `the-ask`.
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
- **Into next:** and here's the whole journey before we start.

### journey

- **Act:** Open
- **Job:** make the journey plain before the story starts: three truths, one per peak,
  in the order the talk climbs them
- **Headline:** We run a fleet, nothing manual keeps up with it, and AI creates problems as it solves them.
- **Visual:** the range drawn large: fleet, delivery, agents, each summit under its truth.
  1 fleet: "It's a fleet, so we run it as one." (4 clusters become 29; built, upgraded and
  placed from code). 2 delivery: "No manual way keeps up." (twenty tools, 65 apps, three
  upgrades a year; one pipeline). 3 agents: "AI brings problems as it solves them." (agents
  as workloads, users, and in attackers' hands; fence ours in, then let them fight back).
  The team's trail climbs over all three toward the star. One click per truth
- **Energy:** 4
- **Into next:** let's start where we actually started: four clusters.

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
- **Job:** the turn of the first half: the upkeep outgrows every group, each for its own reason
- **Headline:** Keep doing it this way, and admins, platform and developers all drown in upkeep.
- **Visual:** three panels, each with its own scale and stacked bars for the six stages:
  cluster admins (kubeadm upgrades, multi-cluster upkeep) against one admin's 850 h, out at the
  second cloud; platform team (platform apps, progressive rollouts, time syncs) against
  two engineers' 1,700 h, out first at the second region; developers (where and why,
  scheduling, DR patterns), no line, 1,280 h by the second cloud, three-quarters of a
  developer spread thin. Click: dashed AI bars in all three. Marked illustrative
- **Energy:** 4
- **Into next:** each group crosses its line for a different reason, so each gets its own
  fix: admins first, then the platform team, then developers.
- **Data:** illustrative model, see Editorial notes (groups)

### kubeadm-past

- **Act:** III
- **Job:** clusters managed as a fleet: kubeadm stays, driven from code instead of by hand
- **Headline:** Clusters as a fleet, managing kubeadm from code.
- **Visual:** as v2: 54 steps collapse into a one-line version change; Cluster API on-prem, EKS Auto Mode in AWS
- **Energy:** 3
- **Into next:** on-prem, the hands leave the upgrade. In AWS we can go further.
- **Source:** LinkedIn KEP-4330; NVIDIA; Cluster API primer; Nutanix CAREN

### region-claim

- **Act:** III · tag: cluster admins
- **Job:** AWS automation: the cluster, and a whole region, come from code; AWS runs the nodes
- **Headline:** In AWS, a new region is one pull request: Crossplane builds it, and EKS Auto Mode runs it.
- **Visual:** left, all an admin writes: a `Region` claim (mirror region 1, six clusters,
  Auto Mode), our own Crossplane v2 composite. Middle, Crossplane's composition fans out to
  what it builds: VPC and subnets; IAM, Pod Identity; six EKS clusters; DNS, load
  balancers; Argo CD registration, labelled. Click: right, what AWS runs with Auto Mode
  (nodes and scaling, OS patches by replacing nodes, core add-ons) and what stays ours (the
  Kubernetes version as one field; the tools and apps, in waves)
- **Energy:** 3
- **Into next:** that's the cluster admins. Next, the platform team, who carry the most.
- **Source:** `EKS-VS-ECS.md` §4; GOALS §10.1, §10.2; *Crossplane: The Cloud Native
  Framework for Platform Engineering* (Upbound; no deck); *What Changes When Crossplane
  Adoption Gets Real* (American Family Insurance; no deck); EKS Auto Mode user guide

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
- **Into next:** twenty platform apps, and every one has to roll out across the fleet, the way any app does.
- **Data:** twenty-tools model, see Editorial notes

### waves

- **Act:** IV
- **Job:** platform tools ship like apps
- **Headline:** Platform tools ship like apps: test first, then a canary cluster, then prod in waves.
- **Visual:** as v2: half-rings rippling from the test cluster; Auto Mode clusters
  outlined (AWS rolls Karpenter)
- **Energy:** 3
- **Into next:** and a ring only moves outward when the tool proves itself.
- **Source:** GOALS §1.4; LinkedIn canary pipeline

### gates

- **Act:** IV
- **Job:** automated gates and rollback
- **Headline:** Every wave passes its tool's gate, and a failed gate rolls itself back.
- **Visual:** as v2: a new Prometheus passes test, fails the canary gate, rolls back.
  Three clicks
- **Energy:** 4
- **Into next:** and the pipeline knows when not to run at all.
- **Source:** LinkedIn canary pipeline; GOALS §1.7

### change-windows

- **Act:** IV
- **Job:** time gating by policy: the platform team's time syncs, replaced by a window everyone shares
- **Headline:** A wave that reaches Thursday's close waits for Monday on its own.
- **Headline variants** (2026-11-18; "a policy, not a promise" didn't land): forks on the
  bench, same slide, different headline. `-b` "The cluster keeps the freeze now, so nobody
  has to remember it." `-c` "The window is the sync: the cluster keeps the freeze, so nobody
  meets about it." (calls back to the overrun's time-syncs bar) `-d` "One freeze window stops
  everything: the pipeline, kubectl, every operator." Swap with `deck swap`.
- **Visual:** as v2: an eight-day strip; the prod wave pauses at Thursday's close and
  resumes Monday
- **Energy:** 2
- **Into next:** that's the platform team. Now the developers.
- **Source:** GOALS §2.3; NVIDIA; Agility Robotics

### karmada

- **Act:** V
- **Job:** the peak, for developers: multi-region by default; DR patterns done by the
  platform, routing between regions and clouds; also carries the constraints (where and
  why, scheduling) now that `karmada-constraints` is benched
- **Headline:** Lose a region, or all of AWS, and the work moves wherever the constraints still hold.
- **Visual:** a developer's constraints on the left (no cluster names), the map on the
  right with six replicas across both AWS regions. Click: region 1 fails (dimmed,
  alpenglow mark); region 2 takes all six, Auto Mode adding the nodes. Click: AWS fails;
  the replicas slide to the second cloud. The constraints never change. One line: placement
  follows labels, not cluster names; both regions run by default; Karmada is the option if
  work should move on its own
- **Energy:** 5
- **Into next:** so what does a developer actually have to know now?
- **Source:** GOALS §5.1 (cluster taints on NotReady drive rescheduling; application
  failover with a toleration window; Bloomberg's streaming platform)

### no-cluster-names

- **Act:** V
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

- **Act:** VI
- **Job:** turn to the second half: AI lands on the map, starting where it's safest
- **Headline:** AI arrived on the on-prem dev clusters first, then in AWS.
- **Visual:** the map, back to its quiet state. Click: the on-prem dev cluster turns
  teal. Click: AWS dev turns teal and three AI clusters appear in region 2. Tally adds
  them
- **Energy:** 3
- **Into next:** and it doesn't arrive as one thing.

### three-ways

- **Act:** VI
- **Job:** the turn into the agent half: agents arrive three ways at once, each needing its
  own answer; the three roles become the second half's tags
- **Headline:** Agents arrive three ways: as workloads, as users, and as attackers finding new holes daily.
- **Visual:** three columns, one click each, echoing the overrun's three panels. As
  workloads (teal): a node whose pods hold apps and agents side by side, one spawning. As
  users (mint): agents with passes through one gate in a fence to git, infra, kubectl. As
  attackers (alpenglow): their agents probing the tools we run, three rows holed. Under each,
  one sentence and "what answers it": elastic nodes · a sandbox; one gateway · short-lived
  identity · one policy layer; the lake · our own agents · the waves
- **Energy:** 4
- **Into next:** workloads first: how they spawn.
- **Source:** *Mythos vs Maintainers* (ControlPlane, Docker); *Welcome to the Vulnpocalypse!*
  (panel; no deck); GOALS-GAPS A3

### elastic-agents

- **Act:** VI · tag: agents as workloads
- **Job:** agents as workloads: spawned on demand, on elastic compute
- **Headline:** Autonomous agents spawn on elastic nodes on demand, and nobody approves each one.
- **Visual:** a day on a time axis. The node count rises and falls as Karpenter/Auto Mode
  adds and removes nodes; teal agent diamonds spawn on the nodes when events fire
  (an alert, a PR, a schedule) and vanish when done. Count of agents that day, beside a
  count of people
- **Energy:** 3
- **Into next:** and every one of them runs code it may have just written.
- **Source:** GOALS §0 claim 2; `CLAUDE-AGENT-PLATFORM.md` (Jenkins-triggered agent pods)

### sandbox

- **Act:** VI · tag: agents as workloads
- **Job:** containment: a container shares a kernel
- **Headline:** A container is not a cage, so agents run in gVisor or Kata.
- **Visual:** an agent diamond inside nested shells, from container (shared kernel)
  through gVisor (a user-space kernel in between) to Kata (its own microVM and kernel),
  each with what it stops and what it costs (start-up time, overhead). Kata snapshots
  are how Microsoft made start-up acceptable
- **Energy:** 4
- **Into next:** that's agents as workloads. As users: caged, it still has to do things,
  and it does them through tools.
- **Source:** GOALS §3.1; "Sandbox Your Agents" keynote (Red Hat); *Groundhog Pod*
  (Microsoft, Kata pod snapshots); *Untrusted Code on Secure Runtimes* (Google; no deck)

### mcp-tools

- **Act:** VI · tag: agents as users
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

- **Act:** VI · tag: agents as users
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

- **Act:** VI · tag: agents as users
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

- **Act:** VII
- **Job:** OTel, logs, Prometheus and state dumps become one view for whoever is debugging
- **Headline:** OTel, logs, Prometheus and state dumps give one view to anyone debugging, person or agent.
- **Visual:** four sources on the left (OTel traces, logs, Prometheus metrics, cluster
  state dumps), classic and AI workloads alike, all stamped with the same cluster,
  namespace, team and trace id by the collector layer; one correlated view in the middle;
  two consumers on the right: a person debugging and an agent debugging, reading the same
  thing. Prometheus stays, as a source and a backend. Along the foot, the OTel plane runs
  through all three peaks: the one view, drawn as one altitude across the range
- **Energy:** 3
- **Into next:** and the agents read it from a lake, not from production.
- **Source:** GOALS §4.2, §7; *The Race to Standardize AI Observability* (Google,
  Microsoft); *Seeing Inside LLM Inference* (IBM, JPMorgan Chase); *Beyond Dashboards*
  (NVIDIA, Workday)

### the-lake

- **Act:** VII
- **Job:** AI decides from data: one read-only lake, fed by every mountain and by OTel
- **Headline:** Agents decide from a read-only lake, not from credentials to production.
- **Visual:** the range drawn large: fleet, delivery and agents pierce one OTel plane at
  the same altitude. The lake lies low in the valley between delivery and agents. A
  stream runs from each mountain into it (fleet: cluster state; delivery: syncs, gate
  results; agents: tool calls, via the gateway), and OTel gathers traces, metrics and logs
  from all three along the plane and pours them in as a fourth stream. Agents read on the
  shore (triage an alert, judge a canary, pick the quiet hour, find a vulnerable image); the path back up to prod
  is crossed out. The snapshot caveat sits bottom left
- **Energy:** 4
- **Into next:** and one of the first things worth deciding from it is how big every pod
  should be.

### ai-resize

- **Act:** VII
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
  nodes. And the guardrail: it proposes first, as a pull request a person approves, then
  acts inside min/max bounds that policy enforces, with rollback
- **Energy:** 3
- **Into next:** that's the pattern for every agent on the map: read the lake, propose
  first, act inside bounds. Which brings back the third way agents arrive, the one we
  can't fence out.
- **Source:** GOALS §10.3; *The New Scaling Matrix* (Solo.io); *In-Place Pod Resizing
  Like I'm 5* (AWS); Hertz + CAST AI (vendor demo); *Agentic Karpenter* (PerfectScale:
  kagent + Claude proposes, a human approves)

### new-holes

- **Act:** VIII · tag: agents as attackers
- **Job:** the threat, made concrete: AI-found holes arrive daily, and our upgrade cadence
  leaves each open for months
- **Headline:** AI finds new holes daily, and three upgrades a year leave each one open for two months.
- **Visual:** CVEs published a year, 2016–2026, as bars: a decade of steady climb, then the
  2026 bar in alpenglow at ~79k, "over 200 a day, nearly double 2025". Beside it: **220**
  findings from one maintainer's AI pipeline in one project this year, 22 real (Metal3);
  click: **61 days**, the average wait for our next upgrade at three a year (our model)
- **Energy:** 3
- **Into next:** we built the shorter cycle in the first half. So who drives it?
- **Source:** *Mythos vs Maintainers* p6 (OpenCVE chart); *AI Found a 0-Day in Metal3*
  (Ericsson); see Editorial notes (the CVE numbers)

### patch-loop

- **Act:** VIII · tag: agents as attackers
- **Job:** close the circle: our agents patch what theirs find, through the first half's
  waves, gates and windows
- **Headline:** Close the circle: our agents patch what theirs find, and the waves roll it out.
- **Visual:** a ring of five stations, clockwise: a new hole lands (their agent, alpenglow);
  the lake finds it (which images, which clusters); our agent drafts the fix (a PR with its
  own check); the team approves (after policy checks it); the waves roll it out (a failed
  gate rolls it back). "days, not two months" in the middle. Click: the proof, NVIDIA's
  30 minutes for ~5,600 nodes, agent-driven, and KubeEdge's maintainers fighting fire with fire
- **Energy:** 4
- **Into next:** same team, same pipeline; the agents just make it go round faster.
- **Source:** *5,000 Nodes in Minutes, Twice in a Week* (NVIDIA; GOALS §5.2); *Fighting
  Fire with Fire* (KubeEdge maintainers; no deck); *Gone in 60 Minutes* (ARMO; no deck)

### same-person

- **Act:** Close
- **Job:** echo the opening, changed
- **Headline:** Same team, eight times the clusters: it approves the waves, and the pipeline runs them.
- **Visual:** the full map with AI and agents, every cluster lit; the one team at its
  gate; behind it, all three peaks with the OTel plane and the fence line
- **Energy:** 4
- **Into next:** five things get us there.

### the-ask

- **Act:** Close
- **Job:** the ask
- **Headline:** Stop building clusters by hand, pipeline one tool this quarter, and gate agents before they scale.
- **Visual:** five numbered lines in path colours: no new hand-built clusters; splunk-otel
  through the pipeline this quarter; AWS region 2 from one Crossplane claim on Auto Mode,
  one app in both regions by labels;
  sandbox + gateway + short-lived identity + Kyverno before they triage one alert; alert triage by
  Q2 2027
- **Energy:** 3
- **Into next:** end

## Bench

Slides kept in `slides/` but out of the draft. Restore with `deck move` and a beat above.

**ai-phases** (benched 2026-11-17: the user didn't follow the ladder; the OTel plane and the valley lake replaced it)

- **Act:** VII
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

**karmada-constraints** (benched 2026-11-18: too much Karmada; the failover slide's constraints card does its job)


- **Act:** V
- **Job:** for developers: where and why, and scheduling, become constraints Karmada acts on
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
