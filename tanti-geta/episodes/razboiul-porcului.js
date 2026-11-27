/* Războaie absurde #1: Războiul porcului (insula San Juan, 1859).
   Fiecare replică construiește scena ei. Coordonate pe ecranul 1080×1920:
   obiectele stau în zona y 280–900, lista de escaladare în dreapta-jos.

   Fapte: granița din Tratatul Oregon (1846) era neclară, iar insulele San Juan
   erau revendicate de ambele părți. În iunie 1859 fermierul american Lyman Cutlar
   a împușcat porcul lui Charles Griffin (angajat al Companiei Golfului Hudson)
   care îi mânca cartofii; a oferit 10 $, i s-au cerut 100 $. Britanicii au amenințat
   cu arestarea, americanii au trimis soldați (în august: 461 de oameni, 14 tunuri),
   britanicii 5 nave de război și peste 2.000 de oameni. Amiralul Baynes a refuzat
   ordinul guvernatorului James Douglas de a debarca, spunând că nu bagă două mari
   națiuni într-un război „pentru o ceartă despre un porc”. Ocupație comună până în
   1872, fără focuri trase; arbitrajul Kaiserului Wilhelm I a dat insulele SUA.
   Singura victimă: porcul. */
(function () {
  const HUD = { x: 830, y: 1300, s: .98, hud: 1, title: 'ESCALADARE', items: ['Ceartă de vecini', 'Amenințări', 'Armata', 'Flota', 'RĂZBOI'], done: 0, in: 'slideR' };
  const GETA_ID = ['BULETIN DE BLOC', 'NUME: TANTI GETA', 'FUNCȚIA: VECINĂ, ETAJ 3', 'SURSA: GEAMUL'];

  registerEpisode('⭐ Războiul porcului (scene)', {
    title: 'Războiul porcului',
    serie: ['RĂZBOAIE ABSURDE', '#1'],
    beats: [
      // --- HOOK
      B('socata', 'Războiul ăsta | a avut o singură victimă.', s => {
        s.add('pig', 'pig', { x: 540, y: 640, s: .95 });
        s.add('yr', 'tag', { x: 540, y: 320, text: '1859', style: 'negru', size: 56 });
      }),
      B('banuitoare zoom', 'Un *porc*.', s => {
        s.add('rip', 'tag', { x: 790, y: 420, text: 'R.I.P.', style: 'negru', size: 64, r: .12, in: 'stamp' });
      }),
      // --- cine povestește
      B('vesela', 'Sunt *Tanti Geta*, | expertă în certuri | de vecini.', s => {
        s.clear(); s.add('id', 'prop', { prop: 'buletin', args: GETA_ID });
        s.add('exp', 'tag', { x: 800, y: 840, text: 'EXPERTĂ', style: 'rosu', size: 50, r: -.06, in: 'stamp', delay: .9 });
      }),
      B('sopteste', 'Cearta asta | le bate pe toate.', s => {
        s.clear(); s.add('hud', 'checklist', HUD);
        s.add('q', 'q', { x: 540, y: 600, size: 300 });
      }),
      // --- insula
      B('explica', '*1859*. | Insula San Juan.', s => {
        s.clear(); s.add('map', 'map', { x: 540, y: 600, s: .95, q: 1 });
      }),
      B('banuitoare', 'Americanii zic: | e a noastră.', s => {
        s.set('map', { lines: ['us'] }); s.add('fus', 'flag', { c: 'us', x: 115, y: 900, s: .5, in: 'drop' });
      }),
      B('suparata', 'Britanicii zic: | ba e a noastră!', s => {
        s.set('map', { lines: ['us', 'uk'] }); s.add('fuk', 'flag', { c: 'uk', x: 790, y: 900, s: .5, in: 'drop' });
      }),
      B('umeri', 'Așa că stau | amândoi pe ea.', s => {
        s.set('map', { q: 0 }); s.add('both', 'tag', { x: 530, y: 470, text: 'AMÂNDOI', style: 'galben', size: 46, r: -.05, in: 'stamp' });
      }),
      // --- vecinii
      B('explica', '*Lyman*, american, | cu o grădină | de *cartofi*.', s => {
        s.clear(); s.add('far', 'person', { kind: 'farmer', x: 230, y: 880, s: .88, in: 'slideL' });
        s.add('lf', 'tag', { x: 230, y: 920, text: 'LYMAN 🇺🇸', style: 'albastru', size: 34 });
        s.add('gar', 'garden', { x: 600, y: 800, s: .62, left: 6, delay: .6 });
        s.add('c1', 'circle', { x: 600, y: 790, r: 150, label: 'CARTOFI', delay: 1.1 });
      }),
      B('banuitoare', 'Vecinul lui, | omul *britanicilor*, | avea un *porc*.', s => {
        s.add('wor', 'person', { kind: 'worker', x: 900, y: 880, s: .8, in: 'slideR' });
        s.add('lw', 'tag', { x: 900, y: 920, text: 'GRIFFIN 🇬🇧', style: 'rosu', size: 30 });
        s.add('pig', 'pig', { x: 790, y: 880, s: .34, flip: 1, in: 'drop', delay: 1.1 });
      }),
      B('banuitoare tic', 'Porcul intră | în grădină…', s => {
        s.out('c1'); s.set('pig', { walk: true }); s.move('pig', { x: 600, y: 855 }, 1.1);
      }),
      B('suparata', 'Și mănâncă | *cartofii*.', s => {
        s.set('pig', { walk: false }); s.set('gar', { left: 2 });
        s.add('cr', 'tag', { x: 600, y: 600, text: 'CRONC!', style: 'galben', size: 50, r: .08, in: 'stamp' });
      }),
      B('socata', 'Nu era | *prima dată*.', s => {
        s.out('cr'); s.set('gar', { left: 0 });
        s.add('iar', 'tag', { x: 600, y: 600, text: 'IAR?!', style: 'rosu', size: 64, r: -.06, in: 'stamp' });
        s.set('hud', { done: 1 }); s.fx('pop');
      }),
      // --- PAC
      B('socata boom', 'Lyman | împușcă porcul.', s => {
        s.clear(); s.add('pac', 'burst', { x: 540, y: 600, text: 'PAC!', r: 260 });
        s.add('rip2', 'tag', { x: 800, y: 380, text: 'R.I.P.', style: 'negru', size: 60, r: .12, in: 'stamp', delay: .7 });
      }),
      // --- negocierea
      B('explica', 'Lyman îi oferă | *10 dolari*.', s => {
        s.clear(); s.add('far', 'person', { kind: 'farmer', x: 250, y: 880, s: .85, pose: 'point', talk: true, in: 'slideL' });
        s.add('b1', 'bubble', { x: 370, y: 330, text: 'ÎȚI DAU 10 $', tail: [-.4, 1] });
      }),
      B('suparata', 'Vecinul cere | *100*.', s => {
        s.set('far', { talk: false, pose: 'rest' });
        s.add('wor', 'person', { kind: 'worker', x: 840, y: 880, s: .85, mood: 'angry', talk: true, pose: 'hips', in: 'slideR' });
        s.add('b2', 'bubble', { x: 730, y: 500, text: '100 $!', tail: [.4, 1], color: '#d62f3a' });
      }),
      B('umeri', 'Nu se înțeleg.', s => {
        s.set('wor', { talk: false }); s.dim('b1'); s.dim('b2');
        s.add('x', 'xmark', { x: 540, y: 430, r: 90 });
      }),
      B('banuitoare', 'Britanicii amenință | că-l *arestează*.', s => {
        s.clear(); s.add('ph', 'prop', { prop: 'mesaj', args: ['AUTORITĂȚILE BRITANICE', 'Lyman, te arestăm.'] });
        s.set('hud', { done: 2 }); s.fx('pop');
      }),
      B('suparata', 'Americanii cheamă | *armata*.', s => {
        s.clear(); s.add('us', 'soldiers', { side: 'us', n: 6, x: 540, y: 700, s: 1.25, label: 'ARMATA SUA' });
        s.set('hud', { done: 3 });
      }),
      B('mirata tobe', 'Britanicii trimit | *corăbii de război*.', s => {
        s.clear(); s.add('sea', 'sea', { x: 540, y: 700, z: -1, in: 'fade', sfx: null });
        for (let i = 0; i < 3; i++) s.add('sh' + i, 'ship', { x: 250 + i * 290, y: 705, s: .72, flag: 'uk', in: 'slideR', delay: i * .18 });
        s.add('lbl', 'tag', { x: 300, y: 330, text: 'FLOTA BRITANICĂ', style: 'rosu', size: 46, r: -.04, delay: .4 });
        s.set('hud', { done: 4 });
      }),
      B('explica', '*461 de americani*, | cu *14 tunuri*.', s => {
        s.clear(); s.add('us', 'soldiers', { side: 'us', n: 7, x: 540, y: 560, gap: 66, label: '461' });
        for (let i = 0; i < 3; i++) s.add('c' + i, 'cannon', { x: 330 + i * 200, y: 790, s: .75, delay: .3 + i * .12 });
        s.add('l14', 'tag', { x: 540, y: 890, text: '14 TUNURI', style: 'negru', size: 42, delay: .6 });
      }),
      B('socata', 'Contra peste | *2.000 de britanici*.', s => {
        s.clear(); s.add('us', 'soldiers', { side: 'us', n: 3, x: 540, y: 470, gap: 66, label: '461', s: .9, in: 'fade' });
        s.add('vs', 'text', { x: 540, y: 595, text: 'VS', size: 70, color: RED });
        s.add('uk', 'soldiers', { side: 'uk', n: 10, x: 540, y: 820, gap: 60, label: '2.140' });
      }),
      B('rade badumts', 'Pentru | un porc.', s => {
        s.clear(); s.add('pig', 'pig', { x: 540, y: 620, s: .8 }); s.add('sp', 'sparkle', { x: 540, y: 600 });
        s.add('mot', 'tag', { x: 540, y: 860, text: 'MOTIVUL', style: 'galben', size: 50, r: -.04, in: 'stamp' });
      }),
      // --- aproape război
      B('sopteste', 'Guvernatorul britanic | ordonă: *atacați!*', s => {
        s.clear(); s.add('gov', 'person', { kind: 'governor', x: 360, y: 880, s: .9, mood: 'angry', pose: 'point', talk: true, in: 'slideL' });
        s.add('bg', 'bubble', { x: 720, y: 400, text: 'ATACAȚI!', color: '#d62f3a', tail: [-.6, 1] });
        s.set('hud', { alarm: 4 });
      }),
      B('mirata', 'Dar amiralul | se uită și zice:', s => {
        s.clear(); s.add('adm', 'person', { kind: 'admiral', x: 720, y: 880, s: .9, mood: 'shock', in: 'slideR' });
        s.add('q1', 'q', { x: 480, y: 450, size: 120 });
      }),
      B('vesela ding', '„Nu încep un război | pentru *un porc*.”', s => {
        s.out('q1'); s.set('adm', { mood: 'smug', talk: true, pose: 'stop' });
        s.add('ba', 'bubble', { x: 420, y: 380, text: 'PENTRU UN PORC? NU.', tail: [.5, 1], w: 360 });
        s.set('hud', { cross: 4 });
      }),
      // --- 12 ani
      B('explica', 'Așa că stau | amândoi pe insulă.', s => {
        s.clear(); s.add('t1', 'tent', { x: 320, y: 820, flag: 'us', s: .9 });
        s.add('t2', 'tent', { x: 770, y: 820, flag: 'uk', s: .9, c: '#f3d9d9', delay: .15 });
      }),
      B('mirata', '*12 ani!*', s => {
        s.dim('t1'); s.dim('t2'); s.add('yrs', 'years', { x: 540, y: 600, s: .85, from: 1860, to: 1872, d: 1.1 });
      }),
      B('rade', 'Fără să tragă | *un glonț*.', s => {
        s.add('g0', 'tag', { x: 790, y: 830, text: '0 GLOANȚE', style: 'verde', size: 48, r: -.08, in: 'stamp' });
      }),
      // --- arbitrul
      B('explica', 'Până la urmă, | decide un arbitru:', s => {
        s.clear(); s.add('gv', 'gavel', { x: 600, y: 560, s: 1.6, sfx: 'stamp' });
      }),
      B('rade badumts', '*Kaiserul Germaniei*.', s => {
        s.clear(); s.add('k', 'person', { kind: 'kaiser', x: 600, y: 890, s: 1, mood: 'smug', in: 'drop' });
        s.add('fde', 'flag', { c: 'de', x: 150, y: 880, s: .5, delay: .2 });
        s.add('kn', 'tag', { x: 820, y: 380, text: 'WILHELM I', style: 'negru', size: 44, r: .08, in: 'stamp', delay: .3 });
      }),
      B('explica', 'Insulele rămân | *americane*.', s => {
        s.clear(); s.add('map', 'map', { x: 540, y: 600, s: .95, owner: 'us', lines: ['us'] });
        s.add('st', 'tag', { x: 770, y: 420, text: 'SUA · 1872', style: 'albastru', size: 48, r: .08, in: 'stamp', delay: .2 });
      }),
      // --- final
      B('vesela trist', 'Și porcul? | Singura *victimă*.', s => {
        s.clear(); s.out('hud'); s.add('pa', 'prop', { prop: 'porc', args: ['ÎNGER'] });
        s.add('sv', 'tag', { x: 780, y: 360, text: 'SINGURA VICTIMĂ', style: 'galben', size: 40, r: .1, in: 'stamp', delay: .3 });
      }),
      B('explica', 'Eu sunt *Tanti Geta*.', s => {
        s.clear(); s.add('id', 'prop', { prop: 'buletin', args: GETA_ID });
      }),
      B('banuitoare', 'Data viitoare: | o armată bătută | de *păsări*.', s => {
        s.clear(); s.add('nx', 'prop', { prop: 'urmeaza', args: ['🐦 EMU', '🪖 ARMATA'] });
      }, { sticker: 'galben FOLLOW' }),
    ],
  });
})();
