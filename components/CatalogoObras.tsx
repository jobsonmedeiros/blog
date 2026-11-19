'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { filtrarObras, type ObraAcervo } from '@/lib/acervo-obras';

const POR_PAGINA = 24;

export default function CatalogoObras({ obras, tipo }: { obras: ObraAcervo[]; tipo: 'livro' | 'artigo' }) {
  const [busca, definirBusca] = useState('');
  const [comOriginal, definirComOriginal] = useState(false);
  const [limite, definirLimite] = useState(POR_PAGINA);
  const identificador = useId();
  const encontrados = filtrarObras(obras, busca, comOriginal);
  const visiveis = encontrados.slice(0, limite);
  return <>
    <div className="font-sans rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] p-4 sm:p-5 mb-5">
      <label htmlFor={identificador} className="block text-sm font-medium mb-2">{tipo === 'livro' ? 'Buscar livros' : 'Buscar artigos de Darby'}</label>
      <input id={identificador} type="search" value={busca} onChange={evento => { definirBusca(evento.target.value); definirLimite(POR_PAGINA); }} placeholder="Título, autor ou publicação…" className="min-h-11 w-full rounded-lg border border-[var(--parchment-dark)] bg-[var(--parchment)] px-3 py-2 text-sm" />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--ink-light)]">
        <label className="flex min-h-10 items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={comOriginal} onChange={evento => { definirComOriginal(evento.target.checked); definirLimite(POR_PAGINA); }} className="accent-[var(--gold)]" />
          Com referência em inglês
        </label>
        <p role="status">{encontrados.length} de {obras.length} {tipo === 'livro' ? 'livros' : 'artigos'}</p>
      </div>
    </div>
    <ul className={tipo === 'livro' ? 'grid sm:grid-cols-2 gap-4' : 'space-y-3'}>
      {visiveis.map(obra => <li key={obra.id} className="rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] p-5 min-w-0">
        <p className="font-sans text-xs text-[var(--gold)] mb-2">{obra.autor}</p>
        <h2 className="text-xl leading-snug break-words">
          {tipo === 'livro' ? <Link href={`/livros/${obra.id}`} className="hover:underline">{obra.titulo}</Link> : <a href={obra.fontePortugues.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{obra.titulo} ↗</a>}
        </h2>
        {obra.descricao && <p className="mt-3 text-base leading-relaxed text-[var(--ink-light)]">{obra.descricao}</p>}
        {obra.publicacao && <p className="font-sans text-xs mt-2 text-[var(--ink-light)]">{obra.publicacao.titulo}</p>}
        {obra.notas.length > 0 && <p className="font-sans text-xs mt-2 text-[var(--ink-light)]">{obra.notas.join(' ')}</p>}
        <div className="font-sans mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--gold)]">
          {tipo === 'livro' ? <Link href={`/livros/${obra.id}`} className="inline-flex min-h-10 items-center underline">Ver livro e fontes →</Link> : <>
            <a href={obra.fontePortugues.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center underline">Ler em português ↗</a>
            {obra.originais.map(original => <a key={original.url} href={original.url} target="_blank" rel="noopener noreferrer" lang="en" title={original.titulo} className="inline-flex min-h-10 items-center underline">Referência em inglês ↗</a>)}
          </>}
        </div>
      </li>)}
    </ul>
    {!encontrados.length && <p className="font-sans py-10 text-center text-sm text-[var(--ink-light)]">Nenhum título encontrado. Tente outras palavras ou desmarque o filtro de inglês.</p>}
    {visiveis.length < encontrados.length && <div className="font-sans text-center mt-6">
      <button type="button" onClick={() => definirLimite(atual => atual + POR_PAGINA)} className="btn-secondary">Mostrar mais artigos</button>
      <p className="text-xs text-[var(--ink-light)] mt-2">Exibindo {visiveis.length} de {encontrados.length}</p>
    </div>}
  </>;
}
