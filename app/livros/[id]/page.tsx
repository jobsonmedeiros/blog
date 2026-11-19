import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import acervo from '@/data/acervo-darby.json';
import type { ObraAcervo } from '@/lib/acervo-obras';
import { lerIndiceCapitulos } from '@/lib/livros-modelo';

const livros = (acervo.obras as ObraAcervo[]).filter(obra => obra.tipo === 'livro');
export function generateStaticParams() { return livros.map(obra => ({ id: obra.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const livro = livros.find(obra => obra.id === id);
  return { title: livro ? `${livro.titulo} | Livros` : 'Livro não encontrado' };
}

export default async function PaginaLivro({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const livro = livros.find(obra => obra.id === id);
  if (!livro) notFound();
  const original = lerIndiceCapitulos(id).find(capitulo => capitulo.idioma === 'en');
  return <article className="site-container py-8 sm:py-10">
    <Link href="/livros" className="font-sans text-sm text-[var(--gold)]">← Livros</Link>
    <header className="mt-6 mb-8">
      <p className="font-sans text-xs uppercase tracking-wider text-[var(--gold)] mb-3">Livro / livreto</p>
      <h1 className="text-3xl sm:text-4xl leading-tight">{livro.titulo}</h1>
      <p className="font-sans text-sm text-[var(--ink-light)] mt-3">{livro.autor}</p>
      {livro.descricao && <p className="text-lg leading-relaxed mt-5 text-[var(--ink-light)]">{livro.descricao}</p>}
      {livro.notas.map(nota => <p key={nota} className="font-sans mt-3 text-sm leading-relaxed text-[var(--ink-light)]">{nota}</p>)}
    </header>
    {original && <section className="mb-6 rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] p-5">
      <h2 className="text-2xl">Leia e traduza aqui</h2>
      <p className="font-sans text-sm mt-2 text-[var(--ink-light)]">Original em inglês e português lado a lado. Você pode usar o auxílio automático de leitura ou consultar a tradução revisada, quando publicada.</p>
      <div className="font-sans flex flex-wrap gap-4 mt-4">
        <Link href={`/livros/${id}/${original.slug}`} className="btn-primary inline-flex items-center min-h-11">Abrir leitura →</Link>
        <Link href={`/admin/livros/${id}/${original.slug}`} className="inline-flex items-center min-h-11 text-sm text-[var(--gold)] underline">Editar minha tradução</Link>
      </div>
    </section>}
    <div className="grid md:grid-cols-2 gap-4 font-sans mb-8">
      <section className="rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-medium">Leitura em português</h2>
        <p className="text-sm text-[var(--ink-light)] mt-2">Edição e tradução da Verdades Vivas.</p>
        <a href={livro.fontePortugues.url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex mt-4">Ler na Verdades Vivas ↗</a>
      </section>
      <section className="rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-medium">Referência em inglês</h2>
        {livro.originais.length ? <ul className="mt-3 space-y-4">{livro.originais.map(original => <li key={original.url}>
          <a href={original.url} target="_blank" rel="noopener noreferrer" lang="en" className="inline-flex min-h-10 items-center text-sm underline text-[var(--gold)]">{original.titulo} ↗</a>
          {original.observacao && <p className="text-xs leading-relaxed mt-1 text-[var(--ink-light)]">{original.observacao}</p>}
        </li>)}</ul> : <p className="text-sm leading-relaxed mt-3 text-[var(--ink-light)]">A correspondência desta edição com uma fonte em inglês ainda não foi confirmada.</p>}
      </section>
    </div>
    {livro.indice.length > 0 && <section>
      <h2 className="text-2xl mb-3">Sumário em português</h2>
      <p className="font-sans text-xs text-[var(--ink-light)] mb-4">Cada parte abre diretamente na Verdades Vivas, na ordem da edição.</p>
      <ol className="font-sans list-decimal pl-6 space-y-1">{livro.indice.map(parte => <li key={parte.url} className="pl-1"><a href={parte.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center py-2 text-sm underline text-[var(--gold)]">{parte.titulo} ↗</a></li>)}</ol>
    </section>}
    <p className="font-sans text-xs leading-relaxed mt-8 pt-5 border-t border-[var(--parchment-dark)] text-[var(--ink-light)]">As fontes e as edições consultadas são identificadas acima. A leitura local usa somente texto do original histórico em inglês. Sua tradução permanece privada até você publicá-la no painel.</p>
  </article>;
}
