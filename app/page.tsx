import Link from "next/link";
import VersiculoDoDia from "@/components/VersiculoDoDia";
import { bibleReferenceHref as criarLinkReferencia } from '@/lib/bible-links';
import { criarFundoNatureza } from '@/data/fundosNatureza';

export default function PaginaInicial() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-4 pb-0">

      {/* Versículo do Dia */}
      <section className="mb-4" aria-label="Versículo do dia">
        <VersiculoDoDia tituloDaPagina />
      </section>

      {/* Cards de navegação */}
      <section className="grid md:grid-cols-3 gap-3 mb-8">
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
        ].map((cartao, indice) => (
          <Link key={cartao.href} href={cartao.href} className="card p-4 flex flex-col gap-1.5 no-underline group" style={{ backgroundImage: criarFundoNatureza(indice, true), backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--ink)", fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif" }}
            >
              <span className="mr-2 text-base opacity-80" aria-hidden>{cartao.emoji}</span>{cartao.title}
            </h2>
            <p className="font-sans text-sm leading-snug" style={{ color: "var(--ink-light)" }}>
              {cartao.desc}
            </p>
            <span
              className="font-sans text-xs mt-auto pt-1"
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
        style={{ backgroundColor: "var(--ink)", backgroundImage: criarFundoNatureza(2), backgroundSize: 'cover', backgroundPosition: 'center', color: "var(--parchment)" }}
      >
        <p className="text-2xl mb-3" style={{ fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontStyle: "italic" }}>
          <Link href={criarLinkReferencia('Hebreus 4:12')} className="no-underline transition-colors duration-200 hover:text-[var(--gold-light)] focus-visible:text-[var(--gold-light)]" title="Ler Hebreus 4:12 na Bíblia">&ldquo;Pois a palavra de Deus é viva e eficaz…&rdquo;</Link>
        </p>
        <p className="font-sans text-sm mb-4" style={{ color: "var(--gold-light)" }}><Link href={criarLinkReferencia('Hebreus 4:12')} className="underline underline-offset-4">Hebreus 4:12</Link></p>
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
