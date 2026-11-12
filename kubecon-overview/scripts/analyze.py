#!/usr/bin/env python3
"""Frequency analysis of tools/projects/concepts across KubeCon NA 2026 sessions."""
import json, re, os, collections, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = json.load(open(os.path.join(ROOT, "data", "sessions.json")))
TALKS = [s for s in S if s["speakers"]]

# term -> regex (word-boundaryish, case-insensitive)
TERMS = {
 # --- AI / inference ---
 "Kubernetes AI Conformance": r"ai conformance",
 "Dynamic Resource Allocation (DRA)": r"\bDRA\b|dynamic resource allocation",
 "Gateway API Inference Extension": r"inference extension|inference gateway",
 "llm-d": r"\bllm-d\b", "vLLM": r"\bvllm\b", "KServe": r"\bkserve\b",
 "Kubeflow": r"\bkubeflow\b", "Ray": r"\bray\b(?! tracing)", "KubeRay": r"\bkuberay\b",
 "Kueue": r"\bkueue\b", "Volcano": r"\bvolcano\b", "JobSet": r"\bjobset\b",
 "Model Context Protocol (MCP)": r"\bMCP\b|model context protocol",
 "Agents / agentic": r"\bagentic\b|\bAI agents?\b",
 "AGNTCY / A2A": r"\bagntcy\b|\bA2A\b|agent2agent",
 "Inference / serving": r"\binferenc\w+",
 "Fine-tuning / training": r"fine-tun\w+|\btraining jobs?\b|distributed training",
 "GPU": r"\bgpus?\b", "NVIDIA NIM/NeMo": r"\bNIM\b|\bNeMo\b",
 "RAG": r"\bRAG\b|retrieval.augmented",
 "Model registry / OCI models": r"model registry|models? as OCI|modelpack|\bOCI artifacts?\b",
 "AI gateway": r"ai gateway|llm gateway",
 "Tokens / KV cache": r"\bKV ?cache\b|token(?:s)? per second|\bTTFT\b",
 "MLOps": r"\bmlops\b",
 # --- platform engineering ---
 "Platform engineering": r"platform engineer\w*|internal developer platform|\bIDP\b",
 "Backstage": r"\bbackstage\b", "Crossplane": r"\bcrossplane\b",
 "Argo CD": r"\bargo ?cd\b|\bargo\b", "Flux": r"\bflux\b", "GitOps": r"\bgitops\b",
 "Helm": r"\bhelm\b", "Kustomize": r"\bkustomize\b", "Terraform/OpenTofu": r"\bterraform\b|\bopentofu\b",
 "Operators / CRDs": r"\boperators?\b|\bCRDs?\b|custom resource",
 "kro / composition": r"\bkro\b|resource graph",
 "Score / Humanitec": r"\bscore\b spec|humanitec",
 "Golden paths / self-service": r"golden path|self.service",
 "Multi-tenancy": r"multi.tenan\w+", "vCluster": r"\bvcluster\b",
 "Cluster API": r"cluster ?api\b|\bCAPI\b",
 "Karmada / multicluster": r"\bkarmada\b|multi.?cluster",
 "Developer experience": r"developer experience|\bDevEx\b|cognitive load",
 "Backstage/portal": r"developer portal",
 # --- runtime / scheduling / cost ---
 "Scheduling": r"\bschedul\w+", "Autoscaling/HPA/VPA": r"autoscal\w+|\bHPA\b|\bVPA\b",
 "Karpenter": r"\bkarpenter\b", "KEDA": r"\bkeda\b",
 "Cost / FinOps": r"\bfinops\b|cost optimi\w+|\bcost efficiency\b",
 "Capacity / utilization": r"utilization|bin.?pack\w*|overcommit\w*",
 "Spot / preemption": r"\bspot instances?\b|preempt\w+",
 "WebAssembly (Wasm)": r"\bwasm\b|webassembly",
 "Containerd / CRI": r"\bcontainerd\b|\bCRI-O\b|\bCRI\b",
 "Kata / gVisor / confidential": r"\bkata\b|gvisor|confidential comput\w+",
 "Edge / IoT": r"\bedge\b|\bk3s\b|\bkubeedge\b",
 "Bare metal": r"bare.?metal",
 "Virtualization / KubeVirt": r"\bkubevirt\b|virtual machines?",
 # --- networking ---
 "Gateway API": r"gateway ?api",
 "Service mesh": r"service mesh|\bistio\b|\blinkerd\b|ambient mesh",
 "Cilium / eBPF": r"\bcilium\b|\bebpf\b",
 "Ingress / load balancing": r"\bingress\b|load.?balanc\w+",
 "CNI": r"\bcni\b", "DNS / CoreDNS": r"\bcoredns\b",
 "Envoy": r"\benvoy\b",
 # --- observability ---
 "OpenTelemetry": r"opentelemetry|\botel\b",
 "Prometheus": r"\bprometheus\b", "Grafana": r"\bgrafana\b",
 "Metrics/logs/traces": r"\btracing\b|\bspans?\b|\blogs?\b",
 "eBPF observability": r"\bpixie\b|\bbeyla\b|\bhubble\b",
 "Continuous profiling": r"profil\w+|\bparca\b|\bpyroscope\b",
 "SLO / SRE": r"\bSLOs?\b|\bSRE\b|error budget",
 "Incident / on-call": r"incident\b|on.?call|postmortem",
 "AIOps / LLM troubleshooting": r"\bAIOps\b|root cause analys\w+|\bRCA\b",
 "Thanos/Mimir/Cortex/VictoriaMetrics": r"\bthanos\b|\bmimir\b|\bcortex\b|victoriametrics",
 "OpenCost": r"\bopencost\b", "Fluent Bit / Loki": r"fluent ?bit|\bloki\b|fluentd",
 "Perses / dashboards": r"\bperses\b|dashboards?",
 # --- security ---
 "Supply chain security": r"supply chain",
 "SBOM": r"\bsbom\b", "Sigstore / cosign": r"\bsigstore\b|\bcosign\b|\brekor\b",
 "SLSA / provenance": r"\bSLSA\b|provenance|attestation",
 "in-toto": r"in.toto", "Policy as code": r"policy.as.code|\bOPA\b|gatekeeper|\bkyverno\b",
 "SPIFFE/SPIRE / workload identity": r"\bspiffe\b|\bspire\b|workload identity",
 "Zero trust / mTLS": r"zero.trust|\bmTLS\b",
 "Secrets management": r"\bsecrets?\b management|external secrets|\bvault\b",
 "RBAC / least privilege": r"\bRBAC\b|least privilege",
 "Falco / runtime security": r"\bfalco\b|\btetragon\b|runtime security",
 "Vulnerability / CVE": r"\bCVEs?\b|vulnerabilit\w+|\btrivy\b|\bgrype\b",
 "Compliance / FedRAMP / FIPS": r"\bFedRAMP\b|\bFIPS\b|\bSOC ?2\b|compliance",
 "Post-quantum": r"post.quantum|\bPQC\b",
 "AI security / prompt injection": r"prompt injection|\bAI security\b|model security|guardrails",
 "Admission control": r"admission (?:control|webhook)|validating webhook",
 # --- data ---
 "Stateful / storage / CSI": r"\bCSI\b|persistent volume|\bstateful\b",
 "Databases on K8s": r"\bpostgres\w*\b|\bmysql\b|\bvitess\b|\bmongodb\b|\bcassandra\b",
 "Vector DB / embeddings": r"vector (?:database|db|search)|embeddings?",
 "Kafka / streaming": r"\bkafka\b|\bstrimzi\b|streaming",
 "Backup / DR": r"\bvelero\b|disaster recovery|\bbackups?\b",
 "Object storage / S3": r"\bS3\b|\bMinIO\b|object storage",
 # --- practice / community ---
 "Sustainability / power": r"sustainab\w+|carbon|energy efficien\w+|\bKepler\b",
 "Upgrades / lifecycle": r"\bupgrad\w+|lifecycle management",
 "Scale / large clusters": r"\bscal(?:e|ing) to\b|large.scale|\d{3,}[,\d]* nodes",
 "Migration / modernization": r"migrat\w+|modernizat\w+",
 "Testing / chaos": r"chaos engineering|\blitmus\b|\bchaos mesh\b|\btesting\b",
 "Open source sustainability / maintainers": r"maintainers?\b|contributor\w*|burnout|governance",
 "Postgres operators": r"\bcnpg\b|cloudnative-?pg",
 "CI/CD": r"\bCI/?CD\b|\btekton\b|continuous delivery",
 "Developer tooling: kubectl/k9s": r"\bkubectl\b|\bk9s\b|\bkind\b cluster|\bminikube\b",
 "Networking: multi-region/global": r"multi.region|global load|geo.distribut\w+",
}

def corpus(s): return f"{s['title']}\n{s['description']}"

counts, hits = {}, {}
for name, pat in TERMS.items():
    rx = re.compile(pat, re.I)
    ms = [s for s in TALKS if rx.search(corpus(s))]
    counts[name] = len(ms); hits[name] = ms

if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else None
    if which:
        rx = re.compile(TERMS.get(which, which), re.I)
        for s in TALKS:
            if rx.search(corpus(s)):
                print(f"- {s['title']}  [{', '.join(s['tracks'])}] — {', '.join(s['speakers'])} ({', '.join(s['companies'])})")
    else:
        for name, n in sorted(counts.items(), key=lambda kv: -kv[1]):
            print(f"{n:4d}  {name}")
