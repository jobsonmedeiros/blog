"use client";
import { useId, useState } from 'react';
import Link from 'next/link';
import { bibleReferenceHref as criarLinkReferencia } from '@/lib/bible-links';
import type { TemaVersiculo } from '@/data/temasVersiculos';

type ResumoTema = Pick<TemaVersiculo, 'slug' | 'titulo' | 'letra' | 'resumo' | 'referencia' | 'texto'> & { quantidade: number };
const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function BuscaTemasVersiculos({ temas }: { temas: ResumoTema[] }) {
  const [busca, definirBusca] = useState('');
  const identificador = useId();
  const palavras = normalizar(busca).trim().split(/\s+/).filter(Boolean);
  const encontrados = temas.filter(tema => palavras.every(palavra => normalizar(`${tema.titulo} ${tema.resumo} ${tema.referencia}`).includes(palavra)));
  const letras = [...new Set(encontrados.map(tema => tema.letra))].sort();
  return <>
    <div className="mb-4 font-sans">
      <label htmlFor={identificador} className="block text-sm mb-2">Qual assunto você procura?</label>
      <div className="flex gap-2">
        <input id={identificador} type="search" value={busca} onChange={evento => definirBusca(evento.target.value)} placeholder="Ex.: consolação, graça, família…" className="min-w-0 w-full rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] px-4 py-3 text-sm" />
        {busca && <button type="button" onClick={() => definirBusca('')} className="px-3 text-xs underline underline-offset-4">Limpar</button>}
      </div>
      <p role="status" className="text-xs text-[var(--ink-light)] mt-2">{encontrados.length} {encontrados.length === 1 ? 'tema encontrado' : 'temas encontrados'}</p>
    </div>
    {letras.length > 0 && <nav aria-label="Índice alfabético de temas" className="flex flex-wrap justify-center gap-2 mb-6">
      {letras.map(letra => <a key={letra} href={`#letra-${letra}`} className="w-9 h-9 rounded-full flex items-center justify-center font-sans text-sm bg-[var(--parchment-dark)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-white">{letra}</a>)}
    </nav>}
    <div className="space-y-7">
      {letras.map(letra => <section key={letra} id={`letra-${letra}`} aria-labelledby={`titulo-letra-${letra}`} style={{ scrollMarginTop: 'calc(var(--site-nav-height, 4rem) + 1rem)' }}>
        <h3 id={`titulo-letra-${letra}`} className="text-2xl mb-3 pb-2 border-b border-[var(--parchment-dark)] text-[var(--gold)]">{letra}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {encontrados.filter(tema => tema.letra === letra).map(tema => <article key={tema.slug} className="card p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-xl text-[var(--gold)]"><Link href={`/versiculo/${tema.slug}`}>{tema.titulo}</Link></h4>
              <span className="font-sans text-[10px] shrink-0 rounded-full bg-[var(--parchment-dark)] px-2 py-1 text-[var(--ink-light)]">{tema.quantidade} passagens</span>
            </div>
            <p className="font-sans text-xs leading-relaxed text-[var(--ink-light)] line-clamp-2">{tema.resumo}</p>
            <Link href={criarLinkReferencia(tema.referencia)} className="no-underline hover:text-[var(--gold)]" title={`Ler ${tema.referencia} na Bíblia`}><p className="text-base leading-relaxed line-clamp-3">“{tema.texto}”</p></Link>
            <div className="flex flex-wrap justify-between gap-2 mt-auto font-sans text-xs text-[var(--gold)]">
              <Link href={criarLinkReferencia(tema.referencia)} className="underline underline-offset-4">{tema.referencia} · ACF</Link>
              <Link href={`/versiculo/${tema.slug}`} className="underline underline-offset-4">Ver passagens →</Link>
            </div>
          </article>)}
        </div>
      </section>)}
    </div>
    {!encontrados.length && <p className="font-sans text-sm text-center py-8 text-[var(--ink-light)]">Nenhum tema encontrado. Tente outra palavra ou limpe a busca.</p>}
  </>;
}
