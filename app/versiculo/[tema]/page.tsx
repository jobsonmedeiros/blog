import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { encontrarTema, TEMAS_VERSICULOS } from "@/data/temasVersiculos";
import { bibleReferenceHref as criarLinkReferencia } from "@/lib/bible-links";
import { criarFundoNatureza } from '@/data/fundosNatureza';

type Propriedades = {
  params: Promise<{ tema: string }>;
};

export function generateStaticParams() {
  return TEMAS_VERSICULOS.map((tema) => ({ tema: tema.slug }));
}

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const { tema: slug } = await params;
  const tema = encontrarTema(slug);
  return {
    title: tema ? `${tema.titulo} | Versículos | Conforto das Escrituras` : "Tema bíblico",
    description: tema?.resumo,
  };
}

export default async function TemaVersiculoPage({ params }: Propriedades) {
  const { tema: slug } = await params;
  const tema = encontrarTema(slug);
  if (!tema) notFound();

  return (
    <article className="site-container py-10">
      <Link
        href="/versiculo"
        className="font-sans text-sm"
        style={{ color: "var(--gold)", textDecoration: "underline" }}
      >
        ← Voltar para temas
      </Link>

      <header className="mt-7 mb-8">
        <p className="font-sans text-xs uppercase tracking-[0.2em]" style={{ color: "var(--gold)" }}>
          Versículos por tema
        </p>
        <h1
          className="text-4xl md:text-5xl mt-2"
          style={{
            color: "var(--ink)",
            fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif",
            fontWeight: 300,
          }}
        >
          {tema.titulo}
        </h1>
      </header>

      <div
        className="min-h-52 rounded-2xl bg-cover bg-center p-6 md:p-8 flex items-end shadow-[0_16px_38px_rgba(45,33,27,0.16)]"
        style={{
          backgroundColor: '#182124',
          backgroundImage: criarFundoNatureza(TEMAS_VERSICULOS.findIndex(item => item.slug === tema.slug)),
        }}
      >
        <div className="max-w-3xl text-white">
          <Link href={criarLinkReferencia(tema.referencia)} className="no-underline transition-colors duration-200 hover:text-[var(--gold-light)] focus-visible:text-[var(--gold-light)]" title={`Ler ${tema.referencia} na Bíblia`}>
          <blockquote className="text-xl md:text-2xl leading-relaxed">
            “{tema.texto}”
          </blockquote>
          </Link>
          <Link href={criarLinkReferencia(tema.referencia)} className="underline underline-offset-4" aria-label={`Ler ${tema.referencia} na Bíblia`}>
          <cite className="font-sans text-sm not-italic text-white/80 block mt-4">
            — {tema.referencia} · ACF · Ler na Bíblia →
          </cite>
          </Link>
        </div>
      </div>

      <section className="card p-6 md:p-8 mt-8">
        <h2
          className="text-2xl mb-3"
          style={{
            color: "var(--ink)",
            fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif",
          }}
        >
          Uma palavra para hoje
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: "var(--ink-light)" }}>
          {tema.resumo}
        </p>
      </section>
      <section className="mt-7" aria-labelledby="mais-passagens">
        <h2 id="mais-passagens" className="text-2xl mb-2">Mais passagens sobre {tema.titulo.toLocaleLowerCase('pt-BR')}</h2>
        <p className="font-sans text-xs text-[var(--ink-light)] mb-5">Leia cada passagem no seu contexto. Os links abrem o capítulo com o trecho destacado.</p>
        <div className="space-y-4">
          {tema.passagens.slice(1).map(passagem => <article key={passagem.referencia} className="card p-5 sm:p-6">
            <h3 className="font-sans text-sm text-[var(--gold)] mb-3"><Link href={criarLinkReferencia(passagem.referencia)} className="underline underline-offset-4">{passagem.referencia} · ACF ↗</Link></h3>
            <Link href={criarLinkReferencia(passagem.referencia)} className="no-underline hover:text-[var(--gold)]" title={`Ler ${passagem.referencia} na Bíblia`}><blockquote className="text-lg leading-relaxed">“{passagem.texto}”</blockquote></Link>
          </article>)}
        </div>
      </section>
    </article>
  );
}
