#!/usr/bin/env python3
"""Issue #4: remove two unattached outer spurs of historical CAT6030 bucket.
Source is preserved in Git history. Review required; never auto-approve.
"""
from pathlib import Path
from PIL import Image,ImageDraw
from collections import Counter
import hashlib,json,re,subprocess,io
ROOT=Path(__file__).resolve().parents[1]
R=ROOT/"phaser/assets-review"
SRC=R/"assets/equipamentos/historico/cat6030_conceito_original.png"
asset_id="equipamentos_historico_cat6030_conceito_original_png"
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 baseline_bytes=subprocess.check_output(["git","show","72e8a54ae909828fb27eca0edbfb40ffe8856570:phaser/assets-review/assets/equipamentos/historico/cat6030_conceito_original.png"],cwd=ROOT)
 source=Image.open(io.BytesIO(baseline_bytes)).convert("RGBA")
 width,height=source.size
 if width<512 or height<512:raise ValueError("Resolution smaller than expected")
 original=source.copy()
 # Geometric reference: 800 x 800 screenshot reviewed for the issue.
 # Two disconnected pointed flanges outside bucket's main tooth line.
 poly=[
 [(32,698),(32,690),(42,677),(52,671),(50,690),(39,702)],
 [(315,670),(332,676),(338,684),(336,691),(316,696)],
 ]
 dr=ImageDraw.Draw(source)
 for coords in poly:
  scaled=[(round(x*width/800),round(y*height/800)) for x,y in coords]
  dr.polygon(scaled,fill=(0,0,0,0))
 if source.size!=original.size:raise ValueError("dimensions changed")
 changed=sum(a!=b for a,b in zip(source.tobytes(),original.tobytes()))//4
 removed_alpha=sum(a>0 and b==0 for a,b in zip(original.getchannel("A").tobytes(),source.getchannel("A").tobytes()))
 if removed_alpha<20 or removed_alpha>7000:raise ValueError(f"unsafe pixel removal count: {removed_alpha}")
 if any(b>0 and a==0 for a,b in zip(original.getchannel("A").tobytes(),source.getchannel("A").tobytes())):raise ValueError("Unexpected creation of pixels")
 sh_before=hashlib.sha256(baseline_bytes).hexdigest();source.save(SRC,optimize=True);sh_after=digest(SRC)
 def crop(im):
  thumb=im.copy()
  thumb.thumbnail((800,800),Image.Resampling.LANCZOS)
  bg=Image.new("RGBA",thumb.size,(194,202,208,255));bg.alpha_composite(thumb)
  xx=round(345*thumb.width/800);yy=round(565*thumb.height/800)
  return bg.crop((0,yy,xx,thumb.height)).convert("RGB")
 a,b=crop(original),crop(source)
 output=Image.new("RGB",(a.width*2,max(a.height,b.height)+32),(20,28,39))
 output.paste(a,(0,32));output.paste(b,(a.width,32))
 d=ImageDraw.Draw(output);d.text((12,8),"CAT6030 Historical | BEFORE",fill="#ffffff");d.text((a.width+12,8),"CAT6030 Historical | AFTER",fill="#ffffff")
 preview=R/"previews/issue04_cat6030_before_after.png"
 output.save(preview,optimize=True)
 catfile=R/"catalogo.json";actfile=R/"ativos.json"
 catalog=json.loads(catfile.read_text("utf-8"));active=json.loads(actfile.read_text("utf-8"))
 item=next(x for x in catalog["images"] if x["id"]==asset_id)
 if item["user_decision"]!="NAO_OK":raise ValueError("must be rejected in original review")
 item["workflow_state"]="ready-for-review"
 item["fix"]={"issue":4,"status":"technical-silhouette-fix-awaiting-user-review",
 "source_sha256":sh_before,"corrected_sha256":sh_after,"removed_alpha_pixels":removed_alpha,
 "validation":"alpha only removed inside two user-rejected outer spurs; rest of machine unchanged",
 "preview":str(preview.relative_to(ROOT))}
 for entry in active["assets"]:
  if entry["id"]==asset_id:entry["state"]="ready-for-review"
 catalog["workflow_counts"]=dict(Counter(x["workflow_state"] for x in catalog["images"]))
 catfile.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+"\n","utf-8")
 actfile.write_text(json.dumps(active,ensure_ascii=False,indent=2)+"\n","utf-8")
 htmlpath=R/"avaliar-sprites-rodada02.html";html=htmlpath.read_text("utf-8")
 match=re.search(r'<script id="data" type="application/json">([\s\S]*?)</script>',html)
 items=json.loads(match.group(1))
 for a in items:
  if a["id"]==asset_id:
   a["state"]="ready-for-review";a["changed"]=True
 content=json.dumps(items,ensure_ascii=False).replace("<",r"\u003c")
 html=re.sub(r'<script id="data" type="application/json">[\s\S]*?</script>',lambda match:'<script id="data" type="application/json">'+content+'</script>',html,count=1)
 htmlpath.write_text(html,"utf-8")
 report={"issue":4,"changed_pixels_rgba":changed,"removed_alpha_pixels":removed_alpha,"source":sh_before,"fixed":sh_after,"preview":str(preview.relative_to(ROOT)),"state":"ready-for-review"}
 (R/"previews/issue04_cat6030_report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n","utf-8")
 print(json.dumps(report,indent=2))
if __name__=="__main__":main()
