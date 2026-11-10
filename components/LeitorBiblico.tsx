"use client";
import { useState } from "react";

// Estrutura dos livros da Bíblia com número de capítulos
const LIVROS = [
  { nome: "Gênesis", abrev: "gen", caps: 50, testamento: "AT" },
  { nome: "Êxodo", abrev: "exo", caps: 40, testamento: "AT" },
  { nome: "Levítico", abrev: "lev", caps: 27, testamento: "AT" },
  { nome: "Números", abrev: "num", caps: 36, testamento: "AT" },
  { nome: "Deuteronômio", abrev: "deu", caps: 34, testamento: "AT" },
  { nome: "Josué", abrev: "jos", caps: 24, testamento: "AT" },
  { nome: "Juízes", abrev: "jdg", caps: 21, testamento: "AT" },
  { nome: "Rute", abrev: "rut", caps: 4, testamento: "AT" },
  { nome: "1 Samuel", abrev: "1sa", caps: 31, testamento: "AT" },
  { nome: "2 Samuel", abrev: "2sa", caps: 24, testamento: "AT" },
  { nome: "1 Reis", abrev: "1ki", caps: 22, testamento: "AT" },
  { nome: "2 Reis", abrev: "2ki", caps: 25, testamento: "AT" },
  { nome: "Salmos", abrev: "psa", caps: 150, testamento: "AT" },
  { nome: "Provérbios", abrev: "pro", caps: 31, testamento: "AT" },
  { nome: "Eclesiastes", abrev: "ecc", caps: 12, testamento: "AT" },
  { nome: "Isaías", abrev: "isa", caps: 66, testamento: "AT" },
  { nome: "Jeremias", abrev: "jer", caps: 52, testamento: "AT" },
  { nome: "Daniel", abrev: "dan", caps: 12, testamento: "AT" },
  { nome: "Mateus", abrev: "mat", caps: 28, testamento: "NT" },
  { nome: "Marcos", abrev: "mar", caps: 16, testamento: "NT" },
  { nome: "Lucas", abrev: "luk", caps: 24, testamento: "NT" },
  { nome: "João", abrev: "jhn", caps: 21, testamento: "NT" },
  { nome: "Atos", abrev: "act", caps: 28, testamento: "NT" },
  { nome: "Romanos", abrev: "rom", caps: 16, testamento: "NT" },
  { nome: "1 Coríntios", abrev: "1co", caps: 16, testamento: "NT" },
  { nome: "2 Coríntios", abrev: "2co", caps: 13, testamento: "NT" },
  { nome: "Gálatas", abrev: "gal", caps: 6, testamento: "NT" },
  { nome: "Efésios", abrev: "eph", caps: 6, testamento: "NT" },
  { nome: "Filipenses", abrev: "php", caps: 4, testamento: "NT" },
  { nome: "Colossenses", abrev: "col", caps: 4, testamento: "NT" },
  { nome: "Hebreus", abrev: "heb", caps: 13, testamento: "NT" },
  { nome: "Tiago", abrev: "jas", caps: 5, testamento: "NT" },
  { nome: "1 Pedro", abrev: "1pe", caps: 5, testamento: "NT" },
  { nome: "2 Pedro", abrev: "2pe", caps: 3, testamento: "NT" },
  { nome: "1 João", abrev: "1jn", caps: 5, testamento: "NT" },
  { nome: "Apocalipse", abrev: "rev", caps: 22, testamento: "NT" },
];

type Verso = { verse: number; text: string };
type ApiResponse = { reference: string; verses: Verso[]; translation_name: string };

export default function LeitorBiblico() {
  const [livroIdx, setLivroIdx] = useState(0);
  const [capitulo, setCapitulo] = useState(1);
  const [versos, setVersos] = useState<Verso[]>([]);
  const [referencia, setReferencia] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [fonte, setFonte] = useState(20);
  const [painel, setPainel] = useState<"livros" | "caps">("livros");

  const livro = LIVROS[livroIdx];

  const carregar = async (lIdx: number, cap: number) => {
    const l = LIVROS[lIdx];
    setCarregando(true);
    setErro("");
    setVersos([]);
    try {
      const res = await fetch(
        `https://bible-api.com/${l.abrev}+${cap}?translation=almeida`
      );
      if (!res.ok) throw new Error("Capítulo não encontrado");
      const data: ApiResponse = await res.json();
      setVersos(data.verses);
      setReferencia(data.reference);
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
  };

  const selecionarCapitulo = (cap: number) => {
    setCapitulo(cap);
    carregar(livroIdx, cap);
  };

  const navegarCap = (delta: number) => {
    const novoCap = capitulo + delta;
    if (novoCap < 1 || novoCap > livro.caps) return;
    setCapitulo(novoCap);
    carregar(livroIdx, novoCap);
  };

  const atSalmos = LIVROS.filter((l) => l.testamento === "AT");
  const nt = LIVROS.filter((l) => l.testamento === "NT");

  return (
    <div className="flex gap-0 h-full" style={{ minHeight: "70vh" }}>
      {/* Painel lateral */}
      <aside
        className="w-64 flex-shrink-0 border-r overflow-y-auto"
        style={{ borderColor: "var(--parchment-dark)", background: "var(--parchment)" }}
      >
        {/* Tabs */}
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
            <p className="font-sans text-xs uppercase tracking-widest px-2 py-1 mt-1" style={{ color: "var(--gold)" }}>
              Antigo Testamento
            </p>
            {atSalmos.map((l) => {
              const idx = LIVROS.indexOf(l);
              return (
                <button
                  key={l.abrev}
                  onClick={() => selecionarLivro(idx)}
                  className="w-full text-left px-3 py-1.5 rounded font-sans text-sm transition-colors"
                  style={{
                    background: livroIdx === idx ? "var(--parchment-dark)" : "transparent",
                    color: livroIdx === idx ? "var(--gold)" : "var(--ink)",
                    fontWeight: livroIdx === idx ? 600 : 400,
                  }}
                >
                  {l.nome}
                </button>
              );
            })}
            <p className="font-sans text-xs uppercase tracking-widest px-2 py-1 mt-3" style={{ color: "var(--gold)" }}>
              Novo Testamento
            </p>
            {nt.map((l) => {
              const idx = LIVROS.indexOf(l);
              return (
                <button
                  key={l.abrev}
                  onClick={() => selecionarLivro(idx)}
                  className="w-full text-left px-3 py-1.5 rounded font-sans text-sm transition-colors"
                  style={{
                    background: livroIdx === idx ? "var(--parchment-dark)" : "transparent",
                    color: livroIdx === idx ? "var(--gold)" : "var(--ink)",
                    fontWeight: livroIdx === idx ? 600 : 400,
                  }}
                >
                  {l.nome}
                </button>
              );
            })}
          </div>
        )}

        {painel === "caps" && (
          <div className="p-3">
            <p className="font-sans text-sm font-semibold mb-3" style={{ color: "var(--ink)" }}>
              {livro.nome}
            </p>
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: livro.caps }, (_, i) => i + 1).map((c) => (
                <button
                  key={c}
                  onClick={() => selecionarCapitulo(c)}
                  className="py-1 rounded font-sans text-xs transition-colors"
                  style={{
                    background: capitulo === c && versos.length > 0 ? "var(--gold)" : "var(--parchment-dark)",
                    color: capitulo === c && versos.length > 0 ? "white" : "var(--ink)",
                    fontWeight: capitulo === c ? 600 : 400,
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Área de leitura */}
      <div className="flex-1 overflow-y-auto">
        {versos.length === 0 && !carregando && !erro && (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
            <div className="text-5xl mb-4" style={{ color: "var(--parchment-dark)" }}>📖</div>
            <p className="text-2xl mb-2" style={{ color: "var(--ink-light)", fontFamily: "'Crimson Pro', serif" }}>
              Selecione um livro e capítulo
            </p>
            <p className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
              Escolha no painel ao lado para começar a leitura
            </p>
          </div>
        )}

        {carregando && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-3xl mb-3 animate-pulse-soft" style={{ color: "var(--gold)" }}>✦</div>
              <p className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>Carregando…</p>
            </div>
          </div>
        )}

        {erro && (
          <div className="p-8 text-center">
            <p className="font-sans text-sm" style={{ color: "var(--burgundy)" }}>{erro}</p>
          </div>
        )}

        {versos.length > 0 && (
          <div className="p-6 md:p-10">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif" }}
                >
                  {referencia}
                </h2>
                <p className="font-sans text-xs mt-1" style={{ color: "var(--ink-light)" }}>
                  Almeida Revisada
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-sans text-xs" style={{ color: "var(--ink-light)" }}>Fonte:</span>
                <button onClick={() => setFonte((f) => Math.max(14, f - 2))} className="font-sans text-sm px-2 py-0.5 rounded" style={{ background: "var(--parchment-dark)" }}>A−</button>
                <button onClick={() => setFonte((f) => Math.min(28, f + 2))} className="font-sans text-sm px-2 py-0.5 rounded" style={{ background: "var(--parchment-dark)" }}>A+</button>
              </div>
            </div>

            <hr className="gold-divider" />

            {/* Texto */}
            <div className="bible-text" style={{ fontSize: `${fonte}px` }}>
              {versos.map((v) => (
                <span key={v.verse}>
                  <sup className="verse-number">{v.verse}</sup>
                  {v.text}{" "}
                </span>
              ))}
            </div>

            <hr className="gold-divider mt-8" />

            {/* Navegação */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => navegarCap(-1)}
                disabled={capitulo <= 1}
                className="font-sans text-sm px-4 py-2 rounded"
                style={{
                  background: capitulo <= 1 ? "var(--parchment-dark)" : "var(--ink)",
                  color: capitulo <= 1 ? "var(--ink-light)" : "var(--gold-light)",
                  opacity: capitulo <= 1 ? 0.5 : 1,
                }}
              >
                ← Capítulo anterior
              </button>
              <button
                onClick={() => navegarCap(1)}
                disabled={capitulo >= livro.caps}
                className="font-sans text-sm px-4 py-2 rounded"
                style={{
                  background: capitulo >= livro.caps ? "var(--parchment-dark)" : "var(--ink)",
                  color: capitulo >= livro.caps ? "var(--ink-light)" : "var(--gold-light)",
                  opacity: capitulo >= livro.caps ? 0.5 : 1,
                }}
              >
                Próximo capítulo →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
