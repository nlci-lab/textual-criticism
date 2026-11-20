---
id: bezae
kind: greek_ms
siglum: "D"
siglum_scope: "the Gospels and Acts"
names: ["Codex Bezae", "Codex Bezae Cantabrigiensis"]
aliases: ["05", "D05", "Bezae", "Codex Bezae", "Cantabrigiensis"]
lead: "A Greek and Latin book of the Gospels and Acts from about 400. Its text often differs sharply from other early manuscripts, especially in Acts."
date:
  label: "5th century"
  from: 400
  to: 499
  basis: "INTF dates it to century V. Some scholars place it around 400, others in the 5th or 6th century."
  src: [intf]
text_character:
  label: "The main Greek witness of the so-called \"Western\" text"
  contested_note: "The name \"Western\" is misleading, and whether this is one text-type at all is debated. Its Acts is about one tenth longer than the text of B."
  src: [me]
key_units:
  - ref: "Luke 22:19b–20"
    note: "Leaves out the second cup and the words over it."
    src: [me]
  - ref: "Acts (throughout)"
    note: "Its many additions in Acts are the main evidence for the longer form of that book."
    src: [me]
links:
  - { label: "INTF NT.VMR record (GA 05)", url: "https://ntvmr.uni-muenster.de/manuscript-workspace?docID=20005", kind: record, licence: "unconfirmed" }
  - { label: "Cambridge Digital Library: MS Nn.2.41 (full images)", url: "https://cudl.lib.cam.ac.uk/view/MS-NN-00002-00041/1", kind: images, licence: "unconfirmed" }
  - { label: "CSNTM record (GA 05)", url: "https://manuscripts.csntm.org/manuscript/View/GA_05", kind: images, licence: "CSNTM: every use needs their permission; link only." }
sources:
  - { id: intf, cite: "INTF, Kurzgefasste Liste, NT.VMR record for 05 (docID 20005), retrieved 19 Nov 2026.", url: "https://ntvmr.uni-muenster.de/community/vmr/api/metadata/liste/search/?docID=20005&detail=shelfInstance", checked: true }
  - { id: ubs5-intro, cite: "UBS Greek New Testament, 5th ed., Introduction pp. 58*–63*, list of symbols, as given in Paratext 9 help.", checked: true }
  - { id: me, cite: "Bruce M. Metzger and Bart D. Ehrman, The Text of the New Testament, 4th ed. (Oxford University Press, 2005).", checked: false }
  - { id: parker, cite: "D. C. Parker, Codex Bezae: An Early Christian Manuscript and its Text (Cambridge University Press, 1992).", checked: false }
unverified:
  - { claim: "At Luke 6:4/5 D adds a saying of Jesus to a man working on the Sabbath, found in no other Greek manuscript, and moves 6:5 to after 6:10.", from: "memory of Metzger & Ehrman. Not discussed in Metzger, Textual Commentary p. 117, or Omanson, Textual Guide p. 118, which treat only καί and word order at 6:5 (checked 20 Nov 2026)" }
  - { claim: "The Gospels are in the order Matthew, John, Luke, Mark.", from: "memory of Metzger & Ehrman" }
  - { claim: "Theodore Beza gave it to Cambridge University in 1581.", from: "memory of Metzger & Ehrman" }
  - { claim: "Its Latin side is cited separately in UBS as the Old Latin manuscript itᵈ.", from: "the unsourced sigla list; check against UBS5 Introduction" }
  - { claim: "Parker dates it to about 400 and places it in Berytus (Beirut).", from: "memory of Parker 1992" }
  - { claim: "Aland category IV.", from: "memory of Aland & Aland; check" }
ubs5_list_checked: false
last_checked: "2026-11-19"
greek_ms:
  ga: "05"
  ntvmr_doc_id: 20005
  category: majuscule
  material: { value: parchment, src: [me] }
  format: { value: codex, src: [me] }
  leaves: { value: "415", src: [intf] }
  content_letters: { value: "ea † (Gospels, Acts; with gaps). Greek and Latin on facing pages.", src: [intf] }
  contents:
    - { book: Mt, status: partial }
    - { book: Mk, status: partial }
    - { book: Lk, status: partial }
    - { book: Jn, status: partial }
    - { book: Ac, status: partial }
  contents_src: [intf]
  correctors:
    - { siglum: "Dˢᵘᵖᵖ", note: "Leaves replaced by a later hand: Matt 3:7–16; John 18:14–20:13; Mark 16:6–20.", src: [intf, ubs5-intro] }
  holdings:
    - { institution: "Cambridge University Library", place: "Cambridge", shelfmark: "MS Nn. 2.41", src: [intf] }
  cntr: { w: "m20005", v: "42001001" }
---

Codex Bezae has Greek on the left-hand page and Latin on the right, line by line. It is named after Theodore Beza, the Reformer, who owned it before it went to Cambridge.

When D stands alone against all the other early Greek manuscripts, the UBS committee rarely follows it. But D is often joined by Old Latin and Syriac witnesses, which suggests that its kind of text was spread widely by the second century.

Note the siglum: in the Gospels and Acts, D means this manuscript (05). In Paul's letters, D means a different manuscript, Codex Claromontanus (06).
