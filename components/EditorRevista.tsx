"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { PaginaRevista, RascunhoRevista, TextoRevista } from '@/lib/revistas-modelo';
import { traduzirTextoRevista } from '@/lib/revistas-traducao-cliente';
import { criarRolagemConjunta } from '@/lib/rolagem-textos';
import { idiomaOriginalRevista } from '@/lib/revistas-modelo';
import { useProtecaoRascunho } from '@/components/useProtecaoRascunho';

export default function EditorRevista({ pagina, rascunho }: { pagina: PaginaRevista; rascunho: RascunhoRevista | null }) {
  const idiomaOriginal = [pagina, ...pagina.anteriores].some(item => idiomaOriginalRevista(item.caminho) === 'es') ? 'es' : 'en';
  const [texto, definirTexto] = useState<TextoRevista>(() => ({
    tituloOriginal: rascunho?.tituloOriginal ?? pagina.titulo, textoOriginal: rascunho?.textoOriginal ?? pagina.texto,
    tituloTraduzido: rascunho?.tituloTraduzido ?? '', textoTraduzido: rascunho?.textoTraduzido ?? '',
  }));
  const [versao, definirVersao] = useState(rascunho?.versao ?? 0);
  const [salvando, definirSalvando] = useState(false);
  const [conflito, definirConflito] = useState(false);
  const [erroSalvar, definirErroSalvar] = useState(false);
  const [mensagem, definirMensagem] = useState(rascunho ? 'Rascunho recuperado.' : 'As alterações são salvas automaticamente.');
  const [publicada, definirPublicada] = useState(Boolean(rascunho?.publicado));
  const [pendente, definirPendente] = useState(false);
  const [traduzindo, definirTraduzindo] = useState(false);
  const [progresso, definirProgresso] = useState('');
  const [avisoTraducao, definirAvisoTraducao] = useState('');
  const [rolagemConjunta, definirRolagemConjunta] = useState(true);
  useProtecaoRascunho(pendente || salvando || traduzindo, () => definirMensagem('Aguarde o salvamento antes de mudar de página. Se houve conflito, copie suas alterações antes de sair.'));
  const campoOriginal = useRef<HTMLTextAreaElement | null>(null);
  const campoTraduzido = useRef<HTMLTextAreaElement | null>(null);
  const ultimoCampoRolado = useRef<HTMLTextAreaElement | null>(null);
  const [sincronizarRolagem] = useState(() => criarRolagemConjunta());
  const acompanharRolagem = (origem: HTMLTextAreaElement, destino: HTMLTextAreaElement | null) => {
    ultimoCampoRolado.current = origem;
    if (rolagemConjunta && destino) sincronizarRolagem(origem, destino);
  };
  const alternarRolagemConjunta = () => {
    if (!rolagemConjunta && campoOriginal.current && campoTraduzido.current) {
      const origem = ultimoCampoRolado.current ?? campoOriginal.current;
      sincronizarRolagem(origem, origem === campoOriginal.current ? campoTraduzido.current : campoOriginal.current);
    }
    definirRolagemConjunta(!rolagemConjunta);
  };
  const controleTraducao = useRef<AbortController | null>(null);
  const gravando = useRef(false);
  const alteracoes = useRef(0);
  const alterar = useCallback((campo: keyof TextoRevista, valor: string) => {
    alteracoes.current++;
    definirTexto(anterior => ({ ...anterior, [campo]: valor })); definirPendente(true); definirErroSalvar(false);
  }, []);
  useEffect(() => () => controleTraducao.current?.abort(), []);
  useEffect(() => {
    if (!pendente && !salvando && !traduzindo) return;
    const avisar = (evento: BeforeUnloadEvent) => { evento.preventDefault(); };
    const antesDeSair = (evento: Event) => {
      evento.preventDefault();
      definirMensagem(traduzindo ? 'Pare a tradução e aguarde o salvamento antes de sair.' : 'Aguarde o salvamento do rascunho antes de sair. Se necessário, clique em Salvar rascunho.');
    };
    window.addEventListener('beforeunload', avisar);
    window.addEventListener('ce-antes-sair', antesDeSair);
    return () => {
      window.removeEventListener('beforeunload', avisar);
      window.removeEventListener('ce-antes-sair', antesDeSair);
    };
  }, [pendente, salvando, traduzindo]);

  const salvar = useCallback(async (publicar = false) => {
    if (gravando.current || conflito) return;
    gravando.current = true; definirSalvando(true);
    const alteracaoEnviada = alteracoes.current;
    try {
      const resposta = await fetch('/api/revistas/rascunho', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...texto, caminho: pagina.caminho, versao, publicar }) });
      const dados = await resposta.json();
      if (!resposta.ok) { if (resposta.status === 409) definirConflito(true); throw new Error(dados.error); }
      definirVersao(dados.versao);
      if (alteracoes.current === alteracaoEnviada) definirPendente(false);
      definirErroSalvar(false);
      if (publicar) definirPublicada(true);
      definirMensagem(publicar ? 'Tradução publicada.' : 'Rascunho salvo.');
    } catch (erro) {
      definirErroSalvar(true);
      definirMensagem(erro instanceof Error ? erro.message : 'Não foi possível salvar. Tente novamente.');
    } finally { gravando.current = false; definirSalvando(false); }
  }, [texto, pagina.caminho, versao, conflito]);
  const salvarAtual = useRef(salvar);
  useEffect(() => { salvarAtual.current = salvar; }, [salvar]);
  useEffect(() => {
    if (!traduzindo) return;
    const temporizador = setInterval(() => { void salvarAtual.current(); }, 10000);
    return () => clearInterval(temporizador);
  }, [traduzindo]);

  useEffect(() => {
    if (!pendente || salvando || traduzindo || conflito || erroSalvar) return;
    const temporizador = setTimeout(() => { void salvar(); }, 1500);
    return () => clearTimeout(temporizador);
  }, [pendente, salvando, traduzindo, conflito, erroSalvar, salvar]);

  const traduzir = useCallback(async () => {
    if (controleTraducao.current && !controleTraducao.current.signal.aborted) return;
    const controle = new AbortController(); controleTraducao.current = controle;
    definirTraduzindo(true); definirAvisoTraducao('');
    try {
      if (!texto.tituloTraduzido.trim()) await traduzirTextoRevista(texto.tituloOriginal, controle.signal, atual => alterar('tituloTraduzido', atual), idiomaOriginal);
      await traduzirTextoRevista(texto.textoOriginal, controle.signal, (atual, feito, total) => { alterar('textoTraduzido', atual); definirProgresso(`${feito} de ${total} trechos`); }, idiomaOriginal);
      definirAvisoTraducao('Tradução automática concluída. Revise antes de publicar.');
    } catch (erro) { definirAvisoTraducao(controle.signal.aborted ? 'Tradução interrompida. A parte já traduzida será salva como rascunho.' : erro instanceof Error ? erro.message : 'Não foi possível traduzir.'); }
    finally { controleTraducao.current = null; definirTraduzindo(false); }
  }, [texto, alterar, idiomaOriginal]);
  const traducaoInicialIniciada = useRef(false);
  useEffect(() => {
    // Nunca substitui uma tradução ou revisão já salva, mesmo que parcial.
    if (traducaoInicialIniciada.current || rascunho?.textoTraduzido.trim()) return;
    const temporizador = setTimeout(() => {
      traducaoInicialIniciada.current = true;
      void traduzir();
    }, 0);
    return () => clearTimeout(temporizador);
  }, [rascunho?.textoTraduzido, traduzir]);
  const classeCampo = 'w-full rounded-lg border border-[var(--parchment-dark)] bg-[var(--surface)] px-3 py-2';
  const classeAcao = 'inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-full border px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-normal sm:whitespace-nowrap';
  return <div>
    <section aria-label="Controles da tradução" className="rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] px-4 py-3 mb-5 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
          <button type="button" disabled={salvando || traduzindo || conflito} onClick={() => { void salvar(); }} className={`${classeAcao} border-[var(--parchment-dark)] hover:bg-[var(--parchment-dark)]`}>{salvando ? 'Salvando…' : 'Salvar rascunho'}</button>
          <button type="button" disabled={salvando || traduzindo || conflito || !texto.tituloTraduzido.trim() || !texto.textoTraduzido.trim()} onClick={() => { void salvar(true); }} className={`${classeAcao} bg-[var(--gold)] border-[var(--gold)] text-white hover:bg-[#8d6210]`}>{publicada ? 'Publicar alterações' : 'Publicar tradução'}</button>
        </div>
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <button type="button" aria-pressed={rolagemConjunta} onClick={alternarRolagemConjunta} className={`${classeAcao} ${rolagemConjunta ? 'bg-[var(--parchment-dark)] border-[var(--gold)] text-[var(--ink)]' : 'border-[var(--parchment-dark)] text-[var(--ink-light)] hover:bg-[var(--parchment-dark)]'}`} title={rolagemConjunta ? 'Desativar a rolagem conjunta dos textos' : 'Ativar a rolagem conjunta dos textos'}>
            <span aria-hidden="true" className="inline-block w-4">{rolagemConjunta ? '✓' : '↕'}</span> Rolar textos juntos
          </button>
          <Link href={`/revistas${pagina.caminho}`} target="_blank" className="inline-flex min-h-10 items-center px-2 text-xs text-[var(--ink-light)] underline underline-offset-4">Ver página pública ↗</Link>
        </div>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-t border-[var(--parchment-dark)] mt-3 pt-2.5 text-xs leading-relaxed">
        <div className="min-w-0 space-y-1">
          <p role="status" className={erroSalvar ? 'text-red-700' : 'text-[var(--ink-light)]'}>{mensagem}</p>
          {avisoTraducao && <p role="status" className="text-[var(--ink-light)]">{avisoTraducao}</p>}
        </div>
        <span className="shrink-0 rounded-full bg-[var(--parchment)] px-2.5 py-1 text-[var(--ink-light)]">{pendente ? 'Alterações pendentes' : publicada ? 'Há uma versão pública' : 'Rascunho privado'}</span>
      </div>
    </section>
    <div className="grid md:grid-cols-2 gap-5">
      <section className="card p-4 sm:p-6 min-w-0">
        <h2 className="text-xl mb-4">Original</h2>
        <label className="block font-sans text-sm mb-4">Título original<input lang={idiomaOriginal} disabled={traduzindo} maxLength={500} value={texto.tituloOriginal} onChange={evento => alterar('tituloOriginal', evento.target.value)} className={`${classeCampo} mt-2`} /></label>
        <label className="block font-sans text-sm">Texto original<textarea ref={campoOriginal} onScroll={evento => acompanharRolagem(evento.currentTarget, campoTraduzido.current)} lang={idiomaOriginal} disabled={traduzindo} maxLength={300000} value={texto.textoOriginal} onChange={evento => alterar('textoOriginal', evento.target.value)} className={`${classeCampo} mt-2 min-h-[55vh] text-base leading-relaxed resize-y`} /></label>
      </section>
      <section className="card p-4 sm:p-6 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-xl">Tradução em português</h2>
          {!texto.textoTraduzido.trim() && !traduzindo && <button type="button" disabled={salvando || conflito} onClick={traduzir} className="font-sans text-xs underline underline-offset-4">Traduzir automaticamente</button>}
          {traduzindo && <button type="button" onClick={() => controleTraducao.current?.abort()} className="font-sans text-xs underline">Parar tradução · {progresso}</button>}
        </div>
        <label className="block font-sans text-sm mb-4">Título traduzido<input lang="pt-BR" disabled={traduzindo} maxLength={500} value={texto.tituloTraduzido} onChange={evento => alterar('tituloTraduzido', evento.target.value)} className={`${classeCampo} mt-2`} /></label>
        <label className="block font-sans text-sm">Texto traduzido<textarea ref={campoTraduzido} onScroll={evento => acompanharRolagem(evento.currentTarget, campoOriginal.current)} lang="pt-BR" disabled={traduzindo} maxLength={300000} value={texto.textoTraduzido} onChange={evento => alterar('textoTraduzido', evento.target.value)} placeholder={traduzindo ? 'Preparando a tradução em português…' : 'A tradução automática aparecerá aqui para você revisar.'} className={`${classeCampo} mt-2 min-h-[55vh] text-base leading-relaxed resize-y`} /></label>
        <p className="font-sans text-xs mt-3 text-[var(--ink-light)]">A tradução automática usa MyMemory: envia o original ao serviço gratuito, sujeito a limite diário. O resultado exige revisão e nunca é publicado automaticamente.</p>
      </section>
    </div>
  </div>;
}
