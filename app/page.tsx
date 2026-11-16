import Link from "next/link";
import VersiculoDoDia from "@/components/VersiculoDoDia";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-14 md:py-20">

      {/* Header com Login */}
      <header className="flex justify-between items-center mb-12 pb-4 border-b border-[var(--gold)]/20">
        <span className="font-sans text-sm text-[var(--ink-light)]">
          Conforto das Escrituras
        </span>
        
        <Link 
          href="/login" 
          className="font-sans text-sm font-medium text-[var(--ink)] hover:text-[var(--gold)] transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          Admin
        </Link>
      </header>

      {/* Hero */}
      <section className="text-center mb-16 animate-fadeIn">
        <div className="mx-auto mb-6 h-px w-16 bg-[var(--gold)] opacity-70" aria-hidden />
        <h1
          className="text-5xl md:text-7xl mb-5 leading-[0.98] tracking-[-0.045em]"
          style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontWeight: 300 }}
        >
          Conforto das Escrituras
        </h1>
        <p className="font-sans text-base md:text-lg mb-2" style={{ color: "var(--ink-light)", fontWeight: 300 }}>
          Um espaço de paz para leitura e estudo da Palavra de Deus
        </p>
        <hr className="gold-divider w-48 mx-auto" />
      </section>

      {/* Versículo do Dia */}
      <section className="mb-16">
        <VersiculoDoDia />
      </section>

      {/* Cards de navegação */}
      <section className="grid md:grid-cols-3 gap-5 mb-16">
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
          <Link key={card.href} href={card.href} className="card p-7 flex flex-col gap-3 no-underline group">
            <span className="text-2xl opacity-80" aria-hidden>{card.emoji}</span>
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
            >
              {card.title}
            </h2>
            <p className="font-sans text-sm leading-relaxed" style={{ color: "var(--ink-light)" }}>
              {card.desc}
            </p>
            <span
              className="font-sans text-sm mt-auto pt-3"
              style={{ color: "var(--gold)", fontWeight: 500 }}
            >
              Acessar →
            </span>
          </Link>
        ))}
      </section>

      {/* Sobre o blog */}
      <section
        className="rounded-2xl p-8 md:p-12 text-center shadow-[0_14px_35px_rgba(45,33,27,0.15)]"
        style={{ background: "var(--ink)", color: "var(--parchment)" }}
      >
        <p className="text-2xl mb-3" style={{ fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontStyle: "italic" }}>
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