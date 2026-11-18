export type DarbyPortugueseVerse = {
  original: string; text: string; source: 'automatic'; attribution: string;
};

// MyMemory aceita até 500 bytes por consulta. Não divide caracteres UTF-8.
export function translationChunks(text: string, maxBytes = 480): string[] {
  const encoder = new TextEncoder();
  const chunks: string[] = [];
  let current = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word;
    if (encoder.encode(candidate).length <= maxBytes) { current = candidate; continue; }
    if (current) chunks.push(current);
    current = '';
    for (const character of Array.from(word)) {
      if (current && encoder.encode(current + character).length > maxBytes) { chunks.push(current); current = ''; }
      current += character;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export function plainTranslation(text: string): string {
  const named: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, key: string) => {
    if (key[0] !== '#') return named[key.toLowerCase()] ?? entity;
    const code = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : parseInt(key.slice(1), 10);
    return code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  }).trim();
}
