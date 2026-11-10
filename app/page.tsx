import Link from "next/link";
import VersiculoDoDia from "@/components/VersiculoDoDia";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Hero */}
      <section className="text-center mb-14 animate-fadeIn">
        <div className="text-5xl mb-4">✦</div>
        <h1
          className="text-5xl md:text-6xl mb-4 leading-tight"
          style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif", fontWeight: 300 }}
        >
          Conforto das Escrituras
        </h1>
        <p className="font-sans text-lg mb-2" style={{ color: "var(--ink-light)", fontWeight: 300 }}>
          Um espaço de paz para leitura e estudo da Palavra de Deus
        </p>
        <hr className="gold-divider w-48 mx-auto" />
      </section>

      {/* Versículo do Dia */}
      <section className="mb-14">
        <VersiculoDoDia />
      </section>

      {/* Cards de navegação */}
      <section className="grid md:grid-cols-3 gap-6 mb-14">
        {[
          {
            href: "/leitura",
            emoji: "📖",
            title: "Leitura Bíblica",
            desc: "Leia a Bíblia em ambiente tranquilo, com tipografia cuidadosa e navegação por livros e capítulos.",
          },
          {
            href: "/versiculo",
            emoji: "🕊️",
            title: "Versículo do Dia",
            desc: "Uma palavra para cada dia. Reflexões breves para nutrir a fé e o ânimo no cotidiano.",
          },
          {
            href: "/estudos",
            emoji: "📚",
            title: "Espaço de Estudos",
            desc: "Artigos, livros e recursos para aprofundar o conhecimento das Sagradas Escrituras.",
          },
        ].map((card) => (
          <Link key={card.href} href={card.href} className="card p-6 flex flex-col gap-3 no-underline group">
            <span className="text-3xl">{card.emoji}</span>
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--ink)", fontFamily: "'Crimson Pro', serif" }}
            >
              {card.title}
            </h2>
            <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>
              {card.desc}
            </p>
            <span
              className="font-sans text-sm mt-auto"
              style={{ color: "var(--gold)", fontWeight: 500 }}
            >
              Acessar →
            </span>
          </Link>
        ))}
      </section>

      {/* Sobre o blog */}
      <section
        className="rounded-xl p-8 text-center"
        style={{ background: "var(--ink)", color: "var(--parchment)" }}
      >
        <p className="text-2xl mb-3" style={{ fontFamily: "'Crimson Pro', serif", fontStyle: "italic" }}>
          &ldquo;Pois a palavra de Deus é viva e eficaz…&rdquo;
        </p>
        <p className="font-sans text-sm mb-4" style={{ color: "var(--gold-light)" }}>Hebreus 4:12</p>
        <a
          href="https://confortodasescrituras.blogspot.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-block"
        >
          Visitar o Blog ↗
        </a>
      </section>

    </div>
  );
}
