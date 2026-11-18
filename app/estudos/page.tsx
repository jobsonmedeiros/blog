import type { Metadata } from "next";
import CatalogoEstudos from '@/components/StudyCatalog';
import { ARTIGOS } from '@/data/studies';
import { getPublishedArticles as buscarArtigosPublicados } from '@/lib/articles';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Estudos | Conforto das Escrituras",
};

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


export default async function EstudosPage() {
  const publicados = await buscarArtigosPublicados();
  const artigosAnteriores = ARTIGOS.filter(artigo => !artigo.id.startsWith('reflexao-') && artigo.id !== 'como-ler-citacoes-biblicas' && artigo.id !== 'como-traduzir-a-leitura');
  const artigos = [...publicados.map(artigo => ({ id: artigo.slug, titulo: artigo.title, categoria: artigo.category, resumo: artigo.excerpt, autor: artigo.author, leitura: artigo.reading_time, emoji: artigo.emoji })), ...artigosAnteriores];
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
        <CatalogoEstudos artigos={artigos} />
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
          {LIVROS.map((livroListado) => (
            <a
              key={livroListado.titulo}
              href={livroListado.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 flex gap-4 no-underline group"
              aria-label={`${livroListado.titulo}: ${livroListado.linkLabel}`}
            >
              <span className="text-3xl flex-shrink-0">{livroListado.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className="text-lg"
                    style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontWeight: 600 }}
                  >
                    {livroListado.titulo}
                  </h3>
                  <span
                    className="font-sans text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "var(--parchment-dark)", color: "var(--ink-light)" }}
                  >
                    {livroListado.tipo}
                  </span>
                </div>
                <p className="font-sans text-xs mb-2" style={{ color: "var(--gold)" }}>
                  {livroListado.autor}
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--ink-light)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
                >
                  {livroListado.desc}
                </p>
                <span className="font-sans text-sm mt-3 inline-block" style={{ color: "var(--gold)", fontWeight: 500 }}>
                  {livroListado.linkLabel}
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
