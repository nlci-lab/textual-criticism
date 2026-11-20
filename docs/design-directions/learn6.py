# Direction 6, part 2: the site's online course and micro modules.
# Run after build6.py (it imports and re-runs it): python docs/design-directions/learn6.py
from build6 import OUT, page

CSS_L = """
.mods{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(15rem,1fr);gap:1rem;overflow-x:auto;padding-bottom:.5rem}
.mod{display:grid;gap:.4rem;align-content:start;border:1px solid var(--rule);border-radius:8px;padding:1rem;color:var(--ink);text-decoration:none;background:var(--paper);position:relative}
.mod:hover{border-color:var(--ink-2)}.mod .v{font:600 1.35rem/1.1 var(--serif)}.mod .gk{font-size:1.05rem;color:var(--ink-2)}
.mod .ln{display:flex;justify-content:space-between;font:.8rem var(--sans);color:var(--ink-2);margin-top:.25rem}
.mod .done{position:absolute;top:.8rem;right:.8rem;font:600 .7rem var(--sans);color:var(--verdigris);border:1px solid currentColor;border-radius:999px;padding:.05rem .45rem}
.lessons{list-style:none;padding:0;margin:0;counter-reset:l}
.lessons li{counter-increment:l;display:grid;grid-template-columns:2.5rem 1fr auto;gap:.75rem;padding:1rem 0;border-top:1px solid var(--rule);align-items:start}
.lessons li::before{content:counter(l,decimal-leading-zero);font:600 1.3rem/1 var(--serif);color:var(--rubric)}
.lessons h3{margin:0 0 .2rem;font-size:1.1rem}.lessons p{margin:0;color:var(--ink-2);font-size:.95rem}
.lessons .uses{font:.8rem var(--sans);margin-top:.35rem}.lessons .st{font:.8rem var(--sans);white-space:nowrap;color:var(--ink-2)}
.lessons li.d .st,.mod .done{color:var(--verdigris)}
@media(prefers-color-scheme:dark){.lessons li.d .st,.mod .done{color:#7fc7b5}}
.prog{height:6px;background:var(--bar-none);border-radius:3px;overflow:hidden;margin:.75rem 0 .25rem;max-width:28rem}.prog i{display:block;height:100%;width:33%;background:var(--ink)}
.task{border:1.5px solid var(--ink);border-radius:10px;padding:1.25rem;margin:1.5rem 0}
.opts{display:grid;gap:.5rem;margin:1rem 0}.opts label{display:flex;gap:.6rem;align-items:baseline;border:1px solid var(--rule);border-radius:8px;padding:.7rem .9rem;cursor:pointer}
.opts input{accent-color:var(--rubric)}.opts label:has(input:checked){border-color:var(--ink);background:var(--paper-2)}
details.ans{border-top:1px solid var(--rule);margin-top:1rem;padding-top:.75rem}details.ans summary{font:600 .95rem var(--sans);cursor:pointer}
.steps2{display:flex;gap:.35rem;margin:.5rem 0 0;max-width:20rem}.steps2 i{flex:1;height:4px;border-radius:2px;background:var(--bar-none)}.steps2 i.on{background:var(--rubric)}
.cstrip{display:grid;gap:1.5rem;align-items:center}.cstrip .cover{width:10rem}
@media(min-width:700px){.cstrip{grid-template-columns:11rem 1fr}.cstrip .cover{width:100%}}
"""

MODS = [
 ("James 2:20", "ἀργή or νεκρά?", "Useless or dead: use the external and internal evidence to choose.", "8 min", "Weighing evidence", True),
 ("John 1:18", "θεός or υἱός?", "Read a full entry and name the earliest witness for each reading.", "10 min", "Reading the apparatus", False),
 ("Mark 16:9–20", "The longer ending", "What do B and א do here, and what should a footnote say?", "9 min", "Which variants matter", False),
 ("Luke 23:34a", "“Father, forgive them”", "Weigh an omission in early witnesses against its spread.", "7 min", "Weighing evidence", False),
 ("1 John 5:7–8", "The Johannine comma", "Why the Textus Receptus differs from UBS, and how to handle it.", "8 min", "Base texts", False),
]
def mod(m):
    v, gk, d, t, skill, done = m
    return (f'<a class="mod" href="module.html">{"<span class=done>Done</span>" if done else ""}<span class="label">Micro module</span>'
            f'<span class="v">{v}</span><span class="gk">{gk}</span><span class="small">{d}</span><span class="ln"><span>{t}</span><span>{skill}</span></span></a>')
MODROW = "".join(mod(m) for m in MODS)

COVER = '<a class="cover gall" href="course.html"><span class="k">Online course</span><span class="t">Introduction to Textual Criticism</span><span class="orn">𝔓</span></a>'
STRIP = f'''<section class="sec"><header><h2>Online course</h2><a href="course.html">Course page →</a></header>
<div class="cstrip">{COVER}<div><p class="lead" style="max-width:40rem">Six short lessons, from why there are variants to writing your project's text policy. Free, self-paced, no account.</p>
<div class="prog"><i></i></div><p class="small muted">You have finished 2 of 6 lessons on this device.</p>
<div class="act"><a class="btn p" href="course.html">Continue: Reading the apparatus</a></div></div></div></section>'''
PRACTICE = f'<section class="sec"><header><h2>Practise on one verse</h2><a href="course.html#practice">All micro modules →</a></header><div class="mods">{MODROW}</div></section>'

def inject(path):
    s = path.read_text(encoding="utf-8")
    path.write_text(s.replace("</style>", CSS_L + "</style>", 1), encoding="utf-8")

h = (OUT / "home.html").read_text(encoding="utf-8")
h = h.replace('<section class="sec"><header><h2>Guides and background', STRIP + PRACTICE + '<section class="sec"><header><h2>Guides and background', 1)
(OUT / "home.html").write_text(h, encoding="utf-8"); inject(OUT / "home.html")

LESSONS = [
 ("Why there are variants", "How copying by hand produced differences, and why that need not worry readers.", "Materials · The NT text", True),
 ("Manuscripts and their names", "Papyri, majuscules, minuscules, versions, fathers; how to read a siglum.", "Witness gallery · 𝔓⁶⁶ · B 03", True),
 ("Reading the apparatus", "Every part of a UBS entry, worked through at John 1:18.", "Reading the apparatus · module John 1:18", False),
 ("Weighing the evidence", "External and internal evidence, and the rules of thumb.", "Weighing the evidence · module James 2:20", False),
 ("Which variants matter", "When a variant changes the translation, and when it does not.", "Which variants matter · module Mark 16:9–20", False),
 ("Your project's text policy", "Choosing a base text and writing footnotes your readers can use.", "Base texts · Text policy", False),
]
lessons = "".join(f'<li class="{"d" if dn else ""}"><div><h3><a href="guide.html">{t}</a></h3><p>{d}</p><p class="uses">Uses: {u}</p></div><span class="st">{"✓ Done" if dn else "15 min"}</span></li>' for t, d, u, dn in LESSONS)

course = f"""<main class="wrap"><p class="crumbs"><a href="course.html">Learn</a> › Introduction to Textual Criticism</p>
<section class="book">{COVER}
<div><p class="label">Online course · free · self-paced</p><h1>Introduction to Textual Criticism</h1>
<p class="lead">For Bible translators and consultants who meet the UBS apparatus in their work. By the end you can read an entry, weigh the evidence, and explain your choice in a footnote.</p>
<dl class="spec-t"><dt>Lessons</dt><dd>6, about 15 minutes each</dd><dt>Practice</dt><dd>{len(MODS)} micro modules on single verses</dd><dt>You need</dt><dd>No Greek; Greek words are always glossed</dd><dt>Account</dt><dd>None. Progress is saved on this device only</dd><dt>Last checked</dt><dd>20 November 2026</dd></dl>
<div class="prog"><i></i></div><p class="small muted">2 of 6 lessons done</p>
<div class="act"><a class="btn p" href="guide.html">Continue with lesson 3</a><a class="btn s" href="#practice">Try a micro module</a></div></div>
<div class="box"><h2>You will be able to</h2><ul class="learn"><li>Find and read any UBS apparatus entry</li><li>Say what a siglum stands for and how old it is</li><li>Weigh external and internal evidence</li><li>Decide whether a variant needs a footnote</li><li>Explain your choice to a reviewer</li></ul></div></section>
<section class="sec" id="lessons" style="padding-top:0"><header><h2>Lessons</h2><span class="small muted">Each lesson links to the guides and witnesses it uses</span></header><ol class="lessons">{lessons}</ol></section>
<section class="sec" id="practice"><header><h2>Micro modules</h2><span class="small muted">Each one stands alone</span></header><div class="mods">{MODROW}</div></section></main>"""
(OUT / "course.html").write_text(page("Introduction to Textual Criticism", course, "Learn"), encoding="utf-8"); inject(OUT / "course.html")

module = f"""<main class="wrap" style="max-width:52rem"><p class="crumbs"><a href="course.html#practice">Micro modules</a> › James 2:20</p>
<p class="label" style="margin-top:1.5rem">Micro module · 8 min · step 2 of 3</p><div class="steps2"><i class="on"></i><i class="on"></i><i></i></div>
<h1 style="margin-top:1rem">James 2:20: <span lang="grc">ἀργή</span> or <span lang="grc">νεκρά</span>?</h1>
<p class="lead">Faith without works is “useless” in some Bibles and “dead” in others. Look at the entry and decide which reading came first.</p>
<div class="scroll"><table><thead><tr><th>Reading</th><th>Some witnesses</th><th>Earliest</th></tr></thead><tbody>
<tr><td><span lang="grc">ἀργή</span> <span class="gl">“useless”</span></td><td><a href="witness.html">B</a>, C*, 1739, some Latin, Sahidic Coptic</td><td>4th c.</td></tr>
<tr><td><span lang="grc">νεκρά</span> <span class="gl">“dead”</span></td><td><span class="siglum" lang="he" dir="ltr">א</span>, A, C², Byz, Syriac</td><td>4th c.</td></tr>
<tr><td><span lang="grc">κενή</span> <span class="gl">“empty”</span></td><td><span class="siglum">𝔓⁷⁴</span>, one Latin manuscript</td><td>7th c.</td></tr></tbody></table></div>
<div class="task"><p class="label">Question</p><p style="font-weight:600;font-size:1.15rem">The external evidence is close. Which clue best explains how “dead” could arise from “useless”?</p>
<div class="opts"><label><input type="radio" name="a"> “Dead” has many more manuscripts.</label>
<label><input type="radio" name="a" checked> Verses 17 and 26 both say “dead”, so a scribe could repeat it in verse 20.</label>
<label><input type="radio" name="a"> “Useless” is the shorter reading.</label></div>
<details class="ans" open><summary>Check my answer</summary><p><b>Yes.</b> That is harmonization: a scribe makes one verse match its neighbours. Counting manuscripts is the weakest argument, and the words are the same length. See <a href="guide.html#rules">Rules of thumb</a>.</p></details></div>
<div class="act"><a class="btn s" href="#">← Step 1</a><a class="btn p" href="#">Step 3: What to tell your readers →</a></div>
<section class="sec"><header><h2>More micro modules</h2></header><div class="mods">{"".join(mod(m) for m in MODS[1:4])}</div></section></main>"""
(OUT / "module.html").write_text(page("James 2:20 micro module", module, "Learn"), encoding="utf-8"); inject(OUT / "module.html")
print("learn ok")
