import { parseBiblePassage, type BiblePassage } from './bible-links.ts';

export const HIGHLIGHT_STORAGE_KEY = 'ce-marca-textos-v1';

export function passageHighlightKeys(passage: BiblePassage): string[] {
  return Array.from({ length: passage.ate - passage.versiculo + 1 }, (_, index) =>
    `${passage.livro}:${passage.capitulo}:${passage.versiculo + index}`);
}

export function parseHighlights(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((key): key is string => {
      if (typeof key !== 'string' || !/^\d+:\d+:\d+$/.test(key)) return false;
      const [livro, capitulo, versiculo] = key.split(':');
      return parseBiblePassage({ livro, capitulo, versiculo }) !== null;
    }))];
  } catch { return []; }
}

export function togglePassageHighlight(saved: string[], passage: BiblePassage): string[] {
  const keys = passageHighlightKeys(passage);
  const set = new Set(saved);
  const remove = keys.every(key => set.has(key));
  for (const key of keys) {
    if (remove) set.delete(key);
    else set.add(key);
  }
  return [...set];
}
