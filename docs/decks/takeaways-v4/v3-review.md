# Review of takeaways-v3 (deck-critic, 2026-11-18)

A fresh-eyes review of `takeaways-v3` as it stood on 2026-11-18 (33 slides, draft `main`,
before v3's `show-*` slides landed; slide 2 `journey` was mid-edit). Lens: Evan, the
co-presenter, said the deck is **not technical enough and doesn't have enough examples**.
`takeaways-v4` is the response; `narrative.md` there maps each finding to what v4 did.
The reviewer edited nothing.

**Verdict.** Evan is right. The deck is a well-built metaphor (peaks, a plane, a lake, a
fence), but the screen shows almost nothing from the show and no real config, so engineers
will read it as a vision deck written by someone who wasn't there. The biggest single
improvement: replace made-up config and illustrative numbers with real objects and slides
lifted from the show, starting with the peak, which as drawn contradicts GOALS §5.1.

## Top five deck-level problems

1. **The conference never appears on screen.** None of the 33 slides uses any of the 103
   curated PNGs; evidence lives only in small grey footers. Fix: one named proof at body
   size on every fix slide: a lifted slide, or a company plus a number.
2. **Every snippet on screen is invented or partial.** The `Region` claim is our own XRD;
   `constraints:/asks:` isn't a real object; the `version:` diff has no kind;
   `rollout-wave: 2` appears only inline. Fix: real objects in about ten lines: a CAPI
   `Cluster`, an ApplicationSet `RollingSync`, AppProject `syncWindows`, a Pod spec with
   `runtimeClassName`, a CEL rule, collector `k8sattributes`, a SQL query against the lake.
3. **The peak (`karmada`) makes the claim GOALS §5.1 calls the trap.** §5.1: failover is a
   traffic, state and capacity problem; ApplicationSet is "a templating controller, not a
   scheduler… nothing moves." The slide moves replicas region → region → cloud with no
   traffic or data layer, and only Karmada or OCM makes the AWS → second-cloud click true.
   Fix: keep the constraints card; draw the four layers; show the RTO as a sum (detection +
   GA/Route 53 + client DNS caching + draining + scale-up + Aurora Global promotion); label
   the second cloud "warm standby, or Karmada `clusterAffinities`".
4. **The first ~10 minutes carry no technical content, and the talk runs long.** Slides
   3–8 are six near-identical map builds; 9–11 are a model; the first outside fact is slide
   12. No cold open. Notes ≈ 6,500 words ≈ 46 minutes against a 35-minute slot. Fix:
   collapse 3–8 into two slides; open on Meta's ~15 engineers and ~100 clusters against our
   three people and 29.
5. **The second half never shows an agent doing a job.** Eleven slides of cages, gateways,
   passes and fences, but the only dated AI deliverable (explain-only triage by Q2 2027) has
   no slide, and the numbers there are mostly invented (162/0, 61%, 61 days). Fix: a "one
   real alert, triaged" slide as the second-half high, with Verkada's numbers and
   Salesforce's 25% first try.

## Accuracy problems found

- `gates`: "rolled back on its own" is wrong for LinkedIn's gate; their p22 says exit 1 means
  the sync fails and the rollout stops before prod ("fix forward or roll back").
- `new-holes`: "22 were real" misreads Metal3's tracker (22 security, 22 bugs, 31
  hardening). "61 days" ties image and tool CVEs to minor upgrades, but patches don't wait
  for April. The OpenCVE numbers still carry an open ⚠️.
- `sandbox`: the nested shells say Kata wraps gVisor wraps the container; they are
  alternatives, not layers.
- `one-runbook`: only `kubeadm upgrade node`; the first control-plane node runs
  `kubeadm upgrade apply`.
- `elastic-agents`: Auto Mode excludes custom AMIs, so gVisor/Kata nodes likely need
  self-managed Karpenter, and Kata on EC2 needs metal. Verify before presenting.
- `region-claim`: "21 days" is on screen without its ⚠️ check.
- `waves`: credits LinkedIn's "week → hour" to waves; it came from namespace canaries with
  PostSync gates.
- `overrun`: separate panel scales make developers' 1,280 h look like admins' 898 h.
- `journey` (mid-edit): "65 apps on every cluster" isn't what the model says.

## Per-slide notes (abridged)

- **Keep:** `one-runbook` (literal commands plus 54 blocks × 3: technical and visual, the
  model for the rest), `new-holes` and `credentials` (a sourced chart, a concrete pass),
  `region-claim` and `twenty-tools` (structure and the real list; swap in real fields),
  `three-ways` (a good turn; add a named example per column), `the-lake` (the best
  composition, but name the store, tables and read path, and show one query).
- **Fix:** `kubeadm-past` (a fragment headline; show a CAPI `Cluster`; name the on-prem
  infrastructure provider; lift LinkedIn's six-waves-to-one), `waves` (show `RollingSync`;
  say it's feature-flagged), `change-windows` (show the `syncWindows` entry; name the CRD
  Kyverno reads), `no-cluster-names` (replace with a before/after app repo), `ai-arrives`
  ("AI" never defined), `mcp-tools` (lift Cedar's three questions or show one `permit`; add
  Mastercard's dissent), `policy-layer` (show one real CEL expression and `kyverno test`),
  `one-view` (show one correlated incident or the collector pipeline; Yahoo's −86%),
  `patch-loop` (use NVIDIA p06: an agent driving a rollout from a status field; show our
  PR as a diff), `the-ask` (the headline names three of five items; no owner or size; item 4
  bundles four undecided choices).
- **Cut, merge, split:** merge 4–7 into one build slide; merge `elastic-agents` into
  `sandbox` as "one agent pod"; merge `same-person` into `the-ask`; cut `ai-resize` to an
  appendix (invented 61%, no Hertz deck, a cost story in the security act); replace
  `no-cluster-names`; split the peak into placement, then failover by layer; add triage.

## Visual and layout

- 21 of 33 slides flagged dense (72–161 words). Pay for snippets by cutting prose.
- Otherwise clean: nothing offstage or overlapping.
- The peak's map at ~0.63 scale: small chips; labels inside the dark overlay unreadable.
- `the-lake`: the bottom captions are small and crowded. `no-cluster-names`: the bottom 40%
  is empty. Slides 3–7 repeat one composition with the right third empty.
- The light slides follow no rule.

## Technical moments missing entirely

1. One real alert, triaged end to end (live option: HolmesGPT or k8sgpt on a
   CrashLoopBackOff in dev, read-only, two minutes).
2. Failover architecture with an RTO budget (GOALS §5.1 B).
3. The pipeline's real config: RollingSync, a sync window, a PostSync gate Job.
4. One agent pod spec, annotated, with the Auto Mode vs sandbox answer.
5. Lake query → agent PR → status-gated rollout (NVIDIA p06).
6. One real CEL policy failing in CI, then at admission.
