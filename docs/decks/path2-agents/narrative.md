# Path 2: Claude off the laptop, into the pod

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Started 2026-11-17. Reworked from "Getting AI onto Kubernetes Safely" (40 slides, Nov 12)
together with the delivery plan in `CLAUDE-AGENT-PLATFORM.md` (Nov 16) and GOALS §3, §4, §6
and §7. Scope is running Claude (Claude Code, the API or Bedrock, MCP). We don't train or
host a model.

## Brief

- **Audience:** engineering leadership, platform and security leads, and the engineers who
  already use Claude Code every day. Some teams are tempted to drop `claude -p` into a
  pipeline themselves. Security is wary of agents anywhere near production.
- **Setting:** both. 25 minutes live, then sent round.
- **They believe now:** AI at work means Claude Code on a laptop. Agents in our clusters are
  either a long way off or a security problem to block.
- **They believe after:** we can run Claude agents on our own infrastructure next quarter,
  as long as we don't build an agent platform. Claude runs headless in throwaway Jenkins
  pods, behind one gateway, configured from one shared marketplace, and it climbs a ladder
  where only the first two rungs get dates.
- **The one sentence:** don't build an agent platform; run Claude headless in throwaway pods
  through the CI we already trust, and put dates on only the first two rungs of the ladder.
- **The ask:** commit to stage 1 (alert triage) by Q2 2027 and stage 2 (agents open PRs) by
  the end of 2027; start phase 0 this month; choose the model path (we recommend Bedrock +
  IRSA); name owners for the knowledge base and the evaluation harness.

## Shape

- **Structure:** problem → turn → proof → ask. The problem is a default we're already
  drifting into (every team wires its own agent with its own key). The turn is that we
  don't need a platform, only four components. The proof is what the show validated. The
  ask is the ladder's two dates.
- **Acts:** I — *the default we're drifting into* / II — *the turn: four things we build,
  and Jenkins does the rest* / III — *the climb: the ladder, what "done" means, phase 0, the
  ask*.
- **The peak:** `ladder`, slide 12 of 16 (75%). The profile draws itself: solid and dated to
  camp 2, then dashed and undated. It's the slide the decision hangs on.
- **The close:** the deck opens on Verkada's $0.33 alert. Stage 1 is that exact job, and the
  ask is to date it.

## Editorial notes

- No failure-case references. The old readout's 25%-accuracy slide becomes `what-they-budgeted`,
  which keeps the lesson (budget a knowledge base and an eval harness) and drops the story.
- ⚠️ Claude Code flag names, Anthropic and Bedrock pricing, and HolmesGPT's Claude support
  get checked before anything is quoted.

## Visual direction

Series brand: Three Peaks (`docs/decks/_shared/`, see the readout's narrative for the full
palette and type). This path's colour is **teal** (`#36baa2` on night, `#0f6b5b` on
snowfield). What this deck adds:

- **Subject world:** the throwaway pod and the expedition. An agent run is a short trip:
  issued a pass, sent through two gates, logged, and torn down. The ladder is an expedition
  elevation profile: surveyed and dated where we can see the route, dashed where we can't.
- **Grounds:** night for the argument; snowfield for the system drawings (architecture,
  blast radius, the trace); the ladder on night so the profile glows.
- **Pieces:** the **enclosure** (a pod drawn as a dashed teal boundary whose only openings
  are labelled exits); **owned boxes** (teal border = something we build; grey = config of
  something we already run); the **profile** on the peak slide only.

  ```
  opening (cold-open)              peak (ladder)                    densest (architecture)
  ┌──────────────────────────┐    ┌──────────────────────────┐     ┌──────────────────────────┐
  │ Verkada triages 4,700    │    │ Six rungs, and only the  │     │ We own four components…  │
  │ alerts a month for 33¢.  │    │ next two get dates.   ○5 │     │ triggers→[Jenkins]→┆pod┆→AI gw  │
  │         ::::::::::::::::  │    │                 ○4 ┄┄┄   │     │            [step]  ┆img┆→MCP gw │
  │         :::::::●$0.33::  │    │        ●2 ┄○3            │     │                    ┆   ┆→OTel   │
  │         ::::::::::::::::  │    │ ●0 ━━●1                  │     │       [marketplace]→      │
  └──────────────────────────┘    └──────────────────────────┘     └──────────────────────────┘
  ```
- **Concepts as pictures:** a count is drawn as that many dots (4,700 alerts); reach is
  drawn as an enclosure with exits; authority is a progressive-delivery pipeline with the
  payload swapped; a run is a trace.
- **Motion moment:** on `ladder`, the profile draws itself up to camp 2, then the dashed,
  undated slope appears.
- **Anti-default check:** the old deck's controls were six near-identical card grids
  ("Control 01…06" eyebrows). Changed: no eyebrows; each control gets its own picture
  (enclosure, pipeline, trace). The tables (ladder, Claude surfaces) become a profile and
  a system drawing.

## Beats

### cold-open

- **Act:** I
- **Job:** open on an operations number, not a demo
- **Headline:** Verkada triages 4,700 alerts a month for 33 cents each.
- **Visual:** one alert ticket with a $0.33 price stamped on it, and 4,700 hairlines stacked behind it as the month's pile
- **Energy:** 3
- **Into next:** that's the kind of work we want Claude doing. First, what we mean by "AI" here.
- **Source:** "Triaging 4,700 Alerts/Month at $0.33 Each" (Verkada), nine production clusters

### scope

- **Act:** I
- **Job:** take GPUs and model serving off the table before anyone asks
- **Headline:** We run Claude; we are not building or hosting a model.
- **Visual:** a boundary line. Inside, lit: Claude Code, the API or Bedrock, the Agent SDK, our MCP servers. Outside, greyed out: GPU scheduling, DRA, llm-d, vLLM, KServe, training
- **Energy:** 2
- **Into next:** and if we do nothing, here's what running Claude turns into.

### the-default

- **Act:** I
- **Job:** the stakes: name the outcome we're drifting into
- **Headline:** Left alone, every team wires its own `claude -p` into its own pipeline, with its own API key.
- **Visual:** repetition. A grid of near-identical Jenkinsfile fragments, each with its own key line and its own allow-list, copied until it hurts
- **Energy:** 4
- **Into next:** the teams we heard from who run agents in production did the opposite.

### show-agreed

- **Act:** I
- **Job:** prove agents in production are real, and governed
- **Headline:** Teams running agents in production let the agent propose and let policy decide.
- **Visual:** four operating numbers on one ridge: Verkada $0.33 an alert; Podium 30% of merged PRs; Mastercard 30 EKS clusters; Salesforce 1,000 clusters
- **Energy:** 3
- **Into next:** and four keynotes named what any agent needs before it runs.
- **Source:** session titles and abstracts; GOALS §6 evidence

### four-questions

- **Act:** I
- **Job:** give the room the checklist for "production-ready"
- **Headline:** Before an agent runs, we name where its sandbox, identity, session and egress come from.
- **Visual:** an agent drawn as a box with four walls, one labelled on each side. A wall without an answer is drawn open
- **Energy:** 3
- **Into next:** we could build all four into a new platform. We think that's the mistake.
- **Source:** "Agent Substrate", "Sandbox Your Agents", "The Identity Crisis" keynotes (no decks posted)

### the-turn

- **Act:** II
- **Job:** the turn: we don't need an agent platform
- **Headline:** Don't build an agent platform: run Claude headless in throwaway pods, through the CI we already trust.
- **Visual:** two columns of what we already have. Jenkins: triggers, credential binding, audit log, RBAC, retries, queueing, a UI people know. Kubernetes: isolation, quotas, network policy. Then the four gaps, lit
- **Energy:** 4
- **Into next:** those four gaps are the whole build.

### architecture

- **Act:** II
- **Job:** show the whole runtime and the four parts we own
- **Headline:** We own four components; everything else is configuration.
- **Visual:** left to right: triggers → Jenkins → an ephemeral pod in `claude-agents` → AI gateway → Anthropic or Bedrock; MCP gateway → GitHub, Jira, Grafana, read-only k8s; OTel → Jaeger, Loki, Prometheus. The four owned parts (agent image, `claudeAgent` library step, marketplace, gateway) in teal, the rest grey
- **Energy:** 4
- **Into next:** the marketplace is the piece laptops get first.
- **Source:** `CLAUDE-AGENT-PLATFORM.md` §2

### one-marketplace

- **Act:** II
- **Job:** fix today's drift: skills and MCP configs passed round in Slack
- **Headline:** Laptops and pods read the same skills, MCP servers and settings from one versioned repo.
- **Visual:** before and after. Before: skills copied person to person, each copy slightly different. After: one repo fanning out to laptops and pods alike, with MCP servers run centrally
- **Energy:** 3
- **Into next:** and when it runs in a pod, here's how far it can reach.
- **Source:** `CLAUDE-AGENT-PLATFORM.md` §4

### blast-radius

- **Act:** II
- **Job:** answer the security question in one picture
- **Headline:** An agent pod gets one namespace, egress to two gateways, and no cluster write credentials.
- **Visual:** containment drawn to scale. The laptop's reach today (everything the engineer's credentials touch) against the pod's: one namespace, a NetworkPolicy, two gateway exits, a GitHub App token scoped to one repo, no static key anywhere
- **Energy:** 3
- **Into next:** reach is one half. The other is how an agent earns more of it.
- **Source:** `CLAUDE-AGENT-PLATFORM.md` §5

### authority

- **Act:** II
- **Job:** the most copyable idea we brought home
- **Headline:** An agent earns the right to act the way a release earns traffic.
- **Visual:** the progressive-delivery primitives re-pointed at an agent: canary step → shadow mode, analysis → grade the work, success → an eligibility policy, promotion → a reviewed permission PR, abort → revoke the grant
- **Energy:** 4
- **Into next:** and none of that works unless we can see what it did.
- **Source:** "Progressive Delivery for Trust: How Agents Earn the Right to Merge" (Transfix); `deck-assets/03-agents-earn-merge`

### itemize

- **Act:** II
- **Job:** make every agent action countable and costed
- **Headline:** Every Claude call and MCP call becomes a span with a team, a use case and a cost.
- **Visual:** one agent run laid out as a trace: trigger, model calls, tool calls, PR. Each span shows its team label and token cost. Turning telemetry on is also how we take the inventory
- **Energy:** 3
- **Into next:** with that in place, we can climb.
- **Source:** GOALS §4; OTel GenAI semantic conventions

### ladder

- **Act:** III
- **Job:** the peak: the ladder and its two dates
- **Headline:** Six rungs, and only the next two get dates.
- **Visual:** an expedition profile. Camps 0–2 sit on a solid, surveyed slope with dates (today; Q2 2027; end 2027). Camps 3–5 sit on a pale, dashed slope with no dates. The line draws up to camp 2, then the dashes appear
- **Energy:** 5
- **Into next:** camp 1 is close. Here's what reaching it means.
- **Source:** GOALS §6

### stage-one

- **Act:** III
- **Job:** define "done" for stage 1, so it isn't a chatbot
- **Headline:** Triage counts only if a responder would act on it, and the accept-or-reject log is the product.
- **Visual:** one triage card filled in for real: relevance call, severity with its basis, links out, a suggested action, and the responder's accept / modify / reject recorded on it
- **Energy:** 3
- **Into next:** the teams with good numbers all budgeted two things nobody puts in a business case.

### what-they-budgeted

- **Act:** III
- **Job:** name the two unglamorous line items, as practice
- **Headline:** The teams with good numbers budgeted a knowledge base and an evaluation harness.
- **Visual:** two quiet objects: a curated runbook shelf (chat threads weighted down) and a rubric with a sampling grid
- **Energy:** 2
- **Into next:** all of this starts on laptops, this month.
- **Source:** Salesforce AIOps, STCLab, Mastercard

### phase-zero

- **Act:** III
- **Job:** make the first step concrete and safe to start next week
- **Headline:** Phase 0 starts this month, on laptops: telemetry, org auth, one marketplace.
- **Visual:** phases 0–3 as a short route with exit gates; phase 0 lit with its five items and its gate (80% of users reporting telemetry, top five use cases named from data)
- **Energy:** 3
- **Into next:** so here's what we need decided.
- **Source:** `CLAUDE-AGENT-PLATFORM.md` §3

### the-ask

- **Act:** III
- **Job:** the ask, echoing the opening alert
- **Headline:** Commit to the two dates, start phase 0, choose Bedrock, and name two owners.
- **Visual:** the $0.33 ticket from the opening, now stamped with our date: stage 1 by Q2 2027. Beside it four decisions with our lean
- **Energy:** 4
- **Into next:** end

## Appendix: the tool index

Generated by `_shared/gen/tool-cards.mjs` from `assets/tools.json` and used only by the
`with-index` draft. One catalogue card per tool named in this deck; the cards are for
reading afterwards, not for presenting. Edit the JSON and re-run the script.

### tool-index

- **Act:** Appendix
- **Job:** open the reference section and show every tool at a glance
- **Headline:** Every tool we named, one card each, with where we stand.
- **Visual:** a catalogue drawer of tabs, each with its status
- **Energy:** 1
- **Into next:** one card per tool follows.

### ti-claudecode

- **Act:** Appendix
- **Job:** the reference card for Claude Code
- **Headline:** Anthropic's coding agent in the terminal and IDE: stage 0 of our ladder, today.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped ADOPT
- **Energy:** 1
- **Into next:** the next card.

### ti-claudeapi

- **Act:** Appendix
- **Job:** the reference card for Claude API and Amazon Bedrock
- **Headline:** The model calls behind every agent we host: direct from Anthropic, or through AWS.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped DECIDE
- **Energy:** 1
- **Into next:** the next card.

### ti-agentsdk

- **Act:** Appendix
- **Job:** the reference card for Claude Agent SDK and Managed Agents
- **Headline:** Two ways to get a full agent loop without writing one, differing in who hosts it.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-mcp

- **Act:** Appendix
- **Job:** the reference card for Model Context Protocol
- **Headline:** The standard way an agent reaches a tool, and the thing we have to govern.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped ADOPT
- **Energy:** 1
- **Into next:** the next card.

### ti-argomcp

- **Act:** Appendix
- **Job:** the reference card for Argo CD MCP server
- **Headline:** Lets an agent read real application state instead of guessing.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-holmesgpt

- **Act:** Appendix
- **Job:** the reference card for HolmesGPT
- **Headline:** An open-source investigation agent built for alert-driven triage.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-k8sgpt

- **Act:** Appendix
- **Job:** the reference card for k8sgpt
- **Headline:** A rule-based Kubernetes scanner with model-written explanations.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped WATCH
- **Energy:** 1
- **Into next:** the next card.

### ti-kagent

- **Act:** Appendix
- **Job:** the reference card for kagent
- **Headline:** Agents as Kubernetes resources, not scripts on a laptop.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-substrate

- **Act:** Appendix
- **Job:** the reference card for Agent substrate
- **Headline:** A vocabulary more than a product: the layer under an agent.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped DECIDE
- **Energy:** 1
- **Into next:** the next card.

### ti-sandbox

- **Act:** Appendix
- **Job:** the reference card for Kata Containers, gVisor, vCluster
- **Headline:** Three ways to stop agent-written code sharing a kernel with everything else.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-spiffe

- **Act:** Appendix
- **Job:** the reference card for SPIFFE / SPIRE
- **Headline:** Short-lived, attested identity for every workload, including agents.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped ADOPT
- **Energy:** 1
- **Into next:** the next card.

### ti-cedar

- **Act:** Appendix
- **Job:** the reference card for Cedar and OpenFGA
- **Headline:** Answering 'what can this agent actually do?' with a query.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-obot

- **Act:** Appendix
- **Job:** the reference card for Obot
- **Headline:** An MCP catalog and gateway, with permissions from the directory.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped DECIDE
- **Energy:** 1
- **Into next:** the next card.

### ti-toolhive

- **Act:** Appendix
- **Job:** the reference card for ToolHive
- **Headline:** MCP servers as isolated, Kubernetes-native workloads.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped DECIDE
- **Energy:** 1
- **Into next:** the next card.

### ti-aigateway

- **Act:** Appendix
- **Job:** the reference card for AI gateway on Gateway API
- **Headline:** One place in front of Claude and our MCP tools.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-kyvernoai

- **Act:** Appendix
- **Job:** the reference card for Kyverno for AI traffic
- **Headline:** Our policy engine, extended to models and tools.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-otelgenai

- **Act:** Appendix
- **Job:** the reference card for OpenTelemetry GenAI conventions
- **Headline:** Standard span attributes for model and tool calls.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped ADOPT
- **Energy:** 1
- **Into next:** the next card.

### ti-costpertask

- **Act:** Appendix
- **Job:** the reference card for Cost per task
- **Headline:** Pricing AI the way Verkada did: per unit of work.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-cadence

- **Act:** Appendix
- **Job:** the reference card for Cadence
- **Headline:** Durable workflows for agents that act over many steps.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped WATCH
- **Energy:** 1
- **Into next:** the next card.

### ti-spine

- **Act:** Appendix
- **Job:** the reference card for Path 1's delivery spine
- **Headline:** Argo CD, GitOps Promoter, Argo Rollouts, Kyverno: carded in Path 1's index.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped ADOPT
- **Energy:** 1
- **Into next:** the next card.
