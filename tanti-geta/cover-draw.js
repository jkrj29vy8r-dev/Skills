/* Coperte verticale (1080×1920) pentru clipuri: titlu mare, Tanti Geta, desenul episodului.
   Folosire: node render/cover.js (scrie branding/coperta-*.png). */
const COVERS = {
  'castelul-lui-dracula': {
    night: 1, bg: ['#2a2150', '#1c1640'], rays: ['rgba(255,255,255,.035)', 'rgba(255,255,255,0)'],
    series: ['MITURI ROMÂNEȘTI', '#1'],
    lines: [['DRACULA', RED, 210, -.04], ['N-A STAT', '#fff', 150, .02], ['AICI?!', YEL, 190, -.03]],
    art: [['bran', { x: 700, y: 1460, s: 1.0, o: { lights: 1 } }], ['bats', { x: 600, y: 1080, s: 1.1, o: { n: 9, h: 380, seed: 3 }, a: 1.2 }]],
    geta: { expr: 'banuitoare', pose: 'finger', x: 270, y: 2330, s: 1.32, look: { x: 10, y: -4 } },
    sticker: ['FALS', 'stampila', 820, 1640, .16, 96],
  },
  'regele-tarii-de-foc': {
    bg: ['#3fa9e0', '#2d8cc4'], rays: ['rgba(255,255,255,.14)', 'rgba(255,255,255,0)'],
    series: ['ROMÂNI DE NECREZUT', '#1'],
    lines: [['UN ROMÂN', '#fff', 150, -.03], ['S-A FĂCUT', '#fff', 150, .02], ['REGE!', YEL, 250, -.04]],
    art: [['flag', { x: 880, y: 1440, s: .9, o: { c: 'ar' } }], ['person', { x: 700, y: 1500, s: 1.15, o: { kind: 'popper', pose: 'hips', mood: 'smug', crown: 1 } }], ['coin', { x: 920, y: 1060, s: .45, o: {}, t: 0 }]],
    geta: { expr: 'socata', pose: 'cheeks', x: 250, y: 2330, s: 1.3, look: { x: 12, y: -4 } },
    sticker: ['ADEVĂRAT', 'stampila', 820, 1640, -.12, 72],
  },
  'tezaurul-de-la-moscova': {
    bg: ['#b3261e', '#8e1b16'], rays: ['rgba(255,201,39,.16)', 'rgba(255,201,39,0)'],
    series: ['ROMÂNI DE NECREZUT', '#2'],
    lines: [['91 DE TONE', YEL, 170, -.03], ['DE AUR', '#fff', 170, .02], ['LA RUȘI!', '#fff', 150, -.02]],
    art: [['kremlin', { x: 800, y: 1640, s: .62, o: {} }], ['gold', { x: 820, y: 1790, s: 1.45, o: { n: 13, seed: 9 }, a: 3 }]],
    geta: { expr: 'suparata', pose: 'shrug', x: 260, y: 2330, s: 1.3, look: { x: 12, y: -2 } },
    sticker: ['0 ÎNAPOI', 'stampila', 790, 1020, .12, 78],
  },
};

function coverTitle(lines, y0) {
  let y = y0;
  for (const [text, col, size, rot] of lines) {
    const T = up(text), sz = fitFont(T, `$px ${CAP}`, size, 980);
    ctx.save(); ctx.translate(540, y + sz * .5); ctx.rotate(rot || 0);
    ctx.font = `${sz}px ${CAP}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillText(T, 10, 14);
    ctx.lineWidth = sz * .26; ctx.strokeStyle = INK; ctx.strokeText(T, 0, 0);
    ctx.lineWidth = sz * .1; ctx.strokeStyle = '#fff'; if (col === '#fff') ctx.strokeStyle = INK; ctx.strokeText(T, 0, 0);
    ctx.fillStyle = col; ctx.fillText(T, 0, 0);
    ctx.restore();
    y += sz * 1.02;
  }
  return y;
}
function renderCover(key) {
  const C = COVERS[key];
  return withCanvas(1080, 1920, () => {
    const t = 2;
    const g = ctx.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, C.bg[0]); g.addColorStop(1, C.bg[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
    if (C.night) drawNightBack(t, 1);
    rays(540, 1250, 30, 2000, C.rays[0], C.rays[1]);
    for (const [type, P] of C.art) {
      const e = { id: type, type, o: P.o || {}, x: P.x, y: P.y, s: P.s, ch: {} };
      ctx.save(); ctx.translate(P.x, P.y); ctx.scale(P.s, P.s); (E[type])(e, P.a ?? 5, P.t ?? t); ctx.restore();
    }
    if (C.night) drawFog(1.5, .8);
    // Tanti Geta, mare, jos în stânga
    setLook(C.geta.expr, { blush: .8 }); S.pose = JSON.parse(JSON.stringify(POSES[C.geta.pose] || POSES.rest)); S.look = C.geta.look || { x: 0, y: 0 };
    CHX = C.geta.x; CHY = C.geta.y; CHS = C.geta.s; drawGeta(1.3);
    // titlul
    drawTag(`${C.series[0]}  ${C.series[1]}`, 540, 300, 50, 'roz', -.02, 'center', 900);
    coverTitle(C.lines, 370);
    if (C.sticker) { const [txt, st, x, y, r, sz] = C.sticker; drawTag(txt, x, y, sz, st, r, 'center', 600); }
    // sigla canalului
    drawTag('TANTI GETA', 840, 1840, 50, 'galben', -.03, 'center', 420);
    const v = ctx.createRadialGradient(540, 960, 760, 540, 960, 1300); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.28)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, 1080, 1920);
  });
}
