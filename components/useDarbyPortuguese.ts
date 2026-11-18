"use client";
import { useEffect, useState } from 'react';
import type { DarbyPortugueseVerse as VersiculoDarbyPortugues } from '@/lib/darby-translation';

type VersiculoOriginal = { verse: number; text: string; omitted?: boolean };
const memoriaTraducoes = new Map<string, VersiculoDarbyPortugues>();

async function traduzirVersiculo(livroSolicitado: number, capituloSolicitado: number, versiculoOriginal: VersiculoOriginal, sinalCancelamento: AbortSignal): Promise<VersiculoDarbyPortugues> {
  const chave = `ce-darby-pt-v1:${livroSolicitado}:${capituloSolicitado}:${versiculoOriginal.verse}`;
  let trechoEmCache = memoriaTraducoes.get(chave);
  try { trechoEmCache ??= JSON.parse(localStorage.getItem(chave) || 'null'); } catch { /* cache opcional */ }
  if (trechoEmCache?.original === versiculoOriginal.text && trechoEmCache.text?.trim() && trechoEmCache.source === 'automatic') return trechoEmCache;
  const resposta = await fetch('/api/biblia/darby/traduzir', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ livro: livroSolicitado, capitulo: capituloSolicitado, versiculo: versiculoOriginal.verse }), signal: sinalCancelamento });
  const resultado = await resposta.json();
  if (!resposta.ok) throw new Error(resultado.error || 'Não foi possível traduzir o trecho.');
  if (resultado.original !== versiculoOriginal.text || typeof resultado.text !== 'string' || !resultado.text.trim() || resultado.source !== 'automatic') throw new Error('A tradução retornada não corresponde ao trecho solicitado.');
  if (memoriaTraducoes.size >= 2000) memoriaTraducoes.delete(memoriaTraducoes.keys().next().value!);
  memoriaTraducoes.set(chave, resultado);
  try { localStorage.setItem(chave, JSON.stringify(resultado)); } catch { /* limite do navegador: mantém o cache em memória */ }
  return resultado;
}

type ResultadoTraducaoDarby = { trechos: Record<number, VersiculoDarbyPortugues>; erroCapturado: string; tentarNovamente: () => void; concluidos: number; total: number };

export function useDarbyEmPortugues(habilitado: boolean, livroSolicitado: number, capituloSolicitado: number, versiculosOriginais: VersiculoOriginal[]): ResultadoTraducaoDarby {
  const chave = `${livroSolicitado}:${capituloSolicitado}`;
  const [estadoTraducao, definirEstadoTraducao] = useState<{ chave: string; trechos: Record<number, VersiculoDarbyPortugues>; erroCapturado: string }>({ chave: '', trechos: {}, erroCapturado: '' });
  const [tentativa, definirTentativa] = useState(0);
  const trechos = estadoTraducao.chave === chave ? estadoTraducao.trechos : {};
  const erroCapturado = estadoTraducao.chave === chave ? estadoTraducao.erroCapturado : '';
  useEffect(() => {
    if (!habilitado || !versiculosOriginais.length) return;
    const controleCancelamento = new AbortController();
    let ativo = true;
    let interrompido = false;
    let posicaoAtual = 0;
    const versiculosPendentes = versiculosOriginais.filter(versiculo => !versiculo.omitted);
    const executarTraducao = async () => {
      while (ativo && !interrompido && posicaoAtual < versiculosPendentes.length) {
        const versiculoOriginal = versiculosPendentes[posicaoAtual++];
        try {
          const resultado = await traduzirVersiculo(livroSolicitado, capituloSolicitado, versiculoOriginal, controleCancelamento.signal);
          if (ativo) definirEstadoTraducao(anterior => ({ chave, trechos: { ...(anterior.chave === chave ? anterior.trechos : {}), [versiculoOriginal.verse]: resultado }, erroCapturado: interrompido && anterior.chave === chave ? anterior.erroCapturado : '' }));
        } catch (falha) {
          if (!ativo) return;
          interrompido = true;
          definirEstadoTraducao(anterior => ({ chave, trechos: anterior.chave === chave ? anterior.trechos : {}, erroCapturado: falha instanceof Error ? falha.message : 'Tradução indisponível.' }));
        }
      }
    };
    void Promise.all([executarTraducao(), executarTraducao()]);
    return () => { ativo = false; controleCancelamento.abort(); };
  }, [habilitado, livroSolicitado, capituloSolicitado, versiculosOriginais, chave, tentativa]);
  return { trechos, erroCapturado, tentarNovamente: () => definirTentativa(valor => valor + 1), concluidos: Object.keys(trechos).length, total: versiculosOriginais.filter(versiculo => !versiculo.omitted).length };
}
