# Takeaways v3, in ten: the fleet outgrows one team, then the agents arrive

> **This is the ten-slide cut (draft `ten`, the default).** The full-length version, 36
> slides and about 37 minutes, is draft `main`; its story, editorial notes and every
> source note live in `narrative-main.md`. Both drafts share `slides/` and `theme/`.
> The ten never edit a slide `main` uses: kept slides were forked, merged ones are new.

Cut on 2026-11-20 because the readout decks were running long. Same spine (three
takeaways up front, each proved, then the ask), a quarter of the slides. Every number on
these slides was already in the long deck or its sources; the editorial notes in
`narrative-main.md` still hold (illustrative model, the CVE caveat, Karmada as an option,
no failure-case references, Ingress NGINX off the slides, "a small team", never a
headcount).

## Brief

- **Audience:** engineering, leads included: the people who run the clusters, the people
  who will run agents, and the people who decide what both teams work on.
- **Setting:** live, 12–15 minutes, then sent round. The notes carry the argument a reader
  needs; the long draft carries the rest.
- **They believe now:** cluster and app upgrades are routine work one experienced team
  handles. Where an app runs is a deployment detail. AI is a separate initiative, and its
  risks are mostly about the model.
- **They believe after:** the fleet will keep growing, so clusters come from code and every
  change rides one pipeline (waves, gates, windows), with placement by constraints so
  losing a region is a non-event. Agents arrive as workloads, users and attackers, so ours
  are caged and gated before they scale, and then they patch what attackers' agents find,
  through the same pipeline.
- **The one sentence:** the fleet will always outgrow a small team with a runbook, so
  every cluster, tool and app rides one automated path, and our agents, fenced in first,
  use that same path to patch what attackers' agents find.
- **The ask:** (1) no new hand-built clusters; (2) splunk-otel-collector through the wave
  pipeline this quarter; (3) AWS region 2 from one Crossplane claim on EKS Auto Mode, one
  app in both regions, placed by labels; (4) every agent gets a microVM, one gateway,
  short-lived identity and Kyverno before it triages one alert; (5) explain-only alert
  triage by Q2 2027, reading the OTel plane and the lake.

## Shape

- **Structure:** answer first, then problem → fix → payoff, told twice. The title states
  the three takeaways; the first half proves the first two on our own estate and peaks on
  failover; the one riffle turns to AI and proves the third; two slides answer it; the ask.
- **Acts:**
  - Open (1): `north-star`, the title and the three takeaways on three summits.
  - I, *the fleet outgrows us* (2): `another-cluster` (4 → 29 in six steps),
    `outruns-the-team` (by hand, the upgrades alone pass the team's year).
  - II, *run it like software* (3): `clusters-from-code`, `one-pipeline`, then the peak,
    `failover`.
  - III, *the agents arrive* (3): `show-agents-ten` (the riffle: AI on both sides),
    `three-fences` (cage, gate, out-patch), `close-the-circle`.
  - Close (1): `the-ask-ten`.
- **The peak:** `failover`, slide 6 of 10 (60%). Slide 2 ends on "fingers crossed" for the
  second cloud; here a region fails, then AWS, and the constraints never change. The slide
  before it is a notch quieter; the riffle after it is the breather.
- **The close:** the opening's three summits return as the plane and the fence across the
  range, the same small team at the gate, and five asks.
- **Pacing:** 4 3 4 3 3 5 3 4 4 3. One peak; no run of three highs.

### What was cut, and where it went

| Long-draft slides | In the ten | Why |
|---|---|---|
| `title`, `journey` | `north-star` | the title page now *is* the three takeaways |
| `day-one` … `second-cloud` (6) | `another-cluster` | the same map six times; now one map, six clicks |
| `one-runbook`, `tools-too`, `overrun` | `outruns-the-team` | one chart, one line, one crossing; the runbook detail goes to the notes |
| `kubeadm-past`, `region-claim` | `clusters-from-code` | both say "clusters come from code" |
| `show-delivery`, `twenty-tools`, `waves`, `gates`, `change-windows` | `one-pipeline` | one pipeline, one failed gate; 1,672 → 80 is the stake |
| `karmada`, `no-cluster-names` | `failover` | "a developer knows no cluster" is the card's caption |
| `show-fleet`, `show-delivery` | notes | one riffle earns its place; the fleet and delivery names are spoken |
| `ai-arrives` | cut | a set-up slide; the riffle turns the talk instead |
| `three-ways`, `elastic-agents`, `sandbox`, `mcp-tools`, `credentials`, `policy-layer` | `three-fences` | each way agents arrive gets its answer in one line |
| `one-view`, `the-lake`, `new-holes`, `patch-loop` | `close-the-circle` | the lake is a station on the loop; 98 days is the clock to beat |
| `ai-resize` | cut | illustrative, and its version claim is ⚠️ |
| `same-person`, `the-ask` | `the-ask-ten` | the echo and the ask on one page |

Dropped claims: the CVE-per-year chart (OpenCVE counts, still ⚠️ unchecked) and the Hertz
example (⚠️). Neither is on a slide in the ten.

## Visual direction

Builds on the long draft's direction (see `narrative-main.md`): Three Peaks brand, night
ground with dusk for the peak and the ask and snowfield for the one code slide; Barlow
Condensed display, Barlow body, JetBrains Mono for real objects; the background range
whose peaks rise per topic (fleet haze, delivery mint, agents teal); alpenglow only for
the team, its limit, a failed gate and the ask's dates; the north star in the corner,
brighter with the beat's Energy.

What the ten change:
- **Fewer, larger things.** Headlines at 80–88px, body at 30px and up, labels at 24px and
  up. Each slide keeps one picture from the long draft and drops the rest.
- **No group tags.** They encoded the long draft's three-panel overrun, which is gone. The
  range's risen peak says which takeaway a slide is on.
- **The growth rail** (`another-cluster`): the cluster count at each of six steps, each
  number set at a size proportional to its count, over the estate map that grows with
  it. Quantity as scale: 29 is seven times the height of 4.
- **One crossing** (`outruns-the-team`): seven stacked bars (clusters haze, tools mint,
  apps lake blue) against one alpenglow line, the team's year. The part of each bar above
  the line is the overrun.
- **The ripple rings** (`one-pipeline`): test, canary, wave 1, wave 2, prod as rings of
  clusters, a gate between each, the canary gate failed in alpenglow, outer rings dimmed.
- **The peak** keeps the long draft's motion moment: three clicks, chips moving from two
  regions to one, then to the second cloud.
- **The loop** (`close-the-circle`) is the waves' ripple closed into a ring.
- **As built (2026-11-20):** the range is sunk (no risen peak) behind the map, the chart,
  the code slide, the rings and the peak, where a risen cap collided with labels; it rises
  on the title, the riffle, `three-fences`, `close-the-circle` and the ask. No theme file
  changed: every new piece is in its slide's own `<style>`. `theme/gen/energy.mjs` was
  re-run after the narrative rewrite (it touches only the ten beats' slides).
- **Audit exceptions, accepted:** `dense` on seven slides, 77–130 words. The code slides
  (`clusters-from-code` 90, `failover` 86) count YAML tokens as words; `show-agents-ten`
  (130) counts the riffle cards that are hidden in the finished state; `close-the-circle`
  (110) is station labels plus two sourced numbers; `the-ask-ten` (117) is the ask, which
  is also read after the meeting. Nothing offstage, clipped or overlapping.
- **Anti-default check:** the title page isn't a logo card (it carries the three claims);
  no agenda; no "Questions?" close; no three-icon columns (`three-fences` columns are
  pictures of the problem with the answer as text, parallel on purpose).

## Beats

### north-star

- **Act:** Open
- **Job:** name the north star and give the whole talk in three claims before the story starts
- **Headline:** KubeCon 2027 north star: there's always another cluster, no manual way keeps up, and AI brings problems as it solves them.
- **Visual:** the title top left over the full range drawn large, a sky-to-mint disc behind
  the delivery summit. Each summit carries its takeaway, numbered in its cap colour
  (1 fleet haze, 2 delivery mint, 3 agents teal). The team's dotted alpenglow trail climbs
  from the foot of the fleet over all three summits toward the north star. One click per
  takeaway
- **Energy:** 4
- **Into next:** the first one is about us. It started at four clusters.
- **Source:** the long draft's `title` and `journey`

### another-cluster

- **Act:** I
- **Job:** takeaway one, on our own estate: every step was reasonable, and there's always a next one
- **Headline:** There's always another cluster: our four became twenty-nine in six reasonable steps.
- **Visual:** a rail of six counts, 4 · 7 · 11 · 17 · 23 · 29, each set at a size
  proportional to its count, with its step under it (day one; EKS for dev, qa and ftb; a
  second exchange; the migration; a second AWS region; a second cloud, "fingers crossed").
  Under it the estate map: on-prem (dev, staging, ny4, ch4 with its DR tie, the second
  exchange's four), AWS in two regions, the second cloud. The one small team in alpenglow
  at the foot. Five clicks, one step each; the finished slide shows all 29
- **Energy:** 3
- **Into next:** now look at what keeping all twenty-nine current costs, by hand.
- **Source:** our estate, as named by the user; LinkedIn (250+ clusters) and Salesforce
  (1,000) in the notes, from the long draft's `show-fleet`

### outruns-the-team

- **Act:** I
- **Job:** takeaway two: done by hand, the upgrade work alone outgrows the team's year
- **Headline:** No manual way keeps up: by the second cloud, the upgrades alone outrun the team's year.
- **Visual:** seven stacked bars, one per stage, with cluster upgrades (haze), tool
  upgrades (mint) and app upgrades (lake blue) stacked: 480, 786, 1,170, 1,728, 2,250,
  2,862 hours, then a dashed AI bar at 4,056. One alpenglow line across, "the team's year".
  The second-cloud bar crosses it; the overrun is marked. Labelled illustrative
- **Energy:** 4
- **Into next:** each band has a fix. The clusters first.
- **Data:** `assets/toil-model.json`, `team_model`. Illustrative model, not our
  measurements; the team's year is our assumption and names no headcount

### clusters-from-code

- **Act:** II
- **Job:** the fix for takeaway one: clusters are created and upgraded from code, not by hand
- **Headline:** So every cluster comes from code: a new region is one claim, an upgrade one field.
- **Visual:** snowfield. Left, a `Region` claim (mirror region 1, six clusters, Auto Mode),
  our own Crossplane v2 composite, as a code card; an arrow through Crossplane to a region
  box of six EKS clusters, arriving labelled and registered with Argo CD. Below the claim,
  the upgrade as a two-line version diff, and how it runs: Cluster API on-prem (kubeadm
  underneath), Auto Mode in AWS (every node replaced within 21 days). Proof: Meta runs
  ~100 clusters with ~15 engineers
- **Energy:** 3
- **Into next:** that takes the cluster band. The bigger bands are the tools and the apps.
- **Source:** `EKS-VS-ECS.md` §4; GOALS §10.1–10.2, §0.1 (Meta); EKS Auto Mode user guide
  (21 days, checked 2026-11-18); *We Have GitOps at Home* (Meta keynote)

### one-pipeline

- **Act:** II
- **Job:** the fix for takeaway two: tools and apps roll out like software, so the team approves instead of doing
- **Headline:** Every change rides one pipeline: 1,672 hand rollouts a year become 80 approvals.
- **Visual:** left, the stake: 1,672 (hand rollouts a year: twenty tools, four releases,
  every cluster) in grey over 80 (wave approvals) in mint, labelled illustrative. Centre,
  the ripple rings: test in the middle, then canary, wave 1, wave 2, prod, holding 1 + 1 +
  5 + 9 + 13 = our 29 clusters, a gate on the axis between each ring. Click: the test gate
  passes. Click: the canary gate fails (alpenglow ✗, "stops here"), and on the right "Wave 1
  never starts. Nobody is paged." with, under a rule, "Thursday's close? The wave waits for
  Monday on its own."
- **Energy:** 3
- **Into next:** clusters from code, changes through one pipeline. Now the day it matters.
- **Data:** `assets/toil-model.json`, `twenty_tools` (illustrative)
- **Source:** LinkedIn's canary pipeline (each gate an Argo CD PostSync Job; a week of
  manual testing to about an hour); GOALS §1.4, §1.7, §2.3

### failover

- **Act:** II
- **Job:** the peak: placement by constraints makes losing a region, or AWS, a non-event; pays off "fingers crossed"
- **Headline:** Lose a region, or all of AWS, and traffic fails over to wherever the constraints still hold.
- **Visual:** dusk. The estate map across the full width, six mint replica chips (with a
  soft glow) across both AWS regions. Click: region 1 goes dark, region 2 scales to six.
  Click: AWS goes dark ("AWS down"), the second cloud's zone lights mint and its warm
  standby takes the traffic. Click: "Nobody edited a file. Fingers uncrossed." Under the
  map, "All a developer writes. No cluster names." over one wide card, constraints beside
  asks; the three-line log beside it. Labels-not-names, "nothing moves" and Karmada as the
  option are in the notes, not on screen
- **Energy:** 5
- **Into next:** that's the fleet. Now the takeaway half the show was about.
- **Source:** GOALS §5.1 (worded to its B: live-live is a traffic, capacity and state
  problem); Bloomberg on Karmada (notes only)

### show-agents-ten

- **Act:** III
- **Job:** takeaway three, proved by the show: AI everywhere, on both sides of the problem
- **Headline:** AI brings problems as it solves them: nearly half the show, on both sides.
- **Visual:** the long draft's riffle, unchanged: the four days as boxes, AI talks lit in
  teal (228 of 501); session cards riffle past on entry; three stay, tagged: solves,
  Mastercard (an LLM drives 30 EKS clusters, every write reviewed); creates, Google Cloud
  (agents break Kubernetes' identity assumptions); creates, ControlPlane and Docker
  (AI-found vulnerability reports swamp maintainers)
- **Energy:** 3
- **Into next:** on our side, agents arrive three ways at once.
- **Source:** `theme/gen/schedule.mjs` (keyword match, approximate); each card checked
  against its abstract or deck (see `narrative-main.md`)

### three-fences

- **Act:** III
- **Job:** the three ways agents arrive, each with its answer: cage the workload, gate the user, out-patch the attacker
- **Headline:** Agents arrive three ways: cage the workload, gate the user, out-patch the attacker.
- **Visual:** three columns, parallel on purpose, from the long draft's `three-ways`: a
  node of apps and agents (teal); agents with passes through one gate in a fence to git,
  infra and kubectl (mint); their agents probing the tools we run, three rows holed
  (alpenglow). Under each picture, the answer large in its colour and one line of how: a
  microVM per agent pod (Nitro Sandbox on Auto Mode, Kata elsewhere); one MCP gateway,
  short-lived identity, one Kyverno policy for people and agents alike; our own agents,
  reading the lake, patching through the waves. One click per column
- **Energy:** 4
- **Into next:** the first two are fences. The third is a race, so here's how we run it.
- **Source:** GOALS §3.1, §3.4–3.6, §2.1–2.4, §9; "Sandbox Your Agents" keynote (Red Hat);
  *Cedar Analysis for MCP Servers* (AWS, Stacklok); EKS Auto Mode user guide (Nitro
  Sandbox, checked 2026-11-18)

### close-the-circle

- **Act:** III
- **Job:** the third answer, and the deck's join: our agents drive the first half's waves against what theirs find
- **Headline:** Close the circle: our agents patch what theirs find, and the waves roll it out in days.
- **Visual:** the ring of five stations, drawn on entry, clockwise from the top: a new hole
  lands (their agent, alpenglow); the lake finds it (which images, which clusters); our
  agent drafts the fix (a PR with its own check); the team approves (after policy); the
  waves roll it out (a failed gate stops it). "days" in the middle. Right: the clock today,
  98 days from Metal3's advisory to the last Ericsson release with the fix (alpenglow); and
  the proof it can be fast, NVIDIA's 30 minutes for ~5,600 nodes, agent-driven
- **Energy:** 4
- **Into next:** same small team, same pipeline. Five things get us there.
- **Source:** *AI Found a 0-Day in Metal3* (Ericsson: 220 findings, 22 security; GHSA
  published May 18, CCD 2.34.4 shipped Aug 24); *5,000 Nodes in Minutes, Twice in a Week*
  (NVIDIA, 🖼 `12-fleet-node-changes/p07`); *Fighting Fire with Fire* (KubeEdge; notes)

### the-ask-ten

- **Act:** Close
- **Job:** the ask, with the opening's echo: the same small team, eight times the clusters
- **Headline:** Stop building clusters by hand, pipeline one tool this quarter, and gate agents before they scale.
- **Visual:** dusk. Five numbered asks in path colours, the first two lit (today's asks),
  dates in alpenglow. Along the foot, all three peaks risen through the OTel plane, with
  the policy fence and a gate at each; the same small team, in alpenglow, at the first gate
- **Energy:** 3
- **Into next:** end
