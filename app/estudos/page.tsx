import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Estudos | Conforto das Escrituras",
};

const ARTIGOS = [
  {
    id: "sete-dispensacoes",
    categoria: "Dispensações",
    titulo: "As Sete Dispensações: o Plano de Deus Através das Eras",
    resumo:
      "Deus trata com o homem de modos distintos em cada era — Inocência, Consciência, Governo, Promessa, Lei, Graça e Reino. Entender essa divisão (2 Tm 2:15) desfaz confusões e mostra que a salvação sempre foi pela fé, mas a responsabilidade do homem muda em cada dispensação.",
    autor: "J. N. Darby",
    leitura: "8 min",
    emoji: "📜",
  },
  {
    id: "assembleia-misterio",
    categoria: "A Assembleia",
    titulo: "A Assembleia: o Mistério Revelado a Paulo",
    resumo:
      "A Assembleia (o Corpo de Cristo) não existia no Antigo Testamento: foi um mistério escondido e revelado a Paulo (Ef 3). Não é organização humana nem clero e leigos — é um organismo vivo, reunido só ao Nome do Senhor, com Cristo no meio.",
    autor: "William Kelly",
    leitura: "7 min",
    emoji: "⛪",
  },
  {
    id: "arrebatamento-vinda",
    categoria: "Profecia",
    titulo: "O Arrebatamento e a Vinda: Duas Fases Distintas",
    resumo:
      "Os irmãos ensinam a distinção entre Cristo vindo PARA os Seus (arrebatamento, 1 Ts 4) e vindo COM os Seus (manifestação em glória, Jd 14). Confundir as duas fases embaralha Israel com a Assembleia e a Graça com o Reino.",
    autor: "F. W. Grant",
    leitura: "7 min",
    emoji: "🎺",
  },
  {
    id: "separacao-ceia",
    categoria: "Vida Cristã",
    titulo: "Separação do Mundo e a Ceia do Senhor",
    resumo:
      "Separados do mal e separados para Deus: a mesa do Senhor (1 Co 10–11) é o centro da comunhão dos santos. Exame próprio, simplicidade e santidade — sem mundanismo — marcam o andar de quem espera o Senhor.",
    autor: "C. H. Mackintosh",
    leitura: "6 min",
    emoji: "🍞",
  },
];

const LIVROS = [
  {
    titulo: "Sinopse dos Livros da Bíblia",
    autor: "J. N. Darby",
    desc: "Comentário corrido de Gênesis a Apocalipse pelo fundador do movimento dos Irmãos — base do ensino dispensacional.",
    emoji: "📗",
    tipo: "Comentário",
  },
  {
    titulo: "Notas sobre o Pentateuco",
    autor: "C. H. Mackintosh",
    desc: "Clássico devocional e doutrinário sobre os cinco livros de Moisés, lido há gerações nas assembleias.",
    emoji: "📘",
    tipo: "Estudo",
  },
  {
    titulo: "A Igreja de Deus",
    autor: "William Kelly",
    desc: "Exposição sobre a Assembleia como Corpo de Cristo, sua ruína nas mãos dos homens e o caminho dos que se reúnem ao Nome do Senhor.",
    emoji: "📙",
    tipo: "Eclesiologia",
  },
  {
    titulo: "A Bíblia Numérica",
    autor: "F. W. Grant",
    desc: "Estudo do simbolismo numérico das Escrituras e da estrutura dispensacional da revelação.",
    emoji: "📕",
    tipo: "Estudo",
  },
];

const CATEGORIAS = ["Todos", "Dispensações", "A Assembleia", "Profecia", "Vida Cristã"];

export default function EstudosPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="text-4xl mb-2"
          style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontWeight: 300 }}
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
            style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
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
                style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontWeight: 600 }}
              >
                {a.titulo}
              </h3>
              <p
                className="text-base leading-relaxed flex-1"
                style={{ color: "var(--ink-light)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
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
          style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
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
                    style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontWeight: 600 }}
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
                  style={{ color: "var(--ink-light)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
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
          style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontStyle: "italic" }}
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
