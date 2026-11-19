"use client";
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { TextoRevista as Texto, PaginaRevista } from '@/lib/revistas-modelo';
import TextoRevista from './TextoRevista';
import { traduzirTextoRevista } from '@/lib/revistas-traducao-cliente';
import { idiomaOriginalRevista } from '@/lib/revistas-modelo';

export default function LeitorRevista({ pagina, publicada }: { pagina: PaginaRevista; publicada: Texto | null }) {
  const idiomaOriginal = [pagina, ...pagina.anteriores].some(item => idiomaOriginalRevista(item.caminho) === 'es') ? 'es' : 'en';
  const [traducao, definirTraducao] = useState('');
  const [tituloTraduzido, definirTituloTraduzido] = useState('');
  const [progresso, definirProgresso] = useState('');
  const [erro, definirErro] = useState('');
  const [traduzindo, definirTraduzindo] = useState(false);
  const controle = useRef<AbortController | null>(null);
  useEffect(() => () => controle.current?.abort(), []);
  const titulo = publicada?.tituloOriginal || pagina.titulo;
  const texto = publicada?.textoOriginal || pagina.texto;
  const traduzir = async () => {
    const abortar = new AbortController(); controle.current = abortar;
    definirTraduzindo(true); definirErro('');
    try {
      await traduzirTextoRevista(titulo, abortar.signal, atual => definirTituloTraduzido(atual), idiomaOriginal);
      await traduzirTextoRevista(texto, abortar.signal, (atual, feito, total) => { definirTraducao(atual); definirProgresso(`${feito} de ${total} trechos`); }, idiomaOriginal);
    } catch (erro) { if (!abortar.signal.aborted) definirErro(erro instanceof Error ? erro.message : 'Não foi possível traduzir.'); }
    finally { definirTraduzindo(false); }
  };
  return <>
    {!publicada && <div className="font-sans text-sm mb-5 space-y-2">
      <button type="button" disabled={traduzindo} onClick={traduzir} className="btn-secondary min-h-11 max-w-full whitespace-normal disabled:opacity-50">{traduzindo ? `Traduzindo… ${progresso}` : traducao ? 'Tentar tradução automática novamente' : 'Traduzir automaticamente para português'}</button>
      {traduzindo && <button type="button" className="min-h-11 ml-3 underline" onClick={() => controle.current?.abort()}>Parar</button>}
      <p className="text-xs text-[var(--ink-light)]">Tradução automática pelo MyMemory, sem revisão, apenas para esta leitura. Ao clicar, o texto é enviado ao tradutor gratuito, sujeito a limite diário.</p>
      {erro && <p role="alert">{erro}</p>}
    </div>}
    <div className={`grid gap-5 ${publicada || tituloTraduzido || traducao ? 'revistas-comparacao md:grid-cols-2' : 'max-w-3xl mx-auto'}`} style={{ '--linhas-comparacao': Math.max(texto.split(/\n\s*\n/).filter(trecho => trecho.trim()).length, (publicada?.textoTraduzido || traducao).split(/\n\s*\n/).filter(trecho => trecho.trim()).length) + 2 } as CSSProperties}>
      <TextoRevista titulo={titulo} texto={texto} idioma={idiomaOriginal} />
      {publicada ? <TextoRevista titulo={publicada.tituloTraduzido || titulo} texto={publicada.textoTraduzido} idioma="pt-BR" /> : (tituloTraduzido || traducao) && <TextoRevista titulo={tituloTraduzido || titulo} texto={traducao} idioma="pt-BR" automatica />}
    </div>
  </>;
}
