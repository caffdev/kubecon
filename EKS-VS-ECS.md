# EKS vs ECS: one orchestrator, designed for the fleet we're going to have

**What this is:** the argument for the EKS-vs-ECS meeting. It takes a side: **standardise
on EKS, and design now for it getting big.** The ECS case is stated at full strength in
§6 and answered there, so nobody in the room raises an objection we haven't already
dealt with.

Cross-references: `GOALS.md` §0 (thesis), §5 (multi-cluster), §10 (AWS strategy);
`CLAUDE-AGENT-PLATFORM.md` (agents in pods). ⚠️ = third-party or secondhand figure;
check before it goes on a slide.

---

## 0. The position in three sentences

1. **The question isn't "EKS or ECS". It's "EKS, or EKS *plus* ECS".** We already run
   EKS (live-live across two regions, `GOALS.md` §5) and Kubernetes on-prem, and every
   roadmap item we committed to at KubeCon lands on Kubernetes. ECS wouldn't replace
   anything. It would be a third container platform.
2. **EKS is going to get too big to manage by hand whatever we decide about ECS.** So
   the engineering budget should go into fleet management that scales (GitOps, policy,
   managed upgrades, intent-based placement), not into a second orchestrator that needs
   its own deploy, policy, observability and on-call story.
3. **The "ECS is simpler" gap closed in 2025.** EKS Auto Mode and ECS Managed Instances
   are the same product shape: AWS-managed EC2, per-instance management fee, AWS
   patches the nodes. AWS even cut GPU fees on both **on the same day**. What's left of
   the difference is the Kubernetes API, and for us that's the asset, not the cost.

---

## 1. Premise first: EKS is getting big regardless

Win this point and the rest follows. Things already decided or in flight that **only
exist on Kubernetes**:

| Commitment | Where | Runs on ECS? |
|---|---|---|
| Live-live public apps across two EKS regions | `GOALS.md` §5.1 | Already EKS |
| On-prem clusters, fleet-managed alongside EKS | §5, §5.3 | No. ECS Anywhere exists, but nothing else in our on-prem estate speaks it |
| GitOps spine: Argo CD, Kargo, source hydrator | §1 | No. Argo CD deploys Kubernetes objects |
| Admission policy (CEL / Kyverno), policy in CI | §2.1, §2.2 | No admission layer to hook |
| Agent sandboxing (Kata/microVM runtime class), kagent, agent gateway | §3.1–§3.4 | No |
| Claude agents as Jenkins pods with NetworkPolicy | `CLAUDE-AGENT-PLATFORM.md` | No pods, no NetworkPolicy |
| Karpenter + VPA + KEDA autoscaling | §10.3 | No (ECS has its own capacity providers) |
| Crossplane / kro writing app infrastructure | §10.1, §10.2 | Control plane is Kubernetes by definition |
| Network observability on EKS | §10.5 | Different tooling on ECS |

So the EKS fleet grows on its own: more clusters for isolation, regions, GPU pools,
on-prem sites and agent sandboxes. The §0.1 peer data shows where that ends up:
**Mastercard runs 30 EKS clusters, Hertz ~80 ⚠️, Coinbase 79**. Those are
regulated-industry peers, not hyperscalers. **Every hour spent standing up ECS is an
hour not spent on the fleet tooling we need anyway.**

---

## 2. Why ECS adds work, not removes it

Running ECS next to EKS doesn't mean "some workloads get simpler". It means **two of
everything**:

| Concern | EKS (we're building this anyway) | Added if we also run ECS |
|---|---|---|
| Packaging / deploy | Helm charts + Argo CD | Task definitions + CDK/Terraform/CloudFormation pipelines |
| Promotion between envs | Kargo (§1.2) | A separate promotion mechanism, or hand-rolled |
| Policy | CEL/Kyverno at admission + in CI | IAM/SCPs and pipeline checks only; no admission point |
| Autoscaling | Karpenter / Auto Mode, HPA, KEDA | ECS service auto scaling + capacity providers |
| Service-to-service networking | Gateway API, mesh (see `ISTIO-VS-GATEWAY-API.md`) | Service Connect (App Mesh reached **end of life Sept 30, 2026** ⚠️ third-party date) |
| Identity | Pod Identity / IRSA, SPIFFE (§3.6) | Task roles; a separate model to audit |
| Observability | OTel collector as DaemonSet/sidecar, kube-state-metrics | FireLens/CloudWatch, a second set of dashboards |
| Cost attribution | Namespace/label → OpenCost (§10.4) | Task tags; a second allocation model |
| On-call skills | Kubernetes | Kubernetes **and** ECS |
| Agents operating it (§6) | One API, already used in Mastercard's 30-cluster LLM demo | A second API surface for every agent and MCP tool |

**The last row is new this year.** `GOALS.md` §0.2 argues that the main consumer of our
platform is becoming a machine: an agent, a controller, a policy engine. A machine is
good at one well-documented, declarative API and worse at two. Each tool in
`CLAUDE-AGENT-PLATFORM.md` (read-only kubectl MCP, guardrail hooks, the triage skills)
would need an ECS twin.

**ECS's own tooling churns too.** AWS ended support for the **Copilot CLI on June 12,
2026** and points users at **ECS Express Mode** (launched Nov 2025). Express Mode is a
good "container image → URL" button, but it's AWS-only. Helm, Argo CD and Kubernetes
manifests are CNCF projects with many vendors behind them.

---

## 3. The "ECS is simpler" gap closed

What was true in 2022 isn't true now. Side by side:

| | **EKS Auto Mode** (GA Dec 2024) | **ECS Managed Instances** (GA ~Sept/Oct 2025) |
|---|---|---|
| Who runs the nodes | AWS: managed Karpenter, patched AMIs, **21-day max node lifetime** for forced patch rotation | AWS: managed EC2 provisioning, patching |
| Pricing model | EC2 + per-instance management fee (~12% of On-Demand ⚠️ third-party) + $0.10/hr per cluster | EC2 + per-instance management fee ⚠️ magnitude unverified |
| Spot | Yes | Yes (added Dec 2025) |
| GPU fee cut, July 2026 | Up to 60% | Up to 60%, **announced the same day** |
| Load balancers, storage, identity | Built in (ALB/NLB from Ingress, EBS, Pod Identity) | Built in (ALB, task roles) |
| Managed GitOps / AWS resources | **EKS Capabilities** (Dec 2025): managed **Argo CD, ACK, kro**, running in the AWS control plane, not on our nodes | None comparable |
| On-prem under one control plane | **EKS Hybrid Nodes** (GA Dec 2024; Hybrid Nodes gateway 2026) | ECS Anywhere |
| Scale ceiling | Up to **100,000 nodes/cluster** (ultra-scale) ⚠️ may need AWS onboarding; **Provisioned Control Plane** tiers for predictable API performance | n/a (regional service) |
| Packaging ecosystem | Helm 4, vendor charts for nearly every product we run | None. Each vendor product is a hand-written task definition |
| Portability | Upstream Kubernetes: on-prem, other clouds | AWS only |

**What this means:** AWS now prices and runs the two services as twins. They charge a
management fee for "we run your nodes" on both, and they cut it on both on the same
day. The decision has come down to *which API*. One API runs on-prem, in every cloud
and in every vendor's install docs. The other doesn't.

### 3.1 Helm makes deploying easier, and that's measurable

- Nearly everything we'd run *alongside* our apps (observability agents, ingress/gateway,
  cert-manager, External Secrets, KEDA, Kyverno, Argo, vendor agents) ships as a **Helm
  chart first**. On ECS each one becomes a task definition we write and maintain.
- Helm 4 shipped and Helm 3 is reaching end of life (*Breaking up Is Hard, but the
  Future Is with Helm 4*, SUSE/Omniva, KubeCon 2026). The packaging layer is
  maintained, not stagnant. **19 sessions** at the show mentioned Helm.
- One chart serves every environment and every cluster, including on-prem. An ECS
  deploy definition serves ECS.
- Honest caveat: Helm templating has its own pain (values sprawl, debugging rendered
  YAML). The §1.3 source-hydrator work exists to tame it. That's a known problem with
  known fixes, which is better than a second deploy system.

---

## 4. What "design for it getting big" means

If we agree EKS grows regardless, the meeting's real output should be the design rules
that keep a large fleet manageable. Proposed:

1. **Clusters are cattle.** Created and upgraded from code (Auto Mode + Crossplane/CDK,
   §10.2). No hand-built cluster, no cluster nobody can recreate.
2. **Push node toil to AWS.** Default new clusters to **Auto Mode**. The management fee
   costs less than the engineer-hours spent patching and upgrading node groups. Keep
   self-managed Karpenter only where we can show Auto Mode doesn't fit (exotic GPU
   shapes, custom AMIs).
3. **Push platform add-ons off-cluster where we can.** Evaluate **EKS Capabilities**
   (managed Argo CD/ACK/kro) against self-hosting in §1. Fewer controllers on our nodes
   means fewer things to upgrade.
4. **Upgrade cadence is a policy, not a project.** Stay inside the **14-month standard
   support** window. Extended support raises the control-plane fee from **$0.10 to
   $0.60/hr per cluster** (~$73 → ~$438/month), so a missed upgrade is a measurable
   cost line. Pair with §5.2 (skip-level upgrades, the NVIDIA fleet-change pattern).
5. **Developers never write a cluster name** (§5.5). Intent-based placement means
   adding the 31st cluster costs nobody an app change.
6. **One spine for every change:** GitOps + policy + progressive delivery (§0). It
   covers humans and agents alike, which only works if everything sits behind one API.
7. **On-prem joins the same model.** Pilot **EKS Hybrid Nodes** for at least one
   on-prem site, so §5's "on-prem + EKS" becomes one control-plane model, not two.
8. **Design against the known scale failure modes** (§5.4: etcd pressure from status
   patches, stale watches, health-check sprawl). Use Provisioned Control Plane tiers
   where a cluster's API load justifies it, not by default.

---

## 5. Evidence from the show

From the full schedule in `kubecon-overview/data/sessions.json` (603 entries):

| Signal | Count |
|---|---|
| Sessions mentioning **ECS** in title or abstract | **0** |
| Sessions mentioning **EKS** | 7, including Mastercard (30 EKS clusters run by an LLM 📎), Hertz (Karpenter + EKS at fleet scale), and **AWS's own** talks on Agent Sandbox on EKS and Gateway API after Ingress NGINX |
| Sessions mentioning **Helm** | 19 |

KubeCon is a Kubernetes conference, so ECS being absent is expected. **The telling part
is that AWS's own speakers presented EKS.** Their agent-isolation story (*Agent Sandbox
on EKS: Hardware-Isolated microVM Pods for AI Agents*) is "a runtime class on a normal
pod spec, scoped egress, scoped credentials". That's exactly the shape of
`CLAUDE-AGENT-PLATFORM.md`, and it has no ECS equivalent.

Industry-wide: the CNCF 2025 Annual Survey (published Jan 2026) puts **Kubernetes
production use at 82%** of container users, up from 66% two years earlier, and **66% of
orgs hosting generative-AI inference on Kubernetes**. The hiring pool, the vendor
support and the agent tooling all sit there.

📎 Decks: `2026-11-11_no-rag-no-regrets-letting-an-llm-drive-30-eks-clusters-in-production.pdf`,
`2026-11-10_so-you-want-to-build-a-platform-you-probably-already-have-one.pdf`
(ŌURA: "those Helm charts you're maintaining… there's your platform").
No decks: Hertz, *Agent Sandbox on EKS* (AWS), *Four Resources, One Object* (AWS),
*Breaking up Is Hard, but the Future Is with Helm 4*.

---

## 6. The ECS case at full strength, and the answers

| Objection | Fair? | Answer |
|---|---|---|
| **"ECS is simpler for a team that just wants to run a container."** | Yes, for one team in isolation | We're not one team in isolation. The simplicity is local; the cost is global (§2: two of everything). And the "just run a container" UX is a golden path *we* should provide on EKS (§5.5), which ECS Express Mode itself shows is a UX problem, not an orchestrator problem |
| **"EKS costs $73/month per cluster; ECS's control plane is free."** | True | Even at 50 clusters that's ~$44k/year, less than a fraction of one engineer. The fee that matters is **extended support at $438/month**, and design rule 4 removes it |
| **"Kubernetes upgrades are toil."** | Yes, and that's the strongest point | Auto Mode takes node upgrades away. Control-plane upgrades stay ours, which is why rule 4 makes cadence a policy and §5.2 adopts skip-level upgrades. Running ECS too doesn't reduce the EKS upgrades we already owe |
| **"Don't cargo-cult everything into Kubernetes"** (*Kubernetes Anonymous: Confessions of Kubernetes Cargo Cultists*, Capital One/Akuity) | Yes, and we agree | The argument is **one container orchestrator**, not "everything in Kubernetes". Lambda, managed databases, queues and S3 stay managed services. Their talk names *both* extremes as traps; a second orchestrator is not the middle ground they describe |
| **"Lock-in risk is the same either way, we're all-in on AWS."** | Partly | Not for us: we have on-prem today, and `GOALS.md` §0.1 (GEICO) shows regulated peers ending up multi-provider because of **GPU supply**, not strategy. EKS keeps that door open; ECS closes it |
| **"ECS integrates more tightly with AWS."** | Was true | EKS Capabilities (managed ACK) and Pod Identity close most of it. ACK lets an app declare its AWS resources next to its Deployment |
| **"Auto Mode's 21-day node rotation will disrupt stateful workloads."** | Real constraint | It's the forcing function that keeps nodes patched, which is the point. Requires correct PDBs and maintenance windows (AWS documents both). Exceptions go on self-managed node pools |

**Where ECS would genuinely be right:** a small, isolated, AWS-only product with no
on-prem footprint, no agent workloads, no need for the shared platform, and a team that
won't ever join the fleet. If such a team exists, name it in the meeting. **The burden
of proof is on the exception, not the default.**

---

## 7. What we're asking the meeting to decide

| # | Decision | Recommendation |
|---|---|---|
| E1 | Container orchestrator standard | **EKS.** No new ECS workloads without a written exception (§6 last paragraph) |
| E2 | Default node management for new clusters | **EKS Auto Mode**; self-managed Karpenter by exception |
| E3 | Upgrade policy | Never enter extended support; every cluster upgraded within the 14-month window; owner named per cluster |
| E4 | Packaging standard | **Helm charts** rendered by Argo CD (source hydrator, §1.3) |
| E5 | Existing ECS workloads (if any) | Inventory now; migrate on next major change, not as a project |
| E6 | Evaluate managed add-ons | Trial **EKS Capabilities** (managed Argo CD/ACK/kro) vs self-hosting, decide by Q2 2027 |
| E7 | On-prem convergence | Pilot **EKS Hybrid Nodes** at one site |

---

## 8. Shortcomings of this argument, stated out loud

- **Auto Mode's fee is a real, recurring ~12% ⚠️ uplift on compute.** At large scale
  that's significant money, and some teams will want self-managed Karpenter to avoid
  it. Model it on our actual instance mix before the meeting if we can.
- **We haven't measured our own upgrade toil.** The argument would be stronger with a
  number: hours spent per EKS minor upgrade last year.
- **"EKS will get big regardless" rests on §1, §3 and §5 actually happening.** If those
  stall, the fleet stays small and ECS's local simplicity looks better.
- **KubeCon evidence is self-selecting.** Zero ECS talks at a Kubernetes conference
  proves little about ECS on its own. Lead with §1 and §2, not §5.
- Several AWS figures above come from third-party write-ups (⚠️). Check the pricing pages
  before quoting dollar amounts in the room.

---

## Sources

AWS (primary):
- [Amazon ECS and EKS comparison (AWS)](https://aws.amazon.com/compare/ecs-and-eks/)
- [EKS Auto Mode user guide](https://docs.aws.amazon.com/eks/latest/userguide/automode.html) · [EKS Auto Mode best practices](https://docs.aws.amazon.com/eks/latest/best-practices/automode.html)
- [EKS pricing](https://aws.amazon.com/eks/pricing/) · [EKS extended support pricing](https://aws.amazon.com/blogs/containers/amazon-eks-extended-support-for-kubernetes-versions-pricing)
- [EKS Auto Mode GPU fee cut, July 2026](https://aws.amazon.com/about-aws/whats-new/2026/07/amazon-eks-auto-mode-gpu-price) · [ECS Managed Instances GPU fee cut, July 2026](https://aws.amazon.com/about-aws/whats-new/2026/07/amazon-ecs-managed-instances-gpu-price/)
- [ECS Managed Instances pricing](https://aws.amazon.com/ecs/managed-instances/pricing) · [FAQ](https://aws.amazon.com/ecs/managed-instances/faqs) · [Spot support](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ecs-managed-instances-ec2-spot-instances)
- [Announcing EKS Capabilities (Argo CD, ACK, kro)](https://aws.amazon.com/blogs/aws/announcing-amazon-eks-capabilities-for-workload-orchestration-and-cloud-resource-management)
- [EKS 100,000 nodes per cluster](https://aws.amazon.com/about-aws/whats-new/2025/07/amazon-eks-100000-worker-nodes-per-cluster) · [Under the hood: ultra scale](https://aws.amazon.com/blogs/containers/under-the-hood-amazon-eks-ultra-scale-clusters) · [Provisioned Control Plane](https://aws.amazon.com/blogs/containers/amazon-eks-introduces-provisioned-control-plane)
- [EKS Hybrid Nodes](https://aws.amazon.com/about-aws/whats-new/2024/12/amazon-eks-hybrid-nodes) · [Hybrid Nodes gateway](https://aws.amazon.com/blogs/containers/simplify-hybrid-kubernetes-networking-with-amazon-eks-hybrid-nodes-gateway)
- [End of support for AWS Copilot CLI](https://aws.amazon.com/blogs/containers/announcing-the-end-of-support-for-the-aws-copilot-cli) · [ECS Express Mode](https://aws.amazon.com/about-aws/whats-new/2025/11/announcing-amazon-ecs-express-mode)

Industry:
- [CNCF Annual Cloud Native Survey (Jan 2026)](https://www.linuxfoundation.org/hubfs/Research%20Reports/CNCF_Annual_Survey_Report_1.15.26.pdf)

Third-party (⚠️ verify before quoting):
- [Auto Mode ~12% fee example (opslyft)](https://www.opslyft.com/blog/amazon-eks-pricing-explained) · [EKS pricing traps (cloudburn)](https://cloudburn.io/blog/amazon-eks-pricing)
- [EKS vs ECS Auto Mode / Managed Instances fees (tech-insider)](https://tech-insider.org/eks-vs-ecs-auto-mode-managed-instances-fee-gap-2026/) (App Mesh EOL date)
- [21-day node lifetime (dev.to)](https://dev.to/vijaykodam/do-you-know-that-eks-auto-mode-enforces-a-21-day-maximum-node-lifetime-5gm3)
- [ECS Managed Instances launch coverage (InfoQ)](https://www.infoq.com/news/2025/10/aws-ecs-managed-instances)
