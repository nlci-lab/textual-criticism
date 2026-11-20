// Run: node scripts/translit-test.mjs  (Node 22.6+ strips the types from src/lib/translit.ts)
import { translit, translitMs } from '../src/lib/translit.ts';

const cases = [
  ['θεὸν', 'theon'], ['οὐδεὶς', 'oudeis'], ['ἑώρακεν', 'heōraken'], ['ὁ', 'ho'], ['ὢν', 'ōn'],
  ['υἱός', 'huios'], ['ἐξηγήσατο', 'exēgēsato'], ['ἄγγελος', 'angelos'], ['Ἰησοῦς', 'Iēsous'],
  ['μονογενὴς', 'monogenēs'], ['θεὸς', 'theos'], ['κόλπον', 'kolpon'], ['πατρὸς', 'patros'],
  ['ἐκεῖνος', 'ekeinos'], ['πώποτε', 'pōpote'], ['εὐαγγέλιον', 'euangelion'], ['ἀγκύρα', 'ankyra'],
  ['σφίγξ', 'sphinx'], ['ταραχὴ', 'tarachē'], ['ῥῆμα', 'rhēma'], ['τῷ', 'tōi'], ['αἷμα', 'haima'],
  ['ψυχή', 'psychē'], ['Χριστός', 'Christos'], ['ηὔξανεν', 'ēuxanen'], ['εἰς τὸν κόλπον', 'eis ton kolpon'],
  ['Ὁ λόγος', 'Ho logos'], ['ἐλέγχω', 'elenchō'], ['οἷος', 'hoios'], ['ϲοφια', 'sophia'],
  ['πώποτε· μονογενὴς', 'pōpote· monogenēs'], ['ΘΕΟϹ', 'Theos'],
];
const ms = [[['θεοσ'], 'theos'], [['ων', 'ὢν'], 'ōn'], [['ο', 'ὁ'], 'ho'], [['υιοσ'], 'huios'], [['εωρακεν', 'ἑώρακεν'], 'heōraken']];

let bad = 0;
for (const [g, want] of cases) { const got = translit(g); if (got !== want) { bad++; console.log(`FAIL ${g}: ${got} != ${want}`); } }
for (const [[n, b], want] of ms) { const got = translitMs(n, b); if (got !== want) { bad++; console.log(`FAIL ms ${n}/${b}: ${got} != ${want}`); } }
const total = cases.length + ms.length;
console.log(`${total - bad}/${total} passed`);
process.exit(bad ? 1 : 0);
