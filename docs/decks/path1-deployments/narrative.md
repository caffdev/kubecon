# Path 1: Deployments as a service

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Started 2026-11-17. Reworked from the "Deployments as a Service — Path 1" artifact (18
slides, Nov 16), plus the delivery half of "Running Our Clusters Better" (Argo, promotion,
canary, policy) and GOALS §1–§2. Path 1 of 3: agents are Path 2, the EKS fleet is Path 3.
Ingress and secrets are on no path.

## Brief

- **Audience:** platform engineering, the leads of service-owning teams, and engineering
  leadership. They run Argo CD on manual sync and are comfortable with it. They suspect
  auto-sync means losing control, and that canary means a service-mesh project.
- **Setting:** both. 25 minutes live, then sent round.
- **They believe now:** the manual sync button *is* our change control. Auto-sync is a risk
  we take on for speed. Canary needs a mesh.
- **They believe after:** manual sync is the *only* change control teams have, which is why
  they hold on to it. Ship better controls first (policy in CI, enforced freezes, automatic
  rollback) and turn off the click last.
- **The one sentence:** teams will give up the sync button the day it stops being their
  only change control, so we ship the controls first and turn the click off last.
- **The ask:** confirm five leans (prod auto-sync only after gating; GitOps Promoter primary
  with a two-week spike; change records projected as a CRD; canary as a POC per workload
  class; drift handling split by resource class), and protect stage B's headcount.

## Shape

- **Structure:** before → after → bridge. Life now (a dashboard somebody clicks), life with
  it (the mechanisms our peers run), and how we get there (the trade, then five stages).
  It's a proposal to adopt, and the audience needs to see the "after" working before
  they'll trade anything for it.
- **Acts:** I — *before*: the bar our peers set and where we stand / II — *after*: the
  mechanisms that made their deploy path invisible / III — *the bridge*: the trade, five
  stages, the ask.
- **The peak:** `the-trade`, slide 11 of 18 (61%). Everything before it earns the right to
  make the offer; everything after it is the offer made concrete.
- **The close:** the deck opens on "day one" and stage E closes it: a developer who never
  learned a cluster name, never clicked sync, never read the policy list and never rolled
  back by hand. Then the ask.

## Editorial notes

- GOALS' rule for the readout decks: **no failure-case references.** The old deck's
  39-cluster slide becomes `guardrails-first`, which keeps the lesson (guardrails ship in
  the same change as auto-sync) and drops the incident.
- ⚠️ items stay flagged: Argo Rollouts Gateway API plugin maturity, Kyverno generating
  ValidatingAdmissionPolicy, ClusterProfile status, the Kargo adoption figure.

## Visual direction

Series brand: Three Peaks (`docs/decks/_shared/`, see the readout's narrative for the full
palette and type). This path's colour is **mint** (`#9cf0e1` on night, `#0b6e5f` on
snowfield). What this deck adds:

- **Subject world:** the delivery path itself. A change is a climber on a fixed line: it
  passes gates (CI, admission, analysis), clips into belays (policy), and reaches camps A–E.
  The one artifact everyone in the room knows is Argo CD's SYNC button, so it becomes an
  object in the deck: present on `stage-zero`, given up on `the-trade`.
- **Grounds:** night for the story, snowfield for the evidence-dense stage and mechanism
  slides, and **mint for exactly one slide, the trade**. The colour change is the peak.
- **Layout:** headline top-left, the mechanism drawn left to right as a route a change
  travels. Stage slides carry a **route strip** on the right edge (camps A–E, the slide's
  own stage lit). That isn't decoration: it tells the room where on the climb we are.

  ```
  opening (day-one)              peak (the-trade, mint ground)     densest (stage-b, snowfield)
  ┌──────────────────────────┐  ┌──────────────────────────┐      ┌──────────────────────────┐
  │ "…someone joining the    │  │ Teams resist… (small)    │      │ Stage B is the trade…  E │
  │  company could ship a    │  │ STOP CLICKING SYNC.      │      │    ┌ one policy set ┐   D │
  │  new application on      │  │ ⓑ nothing ships in a…    │      │ commit→[CI]→[CEL][Kyv]→  C │
  │  their very first day."  │  │ ⓑ policy fails in CI…    │      │  what runs where       ●B │
  │  CVS Health keynote      │  │ ⓓ a bad version rolls…   │      │ against the action…    A │
  └──────────────────────────┘  └──────────────────────────┘      └──────────────────────────┘
  ```
- **Concepts as pictures:** a change is a token moving left to right; a gate is a vertical
  bar it must pass; one source feeding many gates is drawn as a bar with drop lines; each
  gain or item is tagged with the camp (stage) that delivers it.
- **Motion moment:** on `the-trade`, the three gains arrive one per click, each tagged with
  the camp that delivers it, while the SYNC button fades.
- **Anti-default check:** stage slides were six-item lists (title and bullets) in the old
  deck. Changed: each stage shows its route strip, its items as a sequence with real order,
  and its exit gate as the one accented block. The four policy layers were a 2×2 card grid;
  now a single route through four gates.

## Beats

### day-one

- **Act:** I
- **Job:** open on the bar, in the speaker's own words
- **Headline:** "…someone joining the company could ship a new application on their very first day."
- **Visual:** the quote set huge, flush left, with its attribution small beneath. Nothing else on the slide
- **Energy:** 3
- **Into next:** our first reaction was probably the same as yours.
- **Source:** CVS Health keynote abstract, Michael Amundson and Jim Beyers, Nov 11

### abstraction-depth

- **Act:** I
- **Job:** defuse the "new hires in prod" objection and reframe what day one measures
- **Headline:** Day one measures how much of our platform a developer has to understand before they can ship.
- **Visual:** the joke as one small line at the top ("Day one they can't find the bathroom."). Below it, the five things a developer has to know today, stacked like a pack, each tagged with the stage that takes it off
- **Energy:** 3
- **Into next:** our peers have already taken those off the pack.

### peers

- **Act:** I
- **Job:** prove it has been done, at our scale and above
- **Headline:** Our peers already made the deploy path invisible.
- **Visual:** three measures, each drawn as before → after: CVS day one; LinkedIn about a week → about an hour per release; Meta about 100 clusters run by about 15 engineers
- **Energy:** 3
- **Into next:** and here is where we are.

### stage-zero

- **Act:** I
- **Job:** name the gap without defensiveness, so the room agrees on the starting point
- **Headline:** Today Argo CD is a dashboard somebody clicks.
- **Visual:** one large SYNC button, alone. Around it, five quiet labels for what that button stands in for: promotion, policy, rollback, drift, config reload
- **Energy:** 2
- **Into next:** before we ask to turn it off, one rule.

### guardrails-first

- **Act:** I
- **Job:** set the condition that makes auto-sync safe, as a practice we adopt
- **Headline:** Auto-sync ships with its guardrails in the same change, never as a follow-up ticket.
- **Visual:** a single pull request containing four items: prune protection on stateful and cluster-critical resources, PruneLast, a sync window on prod, a reclaimPolicy audit
- **Energy:** 3
- **Into next:** now, what our peers run that we don't.

### canary-gate

- **Act:** II
- **Job:** the one mechanism to remember: the gate reverts a version without being asked
- **Headline:** A canary without automated analysis is just a slower outage.
- **Visual:** a track: Rollout → setWeight → AnalysisRun → fail → revert. Only the revert is in the accent. A quiet caveat: traffic-weighted canary needs a router, and the networking thread chooses it
- **Energy:** 4
- **Into next:** and percentage ramps don't fit everything we run.

### ramps

- **Act:** II
- **Job:** explain why our canary answer is per workload class
- **Headline:** Percentage ramps assume requests are interchangeable, divisible and single-component.
- **Visual:** four broken assumptions, each a small picture: critical jobs on an unvalidated version, job types that miss the ramp, a schema migration that can't be split, a request that hits one new and one old component
- **Energy:** 3
- **Into next:** LinkedIn's answer for those needs no mesh at all.
- **Source:** LinkedIn, canary namespaces for cluster-critical services

### one-label

- **Act:** II
- **Job:** show the canary pattern for platform services, which is most of what we own
- **Headline:** For services with no traffic to split, one namespace label is the switch.
- **Visual:** five moves in sequence (isolate, route by namespaceSelector, validate on 20+ real workflows, gate on a PostSync hook, promote cluster by cluster). Beside it: a loud failure caught in about 30 minutes versus a silent one that lasted about two days
- **Energy:** 4
- **Into next:** that pattern selects on labels. So should everything else.
- **Source:** LinkedIn deck (`02-canary-namespaces-linkedin`)

### no-cluster-names

- **Act:** II
- **Job:** name the vocabulary the fleet stages depend on
- **Headline:** A cluster name in an app repo is a bug.
- **Visual:** the YAML a developer writes (regions, compliance, capability, residency) beside the ApplicationSet cluster generator that resolves it by label selector
- **Energy:** 3
- **Into next:** last mechanism: how a version moves between environments.
- **Source:** GOALS §5.5; the label vocabulary is Path 3 stage 1 and stage D's entry gate here

### promotion-pr

- **Act:** II
- **Job:** state the promotion call, and what would flip it
- **Headline:** Promotion becomes a pull request: GitOps Promoter first, Kargo as the fallback.
- **Visual:** two models side by side: Kargo's Warehouses → Freight → Stages with its own control plane, against Promoter's branch, commit and PR per environment with no state outside Git. What would flip it, written underneath
- **Energy:** 3
- **Into next:** so why haven't teams asked for any of this?
- **Source:** GOALS §1.2; ⚠️ the Kargo adoption figure came from a vendor post

### the-trade

- **Act:** III
- **Job:** the turn: make the offer the deck exists to make
- **Headline:** Stop clicking sync, and in exchange nothing ships in a freeze, policy fails in CI, and a bad version rolls itself back.
- **Visual:** the setup line small ("Teams resist auto-sync because manual sync is the only change control they have"), then the trade set large across the slide, with its three gains building one per click
- **Energy:** 5
- **Into next:** here is the trade made concrete, in five stages.

### stage-a

- **Act:** III
- **Job:** the first stage, its six items and its exit gate
- **Headline:** Stage A, by January: Argo becomes a control loop in non-prod.
- **Visual:** the mint face with camp A lit; six items; the exit gate; the first two weeks (one app, and a written list of everything that drifted)
- **Energy:** 3
- **Into next:** one of those six items deserves its own slide.

### reloader

- **Act:** III
- **Job:** close the config trap before it embarrasses us
- **Headline:** Reloader makes "Git is the state of the world" true for config too.
- **Visual:** three places a value can live, and what actually makes a pod see a change in each; the middle row (Config Server's own config) marked as the trap
- **Energy:** 2
- **Into next:** stage B is the one that buys the trade.
- **Source:** ours, untested; no conference evidence

### stage-b

- **Act:** III
- **Job:** the stage that pays for everything else, and the least visible work
- **Headline:** Stage B is the trade: one policy set, run in CI and at admission.
- **Visual:** four layers: CI (kyverno apply, 90-second failures), admission hot path (CEL ValidatingAdmissionPolicy), admission remainder (Kyverno), supply chain (cosign, verifyImages in audit). The rule underneath: write policy against the action, not the actor
- **Energy:** 4
- **Into next:** and the freeze becomes something the cluster enforces.
- **Source:** ⚠️ Kyverno generating VAP is a capability we haven't run

### freeze-windows

- **Act:** III
- **Job:** show how change windows get enforced with no human and no hot-path dependency
- **Headline:** A freeze stops being someone refusing to click.
- **Visual:** change record approved → projected as a CRD → policy reads the CRD. Argo's own sync windows cover the calendar. Prod auto-sync is the last item in the stage
- **Energy:** 3
- **Into next:** after B, promotion and the fleet.

### stages-c-d

- **Act:** III
- **Job:** separate what we commit to from what we only evaluate
- **Headline:** Stages C and D: promotion is a PR, and the fleet rolls in waves with a gate that has failed at least once.
- **Visual:** two camps, C (commitment) and D (one commitment, one POC). A kill switch is not a rollback
- **Energy:** 3
- **Into next:** and then the summit.

### stage-e

- **Act:** III
- **Job:** echo the opening: this is what "day one" meant
- **Headline:** Stage E: a team onboards an app with no platform ticket.
- **Visual:** the summit, with the pack from slide 2 now empty: never learned a cluster name, never clicked sync, never read the policy list, never rolled back by hand
- **Energy:** 3
- **Into next:** here's what we need from this room.

### the-ask

- **Act:** III
- **Job:** confirm the leans and protect the one invisible stage
- **Headline:** Confirm five leans and protect stage B's headcount.
- **Visual:** five decisions with our lean beside each, and a separate card: stage B gates stage C *and* Path 2 phase 2, so if one thing gets protected headcount, it's this
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

### ti-argocd

- **Act:** Appendix
- **Job:** the reference card for Argo CD
- **Headline:** The GitOps controller we already run. The work is making it converge, not choosing it.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped ADOPT
- **Energy:** 1
- **Into next:** the next card.

### ti-appsets

- **Act:** Appendix
- **Job:** the reference card for ApplicationSets + progressive sync
- **Headline:** One definition fanned out to every cluster, in waves rather than all at once.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-hydrator

- **Act:** Appendix
- **Job:** the reference card for Argo CD source hydrator
- **Headline:** Commit the rendered YAML back to Git, so what's in Git is what runs.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-rollouts

- **Act:** Appendix
- **Job:** the reference card for Argo Rollouts
- **Headline:** Traffic-weighted canaries and blue-green, with automated analysis and rollback.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-promoter

- **Act:** Appendix
- **Job:** the reference card for GitOps Promoter
- **Headline:** Our lean for promotion: every environment change is a pull request.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped DECIDE
- **Energy:** 1
- **Into next:** the next card.

### ti-kargo

- **Act:** Appendix
- **Job:** the reference card for Kargo
- **Headline:** The serious alternative: a promotion control plane with its own UI.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped DECIDE
- **Energy:** 1
- **Into next:** the next card.

### ti-reloader

- **Act:** Appendix
- **Job:** the reference card for Stakater Reloader
- **Headline:** Restart what consumes a ConfigMap or Secret when it changes.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped ADOPT
- **Energy:** 1
- **Into next:** the next card.

### ti-kyverno

- **Act:** Appendix
- **Job:** the reference card for Kyverno
- **Headline:** Policy as Kubernetes YAML, for what in-tree CEL can't express.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped ADOPT
- **Energy:** 1
- **Into next:** the next card.

### ti-cel

- **Act:** Appendix
- **Job:** the reference card for Validating / MutatingAdmissionPolicy
- **Headline:** Admission policy built into the API server, written in CEL.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped ADOPT
- **Energy:** 1
- **Into next:** the next card.

### ti-falco

- **Act:** Appendix
- **Job:** the reference card for Falco
- **Headline:** Runtime detection: what happened after admission said yes.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped TRIAL
- **Energy:** 1
- **Into next:** the next card.

### ti-gatewayapi

- **Act:** Appendix
- **Job:** the reference card for Gateway API
- **Headline:** The successor to Ingress, and the router a traffic-weighted canary needs.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped ADOPT
- **Energy:** 1
- **Into next:** the next card.

### ti-istio

- **Act:** Appendix
- **Job:** the reference card for Istio
- **Headline:** The mesh direction we're already committed to.
- **Visual:** a catalogue card: what it is, what sets it apart, where we stand, stamped ADOPT
- **Energy:** 1
- **Into next:** the next card.
