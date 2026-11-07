"""Gera os episódios do podcast a partir dos roteiros (H: apresentador, E: especialista).
Uso: python3 gerar_audio.py <modelo.onnx> <voices.bin> ep01 [ep02 ...]
Modelos Kokoro: github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)."""
import os, re, subprocess, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

BASE = os.path.dirname(os.path.abspath(__file__))
VOZES = {"H": ("pm_alex", 1.0), "E": ("pf_dora", 1.0)}
PAUSA = 0.45

def vinheta(sr):
    t = np.linspace(0, 1.6, int(sr * 1.6), endpoint=False)
    som = np.zeros_like(t)
    for i, f in enumerate([392.0, 523.25, 659.25]):
        ini = i * 0.25
        env = np.where(t >= ini, np.exp(-(t - ini) * 2.5), 0)
        som += 0.18 * env * np.sin(2 * np.pi * f * t)
    return som.astype(np.float32)

def main():
    k = Kokoro(sys.argv[1], sys.argv[2])
    for ep in sys.argv[3:]:
        linhas = open(os.path.join(BASE, "roteiros", ep + ".txt"), encoding="utf-8").read().splitlines()
        partes, sr = [], 24000
        for ln in linhas:
            m = re.match(r"^([HE]):\s*(.+)$", ln.strip())
            if not m:
                continue
            voz, vel = VOZES[m.group(1)]
            audio, sr = k.create(m.group(2), voice=voz, speed=vel, lang="pt-br")
            partes += [audio.astype(np.float32), np.zeros(int(sr * PAUSA), np.float32)]
        v = vinheta(sr)
        final = np.concatenate([v, np.zeros(int(sr * 0.3), np.float32)] + partes + [v])
        wav = os.path.join(BASE, ep + ".wav")
        sf.write(wav, final, sr)
        mp3 = os.path.join(BASE, "audios", ep + ".mp3")
        os.makedirs(os.path.dirname(mp3), exist_ok=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-af", "loudnorm=I=-16:TP=-1.5",
                        "-ac", "1", "-ar", "44100", "-b:a", "80k", mp3], check=True)
        os.remove(wav)
        print(ep, "ok", flush=True)

if __name__ == "__main__":
    main()
