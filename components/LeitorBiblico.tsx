"use client";
import { useEffect, useMemo, useState } from "react";

// Estrutura dos livros da Bíblia com número de capítulos
// id: ordem canônica usada pela API bolls.life (ARA) — 1=Gênesis … 66=Apocalipse
const LIVROS = [
  { nome: "Gênesis", id: 1, caps: 50, testamento: "AT" },
  { nome: "Êxodo", id: 2, caps: 40, testamento: "AT" },
  { nome: "Levítico", id: 3, caps: 27, testamento: "AT" },
  { nome: "Números", id: 4, caps: 36, testamento: "AT" },
  { nome: "Deuteronômio", id: 5, caps: 34, testamento: "AT" },
  { nome: "Josué", id: 6, caps: 24, testamento: "AT" },
  { nome: "Juízes", id: 7, caps: 21, testamento: "AT" },
  { nome: "Rute", id: 8, caps: 4, testamento: "AT" },
  { nome: "1 Samuel", id: 9, caps: 31, testamento: "AT" },
  { nome: "2 Samuel", id: 10, caps: 24, testamento: "AT" },
  { nome: "1 Reis", id: 11, caps: 22, testamento: "AT" },
  { nome: "2 Reis", id: 12, caps: 25, testamento: "AT" },
  { nome: "1 Crônicas", id: 13, caps: 29, testamento: "AT" },
  { nome: "2 Crônicas", id: 14, caps: 36, testamento: "AT" },
  { nome: "Esdras", id: 15, caps: 10, testamento: "AT" },
  { nome: "Neemias", id: 16, caps: 13, testamento: "AT" },
  { nome: "Ester", id: 17, caps: 10, testamento: "AT" },
  { nome: "Jó", id: 18, caps: 42, testamento: "AT" },
  { nome: "Salmos", id: 19, caps: 150, testamento: "AT" },
  { nome: "Provérbios", id: 20, caps: 31, testamento: "AT" },
  { nome: "Eclesiastes", id: 21, caps: 12, testamento: "AT" },
  { nome: "Cantares", id: 22, caps: 8, testamento: "AT" },
  { nome: "Isaías", id: 23, caps: 66, testamento: "AT" },
  { nome: "Jeremias", id: 24, caps: 52, testamento: "AT" },
  { nome: "Lamentações", id: 25, caps: 5, testamento: "AT" },
  { nome: "Ezequiel", id: 26, caps: 48, testamento: "AT" },
  { nome: "Daniel", id: 27, caps: 12, testamento: "AT" },
  { nome: "Oséias", id: 28, caps: 14, testamento: "AT" },
  { nome: "Joel", id: 29, caps: 3, testamento: "AT" },
  { nome: "Amós", id: 30, caps: 9, testamento: "AT" },
  { nome: "Obadias", id: 31, caps: 1, testamento: "AT" },
  { nome: "Jonas", id: 32, caps: 4, testamento: "AT" },
  { nome: "Miquéias", id: 33, caps: 7, testamento: "AT" },
  { nome: "Naum", id: 34, caps: 3, testamento: "AT" },
  { nome: "Habacuque", id: 35, caps: 3, testamento: "AT" },
  { nome: "Sofonias", id: 36, caps: 3, testamento: "AT" },
  { nome: "Ageu", id: 37, caps: 2, testamento: "AT" },
  { nome: "Zacarias", id: 38, caps: 14, testamento: "AT" },
  { nome: "Malaquias", id: 39, caps: 4, testamento: "AT" },
  { nome: "Mateus", id: 40, caps: 28, testamento: "NT" },
  { nome: "Marcos", id: 41, caps: 16, testamento: "NT" },
  { nome: "Lucas", id: 42, caps: 24, testamento: "NT" },
  { nome: "João", id: 43, caps: 21, testamento: "NT" },
  { nome: "Atos", id: 44, caps: 28, testamento: "NT" },
  { nome: "Romanos", id: 45, caps: 16, testamento: "NT" },
  { nome: "1 Coríntios", id: 46, caps: 16, testamento: "NT" },
  { nome: "2 Coríntios", id: 47, caps: 13, testamento: "NT" },
  { nome: "Gálatas", id: 48, caps: 6, testamento: "NT" },
  { nome: "Efésios", id: 49, caps: 6, testamento: "NT" },
  { nome: "Filipenses", id: 50, caps: 4, testamento: "NT" },
  { nome: "Colossenses", id: 51, caps: 4, testamento: "NT" },
  { nome: "1 Tessalonicenses", id: 52, caps: 5, testamento: "NT" },
  { nome: "2 Tessalonicenses", id: 53, caps: 3, testamento: "NT" },
  { nome: "1 Timóteo", id: 54, caps: 6, testamento: "NT" },
  { nome: "2 Timóteo", id: 55, caps: 4, testamento: "NT" },
  { nome: "Tito", id: 56, caps: 3, testamento: "NT" },
  { nome: "Filemom", id: 57, caps: 1, testamento: "NT" },
  { nome: "Hebreus", id: 58, caps: 13, testamento: "NT" },
  { nome: "Tiago", id: 59, caps: 5, testamento: "NT" },
  { nome: "1 Pedro", id: 60, caps: 5, testamento: "NT" },
  { nome: "2 Pedro", id: 61, caps: 3, testamento: "NT" },
  { nome: "1 João", id: 62, caps: 5, testamento: "NT" },
  { nome: "2 João", id: 63, caps: 1, testamento: "NT" },
  { nome: "3 João", id: 64, caps: 1, testamento: "NT" },
  { nome: "Judas", id: 65, caps: 1, testamento: "NT" },
  { nome: "Apocalipse", id: 66, caps: 22, testamento: "NT" },
];

type Verso = { verse: number; text: string };

type Traducao = "ACF" | "ARA";

type LivroACF = { abbrev: string; name: string; chapters: string[][] };

let acfCache: LivroACF[] | null = null;

// ACF (Almeida Corrigida Fiel): texto local em /public/biblia-acf.json.
// Funciona offline depois do primeiro carregamento.
async function buscarACF(lIdx: number, cap: number): Promise<Verso[]> {
  if (!acfCache) {
    const res = await fetch("/biblia-acf.json");
    if (!res.ok) throw new Error("Bíblia local indisponível");
    acfCache = (await res.json()) as LivroACF[];
  }
  const textos = acfCache[lIdx]?.chapters?.[cap - 1];
  if (!textos || textos.length === 0) throw new Error("Capítulo vazio");
  return textos.map((text, i) => ({ verse: i + 1, text: text.trim() }));
}

// ARA (Almeida Revista e Atualizada): API online bolls.life, sem chave.
async function buscarARA(lIdx: number, cap: number): Promise<Verso[]> {
  const l = LIVROS[lIdx];
  const res = await fetch(`https://bolls.life/get-text/ARA/${l.id}/${cap}/`);
  if (!res.ok) throw new Error("Capítulo não encontrado");
  const data: Verso[] = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error("Capítulo vazio");
  return data.map((v) => ({ verse: v.verse, text: v.text.trim() }));
}

function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function lerEstadoInicial(): { fonte: number; livro: number; cap: number; traducao: Traducao } {
  let fonte = 21;
  let traducao: Traducao = "ACF";
  try {
    const f = Number(localStorage.getItem("ce-fonte"));
    if (f >= 14 && f <= 28) fonte = f;
    const t = localStorage.getItem("ce-traducao");
    if (t === "ARA" || t === "ACF") traducao = t;
    // Posição salva tem prioridade; primeira visita abre em 1 João 1 (NT).
    if (localStorage.getItem("ce-livro") === null) {
      return { fonte, livro: 61, cap: 1, traducao };
    }
    const idx = Number(localStorage.getItem("ce-livro"));
    const c = Number(localStorage.getItem("ce-cap"));
    if (Number.isInteger(idx) && idx >= 0 && idx < LIVROS.length) {
      const cap = Number.isInteger(c) && c >= 1 && c <= LIVROS[idx].caps ? c : 1;
      return { fonte, livro: idx, cap, traducao };
    }
  } catch {
    /* localStorage indisponível: segue com o padrão */
  }
  return { fonte, livro: 61, cap: 1, traducao };
}

export default function LeitorBiblico() {
  const [inicial] = useState(lerEstadoInicial);
  const [livroIdx, setLivroIdx] = useState(inicial.livro);
  const [capitulo, setCapitulo] = useState(inicial.cap);
  // Primeira visita abre em 1 João 1; posição salva tem prioridade.
  const [versos, setVersos] = useState<Verso[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [fonte, setFonte] = useState(inicial.fonte);
  const [traducao, setTraducao] = useState<Traducao>(inicial.traducao);
  const [painel, setPainel] = useState<"livros" | "caps">("livros");
  const [atAberto, setAtAberto] = useState(false);
  const [ntAberto, setNtAberto] = useState(true);
  const [busca, setBusca] = useState("");
  const [navegacaoAberta, setNavegacaoAberta] = useState(false);

  const livro = LIVROS[livroIdx];
  const referencia = versos.length > 0 ? `${livro.nome} ${capitulo}` : "";

  // Carrega o capítulo inicial (1 João 1 ou posição salva) na tradução salva.
  useEffect(() => {
    const buscar: Promise<Verso[]> =
      inicial.traducao === "ACF"
        ? buscarACF(inicial.livro, inicial.cap)
        : buscarARA(inicial.livro, inicial.cap);
    buscar
      .then((vs) => setVersos(vs))
      .catch(() => setErro("Não foi possível carregar o capítulo. Verifique sua conexão."))
      .finally(() => setCarregando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const salvarPosicao = (lIdx: number, cap: number) => {
    try {
      localStorage.setItem("ce-livro", String(lIdx));
      localStorage.setItem("ce-cap", String(cap));
    } catch {
      /* ignora */
    }
  };

  const mudarFonte = (nova: number) => {
    const v = Math.min(28, Math.max(14, nova));
    setFonte(v);
    try {
      localStorage.setItem("ce-fonte", String(v));
    } catch {
      /* ignora */
    }
  };

  const carregar = async (lIdx: number, cap: number, trad: Traducao = traducao) => {
    setCarregando(true);
    setErro("");
    setVersos([]);
    try {
      const versosNovos = trad === "ACF" ? await buscarACF(lIdx, cap) : await buscarARA(lIdx, cap);
      setVersos(versosNovos);
      salvarPosicao(lIdx, cap);
    } catch {
      setErro("Não foi possível carregar o capítulo. Verifique sua conexão.");
    } finally {
      setCarregando(false);
    }
  };

  const trocarTraducao = (t: Traducao) => {
    if (t === traducao) return;
    setTraducao(t);
    try {
      localStorage.setItem("ce-traducao", t);
    } catch {
      /* ignora */
    }
    void carregar(livroIdx, capitulo, t);
  };

  const selecionarLivro = (idx: number) => {
    setLivroIdx(idx);
    setCapitulo(1);
    setPainel("caps");
    // Trocar de livro tem que trocar o texto na hora: carrega o capítulo 1
    // do livro novo (antes só trocava a aba, e o texto antigo ficava na tela).
    void carregar(idx, 1);
    setNavegacaoAberta(false);
  };

  const selecionarCapitulo = (cap: number) => {
    setCapitulo(cap);
    void carregar(livroIdx, cap);
    setNavegacaoAberta(false);
  };

  // Navega entre capítulos atravessando a fronteira entre livros
  const navegar = (delta: 1 | -1) => {
    let lIdx = livroIdx;
    let cap = capitulo + delta;
    if (cap < 1) {
      if (lIdx === 0) return;
      lIdx -= 1;
      cap = LIVROS[lIdx].caps;
    } else if (cap > livro.caps) {
      if (lIdx === LIVROS.length - 1) return;
      lIdx += 1;
      cap = 1;
    }
    setLivroIdx(lIdx);
    setCapitulo(cap);
    void carregar(lIdx, cap);
  };

  const termo = normalizar(busca.trim());
  const filtrar = (lista: typeof LIVROS) =>
    termo ? lista.filter((l) => normalizar(l.nome).includes(termo)) : lista;

  const at = useMemo(
    () => filtrar(LIVROS.filter((l) => l.testamento === "AT")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [termo]
  );
  const nt = useMemo(
    () => filtrar(LIVROS.filter((l) => l.testamento === "NT")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [termo]
  );

  const rotuloAnterior =
    capitulo > 1
      ? `← ${livro.nome} ${capitulo - 1}`
      : livroIdx > 0
        ? `← ${LIVROS[livroIdx - 1].nome} ${LIVROS[livroIdx - 1].caps}`
        : "← Início";
  const rotuloProximo =
    capitulo < livro.caps
      ? `${livro.nome} ${capitulo + 1} →`
      : livroIdx < LIVROS.length - 1
        ? `${LIVROS[livroIdx + 1].nome} 1 →`
        : "Fim →";
  const noInicio = livroIdx === 0 && capitulo <= 1 && versos.length === 0;
  const noFim =
    livroIdx === LIVROS.length - 1 && capitulo >= livro.caps && versos.length > 0;

  // Marcador recolhível de testamento (Antigo/Novo). Com busca ativa, abre sozinho.
  const renderMarcador = (
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
          className="w-full flex items-center justify-between px-2 py-2 mt-1 rounded font-sans text-xs uppercase tracking-widest transition-colors"
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
            {lista.map((l) => {
              const idx = LIVROS.indexOf(l);
              const ativo = livroIdx === idx;
              return (
                <button
                  key={l.id}
                  onClick={() => selecionarLivro(idx)}
                  aria-current={ativo ? "true" : undefined}
                  className="w-full text-left px-3 py-1.5 rounded font-sans text-sm transition-colors"
                  style={{
                    background: ativo ? "var(--parchment-dark)" : "transparent",
                    color: ativo ? "var(--gold)" : "var(--ink)",
                    fontWeight: ativo ? 600 : 400,
                  }}
                >
                  {l.nome}
                  <span style={{ color: "var(--ink-light)", fontSize: "0.75em" }}> · {l.caps} cap.</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row leitor-shell" style={{ minHeight: "70vh" }}>
      {/* Barra de navegação no mobile */}
      <div className="md:hidden border-b p-3" style={{ borderColor: "var(--parchment-dark)" }}>
        <button
          onClick={() => setNavegacaoAberta((v) => !v)}
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
        className={`${navegacaoAberta ? "block" : "hidden"} md:block md:w-72 flex-shrink-0 md:border-r md:sticky md:top-16 md:self-start md:max-h-[calc(100vh-4rem)] md:overflow-y-auto overflow-y-auto`}
        style={{
          borderColor: "var(--parchment-dark)",
          background: "var(--parchment)",
          maxHeight: navegacaoAberta ? "60vh" : undefined,
        }}
      >
        <div className="flex border-b" style={{ borderColor: "var(--parchment-dark)" }}>
          {(["livros", "caps"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPainel(p)}
              className="flex-1 py-2 font-sans text-xs uppercase tracking-wider transition-colors"
              style={{
                background: painel === p ? "white" : "transparent",
                color: painel === p ? "var(--gold)" : "var(--ink-light)",
                fontWeight: painel === p ? 600 : 400,
                borderBottom: painel === p ? "2px solid var(--gold)" : "none",
              }}
            >
              {p === "livros" ? "Livros" : "Capítulos"}
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
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar livro… (ex.: salmos)"
                className="w-full font-sans text-sm px-3 py-2 rounded border"
                style={{
                  borderColor: "var(--parchment-dark)",
                  background: "white",
                  color: "var(--ink)",
                }}
              />
            </div>
            {renderMarcador(at, "Antigo Testamento", atAberto, () => setAtAberto((v) => !v))}
            {renderMarcador(nt, "Novo Testamento", ntAberto, () => setNtAberto((v) => !v))}
          </div>
        )}

        {painel === "caps" && (
          <div className="p-3">
            <p className="font-sans text-sm font-semibold mb-1" style={{ color: "var(--ink)" }}>
              {livro.nome}
            </p>
            <p className="font-sans text-xs mb-3" style={{ color: "var(--ink-light)" }}>
              {livro.caps} {livro.caps === 1 ? "capítulo" : "capítulos"} · {livro.testamento === "AT" ? "Antigo" : "Novo"} Testamento
            </p>
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: livro.caps }, (_, i) => i + 1).map((c) => {
                const ativo = capitulo === c && versos.length > 0;
                return (
                  <button
                    key={c}
                    onClick={() => selecionarCapitulo(c)}
                    aria-current={ativo ? "true" : undefined}
                    className="py-1.5 rounded font-sans text-xs transition-colors"
                    style={{
                      background: ativo ? "var(--gold)" : "var(--parchment-dark)",
                      color: ativo ? "white" : "var(--ink)",
                      fontWeight: capitulo === c ? 600 : 400,
                    }}
                  >
                    {c}
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
              onClick={() => carregar(livroIdx, capitulo)}
              className="font-sans text-sm px-4 py-2 rounded-full border"
              style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {versos.length > 0 && (
          <div className="p-6 md:p-10">
            {/* Cabeçalho de leitura fixo: título + versão + fonte acompanham a rolagem */}
            <div className="sticky top-16 z-10 -mx-6 px-6 py-3 md:-mx-10 md:px-10 flex items-center justify-between flex-wrap gap-3" style={{ background: "var(--parchment)", borderBottom: "1px solid var(--parchment-dark)" }}>
              <div>
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
                >
                  {referencia}
                </h2>
                <p className="text-xs mt-1" style={{ color: "var(--ink-light)" }}>
                  {traducao === "ACF" ? (
                    <>
                      Almeida Corrigida Fiel (ACF) · texto local · fonte: /public/biblia-acf.json
                    </>
                  ) : (
                    <>
                      Almeida Revista e Atualizada (ARA) · bolls.life ·{" "}
                      <a href="https://www.sbb.org.br/biblia/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", textDecoration: "underline" }}>
                        SBB ↗
                      </a>
                    </>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs" style={{ color: "var(--ink-light)" }}>
                  Versão:
                </span>
                {(["ACF", "ARA"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => trocarTraducao(t)}
                    aria-pressed={traducao === t}
                    title={t === "ACF" ? "Almeida Corrigida Fiel" : "Almeida Revista e Atualizada"}
                    className="font-sans text-xs px-2.5 py-1 rounded-full border transition-colors"
                    style={{
                      borderColor: "var(--gold)",
                      background: traducao === t ? "var(--gold)" : "transparent",
                      color: traducao === t ? "white" : "var(--gold)",
                      fontWeight: traducao === t ? 600 : 400,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs" style={{ color: "var(--ink-light)" }}>
                  Fonte:
                </span>
                <button
                  onClick={() => mudarFonte(fonte - 2)}
                  aria-label="Diminuir tamanho da fonte"
                  className="font-sans text-sm px-2.5 py-1 rounded"
                  style={{ background: "var(--parchment-dark)", color: "var(--ink)" }}
                >
                  A−
                </button>
                <span className="font-sans text-xs w-8 text-center" style={{ color: "var(--ink-light)" }}>
                  {fonte}
                </span>
                <button
                  onClick={() => mudarFonte(fonte + 2)}
                  aria-label="Aumentar tamanho da fonte"
                  className="font-sans text-sm px-2.5 py-1 rounded"
                  style={{ background: "var(--parchment-dark)", color: "var(--ink)" }}
                >
                  A+
                </button>
              </div>
            </div>

            <details className="mt-4 rounded-lg px-4 py-3" style={{ background: "var(--surface)", border: "1px solid var(--parchment-dark)" }}>
              <summary className="font-sans text-sm cursor-pointer" style={{ color: "var(--gold)", fontWeight: 600 }}>
                Como traduzir esta página no navegador
              </summary>
              <div className="font-sans text-sm leading-relaxed mt-3" style={{ color: "var(--ink-light)" }}>
                <p>
                  Se você estiver lendo uma fonte em outro idioma, use o tradutor integrado do navegador: no Chrome, clique no ícone de tradução ao lado da barra de endereço ou clique com o botão direito na página e escolha <strong>Traduzir para português</strong>. No celular, abra o menu do navegador e toque em <strong>Traduzir</strong>.
                </p>
                <p className="mt-2">
                  Também é possível selecionar apenas um trecho, clicar com o botão direito e traduzir a seleção. A tradução é feita pelo navegador e pode variar; para estudar um termo, confira o contexto e as fontes originais.
                </p>
                <a
                  href="https://support.google.com/chrome/answer/173424"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2"
                  style={{ color: "var(--gold)", textDecoration: "underline" }}
                >
                  Instruções oficiais do Chrome ↗
                </a>
              </div>
            </details>

            <hr className="gold-divider" />

            <div className="bible-text" style={{ fontSize: `${fonte}px` }}>
              {versos.map((v) => (
                <span key={v.verse}>
                  <sup className="verse-number">{v.verse}</sup>
                  {v.text}{" "}
                </span>
              ))}
            </div>

            <hr className="gold-divider mt-8" />

            {/* Navegação anterior/próximo fixa no rodapé da área de leitura */}
            <div className="sticky bottom-0 z-10 -mx-6 px-6 py-3 md:-mx-10 md:px-10 flex justify-between gap-3 mt-4" style={{ background: "var(--parchment)", borderTop: "1px solid var(--parchment-dark)" }}>
              <button
                onClick={() => navegar(-1)}
                disabled={noInicio}
                className="font-sans text-sm px-4 py-2 rounded disabled:cursor-not-allowed"
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
                className="font-sans text-sm px-4 py-2 rounded disabled:cursor-not-allowed"
                style={{
                  background: noFim ? "var(--parchment-dark)" : "var(--ink)",
                  color: noFim ? "var(--ink-light)" : "var(--gold-light)",
                  opacity: noFim ? 0.5 : 1,
                }}
              >
                {rotuloProximo}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
