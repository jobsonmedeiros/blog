import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { parseBiblePassage } from '@/lib/bible-links';
import { isSameOrigin } from '@/lib/article-utils';
import { plainTranslation, translationChunks, type DarbyPortugueseVerse } from '@/lib/darby-translation';

export const runtime = 'nodejs';
const cache = new Map<string, DarbyPortugueseVerse>();
const pending = new Map<string, Promise<DarbyPortugueseVerse>>();
let cooldownUntil = 0;
class TranslationFailure extends Error {
  constructor(message: string, public status = 503) { super(message); }
}

async function translateOriginal(original: string): Promise<DarbyPortugueseVerse> {
  if (Date.now() < cooldownUntil) throw new TranslationFailure('O serviço de tradução atingiu o limite diário. O original em inglês continua disponível.', 429);
  const translated: string[] = [];
  for (const chunk of translationChunks(original)) {
    const query = new URLSearchParams({ q: chunk, langpair: 'en|pt-BR', mt: '1' });
    const response = await fetch(`https://api.mymemory.translated.net/get?${query}`, { signal: AbortSignal.timeout(20000), cache: 'no-store' });
    const result = await response.json();
    if (response.status === 429 || result.quotaFinished || Number(result.responseStatus) === 403 || Number(result.responseStatus) === 429) {
      cooldownUntil = Date.now() + 60 * 60 * 1000;
      throw new TranslationFailure('O serviço de tradução atingiu o limite diário. Tente novamente mais tarde; o original em inglês está preservado.', 429);
    }
    if (!response.ok || Number(result.responseStatus) !== 200 || typeof result.responseData?.translatedText !== 'string' || !result.responseData.translatedText.trim()) {
      throw new TranslationFailure('A tradução automática está indisponível. O original em inglês continua disponível.');
    }
    translated.push(plainTranslation(result.responseData.translatedText));
  }
  return { original, text: translated.join(' '), source: 'automatic', attribution: 'MyMemory / Translated — auxílio de leitura automático, sem revisão' };
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || ![body.livro, body.capitulo, body.versiculo].every(Number.isInteger)) return NextResponse.json({ error: 'Referência inválida.' }, { status: 400 });
    const passage = parseBiblePassage({ livro: String(body.livro), capitulo: String(body.capitulo), versiculo: String(body.versiculo) });
    if (!passage) return NextResponse.json({ error: 'Referência inválida.' }, { status: 400 });
    const book: Array<Array<string | null>> = JSON.parse(await readFile(path.join(process.cwd(), 'public', 'biblia', 'darby', `${passage.livro}.json`), 'utf8'));
    const original = book[passage.capitulo - 1]?.[passage.versiculo - 1];
    if (typeof original !== 'string' || !original.trim()) return NextResponse.json({ error: 'Este versículo não consta do original desta edição Darby; não há texto a traduzir.' }, { status: 404 });
    const key = `${passage.livro}:${passage.capitulo}:${passage.versiculo}`;
    if (cache.get(key)?.original === original) return NextResponse.json(cache.get(key));
    let task = pending.get(key);
    if (!task) {
      if (pending.size >= 4) throw new TranslationFailure('O tradutor está ocupado. Tente novamente em instantes.', 429);
      task = translateOriginal(original);
      pending.set(key, task);
      void task.finally(() => { pending.delete(key); }).catch(() => {});
    }
    const result = await task;
    if (cache.size >= 2000) cache.delete(cache.keys().next().value!);
    cache.set(key, result);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Pedido inválido.' }, { status: 400 });
    return NextResponse.json({ error: error instanceof TranslationFailure ? error.message : 'Não foi possível traduzir agora. O original em inglês continua disponível.' }, { status: error instanceof TranslationFailure ? error.status : 503 });
  }
}
