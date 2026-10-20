#!/usr/bin/env python3
"""Inspeciona os limites alfa dos quatro quadros de cada atlas da Bia."""
from PIL import Image, ImageDraw
from io import BytesIO
import base64
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
BASE=ROOT/"phaser-play/assets/characters/bia"
for name in ("field","feedback","coaching","inspection"):
    with Image.open(BASE/f"bia-{name}-4poses.webp") as img:
        image=img.convert("RGBA")
        print(f"ASSET {name}: {image.size} / {image.mode}")
        assert image.size==(1160,1244)
        for i in range(4):
            col=i%2; row=i//2
            cell=image.crop((580*col,622*row,580*(col+1),622*(row+1)))
            alpha=cell.getchannel("A")
            bbox=alpha.getbbox()
            rows=[sum(1 for x in range(580) if alpha.getpixel((x,y))>12) for y in (0,1,2,4,8,12,16,24,32,50,75)]
            top_x=[x for x in range(580) if alpha.getpixel((x,0))>12]
            edge_left=sum(1 for y in range(622) if alpha.getpixel((0,y))>12)
            edge_right=sum(1 for y in range(622) if alpha.getpixel((579,y))>12)
            print(f"  frame={i},bbox={bbox},toprows={rows},top_x={((min(top_x),max(top_x)) if top_x else None)},left={edge_left},right={edge_right}")

# Prévia compacta: permite inspeção visual sem modificar os atlases de origem.
with Image.open(BASE/"bia-field-4poses.webp") as atlas:
    im=atlas.convert("RGBA")
    contact=Image.new("RGB",(600,644),(240,232,209))
    for idx in range(4):
        x=idx%2;y=idx//2
        crop=im.crop((x*580,y*622,(x+1)*580,(y+1)*622))
        thumb=crop.resize((300,322),Image.Resampling.LANCZOS)
        contact.paste(thumb,(x*300,y*322),thumb)
    out=BytesIO();contact.save(out,"JPEG",quality=72,optimize=True)
    print("BIA_FIELD_CONTACT_JPEG_B64="+base64.b64encode(out.getvalue()).decode("ascii"))
    # Crop ampliado dos capacetes para localizar arte recortada na fonte.
    caps=Image.new("RGB",(760,370),(240,232,209))
    for ix,frame in enumerate((0,3)):
        x=frame%2;y=frame//2
        cap=im.crop((x*580+75,y*622+40,x*580+505,y*622+260))
        cap.thumbnail((380,370),Image.Resampling.LANCZOS)
        caps.paste(cap,(ix*380,0),cap)
    out=BytesIO();caps.save(out,"JPEG",quality=82,optimize=True)
    print("BIA_FIELD_CAPS_JPEG_B64="+base64.b64encode(out.getvalue()).decode("ascii"))
