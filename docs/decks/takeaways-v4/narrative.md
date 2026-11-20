# Takeaways v4, in ten: the fleet outgrows one team, then the agents arrive (with the receipts)

> **This is the 10-slide cut, draft `ten` (the default).** The full-length version is draft
> `main` (30 slides, ~36 min), and its story, editorial notes and receipts list are in
> `narrative-main.md`. Both drafts share `theme/`; the ten draft's slides all end in `-ten`,
> so nothing here edits a slide `main` uses.

Cut on 2026-11-20 because the readout decks were running long. The brief: keep v4's story
and its answer to the co-presenter's critique ("not technical enough, not enough examples"),
so every slide that remains carries a real object and a named company, and pick the
strongest receipt for each point rather than all of them.

## Distilled

- **The one sentence:** peers run ten times our fleet with teams our size because every
  change, a person's or an agent's, rides one path of objects, waves, gates and rules; we
  can copy their config, starting with five pull requests this quarter.
- **Key values kept:** Meta ~100 clusters / ~15 engineers; our 29 clusters, a small team, by
  hand; 4 → 29 clusters in five steps; 20 tools, 418 installs, 1,672 hand rollouts a year
  (illustrative model); 54 hand steps per kubeadm upgrade of one cluster; a CAPI `Cluster`
  `topology.version` diff; LinkedIn 250+ clusters, v1.31 → v1.34, 7 business days not 40;
  `RollingSync` on a `wave` label; a PostSync gate Job, exit 0 / exit 1; LinkedIn's canary,
  a week per release → an hour, 10+ incidents caught before prod; failover by layer with
  the RTO as a sum; Podium 30% of merged PRs, Mastercard 30 EKS clusters, Metal3 220
  findings (22 security bugs); the agent Job's `runtimeClassName: isolated-sandbox`, Pod
  Identity, `activeDeadlineSeconds`, one CEL rule; Verkada $0.33 an alert, Salesforce 25%
  → 60–80%; NVIDIA 16 clusters, ~5,600 nodes, 30 minutes, gated on `.status.status`;
  80 wave approvals a year; the five pull requests.
- **What was bloat, and where it went:**
  - `journey` (the three takeaways as a slide): an agenda in disguise. The takeaways are now
    the tag on every slide (`Ten.takeaway(n)`), so the structure is still on screen.
  - `show-fleet`, `show-delivery`, `show-agents`: breadth, not argument. Their counts (96,
    122 and 228 of 501 talks) are spoken in the notes of the slide each one introduced.
  - `estate-grows`, `one-runbook`, `overrun`, `twenty-tools`: four slides building one
    number. Now one picture, `multiplier-ten`: the estate's columns arrive stage by stage
    and the work fills the grid. The overrun's per-group capacity lines needed a headcount
    and are gone.
  - `region-claim`, `skip-level`: the AWS twin of the CAPI fix goes to the notes and the
    ask; LinkedIn's result is drawn as business days on `one-field-ten`.
  - `waves`, `change-windows`: the wave becomes the track on `waves-gates-ten`;
    `syncWindows` is spoken in its notes.
  - `placement`: one code chip in failover's delivery row.
  - `sandbox`, `mcp-gateway`, `credentials`, `policy-layer`: each is one line of the agent's
    Job, so `agent-job-ten` annotates those lines and shows the CEL denial. The three
    runtimes, Cedar and the MCP gateway choice are in its notes.
  - `one-view`, `the-lake`: the plumbing behind triage. The agent's card now says which lake
    table each line came from.
  - `new-holes`: its CVE count is ⚠️ unverified (OpenCVE, read off another talk's chart),
    so it's dropped; Metal3's 220 lives on `three-ways-ten` and the loop.
  - `ship-the-check`: NVIDIA's slide moves onto the loop, as its receipt.

## Brief

- **Audience:** engineering, leads included: the people who run the clusters, the people who
  will run agents, and the people who decide what both teams work on. They know Kubernetes.
  They will ask "which field?" and "who did that?".
- **Setting:** live, 12–15 minutes, one or two presenters (the fleet half, then the agents
  half), then sent round. The notes carry the argument for readers.
- **They believe now:** upgrades are routine work one experienced team handles; multi-region
  is a deployment detail; AI is a separate initiative whose risks are about the model.
- **They believe after:** the work grows with every cluster, and peers at ten times our size
  already run it as code: clusters as objects, tools in labelled waves behind gates, apps
  live in both regions. Agents arrive as workloads, users and attackers, and each has a
  concrete control; the first agent job is explain-only alert triage, and the attackers'
  agents are answered by ours through the same waves.
- **The ask:** five first pull requests. (1) The next cluster is a CAPI `Cluster` or a
  `Region` claim, never hand-built; (2) splunk-otel-collector through `RollingSync` waves
  this quarter; (3) AWS region 2 from one claim on Auto Mode, one app live in both, placed by
  labels; (4) agents get a runtime class, a gateway, Pod Identity and the CEL rules before
  they triage one alert; (5) explain-only alert triage by Q2 2027, with the accept / modify /
  reject log from day one.

## Shape

- **Structure:** problem → turn → proof → ask, told twice. The fleet half: the work
  multiplies, then three fixes with a peer's receipt each, peaking on failover. The agent
  half: three ways agents arrive, the object that fences them, their first job, and the
  circle that closes on the attackers. The close echoes the open.
- **Acts:**
  - Open (1): the cold open, which is also the title page.
  - I, *there's always another cluster* (2): the work multiplies; an upgrade is one field.
  - II, *no manual way keeps up* (2): waves and gates; failover by layer (the peak).
  - III, *AI brings problems as it solves them* (4): three ways; the agent's Job; the first
    job, triage; close the circle.
  - Close (1): same team, same 29 clusters, five pull requests.
- **The peak:** `failover-ten`, slide 5 of 10. The fleet half's setup (we run 29 by hand,
  "fingers crossed for AWS") pays off as engineering: the app doesn't move, traffic,
  capacity and data do, and the RTO is a sum. The agent half's high is `patch-loop-ten`,
  where both halves meet: their agents find the hole, ours patch it through the same waves.
- **The close:** the deck opens on Meta's ~100 clusters and ~15 engineers against our 29 by
  hand. It closes on the same 29 squares, 1,672 hand rollouts struck for 80 wave approvals,
  and five pull requests.
- **Pacing:** 4 4 3 3 5 4 3 4 4 3. Two quiet slides before the peak; the agent half
  alternates a dense object slide with a picture.

## Editorial notes (the ten draft)

Everything in `narrative-main.md`'s editorial notes still holds. The ones that touch the
slides that remain:

- **Snippets:** field names and kinds are real; values (cluster names, labels, image tags,
  versions) are ours and illustrative. Not tested config. `RollingSync` sits behind
  `applicationsetcontroller.enable.progressive.syncs`: ⚠️ check its maturity in our Argo CD
  (said on `waves-gates-ten`'s notes).
- **LinkedIn's numbers conflict** (⚠️, carried): the skip-level talk's abstract says 300
  clusters, ~300,000 nodes; its deck (`13-skip-level-upgrades/p02`) says 250+ clusters,
  ~500K nodes. `one-field-ten` uses the deck's figures, attributed to the deck. Settle one
  before this goes round. LinkedIn ran the rollout with their own tooling; kubeadm / CAPI
  support for emulated versions is unchecked, and the slide says so.
- **The toil model** (`multiplier-ten`, `the-ask-ten`) is illustrative: 4 releases a year per
  tool, 1.5 h per install by hand, inputs in `assets/toil-model.json`. Which of the four
  "a few" tools run on which three clusters is our guess and doesn't change the total. The
  slides say "illustrative" and never give a headcount; our team is "a small team".
- **Dropped for being unverified:** the CVEs-a-year chart (⚠️ OpenCVE), "new holes daily",
  and `automountServiceAccountToken: false` on the agent Job (⚠️ check it doesn't break Pod
  Identity) are off the ten draft's slides.
- **Nitro Sandbox** facts (checked 2026-11-18 in the EKS user guide) are as in
  `narrative-main.md`: Kubernetes 1.36+ on existing Auto Mode clusters, no GPU passthrough.
- **Series rules kept:** no failure-case references from other companies (the outage and the
  failed gate are ours); Ingress NGINX stays off the slides; labels agree across snippets
  (`provider`, `region: aws-1 | aws-2`, `tier`, `wave: test | canary | prod`).

## Visual direction

v4's identity, unchanged and shared with `main`: the Three Peaks brand, the night and dusk
grounds, the background range (sunk) and the north star whose brightness follows Energy,
the code card (`.cc`) with one alpenglow line that matters, the receipt frame, the catch
line, alpenglow kept for the one thing that matters on each slide.

What the ten draft adds (all additive: new classes at the end of `theme/theme.css` under
"ten draft", and a new `theme/ten.js`; nothing `main` uses was edited):

- **The takeaway tag** (`Ten.takeaway(1|2|3)`): replaces the group tag. Three bars in the
  path colours (haze fleet, mint delivery, teal agents), the current one lit, and the
  takeaway itself as the label: "There's always another cluster", "No manual way keeps up",
  "AI brings problems as it solves them". It's the journey slide, spread across the deck.
- **The multiplier grid** (`multiplier-ten`): the twenty tools as rows and the 29 clusters
  as columns, grouped by the stage that added them; every install a cell, every cell four
  ticks, one per release. 1,672 ticks, drawn to count. The columns arrive one stage per
  click, which is the old estate-grows slide in one gesture.
- **Days as blocks** (`one-field-ten`): LinkedIn's 40 and 7 business days drawn as one block
  per day at the same scale, under the CAPI diff.
- **The wave track** (`waves-gates-ten`): test → canary → the gate → prod, the gate drawn as
  a barrier in alpenglow, the clusters as the deck's peak glyphs.
- **Peak** (`failover-ten`): v4's failover by layer, with the down region hatched and the
  RTO bar heavier, so the sum is what the eye ends on.
- **The peak is the only dusk slide.** `main` used dusk for most code slides; in the ten
  draft every other slide is on night, so the change of ground marks the peak.
- **No roped team glyph.** `Estate.team` draws three climbers, which reads as a headcount;
  the ten draft says "the same small team" in words instead (the patch loop's approval
  station is a check mark).
- **Anti-default check:** with ten slides the risk is that every slide becomes "code card
  left, receipt right". Compositions alternate: full-width squares (open), full-width grid
  (multiplier), card + day blocks (one field), track over card and receipt (waves), layered
  table (peak), three columns (three ways), card with numbered pins (agent job), three cards
  in a flow (triage), loop + receipt (patch loop), list with echo (ask).

**As built (2026-11-20):** 10 slides; notes ≈ 2,160 words, about 14 minutes at 150 words a
minute. Lifted slides: LinkedIn canary p22 (`waves-gates-ten`, ringed on exit 1) and NVIDIA
p06 (`patch-loop-ten`, ringed on the status poll); LinkedIn's skip-level result is drawn as
day blocks instead. **Audit exceptions, accepted:** every slide but the cold open is
flagged `dense` (102–176 words); the words are code, tool names on the grid's rows, and
receipt captions, which are the point of v4. Nothing is offstage, clipped or overlapping.

## Beats

### cold-open-ten

- **Act:** Open
- **Job:** the title page and the hook: a peer runs a fleet with a small team, and the
  difference is what does the work, not headcount
- **Headline:** Meta runs ~100 clusters with ~15 engineers. We run 29 with a small team, by hand.
- **Visual:** the title on one line above the headline (deck title and "KubeCon NA 2026,
  Salt Lake City"). Two bands at the same scale, one square per cluster: Meta's 100 with
  fifteen figures; ours, 29 haze squares and "one small team", no figures. Click: what does
  the upgrades, "code" and "people". Click: the verdict
- **Energy:** 4
- **Into next:** none of them got there by hiring. Ours started at four clusters.
- **Source:** GOALS §0.1 (Meta keynote abstract, *We Have GitOps at Home*)

### multiplier-ten

- **Act:** I · takeaway 1
- **Job:** the problem, felt: every cluster we add multiplies the work, and by hand it
  already adds up to thousands of hours a year
- **Headline:** Four clusters became 29, and each one multiplies the work: 1,672 hand rollouts a year.
- **Visual:** the multiplier grid. Rows: the twenty platform tools by name. Columns: the 29
  clusters, grouped by the stage that added them (day one 4, EKS dev 3, second exchange 4,
  migration 6, region 2 6, second cloud 6), the running count over each group. A cell is
  lit where the tool runs (418) and holds four ticks, one per release a year. Right: the sum
  as a column, "418 installs × 4 releases = 1,672 rollouts a year, by hand", the 1,672 in
  alpenglow, and "2,508 h" under it; the footer says "illustrative model, not our
  measurements". Clicks: one stage per click; the sum lands with the second cloud
- **Energy:** 4
- **Into next:** and that's before one cluster upgrade. Here's what an upgrade should be.
- **Data:** `assets/toil-model.json` (`twenty_tools`), illustrative

### one-field-ten

- **Act:** I · takeaway 1
- **Job:** the admins' fix: a cluster is an object, its upgrade is one reviewed field, and a
  peer at ten times our size collapsed three minors into one rollout
- **Headline:** With Cluster API, an upgrade is one field in a pull request, not 54 steps by hand.
- **Visual:** left, the diff in `clusters/ny4.yaml`: a CAPI `Cluster`, ClusterClass
  `onprem-kubeadm`, `version: v1.36.3` struck, `v1.37.1` added (the 54 hand steps are in the
  headline and the notes, not drawn). Right, on a click, LinkedIn's result as business days
  at one scale: 40 outlined blocks (one minor at a time, six fleet waves) against 7 haze
  blocks (one rollout plus a promotion), "250+ clusters, ~500K nodes, on-prem: v1.31 →
  v1.34", and the mechanism as a chip, `--emulated-version=1.31`. The catch line carries
  both catches: on bare metal CAPI re-provisions machines, so the provider (Metal3, or
  vSphere / Nutanix) comes first; LinkedIn used their own tooling, so emulated-version
  support in kubeadm and CAPI is checked before we promise it
- **Energy:** 3
- **Into next:** one field per cluster. Now twenty tools on 29 clusters: they need an order,
  and a stop.
- **Source:** Cluster API book (ClusterClass, topology); 📎 *Binary Version Is Not Behavior*
  (LinkedIn) p02, p05; `EKS-VS-ECS.md` §4 (the AWS twin: a Region claim on Auto Mode, in the
  notes)

### waves-gates-ten

- **Act:** II · takeaway 2
- **Job:** the platform team's fix: the rollout order is a label, the stop is a Job, and
  LinkedIn runs exactly this shape
- **Headline:** A wave is a label and a gate is a Job: exit 1 stops the rollout before prod.
- **Visual:** across the top, the wave track: one test cluster, one canary, the gate (one
  alpenglow post across the rail, "the gate: a Job"), then 27 prod clusters in quarters,
  each stage labelled with its `wave:` value and "ApplicationSet strategy: RollingSync" over
  the track. Left below, the gate Job (`argocd.argoproj.io/hook: PostSync`, `backoffLimit:
  0`, a comment saying what exit 0 and exit 1 do). Right below, on a click, LinkedIn's gate
  slide (p22, cropped to the flow, exit 1 ringed) with their result: a week per release
  became an hour, 10+ incidents caught before prod. The catch: RollingSync's controller
  flag, and whether a failed hook halts it, are checked first (⚠️); Argo CD doesn't roll
  back by itself, so the revert is one commit
- **Energy:** 3
- **Into next:** and because placement is labels too, the app already runs in both regions.
  So what happens when one goes?
- **Source:** GOALS §1.4, §1.7(b), §2.3 (sync windows, in the notes); 📎 *Ship Faster, Ship
  Safer* (LinkedIn) p22, p25; 📎 *We Have GitOps at Home* (Meta, the notes)

### failover-ten

- **Act:** II · takeaway 2
- **Job:** the peak: lose a region and nothing is redeployed; traffic, capacity and data
  fail over, and the RTO is a sum whose slowest term is the data
- **Headline:** Lose a region and the app doesn't move: traffic, capacity and data do.
- **Visual:** v4's failover by layer, the only dusk slide in the draft. Four rows (traffic,
  delivery, capacity, state) across AWS region 1, region 2 and the second cloud; the
  delivery row's label is the placement chip `region In [aws-1, aws-2]`. Clicks: region 1
  goes down (hatched, a dashed alpenglow frame); traffic swings to 100% and region 2 is
  framed in lake blue; region 2 scales 3 → 6 nodes; the replica is promoted. The RTO bar
  fills one segment per click, data the longest, in alpenglow. The second cloud is a static
  column: warm standby, "cross-cloud copy: undecided"
- **Energy:** 5
- **Into next:** that's the fleet half. Now the show's biggest topic: agents.
- **Source:** GOALS §5.1 B, §5.5; Karmada: Bloomberg (no deck)

### three-ways-ten

- **Act:** III · takeaway 3
- **Job:** the turn into the agent half: agents arrive three ways at once, each with a
  company already living with it
- **Headline:** Agents arrive three ways: as workloads, as users, and as attackers.
- **Visual:** v4's three columns, one per click, each a picture (a node with agent and app
  pods; agents passing one gate to git, infra and kubectl; their agents probing the tools we
  run), a named example (Podium 30% of merged PRs; Mastercard 30 EKS clusters, every write
  reviewed; Metal3 220 findings, 22 of them security bugs) and what answers it ("a Job with
  a runtime class", "Pod Identity and our CEL rules", "our agents, through the waves").
  "Finding new holes daily" is gone from the headline: it leaned on the unverified CVE count
- **Energy:** 4
- **Into next:** workloads and users first, because they're the same object: a Job.
- **Source:** Podium (abstract); 📎 *No RAG, No Regrets* (Mastercard); 📎 *AI Found a 0-Day
  in Metal3* (Ericsson); the show's AI count (228 of 501) in the notes

### agent-job-ten

- **Act:** III · takeaway 3
- **Job:** an agent as a workload and as a user is an ordinary Job, and three of its lines
  plus one admission rule are the whole fence
- **Headline:** An agent is a Job: sandboxed, short-lived, and held to the same rules as everyone.
- **Visual:** the Job spec card, three lines lit (`runtimeClassName: isolated-sandbox` in
  alpenglow, `serviceAccountName` and `activeDeadlineSeconds` in teal), each with a numbered
  pin matching its callout on the right: its own kernel (a Firecracker microVM per pod in
  Auto Mode; gVisor or Kata on-prem), a short-lived identity through Pod Identity (no
  passwords in the agent), a deadline (killed at 15 minutes). Under the callouts, on a
  click, the admission reply: "✕ denied: images come from our registry, by digest", one CEL
  rule, the same for a person, the pipeline and an agent. The catch: Kubernetes 1.36+ on
  existing Auto Mode clusters, no GPU passthrough. `automountServiceAccountToken: false` is
  off the card (⚠️ unchecked with Pod Identity)
- **Energy:** 3
- **Into next:** fenced in, what's its first job? Not fixing anything. Explaining.
- **Source:** `CLAUDE-AGENT-PLATFORM.md`; EKS user guide (Nitro Sandbox); GOALS §2.1–2.2,
  §3.1, §3.4–3.6; 📎 *Goodbye Webhooks, Hello CEL* (Google); 📎 *What Can Your AI Agents
  Actually Do?* (AWS, Stacklok; MCP gateway and Cedar, in the notes)

### triage-ten

- **Act:** III · takeaway 3
- **Job:** an agent doing its first job, explain-only, read from the lake, with real prices
  and an honest first-try number
- **Headline:** The first agent job is explaining alerts: $0.33 each at Verkada, 25% right on Salesforce's first try.
- **Visual:** v4's three cards in a flow: the alert (`KubePodCrashLooping`, `aws-1-prod`,
  `payments`); the agent's explanation, its lines tagged with the lake table each came from
  (`k8s.pods`, `argocd.syncs`, `otel.*`) and "read from the lake, with a read-only role";
  the responder's accept / modify / reject, logged. The receipts under it: Verkada $0.33,
  4,700 alerts a month, 139 s; Salesforce 25% → 60–80% after a curated knowledge base and
  evals
- **Energy:** 4
- **Into next:** that's our agents. Theirs are already at work on what we run.
- **Source:** GOALS §6 stage 1, §7; Verkada (abstract; no deck); 📎 *1000 Clusters, 1 Smarter
  Brain* (Salesforce) p06, p21; Yahoo and the lake receipts in the notes

### patch-loop-ten

- **Act:** III · takeaway 3
- **Job:** both halves meet: their agents find the hole, ours draft the fix, and the waves
  and gates from the first half roll it out; NVIDIA already did it at speed
- **Headline:** Close the circle: our agents patch what theirs find, and the waves roll it out.
- **Visual:** left, the loop of five stations, drawn on entry (a new CVE, found by their AI;
  the lake finds it, one query; our agent drafts the fix, one image digest; CI rules then
  the team, a check mark, "it can't approve itself"; the waves ship it, gated on status),
  "days, CVE to every cluster" in the middle. Right, on a click, NVIDIA's slide (p06) with
  the status poll ringed, and their numbers: ~5,600 nodes on 16 clusters in 30 minutes, an
  agent driving, two CVEs days apart; "the next CVE is a YAML change"
- **Energy:** 4
- **Into next:** five first pull requests get us there.
- **Source:** 📎 *5,000 Nodes in Minutes, Twice in a Week* (NVIDIA) p06, p07; 📎 *Progressive
  Delivery for Trust* (Transfix) p09, p17, in the notes; 📎 *AI Found a 0-Day in Metal3*

### the-ask-ten

- **Act:** Close
- **Job:** echo the open with the work changed by the pipeline, not by hiring, then the ask
- **Headline:** Same team, same 29 clusters: five first pull requests start it this quarter.
- **Visual:** left, the open's 29 haze squares and "29 clusters, the same small team" (no
  figures); "1,672 hand rollouts a year" struck, "80 wave approvals a year" large in mint,
  "illustrative model" under it. Right, five numbered lines in the path colours, each a PR
  with the objects it adds
- **Energy:** 3
- **Into next:** end
