/* Mituri românești #1: Castelul lui Dracula (Bran).
   Fapte: Castelul Bran a fost ridicat de sașii din Brașov (privilegiu din 1377, terminat ~1388) și a funcționat
   și ca punct vamal între Transilvania și Țara Românească. Bram Stoker a publicat „Dracula” în 1897 și nu a fost
   niciodată în România; castelul din roman e plasat în Pasul Borgo (Tihuța). Vlad Țepeș semna „Dragulya”
   (fiul lui Vlad Dracul); nu există dovezi solide că ar fi locuit la Bran. Cetatea lui este Poenari
   (1.480 de trepte până sus). În 1920 Brașovul a dăruit castelul reginei Maria. După 1940, inima reginei
   (adusă de la Balcic) a fost păstrată la Bran, într-o capelă construită pentru ea; azi se află la Pelișor. */
(function () {
  const GETA_ID = ['BULETIN DE BLOC', 'NUME: TANTI GETA', 'FUNCȚIA: VECINĂ, ETAJ 3', 'SURSA: GEAMUL'];
  const MIT = { x: 830, y: 1300, s: .98, hud: 1, title: 'VERIFICĂM MITUL', items: ['Dracula a stat aici', 'Stoker a fost aici', 'E castelul din carte', 'Vlad a locuit aici'], crossText: 'FALS', done: 0, in: 'slideR' };

  registerEpisode('⭐ Castelul lui Dracula (scene)', {
    title: 'Castelul lui Dracula',
    serie: ['MITURI ROMÂNEȘTI', '#1'],
    night: true, music: 'spooky', animIntro: true,
    beats: [
      // --- HOOK (noapte, orgă, fulger, lilieci)
      B('socata', 'Cel mai faimos castel | al lui *Dracula* | e în România.', s => {
        s.add('cs', 'bran', { x: 540, y: 1010, s: .95, lights: 1, in: 'fade' });
        s.fx('organ'); s.lightning(1.0);
        s.add('bt', 'bats', { x: 540, y: 520, n: 16, h: 900, delay: 1.2, sfx: 0 }); s.fx('squeak', 1.3);
        s.add('t', 'tag', { x: 540, y: 300, text: 'CASTELUL LUI DRACULA', style: 'rosu', size: 54, r: -.04, in: 'stamp', delay: 1.1 });
      }),
      B('banuitoare scratch', 'Doar că Dracula, | *probabil*, | n-a dormit acolo | nici măcar o noapte.', s => {
        s.out('t', 'bt'); s.dim('cs', .55);
        s.add('ct', 'person', { kind: 'count', x: 790, y: 980, s: .85, pose: 'shrug', mood: 'shock', in: 'drop', delay: .3 });
        s.add('f', 'tag', { x: 300, y: 360, text: 'FALS?!', style: 'galben', size: 72, r: -.1, in: 'stamp', delay: 2.0 });
      }),
      B('sopteste', 'Sunt *Tanti Geta*, | și azi bârfim… | *vampiri*.', s => {
        s.clear(); s.day(); s.add('id', 'prop', { prop: 'buletin', args: GETA_ID });
        s.add('g', 'emoji', { x: 860, y: 330, e: '🧄', size: 150, in: 'pop', delay: 1.3 });
        s.add('b1', 'bat', { x: 220, y: 340, s: .9, in: 'pop', delay: 1.9, sfx: 0 }); s.fx('howl', 1.8);
      }),
      // --- adevărul despre Bran
      B('explica', '*Castelul Bran*. | Ridicat de sașii din Brașov, | pe la *1380*.', s => {
        s.clear(); s.add('cs', 'bran', { x: 540, y: 1010, s: .9, in: 'grow' });
        s.add('y', 'tag', { x: 820, y: 330, text: 'PE LA 1380', style: 'galben', size: 50, r: .06, in: 'stamp', delay: 1.6 });
        s.add('hud', 'checklist', { ...MIT, delay: 2.4 });
      }),
      B('rade', 'Și nu era casa unui vampir. | Era o *vamă*!', s => {
        s.clear(); s.add('vm', 'barrier', { x: 430, y: 980, s: 1.25, down: 1, downAt: 1.5, in: 'slideR' });
        s.fx('stamp', 1.75); s.fx('badumts', 2.0);
      }),
      // --- Stoker
      B('explica', 'Acum, *Dracula*: | romanul lui *Bram Stoker*, | din *1897*.', s => {
        s.clear(); s.night(.85);
        s.add('st', 'person', { kind: 'stoker', x: 240, y: 960, s: .9, pose: 'point', talk: true, in: 'slideL' });
        s.add('bk', 'book', { x: 720, y: 650, s: .82, in: 'drop', delay: .9 }); s.fx('riser'); s.fx('impact', 1.0);
      }),
      B('suparata', 'Stoker n-a pus niciodată | piciorul în *România*.', s => {
        s.clear(); s.day(.4); s.add('ro', 'romania', { x: 540, y: 640, s: 1.2, x2: 1.4 });
        s.add('t', 'tag', { x: 540, y: 330, text: 'N-A FOST AICI', style: 'rosu', size: 58, r: -.05, in: 'stamp', delay: 2.0 });
        s.fx('boom', 1.4); s.set('hud', { cross: [1] });
      }),
      B('explica', 'Iar castelul din carte | e în altă parte: | în *Pasul Tihuța*.', s => {
        s.clear(); s.add('ro', 'romania', { x: 540, y: 660, s: 1.25, pins: [{ x: 50, y: 10, label: 'BRAN', d: .2 }, { x: 20, y: -165, c: '#2f5fc4', label: 'TIHUȚA', d: 1.8 }] });
        s.fx('pop', 1.8); s.set('hud', { cross: [1, 2] });
      }),
      // --- Vlad
      B('socata', 'Și *Vlad Țepeș*? | Cel care chiar | semna *„Dracula”*?', s => {
        s.clear(); s.night(1, .3);
        s.add('vl', 'person', { kind: 'vlad', x: 540, y: 980, s: 1.05, pose: 'hips', mood: 'angry', in: 'drop', delay: .15 });
        s.lightning(.15); s.fx('impact', .2);
        s.add('t', 'tag', { x: 540, y: 320, text: 'VLAD ȚEPEȘ', style: 'rosu', size: 60, r: -.04, in: 'stamp', delay: 1.2 });
      }),
      B('banuitoare', 'Istoricii n-au găsit nicio dovadă | că a *locuit* la Bran.', s => {
        s.clear(); s.night(.6); s.add('cs', 'bran', { x: 540, y: 1010, s: .85, lights: 1 });
        s.add('lp', 'emoji', { x: 700, y: 560, e: '🔍', size: 220, in: 'pop', delay: .5 });
        s.add('t', 'tag', { x: 540, y: 320, text: '0 DOVEZI', style: 'rosu', size: 66, r: .05, in: 'stamp', delay: 2.0 });
        s.set('hud', { cross: [1, 2, 3] });
      }),
      B('mirata', 'Cetatea lui adevărată e *Poenari*. | Sus pe munte, | la *1.480 de trepte*.', s => {
        s.clear(); s.day(.5); s.add('pn', 'poenari', { x: 540, y: 1060, s: .92, in: 'grow' });
        s.add('n', 'counter', { x: 540, y: 300, to: 1480, d: 2.4, wait: 1.6, label: 'TREPTE', size: 120 });
        s.fx('tic', 1.6);
      }),
      // --- regina
      B('vesela', 'Bun. Și atunci | cine a stat la Bran? | *Regina Maria*!', s => {
        s.clear(); s.add('q', 'q', { x: 540, y: 600, size: 170 });
        s.add('rm', 'person', { kind: 'queen', x: 540, y: 980, s: 1.05, pose: 'wave', mood: 'smug', crown: 1, in: 'drop', delay: 1.5 });
        s.add('sp', 'sparkle', { x: 540, y: 660, r: 280, delay: 1.6 });
        s.add('t', 'tag', { x: 540, y: 320, text: 'REGINA MARIA', style: 'galben', size: 62, r: -.04, in: 'stamp', delay: 2.0 });
        s.fx('tada', 1.6); s.out('q');
      }),
      B('explica', 'Brașovenii i-au dat castelul | *cadou*, în *1920*.', s => {
        s.clear(); s.add('cs', 'bran', { x: 540, y: 1010, s: .85, gift: 1 });
        s.add('y', 'tag', { x: 820, y: 330, text: '1920', style: 'galben', size: 60, r: .06, in: 'stamp', delay: 1.4 });
        s.fx('ding', .5);
      }),
      B('sopteste', 'Iar *inima* reginei | a fost păstrată ani de zile | chiar acolo, la Bran.', s => {
        s.clear(); s.night(.85, 1); s.add('h', 'heart', { x: 540, y: 820, s: 1, casket: 1, in: 'fade' });
        s.heart(5, .3, .8);
      }),
      B('rade', 'Deci la Bran, | singura inimă celebră | nu e a unui *vampir*.', s => {
        s.dim('h', .55);
        s.add('ct', 'person', { kind: 'count', x: 840, y: 1000, s: .72, pose: 'shrug', mood: 'shock', in: 'slideR', delay: .4 });
        s.set('hud', { cross: [0, 1, 2, 3] }); s.fx('badumts', 2.6);
      }),
      // --- turiști și poanta de bloc
      B('banuitoare', 'Dar turiștii vin cu sutele de mii… | să cumpere *magneți cu Dracula*.', s => {
        s.clear(); s.day(.4); s.out('hud');
        s.add('fr', 'fridge', { x: 540, y: 1010, s: 1.2, in: 'slideL', delay: .2 });
        s.add('t', 'tag', { x: 800, y: 330, text: '15 LEI BUCATA', style: 'galben', size: 46, r: .06, in: 'stamp', delay: 2.6 });
        s.fx('kaching', 2.5);
      }),
      B('sopteste', 'Ca la noi la bloc: | toți zic că la etajul patru | stă un *vampir*.', s => {
        s.clear(); s.night(1, .5); s.add('bl', 'bloc', { x: 540, y: 1100, s: .9, night: 1, lit: 1, floor: 4 });
        s.add('bt', 'bats', { x: 540, y: 420, n: 6, h: 300, delay: .6, sfx: 0 }); s.fx('howl', .5); s.fx('creak', 2.0);
      }),
      B('rade', 'E domnul *Costel*. | Lucrează *paznic de noapte*.', s => {
        s.clear(); s.day(.25); s.fx('flash');
        s.add('pz', 'person', { kind: 'paznic', x: 460, y: 980, s: 1.05, pose: 'wave', mood: 'smug', talk: true, in: 'pop' });
        s.add('fl', 'emoji', { x: 760, y: 640, e: '🔦', size: 170, in: 'pop', delay: .5 });
        s.add('t', 'tag', { x: 540, y: 320, text: 'PAZNIC DE NOAPTE', style: 'albastru', size: 54, r: -.04, in: 'stamp', delay: 1.4 });
        s.fx('badumts', 2.2);
      }),
      B('explica', 'Eu sunt *Tanti Geta*.', s => {
        s.clear(); s.add('id', 'prop', { prop: 'buletin', args: GETA_ID });
      }),
      B('banuitoare', 'Data viitoare: | românul care a inventat | strămoșul *stiloului*.', s => {
        s.clear(); s.add('dv', 'text', { x: 540, y: 330, text: 'DATA VIITOARE:', size: 78 });
        s.add('pn', 'emoji', { x: 540, y: 760, e: '🖋️', size: 300, in: 'pop' });
        s.add('t1', 'tag', { x: 540, y: 480, text: 'INVENȚIE ROMÂNEASCĂ?', style: 'rosu', size: 50, r: -.03, in: 'stamp', delay: 1.4 });
      }, { sticker: 'galben FOLLOW' }),
    ],
  });
})();
