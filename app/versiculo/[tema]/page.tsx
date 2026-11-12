import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { encontrarTema, TEMAS_VERSICULOS } from "@/data/temasVersiculos";

type Props = {
  params: Promise<{ tema: string }>;
};

export function generateStaticParams() {
  return TEMAS_VERSICULOS.map((tema) => ({ tema: tema.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tema: slug } = await params;
  const tema = encontrarTema(slug);
  return {
    title: tema ? `${tema.titulo} | Versículos | Conforto das Escrituras` : "Tema bíblico",
    description: tema?.resumo,
  };
}

export default async function TemaVersiculoPage({ params }: Props) {
  const { tema: slug } = await params;
  const tema = encontrarTema(slug);
  if (!tema) notFound();

  return (
    <article className="max-w-4xl mx-auto px-4 py-10">
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
        className="h-64 md:h-96 rounded-2xl bg-cover bg-center p-6 md:p-10 flex items-end shadow-[0_16px_38px_rgba(45,33,27,0.16)]"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(20,25,30,0.04), rgba(20,25,30,0.84)), url("${tema.imagem}")`,
        }}
      >
        <div className="max-w-3xl text-white">
          <blockquote className="text-2xl md:text-4xl leading-tight">
            “{tema.texto}”
          </blockquote>
          <cite className="font-sans text-sm not-italic text-white/80 block mt-4">
            — {tema.referencia}
          </cite>
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
    </article>
  );
}
