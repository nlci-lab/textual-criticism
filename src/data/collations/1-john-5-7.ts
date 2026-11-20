// 1 John 5:7 and 5:8 collations (CNTR, CC BY-SA 4.0): the "Johannine comma".
import type { UnitDef } from '../../lib/collate';
import d7 from '../cntr/62005007.json';
import d8 from '../cntr/62005008.json';
import { witnessesFrom } from './witnesses';

export const v7 = {
  verse: { ref: '1 John 5:7', id: '62005007' }, data: d7, witnesses: witnessesFrom(d7),
  base: [['ὅτι', 'for'], ['τρεῖς', 'three'], ['εἰσιν', 'are'], ['οἱ', 'the ones'], ['μαρτυροῦντες', 'testifying']] as [string, string][],
  english: 'For there are three that testify:',
  units: [{ label: 'after “three that testify”', note: 'the comma, part 1', from: 5, to: 4, glosses: {
    'εν τω ουρανω ο πατηρ ο λογος και το αγιον πνευμα και ουτοι οι τρεις εν εισι': 'in heaven: the Father, the Word and the Holy Spirit; and these three are one' } }] as UnitDef[],
  phrases: [[0, 4]] as [number, number][],
  glosses: { ουρανω: 'heaven', πατηρ: 'Father', λογοσ: 'Word', πνευμα: 'Spirit', αγιον: 'Holy' } as Record<string, string>,
};
export const v8 = {
  verse: { ref: '1 John 5:8', id: '62005008' }, data: d8, witnesses: witnessesFrom(d8),
  base: [['τὸ', 'the'], ['πνεῦμα', 'Spirit'], ['καὶ', 'and'], ['τὸ', 'the'], ['ὕδωρ', 'water'], ['καὶ', 'and'], ['τὸ', 'the'], ['αἷμα', 'blood'],
    ['καὶ', 'and'], ['οἱ', 'the'], ['τρεῖς', 'three'], ['εἰς', 'into'], ['τὸ', 'the'], ['ἕν', 'one'], ['εἰσιν', 'are']] as [string, string][],
  english: 'the Spirit and the water and the blood; and the three agree.',
  units: [{ label: 'before “the Spirit”', note: 'the comma, part 2', from: 0, to: -1, glosses: {
    'και τρεις εισιν οι μαρτυρουντες εν τη γη': 'and there are three that testify on earth' } }] as UnitDef[],
  phrases: [[0, 4], [5, 9], [10, 14]] as [number, number][],
  glosses: { γη: 'earth', μαρτυρουντεσ: 'testifying', τρεισ: 'three' } as Record<string, string>,
};
