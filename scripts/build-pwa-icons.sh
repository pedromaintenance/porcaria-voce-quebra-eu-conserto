#!/usr/bin/env bash
# Regenera os ícones PWA com a arte escolhida. Pillow instalado pelo CI.
set -euo pipefail
cd "$(dirname "$0")/.."
test -s icon-192.png
python3 - <<'PY'
from pathlib import Path
from PIL import Image
import struct
source=Image.open('icon-192.png').convert('RGBA')
if source.size!=(192,192):
 raise SystemExit('Ícone-base diferente de 192x192')
source.resize((512,512),Image.Resampling.LANCZOS).save('icon-512.png',optimize=True)
base=Image.new('RGBA',(512,512),'#081727')
base.alpha_composite(source.resize((410,410),Image.Resampling.LANCZOS),(51,51))
base.save('icon-maskable-512.png',optimize=True)
for path,size in [('icon-192.png',192),('icon-512.png',512),('icon-maskable-512.png',512)]:
 data=Path(path).read_bytes()
 if data[:8]!=b'\x89PNG\r\n\x1a\n' or struct.unpack('>II',data[16:24])!=(size,size):
  raise SystemExit(f'Ícone inválido: {path}')
 print(f'{path}: {size}x{size}, {len(data)} bytes')
PY
