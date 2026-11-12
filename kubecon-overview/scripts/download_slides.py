#!/usr/bin/env python3
"""Download every slide deck attached to a KubeCon NA 2026 session into slides/."""
import json, os, re, sys, csv, time, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(ROOT, "slides")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"

def main():
    sessions = json.load(open(os.path.join(ROOT, "data", "sessions.json")))
    todo = [s for s in sessions if s["slides_url"]]
    os.makedirs(DEST, exist_ok=True)
    rows, ok, fail = [], 0, 0
    for i, s in enumerate(todo, 1):
        url = s["slides_url"]
        ext = os.path.splitext(url)[1].lower() or ".bin"
        if len(ext) > 6: ext = ".bin"
        fname = f"{(s['startsAt'] or '')[:10]}_{s['slug']}{ext}"
        path = os.path.join(DEST, fname)
        status = "cached"
        if not os.path.exists(path) or os.path.getsize(path) == 0:
            try:
                req = urllib.request.Request(url, headers={"User-Agent": UA})
                with urllib.request.urlopen(req, timeout=120) as r, open(path, "wb") as f:
                    f.write(r.read())
                status = "ok"; ok += 1
                time.sleep(0.3)
            except Exception as e:
                status = f"FAIL {type(e).__name__}: {e}"[:120]; fail += 1
                if os.path.exists(path) and os.path.getsize(path) == 0: os.remove(path)
        size = os.path.getsize(path) if os.path.exists(path) else 0
        print(f"[{i}/{len(todo)}] {status:<10} {size/1e6:6.2f}MB  {fname}", flush=True)
        rows.append({"file": fname if size else "", "bytes": size, "status": status,
                     "title": s["title"], "date": (s["startsAt"] or "")[:10],
                     "room": s["room"], "tracks": "; ".join(s["tracks"]),
                     "speakers": "; ".join(s["speakers"]), "companies": "; ".join(s["companies"]),
                     "url": url, "session_id": s["id"]})
    with open(os.path.join(DEST, "MANIFEST.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
    print(f"\nDONE downloaded={ok} failed={fail} total={len(todo)}")

if __name__ == "__main__":
    main()
