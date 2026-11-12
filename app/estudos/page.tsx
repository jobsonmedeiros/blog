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
  {
    id: "israel-e-assembleia",
    categoria: "Israel e a Assembleia",
    titulo: "Israel e a Assembleia: duas esferas no plano de Deus",
    resumo:
      "A profecia apresenta Israel como povo terreno, enquanto as epístolas revelam a Assembleia como Corpo de Cristo e povo celestial. Distinguir essas esferas preserva o sentido das promessas e evita aplicar à Igreja o calendário profético de Israel.",
    autor: "J. N. Darby",
    leitura: "9 min",
    emoji: "🕎",
  },
  {
    id: "esperanca-celestial",
    categoria: "A Assembleia",
    titulo: "A esperança celestial do cristão",
    resumo:
      "A vocação da Assembleia não é conquistar um reino terreno, mas aguardar o Senhor vindo do céu. A esperança do arrebatamento molda o andar presente: sobriedade, separação do mundo e serviço enquanto o Noivo é esperado.",
    autor: "C. H. Mackintosh",
    leitura: "8 min",
    emoji: "✨",
  },
  {
    id: "lei-e-graca",
    categoria: "Dispensações",
    titulo: "Lei e graça: responsabilidades distintas",
    resumo:
      "A Lei revelou o pecado e provou a responsabilidade de Israel; a graça anuncia uma obra consumada e uma posição em Cristo. O dispensacionalismo não diminui a santidade: ele coloca cada verdade no contexto em que Deus a revelou.",
    autor: "J. N. Darby",
    leitura: "8 min",
    emoji: "⚖️",
  },
  {
    id: "reino-milenar",
    categoria: "Profecia",
    titulo: "O Reino milenar e a restauração de Israel",
    resumo:
      "As promessas feitas aos patriarcas não são absorvidas pela Igreja. Depois do juízo, Cristo reinará em justiça, Israel será restaurado e as nações serão abençoadas sob o governo do Messias, antes da consumação final.",
    autor: "William Kelly",
    leitura: "10 min",
    emoji: "👑",
  },
  {
    id: "remanescente-de-israel",
    categoria: "Profecia",
    titulo: "O remanescente de Israel nas profecias",
    resumo:
      "A Escritura distingue a incredulidade nacional do remanescente que será preservado. Essa linha profética atravessa os Salmos, os Profetas e o Apocalipse e demonstra que Deus não abandona Suas promessas a Israel.",
    autor: "F. W. Grant",
    leitura: "8 min",
    emoji: "🌿",
  },
  {
    id: "tipos-e-figuras",
    categoria: "Interpretação",
    titulo: "Tipos e figuras: Cristo no Antigo Testamento",
    resumo:
      "Adão, José, Moisés, o tabernáculo e as festas apontam para Cristo sem apagar o sentido histórico das passagens. A leitura tipológica dos irmãos une a revelação progressiva à distinção entre Israel e a Assembleia.",
    autor: "F. W. Grant",
    leitura: "9 min",
    emoji: "🕯️",
  },
  {
    id: "casa-de-deus",
    categoria: "A Assembleia",
    titulo: "A casa de Deus e a responsabilidade cristã",
    resumo:
      "A Assembleia é vista como Corpo, casa e templo do Espírito. Essas figuras mostram tanto a união vital com Cristo quanto a responsabilidade de edificar com materiais que resistam ao exame do Senhor.",
    autor: "William Kelly",
    leitura: "8 min",
    emoji: "🏛️",
  },
  {
    id: "sete-festas",
    categoria: "Interpretação",
    titulo: "As festas de Jeová e o calendário profético",
    resumo:
      "As festas de Levítico 23 formam uma sequência profética: cruz, ressurreição, formação da Assembleia e os acontecimentos ligados à restauração de Israel. A ordem bíblica ajuda a distinguir o que já se cumpriu do que ainda aguarda cumprimento.",
    autor: "C. H. Mackintosh",
    leitura: "9 min",
    emoji: "🌾",
  },
];

const LIVROS = [
  {
    titulo: "Sinopse dos Livros da Bíblia",
    autor: "J. N. Darby",
    desc: "Comentário corrido de Gênesis a Apocalipse pelo fundador do movimento dos Irmãos — base do ensino dispensacional.",
    emoji: "📗",
    tipo: "Comentário",
    url: "https://archive.org/details/DarbysWritingsNewTranslationNewTestamentSynopsisBooksBibleMulti",
    linkLabel: "Consultar no Internet Archive ↗",
  },
  {
    titulo: "Notas sobre o Pentateuco",
    autor: "C. H. Mackintosh",
    desc: "Clássico devocional e doutrinário sobre os cinco livros de Moisés, lido há gerações nas assembleias.",
    emoji: "📘",
    tipo: "Estudo",
    url: "https://bibletruthpublishers.com/",
    linkLabel: "Consultar Bible Truth Publishers ↗",
  },
  {
    titulo: "A Igreja de Deus",
    autor: "William Kelly",
    desc: "Exposição sobre a Assembleia como Corpo de Cristo, sua ruína nas mãos dos homens e o caminho dos que se reúnem ao Nome do Senhor.",
    emoji: "📙",
    tipo: "Eclesiologia",
    url: "https://sermonindex.net/speakers/william-kelly/",
    linkLabel: "Consultar no SermonIndex ↗",
  },
  {
    titulo: "A Bíblia Numérica",
    autor: "F. W. Grant",
    desc: "Estudo do simbolismo numérico das Escrituras e da estrutura dispensacional da revelação.",
    emoji: "📕",
    tipo: "Estudo",
    url: "https://bibletruthpublishers.com/",
    linkLabel: "Consultar Bible Truth Publishers ↗",
  },
];

const CATEGORIAS = ["Todos", "Dispensações", "A Assembleia", "Israel e a Assembleia", "Profecia", "Interpretação", "Vida Cristã"];

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
          {LIVROS.map((l) => (
            <a
              key={l.titulo}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 flex gap-4 no-underline group"
              aria-label={`${l.titulo}: ${l.linkLabel}`}
            >
              <span className="text-3xl flex-shrink-0">{l.emoji}</span>
              <div className="flex-1">
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
                <span className="font-sans text-sm mt-3 inline-block" style={{ color: "var(--gold)", fontWeight: 500 }}>
                  {l.linkLabel}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div
          className="rounded-2xl p-7 md:p-9"
          style={{ background: "var(--ink)", color: "var(--parchment)" }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.12em] mb-2" style={{ color: "var(--gold-light)" }}>
                Recursos em vídeo
              </p>
              <h2
                className="text-3xl"
                style={{ fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
              >
                Mario Persona
              </h2>
            </div>
            <p className="font-sans text-sm leading-relaxed md:max-w-sm" style={{ color: "var(--parchment-dark)" }}>
              Para continuar estudando, recomendamos os acervos em vídeo de <strong style={{ color: "var(--gold-light)" }}>3minutos.net</strong> e <strong style={{ color: "var(--gold-light)" }}>respondi.com.br</strong>.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <a
              href="https://www.youtube.com/channel/UCh8VukUO5b-nO5mPPLhV12w"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl p-4 no-underline transition-colors"
              style={{ background: "rgba(255,253,248,0.1)", border: "1px solid rgba(217,184,102,0.35)" }}
            >
              <span className="font-sans text-xs" style={{ color: "var(--gold-light)" }}>Canal no YouTube</span>
              <span className="block text-lg mt-1" style={{ fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}>
                3minutos.net ↗
              </span>
              <span className="font-sans text-xs mt-2 block" style={{ color: "var(--parchment-dark)" }}>
                Vídeos curtos para conhecer e revisar temas bíblicos.
              </span>
            </a>
            <a
              href="https://www.youtube.com/channel/UCU6P1J2OW61Ist2FOj72Xzg"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl p-4 no-underline transition-colors"
              style={{ background: "rgba(255,253,248,0.1)", border: "1px solid rgba(217,184,102,0.35)" }}
            >
              <span className="font-sans text-xs" style={{ color: "var(--gold-light)" }}>Canal no YouTube</span>
              <span className="block text-lg mt-1" style={{ fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}>
                respondi.com.br ↗
              </span>
              <span className="font-sans text-xs mt-2 block" style={{ color: "var(--parchment-dark)" }}>
                Acervo de estudos e respostas sobre a Bíblia.
              </span>
            </a>
          </div>
          <p className="font-sans text-xs mt-5" style={{ color: "var(--parchment-dark)" }}>
            Os canais são externos ao Conforto das Escrituras; o conteúdo, a programação e as inscrições são administrados pelos respectivos responsáveis.
          </p>
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
