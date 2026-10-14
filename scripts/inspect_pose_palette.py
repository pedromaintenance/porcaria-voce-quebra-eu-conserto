#!/usr/bin/env python3
"""Non-destructive ROI analysis for character palette defects (#13-#15).
This diagnostic writes no changes to game sprites.
"""
from __future__ import annotations
from collections import Counter
from pathlib import Path
from PIL import Image
import json, hashlib
ROOT=Path(__file__).resolve().parents[1]
DIR=ROOT/"phaser/assets-review/assets/personagens/elenco"
cases={
"ele_davi":["idle","extinguisher","inspect","positive","spritesheet"],
"pcm_joao":["idle","extinguisher","inspect","positive","spritesheet"],
"mec_rafael":["idle","positive","spritesheet"],
}
regions={"helmet":(75,55,213,149),"forehead":(105,84,185,135),"face":(115,112,188,169)}
def type_pixel(p):
 r,g,b,a=p
 if a<64:return "."
 if max(r,g,b)<55:return "K"
 if min(r,g,b)>175 and max(r,g,b)-min(r,g,b)<35:return "W"
 if r>130 and g>100 and b<95 and r>g*1.06:return "Y"
 if r>120 and r>g*1.55 and g>65 and b<100:return "O"
 if abs(r-g)<32 and abs(g-b)<32:return "G"
 if r>70 and r>g*1.25 and g>40 and b<140:return "S"
 return "o"
def analyze(image):
 im=image.convert("RGBA"); w,h=im.size
 block={"size":[w,h],"sha256":hashlib.sha256(image.tobytes()).hexdigest(),"zones":{}}
 if w>500:return block
 for name,(x1,y1,x2,y2) in regions.items():
  x2=min(w,x2);y2=min(h,y2)
  hist=Counter(type_pixel(im.getpixel((x,y))) for y in range(y1,y2) for x in range(x1,x2))
  palettes=Counter(im.getpixel((x,y))[:3] for y in range(y1,y2) for x in range(x1,x2) if im.getpixel((x,y))[3]>100)
  grid=[]
  for yy in range(y1,y2,5):
   grid.append(f"{yy:03d} "+"".join(type_pixel(im.getpixel((x,yy))) for x in range(x1,x2,5)))
  block["zones"][name]={"hist":dict(hist),"colors":palettes.most_common(12),"map":grid}
 return block
records={}
for character,poses in cases.items():
 records[character]={}
 for pose in poses:
  path=DIR/character/(pose+".png")
  with Image.open(path) as source:
   records[character][pose]=analyze(source)
for character in cases:
 sheet=Image.open(DIR/character/"spritesheet.png").convert("RGBA")
 poses=["alert","clipboard","extinguisher","idle","inspect","point","positive","radio"]
 comparison={}
 for i in range(8):
  cell=sheet.crop(((i%4)*260,(i//4)*300,(i%4+1)*260,(i//4+1)*300))
  differences={}
  for pose in poses:
   candidate=Image.open(DIR/character/(pose+".png")).convert("RGBA")
   if candidate.size==cell.size:
    differences[pose]=sum(a!=b for a,b in zip(candidate.tobytes(),cell.tobytes()))
  comparison[str(i)]=sorted(differences.items(),key=lambda x:x[1])[:3]
 records[character]["spritesheet"]["frameMatches"]=comparison
(Path(__file__).resolve().parent/"pose-palette-diagnostics.json").write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding="utf-8")
print("Generated pose palette diagnostics",list(records))
