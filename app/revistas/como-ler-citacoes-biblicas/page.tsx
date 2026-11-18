import type { Metadata } from 'next';
import Link from 'next/link';
import GuiaReferenciasBiblicas from '@/components/GuiaReferenciasBiblicas';

export const metadata: Metadata = {
  title: 'Como ler citações bíblicas | Revistas | Conforto das Escrituras',
  description: 'Aprenda a encontrar livros, capítulos e versículos e a entender abreviações, sinais e letras nas referências bíblicas.',
};

export default function PostComoLerCitacoesBiblicas() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8 md:py-10">
      <Link href="/revistas" className="font-sans text-sm text-[var(--gold)]">← Revistas</Link>
      <p className="font-sans text-xs uppercase tracking-wider mt-6 mb-2 text-[var(--gold)]">Como ler a Bíblia</p>
      <h1 className="text-3xl sm:text-4xl leading-tight mb-3">Como ler citações bíblicas</h1>
      <p className="font-sans text-base text-[var(--ink-light)]">Livro, capítulo e versículo: um guia prático para encontrar e compreender as referências.</p>
      <p className="font-sans text-xs mt-3 text-[var(--ink-light)]">Conforto das Escrituras · 6 min de leitura</p>
      <hr className="gold-divider" />
      <GuiaReferenciasBiblicas />
      <div className="mt-8 pt-5 border-t border-[var(--parchment-dark)] flex flex-wrap items-center justify-between gap-4 font-sans text-sm">
        <Link href="/leitura" className="btn-primary">Abrir a Bíblia →</Link>
        <Link href="/revistas" className="text-[var(--gold)]">Ver revistas</Link>
      </div>
    </article>
  );
}
