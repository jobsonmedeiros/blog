import { LIVROS } from '../data/books.ts';
import { parseBibleTranslation } from './bible-translations.ts';

export type BiblePassage = { livro: number; capitulo: number; versiculo: number; ate: number };
type Query = Record<string, string | string[] | undefined>;

export function parseBiblePassage(query: Query): BiblePassage | null {
  const inteiro = (value: string | string[] | undefined) =>
    typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : NaN;
  const livro = inteiro(query.livro);
  const capitulo = inteiro(query.capitulo);
  const versiculo = inteiro(query.versiculo);
  const ate = query.ate === undefined ? versiculo : inteiro(query.ate);
  if (!Number.isInteger(livro) || !LIVROS[livro] || capitulo < 1 || capitulo > LIVROS[livro].caps ||
      !Number.isInteger(capitulo) || !Number.isInteger(versiculo) || versiculo < 1 || versiculo > 176 ||
      !Number.isInteger(ate) || ate < versiculo || ate > 176) return null;
  return { livro, capitulo, versiculo, ate };
}

export function biblePassageHref(passage: BiblePassage, translation?: string, language?: string): string {
  const query = new URLSearchParams({ livro: String(passage.livro), capitulo: String(passage.capitulo), versiculo: String(passage.versiculo) });
  if (passage.ate !== passage.versiculo) query.set('ate', String(passage.ate));
  if (parseBibleTranslation(translation)) query.set('traducao', translation!);
  if (translation === 'DBY' && language === 'pt') query.set('idioma', 'pt');
  return `/leitura?${query}#versiculo-${passage.versiculo}`;
}

export function bibleReferenceHref(reference: string): string {
  const match = reference.match(/^(.+) (\d+):(\d+)(?:-(\d+))?$/);
  if (!match) throw new Error(`Referência bíblica inválida: ${reference}`);
  const livro = LIVROS.findIndex(item => item.nome === match[1]);
  const passage = parseBiblePassage({ livro: String(livro), capitulo: match[2], versiculo: match[3], ate: match[4] });
  if (!passage) throw new Error(`Referência bíblica inválida: ${reference}`);
  return biblePassageHref(passage);
}
