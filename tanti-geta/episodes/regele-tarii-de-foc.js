/* Români de necrezut #1: Iuliu Popper, „regele Țării de Foc” (1857–1893).
   Fapte: născut la București în 1857; a studiat ingineria la Paris; a călătorit mult, apoi a ajuns la Buenos Aires.
   În 1886 a condus o expediție în Țara de Foc (Tierra del Fuego), unde a găsit aur. A ajuns să domine zona cu o
   armată privată, a bătut monede de aur proprii (1889, 1 și 5 grame) și a emis timbre. A dat locurilor nume legate
   de România (Sierra Carmen Sylva, Río Carmen Sylva, după pseudonimul reginei Elisabeta). A fost mereu în conflict
   cu autoritățile. Expedițiile lui au ucis indigeni selk'nam (există fotografii din 1886), parte din genocidul selk'nam.
   A murit brusc la Buenos Aires în 1893, la 35 de ani; circumstanțele au rămas neclare (s-a vorbit de otrăvire). */
(function () {
  const GETA_ID = ['BULETIN DE BLOC', 'NUME: TANTI GETA', 'FUNCȚIA: VECINĂ, ETAJ 3', 'SURSA: GEAMUL'];
  const KIT = { x: 830, y: 1300, s: .98, hud: 1, title: 'KIT DE ȚARĂ', items: ['Teritoriu', 'Armată', 'Bani', 'Timbre'], done: 0, in: 'slideR' };

  registerEpisode('⭐ Regele Țării de Foc (scene)', {
    title: 'Regele Țării de Foc',
    serie: ['ROMÂNI DE NECREZUT', '#1'],
    beats: [
      // --- HOOK
      B('socata', 'Un băiat din *București* | s-a făcut *rege* | în Argentina.', s => {
        s.add('pp', 'person', { kind: 'popper', x: 540, y: 930, s: 1.1, pose: 'hips', mood: 'smug' });
        s.add('fl', 'flag', { c: 'ar', x: 820, y: 980, s: .8, in: 'grow', delay: .4 });
        s.add('cr', 'crown', { x: 540, y: 330, s: .9, in: 'drop', delay: 1.1 });
      }),
      B('banuitoare zoom', 'Cu armată, | *monede de aur* | și timbre proprii.', s => {
        s.clear('pp'); s.move('pp', { x: 230, y: 930, s: .85 });
        s.add('so', 'soldiers', { side: 'pp', x: 690, y: 620, n: 4, gap: 75, s: 1.9 });
        s.add('co', 'coin', { x: 610, y: 860, s: .45, in: 'pop', delay: .7 });
        s.add('st', 'stamp', { x: 900, y: 860, s: .5, in: 'pop', delay: 1.4 });
      }),
      B('vesela', 'Sunt *Tanti Geta*, | și asta e bârfă de export.', s => {
        s.clear(); s.add('id', 'prop', { prop: 'buletin', args: GETA_ID });
      }),
      // --- cine e
      B('explica', 'Îl cheamă *Iuliu Popper*. | Născut la București, | în *1857*.', s => {
        s.clear(); s.add('yg', 'person', { kind: 'young', x: 330, y: 920, s: 1, pose: 'wave', mood: 'smug', in: 'slideL' });
        s.add('fl', 'flag', { c: 'ro', x: 700, y: 900, s: .8, in: 'grow', delay: .3 });
        s.add('yr', 'tag', { x: 780, y: 330, text: 'BUCUREȘTI, 1857', style: 'galben', size: 48, r: .06, in: 'stamp', delay: 1.4 });
      }),
      B('explica', 'Face școala de ingineri | la *Paris*, | apoi colindă lumea.', s => {
        s.clear('yg'); s.move('yg', { x: 260, y: 920, s: .9 });
        s.add('tw', 'eiffel', { x: 700, y: 880, s: .62, in: 'drop' });
        s.add('gl', 'emoji', { x: 820, y: 330, e: '🌍', size: 190, in: 'pop', delay: 1.6 });
      }),
      B('mirata', 'Ajunge în *Buenos Aires* | și aude un zvon: | *aur*, la capătul lumii.', s => {
        s.clear(); s.add('sa', 'southamerica', { x: 520, y: 470, s: .85, ba: 1, route: 1, pin: 1 });
        s.add('b', 'bubble', { x: 820, y: 830, text: 'AUR?!', tail: [-.6, 1], delay: 1.6 });
      }),
      // --- aurul și „țara”
      B('explica', 'Pleacă în *Țara de Foc*. | Și chiar găsește *aurul*.', s => {
        s.clear(); s.add('gd', 'gold', { x: 560, y: 760, s: 1.25, delay: 1.4 });
        s.add('tf', 'tag', { x: 540, y: 330, text: 'ȚARA DE FOC', style: 'rosu', size: 56, r: -.04, in: 'stamp' });
        s.add('pp', 'person', { kind: 'popper', x: 230, y: 940, s: .8, pose: 'point', mood: 'shock', in: 'slideL', delay: .3 });
        s.add('hud', 'checklist', { ...KIT, done: 1, delay: 2.0 });
      }),
      B('rade', 'Acum îi trebuie | o țară. | Își face *armată*, | cu uniforme.', s => {
        s.clear(); s.set('hud', { done: 2 });
        s.add('pp', 'person', { kind: 'popper', x: 220, y: 930, s: .85, pose: 'point', mood: 'smug', talk: true });
        s.add('so', 'soldiers', { side: 'pp', x: 690, y: 880, n: 4, gap: 70, s: 2.2, delay: 1.0 });
        s.add('t', 'tag', { x: 700, y: 360, text: 'ARMATA LUI POPPER', style: 'negru', size: 44, r: .05, in: 'stamp', delay: 1.8 });
        s.fx('tobe');
      }),
      B('socata kaching', 'Bate *monede de aur*, | cu numele lui pe ele.', s => {
        s.clear(); s.set('hud', { done: 3 });
        s.add('co', 'coin', { x: 540, y: 600, s: 1, in: 'grow' });
        s.add('t', 'tag', { x: 800, y: 900, text: '100% AUR', style: 'galben', size: 48, r: -.07, in: 'stamp', delay: 1.0 });
      }),
      B('rade badumts', 'Și scoate *timbre*. | Ca o țară adevărată!', s => {
        s.clear();
        s.add('st', 'stamp', { x: 540, y: 620, s: 1.05, in: 'drop' });
        s.add('pz', 'emoji', { x: 830, y: 330, e: '✉️', size: 150, in: 'pop', delay: .4 });
        s.set('hud', { done: 4 });
      }),
      B('mirata', 'Pe hărți, botează munți | după regina României: | *Carmen Sylva*.', s => {
        s.clear(); s.add('mt', 'mountains', { x: 480, y: 900, s: 1, sign: 'SIERRA CARMEN SYLVA' });
        s.add('rg', 'tag', { x: 540, y: 330, text: 'REGINA ELISABETA', style: 'albastru', size: 46, r: .04, in: 'stamp', delay: 1.4 });
      }),
      B('suparata', 'Cu autoritățile | se ceartă *ani de zile*.', s => {
        s.clear(); s.add('gv', 'person', { kind: 'governor', x: 780, y: 930, s: .9, pose: 'stop', mood: 'angry', talk: true, in: 'slideR' });
        s.add('pp', 'person', { kind: 'popper', x: 280, y: 930, s: .9, pose: 'hips', mood: 'smug', crown: 1, in: 'slideL' });
        s.add('b', 'bubble', { x: 720, y: 330, text: 'NU EȘTI REGE!', tail: [.2, 1] });
      }),
      // --- partea neagră (fără glume, fără efecte comice)
      B('suparata', 'Dar povestea are | și o parte *neagră*: | oamenii lui au ucis | indigeni *selk’nam*.', s => {
        s.clear(); s.add('mt', 'mountains', { x: 540, y: 880, s: .9, in: 'fade' }); s.dim('mt', .55);
        s.add('t', 'tag', { x: 540, y: 400, text: 'PARTEA NEAGRĂ', style: 'negru', size: 62, in: 'fade' });
        s.add('t2', 'text', { x: 540, y: 560, text: 'POPORUL SELK’NAM', size: 60, delay: 1.6 });
      }),
      // --- finalul lui
      B('explica', 'În *1893*, | la doar *35 de ani*, | moare brusc, în Buenos Aires.', s => {
        s.clear(); s.add('yrs', 'prop', { prop: 'an', args: ['1893', 'la doar 35 de ani'] });
      }),
      B('sopteste', 'Unii zic | că a fost *otrăvit*.', s => {
        s.clear(); s.add('po', 'poison', { x: 540, y: 820, s: 1.05, in: 'drop' });
        s.add('q', 'q', { x: 820, y: 360, size: 150, delay: .6 });
      }),
      B('umeri trist', 'Iar „regatul” lui | dispare odată cu el.', s => {
        s.clear(); s.add('cr', 'crown', { x: 540, y: 420, s: 1, fall: 1, fallAt: 1.3 });
        s.set('hud', { cross: 0 });
      }),
      // --- poanta
      B('rade tada', 'Deci un român | a avut armată, bani și timbre. | Eu n-am nici *loc de parcare*.', s => {
        s.clear(); s.out('hud');
        s.add('pk', 'tag', { x: 540, y: 420, text: 'LOC DE PARCARE: 0', style: 'rosu', size: 60, r: -.05, in: 'stamp', delay: 2.2 });
        s.add('car', 'emoji', { x: 540, y: 760, e: '🚗', size: 260, in: 'drop', delay: 2.0 });
      }),
      B('explica', 'Eu sunt *Tanti Geta*.', s => {
        s.clear(); s.add('id', 'prop', { prop: 'buletin', args: GETA_ID });
      }),
      B('banuitoare', 'Data viitoare: | *91 de tone* de aur românesc | care n-au mai venit înapoi.', s => {
        s.clear(); s.add('dv', 'text', { x: 540, y: 330, text: 'DATA VIITOARE:', size: 78 });
        s.add('gd', 'gold', { x: 540, y: 820, s: 1.4, n: 12, seed: 9 });
        s.add('fl', 'flag', { c: 'ro', x: 230, y: 900, s: .55, in: 'grow' });
        s.add('t1', 'tag', { x: 560, y: 560, text: 'TEZAURUL ROMÂNIEI', style: 'rosu', size: 50, r: -.03, in: 'stamp', delay: .8 });
      }, { sticker: 'galben FOLLOW' }),
    ],
  });
})();
