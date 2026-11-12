# Deck assets — slides extracted from KubeCon NA 2026

Rendered from the decks in `kubecon-overview/slides/` at 150 DPI, one PNG per slide,
selected against the goals in [`GOALS.md`](GOALS.md). Filenames are `p<page>_<slide-title>.png`,
so the page number maps straight back to the source PDF.

**103 images across 18 decks**, plus per-slide text outlines for five `.pptx`
decks in `00-pptx-outlines/` (those can't be rendered without LibreOffice — but a `.pptx`
opens natively in PowerPoint or Keynote, so copy those slides directly instead).

## Attribution — required on every lifted slide

These are speaker-owned decks downloaded from the public Sessionize schedule. Any slide we
reuse carries the talk title, speaker(s), company and "KubeCon + CloudNativeCon NA 2026".
Internal use only — do not republish externally or put these in a customer-facing deck.

---

## `01-gitops-meltdown/`

**GitOps Meltdown: How a Commit Triggered a Cascading Delete of 39 Clusters in Production**  
Deepak Goel · Nutanix Inc · 2026-11-10 · Operations + Performance  
Source: `kubecon-overview/slides/2026-11-10_gitops-meltdown-how-a-commit-triggered-a-cascading-delete-of-39-cluste.pdf`  
Slides URL: https://sessionize.com/download/imkaldei~UCWPAmGCwir4YhJML3A7hy.pdf~gitops-meltdown.pdf

**Goal section:** §1.1 / §8

The cautionary half of the auto-sync argument, and the backup slide for §8. p24 is the StorageClass `reclaimPolicy: Retain` slide — use it verbatim in the data-protection section.

- `p12_t-he-hidden-coupling-the-control-plane-man.png` — p12: t he hidden coupling the control plane man
- `p17_t-imeline-four-days-end-to-end-day-0-13-03.png` — p17: t imeline four days end to end day 0 13 03
- `p19_recov-ery-day-2-4-the-backups-weren-t-read.png` — p19: recov ery day 2 4 the backups weren t read
- `p22_lesson-1-shrink-the-blast-radius-before-on.png` — p22: lesson 1 shrink the blast radius before on
- `p23_lesson-2-make-bulk-deletion-hard-mark-clus.png` — p23: lesson 2 make bulk deletion hard mark clus
- `p24_lesson-3-protect-stateful-infrastructure-r.png` — p24: lesson 3 protect stateful infrastructure r
- `p27_the-one-thi-ng-to-remember-automation-is-o.png` — p27: the one thi ng to remember automation is o

## `02-canary-namespaces-linkedin/`

**Ship Faster, Ship Safer: A K8s-Native Canary Pipeline for Critical Cluster Services**  
Youmin Han; Zhuo Zhi · LinkedIn · 2026-11-11 · Application Development + Delivery  
Source: `kubecon-overview/slides/2026-11-11_ship-faster-ship-safer-a-k8s-native-canary-pipeline-for-critical-clust.pdf`  
Slides URL: https://sessionize.com/download/mlawlep~s87tpQmbHcjCuv65CfnAU4.pdf~kubecon-ship-faster-ship-safer-.pdf

**Goal section:** §1.7 — centrepiece

The full namespace-scoped canary pattern. p15 (five moves) and p25 (before/after results) are the two to lead with; p08 is the failure-cost table that justifies the work; p27 is the agent roadmap that links to §6.

- `p08_missed-bugs-reached-prod-what-they-cost-an.png` — p8: missed bugs reached prod what they cost an
- `p10_our-rollout-evolved-in-three-phases-that-b.png` — p10: our rollout evolved in three phases that b
- `p12_phase-2-a-percentage-ramp-limits-blast-rad.png` — p12: phase 2 a percentage ramp limits blast rad
- `p13_phase-3-namespace-scoped-canary-instances.png` — p13: phase 3 namespace scoped canary instances
- `p15_the-pattern-five-kubernetes-native-moves-1.png` — p15: the pattern five kubernetes native moves 1
- `p17_example-1-admission-webhook-isolate-two-we.png` — p17: example 1 admission webhook isolate two we
- `p19_example-1-admission-webhook-route-one-labe.png` — p19: example 1 admission webhook route one labe
- `p22_gate-argocd-syncs-the-canary-then-a-postsy.png` — p22: gate argocd syncs the canary then a postsy
- `p23_rollout-order-staging-first-canaries-in-pa.png` — p23: rollout order staging first canaries in pa
- `p25_from-a-week-of-hoping-to-an-hour-of-proof.png` — p25: from a week of hoping to an hour of proof
- `p27_what-s-next-production-feeds-the-canary-ag.png` — p27: what s next production feeds the canary ag

## `03-agents-earn-merge/`

**Progressive Delivery for Trust: How Agents Earn the Right to Merge**  
Darian DeFalco · Transfix · 2026-11-11 · Platform Engineering  
Source: `kubecon-overview/slides/2026-11-11_progressive-delivery-for-trust-how-agents-earn-the-right-to-merge.pdf`  
Slides URL: https://sessionize.com/download/ydamqel~WrWYrVtXPJffc9FS1LdtWh.pdf~progressive-delivery-for-trust_-how-agents-earn-the-right-to-merge.pdf

**Goal section:** §1.9 / §6

How an agent earns authority. p09 — *"Models produce evidence. Code decides authority."* — is the single best one-line principle we brought home. p10 maps canary/analysis/success-condition/promotion/abort onto permission rather than traffic. p17 is the four-role separation (proposer can't approve its own PR).

- `p03_review-bottleneck-review-is-the-bottleneck.png` — p3: review bottleneck review is the bottleneck
- `p09_the-spectrum-of-determinism-in-the-pipelin.png` — p9: the spectrum of determinism in the pipelin
- `p10_the-model-progressive-delivery-for-trust-p.png` — p10: the model progressive delivery for trust p
- `p12_argo-cd-pull-request-generator-transfix-a.png` — p12: argo cd pull request generator transfix a
- `p17_promotion-who-does-what-four-roles-four-re.png` — p17: promotion who does what four roles four re
- `p18_abort-vulnerability-remediation-revocation.png` — p18: abort vulnerability remediation revocation
- `p19_take-home-five-questions-for-one-workflow.png` — p19: take home five questions for one workflow

## `04-cel-admission-policy/`

**Goodbye Webhooks, Hello CEL: Using Native Validating and Mutating Admission Policies in Kubernetes**  
Greg Bray · Google · 2026-11-11 · Platform Engineering  
Source: `kubecon-overview/slides/2026-11-11_goodbye-webhooks-hello-cel-using-native-validating-and-mutating-admiss.pdf`  
Slides URL: https://sessionize.com/download/ictagvew~PvejDLBbmh7K928cm3Qcer.pdf~goodbye-webhooks-hello-cel-greg-bray-kubecon-na-2026.pdf

**Goal section:** §2.1

In-tree VAP/MAP with CEL. p13 is the honest tradeoff slide vs Kyverno/Gatekeeper — keep it, it pre-empts the obvious question.

- `p04_pain-points-of-webhooks-latency-tls-comple.png` — p4: pain points of webhooks latency tls comple
- `p06_the-cel-advantage-in-process-evaluation-in.png` — p6: the cel advantage in process evaluation in
- `p07_custom-resources-for-admission-bindings-an.png` — p7: custom resources for admission bindings an
- `p08_custom-resources-for-mutation-bindings-and.png` — p8: custom resources for mutation bindings and
- `p13_architectural-tradeo-s-native-policies-vs.png` — p13: architectural tradeo s native policies vs

## `05-composing-inference/`

**Composing Inference on Kubernetes: Gateway, Schedule, Serve, Observe**  
Karena Angell; Alex Chircop · Google; Red Hat · 2026-11-11 · AI Inference + Agentic  
Source: `kubecon-overview/slides/2026-11-11_composing-inference-on-kubernetes-gateway-schedule-serve-observe.pdf`  
Slides URL: https://sessionize.com/download/tkaxgei~BeLeYxeaKTNouBaVqn118E.pdf~composing-inference-on-kubernetes_-gateway-schedule-serve-observe.pdf

**Goal section:** §3.4

The reference architecture for gateway → schedule → serve → observe. p05 is the baseline diagram to redraw as ours.

- `p05_the-composable-architecture-control-flow-l.png` — p5: the composable architecture control flow l
- `p12_gateway-where-control-flow-decisions-meet.png` — p12: gateway where control flow decisions meet
- `p16_diagnose-by-boundary-first-operator-sympto.png` — p16: diagnose by boundary first operator sympto
- `p17_open-ecosystem-map-interfaces-before-proje.png` — p17: open ecosystem map interfaces before proje

## `06-cedar-mcp-authz/`

**What Can Your AI Agents Actually Do? Cedar Analysis for MCP Servers**  
Lucas Käldström; Chris Burns · AWS; Stacklok · 2026-11-11 · Security  
Source: `kubecon-overview/slides/2026-11-11_what-can-your-ai-agents-actually-do-cedar-analysis-for-mcp-servers.pdf`  
Slides URL: https://sessionize.com/download/idcaxxer~LY7BnjvzDsshsuP3QeAZnu.pdf~kubecon-what-can-your-ai-agents-actually-do_-cedar-analysis-for-mcp-servers.pdf

**Goal section:** §3.5

What an agent can actually do. p05/p17 frame MCP auth as three questions (who is calling, who decides, what identity reaches the backend) — that framing is reusable regardless of which tool we pick.

- `p05_mcp-auth-is-three-questions-question-01-wh.png` — p5: mcp auth is three questions question 01 wh
- `p17_the-mcp-auth-design-space-mcp-server-host.png` — p17: the mcp auth design space mcp server host
- `p26_rock-solid-formally-veri-ed-in-lean-correc.png` — p26: rock solid formally veri ed in lean correc
- `p31_cedar-analysis-answer-questions-about-poli.png` — p31: cedar analysis answer questions about poli

## `07-spiffe-broker-identity/`

**Every Kubernetes Object Deserves an Identity: The SPIFFE Broker API**  
Arndt Schwenkschuster · Defakto Security · 2026-11-12 · Maintainer Track  
Source: `kubecon-overview/slides/2026-11-12_every-kubernetes-object-deserves-an-identity-the-spiffe-broker-api.pdf`  
Slides URL: https://sessionize.com/download/jkaxyen~EKVirYLKsJs4HeDWx7owVt.pdf~every-kubernetes-object-deserves-an-identity.pdf

**Goal section:** §3.6

Why operators end up over-privileged today (p10/p11) and what per-object identity changes (p12/p14). Directly relevant to Argo CD and External Secrets.

- `p10_02-situation-today-option-2-the-operator-s.png` — p10: 02 situation today option 2 the operator s
- `p11_02-situation-today-option-3-a-service-acco.png` — p11: 02 situation today option 3 a service acco
- `p12_03-what-if-what-if-the-object-itself-got-a.png` — p12: 03 what if what if the object itself got a
- `p14_04-behind-the-scenes-the-spiffe-broker-api.png` — p14: 04 behind the scenes the spiffe broker api

## `08-otel-cardinality/`

**Two-Stage OTel Aggregation: Taming Istio Cardinality at 10k-Pod Scale**  
Evelyn (Chungyu) Chen · Yahoo · 2026-11-10 · Observability  
Source: `kubecon-overview/slides/2026-11-10_two-stage-otel-aggregation-taming-istio-cardinality-at-10k-pod-scale.pdf`  
Slides URL: https://sessionize.com/download/imrafmef~aq3VtVSMa9nB84kBaJKK83.pdf~kubecon-istio-cardinality-final.pdf

**Goal section:** §4.2

Cardinality control with real money attached (p02/p44: 86% fewer series, ≈$140K/yr on one cluster). p42 is the trap slide — switching to delta temporality silently breaks every `rate()` query.

- `p02_same-traffic-86-fewer-series-140k-a-year-b.png` — p2: same traffic 86 fewer series 140k a year b
- `p09_four-options-only-one-survived.png` — p9: four options only one survived
- `p10_where-the-aggregation-happens-agent-gatewa.png` — p10: where the aggregation happens agent gatewa
- `p42_rate-breaks-silently-every-query-must-chan.png` — p42: rate breaks silently every query must chan
- `p44_the-bigger-your-mesh-the-more-you-save-140.png` — p44: the bigger your mesh the more you save 140
- `p53_what-to-take-home-1-aggregate-in-cluster-n.png` — p53: what to take home 1 aggregate in cluster n

## `09-opencost-llmd/`

**Clueless About The Cost of AI Model Usage? OpenCost+llm-d = first of a kind inference cost tracking**  
Alexander Meijer; Sima Nadler · IBM · 2026-11-11 · Observability  
Source: `kubecon-overview/slides/2026-11-11_clueless-about-the-cost-of-ai-model-usage-opencost-llm-d-first-of-a-ki.pdf`  
Slides URL: https://sessionize.com/download/ijmawzew~PhAskxX2MwS8E9BzcYt64n.pdf~kubecon-na-2026-slides-nadler_meijer-ibm-formatted.pdf

**Goal section:** §4.3

Cost per model/token. p11 (allocation vs usage) is the conceptual slide we need before quoting any AI cost number.

- `p07_llm-d-opencost-integration-llm-d-model-spe.png` — p7: llm d opencost integration llm d model spe
- `p10_turning-usage-metrics-into-cost-business-l.png` — p10: turning usage metrics into cost business l
- `p11_allocation-vs-usage-cost-attribution-alloc.png` — p11: allocation vs usage cost attribution alloc

## `10-network-cost-attribution/`

**From Packets to Paychecks: eBPF-Based Network Cost Attribution at Scale**  
Aanchal Khandelwal; Brian Ugie · Adobe · 2026-11-12 · Observability  
Source: `kubecon-overview/slides/2026-11-12_from-packets-to-paychecks-ebpf-based-network-cost-attribution-at-scale.pdf`  
Slides URL: https://sessionize.com/download/nzasuj~GKVmafFAGpT4uEmyV83Arq.pdf~kubecon-na-26-from-packets-to-paychecks.pdf

**Goal section:** §4.4 / §10.4 / §10.5

The eBPF alternative to NFM. p17/p18 are the cost categories with real percentages; p20 is the honest scaling cost (~85 Prometheus shards per cluster) — read it before assuming this is cheap.

- `p06_what-the-system-needed-to-get-right-volume.png` — p6: what the system needed to get right volume
- `p08_the-pipeline-at-a-glance-collection-classi.png` — p8: the pipeline at a glance collection classi
- `p17_the-categories-behind-cost-attribution-cat.png` — p17: the categories behind cost attribution cat
- `p18_the-categories-behind-cost-attribution-int.png` — p18: the categories behind cost attribution int
- `p20_the-hardest-part-was-scale-85-prometheus-s.png` — p20: the hardest part was scale 85 prometheus s
- `p23_what-this-gives-us-today-what-teams-get-ne.png` — p23: what this gives us today what teams get ne

## `11-multicluster-one-kubectl/`

**N Clusters, One kubectl: Multi-Cluster That Just Works**  
Anne Lau; Scott Brimhall · NVIDIA; Salesforce · 2026-11-10 · Platform Engineering  
Source: `kubecon-overview/slides/2026-11-10_n-clusters-one-kubectl-multi-cluster-that-just-works.pdf`  
Slides URL: https://sessionize.com/download/cucgaw~WkB97h61Wu9qDVkkcwhbXj.pdf~n-clusters-one-kubectl_-multi-cluster-that-just-works_annelau_scottbrimhall.pdf

**Goal section:** §5.1

Hiding multi-cluster behind one kubectl. p10 (choose where the complexity lives) is the decision slide for our §5.1 call.

- `p10_02-the-design-choice-choose-where-the-comp.png` — p10: 02 the design choice choose where the comp
- `p14_03-the-architecture-workload-api-a-smart-r.png` — p14: 03 the architecture workload api a smart r
- `p16_03-the-architecture-workload-api-three-req.png` — p16: 03 the architecture workload api three req
- `p31_06-takeaways-your-developers-are-your-cust.png` — p31: 06 takeaways your developers are your cust

## `12-fleet-node-changes/`

**5,000 Nodes in Minutes, Twice in a Week: A Pattern for Fleet-Wide Node Changes**  
Alex Yuskauskas · NVIDIA · 2026-11-11 · ⚡ Lightning Talks  
Source: `kubecon-overview/slides/2026-11-11_5-000-nodes-in-minutes-twice-in-a-week-a-pattern-for-fleet-wide-node-c.pdf`  
Slides URL: https://sessionize.com/download/ynaoji~3wnvyHazKja8b9S2cNH9hY.pdf~kubecon-na-2026-5000-nodes-in-3-minutes-twice-in-a-week-1.pdf

**Goal section:** §5.2 / §6

Fleet-wide node change as a controller + a check. p06 — the status enum that let an agent drive the rollout — is the cleanest example of agent-safe automation at the show.

- `p04_ship-the-change-and-the-check-that-fails-w.png` — p4: ship the change and the check that fails w
- `p05_rollout-status-one-kubectl-get-failed-jobs.png` — p5: rollout status one kubectl get failed jobs
- `p06_the-status-enum-let-an-agent-drive-the-rol.png` — p6: the status enum let an agent drive the rol
- `p07_two-cves-thousands-of-nodes-one-controller.png` — p7: two cves thousands of nodes one controller

## `13-skip-level-upgrades/`

**Binary Version Is Not Behavior: Skip-Level Kubernetes Control Plane Upgrades With KEP-4330**  
Sameer Marulkar · LinkedIn · 2026-11-11 · Operations + Performance  
Source: `kubecon-overview/slides/2026-11-11_binary-version-is-not-behavior-skip-level-kubernetes-control-plane-upg.pdf`  
Slides URL: https://sessionize.com/download/iblaopre~nqXmvkBhGXbPJWMyic6KtQ.pdf~binary_version_is_not_behavior.pdf

**Goal section:** §5.2

250+ clusters, ~500K nodes, skipping minors via KEP-4330. p05 ("deploy is not release") is the reusable principle; p08 is the six-waves-to-one rollout shape.

- `p02_the-result-v1-31-to-v1-34-across-productio.png` — p2: the result v1 31 to v1 34 across productio
- `p05_02-architectural-decoupling-deploy-is-not.png` — p5: 02 architectural decoupling deploy is not
- `p06_02-architectural-decoupling-multi-release.png` — p6: 02 architectural decoupling multi release
- `p08_04-production-rollout-rollback-six-waves-t.png` — p8: 04 production rollout rollback six waves t
- `p09_05-takeaways-what-to-take-home-separate-bi.png` — p9: 05 takeaways what to take home separate bi

## `14-etcd-blast-radius/`

**Death by a Thousand Patches: How Pod Status Updates Exhaust etcd and What to Do About It**  
Sharik Pahwa; Hardeep Singh Tiwana · AWS; Amazon Web Services · 2026-11-11 · Operations + Performance  
Source: `kubecon-overview/slides/2026-11-11_death-by-a-thousand-patches-how-pod-status-updates-exhaust-etcd-and-wh.pdf`  
Slides URL: https://sessionize.com/download/dmaudo~E3a68Y3FHVjKRWVT9vqR8D.pdf~death_by_a_thousand_patches_kubecon_2026.pdf

**Goal section:** §5.4

Why a cluster with zero crashed nodes goes read-only. p16 is a literal Monday-morning checklist — alert at 50%/75% on etcd db size.

- `p05_the-failure-mode-quota-breach-nospace-alar.png` — p5: the failure mode quota breach nospace alar
- `p06_blast-radius-what-breaks-what-keeps-runnin.png` — p6: blast radius what breaks what keeps runnin
- `p13_prevention-alerting-catch-it-in-days-not-m.png` — p13: prevention alerting catch it in days not m
- `p16_takeaways-what-to-do-monday-morning-alert.png` — p16: takeaways what to do monday morning alert

## `15-aiops-salesforce/`

**1000 Clusters, 1 Smarter Brain: The Next Evolution of AIOps at Salesforce**  
Anubhav Dhoot; Uttam Kumar · Salesforce · 2026-11-12 · AI Inference + Agentic  
Source: `kubecon-overview/slides/2026-11-12_1000-clusters-1-smarter-brain-the-next-evolution-of-aiops-at-salesforc.pdf`  
Slides URL: https://sessionize.com/download/inlahnec~PQcTdhNpXUJDkDtdZXi8Pn.pdf~final-draft-1000-clusters-1-smarter-brain_-the-next-evolution-of-aiops-at-salesforce.pdf

**Goal section:** §6 — stage 2/3

AIOps across 1,000 clusters. p06 is the honest one: the first attempt hit **25% accuracy**. p09 (continuously curated knowledge base) and p12 (LLM-as-judge + stratified human sampling) are how they fixed it. p21 is the impact slide.

- `p04_operational-scale-50-operators-and-integra.png` — p4: operational scale 50 operators and integra
- `p05_agentic-self-healing-architecture-1-2-3-4.png` — p5: agentic self healing architecture 1 2 3 4
- `p06_agents-at-scale-hypothesis-2-lots-of-data.png` — p6: agents at scale hypothesis 2 lots of data
- `p09_continuously-curated-knowledge-base-auto-r.png` — p9: continuously curated knowledge base auto r
- `p12_scaling-agentic-output-evals-llm-as-judge.png` — p12: scaling agentic output evals llm as judge
- `p15_agentic-design-evolution-agentic-kb-agenti.png` — p15: agentic design evolution agentic kb agenti
- `p17_dependency-knowledge-graph.png` — p17: dependency knowledge graph
- `p21_impact-900-60-80-2x-hrs-month-rca-accuracy.png` — p21: impact 900 60 80 2x hrs month rca accuracy
- `p22_what-s-next-path-to-fully-autonomous-troub.png` — p22: what s next path to fully autonomous troub

## `16-llm-drives-eks/`

**No RAG, No Regrets: Letting an LLM Drive 30 EKS Clusters in Production**  
Trevor Linton · Mastercard · 2026-11-11 · Platform Engineering  
Source: `kubecon-overview/slides/2026-11-11_no-rag-no-regrets-letting-an-llm-drive-30-eks-clusters-in-production.pdf`  
Slides URL: https://sessionize.com/download/ikbauji~4nU16si4qKN2GURmuy5LPu.pdf~kubecon-no-rag-no-regrets.pdf

**Goal section:** §6 / §7

Mastercard's counter-argument to RAG. p28-p31 are the decisions (projections instead of RAG; built-in tools instead of MCP); p36 is what it delivered. Worth presenting as a dissenting view, not gospel.

- `p12_what-we-need-where-most-of-us-live-autocom.png` — p12: what we need where most of us live autocom
- `p13_infrastructure-ai-challenges-data-problems.png` — p13: infrastructure ai challenges data problems
- `p14_infrastructure-ai-challenges-security-prob.png` — p14: infrastructure ai challenges security prob
- `p15_infrastructure-ai-challenges-runtime-probl.png` — p15: infrastructure ai challenges runtime probl
- `p16_infrastructure-ai-challenges-cost-problems.png` — p16: infrastructure ai challenges cost problems
- `p28_where-rag-breaks-down-how-many-list-all-or.png` — p28: where rag breaks down how many list all or
- `p30_projections-instead-of-rag-with-projection.png` — p30: projections instead of rag with projection
- `p31_ditch-mcps-adopt-tools-rely-on-built-in-fu.png` — p31: ditch mcps adopt tools rely on built in fu
- `p36_what-it-delivered-25-infrastructure-system.png` — p36: what it delivered 25 infrastructure system
- `p44_so-what-no-shell-it-s-not-necessary-use-pr.png` — p44: so what no shell it s not necessary use pr

## `17-queryable-audit-layer/`

**One Recipe, Five Clouds, One Query: Portable GPU Configuration with a Queryable Audit Layer**  
Christopher Haar; Yuan Chen · NVIDIA; Upbound · 2026-11-10 · Platform Engineering  
Source: `kubecon-overview/slides/2026-11-10_one-recipe-five-clouds-one-query-portable-gpu-configuration-with-a-que.pdf`  
Slides URL: https://sessionize.com/download/icbaivme~9ZHueTBk6jScrRC1uWhxtA.pdf~aicr-kubecon-na-2026-one-recipe-five-clouds-one-query-final.pdf

**Goal section:** §7

Cluster state as a queryable, signed audit layer. p18 (four questions for an auditable cluster) and p21 (what changed since the baseline) are the shape we want for our own state dump.

- `p04_workflow-aicr-workflow-use-criteria-or-aic.png` — p4: workflow aicr workflow use criteria or aic
- `p18_audit-layer-four-questions-for-an-auditabl.png` — p18: audit layer four questions for an auditabl
- `p20_audit-layer-one-query-five-clouds-gb300-in.png` — p20: audit layer one query five clouds gb300 in
- `p21_audit-layer-what-changed-since-the-baselin.png` — p21: audit layer what changed since the baselin
- `p23_audit-layer-evidence-collect-sign-and-subm.png` — p23: audit layer evidence collect sign and subm

## `18-crossplane-functions/`

**Crossplane Contribfest - Start Your Journey to Crossplane Function Maintainer**  
Yury Tsarev · Upbound · 2026-11-11 · 🚨 Contribfest  
Source: `kubecon-overview/slides/2026-11-11_crossplane-contribfest-start-your-journey-to-crossplane-function-maint.pdf`  
Slides URL: https://sessionize.com/download/khaitse~RQiJPnn1VedUSxtEsrizXs.pdf~start-your-journey-to-crossplane-function-maintainer.pdf

**Goal section:** §10.1

Composition functions. Note p12/p13 are literally `function-lifecycle` — the same project sitting in this repo.

- `p04_functions-are-where-your-platform-logic-li.png` — p4: functions are where your platform logic li
- `p05_the-pipeline-is-middleware-step-2-today-st.png` — p5: the pipeline is middleware step 2 today st
- `p12_function-lifecycle-one-switch-per-xr-mode.png` — p12: function lifecycle one switch per xr mode
- `p13_one-annotation-in-policies-out-the-xr-the.png` — p13: one annotation in policies out the xr the
- `p20_what-a-maintainer-checks-first-the-code-th.png` — p20: what a maintainer checks first the code th
