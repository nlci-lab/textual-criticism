# Direction 6 "Catalogue": search-first home, witness gallery with filters, book-style guide landing.
# Run: python docs/design-directions/build6.py
import json, pathlib, contextlib, io
with contextlib.redirect_stdout(io.StringIO()):
    from build import TOKENS, W_LEAD, W_FACTS, W_BOOKS, W_UNITS, W_PROSE, W_IMAGE, W_LINKS, W_SOURCES, W_CONTESTED, GUIDE_BODY, TOC, toc

OUT = pathlib.Path(__file__).parent / "6-catalogue"
OUT.mkdir(exist_ok=True)

# Mock data for the gallery (dates/contents approximate; real site reads src/content/witnesses).
WIT = [
 # id, siglum, html siglum, name, type, century(sort), date label, groups, script sample
 ("p52","P52",'𝔓⁵²',"Rylands papyrus","papyrus",2,"2nd c.",["e"],"ΟΙΙΟΥΔΑΙΟΙ"),
 ("p46","P46",'𝔓⁴⁶',"Chester Beatty II","papyrus",3,"c. 200",["p"],"ΠΡΟΣΡΩΜΑΙΟΥΣ"),
 ("p64","P64",'𝔓⁶⁴',"Magdalen papyrus","papyrus",3,"c. 200",["e"],"ΚΑΤΑΜΑΘΘΑΙΟΝ"),
 ("p66","P66",'𝔓⁶⁶',"Bodmer II","papyrus",3,"c. 200",["e"],"ΕΝΑΡΧΗΗΝΟΛΟΓΟΣ"),
 ("p45","P45",'𝔓⁴⁵',"Chester Beatty I","papyrus",3,"3rd c.",["e","a"],"ΚΑΙΕΓΕΝΕΤΟ"),
 ("p47","P47",'𝔓⁴⁷',"Chester Beatty III","papyrus",3,"3rd c.",["r"],"ΑΠΟΚΑΛΥΨΙΣ"),
 ("p75","P75",'𝔓⁷⁵',"Bodmer XIV–XV","papyrus",3,"3rd c.",["e"],"ΕΥΑΓΓΕΛΙΟΝ"),
 ("p72","P72",'𝔓⁷²',"Bodmer VII–VIII","papyrus",4,"3rd–4th c.",["c"],"ΠΕΤΡΟΥΕΠΙΣΤΟΛΗ"),
 ("p115","P115",'𝔓¹¹⁵',"Oxyrhynchus 4499","papyrus",4,"3rd–4th c.",["r"],"ΧΙΣ"),
 ("sinaiticus","01",'<span lang="he" dir="ltr">א</span>',"Codex Sinaiticus","majuscule",4,"4th c.",["e","a","p","c","r"],"ΚΑΤΑΙΩΑΝΝΗΝ"),
 ("vaticanus","03",'B',"Codex Vaticanus","majuscule",4,"4th c.",["e","a","p","c"],"ΕΝΑΡΧΗΗΝΟΛΟΓΟΣ"),
 ("alexandrinus","02",'A',"Codex Alexandrinus","majuscule",5,"5th c.",["e","a","p","c","r"],"ΚΑΤΑΛΟΥΚΑΝ"),
 ("bezae","05",'D',"Codex Bezae","majuscule",5,"5th c.",["e","a"],"ΕΥΑΓΓΕΛΙΟΝ"),
 ("p74","P74",'𝔓⁷⁴',"Bodmer XVII","papyrus",7,"7th c.",["a","c"],"ΠΡΑΞΕΙΣ"),
 ("byz","Byz",'Byz',"Byzantine majority text","group",9,"9th c. on",["e","a","p","c","r"],"ΚΑΙΕΙΠΕΝ"),
]
GRP = [("e","Gospels"),("a","Acts"),("p","Paul"),("c","Catholic letters"),("r","Revelation")]

GUIDES = [
 ("apparatus","Reading the apparatus","Guide","lapis","What each part of a UBS entry means, worked through at John 1:18.","12 min","Start here",["John 1:18"]),
 ("weighing","Weighing the evidence","Guide","verdigris","How to judge between readings using external and internal evidence.","15 min","Start here",["James 2:20"]),
 ("which","Which variants matter","Guide","lapis","When a variant changes your translation, and when it does not.","8 min","Going further",[]),
 ("base","Base texts","Guide","verdigris","The UBS text, the Byzantine text and the Textus Receptus.","10 min","Going further",[]),
 ("policy","Text policy","Guide","lapis","Following the translation guidelines on variants.","6 min","Going further",[]),
 ("materials","Materials","Background","ochre","Papyrus, parchment, scrolls and codices.","9 min","Start here",[]),
 ("nt","The New Testament text","Background","ochre","How the text was copied, collected and printed.","14 min","Going further",[]),
]

CSS = """
:root{--ochre:#7a4f0e;--verdigris:#24594e;--lapis:#26406b;--gall:#2a2622;--on-pig:#fbf6ec;--chip:#e9e5de;--shadow:0 1px 0 var(--rule)}
@media(prefers-color-scheme:dark){:root{--ochre:#8f6526;--verdigris:#2f6e60;--lapis:#3a5788;--gall:#3a3530;--on-pig:#fbf6ec;--chip:#2a2d31}}
.top{display:flex;align-items:center;gap:1rem;padding:.7rem max(16px,3vw);border-bottom:1px solid var(--rule);font-family:var(--sans)}
.top{flex-wrap:wrap}.top nav{display:flex;gap:1.1rem;margin-left:auto;font-size:.9rem;overflow-x:auto}@media(max-width:520px){.top nav{margin-left:0;width:100%;gap:1.25rem}}.top nav a{color:var(--ink);text-decoration:none}.top nav a[aria-current]{color:var(--rubric);box-shadow:inset 0 -2px var(--rubric)}
.mark{font:600 1.05rem var(--serif);color:var(--ink);text-decoration:none;display:flex;gap:.5rem;align-items:center}
.mark i{font:normal 1.25rem var(--sigla);color:var(--rubric)}
.wrap{max-width:84rem;margin:0 auto;padding:0 max(16px,3vw)}
/* search */
.q{position:relative}.q input{width:100%;font:1.15rem var(--serif);padding:.95rem 1rem .95rem 3rem;border:1.5px solid var(--ink);border-radius:10px;background:var(--paper);color:var(--ink)}
.q input:focus{outline:3px solid color-mix(in srgb,var(--rubric) 35%,transparent);outline-offset:1px;border-color:var(--rubric)}
.q svg{position:absolute;left:1rem;top:50%;translate:0 -50%;width:1.2rem;stroke:var(--ink-2);fill:none;stroke-width:2}
.try{display:flex;flex-wrap:wrap;gap:.4rem;margin:.75rem 0 0;font:.875rem var(--sans);align-items:center}
.chipb{border:1px solid var(--rule);background:var(--chip);color:var(--ink);border-radius:999px;padding:.3rem .75rem;font:inherit;cursor:pointer}
.chipb[aria-pressed=true]{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.hero{padding:3.5rem 0 2rem;display:grid;gap:2rem}
.hero h1{font-size:clamp(1.9rem,4.5vw,3.1rem);letter-spacing:-.01em;max-width:18ch;margin:0}
.hero p.sub{color:var(--ink-2);max-width:40rem;font-size:1.1rem;margin:.75rem 0 1.5rem}
@media(min-width:1000px){.hero{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);align-items:end}}
.stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--ink);font-family:var(--sans)}
.stats div{padding:.75rem .5rem 0 0}.stats b{display:block;font:600 2rem/1 var(--serif)}.stats span{font-size:.8rem;color:var(--ink-2)}
/* concordance results */
.res{margin-top:1rem;border:1px solid var(--rule);border-radius:10px;background:var(--paper);overflow:hidden}
.res:empty{display:none}.res h3{font:600 .72rem var(--sans);letter-spacing:.07em;text-transform:uppercase;color:var(--ink-2);margin:0;padding:.6rem 1rem;background:var(--paper-2)}
.res a.r{display:grid;grid-template-columns:7.5rem 1fr;gap:.75rem;padding:.6rem 1rem;border-top:1px solid var(--rule);color:var(--ink);text-decoration:none}
.res a.r:hover{background:var(--paper-2)}.res .k{font:600 .9rem var(--sans);color:var(--rubric)}.res .ctx{font-size:.95rem}.res .ctx small{display:block;color:var(--ink-2);font:.8rem var(--sans)}
.res mark{background:color-mix(in srgb,var(--rubric) 18%,transparent);color:inherit;padding:0 .1em}
/* sections */
.sec{padding:2.5rem 0}.sec>header{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;margin-bottom:1rem;border-bottom:1px solid var(--rule);padding-bottom:.5rem}
.sec h2{margin:0;font-size:1.45rem}.sec header a{font:.9rem var(--sans)}
.rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(11.5rem,1fr);gap:1rem;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:.5rem}
.rail>*{scroll-snap-align:start}
/* specimen tile */
.tile{display:flex;flex-direction:column;border:1px solid var(--rule);border-radius:8px;overflow:hidden;background:var(--paper);color:var(--ink);text-decoration:none;transition:translate .15s}
.tile:hover{translate:0 -2px;border-color:var(--ink-2)}
.spec{position:relative;height:9.5rem;display:grid;place-items:center;overflow:hidden;border-bottom:1px solid var(--rule)}
.spec .sg{font:400 3.6rem/1 var(--sigla);color:var(--rubric);position:relative;z-index:1}
.spec .scr{position:absolute;left:-.25rem;right:-.25rem;bottom:.55rem;font:600 .82rem/1 var(--serif);letter-spacing:.32em;color:var(--ink);opacity:.38;white-space:nowrap;overflow:hidden}
.spec .scr+.scr{bottom:1.6rem;opacity:.22}
.papyrus .spec{background-color:#e8d9b5;background-image:repeating-linear-gradient(90deg,rgba(110,80,30,.10) 0 1px,transparent 1px 5px),repeating-linear-gradient(0deg,rgba(110,80,30,.08) 0 1px,transparent 1px 7px)}
.majuscule .spec{background-color:#efe7da;background-image:radial-gradient(rgba(90,70,40,.07) 1px,transparent 1.2px);background-size:6px 6px}
.group .spec{background:var(--paper-2)}
.papyrus .spec .scr,.majuscule .spec .scr{color:#2a2218}
@media(prefers-color-scheme:dark){.papyrus .spec{background-color:#3a3222}.majuscule .spec{background-color:#2e2b27}.papyrus .spec .scr,.majuscule .spec .scr{color:#e8dcc4}}
.meta{padding:.65rem .8rem .8rem;display:grid;gap:.3rem}.meta b{font-size:1.02rem;line-height:1.25}
.meta .ln{display:flex;justify-content:space-between;font:.8rem var(--sans);color:var(--ink-2)}
.cov{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;margin-top:.15rem}.cov i{height:5px;border-radius:1px;background:var(--bar-none)}.cov i.on{background:var(--bar-full)}
.covk{display:grid;grid-template-columns:repeat(5,1fr);font:.62rem var(--sans);color:var(--ink-2);gap:2px}
/* gallery */
.gal-head{padding:2rem 0 1rem;display:grid;gap:1rem}
.filters{display:grid;gap:.6rem;font:.875rem var(--sans);position:sticky;top:0;background:var(--paper);z-index:2;padding:.6rem 0;border-bottom:1px solid var(--rule)}
.frow{display:flex;gap:.4rem;overflow-x:auto;align-items:center;white-space:nowrap;padding-bottom:2px}.frow .label{min-width:5.5rem;margin:0}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem;padding:1.25rem 0 3rem}
@media(min-width:640px){.grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}}
@media(min-width:1000px){.grid{grid-template-columns:repeat(5,minmax(0,1fr))}.gal{display:grid;grid-template-columns:14rem minmax(0,1fr);gap:2rem}
.filters{position:sticky;top:1rem;align-self:start;border:0;padding:1rem 0}.frow{flex-wrap:wrap;overflow:visible}.frow .label{min-width:100%}}
@media(max-width:400px){.spec{height:7rem}.spec .sg{font-size:2.6rem}.meta b{font-size:.92rem}}
.count{font:.875rem var(--sans);color:var(--ink-2)}
/* covers */
.cover{aspect-ratio:3/4;border-radius:3px 8px 8px 3px;padding:1.1rem 1rem 1rem 1.5rem;display:flex;flex-direction:column;justify-content:space-between;color:var(--on-pig);text-decoration:none;position:relative;box-shadow:inset 6px 0 0 rgba(0,0,0,.18),0 1px 2px rgba(0,0,0,.15)}
.cover::after{content:"";position:absolute;inset:.45rem .45rem .45rem .85rem;border:1px solid rgba(251,246,236,.45);border-radius:2px;pointer-events:none}
.cover .k{font:600 .65rem var(--sans);letter-spacing:.12em;text-transform:uppercase;opacity:.85}
.cover .t{font:600 1.3rem/1.15 var(--serif);text-wrap:balance}.cover .orn{font:1.4rem var(--sigla);opacity:.8}
.ochre{background:var(--ochre)}.verdigris{background:var(--verdigris)}.lapis{background:var(--lapis)}.gall{background:var(--gall)}
.shelf{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(9.5rem,11rem);gap:1.25rem;overflow-x:auto;padding:.25rem 0 1rem}
.shelf figure{margin:0}.shelf figcaption{font:.8rem var(--sans);color:var(--ink-2);margin-top:.4rem}
/* book page */
.book{display:grid;gap:1.75rem;padding:2rem 0}.book .cover{max-width:15rem;width:62%}.book .cover .t{font-size:1.75rem}
@media(min-width:900px){.book{grid-template-columns:17rem minmax(0,1fr) 17rem;gap:2.5rem;align-items:start}.book .cover{width:100%;max-width:none}}
.book h1{font-size:clamp(1.8rem,3.4vw,2.6rem);margin:.2rem 0 .6rem}
.spec-t{display:grid;grid-template-columns:auto 1fr;gap:.35rem 1rem;font:.875rem var(--sans);margin:1rem 0;padding:1rem 0;border-block:1px solid var(--rule)}.spec-t dt{color:var(--ink-2)}.spec-t dd{margin:0}
.act{display:flex;gap:.6rem;flex-wrap:wrap}.btn{font:600 .95rem var(--sans);padding:.65rem 1.1rem;border-radius:8px;text-decoration:none;border:1.5px solid var(--ink)}
.btn.p{background:var(--ink);color:var(--paper)}.btn.s{color:var(--ink)}
.box{border:1px solid var(--rule);border-radius:8px;padding:1rem}.box h2{font-size:1rem;margin:0 0 .5rem;font-family:var(--sans)}
.learn{padding-left:1.1rem;margin:0}.learn li{margin:.3rem 0}
.read{display:grid;gap:2rem;border-top:1px solid var(--rule);padding:2rem 0 3rem}@media(min-width:1000px){.read{grid-template-columns:15rem minmax(0,44rem);gap:3.5rem}.read nav{position:sticky;top:1rem;align-self:start}}
.read nav .toc{font:.875rem/1.5 var(--sans);padding-left:1.1rem}
/* witness profile */
.prof{display:grid;gap:1.75rem;padding:2rem 0 3rem}.prof .tile{pointer-events:none}.prof .spec{height:13rem}.prof .spec .sg{font-size:5.5rem}
@media(min-width:900px){.prof{grid-template-columns:19rem minmax(0,42rem) minmax(0,1fr);gap:2.5rem}.prof>aside{position:sticky;top:1rem;align-self:start}}
.crumbs{font:.85rem var(--sans);color:var(--ink-2);padding-top:1.25rem}
.foot{border-top:1px solid var(--rule);padding:1.5rem max(16px,3vw);font:.85rem var(--sans);color:var(--ink-2)}
"""

def tile(w, big=False):
    id_, sg, hs, name, typ, c, dl, groups, scr = w
    cov = "".join(f'<i class="{"on" if g in groups else ""}" title="{n}"></i>' for g, n in GRP)
    num = f'<span class="small muted">{sg}</span>' if sg not in ("Byz",) and not sg.startswith("P") else ""
    return (f'<a class="tile {typ}" href="witness.html" data-type="{typ}" data-c="{c}" data-g="{" ".join(groups)}" '
            f'data-s="{sg.lower()} {id_} {name.lower()}"><div class="spec"><span class="scr">{scr*3}</span><span class="scr">{scr[::-1]*3}</span>'
            f'<span class="sg">{hs}</span></div><div class="meta"><b>{name}</b><div class="ln"><span>{dl}</span><span>{typ if typ!="group" else "text group"}{" · "+sg if sg[0].isdigit() else ""}</span></div>'
            f'<div class="cov" aria-label="Contents: {", ".join(n for g,n in GRP if g in groups)}">{cov}</div></div></a>')

def cover(g, href="guide.html"):
    id_, t, k, pig, d, rt, lvl, _ = g
    return f'<a class="cover {pig}" href="{href}"><span class="k">{k}</span><span class="t">{t}</span><span class="orn">§</span></a>'

SEARCH_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>'

# Concordance index: every entry is (key, kind, title, context, href). Verse refs point into pages.
IDX = [
 ("john 1:18","Verse","John 1:18","Apparatus guide worked example; μονογενὴς θεός vs ὁ μονογενὴς υἱός","#"),
 ("john 1:18","Verse","John 1:18","Codex Vaticanus reads μονογενὴς θεός with 𝔓⁶⁶ and א*","witness.html"),
 ("john 1:18","Verse","John 1:18","𝔓⁶⁶ (Bodmer II) supports θεός","witness.html"),
 ("james 2:20","Verse","James 2:20","Weighing the evidence: ἀργή “useless” vs νεκρά “dead”","guide.html#example"),
 ("mark 16:9-20","Verse","Mark 16:9–20","Vaticanus ends Mark at 16:8 but leaves a blank column","witness.html"),
 ("mark 16:9-20","Verse","Mark 16:9–20","Sinaiticus also ends at 16:8","witness.html"),
 ("luke 23:34","Verse","Luke 23:34a","Vaticanus lacks “Father, forgive them…”","witness.html"),
 ("harder reading lectio difficilior","Idea","The harder reading","Rule of thumb in Weighing the evidence","guide.html#rules"),
 ("shorter reading","Idea","The shorter reading","Rule of thumb in Weighing the evidence","guide.html#rules"),
 ("harmonization","Idea","Harmonization","Rule of thumb; see James 2:20","guide.html#rules"),
 ("cbgm coherence","Idea","CBGM","How the CBGM changes the picture","guide.html"),
 ("rating {a} {b} {c} {d} letter","Idea","UBS ratings {A}–{D}","Reading the apparatus","#"),
] + [(f"{w[1].lower()} {w[0]} {w[3].lower()} {'byzantine majority' if w[0]=='byz' else ''}","Witness",w[3],f"{w[1]} · {w[6]} · {w[4]}","witness.html") for w in WIT] \
  + [(f"{g[1].lower()} {g[4].lower()}",g[2],g[1],g[4],"guide.html") for g in GUIDES]

JS_SEARCH = """<script>
(()=>{const IDX=%s;
const sup={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
const norm=s=>s.toLowerCase().replace(/[⁰-⁹]/g,c=>sup[c]||c).replace(/𝔓\\s*/g,'p').replace(/\\bp\\s+(\\d)/g,'p$1')
 .replace(/[–—]/g,'-').replace(/\\bjn\\b|\\bjoh\\b/g,'john').replace(/\\bmk\\b/g,'mark').replace(/\\blk\\b/g,'luke').replace(/\\bjas\\b|\\bjm\\b/g,'james').replace(/\\s+/g,' ').trim();
const inp=document.getElementById('q'),out=document.getElementById('res');
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function run(){const q=norm(inp.value);if(!q){out.innerHTML='';return}
 const hits=IDX.filter(e=>norm(e[0]+' '+e[2]).includes(q)||q.split(' ').every(t=>norm(e[0]+' '+e[2]+' '+e[3]).includes(t)));
 if(!hits.length){out.innerHTML='<h3>No matches</h3><p style="padding:.6rem 1rem;margin:0">Try a verse (John 1:18), a siglum (B, 03, P66) or an idea (harder reading).</p>';return}
 const groups={};hits.forEach(h=>(groups[h[1]]=groups[h[1]]||[]).push(h));
 out.innerHTML=Object.entries(groups).map(([k,v])=>'<h3>'+k+(k=='Verse'?' — every place it is discussed':'')+'</h3>'+v.slice(0,6).map(h=>'<a class="r" href="'+h[4]+'"><span class="k">'+esc(h[2])+'</span><span class="ctx">'+esc(h[3])+'</span></a>').join('')).join('');}
inp.addEventListener('input',run);
document.querySelectorAll('[data-try]').forEach(b=>b.addEventListener('click',()=>{inp.value=b.dataset.try;run();inp.focus()}));
if(inp.value)run();})();
</script>"""

def page(title, body, cur, extra=""):
    nav = "".join(f'<a href="{h}"{" aria-current=page" if n==cur else ""}>{n}</a>' for n, h in [("Learn","course.html"),("Witnesses","witnesses.html"),("Guides","guide.html"),("Background","guide.html")])
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>{title} · Textual Criticism (Catalogue)</title><style>{TOKENS}{CSS}</style></head><body>
<div class="uc">Under construction: content is being checked.</div>
<header class="top"><a class="mark" href="home.html"><i>𝔓</i>Textual Criticism</a><nav>{nav}</nav></header>{body}
<footer class="foot">An introduction for Bible translators and consultants. Sources are given on every page.</footer>{extra}</body></html>"""

# HOME ---------------------------------------------------------------
tries = ["John 1:18", "𝔓⁶⁶", "03", "Byz", "James 2:20", "harder reading"]
home = f"""<main class="wrap">
<section class="hero"><div><p class="label">New Testament manuscripts, for translators</p>
<h1>Look up any witness, verse or idea in the apparatus.</h1>
<p class="sub">Type what you see in the UBS apparatus: a siglum, a verse, or a term. Results show every place the site discusses it.</p>
<div class="q">{SEARCH_SVG}<input id="q" type="search" value="John 1:18" placeholder="John 1:18, 𝔓⁶⁶, B, harder reading…" aria-label="Search witnesses, verses and ideas" autocomplete="off"></div>
<div class="try"><span class="muted">Try</span>{"".join(f'<button class="chipb" data-try="{t}">{t}</button>' for t in tries)}</div>
<div id="res" class="res" aria-live="polite"></div></div>
<div class="stats"><div><b>{len(WIT)}</b><span>witnesses profiled</span></div><div><b>{sum(1 for g in GUIDES if g[2]=="Guide")}</b><span>guides</span></div><div><b>2027</b><span>Old Testament pages</span></div></div>
</section>
<section class="sec"><header><h2>Witnesses</h2><a href="witnesses.html">All {len(WIT)} with filters →</a></header>
<div class="rail">{"".join(tile(w) for w in WIT[:9])}</div></section>
<section class="sec"><header><h2>Guides and background</h2><a href="guide.html">All →</a></header>
<div class="shelf">{"".join(f'<figure>{cover(g)}<figcaption>{g[5]} · {g[6]}</figcaption></figure>' for g in GUIDES)}</div></section>
</main>"""
(OUT / "home.html").write_text(page("Home", home, "", JS_SEARCH % json.dumps(IDX, ensure_ascii=False)), encoding="utf-8")

# WITNESS GALLERY ----------------------------------------------------
JS_FILTER = """<script>
(()=>{const st={type:'all',g:'all',c:'all'};const tiles=[...document.querySelectorAll('.grid .tile')];const q=document.getElementById('wq');const n=document.getElementById('n');
const sup={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
const norm=s=>s.toLowerCase().replace(/[⁰-⁹]/g,c=>sup[c]).replace(/𝔓\\s*/g,'p').trim();
function apply(){let k=0;const t=norm(q.value);tiles.forEach(el=>{const c=+el.dataset.c;
 const ok=(st.type=='all'||el.dataset.type==st.type)&&(st.g=='all'||el.dataset.g.split(' ').includes(st.g))&&
 (st.c=='all'||(st.c=='early'&&c<=3)||(st.c=='4-5'&&c>=4&&c<=5)||(st.c=='late'&&c>5))&&(!t||el.dataset.s.includes(t));
 el.hidden=!ok;k+=ok});n.textContent=k+' of '+tiles.length;}
document.querySelectorAll('[data-f]').forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.f;st[f]=b.dataset.v;
 document.querySelectorAll('[data-f="'+f+'"]').forEach(x=>x.setAttribute('aria-pressed',x===b));apply()}));
q.addEventListener('input',apply);apply();})();
</script>"""
def chips(f, opts):
    return "".join(f'<button class="chipb" data-f="{f}" data-v="{v}" aria-pressed="{str(i==0).lower()}">{l}</button>' for i, (v, l) in enumerate(opts))
gal = f"""<main class="wrap"><div class="gal-head"><div><p class="label">Witnesses</p><h1>Manuscripts and text groups</h1>
<p class="muted" style="max-width:40rem">Every witness the site profiles. Filter by kind, date or the books it contains; tap a card for the full profile.</p></div>
<div class="q">{SEARCH_SVG}<input id="wq" type="search" placeholder="Siglum, number or name: B, 03, 𝔓75, Bezae" aria-label="Find a witness"></div></div>
<div class="gal"><div class="filters" role="group" aria-label="Filters">
<div class="frow"><p class="label">Kind</p>{chips("type",[("all","All"),("papyrus","Papyri"),("majuscule","Majuscules"),("minuscule","Minuscules"),("version","Versions"),("group","Text groups")])}</div>
<div class="frow"><p class="label">Date</p>{chips("c",[("all","Any"),("early","Before 300"),("4-5","4th–5th c."),("late","Later")])}</div>
<div class="frow"><p class="label">Contains</p>{chips("g",[("all","Any")]+GRP)}</div>
<p class="count" style="margin:.25rem 0 0">Showing <span id="n"></span></p></div>
<div class="grid">{"".join(tile(w) for w in WIT)}</div></div></main>"""
(OUT / "witnesses.html").write_text(page("Witnesses", gal, "Witnesses", JS_FILTER), encoding="utf-8")

# WITNESS PROFILE ----------------------------------------------------
vat = [w for w in WIT if w[0] == "vaticanus"][0]
rel = [w for w in WIT if w[0] in ("p75", "sinaiticus", "p66", "alexandrinus")]
prof = f"""<main class="wrap"><p class="crumbs"><a href="witnesses.html">Witnesses</a> › Majuscules › B 03</p>
<div class="prof"><aside>{tile(vat)}<div style="margin-top:1rem">{W_FACTS}{W_BOOKS}</div></aside>
<article><p class="label">Greek manuscript · majuscule · GA 03</p><h1 style="font-size:clamp(1.9rem,3.6vw,2.6rem)">Codex Vaticanus</h1><p class="lead">{W_LEAD}</p>{W_PROSE}{W_CONTESTED}
<h2>Key places in the apparatus</h2>{W_UNITS}<h2>Images</h2>{W_IMAGE}<h2>Sources</h2>{W_SOURCES}</article>
<aside><div class="box"><h2>Links</h2>{W_LINKS}</div><h2 style="font-size:1rem;font-family:var(--sans)">Often cited with B</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem">{"".join(tile(w) for w in rel)}</div></aside></div></main>"""
(OUT / "witness.html").write_text(page("Codex Vaticanus", prof, "Witnesses"), encoding="utf-8")

# GUIDE (book page + reading view) -----------------------------------
g = GUIDES[1]
guide = f"""<main class="wrap"><p class="crumbs"><a href="guide.html">Guides</a> › Weighing the evidence</p>
<section class="book">{cover(g, "#read")}
<div><p class="label">Guide · {g[6]}</p><h1>{g[1]}</h1><p class="lead">{g[4]} After you have read an apparatus entry, this is how you decide.</p>
<dl class="spec-t"><dt>Reading time</dt><dd>{g[5]}</dd><dt>Level</dt><dd>{g[6]}; read <a href="#">Reading the apparatus</a> first</dd><dt>Worked example</dt><dd>James 2:20, <span lang="grc">ἀργή</span> or <span lang="grc">νεκρά</span></dd><dt>Sources</dt><dd>6, incl. Metzger and Omanson</dd><dt>Last checked</dt><dd>20 November 2026</dd></dl>
<div class="act"><a class="btn p" href="#read">Read the guide</a><a class="btn s" href="#example">Jump to the example</a></div></div>
<div class="box"><h2>What you will learn</h2><ul class="learn"><li>The six questions editors ask about witnesses</li><li>Why counting manuscripts misleads</li><li>Scribal habits vs the author's style</li><li>Four rules of thumb, and their limits</li><li>How the CBGM changes the picture</li></ul></div></section>
<section class="sec" style="padding-top:0"><header><h2>Related</h2></header><div class="shelf">{"".join(f'<figure>{cover(x)}<figcaption>{x[5]} · {x[6]}</figcaption></figure>' for x in GUIDES if x[0]!=g[0])}</div></section>
<section class="read" id="read"><nav><p class="label">Contents</p>{toc()}</nav><article>{GUIDE_BODY}</article></section></main>"""
(OUT / "guide.html").write_text(page("Weighing the evidence", guide, "Guides"), encoding="utf-8")
print("ok")
