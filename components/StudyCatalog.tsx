"use client";
import { useState } from 'react';
import Link from 'next/link';
import TextoBiblicoComLinks from '@/components/ScriptureText';
import { articleCategoryKey as chaveTemaArtigo, canonicalArticleCategory as padronizarTemaArtigo, filterArticlesByCategory as filtrarArtigosPorTema, uniqueArticleCategories as listarTemasUnicos } from '@/lib/article-categories';
export type CartaoEstudo = { id: string; titulo: string; categoria: string; resumo: string; autor: string; leitura: string; emoji: string };
export default function CatalogoEstudos({ artigos }: { artigos: CartaoEstudo[] }) {
  const [temaSelecionado, definirTemaSelecionado] = useState('Todos');
  const temasDisponiveis = ['Todos', ...listarTemasUnicos(artigos.map(artigo => artigo.categoria))];
  const temaAtivo = temasDisponiveis.some(itemAtual => chaveTemaArtigo(itemAtual) === chaveTemaArtigo(temaSelecionado)) ? temaSelecionado : 'Todos';
  const artigosVisiveis = filtrarArtigosPorTema(artigos, temaAtivo);
  return <>
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <h2 className="text-2xl">Artigos &amp; Reflexões</h2>
      <div className="flex gap-2 flex-wrap" aria-label="Filtrar estudos por categoria">
        {temasDisponiveis.map(nomeTema => <button key={nomeTema} type="button" aria-pressed={chaveTemaArtigo(temaAtivo) === chaveTemaArtigo(nomeTema)} onClick={() => definirTemaSelecionado(nomeTema)}
          className="font-sans text-xs px-3 py-1.5 rounded-full transition-colors"
          style={{background: chaveTemaArtigo(temaAtivo) === chaveTemaArtigo(nomeTema) ? 'var(--ink)' : 'var(--parchment-dark)', color: chaveTemaArtigo(temaAtivo) === chaveTemaArtigo(nomeTema) ? 'var(--parchment)' : 'var(--ink-light)'}}>{nomeTema}</button>)}
      </div>
    </div>
            <div className="grid md:grid-cols-2 gap-6">
          {artigosVisiveis.map((artigo) => (
            <article
              key={artigo.id}
              className="card p-6 flex flex-col gap-3 no-underline"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{artigo.emoji}</span>
                <span
                  className="font-sans text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "var(--parchment-dark)", color: "var(--gold)" }}
                >
                  {padronizarTemaArtigo(artigo.categoria, temasDisponiveis)}
                </span>
              </div>
              <h3
                className="text-xl"
                style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontWeight: 600 }}
              >
              <Link href={`/estudos/${artigo.id}`}>{artigo.titulo}</Link>
              </h3>
              <p
                className="text-base leading-relaxed flex-1"
                style={{ color: "var(--ink-light)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
              >
                <TextoBiblicoComLinks texto={artigo.resumo} />
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-sans text-xs" style={{ color: "var(--ink-light)" }}>
                  {artigo.autor} • {artigo.leitura} de leitura
                </span>
                <Link href={`/estudos/${artigo.id}`} className="font-sans text-sm" style={{ color: "var(--gold)" }}>
                  Ler →
                </Link>
              </div>
            </article>
          ))}
        </div>

  </>;
}
