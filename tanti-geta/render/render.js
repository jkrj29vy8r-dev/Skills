#!/usr/bin/env node
/*
 * Randează un episod complet din cod: voce sintetizată, animații, efecte, muzică.
 *
 *   node render.js "#6 Războiul porcului ⭐" porc.mp4 [--voice=files|alina|piper|mbrola] [--music] [--green]
 *   node render.js episodul-meu.txt clip.mp4
 *   node render.js ../episodes/razboiul-porcului.js porc.mp4      (episod-scenă)
 *
 * Vocea:
 *   files  (implicit dacă există ../voice/<episod>/lines.json) fișiere generate o dată, de ex. cu Higgsfield/ElevenLabs.
 *   alina  (implicit) Microsoft ro-RO-AlinaNeural prin edge-tts: naturală, feminină; textul merge la Microsoft.
 *          Subtitrările se aliniază pe momentul exact al fiecărui cuvânt.
 *   piper  neuronală locală (ro_RO-mihai-medium), prelucrată spre o voce de „tanti”; model în render/models.
 *   mbrola espeak-ng + MBROLA ro1, complet local, robotică.
 *
 * Are nevoie de: Node + Playwright (cu Chromium), ffmpeg (cu rubberband), python3,
 * pentru Alina: `pip install edge-tts`; pentru Piper: `pip install "sherpa-onnx<2"` + model;
 * pentru MBROLA: apt install espeak-ng mbrola mbrola-ro1.
 */
const { chromium } = require('playwright');
const { execFileSync, spawn } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');

const STUDIO = path.join(__dirname, '..', 'index.html');
const FPS = 30, SR = 48000;
const LEAD = .3, GAP = .1, TAIL = 1.8;   // pauze scurte între replici, ca la Gus

// Vocea lui Tanti Geta: [viteză, ton, volum] pe expresie (espeak-ng + MBROLA ro1)
const VOICE = {
  normal: [168, 62, 100], explica: [168, 66, 100], mirata: [170, 84, 100], banuitoare: [152, 52, 100],
  vesela: [174, 78, 100], suparata: [180, 58, 125], socata: [176, 96, 115], rade: [174, 84, 100],
  sopteste: [146, 46, 60], umeri: [158, 70, 100],
};
const PITCH = 1.2, TEMPO = 1.07;   // MBROLA: ridică vocea spre „tanti” de desen animat
// Piper: tonul crește de 1,6x, formanții de 1,16x (cât diferă o voce feminină de una masculină),
// plus o mică variație pe expresie.
const EXPR_PITCH = { socata: 1.08, mirata: 1.05, vesela: 1.04, rade: 1.05, suparata: .97, banuitoare: .96, sopteste: .95, umeri: 1.02 };
const EXPR_VOL = { sopteste: .7, suparata: 1.1, socata: 1.08 };
const VOICE_FX = 'highpass=f=95,equalizer=f=260:t=q:w=1:g=-2.5,equalizer=f=3200:t=q:w=1.2:g=3,equalizer=f=9000:t=q:w=1:g=1.5,' +
  'deesser=i=.4,acompressor=threshold=-21dB:ratio=3.5:attack=4:release=90:makeup=2';
const MODEL = process.env.PIPER_MODEL || path.join(__dirname, 'models', 'vits-piper-ro_RO-mihai-medium');
const TRIM = 'silenceremove=start_periods=1:start_threshold=-42dB';

function toF32(file, af) {
  const raw = sh('ffmpeg', ['-v', 'error', '-i', file, '-af', `${TRIM},areverse,${TRIM},areverse,${af},aresample=${SR}`, '-ac', '1', '-f', 'f32le', '-']);
  return new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length));
}
const ALINA_FX = 'highpass=f=80,equalizer=f=200:t=q:w=1:g=1.5,equalizer=f=3500:t=q:w=1.2:g=2,deesser=i=.3,acompressor=threshold=-20dB:ratio=3:attack=5:release=100:makeup=1.5';
// Voce din fișiere deja generate (de ex. Higgsfield / ElevenLabs): ../voice/<episod>/line-XX.mp3 + lines.json
const slugify = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const FILES_FX = 'highpass=f=70,deesser=i=.25,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=100:makeup=1.3';
function speakFiles(epLines, dir) {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'lines.json'), 'utf8')), L = meta.lines || meta;
  if (L.length !== epLines.length) throw new Error(`Vocea salvată are ${L.length} replici, episodul are ${epLines.length}. Rulează prepare-voice.js și regenerează vocea.`);
  return L.map((l, i) => {
    process.stdout.write(`\rVoce: replica ${i + 1}/${L.length}   `);
    if (l.text !== epLines[i]) console.warn(`\n⚠ Replica ${i} s-a schimbat față de vocea salvată:\n  voce: ${l.text}\n  acum: ${epLines[i]}`);
    return toF32(path.join(dir, l.file), FILES_FX);
  });
}
function speakAlina(lines, tmp) {
  const jobs = lines.map((l, i) => ({ text: l.text, expr: l.expr, out: path.join(tmp, `a${i}.mp3`) }));
  execFileSync('python3', [path.join(__dirname, 'tts_alina.py')], { input: JSON.stringify(jobs), stdio: ['pipe', 'ignore', 'inherit'] });
  return jobs.map((j, i) => {
    process.stdout.write(`\rVoce: replica ${i + 1}/${jobs.length}   `);
    const words = JSON.parse(fs.readFileSync(j.out + '.json', 'utf8'));
    // tăiem doar liniștea de la început (și mutăm momentele cuvintelor) și de la final
    const lead = words.length ? Math.max(0, words[0].o - .04) : 0;
    const raw = sh('ffmpeg', ['-v', 'error', '-ss', lead.toFixed(3), '-i', j.out, '-af', `areverse,${TRIM},areverse,${ALINA_FX},aresample=${SR}`, '-ac', '1', '-f', 'f32le', '-']);
    const clip = new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length));
    clip.words = words.map(w => ({ ...w, o: w.o - lead }));
    return clip;
  });
}
function speakPiper(lines, tmp) {
  const jobs = lines.map((l, i) => ({ text: l.text, expr: l.expr, out: path.join(tmp, `p${i}.wav`) }));
  execFileSync('python3', [path.join(__dirname, 'tts_piper.py'), MODEL], { input: JSON.stringify(jobs), stdio: ['pipe', 'ignore', 'inherit'] });
  return jobs.map((j, i) => {
    process.stdout.write(`\rVoce: replica ${i + 1}/${jobs.length}   `);
    const pf = (EXPR_PITCH[j.expr] || 1) * 1.38, vol = EXPR_VOL[j.expr] || 1;
    return toF32(j.out, `rubberband=pitch=1.16:formant=shifted,rubberband=pitch=${pf.toFixed(3)}:formant=preserved,${VOICE_FX},volume=${vol}`);
  });
}

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 30 });
const clean = s => s.replace(/[„”"«»*]/g, '').replace(/…/g, ',').replace(/[–—]/g, ',');

function speak(text, expr, tmp, i) {
  const [speed, pitch, amp] = VOICE[expr] || VOICE.normal;
  const wav = path.join(tmp, `l${i}.wav`);
  sh('espeak-ng', ['-v', 'mb-ro1', '-s', String(speed), '-p', String(pitch), '-a', String(amp), '-w', wav, text.toLocaleLowerCase('ro')]);
  const trim = 'silenceremove=start_periods=1:start_threshold=-42dB';
  const raw = sh('ffmpeg', ['-v', 'error', '-i', wav, '-af',
    `${trim},areverse,${trim},areverse,rubberband=pitch=${PITCH}:tempo=${TEMPO},highpass=f=120,` +
    `equalizer=f=3000:t=q:w=1:g=3,acompressor=threshold=-20dB:ratio=3:attack=5:release=90,aresample=${SR}`,
    '-ac', '1', '-f', 'f32le', '-']);
  return new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length));
}

(async () => {
  const args = process.argv.slice(2), flags = new Set(args.filter(a => a.startsWith('--'))), pos = args.filter(a => !a.startsWith('--'));
  const name = pos[0] || '#6 Războiul porcului ⭐';
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'geta-'));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  page.on('pageerror', e => console.error('\n[pagina]', e.message));
  await page.goto('file://' + STUDIO);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);

  let script;
  if (name.endsWith('.js') && fs.existsSync(name)) { await page.addScriptTag({ path: path.resolve(name) }); script = await page.evaluate(() => PRESETS[LAST_EP]); }
  else script = fs.existsSync(name) ? fs.readFileSync(name, 'utf8') : await page.evaluate(n => PRESETS[n] || null, name);
  if (!script) {
    console.error(`Nu găsesc episodul „${name}”. Episoade: ${(await page.evaluate(() => Object.keys(PRESETS))).join(' / ')}`);
    process.exit(1);
  }
  const ep = await page.evaluate(s => { const e = parseScript(s); return { title: e.title, lines: e.lines, items: e.items.map(i => ({ text: i.text, line: i.line, expr: i.expr })) }; }, script);
  const out = path.resolve(pos[1] || `tanti-geta-${ep.title.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'episod'}.mp4`);

  // 1. Vocea, replică cu replică
  const lines = ep.lines.map((l, i) => ({ text: clean(l), expr: ep.items.find(it => it.line === i).expr }));
  const voiceDir = path.join(__dirname, '..', 'voice', slugify(ep.title));
  const vArg = (args.find(a => a.startsWith('--voice=')) || '').slice(8) || (flags.has('--mbrola') ? 'mbrola' : fs.existsSync(path.join(voiceDir, 'lines.json')) ? 'files' : 'alina');
  const engine = vArg === 'piper' && !fs.existsSync(MODEL) ? 'mbrola' : vArg;
  console.log('Voce:', engine === 'files' ? `fișiere salvate (${voiceDir})` : engine === 'alina' ? 'Microsoft Alina (ro-RO-AlinaNeural)' : engine === 'piper' ? `Piper (${MODEL})` : 'MBROLA ro1');
  // Înregistrare continuă (o singură bucată + momentele de început ale replicilor, din align-voice.py)
  const meta = engine === 'files' ? JSON.parse(fs.readFileSync(path.join(voiceDir, 'lines.json'), 'utf8')) : null;
  let clips, lineStart = [], lineEnd = [], total, voice;
  if (meta && meta.take && meta.cuts) {
    if (meta.cuts.length !== ep.lines.length - 1) throw new Error(`lines.json are ${meta.cuts.length} granițe, episodul are nevoie de ${ep.lines.length - 1}. Rulează align-voice.py din nou.`);
    (meta.lines || []).forEach((l, i) => { if (l.text !== ep.lines[i]) console.warn(`\n⚠ Replica ${i} s-a schimbat față de vocea salvată:\n  voce: ${l.text}\n  acum: ${ep.lines[i]}`); });
    const raw = sh('ffmpeg', ['-v', 'error', '-i', path.join(voiceDir, meta.take), '-af', `${FILES_FX},aresample=${SR}`, '-ac', '1', '-f', 'f32le', '-']);
    const take = new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length)), td = take.length / SR;
    let on = 0; while (on < take.length && Math.abs(take[on]) < .02) on++;
    const b = [Math.max(0, on / SR - .05), ...meta.cuts, td];
    for (let i = 0; i < ep.lines.length; i++) { lineStart.push(LEAD + b[i]); lineEnd.push(LEAD + b[i + 1]); }
    total = LEAD + td + TAIL; voice = new Float32Array(Math.ceil(total * SR)); voice.set(take, Math.round(LEAD * SR));
    clips = ep.lines.map(() => ({}));
    console.log(`Voce: o singură înregistrare continuă (${meta.take}, ${td.toFixed(1)} s)`);
  } else {
    clips = engine === 'files' ? speakFiles(ep.lines, voiceDir) : engine === 'alina' ? speakAlina(lines, tmp) : engine === 'piper' ? speakPiper(lines, tmp) : lines.map((l, i) => {
      process.stdout.write(`\rVoce: replica ${i + 1}/${lines.length}   `);
      return speak(l.text, l.expr, tmp, i);
    });
    let cur = LEAD;
    for (const c of clips) { lineStart.push(cur); cur += c.length / SR; lineEnd.push(cur); cur += GAP; }
    total = lineEnd[lineEnd.length - 1] + TAIL;
    voice = new Float32Array(Math.ceil(total * SR));
    clips.forEach((c, i) => voice.set(c, Math.round(lineStart[i] * SR)));
  }

  // 2. Când apare fiecare bucată de subtitrare (proporțional cu textul, în interiorul replicii)
  const starts = [], ends = [];
  ep.lines.forEach((_, li) => {
    const its = ep.items.map((it, k) => ({ it, k })).filter(o => o.it.line === li);
    const tot = its.reduce((a, o) => a + o.it.text.length + 1, 0); let acc = 0;
    const W = clips[li].words;   // momentele reale ale cuvintelor (doar la Alina)
    const wc = W ? W.map(w => w.t.length) : null, wtot = wc ? wc.reduce((a, b) => a + b, 0) : 0;
    for (const o of its) {
      const frac = acc / tot;
      if (W && W.length && wtot) {
        let c = 0, k = 0; while (k < W.length - 1 && (c + wc[k] / 2) / wtot < frac) { c += wc[k]; k++; }
        starts[o.k] = lineStart[li] + (frac === 0 ? 0 : W[k].o);
      } else starts[o.k] = lineStart[li] + frac * (lineEnd[li] - lineStart[li]);
      acc += o.it.text.length + 1;
    }
  });
  for (let k = 0; k < starts.length; k++) ends[k] = k + 1 < starts.length ? starts[k + 1] : total;

  // 3. Cât de deschisă e gura în fiecare cadru (din volumul vocii)
  const nF = Math.ceil(total * FPS), hop = SR / FPS, env = new Array(nF).fill(0);
  for (let f = 0; f < nF; f++) {
    let s = 0, n = 0;
    for (let j = Math.floor(f * hop); j < Math.min(voice.length, Math.floor((f + 1) * hop)); j++) { s += voice[j] * voice[j]; n++; }
    env[f] = n ? Math.sqrt(s / n) : 0;
  }
  const loud = env.filter(v => v > 1e-3).sort((a, b) => a - b), ref = loud[Math.floor(loud.length * .9)] || 1;
  for (let f = 0; f < nF; f++) env[f] = Math.max(0, Math.min(1, (env[f] / ref - .12) * 1.25));

  // 4. Cadrele
  await page.evaluate(cfg => offlineStart(cfg), { script, starts, ends, total, env, fps: FPS, music: flags.has('--music'), green: flags.has('--green') });
  const vid = path.join(tmp, 'video.mp4');
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), vid], { stdio: ['pipe', 'inherit', 'inherit'] });
  const ffDone = new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg (video) a ieșit cu ' + c))));
  for (let f = 0; f < nF; f++) {
    const d = await page.evaluate(i => offlineFrame(i), f);
    if (!ff.stdin.write(Buffer.from(d.slice(d.indexOf(',') + 1), 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 15 === 0) process.stdout.write(`\rCadre: ${f}/${nF}            `);
  }
  ff.stdin.end(); await ffDone;

  // 5. Efectele sonore și muzica (Web Audio, randate offline)
  process.stdout.write('\rSunete…                    ');
  const sfx = path.join(tmp, 'sfx.wav'), vraw = path.join(tmp, 'voice.f32');
  fs.writeFileSync(sfx, Buffer.from(await page.evaluate(() => offlineAudio()), 'base64'));
  fs.writeFileSync(vraw, Buffer.from(voice.buffer));
  await browser.close();

  // 6. Montaj final
  process.stdout.write('\rMontaj…                    ');
  sh('ffmpeg', ['-v', 'error', '-y', '-i', vid, '-f', 'f32le', '-ar', String(SR), '-ac', '1', '-i', vraw, '-i', sfx,
    '-filter_complex', '[1:a]aecho=0.85:0.5:28|47:0.10|0.06,aformat=channel_layouts=stereo,volume=1.0[v];[2:a]volume=0.5[s];[v][s]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,alimiter=limit=0.84:level=false[a]',
    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`\rGata: ${out} (${total.toFixed(1)} s, ${nF} cadre)`);
})().catch(e => { console.error('\n' + e.message); process.exit(1); });
