/* Numere în litere, pentru vocile care citesc greșit cifrele în română. */
const U = ['zero', 'unu', 'doi', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă'];
const TEEN = ['zece', 'unsprezece', 'doisprezece', 'treisprezece', 'paisprezece', 'cincisprezece', 'șaisprezece', 'șaptesprezece', 'optsprezece', 'nouăsprezece'];
const TENS = ['', '', 'douăzeci', 'treizeci', 'patruzeci', 'cincizeci', 'șaizeci', 'șaptezeci', 'optzeci', 'nouăzeci'];
const FEM = { 1: 'o', 2: 'două' };

function under100(n) {
  if (n < 10) return U[n];
  if (n < 20) return TEEN[n - 10];
  const t = Math.floor(n / 10), u = n % 10;
  return u ? `${TENS[t]} și ${U[u]}` : TENS[t];
}
function under1000(n) {
  const h = Math.floor(n / 100), r = n % 100;
  const hs = h === 0 ? '' : h === 1 ? 'o sută' : `${FEM[h] || U[h]} sute`;
  return [hs, r ? under100(r) : ''].filter(Boolean).join(' ');
}
function numRo(n) {
  if (n === 0) return 'zero';
  if (n < 1000) return under1000(n);
  const th = Math.floor(n / 1000), r = n % 1000;
  let ts;
  if (th === 1) ts = 'o mie';
  else if (th === 2) ts = 'două mii';
  else if (th < 20) ts = `${under1000(th)} mii`;
  else ts = `${under1000(th)} de mii`;
  return r ? `${ts} ${under1000(r)}` : ts;
}
/** Înlocuiește numerele dintr-un text (inclusiv 2.000 / 10.000) cu litere. */
function spellNumbers(text) {
  return text.replace(/\d{1,3}(?:\.\d{3})+|\d+/g, m => numRo(parseInt(m.replace(/\./g, ''), 10)));
}
module.exports = { numRo, spellNumbers };
