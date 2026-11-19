'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { criarRolagemConjunta } from '@/lib/rolagem-textos';
import type { RascunhoCapitulo, TextoCapitulo } from '@/lib/livros-repositorio';
import type { CapituloLivro } from '@/lib/livros-modelo';
import { traduzirTextoRevista } from '@/lib/revistas-traducao-cliente';
import { useProtecaoRascunho } from '@/components/useProtecaoRascunho';

type Props = {
  caminho: string;
  livroId: string;
  livroTitulo: string;
  capitulo: CapituloLivro;
  tituloOriginal: string;
  textoOriginal: string;
  rascunho: RascunhoCapitulo | null;
  anterior: CapituloLivro | null;
  proximo: CapituloLivro | null;
};

export default function EditorCapitulo({
  livroId, capitulo,
  tituloOriginal, textoOriginal,
  rascunho, anterior, proximo,
}: Props) {
  const emIngles = capitulo.idioma === 'en';
  const [texto, definirTexto] = useState<TextoCapitulo>(() => ({
    tituloRevisado: rascunho?.tituloRevisado ?? (emIngles ? '' : tituloOriginal),
    textoRevisado: rascunho?.textoRevisado ?? (emIngles ? '' : textoOriginal),
  }));
  const [versao, definirVersao] = useState(rascunho?.versao ?? 0);
  const [salvando, definirSalvando] = useState(false);
  const [conflito, definirConflito] = useState(false);
  const [erroSalvar, definirErroSalvar] = useState(false);
  const [mensagem, definirMensagem] = useState(rascunho ? 'Rascunho recuperado.' : 'As alterações são salvas automaticamente.');
  const [publicado, definirPublicado] = useState(Boolean(rascunho?.publicado));
  const [pendente, definirPendente] = useState(false);
  const [traduzindo, definirTraduzindo] = useState(false);
  const [progresso, definirProgresso] = useState('');
  useProtecaoRascunho(pendente || salvando || traduzindo, () => definirMensagem('Aguarde o salvamento antes de mudar de página. Se houve conflito, copie suas alterações antes de sair.'));
  const controleTraducao = useRef<AbortController | null>(null);
  useEffect(() => () => controleTraducao.current?.abort(), []);
  const [rolagemConjunta, definirRolagemConjunta] = useState(true);
  const campoOriginal = useRef<HTMLTextAreaElement | null>(null);
  const campoRevisado = useRef<HTMLTextAreaElement | null>(null);
  const ultimoCampoRolado = useRef<HTMLTextAreaElement | null>(null);
  const [sincronizarRolagem] = useState(() => criarRolagemConjunta());
  const gravando = useRef(false);
  const alteracoes = useRef(0);

  const acompanharRolagem = (origem: HTMLTextAreaElement, destino: HTMLTextAreaElement | null) => {
    ultimoCampoRolado.current = origem;
    if (rolagemConjunta && destino) sincronizarRolagem(origem, destino);
  };
  const alternarRolagemConjunta = () => {
    if (!rolagemConjunta && campoOriginal.current && campoRevisado.current) {
      const origem = ultimoCampoRolado.current ?? campoOriginal.current;
      sincronizarRolagem(origem, origem === campoOriginal.current ? campoRevisado.current : campoOriginal.current);
    }
    definirRolagemConjunta(!rolagemConjunta);
  };

  const alterar = useCallback((campo: keyof TextoCapitulo, valor: string) => {
    alteracoes.current++;
    definirTexto(ant => ({ ...ant, [campo]: valor }));
    definirPendente(true);
    definirErroSalvar(false);
  }, []);

  useEffect(() => {
    if (!pendente && !salvando && !traduzindo) return;
    const avisar = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    const antesDeSair = (evento: Event) => { evento.preventDefault(); definirMensagem('Aguarde o salvamento do rascunho antes de sair.'); };
    window.addEventListener('beforeunload', avisar);
    window.addEventListener('ce-antes-sair', antesDeSair);
    return () => { window.removeEventListener('beforeunload', avisar); window.removeEventListener('ce-antes-sair', antesDeSair); };
  }, [pendente, salvando, traduzindo]);

  const salvar = useCallback(async (publicar = false) => {
    if (gravando.current || conflito) return;
    gravando.current = true; definirSalvando(true);
    const alteracaoEnviada = alteracoes.current;
    try {
      const resposta = await fetch('/api/livros/rascunho', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ livroId, capSlug: capitulo.slug, ...texto, versao, publicar }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        if (resposta.status === 409) definirConflito(true);
        throw new Error(dados.error);
      }
      definirVersao(dados.versao);
      if (alteracoes.current === alteracaoEnviada) definirPendente(false);
      definirErroSalvar(false);
      if (publicar) definirPublicado(true);
      definirMensagem(publicar ? 'Capítulo publicado.' : 'Rascunho salvo.');
    } catch (erro) {
      definirErroSalvar(true);
      definirMensagem(erro instanceof Error ? erro.message : 'Não foi possível salvar. Tente novamente.');
    } finally { gravando.current = false; definirSalvando(false); }
  }, [texto, livroId, capitulo.slug, versao, conflito]);

  const salvarAtual = useRef(salvar);
  useEffect(() => { salvarAtual.current = salvar; }, [salvar]);

  // Autosave após 1,5 s de inatividade
  useEffect(() => {
    if (!pendente || salvando || traduzindo || conflito || erroSalvar) return;
    const t = setTimeout(() => { void salvarAtual.current(); }, 1500);
    return () => clearTimeout(t);
  }, [pendente, salvando, traduzindo, conflito, erroSalvar]);

  useEffect(() => {
    if (!traduzindo) return;
    const temporizador = setInterval(() => { void salvarAtual.current(); }, 10000);
    return () => clearInterval(temporizador);
  }, [traduzindo]);

  const traduzir = async () => {
    if (controleTraducao.current || texto.textoRevisado.trim()) return;
    const controle = new AbortController(); controleTraducao.current = controle;
    definirTraduzindo(true); definirMensagem('Preparando tradução automática para revisão.');
    try {
      if (!texto.tituloRevisado.trim()) await traduzirTextoRevista(tituloOriginal, controle.signal, atual => alterar('tituloRevisado', atual));
      await traduzirTextoRevista(textoOriginal, controle.signal, (atual, feito, total) => { alterar('textoRevisado', atual); definirProgresso(`${feito} de ${total} trechos`); });
      definirMensagem('Tradução concluída. Revise antes de publicar.');
    } catch (erro) { definirMensagem(controle.signal.aborted ? 'Tradução interrompida. A parte já traduzida será salva como rascunho.' : erro instanceof Error ? erro.message : 'Não foi possível traduzir.'); }
    finally { controleTraducao.current = null; definirTraduzindo(false); }
  };

  const classeAcao = 'inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-full border px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-normal sm:whitespace-nowrap';
  const classeCampo = 'w-full rounded-lg border border-[var(--parchment-dark)] bg-[var(--surface)] px-3 py-2';

  return (
    <div>
      {/* Controles */}
      <section aria-label="Controles de revisão" className="rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] px-4 py-3 mb-5 font-sans">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <button type="button" disabled={salvando || traduzindo || conflito}
              onClick={() => { void salvar(); }}
              className={`${classeAcao} border-[var(--parchment-dark)] hover:bg-[var(--parchment-dark)]`}>
              {salvando ? 'Salvando…' : 'Salvar rascunho'}
            </button>
            <button type="button"
              disabled={salvando || traduzindo || conflito || !texto.tituloRevisado.trim() || !texto.textoRevisado.trim()}
              onClick={() => { void salvar(true); }}
              className={`${classeAcao} bg-[var(--gold)] border-[var(--gold)] text-white hover:bg-[#8d6210]`}>
              {publicado ? 'Publicar alterações' : 'Publicar capítulo'}
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <button type="button" aria-pressed={rolagemConjunta} onClick={alternarRolagemConjunta}
              className={`${classeAcao} ${rolagemConjunta ? 'bg-[var(--parchment-dark)] border-[var(--gold)]' : 'border-[var(--parchment-dark)] text-[var(--ink-light)] hover:bg-[var(--parchment-dark)]'}`}>
              <span aria-hidden="true" className="inline-block w-4">{rolagemConjunta ? '✓' : '↕'}</span> Rolar juntos
            </button>
            <Link href={`/livros/${livroId}/${capitulo.slug}`} target="_blank"
              className="inline-flex min-h-10 items-center px-2 text-xs text-[var(--ink-light)] underline underline-offset-4">
              Ver página pública ↗
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-t border-[var(--parchment-dark)] mt-3 pt-2.5 text-xs leading-relaxed">
          <p role="status" className={erroSalvar ? 'text-red-700' : 'text-[var(--ink-light)]'}>{mensagem}</p>
          <span className="shrink-0 rounded-full bg-[var(--parchment)] px-2.5 py-1 text-[var(--ink-light)]">
            {pendente ? 'Alterações pendentes' : publicado ? 'Há uma versão pública' : 'Rascunho privado'}
          </span>
        </div>
      </section>

      {/* Navegação entre capítulos */}
      <div className="font-sans flex flex-wrap justify-between gap-3 text-xs text-[var(--gold)] mb-5">
        {anterior
          ? <Link href={`/admin/livros/${livroId}/${anterior.slug}`} className="underline">← {anterior.titulo}</Link>
          : <span />}
        {proximo
          ? <Link href={`/admin/livros/${livroId}/${proximo.slug}`} className="underline">{proximo.titulo} →</Link>
          : <span />}
      </div>

      {/* Editor lado a lado */}
      <div className="grid md:grid-cols-2 gap-5">
        <section className="card p-4 sm:p-6 min-w-0">
          <h2 className="text-xl mb-4">{emIngles ? 'Original em inglês' : 'Referência em português'}</h2>
          <label className="block font-sans text-sm mb-4">Título
            <input lang={emIngles ? 'en' : 'pt-BR'} readOnly maxLength={500}
              value={tituloOriginal}
              className={`${classeCampo} mt-2`} />
          </label>
          <label className="block font-sans text-sm">Texto
            <textarea ref={campoOriginal}
              onScroll={e => acompanharRolagem(e.currentTarget, campoRevisado.current)}
              lang={emIngles ? 'en' : 'pt-BR'} readOnly maxLength={300000}
              value={textoOriginal}
              className={`${classeCampo} mt-2 min-h-[55vh] text-base leading-relaxed resize-y opacity-70 cursor-default`} />
          </label>
          <p className="font-sans text-xs mt-2 text-[var(--ink-light)]">A referência permanece preservada. Edite sua tradução na outra coluna.</p>
        </section>
        <section className="card p-4 sm:p-6 min-w-0">
          <h2 className="text-xl mb-4">Sua tradução em português</h2>
          {emIngles && !traduzindo && !texto.textoRevisado.trim() && <button type="button" onClick={() => { void traduzir(); }} disabled={salvando || conflito} className="font-sans min-h-11 mb-3 text-sm underline">Traduzir automaticamente</button>}
          {traduzindo && <button type="button" onClick={() => controleTraducao.current?.abort()} className="font-sans min-h-11 mb-3 text-sm underline">Parar tradução · {progresso}</button>}
          <label className="block font-sans text-sm mb-4">Título revisado
            <input lang="pt-BR" disabled={traduzindo} maxLength={500}
              value={texto.tituloRevisado}
              onChange={e => alterar('tituloRevisado', e.target.value)}
              className={`${classeCampo} mt-2`} />
          </label>
          <label className="block font-sans text-sm">Texto revisado
            <textarea ref={campoRevisado}
              onScroll={e => acompanharRolagem(e.currentTarget, campoOriginal.current)}
              lang="pt-BR" disabled={traduzindo} maxLength={300000}
              value={texto.textoRevisado}
              onChange={e => alterar('textoRevisado', e.target.value)}
              placeholder="Edite o texto aqui. O original fica à esquerda para referência."
              className={`${classeCampo} mt-2 min-h-[55vh] text-base leading-relaxed resize-y`} />
          </label>
          <p className="font-sans text-xs mt-3 text-[var(--ink-light)]">Rascunhos são privados. A tradução automática envia o original ao MyMemory, sujeito a limite diário, e exige revisão. Clique em <strong>Publicar capítulo</strong> somente quando estiver pronto.</p>
        </section>
      </div>
    </div>
  );
}
