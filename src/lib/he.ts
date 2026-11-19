// Hebrew-letter sigla (א, א*, א²) inside left-to-right text must be isolated and forced LTR,
// or the bidi algorithm reorders the marks around them.
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
/** A digit after א is reordered as RTL; a left-to-right mark after the letter stops that. */
export const ltrHe = (s: string) => s.replace(/א(?=[0-9¹²³ᶜ])/g, 'א‎');
export const heSigla = (s: string) =>
  esc(s).replace(/א[*¹²³ᶜ]*/g, (m) => `<span class="siglum" lang="he" dir="ltr">${ltrHe(m)}</span>`);
