# Takeaways v4: the fleet outgrows one team, then the agents arrive (with the receipts)

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Started 2026-11-18, from `takeaways-v3` (which stays as it is, owned by another session).
Why v4 exists: Evan, co-presenting, said v3 is **not technical enough and doesn't have enough
examples**. A fresh-eyes `deck-critic` review of v3 agreed and went further (summary below).
v4 keeps v3's story and its user-directed choices (our own estate, the three groups, the
three ways agents arrive, the three takeaways up front) and changes what is on the screen.
It also carries v3's three `show-*` act openers (offered by the v3 session, commit 26debcc):
they riffle through the real four-day schedule, so they add breadth to v4's depth.

**The v4 rule: every fix slide shows the thing itself and a receipt.**
- *The thing itself* is a real object we would write: an API kind with its real fields
  (CAPI `Cluster`, ApplicationSet `RollingSync`, AppProject `syncWindows`, an Argo CD
  PostSync Job, a Pod spec with `runtimeClassName`, a CEL rule, a collector config, a SQL
  query), at most about a dozen lines, or a command. Our values (cluster names, labels)
  are illustrative and say so in the notes; the field names are real.
- *A receipt* is a named company from the show with its number, and where the show posted
  slides, their slide on our screen (lifted PNG, attributed: talk, speaker, company,
  KubeCon + CloudNativeCon NA 2026; internal use only, per `deck-assets/MANIFEST.md`).
- *The catch* goes on screen too: engineers trust a deck that says what doesn't work.

## What the v3 review found (deck-critic, 2026-11-18), and what v4 does about it

| v3 problem | v4 answer |
|---|---|
| The show never appears on screen: no lifted slide in 33 | Three lifted slides as heroes (`skip-level`, `gates`, `ship-the-check`), v3's three `show-*` openers, and a named company with its number on every fix slide |
| Every snippet is invented or partial (`Region`, `constraints:`, a kind-less `version:`) | Real kinds and fields; our own APIs (the `Region` claim, `placement:`) are labelled ours |
| The peak moves replicas region → region → cloud, which GOALS §5.1 calls the trap: live-live never moves the app; traffic, state and capacity fail over | `placement` (labels, no names) before the peak; the peak becomes failover **by layer** with the RTO as a sum; the second-cloud click is honestly "warm standby, or Karmada `clusterAffinities`" |
| Ten minutes before the first outside fact; six near-identical map slides; notes ≈ 6,500 words (≈ 46 min) | Cold open on Meta's ~15 engineers and ~100 clusters; the estate grows on one slide; 30 slides (three are v3's quick `show-*` openers), notes ≈ 5,400 words (≈ 36–38 min) |
| The second half never shows an agent doing a job; ask item 5 (alert triage) has no slide | `triage`: one alert, explained, with Verkada's $0.33 and Salesforce's 25% |
| Inaccuracies: "a failed gate rolls itself back"; "22 were real"; "61 days" tied CVE patches to minor upgrades; the sandbox drawn as nested layers; `kubeadm upgrade node` only; the overrun's panels on different scales | "A failed gate stops the wave; the revert is a commit"; "22 security bugs" (and the 220 came from the maintainer's *own* AI pipeline, not an attacker's); the 61 days is dropped for the maintainer's quote; three runtimes side by side; `upgrade apply` on the first control-plane node; the overrun on one scale |
| Light slides follow no rule | Snowfield now means one thing: the picture is someone else's slide from the show |

Cut from v3's main line: `cloud-dev`, `second-exchange`, `cloud-migration`, `multi-region`,
`second-cloud` (now builds of `estate-grows`), `tools-too` (the real twenty go up front),
`kubeadm-past` (→ `capi-diff`), `karmada-constraints` and `no-cluster-names` (→ `placement`),
`ai-arrives` (its job folds into `three-ways`), `elastic-agents` (→ `agent-pod`), `same-person`
(the echo folds into `the-ask`), `ai-resize` (cut to the bench: an invented 61%, no deck from
Hertz, a cost story inside the security act).

Sources: GOALS §0.1, §1.4, §1.7, §2.1–§2.3, §3.1, §3.4–§3.6, §4.2, §5.1, §5.2, §5.5, §6, §7;
`EKS-VS-ECS.md` §4–§5; `CLAUDE-AGENT-PLATFORM.md`; `deck-assets/` (lifts listed per beat).

## Brief

- **Audience:** engineering, leads included: the people who run the clusters, the people
  who will run agents, and the people who decide what both teams work on. They know
  Kubernetes. They will ask "which field?" and "who did that?".
- **Setting:** live, about 35 minutes, two presenters (the fleet half, then the agents half
  is a natural split), then sent round. The notes carry the argument for readers.
- **They believe now:** cluster and app upgrades are routine work one experienced team
  handles. Multi-region is a deployment detail. AI is a separate initiative, and its risks
  are about the model.
- **They believe after:** the work grows faster than the fleet, and peers at ten times our
  size already run it as code: clusters as objects, tools in labelled waves behind gates and
  windows, apps placed by labels and live in both regions. Agents arrive as workloads, users
  and attackers, and each has a concrete control: a sandboxed pod, a gateway with a policy,
  a short-lived identity, one CEL rule set. The first agent job is explain-only alert
  triage, read from a lake, and the attackers' agents are answered by ours through the
  same waves.
- **The one sentence:** peers already run ten times our fleet with teams our size because
  every change, a person's or an agent's, goes through one path of objects, gates, policy
  and telemetry; we can copy their config, not just their slogans.
- **The ask:** five first pull requests. (1) The next cluster is a CAPI `Cluster` or a
  `Region` claim, never hand-built; (2) splunk-otel-collector through `RollingSync` waves
  this quarter; (3) AWS region 2 from one claim on Auto Mode, one app live in both,
  placed by labels; (4) agents get a runtime class, a gateway, Pod Identity and the CEL
  rules before they triage one alert; (5) explain-only alert triage by Q2 2027, with the
  accept/modify/reject log from day one.

## Shape

- **Structure:** chronicle with a turn, told twice, as v3, now with a receipt at each fix.
  The first half watches the estate grow until the team's year runs out, then fixes the
  clusters, the tools and the placement, each with a peer that already did it. The second
  half puts agents on the same map and shows, for each of the three ways they arrive, the
  object that controls it, then gives them their first job.
- **Acts:**
  - Open (2): the cold open (Meta's ~15 engineers and ~100 clusters against our three and
    29); the three takeaways, each with its proof from the show.
  - I: *what we run, what it costs* (4): the show's fleets (`show-fleet`, from v3); the
    estate grows to 29 on one slide; the runbook; the overrun (on one scale now).
  - II: *cluster admins* (3): the upgrade is one field (CAPI); LinkedIn's three minors in
    one rollout; a region is one claim (Crossplane, Auto Mode).
  - III: *platform team* (5): the show's pipelines (`show-delivery`); the real twenty
    tools; waves are a label (`RollingSync`); a gate is a Job
    (LinkedIn); a freeze is config (`syncWindows`, Kyverno).
  - IV: *developers* (2): placement by labels; failover by layer (the peak).
  - V: *agents arrive* (7): the show's AI (`show-agents`); three ways (with a company each); one agent pod; three
    runtimes; the MCP gateway; credentials; one CEL rule set.
  - VI: *see it, use it* (3): one correlated view; the lake and one query; one alert,
    triaged.
  - VII: *agents as attackers* (3): new holes daily; NVIDIA's status field; close the
    circle.
  - Close (1): the ask, with the opening's map echoed.
- **The peak:** `failover`, slide 16 of 30 (53%). The first half's setup ("fingers
  crossed for no AWS outage") pays off as engineering: nothing moves, traffic moves; the
  RTO is a sum and the slowest layer is the data. The second half's high is `triage`
  (26 of 30): the first agent doing a job, with real prices.
- **The close:** the deck opens on Meta's ratio and ours. It closes on the same map with
  the ratio changed by the pipeline, not by hiring, and five first PRs.

## Editorial notes

- **Snippets.** Field names and kinds are real; values (cluster names, labels, image tags,
  versions) are ours and illustrative. Each snippet is a sketch for the slide, not tested
  config. ⚠️ Check each against our versions before anyone copies one into a repo:
  - `RollingSync` (ApplicationSet progressive sync) is behind
    `applicationsetcontroller.enable.progressive.syncs`; ⚠️ check its maturity in our Argo CD
    version (GOALS §1.4 is 🟡 Trial). RollingSync advances a step when the step's
    Applications are Healthy; a failed PostSync hook fails the sync, so the next step
    never starts. ⚠️ Confirm on a test ApplicationSet.
  - AppProject `syncWindows` (`kind: allow`, `schedule: "0 9 * * 1-4"`, `duration: 8h`,
    `timeZone`) is Argo CD-native: syncs only Monday to Thursday, 09:00–17:00, which is what
    the strip draws. The time zone is our guess.
  - The `ChangeWindow` CRD is ours (GOALS §2.3: project approved windows into the
    cluster, so admission never depends on the ITSM being up).
  - CAPI: `Cluster.spec.topology.version` with a ClusterClass rolls control plane then
    workers, replacing machines. On bare metal that means re-provisioning through an
    infrastructure provider (Metal3); on VMs, vSphere or Nutanix (CAREN). **Which one fits
    ny4/ch4 is the first question an admin will ask, and it's undecided.**
  - EKS Auto Mode fields (`computeConfig.enabled`, `nodePools: [general-purpose, system]`,
    `kubernetesNetworkConfig.elasticLoadBalancing`, `storageConfig.blockStorage`) are the
    CreateCluster API's. ⚠️ "Every node replaced within 21 days" (max node lifetime), from
    `EKS-VS-ECS.md`; check the Auto Mode user guide.
  - ⚠️ **Auto Mode vs sandboxes:** Auto Mode doesn't take custom AMIs (`EKS-VS-ECS.md`
    rule 2), so gVisor or Kata nodes likely need a self-managed Karpenter NodePool; Kata
    on EC2 needs metal instances (or nested virtualisation where offered). AWS's own talk,
    *Agent Sandbox on EKS: Hardware-Isolated microVM Pods for AI Agents*, presented "a
    runtime class on a normal pod spec". Verify both before presenting; someone will ask.
  - ⚠️ `kubernetes-sigs/agent-sandbox` (Sandbox, warm-pool CRDs): not on the slides until
    checked.
  - ⚠️ `automountServiceAccountToken: false` on the agent Job: check that EKS Pod Identity
    still injects its credentials (it uses its own projected token) before relying on it.
  - ValidatingAdmissionPolicy (CEL) is GA since Kubernetes 1.30. The same rule runs in CI
    (`kyverno test`, or a server-side dry run).
  - EKS Pod Identity: `aws eks create-pod-identity-association` with `--cluster-name`,
    `--namespace`, `--service-account`, `--role-arn`. Credentials are temporary and
    rotated by the Pod Identity agent.
  - Cedar: the `permit` is illustrative (our entity types), in Cedar's real syntax.
  - The collector config uses the real `k8sattributes` processor (`extract.metadata`,
    `extract.labels` with `from: namespace`) and the `resource` processor.
  - The lake: store and engine are 🔵 undecided (GOALS §7). The slide names tables and the
    read path, and says "e.g." for the engine.
- **Receipts and their numbers** (all from decks in `kubecon-overview/slides/` unless
  marked):
  - Meta: ~15 engineers, ~100 clusters (keynote abstract, *We Have GitOps at Home*).
  - ⚠️ **LinkedIn's numbers conflict.** The skip-level talk's abstract (GOALS §0.1) says
    300 clusters, ~300,000 nodes; its deck (`13-skip-level-upgrades/p02`) says 250+
    clusters, ~500K nodes, on-prem. v4 uses the deck's figures, on that talk's slide only.
    v3's `kubeadm-past` uses the abstract's. Settle one before both decks go round.
  - LinkedIn skip-level: v1.31 → v1.34; one minor at a time = 6 fleet waves, 40 business
    days; with `--emulated-version` = 1 rollout + promotion, 7 business days (p02, p08).
  - LinkedIn canary: ~1 week per release → ~1 hour, auto-validated; 10+ potential incidents
    caught before prod; exit 0 advances, exit 1 fails the sync (p22, p25).
  - NVIDIA: 16 clusters, ~5,600 nodes converged in 30 minutes, agent-driven; largest single
    cluster 5,000 nodes in 3 minutes; two CVEs days apart, same controller; "the next CVE
    is a YAML change" (p06, p07). `github.com/NVIDIA/nodewright`.
  - Salesforce: first agentic attempt 25% accuracy (p06); after a curated knowledge base
    and LLM-as-judge evals: 60–80% RCA accuracy, ~900 h a month of toil removed, 60% less
    troubleshooting time, 18 teams (p21).
  - Verkada: ~4,700 alerts a month, $0.33 an investigation, 139 s median time-to-summary,
    nine clusters (session title and abstract; no deck).
  - Yahoo: 2.06M → 280K active series (−86%), ≈ $140K a year on one cluster of 800+ nodes
    (p02). The trap: delta temporality silently breaks every `rate()` query (p42).
  - Mastercard: an LLM drives 30 EKS clusters; projections instead of RAG (40 MB of
    `DescribeInstances` JSON → 800 bytes) (p30); "ditch MCPs, adopt tools" (p31).
  - Stacklok + AWS: MCP auth is three questions (p05).
  - Transfix: "Models produce evidence. Code decides authority." Four roles; the proposer
    can't approve its own PR (p09, p17).
  - Podium: 30% of merged PRs opened by autonomous agents, each agent an isolated pod
    (abstract; no deck).
  - Microsoft *Groundhog Pod*: Kata VM snapshots save CPU and GPU state, so a new pod
    resumes instead of cold-starting (pptx outline).
  - Metal3 (Ericsson): 220 findings from **the maintainer's own** AI pipeline in one project
    this year; 22 security bugs, 22 bugs, 31 hardening, 79 invalid or duplicate (v3 editorial
    note). The categories don't sum to 220, so the slide quotes only the 22 and the 79. It is
    a defender's pipeline: on the slides it reads "attackers run the same models", never
    "attackers filed 220". His first takeaway is quoted on `new-holes`.
  - CVEs a year: OpenCVE's chart as shown in *Mythos vs Maintainers* p6; ⚠️ check against
    app.opencve.io before this goes beyond the team (carried from v3).
- **The toil model** (`overrun`, `twenty-tools`) is v3's, unchanged: illustrative, team of
  three is our assumption. **Replace with real numbers before this goes beyond the team.**
- Series rule, kept: **no failure-case references** from other companies. The outages on
  `failover` and the failed gate on `gates` are our own illustrations.
- **Ingress NGINX stays off the slides** (the move to Istio is already planned).
- ny4, ch4, dev, staging, qa, ftb are the user's names. Labels used across the deck, so
  every snippet agrees: `provider: onprem | aws | cloud2`, `region: aws-1 | aws-2`,
  `tier: prod | nonprod`, `wave: test | canary | prod`.

## Visual direction

Carried over from `takeaways-v3` (approved there): the Three Peaks brand, the background
range with the north star whose brightness follows Energy (`theme/gen/energy.mjs`; re-run
after changing an Energy), the estate map (`estate.js`), the group tags, the team in
alpenglow. Theme files copied from v3 on 2026-11-18, before v3's `show-*` additions.

What v4 adds, all in `theme/theme.css`:
- **The code card** (`.code`): the deck's main new picture. JetBrains Mono at 26–28 px on
  the deep card (`#0b1820`), keys in the slide's path colour, values in snow, comments in
  lichen. One line is *the line that matters*: an alpenglow bar at its left (`.hl`). Diffs
  show the removed line struck in muted alpenglow (`.del`) and the added line in mint
  (`.add`). Each card has a filename tab, so the audience knows where the object lives
  (`apps/prometheus/appset.yaml`). No card runs past about a dozen lines; long objects are
  cut to the fields that matter, with `…` where fields were dropped.
- **The receipt** (`.receipt`): a lifted slide from the show, in a thin frame with the
  attribution under it: company in display type, talk title in italics, "KubeCon NA 2026".
  It can crop to a region (`object-position`) and mark one area with an alpenglow ring.
  A receipt is never smaller than 640 px wide, so its text survives the projector.
- **Snowfield means the show.** A light ground now has one meaning: the main picture is
  someone else's slide (`skip-level`, `ship-the-check`). Our own story and config stay on
  the dark grounds.
- **The catch** (`.catch`): one short line with an alpenglow ⚠ at the foot of a slide,
  for what doesn't work yet or must be checked. Used only where there is a real catch.
- **Failover by layer** (the peak): two AWS regions side by side, both always running six
  replicas; four horizontal layers through them (traffic, delivery, capacity, state). Click:
  region 1 dims; the traffic arrow swings; region 2's capacity row grows; the database
  promotes. Under it, the RTO bar fills one segment per click: detection, traffic,
  scale-up, data, with data the longest. Final click: the second cloud, labelled "warm
  standby, or Karmada `clusterAffinities`". No made-up seconds: the segments carry the
  mechanism, and the notes say we measure each at a game day.
- **One alert, triaged** (`triage`): an alert card on the left (real Prometheus alert
  shape), the agent's explanation in the middle (verdict, severity and its basis, what
  changed, links, a suggested action), and the human's accept / modify / reject on the
  right, written to a log. The receipts run under it.
- **Anti-default check.** The risk in a "more technical" deck is wall-to-wall code in
  identical cards. Changed: no two neighbouring slides use the same composition (code-left,
  receipt-right; full-width diff; receipt-hero on snow; diagram with a small card); code
  never appears without a picture or a receipt that says why it matters; the receipt frame
  is quiet (no shadow, no tilt) so the lifted slide's own design isn't fighting ours.

**As built (2026-11-18):**

- 30 slides; notes ≈ 5,400 words, about 36 minutes at 150 words a minute. Three `show-*`
  slides are v3's (commit 26debcc), copied with `theme/riffle.js`,
  `theme/assets/schedule.js`, `theme/gen/schedule.mjs` and the `.show` CSS; v4's copy of
  `show-fleet` uses LinkedIn's deck figures (250+ clusters, ~500K nodes).
- `twenty-tools` sits after `show-delivery`, as in v3: the overrun's platform hours count
  the core four tools, so showing twenty first would contradict it.
- The range is sunk (no peak touched) on most v4 slides: risen peaks and their words
  collided with code cards, captions and catch lines.
- Lifted slides kept in `assets/stage/`: LinkedIn canary p22 (`gates`), LinkedIn skip-level
  p02 (`skip-level`), NVIDIA p06 (`ship-the-check`). Others were tried and not needed.
- **Audit exceptions, accepted:** every slide but the cold open is flagged `dense`
  (72–162 words). Most of it is code, which the audit counts as words; the code is the
  point of v4. Nothing is offstage, clipped or overlapping. Covered build states
  (`estate-grows` stages, `failover`'s replaced labels) are `aria-hidden` so the audit
  ignores them.

## Beats

### cold-open

- **Act:** Open
- **Job:** earn attention with the contrast an engineer can't ignore: a peer runs more
  clusters per head than we do, and the difference is what does the work
- **Headline:** Meta runs ~100 clusters with ~15 engineers. We run 29 with three, by hand.
- **Visual:** two fields at the same scale, one square per cluster and one figure per
  engineer: ours (29 squares in three zone colours, three alpenglow figures), Meta's
  (100 squares, 15 figures). Click: the ratio under each, clusters per engineer (about 7
  at Meta, about 10 for us): we already run more per head. The difference is what does
  the upgrades
- **Energy:** 4
- **Into next:** none of them got there by hiring. Here's what we brought back.
- **Source:** GOALS §0.1 (Meta keynote abstract, *We Have GitOps at Home*). Team of three
  is our assumption (v3 model).

### journey

- **Act:** Open
- **Job:** the title, and the three takeaways, each already carrying its proof
- **Headline:** Three takeaways from four days in Salt Lake City.
- **Visual:** the kicker "KubeCon 2027 north star" over the headline (the deck's title).
  v3's range with three summits. Under each, the takeaway and one receipt line:
  1 fleet, "There's always another cluster." (LinkedIn: three minors, 250+ clusters, 7
  business days); 2 delivery, "No manual way keeps up." (LinkedIn's canary: a week per
  release became an hour); 3 agents, "AI brings problems as it solves them." (Verkada: an
  alert explained for $0.33; one maintainer's AI found 220 holes in Metal3, and attackers run
  the same models). One click per takeaway
- **Energy:** 3
- **Into next:** the fleet first, and first, how many fleets were on stage.

### show-fleet

- **Act:** I
- **Job:** the first takeaway's credibility: the show was full of fleets, run by big names
- **Headline:** The big names all run fleets: another cluster is the rule, not the exception.
- **Visual:** from v3 as settled there (commit 26debcc): the four days as boxes, fleet talks
  lit (96 of 501); the big-name cards riffle; three stay: LinkedIn (250+ clusters, ~500K
  nodes, upgraded skip-level; v4 uses the deck's figures, see Editorial notes), Salesforce
  (1,000 clusters, with AIOps agents), GEICO (multi-provider, because no one cloud had the
  GPUs)
- **Energy:** 3
- **Into next:** now ours. It started at four.
- **Source:** v3 narrative, "The show-* slides" (every highlight checked against its abstract)

### estate-grows

- **Act:** I
- **Job:** our own estate grows from four clusters to 29, in five reasonable steps, on one
  slide
- **Headline:** Four clusters became 29 in five reasonable steps, and one team still upgrades them all.
- **Visual:** the estate map at stage 1 (dev, staging, ny4, ch4; ny4–ch4 tied as DR). Five
  clicks, each a stage: EKS for dev, qa, ftb; the second exchange; the migration's six;
  region 2's six; the second cloud's six, with "fingers crossed for AWS" beside it. The
  tally climbs: 4 → 29 clusters, 20 → 65 apps, 640 → 4,000 pods. The team stays three
- **Energy:** 3
- **Into next:** two ways to upgrade, three kinds of place. Here's one upgrade.

### one-runbook

- **Act:** I
- **Job:** the cost of one kubeadm upgrade, in its literal commands
- **Headline:** kubeadm upgrades one node and one minor at a time, three times a year.
- **Visual:** as v3 (the runbook as commands, then three rows of 54 step blocks), corrected:
  the first control-plane node runs `kubeadm upgrade apply`, the others `upgrade node`. A
  third caption line for AWS: `update-cluster-version`, then node groups. Two procedures
- **Energy:** 3
- **Into next:** and the clusters are the small part: add the tools and the apps.

### overrun

- **Act:** I
- **Job:** the turn of the first half: the upkeep outgrows every group, each for its own reason
- **Headline:** Keep doing it this way, and admins, platform and developers all drown in upkeep.
- **Visual:** as v3 (three panels, stacked bars by stage, each group's line), now on one
  scale across all three (the review: separate scales made 1,280 h look like 898 h);
  marked illustrative. The platform bars count the core four tools
- **Energy:** 4
- **Into next:** each group gets its own fix, and for each one, someone at the show already
  runs it. Admins first.
- **Data:** v3 toil model

### capi-diff

- **Act:** II · tag: cluster admins
- **Job:** on-prem, the upgrade becomes one field in an object; Cluster API does the 54 steps
- **Headline:** On-prem, an upgrade becomes one field, and Cluster API does the 54 steps.
- **Visual:** left, the diff in `clusters/ny4.yaml`: a CAPI `Cluster` with
  `spec.topology.class: onprem-kubeadm` and `version: v1.36.3` struck, `v1.37.1` added.
  Right, what the controllers do with it, as the 54 blocks from `one-runbook` collapsing into
  one row of machine replacements: control plane first (new machine, join, drain the old,
  delete), then workers by MachineDeployment, `maxSurge: 1`. The catch: on bare metal,
  "replace a machine" means re-provisioning it: Metal3, or vSphere/Nutanix if ny4 runs VMs.
  Pick the provider first
- **Energy:** 3
- **Into next:** one field per cluster. LinkedIn went further and made it one rollout per
  three minors.
- **Source:** Cluster API book (ClusterClass, topology); *Nutanix CAREN*; GOALS §5.2

### skip-level

- **Act:** II · tag: cluster admins
- **Job:** the receipt: a peer at ten times our size changed the upgrade itself, not just
  who runs it
- **Headline:** LinkedIn took 250+ clusters from v1.31 to v1.34 in one rollout: 7 business days, not 40.
- **Visual:** snowfield. LinkedIn's result slide (`13-skip-level-upgrades/p02`) as the hero,
  large. Beside it, their principle (p05) in our type: deploy is not release; ship the new
  binary pinned with `--emulated-version=1.31`, then raise it. Attribution under it
- **Energy:** 3
- **Into next:** that's on-prem. In AWS the cluster itself comes from code.
- **Source:** *Binary Version Is Not Behavior* (LinkedIn), 📎 deck p02, p05, p08. ⚠️ Their
  own tooling did the rollout; for us it needs kubeadm/CAPI support for emulated versions:
  check before promising it. Patch releases still flow every month through the waves; this
  only removes minor-version toil

### region-claim

- **Act:** II · tag: cluster admins
- **Job:** AWS automation: a region from one claim; AWS runs the nodes
- **Headline:** In AWS, a new region is one claim: Crossplane builds it, and EKS Auto Mode runs it.
- **Visual:** as v3 (claim → Crossplane → what it builds → who runs what), with the claim
  labelled *our API* and the composed EKS cluster's real Auto Mode fields in a second card:
  `computeConfig: {enabled: true, nodePools: [general-purpose, system]}`,
  `kubernetesNetworkConfig.elasticLoadBalancing.enabled`, `storageConfig.blockStorage.enabled`.
  The catch, on screen: Auto Mode takes no custom AMIs (it matters for agent sandboxes later);
  ⚠️ 21-day node lifetime
- **Energy:** 3
- **Into next:** that's the admins. The platform team carries the most, and the show
  had a lot to say about them.
- **Source:** `EKS-VS-ECS.md` §4; GOALS §10.1–10.2; EKS CreateCluster API; *Crossplane:
  The Cloud Native Framework* (Upbound; no deck); *What Changes When Crossplane Adoption Gets
  Real* (American Family Insurance; no deck)

### show-delivery

- **Act:** III
- **Job:** the second takeaway's credibility: nobody at fleet scale keeps up by hand
- **Headline:** At fleet scale, nobody keeps up by hand: every change rides a pipeline.
- **Visual:** from v3 as settled there: the four days, delivery talks lit (122 of 501);
  riffle; three stay: Meta (a one-line Helm change took a day; now GitOps), LinkedIn (core
  services canaried, several releases a week), Ford (hundreds of clusters, every PR tested
  end to end)
- **Energy:** 3
- **Into next:** and that includes the twenty tools the platform team runs, not the four we counted.
- **Source:** v3 narrative, "The show-* slides"

### twenty-tools

- **Act:** III · tag: platform team
- **Job:** the multiplication nobody budgets: the overrun counted four tools; the platform runs twenty
- **Headline:** The overrun counted four tools. The platform really runs twenty: 1,672 rollouts a year.
- **Visual:** v3's twenty rows with where each runs (everywhere, on-prem only, cloud only,
  a few), and the numbers side by side: the core 4 → 116 installs, 464 rollouts, 696 h;
  20 → 418 installs, 1,672 rollouts a year, 2,508 h by hand (three people). Click: through
  the pipeline, 80 approvals a year. (Placed after the overrun, as in v3, so the overrun's
  platform hours, which assume the core four, don't contradict it)
- **Energy:** 4
- **Into next:** twenty tools across the fleet. Here's what the pipeline is made of, starting with the order things roll out in.
- **Data:** v3 twenty-tools model

### waves

- **Act:** III · tag: platform team
- **Job:** a wave is a label on a cluster, and the rollout order is a dozen lines of ApplicationSet
- **Headline:** A wave is a label on the cluster, and the order is a dozen lines of ApplicationSet.
- **Visual:** left, `platform/prometheus/appset.yaml`: `strategy.type: RollingSync`, steps
  matching `wave` In `[test]`, `[canary]`, then `[prod]` with `maxUpdate: 25%`, and the template copying the cluster's label onto each Application.
  Right, v3's rings rippling outward from the test cluster, each ring labelled with its
  label value, and the 29 cluster secrets carrying `wave`. The catch: progressive
  sync is behind a controller flag; ⚠️ check maturity in our Argo CD
- **Energy:** 3
- **Into next:** a ring only moves outward when the step is healthy. Healthy means a gate.
- **Source:** GOALS §1.4; Argo CD docs (Progressive Syncs)

### gates

- **Act:** III · tag: platform team
- **Job:** a gate is a Job; a failed gate stops the wave before prod; LinkedIn's result
- **Headline:** A gate is a Job: exit 0 and the wave moves on, exit 1 and it stops before prod.
- **Visual:** left, the PostSync hook: a `batch/v1` Job annotated
  `argocd.argoproj.io/hook: PostSync`, `backoffLimit: 0`, running our check (targets up,
  rule evaluation errors zero, for 15 minutes). Right, the receipt: LinkedIn's gate slide
  (`02-canary-namespaces-linkedin/p22`), and under it their result in our type: a week per
  release became an hour; 10+ incidents caught before prod. The catch: Argo CD doesn't roll
  back on its own; the revert is one commit, and a bot can open it
- **Energy:** 4
- **Into next:** and the pipeline knows when not to run at all.
- **Source:** *Ship Faster, Ship Safer* (LinkedIn), 📎 p22, p25; GOALS §1.7(b)

### change-windows

- **Act:** III · tag: platform team
- **Job:** the freeze is config the cluster keeps; the platform team's time syncs go away
- **Headline:** A freeze is config: Argo CD holds the waves, and Kyverno holds everyone else.
- **Visual:** v3's eight-day strip across the top, on the dark ground now (snowfield is
  for the show's slides), with the prod wave pausing at Thursday's close and resuming
  Monday. Under it, two cards: the AppProject `syncWindows` allow window (`"0 9 * * 1-4"`,
  `8h`, `timeZone`), and, on a click, the `ChangeWindow` object (ours), projected from the
  change record, that a Kyverno rule reads, so kubectl, operators and agents meet the same
  window
- **Energy:** 2
- **Into next:** that's the platform team. Now the developers: where their app runs.
- **Source:** GOALS §2.3; Argo CD sync windows; *Look Before You Leap* (Agility Robotics, 📎)

### placement

- **Act:** IV · tag: developers
- **Job:** a developer writes labels, never a cluster name; the platform finds the clusters
- **Headline:** Developers write labels, not cluster names, and the 30th cluster costs them nothing.
- **Visual:** a before/after of a real app repo. Before: an Argo CD Application per cluster
  (`destination.name: ny4`) and `values-ny4.yaml`, `values-ch4.yaml`, … After: one
  `placement:` block in the app's repo (our API: `tier: prod`, `regions: [aws-1, aws-2]`,
  `fallback: cloud2`), and the ApplicationSet cluster generator it becomes
  (`selector.matchExpressions` on `tier` and `region`). A 30th cluster appears with the right
  labels and the app lands on it; nobody edits the repo. Small receipt: NVIDIA and
  Salesforce, *N Clusters, One kubectl*: "choose where the complexity lives"
- **Energy:** 3
- **Into next:** and because it's labels, the app already runs in both regions. So what
  happens when one of them goes?
- **Source:** GOALS §5.5, §5.1 A; `EKS-VS-ECS.md` rule 5; 📎 *N Clusters, One kubectl* p10

### failover

- **Act:** IV · tag: developers
- **Job:** the peak: lose a region and nothing moves but traffic; the RTO is a sum and the
  slowest layer is the data; the second cloud is a warm standby
- **Headline:** Lose a region and the app doesn't move: traffic, capacity and data do.
- **Visual:** see Visual direction (failover by layer). Four layers across both regions:
  traffic (Global Accelerator → Route 53 → Istio locality failover), delivery
  (ApplicationSet: the app runs in both, always), capacity (Auto Mode adds nodes), state
  (Aurora Global promotion). Clicks: region 1 fails; traffic swings; region 2 scales;
  the database promotes; the RTO bar fills by segment. The second cloud is a static column,
  not a click (a fifth click darkened both AWS regions and hid the payoff): traffic 0%,
  replicas scaled down, minimum nodes, and "cross-cloud copy: undecided" in the state row,
  under "if all of AWS goes: warm standby, or Karmada if the app must move"
- **Energy:** 5
- **Into next:** that's the first half: clusters from objects, tools in waves, apps by
  labels. Now the show's biggest topic.

### show-agents

- **Act:** V
- **Job:** the third takeaway's credibility: AI everywhere, on both sides of the problem
- **Headline:** AI was everywhere, solving problems on one stage and creating them on the next.
- **Visual:** from v3 as settled there: the four days, AI talks lit (228 of 501, nearly
  half); riffle; three stay, tagged: solves, Mastercard (an LLM drives 30 EKS clusters, every
  write reviewed); creates, Google Cloud keynote (agents break Kubernetes' identity
  assumptions); creates, ControlPlane and Docker (AI-found vulnerability reports swamp
  maintainers)
- **Energy:** 4
- **Into next:** and it arrives on our map three ways at once.
- **Source:** v3 narrative, "The show-* slides"
- **Source:** GOALS §5.1 B (four layers, the budget to write down, Karmada's trigger:
  workloads that can't run active/active); Bloomberg (Karmada; no deck)

### three-ways

- **Act:** V
- **Job:** the turn into the agent half: agents arrive three ways at once, each with a
  company that already lives with it; the three roles become the second half's tags
- **Headline:** Agents arrive three ways: as workloads, as users, and as attackers finding new holes daily.
- **Visual:** v3's three columns, with one named example under each, in place of the
  abstract line: workloads, Podium (each agent an isolated pod; 30% of merged PRs);
  users, Mastercard (an LLM driving 30 EKS clusters, every write reviewed); attackers,
  Metal3 (a maintainer's AI found 220 issues in a year; attackers have the same models).
  And "what answers it" per column: a Job spec and a runtime class; a gateway, Pod
  Identity, CEL rules; the lake, our agents, the waves
- **Energy:** 4
- **Into next:** workloads first. Here's one agent, as a pod.
- **Source:** Podium (abstract); 📎 *No RAG, No Regrets* (Mastercard); 📎 *AI Found a 0-Day
  in Metal3* (Ericsson); *Mythos vs Maintainers* (ControlPlane, Docker)

### agent-pod

- **Act:** V · tag: agents as workloads
- **Job:** an agent as a workload is an ordinary Job with five fields that matter
- **Headline:** An agent is a Job: sandboxed, on its own nodes, with a deadline, and gone when it's done.
- **Visual:** the Job spec, annotated: `runtimeClassName: gvisor`, `serviceAccountName`
  (Pod Identity, next act), `automountServiceAccountToken: false`, `activeDeadlineSeconds`,
  `ttlSecondsAfterFinished`, a toleration for the tainted `agents` NodePool. Callouts on
  the right tie each field to what it stops. Under it, a day of these spawning and
  vanishing on elastic nodes (v3's picture, small). The catch: Auto Mode can't run custom
  runtimes; the agents NodePool is self-managed Karpenter ⚠️
- **Energy:** 3
- **Into next:** `runtimeClassName` is the line that matters, because a container is not a cage.
- **Source:** `CLAUDE-AGENT-PLATFORM.md` (Jenkins-triggered agent pods); Podium (abstract);
  *Agent Sandbox on EKS* (AWS; no deck)

### sandbox

- **Act:** V · tag: agents as workloads
- **Job:** containment, accurately: three runtimes are alternatives, each with a syscall
  path, a cost and a place it can run
- **Headline:** A container shares the kernel; gVisor intercepts it, and Kata gives the agent its own.
- **Visual:** three columns side by side, each the path a syscall takes from the agent to
  the host: runc (straight to the host kernel); gVisor (into the Sentry, a user-space
  kernel, then a narrow set to the host); Kata (into a guest kernel inside a microVM). Under
  each: start-up, overhead, where it runs on AWS (any node · any node · metal or nested
  virt). The `RuntimeClass` that selects each (`handler: runsc`, `handler: kata`). Receipt
  line: Microsoft snapshots Kata VMs so a pod resumes instead of cold-starting
- **Energy:** 4
- **Into next:** that's agents as workloads. As users, they do things through tools.
- **Source:** GOALS §3.1; "Sandbox Your Agents" keynote (Red Hat); *Groundhog Pod*
  (Microsoft, pptx); *Untrusted Code on Secure Runtimes* (Google; no deck)

### mcp-gateway

- **Act:** V · tag: agents as users
- **Job:** MCP auth is three questions, and one gateway answers all three; one honest dissent
- **Headline:** MCP auth is three questions, and the gateway is where we answer all three.
- **Visual:** the three questions (who is calling and how do they prove it; who decides;
  what identity reaches the backend), each with our answer: workload identity; a Cedar
  policy at the gateway (one `permit`, shown); a scoped token per call, never the agent's.
  Receipt in our type (their p05 shows only question one): Stacklok and AWS, and Cedar's
  analysis. The dissent, on a click: Mastercard dropped MCP for built-in tools. The choice: Obot, ToolHive, or
  our own thin proxy, decided by where enforcement sits
- **Energy:** 3
- **Into next:** and the scoped token is the whole credentials story.
- **Source:** GOALS §3.4, §3.5; `GOALS-GAPS.md` §3.5; 📎 *What Can Your AI Agents Actually
  Do?* (AWS, Stacklok); 📎 *No RAG, No Regrets* (Mastercard)

### credentials

- **Act:** V · tag: agents as users
- **Job:** passwords never enter the agent; identity is a short-lived pass
- **Headline:** Agents get a short-lived identity; the passwords never enter the agent.
- **Visual:** as v3 (the pass exchanged at the gateway; the secret stays behind it), with
  the one command that wires it in AWS: `aws eks create-pod-identity-association` for the
  `triage-agent` service account, a read-only role. On-prem: a SPIFFE ID from SPIRE
- **Energy:** 3
- **Into next:** identity says who the agent is. Policy says what anyone may do.
- **Source:** GOALS §3.6, §9; 📎 *Every Kubernetes Object Deserves an Identity* (Defakto);
  *DO NOT Give AI Agents Credentials!* (Solo.io; no deck)

### policy-layer

- **Act:** V · tag: agents as users
- **Job:** one CEL rule set, written against the action, stops a person, the pipeline and
  an agent the same way, in CI and at admission
- **Headline:** One rule set checks every change, in CI and at admission, whoever made it.
- **Visual:** a ValidatingAdmissionPolicy with one CEL rule that never names an actor
  (every image from our registry, pinned by digest), and its binding as a comment. Three
  actors on the left (a person with kubectl, the pipeline, an agent) send the same change:
  the pipeline and the agent meet CI (`kyverno test`) first, the person's kubectl skips it,
  and all three meet admission. Click: the one denial message, the same for all three
- **Energy:** 3
- **Into next:** policy stops what shouldn't happen. Telemetry shows what did.
- **Source:** GOALS §2.1–§2.2 ("write policies against the action, not the actor");
  📎 *Goodbye Webhooks, Hello CEL* (Google) p07, p13

### one-view

- **Act:** VI
- **Job:** one correlated view for anyone debugging, person or agent, because the collector
  stamps the same attributes on everything
- **Headline:** One collector config stamps every signal with the same cluster, team and trace.
- **Visual:** left, the collector config: `k8sattributes` (namespace, pod, deployment; the
  `team` label from the namespace) and `resource` (`k8s.cluster.name: aws-1-prod`). Right,
  one incident as four rows sharing those values (an alert, a span, a log line, a k8s
  event), the shared values lit. Receipt: Yahoo, 86% fewer series and ≈ $140K a year on one
  cluster; the catch from the same talk: delta temporality silently breaks `rate()`
- **Energy:** 3
- **Into next:** and agents read it from a lake, not from production.
- **Source:** GOALS §4.2; 📎 *Two-Stage OTel Aggregation* (Yahoo) p02, p42

### the-lake

- **Act:** VI
- **Job:** agents decide from a read-only lake; name what's in it and how they read it
- **Headline:** Agents decide from a read-only lake, not from credentials to production.
- **Visual:** v3's range-and-lake composition, with the lake named: tables
  (`k8s.pods`, a snapshot every 15 minutes; `argocd.syncs`; `gates.results`; `mcp.calls`;
  `otel.*`), the read path (a read-only role, or a SQL tool through the gateway), and one
  query (a click, bottom left): which clusters run an image affected by a new CVE. The
  receipts (Mastercard's projections, 40 MB → 800 bytes; NVIDIA + Upbound's queryable audit
  layer) and the snapshot caveat are in the notes
- **Energy:** 4
- **Into next:** so give an agent its first job from the lake: the next alert.
- **Source:** GOALS §7; 📎 *One Recipe, Five Clouds, One Query* (NVIDIA, Upbound) p18;
  📎 *No RAG, No Regrets* (Mastercard) p30

### triage

- **Act:** VI
- **Job:** the second half's high: an agent doing its first job, explain-only, with real
  prices and an honest first-try number
- **Headline:** The first agent job is explaining alerts: $0.33 each at Verkada, 25% right on Salesforce's first try.
- **Visual:** see Visual direction (one alert, triaged). Alert: `KubePodCrashLooping`,
  `aws-1-prod`, namespace `payments`. The agent's card: verdict (real, not noise),
  severity and its basis, what changed (an Argo CD sync 12 minutes earlier bumped the
  image), links (runbook, dashboard, last three firings), suggested action (roll back the
  tag). The responder's accept / modify / reject, logged. Receipts under it: Verkada (4,700
  alerts a month, $0.33, 139 s median); Salesforce (25% → 60–80% after a curated knowledge
  base and evals, `15-aiops-salesforce/p06`, `p21`)
- **Energy:** 4
- **Into next:** that's our agents. Theirs are already at work on what we run.
- **Source:** GOALS §6 stage 1; Verkada (title and abstract); 📎 *1000 Clusters, 1 Smarter
  Brain* (Salesforce); k8sgpt, HolmesGPT (both read-only)
- **Demo option:** HolmesGPT or k8sgpt explaining a CrashLoopBackOff on dev, read-only,
  about two minutes

### new-holes

- **Act:** VII · tag: agents as attackers
- **Job:** the threat, made concrete, without v3's flawed 61 days
- **Headline:** AI finds holes faster than ever: CVEs nearly doubled in 2026, and one maintainer's AI found 220 in a year.
- **Visual:** as v3 (CVEs a year, 2016–2026, the 2026 bar in alpenglow at ~79k, "over 200 a
  day"), with Metal3's 220 told honestly: the maintainer's own pipeline; 22 security bugs,
  79 invalid or duplicate. Click: his first takeaway, "Shorten your upgrade cycle." No 61
  days; the notes say image patches don't wait for minor upgrades
- **Energy:** 3
- **Into next:** the answer isn't more people. NVIDIA showed what it is.
- **Source:** *Mythos vs Maintainers* p6 (⚠️ OpenCVE check); 📎 *AI Found a 0-Day in Metal3* (Ericsson)

### ship-the-check

- **Act:** VII · tag: agents as attackers
- **Job:** the receipt for patching at speed: ship the change with the check, and let an
  agent drive by reading a status field
- **Headline:** NVIDIA patched ~5,600 nodes in 30 minutes: an agent drove it by reading one status field.
- **Visual:** snowfield. NVIDIA's "the status enum let an agent drive the rollout"
  (`12-fleet-node-changes/p06`) as the hero; beside it their numbers (p07): 16 clusters,
  ~5,600 nodes, 30 minutes; two CVEs days apart, one controller; "the next CVE is a YAML
  change". Attribution under it
- **Energy:** 4
- **Into next:** put that next to everything we built, and the circle closes.
- **Source:** 📎 *5,000 Nodes in Minutes, Twice in a Week* (NVIDIA) p04, p06, p07

### patch-loop

- **Act:** VII · tag: agents as attackers
- **Job:** close the circle: our agents patch what theirs find, through the first half's
  waves, gates and windows, with authority kept in code
- **Headline:** Close the circle: our agents patch what theirs find, and the waves roll it out.
- **Visual:** v3's ring of five stations, now each with its object: a new CVE (their agent);
  the lake's one query; our agent's PR (one image digest); CI rules then the team (it can't
  approve itself); the waves (gated on status). "Days: CVE to every cluster" in the middle.
  Click: the PR as a diff card (the payments image digest, rebuilt with a patched OpenSSL).
  Click: "Models produce evidence. Code decides authority." (Transfix, four roles)
- **Energy:** 4
- **Into next:** five first pull requests get us there.
- **Source:** 📎 *Progressive Delivery for Trust* (Transfix) p09, p17; NVIDIA (above);
  *Fighting Fire with Fire* (KubeEdge; no deck)

### the-ask

- **Act:** Close
- **Job:** echo the opening with the ratio changed by the pipeline, then the ask as five
  first PRs
- **Headline:** Same team, same 29 clusters: five first pull requests start it this quarter.
- **Visual:** left, the opening's echo: 29 squares, the same three people, "1,672 hand
  rollouts" struck and "80 wave approvals a year" under it. Right, five numbered lines in the
  path colours, each a PR with the objects it adds: (1) `clusters/<next>.yaml`, a CAPI
  Cluster or a Region claim; (2) `wave:` on 29 cluster secrets, RollingSync, a gate Job,
  for splunk-otel-collector; (3) `regions/aws-2.yaml` and `placement.yaml`; (4)
  RuntimeClass, gateway, Pod Identity, CEL rules; (5) explain-only triage by Q2 2027, accept
  / modify / reject logged from day one. (The plane and fence from v3 collided with the
  list, so they're off this slide)
- **Energy:** 3
- **Into next:** end

## Bench

**ai-resize** (cut 2026-11-18, per the v3 review: the 61% is our model, Hertz posted no
deck, and it's a cost story inside the security act). Copied from v3 unchanged; restore
with a beat from v3's narrative.
