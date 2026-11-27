#!/usr/bin/env python3
"""Vocea lui Tanti Geta cu Microsoft „Alina” (ro-RO-AlinaNeural) prin edge-tts.

Primește pe stdin o listă JSON [{"text": "...", "expr": "socata", "out": "l0.mp3"}, ...]
și scrie câte un MP3 pentru fiecare replică, plus un .json cu momentul fiecărui cuvânt. Textul este trimis serviciului de voce
Microsoft (speech.platform.bing.com).

    pip install edge-tts
    python3 tts_alina.py < replici.json
"""
import asyncio
import json
import os
import ssl
import sys

import edge_tts
import edge_tts.communicate as comm

VOICE = os.environ.get("GETA_VOICE", "ro-RO-AlinaNeural")

# Ritm, ton și volum pe expresie (Alina are o voce tânără: tonul puțin mai jos o face mai „tanti”).
PROSODY = {
    "normal":     ("+6%", "-6Hz", "+0%"),
    "explica":    ("+6%", "-5Hz", "+0%"),
    "mirata":     ("+10%", "+6Hz", "+0%"),
    "banuitoare": ("-2%", "-12Hz", "+0%"),
    "vesela":     ("+10%", "+2Hz", "+0%"),
    "suparata":   ("+12%", "-8Hz", "+5%"),
    "socata":     ("+14%", "+10Hz", "+5%"),
    "rade":       ("+10%", "+4Hz", "+0%"),
    "sopteste":   ("-6%", "-14Hz", "-35%"),
    "umeri":      ("+2%", "-4Hz", "+0%"),
}

# În medii cu proxy (HTTPS_PROXY) și certificat propriu (SSL_CERT_FILE), edge-tts trebuie să le folosească explicit.
PROXY = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
CA = os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None)
if CA:
    comm._SSL_CTX = ssl.create_default_context(cafile=CA)


async def one(job, sem):
    rate, pitch, vol = PROSODY.get(job.get("expr"), PROSODY["normal"])
    async with sem:
        for attempt in range(4):
            try:
                c = edge_tts.Communicate(job["text"], VOICE, rate=rate, pitch=pitch, volume=vol, boundary="WordBoundary", proxy=PROXY)
                audio, words = bytearray(), []
                async for ch in c.stream():
                    if ch["type"] == "audio":
                        audio += ch["data"]
                    elif ch["type"] == "WordBoundary":   # offset/duration în unități de 100 ns
                        words.append({"t": ch["text"], "o": ch["offset"] / 1e7, "d": ch["duration"] / 1e7})
                with open(job["out"], "wb") as f:
                    f.write(audio)
                with open(job["out"] + ".json", "w", encoding="utf-8") as f:
                    json.dump(words, f, ensure_ascii=False)
                print(job["out"], flush=True)
                return
            except Exception as e:  # rețea instabilă: mai încearcă
                if attempt == 3:
                    raise
                print(f"reîncerc {job['out']}: {e}", file=sys.stderr)
                await asyncio.sleep(1.5 * (attempt + 1))


async def main():
    jobs = json.load(sys.stdin)
    sem = asyncio.Semaphore(3)
    await asyncio.gather(*(one(j, sem) for j in jobs))


if __name__ == "__main__":
    asyncio.run(main())
