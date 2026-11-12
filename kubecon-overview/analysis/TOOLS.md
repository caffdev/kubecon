# Tools, Projects & Concepts Catalog — KubeCon NA 2026

Everything named often enough at the show to be worth knowing, grouped by job.
"(n)" = number of sessions whose title or abstract mentions it (see
`analysis/term-frequency.txt`; counts are regex matches, so read them as
signal strength). ★ = new to most people this year / changed materially.

## AI serving & inference

| Thing | What it is | Why it came up |
|---|---|---|
| ★ **llm-d** (17) | Distributed LLM inference stack (Red Hat-led) | The reference OSS answer for multi-replica LLM serving with KV-cache-aware routing |
| **vLLM** (12) | High-throughput LLM inference engine | The serving engine under most stacks; cold start + kernel cache talks |
| **KServe** (5) | Model serving CRDs / lifecycle on K8s | Model rollout, autoscaling, now paired with Gateway API inference extensions |
| ★ **Gateway API Inference Extension** (5) | Inference-aware routing (model, LoRA, cache affinity) as a Gateway API extension | How "AI gateways" are being standardized instead of each vendor shipping a proxy |
| **AI gateway** (8) | Policy/routing layer for models + tools + MCP | Multi-tenant model routing, cost attribution, per-team quotas |
| **Kubeflow** (13) ★ graduated | ML platform suite on K8s | CNCF graduation announced in keynote |
| **Ray / KubeRay** | Distributed Python/AI compute | Anyscale keynote presence; RL and multimodal workloads |
| **Dragonfly** | P2P image & file distribution | Pulling multi-GB models from HuggingFace to GPU fleets |
| **Harbor** | OCI registry | Now distributing LLM weights as signed OCI artifacts |
| **OpenRL** ★ | Google's RL-on-Kubernetes work (keynote) | Reinforcement learning as a first-class cluster workload |

## Scheduling & accelerators

| Thing | What it is | Why it came up |
|---|---|---|
| ★ **DRA — Dynamic Resource Allocation** (14) | In-tree API for requesting devices (GPUs, NICs, TPUs) as structured resources | The replacement for device plugins. Drivers, example drivers, partitioning, DRA-native HAMi |
| **Kueue** (12) | Job queueing, quota, fair sharing | Batch/training admission control; WG-Batch |
| **Volcano** (6) | Batch scheduler (gang scheduling) | Repositioned "for the agentic AI era": training + inference + agents |
| **JobSet** (4) | Grouped-Job API for distributed training | Multi-node training topology |
| **HAMi** | GPU virtualization/sharing | Fractional GPUs, moving to DRA |
| **Karpenter** (9) / **Cluster Autoscaler** | Node provisioning | GPU node pools, spot, scale-out latency |
| **KEDA** (7) | Event-driven autoscaling | Stripe + AWS production talks; serving thousands of models |
| **WG Workload-Aware Scheduling** ★ | New working group | Topology-, locality- and workload-shape-aware placement |
| **Kata Containers / gVisor** (6) | Sandboxed runtimes | Agent sandboxing, pod snapshots for fast starts, confidential compute |

## Agents & agent infrastructure ★

| Thing | What it is |
|---|---|
| **MCP — Model Context Protocol** (34) | The tool/context protocol everything standardized on; MCP servers now run as cluster workloads behind gateways |
| **kagent** | CNCF project for running agents on Kubernetes (Contribfest + multiple talks) |
| **agent-substrate** (Solo.io) | Proposed layer below agents: identity, sandbox, state, egress — "pods are not enough" |
| **AgentMesh** (Google) | Governing/scaling agents across heterogeneous environments — `github.com/google/agentmesh` |
| **ToolHive / Stacklok** | MCP server management + Cedar-based authorization analysis |
| **Cadence** (Uber) | Durable workflow engine positioned as agent orchestration ("agents fail, workflows recover") |
| **A2A / AGNTCY** | Agent-to-agent interop efforts |
| **HolmesGPT** | AI troubleshooting agent for K8s incidents |

## Platform engineering

| Thing | Notes |
|---|---|
| **Crossplane** (7) | Positioned as "the cloud native framework for platform engineering"; functions/composition the main extension path |
| ★ **kro** (Kubernetes Resource Orchestrator) | Lightweight composition/resource-graph API; cross-cloud portability talk |
| **Backstage** (7) | BackstageCon; pivot toward AI-assisted development + agent-readable catalogs |
| **Argo CD / Rollouts / Workflows / Kargo** | ArgoCon day 0; progressive delivery as the trust mechanism for agent-authored changes |
| **Flux** (8) | FluxCon; "GitOps without you writing YAML" — grounding agents in real APIs |
| **Helm 4** ★ | Major version; breaking changes discussed in maintainer track |
| **Karmada** (19 multicluster) | Multi-cluster orchestration; fleet management |
| **Cluster API / CAREN** (9) | Declarative cluster lifecycle; Nutanix's CAREN in keynote |
| **vCluster** | Virtual clusters — now a sandboxing primitive for agents/MCP servers |
| **OpenTofu / Terraform** (4) | OpenTofu Day; "Terraform on cron → GitOps" (Meta keynote) |
| **Score / golden paths** (15) | Self-service abstractions; "intent-driven IDPs" |

## Policy, security & identity

| Thing | Notes |
|---|---|
| **Kyverno** (25 policy-as-code) | "Unified policy as code at scale"; attestation-driven admission at AT&T |
| **OPA / Gatekeeper** | Intro + deep dive; still the other half of policy |
| ★ **CEL ValidatingAdmissionPolicy / MutatingAdmissionPolicy** | In-tree policy replacing webhooks — "Goodbye Webhooks, Hello CEL" |
| **SPIFFE / SPIRE** (13) | Workload identity; new **SPIFFE Broker API** — "every object deserves an identity" |
| ★ **Pod Certificates + ClusterTrustBundles** | In-tree PKI primitives (Google/Microsoft talk) |
| **Cedar / OpenFGA / AuthZEN / Keycloak** | Fine-grained authorization, increasingly aimed at agents and MCP tools |
| **Sigstore / cosign / in-toto / SLSA** (7–11) | Supply chain signing and attestation; in-toto at millions-of-attestations scale |
| **Trivy / Grype / CVE management** (23) | The "vulnerability tsunami" — triage, detection-as-code, exploitability windows |
| **Falco / Tetragon / Inspektor Gadget** | Runtime security and eBPF-based introspection |
| **Confidential compute / TEEs** | NVIDIA skepticism talk; Anthropic+Google "linked runners and TEEs for frontier AI" |

## Networking

| Thing | Notes |
|---|---|
| ★ **Gateway API** (18) | The destination for ingress; **Ingress NGINX is retired**, migration talks everywhere; ListenerSets; inference extensions |
| **Cilium / eBPF** (19) | CiliumCon; netkit zero-copy pod networking, ListenerSets→eBPF plugins, Hubble |
| **Istio / Linkerd / ambient mesh** (26) | Mesh as identity layer (mTLS) more than traffic layer; Istio cardinality at 10k pods |
| **Envoy** (16) | Still the data plane under gateways and AI gateways |
| **SIG-Multicluster / MCS** | Multicluster service discovery replacing load balancer sprawl |

## Observability

| Thing | Notes |
|---|---|
| **OpenTelemetry** (38) | The default. eBPF auto-instrumentation, OTel Blueprints, drift, collectors in the pocket |
| **Prometheus / Cortex / Thanos / VictoriaMetrics** (17+) | High-cardinality survival, long-term storage |
| **Grafana / Perses** (14 dashboards) | Perses as the CNCF dashboard-as-code option |
| **Fluent Bit / Loki** (6) | Telemetry pipeline engineering at scale |
| **OpenCost** (3) | Cost intelligence; first inference-cost tracking with llm-d |
| **OpenFeature** | Feature flags as an OTel control plane; flag-controller (CVS Health) |
| **Pyroscope / Parca** (7 profiling) | Continuous profiling; memory observability done right |

## Data & storage

**Rook/Ceph**, **Longhorn**, **CSI** (15), **Velero/backup** (8), **Strimzi/Kafka** (9),
**Vitess/MySQL**, **CloudNativePG**, **JuiceFS** (StepFun multimodal storage keynote),
**Spark on K8s** (Airbnb), **DuckDB on K8s**, and the recurring message:
**storage/data delivery is the new bottleneck for GPU utilization**
("Feeding the GPU", "Many Clusters, One GPU Pool", "The Storage Bottleneck AI
Didn't See Coming").

## Runtime & node

**containerd** (8), **CRI-O** (pluggable/accelerated runtimes), **KubeVirt** (15 —
pluggable virtualization backends, AI hardware), **Metal3** (bare metal, multi-tenancy,
fuzzing, AI-found 0-day), **Flatcar** ("your GPU nodes deserve better"),
**minikube** (10 years), **Lima**, **Podman**, **Apple Container framework** ★.

## Concepts worth adding to our vocabulary

- **Agent substrate / harness as runtime** — the layer between the agent and the cluster.
- **Intent-driven platforms** — agents express intent; the platform resolves it.
- **Cache-aware / topology-aware routing** — scheduling decisions driven by KV cache
  and interconnect locality, not just CPU/mem.
- **Non-human identity (NHI)** — identity and least privilege for agents and workloads.
- **Durable execution** — the answer to agents that fail halfway.
- **Progressive delivery as trust** — agents "earn" merge/deploy rights via canaries.
- **Detection as code** — security detections versioned and tested like policy.
- **Sovereign AI** — jurisdiction-aware model/traffic routing (HAProxy keynote).
- **Physical AI** — robotics/actuators as cluster workloads (NVIDIA keynote, Agility Robotics).
- **Vulnerability tsunami / AI-generated reports** — maintainer load as a security problem.
