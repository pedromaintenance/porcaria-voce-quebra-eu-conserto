#!/usr/bin/env python3
"""Asset-review validation for the P.O.R.C.A.R.I.A. Phaser prototype.

Requires: stdlib + Pillow. Missing images are reported but not auto-approved.
"""
from pathlib import Path
from collections import Counter
import hashlib
import json
import sys
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
REVIEW_ROOT=ROOT/"phaser/assets-review"
catalog=json.loads((REVIEW_ROOT/"catalogo.json").read_text("utf-8"))
review=json.loads((REVIEW_ROOT/"revisao_usuario_2026-10-14.json").read_text("utf-8"))
active=json.loads((REVIEW_ROOT/"ativos.json").read_text("utf-8"))
index={item["asset"]:item for item in review["items"]}
errors=[]
warnings=[]
stats=Counter()
if len(catalog["images"])!=115 or len(review["items"])!=115:
    errors.append("expected exactly 115 reviewed assets")
if review["summary"]!={"yes":41,"no":74,"unfinished":0,"notesMissing":9,"total":115,"reviewed":115}:
    errors.append("unexpected source review counts")

for entry in catalog["images"]:
    rel="assets/"+entry["filename"]
    item=index.get(rel)
    if item is None:
        errors.append("review item missing for "+rel)
        continue
    if entry["user_decision"]!=item["decision"] or entry["user_comment"]!=item["comment"]:
        errors.append("decision/comment mismatch: "+rel)
    if entry["workflow_state"]=="archived" and item["decision"]!="NAO_OK":
        errors.append("approved asset was archived: "+rel)
    if entry["workflow_state"]=="approved" and item["decision"]!="OK" and entry.get("reapproval",{}).get("decision")!="OK":
        errors.append("unapproved asset marked as approved without explicit reapproval: "+rel)
    if entry["user_decision"]=="NAO_OK" and not entry.get("review_issue_number"):
        errors.append("missing issue for rejected asset: "+rel)
    dest=REVIEW_ROOT/rel
    stats[entry["workflow_state"]]+=1
    if dest.is_file():
        with Image.open(dest) as im:
            if im.format!="PNG":
                errors.append("not a PNG: "+rel)
        digest=hashlib.sha256(dest.read_bytes()).hexdigest()
        expected=entry.get("fix",{}).get("corrected_sha256",item["sha256"])
        if digest!=expected:
            errors.append("SHA-256 mismatch for "+rel+" (got "+digest+")")
        if entry["github_binary_status"]!="uploaded":
            errors.append("file exists but marked missing: "+rel)
        stats["present"]+=1
    else:
        warnings.append("not uploaded: "+rel)
        stats["missing"]+=1
        if entry["github_binary_status"]!="pending-upload":
            errors.append("file missing but marked uploaded: "+rel)

source_ids={x["id"] for x in catalog["images"]}
active_ids={x["id"] for x in active["assets"]}
if len(active_ids)!=len(active["assets"]):
    errors.append("duplicate ids in active-assets manifest")
if source_ids != active_ids|{x["id"] for x in catalog["images"] if x["workflow_state"]=="archived"}:
    errors.append("active + archived partition does not cover the catalog")
if any(x["workflow_state"]=="archived" and x["id"] in active_ids for x in catalog["images"]):
    errors.append("archived item leaked into active-assets manifest")
if stats["approved"] != active.get("approvedCount"):
    errors.append("approvedCount does not match actual approvals")
if sum(stats[k] for k in ("approved", "archived", "needs-revision", "awaiting-clarification", "ready-for-review")) != len(catalog["images"]):
    errors.append("workflow state count differs from total catalog")
for state, expected in catalog.get("workflow_counts", {}).items():
    if stats[state] != expected:
        errors.append(f"workflow_counts mismatch in {state}: {stats[state]} != {expected}")
# Full spritesheet frame equivalence for every actor. Asset-review image files are source of truth.
frame_order=["idle","positive","point","clipboard","radio","alert","inspect","extinguisher"]
for actor in ["ele_davi","pcm_joao","mec_rafael","mec_ana","ele_bia","pcm_clara","mec_lia","brig_nina"]:
    folder=REVIEW_ROOT/"assets/personagens/elenco"/actor
    sheet=folder/"spritesheet.png"
    if not sheet.exists():
        errors.append("missing spritesheet: "+actor)
        continue
    with Image.open(sheet) as im:
        atlas=im.convert("RGBA")
    if atlas.size!=(1040,600):
        errors.append(f"invalid spritesheet size: {actor} {atlas.size}")
        continue
    for i,pose in enumerate(frame_order):
        p=folder/(pose+".png")
        if not p.exists():
            errors.append(f"missing pose: {actor}/{pose}")
            continue
        with Image.open(p) as src:
            frame=src.convert("RGBA")
        if frame.size!=(260,300):
            errors.append(f"wrong pose size: {actor}/{pose}")
            continue
        x=(i%4)*260; y=(i//4)*300
        if atlas.crop((x,y,x+260,y+300)).tobytes()!=frame.tobytes():
            errors.append(f"spritesheet frame mismatch: {actor}/{pose}")
# Ensure gallery's embedded manifest is valid JSON and remains consistent with catalog.
import re
gallery=(REVIEW_ROOT/"avaliar-sprites-rodada02.html").read_text("utf-8")
match=re.search(r'<script id="data" type="application/json">([\s\S]*?)</script>',gallery)
if not match:
    errors.append("review HTML lacks embedded asset data")
else:
    try:
        shown=json.loads(match.group(1))
        if len(shown)!=90:errors.append(f"gallery has {len(shown)} images instead of 90")
        byid={x["id"]:x for x in catalog["images"]}
        for x in shown:
            if x["state"]!=byid[x["id"]]["workflow_state"]:
                errors.append("stale HTML state: "+x["id"])
    except (ValueError,KeyError) as exc:
        errors.append("invalid HTML gallery data: "+str(exc))
print("STATUS",dict(stats))
for w in warnings:
    print("PENDING",w)
for err in errors:
    print("ERROR",err,file=sys.stderr)
if errors:
    raise SystemExit(1)
print("PASS — asset catalog consistent; missing files tracked as pending, not approved")
