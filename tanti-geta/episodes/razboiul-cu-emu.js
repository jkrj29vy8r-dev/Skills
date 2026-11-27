/* Războaie absurde #2: Războiul cu emu (Australia de Vest, 1932).
   Fapte: după Primul Război Mondial, foști soldați au primit pământ în Australia de Vest și au cultivat grâu.
   În 1932, circa 20.000 de emu au năvălit peste culturi. Fermierii au cerut mitraliere; armata l-a trimis pe
   maiorul G.P.W. Meredith cu doi soldați, două mitraliere Lewis și 10.000 de cartușe. Emu s-au împrăștiat,
   o mitralieră s-a blocat la o ambuscadă, iar o mitralieră montată pe camion n-a putut ține pasul pe teren
   accidentat. Armata s-a retras după câteva zile (8 noiembrie), a revenit pe 13 noiembrie și a continuat până
   pe 10 decembrie. Meredith a raportat 986 de emu uciși cu 9.860 de cartușe (~10 pe emu) și a spus că emu
   „pot înfrunta mitralierele cu invulnerabilitatea tancurilor”. Emu pot alerga cu ~50 km/h. */
(function () {
  const SCORE = { x: 830, y: 1300, s: 1, hud: 1, title: 'SCOR', army: 0, emu: 0, in: 'slideR' };
  const GETA_ID = ['BULETIN DE BLOC', 'NUME: TANTI GETA', 'FUNCȚIA: VECINĂ, ETAJ 3', 'SURSA: GEAMUL'];

  registerEpisode('⭐ Războiul cu emu (scene)', {
    title: 'Războiul cu emu',
    serie: ['RĂZBOAIE ABSURDE', '#2'],
    beats: [
      // --- HOOK
      B('socata', 'Australia | a pierdut un război.', s => {
        s.add('emu', 'emu', { x: 470, y: 900, s: 1.05, mood: 'smug' });
        s.add('sp', 'sparkle', { x: 540, y: 520, r: 300 });
      }),
      B('banuitoare zoom', 'Cu niște *păsări*.', s => {
        s.add('win', 'tag', { x: 790, y: 360, text: 'CÂȘTIGĂTORUL', style: 'galben', size: 50, r: .1, in: 'stamp' });
      }),
      B('vesela', 'Sunt *Tanti Geta*, | și asta e bârfă adevărată.', s => {
        s.clear(); s.add('id', 'prop', { prop: 'buletin', args: GETA_ID });
        s.add('ver', 'tag', { x: 800, y: 840, text: 'VERIFICAT', style: 'stampila', size: 50, r: -.08, in: 'stamp', delay: 1.0 });
      }),
      // --- context
      B('explica', '*1932*, | Australia de Vest.', s => {
        s.clear(); s.add('au', 'australia', { x: 560, y: 600, s: 1.15, west: 1, pin: 1 });
        s.add('yr', 'tag', { x: 300, y: 330, text: '1932', style: 'negru', size: 56, r: -.05 });
        s.add('hud', 'score', { ...SCORE, delay: .5 });
      }),
      B('suparata', '*20.000 de emu* | năvălesc peste grâu.', s => {
        s.clear(); s.add('wh', 'wheat', { x: 540, y: 880, s: .95 });
        s.add('herd', 'emus', { x: 540, y: 690, n: 9, run: 1, w: 700, h: 120, seed: 3 });
        s.add('n', 'tag', { x: 540, y: 330, text: '20.000 DE EMU', style: 'rosu', size: 54, r: -.04, in: 'stamp', delay: .6 });
      }),
      B('explica', 'Fermierii | cheamă *armata*.', s => {
        s.clear(); s.add('wh', 'wheat', { x: 640, y: 880, s: .8, left: 5, in: 'fade' }); s.dim('wh', .6);
        s.add('fa', 'person', { kind: 'aussie', x: 250, y: 880, s: .9, pose: 'wave', talk: true, mood: 'shock', in: 'slideL' });
        s.add('b', 'bubble', { x: 640, y: 420, text: 'AJUTOR! ARMATA!', tail: [-.5, 1] });
      }),
      B('explica', 'Vine un *maior*, | cu *două mitraliere* | și *10.000 de gloanțe*.', s => {
        s.clear(); s.add('mj', 'person', { kind: 'major', x: 220, y: 890, s: .88, pose: 'hips', mood: 'smug', in: 'slideL' });
        s.add('mg', 'lewis', { x: 620, y: 560, s: .9, delay: .8 });
        s.add('bl', 'bullets', { x: 640, y: 830, n: 8, gap: 50, delay: 1.8 });
        s.add('l', 'tag', { x: 640, y: 920, text: '10.000 GLOANȚE', style: 'negru', size: 40, delay: 2.4 });
      }),
      // --- primul eșec
      B('rade', 'Emu: | se *împrăștie*.', s => {
        s.clear(); s.add('sp', 'speed', { x: 540, y: 640 });
        s.add('herd', 'emus', { x: 540, y: 760, n: 8, run: 1, scatter: 1, w: 300, h: 140, seed: 9 });
        s.set('hud', { emu: 1 }); s.fx('boing');
      }),
      B('mirata', 'Fug cu *50 la oră*. | În zigzag!', s => {
        s.clear(); s.add('g', 'gauge', { x: 540, y: 560, s: .95, v: 50, max: 60 });
        s.add('e1', 'emus', { x: 540, y: 900, n: 3, run: 1, zig: 1, w: 600, h: 40, seed: 5 });
      }),
      B('suparata scratch', 'La o ambuscadă, | mitraliera *se blochează*.', s => {
        s.clear(); s.add('mg', 'lewis', { x: 520, y: 600, s: 1.05, fire: 1 });
        s.add('jam', 'tag', { x: 760, y: 380, text: 'BLOCATĂ', style: 'rosu', size: 56, r: .1, in: 'stamp', delay: 1.1 });
        s.set('hud', { emu: 2 });
      }),
      B('explica', 'Pun mitraliera | pe un *camion*.', s => {
        s.clear(); s.add('tr', 'truck', { x: 470, y: 760, s: .95, drive: 1, in: 'slideL' });
      }),
      B('rade badumts', 'Camionul | nu le prinde.', s => {
        s.set('tr', { fire: 1 });
        s.add('herd', 'emus', { x: 830, y: 760, n: 3, run: 1, zig: 1, w: 160, h: 60, seed: 4, s: .9 });
        s.set('hud', { emu: 3 });
      }),
      B('umeri trist', 'Armata | se *retrage*.', s => {
        s.clear(); s.add('mj', 'person', { kind: 'major', x: 540, y: 890, s: .95, pose: 'shrug', mood: 'shock', in: 'drop' });
        s.add('r', 'tag', { x: 800, y: 380, text: 'RETRAGERE', style: 'negru', size: 50, r: .08, in: 'stamp' });
        s.set('hud', { emu: 4 });
      }),
      // --- a doua încercare
      B('explica', 'Revine. | Mai încearcă *o lună*.', s => {
        s.clear(); s.add('yrs', 'prop', { prop: 'an', args: ['1932', 'noiembrie → decembrie'] });
      }),
      B('socata', 'Aproape *10 gloanțe* | pe fiecare emu.', s => {
        s.clear(); s.add('bl', 'bullets', { x: 540, y: 440, n: 10, gap: 62 });
        s.add('eq', 'text', { x: 540, y: 590, text: '=', size: 110 });
        s.add('e', 'emu', { x: 500, y: 920, s: .55, delay: .5 });
        s.add('r', 'tag', { x: 820, y: 760, text: '10 LA 1', style: 'galben', size: 48, r: .08, in: 'stamp', delay: .9 });
      }),
      B('mirata', 'Maiorul zice: | înfruntă mitralierele | ca niște *tancuri*.', s => {
        s.clear(); s.add('c', 'prop', { prop: 'carnet', args: ['RAPORTUL MAIORULUI', '„Înfruntă mitralierele ca niște tancuri.”', '– maiorul Meredith'] });
      }),
      // --- final
      B('rade tada', 'Scor final? | Emu: *multe*. | Armata: *zero*.', s => {
        s.clear(); s.add('e', 'emu', { x: 470, y: 900, s: 1, mood: 'smug' }); s.add('sp', 'sparkle', { x: 540, y: 520, r: 300 });
        s.set('hud', { emu: '∞' });
      }),
      B('explica', 'Eu sunt *Tanti Geta*.', s => {
        s.clear(); s.out('hud'); s.add('id', 'prop', { prop: 'buletin', args: GETA_ID });
      }),
      B('banuitoare', 'Data viitoare: | omul care a vândut | *Turnul Eiffel*.', s => {
        s.clear(); s.add('dv', 'text', { x: 540, y: 330, text: 'DATA VIITOARE:', size: 78 });
        s.add('tw', 'eiffel', { x: 540, y: 820, s: .78 });
        s.add('t1', 'tag', { x: 540, y: 850, text: 'VÂNDUT DE DOUĂ ORI?', style: 'rosu', size: 48, r: -.03, in: 'stamp', delay: .6 });
      }, { sticker: 'galben FOLLOW' }),
    ],
  });
})();
