# Rails, not runbooks

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Started 2026-11-19. **A compilation**: the best slides from every readout deck in
`docs/decks/`, put into one story with one look. Content is kept largely as it was in its
source deck; headlines, overview titles, transitions and tone were tuned so it reads as
one talk. The title describes the argument, not the process.

**Spine:** `takeaways-v4` (the most recent and most evidenced telling: every fix slide shows
the real object and a receipt from the show). Its theme, assets and 29 of its 30 slides
come across unchanged except for the edits listed below.

**Brought in from the other decks:**

| Slide | From | Why it earned a place | What changed |
|---|---|---|---|
| `title` | new | the user asked for a new title page | the three peaks large, with one rail track along their foot |
| `tools-too` | takeaways-v3 (also v2) | **kept at the user's request**: the fleet's version skew, −1/−2/−3/"?", is the most recognisable picture of hand rollouts | moved to the dark ground; −2 and "?" in alpenglow; headline now states the point ("almost none is current") |
| `stop-clicking-sync` | path1-deployments `the-trade` | the sharpest single line in any deck; the platform act's payoff | restyled dark; stage letters replaced by the object that delivers each gain; "rolls itself back" → "stops at the canary" |
| `authority` | path2-agents `authority` | ties the two halves: agents earn authority on the same rails releases earn waves | release row re-pointed from Argo Rollouts to this deck's waves and gates |
| `not-building` | eks-2030 `not-building` (+ path2 `scope`, path3 `paved-road`) | scope makes the ask credible | rebuilt in this deck's look; lines that contradicted this deck (no second cloud, no progressive sync) changed to match it |

**Considered and left out** (good slides, but they repeat a beat already here or argue a
different story): readout `the-line`, `fleets`, `17 of 501`; path1 `canary-gate`,
`no-cluster-names`; path2 `cold-open` ($0.33, now on `triage`), `the-default`, `itemize`,
`ladder`; path3 `cold-open` (40 days → 7, now on `skip-level`), `live-live` (now
`failover`), `upgrade-policy`, `restore`, `the-seam`; eks-2030 `guard-the-deletes` (the
v-series rule: no failure cases from other companies), `retrofit-tax`, `the-loop` (now
`patch-loop`); takeaways-v3 estate build-up (now one `estate-grows`), `ai-resize`; v4
`one-view` (cut for time; `the-lake` carries telemetry). ten-takeaways and eks-2030 each use
a different visual language, so only their content travels.

**Edits to v4's slides:** overview titles renamed for a consistent "claim in a few words"
voice; `journey`'s kicker is now "The short version" (the old "KubeCon 2027 north star"
title moved to the title page as "Rails, not runbooks"); transitions rewritten around the
cut `one-view` and the three inserted slides; `patch-loop` calls back to `authority`
instead of repeating Transfix's quote; process language in the notes ("our earlier drafts")
removed; `the-ask` closes on the title.

## Brief

- **Audience:** engineering, leads included: the people who run the clusters, the people
  who will run agents, and the people who decide what both teams work on. They know
  Kubernetes. They will ask "which field?" and "who did that?".
- **Setting:** live, about 40 minutes, two presenters (the fleet half, then the agents half),
  then sent round. The notes carry the argument for readers.
- **They believe now:** cluster and app upgrades are routine work one experienced team
  handles by hand. Multi-region is a deployment detail. AI is a separate initiative.
- **They believe after:** the work grows faster than the team, and peers at ten times our
  size already run it on rails: clusters as objects, tools in labelled waves behind gates
  and windows, apps placed by labels. Agents arrive as workloads, users and attackers; each
  has a concrete control, and they earn authority on the same rails releases do.
- **The one sentence:** peers run ten times our fleet with teams our size because every
  change, a person's or an agent's, rides one track of objects, gates, policy and
  telemetry; we can copy their config, not just their slogans.
- **The ask:** five first pull requests (as v4): the next cluster is a CAPI `Cluster` or a
  `Region` claim; splunk-otel-collector through `RollingSync` waves this quarter; AWS region
  2 from one claim, one app live in both; agents fenced (runtime class, gateway, Pod
  Identity, CEL) before they touch anything; explain-only alert triage by Q2 2027.

## Shape

- **Structure:** as v4, chronicle with a turn, told twice. The first half watches the estate
  and its tools grow until the team's year runs out, then fixes clusters, tools and
  placement with a peer's receipt each, and makes teams the trade. The second half puts
  agents on the same map, fences each of the three ways they arrive, shows how they earn
  authority on the same rails, gives them their first job, and closes the loop on
  attackers.
- **Acts:**
  - Open (3): title; Meta's ratio and ours; the three takeaways.
  - I, *what we run, what it costs* (5): the show's fleets; the estate grows to 29; one
    upgrade by hand; four tools on four trains; the overrun.
  - II, *cluster admins* (3): an upgrade is one field; LinkedIn's three minors; a region is
    one claim.
  - III, *platform team* (6): the show's pipelines; twenty tools; a wave is a label; a gate
    is a Job; a freeze is config; **stop clicking sync**.
  - IV, *developers* (2): labels, not cluster names; failover by layer (the peak).
  - V, *agents arrive* (7): the show's AI; three ways; an agent is a Job; not a cage; MCP
    auth; no passwords; one rule set.
  - VI, *agents earn trust* (3): the read-only lake; authority earned like a wave; one
    alert, triaged.
  - VII, *agents as attackers* (3): new holes daily; NVIDIA's status field; close the
    circle.
  - Close (2): what we won't build; five first pull requests.
- **The peak:** `failover`, slide 19 of 34 (56%). The second half's high is `triage`.
- **The close:** the deck opens on Meta's ratio and closes on the same small team and 29
  clusters with the job changed by the pipeline, and the title said once more.
- **Length:** 34 slides; about 40 minutes.

## Editorial notes

All of v4's editorial notes hold and are not repeated here: see
`docs/decks/takeaways-v4/narrative.md`, "Editorial notes" (snippet fields are real, values
illustrative; the ⚠️ checks on `RollingSync`, sandbox limits, `automountServiceAccountToken`
with Pod Identity, the LinkedIn number conflict, the CVE chart; the toil model is
illustrative and its team size is an assumption, kept off the slides: "a small team", never a number; no failure cases from other companies;
Ingress NGINX stays off the slides). Added here:
- `tools-too`'s grid is seeded and illustrative, and says so on the slide.
- `not-building`'s "a third of the AI talks were about running models" is eks-2030's count
  of session titles (signal strength, not a census).
- `stop-clicking-sync` asserts we click sync today (GOALS §1; path1 `stage-zero`).

## Visual direction

v4's, unchanged: the Three Peaks brand, the background range with the north star whose
brightness follows Energy (`theme/gen/energy.mjs`), the estate map, the group tags, the team
in alpenglow, the code card, the receipt, the catch, and **snowfield means the picture is
someone else's slide** (which is why `tools-too` moved to the dark ground).

Added for this deck:
- **The rails** (title only): one track, two rails and sleepers in mint, along the foot of
  the three peaks, a stop under each. The title's metaphor, drawn once; the deck's existing
  pictures (waves, gates, the loop) carry it after that.
- **The ledger** (`not-building`): struck items in v4's `.del` colours (muted alpenglow),
  what we use instead in mint, so it reads as the deck's diff language at full size.
- Ported slides use the deck's tokens only: no path-colour grounds (path1's mint ground,
  path2's teal accents) and no stage letters from the path decks.

## Beats

### title

- **Act:** Open
- **Job:** name the argument before the first fact: change should run on rails, not on runbooks
- **Headline:** Rails, not runbooks
- **Visual:** the three peaks drawn large (fleet, delivery, agents) under the disc, and one
  rail track along the foot of the range with a stop under each peak: one track every
  change rides. Subtitle: "One team, a fleet that keeps growing, and the AI agents arriving
  on it." Byline: Evan and Kyle, Salt Lake City, November 9–12
- **Energy:** 4
- **Into next:** the whole argument in one line; now one number to start.
- **Source:** new for this deck. The rails echo eks-2030's "the same rails" and the v-series
  range.

### cold-open

- **Act:** Open
- **Job:** earn attention with the contrast an engineer can't ignore: a peer runs a fleet
  with a small team, and the difference is what does the work, not headcount
- **Headline:** Meta runs ~100 clusters with ~15 engineers. We run 29 with a small team, by hand.
- **Visual:** two fields at the same scale, one square per cluster: Meta's 100 squares with
  one figure per engineer (15); ours, 29 squares and "one small team", no figures (no
  headcount on the slide, user 2026-11-20). Click: what does the upgrades, at the right of
  each band: "code" for Meta, "people" for us in alpenglow. Click: "Fifteen engineers can
  run a hundred clusters. The difference is what does the upgrades."
- **Energy:** 4
- **Into next:** none of them got there by hiring. Here's what we brought back.
- **Source:** GOALS §0.1 (Meta keynote abstract, *We Have GitOps at Home*). Our team is
  "a small team" on every slide; no headcount.

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
  tally climbs: 4 → 29 clusters, 20 → 65 apps, 640 → 4,000 pods. The team stays the same
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

### tools-too

- **Act:** I
- **Job:** the multiplication nobody budgets: every cluster carries tools on their own trains,
  and hand rollouts leave the fleet versions behind
- **Headline:** Every cluster also runs four platform tools on four release trains, and almost none is current.
- **Visual:** from takeaways-v3, moved to the dark ground (snowfield is reserved for the
  show's slides): 29 clusters across the top in three zones, Argo CD, Prometheus,
  splunk-otel and Karpenter down the side, each cell the version skew (latest, −1, −2/−3,
  "?"). The −2s and "?"s in alpenglow. Tally: 7 of 108 installs current (illustrative,
  seeded). Four tools to keep the picture readable; the real twenty come back after
  `show-delivery`
- **Energy:** 3
- **Into next:** add the clusters, the tools and the apps together, against the team's year.
- **Source:** takeaways-v3 `tools-too` (kept at the user's request). Release cadences are
  rough; the grid is illustrative.

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
  The source line quotes the EKS user guide: AWS picks the node image; nodes live at most
  21 days (checked 2026-11-18)
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
- **Headline:** That count used four tools. The platform really runs twenty: 1,672 rollouts a year.
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
- **Into next:** that's the platform team's whole kit: waves, gates, windows. Which means we
  can finally make teams an offer.
- **Source:** GOALS §2.3; Argo CD sync windows; *Look Before You Leap* (Agility Robotics, 📎)

### stop-clicking-sync

- **Act:** III
- **Job:** the platform act's payoff and breather: the trade that gets teams off manual sync
- **Headline:** Stop clicking sync.
- **Visual:** pure type on the dark ground. The setup line ("Teams don't resist auto-sync
  because they like clicking…"), "Stop clicking sync." huge, then three gains, each tagged
  with the object that delivers it: `syncWindows` (nothing ships during a freeze), `PostSync
  gate` (a bad version stops at the canary), `kyverno test` (a policy violation fails in
  CI, not at 2am). A greyed SYNC button struck through in alpenglow: what teams give up,
  last
- **Energy:** 4
- **Into next:** that's the platform team; now developers, and where their app runs.
- **Source:** path1-deployments `the-trade`, restyled. "A bad version rolls itself back"
  became "stops at the canary" to match `gates` (Argo CD doesn't roll back by itself).
  Today's manual sync: GOALS §1, path1 `stage-zero`.

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
- **Visual:** the Job spec, annotated: `runtimeClassName: isolated-sandbox` (Nitro
  Sandbox, built into Auto Mode), `serviceAccountName` (Pod Identity, next act),
  `automountServiceAccountToken: false`, `activeDeadlineSeconds`, `ttlSecondsAfterFinished`,
  a nodeSelector and toleration for the tainted `agents` NodePool. Callouts on the right tie
  each field to what it does. The catch: Kubernetes 1.36+ on existing Auto Mode clusters,
  no GPU passthrough; on-prem the same line names gVisor or Kata
- **Energy:** 3
- **Into next:** `runtimeClassName` is the line that matters, because a container is not a cage.
- **Source:** `CLAUDE-AGENT-PLATFORM.md` (Jenkins-triggered agent pods); Podium (abstract);
  *Agent Sandbox on EKS* (AWS; no deck)

### sandbox

- **Act:** V · tag: agents as workloads
- **Job:** containment, accurately: three runtimes are alternatives, each with a syscall
  path, a cost and a place it can run
- **Headline:** A container shares the kernel; gVisor intercepts it, and a microVM gives the agent its own.
- **Visual:** three columns side by side, each the path a syscall takes from the agent to
  the host: runc (straight to the host kernel); gVisor (into the Sentry, a user-space
  kernel, then a narrow set to the host); a microVM (into a guest kernel: Kata on our KVM
  hosts on-prem, Nitro Sandbox's Firecracker in Auto Mode). Under each: start-up, cost,
  where, and the class (`runc`, `runsc`, `kata · isolated-sandbox`). Verdicts: not for
  agent code; our on-prem default; our default in AWS. Source line: the EKS user guide's
  Nitro Sandbox quote; Microsoft's Kata snapshots
- **Energy:** 4
- **Into next:** that's agents as workloads. As users, they do things through tools.
- **Source:** GOALS §3.1; EKS user guide (Nitro Sandbox); "Sandbox Your Agents" keynote
  (Red Hat); *Groundhog Pod* (Microsoft, pptx); *Untrusted Code on Secure Runtimes* (Google;
  no deck)

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
- **Into next:** what may an agent do with what it reads? It earns that, the way a release does.
- **Source:** GOALS §7; 📎 *One Recipe, Five Clouds, One Query* (NVIDIA, Upbound) p18;
  📎 *No RAG, No Regrets* (Mastercard) p30

### authority

- **Act:** VI
- **Job:** tie the two halves together: agents earn authority on the same rails releases
  earn waves, and the first rung (shadow mode) is the job on the next slide
- **Headline:** An agent earns the right to act the way a release earns a wave.
- **Visual:** two parallel rails, five stations. Top (haze): a release, from the first half:
  canary wave, PostSync gate, `exit 0`, the prod wave, stop and revert. Bottom (teal): an
  agent: shadow mode (lit mint: where every agent starts), grade the work, eligibility
  rule, a permission PR, revoke the grant. Transfix's line at the foot
- **Energy:** 4
- **Into next:** rung one is shadow mode; here it is on a real job, the next alert.
- **Source:** path2-agents `authority` (Transfix, *Progressive Delivery for Trust*, p9, p17);
  the release row re-pointed from Argo Rollouts to this deck's waves and gates.

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
- **Into next:** before the ask, what we won't build.
- **Source:** 📎 *Progressive Delivery for Trust* (Transfix) p09, p17; NVIDIA (above);
  *Fighting Fire with Fire* (KubeEdge; no deck)

### not-building

- **Act:** Close
- **Job:** scope: make the ask credible by naming what we won't build
- **Headline:** We won't build what we can call, compose or already run.
- **Visual:** a ledger. Left, struck in alpenglow: GPUs and model serving; a second
  container orchestrator; our own agent framework; a promotion product; a new observability
  backend; a developer portal before the road. Right, in mint: what we use instead
- **Energy:** 2
- **Into next:** that leaves five pull requests.
- **Source:** eks-2030 `not-building` and `skip-the-gpus` (a third of the AI talks were
  about running models), path2 `scope` and `the-turn`, path3 `third-platform` and
  `paved-road`, EKS-VS-ECS.md. Lines that contradicted this deck (no second cloud, no
  progressive sync) were changed to match it.

### the-ask

- **Act:** Close
- **Job:** echo the opening with the ratio changed by the pipeline, then the ask as five
  first PRs
- **Headline:** Same team, same 29 clusters: five first pull requests start it this quarter.
- **Visual:** left, the opening's echo: 29 squares, the same roped team, "1,672 hand
  rollouts" struck and "80 wave approvals a year" under it. Right, five numbered lines in the
  path colours, each a PR with the objects it adds: (1) `clusters/<next>.yaml`, a CAPI
  Cluster or a Region claim; (2) `wave:` on 29 cluster secrets, RollingSync, a gate Job,
  for splunk-otel-collector; (3) `regions/aws-2.yaml` and `placement.yaml`; (4)
  isolated-sandbox, gateway, Pod Identity, CEL rules; (5) explain-only triage by Q2 2027, accept
  / modify / reject logged from day one. (The plane and fence from v3 collided with the
  list, so they're off this slide)
- **Energy:** 3
- **Into next:** end
