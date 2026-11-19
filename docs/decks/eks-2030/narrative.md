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

Written in phase 3, after the story is agreed: palette (named hexes), type, layout idea, the one
signature element, how concepts become pictures, the one motion moment, and what changed
after checking the plan against the generic defaults.

Two decisions carried from the story:
- **Five move colours.** These are introduced on `skip-the-gpus`, named on `five-moves`, and
  carried as a tab on every Act III slide, so the room always knows which move they're in.
- **Lifted slides** keep the speaker's design and carry attribution: talk, speaker, company,
  "KubeCon + CloudNativeCon NA 2026", internal use only (per `deck-assets/MANIFEST.md`).

## Beats

### cold-open

- **Act:** I
- **Job:** earn the room's attention with the show's most useful surprise: the biggest operators
  run huge estates with small teams. "Big" is a ratio.
- **Headline:** Fifteen engineers run Meta's hundred clusters
- **Visual:** three ratio rows, each a small team against a huge estate, drawn to scale as dots.
  **Meta:** ~15 engineers, ~100 clusters (abstract). **Nubank:** 5 engineers run ~23B spans an
  hour across 6k+ services (deck). **LinkedIn:** an app team writes ~10 lines, and the platform
  runs 5M+ pods and 110K+ deploys a week (deck). The small number is in our accent; the big one
  is huge on the right.
- **Energy:** 4
- **Into next:** "None of them got there by hiring. Here's what we think that means for us."
- **Sources:** "We Have GitOps at Home" (Meta, abstract); `2026-11-10_tracing-at-scale…nubank`
  p4; `2026-11-10_the-promises-we-keep-at-scale…` p2–3.

### the-claim

- **Act:** I
- **Job:** state the one sentence early. Our advantage is timing.
- **Headline:** We can build from day one what they had to retrofit
- **Visual:** the title slide. The deck title is small and the claim is large. An exponential
  curve runs underneath, with a "we are here" mark at the bottom left, before the bend.
- **Energy:** 2
- **Into next:** "First, what we're leaving on the floor in Salt Lake City."

### skip-the-gpus

- **Act:** I
- **Job:** clear the field. Much of the show's AI content (GPUs, inference, DRA, serving,
  training) doesn't apply to us. Saying so out loud makes the rest credible.
- **Headline:** A third of the AI talks were about running models. We never will.
- **Visual:** the schedule as a grid of small tiles. Model-running tiles go grey. What's left
  lights up in the five move colours: fleet, delivery, identity, telemetry, agents.
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
- **Visual:** our note from the floor, as a quote: *"Lots of companies are running 100s of
  clusters, we can't keep doing manual upgrades."* Under it is LinkedIn's formula, typeset:
  **upgrade time ≈ rollouts × ramps × (deploy + soak) ÷ daily window**, with their answer of 40
  business days for three minors over 250+ clusters. The second build shows Mastercard's pair of
  quotes: "With AI, we will see a 10× increase in productivity. ~ every CTO" / "…a 10× increase
  in vulnerabilities. ~ every CISO".
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
- **Visual:** three cards set like invoices, headed "the retrofit tax".
  - **Coinbase:** a homegrown service auth, "tightly coupled to AWS", replaced by SPIFFE/SPIRE
    across 4k+ services. The legacy system reached EOL in March 2025 (deck).
  - **Cisco Meraki:** a 20-year monolith with 500+ services, 1,000+ DB shards and 5,000+ static
    servers, moved to Kubernetes "as a new platform contract" (abstract).
  - **Nutanix:** one deleted root object took 39 clusters with it. Recovery took four days, and
    the backups were 12 hours old and had never been restore-tested (deck).

  A fourth card, ours, is blank: "the tax we skip".
- **Energy:** 4
- **Into next:** "So what does 'built for it from day one' look like by 2030?"

### twenty-thirty

- **Act:** II
- **Job:** show the after: the 2030 operating state, expressed as ratios and times instead of
  headcount. These are **our proposed targets**, and each is set beside the peer who already
  does it.
- **Headline:** 2030: a new cluster, service or agent is a pull request
- **Visual:** a 2030 spec sheet, one target per line, with the peer set small to the right.
  - **New EKS cluster:** same day, from a PR, no tickets. *Meta: infra code installs Argo CD,
    and Argo CD does the rest.*
  - **A Kubernetes minor across the fleet:** under two weeks, mostly unattended. *LinkedIn: 7
    business days, 250+ clusters.*
  - **Ship a new service:** about 10 lines from the app team. *LinkedIn.*
  - **Long-lived secrets in pods:** zero. *Coinbase: SPIFFE everywhere.*
  - **Every alert:** an agent's first look within minutes, for cents. *Verkada: 139 s median,
    $0.33.*
  - **Routine change** (upgrades, CVE bumps): opened by agents, approved by people. *Mastercard:
    150 EKS clusters.*
  - **Every dollar has an owner:** per team, per agent, per alert. *Adobe, Verkada.*
  - **At least two AWS regions; on-prem exited.** *Stripe: 6 regions, 99.999%.* 🔵 Decide
    whether on-prem is fully exited or kept as one more cluster.
- **Energy:** 3
- **Into next:** "Five moves get us there. Each one is already running at a company that spoke
  last week."

### five-moves

- **Act:** II
- **Job:** orient the bridge. Map the five moves to our stack, so the next twelve slides have a
  frame.
- **Headline:** Five moves, all on the stack we already chose
- **Visual:** five columns in the move colours. Each column shows the move, our tools, and the
  peer who runs it.

  | Move | Our tools | Peer |
  |---|---|---|
  | 1. Clusters are cattle | EKS, Karpenter / Auto Mode | Meta, NVIDIA |
  | 2. Apps on a contract | plain Argo CD | LinkedIn, Ford |
  | 3. Identity, not secrets | Vault + Istio | Coinbase, Yahoo |
  | 4. One telemetry pipeline | OTel → Prometheus, Grafana, Splunk | Nubank |
  | 5. Agents are workloads | Claude Agent SDK on EKS | Verkada, Mastercard |

  A strip along the bottom reads: no new orchestrator · no promoter · no GPUs.
- **Energy:** 2
- **Into next:** "Move one: stop treating clusters as places."

### cluster-is-a-commit

- **Act:** III, move 1
- **Job:** clusters are created and rebuilt from Git. Nobody hand-builds one.
- **Headline:** A cluster is a commit, not a ticket
- **Visual:** Meta's split, drawn as two lanes. In the first, infra code creates the EKS cluster
  and installs Argo CD, its only "app". In the second, Argo CD runs everything inside. Meta's
  line: "Terraform didn't get fired, just reorged". A one-line Helm change went from up to a
  working day to minutes. Beside it is the proof that rebuilds work: Nutanix redeployed 39 of 39
  clusters from Git in a day. "The declarative model that amplified the failure also made the
  rebuild repeatable."
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
- **Visual:** NVIDIA's slide, lifted: the change plus a probe that exits non-zero, then the agent
  gating on `.status` across 16 clusters (`deck-assets/12-fleet-node-changes/p04`, `p06`). The big
  numbers: ~5,600 nodes converged in 30 minutes across 16 clusters, unattended. Our version runs
  underneath: dev → one prod canary cluster → the rest. On EKS, AWS upgrades the control plane.
  We own the add-ons, the nodes (replaced, not patched, through Karpenter / Auto Mode node expiry
  ⚠️ confirm settings) and the checks.
- **Energy:** 3
- **Into next:** "Waves make a good change fast. They make a bad change fast too."

### guard-the-deletes

- **Act:** III, move 1
- **Job:** tell the cautionary tale. One wrong desired state, applied faithfully, deleted 39
  clusters. Four guards stop it, and all of them are basic Argo CD and Kubernetes.
- **Headline:** One commit deleted 39 clusters. Four guards stop it.
- **Visual:** Nutanix's timeline, lifted (`deck-assets/01-gitops-meltdown/p17`), then four guards
  in our terms.
  1. **No single root owns the fleet.** One Argo CD Application per cluster, with Argo CD itself
     bootstrapped separately.
  2. **Bulk delete is hard.** Prune/delete protection sync options on clusters and stateful
     infra (⚠️ check the exact option names on our Argo CD version). Deny DELETE on critical
     kinds with a CEL ValidatingAdmissionPolicy, which is in-tree, so no new tool.
  3. **Data outlives objects.** `reclaimPolicy: Retain`, and Git hosted outside the clusters it
     drives.
  4. **Restore on a schedule.** Nutanix's new targets are RPO ≤ 1 h and RTO ≤ 30 min.
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
- **Visual:** LinkedIn's ~10-line `LiDeployment` on the left and the full pod spec it expands to
  on the right (deck). Receipts:
  - **LinkedIn:** 5M+ pods, 3,000+ apps, 110K+ deploys a week (deck).
  - **Meraki:** Kubernetes as "a new platform contract", not an infrastructure swap (abstract).
  - **Meta:** an app "order form" instead of hand-written YAML (abstract).
  - **ŌURA:** ~93% less customer-facing code (deck).

  Our version: one golden Helm chart plus a short values file, delivered by a plain Argo CD
  Application.
- **Energy:** 2
- **Into next:** "If app teams write ten lines, something has to catch the bad ones. With plain
  Argo CD, that's CI."

### ci-is-the-gate

- **Act:** III, move 2
- **Job:** without promoters or progressive sync, safety comes from deterministic CI before
  merge and a PostSync check after sync. Both are basic.
- **Headline:** With plain Argo CD, CI and one hook are the gate
- **Visual:** a pipe: PR → CI (render, schema, policy, API-server rules) → merge → Argo CD sync →
  PostSync Job (smoke test) → healthy, or the wave stops. Receipts:
  - **Ford:** hundreds of clusters, with PRs from people, AI and bots. Deterministic CI lets
    reviewers read the content instead of the syntax (deck).
  - **LinkedIn:** Argo CD syncs the canary, and a PostSync gate decides
    (`deck-assets/02-canary-namespaces-linkedin/p22`). "From a week of hoping to an hour of
    proof" (`p25`).
  - **EarnIn:** infra tests caught cert-manager chains breaking silently and Velero backups
    that never actually ran (abstract).
- **Energy:** 3
- **Into next:** "Now the pods are running. Who are they, and what are they allowed to touch?"

### identity-not-secrets

- **Act:** III, move 3
- **Job:** every workload, person and agent gets a short-lived identity, and secrets are issued
  late and expire. That means Vault, Istio and AWS pod identity from the first cluster.
- **Headline:** Every pod gets an identity, not a password
- **Visual:** Coinbase's before and after. Before: homegrown JWT auth, tied to AWS and to one
  region. After: SPIFFE/SPIRE, with 70% less CPU, 4–10 ms faster per hop, ~50 ms off service
  chains and 100% adoption, and ambient mesh next (deck). Our stack sits beside it:
  - Istio mTLS gives every pod a SPIFFE ID.
  - Vault issues short-lived credentials through Kubernetes auth.
  - AWS access goes through pod identity, never static keys.

  Pull quote: RBC, "Kubernetes Secrets Were a Bad Idea. Now What?" (abstract).
- **Energy:** 3
- **Into next:** "Istio gives us that identity. At scale it will also give us two million metric
  series, if we let it."

### mesh-on-a-budget

- **Act:** III, move 3
- **Job:** Istio at scale works when its config and its telemetry are scoped from the start.
- **Headline:** Istio scales when we scope it on day one
- **Visual:** Yahoo's slide, lifted (`deck-assets/08-otel-cardinality/p02`): 24,000 pods in the
  mesh, 2.06M → 280K series, −86%, ~$140K a year on one cluster. Two more rules:
  - **Rapido** (10K pods, 180K RPS): namespace-scoped config cut xDS churn (abstract).
  - **GEICO:** Istio for identity and L7, and Cilium default-deny for what the mesh can't see
    (UDP, sidecar bypass, system pods) (deck).
- **Energy:** 4
- **Into next:** "That cardinality lesson is the whole observability story in miniature."
- **Notes:** 🔵 Decide sidecar vs ambient before the first prod cluster. Coinbase is moving to
  ambient. Ingress NGINX → Istio is already planned and is not pitched here.

### one-pipeline

- **Act:** III, move 4
- **Job:** keep Prometheus, Grafana and Splunk, and put one OTel collector tier in front, so cost
  and backends become config instead of code.
- **Headline:** One pipeline feeds Prometheus, Grafana and Splunk
- **Visual:** a fan-in, fan-out diagram. Apps are instrumented once, in shared libraries. They
  feed OTel collectors (node agent → gateway, which aggregate and sample), which feed Prometheus
  and Grafana for metrics and Splunk for logs and traces. Receipts:
  - **Nubank:** 5 engineers handle ~23B spans an hour. They instrumented 6 libraries instead of
    4,000 services. Changing backends is an exporter config change, with no redeploy. They
    tail-sample by what a trace is: slow, failing or rare (deck).
  - **Splunk co-presented OTel Blueprints** (deck).
  - **remberg:** a dashboard ships as a pull request, through Grafana's sidecar (deck).
  - **Best Buy:** page on SLO burn, not CPU, and put deploys on the incident timeline (deck).
- **Energy:** 2
- **Into next:** "Once every signal goes through one place, so can every dollar."

### every-dollar-has-an-owner

- **Act:** III, move 4
- **Job:** exponential growth means exponential bills. Cost is attributed per team, per agent
  and per alert from the first cluster.
- **Headline:** Every dollar has an owner: pods, packets, series and tokens
- **Visual:** four meters.
  - **Pods:** team labels are mandatory and admission rejects pods without them.
  - **Packets:** Adobe, "the bill is per account, ownership is per team", with eBPF network
    cost attribution (deck).
  - **Series:** Yahoo, ~$140K a year on one cluster.
  - **Tokens:** Verkada, about $0.27 for a five-call investigation and $1.29 past twenty-five
    (abstract). Mastercard: agents running off a laptop need budgets and attribution (deck).
- **Energy:** 3
- **Into next:** "Tokens bring us to move five: the agents."

### agent-is-a-workload

- **Act:** III, move 5
- **Job:** reframe the agent. It isn't a laptop tool; it's a workload with a pod, an identity, a
  budget, and state kept outside the pod, built from parts we already run.
- **Headline:** An agent is a workload: a pod, an identity, a budget
- **Visual:** GenbaNEXT's comparison, simplified. A microservice request versus an agent task:
  milliseconds vs minutes, near-free vs paid per token, deterministic vs not, stateless vs
  multi-step, fails fast vs fails after paid progress (deck). Then our build:
  1. The Claude Agent SDK harness runs in our image.
  2. Events trigger it: an alert, a webhook, a schedule.
  3. State lives outside the pod: Postgres, as at Mastercard. Uber ran 830K+ agent runs in a
     month on a workflow engine.
  4. Writes happen only through merge requests.

  IBM: "You probably don't need an agent platform. You already run the parts" (deck).
- **Energy:** 2
- **Into next:** "A workload that writes and runs its own code needs a stronger box than a normal
  pod."

### sandbox-per-session

- **Act:** III, move 5
- **Job:** each agent session gets its own sandbox, identity, credentials and egress allowlist.
  Istio and Vault do most of the work.
- **Headline:** Each agent session gets its own box, keys and exits
- **Visual:** one agent pod inside five controls (Infisical's five, abstract):
  1. **An isolated runtime:** a microVM or gVisor through `runtimeClassName`. AWS demoed
     hardware-isolated microVM pods on EKS (abstract).
  2. **Its own ServiceAccount,** which becomes its SPIFFE ID.
  3. **Credentials brokered by Vault,** so keys never sit in env.
  4. **An egress allowlist** through Istio egress or NetworkPolicy, with the metadata endpoint
     blocked.
  5. **Per-session limits and revocation.**

  Bancolombia: an Istio AuthorizationPolicy decides, per request, which agent may call which
  tool on behalf of which user (abstract).

  The honest tension: Mastercard says "tools as functions, not MCP; no shell", while Verkada
  says "MCP is the boring substrate". Both agree the boundary matters more than the protocol.
- **Energy:** 3
- **Into next:** "So what do the agents do first? The thing that's eating us: toil."

### the-loop

- **Act:** III, move 5 (**peak**)
- **Job:** the turn. Agents work the fleet's toil through the same rails people use, so the work
  curve from `work-outgrows-us` stops landing on people.
- **Headline:** Agents work the toil through the same rails we do
- **Visual:** the loop, built station by station: a signal (a Prometheus alert, a CVE feed, a
  new EKS version) → an agent session (sandboxed, Vault keys, Istio identity) → a merge request →
  the CI gate → a person approves → Argo CD syncs wave 1 → the PostSync check → Grafana and
  Splunk confirm → the next wave, or stop and page. Receipts are pinned to the stations:
  - **Verkada:** ~4,700 alerts a month, $0.33 each, 139 s to a summary, on Claude, with MCP
    servers for Argo CD and Prometheus (abstract).
  - **Mastercard:** 25 infra systems upgraded weekly across 30 prod and 120 non-prod EKS
    clusters. One upgrade went from weeks to 8 hours, and every write goes through an MR
    (`deck-assets/16-llm-drives-eks/p36`).
  - **NVIDIA:** the agent gated on status and escalated to a human (deck).
  - **monday.com:** 80% zero-touch PRs, 1% revert rate (deck).
  - **Salesforce:** 2,000+ clusters, −900 hours a month of toil (deck).

  Motion moment: the loop runs once.
- **Energy:** 5
- **Into next:** "That's 2030. Here's the road from where we are."

### the-road

- **Act:** IV
- **Job:** turn the 2030 picture into four yearly rungs, each with a test we can fail.
- **Headline:** Four years, four rungs, each with a test we can fail
- **Visual:** a staircase from 2027 to 2030.
  - **2027, foundation:**
    - The first prod EKS clusters are built from Git, on the ten-line contract.
    - Vault and Istio identity are in place.
    - The OTel pipeline sits in front of Prometheus, Grafana and Splunk.
    - The first agent runs alert triage, read-only.
    - *Test: rebuild a prod cluster from Git in a day.*
  - **2028, the move:**
    - Most apps are on EKS and on-prem is draining.
    - A second AWS region is live.
    - Upgrades run in waves with checks.
    - Agents open upgrade and CVE MRs.
    - *Test: a Kubernetes minor across the fleet in two weeks.*
  - **2029, scale:**
    - We run tens of clusters.
    - Agents ship routine change with one approval.
    - Cost per team, per agent and per alert is on a dashboard.
    - *Test: the platform team stays flat while clusters double.*
  - **2030, the ratio:** the spec sheet from `twenty-thirty`.
- **Energy:** 3
- **Into next:** "What we don't build matters just as much."

### not-building

- **Act:** IV
- **Job:** keep the plan small enough for a startup by naming what we deliberately skip.
- **Headline:** What we will not build
- **Visual:** a short list, struck through.
  - ~~GPUs, model serving, DRA~~: we call Claude.
  - ~~A second orchestrator or cloud~~.
  - ~~Kargo, GitOps Promoter, progressive sync~~: plain Argo CD, CI and hooks.
  - ~~Our own agent framework~~: the Claude Agent SDK. We build the harness and the box, not the
    brain.
  - ~~A new observability backend~~: Prometheus, Grafana and Splunk stay.
  - ~~An agent platform product~~: compose the parts (IBM).
- **Energy:** 2
- **Into next:** "That leaves three things to decide today."

### the-ask

- **Act:** IV
- **Job:** close by echoing the open. Put our row on the ratio chart, and ask for three concrete
  yeses.
- **Headline:** Approve the five rules for cluster one, and start one agent
- **Visual:** the cold open's ratio rows return, and a fourth row appears: ours in 2030, our
  platform team against our fleet, from the spec sheet. The three asks sit below:
  1. The five moves are the design bar for the first prod EKS cluster, and any exception gets
     written down.
  2. The 2030 spec sheet is our north star, reviewed once a year.
  3. One agent starts in Q1 2027: alert triage, read-only, with a cost-per-alert number by the
     end of Q2.
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
