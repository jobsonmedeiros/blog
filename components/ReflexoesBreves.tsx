"use client";
import { useId, useState } from 'react';
import Link from 'next/link';
import { bibleReferenceHref as criarLinkReferencia } from '@/lib/bible-links';
import type { ReflexaoBreve } from '@/data/reflexoesBreves';

type CartaoReflexao = Pick<ReflexaoBreve, 'slug' | 'titulo' | 'tema' | 'resumo'> & { referencia: string };
export default function ReflexoesBreves({ reflexoes, compacto = false }: { reflexoes: CartaoReflexao[]; compacto?: boolean }) {
  const [tema, definirTema] = useState('Todas');
  const [mostrarTodas, definirMostrarTodas] = useState(false);
  const identificador = useId();
  const temas = ['Todas', ...new Set(reflexoes.map(reflexao => reflexao.tema))];
  const encontradas = tema === 'Todas' ? reflexoes : reflexoes.filter(reflexao => reflexao.tema === tema);
  const visiveis = mostrarTodas ? encontradas : encontradas.slice(0, 6);
  return <section id="reflexoes-breves" className="mt-8" aria-labelledby="reflexoes-titulo" style={{ scrollMarginTop: 'calc(var(--site-nav-height, 4rem) + 1rem)' }}>
    <header className={`${compacto ? 'text-left' : 'text-center'} mb-5`}>
      <h2 id="reflexoes-titulo" className={compacto ? 'text-2xl' : 'text-3xl'}>Reflexões Breves</h2>
      <p className="font-sans text-sm text-[var(--ink-light)] mt-2">{reflexoes.length} meditações para ler com calma e voltar à Palavra.</p>
    </header>
    <div role="group" aria-label="Filtrar reflexões por assunto" className={`flex flex-wrap ${compacto ? 'justify-start' : 'justify-center'} gap-2 mb-5`}>
      {temas.map(opcao => <button key={opcao} type="button" aria-pressed={tema === opcao} onClick={() => { definirTema(opcao); definirMostrarTodas(false); }} className={`font-sans text-xs rounded-full px-3 py-2 ${tema === opcao ? 'bg-[var(--ink)] text-[var(--parchment)]' : 'bg-[var(--parchment-dark)] text-[var(--ink-light)]'}`}>{opcao}</button>)}
    </div>
    <div id={identificador} className={compacto ? 'divide-y divide-[var(--parchment-dark)]' : 'grid sm:grid-cols-2 gap-4'}>
      {visiveis.map(reflexao => <article key={reflexao.slug} className={compacto ? 'py-4 flex flex-col gap-2' : 'card p-5 flex flex-col gap-3'}>
        <p className="font-sans text-[11px] text-[var(--gold)]">{reflexao.tema} · 2 min de leitura</p>
        <h3 className="text-xl leading-tight"><Link href={`/estudos/reflexao-${reflexao.slug}`}>{reflexao.titulo}</Link></h3>
        <p className="font-sans text-sm leading-relaxed text-[var(--ink-light)]">{reflexao.resumo}</p>
        <div className="mt-auto pt-1 flex flex-wrap items-center justify-between gap-2 font-sans text-xs text-[var(--gold)]">
          <Link href={criarLinkReferencia(reflexao.referencia)} className="underline underline-offset-4" title="Abrir a passagem na Bíblia">{reflexao.referencia}</Link>
          <Link href={`/estudos/reflexao-${reflexao.slug}`} className="underline underline-offset-4">Ler reflexão →</Link>
        </div>
      </article>)}
    </div>
    {encontradas.length > 6 && <div className="text-center mt-5"><button type="button" aria-expanded={mostrarTodas} aria-controls={identificador} onClick={() => {
      definirMostrarTodas(!mostrarTodas);
      if (mostrarTodas) document.getElementById('reflexoes-breves')?.scrollIntoView({ block: 'start' });
    }} className="rounded-full border border-[var(--gold)] px-5 py-2.5 font-sans text-sm text-[var(--gold)] hover:bg-[var(--parchment-dark)]">{mostrarTodas ? 'Mostrar menos' : `Ver todas as ${encontradas.length} reflexões`}</button></div>}
  </section>;
}
