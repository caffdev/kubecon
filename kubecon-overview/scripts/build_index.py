#!/usr/bin/env python3
"""Normalize the KubeCon NA 2026 Sessionize schedule into flat CSV/JSON indexes."""
import json, csv, re, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "data", "schedule.json")
Q_SLIDES, Q_REPO, Q_DEMO, Q_SITE = 137003, 137004, 137005, 137006
Q_COMPANY, Q_TITLE = 128829, 128830

def slugify(s, n=70):
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return s[:n].strip("-") or "session"

def main():
    d = json.load(open(SRC))
    cat_item = {}      # item id -> (category title, item name)
    for c in d["categories"]:
        for it in c["items"]:
            cat_item[it["id"]] = (c["title"], it["name"])
    rooms = {r["id"]: r["name"] for r in d["rooms"]}
    spk = {}
    for s in d["speakers"]:
        qa = {q["questionId"]: q.get("answerValue") for q in (s.get("questionAnswers") or [])}
        spk[s["id"]] = {"name": s["fullName"],
                        "company": qa.get(Q_COMPANY) or "",
                        "title": qa.get(Q_TITLE) or ""}

    out = []
    for s in d["sessions"]:
        qa = {q["questionId"]: q.get("answerValue") for q in (s.get("questionAnswers") or [])}
        tracks, levels, flags = [], [], []
        for cid in s.get("categoryItems") or []:
            ct, name = cat_item.get(cid, ("?", str(cid)))
            if ct == "All Sessions": tracks.append(name)
            elif ct == "Audience Level": levels.append(name)
            else: flags.append(f"{ct}: {name}")
        speakers = [spk.get(i, {"name": i, "company": "", "title": ""}) for i in (s.get("speakers") or [])]
        out.append({
            "id": s["id"],
            "title": s["title"],
            "description": s.get("description") or "",
            "startsAt": s.get("startsAt"), "endsAt": s.get("endsAt"),
            "room": rooms.get(s.get("roomId"), ""),
            "tracks": tracks, "level": levels, "flags": flags,
            "speakers": [sp["name"] for sp in speakers],
            "companies": sorted({sp["company"] for sp in speakers if sp["company"]}),
            "slides_url": qa.get(Q_SLIDES) or "",
            "repo": qa.get(Q_REPO) or "", "demo": qa.get(Q_DEMO) or "", "website": qa.get(Q_SITE) or "",
            "is_service": s.get("isServiceSession"), "is_plenum": s.get("isPlenumSession"),
            "slug": slugify(s["title"]),
        })
    out.sort(key=lambda x: (x["startsAt"] or "", x["room"]))

    with open(os.path.join(ROOT, "data", "sessions.json"), "w") as f:
        json.dump(out, f, indent=1)

    cols = ["id","startsAt","endsAt","room","title","tracks","level","flags","speakers","companies",
            "slides_url","repo","demo","website"]
    with open(os.path.join(ROOT, "data", "sessions.csv"), "w", newline="") as f:
        w = csv.writer(f); w.writerow(cols)
        for s in out:
            w.writerow(["; ".join(v) if isinstance(v := s[c], list) else v for c in cols])

    talks = [s for s in out if s["speakers"]]
    print(f"sessions: {len(out)}  with speakers: {len(talks)}  with slides: {sum(1 for s in out if s['slides_url'])}")
    print(f"with repo: {sum(1 for s in out if s['repo'])}  days: "
          f"{sorted({(s['startsAt'] or '')[:10] for s in out if s['startsAt']})}")

if __name__ == "__main__":
    main()
