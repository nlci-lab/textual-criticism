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
  contested_note: "The name \"Western\" is misleading, and whether this is one text-type at all is debated. In Acts the Western text is nearly one-tenth longer than the Alexandrian."
  src: [me, metzger-acts]
key_units:
  - ref: "Luke 6:4–5"
    note: "Moves verse 5 to after verse 10 and puts in its place a saying of Jesus to a man working on the Sabbath: \"Man, if you know what you are doing, you are blessed; but if you do not know, you are accursed and a transgressor of the law.\" Luke then tells three Sabbath incidents, ending with the Son of Man as lord of the Sabbath."
    src: [metzger-tc, omanson]
  - ref: "Luke 22:19b–20"
    note: "The only Greek manuscript with the shorter text of the Last Supper: it leaves out verses 19b–20, so the order is cup, then bread. The Old Latin manuscripts itᵃ, ᵈ, ᶠᶠ², ⁱ, ˡ agree. All other Greek manuscripts, from 𝔓⁷⁵ on, have cup, bread, cup. The committee was divided: a minority preferred the shorter text, but the majority followed the far stronger external evidence for the longer text and printed it, rated {B}."
    src: [metzger-tc-lk22]
  - ref: "Acts (throughout)"
    note: "Acts circulated in two forms. D is the chief witness of the \"Western\" form, with the papyri 𝔓²⁹, 𝔓³⁸ and 𝔓⁴⁸, readings in the Harclean Syriac, the Old Latin h, and quotations in Cyprian and Augustine. That form is nearly one-tenth longer and often more vivid. No theory of how the two forms arose has won general agreement, so the UBS committee judged each passage on its own: it more often chose the shorter text, but accepted that some Western additions may be historically accurate. D also has readings of its own that other Western witnesses do not share."
    src: [metzger-acts, omanson-acts]
links:
  - { label: "INTF NT.VMR record (GA 05)", url: "https://ntvmr.uni-muenster.de/manuscript-workspace?docID=20005", kind: record, licence: "unconfirmed" }
  - { label: "Cambridge Digital Library: MS Nn.2.41 (full images)", url: "https://cudl.lib.cam.ac.uk/view/MS-NN-00002-00041/1", kind: images, licence: "unconfirmed" }
  - { label: "CSNTM record (GA 05)", url: "https://manuscripts.csntm.org/manuscript/View/GA_05", kind: images, licence: "CSNTM: every use needs their permission; link only." }
sources:
  - { id: intf, cite: "INTF, Kurzgefasste Liste, NT.VMR record for 05 (docID 20005), retrieved 19 Nov 2026.", url: "https://ntvmr.uni-muenster.de/community/vmr/api/metadata/liste/search/?docID=20005&detail=shelfInstance", checked: true }
  - { id: ubs5-intro, cite: "UBS Greek New Testament, 5th ed., Introduction pp. 58*–63*, list of symbols, as given in Paratext 9 help.", checked: true }
  - { id: metzger-tc, cite: "Bruce M. Metzger, A Textual Commentary on the Greek New Testament, 2nd ed. (United Bible Societies, 1994), p. 117, note on Luke 6:4.", checked: true }
  - { id: metzger-tc-lk22, cite: "Bruce M. Metzger, A Textual Commentary on the Greek New Testament, 2nd ed. (United Bible Societies, 1994), pp. 148–50, note on Luke 22:17–20.", checked: true }
  - { id: metzger-acts, cite: "Bruce M. Metzger, A Textual Commentary on the Greek New Testament, 2nd ed. (United Bible Societies, 1994), pp. 222–35, introduction to Acts.", checked: true }
  - { id: omanson-acts, cite: "Roger L. Omanson, A Textual Guide to the Greek New Testament (Deutsche Bibelgesellschaft, 2006), pp. 214–16, introduction to Acts.", checked: true }
  - { id: omanson, cite: "Roger L. Omanson, A Textual Guide to the Greek New Testament (Deutsche Bibelgesellschaft, 2006), p. 117, note on Luke 6:4.", checked: true }
  - { id: me, cite: "Bruce M. Metzger and Bart D. Ehrman, The Text of the New Testament, 4th ed. (Oxford University Press, 2005).", checked: false }
  - { id: parker, cite: "D. C. Parker, Codex Bezae: An Early Christian Manuscript and its Text (Cambridge University Press, 1992).", checked: false }
unverified:
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
page_image:
  file: "img/ms/m20005-179v.webp"
  width: 900
  height: 1102
  label: "Luke 5:38–6:9 (Greek page)"
  source_url: "https://greekcntr.org/manuscripts/?w=m20005&v=42006004"
---

Codex Bezae has Greek on the left-hand page and Latin on the right, line by line. It is named after Theodore Beza, the Reformer, who owned it before it went to Cambridge.

When D stands alone against all the other early Greek manuscripts, the UBS committee rarely follows it. But D is often joined by Old Latin and Syriac witnesses, which suggests that its kind of text was spread widely by the second century.

In the Gospels and Acts, D means this manuscript (05). In Paul's letters it means a different one, Codex Claromontanus (06).
