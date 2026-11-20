# Generates the five design-direction mock-ups (static HTML, no JS frameworks).
# Run: python docs/design-directions/build.py   (then shoot.sh for screenshots)
import pathlib, html

ROOT = pathlib.Path(__file__).parent

TOKENS = """
:root{--paper:#fbfaf8;--paper-2:#f1efeb;--ink:#1f1c19;--ink-2:#57504a;--rule:#d9d4cc;--rubric:#9d2a1f;
--warn-bg:#fbf1d9;--warn-ink:#5c4300;--bar-full:#3b3530;--bar-part:#a39a90;--bar-none:#e6e1da;
--serif:"Gentium Book Plus","Gentium Plus","Noto Serif",Cambria,"Times New Roman",serif;
--sans:system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans",sans-serif;
--sigla:"Gentium Book Plus","Cambria Math","STIX Two Math","Noto Sans Math","Segoe UI Symbol",serif;
--hebrew:"Noto Serif Hebrew","SBL Hebrew","Times New Roman",serif;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--paper:#17191b;--paper-2:#212427;--ink:#e8e3db;--ink-2:#ada69c;--rule:#3a3d41;
--rubric:#f08b7c;--warn-bg:#3a3014;--warn-ink:#f3dc9b;--bar-full:#e8e3db;--bar-part:#8c857c;--bar-none:#33373b;color-scheme:dark}}
*,*::before,*::after{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font:1.0625rem/1.6 var(--serif)}
a{color:var(--rubric);text-underline-offset:.15em;text-decoration-thickness:1px}
:focus-visible{outline:2px solid var(--rubric);outline-offset:2px}
h1,h2,h3,h4{line-height:1.2;font-weight:600;text-wrap:balance}h1{font-size:2.2rem;margin:0 0 .5rem}
h2{font-size:1.3rem;margin:2rem 0 .5rem}h3{font-size:1.0625rem;margin:1.5rem 0 .25rem}h4{margin:0 0 .25rem;font-size:1rem}
p,ul,ol{margin:0 0 1rem}
.siglum{font-family:var(--sigla);color:var(--rubric);white-space:nowrap}[lang=he]{font-family:var(--hebrew);unicode-bidi:isolate}
[lang=grc]{font-family:var(--serif)}
.label,.kicker{font:600 .75rem/1.3 var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);margin:0 0 .25rem}
.muted{color:var(--ink-2)}.small{font-size:.875rem}.lead{font-size:1.2rem;line-height:1.5}
.uc{background:var(--warn-bg);color:var(--warn-ink);font:.8125rem/1.4 var(--sans);padding:.35rem 16px;text-align:center}
.brand{font:600 1rem var(--serif);color:var(--ink);text-decoration:none}
.card{border:1px solid var(--rule);background:var(--paper-2);padding:.75rem 1rem;border-radius:4px}
.card .big,.master .big{font-size:1.15rem;font-weight:600;margin:0 0 .25rem}
.twin{display:grid;gap:.75rem;margin:1rem 0}@media(min-width:560px){.twin{grid-template-columns:1fr 1fr}}
.checks{padding-left:1.5rem}.checks .q{font-weight:600}
.master{border-left:3px solid var(--rubric);padding:.5rem 1rem;margin:1rem 0;background:var(--paper-2)}
.rules{display:grid;gap:.75rem}.rule{border-top:1px solid var(--rule);padding-top:.5rem}
.limit{font-size:.9375rem;color:var(--ink-2)}.limit span{font:600 .7rem var(--sans);text-transform:uppercase;letter-spacing:.06em;color:var(--rubric);margin-right:.4rem}
.scroll{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:.9375rem}
th,td{text-align:left;vertical-align:top;padding:.4rem .6rem;border-bottom:1px solid var(--rule)}th{font:600 .75rem var(--sans);text-transform:uppercase;letter-spacing:.05em;color:var(--ink-2)}
tr.chosen td{background:var(--paper-2)}.tag{font:600 .7rem var(--sans);border:1px solid var(--rubric);color:var(--rubric);padding:0 .3rem;border-radius:3px;margin-left:.3rem}
.gl{color:var(--ink-2)}
.facts{display:grid;grid-template-columns:auto 1fr;gap:.35rem 1rem;margin:0 0 1rem;font-size:.9375rem}.facts dt{font:600 .75rem/1.9 var(--sans);text-transform:uppercase;letter-spacing:.05em;color:var(--ink-2)}.facts dd{margin:0}
.books{display:flex;flex-wrap:wrap;gap:2px;margin:.25rem 0 .5rem;padding:0;list-style:none;font:600 .7rem var(--sans)}
.books li{padding:.2rem .3rem;min-width:2.4rem;text-align:center;border-radius:2px}
.books .complete{background:var(--bar-full);color:var(--paper)}.books .partial{background:var(--bar-part);color:var(--ink)}.books .absent{background:var(--bar-none);color:var(--ink-2)}
.units{list-style:none;padding:0}.units li{border-top:1px solid var(--rule);padding:.5rem 0}.units b{font-family:var(--sans);font-size:.875rem}
.sources{font-size:.875rem;color:var(--ink-2);padding-left:1.25rem}
.note{border-left:3px solid var(--rule);padding-left:.75rem;color:var(--ink-2)}
.withheld{border:1px dashed var(--rule);padding:.75rem 1rem;font-size:.9375rem;color:var(--ink-2)}
.wlist{list-style:none;padding:0;margin:0}.wlist li{display:grid;grid-template-columns:4.5rem 1fr auto;gap:.5rem;padding:.4rem 0;border-top:1px solid var(--rule);align-items:baseline}
.wlist .siglum{font-size:1.1rem}.wlist .d{font:.8125rem var(--sans);color:var(--ink-2)}
.glist{list-style:none;padding:0;margin:0}.glist li{padding:.45rem 0;border-top:1px solid var(--rule)}.glist p{margin:0;font-size:.9375rem;color:var(--ink-2)}
.diagram svg{width:100%;max-width:520px;height:auto}.diagram line{stroke:var(--bar-part)}.diagram .anc{fill:var(--rubric)}.diagram .late{fill:var(--bar-part)}.diagram .early{fill:var(--bar-full)}.diagram text{fill:var(--ink-2);font:13px var(--sans);text-anchor:middle}
"""

def S(t, he=False):
    return f'<span class="siglum"{" lang=he dir=ltr" if he else ""}>{t}</span>'

WITNESSES = [
    (S("𝔓⁴⁵"), "Chester Beatty papyrus of Gospels and Acts", "3rd c."),
    (S("𝔓⁴⁶"), "Paul's letters, the earliest collection", "c. 200"),
    (S("𝔓⁶⁶"), "John, Bodmer papyrus", "c. 200"),
    (S("𝔓⁷⁵"), "Luke and John, close to B", "3rd c."),
    (S("א", True) + " 01", "Codex Sinaiticus", "4th c."),
    (S("A") + " 02", "Codex Alexandrinus", "5th c."),
    (S("B") + " 03", "Codex Vaticanus", "4th c."),
    (S("D") + " 05", "Codex Bezae, Greek and Latin", "5th c."),
    (S("Byz"), "The Byzantine majority text", "9th c. on"),
]
GUIDES = [
    ("Reading the apparatus", "What each part of a UBS entry means, with John 1:18."),
    ("Weighing the evidence", "External and internal evidence, and how to judge."),
    ("Which variants matter", "When a variant changes the translation, and when it does not."),
    ("Base texts", "UBS, the Byzantine text, and the Textus Receptus."),
    ("Text policy", "Following the translation guidelines on variants."),
    ("Using Paratext", "Where the apparatus and resources live in Paratext."),
]
BACKGROUND = [("Materials", "Papyrus, parchment, scrolls and codices."), ("The New Testament text", "How the text was copied and printed."), ("The Old Testament text", "Coming in 2027.")]

def wlist(n=None):
    return '<ul class="wlist">' + "".join(f'<li>{s}<a href="witness.html">{d}</a><span class="d">{t}</span></li>' for s, d, t in WITNESSES[:n]) + "</ul>"
def glist():
    return '<ul class="glist">' + "".join(f'<li><a href="guide.html">{t}</a><p>{d}</p></li>' for t, d in GUIDES) + "</ul>"
def blist():
    return '<ul class="glist">' + "".join(f'<li><a href="#">{t}</a><p>{d}</p></li>' for t, d in BACKGROUND) + "</ul>"

HOME_INTRO = '<p class="lead">An introduction to the manuscripts behind the New Testament, for Bible translators and consultants. Look up a witness cited in the UBS apparatus, or learn how to read and weigh the evidence.</p>'

BOOKS = [("Mt","c"),("Mk","c"),("Lk","c"),("Jn","c"),("Ac","c"),("Jas","c"),("1Pe","c"),("2Pe","c"),("1Jn","c"),("2Jn","c"),("3Jn","c"),("Jd","c"),("Ro","c"),("1Cor","c"),("2Cor","c"),("Ga","c"),("Eph","c"),("Php","c"),("Col","c"),("1Th","c"),("2Th","c"),("He","p"),("1Tm","a"),("2Tm","a"),("Tt","a"),("Phm","a"),("Re","a")]
CLS = {"c": "complete", "p": "partial", "a": "absent"}
W_LEAD = "A fourth-century parchment Bible in the Vatican Library. For most of the New Testament the UBS committee weighs it more than any other single manuscript."
W_FACTS = """<dl class="facts"><dt>Siglum</dt><dd><span class="siglum">B</span> · GA 03</dd><dt>Date</dt><dd>4th century</dd>
<dt>Material</dt><dd>Parchment codex</dd><dt>Leaves</dt><dd>142 (NT part, pp. 1235–1518)</dd>
<dt>Held at</dt><dd>Biblioteca Apostolica Vaticana, Vat. gr. 1209</dd><dt>Text</dt><dd>Usually grouped with the early Egyptian (“Alexandrian”) witnesses</dd></dl>"""
W_BOOKS = '<p class="label">Contents</p><ul class="books">' + "".join(f'<li class="{CLS[s]}" title="{b}">{b}</li>' for b, s in BOOKS) + '</ul><p class="small muted">Hebrews breaks off at 9:14. ■ complete ■ partial □ lost</p>'
W_UNITS = """<ul class="units"><li><b>John 1:18</b> — Reads <span lang="grc">μονογενὴς θεός</span> with <span class="siglum">𝔓⁶⁶</span> and <span class="siglum" lang="he" dir="ltr">א</span>*.</li>
<li><b>Mark 16:9–20</b> — Ends Mark at 16:8, but the scribe left a blank column after it.</li>
<li><b>Luke 23:34a</b> — Does not have “Father, forgive them, for they do not know what they are doing”.</li></ul>"""
W_PROSE = """<p>Vaticanus is a parchment book written in capital letters, three columns to a page. It once held the whole Greek Bible. The New Testament part breaks off in Hebrews 9:14, so the rest of Hebrews, the letters to Timothy, Titus and Philemon, and Revelation are lost.</p>
<p>It has been in the Vatican Library for at least five hundred years, which is why it is known by the library's shelfmark, Vat. gr. 1209.</p>
<p>Where B and <span class="siglum">𝔓⁷⁵</span> agree in Luke and John, the agreement shows that B's text was already in existence around 200. This is one reason the UBS committee gives B so much weight. Still, read the committee's reasoning in each case: the letter B on its own does not settle a reading.</p>"""
W_IMAGE = '<div class="withheld">The Vatican Library asks permission for online use of its manuscript photos. Out of courtesy we do not show a copy here. <a href="#">See the full images at the Vatican Library ↗</a></div>'
W_LINKS = '<ul class="glist"><li><a href="#">INTF NT.VMR record (GA 03) ↗</a></li><li><a href="#">Vatican Library, DigiVatLib: Vat. gr. 1209 ↗</a><p>Images © BAV; link only.</p></li><li><a href="#">CSNTM record (GA 03) ↗</a></li></ul>'
W_SOURCES = '<ol class="sources"><li>INTF, Kurzgefasste Liste, NT.VMR record for 03, retrieved 19 Nov 2026.</li><li>Biblioteca Apostolica Vaticana, DigiVatLib record for Vat. gr. 1209.</li><li>UBS Greek New Testament, 5th ed., apparatus at John 1:18.</li><li>Metzger and Ehrman, <i>The Text of the New Testament</i>, 4th ed. (2005).</li></ol>'
W_CONTESTED = '<p class="small muted">Text-type labels are disputed. Westcott and Hort (1881) treated B as the purest witness; later scholars accept its quality but reject the idea of a “neutral” text.</p>'

fan = [30 + i * 20 for i in range(11)]
DIAGRAM = '<div class="diagram"><svg viewBox="0 0 520 195" role="img" aria-label="Many late copies from one ancestor count as one witness; two independent early copies count as two."><g>' + "".join(f'<line x1="130" y1="96" x2="{x}" y2="140"/>' for x in fan) + '</g><circle cx="130" cy="90" r="9" class="anc"/>' + "".join(f'<circle cx="{x}" cy="146" r="6" class="late"/>' for x in fan) + '<circle cx="340" cy="146" r="11" class="early"/><circle cx="440" cy="146" r="11" class="early"/><text x="130" y="72">one ancestor</text><text x="130" y="178">many late copies = one witness</text><text x="390" y="178">two independent copies = two witnesses</text></svg></div>'

G = {}
G["lead"] = '<p class="lead">An apparatus entry tells you which manuscripts support which reading. It does not tell you which reading is right. For that, you weigh two kinds of evidence: the witnesses themselves, and the wording.</p>'
G["twin1"] = '<div class="twin"><section class="card"><p class="kicker">External evidence</p><p class="big">Who says it?</p><p>The witnesses: manuscripts, early translations, quotations.</p></section><section class="card"><p class="kicker">Internal evidence</p><p class="big">What does it say?</p><p>The wording: what a scribe would do, and what the author would write.</p></section></div>'
G["ext"] = """<h2 id="external">External evidence: the witnesses</h2><p>A <em>witness</em> is any source for the text. It may be a Greek manuscript, an early translation (a <em>version</em>), or a quotation in a church writer (a <em>father</em>). Before looking at the words, editors ask these questions about the sources.</p>
<ol class="checks"><li><span class="q">How old?</span> Look at the <em>earliest</em> witness for each reading. An older copy probably stands fewer copying steps from the original.</li>
<li><span class="q">From where?</span> Which group of manuscripts does the witness belong to? Codex Bezae (<a href="#">D 05</a>), for example, often adds words that explain.</li>
<li><span class="q">How careful?</span> <a href="witness.html">Codex Vaticanus</a> and <a href="#">Codex Sinaiticus</a> were copied very carefully.</li>
<li><span class="q">How widespread?</span> When witnesses from Egypt, Syria and Italy agree, one local mistake can hardly explain it.</li>
<li><span class="q">Independent?</span> Or was one copied from another?</li><li><span class="q">How many?</span> This comes last.</li></ol>"""
G["count"] = '<h3 id="count">Why we do not simply count</h3><p>Most Greek manuscripts are late, and many belong to the Byzantine group (cited in UBS as <a href="#">Byz</a>). If five hundred late copies all go back to one ancestor, they are really one witness repeated five hundred times. Two early, independent copies can outweigh them.</p>' + DIAGRAM
G["int"] = '<h2 id="internal">Internal evidence: the words</h2><p>Here you look at the readings themselves, and ask two different questions.</p><div class="twin"><section class="card"><p class="kicker">Transcriptional</p><p class="big">What was a scribe likely to do?</p><p>Scribes slipped with eye and hand. They also explained hard wording, smoothed grammar, and made passages match.</p></section><section class="card"><p class="kicker">Intrinsic</p><p class="big">What was the author likely to write?</p><p>Does the reading fit this writer\'s words, style and thought?</p></section></div>'
G["rules"] = """<h3 id="rules">Rules of thumb</h3><div class="master"><p class="kicker">The rule behind the rules</p><p class="big">Prefer the reading that best explains the others.</p><p>If reading A easily explains how B arose, but B does not explain A, prefer A.</p></div>
<div class="rules"><section class="rule"><h4>The harder reading</h4><p>Scribes removed difficulties more often than they created them.</p><p class="limit"><span>Limit</span> A reading can be hard because it is a plain mistake.</p></section>
<section class="rule"><h4>The shorter reading</h4><p>Scribes added explaining words more often than they removed words.</p><p class="limit"><span>Limit</span> Scribes also dropped words by accident. Never use this rule alone.</p></section>
<section class="rule"><h4>Harmonization</h4><p>When a reading makes one passage match another, it is often the later one.</p></section>
<section class="rule"><h4>The author's style</h4><p>Prefer the reading that fits the author's usual words and ideas.</p><p class="limit"><span>Limit</span> A scribe can also “correct” toward the author's style.</p></section></div>"""
G["example"] = """<h2 id="example">A worked example: James 2:20</h2><p>Some Bibles say faith without works is “useless”. Others say “dead”. The UBS text reads <span lang="grc">ἀργή</span> and rates it {B}.</p>
<div class="scroll"><table><thead><tr><th>Reading</th><th>Some witnesses</th><th>Earliest</th></tr></thead><tbody>
<tr class="chosen"><td><span lang="grc">ἀργή</span> <span class="gl">“useless”</span><span class="tag">UBS text</span></td><td><a href="witness.html">B</a>, C*, 1739, some Latin, Sahidic Coptic</td><td>4th c.</td></tr>
<tr><td><span lang="grc">νεκρά</span> <span class="gl">“dead”</span></td><td><span class="siglum" lang="he" dir="ltr">א</span>, A, C², Byz, Syriac</td><td>4th c.</td></tr>
<tr><td><span lang="grc">κενή</span> <span class="gl">“empty”</span></td><td><span class="siglum">𝔓⁷⁴</span>, one Latin manuscript</td><td>7th c.</td></tr></tbody></table></div>
<ul><li>Verses 17 and 26 both say “dead”. A scribe could easily write it again in verse 20; that is harmonization.</li>
<li><span lang="grc">ἀργή</span> is built from “not” + <span lang="grc">ἔργον</span> (“work”) and stands next to <span lang="grc">ἔργων</span>: an author's play on words that a scribe flattens.</li>
<li>Codex C was first written with “useless” and later corrected to “dead”.</li></ul>
<p>So for a translator the choice changes little in meaning. If your readers know “dead”, you can follow the UBS text and still respect their Bible.</p>"""
G["src"] = '<h2 id="sources">Sources</h2><ol class="sources"><li>Adapted from Thomas Hemphill, “New Testament Textual Criticism for Bible translators”. Used with permission.</li><li>Metzger, <i>A Textual Commentary</i>, 2nd ed., on James 2:20.</li><li>Omanson, <i>A Textual Guide to the Greek New Testament</i>, on James 2:20.</li></ol>'
GUIDE_BODY = "".join(G[k] for k in ["lead", "twin1", "ext", "count", "int", "rules", "example", "src"])
TOC = [("external", "External evidence"), ("count", "Why we do not simply count"), ("internal", "Internal evidence"), ("rules", "Rules of thumb"), ("example", "Worked example: James 2:20"), ("sources", "Sources")]
def toc():
    return '<ol class="toc">' + "".join(f'<li><a href="#{i}">{t}</a></li>' for i, t in TOC) + "</ol>"

NAV = [("Home", "home.html"), ("Witnesses", "witness.html"), ("Guides", "guide.html"), ("Background", "#")]

def page(title, css, body, slug):
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>{html.escape(title)} · Textual Criticism ({slug})</title>
<style>{TOKENS}{css}</style></head><body><div class="uc">Under construction: content is being checked.</div>{body}</body></html>"""

DIRS = {}

# 1 ---------------------------------------------------------------- Reference shelf
CSS1 = """
.top{border-bottom:1px solid var(--rule);font-family:var(--sans);padding:.6rem 16px;display:flex;gap:1rem;align-items:baseline}
.shell{display:grid;grid-template-columns:1fr;max-width:84rem;margin:0 auto}
.side{display:none}.toc-m{margin:0 16px 1rem}.toc-m summary{font:600 .875rem var(--sans);cursor:pointer;padding:.5rem 0}
main{padding:1.25rem 16px 3rem;min-width:0}.toc{padding-left:1.1rem;font:.875rem/1.5 var(--sans)}.toc li{margin:.2rem 0}
.side nav p{margin:1.25rem 0 .25rem}.side ul{list-style:none;margin:0;padding:0;font:.9rem/1.45 var(--sans)}.side li a{display:block;padding:.15rem 0;color:var(--ink);text-decoration:none}
.side li a[aria-current]{color:var(--rubric);font-weight:600}
.otp{display:none}
@media(min-width:900px){.shell{grid-template-columns:15rem minmax(0,1fr)}.side{display:block;border-right:1px solid var(--rule);padding:0 1rem 2rem 16px;position:sticky;top:0;height:100vh;overflow:auto}
main{padding:1.5rem 2rem 3rem}.mobnav{display:none}}
@media(min-width:1200px){.shell{grid-template-columns:15rem minmax(0,44rem) 14rem}.toc-m{display:none}.otp{display:block;position:sticky;top:0;padding:1.5rem 1rem;font-family:var(--sans)}}
.homegrid{display:grid;gap:2rem}@media(min-width:1000px){.homegrid{grid-template-columns:1fr 1fr}}
.wprof{display:grid;gap:1.5rem}@media(min-width:1000px){.wprof{grid-template-columns:minmax(0,1fr) 17rem}.wprof aside{order:2}}
"""
def side(cur):
    items = lambda xs, h: "".join(f'<li><a href="{h}"{" aria-current=page" if x==cur else ""}>{x}</a></li>' for x in xs)
    return f'''<aside class="side"><nav><p class="label">Witnesses</p><ul>{items(["𝔓45 Chester Beatty","𝔓46","𝔓66","𝔓75","א 01 Sinaiticus","A 02 Alexandrinus","B 03 Vaticanus","D 05 Bezae","Byz"],"witness.html")}</ul>
<p class="label">Guides</p><ul>{items([g for g,_ in GUIDES],"guide.html").replace(">Weighing the evidence<", (" aria-current=page" if cur=="Weighing the evidence" else "")+">Weighing the evidence<") if False else items([g for g,_ in GUIDES],"guide.html")}</ul>
<p class="label">Background</p><ul>{items([b for b,_ in BACKGROUND],"#")}</ul></nav></aside>'''
def f1(kind):
    top = '<header class="top"><a class="brand" href="home.html">Textual Criticism</a><span class="mobnav small"><a href="witness.html">Witnesses</a> · <a href="guide.html">Guides</a> · <a href="#">Background</a></span></header>'
    if kind == "home":
        m = f'<h1>Textual Criticism</h1>{HOME_INTRO}<div class="homegrid"><section><h2>Witnesses</h2>{wlist()}</section><section><h2>Guides</h2>{glist()}<h2>Background</h2>{blist()}</section></div>'
        return top + f'<div class="shell">{side("")}<main>{m}</main></div>'
    if kind == "witness":
        m = f'<p class="label">Greek manuscript · majuscule</p><h1><span class="siglum">B</span> 03 · Codex Vaticanus</h1><p class="lead">{W_LEAD}</p><div class="wprof"><aside>{W_FACTS}{W_BOOKS}</aside><div><h2>About</h2>{W_PROSE}{W_CONTESTED}<h2>Key places in the apparatus</h2>{W_UNITS}<h2>Images</h2>{W_IMAGE}<h2>Links</h2>{W_LINKS}<h2>Sources</h2>{W_SOURCES}</div></div>'
        return top + f'<div class="shell">{side("B 03 Vaticanus")}<main>{m}</main></div>'
    m = f'<p class="label">Guide</p><h1>Weighing the evidence</h1><details class="toc-m"><summary>On this page</summary>{toc()}</details>{GUIDE_BODY}'
    return top + f'<div class="shell">{side("Weighing the evidence")}<main>{m}</main><nav class="otp"><p class="label">On this page</p>{toc()}</nav></div>'
DIRS["1-reference-shelf"] = ("Reference shelf", CSS1, f1)

# 2 ---------------------------------------------------------------- Margin notes
CSS2 = """
.top{max-width:76rem;margin:0 auto;padding:.75rem 16px;border-bottom:1px solid var(--rule);display:flex;flex-wrap:wrap;gap:.25rem 1.25rem;align-items:baseline;font-family:var(--sans)}
.top nav a{margin-right:1rem;font-size:.9rem}
.page{max-width:76rem;margin:0 auto;padding:1.5rem 16px 3rem}
.mg>*{min-width:0}.mg .m{font-size:.875rem;line-height:1.45;color:var(--ink-2);border-left:2px solid var(--rubric);padding-left:.75rem;margin:0 0 1rem}
.mg .m .label{color:var(--rubric)}
@media(min-width:960px){.mg{max-width:40rem}.mg::after{content:"";display:block;clear:both}
.mg>.m{float:right;clear:right;width:min(20rem,calc(100vw - 40rem - 7rem));margin:.3rem calc(-1 * min(20rem,calc(100vw - 40rem - 7rem)) - 3rem) 1rem 0;border-left:0;padding:.4rem 0 0;border-top:1px solid var(--rule)}
.mg>.wide{width:min(calc(100vw - 32px),72rem)}}
.home3{display:grid;gap:2rem}@media(min-width:960px){.home3{grid-template-columns:minmax(0,40rem) 1fr;column-gap:3.5rem}}
"""
def f2(kind):
    top = '<header class="top"><a class="brand" href="home.html">Textual Criticism</a><nav><a href="witness.html">Witnesses</a><a href="guide.html">Guides</a><a href="#">Background</a></nav></header>'
    if kind == "home":
        b = f'<div class="home3"><div><h1>Textual Criticism</h1>{HOME_INTRO}<h2>Witnesses cited in UBS</h2>{wlist()}</div><div><h2>Guides</h2>{glist()}<h2>Background</h2>{blist()}</div></div>'
    elif kind == "witness":
        b = f'''<div class="mg"><p class="label">Greek manuscript · majuscule</p><h1><span class="siglum">B</span> 03 · Codex Vaticanus</h1><p class="lead">{W_LEAD}</p>
<div class="m">{W_FACTS}</div><div class="wide">{W_BOOKS}</div>{W_PROSE}<aside class="m"><p class="label">Contested</p>{W_CONTESTED}</aside>
<h2>Key places in the apparatus</h2>{W_UNITS}<aside class="m"><p class="label">Images</p>{W_IMAGE}</aside><h2>Links</h2>{W_LINKS}<aside class="m"><p class="label">Sources</p>{W_SOURCES}</aside></div>'''
    else:
        b = f'''<div class="mg"><p class="label">Guide</p><h1>Weighing the evidence</h1><aside class="m"><p class="label">On this page</p>{toc()}</aside>{G["lead"]}{G["twin1"]}{G["ext"]}
<aside class="m"><p class="label">Bezae</p>Codex Bezae (D 05) is Greek and Latin on facing pages, and often longer than other witnesses. <a href="#">Profile</a></aside>{G["count"]}<aside class="m"><p class="label">Byz</p>In UBS, “Byz” stands for the bulk of late Byzantine manuscripts cited as a group.</aside>
{G["int"]}{G["rules"]}<aside class="m"><p class="label">Caution</p>Someone who has already chosen an answer can argue any of these rules either way.</aside><div class="wide">{G["example"]}</div>{G["src"]}</div>'''
    return top + f'<main class="page">{b}</main>'
DIRS["2-margin-notes"] = ("Margin notes", CSS2, f2)

# 3 ---------------------------------------------------------------- Spec sheet (sticky fact rail)
CSS3 = """
.top{background:var(--ink);color:var(--paper);font-family:var(--sans)}.top div{max-width:80rem;margin:0 auto;padding:.6rem 16px;display:flex;flex-wrap:wrap;gap:.25rem 1.25rem;align-items:baseline}
.top a{color:var(--paper);text-decoration:none;font-size:.9rem}.top .brand{color:var(--paper);font-size:1.05rem}
.page{max-width:80rem;margin:0 auto;padding:1.25rem 16px 3rem}
.split{display:grid;gap:1.5rem}.rail{background:var(--paper-2);border:1px solid var(--rule);padding:1rem;border-radius:4px}
.rail h1{font-size:1.6rem}.rail .bigsig{font:2.6rem/1 var(--sigla);color:var(--rubric);margin:0}
@media(min-width:900px){.split{grid-template-columns:22rem minmax(0,1fr);gap:2.5rem}.rail{position:sticky;top:1rem;align-self:start;max-height:calc(100vh - 2rem);overflow:auto}.body{max-width:42rem}}
.idx{display:grid;gap:2rem}@media(min-width:900px){.idx{grid-template-columns:1.2fr 1fr 1fr}}
.steps{list-style:none;padding:0;counter-reset:s;font:.9rem/1.4 var(--sans)}.steps li{counter-increment:s;padding:.35rem 0 .35rem 2rem;position:relative;border-top:1px solid var(--rule)}
.steps li::before{content:counter(s);position:absolute;left:0;font-weight:700;color:var(--rubric)}
"""
def f3(kind):
    top = '<header class="top"><div><a class="brand" href="home.html">Textual Criticism</a><a href="witness.html">Witnesses</a><a href="guide.html">Guides</a><a href="#">Background</a></div></header>'
    if kind == "home":
        b = f'<h1>Textual Criticism</h1>{HOME_INTRO}<div class="idx"><section><h2>Witnesses</h2>{wlist()}</section><section><h2>Guides</h2>{glist()}</section><section><h2>Background</h2>{blist()}<h2>Start here</h2><ol class="steps"><li>Read an apparatus entry</li><li>Look up each witness</li><li>Weigh the evidence</li><li>Check your text policy</li></ol></section></div>'
    elif kind == "witness":
        b = f'<div class="split"><aside class="rail"><p class="bigsig">B</p><h1>Codex Vaticanus</h1><p class="label">GA 03 · majuscule</p>{W_FACTS}{W_BOOKS}</aside><div class="body"><p class="lead">{W_LEAD}</p>{W_PROSE}{W_CONTESTED}<h2>Key places in the apparatus</h2>{W_UNITS}<h2>Images</h2>{W_IMAGE}<h2>Links</h2>{W_LINKS}<h2>Sources</h2>{W_SOURCES}</div></div>'
    else:
        b = f'<div class="split"><aside class="rail"><p class="label">Guide</p><h1>Weighing the evidence</h1><p class="small">The order editors work in:</p><ol class="steps"><li>Age of the earliest witness</li><li>Where it comes from</li><li>How carefully copied</li><li>How widespread</li><li>Independence</li><li>Number, last of all</li><li>Then the wording: scribe, then author</li></ol><p class="label">On this page</p>{toc()}</aside><div class="body">{GUIDE_BODY}</div></div>'
    return top + f'<main class="page">{b}</main>'
DIRS["3-spec-sheet"] = ("Spec sheet", CSS3, f3)

# 4 ---------------------------------------------------------------- Index desk (dense home + wide tables)
CSS4 = """
.top{border-bottom:2px solid var(--ink);max-width:90rem;margin:0 auto;padding:.75rem 16px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:.5rem;align-items:baseline;font-family:var(--sans)}
.top nav a{margin-left:1rem;font-size:.9rem}.find{font:1rem var(--sans);padding:.45rem .6rem;border:1px solid var(--rule);background:var(--paper-2);color:var(--ink);width:100%;max-width:26rem;border-radius:3px}
.page{max-width:90rem;margin:0 auto;padding:1.25rem 16px 3rem}
.desk{display:grid;gap:1.5rem}.panel{border-top:3px solid var(--ink);padding-top:.4rem}.panel h2{margin-top:0;font-size:1.05rem;font-family:var(--sans)}
@media(min-width:760px){.desk{grid-template-columns:1fr 1fr}}@media(min-width:1150px){.desk{grid-template-columns:2fr 1fr 1fr}}
.wt td:first-child{white-space:nowrap}.wt .siglum{font-size:1.1rem}
.read{max-width:44rem}.wide{max-width:none}
.gl2{display:grid;gap:1.5rem}@media(min-width:1100px){.gl2{grid-template-columns:minmax(0,44rem) minmax(0,1fr);gap:3rem}.gl2 .rules{grid-template-columns:1fr 1fr}}
"""
WT = '<div class="scroll"><table class="wt"><thead><tr><th>Siglum</th><th>Witness</th><th>Date</th><th>Contents</th></tr></thead><tbody>' + "".join(f'<tr><td>{s}</td><td><a href="witness.html">{d}</a></td><td>{t}</td><td class="small muted">{c}</td></tr>' for (s, d, t), c in zip(WITNESSES, ["Gospels, Acts","Paul","John","Luke, John","whole NT","whole NT","eap (gaps)","Gospels, Acts","all"])) + "</tbody></table></div>"
def f4(kind):
    top = '<header class="top"><a class="brand" href="home.html">Textual Criticism</a><nav><a href="witness.html">Witnesses</a><a href="guide.html">Guides</a><a href="#">Background</a></nav></header>'
    if kind == "home":
        b = f'<div class="read">{HOME_INTRO}<input class="find" type="search" placeholder="Find a witness: B, 03, Vaticanus, 𝔓75…" aria-label="Find a witness"></div><div class="desk" style="margin-top:1.5rem"><section class="panel"><h2>Witnesses</h2>{WT}</section><section class="panel"><h2>Guides</h2>{glist()}</section><section class="panel"><h2>Background</h2>{blist()}</section></div>'
    elif kind == "witness":
        b = f'<p class="label">Greek manuscript · majuscule</p><h1><span class="siglum">B</span> 03 · Codex Vaticanus</h1><div class="desk"><section class="panel" style="grid-column:1/-1"><h2>At a glance</h2><div class="gl2"><div>{W_FACTS}</div><div>{W_BOOKS}</div></div></section><section class="panel"><h2>About</h2><p class="lead">{W_LEAD}</p>{W_PROSE}{W_CONTESTED}</section><section class="panel"><h2>Key places</h2>{W_UNITS}<h2>Images</h2>{W_IMAGE}</section><section class="panel"><h2>Links</h2>{W_LINKS}<h2>Sources</h2>{W_SOURCES}</section></div>'
    else:
        b = f'<p class="label">Guide</p><h1>Weighing the evidence</h1><div class="gl2"><div>{G["lead"]}{G["twin1"]}{G["ext"]}{G["count"]}{G["int"]}</div><div>{G["rules"]}</div></div><div class="wide">{G["example"]}</div><div class="read">{G["src"]}</div>'
    return top + f'<main class="page">{b}</main>'
DIRS["4-index-desk"] = ("Index desk", CSS4, f4)

# 5 ---------------------------------------------------------------- Lookup pane (master–detail)
CSS5 = """
.top{border-bottom:1px solid var(--rule);padding:.6rem 16px;display:flex;gap:1.25rem;flex-wrap:wrap;align-items:baseline;font-family:var(--sans)}.top a{font-size:.9rem}
.app{display:grid}.list{border-bottom:1px solid var(--rule);padding:.75rem 16px;background:var(--paper-2)}
.list .wlist li{grid-template-columns:4.5rem 1fr}.list .d{display:none}.list li.on{background:var(--paper);box-shadow:inset 3px 0 var(--rubric);padding-left:.4rem}
.list details summary{font:600 .9rem var(--sans);cursor:pointer}
.detail{padding:1.25rem 16px 3rem;min-width:0}.detail .cols{display:grid;gap:1.5rem}
.tabs{display:flex;gap:1rem;font:.9rem var(--sans);border-bottom:1px solid var(--rule);margin-bottom:1rem;overflow-x:auto}.tabs a{padding:.4rem 0;white-space:nowrap}.tabs a.on{color:var(--ink);font-weight:600;box-shadow:inset 0 -2px var(--rubric);text-decoration:none}
@media(min-width:900px){.app{grid-template-columns:19rem minmax(0,1fr);min-height:calc(100vh - 5rem)}.list{border-bottom:0;border-right:1px solid var(--rule);position:sticky;top:0;height:100vh;overflow:auto}.list details{display:contents}.list summary{display:none}
.detail{padding:1.5rem 2.5rem 3rem}.detail .cols{grid-template-columns:minmax(0,40rem) minmax(0,18rem);gap:3rem}}
.jump{position:sticky;top:0;background:var(--paper);z-index:1}
"""
def f5(kind):
    top = '<header class="top"><a class="brand" href="home.html">Textual Criticism</a><a href="witness.html">Witnesses</a><a href="guide.html">Guides</a><a href="#">Background</a></header>'
    if kind == "home":
        lst = f'<aside class="list"><details open><summary>All witnesses</summary><p class="label">Witnesses</p>{wlist()}<p class="label" style="margin-top:1rem">Guides</p>{glist()}</details></aside>'
        d = f'<h1>Textual Criticism</h1>{HOME_INTRO}<div class="cols"><div><h2>Start with a question</h2><ul class="glist"><li><a href="#">What does this siglum mean?</a><p>Pick it from the list.</p></li><li><a href="guide.html">Which reading should we translate?</a><p>Weighing the evidence.</p></li><li><a href="#">Does this variant matter for us?</a><p>Which variants matter.</p></li></ul></div><div><h2>Background</h2>{blist()}</div></div>'
    elif kind == "witness":
        lst = '<aside class="list"><details><summary>All witnesses (9)</summary>' + wlist().replace('<li><span class="siglum">B</span> 03', '<li class="on"><span class="siglum">B</span> 03') + '</details></aside>'
        d = f'<p class="label">Greek manuscript · majuscule</p><h1><span class="siglum">B</span> 03 · Codex Vaticanus</h1><nav class="tabs"><a class="on" href="#">Overview</a><a href="#">Contents</a><a href="#">In the apparatus</a><a href="#">Sources</a></nav><div class="cols"><div><p class="lead">{W_LEAD}</p>{W_PROSE}<h2>Key places</h2>{W_UNITS}{W_IMAGE}</div><div>{W_FACTS}{W_BOOKS}{W_CONTESTED}<h2>Links</h2>{W_LINKS}</div></div>'
    else:
        lst = f'<aside class="list"><details><summary>All guides</summary><p class="label">Guides</p>{glist().replace("<li><a href=\"guide.html\">Weighing", "<li class=on><a href=\"guide.html\">Weighing")}</details></aside>'
        d = f'<p class="label">Guide</p><h1>Weighing the evidence</h1><nav class="tabs jump">' + "".join(f'<a href="#{i}">{t}</a>' for i, t in TOC) + f'</nav><div class="cols"><div>{GUIDE_BODY}</div><div><p class="label">Witnesses on this page</p>{wlist()}</div></div>'
    return top + f'<div class="app">{lst}<main class="detail">{d}</main></div>'
DIRS["5-lookup-pane"] = ("Lookup pane", CSS5, f5)

for slug, (name, css, fn) in DIRS.items():
    d = ROOT / slug
    d.mkdir(exist_ok=True)
    for kind, title in [("home", "Home"), ("witness", "Codex Vaticanus"), ("guide", "Weighing the evidence")]:
        (d / f"{kind}.html").write_text(page(title, css, fn(kind), name), encoding="utf-8")
print("ok")
