"use client";
import { useId, useState, type ReactNode } from 'react';
import type { EntradaRevista, GrupoRevistas } from '@/lib/revistas-modelo';
import ArvoreRevistas from '@/components/ArvoreRevistas';

export default function CatalogoRevistas({ itens, editor = false, cabecalho, rotuloBusca = 'Buscar nesta lista', grupos }: { itens: EntradaRevista[]; editor?: boolean; cabecalho?: ReactNode; rotuloBusca?: string; grupos?: GrupoRevistas[] }) {
  const [busca, definirBusca] = useState('');
  const [grupoSelecionado, definirGrupoSelecionado] = useState(() => grupos?.find(grupo => grupo.itens.length)?.id || grupos?.[0]?.id || '');
  const grupoAtivo = grupos?.find(grupo => grupo.id === grupoSelecionado) || grupos?.[0];
  const itensAtuais = grupoAtivo?.itens ?? itens;
  const identificador = useId();
  const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const encontrados = itensAtuais.filter(item => normalizar(item.titulo).includes(normalizar(busca)));
  return <div className="font-sans">
    <div className={cabecalho ? 'rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] p-3 sm:p-5 mb-4' : 'mb-4'}>
      {cabecalho}
      {grupos && <div role="group" aria-label="Idioma das revistas" className="grid grid-cols-3 gap-1 mb-3">
        {grupos.map(grupo => <button key={grupo.id} type="button" aria-pressed={grupoAtivo?.id === grupo.id} aria-controls={`${identificador}-${grupo.id}`} onClick={() => { definirGrupoSelecionado(grupo.id); definirBusca(''); }} className={`flex min-h-10 items-center justify-center gap-1 rounded-lg px-1 py-2 text-xs ${grupoAtivo?.id === grupo.id ? 'bg-[var(--ink)] text-[var(--parchment)]' : 'bg-[var(--parchment)] text-[var(--ink-light)] hover:bg-[var(--parchment-dark)]'}`}>
          {grupo.titulo}<span className="text-[10px] opacity-75">{grupo.itens.length}</span>
        </button>)}
      </div>}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 text-xs">
        <label htmlFor={identificador} className="font-medium">{rotuloBusca}</label>
        <p role="status" className="text-[var(--ink-light)]">{encontrados.length} de {itensAtuais.length} títulos</p>
      </div>
      <input id={identificador} type="search" value={busca} onChange={evento => definirBusca(evento.target.value)} placeholder="Digite parte do título…" className="block min-h-11 w-full rounded-lg border border-[var(--parchment-dark)] bg-[var(--parchment)] px-3 py-2 text-sm" />
    </div>
    {grupos ? grupos.map(grupo => <section key={grupo.id} id={`${identificador}-${grupo.id}`} hidden={grupo.id !== grupoAtivo?.id} aria-label={`Revistas em ${grupo.titulo.toLowerCase()}`}>
      {grupo.descricao && <p className="mb-3 text-xs text-[var(--ink-light)]">{grupo.descricao}</p>}
      <ArvoreRevistas itens={grupo.id === grupoAtivo?.id ? encontrados : grupo.itens} editor={editor} />
      {grupo.id === grupoAtivo?.id && !encontrados.length && <p className="py-5 text-sm text-[var(--ink-light)]">{busca.trim() ? 'Nenhum título encontrado.' : grupo.vazio || 'Nenhum título disponível.'}</p>}
    </section>) : <>
      <ArvoreRevistas itens={encontrados} editor={editor} />
      {!encontrados.length && <p className="py-8 text-center">Nenhum título encontrado.</p>}
    </>}
  </div>;
}
