# Built for the curve: KubeCon 2026 takeaways for our move to EKS, and our 2030

> **This is the ten-slide version (draft `ten`, the default).** The full-length version is draft
> `main` (22 slides, about 30 minutes); its story is in `narrative-main.md`. Both drafts share
> `theme/` and the slide files; every slide this draft changed is a fork or a new file, so `main`
> still plays exactly as it did.

Condensed 2026-11-20 from the 22-slide `main`, after feedback that the decks run too long. Same
sources, same constraints, same drawing set. Nothing new was researched; every value on a slide
was already in `main` or in the source decks it cites.

**Sources used:** the schedule (`kubecon-overview/data/sessions.json`), the posted decks
(`kubecon-overview/slides/`, text pulled with `pdftotext`), our show notes (`Key lessons/Takaways`),
and the receipts already on `main`. **(abstract)** on screen means only the session description;
those numbers are what the speaker promised, quoted, not restated.

**Our constraints (unchanged):** a startup moving from on-prem to EKS fast; we never run local
models; we lean AWS, Vault and Istio (Ingress NGINX → Istio is already planned, so it is not a
takeaway); Argo CD stays basic (Applications, sync waves, hooks, sync options; no Kargo, no
Promoter, no progressive sync); Splunk, Prometheus and Grafana stay. Our team is "a small team".

## Brief

- **Audience:** engineering leadership, the platform/infra team, and the leads whose apps move to
  EKS. They know our stack; some know Kubernetes deeply and some don't. Skeptical of big-company
  process at a startup, and of AI hype.
- **Setting:** live, **about 13 minutes**, then sent round. The notes carry the argument for
  readers.
- **They believe now:** KubeCon was a GPU and AI show that mostly doesn't apply to us. The job is
  "get to EKS"; scale is a later problem. Agents are a tool on laptops.
- **They believe after:** the move to EKS is the cheapest moment we'll ever get to build the
  operating model the big operators had to retrofit. It is five habits on tools we already chose,
  and once agents run on the same rails as people, they take the toil the fleet would otherwise put
  on us.
- **The one sentence:** *We're early enough to build from the first EKS cluster what the big
  operators had to retrofit: a platform where a new cluster, service or agent is a pull request,
  so the work can keep growing while our small team doesn't.*
  (Someone will disagree: "ship first, platform later". That disagreement is the talk.)
- **The ask:**
  1. The five moves are the design bar for the first production EKS cluster. Any exception is
     written down.
  2. The 2030 spec sheet is our north star, reviewed once a year.
  3. One agent in Q1 2027: alert triage, read-only, on EKS, with a cost per alert by the end of Q2.

## Shape

- **Structure:** *before → after → bridge*, opened cold with a ratio, and drawn as one drawing
  set. The cover sheet (slide 2) states the claim; the sheet index (slide 3) is the 2030 spec, one
  row per move; sheets 1–5 (slides 4–8) are the moves; the assembly drawing (slide 9) puts all
  five sheets to work in one loop; the approval block (slide 10) is where people sign.
- **Acts:**
  - **I. The bar moved** (2): big is a ratio; the work bends, they retrofitted at the bend, and
    we're before it.
  - **II. 2030 is a pull request** (1): the spec sheet, which is also the index of the five moves.
  - **III. Five sheets, each already run by someone at the show** (5): clusters, apps, identity,
    telemetry, agents.
  - **IV. The assembly and the sign-off** (2): the loop, then the ask.
- **The peak:** `the-loop-ten` (slide 9, 85% through). Agents work the toil through the same
  rails people use; each station points back to the sheet it came from, so the loop only lands
  once every sheet has been shown. `guard-the-deletes-ten` carries the mid-deck tension.
- **The close:** `the-ask-ten` brings back the cold open's ratio rows with a fourth, dashed red row
  for us in 2030, then an approval block with three empty red signature boxes.
- **What was cut, and where it went:**
  - Set-up and stakes (`the-claim`, `work-outgrows-us`, `retrofit-tax`) are one cover sheet:
    the same curve, the team line under it, and the retrofits as revision marks at the bend.
  - Field-clearing and scope lists (`skip-the-gpus`, `five-moves`, `not-building`) became the
    spec sheet's sheet column and its voided "not in this set" strip; the GPU count is in notes.
  - Second slides per move (`cluster-is-a-commit`, `upgrades-in-waves`, `ci-is-the-gate`,
    `mesh-on-a-budget`, `every-dollar-has-an-owner`, `sandbox-per-session`) were merged into one
    sheet per move, or into the loop, which already shows waves and PostSync.
  - `the-road` is cut; its first test (rebuild a prod cluster from Git in a day) is in the ask's
    notes.

## Visual direction

**Unchanged from `main`: C, the scale drawing.** The palette, type, helpers (`theme/draw.js`) and
every existing rule in `theme/theme.css` are shared with `main` and were not edited; the ten-slide
pieces were added at the end of `theme.css` as new classes only.

- **The world:** an engineering drawing set on drafting film. Ratios are drawn to scale with
  dimension lines; where a ratio outgrows the sheet, the drawing breaks.
- **Palette:** drafting film `#e5e9e2` (ground, 40px non-photo-blue grid); graphite `#22272b`
  (ink); 2H lead `#5d656b` (quiet text); non-photo blue `#6c9bd8` / ink `#2b5c9e` (construction
  lines, notes); red pencil `#d0293a` / ink `#b31f2f` (**people and the decisions people make**,
  nothing else).
- **Type:** Schibsted Grotesk 800 for headlines and labels; B612 for dimensions, notes, tables and
  sources; JetBrains Mono for real YAML and fields.
- **Signature elements:** dimension lines, numbered balloons, parts lists, revision clouds for open
  decisions, the sheet tag top-right on every sheet.
- **Raised for the ten-slide set:**
  - **One drawing set, read in order.** Slide 2 carries the title block and the revision block
    (top-right, where drawings keep it); slide 3 is the sheet index; slides 4–8 each carry
    "sheet n of 5"; slide 9's tag reads "Assembly, sheets 1–5" and its parts list has a Sheet
    column pointing back to them; slide 10 ends in an approval block.
  - **Revision deltas** (triangles with a letter) mark where each company retrofitted, on the
    curve itself.
  - **A pipe drawn to scale** on sheet 4: the band's height is Yahoo's metric series, 2.06M in and
    280K out, so the taper through the two OTel stages is the −86%.
  - **An approval block** for the ask: red signature boxes, left empty. Red pencil still means
    only people.
  - **A "preliminary" stamp** on the spec sheet (blue, double-ruled, askew): the drawing isn't
    issued until people sign it on slide 10.
  - **The loop's own ratio**, "9 stations / 1 person", set large inside the loop when the change
    travels it: the peak answers the cold open's "big is a ratio".
  - **Tried and dropped:** a timestamp row on the Nutanix timeline (it doubled the dimensions and
    added words); Nubank's six-library fan-in on the pipeline sheet (it mixed a tracing fact into a
    drawing scaled to Yahoo's metric series).
- **Layout:** margins 120 / 96. Headline top-left (74–100px), the drawing fills the rest, sources
  in B612 along the bottom-left. Body text 28px or more; drawing labels 24px or more.
- **Motion moment:** on the loop, one change travels the schematic once (fourth click). Elsewhere,
  builds reveal at the speed of speech.
- **Anti-default check (carried from `main`):** cool film, not cream; no card kit (tables and
  drawings carry structure); numbering only where a sequence is real (balloons, sheets,
  revisions); no "Thank you" ending, the last screen is the ask.

## Beats

### cold-open

- **Act:** I
- **Job:** earn attention with the show's most useful surprise: the biggest operators run huge
  estates with small teams. "Big" is a ratio.
- **Headline:** Fifteen engineers run Meta's hundred clusters
- **Visual:** kept from `main` unchanged. The ratios drawn to scale: Meta's 15 engineers (red
  hatch) against ~100 clusters fits on the sheet (1 : 6.7). Nubank (5 engineers, 6,000+ services)
  and LinkedIn (~10 lines, 5M+ pods) break the sheet, with red-pencil notes on how far they would
  run. Nubank and LinkedIn are builds.
- **Energy:** 4
- **Into next:** "None of them got there by hiring. Here's what we think that means for us."
- **Sources:** Meta (abstract); Nubank, LinkedIn (posted slides).

### before-the-bend

- **Act:** I
- **Job:** state the one sentence, and the stakes, on one sheet. The work bends; teams don't; the
  big operators retrofitted at the bend; we're before it.
- **Headline:** We can build from day one what they had to retrofit
- **Visual:** the deck's cover sheet. Left: an illustrative plot. Work (graphite) bends upward
  against scale (clusters × releases × CVEs); the team (red, a person-line) climbs straight; the
  gap is hatched blue and labelled toil. A red dot sits at the bottom left: "we are here". Three
  revision deltas, A, B and C, sit on the curve at the bend. Top-right, the drawing's revision
  block: A Coinbase (homegrown auth → SPIFFE, 4k+ services), B Cisco Meraki (a 20-year monolith →
  "a new platform contract", abstract), C Nutanix (39 clusters pruned, four days back), and D Us,
  "not yet drawn", in a red revision cloud. Bottom-right, the title block. Rows A–D build.
- **Energy:** 3
- **Into next:** "So what does 'built for it from day one' look like by 2030?"
- **Sources:** Coinbase, Nutanix (posted slides); Meraki (abstract); LinkedIn's upgrade formula,
  Mastercard's CTO/CISO line and our show-floor note are in the notes. Curves illustrative.

### spec-for-2030

- **Act:** II
- **Job:** show the after as a spec, not a headcount, and make it the index of the five moves, so
  the next five slides have a frame. Say what's not in the set.
- **Headline:** 2030: a new cluster, service or agent is a pull request
- **Visual:** a sheet index that is also a spec table. One row per sheet (balloon 1–5, the move,
  its 2030 target) and a footprint row inside a revision cloud (on-prem exit is an open decision).
  In the agents row, "A person approves every change" is red. A blue double-ruled stamp, set
  slightly askew, reads "Preliminary: targets for us to agree". Under the table, a voided strip:
  "Not in this set": GPUs and model serving; Kargo, Promoter, progressive sync; a second
  orchestrator. The peers who already hit each target are on the sheets that follow and in the
  notes, not repeated here.
- **Energy:** 2
- **Into next:** "Five sheets get us there. Sheet one is the clusters, and it starts with the
  worst day anyone described at the show."
- **Data:** LinkedIn 7 business days for a minor across 250+ clusters, 5M+ pods (slides);
  Coinbase 4k+ services (slides); Yahoo −86% series (slides); Mastercard 150 EKS clusters by MR
  (slides); Verkada $0.33 an alert (abstract); Stripe 6 regions (slides). The "about a third of
  the AI talks were about running models" count is notes only (a title regex, ⚠️ signal, not a
  census).

### guard-the-deletes-ten

- **Act:** III, sheet 1 (clusters are cattle)
- **Job:** clusters are made and remade from Git, and that cuts both ways: one wrong desired state
  deleted 39. Four guards stop it, all basic Argo CD and Kubernetes.
- **Headline:** One commit deleted 39 clusters. Four guards stop it.
- **Visual:** Nutanix's four days as a dimensioned timeline (marked not to scale), then four
  guards in a 2×2 grid, each with a real field or target: one Application per cluster;
  `argocd.argoproj.io/sync-options: Prune=false` plus a CEL deny on DELETE (blue note: names to
  check on our Argo CD version); `reclaimPolicy: Retain`; RPO ≤ 1 h, RTO ≤ 30 min. Guards build.
- **Energy:** 4
- **Into next:** "That's the fleet. Sheet two is the apps, and keeping Argo CD boring."
- **Notes:** Nutanix ran Flux; the shape is the same in Argo CD's app-of-apps. They also
  redeployed 39 of 39 from Git by day two, so a cluster really is a commit. Meta's "Terraform
  didn't get fired, just reorged" and the 🔵 cluster-tool decision (Terraform, CAPI, or ACK + kro)
  are in the notes. ⚠️ Prune/delete option names to check against our Argo CD version.

### ten-lines-two-gates

- **Act:** III, sheet 2 (apps on a contract)
- **Job:** every app crosses to EKS on a ten-line contract, and with plain Argo CD the only road
  to prod is two gates: CI before merge, a PostSync check after sync.
- **Headline:** App teams write ten lines; CI and one hook are the gates
- **Visual:** one drawing, left to right. LinkedIn's real 10-line `LiDeployment` in a frame with
  a vertical "~10 lines" dimension, feeding a pipe: CI valve (render, schema, policy) → merge →
  Argo CD sync → PostSync valve (`hook: PostSync`), which branches to "next wave" (graphite) or
  "stop, page a person" (red). Each valve has a leader down to its receipt: Ford under CI,
  LinkedIn under PostSync. The last build is ours: "one golden Helm chart and a short values file;
  apps move to EKS on it, or they don't move yet".
- **Energy:** 3
- **Into next:** "Now the pods are running. Who are they, and what may they touch?"
- **Sources:** LinkedIn, Ford (posted slides). The platform's owned items (pod shape, injected
  containers, security, placement) are in the notes.

### identity-not-secrets-ten

- **Act:** III, sheet 3 (identity, not secrets)
- **Job:** every workload gets a short-lived identity and secrets expire: Vault, Istio and EKS Pod
  Identity from the first cluster. One decision is still open.
- **Headline:** Every pod gets an identity, not a password
- **Visual:** before, `DB_PASSWORD=hunter2` voided and struck. After, one pod with a SPIFFE ID
  and three issuers that trust it: Istio (mTLS), Vault (DB creds that expire), AWS (EKS Pod
  Identity). Right: Coinbase's −70% CPU, 4–10 ms a hop, 100% adoption. A red revision cloud:
  "Sidecar or ambient: decide before the first prod cluster".
- **Energy:** 2
- **Into next:** "Istio gives us identity. At scale it also gives us two million metric series, if
  we let it."
- **Sources:** Coinbase (posted slides). Rapido's and GEICO's scoping rules are cut; Coinbase
  moving to ambient is in the notes.

### one-pipeline-to-scale

- **Act:** III, sheet 4 (one telemetry pipeline)
- **Job:** keep Prometheus, Grafana and Splunk, put one OTel tier in front, and that tier is where
  the bill is set.
- **Headline:** One pipeline feeds the backends we keep, and sets what they cost
- **Visual:** a pipe drawn to scale. A hatched band whose height is Yahoo's active Istio series
  (24,000 pods): 2.06M, dimensioned, into the OTel agent (stage 1, per node), tapering like a
  reducer through the gateway (stage 2, per cluster) to 280K out to Prometheus and Grafana; logs
  and traces go to Splunk on a thin line. "−86%, ~$140K a year, one cluster" is set large beside
  the taper. A blue note: "a backend is exporter config, no redeploy". A "catch" line: sent to a
  second backend, Yahoo's data read 2.79× low; not closed yet.
- **Energy:** 3
- **Into next:** "Once every signal and every dollar goes through one place, we can afford the
  next workload: the agents."
- **Sources:** Yahoo, "Two-Stage OTel Aggregation" (posted slides). Nubank's five-engineer
  pipeline and the team label at admission are in the notes; the other cost meters (packets,
  tokens) are cut.

### agent-in-a-box

- **Act:** III, sheet 5 (agents are workloads)
- **Job:** an agent isn't a laptop tool; it's a workload in its own box, built from parts we
  already run, with exactly one way to change anything.
- **Headline:** An agent is a workload: its own pod, kernel, keys and exits
- **Visual:** an exploded assembly. One agent-session pod in the centre holding the Claude Agent
  SDK harness. Events come in from the top; one heavy arrow leaves the bottom: "writes: merge
  requests only". Five numbered parts on blue leaders: 1 its own kernel (`runtimeClassName`),
  2 its own identity, 3 keys it never sees (Vault), 4 an exit list (Istio egress), 5 limits and an
  off switch. Parts build.
- **Energy:** 3
- **Into next:** "So what do the agents do first? The thing that's eating us: toil."
- **Sources:** AWS, Infisical, Bancolombia (abstracts); IBM, Mastercard (posted slides).
  GenbaNEXT's request-vs-agent table, Uber's 830K+ runs and the MCP disagreement are in the notes.

### the-loop-ten

- **Act:** IV (**peak**)
- **Job:** the turn. Agents work the fleet's toil through the same rails people use, so the work
  curve from the cover sheet stops landing on people.
- **Headline:** Agents work the toil through the same rails we do
- **Visual:** the assembly drawing. A schematic loop with nine balloons; balloon 5, "Approve", is
  red: the one person. A parts list names who runs each station and which sheet (1–5) it comes
  from. The sheet tag reads "Assembly, sheets 1–5". Stations build in three groups; on the fourth
  click one change (a graphite dot) travels the loop once, and the loop's own ratio appears in its
  centre: "9 stations" in graphite over "1 person" in red, answering the cold open.
- **Energy:** 5
- **Into next:** "That's 2030. Getting there starts with three decisions."
- **Sources:** Verkada (abstract); Mastercard, monday.com, Ford, LinkedIn, Salesforce, NVIDIA
  (posted slides).

### the-ask-ten

- **Act:** IV
- **Job:** close by echoing the open, and get three concrete yeses.
- **Headline:** Approve the five moves for cluster one, and start one agent
- **Visual:** the cold open's ratio rows return, small, with a fourth row, "Us, 2030", in dashed
  red outline: "drawn when we agree the numbers". Below, an approval block: three rows (what we
  approve) with an empty red signature box each, building one at a time.
- **Energy:** 4
- **Into next:** the end. The one sentence is the last thing said; the approval block stays up
  for questions.

## To check before slides

- ⚠️ Argo CD prune/delete protection option names and behaviour on our version
  (`guard-the-deletes-ten`; flagged on the slide).
- ⚠️ Abstract-only receipts (Meta, Verkada, Meraki, AWS, Infisical, Bancolombia) are labelled
  "abstract" on screen and quoted, not restated.
- ⚠️ Our own current numbers (clusters, platform team size) for the fourth row of the ask stay
  undrawn until agreed.
- Not used: "90% of AI runs on K8s" from our show notes, because there's no source.
