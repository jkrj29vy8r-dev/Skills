#!/usr/bin/env python3
"""Află unde începe fiecare replică într-o înregistrare lungă (de ex. vocea Elenei, generată dintr-o bucată).

    python3 align-voice.py voice/<episod>/lines.json bucati/bucata-0.mp3 [--save]

Cum: același text e citit și de Microsoft Alina (edge-tts), care dă momentul exact al fiecărui cuvânt.
Cele două înregistrări se aliniază automat (DTW pe MFCC), iar granițele dintre replici din varianta
Alinei se mută pe înregistrarea Elenei și se lipesc de cea mai apropiată pauză.
Cu --save scrie în lines.json: "take" (fișierul) și "cuts" (secundele de început ale replicilor 1..N-1).
"""
import asyncio
import json
import os
import re
import ssl
import sys

import librosa
import numpy as np
import edge_tts
import edge_tts.communicate as comm

SR, HOP = 16000, 160  # 10 ms
PROXY = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
CA = os.environ.get('SSL_CERT_FILE') or ('/root/.ccr/ca-bundle.crt' if os.path.exists('/root/.ccr/ca-bundle.crt') else None)
if CA:
    comm._SSL_CTX = ssl.create_default_context(cafile=CA)
letters = lambda s: len(re.sub(r'[^\wăâîșțĂÂÎȘȚ]', '', s))


async def alina(text, out):
    c = edge_tts.Communicate(text, 'ro-RO-AlinaNeural', rate='+10%', boundary='WordBoundary', proxy=PROXY)
    audio, words = bytearray(), []
    async for ch in c.stream():
        if ch['type'] == 'audio':
            audio += ch['data']
        elif ch['type'] == 'WordBoundary':
            words.append((ch['text'], ch['offset'] / 1e7, ch['duration'] / 1e7))
    open(out, 'wb').write(audio)
    return words


def feats(path):
    y, _ = librosa.load(path, sr=SR, mono=True)
    m = librosa.feature.mfcc(y=y, sr=SR, n_mfcc=20, hop_length=HOP, n_fft=512)[1:]
    m = (m - m.mean(axis=1, keepdims=True)) / (m.std(axis=1, keepdims=True) + 1e-6)
    return m, len(y) / SR


def pauses(path):
    y, _ = librosa.load(path, sr=SR, mono=True)
    rms = librosa.feature.rms(y=y, frame_length=HOP * 2, hop_length=HOP)[0]
    db = 20 * np.log10(rms + 1e-9)
    q = db < np.percentile(db, 90) - 32
    out, i, n = [], 0, len(q)
    while i < n:
        if q[i]:
            j = i
            while j < n and q[j]:
                j += 1
            if (j - i) * .01 >= .06 and i > 0 and j < n:
                out.append(((i + j) / 2 * .01, (j - i) * .01))
            i = j
        else:
            i += 1
    return out


def main():
    lines_json, take = sys.argv[1], sys.argv[2]
    d = os.path.dirname(os.path.abspath(lines_json))
    take_path = take if os.path.isabs(take) else os.path.join(d, take)
    meta = json.load(open(lines_json, encoding='utf-8'))
    L = meta['lines']
    ref = os.path.join(d, 'bucati', '_alina-ref.mp3')
    words = asyncio.run(alina('\n\n'.join(l['say'] for l in L), ref))

    # cuvintele Alinei -> replici (după numărul de litere)
    need = [letters(l['say']) for l in L]
    starts, k, acc = [None], 0, 0
    for w, o, du in words:
        if starts[k] is None:
            starts[k] = o
        acc += letters(w)
        if k < len(L) - 1 and acc >= need[k] - 1:
            k += 1; acc = 0; starts.append(None)
    if len(starts) != len(L) or None in starts:
        raise SystemExit(f'Nu am putut împărți cuvintele Alinei pe replici ({len(starts)} vs {len(L)}).')

    A, _ = feats(ref)
    Bf, bdur = feats(take_path)
    _, wp = librosa.sequence.dtw(X=A, Y=Bf, metric='cosine')
    wp = wp[::-1]
    mp = {}
    for a, b in wp:
        mp.setdefault(a, []).append(b)
    ps = pauses(take_path)
    cuts = []
    for s in starts[1:]:
        fa = int(round((s - .05) / .01))
        fa = min(max(fa, 0), A.shape[1] - 1)
        while fa not in mp:
            fa -= 1
        tb = float(np.median(mp[fa])) * .01
        near = [p for p in ps if abs(p[0] - tb) < .45]
        cuts.append(round(max(near, key=lambda p: p[1] - abs(p[0] - tb) * 1.5)[0] if near else tb, 2))
    for i, l in enumerate(L):
        a = 0 if i == 0 else cuts[i - 1]
        b = cuts[i] if i < len(cuts) else bdur
        print(f'{i:2d}  {a:6.2f}–{b:6.2f}s  {l["text"]}')
    print('cuts:', ','.join(f'{c:.2f}' for c in cuts))
    if '--save' in sys.argv:
        meta['take'] = os.path.relpath(take_path, d)
        meta['cuts'] = cuts
        json.dump(meta, open(lines_json, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print('salvat în', lines_json)


if __name__ == '__main__':
    main()
