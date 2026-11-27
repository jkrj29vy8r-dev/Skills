#!/usr/bin/env python3
"""Taie o înregistrare lungă (mai multe replici citite una după alta) în câte un fișier pe replică.

    python3 split-voice.py bucata.mp3 voice/<episod>/lines.json PRIMA ULTIMA [--cuts 2.5,3.9,...]

Cu --cuts se dau explicit secundele granițelor (câte una între două replici).
La final verifică durata fiecărei replici față de lungimea textului și semnalează ce pare greșit.

Alege granițele dintre replici dintre pauzele găsite în sunet: preferă pauzele lungi
aflate aproape de locul unde ar trebui să fie granița (după lungimea textului).
Scrie line-XX.mp3 în același folder cu lines.json.
"""
import json
import os
import subprocess
import sys

import numpy as np

SR = 44100
HOP = 0.01  # 10 ms


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype='<f4')


def pauses(x):
    hop = int(SR * HOP)
    n = len(x) // hop
    rms = np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    loud = np.percentile(db, 90)
    quiet = db < loud - 32
    out, i = [], 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]:
                j += 1
            if (j - i) * HOP >= .08 and i > 0 and j < n:
                out.append(((i + j) / 2 * HOP, (j - i) * HOP, i * HOP, j * HOP))
            i = j
        else:
            i += 1
    return out, n * HOP


def choose(cands, expected, total):
    """DP: câte o pauză pentru fiecare graniță, în ordine, maximizând lungime − distanță față de locul așteptat."""
    K, M = len(expected), len(cands)
    if M < K:
        raise SystemExit(f'Am găsit doar {M} pauze pentru {K} granițe.')
    score = [[-1e9] * M for _ in range(K)]
    back = [[-1] * M for _ in range(K)]

    def s(k, j):
        mid, length = cands[j][0], cands[j][1]
        return min(length, .8) * 4 - abs(mid - expected[k]) / total * 12

    for j in range(M):
        score[0][j] = s(0, j)
    for k in range(1, K):
        best, bj = -1e9, -1
        for j in range(M):
            if j - 1 >= 0 and score[k - 1][j - 1] > best:
                best, bj = score[k - 1][j - 1], j - 1
            if bj >= 0:
                score[k][j] = best + s(k, j)
                back[k][j] = bj
    j = max(range(M), key=lambda q: score[K - 1][q])
    path = []
    for k in range(K - 1, -1, -1):
        path.append(j)
        j = back[k][j]
    return [cands[q] for q in reversed(path)]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    src, lines_json, first, last = args[0], args[1], int(args[2]), int(args[3])
    manual = None
    if '--cuts' in sys.argv:
        manual = [float(v) for v in sys.argv[sys.argv.index('--cuts') + 1].split(',')]
    meta = json.load(open(lines_json, encoding='utf-8'))
    L = meta['lines'] if isinstance(meta, dict) else meta
    seg = L[first:last + 1]
    x = load(src)
    cands, total = pauses(x)
    import re
    # fiecare semn de punctuație din interiorul replicii (. ? ! :) aduce și el o pauză
    lens = [len(l['say']) + 6 + 8 * len(re.findall(r'[.?!:…](?=\s+\S)', l['say'])) for l in seg]
    cum = np.cumsum(lens)[:-1] / sum(lens)
    # vorbirea propriu-zisă începe/se termină puțin după/înainte de capete
    expected = list(cum * total)
    if manual is not None:
        if len(manual) != len(seg) - 1:
            raise SystemExit(f'--cuts are {len(manual)} valori, trebuie {len(seg) - 1}.')
        cuts = [0.0] + manual + [total]
    else:
        picked = choose(cands, expected, total) if len(seg) > 1 else []
        cuts = [0.0] + [p[0] for p in picked] + [total]
    # verificare: durata fiecărei replici față de numărul de litere
    letters = [len(re.sub(r'[^\wăâîșțĂÂÎȘȚ]', '', l['say'])) for l in seg]
    rate = sum(letters) / total
    suspect = []
    for k, l in enumerate(seg):
        dur, want = cuts[k + 1] - cuts[k], letters[k] / rate
        if want > .6 and not (.6 < dur / want < 1.6):
            suspect.append(f"  ⚠ {l['file']}: {dur:.2f}s, aștept ~{want:.2f}s  ({l['text']})")
    out_dir = os.path.dirname(os.path.abspath(lines_json))
    for k, l in enumerate(seg):
        a, b = cuts[k], cuts[k + 1]
        dst = os.path.join(out_dir, l['file'])
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', src,
                        '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse',
                        '-ac', '1', '-b:a', '160k', dst], check=True)
        print(f"{l['file']}  {a:6.2f}–{b:6.2f}s  {l['text']}")
    if suspect:
        print('Tăieturi suspecte (verifică-le sau dă --cuts):'); print('\n'.join(suspect))


if __name__ == '__main__':
    main()
