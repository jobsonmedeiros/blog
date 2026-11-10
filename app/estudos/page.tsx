import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Estudos | Conforto das Escrituras",
};

const ARTIGOS = [
  {
    id: "introducao-salmos",
    categoria: "Poesia Bíblica",
    titulo: "Introdução ao Livro dos Salmos",
    resumo:
      "O livro dos Salmos é a maior coleção de poesia e hinos do Antigo Testamento. Com 150 salmos organizados em cinco livros, expressa toda a gama de emoções humanas diante de Deus — louvor, lamento, gratidão, arrependimento e esperança.",
    autor: "Equipe Editorial",
    leitura: "5 min",
    emoji: "🎵",
  },
  {
    id: "sermao-monte",
    categoria: "Ensino de Jesus",
    titulo: "O Sermão do Monte: Uma Vida Transformada",
    resumo:
      "Em Mateus 5-7, Jesus apresenta o manifesto do Reino de Deus. As Bem-aventuranças não são meros conselhos morais, mas uma descrição do caráter formado em quem vive sob o reinado de Cristo — uma vida radicalmente diferente dos padrões do mundo.",
    autor: "Equipe Editorial",
    leitura: "7 min",
    emoji: "⛰️",
  },
  {
    id: "fe-obras",
    categoria: "Teologia Prática",
    titulo: "Fé e Obras: A Tensão em Tiago e Paulo",
    resumo:
      "À primeira vista, Paulo e Tiago parecem contradizer-se sobre o papel da fé e das obras na salvação. Uma leitura contextual, porém, revela duas perspectivas complementares: Paulo defende que somos justificados pela fé, não pelas obras da lei; Tiago mostra que uma fé genuína inevitavelmente produz frutos.",
    autor: "Equipe Editorial",
    leitura: "8 min",
    emoji: "⚖️",
  },
  {
    id: "oracao-senhor",
    categoria: "Vida de Oração",
    titulo: "A Oração do Senhor: Modelo de Comunhão",
    resumo:
      "O Pai-Nosso (Mt 6:9-13) não é uma fórmula mágica, mas um modelo de como nos aproximarmos de Deus. Cada petição revela uma dimensão da relação do crente com o Pai — adoração, submissão, dependência, perdão e proteção.",
    autor: "Equipe Editorial",
    leitura: "6 min",
    emoji: "🙏",
  },
];

const LIVROS = [
  {
    titulo: "A Bíblia Fala Hoje",
    autor: "John R. W. Stott",
    desc: "Série de comentários acessíveis para o leitor moderno, com sólida base exegética e aplicação prática.",
    emoji: "📗",
    tipo: "Comentário",
  },
  {
    titulo: "Conheça a Bíblia Toda",
    autor: "Mark Finley",
    desc: "Um guia introdutório para percorrer as Escrituras do Gênesis ao Apocalipse com clareza e propósito.",
    emoji: "📘",
    tipo: "Introdução",
  },
  {
    titulo: "O Deus que Está Lá",
    autor: "Francis Schaeffer",
    desc: "Resposta filosófica e bíblica ao secularismo moderno, mostrando a relevância da fé cristã no pensamento contemporâneo.",
    emoji: "📙",
    tipo: "Apologética",
  },
  {
    titulo: "Ensinamentos de Jesus",
    autor: "Autores Vários",
    desc: "Coletânea de estudos temáticos sobre os principais ensinamentos de Jesus nos evangelhos.",
    emoji: "📕",
    tipo: "Estudo",
  },
];

const CATEGORIAS = ["Todos", "Poesia Bíblica", "Ensino de Jesus", "Teologia Prática", "Vida de Oração"];

export default function EstudosPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="text-4xl mb-2"
          style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif", fontWeight: 300 }}
        >
          📚 Espaço de Estudos
        </h1>
        <p className="font-sans text-sm" style={{ color: "var(--ink-light)" }}>
          Artigos, reflexões e indicações de leitura para aprofundar a Palavra
        </p>
        <hr className="gold-divider w-32 mx-auto" />
      </div>

      {/* Artigos */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2
            className="text-2xl"
            style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif" }}
          >
            Artigos & Reflexões
          </h2>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIAS.map((c) => (
              <span
                key={c}
                className="font-sans text-xs px-3 py-1 rounded-full cursor-pointer transition-colors"
                style={{ background: "var(--parchment-dark)", color: "var(--ink-light)" }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {ARTIGOS.map((a) => (
            <Link
              key={a.id}
              href={`/estudos/${a.id}`}
              className="card p-6 flex flex-col gap-3 no-underline"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{a.emoji}</span>
                <span
                  className="font-sans text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "var(--parchment-dark)", color: "var(--gold)" }}
                >
                  {a.categoria}
                </span>
              </div>
              <h3
                className="text-xl"
                style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif", fontWeight: 600 }}
              >
                {a.titulo}
              </h3>
              <p
                className="text-base leading-relaxed flex-1"
                style={{ color: "var(--ink-light)", fontFamily: "'Crimson Pro', serif" }}
              >
                {a.resumo}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-sans text-xs" style={{ color: "var(--ink-light)" }}>
                  {a.autor} • {a.leitura} de leitura
                </span>
                <span className="font-sans text-sm" style={{ color: "var(--gold)" }}>
                  Ler →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Divisor */}
      <hr className="gold-divider" />

      {/* Indicações de Livros */}
      <section className="mt-10">
        <h2
          className="text-2xl mb-6"
          style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif" }}
        >
          Indicações de Leitura
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {LIVROS.map((l, i) => (
            <div key={i} className="card p-5 flex gap-4">
              <span className="text-3xl flex-shrink-0">{l.emoji}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className="text-lg"
                    style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif", fontWeight: 600 }}
                  >
                    {l.titulo}
                  </h3>
                  <span
                    className="font-sans text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "var(--parchment-dark)", color: "var(--ink-light)" }}
                  >
                    {l.tipo}
                  </span>
                </div>
                <p className="font-sans text-xs mb-2" style={{ color: "var(--gold)" }}>
                  {l.autor}
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--ink-light)", fontFamily: "'Crimson Pro', serif" }}
                >
                  {l.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Blog */}
      <section
        className="mt-12 rounded-xl p-8 text-center"
        style={{ background: "var(--parchment-dark)", border: "1px solid var(--gold)" }}
      >
        <p
          className="text-2xl mb-2"
          style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif", fontStyle: "italic" }}
        >
          Quer contribuir com um artigo ou sugestão de leitura?
        </p>
        <p className="font-sans text-sm mb-4" style={{ color: "var(--ink-light)" }}>
          Acesse nosso blog e deixe seus comentários ou sugestões.
        </p>
        <a
          href="https://confortodasescrituras.blogspot.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-block"
        >
          Ir para o Blog ↗
        </a>
      </section>
    </div>
  );
}
