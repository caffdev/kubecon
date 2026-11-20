# Path 1: Deployments as a service

> This is the story of the **`ten` draft**, the default: ten slides, about 13 minutes.
> The full-length version is draft **`main`** (18 slides, 25 minutes), and its story is in
> `narrative-main.md`. The `with-index` draft is `main` plus the generated tool cards.

> The story comes first. No slide gets designed until this page reads like a talk someone
> would want to sit through. The slides are the visual track of this script.

Reworked 2026-11-20 from the 18-slide `main` draft, because the readout decks were running
long. Same argument, same ask, same Three Peaks look; one slide per beat that carries it.
Path 1 of 3: agents are Path 2, the EKS fleet is Path 3. Ingress and secrets are on no path.

## Brief

- **Audience:** platform engineering, the leads of service-owning teams, and engineering
  leadership. They run Argo CD on manual sync and are comfortable with it. They suspect
  auto-sync means losing control, and that canary means a service-mesh project.
- **Setting:** both. About 13 minutes live, then sent round. The notes carry what the
  slides leave out.
- **They believe now:** the manual sync button *is* our change control. Auto-sync is a risk
  we take on for speed.
- **They believe after:** manual sync is the *only* change control teams have, which is why
  they hold on to it. Ship better controls first (automatic rollback, policy in CI, an
  enforced freeze) and turn off the click last.
- **The one sentence:** teams will give up the sync button the day it stops being their
  only change control, so we ship the controls first and turn the click off last.
- **The ask:** confirm five leans (prod auto-sync only after gating; GitOps Promoter first
  with a two-week spike; change records projected as a CRD; canary as a POC per workload
  class; drift handling split by resource class), and protect stage B's headcount.

## Shape

- **Structure:** before → after → bridge, the same spine as `main`, with every slide that
  only set up or repeated another one taken out. Life now (the bar, our peers, a button
  somebody clicks), life with it (the three controls that replace the click), and how we
  get there (the trade, one climb in five stages, the ask).
- **Acts:** I — *before*: slides 1–3 / II — *after*: slides 4–6, one per control / III —
  *the bridge*: slides 7–10.
- **The peak:** `the-trade-ten`, slide 7 of 10 (70%). The three slides before it show the
  controls one by one, so the trade lands as a summary of things the room has already seen
  rather than a promise.
- **The close:** the opening shows CVS Health's sentence beside an unclimbed peak. Slide 9
  returns to that composition with the route drawn to the summit and our own sentence in
  the quote's place. Then the ask.
- **What was cut, and where it went:**
  - *Set-up slides* (`abstraction-depth`, `stage-zero`) merged into `the-button`; the
    "can't find the bathroom" joke and the "day one measures abstraction" reframe moved to
    the opening's notes.
  - *Second and third canary slides* (`one-label`, `ramps`): LinkedIn's quiet-failure
    numbers are the proof on `rollback-gate`; the five moves and the broken ramp
    assumptions are in its notes. Canary is a POC in stage D, so it doesn't earn three
    slides.
  - *Stage-by-stage slides* (`stage-a`, `stage-b`, `freeze-windows`, `stages-c-d`) became
    one mechanism slide (`one-policy-set`) and one plan slide (`the-route`).
  - *Rules and items that repeat a stage* (`guardrails-first`, `reloader`,
    `no-cluster-names`) are camp A and camp D's lines on `the-route`, with the detail in
    its notes.
  - *Stage E's extras* (cost labels, right-sizing, OpenCost) are out: they don't carry the
    argument for this room.
  - *The tool index* stays in the `with-index` draft only.

## Editorial notes

- GOALS' rule for the readout decks: **no failure-case references.** Guardrails are a
  practice we adopt, never a scare story.
- ⚠️ items stay flagged where they appear: Kyverno generating ValidatingAdmissionPolicy (on
  `one-policy-set`, flagged on the slide), the Argo Rollouts Gateway API plugin (notes of
  `rollback-gate`), the Kargo adoption figure (not quoted anywhere).
- The Ingress NGINX → Istio move is already planned elsewhere; this deck doesn't pitch it.
  The traffic router a weighted canary needs is "the networking thread's call".
- If our own team comes up, it is "a small team", never a number of people.

## Visual direction

Series brand: Three Peaks (`docs/decks/_shared/`, see the readout's narrative for the full
palette and type). This path's colour is **mint** (`#9cf0e1` on night, `#0b6e5f` on
snowfield). The `ten` draft keeps `main`'s identity and raises it in three ways.

- **Subject world:** the delivery path as a climb. A change is a climber on a fixed line:
  it passes gates (CI, admission, analysis) and reaches camps A–E. The one artifact
  everyone in the room knows is Argo CD's SYNC button, so it's an object in the deck.
- **Signature element, now carried end to end:** the SYNC button. Pressed under a cursor on
  `the-button`, dimming one step per gain on `the-trade-ten`, and a struck marker on
  `the-route` at the exact point prod auto-sync goes on. Its second half is **the peak**:
  unclimbed on the opening, climbed camp by camp on `the-route`, summited on slide 9.
- **Grounds as rhythm:** night for the story, snowfield for the three evidence-dense
  slides (`peers-ten`, `one-policy-set`, `the-route`), **mint for exactly one slide, the trade**,
  and **dusk** (the brand's statement ground) for the problem and its answer:
  `the-button` and `day-one-meant`.

  ```
  1 night · 2 snow · 3 dusk · 4 night · 5 snow · 6 night · 7 MINT · 8 snow · 9 dusk · 10 night
  ```
- **Layout:** headline top-left at 76px or larger, the mechanism drawn left to right as a
  route a change travels. The two bookends (1, 9) share one composition: a huge flush-left
  sentence and the peak low on the right.

  ```
  opening (day-one-ten)          peak (the-trade-ten, mint)        densest (the-route, snow)
  ┌──────────────────────────┐  ┌──────────────────────────┐      ┌──────────────────────────┐
  │ "                        │  │ Teams resist… (small)    │      │ Five stages, and prod…   │
  │ …someone joining the     │  │ STOP CLICKING SYNC.      │      │ E 2028 ……………………………… ●    │
  │  company could ship a    │  │ ⓑ nothing ships in a…    │      │ D H2 ………………………… ●   /\   │
  │  new application…   /\   │  │ ⓑ policy fails in CI…    │ SYNC │ C Q2 ……………………● ✕  /  \  │
  │  CVS Health        /  \  │  │ ⓓ a bad version rolls…   │ ╳    │ B Q1 ……………… ●   /    \ │
  └──────────────────────────┘  └──────────────────────────┘      └──────────────────────────┘
  ```
- **Concepts as pictures:** quantities in real units (a week as 168 hour-squares, one lit;
  100 cluster glyphs beside 15 people); a gate is a vertical bar a change must pass; one
  source feeding many gates is a bar with drop lines; a revert is an arc back to the start;
  stages are camps at their height on one peak; each control is tagged with the camp that
  delivers it, so the letters on slides 3, 7 and 8 agree.
- **Motion moment:** on `the-trade-ten`, the three gains arrive one per click, each tagged
  with its camp, while the SYNC button dims a step at a time and is struck through on the
  third. Finished state (thumbnails, PDF): all three gains, button struck.
- **Anti-default check:** the long draft had five stage slides that were item lists with a
  route strip; changed to one peak with five camps, each with a date and an exit gate. The
  "what the button stands in for" slide and the "what a developer carries" slide were two
  lists of five; changed to one button with five wires, each ending in the camp that
  replaces it. The peers slide was three label-and-bar rows; changed to two pictures in
  real units.
- **Audit exceptions, accepted:** `the-route` and `one-policy-set` run a little over 70
  words. The setting is "both", the dates and exit gates are the plan a reader needs, and
  each still has one focal point.

## Beats

### day-one-ten

- **Act:** I
- **Job:** open on the bar in CVS Health's own words, and reframe "day one" as a measure of how much platform a developer must learn
- **Headline:** "…someone joining the company could ship a new application on their very first day."
- **Visual:** the quote set huge, flush left, attribution small beneath; low on the right, one mint-capped peak with no route on it yet
- **Energy:** 3
- **Into next:** our peers have already done it.
- **Source:** CVS Health keynote, Michael Amundson and Jim Beyers, Nov 11

### peers-ten

- **Act:** I
- **Job:** prove the bar is reachable, at our scale and above
- **Headline:** Our peers already made the deploy path invisible.
- **Visual:** two pictures in real units. LinkedIn: a week drawn as 168 hour-squares (7 rows of 24), all grey, one lit: about a week per release became about an hour, and 10+ incidents were caught before prod. Meta: 100 cluster glyphs beside 15 engineer dots
- **Energy:** 3
- **Into next:** and here is where we are.
- **Source:** LinkedIn, "Ship Faster, Ship Safer" (deck p25); Meta, "We Have GitOps at Home" keynote abstract

### the-button

- **Act:** I
- **Job:** name the gap without defensiveness: one click is standing in for five controls we don't have
- **Headline:** Today the SYNC button is the only change control we have.
- **Visual:** dusk ground. One large SYNC button with a cursor on it; five wires fan out to what it stands in for (promotion, policy, the freeze, rollback, drift and config), each with today's stand-in and the camp letter that replaces it
- **Energy:** 2
- **Into next:** here's what replaces it, starting with the control that matters most.
- **Merged from:** `stage-zero` (the button) and `abstraction-depth` (each item tagged with the stage that takes it off)

### rollback-gate

- **Act:** II
- **Job:** the one mechanism to remember: a gate, not a person, sends a bad version back
- **Headline:** A canary without automated analysis is just a slower outage.
- **Visual:** a track: Rollout → a share of traffic → AnalysisRun, which fails, and a mint arc carries the version back to the start. Beneath, LinkedIn's two failures drawn to scale: loud, about 30 minutes; silent, about 2 days
- **Energy:** 4
- **Into next:** that's rollback. The other two controls turn out to be one policy set.
- **Merged from:** `canary-gate` (the track), `one-label` (the evidence; the five moves go to the notes), `ramps` (the notes)
- **Source:** LinkedIn deck (`02-canary-namespaces-linkedin`, p08 and p15); ⚠️ the Rollouts Gateway API plugin is in the notes only, flagged

### one-policy-set

- **Act:** II
- **Job:** show that policy and the freeze are one machine, enforced with no human and no call out of the hot path
- **Headline:** One policy set stops a bad change in CI and a frozen one at admission.
- **Visual:** snowfield. A change's path from commit to running crosses two gates; one policy bar above drops into both; under the admission gate an approved change record, projected as a CRD, feeds in. The rule at the foot: write policy against the action, not the actor
- **Energy:** 4
- **Into next:** last mechanism: how a version moves between environments.
- **Merged from:** `stage-b`, `freeze-windows`
- **Source:** ⚠️ generating CEL admission policy from the Kyverno set is a capability we haven't run; flagged on the slide

### promotion-pr-ten

- **Act:** II
- **Job:** state the promotion call and what would flip it
- **Headline:** Promotion becomes a pull request: GitOps Promoter first, Kargo as the fallback.
- **Visual:** two models side by side, weighted by the call: Promoter large on the left, tagged with camp C, its environment branches joined by a PR at each step, no state outside Git; Kargo smaller and muted on the right, Warehouse, Freight and Stages inside its own control plane. One line underneath: what would flip it, and the spike that decides
- **Energy:** 3
- **Into next:** so why haven't teams asked for any of this?
- **Source:** GOALS §1.2; Meta's Argo CD + Kargo from its keynote abstract

### the-trade-ten

- **Act:** III
- **Job:** the turn: make the offer the deck exists to make
- **Headline:** Stop clicking sync, and in exchange nothing ships in a freeze, policy fails in CI, and a bad version rolls itself back.
- **Visual:** mint ground, the only one. The setup line small; STOP CLICKING SYNC huge; the three gains build one per click, each tagged with its camp, while the SYNC button on the right dims a step per gain and is struck through on the last
- **Energy:** 5
- **Into next:** here is the trade as a climb, and watch where the click comes off.

### the-route

- **Act:** III
- **Job:** the whole plan as one climb: dated stages, each with an exit gate, and prod's click coming off only after the controls
- **Headline:** Five stages, and prod stops clicking only after the controls are in.
- **Visual:** snowfield. One peak, the route climbing its face through camps A–E; each camp labelled at its height with its date, its one line and its exit gate (A and B dated in alpenglow, because those are commitments). The route is solid through A and B and dashed above, because C–E are trials and a decision. A struck SYNC marker sits on the route just past B, where prod auto-sync goes on: the focal point
- **Energy:** 3
- **Into next:** which brings us back to where we started.
- **Merged from:** `stage-a`, `guardrails-first`, `reloader`, `stage-b`, `freeze-windows` (B's exit gate), `stages-c-d`, `no-cluster-names` (D's entry gate, in the notes)

### day-one-meant

- **Act:** III
- **Job:** echo the opening: this is what day one meant for us
- **Headline:** That's day one: a developer who never learned a cluster name, never clicked sync, never read the policy list and never rolled back by hand.
- **Visual:** the opening's composition returns on dusk: the same peak, now with the route drawn to the summit and every camp lit; our own sentence in the quote's place, and stage E's date beneath it
- **Energy:** 3
- **Into next:** here's what we need from this room.
- **Merged from:** `stage-e`

### the-ask-ten

- **Act:** III
- **Job:** confirm the leans and protect the one invisible stage
- **Headline:** Confirm five leans and protect stage B's headcount.
- **Visual:** five decisions as a short ledger, each with our lean; beside it a large mint card, camp B: it gates stage C and the agent path's pull requests, so if one thing gets protected headcount, it's this
- **Energy:** 4
- **Into next:** end

## Appendix A: beats of the `main` draft

Copied verbatim from `narrative-main.md` so the `main` and `with-index` overviews keep their
beat notes (the kit reads beats only from this file). `narrative-main.md` is the story of
that draft; change it there first, then copy the beat here.

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

## Appendix B: the tool index (`with-index` draft)

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
