import { LIVROS } from '../data/books.ts';
import { biblePassageHref } from './bible-links.ts';

export type ScriptureCitation = { start: number; end: number; href: string; kind: 'reference' | 'quote' };
const abbreviations = [
  'Gn', 'Ex|Êx', 'Lv', 'Nm', 'Dt', 'Js', 'Jz', 'Rt', '1 Sm', '2 Sm', '1 Rs', '2 Rs', '1 Cr', '2 Cr', 'Ed', 'Ne', 'Et', 'Jó|Job', 'Sl|Salmo', 'Pv|Pr', 'Ec', 'Ct', 'Is', 'Jr', 'Lm', 'Ez', 'Dn', 'Os', 'Jl', 'Am', 'Ob', 'Jn', 'Mq', 'Na', 'Hc', 'Sf', 'Ag', 'Zc', 'Ml',
  'Mt', 'Mc', 'Lc', 'Jo', 'At', 'Rm', '1 Co', '2 Co', 'Gl', 'Ef', 'Fp', 'Cl', '1 Ts', '2 Ts', '1 Tm', '2 Tm', 'Tt', 'Fm', 'Hb', 'Tg', '1 Pe', '2 Pe', '1 Jo', '2 Jo', '3 Jo', 'Jd', 'Ap',
];
const aliases = new Map<string, number>();
const key = (value: string) => value.replace(/\s+/g, '').toLocaleLowerCase('pt-BR');
LIVROS.forEach((book, index) => {
  const names = [book.nome, ...abbreviations[index].split('|')];
  // “Jó” e “Jo” indicam livros diferentes; não elimina esse acento.
  if (book.nome !== 'Jó') names.push(book.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  for (const name of names) aliases.set(key(name), index);
});
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const bookPattern = [...aliases.keys()].sort((a, b) => b.length - a.length).map(name => escape(name).replace(/^(\d)/, '$1\\s*')).join('|');
const startsNewBook = new RegExp(`^\\s*[;,]\\s*(?:${bookPattern})\\.?\\s+\\d+`, 'iu');

export function findScriptureCitations(text: string): ScriptureCitation[] {
  const references: ScriptureCitation[] = [];
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${bookPattern})\\.?\\s+(\\d+)(?::(\\d+)(?:\\s*[–—-]\\s*(\\d+))?)?(?:\\s*[–—-]\\s*(\\d+))?(?!\\d)`, 'giu');
  let previousBook = -1;
  let previousChapter = 0;
  let end = 0;
  const add = (start: number, finish: number, book: number, chapter: number, verse: number, last: number) => {
    if (!LIVROS[book] || chapter < 1 || chapter > LIVROS[book].caps || verse < 1 || verse > 176 || last < verse || last > 176) return false;
    references.push({ start, end: finish, href: biblePassageHref({ livro: book, capitulo: chapter, versiculo: verse, ate: last }), kind: 'reference' });
    return true;
  };
  const continuations = (start: number, book: number, chapter: number, hasVerse: boolean) => {
    let finish = start;
    while (true) {
      if (startsNewBook.test(text.slice(finish))) break;
      const match = text.slice(finish).match(/^(\s*[;,]\s*)(\d+)(?::(\d+))?(?:\s*[–—-]\s*(\d+))?(?![\d:])/);
      if (!match) break;
      const startNumber = Number(match[2]);
      const newChapter = match[3] ? startNumber : hasVerse && match[1].includes(',') ? chapter : startNumber;
      const verse = match[3] ? Number(match[3]) : hasVerse && match[1].includes(',') ? startNumber : 1;
      const last = match[4] && (match[3] || hasVerse && match[1].includes(',')) ? Number(match[4]) : verse;
      if (!add(finish + match[1].length, finish + match[0].length, book, newChapter, verse, last)) break;
      chapter = newChapter;
      hasVerse = Boolean(match[3]) || hasVerse && match[1].includes(',');
      finish += match[0].length;
    }
    return finish;
  };
  for (const match of text.matchAll(pattern)) {
    const start = match.index;
    if (start < end) continue;
    previousBook = aliases.get(key(match[1]))!;
    previousChapter = Number(match[2]);
    const verse = match[3] ? Number(match[3]) : 1;
    if (!add(start, start + match[0].length, previousBook, previousChapter, verse, match[4] ? Number(match[4]) : verse)) continue;
    end = continuations(start + match[0].length, previousBook, previousChapter, Boolean(match[3]));
  }
  const result: ScriptureCitation[] = [];
  for (const reference of references) {
    const prefix = text.slice(result.at(-1)?.end ?? 0, reference.start);
    const quote = prefix.match(/("[^"\n]+"|“[^”\n]+”)\s*(?:[—–-]\s*|\(\s*)$/);
    if (quote) {
      const start = reference.start - prefix.length + quote.index!;
      result.push({ start, end: start + quote[1].length, href: reference.href, kind: 'quote' });
    }
    result.push(reference);
  }
  return result;
}
