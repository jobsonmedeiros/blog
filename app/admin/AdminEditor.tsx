"use client";

import { FormEvent, useRef, useState, useEffect, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { authClient } from "@/lib/auth/client";
import { converterArtigoParaPainel, converterFormularioParaApi, type ArtigoDoPainel, type FormularioArtigo } from "@/lib/modelo-editor-artigo";
import { articleCategoryError as validarTemaArtigo, BUILT_IN_ARTICLE_CATEGORIES as TEMAS_ORIGINAIS_DOS_ARTIGOS, canonicalArticleCategory as padronizarTemaArtigo, uniqueArticleCategories as listarTemasUnicos } from '@/lib/article-categories';

type Propriedades = { artigosIniciais: ArtigoDoPainel[]; email: string };
type EstadoFormulario = FormularioArtigo;
type PainelInsercao = "link" | "image" | null;

const formularioVazio: EstadoFormulario = {
  titulo: "", categoria: "Reflexão", autor: "Conforto das Escrituras", tempoLeitura: "5 min",
  resumo: "", icone: "📖", conteudo: "", publicado: false,
};

export default function EditorAdministrativo({ artigosIniciais, email }: Propriedades) {
  const navegador = useRouter();
  const [artigos, definirArtigos] = useState(artigosIniciais);
  const [formulario, definirFormulario] = useState<EstadoFormulario>(formularioVazio);
  const [preVisualizacao, definirPreVisualizacao] = useState(false);
  const [alteracoesPendentes, definirAlteracoesPendentes] = useState(false);
  const [saindo, definirSaindo] = useState(false);
  const [mensagem, definirMensagem] = useState("");
  const [salvando, definirSalvando] = useState(false);
  const [criandoTema, definirCriandoTema] = useState(false);
  const [novoTema, definirNovoTema] = useState('');
  const [mensagemTema, definirMensagemTema] = useState('');
  const opcoesTema = listarTemasUnicos([...TEMAS_ORIGINAIS_DOS_ARTIGOS, ...artigos.map(artigoRecebido => artigoRecebido.categoria), formulario.categoria]);
  const referenciaConteudo = useRef<HTMLTextAreaElement>(null);
  const selecaoPendente = useRef<{ inicio: number; fim: number }>({ inicio: 0, fim: 0 });
  const [painelInsercao, definirPainelInsercao] = useState<PainelInsercao>(null);
  const [enderecoInsercao, definirEnderecoInsercao] = useState("");
  const [descricaoImagem, definirDescricaoImagem] = useState("Descrição da imagem");
  const [erroInsercao, definirErroInsercao] = useState("");

  useEffect(() => {
    if (!alteracoesPendentes) return;
    const avisarAlteracoesPendentes = (evento: BeforeUnloadEvent) => { evento.preventDefault(); };
    const antesDeSair = (evento: Event) => {
      if (!window.confirm('Sair e descartar as alterações ainda não salvas?')) evento.preventDefault();
    };
    window.addEventListener('beforeunload', avisarAlteracoesPendentes);
    window.addEventListener('ce-antes-sair', antesDeSair);
    return () => {
      window.removeEventListener('beforeunload', avisarAlteracoesPendentes);
      window.removeEventListener('ce-antes-sair', antesDeSair);
    };
  }, [alteracoesPendentes]);

  function formatarSelecao(antes: string, depois: string, textoPadrao: string) {
    definirAlteracoesPendentes(true);
    const campoTexto = referenciaConteudo.current;
    if (!campoTexto) return;
    const { selectionStart: inicio, selectionEnd: fim } = campoTexto;
    const selecionado = formulario.conteudo.slice(inicio, fim) || textoPadrao;
    const proximoConteudo = `${formulario.conteudo.slice(0, inicio)}${antes}${selecionado}${depois}${formulario.conteudo.slice(fim)}`;
    definirFormulario((atual) => ({ ...atual, conteudo: proximoConteudo }));
    requestAnimationFrame(() => {
      campoTexto.focus();
      campoTexto.setSelectionRange(inicio + antes.length, inicio + antes.length + selecionado.length);
    });
  }

  function inserirBloco(prefixo: string) {
    definirAlteracoesPendentes(true);
    const campoTexto = referenciaConteudo.current;
    if (!campoTexto) return;
    const { selectionStart: inicio, selectionEnd: fim } = campoTexto;
    const selecionado = formulario.conteudo.slice(inicio, fim);
    const substituicao = selecionado
      ? selecionado.split("\n").map((linha) => `${prefixo}${linha}`).join("\n")
      : prefixo;
    const inicioLinha = formulario.conteudo.lastIndexOf("\n", inicio - 1) + 1;
    const posicaoInsercao = selecionado ? inicio : inicioLinha;
    const proximoConteudo = `${formulario.conteudo.slice(0, posicaoInsercao)}${substituicao}${formulario.conteudo.slice(selecionado ? fim : posicaoInsercao)}`;
    definirFormulario((atual) => ({ ...atual, conteudo: proximoConteudo }));
    requestAnimationFrame(() => {
      campoTexto.focus();
      const selecaoTexto = posicaoInsercao + prefixo.length;
      if (selecionado) campoTexto.setSelectionRange(selecaoTexto, selecaoTexto + selecionado.length);
      else campoTexto.setSelectionRange(selecaoTexto, selecaoTexto);
    });
  }

  function continuarListaMarkdown(evento: ReactKeyboardEvent<HTMLTextAreaElement>) {
    const campoTexto = evento.currentTarget;
    if (evento.key !== "Enter" || evento.shiftKey || campoTexto.selectionStart !== campoTexto.selectionEnd) return;
    const posicaoAtual = campoTexto.selectionStart;
    const inicioLinha = formulario.conteudo.lastIndexOf("\n", posicaoAtual - 1) + 1;
    const textoAntesCursor = formulario.conteudo.slice(inicioLinha, posicaoAtual);
    const correspondencia = textoAntesCursor.match(/^(\s*)([-*+]|(\d+)\.)\s+(.*)$/);
    if (!correspondencia) return;

    evento.preventDefault();
    const [, recuo, marcadorLista, numeroLista, textoItem] = correspondencia;
    if (!textoItem.trim()) {
      const proximoConteudo = `${formulario.conteudo.slice(0, inicioLinha)}${formulario.conteudo.slice(posicaoAtual)}`;
      definirFormulario((atual) => ({ ...atual, conteudo: proximoConteudo }));
      requestAnimationFrame(() => {
        campoTexto.focus();
        campoTexto.setSelectionRange(inicioLinha, inicioLinha);
      });
      return;
    }

    const proximoMarcador = numeroLista ? `${Number(numeroLista) + 1}.` : marcadorLista;
    const trechoInserido = `\n${recuo}${proximoMarcador} `;
    const proximoConteudo = `${formulario.conteudo.slice(0, posicaoAtual)}${trechoInserido}${formulario.conteudo.slice(posicaoAtual)}`;
    definirFormulario((atual) => ({ ...atual, conteudo: proximoConteudo }));
    requestAnimationFrame(() => {
      campoTexto.focus();
      const proximaPosicao = posicaoAtual + trechoInserido.length;
      campoTexto.setSelectionRange(proximaPosicao, proximaPosicao);
    });
  }

  function abrirPainelInsercao(tipo: Exclude<PainelInsercao, null>) {
    const campoTexto = referenciaConteudo.current;
    if (!campoTexto) return;
    const { selectionStart: inicio, selectionEnd: fim } = campoTexto;
    selecaoPendente.current = { inicio, fim };
    definirEnderecoInsercao("https://");
    definirErroInsercao("");
    definirPainelInsercao(tipo);
  }

  function fecharPainelInsercao() {
    definirPainelInsercao(null);
    definirErroInsercao("");
  }

  function aplicarInsercao() {
    definirAlteracoesPendentes(true);
    if (!painelInsercao) return;
    let enderecoValidado: URL;
    try {
      enderecoValidado = new URL(enderecoInsercao.trim());
      if (enderecoValidado.protocol !== "http:" && enderecoValidado.protocol !== "https:") throw new Error("URL inválida");
    } catch {
      definirErroInsercao("Informe um endereço válido começando com https://.");
      return;
    }
    const campoTexto = referenciaConteudo.current;
    if (!campoTexto) return;
    const { inicio, fim } = selecaoPendente.current;
    const textoSelecionado = formulario.conteudo.slice(inicio, fim);
    const conteudoMarkdown = painelInsercao === "link"
      ? `[${textoSelecionado || "texto do link"}](${enderecoValidado.href})`
      : `![${descricaoImagem.trim() || "Descrição da imagem"}](${enderecoValidado.href})`;
    const proximoConteudo = `${formulario.conteudo.slice(0, inicio)}${conteudoMarkdown}${formulario.conteudo.slice(fim)}`;
    definirFormulario((atual) => ({ ...atual, conteudo: proximoConteudo }));
    fecharPainelInsercao();
    requestAnimationFrame(() => {
      campoTexto.focus();
      campoTexto.setSelectionRange(inicio + conteudoMarkdown.length, inicio + conteudoMarkdown.length);
    });
  }

  function editarArtigo(artigoRecebido: ArtigoDoPainel) {
    if (alteracoesPendentes && !window.confirm('Descartar as alterações ainda não salvas?')) return;
    definirFormulario({ ...artigoRecebido, publicado: Boolean(artigoRecebido.publicadoEm) });
    definirCriandoTema(false); definirNovoTema(''); definirMensagemTema('');
    definirAlteracoesPendentes(false);
    definirPreVisualizacao(false);
    definirMensagem("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function novoArtigo() {
    if (alteracoesPendentes && !window.confirm('Descartar as alterações ainda não salvas?')) return;
    definirFormulario(formularioVazio);
    definirCriandoTema(false); definirNovoTema(''); definirMensagemTema('');
    definirAlteracoesPendentes(false);
    definirPreVisualizacao(false);
    definirMensagem("");
  }

  function adicionarTema() {
    const erroCapturado = validarTemaArtigo(novoTema);
    if (erroCapturado) { definirMensagemTema(erroCapturado); return; }
    const temaSelecionado = padronizarTemaArtigo(novoTema, opcoesTema);
    definirFormulario(atual => ({ ...atual, category: temaSelecionado }));
    definirCriandoTema(false); definirNovoTema(''); definirMensagemTema(''); definirAlteracoesPendentes(true);
  }

  async function salvarArtigo(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (criandoTema) { definirMensagemTema('Adicione o novo tema ou cancele antes de salvar a postagem.'); return; }
    definirSalvando(true);
    definirMensagem("");

    try {
      const resposta = await fetch(formulario.id ? `/api/articles/${formulario.id}` : "/api/articles", {
        method: formulario.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(converterFormularioParaApi({ ...formulario, categoria: padronizarTemaArtigo(formulario.categoria, opcoesTema) })),
      });
      const resultado = await resposta.json();
      if (!resposta.ok) {
        if (resposta.status === 401) navegador.push("/login");
        definirMensagem(resultado.error || "Não foi possível salvar o artigo.");
        return;
      }

      const artigoRecebido = converterArtigoParaPainel(resultado);
      definirArtigos((atual) => formulario.id ? atual.map((itemAtual) => itemAtual.id === formulario.id ? artigoRecebido : itemAtual) : [artigoRecebido, ...atual]);
      definirFormulario({ ...artigoRecebido, publicado: Boolean(artigoRecebido.publicadoEm) });
      definirAlteracoesPendentes(false);
      definirMensagem(artigoRecebido.publicadoEm ? "Artigo publicado com sucesso." : "Rascunho salvo com sucesso.");
      navegador.refresh();
    } catch {
      definirMensagem("Não foi possível salvar o artigo. Verifique sua conexão e tente novamente.");
    } finally {
      definirSalvando(false);
    }
  }

  async function excluirArtigo(id: string) {
    if (!window.confirm("Excluir este artigo? Essa ação não pode ser desfeita.")) return;
    definirSalvando(true);
    try {
      const resposta = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const resultado = await resposta.json();
      if (!resposta.ok) {
        if (resposta.status === 401) navegador.push("/login");
        definirMensagem(resultado.error || "Não foi possível excluir o artigo.");
        return;
      }
      definirArtigos((atual) => atual.filter((artigoRecebido) => artigoRecebido.id !== id));
      if (formulario.id === id) { definirFormulario(formularioVazio); definirAlteracoesPendentes(false); definirCriandoTema(false); definirNovoTema(''); definirMensagemTema(''); }
      definirMensagem("Artigo excluído.");
    } catch {
      definirMensagem("Não foi possível excluir o artigo. Verifique sua conexão e tente novamente.");
    } finally { definirSalvando(false); }
  }

  async function sairDaConta() {
    if (alteracoesPendentes && !window.confirm('Sair e descartar as alterações ainda não salvas?')) return;
    definirSaindo(true);
    try {
      const resultado = await authClient.signOut();
      if (resultado.error) throw new Error('signout');
      definirAlteracoesPendentes(false);
      navegador.push('/login'); navegador.refresh();
    } catch { definirMensagem('Não foi possível sair agora. Tente novamente.'); }
    finally { definirSaindo(false); }
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.14em]" style={{ color: "var(--gold)" }}>Painel do autor</p>
          <h1 className="text-4xl mt-2" style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}>{formulario.id ? "Editar artigo" : "Seu espaço de escrita"}</h1>
          <p className="font-sans text-sm mt-1" style={{ color: "var(--ink-light)" }}>{email}</p>
        </div>
        <div className="flex gap-3 items-center">
          <Link href="/admin/revistas" onClick={(evento) => { if (alteracoesPendentes && !window.confirm('Descartar as alterações ainda não salvas?')) evento.preventDefault(); }} className="font-sans text-sm text-[var(--gold)]">Traduzir revistas</Link>
          <Link href="/estudos" onClick={(evento) => { if (alteracoesPendentes && !window.confirm('Descartar as alterações ainda não salvas?')) evento.preventDefault(); }} className="font-sans text-sm" style={{ color: "var(--gold)" }}>Ver estudos ↗</Link>
          <button disabled={saindo || salvando} onClick={sairDaConta} className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>Sair</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] gap-8">
        <form aria-busy={salvando} onChange={() => definirAlteracoesPendentes(true)} onSubmit={salvarArtigo} className="card p-6 md:p-8 flex flex-col gap-4">
          <fieldset disabled={salvando || saindo} className="contents">
          <div className="grid sm:grid-cols-[1fr_auto] gap-4">
            <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
              Título
              <input required value={formulario.titulo} onChange={(evento) => definirFormulario({ ...formulario, titulo: evento.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "var(--parchment-dark)" }} />
            </label>
            <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
              Ícone
              <input required value={formulario.icone} onChange={(evento) => definirFormulario({ ...formulario, icone: evento.target.value })} className="mt-1 w-20 rounded-lg border px-3 py-2.5 bg-white text-center" style={{ borderColor: "var(--parchment-dark)" }} />
            </label>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="font-sans text-sm" style={{ color: 'var(--ink-light)' }}>
              Tema da postagem
              <select required value={criandoTema ? '' : padronizarTemaArtigo(formulario.categoria, opcoesTema)} onChange={evento => {
                definirMensagemTema('');
                if (evento.target.value === '') { definirCriandoTema(true); definirNovoTema(''); }
                else { definirCriandoTema(false); definirFormulario(atual => ({ ...atual, categoria: evento.target.value })); }
              }} className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: 'var(--parchment-dark)' }}>
                {opcoesTema.map(temaSelecionado => <option key={temaSelecionado} value={temaSelecionado}>{temaSelecionado}</option>)}
                <option value="">+ Criar novo tema…</option>
              </select>
            </label>
            {([["autor", "Autor"], ["tempoLeitura", "Leitura"]] as const).map(([campo, rotulo]) => (
              <label key={campo} className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
                {rotulo}
                <input required value={formulario[campo]} onChange={(evento) => definirFormulario({ ...formulario, [campo]: evento.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "var(--parchment-dark)" }} />
              </label>
            ))}
          </div>
          {criandoTema && (
            <div className="rounded-lg border border-[var(--parchment-dark)] p-3">
              <label htmlFor="new-article-category" className="block font-sans text-sm text-[var(--ink-light)]">Nome do novo tema</label>
              <div className="mt-1 flex flex-wrap gap-2">
                <input id="new-article-category" autoFocus maxLength={80} value={novoTema} aria-invalid={Boolean(mensagemTema)} aria-describedby={mensagemTema ? 'article-category-error' : undefined} onChange={evento => { definirNovoTema(evento.target.value); definirMensagemTema(''); }} onKeyDown={evento => {
                  if (evento.key === 'Enter') { evento.preventDefault(); adicionarTema(); }
                }} placeholder="Ex.: Oração" className="min-w-0 flex-1 rounded-lg border border-[var(--parchment-dark)] px-3 py-2 bg-white font-sans text-sm" />
                <button type="button" className="btn-primary" onClick={adicionarTema}>Adicionar tema</button>
                <button type="button" className="font-sans text-sm px-2" onClick={() => { definirCriandoTema(false); definirNovoTema(''); definirMensagemTema(''); }}>Cancelar</button>
              </div>
            </div>
          )}
          {mensagemTema && <p id="article-category-error" className="font-sans text-sm text-[var(--burgundy)]" role="alert">{mensagemTema}</p>}
          <p className="font-sans text-xs text-[var(--ink-light)]">O tema é salvo com a postagem. Ao publicá-la, ele aparece automaticamente nos filtros de Artigos &amp; Reflexões. Temas de rascunhos ficam disponíveis apenas no painel.</p>
          <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
            Resumo
            <textarea required rows={3} value={formulario.resumo} onChange={(evento) => definirFormulario({ ...formulario, resumo: evento.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5 bg-white" style={{ borderColor: "var(--parchment-dark)" }} />
          </label>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="content" className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>Conteúdo em Markdown</label>
              <button type="button" onClick={() => definirPreVisualizacao(!preVisualizacao)} className="font-sans text-xs" style={{ color: "var(--gold)" }}>{preVisualizacao ? "Editar" : "Pré-visualizar"}</button>
            </div>
            {preVisualizacao ? (
              <div className="article-content min-h-96 rounded-lg border p-6 bg-white" style={{ borderColor: "var(--parchment-dark)" }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{formulario.conteudo || "*Comece a escrever seu artigo...*"}</ReactMarkdown>
              </div>
            ) : (
              <div className="relative">
                <div role="toolbar" aria-label="Formatação do artigo" className="flex flex-nowrap gap-1 overflow-x-auto rounded-t-lg border border-b-0 p-1.5 bg-[#f7f3eb]" style={{ borderColor: "var(--parchment-dark)", scrollbarWidth: "none" }}>
                  <BotaoFormatacao rotulo="Negrito" onClick={() => formatarSelecao("**", "**", "texto em negrito")}><strong>B</strong></BotaoFormatacao>
                  <BotaoFormatacao rotulo="Itálico" onClick={() => formatarSelecao("*", "*", "texto em itálico")}><em>I</em></BotaoFormatacao>
                  <BotaoFormatacao rotulo="Título" onClick={() => inserirBloco("## ")}>H2</BotaoFormatacao>
                  <BotaoFormatacao rotulo="Link" onClick={() => abrirPainelInsercao("link")}>Link</BotaoFormatacao>
                  <BotaoFormatacao rotulo="Imagem por endereço" onClick={() => abrirPainelInsercao("image")}>Imagem</BotaoFormatacao>
                  <BotaoFormatacao rotulo="Citação" onClick={() => inserirBloco("> ")}>❝</BotaoFormatacao>
                  <BotaoFormatacao rotulo="Lista" onClick={() => inserirBloco("- ")}>Lista</BotaoFormatacao>
                </div>
                {painelInsercao && (
                  <div role="group" aria-label={painelInsercao === "link" ? "Inserir link" : "Inserir imagem"} onKeyDown={(evento) => { if (evento.key === "Escape") fecharPainelInsercao(); }} className="absolute left-2 right-2 top-12 z-20 grid gap-3 rounded-lg border p-3 bg-white shadow-xl sm:grid-cols-[1fr_auto]" style={{ borderColor: "var(--parchment-dark)" }}>
                    <div className="flex justify-end sm:col-span-2">
                      <button type="button" aria-label="Fechar painel" title="Fechar" onClick={fecharPainelInsercao} className="h-8 w-8 rounded-md font-sans text-lg hover:bg-[#f7f3eb]" style={{ color: "var(--ink-light)" }}>×</button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-1">
                      <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
                        Endereço da {painelInsercao === "link" ? "página" : "imagem"}
                        <input type="url" required autoFocus value={enderecoInsercao} onChange={(evento) => { definirEnderecoInsercao(evento.target.value); definirErroInsercao(""); }} placeholder="https://..." className="mt-1 w-full rounded-lg border px-3 py-2 bg-white" style={{ borderColor: "var(--parchment-dark)" }} />
                      </label>
                      {painelInsercao === "image" && (
                        <label className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
                          Descrição da imagem
                          <input value={descricaoImagem} onChange={(evento) => definirDescricaoImagem(evento.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 bg-white" style={{ borderColor: "var(--parchment-dark)" }} />
                        </label>
                      )}
                      {erroInsercao && <p role="alert" className="font-sans text-sm" style={{ color: "var(--burgundy)" }}>{erroInsercao}</p>}
                    </div>
                    <div className="flex gap-2 sm:items-end">
                      <button type="button" onClick={fecharPainelInsercao} className="font-sans text-sm px-3 py-2" style={{ color: "var(--ink-light)" }}>Cancelar</button>
                      <button type="button" onClick={aplicarInsercao} className="btn-primary">Inserir {painelInsercao === "link" ? "link" : "imagem"}</button>
                    </div>
                  </div>
                )}
                <textarea ref={referenciaConteudo} id="content" required rows={18} value={formulario.conteudo} onChange={(evento) => definirFormulario({ ...formulario, conteudo: evento.target.value })} onKeyDown={continuarListaMarkdown} placeholder={"# Título do artigo\n\nEscreva aqui; selecione um trecho e use os botões de formatação."} className="writing-area w-full rounded-b-lg border px-5 py-5 bg-white" style={{ borderColor: "var(--parchment-dark)" }} />
                <p className="font-sans text-xs mt-1" style={{ color: "var(--ink-light)" }}>Para inserir uma imagem, use o endereço público dela (URL).</p>
              </div>
            )}
          </div>
          <label className="font-sans text-sm flex items-center gap-2" style={{ color: "var(--ink-light)" }}>
            <input type="checkbox" checked={formulario.publicado} onChange={(evento) => definirFormulario({ ...formulario, publicado: evento.target.checked })} />
            Publicar imediatamente na página de Estudos
          </label>
          {mensagem && <p className="font-sans text-sm" role="status" style={{ color: mensagem.includes("sucesso") || mensagem.includes("excluído") ? "var(--olive)" : "var(--burgundy)" }}>{mensagem}</p>}
          <div className="flex gap-3 flex-wrap">
            <button type="button" className="font-sans text-sm px-4 py-2 rounded-lg border" onClick={() => definirPreVisualizacao(!preVisualizacao)}>{preVisualizacao ? "Continuar escrevendo" : "Pré-visualizar post"}</button>
            <button type="submit" className="btn-primary" disabled={salvando}>{salvando ? "Salvando..." : formulario.publicado ? "Salvar e publicar" : "Salvar rascunho"}</button>
            {formulario.id && <button type="button" onClick={novoArtigo} className="font-sans text-sm px-4" style={{ color: "var(--ink-light)" }}>Novo artigo</button>}
          </div>
          </fieldset>
        </form>

        <aside>
          <h2 className="text-2xl mb-4" style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}>Seus artigos</h2>
          <div className="flex flex-col gap-3">
            {artigos.length === 0 && <p className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>Você ainda não publicou nenhum artigo.</p>}
            {artigos.map((artigoRecebido) => (
              <div key={artigoRecebido.id} className="card p-4">
                <div className="flex gap-2 items-start">
                  <span>{artigoRecebido.icone}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-tight" style={{ color: "var(--ink)" }}>{artigoRecebido.titulo}</h3>
                    <p className="font-sans text-xs mt-1" style={{ color: "var(--ink-light)" }}>{artigoRecebido.publicadoEm ? "Publicado" : "Rascunho"} · {padronizarTemaArtigo(artigoRecebido.categoria, opcoesTema)}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-3 font-sans text-xs">
                  <button disabled={salvando} onClick={() => editarArtigo(artigoRecebido)} style={{ color: "var(--gold)" }}>Editar</button>
                  {artigoRecebido.publicadoEm && <Link href={`/estudos/${artigoRecebido.slug}`} style={{color:"var(--gold)"}}>Ver post ↗</Link>}
                  <button disabled={salvando} onClick={() => excluirArtigo(artigoRecebido.id)} style={{ color: "var(--burgundy)" }}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function BotaoFormatacao({ rotulo, onClick, children }: { rotulo: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={rotulo} title={rotulo} onMouseDown={(evento) => evento.preventDefault()} onClick={onClick} className="min-w-8 h-8 shrink-0 px-1.5 rounded-md border bg-white font-sans text-sm hover:bg-[#fffaf0]" style={{ borderColor: "var(--parchment-dark)", color: "var(--ink)" }}>
      {children}
    </button>
  );
}
