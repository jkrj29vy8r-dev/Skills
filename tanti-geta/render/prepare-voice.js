#!/usr/bin/env node
/*
 * Scoate replicile unui episod pentru generarea vocii din fișiere (de ex. Higgsfield / ElevenLabs):
 *   node prepare-voice.js ../episodes/razboiul-porcului.js
 * Scrie ../voice/<episod>/lines.json: [{ i, text, say, expr, file }]
 *   text = replica așa cum e în script (pentru verificare), say = ce se trimite vocii (numere în litere).
 */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { spellNumbers } = require('./ro-numbers');

const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const clean = s => s.replace(/[„”"«»*]/g, '').replace(/…/g, '...').replace(/[–—]/g, ',');

(async () => {
  const name = process.argv[2];
  if (!name) { console.error('Folosire: node prepare-voice.js <episod.js | nume preset>'); process.exit(1); }
  const browser = await chromium.launch(), page = await browser.newPage();
  await page.goto('file://' + path.join(__dirname, '..', 'index.html'));
  let script;
  if (name.endsWith('.js')) { await page.addScriptTag({ path: path.resolve(name) }); script = await page.evaluate(() => PRESETS[LAST_EP]); }
  else script = await page.evaluate(n => PRESETS[n], name);
  const ep = await page.evaluate(s => { const e = parseScript(s); return { title: e.title, lines: e.lines, items: e.items.map(i => ({ line: i.line, expr: i.expr })) }; }, script);
  await browser.close();
  const dir = path.join(__dirname, '..', 'voice', slug(ep.title));
  fs.mkdirSync(dir, { recursive: true });
  const lines = ep.lines.map((l, i) => ({ i, text: l, say: (s => s.charAt(0).toLocaleUpperCase('ro') + s.slice(1))(spellNumbers(clean(l))), expr: ep.items.find(it => it.line === i).expr, file: `line-${String(i).padStart(2, '0')}.mp3` }));
  fs.writeFileSync(path.join(dir, 'lines.json'), JSON.stringify(lines, null, 1));
  console.log(dir, lines.length, 'replici');
})();
