// Book-page metadata for guides, worked examples and background pages (design direction 6).
// Page bodies stay in src/pages/**.astro; Context.astro looks the page up here by its path.
// Reading time is counted from the page text at build time, not stored.

export type Section = 'guide' | 'example' | 'background';
export interface GuideMeta {
  path: string;            // site path without base, with trailing slash
  cover: string;           // short title for the cover
  section: Section;
  level: 'Start here' | 'Going further';
  summary: string;         // one or two sentences for the shelf and the book page
  learn: string[];         // "What you will learn"
  before?: string;         // path of a page to read first
  related: string[];       // paths
  verses?: string[];       // passages the page works through (used by search later)
}

export const PIGMENT: Record<Section, 'lapis' | 'verdigris' | 'ochre'> = { guide: 'lapis', example: 'verdigris', background: 'ochre' };
export const KICKER: Record<Section, string> = { guide: 'Guide', example: 'Worked example', background: 'Background' };

export const GUIDES: GuideMeta[] = [
  {
    path: 'guide/apparatus/', cover: 'Reading the apparatus', section: 'guide', level: 'Start here',
    summary: 'John 1:18 taken apart piece by piece: the rating, the readings, the witnesses and their marks.',
    learn: ['What each part of a UBS entry means', 'How to read sigla, correctors and fathers', 'What a translator does with an entry', 'What the {A}–{D} ratings do and do not tell you'],
    related: ['guide/weighing-evidence/', 'guide/which-variants-matter/', 'guide/paratext/'], verses: ['John 1:18'],
  },
  {
    path: 'guide/which-variants-matter/', cover: 'Which variants matter', section: 'guide', level: 'Start here',
    summary: 'Not all variants weigh the same. Sorting them by meaning and by rating, and when to add a footnote.',
    learn: ['The kinds of variants', 'How to sort a variant quickly', 'What a rating does not tell you', 'When to add a footnote'],
    before: 'guide/apparatus/', related: ['guide/weighing-evidence/', 'guide/text-policy/', 'guide/examples/'],
  },
  {
    path: 'guide/weighing-evidence/', cover: 'Weighing the evidence', section: 'guide', level: 'Going further',
    summary: 'From reading an entry to judging between readings: external and internal evidence.',
    learn: ['The questions editors ask about witnesses', 'Why counting manuscripts misleads', 'Scribal habits and the author’s style', 'Rules of thumb, and their limits', 'How the CBGM changes the picture'],
    before: 'guide/apparatus/', related: ['guide/examples/james-2-20/', 'background/materials/', 'guide/which-variants-matter/'], verses: ['James 2:20'],
  },
  {
    path: 'guide/examples/', cover: 'Worked examples', section: 'example', level: 'Going further',
    summary: 'Real places where Greek manuscripts differ, worked through step by step.',
    learn: ['How to apply the guides to a real verse', 'What UBS5 prints and why', 'What to tell your readers'],
    related: ['guide/examples/john-7-53/', 'guide/examples/james-2-20/', 'guide/examples/romans-16-7/'],
  },
  {
    path: 'guide/examples/james-2-20/', cover: 'James 2:20', section: 'example', level: 'Going further',
    summary: 'Useless or dead? Good early manuscripts disagree, and the context decides.',
    learn: ['Weighing two fourth-century codices', 'Spotting harmonization', 'Handling a familiar reading in your translation'],
    before: 'guide/weighing-evidence/', related: ['guide/examples/romans-16-7/', 'guide/weighing-evidence/'], verses: ['James 2:20'],
  },
  {
    path: 'guide/examples/john-7-53/', cover: 'John 7:53–8:11', section: 'example', level: 'Going further',
    summary: 'The woman caught in adultery: a whole story some manuscripts have and others do not.',
    learn: ['Working through a variant step by step', 'Why “earliest” is not always “original”', 'Testing claims about an author’s style', 'Wording a fair footnote'],
    before: 'guide/weighing-evidence/', related: ['guide/examples/james-2-20/', 'guide/which-variants-matter/', 'guide/weighing-evidence/'], verses: ['John 7:53–8:11'],
  },
  {
    path: 'guide/examples/romans-16-7/', cover: 'Romans 16:7', section: 'example', level: 'Going further',
    summary: 'Junia or Junias? The letters are certain but the accent, and so the person’s gender, is debated.',
    learn: ['When the variant is an accent, not a word', 'How printed editions and translations differ', 'What to tell your readers'],
    related: ['guide/examples/james-2-20/', 'guide/base-texts/'], verses: ['Romans 16:7'],
  },
  {
    path: 'guide/base-texts/', cover: 'Two Greek texts', section: 'guide', level: 'Going further',
    summary: 'Why the Bible your church reads may differ from the UBS text, and which text Indian-language Bibles follow.',
    learn: ['The UBS text and the Textus Receptus', 'Where they differ', 'Which text each Indian-language Bible follows', 'The case for the TR and the Byzantine text'],
    related: ['guide/text-policy/', 'background/nt-text/', 'guide/which-variants-matter/'],
  },
  {
    path: 'guide/text-policy/', cover: 'Which text to follow', section: 'guide', level: 'Going further',
    summary: 'Guidance on base texts: the critical text, the regional-language Bible, and the Review Committee.',
    learn: ['What translation teams are asked to do', 'The reasoning behind it', 'What it means for your team'],
    before: 'guide/base-texts/', related: ['guide/base-texts/', 'guide/which-variants-matter/'],
  },
  {
    path: 'guide/paratext/', cover: 'The apparatus in Paratext', section: 'guide', level: 'Start here',
    summary: 'Setting up the Source Language Text window beside your translation and decoding the sigla.',
    learn: ['Opening and installing the texts', 'Arranging the windows', 'Reading the apparatus marks', 'Decoding the sigla'],
    related: ['guide/apparatus/', 'witnesses/'],
  },
  {
    path: 'background/nt-text/', cover: 'The New Testament text', section: 'background', level: 'Start here',
    summary: 'From lost originals to the UBS and ECM editions, and why the old “text-types” are debated.',
    learn: ['How the text was written and copied', 'How many manuscripts there are', 'Text-types and why they are debated', 'Printed editions, the ECM and the CBGM'],
    related: ['background/materials/', 'background/ot-text/', 'guide/base-texts/'],
  },
  {
    path: 'background/ot-text/', cover: 'The Old Testament text', section: 'background', level: 'Start here',
    summary: 'The Masoretic Text, the Dead Sea Scrolls, the Septuagint, and how BHS and BHQ cite them.',
    learn: ['What the Masoretic Text is', 'What the Dead Sea Scrolls add', 'Other witnesses', 'How BHS and BHQ cite them'],
    related: ['background/nt-text/', 'background/materials/'],
  },
  {
    path: 'background/materials/', cover: 'Materials and making', section: 'background', level: 'Start here',
    summary: 'Papyrus and parchment, scrolls and books, scripts, nomina sacra, and the mistakes copyists made.',
    learn: ['Writing surfaces and book forms', 'Scripts and nomina sacra', 'How copyists changed the text', 'What correctors did'],
    related: ['background/nt-text/', 'witnesses/', 'guide/weighing-evidence/'],
  },
];

export const byPath = (p: string) => GUIDES.find((g) => g.path === p);
