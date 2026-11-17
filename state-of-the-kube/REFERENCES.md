# State of the Kube: sources and verification notes

Companion to [`index.html`](index.html), the attendee field report on KubeCon +
CloudNativeCon NA 2026 (Salt Lake City, Nov 9–12). Reference numbers match the `[n]`
markers on the page. Web sources accessed 2026-11-16.

⚠️ follows the repo convention: a claim from one secondary source that has not been
checked against a primary one. Don't put these on a slide without checking.

## Primary: the conference itself

1. **Official schedule** (Sessionize API), titles and abstracts. Pulled 2026-11-12 to
   `kubecon-overview/data/sessions.json`.
   <https://kubecon-cloudnativecon-north-america-2026.sessionize.com>
2. **Schedule analysis**: `kubecon-overview/analysis/THEMES.md`, `TOOLS.md`,
   `term-frequency.txt`; human-DX vs agent counts from `GOALS.md` §0.2.
3. **AWS keynote deck**: Mike Stefaniak, *Engineering Kubernetes for the Next Era of
   Workloads*, Nov 10, slides and speaker notes.
   `kubecon-overview/slides/2026-11-10_engineering-kubernetes-for-the-next-era-of-workloads.pptx`.
   It's the only keynote out of 34 slots that posted a deck. PR and KEP numbers on the page
   are as printed on the slides and weren't independently checked.

## Foundation and project announcements

4. CNCF, "CNCF Hits Major Milestones with Global Community Growth, Record Industry
   Investment and a New Generation of Projects to Build AI Systems in Production,"
   Nov 10, 2026.
   <https://www.cncf.io/announcements/2026/11/10/cncf-hits-major-milestones-with-global-community-growth-record-industry-investment-and-a-new-generation-of-projects-to-build-ai-systems-in-production/>
   Used for: 231 projects / 32 new; ~21.2M developers; 82,000 event attendees; 8 new
   Platinum members; OpenShell and Agent Substrate (sandbox); llm-d 1.0; KAIA and CKIE
   certifications planned for 2027; 40 AI-conformant platforms. The headline says
   "record investment," but the release gives no investment figure.
5. Shannon Harwood, "Kubernetes AI Conformance Badge: CNCF Hits 40 Platforms, Test Suite
   Names Only NVIDIA GPUs," TechTimes, Nov 11, 2026.
   <https://www.techtimes.com/articles/330454/20261111/kubernetes-ai-conformance-badge-cncf-hits-40-platforms-test-suite-names-only-nvidia-gpus.htm>
   Critique based on the author's review of the public repos (snapshot Oct 29): the 40
   is cumulative, with 41 distinct names and only 4 submissions against v1.37, and the
   test suite defines a single accelerator vendor.
6. Ronald Holman, "KubeCon Salt Lake City Closes With a Clear Signal: AI Inference Is
   Kubernetes' New Core Job," TechTimes, Nov 12, 2026.
   <https://www.techtimes.com/articles/330575/20261112/kubecon-salt-lake-city-closes-clear-signal-ai-inference-kubernetes-new-core-job.htm>
   Used for: the 66% figure (orgs hosting GenAI that use Kubernetes for inference,
   attributed to the 2026 CNCF survey), the Bryce quote, and the EU 2027 dates
   (Barcelona, Mar 15–18).

## Press recaps and coverage

7. Tom Fenton, Virtualization Review, Day 1 recap, Nov 12, 2026.
   <https://virtualizationreview.com/articles/2026/11/12/kubecon-salt-lake-city-day-1-autonomous-agents-sandboxes-bridging-ai-infrastructure-and-kubernetes.aspx>
   ⚠️ Sole source for: inference traffic up 4× in eight months; the NVIDIA physical-AI
   robot demo; the Akrites vulnerability project. Its speaker names and graduation list
   don't match the schedule or the CNCF release.
8. Tom Fenton, Virtualization Review, Day 2 recap, Nov 12, 2026.
   <https://virtualizationreview.com/articles/2026/11/12/kubecon-salt-lake-city-day-2-operating-at-agent-speed-platform-engineering-and-enterprise-reality.aspx>
   ⚠️ Sole source for: "agents generate 70% of tracked inference traffic" (Bryce); 3,000
   Claude codes for maintainers; CVS CAP build time and scale.
9. Beth Pariseau, "Nvidia, Google agent sandboxes meet within CNCF," TechTarget,
   Nov 11, 2026. <https://www.techtarget.com/news/nvidia-google-agent-sandboxes-meet-within-cncf/874392/>
   Used for: Agent Substrate architecture (actors, microVM snapshots, gVisor), CNCF
   acceptance on stage, OpenShell layers (container → microVM → BlueField-4 DPU), and the
   Justin Boitano quote.
10. Techstrong Editorial, "Solo.io Makes Enterprise Agent Substrate and kagent Generally
    Available," Cloud Native Now, Nov 10, 2026.
    <https://cloudnativenow.com/kubecon-cloudnativecon-north-america-2026/solo-io-makes-enterprise-agent-substrate-and-kagent-generally-available/>
11. ITOps Times, "KubeCon Roundup Day 2: Nov. 10, 2026."
    <https://itopstimes.com/kubernetes/kubecon-roundup-day-2-nov-10-2026/>
    Used for: Tim Hockin's framing of Agent Substrate; Mirantis Agent Platform GA.
12. Dilpreet Bindra, "Broadcom details Kubernetes work on a vendor-neutral VM API,
    workload conformance and agent sandboxing," ITOps Times, Nov 10, 2026.
    <https://itopstimes.com/kubernetes/broadcom-details-kubernetes-work-on-a-vendor-neutral-vm-api-workload-conformance-and-agent-sandboxing/>
13. Michelangelo Team, "Michelangelo is Now Open Source," May 20, 2026.
    <https://michelangelo-ai.org/blog/open-source-launch/>. Repo:
    <https://github.com/michelangelo-ai/michelangelo>
14. Kubeflow, "Kubeflow Has Graduated from CNCF," August 2026.
    <https://blog.kubeflow.org/graduation/>. The date comes from search results; the page
    itself wasn't read.
15. Jim Bugwadia, "KubeCon + CloudNativeCon North America 2026 Recap," Nirmata, Nov 13,
    2026 (vendor blog). <https://nirmata.com/2026/11/13/kubecon-cloudnativecon-north-america-2026-recap/>
    Used for: Kyverno 1.20 (Nov 12) no longer processes ClusterPolicy / ClusterCleanupPolicy.

## Upstream and vendor documentation

16. Kubernetes, "Kubernetes v1.37: Garhwal," Aug 26, 2026.
    <https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/>
    The English post wasn't fully retrieved. HPA scale-to-zero (beta) and pod-level
    checkpoint/restore (alpha) were read from the official Japanese and Chinese
    translations of the same post.
17. Kubernetes SIG Network and SRC, "Ingress NGINX Retirement: What You Need to Know,"
    Nov 11, 2025. <https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/>
18. Anthropic, Claude Platform release notes, Nov 12, 2026 entry (self-hosted Claude
    Managed Agents). <https://platform.claude.com/docs/en/release-notes/overview>
19. Jessica Forrester (Red Hat), "Sandbox Your Agents," keynote recording.
    <https://www.youtube.com/watch?v=ARFC0ono7qk>

## Notes from the floor

20. `Key lessons/Takaways`, `argocon/am-session.md`: raw notes taken at the show.

## Conflicts resolved on the page

| Claim | Conflict | Used |
|---|---|---|
| Kubeflow graduation | Keynote Nov 12 vs announced Aug 2026 [14] | Graduated Aug; keynote celebrated it |
| Michelangelo release | Keynote "announces" [1] vs blog dated May 20 [13] | Code public since May; keynote = public launch |
| Michelangelo scale | 5,000+ models / 45M pred/s [1] vs 5,300 [8] vs 30M peak (KubeCon EU coverage) | Abstract [1] |
| Agent Substrate contributors | 100+ contributors from 40+ orgs [10] vs 164 orgs [9] | Neither quoted as fact |
| Graduations in the past year | CNCF [4] vs recap [7] lists differ | CNCF [4] |
| Speaker names (Anthropic, NVIDIA physical AI, DeepMind) | Recaps [7][8] differ from schedule | Schedule [1] |
| llm-d level | "New sandbox project" vs "joined CNCF and reached 1.0" in the same release [4] | "Reached 1.0"; level not stated |
| ComputerWeekly and vmblog recaps | Both refused automated fetch (HTTP 403) | Not cited |
