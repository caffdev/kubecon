# Built for the curve: KubeCon 2026 takeaways for our move to EKS, and our 2030

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Started 2026-11-19. A fresh take, built only from the raw show material. It does not draw on
`GOALS.md`, `GOALS-GAPS.md`, `ISTIO-VS-GATEWAY-API.md`, `CLAUDE-AGENT-PLATFORM.md`,
`EKS-VS-ECS.md` or the earlier decks.

**Sources used:** the schedule (`kubecon-overview/data/sessions.json`), the posted decks
(`kubecon-overview/slides/`, text pulled with `pdftotext`), the lifted PNGs in
`deck-assets/`, our show notes (`Key lessons/Takaways`, `argocon/am-session.md`), and the
schedule counts in `kubecon-overview/analysis/`. Each receipt says where it came from:
**(deck)** means the speaker's posted slides, and **(abstract)** means only the session
description. Abstract numbers are what the speaker promised to present, so they carry that label
on screen. ⚠️ marks anything to check before it goes on a slide.

**Our constraints (from the request):**
- We're a startup moving from on-prem to EKS fast, then growing on EKS.
- We will never run local models. The GPU, inference and model-serving half of the show is out
  of scope. Agents mean the Claude Agent SDK (or similar) in containers, built from the ground up.
- We lean AWS, Vault and Istio. Ingress NGINX → Istio is already planned, so it is **not** a
  takeaway.
- Argo CD stays basic: Applications, sync waves, hooks and sync options. No Kargo, no GitOps
  Promoter, no progressive sync, nothing advanced.
- Splunk, Prometheus and Grafana are the house stack. We feed them; we don't replace them.

## Brief

- **Audience:** the people who decide what we build next and the people who build it:
  engineering leadership, the platform/infra team, and the leads whose apps move to EKS. They
  know our stack. Some know Kubernetes deeply and some don't. They're skeptical of big-company
  process at a startup, and of AI hype.
- **Setting:** live, about 30 minutes, then sent round. The notes carry the full argument for
  readers.
- **They believe now:** KubeCon was a GPU and AI show that mostly doesn't apply to us. The job
  is "get to EKS", and scale is a later problem. Agents are a tool on laptops.
- **They believe after:** the move to EKS is the cheapest moment we'll ever get to build the
  operating model the big operators had to retrofit. The tools we already lean on are the
  ones they run. What separates them from us is five habits, and we can have those from cluster
  one. Agents are a workload we build on EKS. Once agents run on the same rails as people, they
  take on the toil that would otherwise grow with the fleet.
- **The one sentence:** *We're early enough to build from the first cluster what the big
  operators had to retrofit: an EKS platform where a new cluster, service or agent is a pull
  request, so the work can grow 10× while the team doesn't.*
  (Someone will disagree: "ship first, platform later". That disagreement is the talk.)
- **The ask (proposed, to confirm):**
  1. Make the five moves the design bar for the first production EKS cluster. Any exception gets
     written down.
  2. Adopt the 2030 spec sheet as our north star and review it once a year.
  3. Start one agent in Q1 2027: alert triage, read-only, on EKS, with a cost-per-alert number
     by the end of Q2.

## Shape

- **Structure:** *Before → after → bridge*, opened cold with a ratio. It's a vision plus a plan
  for a mixed room. Showing 2030 early gives the bridge slides a destination. Every step of the
  bridge comes with a peer who already runs it, so the plan doesn't read as wishful.
- **Acts:**
  - **I. The bar moved** (5 slides): the big operators win on ratio, the half of the show we
    skip, the work outgrowing the team, and the retrofit tax.
  - **II. 2030 is a ratio, not a headcount** (2): the spec sheet, then the five moves that get
    us there.
  - **III. Five moves, each already run by someone at the show** (12): fleet, delivery,
    identity, telemetry and agents, ending at the loop.
  - **IV. The road** (3): the four rungs, what we won't build, and the ask.
- **The peak:** `the-loop` (slide 19, about 85% through), where the agents work the fleet's toil
  through the same rails people use. It resolves Act I's problem (toil grows with the fleet)
  using the last move of Act III. It sits late on purpose: the loop only makes sense once every
  rail it runs on has been shown. After it come three short landing slides. `guard-the-deletes`
  and `mesh-on-a-budget` carry mid-deck tension so the long bridge doesn't sag.
- **The close:** `the-ask` brings back the cold open's ratio rows and adds a fourth: ours, in
  2030.

## Visual direction

**Chosen 2026-11-19: C, the scale drawing.** Flavors A (bay plan) and B (Three Peaks) were tried
on `cold-open` and `the-loop` and are in git history (commit 22619aa).

- **The world:** an engineering drawing set on drafting film. "Big is a ratio", so things are
  drawn to scale with dimension lines. Where a ratio outgrows the sheet, the drawing breaks
  (a zigzag scale break, plus a red-pencil note on how far it would run).
- **Palette:**
  - drafting film `#e5e9e2`: the ground, with a 40px non-photo-blue grid
  - graphite `#22272b`: ink
  - 2H lead `#5d656b`: quiet text
  - non-photo blue `#6c9bd8`, ink `#2b5c9e`: construction lines and notes
  - red pencil `#d0293a`, ink `#b31f2f`: **people and the decisions people make**, nothing else
- **Type:**
  - Schibsted Grotesk 800 for headlines and labels, tight tracking
  - B612 (the Airbus cockpit face) for dimensions, notes, tables and sources
  - JetBrains Mono for real YAML and fields (B612 Mono spaced the periods oddly: `2. 2. 5`)
- **Signature elements:**
  - dimension lines with arrowheads
  - numbered balloons for stations
  - a parts list (BOM) for evidence
  - a revision cloud for an open decision (🔵 in the narrative)
  - a revision table for the retrofit tax
- **Sheet tags:** each of the five moves is a sheet of the drawing set. Every Act III slide
  carries a sheet tag top-right ("1 · Clusters are cattle"). This replaces the five move colours
  planned in the story: five colours would break the three-ink restraint.
- **Concepts as pictures:**
  - quantities are unit squares or bars drawn to scale
  - processes are schematics with flow arrows
  - gates are P&ID valves
  - a pod is a section or an exploded assembly
  - things we skip are voided (cross-hatched)
- **Layout:** margins 120 / 96. The headline sits top-left at 74–100px, the drawing fills the
  rest, and the sources run in B612 at 24px along the bottom-left. Text is left-aligned throughout.
- **Lifted slides** are framed as a "Detail" with a caption strip (talk, company, KubeCon NA
  2026, internal use).
- **Motion moment:** on `the-loop`, one change travels the schematic once. Elsewhere, builds
  reveal rows and stations at the speed of speech.
- **Anti-default check:**
  - No cream ground and no terracotta: the film is cool green-grey.
  - No dark ground with an acid accent.
  - No card kit: tables and drawings carry the structure.
  - Tracked caps appear only inside table headers, where drawings use them, and even there the
    text stays in sentence case.
  - Numbering appears only where a sequence is real (balloons, sheets, revisions).
  - Drawing helpers live in `theme/draw.js` (dims, balloons, clouds, breaks, valves, unit grids).

## Beats

### cold-open

- **Act:** I
- **Job:** earn the room's attention with the show's most useful surprise: the biggest operators
  run huge estates with small teams. "Big" is a ratio.
- **Headline:** Fifteen engineers run Meta's hundred clusters
- **Visual:** the ratios drawn to scale at 13px per unit. Meta's 15 engineers (red hatch) against
  ~100 clusters (graphite) fits on the sheet: 1 : 6.7. Nubank's 5 engineers against 6,000+ services
  breaks the sheet ("≈ 40 slides wide at this scale"), and LinkedIn's ~10 lines against 5M+ pods
  breaks it further ("≈ 34,000 slides wide"). Nubank and LinkedIn are builds.
- **Energy:** 4
- **Into next:** "None of them got there by hiring. Here's what we think that means for us."
- **Sources:** "We Have GitOps at Home" (Meta, abstract); `2026-11-10_tracing-at-scale…nubank`
  p4; `2026-11-10_the-promises-we-keep-at-scale…` p2–3.

### the-claim

- **Act:** I
- **Job:** state the one sentence early. Our advantage is timing.
- **Headline:** We can build from day one what they had to retrofit
- **Visual:** the claim at 112px. An exponential curve is plotted 2026–2030, with a red "we are
  here, before the bend" mark and a blue note at the bend: "where they had to retrofit". The deck
  title sits in a drawing title block, bottom-right.
- **Energy:** 2
- **Into next:** "First, what we're leaving on the floor in Salt Lake City."

### skip-the-gpus

- **Act:** I
- **Job:** clear the field. Much of the show's AI content (GPUs, inference, DRA, serving,
  training) doesn't apply to us. Saying so out loud makes the rest credible.
- **Headline:** A third of the AI talks were about running models. We never will.
- **Visual:** the 199 AI-titled talks as unit squares in ten rows. The 65 about running models are
  voided (cross-hatched); the 134 kept are hatched graphite. Dimension lines span each group. A key
  on the right says what is voided and what is kept. (The five move colours planned here became
  sheet numbers instead; see Visual direction.)
- **Energy:** 2
- **Into next:** "What's left is the part that bites a company growing as fast as we plan to."
- **Data:** 199 of 501 talks have AI, LLM, agents, GPU, inference, MCP or models in the title.
  65 of those 199 are about running models (GPU, inference, serving, DRA, training, KV cache,
  Kueue/Volcano). Both counts are title regexes over `sessions.json`, run 2026-11-19. ⚠️ This is
  signal strength, not a census; say "about a third".

### work-outgrows-us

- **Act:** I
- **Job:** set the stakes. Toil grows with clusters × releases × CVEs, which is faster than any
  team can grow. Use our own note from the show.
- **Headline:** The work grows faster than the team ever will
- **Visual:** an illustrative plot: work (graphite, exponential) against the team (red, linear), with
  the gap hatched blue and labelled "toil". Notes on the right: LinkedIn's formula and its 40
  business days, our own show-floor note in red, and Mastercard's CTO/CISO pair as a build.
- **Energy:** 3
- **Into next:** "Every big operator at the show hit this wall. The ones who hit it late paid
  for it."
- **Sources:** `Key lessons/Takaways`; `deck-assets/13-skip-level-upgrades/p02`, `p08`;
  `deck-assets/16-llm-drives-eks/p12` and the deck's opening quotes. Our current numbers go in
  the notes (⚠️ to supply).

### retrofit-tax

- **Act:** I
- **Job:** make the cost of waiting concrete. The scale stories were retrofit stories.
- **Headline:** Every scale story at the show was a retrofit
- **Visual:** a drawing's revision table. Rev A is Coinbase, B is Cisco Meraki and C is Nutanix,
  each with what had to change and what it cost. Rev D, "Us", reads "not yet drawn" inside a red
  revision cloud. Rows build one at a time.
- **Energy:** 4
- **Into next:** "So what does 'built for it from day one' look like by 2030?"

### twenty-thirty

- **Act:** II
- **Job:** show the after: the 2030 operating state, expressed as ratios and times instead of
  headcount. These are **our proposed targets**, and each is set beside the peer who already
  does it.
- **Headline:** 2030: a new cluster, service or agent is a pull request
- **Visual:** a spec table with eight rows (spec, 2030 target, already done by) and a blue stamp
  reading "Proposed targets for us to agree". The routine-change row is red (a person approves).
  The footprint row, "on-prem exited", sits in a revision cloud: an open decision.
- **Energy:** 3
- **Into next:** "Five moves get us there. Each one is already running at a company that spoke
  last week."

### five-moves

- **Act:** II
- **Job:** orient the bridge. Map the five moves to our stack, so the next twelve slides have a
  frame.
- **Headline:** Five moves, all on the stack we already chose
- **Visual:** five drawing sheets with zero radius, a double frame and a title block. Each shows the
  sheet number, the move, our tools and "Run at" peers. A voided strip below reads "Not in this
  set": GPUs and model serving; Kargo, Promoter, progressive sync; a second orchestrator.
- **Energy:** 2
- **Into next:** "Move one: stop treating clusters as places."

### cluster-is-a-commit

- **Act:** III, move 1
- **Job:** clusters are created and rebuilt from Git. Nobody hand-builds one.
- **Headline:** A cluster is a commit, not a ticket
- **Visual:** a section through one cluster with two strata. Infra code (graphite) holds the VPC,
  EKS, node pools and Argo CD; Argo CD (blue) holds the add-ons, Istio, Vault agent and apps. One
  git line feeds both. A revision cloud reads "Terraform, CAPI, or ACK + kro: decide". On the
  right: Meta's quote, and Nutanix's 39 of 39 squares redeployed from Git.
- **Energy:** 3
- **Into next:** "Creating clusters is the easy half. Keeping fifty of them current is where the
  hours go."
- **Notes:** Meta also used Kargo for promotion; we take only the split. 🔵 Decide the cluster
  tool (Terraform, or CAPI/ACK/kro). The slide argues for the split, not for a tool.
- **Sources:** Meta (abstract); `2026-11-10_gitops-meltdown…` "Rebuilding clusters from Git".

### upgrades-in-waves

- **Act:** III, move 1
- **Job:** upgrades and patches roll out in waves, each with a check that fails, so a person
  watches the exceptions instead of the progress.
- **Headline:** Ship every change with the check that proves it
- **Visual:** NVIDIA's status-gate slide, lifted as "Detail A" (`assets/nvidia-status-agent.png`,
  from `deck-assets/12-fleet-node-changes/p06`). Next to it: "~5,600 nodes in 30 min" across 16
  clusters. Then our waves as a schematic, dev → 1 prod canary → rest of prod, with a valve marked
  "check" between each. An "On EKS" note says who owns what.
- **Energy:** 3
- **Into next:** "Waves make a good change fast. They make a bad change fast too."

### guard-the-deletes

- **Act:** III, move 1
- **Job:** tell the cautionary tale. One wrong desired state, applied faithfully, deleted 39
  clusters. Four guards stop it, and all of them are basic Argo CD and Kubernetes.
- **Headline:** One commit deleted 39 clusters. Four guards stop it.
- **Visual:** Nutanix's four days as a timeline with dimensioned gaps (12 min, ~8 h, 1–2 days,
  ~2 days; marked not to scale), then four guards in a 2×2 grid, each with a real field or target:
  one Application per cluster; `argocd.argoproj.io/sync-options: Prune=false` plus a CEL deny on
  DELETE; `reclaimPolicy: Retain`; RPO ≤ 1 h, RTO ≤ 30 min. Their closing line goes in the source
  strip.
- **Energy:** 4
- **Into next:** "Move two is about the apps, and about keeping Argo CD boring."
- **Notes:** Nutanix ran Flux. The failure, a self-managing root that prunes everything under it,
  is the same shape in Argo CD's app-of-apps. Their line closes the slide: "Automation is only as
  safe as the desired state it trusts."

### ten-line-contract

- **Act:** III, move 2
- **Job:** every app crosses to EKS on a short contract the platform owns. The migration is the
  moment to impose it.
- **Headline:** Every app crosses to EKS on a ten-line contract
- **Visual:** LinkedIn's real 10-line `LiDeployment` in a frame, with a vertical dimension
  reading "~10 lines". An arrow leads to "The platform owns", a frame with six numbered items. On
  the right: LinkedIn, Meraki, Meta and ŌURA as receipts. Along the bottom: "Ours: one golden Helm
  chart…".
- **Energy:** 2
- **Into next:** "If app teams write ten lines, something has to catch the bad ones. With plain
  Argo CD, that's CI."

### ci-is-the-gate

- **Act:** III, move 2
- **Job:** without promoters or progressive sync, safety comes from deterministic CI before
  merge and a PostSync check after sync. Both are basic.
- **Headline:** With plain Argo CD, CI and one hook are the gate
- **Visual:** a pipe: PR → CI valve (render, schema, policy, API rules) → merge → Argo CD sync →
  PostSync valve (`hook: PostSync`). It then branches to "next wave" (graphite) or "stop, page a
  person" (red). Below it, a parts list of who runs each gate: Ford, LinkedIn, EarnIn.
- **Energy:** 3
- **Into next:** "Now the pods are running. Who are they, and what are they allowed to touch?"

### identity-not-secrets

- **Act:** III, move 3
- **Job:** every workload, person and agent gets a short-lived identity, and secrets are issued
  late and expire. That means Vault, Istio and AWS pod identity from the first cluster.
- **Headline:** Every pod gets an identity, not a password
- **Visual:** before: `DB_PASSWORD=hunter2`, voided and struck through. After: one pod with a
  SPIFFE ID tag and three issuers that trust it (Istio for mTLS, Vault for expiring DB creds, AWS
  through EKS Pod Identity). On the right: Coinbase's −70% CPU, 4–10 ms per hop and 100% adoption.
  The RBC talk title is a blue note.
- **Energy:** 3
- **Into next:** "Istio gives us that identity. At scale it will also give us two million metric
  series, if we let it."

### mesh-on-a-budget

- **Act:** III, move 3
- **Job:** Istio at scale works when its config and its telemetry are scoped from the start.
- **Headline:** Istio scales when we scope it on day one
- **Visual:** Yahoo's series drawn to scale: a 2.06M bar against a 280K bar, with a dimension line
  reading "−86%, ~$140K a year back". Two numbered rules follow (Rapido: scope config per
  namespace; GEICO: Cilium default-deny under the mesh). A revision cloud reads "Sidecar or
  ambient: decide before the first prod cluster".
- **Energy:** 4
- **Into next:** "That cardinality lesson is the whole observability story in miniature."
- **Notes:** 🔵 Decide sidecar vs ambient before the first prod cluster. Coinbase is moving to
  ambient. Ingress NGINX → Istio is already planned and is not pitched here.

### one-pipeline

- **Act:** III, move 4
- **Job:** keep Prometheus, Grafana and Splunk, and put one OTel collector tier in front, so cost
  and backends become config instead of code.
- **Headline:** One pipeline feeds Prometheus, Grafana and Splunk
- **Visual:** fan-in, fan-out. 49 service squares (for 4k+) converge on 6 shared-library boxes,
  then run through the OTel agent per node and the OTel gateway (aggregate, sample), then split to
  Prometheus and Grafana (metrics) and Splunk (logs, traces). A blue note says "a backend is exporter
  config, no redeploy". Below, a parts list: Nubank, Splunk and New Relic (Blueprints), remberg,
  Best Buy.
- **Energy:** 2
- **Into next:** "Once every signal goes through one place, so can every dollar."

### every-dollar-has-an-owner

- **Act:** III, move 4
- **Job:** exponential growth means exponential bills. Cost is attributed per team, per agent
  and per alert from the first cluster.
- **Headline:** Every dollar has an owner: pods, packets, series and tokens
- **Visual:** Adobe's problem drawn: one "AWS bill, per account" box fanning out on dashed
  lines to five team boxes, with their quote. Below, a meter table (pods, packets, series, tokens):
  how each gets an owner, and who runs it.
- **Energy:** 3
- **Into next:** "Tokens bring us to move five: the agents."

### agent-is-a-workload

- **Act:** III, move 5
- **Job:** reframe the agent. It isn't a laptop tool; it's a workload with a pod, an identity, a
  budget, and state kept outside the pod, built from parts we already run.
- **Headline:** An agent is a workload: a pod, an identity, a budget
- **Visual:** GenbaNEXT's comparison as a table (a request vs an agent task) on the left. On the
  right, a section through one agent pod: alert, webhook and schedule arrows in; the Claude Agent
  SDK harness inside; state in Postgres below ("resume, don't restart"); one arrow out, "writes:
  merge requests only". IBM's quote and Uber's 830K+ runs build last.
- **Energy:** 2
- **Into next:** "A workload that writes and runs its own code needs a stronger box than a normal
  pod."

### sandbox-per-session

- **Act:** III, move 5
- **Job:** each agent session gets its own sandbox, identity, credentials and egress allowlist.
  Istio and Vault do most of the work.
- **Headline:** Each agent session gets its own box, keys and exits
- **Visual:** an exploded assembly: one agent-session pod in the centre, with five numbered parts
  on blue construction leaders. 1 its own kernel (`runtimeClassName`), 2 its own identity, 3 keys
  it never sees (Vault), 4 an exit list, 5 limits and an off switch. A blue strip at the bottom
  sets out the MCP disagreement (Mastercard vs Verkada).
- **Energy:** 3
- **Into next:** "So what do the agents do first? The thing that's eating us: toil."

### the-loop

- **Act:** III, move 5 (**peak**)
- **Job:** the turn. Agents work the fleet's toil through the same rails people use, so the work
  curve from `work-outgrows-us` stops landing on people.
- **Headline:** Agents work the toil through the same rails we do
- **Visual:** a schematic loop with nine numbered balloons; balloon 5, "Approve", is red: the one
  person. Next to it, a parts list naming who already runs each station: Verkada, Mastercard,
  monday.com, Ford, LinkedIn, Salesforce, NVIDIA. A title block holds the sources. Stations build in
  three groups. On the fourth click, one change (a graphite dot) travels the loop once: the deck's
  motion moment.
- **Energy:** 5
- **Into next:** "That's 2030. Here's the road from where we are."

### the-road

- **Act:** IV
- **Job:** turn the 2030 picture into four yearly rungs, each with a test we can fail.
- **Headline:** Four years, four rungs, each with a test we can fail
- **Visual:** a stair drawn in section: one tread per year, rising left to right. Above each tread
  sit the year, what lands, and a red "Test:" line (a person checks it). Rungs build one at a time.
- **Energy:** 3
- **Into next:** "What we don't build matters just as much."

### not-building

- **Act:** IV
- **Job:** keep the plan small enough for a startup by naming what we deliberately skip.
- **Headline:** What we will not build
- **Visual:** a deletion list. Six items are voided and struck through in graphite, each with an
  "Instead:" note in blue.
- **Energy:** 2
- **Into next:** "That leaves three things to decide today."

### the-ask

- **Act:** IV
- **Job:** close by echoing the open. Put our row on the ratio chart, and ask for three concrete
  yeses.
- **Headline:** Approve the five rules for cluster one, and start one agent
- **Visual:** the cold open's ratio rows return, small: Meta to scale, Nubank and LinkedIn with
  scale breaks. A fourth row, "Us, 2030", is drawn in dashed red outline and reads "drawn when we
  agree the numbers". Below it, the three asks on red balloons, building one at a time.
- **Energy:** 4
- **Into next:** the end. The one sentence stays on screen for questions.

## To check before slides

- ⚠️ Argo CD prune/delete protection option names and behaviour on our version
  (`guard-the-deletes`).
- ⚠️ EKS Auto Mode and Karpenter node-expiry settings (`upgrades-in-waves`). Nothing at the show
  stated them; check the AWS docs.
- ⚠️ Abstract-only receipts: Meta, Verkada, Rapido, Meraki, Bancolombia, Infisical, the AWS
  sandbox demo, RBC and EarnIn. Each is labelled "(abstract)" on screen, and the numbers are
  quoted, not restated.
- ⚠️ Our own current numbers (clusters on-prem and on EKS, platform team size) for
  `work-outgrows-us` and the fourth row of `the-ask`.
- Not used: "90% of AI runs on K8s" from our show notes, because there's no source.
