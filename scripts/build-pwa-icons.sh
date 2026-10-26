#!/usr/bin/env bash
# Regenera os ícones PWA a partir da arte-mestre já enviada ao GitHub.
set -euo pipefail
cd "$(dirname "$0")/.."
command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg necessário para gerar os ícones." >&2; exit 1; }
test -s icon-192.png
ffmpeg -nostdin -hide_banner -loglevel error -y -i icon-192.png \
 -vf 'scale=512:512:flags=lanczos,format=rgba' -frames:v 1 icon-512.png
ffmpeg -nostdin -hide_banner -loglevel error -y -i icon-192.png \
 -vf 'scale=410:410:flags=lanczos,pad=512:512:51:51:color=0x081727,format=rgba' \
 -frames:v 1 icon-maskable-512.png
python3 - <<'PY'
from pathlib import Path
import struct
for path, size in [('icon-192.png',192),('icon-512.png',512),('icon-maskable-512.png',512)]:
 data=Path(path).read_bytes()
 if data[:8]!=b'\x89PNG\r\n\x1a\n' or struct.unpack('>II',data[16:24])!=(size,size):
  raise SystemExit(f'Ícone inválido: {path}')
 print(f'{path}: {size}x{size}, {len(data)} bytes')
PY
