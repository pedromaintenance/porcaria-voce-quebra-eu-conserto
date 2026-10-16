#!/usr/bin/env python3
"""P.O.R.C.A.R.I.A. asset hotfix #3: isolate background of user-reviewed CAT 395.

Runs only against the original SHA-256 recorded in asset-review export.
Never removes dark outlines, yellow body paint or silver cylinder highlights.
"""
from pathlib import Path
import hashlib
import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSET = ROOT / "phaser/assets-review/assets/equipamentos/cat395.png"
SOURCE_SHA256 = "627cc13abc3755d33eaa810fa546d2f04af13ee86d16163c9cf27f91bf41ff66"


def apply():
    if not ASSET.exists():
        raise FileNotFoundError(ASSET)
    before = ASSET.read_bytes()
    sha = hashlib.sha256(before).hexdigest()
    if sha != SOURCE_SHA256:
        # Avoid changing an independently edited or already-corrected asset.
        raise RuntimeError("Source changed: expected " + SOURCE_SHA256 + ", found " + sha)
    im = Image.open(ASSET).convert("RGBA")
    a = np.array(im)
    rgb = a[:, :, :3].astype(np.int16)
    near_white = (rgb.min(axis=2) > 237) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 25) & (a[:, :, 3] > 0)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(near_white.astype(np.uint8), 8)
    remove = np.zeros(near_white.shape, dtype=bool)
    for component in range(1, count):
        if stats[component, cv2.CC_STAT_AREA] >= 75:
            remove |= labels == component
    removed = int(remove.sum())
    if not 27000 <= removed <= 32000:
        raise AssertionError(f"unexpected amount of removed background: {removed}")
    if np.any((a[remove, :3] < 237)):
        raise AssertionError("non-white equipment pixels selected for removal")
    a[remove, 3] = 0
    im_out = Image.fromarray(a, "RGBA")
    im_out.save(ASSET, optimize=True)
    print(f"CAT395 transparency fixed; {removed} white-background pixels -> alpha 0")


if __name__ == "__main__":
    apply()
