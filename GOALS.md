# Post-KubeCon NA 2026 — Goals, Cleaned Up

**Written 2026-11-12, Salt Lake City.** This is the cleaned-up version of the
`our goals` brainstorm, cross-referenced against `argocon/am-session.md`,
`Key lessons/Takaways`, and the full-schedule analysis in `kubecon-overview/`.

Each item says what the thing actually is, why it came up, what we have to decide,
and — where one exists — **which slide deck in `kubecon-overview/slides/` covers it**,
so we can lift real diagrams instead of redrawing them. See
[Building our deck](#building-our-deck) at the bottom.

**Status legend**

| Mark | Meaning |
|---|---|
| 🟢 **Adopt** | We already believe in it; the work is sequencing, not evaluation |
| 🟡 **Trial** | Pilot on one app / one cluster before committing |
| 🔵 **Decide** | A genuine fork in the road — needs an owner and a call |
| ⚪ **Watch** | Not now; re-check in 2 quarters |

---

## 0. The thesis (the one slide everything hangs off)

Two things got loud at this show and they are the same problem:

1. **Fleet toil is unsustainable.** Companies are running hundreds of clusters and
   still upgrading them by hand. 90% of AI runs on Kubernetes, so the fleet is
   growing, not shrinking.
2. **Agents are now both a workload class and a user class.** They need sandboxing,
   identity, egress control and durable execution; and they want to *change our
   infrastructure*, which means they need a path to production that doesn't depend
   on a human reading every diff.

Both converge on one control plane: **GitOps + policy + progressive delivery**.
That spine is what makes a change safe regardless of whether a person or an agent
authored it. Everything below is either building that spine, or using it.


### 0.1 The scale evidence behind claim 1

Claim 1 above needs numbers or it's an assertion. These are the fleet sizes companies
disclosed from the stage this year — **in their own titles, abstracts or decks**:

| Company | Fleet | Where it came from | Shape |
|---|---|---|---|
| **Salesforce** | **1,000 clusters** under agentic AIOps | Session title | Cloud |
| **LinkedIn** | **300 clusters, ~300,000 nodes** | Abstract, skip-level upgrades talk | Bare-metal / on-prem |
| **Ford** | **Hundreds of clusters** | Abstract, *Robust CI as a Safety Net* | — |
| **NVIDIA** | **Hundreds of GPU clusters**; 5,600 nodes converged in 30 min | Abstract + 📎 deck | On-prem |
| **Meta** | **~100 clusters run by ~15 engineers** (AI research + inference) | Keynote abstract | On-prem |
| **Coinbase** | **79 prod clusters**, 4k+ services, 500k+ RPS | 📄 their deck, slide 5 | Cloud + non-K8s legacy |
| **Nutanix** | **39 workload clusters** — all deleted by one commit | Session title | Hybrid |
| **Mastercard** | **30 EKS clusters** driven by an LLM, no RAG | Session title | AWS |
| **Verkada** | **9 prod clusters**, 4,700 alerts/month at $0.33 each | Session title + abstract | Cloud |
| **Hertz** | Multi-cluster EKS fleet — **⚠️ "80 clusters" heard from the stage, not in the abstract** | Abstract says only "fleet scale" | AWS |

⚠️ **Check the Hertz number before it goes on a slide.** The abstract gives no count, and
**Coinbase's 79** is close enough that the two are easy to conflate. If we can't confirm
80, say "fleet-scale multi-cluster EKS" and lose nothing.

**Hybrid and multi-cloud is the norm at this scale, not the exception** — which matters
because §5's on-prem + EKS split is sometimes treated internally as a transitional
awkwardness. It isn't:

- **GEICO** — *Follow the GPUs: How a Regulated Fortune 100 Serves Customers When No
  Single Cloud Has Enough.* They run a **"Hybrid Cloud Fabric": multi-provider
  Kubernetes plus zero trust**, and the stated reason is that no single provider had the
  GPU capacity. That is the clearest statement at the show of *why* a regulated
  enterprise ends up multi-cloud — not strategy, supply. It is also the scenario that
  would force our hand.
- **Uber** — Michelangelo AI, open-sourced at the show, explicitly "designed to run
  across on-premises and public cloud environments."
- **Meta, LinkedIn, NVIDIA, The Trade Desk** — all operating serious on-prem fleets
  alongside cloud, all presenting on utilization and upgrade toil rather than migration.

**The point for the deck:** nobody at this scale is single-cluster, single-cloud, or
hand-upgrading, and the companies naming real numbers are our peers in regulated
industries — Mastercard, Coinbase, GEICO, Hertz — not just the hyperscalers.

The conference-wide framing, if we want to borrow it: *let agents propose, let
progressive delivery and policy decide.*

---

## 1. Argo: promotion and progressive delivery

**Goal:** a single, auditable path from commit to prod that works identically for a
human PR and an agent PR, with automated rollback.

### 1.1 Everyone auto-syncs 🟢 Adopt
Manual sync is the thing that makes Argo CD a dashboard instead of a control loop.
Until auto-sync (with self-heal and prune) is the default, drift detection is
advisory and promotion tooling has nothing to drive.

- **Blocker to name honestly:** teams resist auto-sync because they have no change
  window control. That is exactly what §2.3 is for — solve them together, not in sequence.
- **Counter-example to put in the deck:** *GitOps Meltdown: How a Commit Triggered a
  Cascading Delete of 39 Clusters in Production* (Nutanix). Auto-sync + prune without
  guardrails is a cascade. Argue for auto-sync **and** show this slide.
- 📎 `2026-11-10_gitops-meltdown-how-a-commit-triggered-a-cascading-delete-of-39-cluste.pdf`

### 1.2 Kargo vs GitOps Promoter 🔵 Decide
The headline decision of this workstream. Both answer "how does a verified artifact
move dev → stage → prod?" but with different models:

| | **Kargo** (Akuity) | **GitOps Promoter** (Argo Labs) |
|---|---|---|
| Model | Warehouses → Freight → Stages, with promotion steps | Promotion is a branch + commit + PR, per environment |
| State | Tracked by the Kargo control plane and its own UI | No state outside Git — every promotion is a PR |
| Fits | Complex multi-stage pipelines, fleet/target mapping (the ArgoCon demo) | Teams who want the PR to *be* the audit record |
| Hydration | Operates mostly on dry, pre-hydrated manifests | Designed around hydrated manifests — pairs with the source hydrator (§1.3) |
| Maturity | Clear adoption signal; the 2026 Argo CD user survey put Kargo as a promotion method at ~20% of respondents, up from ~2% in 2025 | Younger, less adoption data; per-environment `CommitStatus` resources must be wired by hand for auto-rollback |

**How to decide:** this is really a question about what we want the audit trail to be.
If the answer is "a PR a human or an agent can review, with a commit status that
proves the gate passed" — GitOps Promoter is the more natural fit and it composes
with §1.3 and §1.9. If the answer is "a promotion pipeline across many targets with
a UI our release managers live in" — Kargo.

**Caveat for the deck:** nearly all the published comparisons are written by vendors
with a stake (Akuity maintains both Argo CD and Kargo). Run a two-week spike on one
app rather than reading more blog posts.

### 1.3 Source hydrator 🟡 Trial
Argo CD renders manifests and commits the *rendered* output back to a hydrated branch,
so Git holds what actually runs, not a Helm chart plus values that you have to
mentally render. Why it matters more than it sounds:

- Diffs become readable, which is what makes PR-based promotion and review work.
- It gives an agent something concrete to reason about — the real YAML, not a template.
- UI support has been landing incrementally (hydrator properties in the Application
  summary panel and hydrator support in the app create panel arrived in the 3.4 line).

Treat it as a prerequisite experiment for §1.2, not a parallel one.

### 1.4 ApplicationSets → progressive sync 🟡 Trial
ApplicationSets are how one definition fans out to many clusters; **progressive sync**
is what stops that fan-out from hitting all of them at once. This is the mechanism
that makes §5 (fleet management) safe: roll a platform component to wave 1, check
health, then wave 2. **It is delivery, not scheduling** — see §5.1 for what that
means when a cluster goes away.

Pair with *Ship Faster, Ship Safer: A K8s-Native Canary Pipeline for Critical Cluster
Services* (LinkedIn) — canarying the cluster services themselves, not just apps.
📎 `2026-11-11_ship-faster-ship-safer-a-k8s-native-canary-pipeline-for-critical-clust.pdf`

### 1.5 Argo CD UI: resources explorer + ApplicationSet views 🟢 Adopt
Reason to push the upgrade, from the ArgoCon demos:

- **Resources explorer view** — new in the 3.6 line, along with a view of which
  resources caused an app's health to change.
- **ApplicationSet UI** (list / filter / detail, built by Intuit, Red Hat, GoTo and
  Octopus Deploy) with a Preview Apps tab added in 3.5 — previously ApplicationSets
  were effectively invisible in the UI.
- Reported controller memory improvements and virtual scrolling in the 3.6 line
  (secondhand — verify against the official release notes before quoting a number).

**Action:** confirm our current version and write the upgrade ticket. The version
numbers above came from release changelogs and secondhand posts; check
`github.com/argoproj/argo-cd` releases before putting them on a slide.

### 1.6 Config reload for ConfigMap/Secret changes 🟢 Adopt
("Skater reloader" in the brainstorm — the project is **Stakater Reloader**.)
Watches ConfigMaps and Secrets and rolls the Deployments that consume them. Without
it, a GitOps config change appears to succeed while the running pods keep serving the
old value — which silently breaks the "Git is the state of the world" claim we are
about to make to everyone. Small, cheap, unblocks trust in §1.1.

### 1.7 Canary strategies 🟡 Trial

Three distinct patterns, tangled together in the brainstorm. They solve different
problems and we probably want two of them.

#### (a) Traffic-weighted canary — Argo Rollouts
The standard shape: a `Rollout` replaces the Deployment, `setWeight`/`pause` steps
shift a percentage of traffic, an `AnalysisTemplate` queries a metrics provider
(Prometheus, CloudWatch, Datadog, a Job, a web endpoint), and a failed `AnalysisRun`
triggers automatic rollback. Traffic shifting needs a router: a service mesh, an
ingress controller, ALB/VPC Lattice on AWS, or the **Gateway API plugin** — which is
the one that matters to us, because it decouples canaries from adopting a mesh.

⚠️ Check the plugin's maturity against the official Argo Rollouts docs before
committing. Sources disagree: one vendor guide labels the Gateway API traffic-router
plugin **alpha** and pins Rollouts v1.9.1 with plugin v0.16.0, while another claims it
has been stable since 1.7. It also needs RBAC to `get/update/patch` HTTPRoutes.

**Where percentage ramps break** — LinkedIn's list, the best articulation of this I've seen:
- a random share of users' **critical** jobs runs on a version nobody validated
- a percentage can't balance **job types**, so some types miss the ramp window entirely
- **all-or-nothing changes** (a DB schema migration) can't apply to a share of requests
- **multi-component changes** can't be pinned together — one request hits one new and one old component

Their root cause, worth quoting on a slide: *percentage ramps assume interchangeable
requests, divisible changes and a single component.*

#### (b) Namespace-scoped canary — "canary namespaces", and it is validated
This was our own half-formed idea in the brainstorm. LinkedIn's AI Platform team
presented exactly it, for their GPU training platform.
📎 `2026-11-11_ship-faster-ship-safer-a-k8s-native-canary-pipeline-for-critical-clust.pdf`

Their five Kubernetes-native moves:

| # | Move | Mechanism |
|---|---|---|
| 1 | **Isolate** | A canary instance of each component beside prod — own Deployment, Service, ConfigMap, **own DB schema and DB user** |
| 2 | **Route** | Only a dedicated `canary-test` namespace reaches it: `namespaceSelector` on the webhook config; a per-namespace service URL for backing services |
| 3 | **Validate** | 20+ real training workflows on real GPU nodes, same storage and data as prod |
| 4 | **Gate** | An **Argo CD PostSync hook Job** — exit 0 advances, exit 1 fails the sync |
| 5 | **Promote** | Cluster by cluster, auto-triggered on pass |

The line that sells it: *"One label is the switch. No proxy, no mesh — the API server
does the routing, and prod pays zero extra hops."* Canary pods land on the **same
shared GPU node pool** as prod, so there's no idle test cluster to pay for.

**Results they reported:** ~1 week per release → **~1 hour**, auto-validated; staging-only
coverage → every prod cluster on real GPUs and storage; several prod SEVs → **10+
potential incidents caught before prod**; a dedicated GPU test cluster → zero idle GPUs.

**Their failure catalogue is the argument for doing this at all** — and the pattern in it
is the real insight: *the quieter the failure, the longer it lasted.* Loud failures took
minutes (webhook down ~30 min, no pod admission); silent ones took hours to days — one
webhook change altered library setup in GPU pods and **stripped GPUs from jobs for ~2
days, 820 executions across 110 workflows**.

**Why this pattern fits us specifically:**
- It is the only one that works for **cluster-critical services** — admission webhooks,
  controllers, credential services — which have no user traffic to split.
- It handles **all-or-nothing changes**: migrations land on the canary schema first, so
  schema changes meet real data shapes before prod.
- It is **Argo CD-native** (PostSync hook), so it composes with §1.2 and §1.9 instead of
  needing new machinery.
- Their coverage model is worth stealing wholesale: **every new incident becomes a new
  canary workload**, so the suite grows and the same failure can't slip through twice.

#### (c) Shadow / mirrored traffic
Real production requests replayed against the new version, responses discarded.
LinkedIn has this as their *next* step — "shadow production jobs" so coverage tracks
actual usage, plus **infra-failure replay**, where prod runs that failed on
infrastructure automatically become canary tests. Stage it after (b).

#### Our recommendation
**(b) for platform and cluster services, (a) for user-facing HTTP apps, (c) later.**
Pick one service of each kind for the pilot. Note that an analysis step is the
non-negotiable part of either: a canary without automated analysis and rollback is
just a slower outage.

**The agent tie-in, and the most directly copyable idea we brought home:** LinkedIn's
roadmap is an agent that watches the pipeline, reads the PostSync hook logs and canary
job runs when it fails, finds the cause, and drafts a fix-or-revert PR for human
review — which then re-enters the canary. That is §6 stage 1→2 running inside a real
blast-radius boundary, with the canary as the approval rather than a person.

### 1.8 Drift detection 🟢 Adopt
Once §1.1 is in place, drift becomes an alert rather than a discovery. The thing to
decide is what we do *with* drift: self-heal silently, or open a ticket? For
cluster-critical resources, silent self-heal plus an audit event; for anything a
human may have hot-fixed during an incident, alert first.

### 1.9 Traceability for agent-authored change 🟢 Adopt
From the ArgoCon "agent-ready checklist", which is the single most useful artifact
we brought home:

1. **Integration** — the Argo CD MCP server, so an agent reads real app state instead
   of guessing.
2. **Progressive delivery** — canary → risk monitor → custom steps → automated rollback.
3. **Traceability** — human *or* agent attribution and a timeline of who changed what;
   GitOps Promoter was shown as the mechanism.

That checklist *is* a slide. The conference-wide version of the same idea:
*Progressive Delivery for Trust: How Agents Earn the Right to Merge* (Transfix).
📎 `2026-11-11_progressive-delivery-for-trust-how-agents-earn-the-right-to-merge.pdf`
🖼 `deck-assets/03-agents-earn-merge/`

**The move that deck makes is worth stealing outright: run progressive delivery with
*authority* as the payload instead of traffic.** The same five primitives, repointed:

| Primitive | Normally | Repointed at an agent |
|---|---|---|
| Canary step | a traffic percentage | **shadow mode** — the agent proposes and decides, but withholds the action |
| AnalysisTemplate | query Prometheus | grade the agent's work against outcomes |
| Success condition | error rate under threshold | an **eligibility policy** — an ordered list of checks, same answer every time |
| Promotion | more traffic | **a reviewed permission change** (a PR to the job's config) |
| Abort | roll back the version | **revoke the grant** |

Two things from it to put on slides verbatim:

- **"Models produce evidence. Code decides authority."** (with the footnote *a rule can be
  wrong too*). That is the cleanest statement of the gate we need between §6 stage 3 and 4.
- **Four roles, four responsibilities** — proposer (the agent, *can't approve its own PR*),
  tester (runs in one namespace, only while it exists), approver/armer (writes the ticket
  first or doesn't act), merger (the forge enforces the rulesets). Kubernetes RBAC governs
  what each can touch in the cluster; repository rules govern what can happen in the repo.
  Separation of duties, expressed in machinery we already run.
- **And the honest gap:** revoking permission *leaves completed merges in place*. Withdrawal
  is not a rollback. Design the revoke path before granting anything.

### 1.10 Argo cost intelligence ⚪ Watch
From ArgoCon: **OctoDoctor** (best-practice analysis, shipped as a Claude skill) and
**cost intelligence** surfacing OpenCost data directly in the Argo CD UI. Interesting,
not urgent — but it connects to §4.3, and "cost shown at the point of deploy" is a
better behaviour change than a monthly FinOps report.

**Also worth reading before we commit to a shape:**
- *Robust CI as a Safety Net: Moving Fast at Scale with AI-Generated GitOps* (Ford) —
  📎 `2026-11-11_robust-ci-as-a-safety-net-moving-fast-at-scale-with-ai-generated-gitop.pdf`
- *You Don't Have to Choose: Argo and Flux Are Friends!* (Akuity, ControlPlane) — no deck posted
- *Git, APIs, and Kubernetes: Where Should Platform Configuration Live* (Salesforce/Heroku, ConfigHub) — no deck posted

---

## 2. Kyverno as the policy layer

**Goal:** the rules that make auto-sync and agent-authored change safe are themselves
code, tested in CI, not tribal knowledge in a reviewer's head.

### 2.1 CEL policies; constrain both users and agents 🟢 Adopt
The in-tree direction is clear: **ValidatingAdmissionPolicy / MutatingAdmissionPolicy**
using CEL, replacing admission webhooks. Fewer moving parts, no webhook availability
risk in the admission path. Kyverno is positioning around this rather than against it
("unified policy as code at scale").

- 📎 *Goodbye Webhooks, Hello CEL: Using Native Validating and Mutating Admission
  Policies* (Google) — `2026-11-11_goodbye-webhooks-hello-cel-using-native-validating-and-mutating-admiss.pdf`
- 📎 *Open Policy Agent (OPA) Intro & Deep Dive* — `2026-11-12_open-policy-agent-opa-intro-deep-dive.pdf` (the other half of the space, if we want a fair comparison slide)
- *Signed, Sealed, Denied: Attestation-Driven Admission with Kyverno + CEL at AT&T* — no deck posted, but the pattern (admission gated on a signed attestation) is the mature end state of §2.2.

**The agent angle:** the same policy that stops a human from deploying a privileged
container is the one that bounds what an agent can do. Write policies against the
*action*, not the actor, and agent governance mostly comes for free.

### 2.2 Shift left — run policy in CI 🟢 Adopt
Policy that only runs at admission teaches people nothing until their deploy fails.
Running the same policy set in CI turns it into fast feedback, and for agents it
turns a failed apply into a test failure the agent can iterate against — which is the
difference between an agent that learns our rules and one that retries blindly.

### 2.3 Change-window gating tied to change records 🟡 Trial
("CHREC windows" in the brainstorm — change records / CHG tickets.) Kyverno policy
that fails an Argo sync when there is no approved change record for the window.

This is the piece that buys organizational permission for §1.1: teams give up manual
sync because the control they actually wanted — "nothing goes out during the freeze"
— is now enforced automatically instead of by someone refusing to click.

Needs a decision on the integration: query the ITSM/Jira API from a policy, or
project approved windows into the cluster as a CRD that policy reads. **The second
is the right answer** — it keeps the admission path from depending on an external
service being up.

### 2.4 Policy for AI egress and MCP traffic 🟡 Trial
Covered in §4.4 — governing which models and which MCP tools a workload may reach.
Sessions: *Integrating Envoy AI Gateway and Kyverno Authz for Realtime Governance of
LLM and MCP Traffic* (Nirmata, Nutanix), *Agentic Ops: Building Guardrails for
Autonomous AI with Policy-as-Code* (W.W. Grainger), *After Admission: Kernel
Enforcement for Agents Kyverno Let In*. None posted decks — these are YouTube
follow-ups.

---

## 3. Running AI inside Kubernetes

**Goal:** agents get a safe place to run with an identity, before anyone gives one
production credentials.

### 3.1 Sandboxing: Kata and friends 🟡 Trial
An agent runs code it just wrote. A container shares a kernel. That is the whole
argument, and it was a keynote ("Sandbox Your Agents", Red Hat).

Options seen: **Kata Containers / microVMs**, gVisor, pre-warmed pod runtimes,
**vCluster per agent**, WASM/Spin for the narrow case of executing generated code,
and Lima for local.

- 📎 *Groundhog Pod: Scaling AI Inference with Kata Pod Snapshots* (Microsoft) —
  `2026-11-11_groundhog-pod-scaling-ai-inference-with-kata-pod-snapshots.pptx`
  — snapshots are how you make microVM start-up cost acceptable.
- 📎 *Lima as the Universal AI Sandbox* (NTT) — `2026-11-10_lima-as-the-universal-ai-sandbox.pdf`
- 📎 *Sandboxing on Kubernetes with WebAssembly: A Hands-on Tutorial* — `2026-11-11_sandboxing-on-kubernetes-with-webassembly-a-hands-on-tutorial.pdf`
- No decks, worth the recordings: *Lessons Learned Sandboxing Agents with kagent* (Solo.io),
  *Untrusted Code on Secure Runtimes: Agent Sandboxes on Kubernetes* (Google),
  *Running MCP Servers at Scale: Sandboxed Tool Execution* (vCluster).

### 3.2 Agent substrate 🔵 Decide — or at least pick a vocabulary
Solo.io's framing, promoted to a keynote with Anthropic and Google: *"Pods are not
enough for AI agents."* The substrate is the layer below the agent providing
**identity, sandbox, session/state management, and egress control**.

It is a concept plus an emerging set of implementations, not a product we install
tomorrow. What we should take from it now is the **checklist**: for any agent we run,
name where those four things come from. If we can't answer, the agent isn't
production-ready. Related: *The Harness Is the New Runtime* (Solo.io, keynote).

### 3.3 kagent 🟡 Trial
The CNCF project for running agents on Kubernetes — agents as CRDs, with a Contribfest
and a 1.0 lightning talk ("Kagent 1.0 with Agent Substrate"). This is the most
concrete, lowest-commitment way to get agents running as first-class cluster workloads
rather than as a laptop script with a kubeconfig.

Nice tangible demo from the floor: *Agentic Karpenter: using kagent + Claude to tune
your autoscaling* — which is §10.3 and §6 at once.

### 3.4 Agent / AI gateway 🟡 Trial
One policy-and-routing point in front of both **models** and **tools (MCP)**: routing,
per-team quota, cost attribution, auth, audit. The standards direction is the
**Gateway API Inference Extension** rather than a vendor proxy — which means we can
treat it as the same data plane as our normal ingress work, not a separate stack.

- 📎 *Composing Inference on Kubernetes: Gateway, Schedule, Serve, Observe* (Google, Red Hat) —
  `2026-11-11_composing-inference-on-kubernetes-gateway-schedule-serve-observe.pdf`
  — **this is the reference-architecture slide**; use it as our baseline diagram.
- 📎 *Who Ran Up the Inference Bill? AI Traffic Control with KServe and Gateway API
  Inference Extensions* — `2026-11-10_who-ran-up-the-inference-bill-ai-traffic-control-with-kserve-and-gatew.pdf`
- 📎 *New Traffic, New Rules: Standardizing AI-Aware Networking in Kubernetes* (NVIDIA, Solo.io) —
  `2026-11-10_new-traffic-new-rules-standardizing-ai-aware-networking-in-kubernetes.pdf`
- No deck: *From Proxy to Platform: Building a Multi-Tenant AI Gateway* (Adobe) — closest to our situation.

### 3.5 Obot for directory-managed MCP permissions 🟡 Trial
Open-source MCP/tool-and-skill management: which MCP servers exist, who may call
them, with permissions driven from the corporate directory rather than per-developer
config files. The problem it solves is real and immediate — today an MCP server's
permissions are whatever token the person who started it happened to have.

**Pair it with the authorization question**, which got its own talks:
📎 *What Can Your AI Agents Actually Do? Cedar Analysis for MCP Servers* (AWS, Stacklok) —
`2026-11-11_what-can-your-ai-agents-actually-do-cedar-analysis-for-mcp-servers.pdf`.
Note the alternatives here — ToolHive (Stacklok) covers similar ground; this is worth
a short bake-off rather than defaulting to the first name we wrote down.

### 3.6 Non-human identity 🟢 Adopt — and start before the agents arrive
The conference's strongest "don't retrofit this" message. "The Identity Crisis: Who is
the AI Agent in Your Cluster?" was a keynote. The consensus answer is SPIFFE/SPIRE-style
workload identity with short-lived credentials, plus fine-grained authz (Cedar, OpenFGA).

- 📎 *Every Kubernetes Object Deserves an Identity: The SPIFFE Broker API* — `2026-11-12_every-kubernetes-object-deserves-an-identity-the-spiffe-broker-api.pdf`
- 📎 *PKI Done Easy with Pod Certificates and Cluster Trust Bundles* (Google, Microsoft) — `2026-11-12_pki-done-easy-with-pod-certificates-and-cluster-trust-bundles.pdf`
- 📎 *When the Agent Lost Its Patience: Securing Cloud-Native AI Workflows Against Identity Leakage* (Bitso) — `2026-11-10_when-the-agent-lost-its-patience-securing-cloud-native-ai-workflows-ag.pdf`
- 📎 *Your CI's Mistaken Identity* (IBM/Red Hat) — `2026-11-11_your-ci-s-mistaken-identity.pdf`
- No deck, best title: *Demo Theater: DO NOT Give AI Agents Credentials!* (Solo.io)

### 3.7 Durable execution ⚪ Watch
Agents fail halfway through multi-step work and leave infrastructure in a partial
state. The named answer is durable workflow engines — Uber is pushing **Cadence** for
this. Relevant the moment we do §6 stage 4 (long-running agents that act), not before.
📎 `2026-11-12_agents-fail-workflows-recover-durable-agent-orchestration-with-cadence.pdf`

---

## 4. Observability: know what the AI is actually doing

**Goal:** answer "what are we using AI for, what does it cost, and what is it talking
to?" with data instead of anecdote.

### 4.1 Figure out what we are using AI for 🟢 Adopt — do this first
This is the honest gap in our own list and it blocks the other three. We cannot pick
the right model per use case, or defend the spend, until we can enumerate the use
cases. The instrumentation below *is* the inventory mechanism.

### 4.2 OTel, and getting more out of Jaeger 🟢 Adopt
OTel is the default assumption now (38 sessions vs 17 mentioning Prometheus directly).
Two practical threads for us:

- **Cardinality and sampling are the scale story**, every time.
  📎 *Two-Stage OTel Aggregation: Taming Istio Cardinality at 10k-Pod Scale* (Yahoo) —
  `2026-11-10_two-stage-otel-aggregation-taming-istio-cardinality-at-10k-pod-scale.pdf`
  📎 *Tracing at Scale: 16 Billion Spans/Hour at Nubank* — `2026-11-10_tracing-at-scale-running-a-16-billion-spans-hour-pipeline-at-nubank.pdf`
- **eBPF auto-instrumentation** gets traces out of services nobody is going to
  re-instrument by hand. 📎 `2026-11-10_from-bytes-to-traces-a-deep-dive-into-opentelemetry-ebpf-instrumentati.pdf`
- **Prescriptive patterns** rather than inventing our own conventions:
  📎 *OTel Blueprints: Prescriptive Patterns for Enterprise Observability* — `2026-11-11_otel-blueprints-prescriptive-patterns-for-enterprise-observability.pdf`
  📎 *Filter, Transform, Route: Mastering OTTL in the Collector* — `2026-11-11_filter-transform-route-mastering-ottl-in-the-opentelemetry-collector.pdf`
  📎 *Fast and Furious: OTel Drift* — `2026-11-12_fast-and-furious-otel-drift.pdf`

**AI observability specifically is being standardized right now** — worth tracking so
we don't invent span attributes that get superseded:
📎 *The Race to Standardize AI Observability* (Google, Microsoft) — `2026-11-12_the-race-to-standardize-ai-observability.pdf`

### 4.3 Cost vs productivity; right model per use case 🟡 Trial
Cost per token / per task is now a first-class metric with real tooling behind it.

- 📎 *Clueless About The Cost of AI Model Usage? OpenCost + llm-d inference cost tracking* (IBM) —
  `2026-11-11_clueless-about-the-cost-of-ai-model-usage-opencost-llm-d-first-of-a-ki.pdf`
- 📎 *Dropping LLM Inference Cost by Two-Thirds with Open Weights* (AWS) — `2026-11-12_dropping-llm-inference-cost-by-two-thirds-with-open-weights-and-kubern.pdf`
- The number to steal for the deck: **Verkada triaged 4,700 alerts/month at $0.33 each**
  across nine production clusters. That is the format our business case should take —
  cost per unit of work, next to the cost of the human doing it.

### 4.4 MCP call tracking and egress visibility 🟡 Trial
Who called which tool, with whose identity, and what left the network. Two layers:
trace-level (MCP calls as spans) and network-level (what egressed, to where). Kyverno
and the AI gateway (§2.4, §3.4) are the enforcement half; this is the seeing half.
Do the seeing first — we cannot write a sane egress policy against traffic we have
never looked at.

📎 *From Packets to Paychecks: eBPF-Based Network Cost Attribution at Scale* (Adobe) —
`2026-11-12_from-packets-to-paychecks-ebpf-based-network-cost-attribution-at-scale.pdf`
— the same technique attributes egress to a team.

### 4.5 Don't let the monitoring stack become the attack surface ⚪ Watch
📎 *Zero-Trust Telemetry: Stopping AI-Powered Poisoning Attacks on Observability
Pipelines* — `2026-11-11_zero-trust-telemetry-stopping-ai-powered-poisoning-attacks-on-observab.pdf`.
Relevant once agents *act* on telemetry (§6 stage 4): poisoned telemetry becomes a
remote-control channel for an agent with cluster credentials.

---

## 5. Managing multiple clusters (on-prem + EKS)

**Goal:** two things, and they are **not** the same problem —

1. **Fleet toil stops.** Upgrades and fleet-wide changes stop being a project each time.
2. **Live-live survives a region.** Our public apps run active/active across two EKS
   regions, and a region failure is invisible to end users.

(1) is the item from `Key lessons` with the most organizational weight: *upgrade and
maintenance toil will be unsustainable.* (2) is the one with the most customer exposure.

### 5.1 Two multi-cluster problems that need different answers 🔵 Decide

Everything in this section goes wrong if we try to solve both with one tool.

| | **A. Fleet management** | **B. Live-live region pair** |
|---|---|---|
| **The question** | How does the same thing get to N clusters? | How does traffic stop hitting a dead region? |
| **Shape** | Many clusters, on-prem + EKS, one definition | Two EKS clusters, two regions, both serving prod |
| **Layer that solves it** | Delivery (ApplicationSets) + lifecycle (CAPI) | Traffic (DNS / anycast / mesh) + data replication |
| **Unit of failure** | A cluster falls behind | A region goes away mid-request |
| **Measured by** | Time to roll a change fleet-wide | RTO/RPO, and whether a user saw a 5xx |
| **What a multi-cluster scheduler adds** | Placement, *if* placement is dynamic | **Nothing** — both regions already run the app |

The trap is buying a multi-cluster control plane to solve B. B is a traffic and state
problem, and a scheduler sits at the wrong layer to solve it.

#### A. Fleet management — one definition, N clusters

- **Cluster API (+ CAREN)** — declarative cluster *lifecycle*; Nutanix's CAREN work made
  the keynote. The answer for "clusters themselves are GitOps objects," and what §5.2
  upgrades hang off.
- **ApplicationSets + progressive sync (§1.4)** — the delivery half. Generators fan one
  definition out to every cluster; `rollingSync` stops the fan-out hitting all of them
  at once.
- **Shortcoming to state out loud:** ApplicationSet is a *templating controller, not a
  scheduler*. Placement is whatever the generator evaluates to at reconcile time. There
  is no health input and no rescheduling loop — when a cluster dies, its Applications go
  Degraded and **nothing moves**. Dropping the cluster from the generator *deletes* those
  Applications, it doesn't relocate them. It also has no fleet-wide replica concept: you
  cannot express "20 replicas spread across 3 clusters, rebalance on failure."
- That is fine for A, where placement is static and the answer to a dead cluster is CAPI
  rebuilding it. It is **not** a DR mechanism, and the earlier draft of this section was
  wrong to imply it could be.

📎 *N Clusters, One kubectl: Multi-Cluster That Just Works* (NVIDIA, Salesforce) —
`2026-11-10_n-clusters-one-kubectl-multi-cluster-that-just-works.pdf`
🖼 `deck-assets/11-multicluster-one-kubectl/` — also names the tax nobody budgets for:
multi-cluster breaks `kubectl`, and developers pay that cost daily.

#### B. Live-live: two EKS regions, no user-visible downtime

Four layers. **Every one has to clear the same RTO, or the fastest layer is wasted.**

**1. Delivery — already solved, and not by a scheduler.**
ApplicationSets fan the app to both regions. Both always run it, both always take
traffic. Nothing has to be *moved* during an outage because nothing was ever in one
place. This is the case where ApplicationSets are exactly the right tool — and the
reason the Karmada question is largely orthogonal to our DR requirement.

**2. Traffic — where failover actually happens.**

| Option | How failover happens | Shortcoming |
|---|---|---|
| **Route 53 health checks** + failover / latency / weighted records | Health check fails → record withdrawn | **DNS TTL is a floor on RTO, and clients lie.** Browsers, JVMs and connection pools cache past TTL. A 60s TTL is not 60s recovery ⚠️ |
| **AWS Global Accelerator** | Anycast IPs stay constant; AWS reroutes at the edge, no DNS change involved | Per-accelerator + data-transfer cost; AWS-only, nothing for on-prem. Get the real failover number from AWS docs before it goes on a slide ⚠️ |
| **k8gb** — CNCF **Incubating** as of this show | Kubernetes-native global load balancing: declarative CRDs, health-aware, cross-cluster DNS | Still DNS, so it inherits the TTL/caching problem. Vendor-neutral, which is the reason to care — it covers on-prem too |
| **Istio multicluster + locality failover** | East-west gateways; locality-aware LB sheds to the remote region on outlier detection | Only triggers if `DestinationRule` outlier detection is actually configured. Cross-region mesh traffic is an inter-region data-transfer line item |
| **MCS API** (`ServiceExport` / `ServiceImport`) | The upstream direction for cross-cluster service discovery | A direction, not a product. Watch |

**Recommendation:** **Global Accelerator at the public edge** — it is the only option
here that keeps client-side DNS caching off our RTO — with Route 53 behind it, plus
**Istio locality failover** east-west, since the company direction commits us to Istio
anyway (see `ISTIO-VS-GATEWAY-API.md`). Evaluate **k8gb** if we want one mechanism that
also covers on-prem rather than two.

**Three things we inherit by routing region-to-region through the mesh**, none of which
are reasons not to, but all of which are costs to name:

1. **Mesh telemetry cardinality is a budget line, not a footnote.** Yahoo's numbers:
   86% fewer series and ≈**$140K/yr saved on one cluster** after two-stage OTel
   aggregation 🖼 `deck-assets/08-otel-cardinality/`. A second region doubles the
   surface. **The trap on their p42:** moving to delta temporality **silently breaks
   every `rate()` query** — if we go there, it is a dashboard migration, not a config
   flag. Ties to §4.2.
2. **Sidecar vs ambient is still open and live-live is a reason it matters** —
   `ISTIO-VS-GATEWAY-API.md` D3 never settled it. The useful datapoint: **Coinbase**
   runs 79 production clusters, 4,000+ services and 500K+ RPS on SPIFFE/SPIRE identity
   and has stated **ambient** as their direction. That is the closest thing at this show
   to a large-multi-cluster-shop verdict. 📄 outline in
   `deck-assets/00-pptx-outlines/2026-11-12_from-bearer-tokens-to-mesh-native-mtls….txt`
3. **Istio multicluster service discovery is O(n²)** — each istiod watches every remote
   API server. Fine at two clusters, which is our case; the reason to know it is that it
   caps how far this pattern extends into fleet A. *Breaking the O(n²) Wall* (Microsoft)
   is the fix in flight.

**Don't restate §10.5** — EKS Container Network Observability / CloudWatch Network Flow
Monitor already covers the cross-AZ and inter-region flow data this section needs, with
its limits and its ~5,000-node ceiling written down there.

**3. State — the layer that actually sets our RTO.**
Traffic moves in seconds; data does not. Aurora Global Database promotion, DynamoDB
global tables, replication lag, and what happens to writes that landed in the dead
region *are* the DR design, and none of it is a Kubernetes problem. **We cannot fail
traffic over faster than we can fail data over, and doing it in that order is how you
get split-brain writes.** Belongs with §8; needs a named owner.

**4. Capacity — the one everyone forgets.**
Live-live at 50/50 means a region failure sends 100% of traffic to a cluster sized for
50%. Either both regions run at ≤50% utilization permanently — expensive, and directly
against the utilization goals in §5.3 and §10.3 — or **Karpenter scale-up time is part
of our RTO**, including image pull and app warm-up. Decide which, then test it, or the
failover succeeds and the surviving region browns out under the traffic it just
inherited.

**The budget to write down**, because "no user-visible downtime" is the sum of these and
not a single number: detection + propagation + client DNS caching + in-flight connection
draining + surviving-region scale-up + data convergence.

#### Where Karmada actually enters

Karmada is a genuine scheduler: ordered `clusterAffinities` as a primary/DR primitive,
cluster taints on NotReady driving rescheduling, application-level failover with a
toleration window and limited state preservation, and `Divided` replica scheduling that
redistributes replica counts across survivors. Bloomberg runs their streaming platform
on it for precisely these reasons.

None of that is needed for B, because live-live never relocates anything. It becomes
necessary only for workloads that **cannot** be live-live: singletons, leader-elected
services, sharded stateful systems, and streaming or batch jobs that can run in exactly
one place at a time. So the decision is not "Karmada or ApplicationSets," it is:

> **Do we have production workloads that can't run active/active?**
> **No** → ApplicationSets + traffic-layer failover; Karmada stays ⚪ Watch.
> **Yes** → name them and count them, then price Karmada against running just those
> active/passive with a runbook.

⚠️ **This supersedes the earlier wording** — "start by assuming ApplicationSets cover us
and add Karmada only when we can name the thing ApplicationSets can't do." Same instinct,
but that version left the trigger undefined, so it could never actually fire. The rule
above names the trigger. **Anything quoting the old line needs updating**, including the
readout deck.

Two lighter rungs before the Karmada step (also in `GOALS-GAPS.md` §5.1): **Sveltos**,
for add-on distribution by cluster *classification* rather than static lists; and **Open
Cluster Management**, whose Placement API has cluster taints with toleration seconds and
which ApplicationSet can consume via its `clusterDecisionResource` generator — giving
failover-aware placement while Argo CD stays the delivery mechanism. Real path, lightly
travelled ⚠️: spike it, don't assume it.

**Sessions.** 📎 *From Load Balancer Sprawl to Multicluster Service Discovery*
(Databricks) — `2026-11-12_from-load-balancer-sprawl-to-multicluster-service-discovery.pdf`
— xDS-based cross-cluster discovery instead of a cloud load balancer per cluster pair;
the direct answer to how our two regions find each other without LB sprawl.
No decks: *k8gb Is Growing up* (Veritas Automata), *From Cloud Outages to AI Security
Challenges: Building Resilient DNS Infrastructure at Scale* (Google, Ivanti — the failure
modes of the layer our traffic plan depends on), *Breaking the O(n²) Wall: Pub/Sub
Federation for Istio Multicluster Service Discovery* (Microsoft), *SIG-Multicluster Intro
and Deep Dive*, *Multicluster AMA: The Community Answers*, *Karmada Updates and Use
Cases* (Bloomberg, Huawei), *Beyond Stateless vs Stateful: A Unified Workload API for
Multi-Cluster* (LinkedIn — its workload-attributes framing is how to decide which of our
apps can be live-live), *TAG Operational Resilience*.

### 5.2 Upgrades without a war room 🟢 Adopt
- 📎 *Binary Version Is Not Behavior: Skip-Level Control Plane Upgrades with KEP-4330*
  (LinkedIn) — `2026-11-11_binary-version-is-not-behavior-skip-level-kubernetes-control-plane-upg.pdf`
  — skip-level upgrades are the direct answer to upgrade toil.
- 📎 *5,000 Nodes in Minutes, Twice in a Week: A Pattern for Fleet-Wide Node Changes*
  (NVIDIA) — `2026-11-11_5-000-nodes-in-minutes-twice-in-a-week-a-pattern-for-fleet-wide-node-c.pdf`
  🖼 `deck-assets/12-fleet-node-changes/` — two kernel CVEs, ~5,600 nodes converged in 30
  minutes. The pattern: **ship the change together with the check that fails without it**,
  and let `kubectl get` be the audit. Their status enum is what let an **agent drive the
  rollout** cluster by cluster — the cleanest agent-safe automation at the show, and a
  better template for §6 than anything in the AI track. (`github.com/NVIDIA/nodewright`)
- 📎 *LTS, EOL, CVEs: Solutions for Stress-Inducing Scenarios* (Microsoft) —
  `2026-11-10_lts-eol-cves-solutions-for-stress-inducing-scenarios.pdf`
- 📎 *Look Before You Leap: Preventing In-Motion K8s Updates in Fleet Robotics*
  (Agility Robotics) — `2026-11-11_look-before-you-leap-preventing-in-motion-k8s-updates-in-fleet-robotic.pdf`
  — "don't upgrade a thing that is mid-task" generalizes well past robots.
- 📎 *The Next Era of Kubernetes Operator Lifecycle Management* (Apple, Red Hat) —
  `2026-11-11_the-next-era-of-kubernetes-operator-lifecycle-management.pdf`

### 5.3 On-prem specifics ⚪ Watch
📎 *Saturated by Design — Maximizing Cluster Allocation in On-Premises Kubernetes*
(The Trade Desk) — `2026-11-10_saturated-by-design-maximizing-cluster-allocation-in-on-premises-kuber.pdf`.
On-prem is where utilization actually matters, because you can't scale the bill down.

### 5.4 Scale failure modes to design against 🟢 Adopt (as reading)
The highest transfer-value talks at the whole show:
- 📎 *Death by a Thousand Patches: How Pod Status Updates Exhaust etcd* (AWS) —
  `2026-11-11_death-by-a-thousand-patches-how-pod-status-updates-exhaust-etcd-and-wh.pdf`
- 📎 *How Anthropic Almost Melted GKE (And the PRs That Saved It)* —
  `2026-11-11_how-anthropic-almost-melted-gke-and-the-prs-that-saved-it.pdf`
- 📎 *Green Dashboards, Broken Clusters: Taming Stale Watches in Kubernetes Operators* —
  `2026-11-11_green-dashboards-broken-clusters-taming-stale-watches-in-kubernetes-op.pdf`
- 📎 *Welcome to Health Check Hell: CRDs, Statuses and Missing Standards* —
  `2026-11-10_welcome-to-health-check-hell-crds-statuses-and-missing-standards.pdf`
### 5.5 The point of all this: developers never learn a cluster name 🟡 Trial

**BackstageCon and Platform Engineering Day were both full co-located days**, and
Backstage alone had 12 sessions. The trend is not "portals are back" — it is that the
industry has converged on *abstracting the fleet away from developers*, and this year
the framing sharpened from **portal** to **intent**: the developer declares what the
workload needs, and the platform decides where it runs. Syntasso's talk title says it
outright — *Why IDPs Must Become Intent-Driven*.

**The concrete version of that for us: no developer should ever write a cluster name.**
They declare constraints —

```yaml
placement:
  regions:     [us-east-1, us-west-2]
  compliance:  pci
  capability:  gpu
  residency:   us
```

— and the platform resolves them to clusters. A cluster name in an app repo is a bug:
it hard-codes exactly the decision §5.1 spends four layers keeping fluid. We cannot do
live-live failover, and we cannot drain a cluster for an upgrade (§5.2), if 200 repos
name the cluster they expect to be in.

**This is already how every layer in §5 works** — they all select on labels, not names,
which is why it's a vocabulary problem more than a tooling problem:

- **ApplicationSet cluster generator** matches clusters by **label selector**. We have
  this today, it costs nothing, and it is the cheapest first step.
- **OCM Placement** and **Karmada PropagationPolicy** both select on cluster labels and
  taints — if we ever get to §5.1's "can't run active/active" list, the vocabulary we
  build now is the input they'd consume.
- **ClusterProfile** (SIG-Multicluster) is the upstream attempt to standardize how a
  cluster *advertises* its own properties ⚠️ verify status before quoting — the missing
  half, because constraint-based placement is only as good as the cluster-side labels.
- **Score** (CNCF) is the same idea one layer up: a workload spec that declares
  dependencies and requirements and lets the platform bind them.

**The prerequisite nobody budgets for: cluster labels become an API.** The moment a
developer selects on `compliance: pci`, that label is a contract — it needs an owner, a
schema, and §2 policy that stops a cluster joining the fleet without it. Ungoverned
labels are how constraint-based placement quietly lands a regulated workload in the
wrong place, and the failure is silent because everything still reports Healthy.

**Honest caution on Backstage.** 12 sessions and a co-located day is a real signal, but
Backstage is a TypeScript application we would own, upgrade and staff — not something we
install. The portal is the most visible part of an IDP and the least load-bearing; the
catalog and the placement abstraction carry the value, and both can exist before any
portal does. **Recommendation: build the constraint vocabulary first** (ApplicationSet
label selectors + governed, policy-enforced cluster labels) **and keep the portal a
separate, later decision.** That ordering also gets §6's agent work the machine-readable
catalog it needs (`GOALS-GAPS.md` A10) without putting a portal project on the critical
path.

📎 *So You Want to Build a Platform? You Probably Already Have One* (ŌURA) —
`2026-11-10_so-you-want-to-build-a-platform-you-probably-already-have-one.pdf`
📎 *From Platform Catalog to Conversational Agent: Wiring AI Into Your Internal Developer
Platform* (Stone Payments) — `.pptx`; text outline already extracted to
`deck-assets/00-pptx-outlines/`
📎 *From Curious to Contributor: Ship Your First Backstage PR* (AT&T, Red Hat, Spotify)
No decks: *Platform Engineering after the AI Hype: Why IDPs Must Become Intent-Driven*
(Syntasso), *Built for What's Next: Backstage's Role in AI-Assisted Development*
(DoorDash, Spotify), *TAG DevEx State of the Union*, *OpenChoreo: Developer Platform for
Both Humans and Agents* (WSO2), *RBAC as a Platform Capability* (Sony Interactive
Entertainment), *Salesforce Runs on Heroku* — the maximal-abstraction end of the
spectrum, useful as the contrast slide.


---

## 6. Our AI rollout journey

**Goal:** a maturity ladder we can place ourselves on, a gate for each rung, and a date
on the two rungs we are actually committing to. This was the most original part of the
brainstorm — it deserves to be the backbone of the deck's second half.

**Committed targets:** 🎯 **Stage 1 (alert triage) by Q2 2027.** 🎯 **Stage 2 (agents
opening PRs) by end of 2027.** Stages 3+ carry **no date, deliberately** — they are
gated on §1 and §2 landing, and dating them before that would be fiction.

| Stage | What it is | What has to be true first | Target | Evidence from the show |
|---|---|---|---|---|
| **0 — Local prompts** | Engineers using agents on their own machines, human applies every change | Nothing. **We are here.** | — | *Lima as the Universal AI Sandbox* 📎 |
| **1 — Alert triage: explain, never act** | For every alert, the agent posts a breakdown: **is this real or noise, how serious and why, what changed recently, where to go to learn more** (runbook, dashboard, the last three times this fired) **and a suggested action.** A human decides; a human acts | §4 instrumentation + §7 read-only data surface. **No policy gate required, because it has no write path** — which is exactly why it goes first | 🎯 **Q2 2027** | Verkada: **4,700 alerts/month at $0.33 each, 139s median time-to-summary**, 87.5% prompt-cache read ratio; 📎 *The SRE Is Not Dead: What AI Taught Us about Missing Context in K8s Incident Response* (Best Buy); **k8sgpt** and **HolmesGPT** — both OSS, both read-only, both exactly this rung |
| **2 — Background agents propose PRs** | An event fires and the agent proposes a fix **as a PR**. Reactive whack-a-mole, but every change still enters through review and progressive delivery | §1.9 traceability + §2 policy in CI. The agent proposes; progressive delivery decides | 🎯 **end of 2027** | *Robust CI as a Safety Net* (Ford) 📎; Podium ships **30% of PRs** with autonomous K8s coding agents |
| **3 — Always-on analysis** | The agent now **owns** alert severity and noise — continuously triaging, setting severity, silencing. Write access to the *alerting system*, still not to clusters | Stage 1 running long enough to have a measured track record; §3.6 identity; hallucination handling | no date — deliberate | Verkada (same deployment, further along); *Catching Ghosts in the Machine: Hallucination Detection* (Apple, no deck) |
| **4 — Agents that fix** | Automated remediation inside a blast radius we defined | §3.1 sandbox, §3.7 durable execution, §1.7 automated rollback, §2.3 change windows | no date — deliberate | 📎 *1000 Clusters, 1 Smarter Brain: AIOps at Salesforce*; 📎 *No RAG, No Regrets: Letting an LLM Drive 30 EKS Clusters* (Mastercard) |
| **5 — Teams write agents that reason like them** | A DBA agent, an SRE agent and a dev agent fired at the same incident, their conclusions compared | Everything above, plus an agent platform (§3.3) teams can publish to | no date — deliberate | 📎 *The Seams Are the Trap: Agent Fleets from CNCF Parts You Already Have* (IBM); 📎 *Governing and Scaling Agents in Heterogeneous Environments* (Google) |

**Why stage 1 is new, and why it sits below the PR rung.** The earlier draft of this
ladder had agents opening PRs *before* agents analysing anything — which is backwards.
Writing a PR is a write action with a blast radius; explaining an alert is not. Stage 1
is the only rung on this ladder with **no write path anywhere**, which means it needs no
policy gate, no sandbox and no rollback story to be safe. That is what makes Q2 2027
realistic: the gating work is §4 and §7, not §1 and §2.

**What stage 1 has to produce to count as done** — if the output is a summary nobody
acts on, we built a chatbot:
- A **relevance call** (real / noise / duplicate of an open incident) with the reasoning
  visible, not just a label.
- A **severity assessment with its basis** — what makes this page-worthy or not, stated
  in terms a responder can disagree with.
- **Links out**: the runbook, the dashboard, the deploy that correlates, prior firings.
  This is the half that makes it trustworthy, and the half that depends on §7.
- **A suggested action** the human can accept, modify or reject — and we log which, because
  **that log is the track record stage 2 and stage 3 are gated on.** Instrument it from
  day one or we arrive at the stage 2 gate with no evidence.

**The gate principle, borrowed from the Transfix talk (§1.9):** *models produce evidence,
code decides authority.* An agent never promotes itself; it accumulates a track record
that a deterministic, reviewed policy reads. Stage 1's accept/modify/reject log **is**
that evidence.

**The honest counterweight, from Salesforce's AIOps talk (🖼 `deck-assets/15-aiops-salesforce/`):**
their first agentic attempt landed at **25% accuracy**. What fixed it was not a better
model — it was knowledge management (a continuously curated base of runbooks and design
docs, with Slack threads weighted *down*) and an evaluation harness (LLM-as-judge against
a rubric, plus stratified human sampling). Budget for both or expect the same 25%.
**This lands hardest on stage 1**, where a confidently wrong severity call is worse than
no call at all — a responder who learns to distrust the summary will not read it again.

**The honest framing for the deck:** stage 1 is where the measurable ROI is, it carries
almost no risk because it cannot act, and Verkada has already priced it at **$0.33 an
alert**. Stage 2 adds a write path, which is why it is a year out rather than two
quarters: the gate between 1 and 2 is the GitOps/policy spine in §1 and §2. That is the
argument for doing the boring work first — the Q2 2027 date is safe, the end-of-2027
date is a bet on §1 and §2 landing.

Useful reality check to show alongside:
📎 *How Far Are Open-Source LLMs from Running Real Kubernetes Operations? A 10-Scenario
Benchmark* — `2026-11-10_how-far-are-open-source-llms-from-running-real-kubernetes-operations-a.pdf`


---

## 7. Getting production data out for AI to analyse

**Goal:** agents reason over real state without being handed production credentials.

- **Dump cluster state to a database** — a read-only, queryable snapshot is both the
  grounding layer for agents and a drift/audit artifact in its own right. The pattern
  shown as *"a queryable audit layer"*:
  📎 *One Recipe, Five Clouds, One Query: Portable GPU Configuration with a Queryable
  Audit Layer* (NVIDIA, Upbound) — `2026-11-10_one-recipe-five-clouds-one-query-portable-gpu-configuration-with-a-que.pdf`
- **Prometheus metrics** — same principle; the agent queries the metric store, not the cluster.
- **The counter-argument worth hearing:** Mastercard argued *against* RAG for this —
  let the model call live APIs through a narrow, audited tool surface instead of
  maintaining a stale index. 📎 `2026-11-11_no-rag-no-regrets-letting-an-llm-drive-30-eks-clusters-in-production.pdf`
- **Why this is a security control, not just plumbing:** read-only extraction is what
  lets us say yes to agent analysis without saying yes to agent credentials in prod.

---

## 8. Data protection: PVC reclaim, backups, no data loss 🟢 Adopt

Unglamorous and the only item on this list where being wrong is unrecoverable.

- Audit `reclaimPolicy` on every StorageClass that backs something we care about —
  `Delete` is the default and it is the wrong default for stateful production data.
- **Velero** for backup/restore; the project update was titled *Faster Backups,
  Consistent Snapshots, Incremental Everything*.
- There is now a **Kubernetes Data Protection working group** (Broadcom) — a sign the
  primitives are still being standardized, so avoid building anything bespoke.
- The restore drill matters more than the backup. Tie it to §5: a cluster we can
  rebuild and restore is a cluster we are willing to upgrade aggressively.
- Context slides: 📎 *GitOps Meltdown* again — the 39-cluster cascade is a data-loss story
  as much as a GitOps story. 🖼 `deck-assets/01-gitops-meltdown/p24_…` is their
  "protect stateful infrastructure" slide (`reclaimPolicy: Retain`, `whenDeleted: Retain`)
  and `p19_…` is the one that should scare us: their most recent Velero snapshot was **12h
  old, partial and untested**. The storage layer, not the backups, is what saved the data.

---

## 9. Secrets: Vault alternatives 🔵 Decide

**Infisical** is the named candidate (they also demoed *From Wide Open to Locked Down:
Running AI Agents on Kubernetes*, which is a useful signal that they are thinking
about the agent case).

**Reframe the decision before shopping.** The direction of travel at the show was away
from "a better secret store" and toward **not having long-lived secrets at all**:

- *Kubernetes Secrets Were a Bad Idea. Now What?* (RBC, lightning talk)
- *Stop Writing Secrets Into YAML: A Rotation-First Identity Pattern* (Veritas Automata)
- 📎 PKI with pod certificates and cluster trust bundles; SPIFFE broker API (§3.6)

So: pick a store for the secrets that must exist, and simultaneously start moving
workload-to-workload auth onto short-lived identity. The second effort is what shrinks
the first problem. Agents make this urgent — a long-lived secret an agent can read is
a long-lived secret that can leave the building.

---

## 10. AWS strategy

### 10.1 Crossplane, starting with S3, aiming at the app layer 🟡 Trial
We already have skin in this game (`function-lifecycle/`, `crossplane-contribfest-slc/`).
What changed this year: Crossplane is being positioned as **"the cloud native framework
for platform engineering"**, with functions/composition as the main extension path — and
composite APIs are now explicitly framed as *the agent-facing API*. An agent is far
better at calling a narrow, typed composite API than at writing raw cloud YAML, which
strengthens the case for the function work we are already doing.

- 📎 *Crossplane Contribfest — Start Your Journey to Crossplane Function Maintainer* —
  `2026-11-11_crossplane-contribfest-start-your-journey-to-crossplane-function-maint.pdf`
- No deck: *Crossplane — The Cloud Native Framework for Platform Engineering* (Upbound),
  *What Changes When Crossplane Adoption Gets Real* (American Family Insurance) —
  that second one is the adoption-pain talk, worth the recording.
- ⚪ **Watch: kro** (Kubernetes Resource Orchestrator) — lighter-weight resource-graph
  composition, backed by AWS/Microsoft/Red Hat/Uber. *Achieving Cross-Cloud Portability
  with the Kubernetes Resource Orchestrator*. Relevant if Crossplane's weight becomes
  the objection.

### 10.2 LZA → CDK → Crossplane writes Kubernetes 🔵 Decide
Our proposed layering. State it on a slide as a diagram with the seam marked:
**where does ownership hand off from CDK to Crossplane?** Everything below the seam is
account/landing-zone scaffolding that changes rarely; everything above is app-owned
infrastructure that changes constantly and should be GitOps-driven. Getting that line
wrong is how you end up with two systems fighting over the same resource.

Supporting evidence that the industry is moving the same way:
*We Have GitOps at Home: How Meta Went from Terraform on Cron to GitOps for AI Infra*
(keynote, no deck posted).

### 10.3 Karpenter + VPA: dynamic resizing 🟡 Trial
The brainstorm's observation — Karpenter doesn't move quickly enough for dynamic
resizing — matches what was presented. The new ingredient is **in-place pod resizing**,
which changes the HPA/VPA calculus because resizing no longer means restarting.

- *The New Scaling Matrix: Balancing In-Place Resizing, VPA, HPA and Automation* (Solo.io) — no deck
- *In-Place Pod Resizing Like I'm 5* (AWS) — no deck
- 📎 *Autoscaling at Scale with KEDA* (Stripe) — `2026-11-12_autoscaling-at-scale-with-keda.pdf`
- 📎 *Battle-tested Autoscaling Paradigms with KEDA* (AWS, Kedify) — `2026-11-11_battle-tested-autoscaling-paradigms-with-keda.pdf`
- **Our specific idea** — feed Prometheus metrics and Kafka consumer lag into scaling
  decisions for faster reaction — is exactly what KEDA is for. Frame it as "KEDA for
  the signal, VPA/in-place for the size", not as a custom controller.
- Also: *Demo Theater: Why Your Kubernetes Autoscalers Keep Fighting (and How to End
  the Thrash)* — the failure mode when HPA, VPA and Karpenter all act on the same workload.

### 10.4 FinOps: track everything to teams 🟡 Trial
Label/tag discipline is the unglamorous prerequisite; without it every cost tool
produces the same unattributable pie chart. OpenCost is the CNCF-native path and it
connects to §1.10 (cost in the Argo UI) and §4.3 (cost per token).
📎 *From Packets to Paychecks: eBPF-Based Network Cost Attribution at Scale* (Adobe) —
network egress is the cost line that normally escapes attribution entirely.

### 10.5 Network observability on EKS 🟡 Trial — now defined
"Network monitor plugin" resolves to **EKS Container Network Observability**, which is
backed by **Amazon CloudWatch Network Flow Monitor (NFM)**.
Docs: https://docs.aws.amazon.com/eks/latest/userguide/network-observability.html

- **What it is:** an EKS add-on running a DaemonSet agent on every worker node, plus
  NFM `Scope` and `Monitor` resources the console creates for you. Surfaces as the
  cluster's **Network** tab, with a service map and a flow table.
- **⚠️ Add-on name is inconsistent in the docs:** the Terraform example uses
  `aws-network-flow-monitoring-agent`; the CLI script passes `amazon-network-flow-monitor`.
  Confirm with `aws eks describe-addon-versions` before writing it into anything.
- **Metrics we'd actually use** — OpenMetrics, scrapable straight into Prometheus/Grafana,
  dimensions `instance_id, iface, pod, namespace, node`:
  `ingress_flow` / `egress_flow`, `ingress_bytes` / `egress_bytes`,
  `ingress_packets` / `egress_packets`; plus the ENA allowance counters
  `bw_in_allowance_exceeded`, `bw_out_allowance_exceeded`, `pps_allowance_exceeded`,
  `conntrack_allowance_exceeded`, `linklocal_allowance_exceeded`. **Those last five are
  the prize** — they explain the packet loss that is otherwise invisible from inside the
  cluster, and nothing else we run reports them.
- **Flow-level** (pushed to the NFM backend, not scraped): TCP retransmissions,
  retransmission timeouts, bytes transferred. The agent takes the **top 500 flows by
  volume every 30s per node**, categorized Intra-AZ / Inter-AZ / EC2→S3 / EC2→DDB /
  Unclassified — the last bucket is where pod-to-internet and on-prem traffic lands.
- **Enabling it:** scraping is **off** unless the add-on config sets `OPEN_METRICS=on`
  (with `OPEN_METRICS_ADDRESS`, default 127.0.0.1, and `OPEN_METRICS_PORT`, default 80).
  Needs agent add-on **v1.1.0+**, IAM via Pod Identity or IRSA with the managed policy
  `CloudWatchNetworkFlowMonitorAgentPublishPolicy`, Terraform AWS provider **v6.21.0+**,
  and a region where NFM is supported.
- **Limits:** ~5M flows/minute, roughly **5,000 nodes**, beyond which AWS warns
  monitoring performance may degrade. Pod metadata enrichment requires pods in their own
  network namespace — **host-network pods won't be attributed**. Service-map queries span
  1 hour (up to 1,000 flows), the flow table 2 hours (up to 2,500).
- **Cost:** the page states no prices, only a link to NFM pricing. Get a number before
  enabling fleet-wide.
- **What it is *not*:** the page says nothing about VPC CNI network policy, Container
  Insights, VPC Flow Logs, or eBPF, and never names the collection mechanism. So it is
  **not** a substitute for the agent/MCP egress visibility in §4.4 — it gives us AZ-level
  and AWS-service-level top talkers plus an "unclassified" bucket, not "which MCP tool
  did this agent just call."

**Two things it unlocks beyond networking:**
1. **Inter-AZ bytes are a cost line.** Per-namespace, per-pod egress is exactly the data
   behind §10.4 FinOps attribution — and the cost line that normally escapes attribution
   entirely. Compare with 📎 *From Packets to Paychecks* (Adobe), which gets the same
   attribution via eBPF; worth deciding which one we want rather than running both.
2. **Canary signal for §1.7.** Per-namespace egress bytes and TCP retransmits are a
   cheap, app-agnostic health metric for an `AnalysisTemplate` or a PostSync check —
   they catch "the new version is quietly failing to reach its dependency," which is
   precisely the silent failure mode LinkedIn said took days to notice. *Our idea, not
   AWS's — test it before it goes on a slide.*

### 10.6 DevOps agent 🟡 Trial
This is §6 applied to our AWS surface specifically. The relevant proof points:
Mastercard driving 30 EKS clusters with an LLM 📎, Hertz tuning Karpenter and EKS with
AI-driven optimization, and *Agentic Karpenter* (kagent + Claude). Scope it as **stage 2
first** — an agent that analyses our AWS spend and right-sizing and opens PRs — before
anything that acts.

---

## Building our deck

### What we have to work with
`kubecon-overview/slides/` holds **144 decks (567 MB)** — every deck the official
schedule exposed, named `YYYY-MM-DD_session-title-slug.ext`. `slides/MANIFEST.csv`
maps each file back to its session, speakers, companies, room, track and source URL.
Only ~29% of sessions posted slides; recordings for the rest land on the CNCF YouTube
channel a few weeks after the event.

### Proposed narrative

A 20-minute internal readout, three acts:

| # | Slide | Source to lift from |
|---|---|---|
| 1 | **Title + the two forces** | Our own; numbers from `analysis/THEMES.md` (36% of titles AI-related, 59% of abstracts) |
| 2 | **"Fleet toil is unsustainable"** | `12-fleet-node-changes/p07` + `13-skip-level-upgrades/p02` (250+ clusters, ~500K nodes) |
| 3 | **"Agents are a workload class now"** | Keynote framing: Agent Substrate / Sandbox Your Agents / The Identity Crisis (titles only — no decks posted) |
| 4 | **Proof it's real, not demos** | Verkada 4,700 alerts @ $0.33 · Podium 30% of PRs · Mastercard 30 EKS clusters · Salesforce 1,000 clusters |
| 5 | **The spine: GitOps + policy + progressive delivery** | Our own diagram; borrow structure from `05-composing-inference/p05` |
| 6 | **The agent-ready checklist** | Our ArgoCon notes + `03-agents-earn-merge/p10` (authority as the payload) and `p17` (four roles) |
| 7 | **Promotion: Kargo vs GitOps Promoter** | Our own comparison table (§1.2) |
| 8 | **What happens without guardrails** | `01-gitops-meltdown/p12` (hidden coupling), `p17` (4-day timeline), `p22`–`p24` (the three lessons) |
| 8b | **Canary without a mesh: namespace-scoped canaries** | `02-canary-namespaces-linkedin/p15` (five moves) + `p25` (1 week → 1 hour) + `p08` (what silent failures cost) |
| 9 | **Policy as code moves in-tree** | `04-cel-admission-policy/p06` + `p13` (tradeoffs vs Kyverno) |
| 10 | **Change windows enforced, not negotiated** | Our own (§2.3) — the trade we're offering teams for auto-sync |
| 11 | **Sandboxing agents** | `00-pptx-outlines/…groundhog-pod….txt` (open the .pptx to copy) + 📎 *Lima as the Universal AI Sandbox* |
| 12 | **Identity before agents** | `07-spiffe-broker-identity/p10`–`p12` + `06-cedar-mcp-authz/p17` |
| 13 | **AI gateway: one place for models and tools** | `05-composing-inference/p12` + `p17` (ecosystem map) |
| 14 | **What is AI costing us** | `09-opencost-llmd/p10`–`p11` + Verkada's $0.33/alert |
| 15 | **Observability: OTel, cardinality, egress** | `08-otel-cardinality/p02` ($140K/yr) + `10-network-cost-attribution/p18` |
| 16 | **Our AI rollout ladder, stages 0–5, with two dated commitments** | Our own (§6) — **the centrepiece slide**. Lead with stage 1 (alert triage, Q2 2027) and stage 2 (PRs, end of 2027); Verkada's $0.33/alert is the ROI number. Gate principle from `03-agents-earn-merge/p09`; reality check from `15-aiops-salesforce/p06` |
| 17 | **Where we are and the next gate** | Our own |
| 18 | **Multi-cluster is two problems: fleet toil vs. surviving a region** | `11-multicluster-one-kubectl/p10` (choose where complexity lives) + our own §5.1 table. The live-live stack (traffic / state / capacity) is a second slide if there's room |
| 19 | **The boring slide that saves us** | `14-etcd-blast-radius/p16` + `01-gitops-meltdown/p19` + `p24` |
| 18b | **Developers never learn a cluster name** | Our own (§5.5) — the constraints-not-names YAML block, over `11-multicluster-one-kubectl/p10`. Backstage/IDP trend is the setup; the cluster-label-as-API prerequisite is the punchline |
| 20 | **Decisions we need from this room** | The table below |

### The extracted assets — already done

**`deck-assets/` holds 103 slide PNGs across 18 decks**, chosen against the sections above
and rendered at 150 DPI. Filenames are `p<page>_<slide-title>.png`, so every image maps
back to its page in the source PDF. `deck-assets/MANIFEST.md` carries the full attribution
per deck (title, speakers, company, track, source URL) plus a note on what each set is for.

Asset-path references in the table above are relative to `deck-assets/`.

Five `.pptx` decks can't be rendered here (no LibreOffice), so
`deck-assets/00-pptx-outlines/` holds their per-slide text instead — including *Groundhog
Pod* (Kata snapshots), Coinbase's SPIFFE/SPIRE migration, and KServe. For those, open the
`.pptx` directly and copy the slide: it keeps formatting and beats any PNG we could make.

To pull more pages — the page index that drove the selection is reproducible:

```shell
# per-page text of a deck, to find the slide you want
for p in $(seq 1 $(pdfinfo deck.pdf | awk '/^Pages:/{print $2}')); do
  echo "p$p: $(pdftotext -f $p -l $p -nopgbrk deck.pdf - | tr '\n' ' ' | cut -c1-120)"
done

# render it
pdftoppm -r 150 -png -f 12 -l 14 deck.pdf out/slide
```

### Rules for lifted slides
- **Attribute every one**: talk title, speaker(s), company, "KubeCon NA 2026". The
  manifest has all of it — `slides/MANIFEST.csv`, keyed by filename.
- Internal use only. These are speaker-owned decks downloaded from Sessionize; don't
  republish them externally or put them in a customer-facing deck.
- They are third-party files. Nothing in this repo executes them; keep it that way.

---

## Decisions we need

| # | Decision | Section | Needs |
|---|---|---|---|
| 1 | Kargo or GitOps Promoter | §1.2 | Owner + a 2-week spike on one app |
| 2 | Do we have prod workloads that **can't** run active/active? | §5.1 | The list, named and counted. If it's empty, Karmada is ⚪ Watch and this decision closes |
| 2a | Public-edge failover: Global Accelerator, Route 53 alone, or k8gb? | §5.1B | Recommend Global Accelerator — it's the only one that keeps client DNS caching off our RTO. Needs a cost number |
| 2b | Live-live capacity: permanent 2× headroom, or Karpenter scale-up inside our RTO? | §5.1B | A tested number for region-failure scale-up time, and the RTO we're actually promising |
| 2c | Constraint vocabulary before portal, or a Backstage project? | §5.5 | Recommend vocabulary first — ApplicationSet label selectors + policy-enforced cluster labels. Needs an owner for the cluster-label schema |
| 3 | Where CDK hands off to Crossplane | §10.2 | A diagram with the seam marked |
| 4 | Secret store choice — and whether it's the right question | §9 | Inventory of long-lived secrets first |
| 5 | Change-record integration: API call or CRD projection? | §2.3 | Recommend CRD projection; needs ITSM owner |
| 6 | Are we committing to stage 1 by Q2 2027 and stage 2 by end of 2027? | §6 | Stage 1 needs §4 + §7 only — that date is safe. Stage 2 is a bet on §1 + §2 landing. Stages 3+ stay unscheduled |
| 7 | Canary pattern per workload class — namespace-scoped vs traffic-weighted | §1.7 | Recommend both: namespace-scoped for platform services, Rollouts for HTTP apps. Pick one pilot service of each |
| 8 | NFM vs eBPF for network cost attribution | §10.4, §10.5 | Don't run both. NFM is lower effort on EKS; eBPF covers on-prem too |

## Open questions on the brainstorm itself

**Resolved since the first draft:**
- **"Canary namespaces"** (§1.7) — turns out to be a validated pattern, not a vague
  idea. LinkedIn presented it in detail; §1.7 is now written around their five moves.
- **"Network monitor plugin"** (§10.5) — resolves to EKS Container Network
  Observability / CloudWatch Network Flow Monitor; §10.5 now has the metric names,
  enablement steps and limits.

**Still open:**
- Whether **Obot vs ToolHive** (§3.5) is a real bake-off or a default.
- Two entries were expanded from shorthand — "Skater reloader" → **Stakater Reloader**
  (§1.6), "CHREC windows" → **change-record windows** (§2.3). Flagging in case either
  reading is wrong.

## Sources

Everything above traces to one of: `kubecon-overview/analysis/THEMES.md`,
`kubecon-overview/analysis/TOOLS.md`, `kubecon-overview/data/sessions.json`,
`argocon/am-session.md`, `Key lessons/Takaways`, or the decks in
`kubecon-overview/slides/`. The Argo CD version numbers in §1.5 and the Kargo
adoption figure in §1.2 came from release changelogs and vendor posts found online —
verify both before they go on a slide.
