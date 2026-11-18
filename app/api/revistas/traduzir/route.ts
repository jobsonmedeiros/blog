import { NextResponse } from 'next/server';
import { isSameOrigin } from '@/lib/article-utils';
import { plainTranslation } from '@/lib/darby-translation';

const memoria = new Map<string, string>();
let ocupados = 0;
let bloqueadoAte = 0;
export async function POST(pedido: Request) {
  if (!isSameOrigin(pedido)) return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
  const dados = await pedido.json().catch(() => null);
  if (typeof dados?.texto !== 'string' || !dados.texto.trim() || new TextEncoder().encode(dados.texto).length > 480) return NextResponse.json({ error: 'Trecho inválido.' }, { status: 400 });
  const texto = dados.texto as string;
  const idioma = dados.idioma ?? 'en';
  if (idioma !== 'en' && idioma !== 'es') return NextResponse.json({ error: 'Idioma inválido.' }, { status: 400 });
  const chave = `${idioma}:${texto}`;
  if (memoria.has(chave)) return NextResponse.json({ texto: memoria.get(chave) });
  if (ocupados >= 4 || Date.now() < bloqueadoAte) return NextResponse.json({ error: 'O tradutor gratuito está ocupado ou atingiu seu limite. O texto já traduzido foi preservado; tente mais tarde.' }, { status: 429 });
  ocupados++;
  try {
    const consulta = new URLSearchParams({ q: texto, langpair: `${idioma}|pt-BR`, mt: '1' });
    const resposta = await fetch(`https://api.mymemory.translated.net/get?${consulta}`, { signal: AbortSignal.timeout(20000), cache: 'no-store' });
    const resultado = await resposta.json();
    if (resposta.status === 429 || resultado.quotaFinished || [403, 429].includes(Number(resultado.responseStatus))) {
      bloqueadoAte = Date.now() + 60 * 60 * 1000;
      return NextResponse.json({ error: 'O tradutor gratuito atingiu seu limite. A parte traduzida foi preservada. Tente novamente mais tarde.' }, { status: 429 });
    }
    if (!resposta.ok || Number(resultado.responseStatus) !== 200 || typeof resultado.responseData?.translatedText !== 'string') throw new Error();
    const traducao = plainTranslation(resultado.responseData.translatedText);
    if (!traducao) throw new Error();
    if (memoria.size >= 1000) memoria.delete(memoria.keys().next().value!);
    memoria.set(chave, traducao);
    return NextResponse.json({ texto: traducao });
  } catch { return NextResponse.json({ error: 'Tradução indisponível. Tente novamente; o original permanece disponível.' }, { status: 503 }); }
  finally { ocupados--; }
}
