#!/usr/bin/env python3
"""Deriva sprite sheet field corrigido da Bia sem redesenhar pixel art.
Restaura topo dos capacetes dos quadros 2 e 3 a partir dos quadros
superiores do próprio WebP, com alinhamento medido e feathering.
Não altera as dimensões, pose, ordem nem atlas originais.
"""
from pathlib import Path
from PIL import Image, ImageChops, ImageStat
from io import BytesIO
import base64
import hashlib

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/"phaser-play/assets/characters/bia/bia-field-4poses.webp"
DEST=ROOT/"phaser-play/assets/characters/bia/bia-field-repaired-4poses.webp"
WIDTH,HEIGHT=580,622

def score(ref, target, dx, dy):
    # Compara visor do capacete e faixa de cabelos em área comum.
    shifted=Image.new("RGBA",target.size)
    shifted.paste(ref,(dx,dy))
    a=(145,119,440,174)
    sa=shifted.crop(a)
    ta=target.crop(a)
    # Exclui zonas transparentes ao calcular a diferença.
    mask=ImageChops.multiply(sa.getchannel("A"),ta.getchannel("A"))
    if not mask.getbbox():
        return 1e8
    diff=ImageChops.difference(sa.convert("RGB"),ta.convert("RGB"))
    return sum(ImageStat.Stat(diff,mask=mask).mean)

def restore(ref, target, label):
    results=[(score(ref,target,dx,dy),dx,dy)
             for dy in range(-14,27,2) for dx in range(-18,19,2)]
    best,dx,dy=min(results)
    print(f"HELMET_MATCH {label}: dx={dx} dy={dy} score={best:.2f}")
    shifted=Image.new("RGBA",target.size)
    shifted.paste(ref,(dx,dy))
    # Restauro exclusivo do segmento superior do capacete.
    # Abaixo de y=118, transição de 22px em direção aos pixels originais.
    mask=Image.new("L",target.size)
    mm=mask.load()
    for y in range(55,141):
        strength=255 if y<118 else round(255*max(0,(140-y)/22))
        for x in range(118,470):
            mm[x,y]=strength
    mask=ImageChops.multiply(mask,shifted.getchannel("A"))
    result=Image.composite(shifted,target,mask)
    return result

def main():
    with Image.open(SOURCE) as original:
        sheet=original.convert("RGBA")
    assert sheet.size==(1160,1244)
    frames=[sheet.crop((i%2*WIDTH,i//2*HEIGHT,(i%2+1)*WIDTH,(i//2+1)*HEIGHT)) for i in range(4)]
    frames[2]=restore(frames[0],frames[2],"field[2] ← field[0]")
    frames[3]=restore(frames[1],frames[3],"field[3] ← field[1] (celular)")
    out=Image.new("RGBA",sheet.size)
    for i,fr in enumerate(frames):
        out.paste(fr,(i%2*WIDTH,i//2*HEIGHT))
    DEST.parent.mkdir(parents=True,exist_ok=True)
    out.save(DEST,format="WEBP",lossless=True,method=6)
    print("BIA_REPAIRED sha256="+hashlib.sha256(DEST.read_bytes()).hexdigest()+" size="+str(DEST.stat().st_size))
    assert out.size==sheet.size
    assert all(out.crop((i%2*WIDTH,i//2*HEIGHT,(i%2+1)*WIDTH,(i//2+1)*HEIGHT)).size==(WIDTH,HEIGHT) for i in range(4))
    for i in (0,1):
        assert frames[i].tobytes()==sheet.crop((i%2*WIDTH,0,(i%2+1)*WIDTH,HEIGHT)).tobytes()
    # Compare antes/depois, sem checkerboard nem reescala da arte salva.
    original3=sheet.crop((580,622,1160,1244))
    repaired3=out.crop((580,622,1160,1244))
    contact=Image.new("RGB",(600,345),(240,232,209))
    for col,img in enumerate((original3,repaired3)):
        thumb=img.resize((300,322),Image.Resampling.LANCZOS)
        contact.paste(thumb,(col*300,20),thumb)
    from PIL import ImageDraw
    draw=ImageDraw.Draw(contact)
    draw.text((7,3),"ORIGINAL",fill=(20,20,20))
    draw.text((315,3),"CAPACETE RESTAURADO",fill=(20,20,20))
    buf=BytesIO();contact.save(buf,format="JPEG",quality=76,optimize=True)
    print("BIA_REPAIRED_PREVIEW_JPEG_B64="+base64.b64encode(buf.getvalue()).decode("ascii"))
if __name__=="__main__":
    main()
