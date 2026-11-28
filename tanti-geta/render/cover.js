#!/usr/bin/env node
/* Desenează copertele clipurilor (1080×1920) din cover-draw.js:
 *   node render/cover.js [cheie...]   → branding/coperta-<cheie>.png */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
(async () => {
  const browser = await chromium.launch(), page = await browser.newPage();
  await page.goto('file://' + path.join(ROOT, 'index.html'));
  for (const f of fs.readdirSync(path.join(ROOT, 'episodes'))) await page.addScriptTag({ path: path.join(ROOT, 'episodes', f) });
  await page.addScriptTag({ path: path.join(ROOT, 'cover-draw.js') });
  await page.evaluate(() => document.fonts.ready);
  const keys = process.argv.slice(2).length ? process.argv.slice(2) : await page.evaluate(() => Object.keys(COVERS));
  for (const k of keys) {
    const url = await page.evaluate(k => renderCover(k).toDataURL('image/png'), k);
    const out = path.join(ROOT, 'branding', `coperta-${k}.png`);
    fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); console.log(out);
  }
  await browser.close();
})();
