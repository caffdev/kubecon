# Rails, not runbooks

> **This is the ten-slide telling (draft `ten`, the default).** The full-length version, 34
> slides and about 40 minutes, is draft `main`; its story, sources and the list of where each
> slide came from are in `narrative-main.md`. Both drafts share `slides/` and `theme/`: the
> ten-slide draft never edits a slide `main` uses, it forks it (`*-ten`, or a new slug for a
> merged slide).

Started 2026-11-20 from `main`, after feedback that the readout decks run too long. One
slide each for the problem, the turn, the receipts, the peak and the ask; the agent half
in three; nothing that only sets up, lists or repeats.

## Brief

- **Audience:** engineering, leads included: the people who run the clusters, the people
  who will run agents, and the people who decide what both teams work on. They know
  Kubernetes. They will ask "which field?" and "who did that?".
- **Setting:** live, 12–15 minutes, one or two presenters, then sent round. The notes carry
  the argument for readers; the full evidence is draft `main`.
- **They believe now:** cluster, tool and app upgrades are routine work one experienced team
  handles by hand. Multi-region is a deployment detail. AI is a separate initiative.
- **They believe after:** the work grows with every cluster and every tool, faster than the
  team; peers at ten times our size run it on rails: a change is a field, a wave is a
  label, a gate is a Job. The same rails carry agents: fenced in, earning authority rung by
  rung, and fast enough to patch what attackers' agents find.
- **The one sentence:** peers run ten times our fleet with teams our size because every
  change, a person's or an agent's, rides the same rails; we can copy their config, and five
  pull requests this quarter start it.
- **The ask:** five first pull requests: the next cluster is a CAPI `Cluster` or a `Region`
  claim; splunk-otel-collector through `RollingSync` waves this quarter; AWS region 2 from
  one claim, one app live in both; agents fenced (runtime class, gateway, Pod Identity, CEL)
  before they touch anything; explain-only alert triage by Q2 2027.

## Shape

- **Structure:** problem → turn → proof → ask, told once for the fleet and once for agents.
  It suits an engineering audience being asked to adopt something: the pain is theirs, the
  turn is a reframe they can check in config, the proof is a peer's slide, and the ask is
  small enough to say yes to in the room.
- **Acts:**
  - Open (2): the title; Meta's ratio and ours.
  - I, *by hand, then on rails* (3): the upkeep we carry; the turn (field, label, Job); the
    receipts (LinkedIn, both halves of it).
  - II, *the payoff* (1): failover by layer, the peak.
  - III, *agents on the same rails* (3): three ways they arrive; authority earned rung by
    rung, starting with alerts; the circle closed against attackers.
  - Close (1): five first pull requests.
- **Pacing:** 3 · 4 · 3 · 4 · 3 · **5** · 3 · 4 · 4 · 3. The peak is `failover-ten`, slide 6
  of 10 (60%); the snowfield receipts before it and the quieter three-ways after it are the
  breathers.
- **The close:** opens on Meta's ratio and "by hand"; closes on the same small team and 29
  clusters, 1,672 hand rollouts struck for 80 wave approvals, and the title said once more.
- **Length:** 10 slides; notes ≈ 2,180 words, about 14 minutes spoken.

### What was cut, and where it went

| Cut from `main` | Why | Where its value went |
|---|---|---|
| `journey`, `show-fleet`, `show-delivery`, `show-agents` | agenda and credibility set-up; they argue nothing a receipt doesn't | the receipts on `receipts`, `three-ways-ten`, `first-job`, `close-the-circle` |
| `estate-grows`, `one-runbook`, `tools-too`, `overrun`, `twenty-tools` | five slides for one point: the upkeep outgrows the team | `upkeep` (one picture: 1,672 marks); the 54 kubeadm steps in its notes |
| `capi-diff`, `region-claim`, `waves`, `gates`, `change-windows`, `stop-clicking-sync` | six slides for one mechanism | `the-rails` (field, label, Job, freeze on one track); CAPI and the Region claim in the ask |
| `skip-level`, LinkedIn's result on `gates` | two receipts from one peer, kept as one | `receipts` |
| `placement` | the label is the reason failover works, not a beat of its own | `failover-ten`'s delivery row |
| `agent-pod`, `sandbox`, `mcp-gateway`, `credentials`, `policy-layer` | five controls, one idea: fence agents in | `three-ways-ten`'s fence row; detail in its notes |
| `the-lake` | the read path, not the argument | the notes of `close-the-circle` |
| `authority`, `triage` | the same idea at two zooms | `first-job` |
| `new-holes`, `ship-the-check`, `patch-loop` | the threat, the receipt and the answer, three slides for one | `close-the-circle`; the ⚠️ CVE chart is dropped |
| `not-building` | scope, said in a breath before the ask | the notes of `the-ask-ten` |

## Editorial notes

All of `narrative-main.md`'s editorial notes hold (and through it, `takeaways-v4`'s). The ones
that bite on these ten slides:

- **The toil model is illustrative** (`assets/toil-model.json`): 418 installs, 1,672 rollouts a
  year, 80 wave approvals. Every slide that shows one says "illustrative". Its team size is
  an assumption and never appears: our team is "a small team", and no slide draws a
  countable team (the roped three-climber glyph is not used in this draft).
- **⚠️ still on a slide, with its catch:** `RollingSync` maturity (`the-rails`); LinkedIn's
  skip-level ran on their own tooling, so kubeadm/CAPI support for emulated versions is
  unchecked (`receipts`). LinkedIn's cluster count conflicts between abstract (300) and deck
  (250+); `receipts` quotes the deck, on the deck's own slide.
- **Dropped rather than caveated:** the CVE-growth chart (⚠️ OpenCVE check) and
  `agent-sandbox` CRDs.
- Snippet values are ours and illustrative (the payments digest, `ny4`, label values); the
  kinds and fields are real. The one diff on `the-rails` (a person's change) returns on
  `close-the-circle` opened by an agent, on purpose.
- No failure cases from other companies; the outage on `failover-ten` and the failed gate on
  `the-rails` are our illustrations. Ingress NGINX stays off the slides.

## Visual direction

`main`'s, raised rather than replaced: the Three Peaks brand, night and dusk grounds, the
background range with the north star whose brightness follows Energy, the code card, the
receipt, the catch, and **snowfield means the picture is someone else's slide** (only
`receipts` here).

- **Palette (unchanged tokens):** night `#070b0e` and dusk `#0f2230` grounds; snow `#e8f4f2`
  ink; lichen `#9fb4b6` quiet text; **mint `#9cf0e1` is the rails**; haze `#68b6c3` the fleet;
  teal `#36baa2` agents; alpenglow `#f4a261` for what's done by hand, a failed gate, an
  attacker, and the ask's date. Snowfield `#e9f1f0` with slate `#0f1e29` for the show.
- **Type:** Barlow Condensed for display, Barlow for body, JetBrains Mono for objects.
- **Signature element: the rails.** Two mint rails with sleepers, drawn only where something
  rides them: along the foot of the title's range; full width on `the-rails` (the deck's
  main new picture); as the rungs an agent climbs on `first-job`; bent into the ring on
  `close-the-circle`; standing upright as the five stops of the ask. Theme classes `.rl-*`,
  added to `theme.css` without touching `main`'s rules. Runbook work is the opposite
  texture: small repeated marks in haze with alpenglow totals (`upkeep`).
- **Concepts as pictures:** quantity is real counts (a tick per hand rollout, a square per
  cluster); a mechanism is a track with stations; a peer's result is their own slide;
  recovery is a sum of segments.
- **Layout:** 120 px side margins, headlines top-left at 72–88 px, the picture taking the
  lower two-thirds. No group tags (they indexed `main`'s three-group structure, which this
  draft doesn't have). Neighbours alternate: grid → field-of-marks → track → twin receipts
  on snow → layered table (peak) → three columns → rung track over cards → ring → vertical
  track.

```
the-rails (the turn)                          failover-ten (the peak)
┌──────────────────────────────────────┐      ┌──────────────────────────────────────┐
│ On rails, a change is one field, …   │      │ Lose a region and the app doesn't …  │
│ ┌diff──────┐   ▲     ▲▲▲    ▲▲▲▲▲▲▲   │      │        region 1 │ region 2 │ cloud 2 │
│ │- image   │  test  canary   prod     │      │ traffic  ░░░░    ████████    ░        │
│ │+ image   │                          │      │ delivery ■■■     ■■■         □□□      │
│ └──────────┘                          │      │ capacity ■■■     ■■■■■■      min      │
│ ═╪═╪═╪═[■]═╪═╪═|gate|═[■]═|gate|═[■]═▶ │      │ state    ◖       ◖ promoted  ?        │
│            wave:test  ╲exit 1: stop   │      │ RTO = ▬▬ + ▬▬▬ + ▬▬▬▬ + ▬▬▬▬▬▬▬       │
│ Nobody clicks sync: 1,672 → 80        │      │                                      │
│ ⚠ RollingSync behind a flag           │      │                                      │
└──────────────────────────────────────┘      └──────────────────────────────────────┘
```

- **Motion moment:** the peak's four clicks (region 1 fails; traffic swings; region 2
  scales; the writer promotes) with the RTO bar filling a segment per click. Elsewhere the
  rails draw themselves in on entrance and nothing else moves without a reason.
- **Anti-default check.** The risk in cutting to ten is the "summary deck": title-and-bullets
  slides that name what the long deck showed. Changed: every merged slide is one new picture
  (1,672 marks; one track; a rung rail over a real alert), not two old slides on one page;
  no agenda, no section dividers, no "Questions?"; the ask is a track of five stops, not a
  numbered list in a card; code appears only where the object is the point.

**As built (2026-11-20):**

- 10 slides; notes ≈ 2,180 words, about 14 minutes at 150–155 words a minute.
- New files, all additive: `theme/rails.js` (the track helper), the `.rl-*` block at the end
  of `theme/theme.css`, and `assets/stage/canary-namespaces-linkedin-p25.png` (LinkedIn's
  canary result, from `deck-assets/02-canary-namespaces-linkedin/p25`). Draft `main`'s slides
  and rules are untouched.
- The roped three-climber team glyph is replaced by the words "one small team" (`the-ask-ten`)
  and a check mark (`close-the-circle`), so no slide draws a countable team.
- **Audit exceptions, accepted:** every slide but the title and the cold open is flagged
  `dense` (71–154 words). The count is mostly labels inside the pictures, code and receipts'
  attributions; body copy was cut to one line per idea. Nothing is offstage, clipped or
  overlapping.
- Tried and changed: the siding first left the main line before the canary gate and crossed
  its label; it now leaves after the gate. The prod wave as a 5×5 block towered over the
  headline; it's three rows. The rung labels sat under the track and collided with the zoom
  cone; they're above it.

## Beats

### title-ten

- **Act:** Open
- **Job:** name the argument before the first fact: change should run on rails, not on runbooks
- **Headline:** Rails, not runbooks
- **Visual:** `main`'s title: the three peaks large under the disc (fleet, delivery,
  agents), one mint rail track along their foot with a stop under each. Subtitle: "One small
  team, a fleet that keeps growing, and the AI agents arriving on it." Byline: Evan and
  Kyle, from four days in Salt Lake City, November 9–12
- **Energy:** 3
- **Into next:** the whole argument in one line; now one number to start.
- **Source:** forked from `title`; subtitle says "small team", notes cut to the short talk.

### cold-open-ten

- **Act:** Open
- **Job:** earn attention with the contrast an engineer can't ignore: a peer runs a bigger
  fleet with a small team, and the difference is what does the work, not headcount
- **Headline:** Meta runs ~100 clusters with ~15 engineers. We run 29 with a small team, by hand.
- **Visual:** two bands at the same scale, one square per cluster: Meta's 100 with fifteen
  figures; ours, 29 squares and "one small team", no figures. Click: what does the upgrades:
  "code" for Meta, "people" for us in alpenglow. Click: "Fifteen engineers can run a hundred
  clusters. The difference is what does the upgrades."
- **Energy:** 4
- **Into next:** here's what "by hand" adds up to for us.
- **Source:** forked from `cold-open`; notes trimmed. Meta: keynote abstract, *We Have GitOps
  at Home* (GOALS §0.1).

### upkeep

- **Act:** I
- **Job:** the problem, felt: by hand, the work is clusters × tools, and every new cluster adds
  a column the same small team pays for
- **Headline:** By hand, twenty tools on 29 clusters is 1,672 rollouts a year.
- **Visual:** the estate as a field of marks. 29 columns, one per cluster, grouped on-prem 8 ·
  AWS 15 · second cloud 6; 20 rows, one per platform tool, grouped by where it runs (12 on
  all 29, 2 on-prem only, 2 cloud only, 4 on a few). Every install is a cell of four haze
  ticks, one per release a year: 418 cells, 1,672 ticks. Three dashed columns at the right
  edge: the next clusters. Click: "418 installs × 4 releases a year = 1,672 rollouts, by
  one small team", the total and the team in alpenglow. Model tag: illustrative, and what
  isn't counted (Kubernetes itself, kubeadm's 54 steps a cluster, three minors a year; the
  apps)
- **Energy:** 3
- **Into next:** peers ten times our size don't do this by hand. They put the change on rails.
- **Data:** `assets/toil-model.json` (`twenty_tools`), illustrative
- **Merged from:** `estate-grows`, `one-runbook` (54 kubeadm steps, in the notes),
  `tools-too`, `overrun`, `twenty-tools`

### the-rails

- **Act:** I
- **Job:** the turn: a rollout stops being a procedure and becomes three objects on one
  track, and teams can stop clicking sync because the track carries their change control
- **Headline:** On rails, a change is one field, a wave is a label, and a gate is a Job.
- **Visual:** the deck's signature at full width: one mint track across the slide. At the
  left, the change: a code card with one diff line (`image: payments@sha256:9f1c…` struck,
  `…4a7e…` added). Three stations along the track, each a wave with its clusters drawn
  above it (test 1, canary 3, prod 25 in three rows, "25% at a time, Mon–Thu") and its
  label over the stop (`wave: test`, `wave: canary`, `wave: prod`); the change card rides
  the track on two wheels. Between the stations, gates: a `Job` box on the track, `exit 0`
  and "next wave" beneath; after the canary gate, `exit 1` turns off onto a short alpenglow
  siding that ends at a buffer, "stops before prod". The window (`syncWindows`) and "the
  revert is one commit" are in the notes. Click by click: the waves, the gates, then the
  payoff: "Nobody clicks sync: 1,672 hand rollouts become 80 wave approvals a year"
  (illustrative model). The catch: RollingSync is behind a controller flag
- **Energy:** 4
- **Into next:** that's the shape. Here's a peer who already runs it, at ten times our size.
- **Source:** GOALS §1.4, §1.7(b), §2.3; Argo CD docs (Progressive Syncs, sync windows,
  resource hooks); CAPI `Cluster.spec.topology.version` in the notes
- **Merged from:** `capi-diff`, `region-claim`, `waves`, `gates`, `change-windows`,
  `stop-clicking-sync`

### receipts

- **Act:** I
- **Job:** the proof: one peer at about ten times our fleet runs both halves of the turn,
  clusters and releases, and the numbers moved by days and weeks, not percent
- **Headline:** LinkedIn runs 250+ clusters on rails: 40 days became 7, and a week became an hour.
- **Visual:** snowfield (the show's slides). Two lifted LinkedIn slides side by side, the
  same size: skip-level's result (p02, three minors: six fleet waves and 40 business days →
  one rollout and a promotion, 7) and the canary pipeline's result (p25, "From a week of
  hoping to an hour of proof"), each with one alpenglow ring on the row that matters and its
  attribution under it. Under each, the number in our type: 40 → 7 business days; 1 week →
  1 hour per release. The catch: their own tooling ran the skip-level upgrade
- **Energy:** 3
- **Into next:** clusters and tools on rails. Now what it buys the people who write the apps.
- **Source:** 📎 *Binary Version Is Not Behavior* (LinkedIn) p02; 📎 *Ship Faster, Ship
  Safer* (LinkedIn) p25. ⚠️ skip-level needs kubeadm/CAPI emulated-version support; the
  cluster count follows the deck, not the abstract
- **Merged from:** `skip-level`, the LinkedIn receipt on `gates`

### failover-ten

- **Act:** II
- **Job:** the peak: because placement is a label, the app already runs in both regions;
  losing one moves traffic, capacity and data, and recovery time is a sum whose biggest
  term is the data
- **Headline:** Lose a region and the app doesn't move: traffic, capacity and data do.
- **Visual:** `main`'s failover by layer. Four layers (traffic, delivery, capacity, state)
  across AWS region 1, AWS region 2 and the second cloud; the delivery row now reads
  `placement:` both regions, by label. Clicks: region 1 fails; traffic swings to 100% in
  region 2; region 2 scales 3 → 6 nodes; the replica is promoted to writer. Under it the RTO
  bar fills one segment per click (detect, traffic, scale-up, data), data the longest, in
  alpenglow. The second cloud is static: warm standby, cross-cloud copy undecided
- **Energy:** 5
- **Into next:** that's the fleet half: clusters, tools and apps on rails. Now the show's
  biggest topic.
- **Source:** GOALS §5.1 B, §5.5; `EKS-VS-ECS.md` rule 5; Bloomberg (Karmada; no deck)
- **Merged from:** `failover`, `placement`

### three-ways-ten

- **Act:** III
- **Job:** the turn of the agent half: agents arrive three ways at once; two can be fenced in
  with objects we already know, and the third can only be outrun
- **Headline:** Agents arrive three ways: we fence in two, and we have to outrun the third.
- **Visual:** three columns, each a small picture and a company already living with it:
  workloads (agents and apps side by side on a node; Podium, every agent an isolated pod,
  30% of merged PRs); users (agents through one gate to git, infra and kubectl;
  Mastercard, an LLM driving 30 EKS clusters, every write reviewed); attackers (their agents
  probing the tools we run; Metal3, a maintainer's AI found 220 issues in a year, attackers
  have the same models). Under each, the fence as objects: `runtimeClassName:
  isolated-sandbox`; a gateway, Pod Identity, the same CEL rule as people; and for
  attackers, "No fence: outrun it: our agents, through the same waves" in alpenglow. The
  catch: Nitro Sandbox needs Kubernetes 1.36+ on existing Auto Mode clusters and has no GPU
  passthrough yet; on-prem, gVisor or Kata. Each column builds on a click
- **Energy:** 3
- **Into next:** fenced in is where an agent starts. Here's how it earns more.
- **Source:** Podium (abstract); 📎 *No RAG, No Regrets* (Mastercard); 📎 *AI Found a 0-Day in
  Metal3* (Ericsson); EKS user guide (Nitro Sandbox, checked 2026-11-18); GOALS §2.1–§2.2,
  §3.1, §3.4–§3.6
- **Merged from:** `show-agents`, `three-ways`, `agent-pod`, `sandbox`, `mcp-gateway`,
  `credentials`, `policy-layer`

### first-job

- **Act:** III
- **Job:** tie the halves: agents earn authority on rails the way releases earn waves, and
  the first rung is a real job with no write path: explaining alerts
- **Headline:** Agents earn authority the way releases earn waves, and rung one only explains alerts.
- **Visual:** a rung track across the top: five stops (Shadow mode, acts on nothing;
  Graded; Eligible, by a rule; Permission PR; Revocable, designed first), the first lit on
  mint rails, the rest ahead on grey. Click: a zoom cone opens from the lit stop into one
  alert, triaged: the alert (`KubePodCrashLooping`, `aws-1-prod` · `payments`, for 6m), the
  agent's card (verdict: real, not noise; what changed: Argo CD synced payments 12 min ago;
  suggests: roll back, one revert PR). Click: the responder's accept / modify / reject,
  "every choice is logged: the record that earns rung two". Click: receipts along the foot,
  Verkada $0.33 an alert; Salesforce 25% on the first try, 60–80% after a curated knowledge
  base and evals. Transfix's "Models produce evidence. Code decides authority." is in the
  notes
- **Energy:** 4
- **Into next:** that's our agents. Theirs are already at work on what we run.
- **Source:** path2-agents `authority` (Transfix, *Progressive Delivery for Trust*, p9,
  p17); GOALS §6 stage 1; Verkada (title and abstract; no deck); 📎 *1000 Clusters, 1 Smarter
  Brain* (Salesforce) p6, p21
- **Merged from:** `authority`, `triage`

### close-the-circle

- **Act:** III
- **Job:** close the loop on attackers: our agents patch what theirs find, through the same
  waves and gates, and a peer shows the speed is real
- **Headline:** Close the circle: our agents patch what theirs find, and the waves roll it out.
- **Visual:** `main`'s ring of five stations, now drawn as a loop of track (a new CVE, found
  by their agent; the lake finds which clusters; our agent drafts the fix; CI rules then
  the team, a check mark, it can't approve itself; the waves roll it out), "days, CVE to
  every cluster" in the middle. Click: on the right, "The diff from the rails, opened by an
  agent", the PR card with the same one-line diff as `the-rails`. Click: NVIDIA's receipt
  in our type, "~5,600 nodes in 30 minutes", an agent driving a CVE fix across 16 clusters
  by reading one status field, "The next CVE is a YAML change"
- **Energy:** 4
- **Into next:** so here's where we start.
- **Source:** 📎 *Progressive Delivery for Trust* (Transfix) p09, p17; 📎 *5,000 Nodes in
  Minutes, Twice in a Week* (NVIDIA) p06, p07; *Fighting Fire with Fire* (KubeEdge; no
  deck); GOALS §7 (the lake)
- **Merged from:** `new-holes`, `ship-the-check`, `patch-loop`, `the-lake` (notes)

### the-ask-ten

- **Act:** Close
- **Job:** echo the opening with the work changed by the rails, then the ask as five first PRs
- **Headline:** Same team, same 29 clusters: five first pull requests start it this quarter.
- **Visual:** left, the opening's echo: 29 squares, "one small team" in alpenglow, "1,672
  hand rollouts" struck and "80 wave approvals a year" under it (illustrative). Right, the
  five PRs as five stops on one upright mint track, each in its path colour with the objects
  it adds: `clusters/<next>.yaml`; `wave:` on 29 cluster secrets, RollingSync, a gate Job,
  for splunk-otel-collector; `regions/aws-2.yaml` and `placement.yaml`; isolated-sandbox,
  gateway, Pod Identity, CEL rules; explain-only triage by Q2 2027. Foot: "Rails, not
  runbooks." in mint, "Each stop is a pull request someone can open next week"
- **Energy:** 3
- **Into next:** end, on the title: rails, not runbooks.
- **Source:** forked from `the-ask`; `not-building`'s scope said in the notes
