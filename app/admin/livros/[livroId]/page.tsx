import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth/server';
import { livroIdValido, lerIndiceCapitulos, encontrarLivro } from '@/lib/livros-modelo';
import { listarCapitulosPublicados } from '@/lib/livros-repositorio';
import acervo from '@/data/acervo-darby.json';
import type { ObraAcervo } from '@/lib/acervo-obras';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ livroId: string }> }): Promise<Metadata> {
  const { livroId } = await params;
  if (!livroIdValido(livroId)) return { title: 'Livro não encontrado' };
  const livro = encontrarLivro(acervo.obras as ObraAcervo[], livroId);
  return { title: livro ? `${livro.titulo} | Admin Livros` : 'Livro não encontrado' };
}

export default async function PainelLivro({ params }: { params: Promise<{ livroId: string }> }) {
  const { livroId } = await params;
  if (!livroIdValido(livroId)) notFound();
  if (!await getAdminUser()) redirect(`/login?retorno=${encodeURIComponent(`/admin/livros/${livroId}`)}`);

  const livro = encontrarLivro(acervo.obras as ObraAcervo[], livroId);
  if (!livro) notFound();

  const indice = lerIndiceCapitulos(livroId);
  const publicados = await listarCapitulosPublicados();
  const publicadoSet = new Set(publicados.map(p => p.caminho));

  return (
    <div className="site-container py-8">
      <Link href="/admin/livros" className="font-sans text-sm text-[var(--gold)]">← Meus livros</Link>
      <header className="mt-5 mb-7">
        <p className="font-sans text-xs uppercase tracking-wider text-[var(--gold)] mb-2">Painel · Livro</p>
        <h1 className="text-3xl leading-tight">{livro.titulo}</h1>
        <p className="font-sans text-sm text-[var(--ink-light)] mt-2">{livro.autor}</p>
        {livro.originais[0] && (
          <a href={livro.originais[0].url} target="_blank" rel="noopener noreferrer"
            className="font-sans text-xs text-[var(--gold)] underline mt-2 inline-block">
            Original em inglês ↗
          </a>
        )}
      </header>
      {indice.length === 0 ? (
        <p className="font-sans text-sm text-[var(--ink-light)]">Esta edição ainda não tem texto disponível para edição.</p>
      ) : (
        <ol className="space-y-2 font-sans">
          {indice.map((cap, idx) => {
            const caminho = `${livroId}/${cap.slug}`;
            const estaPublicado = publicadoSet.has(caminho);
            return (
              <li key={cap.slug} className="grid grid-cols-[1.5rem_minmax(0,1fr)] sm:grid-cols-[1.5rem_minmax(0,1fr)_auto_auto] items-center gap-x-3 gap-y-2 rounded-lg border border-[var(--parchment-dark)] bg-[var(--surface)] px-4 py-3">
                <span className="text-sm text-[var(--ink-light)] w-6 shrink-0">{idx + 1}</span>
                <span className="min-w-0 break-words text-sm">{cap.titulo}</span>
                <span className={`col-start-2 sm:col-start-auto justify-self-start text-xs rounded-full px-2 py-0.5 ${estaPublicado ? 'bg-green-100 text-green-800' : 'text-[var(--ink-light)]'}`}>
                  {estaPublicado ? 'Publicado' : 'Rascunho'}
                </span>
                <Link href={`/admin/livros/${livroId}/${cap.slug}`}
                  className="col-start-2 sm:col-start-auto min-h-11 inline-flex items-center text-xs text-[var(--gold)] underline underline-offset-4">
                  Editar →
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
