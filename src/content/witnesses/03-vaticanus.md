---
id: vaticanus
kind: greek_ms
siglum: "B"
names: ["Codex Vaticanus"]
aliases: ["03", "Vaticanus", "Codex Vaticanus", "Vat. gr. 1209"]
lead: "A fourth-century parchment Bible in the Vatican Library. For most of the New Testament the UBS committee weighs it more than any other single manuscript."
date:
  label: "4th century"
  from: 300
  to: 399
  basis: "INTF dates it to century IV on the basis of its handwriting and book format."
  src: [intf]
text_character:
  label: "Usually grouped with the early Egyptian (\"Alexandrian\") witnesses"
  contested_note: "Text-type labels are disputed. Westcott and Hort (1881) treated B as the purest witness; later scholars accept its quality but reject the idea of a \"neutral\" text."
  src: [me-p69, me-p179-180]
key_units:
  - ref: "John 1:18"
    note: "Reads μονογενὴς θεός with 𝔓⁶⁶ and א*."
    src: [ubs5-jn118]
  - ref: "Mark 16:9–20"
    note: "Ends Mark at 16:8. With א it is the oldest Greek witness for the short ending."
    src: [me-p322]
  - ref: "Luke 23:34a"
    note: "Does not have \"Father, forgive them, for they do not know what they are doing\"."
    src: [me]
links:
  - { label: "INTF NT.VMR record (GA 03)", url: "https://ntvmr.uni-muenster.de/manuscript-workspace?docID=20003", kind: record, licence: "unconfirmed" }
  - { label: "Vatican Library, DigiVatLib: Vat. gr. 1209 (full images)", url: "https://digi.vatlib.it/view/MSS_Vat.gr.1209", kind: images, licence: "Images © Biblioteca Apostolica Vaticana; rights must be requested for online use. Link only." }
  - { label: "CSNTM record (GA 03)", url: "https://manuscripts.csntm.org/manuscript/View/GA_03", kind: images, licence: "CSNTM: every use needs their permission; link only." }
sources:
  - { id: intf, cite: "INTF, Kurzgefasste Liste, NT.VMR record for 03 (docID 20003), retrieved 19 Nov 2026.", url: "https://ntvmr.uni-muenster.de/community/vmr/api/metadata/liste/search/?docID=20003&detail=shelfInstance", checked: true }
  - { id: vat, cite: "Biblioteca Apostolica Vaticana, DigiVatLib record and IIIF manifest for Vat. gr. 1209, seen 19 Nov 2026.", url: "https://digi.vatlib.it/view/MSS_Vat.gr.1209", checked: true }
  - { id: ubs5-jn118, cite: "UBS Greek New Testament, 5th ed., apparatus at John 1:18, as shown in Paratext 9 (seen 19 Nov 2026).", checked: true }
  - { id: me, cite: "Bruce M. Metzger and Bart D. Ehrman, The Text of the New Testament, 4th ed. (Oxford University Press, 2005).", checked: false }
  - { id: me-p67-68, cite: "Bruce M. Metzger and Bart D. Ehrman, The Text of the New Testament, 4th ed. (Oxford University Press, 2005), pp. 67–68.", checked: true }
  - { id: me-p68, cite: "Bruce M. Metzger and Bart D. Ehrman, The Text of the New Testament, 4th ed. (Oxford University Press, 2005), p. 68.", checked: true }
  - { id: me-p69, cite: "Bruce M. Metzger and Bart D. Ehrman, The Text of the New Testament, 4th ed. (Oxford University Press, 2005), p. 69.", checked: true }
  - { id: me-p179-180, cite: "Bruce M. Metzger and Bart D. Ehrman, The Text of the New Testament, 4th ed. (Oxford University Press, 2005), pp. 179–180.", checked: true }
  - { id: me-p322, cite: "Bruce M. Metzger and Bart D. Ehrman, The Text of the New Testament, 4th ed. (Oxford University Press, 2005), p. 322.", checked: true }
  - { id: pk-p71, cite: "D. C. Parker, An Introduction to the New Testament Manuscripts and Their Texts (Cambridge University Press, 2008), p. 71.", checked: true }
unverified:
  - { claim: "The later corrector who traced over the letters is often dated to the 10th or 11th century, and also added accents.", from: "memory; Metzger & Ehrman p. 68 confirm the tracing but give no date and do not mention accents" }
  - { claim: "In Mark the scribe left a blank column after 16:8.", from: "memory; not found in Metzger & Ehrman or Parker" }
  - { claim: "Aland category I.", from: "memory of Aland & Aland; check" }
ubs5_list_checked: false
last_checked: "2026-11-19"
greek_ms:
  ga: "03"
  ntvmr_doc_id: 20003
  category: majuscule
  material: { value: parchment, src: [pk-p71] }
  format: { value: codex, src: [pk-p71] }
  leaves: { value: "142 (New Testament part, pp. 1235–1518)", src: [intf] }
  content_letters: { value: "eap † (Gospels, Acts and Catholic letters, Paul; with gaps)", src: [intf] }
  contents:
    - { book: Mt, status: complete }
    - { book: Mk, status: complete }
    - { book: Lk, status: complete }
    - { book: Jn, status: complete }
    - { book: Ac, status: complete }
    - { book: Jas, status: complete }
    - { book: 1Pe, status: complete }
    - { book: 2Pe, status: complete }
    - { book: 1Jn, status: complete }
    - { book: 2Jn, status: complete }
    - { book: 3Jn, status: complete }
    - { book: Jd, status: complete }
    - { book: Ro, status: complete }
    - { book: 1Cor, status: complete }
    - { book: 2Cor, status: complete }
    - { book: Ga, status: complete }
    - { book: Eph, status: complete }
    - { book: Php, status: complete }
    - { book: Col, status: complete }
    - { book: 1Th, status: complete }
    - { book: 2Th, status: complete }
    - { book: He, status: partial, note: "breaks off at 9:14" }
    - { book: 1Tm, status: absent }
    - { book: 2Tm, status: absent }
    - { book: Tt, status: absent }
    - { book: Phm, status: absent }
    - { book: Re, status: absent }
  contents_src: [intf, me-p68]
  holdings:
    - { institution: "Biblioteca Apostolica Vaticana", place: "Vatican City", shelfmark: "Vat. gr. 1209", src: [intf, vat] }
  cntr: { w: "m20003", v: "43001001" }
page_image:
  label: "full images at the Vatican Library"
  source_url: "https://digi.vatlib.it/view/MSS_Vat.gr.1209"
  withheld: "The Vatican Library asks permission for online use of its manuscript photos. Out of courtesy we do not show a copy here; follow the link to see the page."
---

Vaticanus is a parchment book written in capital letters, three columns to a page. It once held the whole Greek Bible. The New Testament part breaks off in Hebrews 9:14, so the rest of Hebrews, the letters to Timothy, Titus and Philemon, and Revelation are lost.

It has been in the Vatican Library for at least five hundred years, which is why it is known by the library's shelfmark, Vat. gr. 1209. It is named in the library's first catalogue, made in 1475 (Metzger and Ehrman, pp. 67–68).

A later corrector traced over every letter again, but left out the letters and words he thought were wrong (Metzger and Ehrman, p. 68).

Where B and 𝔓⁷⁵ agree in Luke and John, the agreement shows that B's text was already in existence around 200. This is one reason the UBS committee gives B so much weight. Still, read the committee's reasoning in each case: the letter B on its own does not settle a reading.
