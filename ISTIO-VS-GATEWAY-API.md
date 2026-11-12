# Istio vs Gateway API — options, pros, cons, shortcomings

**Written 2026-11-12.** Prompted by the company direction "Istio over Gateway API."
Companion to `GOALS.md` §3.4 / §3.6 and `GOALS-GAPS.md` §A1.

---

## 0. The framing has to be fixed first, or the table won't make sense

**Istio and Gateway API are not competitors.** Gateway API is a *set of CRDs*
(`Gateway`, `HTTPRoute`, …). Istio is an *implementation* — and a conformant one; it has
supported Gateway API since v1.16, and Gateway API support is on by default in current
releases. Picking Istio does not opt us out of Gateway API; running Gateway API does not
require abandoning Istio.

So "Istio over Gateway API" resolves into **three separate decisions**, and the company
direction only clearly settles the first:

| | Decision | Options | What the direction implies |
|---|---|---|---|
| **D1** | Who moves the packets | Istio / Envoy Gateway / kgateway / Cilium / NGINX Gateway Fabric / cloud LB controller | **Settled: Istio** |
| **D2** | Which config surface we write | Istio classic (`VirtualService`, `DestinationRule`, `Gateway`) vs Kubernetes Gateway API (`HTTPRoute`, `Gateway`) | **Not settled** — this is the real question |
| **D3** | Sidecar or ambient data plane | sidecar / ambient (ztunnel + waypoint) / mixed | **Not settled** |

The tables below cover all three. Where a fact came from a vendor blog rather than
official docs it is marked ⚠️ — treat those as "verify before it goes on a slide,"
same rule as `GOALS.md` §1.5.

---

## 1. D2 — config surface: Istio classic APIs vs Kubernetes Gateway API

| | **Istio classic** (`VirtualService` + `DestinationRule` + Istio `Gateway`) | **Kubernetes Gateway API** (`Gateway` + `HTTPRoute` + policy CRDs) |
|---|---|---|
| **Maturity** | 7+ years in production, every Istio feature expressible | v1 core stable; `GRPCRoute` stable; `TCPRoute`/`TLSRoute`/`UDPRoute` still experimental channel |
| **Feature coverage** | Complete. Circuit breaking, outlier detection, connection pools, fault injection, mirroring, locality LB, retries — all first-class | **Shortcoming:** no circuit breaking / outlier detection / connection pooling in the spec. You still write a `DestinationRule` ⚠️. Retries in `HTTPRoute` are experimental and implementation-dependent |
| **Multi-tenancy** | **Shortcoming:** `VirtualService` is host-scoped. Two teams claiming the same host conflict; merge semantics and rule ordering are a known footgun; no clean RBAC split between "who owns the listener" and "who owns the route" | Designed for exactly this: infra team owns `Gateway`, app teams own `HTTPRoute`, `ReferenceGrant` controls cross-namespace. This is the single strongest argument for it |
| **Portability** | Zero. Istio-only | Partial, and honestly so: core routing is portable, but **auth, JWT, rate limiting, WAF and ext-authz are all implementation-specific CRDs** in every implementation. Portability evaporates at the layer we actually care about |
| **Escape hatch** | `EnvoyFilter` — can do anything, breaks on upgrades, officially unsupported | None by design. If we need raw Envoy config, we're back to `EnvoyFilter` anyway |
| **Direction of travel** | ⚠️ Reported as frozen for new features; no official removal date announced | Where new Istio features land first — the inference extension work is Gateway API-shaped, not `VirtualService`-shaped |
| **East-west / mesh** | Mature. The mesh *is* these APIs | GAMMA (mesh via `parentRef` to a Service) is newer and thinner than Istio's own APIs |
| **Argo Rollouts (§1.7)** | **Built-in** Istio trafficRouting provider — the most battle-tested canary integration Rollouts has | Supported via the Gateway API **plugin** (`rollouts-plugin-trafficrouter-gatewayapi`) — works, less mileage |
| **Per-listener scaling** | One `Gateway` object per ingress, fine | **New fix:** `ListenerSets` split listeners across objects/teams — **[show]** *ListenerSets: Ingress → Gateway API* (Kubermatic, The Trade Desk) |

**Real-world counter-example worth knowing:** the Gardener project migrated off
Ingress NGINX to **Istio's native `VirtualService`/`Gateway`/`EnvoyFilter`**, not to
Gateway API ⚠️. We are not the only ones who would make that call.

**Recommendation:** write **new** config in Gateway API, keep `DestinationRule` for the
resilience settings Gateway API has no vocabulary for, and don't bulk-migrate existing
`VirtualService`. That is "Istio over Gateway API" read as *Istio is the platform*, which
costs nothing and keeps the door open; reading it as *don't use Gateway API CRDs* costs
us the team-boundary model and puts us on a config surface the project is no longer
investing in.

---

## 2. D1 — implementations, if the Istio decision is ever reopened

| Option | Pros | Cons | Shortcomings to name out loud |
|---|---|---|---|
| **Istio (sidecar)** | Most complete feature set; mTLS + SPIFFE identity per workload (**directly serves §3.6**); mature multicluster; huge ecosystem; CNCF graduated; Argo Rollouts first-class | Heaviest operational object on this list; sidecar CPU/mem per pod; control-plane + data-plane upgrade choreography (revisions); Job/CronJob lifecycle friction | **Metrics cardinality is a real cost** — **[show]** *Two-Stage OTel Aggregation: Taming Istio Cardinality at 10k-Pod Scale* (Yahoo, 📎 deck). Budget for it in §4.2 |
| **Istio (ambient)** | No sidecars: no injection, no pod restarts to upgrade the data plane; lower p90/p99 latency per Istio's own numbers; one waypoint per workload instead of one proxy per pod; cheaper at high pod counts | L7 features live in the waypoint, so you pay for L7 only where you want it — but also *only get* it there | **Mixed-mode migration is the trap:** sidecar→ambient traffic can bypass the waypoint, so L7 policy silently doesn't apply until both ends move ⚠️. Waypoints need ≥2 replicas; in-place ztunnel upgrades can briefly disrupt node traffic ⚠️. Ambient **multicluster went beta ~April 2026** — new. **[show]** *The Sidecar-to-Ambient Migration Nobody Warned Us About (AI Edition)* (Veritas Automata) |
| **Envoy Gateway** | Gateway API-native, much smaller blast radius than a mesh; CNCF/Envoy project; **Envoy AI Gateway is built on it** (§3.4) | North-south only — no mesh, so §3.6 identity needs SPIRE or similar separately | Policy (auth, rate limit) via its own `SecurityPolicy`/`BackendTrafficPolicy` CRDs — portable config is a smaller set than it looks. **[show]** *Guardrails, Not Gatekeepers: Envoy Gateway in the Enterprise* |
| **kgateway / agentgateway** | Gateway API-native; the strongest MCP + LLM routing feature set at the show; **agentgateway is now experimental inside the Istio data plane**, so this converges with the Istio direction rather than competing | CNCF sandbox maturity; Solo.io-driven governance | Newest option here; small production base outside Solo customers. **[show]** *New Traffic, New Rules* (NVIDIA, Solo.io, 📎 deck) |
| **Cilium Gateway API** | Free if we already run Cilium; no extra proxy tier for L4; eBPF efficiency; Hubble gives §4.4 egress visibility for nothing | L7 handling still goes through a per-node Envoy; mesh features thinner than Istio's | Gateway API feature coverage trails Envoy Gateway/Istio; mutual-auth story is not SPIFFE-equivalent. **[show]** *From ListenerSets to eBPF Plugins: Cilium's Evolution Across the Stack* (Datadog, Isovalent at Cisco) |
| **NGINX Gateway Fabric** | OSS, F5-backed, familiar config mental model for ex-Ingress-NGINX teams | Fewest features of the serious options; no mesh | The obvious "we just want ingress back" choice — and it leaves §3.4/§3.6 entirely unsolved |
| **Linkerd** | Simplest mesh by a distance; lowest resource overhead; SPIFFE identities; genuinely easy mTLS | **Licensing shortcoming:** Buoyant stopped publishing OSS *stable* releases at 2.15 — stable builds are Buoyant Enterprise (paid above a user threshold) ⚠️. Edge releases are Apache-2.0 but carry no support policy | For a company standardizing on OSS this is a procurement conversation, not a technical one. **[show]** *Is Service Mesh for Everyone?* (Buoyant) |
| **HAProxy / Traefik / APISIX** | Solid, light, well-understood ingress; HAProxy pitched a combined ingress+mesh model | Mesh and AI-traffic stories are thin or vendor-specific | **[show]** *Demo Theater: Universal Mesh: One Model for Ingress, Gateway API, and Multi-Cloud* (HAProxy) |
| **Cloud controllers** (AWS Gateway API Controller, ALB) | Managed, no proxy fleet to run; fits §10 AWS strategy | Per-LB cost; weakest extensibility; nothing east-west | Ties routing semantics to one cloud — awkward against §5's on-prem + EKS split |
| **Ingress NGINX** | — | **Retired. Maintenance ended March 2026: no releases, no bugfixes, no security patches.** Existing installs keep running; that is not the same as being safe | Not an option. If it's still deployed anywhere, that's an incident waiting. **[show]** *Four Resources, One Object: Surviving Gateway API After Ingress NGINX* (AWS) |

---

## 3. What each option does for the things `GOALS.md` actually needs

| `GOALS.md` need | Istio classic APIs | Istio + Gateway API | Envoy Gateway / kgateway | Cilium | Linkerd |
|---|---|---|---|---|---|
| **§1.7** canary traffic shifting | ✅ best Argo Rollouts integration | ✅ via Rollouts plugin | ✅ via Rollouts plugin | ⚠️ limited | ✅ simple splits only |
| **§3.6** workload identity / mTLS | ✅ SPIFFE IDs, no extra system | ✅ same | ❌ north-south only; add SPIRE | ⚠️ not SPIFFE-equivalent | ✅ SPIFFE IDs |
| **§3.4** AI gateway / inference routing | ❌ not expressible | ✅ **InferencePool / Gateway API Inference Extension — beta in Istio as of KubeCon EU 2026; blog says available from 1.27, v1 in 1.28** ⚠️ verify against release notes | ✅ Envoy AI Gateway / agentgateway | ❌ | ❌ |
| **§2.4** MCP + egress governance | ✅ `AuthorizationPolicy`, ext-authz → Kyverno authz | ✅ same, plus agentgateway (experimental in Istio) | ✅ strongest MCP feature set today | ⚠️ L3/L4 egress only | ⚠️ limited |
| **§4.4** egress visibility | ✅ mesh telemetry (at cardinality cost) | ✅ same | ⚠️ north-south only | ✅ Hubble, cheap | ✅ |
| **§5.1** multicluster | ✅ mature (sidecar) | ✅ | ❌ | ⚠️ cluster mesh | ⚠️ |
| **§4.2** telemetry cost | ❌ cardinality explosion — plan for it | ❌ same | ✅ much smaller surface | ✅ | ✅ low |
| **Ingress replacement (A1)** | ✅ | ✅ | ✅ | ✅ | ❌ not an ingress |

**Supporting sessions for the Istio-centric reading:**
- **[show]** *Translating Mesh Identity into MCP Impersonation: Governing AI Agent Identities with Istio* (Bancolombia) — the mesh as the agent identity layer. This is §3.6 and §3.5 solved by a system we're already committing to.
- **[show]** *AI-Aware Traffic Management: Scaling Inference with Istio Ambient Mesh*
- **[show]** *From Bearer Tokens to Mesh-Native mTLS* (Coinbase, 📎 deck)
- **[show]** *Set Sail with Istio: Developing a Production Service Mesh* (Ericsson, Microsoft, Red Hat, Solo.io) — plus a full **Istio Day**
- **[show]** *Breaking the O(n²) Wall: Pub/Sub Federation for Istio Multicluster Service Discovery* (Microsoft) — names the multicluster scaling limit honestly
- **[show]** *Will Your Gateway Leave You High and Dry?* (Microsoft, Solo.io) — the project-abandonment risk question, post-Ingress-NGINX
- **[show]** *You don't have to migrate everything — Envoy is the Bridge Between Your Old World and Your New* (GEICO)

---

## 4. Shortcomings of the company direction, stated plainly

These are the things to have an answer for before the readout, not reasons to reverse it:

1. **Istio does not relieve us of the Gateway API decision** — it *contains* it. If the
   intent was "we don't have to learn Gateway API," that's not what choosing Istio buys.
2. **Mesh-wide identity is the prize; mesh-wide L7 is the cost.** Ambient lets us take
   the first without paying fully for the second — which is why D3 matters more than it
   looks and should be decided alongside, not later.
3. **Cardinality is a budget line, not a footnote.** Yahoo needed two-stage OTel
   aggregation at 10k pods. We should know our pod count before we know our metrics bill.
4. **One team has to own it.** Istio is the largest operational object in `GOALS.md`.
   If no team is named, the realistic alternative is Envoy Gateway for ingress plus SPIRE
   for identity — less capability, far less weight.
5. **Istio's AI-traffic features are new.** GAIE support is beta-era and the version
   numbers in circulation disagree ⚠️. Fine for a §3.4 trial; not fine for a slide that
   claims it's solved.
6. **Ingress NGINX has no maintainer and no security fixes since March 2026.** Whatever
   we decide, that migration has a clock on it independent of this debate.

---

## 5. Recommendation in one paragraph

Keep the direction. Run **Istio** as the single data plane for both north-south and
east-west — it collapses `GOALS-GAPS.md` A1 (ingress replacement), §3.6 (identity) and
§3.4 (AI gateway) into one system instead of three. Write **new** routing as Gateway API
`HTTPRoute` because that is where Istio's own investment is going and because it gives
us the infra-team/app-team split `VirtualService` can't; keep `DestinationRule` for
circuit breaking and outlier detection, which Gateway API still can't express. Default
to **ambient** for new namespaces and leave existing sidecars alone until there's a
reason, treating any mixed sidecar↔ambient path as unprotected at L7 until both sides
move. Treat Istio's inference-extension support as the §3.4 trial rather than a decision
already made.

**Add to the `GOALS.md` decisions table:**

| # | Decision | Needs |
|---|---|---|
| 11 | Istio classic APIs or Gateway API for new config? | Recommend Gateway API + `DestinationRule`; one owner |
| 12 | Sidecar, ambient, or mixed — and what's the migration rule? | Recommend ambient-for-new; mixed-mode L7 gap must be written down |
| 13 | Who owns the mesh? | A named team, or the recommendation changes to Envoy Gateway + SPIRE |
