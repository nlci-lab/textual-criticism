// Apparatus symbols in our own plain words (not UBS's wording). `checked: false` = not yet checked against a source.
export interface Term { id: string; term: string; plain: string; source: string; checked: boolean }

const UBS = 'UBS5 Introduction pp. 58*–63*, via Paratext 9 help';

export const GLOSSARY: Term[] = [
  { id: 'rating', term: '{A} {B} {C} {D}', plain: 'The committee\'s letter for how sure it was about the reading printed in the text. {A} = sure; {D} = very unsure. It is a committee opinion, not a measure of the evidence. See "How to read a UBS apparatus entry" for what the letters do and do not tell you.', source: UBS, checked: true },
  { id: 'double-slash', term: '//', plain: 'Separates one reading from the next in an apparatus entry.', source: 'UBS5 apparatus at John 1:18, as shown in Paratext', checked: true },
  { id: 'star', term: '*', plain: 'The first scribe\'s reading, before anyone corrected it. א* = what the first scribe of Sinaiticus wrote.', source: UBS, checked: true },
  { id: 'correctors', term: '¹ ² ³ ᶜ', plain: 'Later correctors of a manuscript, numbered in time order. ᶜ is the latest corrector (or the only one). א² = the second corrector of Sinaiticus.', source: UBS, checked: true },
  { id: 'vid', term: 'vid', plain: 'Short for Latin videtur, "it seems". The manuscript is damaged, so we cannot read it fully, but this is probably its reading.', source: UBS, checked: true },
  { id: 'supp', term: 'supp', plain: 'A part of the manuscript that was lost and later replaced by another hand. Wˢᵘᵖᵖ = the replaced part of Codex W.', source: UBS, checked: true },
  { id: 'mg-txt', term: 'mg, txt', plain: 'mg = a reading written in the margin. txt = the reading in the main text when the margin has a different one.', source: UBS, checked: true },
  { id: 'parens', term: '( )', plain: 'Round brackets around a witness: it supports this reading but with small differences.', source: UBS, checked: true },
  { id: 'byz-brackets', term: 'Byz [ ]', plain: 'Square brackets after Byz list some particular Byzantine manuscripts that have this reading.', source: UBS, checked: true },
  { id: 'double-brackets', term: '⟦ ⟧', plain: 'In the Greek text: a passage the editors think was added later, but which is very old and important (for example John 7:53–8:11).', source: UBS, checked: true },
  { id: 'diamond', term: '♦', plain: 'Two readings are equally good, and the editors could not choose between them.', source: UBS, checked: true },
  { id: 'fraction', term: '1/2, 2/4', plain: 'Used with church fathers and lectionaries that give the same verse more than once. The second number is how many times the verse appears; the first is how many of those times support this reading. Origenᵍʳ ²ᐟ⁴ = Origen, in Greek, supports it in 2 of 4 places.', source: UBS, checked: true },
  { id: 'pt', term: 'pt', plain: 'Latin partim, "in part". Byzᵖᵗ = part of the Byzantine manuscripts.', source: UBS, checked: true },
  { id: 'byz', term: 'Byz', plain: 'The reading of most Byzantine manuscripts.', source: UBS, checked: true },
  { id: 'lect', term: 'Lect', plain: 'The reading of most of the lectionaries (church reading books) UBS selected, with the Apostoliki Diakonia edition.', source: UBS, checked: true },
  { id: 'gr-lat', term: 'gr, lat', plain: 'With a church father: gr = a Greek fragment of a work that survives whole only in translation; lat = a Latin translation of a Greek father.', source: UBS, checked: true },
  { id: 'eapcr', term: 'e a p c r', plain: 'Which parts of the New Testament a manuscript contains: e = Gospels, a = Acts, c = Catholic letters, p = Paul, r = Revelation.', source: UBS, checked: true },
  { id: 'aland-category', term: 'Aland category (I–V)', plain: 'A grouping by Kurt and Barbara Aland of Greek manuscripts by how their text relates to the early text (I) or the Byzantine text (V). Useful, but based on samples and now widely criticised.', source: 'Aland & Aland, The Text of the New Testament (2nd ed., 1989)', checked: false },
  { id: 'variant', term: 'variant', plain: 'A place where manuscripts have different wording. Each different wording is a reading.', source: 'Thomas Hemphill, EMDC 2021 (slides on NT textual criticism), adapted with permission', checked: true },
  { id: 'external-evidence', term: 'external evidence', plain: 'What the witnesses tell us about a reading: how old they are, how good, and how widely spread.', source: 'Thomas Hemphill, EMDC 2021 (slides on NT textual criticism), adapted with permission', checked: true },
  { id: 'internal-evidence', term: 'internal evidence', plain: 'What the wording itself suggests: what a copyist was likely to change, and what the author was likely to write.', source: 'Thomas Hemphill, EMDC 2021 (slides on NT textual criticism), adapted with permission', checked: true },
  { id: 'tr', term: 'Textus Receptus (TR)', plain: 'The line of printed Greek New Testaments that began with Erasmus in 1516. It lies behind the King James Version and many older translations.', source: 'Thomas Hemphill, EMDC 2021 (slides on NT textual criticism), adapted with permission', checked: true },
  { id: 'cbgm', term: 'CBGM', plain: 'Coherence-Based Genealogical Method: a computer-aided way of comparing whole manuscript texts to judge which reading gave rise to which.', source: 'Thomas Hemphill, EMDC 2021 (slides on NT textual criticism), adapted with permission', checked: true },
  { id: 'vellum', term: 'vellum', plain: 'Parchment made from calfskin. The name comes from the French word for calf. People often use "vellum" and "parchment" for the same thing, because it is hard to tell the skins apart.', source: 'Society of American Archivists, Dictionary of Archives Terminology, "vellum", https://dictionary.archivists.org/entry/vellum.html; U.S. National Archives, "Paper: Vellum", https://www.archives.gov/preservation/formats/paper-vellum.html; University of Utah, Online Archives of Bookbinding glossary, https://oab.lib.utah.edu/?p=2406 (all accessed 2026-11-20)', checked: true },
];
