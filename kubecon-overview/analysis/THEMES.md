# KubeCon + CloudNativeCon North America 2026 — What Actually Mattered

**Salt Lake City, Nov 9–12, 2026.** 603 scheduled items, 501 with speakers, ~289
main-conference + maintainer-track talks, 11 CNCF co-located events on Day 0.

Source of truth for everything below: the official Sessionize schedule, pulled to
`data/schedule.json` (raw) and `data/sessions.{json,csv}` (flattened). Counts are
regex matches over session titles + abstracts (`scripts/analyze.py`), so treat them
as signal strength, not precision measurement.

---

## TL;DR for people who didn't go

1. **The conference is now an AI-infrastructure conference.** 36% of main-conference +
   maintainer-track talk *titles* mention AI/LLM/agents/GPU/inference; 59% of abstracts do. Nine of the ten
   Day 1 keynote slots were AI-adjacent (agent substrates, sandboxing agents, RL on
   Kubernetes, agent identity, physical AI).
2. **The interesting problem moved from "run containers" to "schedule accelerators."**
   DRA, topology-aware scheduling, GPU sharing, and quota are where the hard
   engineering talks are. Kubernetes itself is assumed solved; its scheduler is not.
3. **Agents became a workload class with its own requirements** — sandboxing, identity,
   durable execution, egress control — and the ecosystem is racing to define the
   substrate layer (kagent, agent-substrate, AgentMesh, MCP gateways).
4. **Platform engineering reframed itself around agents as users.** The IDP question
   is no longer "how do developers self-serve?" but "what can an agent safely do
   without a human in the loop?"
5. **Security is dominated by two things:** the CVE/vulnerability firehose, and
   non-human identity. "Who is the AI agent in your cluster?" was a keynote title.
6. **Observability is converging hard on OpenTelemetry** and is now being pointed at
   AI itself (inference metrics, cost per token, hallucination detection).

---

## Theme 1 — AI infrastructure is the main track now

**Evidence:** 45 sessions in the dedicated *AI Inference + Agentic* track (the largest
non-maintainer content track), 94 sessions mentioning agents, 74 mentioning GPUs, 55
mentioning inference, plus a full-day *Cloud Native AI + Inference Day* and an
*Agentics Day: MCP + Agents* co-located event.

### 1a. Inference serving is a solved-ish stack with named parts

The emerging reference architecture, repeated across talks: **Gateway API Inference
Extension** in front, **llm-d / vLLM** doing the serving, **KServe** for the model
lifecycle, **Kueue/Volcano** for batch and training, **DRA** for devices, **OTel** for
telemetry. "Composing Inference on Kubernetes: Gateway, Schedule, Serve, Observe"
(Google + Red Hat) is the canonical version of this slide.

Specific lessons worth stealing:
- **Cache-aware routing is the single biggest inference win.** KV-cache locality beats
  round-robin badly — covered in "Cache Me If You Can: LLM Inference with llm-d"
  (Red Hat), "Inside the Inference Load Balancer" (OpenAI), and a year-in-production
  telecom report from LG Uplus + AWS.
- **Cold starts are the second.** "Reduce vLLM Pod Cold Starts with KServe Kernel
  Caching" (Oracle/Red Hat), "Groundhog Pod: Scaling AI Inference with Kata Pod
  Snapshots" (Microsoft), "Hidden Pod Startup Latency: Container Image Pull"
  (LinkedIn), "Scaling AI Model Distribution with Dragonfly" (model pulls from
  HuggingFace are an image-distribution problem).
- **Cost per token is now a first-class metric.** "Who Ran Up the Inference Bill?",
  "Dropping LLM Inference Cost by Two-Thirds with Open Weights" (AWS), and
  OpenCost + llm-d inference cost attribution (IBM).

### 1b. Scheduling is the hard problem

The strongest engineering content at the show. **Dynamic Resource Allocation (DRA)**
has gone from KEP to the organizing abstraction for devices — 14 sessions, a WG Device
Management update, an NVIDIA DRA driver deep dive, an example-driver deep dive
(Microsoft), and HAMi moving to a "DRA-native lightweight future."

Themes inside scheduling:
- **GPU sharing / fractional GPUs**: "Why Are You Still Wasting Whole GPUs?",
  "Fixing GPU Time-Slicing on Kubernetes", "Beyond the Cluster Boundary: Sharing
  GPUs at Scale" (Snapchat).
- **Topology awareness**: "Quota Isn't Enough: Topology Aware Scheduling on Modern
  GPU Clusters" (Cohere + CoreWeave), SIG Scheduling's multi-level/topology-aware
  update, the new **WG Workload-Aware Scheduling**.
- **Quota and fairness**: "Why Quotas Are Hard in Kubernetes" (VMware by Broadcom),
  WG-Batch updates, Kueue, Volcano "for the agentic AI era."
- **Honest failure reports**, which are the most valuable talks to read:
  "Anthropic's Kubernetes Scheduler for Frontier AI: What Worked, What Broke",
  "How Anthropic Almost Melted GKE (And the PRs That Saved It)", "Anatomy of an
  Outage: When Bursty ML Workloads Break the Kubernetes Scheduler" (Google +
  Isomorphic Labs), "The Scheduling Stack: Real-World Lessons from Anthropic,
  Anyscale, Google, and CERN".

### 1c. Hardware is leaking into the Kubernetes model

"When GPUs Become NUMA Nodes" (NVIDIA), memory-coherent hardware, disaggregated
memory (CoHDI), RISC-V bare metal, Apple Silicon as GPU nodes, TEEs for frontier AI
(Anthropic + Google). The node abstraction is getting stretched.

---

## Theme 2 — Agents are a new workload class

Not "AI in your CI" — *agents running inside the cluster, with credentials*. The
keynote framing was explicit: **"Agent Substrate: Open Layers for Agentic Systems"**
(Anthropic/Google/Solo.io), **"Sandbox Your Agents"** (Red Hat), **"The Harness Is
the New Runtime"** (Solo.io), **"The Identity Crisis: Who is the AI Agent in Your
Cluster?"** (Google).

Four concrete sub-problems the ecosystem has named:

| Problem | What people are doing | Talks |
|---|---|---|
| **Sandboxing** | microVMs/Kata, pre-warmed pods, Lima as a sandbox, vCluster per agent | "Lessons Learned Sandboxing Agents with kagent", "Zero-Gap GPU Execution… Pre-Warmed Pod Runtimes" (LinkedIn), "Running MCP Servers at Scale: Sandboxed Tool Execution" (vCluster), "Lima as the Universal AI Sandbox" |
| **Identity & authz** | SPIFFE/SPIRE, workload identity, Cedar, OpenFGA, AuthZEN | "The Agent Has Entered the Cluster: AI Auth 101", "What Can Your AI Agents Actually Do? Cedar Analysis for MCP Servers" (AWS/Stacklok), "Least-Privilege by Default… Golden Path" (Hitachi), "Every Kubernetes Object Deserves an Identity: The SPIFFE Broker API" |
| **Durability** | agents fail mid-task → durable workflow engines | "Agents Fail. Workflows Recover. Durable Agent Orchestration with Cadence" (Uber), Cadence Contribfest on durable agent examples, "Verifiable Execution: Durable Workflows That Cryptographically Prove What They Did" |
| **Tool plumbing (MCP)** | MCP servers as cluster workloads, AI gateways routing models + tools | 34 sessions mention MCP; "AI Gateways in Practice: Model Routing, Inference Scheduling, and MCP", "From Proxy to Platform: Building a Multi-Tenant AI Gateway" (Adobe), "MCP Was the Easy Half, The Rest Was a Skill Issue" (WSO2) |

**Named projects to watch:** `kagent` (CNCF, agents on K8s — has its own Contribfest),
`agent-substrate` (Solo.io), `AgentMesh` (Google, github.com/google/agentmesh),
`ToolHive`/Stacklok for MCP server management, Cadence for durable agent workflows.

**Real production data points**, not demos:
- Verkada: MCP agent triaging **4,700 alerts/month at $0.33 each** across nine clusters.
- Podium: **30% of PRs shipped by autonomous K8s coding agents**.
- Mastercard: an LLM driving **30 EKS clusters** in production (and arguing against RAG).
- Salesforce: AIOps across **1,000 clusters**.
- Meta: moved from "Terraform on cron" to GitOps for AI infra (keynote).

---

## Theme 3 — Platform engineering, retargeted at agents

32 Platform Engineering sessions + a full-day Platform Engineering Day + BackstageCon.
The shift: **platforms now have two classes of user, humans and agents**, and the agent
one needs machine-readable contracts, not docs and portals.

- "Platform Engineering after the AI Hype: Why IDPs Must Become Intent-Driven" (Syntasso)
- "Agents on the Platform: Four Perspectives on the Conversation We're Already Having in Private"
- "From Platform Catalog to Conversational Agent: Wiring AI Into Your IDP" (Stone)
- "The Prompt Layer: What Platform Engineering Has to Own Next"
- "Progressive Delivery for Trust: How Agents Earn the Right to Merge" (Transfix)
- "GitOps Without You Writing YAML: How Flux Grounds AI Agents in Real APIs"
- "Robust CI as a Safety Net: Moving Fast at Scale with AI-Generated GitOps" (Ford)
- Backstage maintainers: "Built for What's Next: Backstage's Role in AI-Assisted Development"

Durable (non-AI) platform themes that stayed strong:
- **Multi-cluster is normal now.** 19 sessions: Karmada, SIG-Multicluster, "N Clusters,
  One kubectl" (NVIDIA/Salesforce), "Beyond Stateless vs Stateful: A Unified Workload
  API for Multi-Cluster" (LinkedIn), multicluster service discovery (Databricks).
- **Composition/abstraction layers**: Crossplane ("The Cloud Native Framework for
  Platform Engineering" + a Contribfest on writing functions), **kro** (Kubernetes
  Resource Orchestrator) for cross-cloud portability, Helm 4 ("Breaking up Is Hard"),
  kustomize/kubectl updates.
- **GitOps is mature and being hardened**: "You Don't Have to Choose: Argo and Flux Are
  Friends!", ArgoCon day 0, and the cautionary tale of the show — "GitOps Meltdown:
  How a Commit Triggered a Cascading Delete of 39 Clusters in Production" (Nutanix).
- **Policy is moving in-tree**: "Goodbye Webhooks, Hello CEL: Using Native Validating
  and Mutating Admission Policies" (Google), Kyverno's "unified policy as code",
  attestation-driven admission at AT&T.

---

## Theme 4 — Security: vulnerability fatigue + non-human identity

17 Security-track sessions, a full-day Open Source SecurityCon, 23 sessions touching
CVEs/vulnerabilities, 13 on SPIFFE/workload identity.

- **The CVE firehose is the stated pain.** "Mythos vs Maintainers: Drowning in the
  Vulnerability Tsunami" (ControlPlane/Docker), "Welcome to the Vulnpocalypse!",
  "Gone in 60 Minutes: Close the Exploitable Window with Detection as Code",
  KubeEdge "Fighting Fire with Fire: Scaling Vulnerability Management in the AI Era".
  Related: Kubernetes now has a process for **AI-generated security reports**, and
  "AI Found a 0-Day in Metal3. What Happens Next?" is the case study.
- **Identity for workloads and agents** is the growth area: SPIFFE/SPIRE broker API,
  pod certificates + cluster trust bundles (Google/Microsoft), "From Bearer Tokens to
  Mesh-Native mTLS" (Coinbase), "Stop Writing Secrets Into YAML: A Rotation-First
  Identity Pattern", "Your CI's Mistaken Identity" (IBM/Red Hat).
- **Supply chain** remains steady-state rather than hot: in-toto "a few million
  attestations later", SLSA/provenance (11 sessions), Sigstore/cosign, Harbor
  distributing LLM weights as signed artifacts.
- **New-ish:** AI-specific attack surface — prompt injection, model/weights
  distribution, "Zero-Trust Telemetry: Stopping AI-Powered Poisoning Attacks on
  Observability Pipelines", "Why Your Monitoring Stack is a Security Risk"
  (Anthropic/Snowflake).
- Confidential computing is being asked a skeptical question: "If It's Shared, It's
  Vulnerable: Is Kubernetes the Right Platform for Confidential Compute?" (NVIDIA).

---

## Theme 5 — Observability: OTel won, now point it at AI

38 sessions mention OpenTelemetry vs 17 for Prometheus directly — OTel is the default
assumption, plus an Observability Day co-located event.

- **Scale and cost control are the practitioner topics**: 16B spans/hour at Nubank,
  "Two-Stage OTel Aggregation: Taming Istio Cardinality at 10k-Pod Scale" (Yahoo),
  "Sample Smarter, Not Harder", Cortex on high-cardinality metrics, Fluent Bit
  pipeline engineering.
- **eBPF instrumentation is going mainstream**: OTel eBPF instrumentation internals,
  GPU observability with eBPF (Microsoft), eBPF-based network cost attribution (Adobe).
- **AI observability is actively being standardized**: "The Race to Standardize AI
  Observability" (Google + Microsoft), "Observability for LLM Inference on Kubernetes",
  "Beyond Dashboards: A Semantic Layer for AI-Driven Observability" (NVIDIA),
  "When Training Dies at 3 AM: Correlating Kubernetes Events with AI-Framework Failures".
- **AI-assisted incident response is real but sober**: HolmesGPT troubleshooting,
  "The SRE Is Not Dead: What AI Taught Us about Missing Context in Kubernetes Incident
  Response" (Best Buy), "Catching Ghosts in the Machine: Hallucination Detection for
  Observability Agents" (Apple), and a benchmark talk — "How Far Are Open-Source LLMs
  from Running Real Kubernetes Operations? A 10-Scenario Benchmark."

---

## Theme 6 — The boring-but-load-bearing track

Worth not missing in the AI noise. These are the talks with the highest
transfer value to any team running clusters:

- **etcd is still the blast radius**: "Death by a Thousand Patches: How Pod Status
  Updates Exhaust etcd" (AWS), "Surviving the Churn: Read Replicas and Controllers for
  Busy Clusters" (Anthropic), etcd 3.7→3.8.
- **Controller correctness**: "Green Dashboards, Broken Clusters: Taming Stale Watches
  in Kubernetes Operators", "Welcome to Health Check Hell: CRDs, Statuses and Missing
  Standards", "Fencing Tokens and the Three-Party Contract" (Broadcom).
- **Upgrades**: skip-level control plane upgrades with KEP-4330 (LinkedIn), eviction
  and node lifecycle futures, OLM's next era.
- **Ingress NGINX is retired** — "Four Resources, One Object: Surviving Gateway API
  After Ingress NGINX" (AWS) is the migration talk; Gateway API is the destination.
- **Autoscaling**: KEDA at Stripe, "The New Scaling Matrix: Balancing In-Place Resizing,
  VPA, HPA" (Solo.io), in-place pod resize finally changing the calculus.
- **Operational war stories**: "When the Clock Lies: How an 8-Minute Time Skew Locked a
  Kubernetes Cluster for a Day" (VMware), "Saturated by Design" (The Trade Desk).

---

## Theme 7 — Community / ecosystem signals

- **Kubeflow graduated** from CNCF (keynote + maintainer talk) — the "decade of AI on
  Kubernetes" narrative.
- **Apple is all-in publicly**: keynote on the Container framework, Pkl, 13 speakers.
- **Anthropic presented as an infrastructure end user** (10 speakers) — scheduler,
  etcd/controller scaling, GKE war story, monitoring-as-attack-surface.
- **Uber open-sourced its Kubernetes stack** ("Built on Kubernetes. Proven at Uber
  Scale. Now Open Source.") and is pushing Cadence as agent infrastructure.
- End-user program is growing: CVS Health (CAP), Adyen joining CNCF, the end-user
  feedback-loop keynote (Apple, Defense Unicorns, Lockheed Martin, NVIDIA).
- **Maintainer burnout / sustainability** remains a loud sub-theme, now sharpened by
  AI-generated issues and security reports flooding projects.
- Speaker volume by org: Red Hat (51), Google (45), Microsoft (31), NVIDIA (24),
  AWS (21), Solo.io (15), Apple (13), IBM (12), Anthropic (10).

---

## What this means for us

Mapped to the work we already have in `~/dev/kubecon` (ArgoCon notes, Crossplane
function work):

1. **GitOps + agents is the convergence point of our existing bets.** The ArgoCon
   "agent-ready checklist" (MCP server → progressive delivery → traceability) matches
   the conference-wide pattern: let agents propose, let progressive delivery and policy
   decide. Concrete follow-ups: argocd-mcp-server, GitOps Promoter, Kargo, and Kyverno
   release-window policies gating syncs.
2. **Crossplane/kro are now explicitly "the agent-facing API."** An agent is much
   better at calling a narrow composite API than at writing raw cloud YAML. That
   strengthens the case for the function/composition work in `function-lifecycle`.
3. **Start the non-human identity work before the agents arrive.** SPIFFE/SPIRE +
   short-lived credentials + Cedar/OpenFGA-style authorization is the conference's
   consensus answer, and retrofitting it later is the painful path.
4. **If we touch GPUs at all, standardize on DRA now** rather than device plugins;
   the entire ecosystem is migrating, including HAMi and the NVIDIA drivers.
5. **Budget for OTel migration and cardinality control.** Every scale story was a
   cardinality/sampling story.
6. **Ingress NGINX → Gateway API migration** is now unavoidable; it is also the same
   data plane the inference extensions build on, so it buys double.

---

## Reading list — highest value per minute, slides included

All ten have decks in `slides/`:

1. **Anthropic's Kubernetes Scheduler for Frontier AI: What Worked, What Broke**
   → `2026-11-12_anthropic-s-kubernetes-scheduler-for-frontier-ai-what-worked-what-brok.pdf`
2. **Composing Inference on Kubernetes: Gateway, Schedule, Serve, Observe** (the
   reference architecture slide) →
   `2026-11-11_composing-inference-on-kubernetes-gateway-schedule-serve-observe.pdf`
3. **GitOps Meltdown: How a Commit Triggered a Cascading Delete of 39 Clusters**
   → `2026-11-10_gitops-meltdown-how-a-commit-triggered-a-cascading-delete-of-39-cluste.pdf`
4. **Death by a Thousand Patches: How Pod Status Updates Exhaust etcd**
   → `2026-11-11_death-by-a-thousand-patches-how-pod-status-updates-exhaust-etcd-and-wh.pdf`
5. **Why Quotas Are Hard in Kubernetes**
   → `2026-11-10_why-quotas-are-hard-in-kubernetes-lessons-from-building-a-production-g.pdf`
6. **Goodbye Webhooks, Hello CEL** (in-tree admission policy)
   → `2026-11-11_goodbye-webhooks-hello-cel-using-native-validating-and-mutating-admiss.pdf`
7. **Mythos vs Maintainers: Drowning in the Vulnerability Tsunami**
   → `2026-11-10_mythos-vs-maintainers-drowning-in-the-vulnerability-tsunami.pdf`
8. **How Anthropic Almost Melted GKE (And the PRs That Saved It)**
   → `2026-11-11_how-anthropic-almost-melted-gke-and-the-prs-that-saved-it.pdf`
9. **Progressive Delivery for Trust: How Agents Earn the Right to Merge**
   → `2026-11-11_progressive-delivery-for-trust-how-agents-earn-the-right-to-merge.pdf`
10. **What Can Your AI Agents Actually Do? Cedar Analysis for MCP Servers**
    → `2026-11-11_what-can-your-ai-agents-actually-do-cedar-analysis-for-mcp-servers.pdf`

Not every talk posted slides — 144 of 501 sessions did. Notably missing decks:
"The Scheduling Stack" panel, "The Identity Crisis" keynote, and "Four Resources,
One Object: Surviving Gateway API After Ingress NGINX". See `slides/MANIFEST.csv`
for the full list, and `analysis/SESSIONS-BY-TRACK.md` (📎 markers) to see coverage
per track.
