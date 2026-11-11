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

function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function lerEstadoInicial(): { fonte: number; livro: number; cap: number } {
  let fonte = 21;
  let livro = 0;
  let cap = 1;
  try {
    const f = Number(localStorage.getItem("ce-fonte"));
    if (f >= 14 && f <= 28) fonte = f;
    const idx = Number(localStorage.getItem("ce-livro"));
    const c = Number(localStorage.getItem("ce-cap"));
    if (Number.isInteger(idx) && idx >= 0 && idx < LIVROS.length) {
      livro = idx;
      cap = Number.isInteger(c) && c >= 1 && c <= LIVROS[idx].caps ? c : 1;
    }
  } catch {
    /* localStorage indisponível: segue com o padrão */
  }
  return { fonte, livro, cap };
}

export default function LeitorBiblico() {
  const [inicial] = useState(lerEstadoInicial);
  const [livroIdx, setLivroIdx] = useState(inicial.livro);
  const [capitulo, setCapitulo] = useState(inicial.cap);
  // Capítulo inicial: se há posição salva, carrega direto no estado inicial
  // via lazy initializer assíncrono disfarçado — na prática, primeiro render
  // mostra "selecione" e o efeito abaixo busca o capítulo salvo.
  const [versos, setVersos] = useState<Verso[]>([]);
  const [carregando, setCarregando] = useState(inicial.livro !== 0 || inicial.cap !== 1);
  const [erro, setErro] = useState("");
  const [fonte, setFonte] = useState(inicial.fonte);
  const [painel, setPainel] = useState<"livros" | "caps">("livros");
  const [busca, setBusca] = useState("");
  const [navegacaoAberta, setNavegacaoAberta] = useState(false);

  const livro = LIVROS[livroIdx];
  const referencia = versos.length > 0 ? `${livro.nome} ${capitulo}` : "";

  // Carrega o capítulo salvo na primeira montagem (fetch inline para
  // evitar dependência antes da declaração de `carregar`)
  useEffect(() => {
    if (inicial.livro === 0 && inicial.cap === 1) return;
    const l = LIVROS[inicial.livro];
    fetch(`https://bolls.life/get-text/ARA/${l.id}/${inicial.cap}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Capítulo não encontrado");
        return res.json() as Promise<Verso[]>;
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) throw new Error("Capítulo vazio");
        setVersos(data.map((v) => ({ verse: v.verse, text: v.text.trim() })));
      })
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

  const carregar = async (lIdx: number, cap: number) => {
    const l = LIVROS[lIdx];
    setCarregando(true);
    setErro("");
    setVersos([]);
    try {
      // bolls.life — Almeida Revista e Atualizada (ARA), sem chave
      const res = await fetch(`https://bolls.life/get-text/ARA/${l.id}/${cap}/`);
      if (!res.ok) throw new Error("Capítulo não encontrado");
      const data: Verso[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error("Capítulo vazio");
      setVersos(data.map((v) => ({ verse: v.verse, text: v.text.trim() })));
      salvarPosicao(lIdx, cap);
    } catch {
      setErro("Não foi possível carregar o capítulo. Verifique sua conexão.");
    } finally {
      setCarregando(false);
    }
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

  const renderLista = (lista: typeof LIVROS, titulo: string) => (
    <div key={titulo}>
      <p
        className="font-sans text-xs uppercase tracking-widest px-2 py-1 mt-1"
        style={{ color: "var(--gold)" }}
      >
        {titulo} · {lista.length}
      </p>
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
  );

  return (
    <div className="flex flex-col md:flex-row h-full" style={{ minHeight: "70vh" }}>
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

      {/* Painel lateral: colapsável no mobile, fixo no desktop */}
      <aside
        className={`${navegacaoAberta ? "block" : "hidden"} md:block md:w-72 flex-shrink-0 md:border-r overflow-y-auto`}
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
            {renderLista(at, "Antigo Testamento")}
            {renderLista(nt, "Novo Testamento")}
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
      <div className="flex-1 overflow-y-auto min-w-0">
        {versos.length === 0 && !carregando && !erro && (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
            <div className="text-5xl mb-4" style={{ color: "var(--parchment-dark)" }} aria-hidden>
              📖
            </div>
            <p className="text-2xl mb-2" style={{ color: "var(--ink-light)", fontFamily: "'Crimson Pro', serif" }}>
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
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif" }}
                >
                  {referencia}
                </h2>
                <p className="font-sans text-xs mt-1" style={{ color: "var(--ink-light)" }}>
                  Almeida Revista e Atualizada (ARA) · bolls.life
                </p>
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

            <div className="flex justify-between gap-3 mt-4">
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
