/* =========================================================
   Motor de scene pentru episoade „ca la Gus”:
   fiecare replică construiește scena din elemente desenate
   special (pop, alunecare, ștampilă, fantomă, mișcare),
   plus widget-uri care rămân pe ecran (lista de escaladare).
   Se încarcă după scriptul principal din index.html.
   ========================================================= */
const EPISODES = {};
let LAST_EP = null;
const SCENE = { els: [], t: 0, addT: 0, sfxBudget: 2 };

/* ---------- înregistrare episod: devine preset + script DSL ---------- */
function registerEpisode(key, EP) {
  EP.key = key; EPISODES[key] = EP; LAST_EP = key;
  PRESETS[key] = epToDSL(EP);
  const sel = document.getElementById('preset');
  if (sel && ![...sel.options].some(o => o.value === key)) { const o = document.createElement('option'); o.value = o.textContent = key; sel.prepend(o); }
}
function epToDSL(EP) {
  const L = [`# ${EP.title}`, `!episod ${EP.key}`, `!serie ${EP.serie.join(' | ')}`];
  EP.beats.forEach((b, i) => {
    L.push(`@scena ${i}`);
    if (b.sticker) L.push(`+eticheta ${b.sticker}`);
    L.push(`[${b.e || 'normal'}] ${b.say}`);
  });
  return L.join('\n');
}
const B = (e, say, fn, extra) => ({ e, say, do: fn, ...(extra || {}) });

function runBeat(i, t) {
  const ep = S.ep || S.preview, EP = ep && EPISODES[ep.scene]; if (!EP) return;
  const b = EP.beats[i]; if (!b) return;
  if (i === 0) SCENE.els = [];
  SCENE.t = t; SCENE.addT = i === 0 ? t - 5 : t; SCENE.sfxBudget = 2;
  if (b.do) b.do(sc, t);
}

/* ---------- API pentru scene ---------- */
function dimOf(e, t) { return lerp(e.dim[0], e.dim[1], clamp((t - e.dim[2]) / .3, 0, 1)); }
const AUTO_SFX = { pop: 'pop', slideL: 'whoosh', slideR: 'whoosh', drop: 'pop', stamp: 'stamp', grow: 'pop' };
const sc = {
  add(id, type, o = {}) {
    const old = sc.get(id); if (old) old.out = SCENE.t;
    const e = { id, type, o, x: o.x ?? 540, y: o.y ?? 600, s: o.s ?? 1, r: o.r ?? 0, z: o.z ?? 0, t0: SCENE.addT + (o.delay || 0), inA: o.in || 'pop', out: null, dim: [0, 0, 0], tw: null, ch: {} };
    SCENE.els.push(e);
    const snd = o.sfx !== undefined ? o.sfx : AUTO_SFX[e.inA];
    if (snd && PB && actx && SCENE.addT === SCENE.t && (o.sfx || opts.sfxAuto) && SCENE.sfxBudget-- > 0) {
      const at = aNow() + (o.delay || 0); if (SFX[snd]) SFX[snd](at);
    }
    if (e.inA === 'stamp' && PB && SCENE.addT === SCENE.t) { spawnPuff(e.x, e.y); S.shake = Math.max(S.shake, .25); }
    return e;
  },
  get(id) { return SCENE.els.find(e => e.id === id && e.out === null); },
  clear(...keep) { for (const e of SCENE.els) if (e.out === null && !keep.includes(e.id) && !e.o.hud) e.out = SCENE.t; },
  out(...ids) { for (const id of ids) { const e = sc.get(id); if (e) e.out = SCENE.t; } },
  dim(id, v = 1) { const e = sc.get(id); if (e) e.dim = [dimOf(e, SCENE.t), v, SCENE.t]; },
  move(id, to, d = .45) { const e = sc.get(id); if (e) { const c = posOf(e, SCENE.t); e.x = c.x; e.y = c.y; e.s = c.s; e.r = c.r; e.tw = { f: c, to, t0: SCENE.t, d }; } },
  set(id, props) { const e = sc.get(id); if (e) { for (const k in props) e.ch[k] = SCENE.t; Object.assign(e.o, props); } },
  shake(v = .6) { S.shake = Math.max(S.shake, v); },
  fx(name) { fire(name); },
};
function posOf(e, t) {
  if (!e.tw) return { x: e.x, y: e.y, s: e.s, r: e.r };
  const k = easeInOut(clamp((t - e.tw.t0) / e.tw.d, 0, 1)), f = e.tw.f, to = e.tw.to;
  return { x: lerp(f.x, to.x ?? f.x, k), y: lerp(f.y, to.y ?? f.y, k), s: lerp(f.s, to.s ?? f.s, k), r: lerp(f.r, to.r ?? f.r, k) };
}
function drawScene(t) {
  SCENE.els = SCENE.els.filter(e => e.out === null || t - e.out < .35);
  for (const e of [...SCENE.els].sort((a, b) => a.z - b.z)) {
    const p = posOf(e, t), a = t - e.t0; if (a < 0) continue;
    const ka = clamp(a / .38, 0, 1);
    let alpha = 1, dx = 0, dy = 0, k = 1;
    switch (e.inA) {
      case 'pop': k = .3 + .7 * easeOutBack(ka); alpha = clamp(a * 8, 0, 1); break;
      case 'drop': dy = -420 * (1 - easeOutBack(ka)); alpha = clamp(a * 8, 0, 1); break;
      case 'slideL': dx = -1000 * (1 - easeOut(ka)); break;
      case 'slideR': dx = 1000 * (1 - easeOut(ka)); break;
      case 'grow': k = easeOutBack(ka); break;
      case 'fade': alpha = ka; break;
      case 'stamp': k = lerp(2.4, 1, easeOut(clamp(a / .2, 0, 1))); alpha = clamp(a * 10, 0, 1); break;
    }
    if (e.out !== null) { const ko = clamp((t - e.out) / .3, 0, 1); alpha *= 1 - ko; k *= 1 - .25 * ko; }
    alpha *= 1 - .72 * dimOf(e, t);
    if (alpha <= .01) continue;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(p.x + dx, p.y + dy); ctx.rotate(p.r); ctx.scale(p.s * k, p.s * k);
    (E[e.type] || E.emoji)(e, a, t);
    ctx.restore();
  }
}

/* ---------- utilitare de desen ---------- */
const stroke8 = (fill, lw = 8) => fillStroke(fill, lw, OUT);
function flagCanvas(kind) {
  flagCanvas.c = flagCanvas.c || {};
  if (flagCanvas.c[kind]) return flagCanvas.c[kind];
  const c = document.createElement('canvas'); c.width = 300; c.height = 190; const g = c.getContext('2d');
  if (kind === 'us') {
    for (let i = 0; i < 13; i++) { g.fillStyle = i % 2 ? '#fff' : '#c8102e'; g.fillRect(0, i * 190 / 13, 300, 190 / 13 + 1); }
    g.fillStyle = '#1b3a8a'; g.fillRect(0, 0, 130, 102); g.fillStyle = '#fff';
    for (let r = 0; r < 5; r++) for (let q = 0; q < 6; q++) { g.beginPath(); g.arc(12 + q * 21 + (r % 2) * 8, 12 + r * 19, 4, 0, TAU); g.fill(); }
  } else if (kind === 'uk') {
    g.fillStyle = '#1b3a8a'; g.fillRect(0, 0, 300, 190);
    g.lineWidth = 38; g.strokeStyle = '#fff'; g.beginPath(); g.moveTo(0, 0); g.lineTo(300, 190); g.moveTo(300, 0); g.lineTo(0, 190); g.stroke();
    g.lineWidth = 13; g.strokeStyle = '#c8102e'; g.stroke();
    g.fillStyle = '#fff'; g.fillRect(120, 0, 60, 190); g.fillRect(0, 65, 300, 60);
    g.fillStyle = '#c8102e'; g.fillRect(132, 0, 36, 190); g.fillRect(0, 77, 300, 36);
  } else if (kind === 'de') {
    ['#1d1d1d', '#fff', '#d0021b'].forEach((col, i) => { g.fillStyle = col; g.fillRect(0, i * 190 / 3, 300, 190 / 3 + 1); });
  } else {
    ['#002b7f', '#fcd116', '#ce1126'].forEach((col, i) => { g.fillStyle = col; g.fillRect(i * 100, 0, 101, 190); });
  }
  return (flagCanvas.c[kind] = c);
}
function drawPig(mode, t, walk) {
  const angel = mode === 'angel', dead = mode === 'dead';
  ctx.save();
  if (dead) { ctx.translate(0, -40); ctx.rotate(Math.PI); ctx.translate(0, 40); }
  if (angel) for (const s of [-1, 1]) { ctx.save(); ctx.translate(-40, -110); ctx.rotate(s * (.5 + Math.sin(t * 6) * .25) - .2); ell(0, -70, 60, 110); stroke8('#fff', 7); ctx.restore(); }
  const legs = [-140, -65, 55, 125];
  legs.forEach((x, i) => { ctx.save(); ctx.translate(x, 50); if (walk) ctx.rotate(Math.sin(t * 14 + i * Math.PI) * .35); rr(-22, 0, 44, 90, 14); stroke8('#f48fb1', 7); ctx.restore(); });
  ctx.beginPath(); for (let k = 0; k <= 30; k++) { const g = k * .38, r = 4 + k * .9, x = -222 - Math.cos(g) * r, y = -30 - Math.sin(g) * r; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.lineWidth = 9; ctx.strokeStyle = OUT; ctx.stroke();
  ell(-25, 0, 205, 135); stroke8('#f7a8c0', 9);
  ctx.save(); ctx.translate(150, -40); ctx.rotate(angel ? -.08 : walk ? Math.sin(t * 7) * .05 : .05);
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 55 - 30, -80); ctx.lineTo(s * 70, -150); ctx.lineTo(s * 55 + 30, -78); ctx.closePath(); stroke8('#f48fb1', 7); }
  circ(0, 0, 112); stroke8('#f7a8c0', 9);
  ell(86, 22, 52, 40); stroke8('#f48fb1', 8);
  ctx.fillStyle = '#7a2c45'; ell(72, 22, 9, 14); ctx.fill(); ell(100, 22, 9, 14); ctx.fill();
  ctx.fillStyle = 'rgba(255,105,130,.45)'; ell(-20, 45, 26, 16); ctx.fill();
  ctx.strokeStyle = OUT; ctx.lineWidth = 8;
  if (dead) { for (const x of [-30, 30]) { seg(x - 14, -39, x + 14, -11); seg(x + 14, -39, x - 14, -11); } ctx.fillStyle = '#e8798f'; rr(40, 50, 22, 34, 10); ctx.fill(); ctx.stroke(); }
  else if (angel) { for (const x of [-30, 30]) { ctx.beginPath(); ctx.arc(x, -20, 18, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); } }
  else { for (const x of [-30, 30]) { ctx.fillStyle = OUT; circ(x, -25, 13); ctx.fill(); ctx.fillStyle = '#fff'; circ(x - 4, -29, 4.5); ctx.fill(); } }
  if (angel) { ctx.lineWidth = 20; ell(0, -150, 75, 20); ctx.stroke(); ctx.strokeStyle = YEL; ctx.lineWidth = 12; ell(0, -150, 75, 20); ctx.stroke(); }
  ctx.restore(); ctx.restore();
}
function potato(x, y, r) { ctx.save(); ctx.translate(x, y); ctx.rotate(x * .01); ell(0, 0, r * 1.25, r); stroke8('#c9965a', 6); ctx.fillStyle = '#8a6136'; for (const [a, b] of [[-r * .5, -r * .2], [r * .3, r * .3], [r * .5, -r * .35]]) { circ(a, b, r * .1); ctx.fill(); } ctx.restore(); }
const PERSON = {
  farmer: { coat: '#d9534f', pants: '#3d6fb6', hat: 'straw', hair: '#6b4226', beard: 1 },
  worker: { coat: '#7a5a3a', pants: '#4a4a4a', hat: 'cap', hair: '#8a3b1d', must: 'small' },
  admiral: { coat: '#1f2f5c', pants: '#f4f1ea', hat: 'bicorne', hair: '#d8d8d8', gold: 1, side: 1 },
  kaiser: { coat: '#5f6f86', pants: '#2b2f3a', hat: 'pickel', hair: '#b9b9b9', must: 'kaiser', gold: 1, medals: 1 },
  governor: { coat: '#262626', pants: '#3a3a3a', hat: 'top', hair: '#9a9a9a', must: 'small' },
};
function drawPerson(o, t) {
  const P = PERSON[o.kind] || PERSON.farmer, mood = o.mood || 'normal', talk = o.talk ? Math.abs(Math.sin(t * 13)) : 0;
  const bob = Math.sin(t * 2.2 + (o.x || 0)) * 3;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const s of [-1, 1]) { rr(s * 26 - 18, -150, 36, 140, 14); stroke8(P.pants, 7); ell(s * 30, -8, 34, 16); stroke8('#2b2020', 6); }
  ctx.translate(0, bob);
  rr(-72, -300, 144, 165, 34); stroke8(P.coat, 8);
  if (o.kind === 'farmer') { rr(-48, -250, 96, 115, 10); stroke8(P.pants, 6); ctx.strokeStyle = OUT; ctx.lineWidth = 6; seg(-40, -250, -55, -296); seg(40, -250, 55, -296); ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 4; for (let x = -60; x <= 60; x += 24) seg(x, -296, x, -255); }
  if (P.gold) { ctx.fillStyle = '#e0b13a'; for (const s of [-1, 1]) { rr(s * 72 - 26, -306, 52, 18, 6); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 4; ctx.stroke(); } ctx.fillStyle = '#e0b13a'; for (let y = -270; y < -150; y += 28) { circ(-14, y, 6); ctx.fill(); circ(14, y, 6); ctx.fill(); } }
  if (P.medals) { for (const [x, c] of [[-40, '#d0021b'], [-22, '#3d8bfd'], [-4, '#e0b13a']]) { ctx.fillStyle = c; ctx.fillRect(x, -268, 14, 20); ctx.fillStyle = '#e0b13a'; circ(x + 7, -240, 8); ctx.fill(); } }
  const pose = o.pose || 'rest';
  const H = { rest: [[-88, -160], [88, -160]], point: [[-88, -160], [112, -330]], shrug: [[-140, -235], [140, -235]], hips: [[-76, -185], [76, -185]], stop: [[-88, -160], [150, -270]], wave: [[-88, -160], [120, -330 + Math.sin(t * 10) * 18]] }[pose];
  const EL = { rest: [[-92, -220], [92, -220]], point: [[-92, -220], [118, -250]], shrug: [[-120, -200], [120, -200]], hips: [[-120, -225], [120, -225]], stop: [[-92, -220], [120, -240]], wave: [[-92, -220], [125, -250]] }[pose];
  for (const i of [0, 1]) {
    const sx = i ? 66 : -66;
    ctx.strokeStyle = OUT; ctx.lineWidth = 40; ctx.beginPath(); ctx.moveTo(sx, -282); ctx.lineTo(EL[i][0], EL[i][1]); ctx.lineTo(H[i][0], H[i][1]); ctx.stroke();
    ctx.strokeStyle = P.coat; ctx.lineWidth = 28; ctx.stroke();
    circ(H[i][0], H[i][1], 20); stroke8(o.kind === 'admiral' ? '#fff' : SKIN, 6);
    if (pose === 'point' && i) { rr(H[i][0] - 7, H[i][1] - 50, 14, 40, 7); stroke8(SKIN, 5); }
  }
  const hy = -362;
  ell(0, hy + 8, 70, 74); stroke8(SKIN, 8);
  if (P.side) { ctx.fillStyle = P.hair; for (const s of [-1, 1]) { rr(s * 62 - 9, hy - 10, 18, 50, 8); ctx.fill(); } }
  ctx.fillStyle = 'rgba(255,105,130,.35)'; for (const s of [-1, 1]) { ell(s * 38, hy + 30, 14, 9); ctx.fill(); }
  ctx.strokeStyle = OUT; ctx.lineWidth = 6;
  const br = mood === 'angry' ? 1 : mood === 'shock' ? -1 : 0;
  for (const s of [-1, 1]) {
    if (mood === 'shock') { ctx.fillStyle = '#fff'; circ(s * 24, hy, 13); ctx.fill(); ctx.stroke(); ctx.fillStyle = OUT; circ(s * 24, hy, 5); ctx.fill(); }
    else { ctx.fillStyle = OUT; circ(s * 24, hy, 7); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(s * 12, hy - 24 + br * 8); ctx.lineTo(s * 38, hy - 28 - br * 6 - (mood === 'shock' ? 8 : 0)); ctx.stroke();
  }
  if (P.must === 'kaiser') { ctx.lineWidth = 11; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, hy + 34); ctx.quadraticCurveTo(s * 40, hy + 46, s * 66, hy + 24); ctx.quadraticCurveTo(s * 80, hy + 12, s * 74, hy - 2); ctx.stroke(); } }
  else if (P.must === 'small') { ctx.fillStyle = P.hair; ell(0, hy + 36, 26, 9); ctx.fill(); }
  if (P.beard) { ctx.fillStyle = 'rgba(107,66,38,.35)'; ell(0, hy + 56, 46, 22); ctx.fill(); }
  ctx.strokeStyle = OUT; ctx.lineWidth = 6;
  if (talk > .15 || mood === 'shock') { ell(0, hy + 50, 13, 6 + 10 * Math.max(talk, mood === 'shock' ? .9 : 0)); stroke8('#5a1426', 5); }
  else { ctx.beginPath(); const c = mood === 'angry' ? -8 : mood === 'smug' ? 6 : 8; ctx.moveTo(-16, hy + 48); ctx.quadraticCurveTo(0, hy + 48 + c, 16, hy + 48); ctx.stroke(); }
  if (P.hat === 'straw') { ell(0, hy - 52, 112, 22); stroke8('#e9c46a', 7); rr(-56, hy - 112, 112, 66, 26); stroke8('#e9c46a', 7); ctx.fillStyle = RED; ctx.fillRect(-55, hy - 64, 110, 12); }
  else if (P.hat === 'cap') { ctx.beginPath(); ctx.ellipse(0, hy - 46, 74, 40, 0, Math.PI, TAU); ctx.closePath(); stroke8('#6b6b6b', 7); ell(46, hy - 46, 50, 14); stroke8('#5a5a5a', 6); }
  else if (P.hat === 'bicorne') { ctx.beginPath(); ctx.moveTo(-120, hy - 50); ctx.quadraticCurveTo(0, hy - 170, 120, hy - 50); ctx.quadraticCurveTo(0, hy - 80, -120, hy - 50); ctx.closePath(); stroke8('#1d1d1d', 7); ctx.strokeStyle = '#e0b13a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-110, hy - 56); ctx.quadraticCurveTo(0, hy - 84, 110, hy - 56); ctx.stroke(); circ(0, hy - 92, 14); stroke8('#c8102e', 4); }
  else if (P.hat === 'pickel') { ctx.beginPath(); ctx.ellipse(0, hy - 40, 76, 58, 0, Math.PI, TAU); ctx.closePath(); stroke8('#1d1d1d', 7); ctx.beginPath(); ctx.moveTo(-12, hy - 96); ctx.lineTo(0, hy - 150); ctx.lineTo(12, hy - 96); ctx.closePath(); stroke8('#e0b13a', 5); circ(0, hy - 62, 18); stroke8('#e0b13a', 4); ctx.fillStyle = '#1d1d1d'; ctx.fillRect(-82, hy - 46, 164, 12); }
  else if (P.hat === 'top') { rr(-50, hy - 160, 100, 112, 8); stroke8('#1d1d1d', 7); ell(0, hy - 48, 86, 16); stroke8('#1d1d1d', 7); ctx.fillStyle = '#7a1f2a'; ctx.fillRect(-49, hy - 78, 98, 14); }
}
function drawSoldier(side, t, i) {
  const coat = side === 'uk' ? '#c8102e' : '#2f4f9a', bob = Math.abs(Math.sin(t * 9 + i)) * -4;
  ctx.save(); ctx.translate(0, bob); ctx.lineCap = 'round';
  for (const s of [-1, 1]) { rr(s * 10 - 7, -40, 14, 40, 5); stroke8('#2b2f3a', 4); }
  rr(-22, -95, 44, 58, 12); stroke8(coat, 5);
  if (side === 'uk') { ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; seg(-18, -92, 16, -42); seg(18, -92, -16, -42); }
  ctx.strokeStyle = '#6b4226'; ctx.lineWidth = 6; seg(24, -40, 30, -130);
  circ(0, -116, 22); stroke8(SKIN, 5);
  ctx.fillStyle = OUT; circ(-8, -118, 3); ctx.fill(); circ(8, -118, 3); ctx.fill();
  if (side === 'uk') { rr(-18, -170, 36, 40, 5); stroke8('#1d1d1d', 4); } else { rr(-22, -150, 44, 22, 6); stroke8('#2f4f9a', 4); ell(10, -128, 20, 6); ctx.fillStyle = '#1d1d1d'; ctx.fill(); }
  ctx.restore();
}
function drawShip(t, flag) {
  ctx.strokeStyle = OUT; ctx.lineWidth = 8;
  for (const mx of [-45, 45]) seg(mx, -20, mx, -255);
  for (const mx of [-45, 45]) for (const [y0, w0] of [[-240, 74], [-170, 92], [-95, 104]]) { ctx.beginPath(); ctx.moveTo(mx - w0 / 2, y0); ctx.quadraticCurveTo(mx, y0 - 14, mx + w0 / 2, y0); ctx.lineTo(mx + w0 / 2 + 6, y0 + 58); ctx.quadraticCurveTo(mx, y0 + 70, mx - w0 / 2 - 6, y0 + 58); ctx.closePath(); fillStroke('#fffaf0', 6); }
  ctx.drawImage(flagCanvas(flag || 'uk'), 45, -262, 60, 38); ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.strokeRect(45, -262, 60, 38);
  ctx.beginPath(); ctx.moveTo(-150, -25); ctx.lineTo(150, -25); ctx.lineTo(118, 45); ctx.lineTo(-118, 45); ctx.closePath(); fillStroke('#7a4b2a', 8);
  ctx.fillStyle = INK; for (let g = -100; g <= 100; g += 40) ctx.fillRect(g - 9, -6, 18, 16);
}
function bubbleText(text, maxW) {
  const T = fitWrap(up(text), `$px ${CAP}`, 46, maxW, 3, 26);
  ctx.font = `${T.size}px ${CAP}`; const w = Math.max(...T.lines.map(l => ctx.measureText(l).width));
  return { ...T, w, h: T.lines.length * (T.size + 6) };
}
function checkPath(x, y, k) {
  ctx.beginPath(); const p = [[x - 12, y], [x - 2, y + 11], [x + 18, y - 14]];
  const L1 = Math.min(1, k * 2), L2 = clamp(k * 2 - 1, 0, 1);
  ctx.moveTo(p[0][0], p[0][1]); ctx.lineTo(lerp(p[0][0], p[1][0], L1), lerp(p[0][1], p[1][1], L1));
  if (L2 > 0) ctx.lineTo(lerp(p[1][0], p[2][0], L2), lerp(p[1][1], p[2][1], L2));
  ctx.stroke();
}

/* ---------- bibliotecă de elemente ---------- */
const E = {
  emoji(e, a, t) { drawEmoji(e.o.e || '❓', 0, Math.sin(t * 2.2) * 6, e.o.size || 300); },
  prop(e, a, t) { ctx.translate(-PX, -PY); (PROPS[e.o.prop] || PROPS.emoji)({ type: e.o.prop, args: e.o.args || [], stamps: [], start: 0, ...(e.o.extra || {}) }, a, t, 99); },
  pig(e, a, t) { if (e.o.flip) ctx.scale(-1, 1); drawPig(e.o.mode, t, e.o.walk); },
  garden(e, a, t) {
    rr(-300, -40, 600, 140, 40); stroke8('#8a5a35', 8);
    const n = 6, left = e.o.left ?? n, ch = e.ch.left;
    for (let i = 0; i < n; i++) {
      const x = -230 + i * 92;
      ctx.fillStyle = '#4f9a3c'; ctx.strokeStyle = '#2f6b25'; ctx.lineWidth = 4;
      for (const [dx, dy, r] of [[-16, -58, 20], [16, -62, 22], [0, -84, 20]]) { circ(x + dx, dy, r); ctx.fill(); ctx.stroke(); }
      if (i < left) potato(x, 30, 26);
      else if (ch !== undefined && t - ch < .5) { const k = (t - ch) / .5; ctx.fillStyle = `rgba(201,150,90,${1 - k})`; for (let j = 0; j < 6; j++) { circ(x + Math.cos(j) * 60 * k, 30 - 40 * k + Math.sin(j * 2) * 20, 7); ctx.fill(); } }
    }
  },
  fence(e) { for (let x = -330; x <= 330; x += 66) { rr(x - 24, -240, 48, 240, 10); stroke8('#e9c38f', 7); } rr(-360, -175, 720, 28, 10); stroke8('#d9ae72', 7); },
  person(e, a, t) { drawPerson(e.o, t); },
  flag(e, a, t) {
    const img = flagCanvas(e.o.c), W = 300, H = 190, top = -460;
    ctx.strokeStyle = OUT; ctx.lineWidth = 12; ctx.lineCap = 'round'; seg(0, 0, 0, top - 20); circ(0, top - 26, 12); stroke8('#e0b13a', 5);
    for (let sx = 0; sx < W; sx += 10) { const off = Math.sin(t * 4 - sx / 45) * 10 * (sx / W); ctx.drawImage(img, sx, 0, 10, H, sx, top + off, 10.6, H); }
    ctx.lineWidth = 5; ctx.beginPath();
    for (let sx = 0; sx <= W; sx += 10) { const off = Math.sin(t * 4 - sx / 45) * 10 * (sx / W); sx ? ctx.lineTo(sx, top + off) : ctx.moveTo(sx, top + off); }
    for (let sx = W; sx >= 0; sx -= 10) { const off = Math.sin(t * 4 - sx / 45) * 10 * (sx / W); ctx.lineTo(sx, top + H + off); }
    ctx.closePath(); ctx.stroke();
  },
  map(e, a, t) {
    const o = e.o;
    rr(-380, -280, 760, 560, 36); stroke8('#8fd0f5', 9);
    ctx.save(); rr(-380, -280, 760, 560, 36); ctx.clip();
    ctx.beginPath(); ctx.moveTo(-380, -280); ctx.lineTo(380, -280); ctx.lineTo(380, -200); ctx.quadraticCurveTo(160, -140, 60, -175); ctx.quadraticCurveTo(-70, -70, -200, -115); ctx.quadraticCurveTo(-300, -50, -380, -70); ctx.closePath(); stroke8('#f6c1c1', 8);
    ctx.beginPath(); ctx.moveTo(-380, 280); ctx.lineTo(380, 280); ctx.lineTo(380, 40); ctx.quadraticCurveTo(250, 95, 170, 60); ctx.quadraticCurveTo(40, 185, -120, 160); ctx.quadraticCurveTo(-260, 225, -380, 185); ctx.closePath(); stroke8('#bcd6f7', 8);
    ctx.restore();
    const isl = o.owner === 'us' ? '#9cc2f2' : o.owner === 'uk' ? '#f4a9a9' : '#bfe3a0';
    landBlob(-10, -5, .5, isl); landBlob(80, 40, .28, isl);
    ctx.setLineDash([18, 14]); ctx.lineWidth = 9; ctx.lineCap = 'butt';
    const showUS = o.lines && o.lines.includes('us'), showUK = o.lines && o.lines.includes('uk');
    if (showUS) { ctx.strokeStyle = '#2f5fc4'; ctx.beginPath(); ctx.moveTo(-200, -150); ctx.quadraticCurveTo(-120, 0, -170, 170); ctx.stroke(); }
    if (showUK) { ctx.strokeStyle = '#d62f3a'; ctx.beginPath(); ctx.moveTo(150, -160); ctx.quadraticCurveTo(190, 0, 170, 120); ctx.stroke(); }
    ctx.setLineDash([]);
    drawTag('CANADA BRITANICĂ', -150, -235, 34, 'rosu', -.03, 'center', 420);
    drawTag('SUA', 260, 232, 40, 'albastru', .03);
    drawTag(o.name || 'SAN JUAN', -10, 95, 32, 'verde', 0);
    if (o.q) { ctx.font = `110px ${CAP}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const y = -85 - Math.abs(Math.sin(t * 4)) * 22; ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.strokeText('?', -10, y); ctx.fillStyle = YEL; ctx.fillText('?', -10, y); }
  },
  bubble(e, a, t) {
    const T = bubbleText(e.o.text, e.o.w || 420), pw = T.w + 64, ph = T.h + 50, tail = e.o.tail || [-.3, 1];
    ctx.beginPath(); ctx.moveTo(tail[0] * pw / 2 - 26, ph / 2 - 8); ctx.lineTo(tail[0] * pw / 2 + tail[0] * 60 - 10, ph / 2 + 70 * tail[1]); ctx.lineTo(tail[0] * pw / 2 + 26, ph / 2 - 8); ctx.closePath(); stroke8('#fff', 8);
    rr(-pw / 2, -ph / 2, pw, ph, 34); stroke8('#fff', 8);
    ctx.beginPath(); ctx.moveTo(tail[0] * pw / 2 - 22, ph / 2 - 6); ctx.lineTo(tail[0] * pw / 2 + 22, ph / 2 - 6); ctx.strokeStyle = '#fff'; ctx.lineWidth = 10; ctx.stroke();
    ctx.font = `${T.size}px ${CAP}`; ctx.fillStyle = e.o.color || INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    T.lines.forEach((l, i) => ctx.fillText(l, 0, (i - (T.lines.length - 1) / 2) * (T.size + 6) + 3));
  },
  bill(e, a, t) {
    ctx.rotate(Math.sin(t * 2) * .03);
    rr(-170, -80, 340, 160, 14); stroke8('#9fd49a', 8);
    rr(-150, -60, 300, 120, 10); ctx.strokeStyle = '#3f7d3a'; ctx.lineWidth = 4; ctx.stroke();
    circ(0, 0, 46); stroke8('#c7e8c2', 5);
    bigText(e.o.text || '10 $', 0, 4, 64, '#fff', 300, 12);
  },
  soldiers(e, a, t) {
    const n = e.o.n || 6, gap = e.o.gap || 70, dir = e.o.side === 'uk' ? 1 : -1;
    for (let i = 0; i < n; i++) {
      const k = easeOut(clamp((a - i * .08) / .35, 0, 1)); if (k <= 0) continue;
      ctx.save(); ctx.translate((i - (n - 1) / 2) * gap + dir * 500 * (1 - k), 0); drawSoldier(e.o.side, t, i); ctx.restore();
    }
    if (e.o.label && a > .4) drawTag(e.o.label, 0, 60, 46, e.o.side === 'uk' ? 'rosu' : 'albastru', -.02);
  },
  ship(e, a, t) { ctx.translate(0, Math.sin(t * 2 + e.x) * 6); ctx.rotate(Math.sin(t * 1.5 + e.x) * .03); drawShip(t, e.o.flag); },
  sea(e, a, t) {
    ctx.fillStyle = '#8fd0f5'; ctx.fillRect(-600, 0, 1200, e.o.h || 230); ctx.strokeStyle = OUT; ctx.lineWidth = 8; seg(-600, 0, 600, 0);
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 5;
    for (let i = 0; i < 9; i++) { const x = -480 + i * 120 + Math.sin(t + i) * 12, y = 60 + (i % 3) * 45; ctx.beginPath(); ctx.arc(x, y, 18, Math.PI * 1.1, Math.PI * 1.9); ctx.arc(x + 32, y, 18, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
  },
  tent(e, a, t) {
    ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(0, -200); ctx.lineTo(150, 0); ctx.closePath(); stroke8(e.o.c || '#e9dcc3', 8);
    ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(-40, 0); ctx.lineTo(40, 0); ctx.closePath(); stroke8('#5a4636', 6);
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; seg(0, -200, 0, -290);
    ctx.drawImage(flagCanvas(e.o.flag || 'us'), 0, -292, 84, 54); ctx.lineWidth = 3; ctx.strokeRect(0, -292, 84, 54);
  },
  cannon(e, a, t) {
    circ(-40, 30, 34); stroke8('#7a4b2a', 7); circ(-40, 30, 8); ctx.fillStyle = OUT; ctx.fill();
    ctx.save(); ctx.rotate(-.25); rr(-70, -26, 190, 52, 24); stroke8('#3a3a3a', 7); ctx.restore();
  },
  years(e, a, t) {
    const v = Math.round(lerp(e.o.from, e.o.to, easeInOut(clamp(a / (e.o.d || 1.4), 0, 1))));
    rr(-200, -220, 400, 440, 30); stroke8('#fff', 9);
    ctx.save(); rr(-200, -220, 400, 440, 30); ctx.clip(); ctx.fillStyle = RED; ctx.fillRect(-200, -220, 400, 106); ctx.restore();
    rr(-200, -220, 400, 440, 30); ctx.lineWidth = 9; ctx.strokeStyle = OUT; ctx.stroke();
    for (const s of [-1, 1]) { rr(s * 100 - 14, -250, 28, 64, 14); stroke8('#7c7c7c', 6); }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `46px ${CAP}`; ctx.fillStyle = '#fff'; ctx.fillText('ANUL', 0, -165);
    ctx.font = `140px ${CAP}`; ctx.fillStyle = INK; ctx.fillText(String(v), 0, 30);
    if (e.o.sub) { ctx.font = `italic 700 34px ${FONT}`; ctx.fillStyle = '#5b4a5e'; ctx.fillText(up(e.o.sub), 0, 160); }
  },
  gavel(e, a, t) {
    const k = clamp(a / .25, 0, 1), ang = lerp(-1.1, .15, easeOut(k));
    rr(-150, 80, 300, 40, 12); stroke8('#8a5a35', 7);
    ctx.save(); ctx.translate(90, 40); ctx.rotate(ang); rr(-200, -14, 220, 28, 12); stroke8('#b5733d', 7); rr(-250, -50, 90, 100, 18); stroke8('#8a5a35', 7); ctx.restore();
    if (a > .22 && a < .6) { ctx.strokeStyle = OUT; ctx.lineWidth = 7; for (const g of [-2.4, -1.9, -1.2]) seg(-120 + Math.cos(g) * 70, 70 + Math.sin(g) * 70, -120 + Math.cos(g) * 110, 70 + Math.sin(g) * 110); }
  },
  checklist(e, a, t) {
    const o = e.o, items = o.items || [], W = 330, Hh = 92 + items.length * 52;
    ctx.fillStyle = INK; rr(-W / 2 + 6, -Hh / 2 + 8, W, Hh, 18); ctx.fill();
    rr(-W / 2, -Hh / 2, W, Hh, 18); stroke8('#fff', 7);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `${fitFont(up(o.title || ''), `$px ${CAP}`, 34, W - 40)}px ${CAP}`; ctx.fillStyle = '#d62f3a'; ctx.fillText(up(o.title || ''), 0, -Hh / 2 + 40);
    o.tickT = o.tickT || [];
    items.forEach((it, i) => {
      const y = -Hh / 2 + 92 + i * 52, done = i < (o.done || 0);
      if (done && o.tickT[i] === undefined) o.tickT[i] = t;
      rr(-W / 2 + 24, y - 16, 32, 32, 6); stroke8('#fff', 5);
      ctx.font = `italic 700 ${fitFont(up(it), `italic 700 $px ${FONT}`, 30, W - 86)}px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = done ? OUT : '#b3aab0'; ctx.fillText(up(it), -W / 2 + 70, y + 1);
      if (done) {
        const k = clamp((t - o.tickT[i]) / .3, 0, 1); ctx.strokeStyle = '#2e9d55'; ctx.lineWidth = 7; ctx.lineCap = 'round'; checkPath(-W / 2 + 40, y, k);
        if (k < 1) { ctx.fillStyle = `rgba(255,201,39,${.5 * (1 - k)})`; rr(-W / 2 + 10, y - 24, W - 20, 48, 10); ctx.fill(); }
      }
      if (o.cross === i) {
        o.crossT = o.crossT ?? t; const k = clamp((t - o.crossT) / .3, 0, 1);
        ctx.strokeStyle = '#d62f3a'; ctx.lineWidth = 8; seg(-W / 2 + 18, y, lerp(-W / 2 + 18, W / 2 - 18, k), y);
        if (k >= 1) drawTag('ANULAT', 70, y - 6, 30, 'stampila', -.12);
      }
      if (o.alarm === i && o.cross !== i && Math.sin(t * 12) > 0) { ctx.strokeStyle = '#d62f3a'; ctx.lineWidth = 5; rr(-W / 2 + 10, y - 24, W - 20, 48, 10); ctx.stroke(); }
    });
  },
  tag(e) { drawTag(e.o.text, 0, 0, e.o.size || 46, e.o.style || 'galben', 0, 'center', e.o.maxW || 700); },
  text(e) { bigText(e.o.text, 0, 0, e.o.size || 80, e.o.color || '#fff', e.o.maxW || 900); },
  burst(e, a, t) {
    ctx.rotate(Math.sin(t * 3) * .04 - .05); const k = .92 + .08 * Math.sin(t * 8), R = e.o.r || 300; ctx.scale(k, k);
    ctx.beginPath(); for (let i = 0; i < 32; i++) { const g = i / 32 * TAU, r = i % 2 ? R * .74 : R; i ? ctx.lineTo(Math.cos(g) * r, Math.sin(g) * r * .85) : ctx.moveTo(Math.cos(g) * r, Math.sin(g) * r * .85); } ctx.closePath();
    fillStroke(e.o.fill || YEL, 12, RED);
    bigText(e.o.text || 'BUM!', 0, 4, R * .42, RED, R * 1.4, 16);
  },
  circle(e, a, t) {
    const k = clamp(a / .4, 0, 1), r = e.o.r || 120;
    ctx.strokeStyle = '#d62f3a'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.1, r, -.1, -1.4, -1.4 + TAU * 1.05 * k); ctx.stroke();
    if (e.o.label && k >= 1) drawTag(e.o.label, r * .7, -r - 20, 34, 'rosu', .08);
  },
  xmark(e, a, t) {
    const k = clamp(a / .35, 0, 1), r = e.o.r || 120, k1 = Math.min(1, k * 2), k2 = clamp(k * 2 - 1, 0, 1);
    ctx.strokeStyle = '#d62f3a'; ctx.lineWidth = 22; ctx.lineCap = 'round';
    seg(-r, -r, lerp(-r, r, k1), lerp(-r, r, k1)); if (k2 > 0) seg(r, -r, lerp(r, -r, k2), lerp(-r, r, k2));
  },
  q(e, a, t) { ctx.font = `${e.o.size || 130}px ${CAP}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const y = -Math.abs(Math.sin(t * 4 + e.x)) * 22; ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(e.o.text || '?', 0, y); ctx.fillStyle = e.o.color || YEL; ctx.fillText(e.o.text || '?', 0, y); },
  speed(e, a, t) { ctx.strokeStyle = 'rgba(29,18,32,.35)'; ctx.lineWidth = 7; ctx.lineCap = 'round'; for (let i = 0; i < 6; i++) { const y = -120 + i * 45, x = -((t * 900 + i * 170) % 260); seg(x - 160, y, x, y); } },
  sparkle(e, a, t) { for (let i = 0; i < 5; i++) { const g = t * 1.6 + i * 1.25; drawEmoji('✨', Math.cos(g) * (e.o.r || 260), Math.sin(g * 1.3) * (e.o.r || 260) * .5, 52); } },
};

/* ---------- legătura cu studioul ---------- */
const _setProp = setProp;
setProp = function (p, t) {
  const changed = p !== S.prop;
  _setProp(p, t);
  if (changed && p && p.type === 'scena') runBeat(+p.args[0], t);
};
const _drawPropLayer = drawPropLayer;
drawPropLayer = function (t) {
  const ep = S.ep || S.preview;
  if (ep && ep.scene && EPISODES[ep.scene]) { drawBurst(t); drawScene(t); return; }
  _drawPropLayer(t);
};
