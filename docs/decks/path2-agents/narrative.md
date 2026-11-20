# Path 2: Claude off the laptop, into the pod

> The full-length version (16 slides, plus the 21-card tool index in `with-index`) is draft
> `main`, and its story is in `narrative-main.md`. This page is the story of draft `ten`,
> the default: the same argument in ten slides.

Started 2026-11-17 from "Getting AI onto Kubernetes Safely" (40 slides, Nov 12), the
delivery plan in `CLAUDE-AGENT-PLATFORM.md` (Nov 16) and GOALS §3, §4, §6 and §7. Cut to
ten on 2026-11-20 because the feedback on every readout deck was "too long". Scope is
running Claude (Claude Code, the API or Bedrock, MCP). We don't train or host a model.

## Brief

- **Audience:** engineering leadership, platform and security leads, and the engineers who
  already use Claude Code every day. Some teams are tempted to drop `claude -p` into a
  pipeline themselves. Security is wary of agents anywhere near production.
- **Setting:** both. About 13 minutes live, then sent round. The full argument is in the
  notes; the long draft (`main`) and its tool index are the appendix for readers.
- **They believe now:** AI at work means Claude Code on a laptop. Agents in our clusters are
  either a long way off or a security problem to block.
- **They believe after:** we can run Claude agents on our own infrastructure next year, as
  long as we don't build an agent platform. Claude runs headless in throwaway Jenkins pods,
  behind one gateway, configured from one shared marketplace, and it climbs a ladder where
  only the first two rungs get dates.
- **The one sentence:** don't build an agent platform; run Claude headless in throwaway pods
  through the CI we already trust, and put dates on only the next two rungs: alert triage
  by Q2 2027, agents opening PRs by the end of 2027.
- **The ask:** commit to the two dates; start phase 0 this month; choose the model path (we
  recommend Bedrock + IRSA); name owners for the knowledge base and the evaluation harness.

## Shape

- **Structure:** problem → turn → proof → ask. The problem is a default we're already
  drifting into (every team wires its own agent with its own key). The turn is that we
  don't need a platform, only four pieces. The proof is how contained, governed and
  visible those pieces make an agent. The ask is the ladder's two dates.
- **Acts:** I — *the default we're drifting into* (slides 1–2) / II — *the turn: four
  pieces, and Jenkins does the rest* (3–6) / III — *the climb: two dates, what "done"
  means, where to start, the ask* (7–10).
- **The peak:** `two-dates`, slide 7 of 10 (70%). The profile draws itself up to camp 2,
  then the dashed, undated route appears, with the companies already standing on it.
- **The close:** the deck opens on Verkada's $0.33 alert. Stage 1 is that exact job, and
  the ask is to put our date on it.
- **Pacing:** 3 · 4 · 4 · 3 · 4 · 3 · **5** · 3 · 3 · 4. Quiet before the peak (the trace),
  a breather after it (the triage card), and a rise into the ask.

### What the ten-slide cut did

| Ten | From the long draft | How |
|---|---|---|
| `cold-open-ten` | `cold-open` | forked: larger field, the one alert pointed out |
| `the-default-ten` | `the-default` | forked: same repetition, larger type, dusk ground |
| `four-pieces` | `the-turn` + `architecture` + `scope` | merged: the system drawing, grey until the four pieces light |
| `contained` | `blast-radius` + `four-questions` | merged: the laptop's reach against the pod's, with the four keynote questions answered |
| `authority-ten` | `authority` | forked: fewer labels, larger type |
| `itemize-ten` | `itemize` | forked: the run's total set against Verkada's $0.33 |
| `two-dates` | `ladder` + `show-agreed` | merged: the companies from the show stand on the rungs they've reached |
| `stage-one-ten` | `stage-one` | forked: HolmesGPT and its ⚠️ moved to the notes |
| `start-on-laptops` | `phase-zero` + `one-marketplace` | merged: what we set on laptops is what the pod inherits |
| `the-ask-ten` | `the-ask` + `what-they-budgeted` | forked: four decisions; the budget lesson argues for the owners in the notes |

Cut outright: `scope` (one line in `four-pieces`' notes and in the ask's notes), the
tool-index cards (still in `with-index`).

## Editorial notes

- No failure-case references. The budget lesson (knowledge base + evaluation harness)
  lives in `the-ask-ten`'s notes, not as a story about someone's low accuracy.
- ⚠️ Claude Code flag names, Anthropic and Bedrock pricing, and HolmesGPT's Claude support
  get checked before anything is quoted. On screen in `ten`: only the flag-name caveat on
  `four-pieces`. HolmesGPT is mentioned in `stage-one-ten`'s notes with its caveat spoken.
- The trace on `itemize-ten` and the triage card on `stage-one-ten` are illustrative and
  say so on the slide.
- Our team is "a small team". The Ingress NGINX → Istio move is already planned and isn't
  pitched here.

## Visual direction

Series brand: Three Peaks (`docs/decks/_shared/`, see the readout's narrative for the full
palette and type). This path's colour is **teal** (`#36baa2` on night, `#0f6b5b` on
snowfield). Alpenglow (`#f4a261`) is kept for dates, decisions and the keys we don't want.

- **Subject world:** the throwaway pod and the expedition. An agent run is a short trip:
  issued a pass, sent through two gates, logged, and torn down. The ladder is an expedition
  elevation profile: surveyed and dated where we can see the route, dashed where we can't.
- **Grounds, as rhythm:** night · dusk · snow · night · dusk · snow · **night (peak)** ·
  snow · dusk · night. Snowfield is for the system drawings and artefacts (the
  architecture, the trace, the triage card); night and dusk for the argument.
- **Signature element:** the **enclosure**, a pod drawn as a dashed teal boundary whose
  only openings are labelled exits. It appears on `four-pieces` (the namespace),
  `contained` (glowing on night, against the laptop's reach) and `start-on-laptops` (the
  pod that inherits). Its counterpart is the **owned piece**: solid teal means something
  we build, grey means configuration of something we already run.
- **Concepts as pictures:** a count is drawn as that many dots (4,700 alerts); repetition
  as twelve copies of the same snippet; the build as a grey system with four teal pieces;
  reach as a circle against an enclosure; authority as a progressive-delivery rail with the
  payload swapped; a run as a trace; the plan as an elevation profile; "done" as a filled-in
  card; inheritance as rows carried across from a laptop into a pod.
- **Type:** Barlow Condensed for headlines and labels, Barlow for body, JetBrains Mono
  only where the thing on screen is code. Headlines 80–120px; body 30–36px; nothing under
  24px except source lines.
- **Motion moment:** on `two-dates`, the profile draws itself up to camp 2, then the
  dashed, undated route appears with the companies standing on it. Elsewhere one build at
  most: the four pieces light on `four-pieces`.

  ```
  opening (cold-open-ten)          peak (two-dates)                 densest (four-pieces)
  ┌──────────────────────────┐    ┌──────────────────────────┐     ┌──────────────────────────┐
  │ Verkada triages 4,700    │    │ Six rungs, and only the  │     │ Don't build a platform…  │
  │ alerts a month for 33¢.  │    │ next two get dates.   ○5 │     │ triggers→[Jenkins ■]→┆■┆→■→Claude │
  │         ::::::::::::::::  │    │      Salesforce ○4 ┄┄┄   │     │                      ┆ ┆   →tools  │
  │         :::::::●$0.33::  │    │ Podium ●2 ┄○3            │     │              [■ marketplace]      │
  │         ::::::::::::::::  │    │ ●0 ━━●1 Verkada          │     │ ■ teal = the whole build          │
  └──────────────────────────┘    └──────────────────────────┘     └──────────────────────────┘
  ```
- **Anti-default check:** the old deck's controls were six near-identical card grids
  ("Control 01…06" eyebrows). Changed: no eyebrows; each idea gets its own picture. In the
  ten-slide cut, the four keynote questions stopped being their own diagram and became the
  labels on the enclosure; the four operating numbers stopped being a row of big numbers
  and became flags on the profile.
- **Audit exceptions, accepted (`dense`, nothing else):** `the-default-ten` (135 words, but
  they're the repeated snippets: the repetition is the picture), `four-pieces` (100, a
  system drawing needs its labels), `the-ask-ten` (90, four decisions with our lean),
  `stage-one-ten` and `start-on-laptops` (about 80, an artefact and a two-column carry),
  `authority-ten` and `itemize-ten` (mid-70s). No `offstage`, `overlap`, `clipped` or
  `small-text` findings.

## Beats

### cold-open-ten

- **Act:** I
- **Job:** open on an operations number, not a demo
- **Headline:** Verkada triages 4,700 alerts a month for 33 cents each.
- **Visual:** 4,700 dots, one per alert in a month; one lit and stamped with a $0.33 ticket
- **Energy:** 3
- **Into next:** that's the work we want Claude doing. Here's what happens if we just let it.
- **Source:** "Triaging 4,700 Alerts/Month at $0.33 Each: Verkada's MCP Agent on Nine Production Clusters" (Verkada); $1,550 is our arithmetic

### the-default-ten

- **Act:** I
- **Job:** the stakes: name the outcome we're drifting into
- **Headline:** Left alone, every team wires its own `claude -p` into its own pipeline, with its own key.
- **Visual:** repetition. Twelve near-identical pipeline snippets, each with its own key line (alpenglow) and its own allow-list, copied until it hurts
- **Energy:** 4
- **Into next:** we could answer that with a new agent platform. We think that's the mistake.

### four-pieces

- **Act:** II
- **Job:** the turn: we don't need an agent platform, and here is the whole build
- **Headline:** Don't build an agent platform: build four pieces and let Jenkins run the rest.
- **Visual:** the runtime as a system drawing, all grey (triggers, Jenkins, the `claude-agents` namespace, OTel). On the click, four pieces light teal: the `claudeAgent()` library step, the agent image, the AI and MCP gateways, the marketplace repo
- **Energy:** 4
- **Into next:** security's first question is how far that pod can reach.
- **Source:** `CLAUDE-AGENT-PLATFORM.md` §2; ⚠️ Claude Code flag names unchecked

### contained

- **Act:** II
- **Job:** answer the security question in one picture
- **Headline:** An agent pod gets one namespace, egress to two gateways, and no cluster write credentials.
- **Visual:** containment drawn to scale on night: the laptop's reach today as a large pale circle holding everything an engineer's credentials touch; the pod as a small glowing enclosure inside it with three labelled exits. Around it, the four keynote questions (identity, egress, sandbox, session) each answered in a line
- **Energy:** 3
- **Into next:** that's what it can reach. The next question is how it earns more.
- **Source:** `CLAUDE-AGENT-PLATFORM.md` §5; "Agent Substrate", "Sandbox Your Agents", "The Identity Crisis" keynotes (no decks posted)

### authority-ten

- **Act:** II
- **Job:** the most copyable idea we brought home
- **Headline:** An agent earns the right to act the way a release earns traffic.
- **Visual:** two rails, same five stations. A release in Argo Rollouts (grey): canary, analysis, success, promotion, abort. An agent (teal): shadow mode, grade the work, eligibility policy, a permission PR, revoke the grant. The Transfix line underneath
- **Energy:** 4
- **Into next:** and none of that works unless we can see what it did.
- **Source:** "Progressive Delivery for Trust: How Agents Earn the Right to Merge" (Transfix); `deck-assets/03-agents-earn-merge`

### itemize-ten

- **Act:** II
- **Job:** make every agent action countable and costed
- **Headline:** Every model call and tool call is a span with a team, a use case and a cost.
- **Visual:** one alert-triage run as a trace: trigger, the Jenkins job, model calls (teal) and tool calls (grey-blue), each model call priced. The run's total, $0.21, large on the right and labelled illustrative, with "cost per task" named as the unit Verkada reports ($0.33 an alert)
- **Energy:** 3
- **Into next:** with that in place, we can climb.
- **Source:** GOALS §4; OTel GenAI semantic conventions; the trace and its costs are illustrative

### two-dates

- **Act:** III
- **Job:** the peak: the ladder, its two dates, and proof the route is real
- **Headline:** Six rungs, and only the next two get dates.
- **Visual:** an expedition profile. Camps 0–2 on a solid teal slope with dates in alpenglow (today; Q2 2027; end of 2027). Camps 3–5 on a dashed slope with no dates. Small flags mark who from the show already stands where: Verkada at camp 1, Podium at camp 2, Salesforce and Mastercard at camp 4
- **Energy:** 5
- **Into next:** camp 1 is close. Here's what reaching it means.
- **Source:** GOALS §6 (the ladder and its evidence column); session titles and abstracts

### stage-one-ten

- **Act:** III
- **Job:** define "done" for stage 1, so it isn't a chatbot
- **Headline:** Triage counts only if a responder acts on it; the accept-or-reject log is the product.
- **Visual:** one triage card filled in for real: the alert, a relevance call, a severity with its basis, links out, a suggested action, and the responder's verdict stamped and logged. Beside it, the log as a ledger that runs up to the camp 2 gate
- **Energy:** 3
- **Into next:** none of this needs a cluster to start. It starts on laptops, this month.
- **Source:** GOALS §6, "What stage 1 has to produce"; the card is illustrative

### start-on-laptops

- **Act:** III
- **Job:** make the first step concrete, safe, and obviously on the path to the pods
- **Headline:** Phase 0 starts this month on laptops, and every pod inherits it.
- **Visual:** a laptop and a pod side by side. Rows carried across: telemetry on, no personal keys, the marketplace's plugins, the repo's CLAUDE.md. The personal `~/.claude` row stays behind on the laptop. The exit gate underneath
- **Energy:** 3
- **Into next:** so here's what we need decided.
- **Source:** `CLAUDE-AGENT-PLATFORM.md` §3 phase 0 and §4

### the-ask-ten

- **Act:** III
- **Job:** the ask, echoing the opening alert
- **Headline:** Commit to the two dates, start phase 0, choose Bedrock, and name two owners.
- **Visual:** the $0.33 ticket from the opening, now stamped with our date: stage 1 by Q2 2027. Beside it four decisions, each with our lean
- **Energy:** 4
- **Into next:** end
