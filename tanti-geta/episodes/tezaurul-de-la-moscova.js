/* Români de necrezut #2: Tezaurul de la Moscova (1916–1918).
   Fapte: în decembrie 1916, cu Bucureștiul ocupat de Puterile Centrale și guvernul mutat la Iași, România și-a
   trimis tezaurul Băncii Naționale la Moscova, la aliatul rus. Primul transport: un tren de 17 vagoane, 1.738 de lăzi
   (inclusiv lăzile cu bijuteriile reginei Maria), depozitat la Kremlin. Al doilea transport a urmat în vara lui 1917.
   În total, BNR a depus la Moscova 91,48 tone de aur fin. După revoluția bolșevică, în ianuarie 1918 guvernul lui
   Lenin a rupt relațiile cu România și a declarat tezaurul reținut. Restituiri parțiale în 1935, 1956 și 2008
   (arhive, opere de artă, obiecte de patrimoniu; Tezaurul de la Pietroasa, „Cloșca cu puii de aur”, s-a întors
   în 1956), dar aurul BNR și bijuteriile reginei Maria nu au fost restituite niciodată. */
(function () {
  const GETA_ID = ['BULETIN DE BLOC', 'NUME: TANTI GETA', 'FUNCȚIA: VECINĂ, ETAJ 3', 'SURSA: GEAMUL'];
  const AUR = { x: 830, y: 1300, s: 1, hud: 1, title: 'AUR (TONE)', labels: ['TRIMIS', 'ÎNAPOI'], army: 0, emu: 0, in: 'slideR' };

  registerEpisode('⭐ Tezaurul de la Moscova (scene)', {
    title: 'Tezaurul de la Moscova',
    serie: ['ROMÂNI DE NECREZUT', '#2'],
    beats: [
      // --- HOOK
      B('socata', 'România i-a dat Rusiei | *91 de tone de aur*. | La păstrare.', s => {
        s.add('gd', 'gold', { x: 560, y: 820, s: 1.5, n: 13, seed: 9 });
        s.add('fl', 'flag', { c: 'ro', x: 120, y: 940, s: .6, in: 'grow' });
        s.add('t', 'tag', { x: 560, y: 360, text: '91 DE TONE', style: 'galben', size: 66, r: -.05, in: 'stamp', delay: .9 });
      }),
      B('banuitoare zoom', 'Ghici | cât a primit *înapoi*.', s => {
        s.out('t'); s.add('q', 'q', { x: 560, y: 380, size: 170 });
      }),
      B('vesela', 'Sunt *Tanti Geta*, | și asta e cea mai scumpă bârfă | din istoria noastră.', s => {
        s.clear(); s.add('id', 'prop', { prop: 'buletin', args: GETA_ID });
      }),
      // --- de ce
      B('explica', '*1916*. | Primul Război Mondial. | Nemții intră în *București*.', s => {
        s.clear(); s.add('k', 'person', { kind: 'kaiser', x: 330, y: 930, s: 1, pose: 'point', mood: 'angry', in: 'slideR' });
        s.add('fl', 'flag', { c: 'de', x: 700, y: 950, s: .75, in: 'grow', delay: .3 });
        s.add('t', 'tag', { x: 760, y: 340, text: 'BUCUREȘTI OCUPAT', style: 'rosu', size: 48, r: .06, in: 'stamp', delay: 1.8 });
      }),
      B('mirata', 'Guvernul fuge la *Iași* | și se întreabă: | unde ascundem *aurul*?', s => {
        s.clear(); s.add('gv', 'person', { kind: 'governor', x: 300, y: 930, s: 1, pose: 'shrug', mood: 'shock', in: 'drop' });
        s.add('b', 'bubble', { x: 720, y: 420, text: 'UNDE ASCUNDEM AURUL?', tail: [-.5, 1], delay: 1.4 });
      }),
      B('explica', 'La aliatul nostru, | *Rusia*. | Îl trimitem la *Moscova*.', s => {
        s.clear(); s.add('fl', 'flag', { c: 'ru', x: 420, y: 900, s: .9, in: 'grow' });
        s.add('t', 'tag', { x: 560, y: 330, text: 'ALIATUL DE ÎNCREDERE', style: 'albastru', size: 46, r: -.04, in: 'stamp', delay: .9 });
        s.add('ok', 'emoji', { x: 820, y: 700, e: '🤝', size: 180, in: 'pop', delay: 1.6 });
      }),
      B('socata', 'Un tren de *17 vagoane*. | Peste o mie șapte sute | de lăzi cu aur.', s => {
        s.clear(); s.add('tr', 'train', { x: 700, y: 820, s: .95, n: 3, in: 'slideR', label: '17 VAGOANE' });
        s.add('t', 'tag', { x: 540, y: 330, text: '1.738 DE LĂZI', style: 'galben', size: 54, r: .04, in: 'stamp', delay: 1.6 });
        s.add('hud', 'score', { ...AUR, delay: 2.2 });
      }),
      B('rade', 'Plus *bijuteriile reginei Maria*. | Să fie în siguranță.', s => {
        s.clear(); s.set('hud', { army: 91 });
        s.add('cr', 'crown', { x: 540, y: 640, s: 1.1, in: 'drop' });
        s.add('sp', 'sparkle', { x: 540, y: 600, r: 260 });
        s.add('t', 'tag', { x: 540, y: 330, text: 'BIJUTERIILE REGINEI', style: 'galben', size: 52, r: -.04, in: 'stamp', delay: .8 });
      }),
      B('explica', 'Rușii le pun | la *Kremlin*. | Sub cheie.', s => {
        s.clear(); s.add('kr', 'kremlin', { x: 540, y: 1000, s: .78, lock: 1 });
      }),
      // --- răsturnarea
      B('socata scratch', 'Dar în Rusia | vine *revoluția*.', s => {
        s.clear(); s.add('fl', 'flag', { c: 'red', x: 640, y: 950, s: .95, in: 'grow' });
        s.add('t', 'tag', { x: 540, y: 330, text: 'REVOLUȚIA, 1917', style: 'rosu', size: 54, r: -.05, in: 'stamp', delay: .6 });
        s.shake(.4);
      }),
      B('suparata boom', '*Lenin* rupe relațiile | cu România. | Și aurul? | *Rămâne la Moscova*.', s => {
        s.clear(); s.add('ln', 'person', { kind: 'lenin', x: 330, y: 930, s: 1.05, pose: 'point', mood: 'smug', talk: true, in: 'slideL' });
        s.add('b', 'bubble', { x: 740, y: 420, text: 'RĂMÂNE LA NOI!', tail: [-.5, 1], delay: 2.4 });
      }),
      // --- ce s-a întors
      B('explica', 'Peste ani, | rușii mai dau înapoi | arhive și tablouri.', s => {
        s.clear(); s.add('a', 'emoji', { x: 360, y: 700, e: '📜', size: 220, in: 'pop' });
        s.add('b', 'emoji', { x: 720, y: 700, e: '🖼️', size: 220, in: 'pop', delay: .6 });
        s.add('t', 'tag', { x: 540, y: 330, text: '1935 • 1956 • 2008', style: 'albastru', size: 50, in: 'stamp', delay: 1.2 });
      }),
      B('vesela', 'Ba chiar și | *Cloșca cu puii de aur*.', s => {
        s.clear(); s.add('h', 'hen', { x: 520, y: 900, s: .95 });
        s.add('t', 'tag', { x: 780, y: 330, text: 'ÎNAPOI ÎN 1956', style: 'verde', size: 46, r: .06, in: 'stamp', delay: 1.0 });
      }),
      B('suparata boom', 'Dar *aurul*? | *Niciun gram*.', s => {
        s.clear(); s.add('gd', 'gold', { x: 540, y: 760, s: 1.3, n: 11, seed: 4 }); s.dim('gd', .5);
        s.add('x', 'xmark', { x: 540, y: 660, s: 1.2, delay: .9 });
        s.add('t', 'tag', { x: 540, y: 330, text: '0 GRAME', style: 'rosu', size: 64, r: -.04, in: 'stamp', delay: 1.0 });
        s.set('hud', { emu: 0 });
      }),
      B('umeri trist', 'Nici bijuteriile reginei.', s => {
        s.clear(); s.add('cr', 'crown', { x: 540, y: 640, s: 1, fall: 1, fallAt: .8 });
      }),
      B('banuitoare kaching', 'Azi, aurul ăsta | ar valora *miliarde de euro*.', s => {
        s.clear(); s.add('gd', 'gold', { x: 540, y: 800, s: 1.5, n: 13, seed: 9 });
        s.add('t', 'tag', { x: 540, y: 360, text: 'MILIARDE DE €', style: 'galben', size: 64, r: .04, in: 'stamp', delay: 1.0 });
      }),
      // --- poanta
      B('rade tada', 'Și eu, | care nu-i dau vecinei de la doi | nici *bormașina*!', s => {
        s.clear(); s.out('hud');
        s.add('t', 'tag', { x: 540, y: 380, text: 'BORMAȘINA: RĂMÂNE LA MINE', style: 'rosu', size: 50, r: -.05, in: 'stamp', delay: 1.9 });
        s.add('tb', 'emoji', { x: 540, y: 760, e: '🧰', size: 260, in: 'drop', delay: 1.6 });
      }),
      B('explica', 'Eu sunt *Tanti Geta*.', s => {
        s.clear(); s.add('id', 'prop', { prop: 'buletin', args: GETA_ID });
      }),
      B('banuitoare', 'Data viitoare: | castelul lui *Dracula*… | unde Dracula, probabil, | n-a stat niciodată.', s => {
        s.clear(); s.add('dv', 'text', { x: 540, y: 330, text: 'DATA VIITOARE:', size: 78 });
        s.add('c', 'emoji', { x: 540, y: 740, e: '🏰', size: 330, in: 'pop' });
        s.add('bt', 'emoji', { x: 790, y: 520, e: '🦇', size: 140, in: 'pop', delay: .5 });
        s.add('t1', 'tag', { x: 540, y: 960, text: 'FALS?', style: 'rosu', size: 56, r: -.05, in: 'stamp', delay: 1.6 });
      }, { sticker: 'galben FOLLOW' }),
    ],
  });
})();
