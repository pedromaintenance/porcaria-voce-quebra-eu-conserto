#!/usr/bin/env python3
"""Repare defeitos cromáticos documentados em issues #13-#15, sem redesenho.
As alterações são pontuais e exigem aprovação visual posterior.
"""
from pathlib import Path
from PIL import Image, ImageDraw
from collections import Counter
import argparse,hashlib,json,re
ROOT=Path(__file__).resolve().parents[1]
R=ROOT/"phaser/assets-review"
DIR=R/"assets/personagens/elenco"
FRAME_ORDER=["idle","positive","point","clipboard","radio","alert","inspect","extinguisher"]
CASES={
 "ele_davi":{"issue":13,"skin":(148,90,64),"helmet":"yellow","poses":["extinguisher","inspect","positive"]},
 "pcm_joao":{"issue":14,"skin":(183,113,74),"helmet":"white","poses":["extinguisher","inspect","positive"]},
 "mec_rafael":{"issue":15,"skin":(241,173,117),"helmet":"yellow","poses":["positive"]},
}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def fix_pixel(r,g,b,a,pose,character,x,y):
 if a==0:return None
 if pose in ("extinguisher","inspect") and 85<=x<201 and 115<=y<148:
  if character=="ele_davi" and 49<=r<=160 and g>=r+6 and b>=g+4 and b<185:
   t=max(0,min(1,(r-55)/95))
   return (round(170+73*t),round(130+80*t),round(13+17*t),a)
  if character=="pcm_joao" and r>=218 and 80<=g<=174 and b<=75:
   shade=max(190,min(251,190+round((g-80)*.68)))
   return (shade,min(255,shade+3),min(255,shade+7),a)
 if pose=="positive" and 130<=x<184 and 82<=y<90:
  # Banda artificial na testa sob a aba; preservar contornos escuros
  if character in ("ele_davi","mec_rafael") and r>185 and g>142 and b<105 and r>g*1.05:
   base=CASES[character]["skin"]
   shift=max(-8,min(9,round(((r+g+b)/3-156)/3)))
   return tuple(max(0,min(255,q+shift)) for q in base)+(a,)
  if character=="pcm_joao" and min(r,g,b)>170 and max(r,g,b)-min(r,g,b)<39:
   base=CASES[character]["skin"]
   shift=max(-8,min(9,round(((r+g+b)/3-220)/5)))
   return tuple(max(0,min(255,q+shift)) for q in base)+(a,)
 return None

def edit_pose(path,pose,character):
 im=Image.open(path).convert("RGBA")
 if im.size!=(260,300):raise ValueError(f"unexpected size: {path} {im.size}")
 source=im.copy(); pixels=im.load()
 edited=0;bbox=[999,999,-1,-1]
 for y in range(65,155):
  for x in range(70,215):
   old=pixels[x,y];new=fix_pixel(*old,pose,character,x,y)
   if new is not None and new!=old:
    pixels[x,y]=new;edited+=1
    bbox=[min(bbox[0],x),min(bbox[1],y),max(bbox[2],x),max(bbox[3],y)]
 if edited==0: raise ValueError(f"no color defects matched: {character}/{pose}. Investigate source before continuing.")
 if edited>3000:raise ValueError(f"unsafe oversized edit {character}/{pose}: {edited}")
 if im.getchannel("A").tobytes()!=source.getchannel("A").tobytes():raise ValueError("alpha changed")
 beforehash=sha(path)
 im.save(path,format="PNG",optimize=True)
 return {"pose":pose,"changed_pixels":edited,"bbox":bbox,"source_sha256":beforehash,"corrected_sha256":sha(path),"before":source,"after":im}
def update_sheet(character,changes):
 path=DIR/character/"spritesheet.png"
 sheet=Image.open(path).convert("RGBA")
 if sheet.size!=(1040,600):raise ValueError("Unexpected spritesheet size")
 for change in changes:
  pose=change["pose"];idx=FRAME_ORDER.index(pose);x=idx%4*260;y=idx//4*300
  oldcell=sheet.crop((x,y,x+260,y+300))
  if oldcell.tobytes()!=change["before"].tobytes():raise ValueError(f"spritesheet frame mismatch: {character}/{pose} index {idx}")
  sheet.paste(change["after"],(x,y))
 sourcehash=sha(path);sheet.save(path,format="PNG",optimize=True)
 for change in changes:
  pose=change["pose"];idx=FRAME_ORDER.index(pose);x=idx%4*260;y=idx//4*300
  if sheet.crop((x,y,x+260,y+300)).tobytes()!=change["after"].tobytes():raise ValueError("incorrect sheet frame")
 return {"source_sha256":sourcehash,"corrected_sha256":sha(path),"frame_order":FRAME_ORDER}
def review_image(character,changes):
 # Contact sheet uses fixed checkerboard under transparency
 scale=2
 w=260*scale
 rows=len(changes);out=Image.new("RGB",(w*2,rows*(300*scale+38)),(16,22,31))
 d=ImageDraw.Draw(out)
 for i,c in enumerate(changes):
  d.text((12,i*(300*scale+38)+12),character+"/"+c["pose"]+" | BEFORE",fill="white")
  d.text((w+12,i*(300*scale+38)+12),character+"/"+c["pose"]+" | AFTER",fill="white")
  for j,key in enumerate(["before","after"]):
   base=Image.new("RGBA",(260,300),(185,193,198,255))
   src=c[key];base.alpha_composite(src)
   out.paste(base.convert("RGB").resize((w,600),Image.Resampling.NEAREST),(j*w,i*(300*scale+38)+38))
 name="correcao_"+character+".png";dest=R/"previews"/name;dest.parent.mkdir(exist_ok=True)
 out.save(dest)
 return str(dest.relative_to(ROOT))
def main(character):
 c=CASES[character]
 paths=DIR/character
 changes=[edit_pose(paths/(pose+".png"),pose,character) for pose in c["poses"]]
 sh=update_sheet(character,changes)
 preview=review_image(character,changes)
 catalogpath=R/"catalogo.json"
 activpath=R/"ativos.json"
 cat=json.loads(catalogpath.read_text("utf-8"))
 active=json.loads(activpath.read_text("utf-8"))
 asset_path_prefix=f"personagens/elenco/{character}/"
 hashes={e["pose"]:e for e in changes}
 hashes["spritesheet"]=sh
 for item in cat["images"]:
  rel=item["filename"]
  if not rel.startswith(asset_path_prefix):continue
  pose=Path(rel).stem
  if pose not in hashes:continue
  if item["user_decision"]!="NAO_OK":raise ValueError("Attempted to change previously approved pose "+rel)
  item["workflow_state"]="ready-for-review"
  detail=hashes[pose]
  item["fix"]={"issue":c["issue"],"status":"technical-pixel-fix-awaiting-user-review",
     "source_sha256":detail["source_sha256"],
     "corrected_sha256":detail["corrected_sha256"],
     "validation":"same RGBA dimensions; unchanged alpha; original approved poses untouched; sheet frames exact",
     "preview":preview}
  if pose!="spritesheet":item["fix"]["changed_pixels"]=detail["changed_pixels"]
  for x in active["assets"]:
   if x["id"]==item["id"]:x["state"]="ready-for-review"
 cat["workflow_counts"]=dict(Counter(item["workflow_state"] for item in cat["images"]))
 catalogpath.write_text(json.dumps(cat,ensure_ascii=False,indent=2)+"\n","utf-8")
 activpath.write_text(json.dumps(active,ensure_ascii=False,indent=2)+"\n","utf-8")
 report={"character":character,"issue":c["issue"],"poses":[{k:v for k,v in e.items() if k not in ("before","after")} for e in changes],"spritesheet":sh,"preview":preview,"status":"ready-for-review-not-approved"}
 reportpath=R/"previews"/("correcao_"+character+".json")
 reportpath.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n","utf-8")
 # Update embedded gallery manifest; imagery must point at branch, not old commit.
 gallery=R/"avaliar-sprites-rodada02.html"
 text=gallery.read_text("utf-8")
 items=json.loads(re.search(r'<script id="data" type="application/json">([\s\S]*?)</script>',text).group(1))
 fresh={x["id"]:x for x in cat["images"]}
 for a in items:
  source=fresh[a["id"]]
  a["state"]=source["workflow_state"]
  a["changed"]=bool(source.get("fix"))
  a["userApprovedThisRound"]=bool(source.get("reapproval",{}).get("decision")=="OK")
  a["issue"]=source.get("review_issue_number")
 text=re.sub(r'<script id="data" type="application/json">[\s\S]*?</script>',lambda m:'<script id="data" type="application/json">'+json.dumps(items,ensure_ascii=False).replace("<",r"\u003c")+'</script>',text,count=1)
 text=re.sub(r"const sha='[^']+';", "const sha='fix/assets-review-20261014';",text,count=1)
 gallery.write_text(text,"utf-8")
 print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=="__main__":
 p=argparse.ArgumentParser()
 p.add_argument("--character",choices=sorted(CASES),required=True)
 args=p.parse_args()
 main(args.character)
