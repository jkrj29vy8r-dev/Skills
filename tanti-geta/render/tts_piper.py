#!/usr/bin/env python3
"""Vocea lui Tanti Geta cu Piper (ro_RO-mihai-medium) prin sherpa-onnx.

Primește pe stdin o listă JSON [{"text": "...", "expr": "socata", "out": "l0.wav"}, ...]
și scrie câte un WAV (mono, 22050 Hz) pentru fiecare replică.

    python3 tts_piper.py MODEL_DIR < replici.json
"""
import json
import os
import sys
import wave

import numpy as np
import sherpa_onnx

# Viteză (1 = normal) pe expresie: șocată și veselă mai repede, bănuitoare și șoptită mai rar.
SPEED = {
    "normal": 1.05, "explica": 1.05, "mirata": 1.1, "banuitoare": .95, "vesela": 1.1,
    "suparata": 1.12, "socata": 1.15, "rade": 1.1, "sopteste": .92, "umeri": 1.0,
}


def main():
    model_dir = sys.argv[1]
    name = next(f for f in os.listdir(model_dir) if f.endswith(".onnx"))
    cfg = sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                model=os.path.join(model_dir, name),
                tokens=os.path.join(model_dir, "tokens.txt"),
                data_dir=os.path.join(model_dir, "espeak-ng-data"),
                noise_scale=0.75,      # mai multă variație în intonație
                noise_scale_w=0.9,
                length_scale=1.0,
            ),
            num_threads=4,
        ),
    )
    tts = sherpa_onnx.OfflineTts(cfg)
    for job in json.load(sys.stdin):
        audio = tts.generate(job["text"], sid=0, speed=SPEED.get(job.get("expr"), 1.05))
        pcm = (np.clip(np.array(audio.samples), -1, 1) * 32767).astype("<i2")
        with wave.open(job["out"], "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(audio.sample_rate)
            w.writeframes(pcm.tobytes())
        print(job["out"], flush=True)


if __name__ == "__main__":
    main()
