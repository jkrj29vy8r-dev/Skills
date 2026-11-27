/* Înfrângeri absurde #1: Napoleon și iepurii (1807).
   Sursa: memoriile generalului Paul Thiébault (anecdotă, prezentată ca atare în clip).
   După Tratatele de la Tilsit (iulie 1807), mareșalul Louis-Alexandre Berthier a organizat pentru Napoleon
   o vânătoare de iepuri. A adunat sute, poate până la 3.000 de iepuri, dar erau iepuri de casă cumpărați de la
   țărani. Eliberați, n-au fugit, ci s-au năpustit spre Napoleon și oamenii lui (obișnuiți să primească mâncare
   de la oameni), i s-au urcat pe picioare; vizitiii au încercat cu biciul, iar Napoleon s-a retras la trăsură. */
(function () {
  const GETA_ID = ['BULETIN DE BLOC', 'NUME: TANTI GETA', 'FUNCȚIA: VECINĂ, ETAJ 3', 'SURSA: GEAMUL'];
  const PLAN = { x: 830, y: 1300, s: .98, hud: 1, title: 'PLANUL LUI BERTHIER', items: ['Adună iepuri', 'Dă-le drumul', 'Iepurii fug', 'Napoleon vânează'], done: 0, in: 'slideR' };

  registerEpisode('⭐ Napoleon și iepurii (scene)', {
    title: 'Napoleon și iepurii',
    serie: ['ÎNFRÂNGERI ABSURDE', '#1'],
    beats: [
      // --- HOOK
      B('socata', 'Napoleon | a bătut jumătate din Europa.', s => {
        s.add('np', 'person', { kind: 'napoleon', x: 540, y: 900, s: 1.1, pose: 'hand', mood: 'smug' });
        s.add('imp', 'tag', { x: 800, y: 380, text: 'ÎMPĂRAT', style: 'galben', size: 52, r: .08 });
      }),
      B('banuitoare zoom', 'Dar a fugit | de niște *iepuri*.', s => {
        s.set('np', { mood: 'shock', pose: 'shrug' }); s.out('imp');
        s.add('r1', 'rabbit', { x: 220, y: 900, s: .55, hop: 1, in: 'drop' });
        s.add('st', 'tag', { x: 540, y: 330, text: 'ÎNVINS DE IEPURI?!', style: 'rosu', size: 56, r: -.05, in: 'stamp', delay: .5 });
      }),
      B('vesela', 'Sunt *Tanti Geta*, | și asta e bârfă imperială.', s => {
        s.clear(); s.add('id', 'prop', { prop: 'buletin', args: GETA_ID });
      }),
      B('sopteste', 'Așa povestește | un general francez | în *memoriile* lui.', s => {
        s.clear(); s.add('c', 'prop', { prop: 'carnet', args: ['MEMORIILE GENERALULUI', '„Iepurii au luat-o drept spre împărat…”', '– generalul Thiébault'] });
      }),
      // --- vânătoarea
      B('explica', '*1807*. | Napoleon semnează o pace.', s => {
        s.clear(); s.add('tr', 'prop', { prop: 'pergament', args: ['TRATATUL DE LA TILSIT', 'Pace!', 'Semnat: Napoleon'] });
        s.add('hud', 'checklist', { ...PLAN, delay: .6 });
      }),
      B('vesela', 'Și vrea s-o sărbătorească | cu o *vânătoare de iepuri*.', s => {
        s.clear(); s.add('np', 'person', { kind: 'napoleon', x: 300, y: 900, s: .95, pose: 'hand', mood: 'smug', in: 'slideL' });
        s.add('b', 'bubble', { x: 700, y: 430, text: 'VÂNĂTOARE!', tail: [-.5, 1] });
      }),
      B('mirata', 'Mareșalul *Berthier* | adună sute, poate *mii* de iepuri.', s => {
        s.clear(); s.add('be', 'person', { kind: 'admiral', x: 220, y: 900, s: .9, pose: 'point', talk: true, in: 'slideL' });
        s.add('lb', 'tag', { x: 220, y: 935, text: 'BERTHIER', style: 'albastru', size: 34 });
        for (let i = 0; i < 3; i++) s.add('cr' + i, 'crate', { x: 520 + (i % 2) * 300, y: 640 + (i > 1 ? 240 : 0) - (i % 2) * 0, s: .9, delay: .3 + i * .2 });
        s.add('n', 'tag', { x: 790, y: 330, text: 'PÂNĂ LA 3.000?', style: 'galben', size: 48, r: .07, in: 'stamp', delay: 1.2 });
        s.set('hud', { done: 1 });
      }),
      B('explica', 'Le dă drumul | din cuști.', s => {
        for (let i = 0; i < 3; i++) s.set('cr' + i, { open: 1 });
        s.out('n'); s.add('hop', 'rabbits', { x: 640, y: 900, n: 9, hop: 1, out: 1, w: 560, h: 60, seed: 4, delay: .3 });
        s.set('hud', { done: 2 });
      }),
      // --- surpriza
      B('socata scratch', 'Dar iepurii | *nu fug*.', s => {
        s.clear(); s.add('rb', 'rabbits', { x: 540, y: 820, n: 10, w: 760, h: 200, seed: 6 });
        s.add('q', 'q', { x: 540, y: 420, size: 150 });
        s.set('hud', { cross: 2 });
      }),
      B('suparata boom', '*Atacă!*', s => {
        s.clear(); s.add('sp', 'speed', { x: 760, y: 700 });
        s.add('np', 'person', { kind: 'napoleon', x: 220, y: 900, s: .9, mood: 'shock', pose: 'shrug' });
        s.add('rb', 'rabbits', { x: 780, y: 830, n: 12, hop: 1, angry: 1, toward: -520, speed: 380, w: 380, h: 220, seed: 8 });
        s.set('hud', { alarm: 3 });
      }),
      B('socata', 'Sar pe Napoleon | și i se urcă pe picioare.', s => {
        s.clear(); s.add('np', 'person', { kind: 'napoleon', x: 540, y: 920, s: 1.05, mood: 'shock', pose: 'shrug' });
        s.add('rb', 'rabbits', { x: 540, y: 860, n: 11, hop: 1, angry: 1, w: 520, h: 160, seed: 12 });
        s.add('r2', 'rabbit', { x: 470, y: 700, s: .4, hop: 1, angry: 1, delay: .5 }); s.add('r3', 'rabbit', { x: 640, y: 620, s: .38, hop: 1, angry: 1, flip: 1, delay: .8 });
        s.shake(.4);
      }),
      B('explica', 'Oamenii lui | dau cu biciul. | *Degeaba*.', s => {
        s.add('wh', 'whip', { x: 180, y: 560 });
        s.add('dg', 'tag', { x: 790, y: 380, text: 'DEGEABA', style: 'negru', size: 52, r: .08, in: 'stamp', delay: 1.6 });
      }),
      B('umeri trist', 'Napoleon | fuge la *trăsură*.', s => {
        s.clear(); s.add('sp', 'speed', { x: 540, y: 700 });
        s.add('ca', 'carriage', { x: 560, y: 840, s: .95, drive: 1, in: 'slideL' });
        s.add('rb', 'rabbits', { x: 120, y: 880, n: 6, hop: 1, angry: 1, w: 220, h: 60, seed: 3 });
        s.add('rt', 'tag', { x: 780, y: 360, text: 'RETRAGERE', style: 'rosu', size: 50, r: .08, in: 'stamp', delay: .7 });
        s.set('hud', { done: 2 });
      }),
      // --- explicația
      B('mirata', 'De ce? | Erau *iepuri de casă*, | cumpărați de la țărani.', s => {
        s.clear(); s.add('r', 'rabbit', { x: 470, y: 880, s: .95 });
        s.add('t', 'tag', { x: 780, y: 360, text: 'IEPURI DE CASĂ', style: 'galben', size: 48, r: .08, in: 'stamp', delay: .6 });
      }),
      B('rade badumts', 'Au crezut | că vine *mâncarea*.', s => {
        s.add('b', 'bubble', { x: 720, y: 520, text: 'MÂNCARE?', tail: [-.6, 1] });
        s.add('mo', 'emoji', { x: 820, y: 820, e: '🥕', size: 160, delay: .3 });
      }),
      // --- final
      B('rade tada', 'Scor final: | *iepuri unu*, | Napoleon *zero*.', s => {
        s.clear(); s.out('hud');
        s.add('sc', 'score', { x: 540, y: 520, s: 1.5, title: 'SCOR FINAL', labels: ['NAPOLEON', 'IEPURI'], army: 0, emu: 1 });
        s.add('rb', 'rabbits', { x: 540, y: 900, n: 7, hop: 1, w: 700, h: 40, seed: 2 });
      }),
      B('explica', 'Eu sunt *Tanti Geta*.', s => {
        s.clear(); s.add('id', 'prop', { prop: 'buletin', args: GETA_ID });
      }),
      B('banuitoare', 'Data viitoare: | omul care a vândut | *Turnul Eiffel*.', s => {
        s.clear(); s.add('dv', 'text', { x: 540, y: 330, text: 'DATA VIITOARE:', size: 78 });
        s.add('tw', 'eiffel', { x: 540, y: 820, s: .78 });
        s.add('t1', 'tag', { x: 540, y: 850, text: 'VÂNDUT DE DOUĂ ORI?', style: 'rosu', size: 48, r: -.03, in: 'stamp', delay: .6 });
      }, { sticker: 'galben FOLLOW' }),
    ],
  });
})();
