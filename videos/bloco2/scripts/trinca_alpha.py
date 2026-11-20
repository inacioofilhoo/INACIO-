"""Converte a textura de trinca (fundo preto) em PNG com transparência real.
alpha = brilho máximo do pixel; cor = despremultiplicada. Reamostra para 1080x1920."""
import sys
import numpy as np
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB").resize((1080, 1920), Image.LANCZOS)
a = np.asarray(im).astype(np.float32) / 255.0
alpha = a.max(axis=2)
alpha = np.clip((alpha - 0.06) / 0.94, 0, 1) ** 0.9  # remove o "preto não-tão-preto" do fundo
rgb = np.where(alpha[..., None] > 1e-3, a / np.maximum(a.max(axis=2, keepdims=True), 1e-3), 0)
out = np.dstack([rgb, alpha])
Image.fromarray((out * 255).astype(np.uint8), "RGBA").save(dst)
