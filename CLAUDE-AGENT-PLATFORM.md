# From Claude on laptops to Claude agents on Kubernetes

**What this is:** a plan for moving from "every engineer runs Claude Code on their own
desktop" to "event-triggered Claude agents run as Jenkins jobs in Kubernetes pods",
without losing control of credentials, cost or blast radius. It's the delivery plan
for **§6 stages 1–2** in `GOALS.md` (alert triage by Q2 2027, agents opening PRs by end
of 2027). It also makes §3 (substrate, identity, gateway) and §4 (OTel) concrete for the
one agent runtime we already pay for.

Status legend as in `GOALS.md`: 🟢 Adopt · 🟡 Trial · 🔵 Decide · ⚪ Watch.
⚠️ = verify against current Anthropic / Jenkins docs before building on it. Claude Code
moves fast, and flag names in this doc were written from memory.

---

## 0. The position in one paragraph

**Don't build an agent platform. Run Claude Code headless, in throwaway pods, through
the CI system we already trust.** Jenkins already gives us triggers, credentials
binding, audit logs, RBAC, retries, queueing and a UI people know. Kubernetes already
gives us isolation, quotas and network policy. What's missing is (a) a hardened agent
image, (b) one shared, versioned source of skills/MCP/settings that both laptops and
pods consume, (c) a gateway that every model and tool call passes through, and (d)
telemetry that tells us what each run did and cost. Build those four things and let
everything else be Jenkins. **The biggest mistake on offer is letting each team wire
its own `claude -p` into its own pipeline with its own API key.** That's the default
outcome if we don't do this first, and it's the laptop problem again, this time with
no human watching.

---

## 1. Where we are and where we're going

| | Today (stage 0) | Target (stages 1–2) |
|---|---|---|
| Who runs Claude | An engineer at a terminal | A Jenkins job, fired by an event |
| Credentials | Personal login / personal API key | Per-job, short-lived, scoped to the job's purpose |
| Skills, MCP, CLAUDE.md | Copied between people via Slack, drifting | One versioned plugin marketplace in git, the same for laptops and pods |
| Permissions | Whatever each person clicked "allow" on | Managed settings baked into the image; per-job allowlist; hooks enforce |
| Blast radius | The engineer's laptop and everything their creds can reach | One pod, one namespace, egress only to the gateway, no cluster write creds |
| Observability | None. We don't know what it's used for (§4.1) | OTel metrics + logs per run, tagged by job / team / trigger, in the stack we already run |
| Output | Whatever the human applies | A comment, a ticket update, or a **PR**, never a direct change |

The output row matters most. Through stage 2 **an automated agent never writes to
anything except a PR, a comment or a ticket.** That one rule is what lets us skip
most of the safety machinery in §3.1 and §3.7 for now.

---

## 2. Architecture

```
  Triggers                     Orchestration               Execution (K8s)                 Egress
 ─────────                    ───────────────            ──────────────────              ────────
 GitHub/GitLab webhook ─┐                                ┌─ ns: claude-agents ─────────┐
 Alertmanager webhook ──┼──► Jenkins controller ──────►  │  ephemeral agent pod        │
 Jira / Slack command ──┤    (Generic Webhook Trigger,   │  ├─ jnlp container          │
 Cron (nightly review) ─┘     shared library             │  └─ claude container        │──► AI gateway ──► Anthropic API
                              `claudeAgent(...)`,        │     - claude -p (headless)  │    (§3.4)        / Bedrock
                              credentials binding)       │     - managed-settings.json │
                                                         │     - plugins from mirror   │──► MCP gateway ─► GitHub, Jira,
                                                         │     - OTel env vars         │    (§3.5)         Grafana, k8s RO
                                                         │  NetworkPolicy: egress only │
                                                         │  to the two gateways + OTel │──► OTel collector ─► Jaeger/Loki/
                                                         └─────────────────────────────┘                     Prometheus
```

Four components we own: **the agent image**, **the Jenkins shared library**, **the
config marketplace** and **the gateway**. Everything else is configuration.

---

## 3. Phased plan

Each phase has an exit gate. Don't start the next phase until its gate is met. That's
the same rule as the §6 ladder.

### Phase 0 — Inventory and standardise the desktops 🟢 Adopt (now → Jan 2027)

The automated phases are only as good as the shared config they inherit, and that
config doesn't exist yet. So this phase is mostly about laptops.

1. **Turn on telemetry on every desktop** via managed settings (§6). This is the §4.1
   "what are we using AI for" inventory, almost for free. Two to four weeks of data
   tells us which workflows are worth automating first.
2. **Move everyone to org-provisioned auth** (Claude for Enterprise/Teams seats, or
   Bedrock via SSO). Personal API keys stop being accepted on company repos.
3. **Ship a managed settings file** (MDM / config management) with the org-wide deny
   list and telemetry env vars. See §5.
4. **Stand up the config marketplace repo** (§4) and move the 5–10 skills and MCP
   configs people already pass around into it.
5. **Commit a `CLAUDE.md` in each service repo.** Agents in pods will read the same
   file. Writing it now pays twice.

**Exit gate:** ≥80% of active users report telemetry; the marketplace has an owner and
a review process; we can name the top 5 use cases from data, not anecdote.

### Phase 1 — Read-only agents in CI 🟢 Adopt (Feb → Q2 2027) — this is §6 stage 1

Start with jobs that **cannot write anything except a comment**:

- **PR review bot:** on PR open, review the diff against the repo's `CLAUDE.md` and
  post one comment.
- **Alert triage:** Alertmanager webhook → Jenkins → agent reads Grafana/Prometheus/Loki
  and recent deploys through **read-only** MCP servers → posts the §6 stage-1 breakdown
  to the alert's Slack thread or incident.
- **Nightly reports:** dependency drift, flaky-test clustering, cost anomalies.

What's built in this phase: the agent image, the `claudeAgent` shared-library step,
the namespace with NetworkPolicy, the OTel pipeline, and the accept/modify/reject
logging that §6 says is the evidence for stage 2.

**Exit gate:** 8 weeks of stage-1 triage with the accept/modify/reject log populated;
cost per run known and within budget; zero credential findings in a security review of
the pod.

### Phase 2 — Agents that open PRs 🟡 Trial (H2 2027) — this is §6 stage 2

- Agent gets a **GitHub App installation token scoped to one repo**, with
  `contents:write` + `pull_requests:write` on a branch prefix (`claude/*`). Branch
  protection guarantees it can never push to `main`.
- Every agent-authored commit carries trailers (`Agent-Run: <jenkins build URL>`,
  `Agent-Trigger: <alert/issue id>`). That's §1.9 traceability, and it means the
  OTel trace for the run is one click from the PR.
- PRs go through the **same** §2.2 policy-in-CI and progressive delivery as human PRs.
  No fast lane.
- Typical jobs: issue labelled `claude-fix` → PR; Renovate PR fails → agent attempts
  fix on the same branch; §10.6 right-sizing PRs.

**Exit gate (for anything beyond stage 2):** see §6 in `GOALS.md`. Stages 3+ need §3.1
sandboxing and §3.7 durable execution and are out of scope for this document.

### Phase 3 — Scale and self-service 🔵 Decide (2028)

Let teams add their own agent jobs from a template with no platform-team ticket. The
open question is whether we stay on Jenkins or move execution to a Kubernetes-native
controller (kagent §3.3, Argo Workflows/Events, or Anthropic's hosted Managed Agents).
**Decide this with phase-1/2 data, not now.** The pieces in §4–§7 (image, marketplace,
gateway, OTel) carry over regardless of which one we pick. That's the main reason to
build them as separate components and not as Jenkins-specific glue.

---

## 4. Sharing skills, MCP servers and settings between users 🟢 Adopt

This is the part people underestimate. Today the "platform" is a Slack thread of
`.mcp.json` snippets and skill folders, all drifting. The fix is one versioned source
that laptops and pods both consume.

### 4.1 Layers, from most to least authoritative

| Layer | Mechanism | Who controls it | Use it for |
|---|---|---|---|
| **Org policy** | Managed settings file (e.g. `/etc/claude-code/managed-settings.json` on Linux; MDM-delivered on macOS) ⚠️ path | Platform/security | Deny lists, required hooks, telemetry, allowed MCP servers, marketplace registration. **Users can't override it** |
| **Org toolbox** | Internal **plugin marketplace** (a git repo) | Platform team + contributors via PR | Skills, slash commands, subagents, hooks and MCP server definitions, bundled as versioned plugins |
| **Repo** | Committed `.claude/settings.json`, `.mcp.json`, `CLAUDE.md`, `.claude/skills/` | The repo's owning team | Repo-specific context, build/test commands, repo-only skills |
| **Personal** | `~/.claude/`, `.claude/settings.local.json` | The individual | Preferences. **Never present in pods** |

Rule: **anything needed by an automated job must live in one of the first three
layers.** If a job only works because of something in someone's `~/.claude`, it's a
bug.

### 4.2 The internal marketplace

A git repo, say `claude-marketplace`, with a `.claude-plugin/marketplace.json` at the
root listing plugins ⚠️ verify manifest format. Each plugin is a directory bundling any
of `skills/`, `commands/`, `agents/`, `hooks/` and `.mcp.json`:

```
claude-marketplace/
├── .claude-plugin/marketplace.json
├── plugins/
│   ├── sre-triage/           # stage-1 alert triage: skills + read-only MCP (Grafana, Loki, k8s)
│   ├── pr-review/            # review skill tuned to our conventions
│   ├── k8s-readonly/         # MCP: kubectl get/describe/logs only, via the MCP gateway
│   ├── platform-guardrails/  # PreToolUse hooks: block secrets, block kubectl apply, etc.
│   └── argo-gitops/          # skills for writing Argo CD / Kargo manifests (§1)
└── CODEOWNERS
```

- **Registered for everyone** through managed settings (`extraKnownMarketplaces`), with
  the baseline plugins switched on via `enabledPlugins` ⚠️ key names. Teams opt into
  the rest.
- **Changes go through PR review with CODEOWNERS.** A skill is a prompt that runs with
  someone's permissions. Review it like code, because it is code.
- **Release by git tag.** Laptops track `main`. **Pods pin a tag**, baked into the image
  or fetched at start from an internal mirror. An automated job must never pick up a
  skill change that nobody reviewed for automation.
- **Evals live next to the skill.** Each plugin carries a few golden inputs and expected
  behaviours, and CI runs them on change. That's the Salesforce lesson from §6
  (25% → usable came from knowledge management + evaluation, not a better model).

### 4.3 MCP servers: run them centrally, don't ship them to every laptop

Stdio MCP servers on each laptop mean each one runs with that person's tokens. That's
the §3.5 problem. The plan:

1. **Remote (HTTP) MCP servers, run by the platform team in-cluster**, behind an MCP
   gateway. That's the §3.5 bake-off between **Obot** and **ToolHive**: run it in
   phase 0, pick one by phase 1.
2. The gateway authenticates the **caller** (the user's SSO identity on a laptop; the
   job's workload identity in a pod) and maps it to a tool-level policy (Cedar/OpenFGA,
   §3.6). The same `k8s-readonly` server then gives an SRE more than it gives a CI job.
3. Plugins reference the gateway URL, not a binary. One definition works on laptops and
   in pods.
4. Managed settings **allow-list** MCP servers so a random `npx some-mcp-server` can't
   be added on a company repo ⚠️ verify the managed MCP allow/deny settings.
5. In pods, run with an explicit `--mcp-config` + `--strict-mcp-config` ⚠️ so the job
   loads *only* the servers it declares, and nothing it happened to inherit.

### 4.4 What not to share

- **Credentials, ever.** No token in `.mcp.json`, plugin or skill. Gateways hold them,
  or they're injected per job.
- **Personal memory / `~/.claude` content.** It's unreviewed and goes stale.
- **"Allow everything" settings.** `--dangerously-skip-permissions` is banned outside a
  sandbox that can't reach anything (§5.3).

---

## 5. Security model 🟢 Adopt

Built around the §3.2 substrate checklist. For each agent job we have to be able to say
where **identity, sandbox, session/state and egress control** come from.

### 5.1 Identity and credentials

| Credential | Source | Lifetime | Scope |
|---|---|---|---|
| Model access | Gateway-issued token, or IRSA → Bedrock (`CLAUDE_CODE_USE_BEDROCK=1`) | Job duration | Per-team quota at the gateway |
| Git write (phase 2) | GitHub App installation token minted per job | ≤1h | One repo, `claude/*` branches |
| MCP tools | Gateway exchanges the pod's ServiceAccount token (or SPIFFE ID) | Job duration | Per-job policy |
| Kubernetes | **None** for the target clusters. Reads go through the read-only MCP server | — | — |

- **No long-lived Anthropic API key in Jenkins credentials** if we can avoid it. Either
  route through the gateway (which holds the key) or use Bedrock with IRSA. If a key is
  unavoidable, inject it through Claude Code's `apiKeyHelper` ⚠️, which fetches from
  Vault at runtime, not through an env var visible to every process in the pod.
- The pod's ServiceAccount has **no** RBAC on its own cluster beyond what the Jenkins
  agent needs.

### 5.2 Permissions inside Claude Code

Defence in depth, three layers:

1. **Managed settings in the image** (`/etc/claude-code/managed-settings.json`):
   `permissions.deny` for `Bash(kubectl apply:*)`, `Bash(kubectl delete:*)`,
   `Bash(curl:*)`, `Bash(git push:*)` (outside the wrapper), `Read(**/.env)`,
   `Read(**/*secret*)`; telemetry forced on; `disableBypassPermissionsMode` ⚠️.
2. **Per-job allowlist** on the command line: `--allowedTools` listing exactly the tools
   the job needs, plus `--max-turns` as a runaway brake. A review job gets `Read`,
   `Grep`, `Glob` and one comment-posting MCP tool, and nothing else.
3. **`PreToolUse` hooks** from the `platform-guardrails` plugin: deterministic checks
   that can't be prompted around. They scan for secrets in anything written, block
   paths outside the workspace and log every denied call to OTel. This is "models
   produce evidence, code decides authority" (§6) at the tool-call level.

### 5.3 Sandbox

- **Phase 1–2: standard pods**, hardened: non-root, read-only root FS except the
  workspace `emptyDir`, dropped capabilities, `seccompProfile: RuntimeDefault`, Pod
  Security `restricted`, CPU/memory limits, `activeDeadlineSeconds`. Acceptable because
  the agent has no credentials worth escaping for and no write path except a PR.
- **When agents run code they wrote against anything sensitive** (stage 4), move to
  `runtimeClassName: kata` (§3.1). Not before. It costs start-up latency we don't need
  to pay yet.

### 5.4 Egress

NetworkPolicy (or Cilium/Istio policy, see `ISTIO-VS-GATEWAY-API.md`) allowing egress
**only** to: the AI gateway, the MCP gateway, the OTel collector, the internal git host
and package mirror. **No general internet.** That one control turns prompt injection
from "exfiltrate the repo" into "post a weird PR comment". It's the single most
valuable line in this section.

### 5.5 Prompt injection: treat every trigger payload as untrusted

PR descriptions, issue bodies, alert annotations and log lines are all
attacker-influenceable text that ends up in the prompt. Mitigations:

- Pass trigger payloads as **data** (a file the agent reads, clearly labelled), never
  spliced into the system prompt.
- **Fork PRs and external contributors never trigger a write-capable job.**
- The output path is narrow (one comment / one PR), and the hooks scan it.
- Egress lockdown (§5.4) caps the damage when everything else fails.

---

## 6. Observability with OTel 🟢 Adopt

Claude Code exports OpenTelemetry **metrics and log events** natively (traces ⚠️ were
in beta last we checked). Point it at the collector we already run (§4.2 in
`GOALS.md`).

### 6.1 Configuration (identical on laptops and pods, set via managed settings `env`)

```bash
CLAUDE_CODE_ENABLE_TELEMETRY=1
OTEL_METRICS_EXPORTER=otlp
OTEL_LOGS_EXPORTER=otlp
OTEL_EXPORTER_OTLP_PROTOCOL=grpc
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector.observability:4317
# pods only: tie every metric to the Jenkins run
OTEL_RESOURCE_ATTRIBUTES=agent.job=${JOB_NAME},agent.build=${BUILD_NUMBER},agent.trigger=${TRIGGER_TYPE},team=${TEAM},repo=${REPO}
```

⚠️ Verify variable names and the prompt-content logging flag (`OTEL_LOG_USER_PROMPTS`)
against current docs. **Keep prompt logging off by default.** Prompts contain code and
customer data, and turning it on is a data-classification decision, not a debugging
convenience.

### 6.2 What we get and what we build on it

| Signal | Native? | Dashboard / alert |
|---|---|---|
| Tokens and cost per session, by model | ✅ metrics | Cost per job, per team, per trigger type; budget alert per team |
| Sessions, lines changed, PRs/commits | ✅ metrics | Adoption (phase 0), throughput (phase 2) |
| Tool decisions (accept/reject), tool results, API errors | ✅ log events | Denied-call rate (a guardrail is firing, or a skill is wrong) |
| Run outcome, human accept/modify/reject | ❌ we emit | **The §6 stage-2 gate evidence.** Emitted by the shared library at job end and by a Slack/PR reaction handler |
| Gateway-side token and tool spans | gateway | The trace backbone: join on `agent.build` |

**Cardinality warning (the Yahoo talk, §4.2):** `agent.build` is unbounded. Keep it as
a log/trace attribute and drop it from metrics at the collector, or the metrics backend
falls over at phase-3 volume.

### 6.3 The questions telemetry must answer by end of phase 1

- What does a triage run cost? (Verkada's benchmark is **$0.33 per alert**, §6.)
- Which jobs/skills have the worst human-accept rate?
- Which tools get denied most, and is that the hook working or the skill being wrong?
- Which team is spending what, and on which trigger?

---

## 7. The Jenkins side

### 7.1 Triggering

- **Generic Webhook Trigger** plugin for Alertmanager / Jira / Slack payloads, and the
  GitHub/GitLab branch-source plugins for PR events.
- **Every webhook authenticated** (HMAC signature or token) and **rate-limited**. An
  unauthenticated "run Claude" endpoint is a cost and injection vector.
- **Dedup and concurrency**: `disableConcurrentBuilds()` per PR/alert key, and a
  queue-level cap per team. An alert storm must not become 400 parallel agent runs.

### 7.2 The shared library step

Teams never write `claude -p` themselves. They call one reviewed step:

```groovy
// vars/claudeAgent.groovy (sketch)
def call(Map cfg) {
  podTemplate(yaml: libraryResource('claude-agent-pod.yaml'),   // hardened pod, §5.3
              namespace: 'claude-agents') {
    node(POD_LABEL) {
      container('claude') {
        withCredentials(credentialsFor(cfg.profile)) {          // short-lived, §5.1
          writeFile file: 'trigger.json', text: cfg.payload     // untrusted data, §5.5
          sh """
            claude -p "\$(cat prompts/${cfg.task}.md)" \
              --output-format stream-json \
              --allowedTools '${allowlistFor(cfg.profile)}' \
              --mcp-config mcp/${cfg.profile}.json --strict-mcp-config \
              --max-turns ${cfg.maxTurns ?: 30} \
              > transcript.jsonl
          """
        }
        archiveArtifacts 'transcript.jsonl'                     // audit trail per run
        emitOutcome(cfg)                                        // §6.2 custom event
      }
    }
  }
}
```

⚠️ Check flag names against the current `claude --help`. For anything that grows
beyond a single prompt (branching, retries on specific tool failures, custom tools),
switch the container entrypoint to a small **Claude Agent SDK** program
(`@anthropic-ai/claude-agent-sdk` / `claude-agent-sdk`). It's the same harness as a
library, and the shared-library interface stays the same.

**Profiles, not free-form config.** A job picks `profile: 'pr-review' | 'alert-triage'
| 'pr-author'`, and the profile fixes its tool allowlist, MCP set, credentials and
budget. New profiles go through platform review. That keeps the number of distinct
permission shapes small enough to audit.

### 7.3 Pod template essentials

- Image: pinned digest, built nightly from a reviewed Dockerfile with the `claude` CLI
  version **pinned**, marketplace tag pinned, managed settings baked in, signed
  (cosign) and admission-verified (§2).
- `ResourceQuota` + `LimitRange` on `claude-agents`. Separate node pool (Karpenter,
  §10.3) so agent bursts don't starve real CI.
- `activeDeadlineSeconds` as a hard wall-clock cap, on top of `--max-turns`.

---

## 8. Cost and scale controls

| Control | Where |
|---|---|
| Per-team monthly budget, hard stop | AI gateway (§3.4) |
| Per-run token/turn cap | `--max-turns`, `activeDeadlineSeconds` |
| Model per profile (Opus for authoring PRs, a cheaper model for triage/review) | Profile config. Pick from phase-1 cost/accept data, not upfront |
| Prompt caching | Stable skills + `CLAUDE.md` at the front of context. Verkada saw an **87.5% cache read ratio** (§6) |
| Concurrency | Jenkins queue caps + namespace quota |
| Kill switch | One managed-settings / gateway flag that stops all automated runs. **Test it quarterly** |

---

## 9. Decisions we need to make

| # | Decision | Recommendation | When |
|---|---|---|---|
| A1 | Model access path: Anthropic API via gateway vs Bedrock + IRSA | **Bedrock + IRSA** if we're all-in on AWS (§10). No static key anywhere. Gateway in front either way | Phase 0 |
| A2 | MCP gateway: Obot vs ToolHive | Run the §3.5 bake-off; choose on directory integration + Cedar support | End of phase 0 |
| A3 | Who owns the marketplace repo | Platform team owns it; contributions by PR from anyone; CODEOWNERS per plugin | Phase 0 |
| A4 | Prompt logging on or off | **Off** by default; on per-profile only after data-classification review | Phase 0 |
| A5 | Agent identity for git: GitHub App vs bot user | **GitHub App.** Per-install, short-lived tokens, fine-grained | Phase 1 |
| A6 | Jenkins long-term, or move to K8s-native orchestration | **Defer to phase 3**, with data | 2028 |

---

## 10. Shortcomings of this plan, stated out loud

- **It bets on Jenkins** because we already run it, not because it's the best agent
  orchestrator. Long multi-step agents (stage 4) want durable execution (§3.7), which
  Jenkins isn't. Phase 3 is where this gets revisited, and keeping the components
  separable (§3 phase 3) is the hedge.
- **Headless Claude Code is a coding harness**, not a general workflow engine. For
  non-coding agents (pure triage) the Agent SDK or plain API calls may be cheaper and
  simpler. Measure in phase 1.
- **The marketplace only works if someone curates it.** Without an owner it becomes the
  Slack thread again, just in git.
- **Several mechanisms here are marked ⚠️** because Claude Code's settings surface
  changes monthly. Phase 0 includes a spike to verify every ⚠️ against the version we
  pin.
- **No evaluation harness is specified yet.** §6 (Salesforce, 25% accuracy) says it's
  the thing that actually decides whether stage 1 works. It needs its own section once
  phase 0 data shows which skills matter.

---

## Evidence from the show

All cross-referenced in `GOALS.md`. Not repeated here:
§3.1 sandboxing (Kata snapshots, Lima), §3.2 "Pods are not enough for AI agents"
(Solo.io/Anthropic/Google keynote), §3.4 gateway reference architecture, §3.5 Obot /
Cedar-for-MCP, §3.6 non-human identity, §4.2 OTel cardinality (Yahoo), §6 Verkada
triage economics and the Salesforce 25%-accuracy counterweight.
