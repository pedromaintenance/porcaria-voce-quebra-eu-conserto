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
print("STATUS",dict(stats))
for w in warnings:
    print("PENDING",w)
for err in errors:
    print("ERROR",err,file=sys.stderr)
if errors:
    raise SystemExit(1)
print("PASS — asset catalog consistent; missing files tracked as pending, not approved")
