// Collapse a witness's book-by-book contents into the five INTF groups (e a p c r).

export const GROUPS = [
  { key: 'e', label: 'Gospels', short: 'Gosp', books: ['Mt', 'Mk', 'Lk', 'Jn'] },
  { key: 'a', label: 'Acts', short: 'Acts', books: ['Ac'] },
  { key: 'p', label: 'Paul', short: 'Paul', books: ['Ro', '1Cor', '2Cor', 'Ga', 'Eph', 'Php', 'Col', '1Th', '2Th', '1Tm', '2Tm', 'Tt', 'Phm', 'He'] },
  { key: 'c', label: 'Catholic letters', short: 'Cath', books: ['Jas', '1Pe', '2Pe', '1Jn', '2Jn', '3Jn', 'Jd'] },
  { key: 'r', label: 'Revelation', short: 'Rev', books: ['Re'] },
] as const;

export type GroupState = 'on' | 'part' | 'off';
type Book = { book: string; status: 'complete' | 'partial' | 'fragment' | 'absent' };

/** 'on' when every listed book of the group is complete, 'part' when any text survives, else 'off'. */
export function coverage(contents: Book[] | undefined): Record<string, GroupState> | null {
  if (!contents?.length) return null;
  const out: Record<string, GroupState> = {};
  for (const g of GROUPS) {
    const rows = contents.filter((c) => (g.books as readonly string[]).includes(c.book));
    const present = rows.filter((r) => r.status !== 'absent');
    out[g.key] = !present.length ? 'off' : present.length === g.books.length && present.every((r) => r.status === 'complete') ? 'on' : 'part';
  }
  return out;
}
