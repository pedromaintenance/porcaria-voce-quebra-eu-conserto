#!/usr/bin/env python3
"""Inspeciona os limites alfa dos quatro quadros de cada atlas da Bia."""
from PIL import Image
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
