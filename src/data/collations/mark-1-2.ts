// Mark 1:2 collation (CNTR, CC BY-SA 4.0).
import type { UnitDef } from '../../lib/collate';
import data from '../cntr/41001002.json';
import { witnessesFrom } from './witnesses';

export const verse = { ref: 'Mark 1:2', id: '41001002' };
export const data_ = data;
export const base: [string, string][] = [
  ['Καθὼς', 'as'], ['γέγραπται', 'it is written'], ['ἐν', 'in'], ['τῷ', 'the'], ['Ἠσαΐᾳ', 'Isaiah'], ['τῷ', 'the'], ['προφήτῃ', 'prophet'],
  ['Ἰδοὺ', 'look'], ['ἀποστέλλω', 'I send'], ['τὸν', 'the'], ['ἄγγελόν', 'messenger'], ['μου', 'my'],
  ['πρὸ', 'before'], ['προσώπου', 'face'], ['σου', 'your'], ['ὃς', 'who'], ['κατασκευάσει', 'will prepare'], ['τὴν', 'the'], ['ὁδόν', 'way'], ['σου', 'your'],
];
export const english = 'As it is written in Isaiah the prophet: “Look, I am sending my messenger ahead of you, who will prepare your way.”';
export const witnesses = witnessesFrom(data);
export const units: UnitDef[] = [
  { label: 'ἐν τῷ Ἠσαΐᾳ τῷ προφήτῃ', note: 'The main question', from: 2, to: 6, glosses: {
    'εν τω ησαια τω προφητη': 'in Isaiah the prophet', 'εν ησαια τω προφητη': 'in Isaiah the prophet', 'εν τοις προφηταις': 'in the prophets' } },
  // The added words repeat σου, so the unit covers “τὴν ὁδόν σου” to catch them wherever the aligner puts them.
  { label: 'τὴν ὁδόν σου', note: 'added words at the end', from: 17, to: 19, glosses: { 'την οδον σου': 'your way', 'την οδον σου εμπροσθεν σου': 'your way ahead of you' } },
];
export const phrases: [number, number][] = [[0, 2], [3, 6], [7, 11], [12, 15], [16, 19]];
export const glosses: Record<string, string> = { τοισ: 'the', προφηταισ: 'prophets', εγω: 'I', εμπροσθεν: 'ahead of' };
