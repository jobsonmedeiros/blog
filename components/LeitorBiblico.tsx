"use client";
import { useEffect, useMemo, useState, useRef } from "react";

// Estrutura dos livros da Bíblia com número de capítulos
// id: ordem canônica dos livros — 1=Gênesis … 66=Apocalipse
import { LIVROS } from "@/data/books";
import type { BiblePassage as PassagemBiblica } from "@/lib/bible-links";
import AcoesDaPassagem from "@/components/PassageActions";
import { HIGHLIGHT_STORAGE_KEY as CHAVE_MARCA_TEXTOS, parseHighlights as lerMarcaTextos, passageHighlightKeys as chavesMarcaTextoPassagem, togglePassageHighlight as alternarMarcaTextoPassagem } from "@/lib/bible-highlights";
import { BIBLE_TRANSLATIONS as VERSOES_BIBLICAS, parseBibleTranslation as interpretarVersaoBiblica, type BibleTranslation as VersaoBiblica } from '@/lib/bible-translations';
import { useDarbyEmPortugues } from '@/components/useDarbyPortuguese';
import { REVISAO_TEXTO_BIBLICO } from '@/data/bible-revision';

type Verso = { verse: number; text: string; omitted?: boolean };

type Traducao = VersaoBiblica;

const memoriaACF = new Map<number, Promise<string[][]>>();
const memoriaARA = new Map<number, Promise<Array<Array<string | null>>>>();
const memoriaDarby = new Map<number, Promise<Array<Array<string | null>>>>();

async function buscarDarby(indiceLivro: number, numeroCapitulo: number): Promise<Verso[]> {
  let carregamento = memoriaDarby.get(indiceLivro);
  if (!carregamento) {
    carregamento = fetch(`/biblia/darby/${indiceLivro}.json`).then(resposta => {
      if (!resposta.ok) throw new Error('Darby local indisponível.');
      return resposta.json() as Promise<Array<Array<string | null>>>;
    });
    memoriaDarby.set(indiceLivro, carregamento);
    void carregamento.catch(() => memoriaDarby.delete(indiceLivro));
  }
  const textosRecebidos = (await carregamento)[numeroCapitulo - 1];
  if (!textosRecebidos?.length) throw new Error('Capítulo vazio.');
  return textosRecebidos.map((texto, indice) => ({ verse: indice + 1, text: texto?.trim() || '', omitted: texto === null }));
}

function buscarVersao(versaoSolicitada: Traducao, livroSolicitado: number, capituloSolicitado: number): Promise<Verso[]> {
  return versaoSolicitada === 'DBY' ? buscarDarby(livroSolicitado, capituloSolicitado) : versaoSolicitada === 'ACF' ? buscarACF(livroSolicitado, capituloSolicitado) : buscarARA(livroSolicitado, capituloSolicitado);
}

// ACF (Almeida Corrigida Fiel): um arquivo por livro em /public/biblia/acf/<índice>.json,
// para baixar só o livro aberto (~12–220 KB) em vez da Bíblia inteira (4 MB).
function carregarLivroACF(indiceLivro: number): Promise<string[][]> {
  let livro = memoriaACF.get(indiceLivro);
  if (!livro) {
    livro = fetch(`/biblia/acf/${indiceLivro}.json?v=${REVISAO_TEXTO_BIBLICO}`).then((respostaHttp) => {
      if (!respostaHttp.ok) throw new Error("Bíblia local indisponível");
      return respostaHttp.json() as Promise<string[][]>;
    });
    livro.catch(() => memoriaACF.delete(indiceLivro));
    memoriaACF.set(indiceLivro, livro);
  }
  return livro;
}

async function buscarACF(indiceLivro: number, numeroCapitulo: number): Promise<Verso[]> {
  const capitulos = await carregarLivroACF(indiceLivro);
  const textos = capitulos[numeroCapitulo - 1];
  if (!textos || textos.length === 0) throw new Error("Capítulo vazio");
  return textos.map((texto, indice) => ({ verse: indice + 1, text: texto.trim() }));
}

// ARA: cópia local conferida da edição SBB, com origem e hashes em /biblia/ara/source.json.
async function buscarARA(indiceLivro: number, numeroCapitulo: number): Promise<Verso[]> {
  let carregamento = memoriaARA.get(indiceLivro);
  if (!carregamento) {
    carregamento = fetch(`/biblia/ara/${indiceLivro}.json?v=${REVISAO_TEXTO_BIBLICO}`).then(resposta => {
      if (!resposta.ok) throw new Error('Bíblia ARA local indisponível.');
      return resposta.json() as Promise<Array<Array<string | null>>>;
    });
    memoriaARA.set(indiceLivro, carregamento);
    void carregamento.catch(() => memoriaARA.delete(indiceLivro));
  }
  const textos = (await carregamento)[numeroCapitulo - 1];
  if (!textos?.length) throw new Error('Capítulo vazio.');
  return textos.map((texto, indice) => ({ verse: indice + 1, text: texto?.trim() || '', omitted: texto === null }));
}

function normalizar(textoRecebido: string) {
  return textoRecebido
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function lerEstadoInicial(destino: PassagemBiblica | null, versao?: VersaoBiblica): { fonte: number; livro: number; numeroCapitulo: number; traducao: Traducao } {
  let fonte = 21;
  let traducao: Traducao = versao ?? "ACF";
  try {
    const fonteSalva = Number(localStorage.getItem("ce-fonte"));
    if (fonteSalva >= 14 && fonteSalva <= 28) fonte = fonteSalva;
    const traducaoSalva = localStorage.getItem("ce-traducao");
    traducao = versao ?? interpretarVersaoBiblica(traducaoSalva) ?? 'ACF';
    // Um link de versículo tem prioridade sobre a posição e tradução salvas.
    if (destino) return { fonte, livro: destino.livro, numeroCapitulo: destino.capitulo, traducao: versao ?? "ACF" };
    // Posição salva tem prioridade; primeira visita abre em 1 João 1 (NT).
    if (localStorage.getItem("ce-livro") === null) {
      return { fonte, livro: 61, numeroCapitulo: 1, traducao };
    }
    const indiceVersiculo = Number(localStorage.getItem("ce-livro"));
    const capituloSalvo = Number(localStorage.getItem("ce-cap"));
    if (Number.isInteger(indiceVersiculo) && indiceVersiculo >= 0 && indiceVersiculo < LIVROS.length) {
      const numeroCapitulo = Number.isInteger(capituloSalvo) && capituloSalvo >= 1 && capituloSalvo <= LIVROS[indiceVersiculo].caps ? capituloSalvo : 1;
      return { fonte, livro: indiceVersiculo, numeroCapitulo, traducao };
    }
  } catch {
    /* localStorage indisponível: segue com o padrão */
  }
  return destino
    ? { fonte, livro: destino.livro, numeroCapitulo: destino.capitulo, traducao: versao ?? "ACF" }
    : { fonte, livro: 61, numeroCapitulo: 1, traducao };
}

export default function LeitorBiblico({ destino, versao, portugues = false }: { destino: PassagemBiblica | null; versao?: VersaoBiblica; portugues?: boolean }) {
  const [inicial] = useState(() => lerEstadoInicial(destino, versao));
  const [darbyPortugues, definirDarbyPortugues] = useState(portugues);
  const [selecao, definirSelecao] = useState<PassagemBiblica | null>(destino);
  const [marcacoes, definirMarcacoes] = useState<string[]>(() => {
    try { return lerMarcaTextos(localStorage.getItem(CHAVE_MARCA_TEXTOS)); }
    catch { return []; }
  });
  const [avisoMarcacao, definirAvisoMarcacao] = useState("");
  const versiculoAlvo = useRef<HTMLElement | null>(null);
  const recipienteLeitura = useRef<HTMLDivElement | null>(null);
  const cabecalhoLeitura = useRef<HTMLDivElement | null>(null);
  const painelDaSelecao = useRef<HTMLDivElement | null>(null);
  const referenciaNavegacaoCapitulos = useRef<HTMLDivElement | null>(null);
  const posicionouVersiculo = useRef(false);
  const [alturaLeitura, definirAlturaLeitura] = useState(0);
  const identificadorCarregamento = useRef(0);
  const [indiceLivroAtual, definirIndiceLivroAtual] = useState(inicial.livro);
  const [capitulo, definirCapitulo] = useState(inicial.numeroCapitulo);
  // Primeira visita abre em 1 João 1; posição salva tem prioridade.
  const [versos, definirVersos] = useState<Verso[]>([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState("");
  const [fonte, definirFonte] = useState(inicial.fonte);
  const [traducao, definirTraducao] = useState<Traducao>(inicial.traducao);
  const [painel, definirPainel] = useState<"livros" | "caps">("livros");
  const [atAberto, definirAtAberto] = useState(inicial.livro < 39);
  const [ntAberto, definirNtAberto] = useState(inicial.livro >= 39);
  const [busca, definirBusca] = useState("");
  const [navegacaoAberta, definirNavegacaoAberta] = useState(false);
  const emPortugues = traducao === 'DBY' && darbyPortugues;
  const auxilioDarbyPortugues = useDarbyEmPortugues(emPortugues && !carregando, indiceLivroAtual, capitulo, versos);
  const traducaoAutomatica = emPortugues && Object.values(auxilioDarbyPortugues.trechos).some(trecho => trecho.source === 'automatic');
  const textoExibido = (versiculoOriginal: Verso) => emPortugues ? auxilioDarbyPortugues.trechos[versiculoOriginal.verse]?.text ?? versiculoOriginal.text : versiculoOriginal.text;

  const livro = LIVROS[indiceLivroAtual];
  const referencia = `${livro.nome} ${capitulo}`;
  const destacar = selecao !== null && indiceLivroAtual === selecao.livro && capitulo === selecao.capitulo;
  const destinoNoCapitulo = destino !== null && indiceLivroAtual === destino.livro && capitulo === destino.capitulo;
  const marcados = new Set(marcacoes);
  const versosSelecionados = destacar ? versos.filter(versiculo => !versiculo.omitted && versiculo.verse >= selecao.versiculo && versiculo.verse <= selecao.ate) : [];
  const referenciaSelecionada = destacar
    ? `${livro.nome} ${capitulo}:${selecao.versiculo}${selecao.ate !== selecao.versiculo ? `-${selecao.ate}` : ""}`
    : "";

  const selecionarVersiculo = (numero: number, estender = false) => {
    definirAvisoMarcacao("");
    definirSelecao(anterior => {
      const nesteCapitulo = anterior !== null && anterior.livro === indiceLivroAtual && anterior.capitulo === capitulo;
      if (!estender && nesteCapitulo && numero >= anterior.versiculo && numero <= anterior.ate) return null;
      return {
        livro: indiceLivroAtual, capitulo,
        versiculo: estender && nesteCapitulo ? Math.min(anterior.versiculo, numero) : numero,
        ate: estender && nesteCapitulo ? Math.max(anterior.ate, numero) : numero,
      };
    });
  };

  const alternarMarcacao = () => {
    if (!destacar) return;
    const proximas = alternarMarcaTextoPassagem(marcacoes, selecao);
    definirMarcacoes(proximas);
    try {
      localStorage.setItem(CHAVE_MARCA_TEXTOS, JSON.stringify(proximas));
      definirAvisoMarcacao('Marca-texto atualizado e salvo neste navegador.');
    } catch { definirAvisoMarcacao('Marca-texto atualizado nesta sessão. O navegador não permitiu salvar.'); }
  };

  useEffect(() => {
    const cabecalho = cabecalhoLeitura.current;
    const recipiente = recipienteLeitura.current;
    if (!cabecalho || !recipiente) return;
    const medir = () => recipiente.style.setProperty('--altura-cabecalho-leitura', `${cabecalho.getBoundingClientRect().height}px`);
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(cabecalho);
    return () => observador.disconnect();
  }, []);

  // A abertura e a expansão das ações não podem esconder o início da passagem.
  useEffect(() => {
    const painel = painelDaSelecao.current;
    const cabecalho = cabecalhoLeitura.current;
    const versiculo = destacar && selecao
      ? recipienteLeitura.current?.querySelector<HTMLElement>(`[data-verse="${selecao.versiculo}"]`)
      : null;
    if (!painel || !cabecalho || !versiculo || carregando) return;
    let quadro = 0;
    const manterVisivel = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const limiteSuperior = cabecalho.getBoundingClientRect().bottom + painel.getBoundingClientRect().height + 28;
        const limiteInferior = referenciaNavegacaoCapitulos.current?.getBoundingClientRect().top ?? window.innerHeight;
        const posicao = versiculo.getBoundingClientRect();
        if (posicao.top < limiteSuperior || posicao.top > limiteInferior - 32) {
          window.scrollBy({ top: posicao.top - limiteSuperior, behavior: 'instant' });
        }
      });
    };
    const observador = new ResizeObserver(manterVisivel);
    observador.observe(painel);
    observador.observe(cabecalho);
    manterVisivel();
    return () => { cancelAnimationFrame(quadro); observador.disconnect(); };
  }, [selecao, destacar, carregando]);

  useEffect(() => {
    if (carregando || !destinoNoCapitulo || !versiculoAlvo.current || posicionouVersiculo.current) return;
    const quadroAtualizacao = requestAnimationFrame(() => {
      posicionouVersiculo.current = true;
      versiculoAlvo.current?.scrollIntoView({ block: "center", behavior: "instant" });
      versiculoAlvo.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(quadroAtualizacao);
  }, [carregando, destinoNoCapitulo, versos]);

  // Reserva espaço para o player acima dos botões de capítulos, incluindo tablets
  // e alterações de altura por quebra de linha ou tamanho de fonte do navegador.
  useEffect(() => {
    const navegacaoCapitulos = referenciaNavegacaoCapitulos.current;
    if (!navegacaoCapitulos) return;
    const medirAltura = () => document.documentElement.style.setProperty('--altura-navegacao-capitulos', `${navegacaoCapitulos.getBoundingClientRect().height}px`);
    medirAltura();
    const observadorAltura = new ResizeObserver(medirAltura);
    observadorAltura.observe(navegacaoCapitulos);
    return () => {
      observadorAltura.disconnect();
      document.documentElement.style.removeProperty('--altura-navegacao-capitulos');
    };
  }, [versos]);

  // Carrega o capítulo inicial (1 João 1 ou posição salva) na tradução salva.
  useEffect(() => {
    const atual = ++identificadorCarregamento.current;
    let cancelado = false;
    const buscar = buscarVersao(inicial.traducao, inicial.livro, inicial.numeroCapitulo);
    buscar
      .then((versiculosRecebidos) => { if (!cancelado && atual === identificadorCarregamento.current) definirVersos(versiculosRecebidos); })
      .catch(() => { if (!cancelado && atual === identificadorCarregamento.current) definirErro("Não foi possível carregar o capítulo. Verifique sua conexão."); })
      .finally(() => { if (!cancelado && atual === identificadorCarregamento.current) definirCarregando(false); });
    return () => { cancelado = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const salvarPosicao = (indiceLivro: number, numeroCapitulo: number) => {
    try {
      localStorage.setItem("ce-livro", String(indiceLivro));
      localStorage.setItem("ce-cap", String(numeroCapitulo));
    } catch {
      /* ignora */
    }
  };

  const mudarFonte = (nova: number) => {
    const versiculo = Math.min(28, Math.max(14, nova));
    definirFonte(versiculo);
    try {
      localStorage.setItem("ce-fonte", String(versiculo));
    } catch {
      /* ignora */
    }
  };

  const carregar = async (indiceLivro: number, numeroCapitulo: number, versaoEscolhida: Traducao = traducao) => {
    const atual = ++identificadorCarregamento.current;
    definirAlturaLeitura(recipienteLeitura.current?.getBoundingClientRect().height ?? 0);
    definirCarregando(true);
    definirErro("");
    definirVersos([]);
    try {
      const versosNovos = await buscarVersao(versaoEscolhida, indiceLivro, numeroCapitulo);
      if (atual !== identificadorCarregamento.current) return;
      definirVersos(versosNovos);
      salvarPosicao(indiceLivro, numeroCapitulo);
    } catch {
      if (atual === identificadorCarregamento.current) definirErro("Não foi possível carregar o capítulo. Verifique sua conexão.");
    } finally {
      if (atual === identificadorCarregamento.current) definirCarregando(false);
    }
  };

  const trocarTraducao = (traducaoSalva: Traducao) => {
    if (traducaoSalva === traducao) return;
    definirTraducao(traducaoSalva);
    try {
      localStorage.setItem("ce-traducao", traducaoSalva);
    } catch {
      /* ignora */
    }
    void carregar(indiceLivroAtual, capitulo, traducaoSalva);
  };

  const selecionarLivro = (indiceVersiculo: number) => {
    definirIndiceLivroAtual(indiceVersiculo);
    definirCapitulo(1);
    definirPainel("caps");
    // Trocar de livro tem que trocar o texto na hora: carrega o capítulo 1
    // do livro novo (antes só trocava a aba, e o texto antigo ficava na tela).
    void carregar(indiceVersiculo, 1);
    definirNavegacaoAberta(false);
  };

  const selecionarCapitulo = (numeroCapitulo: number) => {
    definirCapitulo(numeroCapitulo);
    void carregar(indiceLivroAtual, numeroCapitulo);
    definirNavegacaoAberta(false);
  };

  // Navega entre capítulos atravessando a fronteira entre livros
  const navegar = (variacao: 1 | -1) => {
    let indiceLivro = indiceLivroAtual;
    let numeroCapitulo = capitulo + variacao;
    if (numeroCapitulo < 1) {
      if (indiceLivro === 0) return;
      indiceLivro -= 1;
      numeroCapitulo = LIVROS[indiceLivro].caps;
    } else if (numeroCapitulo > livro.caps) {
      if (indiceLivro === LIVROS.length - 1) return;
      indiceLivro += 1;
      numeroCapitulo = 1;
    }
    definirIndiceLivroAtual(indiceLivro);
    definirCapitulo(numeroCapitulo);
    void carregar(indiceLivro, numeroCapitulo);
  };

  const termo = normalizar(busca.trim());
  const filtrar = (lista: typeof LIVROS) =>
    termo ? lista.filter((livroListado) => normalizar(livroListado.nome).includes(termo)) : lista;

  const livrosAntigoTestamento = useMemo(
    () => filtrar(LIVROS.filter((livroListado) => livroListado.testamento === "AT")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [termo]
  );
  const livrosNovoTestamento = useMemo(
    () => filtrar(LIVROS.filter((livroListado) => livroListado.testamento === "NT")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [termo]
  );

  const rotuloAnterior =
    capitulo > 1
      ? `← ${livro.nome} ${capitulo - 1}`
      : indiceLivroAtual > 0
        ? `← ${LIVROS[indiceLivroAtual - 1].nome} ${LIVROS[indiceLivroAtual - 1].caps}`
        : "← Início";
  const rotuloProximo =
    capitulo < livro.caps
      ? `${livro.nome} ${capitulo + 1} →`
      : indiceLivroAtual < LIVROS.length - 1
        ? `${LIVROS[indiceLivroAtual + 1].nome} 1 →`
        : "Fim →";
  const noInicio = indiceLivroAtual === 0 && capitulo <= 1 && versos.length === 0;
  const noFim =
    indiceLivroAtual === LIVROS.length - 1 && capitulo >= livro.caps && versos.length > 0;

  // Marcador recolhível de testamento (Antigo/Novo). Com busca ativa, abre sozinho.
  const renderizarTestamento = (
    lista: typeof LIVROS,
    titulo: string,
    aberto: boolean,
    alternar: () => void
  ) => {
    const expandido = termo ? lista.length > 0 : aberto;
    return (
      <div key={titulo}>
        <button
          onClick={alternar}
          aria-expanded={expandido}
          className="w-full flex items-center justify-between gap-1 px-2 py-2 mt-1 rounded font-sans text-[13px] uppercase tracking-wide transition-colors"
          style={{ color: "var(--gold)", background: expandido ? "rgba(169,120,24,0.08)" : "transparent" }}
        >
          <span>
            {titulo} · {lista.length}
          </span>
          <span aria-hidden style={{ fontSize: "0.9em" }}>
            {expandido ? "▾" : "▸"}
          </span>
        </button>
        {expandido && (
          <div>
            {lista.length === 0 && (
              <p className="font-sans text-sm px-3 py-2" style={{ color: "var(--ink-light)" }}>
                Nenhum livro encontrado.
              </p>
            )}
            {lista.map((livroListado) => {
              const indiceVersiculo = LIVROS.indexOf(livroListado);
              const ativo = indiceLivroAtual === indiceVersiculo;
              return (
                <button
                  key={livroListado.id}
                  onClick={() => selecionarLivro(indiceVersiculo)}
                  aria-current={ativo ? "true" : undefined}
                  className="w-full text-left px-2 py-2 rounded font-sans text-base leading-snug transition-colors"
                  style={{
                    background: ativo ? "var(--parchment-dark)" : "transparent",
                    color: ativo ? "var(--gold)" : "var(--ink)",
                    fontWeight: ativo ? 600 : 400,
                  }}
                >
                  {livroListado.nome}
                  <span className="text-xs md:hidden lg:inline" style={{ color: "var(--ink-light)" }}> · {livroListado.caps} cap.</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col md:flex-row leitor-shell" style={{ minHeight: "70vh" }}>
      {/* Barra de navegação no mobile */}
      <div className="md:hidden border-b p-3" style={{ borderColor: "var(--parchment-dark)" }}>
        <button
          onClick={() => definirNavegacaoAberta((versiculo) => !versiculo)}
          aria-expanded={navegacaoAberta}
          className="w-full font-sans text-sm px-4 py-2.5 rounded-full border"
          style={{
            borderColor: "var(--gold)",
            color: navegacaoAberta ? "white" : "var(--gold)",
            background: navegacaoAberta ? "var(--gold)" : "transparent",
            fontWeight: 500,
          }}
        >
          {navegacaoAberta ? "✕ Fechar livros e capítulos" : "☰ Livros e capítulos"}
        </button>
      </div>

      {/* Painel lateral: colapsável no mobile, fixo com rolagem própria no desktop */}
      <aside
        className={`${navegacaoAberta ? "block" : "hidden"} md:block md:w-48 lg:w-56 flex-shrink-0 md:border-r md:sticky md:top-[var(--site-nav-height,4rem)] md:self-start md:max-h-[calc(100dvh-var(--site-nav-height,4rem))] md:overflow-y-auto overflow-y-auto`}
        style={{
          borderColor: "var(--parchment-dark)",
          background: "var(--parchment)",
          maxHeight: navegacaoAberta ? "60vh" : undefined,
        }}
      >
        <div className="flex border-b" style={{ borderColor: "var(--parchment-dark)" }}>
          {(["livros", "caps"] as const).map((aba) => (
            <button
              key={aba}
              onClick={() => definirPainel(aba)}
              className="flex-1 py-2.5 font-sans text-sm uppercase tracking-wide transition-colors"
              style={{
                background: painel === aba ? "white" : "transparent",
                color: painel === aba ? "var(--gold)" : "var(--ink-light)",
                fontWeight: painel === aba ? 600 : 400,
                borderBottom: painel === aba ? "2px solid var(--gold)" : "none",
              }}
            >
              {aba === "livros" ? "Livros" : "Capítulos"}
            </button>
          ))}
        </div>

        {painel === "livros" && (
          <div className="p-2">
            <div className="px-1 pb-2 pt-1">
              <label htmlFor="busca-livro" className="sr-only">
                Buscar livro
              </label>
              <input
                id="busca-livro"
                type="search"
                value={busca}
                onChange={(evento) => definirBusca(evento.target.value)}
                placeholder="Buscar livro…"
                className="w-full font-sans text-base px-2 py-2 rounded border"
                style={{
                  borderColor: "var(--parchment-dark)",
                  background: "white",
                  color: "var(--ink)",
                }}
              />
            </div>
            {renderizarTestamento(livrosAntigoTestamento, "Antigo Testamento", atAberto, () => definirAtAberto((versiculo) => !versiculo))}
            {renderizarTestamento(livrosNovoTestamento, "Novo Testamento", ntAberto, () => definirNtAberto((versiculo) => !versiculo))}
          </div>
        )}

        {painel === "caps" && (
          <div className="p-3">
            <p className="font-sans text-base font-semibold mb-1" style={{ color: "var(--ink)" }}>
              {livro.nome}
            </p>
            <p className="font-sans text-sm mb-3" style={{ color: "var(--ink-light)" }}>
              {livro.caps} {livro.caps === 1 ? "capítulo" : "capítulos"} · {livro.testamento === "AT" ? "Antigo" : "Novo"} Testamento
            </p>
            <div className="grid grid-cols-5 md:grid-cols-4 gap-1">
              {Array.from({ length: livro.caps }, (_, indice) => indice + 1).map((capituloSalvo) => {
                const ativo = capitulo === capituloSalvo && versos.length > 0;
                return (
                  <button
                    key={capituloSalvo}
                    onClick={() => selecionarCapitulo(capituloSalvo)}
                    aria-current={ativo ? "true" : undefined}
                    className="min-h-10 py-1.5 rounded font-sans text-base transition-colors"
                    style={{
                      background: ativo ? "var(--gold)" : "var(--parchment-dark)",
                      color: ativo ? "white" : "var(--ink)",
                      fontWeight: capitulo === capituloSalvo ? 600 : 400,
                    }}
                  >
                    {capituloSalvo}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>

      {/* Área de leitura */}
      <div className="flex-1 min-w-0">
        {versos.length === 0 && !carregando && !erro && (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
            <div className="text-5xl mb-4" style={{ color: "var(--parchment-dark)" }} aria-hidden>
              📖
            </div>
            <p className="text-2xl mb-2" style={{ color: "var(--ink-light)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}>
              Selecione um livro e capítulo
            </p>
            <p className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
              Escolha no painel acima para começar a leitura
            </p>
          </div>
        )}

          <div ref={recipienteLeitura} className="px-4 pt-2 lg:px-6" aria-busy={carregando} style={{ minHeight: carregando && alturaLeitura ? `${alturaLeitura}px` : undefined }}>
            {/* Cabeçalho de leitura fixo: título + versão + fonte acompanham a rolagem */}
            <div ref={cabecalhoLeitura} className="sticky top-[var(--site-nav-height,4rem)] z-10 -mx-4 px-4 py-2 lg:-mx-6 lg:px-6" style={{ background: "var(--parchment)" }}>
              <section aria-label="Controles da leitura bíblica" className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1 rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] px-2 py-2 sm:px-3">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <h2
                  className="min-w-0 break-words text-xl font-semibold"
                  style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
                >
                  {referencia}
                  {traducaoAutomatica && <span className="inline-block align-middle ml-2 rounded-full bg-[var(--parchment-dark)] px-2 py-1 font-sans text-[11px] font-normal leading-tight text-[var(--ink-light)]">Tradução automática</span>}
                </h2>
                {traducao === 'DBY' && (
                  <div role="group" aria-label="Idioma da Bíblia Darby" className="flex items-center gap-1 font-sans">
                    <button type="button" onClick={() => definirDarbyPortugues(false)} aria-pressed={!darbyPortugues} className={`min-h-8 rounded-full border px-2.5 py-1 text-[11px] ${!darbyPortugues ? 'bg-[var(--ink)] text-[var(--gold-light)]' : 'border-[var(--parchment-dark)]'}`}>Inglês</button>
                    <button type="button" onClick={() => definirDarbyPortugues(true)} aria-pressed={darbyPortugues} className={`min-h-8 rounded-full border px-2.5 py-1 text-[11px] ${darbyPortugues ? 'bg-[var(--ink)] text-[var(--gold-light)]' : 'border-[var(--parchment-dark)]'}`}>Português</button>
                  </div>
                )}
              </div>
              <div role="group" aria-label="Tradução e tamanho da fonte" className="flex min-w-0 flex-nowrap items-center justify-between gap-1 sm:gap-4">
              <div className="flex min-w-0 flex-wrap items-center gap-1 sm:gap-1.5">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="hidden sm:inline font-sans text-xs" style={{ color: "var(--ink-light)" }}>
                  Versão:
                </span>
                {(['ACF', 'ARA', 'DBY'] as const).map((traducaoSalva) => (
                  <button
                    type="button"
                    key={traducaoSalva}
                    onClick={() => trocarTraducao(traducaoSalva)}
                    aria-pressed={traducao === traducaoSalva}
                    title={VERSOES_BIBLICAS[traducaoSalva].title}
                    className="inline-flex min-w-0 min-h-[44px] items-center justify-center whitespace-nowrap font-sans text-[11px] sm:text-xs px-1.5 sm:px-2.5 py-1.5 rounded-full border transition-colors"
                    style={{
                      borderColor: "var(--gold)",
                      background: traducao === traducaoSalva ? "var(--gold)" : "transparent",
                      color: traducao === traducaoSalva ? "white" : "var(--gold)",
                      fontWeight: 600,
                    }}
                  >
                    {VERSOES_BIBLICAS[traducaoSalva].label}
                  </button>
                ))}
              </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
                <span className="hidden sm:inline font-sans text-xs" style={{ color: "var(--ink-light)" }}>
                  Fonte:
                </span>
                <button
                  onClick={() => mudarFonte(fonte - 2)}
                  aria-label="Diminuir tamanho da fonte"
                  className="font-sans text-sm w-[30px] sm:w-auto min-h-[44px] px-0 sm:px-2.5 py-1 rounded"
                  style={{ background: "var(--parchment-dark)", color: "var(--ink)" }}
                >
                  A−
                </button>
                <span className="font-sans text-[11px] sm:text-xs w-4 sm:w-8 text-center tabular-nums" style={{ color: "var(--ink-light)" }}>
                  {fonte}
                </span>
                <button
                  onClick={() => mudarFonte(fonte + 2)}
                  aria-label="Aumentar tamanho da fonte"
                  className="font-sans text-sm w-[30px] sm:w-auto min-h-[44px] px-0 sm:px-2.5 py-1 rounded"
                  style={{ background: "var(--parchment-dark)", color: "var(--ink)" }}
                >
                  A+
                </button>
              </div>
              </div>
                <p className="font-sans text-[11px] leading-snug" style={{ color: "var(--ink-light)" }}>
                  {traducao === "ACF" ? (
                    <>
                      Almeida Corrigida Fiel (ACF)
                    </>
                  ) : traducao === 'DBY' ? (
                    <>Darby Translation (1890) · <a href="https://ebible.org/engDBY/copyright.htm" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Fonte e créditos</a></>
                  ) : (
                    <>
                      Almeida Revista e Atualizada (ARA) ·{" "}
                      <a href="https://www.sbb.org.br/biblia/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", textDecoration: "underline" }}>
                        SBB ↗
                      </a>
                    </>
                  )}
                </p>
              </section>
            </div>

        {carregando && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-3xl mb-3 animate-pulse-soft" style={{ color: "var(--gold)" }} aria-hidden>
                ✦
              </div>
              <p className="font-sans text-sm" style={{ color: "var(--ink-light)" }} role="status">
                Carregando {livro.nome} {capitulo}…
              </p>
            </div>
          </div>
        )}

        {erro && (
          <div className="p-8 text-center">
            <p className="font-sans text-sm mb-4" style={{ color: "var(--burgundy)" }} role="alert">
              {erro}
            </p>
            <button
              onClick={() => carregar(indiceLivroAtual, capitulo)}
              className="font-sans text-sm px-4 py-2 rounded-full border"
              style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
            >
              Tentar novamente
            </button>
          </div>
        )}

            {versos.length > 0 && (<>
            {emPortugues && (auxilioDarbyPortugues.erroCapturado || auxilioDarbyPortugues.concluidos < auxilioDarbyPortugues.total) && (
              <section className="mt-3 font-sans text-xs leading-relaxed text-[var(--ink-light)]" aria-label="Progresso da tradução">
                <p role="status">{auxilioDarbyPortugues.erroCapturado || `${auxilioDarbyPortugues.concluidos} de ${auxilioDarbyPortugues.total} versículos traduzidos… Os trechos pendentes permanecem em inglês.`}</p>
                {auxilioDarbyPortugues.erroCapturado && <button type="button" onClick={auxilioDarbyPortugues.tentarNovamente} className="mt-2 underline underline-offset-4">Tentar novamente</button>}
              </section>
            )}



            <hr className="gold-divider" />

            {destacar && versosSelecionados.length > 0 && (
              <div ref={painelDaSelecao} className="sticky top-[calc(var(--site-nav-height,4rem)+var(--altura-cabecalho-leitura,10rem))] z-20 my-4 overflow-y-auto rounded-xl" style={{ maxHeight: 'max(4rem, calc(100dvh - var(--site-nav-height,4rem) - var(--altura-cabecalho-leitura,10rem) - var(--altura-rodape-leitura,4rem) - var(--altura-navegacao-capitulos,4rem) - 6rem))' }}>
              <AcoesDaPassagem
                key={`${referenciaSelecionada}:${traducao}`}
                passagem={selecao}
                referencia={referenciaSelecionada}
                texto={versosSelecionados.map(versiculo => `${textoExibido(versiculo)}${emPortugues && !auxilioDarbyPortugues.trechos[versiculo.verse] ? ' [original em inglês]' : ''}`).join(' ')}
                traducao={emPortugues ? (versosSelecionados.some(versiculo => !auxilioDarbyPortugues.trechos[versiculo.verse]) ? 'DBY · PT/EN (apoio)' : 'DBY · PT automático') : traducao}
                versaoLeitura={traducao}
                idiomaLeitura={emPortugues ? 'pt' : undefined}
                marcado={chavesMarcaTextoPassagem(selecao).every(chave => marcados.has(chave))}
                aoMarcar={alternarMarcacao}
                aoLimpar={() => { definirSelecao(null); definirAvisoMarcacao(''); }}
              />
              </div>
            )}
            <p className="font-sans text-xs text-[var(--ink-light)]" role="status">{avisoMarcacao}</p>
            <div className="bible-text" style={{ fontSize: `${fonte}px` }} onPointerUp={(evento) => {
              const selecaoTexto = window.getSelection();
              if (!selecaoTexto || selecaoTexto.isCollapsed) return;
              const obterElemento = (noSelecionado: Node | null) => noSelecionado instanceof Element ? noSelecionado : noSelecionado?.parentElement;
              const inicio = obterElemento(selecaoTexto.anchorNode)?.closest<HTMLElement>('[data-verse]');
              const fim = obterElemento(selecaoTexto.focusNode)?.closest<HTMLElement>('[data-verse]');
              if (!inicio || !fim || !evento.currentTarget.contains(inicio) || !evento.currentTarget.contains(fim)) return;
              const primeiro = Number(inicio.dataset.verse);
              const ultimo = Number(fim.dataset.verse);
              definirSelecao({ livro: indiceLivroAtual, capitulo, versiculo: Math.min(primeiro, ultimo), ate: Math.max(primeiro, ultimo) });
              definirAvisoMarcacao('');
            }}>
              {versos.map((versiculo) => versiculo.omitted ? (
                <span key={versiculo.verse} id={`versiculo-${versiculo.verse}`} ref={destinoNoCapitulo && versiculo.verse === destino.versiculo ? versiculoAlvo : undefined} tabIndex={-1} className="font-sans text-sm italic text-[var(--ink-light)]">
                  <sup className="verse-number">{versiculo.verse}</sup> [Este versículo não consta do texto desta edição.] {' '}
                </span>
              ) : (
                <span
                  key={versiculo.verse}
                  id={`versiculo-${versiculo.verse}`}
                  data-verse={versiculo.verse}
                  lang={traducao === 'DBY' ? (emPortugues && auxilioDarbyPortugues.trechos[versiculo.verse] ? 'pt-BR' : 'en') : 'pt-BR'}
                  ref={destinoNoCapitulo && versiculo.verse === destino.versiculo ? versiculoAlvo : undefined}
                  tabIndex={0}
                  role="button"
                  aria-pressed={destacar && versiculo.verse >= selecao.versiculo && versiculo.verse <= selecao.ate}
                  className={`bible-verse-selectable ${marcados.has(`${indiceLivroAtual}:${capitulo}:${versiculo.verse}`) ? "bible-verse-saved" : ""} ${destacar && versiculo.verse >= selecao.versiculo && versiculo.verse <= selecao.ate ? "bible-verse-highlight" : ""}`}
                  onClick={(evento) => {
                    if (window.getSelection()?.isCollapsed === false) return;
                    selecionarVersiculo(versiculo.verse, evento.shiftKey);
                  }}
                  onKeyDown={(evento) => {
                    if (evento.key !== 'Enter' && evento.key !== ' ') return;
                    evento.preventDefault();
                    selecionarVersiculo(versiculo.verse, evento.shiftKey);
                  }}
                  title={`${destacar && versiculo.verse >= selecao.versiculo && versiculo.verse <= selecao.ate ? 'Remover seleção de' : 'Selecionar'} ${livro.nome} ${capitulo}:${versiculo.verse}`}
                >
                  <sup className="verse-number">{versiculo.verse}</sup>
                  {textoExibido(versiculo)}
                  {' '}
                </span>
              ))}
            </div>

            {/* Navegação anterior/próximo fixa no rodapé da área de leitura */}
            <div ref={referenciaNavegacaoCapitulos} className="sticky bottom-[var(--altura-rodape-leitura,0px)] z-10 -mx-4 px-4 py-3 lg:-mx-6 lg:px-6 flex justify-between gap-3 mt-4" style={{ background: "var(--parchment)", borderTop: "1px solid var(--parchment-dark)" }}>
              <button
                onClick={() => navegar(-1)}
                disabled={noInicio}
                className="min-w-0 max-w-[48%] break-words font-sans text-xs sm:text-sm px-2 sm:px-4 py-2 rounded disabled:cursor-not-allowed"
                style={{
                  background: noInicio ? "var(--parchment-dark)" : "var(--ink)",
                  color: noInicio ? "var(--ink-light)" : "var(--gold-light)",
                  opacity: noInicio ? 0.5 : 1,
                }}
              >
                {rotuloAnterior}
              </button>
              <button
                onClick={() => navegar(1)}
                disabled={noFim}
                className="min-w-0 max-w-[48%] break-words font-sans text-xs sm:text-sm px-2 sm:px-4 py-2 rounded disabled:cursor-not-allowed"
                style={{
                  background: noFim ? "var(--parchment-dark)" : "var(--ink)",
                  color: noFim ? "var(--ink-light)" : "var(--gold-light)",
                  opacity: noFim ? 0.5 : 1,
                }}
              >
                {rotuloProximo}
              </button>
            </div>
            </>)}
          </div>
      </div>
    </div>
  );
}
