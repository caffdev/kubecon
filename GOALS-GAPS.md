# GOALS.md — tool review: gaps, swaps, and cheaper paths

**Written 2026-11-12.** A second pass over `GOALS.md` asking two questions of every
item: *is there an open-source option we didn't name?* and *is there a more effective
(or cheaper, or already-installed) way to get the same outcome?*

Provenance is marked on every suggestion:
**[show]** = a real KubeCon NA 2026 session backs it (title + company given, checked
against `kubecon-overview/data/sessions.json`); **[ours]** = not from the show, added
because it's the standard answer to a problem `GOALS.md` raises.

---

## A. Missing entirely — ranked by how much it will hurt to skip

### A1. Gateway API migration — Ingress NGINX is retired 🔴 Act now
`GOALS.md` never mentions ingress. It is the one item on this page with an external
clock on it, and it collides with §3.4: the AI gateway and the ingress replacement are
**the same data plane**. Do the migration once, with inference extensions in mind, or
do it twice.

- **[show]** *Four Resources, One Object: Surviving Gateway API After Ingress NGINX* (AWS) — no deck posted
- **[show]** *Your Routes, My Rules: Making Gateway API Work at Enterprise Scale*
- **[ours]** `kubernetes-sigs/ingress2gateway` converts existing Ingress objects; run it
  read-only now just to size the problem.
- Implementations, all OSS: **Envoy Gateway**, **kgateway** (CNCF sandbox, the OSS base
  under Solo's stack), **Cilium Gateway API** if you're already on Cilium, **Istio**.
- **Deck value:** this belongs on slide 13 next to the AI gateway, not as a separate topic.

### A2. Supply chain: signing and attestation 🔴 Adopt
§2.1 cites the AT&T attestation talk and then never turns it into a workstream. This is
the missing half of §1.9 — "an agent authored this change" is a *claim* until there's a
signed attestation and an admission rule that checks it.

- **Sigstore / cosign** + **Kyverno `verifyImages`** (Kyverno already in the plan — this
  is a policy, not a new system) or **sigstore policy-controller**.
- **in-toto** attestations, **SLSA** provenance.
- **[show]** *Signed, Sealed, Denied: Attestation-Driven Admission with Kyverno + CEL at AT&T* (AT&T, Nirmata)
- **[show]** *In-Toto: Experiences a Few Million Attestations Later* (Bloomberg, Datadog, NC State, Purdue)
- **[show]** *Your CI's Mistaken Identity* (IBM, Red Hat) — 📎 deck posted

### A3. The CVE firehose 🟡 Trial
23 sessions touched vulnerability management; `GOALS.md` has zero. If agents start
opening PRs (§6 stage 2), bump PRs are the majority of that volume, and you need a
triage policy before the volume arrives.

- **Trivy** (+ trivy-operator, in-cluster scanning as CRDs), **Grype**, **Kubescape** (CNCF).
- **OpenVEX** — the actual lever. VEX statements are how you stop re-triaging the same
  non-exploitable CVE every week, and they're machine-readable, which makes them an
  agent-friendly artifact.
- **[show]** *Gone in 60 Minutes: Effectively Close the Exploitable Window with Detection as Code* (ARMO, fusioncore.ai)
- **[show]** *Mythos vs Maintainers: Drowning in the Vulnerability Tsunami* (ControlPlane, Docker) — 📎 deck posted
- **[show]** *How Kubernetes Handles AI Generated Security Reports* (Canonical, NVIDIA) — the other side: agents generating junk reports.

### A4. Runtime enforcement after admission 🟡 Trial
§2.4 lists the session *After Admission: Kernel Enforcement for Agents Kyverno Let In*
and then names no tool. Admission control sees a manifest; it does not see an agent
shelling out to curl.

- **Falco** (CNCF, the detection default), **Tetragon** (Cilium/eBPF — detect *and*
  enforce, including egress), **Inspektor Gadget**.
- **[show]** *Falco Never Flies Alone: Runtime Security as an Ecosystem* (Sysdig, vCluster Labs)
- This is also the honest answer to §4.4's egress question: **Hubble** for seeing,
  **Tetragon** or CiliumNetworkPolicy for stopping.

### A5. Testing the platform itself 🟢 Adopt — this is how §2.2 actually ships
"Run policy in CI" (§2.2) needs a harness, and "GitOps Meltdown" (§1.1) needs a way to
rehearse a destructive sync *before* it reaches a cluster.

- **Chainsaw** — Kyverno's own declarative test harness; policy tests as YAML in CI.
- **`kyverno apply` / kyverno-json** — kyverno-json scans arbitrary payloads, which means
  you can run the same policy set against a **CDK/Terraform plan** (§10.2 seam) and
  against Argo's rendered output, not just live cluster objects.
- **kubeconform** for schema validation; **Conftest** if you end up on OPA instead.
- **[show]** *Snapshot, Replay, Verify: A KWOK CI Pattern for Kubernetes Platform Operators*
  (Adobe) — **KWOK** fakes thousands of nodes for ~free. This is the cheapest possible
  answer to "would this ApplicationSet change have deleted 39 clusters?"
- **[show]** *Kubernetes under Fire: ... Kube-Burner* (Red Hat) — scale regression testing.
- **[show]** *When Infrastructure Breaks in Production: How EarnIn Brought Testing to the Full CNCF Stack* (EarnIn) — Testkube, Kyverno, Flux, cert-manager together.

### A6. OpenFeature — the kill switch progressive delivery doesn't give you 🟡 Trial
§1.7's rollback story is "roll the deployment back." Feature flags decouple deploy from
release: an agent-authored change ships dark, gets enabled for 1% by flag, and is turned
off in seconds without a sync, a rollback or a new image. It is the natural companion to
§1.9 "agents earn the right to merge" — they can earn the right to *merge* long before
they earn the right to be *on*.

- **OpenFeature** (CNCF) + flagd. Vendor-neutral, so it doesn't foreclose anything.
- **[show]** *How We Are Enabling Feature Flagging At Scale* (CVS Health) — 📎 deck posted
- **[show]** *Hope Is Not a Rollout Strategy: Balancing (AI) Quality, Cost, and Risk Through Experimentation* (Dynatrace)

### A7. Helm 4 ⚪ Watch, but put a date on it
A major version with breaking changes landed this cycle. It touches every chart we own
and it interacts with §1.3 (the source hydrator renders those charts).
**[show]** *Breaking up Is Hard, but the Future Is with Helm 4* (Omniva, SUSE).

### A8. Immutable node OS — the unlisted lever on §5.2 upgrade toil 🟡 Trial
`GOALS.md` treats upgrades as a control-plane problem. Half the toil is nodes.
**Flatcar**, **Talos**, **Kairos** turn node upgrades into image swaps with rollback.
- **[show]** *Your GPU Nodes Deserve Better: Flatcar Container Linux for AI Workloads* (Microsoft)
- **[show]** *What's New in Kairos, 2026 Edition* (Mirantis); *Extending the Immutable OS with systemd-sysext* (Microsoft)
- **[ours]** **kube-no-trouble (kubent)** or **Pluto** before every upgrade — finds
  deprecated APIs in what's actually running. Ten minutes, prevents the classic upgrade abort.

### A9. If we run GPUs at all: DRA and Kueue ⚪ Watch
14 sessions on **Dynamic Resource Allocation**; it is the replacement for device plugins,
and it is in-tree. **Kueue** (23 mentions) is the quota/fair-share layer for batch and,
increasingly, for agent workloads. Neither appears in `GOALS.md`. If the answer is "we
don't run GPUs," say so explicitly on the slide — people will ask.

### A10. A catalog agents can read 🟡 Trial
**Partly absorbed:** `GOALS.md` §5.5 now owns the Backstage/IDP trend and the
constraints-not-cluster-names argument. This entry keeps the narrower point — the
*agent-readable* half.

§6 stages 3–5 assume an agent can find out what a service is, who owns it and what it
depends on. Today that lives in people's heads.
- **Backstage** (12 sessions, its own co-located day) — the theme this year was
  explicitly *agent-readable catalogs*, not developer portals.
- **[show]** *OpenChoreo: Developer Platform for Both Humans and Agents* (WSO2)
- **[show]** *Platform Engineering after the AI Hype: Why IDPs Must Become Intent-Driven* (Syntasso)

---

## B. Per-section swaps — same outcome, less cost or more openness

### §1.1 + §2.3 — change windows: Argo CD already does this
Before writing a Kyverno policy that reads a change-record CRD, note that **Argo CD
AppProject *sync windows*** are native, already installed, and block syncs on a cron
with allow/deny semantics. The right design is probably **both**: sync windows stop
Argo, Kyverno stops everything else (kubectl, operators, the one person with cluster-admin).
That also softens decision #5 — the CRD projection is still right, but the enforcement
point is cheaper than it looks.

**Guardrails against the *GitOps Meltdown* scenario, all built in and all free:**
- ApplicationSet `syncPolicy.applicationsSync: create-update` (never delete Applications)
- `preserveResourcesOnDeletion: true` on ApplicationSets that target clusters
- `prune: false` or `PruneLast` on cluster-scoped and stateful resources
- `argocd app diff` in CI on the PR, plus KWOK replay (A5) for the fleet-wide ones

### §1.6 — Reloader is right, but not first
**[ours]** For anything whose content lives in Git, **Kustomize `configMapGenerator`
(name-suffix hash)** or the Helm `checksum/config` annotation does the job with no extra
controller *and* makes the rollout visible as a Git diff — which is exactly the
"Git is the state of the world" claim §1.6 is defending.
**Keep Stakater Reloader for the case the hash can't cover:** secrets that arrive from
outside Git (External Secrets / Vault rotation), where nothing in the repo changes.
State it that way and it stops looking like an arbitrary extra dependency.

### §1.7 — canary
- **Flagger** (Flux's progressive delivery controller) is the OSS alternative to Argo
  Rollouts. Given §1 is Argo-shaped, stay with Rollouts — but name Flagger on the slide
  so nobody thinks we didn't look.
- Use the **Argo Rollouts Gateway API plugin** rather than a vendor API-gateway plugin.
  Same capability, vendor-neutral, and it rides on A1 which we have to do anyway.
- Analysis providers are OSS and pluggable (Prometheus, Datadog, CloudWatch, Graphite) —
  the "automated analysis is the actual deliverable" line in §1.7 is a half-day of
  AnalysisTemplate work, not a project.

### §2.1 — the CEL migration has a tool
Kyverno can **generate ValidatingAdmissionPolicies from existing Kyverno policies**, so
the webhook→CEL move is mechanical for the subset that's expressible in CEL rather than a
rewrite. Also add **Policy Reporter** / the PolicyReport CRD so policy results are
queryable — which is what lets an agent (or a dashboard) see *why* something was denied.
**[show]** *From Disk to Defense: Kubernetes Admission Policies the API Can't Touch* (Google, Microsoft) —
worth watching for the limits of the in-tree approach before committing.

### §3.1 — sandboxing: do the free tier first
Before microVMs: **user namespaces**, seccomp `RuntimeDefault`, AppArmor, read-only root,
dropped capabilities, and a NetworkPolicy default-deny. That is a day of work and removes
most of the "agent runs code it just wrote" risk at tier 0.
Then **gVisor** (cheapest real isolation), then **Kata** (📎 *Groundhog Pod*),
then **vCluster** per agent when the agent needs an API server, not just a kernel.
**[show]** *Five Stages of Kubernetes Security Grief* (Edera) for the honest version of this ladder.

### §3.4 — the AI gateway: name an implementation
§3.4 picks the **standard** (Gateway API Inference Extension) but no implementation,
which leaves the slide un-actionable. OSS options:
- **Envoy AI Gateway** — **[show]** *Integrating Envoy AI Gateway and Kyverno Authz for
  Realtime Governance of LLM and MCP Traffic* (Nirmata, Nutanix). This is already the
  pairing §2.4 wants, so it's the default.
- **kgateway** (CNCF sandbox) — the OSS gateway under Solo's agent work.
- **llm-d**'s inference scheduler / endpoint picker, if we ever self-host models (17 sessions).
- **[ours] LiteLLM** — not a CNCF project and not a data plane, but it gets per-team keys,
  quotas and cost attribution running in an afternoon. Reasonable as a stopgap that
  answers §4.1 ("what are we using AI for") while the real gateway work proceeds.

### §3.5 — Obot vs ToolHive: decide the enforcement point first
The open question in §3.5 is answerable: **if the AI gateway (§3.4) is where MCP traffic
is authorized, a directory-driven MCP permissions product is mostly a catalog**, and the
bake-off is small. **ToolHive** is OSS and pairs with the Cedar analysis work;
**Obot** is open-core. Pick the gateway first, then see what's left.
Authorization engines, all OSS: **Cedar**, **OpenFGA**, **Keycloak + AuthZEN**.
- **[show]** *OpenFGA: Fine-Grained Authorization for Apps, APIs, and Agents*
- **[show]** *One Platform for AuthN and AuthZ: Keycloak Meets AuthZEN* (Hitachi)
- **[show]** *Cedar Authorization with Incomplete Information* (AWS)

### §3.6 — identity: the cheap path if we already run a mesh
SPIFFE/SPIRE is the right destination, but if a service mesh is already deployed, its
mTLS identity is SPIFFE-shaped and gets most of the value with no new system.
**[show]** *From Bearer Tokens to Mesh-Native mTLS: Modernizing Service Identity at Coinbase*.
Add **cert-manager** + **trust-manager** (the in-tree Pod Certificates / ClusterTrustBundles
work in §3.6 lands next to them).
**[show]** *Least-Privilege by Default: Standardizing Identity-Aware AI Agent Access into a Golden Path* (Hitachi) — the golden-path framing is the one to steal.

### §4 — observability additions
- **Perses** (CNCF) for dashboards-as-code — fits the GitOps spine better than Grafana
  JSON blobs, and dashboards become reviewable diffs.
- **VictoriaMetrics / Thanos / Cortex** — the actual answer to §4.2's cardinality problem
  at retention. §4.2 names the problem and no storage layer.
- **Pyroscope / Parca** — continuous profiling; 7 sessions. Cheapest way to make the
  §10.3 right-sizing argument with data instead of guesses.
- **[ours]** For §4.1 specifically: **OTel GenAI semantic conventions** (so we don't
  invent attributes — §4.2 already flags this risk) plus **Langfuse** or
  **OpenLLMetry** if we want LLM-level tracing before the gateway exists.
- **[show]** *Seeing Inside LLM Inference: Observability and Cost Visibility for llm-d* (IBM, JPMorgan Chase)

### §5.1 — multi-cluster: three options `GOALS.md` doesn't list
§5.1 has been rewritten to split fleet management from the live-live region pair, and to
say plainly that ApplicationSet is a templating controller with no failover. If we do turn
out to need real placement, Karmada is not the only next step and is the heaviest one:
- **Sveltos** (CNCF sandbox) — add-on and configuration distribution across fleets, with
  cluster *classification* rather than static lists. **[show]** Mistral AI's
  *From Zero to GPU Cloud: 12 months building Mistral Compute on top of Open Source* (📎 deck posted).
- **Open Cluster Management (OCM)** — **[show]** *Open Cluster Management (OCM): Live Demo Using k3d/KIND*.
- **argocd-agent** (argoproj-labs, Apache-2.0) — flips Argo CD to hub-and-spoke with
  agents dialling home, instead of one control plane holding credentials to every cluster.
  Different axis from Karmada and probably more relevant to us: it's about *the security
  and scaling model of the Argo CD we already run*, not about placement.
- **[show]** *Cluster API in 15 Minutes* (Mirantis) — the gentle CAPI on-ramp for §5.1.

### §7 — "dump cluster state to a database" has a session and real tools
This is the most under-specified section and it turns out to be the best-supported one.
- **[show]** *Your Cluster Is a Dataset: Indexing Kubernetes Objects in OpenSearch*
  (NetApp Instaclustr) — literally this idea, in production.
- **[ours]** **CloudQuery** (Kubernetes → Postgres, SQL) or **Steampipe/Powerpipe**
  (SQL over live clusters, no ETL). Either gives agents a read-only, auditable,
  rate-limit-free surface — the security control §7 is arguing for.
- **[show]** **k8sgpt** and **HolmesGPT** — *Following the Evidence with HolmesGPT:
  Troubleshooting Kubernetes Apps and Underlying Infrastructure* (NetApp, UiPath). Both
  OSS, both read-only, both exactly §6 **stage 1**. They are the shortest path from
  "we've committed to stage 1 by Q2 2027" to something running next week. **Now named in
  `GOALS.md` §6** as stage 1 evidence.

### §8 — data protection
- Enforce, don't audit: a **Kyverno** rule that rejects a StorageClass with
  `reclaimPolicy: Delete` for production storage closes §8's first bullet permanently.
- Beyond Velero: **Kanister** (application-consistent backup), **K8up**, **CloudNativePG**
  (if Postgres is in-cluster, its backup story beats a generic snapshot), **Rook/Longhorn** snapshots.
- **etcd** is not mentioned in §8 at all. **[show]** *etcd Operator, Rebuilt and Ready* (Broadcom).
- **[show]** *The Most Boring Talk at KubeCon — And the One That Will Save Your Job*
  (Nirmata, Octopus Deploy, TeraSky) — the title alone is slide 19.

### §9 — secrets: the decision is sequenced wrong
§9 asks "which store?" **Pick the sync layer first and the store becomes reversible.**
- **External Secrets Operator (ESO)** — CNCF, provider-agnostic: AWS Secrets Manager,
  Vault, OpenBao, Infisical, GCP, Azure all behind one CRD. Choose ESO and decision #4
  stops being a one-way door.
- **OpenBao** — the Linux Foundation fork of Vault under MPL-2.0. `GOALS.md` frames the
  choice as "Vault or Infisical" and omits the option that is *Vault, open*. If the
  objection to Vault is licensing or cost rather than ergonomics, this is the answer.
- **SOPS + age** — for config-shaped secrets that belong in Git. Zero infrastructure.
- **Sealed Secrets** — the simplest GitOps-native option if ESO feels heavy.
- Keep §9's reframe (short-lived identity shrinks the problem) — it's the best paragraph
  in the document. SPIRE + cert-manager + mesh mTLS is that path.

### §10.1 — Crossplane
Our `function-lifecycle` repo is already on **Crossplane v2 APIs** (`apis/v2 v2.3.1`,
`apiextensions.crossplane.io/v2` in the examples), so we're aligned with the direction
the Upbound talk described — namespaced composite resources, functions as the extension
path. Worth saying on the slide: *we're not catching up here, we're contributing.*
- For narrow cases, **ACK** (AWS Controllers for Kubernetes) is one controller vs a whole
  composition framework. If the S3 use case in §10.1 is genuinely just S3, ACK — or
  **kro** on top of ACK, which is the combination AWS/Microsoft/Red Hat/Uber presented —
  is less machinery for the same result. Keep Crossplane for the composite app-layer API.
- **[show]** *Achieving Cross-Cloud Portability with the Kubernetes Resource Orchestrator* (AWS, Microsoft, Red Hat, Uber)

### §10.2 — the CDK/Crossplane seam
Two OSS tools for the half that stays IaC:
- **OpenTofu** — if the Terraform licence is ever a factor (OpenTofu Day happened).
- **[show] Atlantis** — *Atlantis: What's New in IaC Orchestration* (Zetron, 📎 deck posted).
  PR-driven IaC with plan output in the PR: the same audit-trail shape as §1.2's
  GitOps Promoter, applied below the seam. Makes the two halves of §10.2 tell one story.
- Run **kyverno-json** over the CDK/Tofu plan so §2's policies cover both sides of the seam.

### §10.3 — right-sizing needs data, and there's a free source of it
**[ours]** **KRR** (Robusta's `kubectl-krr`) reads existing Prometheus history and emits
request/limit recommendations; **Goldilocks** does the same via VPA in recommend-only mode.
Both are a day of work, both produce exactly the artifact a §10.6 DevOps agent should be
opening PRs from. Do this before building the agent — then the agent has a job with a
known-good answer to be measured against.
**[show]** *Demo Theater: Why Your Kubernetes Autoscalers Keep Fighting (and How to End the Thrash)* (Sedai) — the failure mode.

### §10.4 — FinOps
OpenCost is right. Add: label/tag discipline **enforced by Kyverno** (required-labels
policy at admission) rather than asked for — otherwise §10.4's first sentence stays true
forever. **[show]** *OpenCost: What's New, What's Next, and How We're Scaling Kubernetes
Cost Intelligence* (IBM Kubecost, Randoli) and *Allocated ≠ Utilized: Managing GPUs with
IBM Kubecost*.

---

## C. Openness check on what's already named

| Named in GOALS.md | Status | Note |
|---|---|---|
| Argo CD / Rollouts / ApplicationSets | CNCF, Apache-2.0 | Safe |
| Kargo | OSS (Apache-2.0), Akuity-driven | Not CNCF; single-vendor governance. Fine, but it's the difference §1.2's "vendors with a stake" caveat is pointing at |
| GitOps Promoter | Argo Labs | Less mature, broader governance |
| Kyverno | CNCF, Apache-2.0 | Safe |
| Crossplane | CNCF, Apache-2.0 | Safe; we're on v2 |
| Velero, KEDA, OpenCost, SPIRE, OpenTelemetry, Kata, Karmada, Cluster API, kagent | CNCF | Safe |
| Stakater Reloader | OSS, small vendor | Fine; single maintainer-org risk is real but the blast radius is tiny |
| **Infisical** | **Open-core** | Core is OSS; the features that matter for an enterprise rollout are usually not. Compare against OpenBao + ESO before committing |
| **Obot** | **Open-core** | Same caveat; see §3.5 above |
| Cadence | OSS (Uber) | Note **Temporal** is the better-known fork of the same lineage — evaluate both if §3.7 ever becomes live |

---

## D. What this changes in the deck and the decisions table

**Add to the decisions list:**

| # | Decision | Section | Needs |
|---|---|---|---|
| 8 | Gateway API migration — when, and does it absorb the AI gateway? | A1, §3.4 | An owner and a date; Ingress NGINX is retired |
| 9 | Secrets: adopt ESO as the sync layer so the store choice is reversible? | §9 | Recommend yes; it reduces decision #4 to a preference |
| 10 | Do we run GPUs? If yes, DRA + Kueue become real items | A9 | One sentence either way |

**Slide changes:**
- Slide 8 ("What happens without guardrails") is stronger with the **KWOK replay** answer
  next to the *GitOps Meltdown* story — "here's how we'd have caught it" beats "here's a disaster."
- Slide 12 ("Identity before agents") should carry **A2 (signing/attestation)** — identity
  answers *who*, attestation answers *what they did and whether it was checked*.
- Slide 16 (the AI rollout ladder) gets concrete for stage 1 by naming **k8sgpt /
  HolmesGPT + a read-only cluster dataset (§7)** — right now stage 1 is the only rung with
  no named tooling, and it's the rung we're claiming is reachable this quarter.
- A new slide between 9 and 10: **"policy runs in three places"** — CI (kyverno-json over
  CDK plans), admission (CEL/VAP), runtime (Falco/Tetragon). That's A4 + A5 in one diagram
  and it closes the obvious question after slide 9.
