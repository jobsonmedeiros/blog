import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth/server';
import { livroIdValido, capituloSlugValido, lerIndiceCapitulos, lerTextoCapitulo, encontrarLivro, navegacaoCapitulo, chaveCapitulo } from '@/lib/livros-modelo';
import { lerRascunhoCapitulo } from '@/lib/livros-repositorio';
import acervo from '@/data/acervo-darby.json';
import type { ObraAcervo } from '@/lib/acervo-obras';
import EditorCapitulo from '@/components/EditorCapitulo';

export const dynamic = 'force-dynamic';

type Params = { livroId: string; capSlug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { livroId } = await params;
  if (!livroIdValido(livroId)) return { title: 'Capítulo não encontrado' };
  const livro = encontrarLivro(acervo.obras as ObraAcervo[], livroId);
  return { title: livro ? `Editar · ${livro.titulo} | Admin` : 'Capítulo não encontrado' };
}

export default async function EditarCapitulo({ params }: { params: Promise<Params> }) {
  const { livroId, capSlug } = await params;
  if (!livroIdValido(livroId) || !capituloSlugValido(capSlug)) notFound();
  if (!await getAdminUser()) redirect(`/login?retorno=${encodeURIComponent(`/admin/livros/${livroId}/${capSlug}`)}`);

  const livro = encontrarLivro(acervo.obras as ObraAcervo[], livroId);
  if (!livro) notFound();

  const indice = lerIndiceCapitulos(livroId);
  const capitulo = indice.find(c => c.slug === capSlug);
  if (!capitulo) notFound();

  const textoOriginal = lerTextoCapitulo(livroId, capSlug) ?? '';
  const caminho = chaveCapitulo(livroId, capSlug);
  const rascunho = await lerRascunhoCapitulo(caminho);
  const { anterior, proximo } = navegacaoCapitulo(indice, capSlug);

  return (
    <div className="site-container pt-4 pb-8">
      {/* Cabeçalho */}
      <nav className="font-sans flex flex-wrap gap-4 text-xs text-[var(--gold)] mb-4">
        <Link href="/admin/livros" className="underline">← Meus livros</Link>
        <Link href={`/admin/livros/${livroId}`} className="underline">{livro.titulo}</Link>
        {livro.originais[0] && (
          <a href={livro.originais[0].url} target="_blank" rel="noopener noreferrer" className="underline text-[var(--ink-light)]">
            Original em inglês ↗
          </a>
        )}
      </nav>
      <header className="mb-5">
        <p className="font-sans text-xs uppercase tracking-wider text-[var(--gold)] mb-1">Capítulo</p>
        <h1 className="text-2xl sm:text-3xl leading-tight">{capitulo.titulo}</h1>
        <p className="font-sans text-sm text-[var(--ink-light)] mt-1">{livro.titulo}</p>
      </header>
      <EditorCapitulo
        caminho={caminho}
        livroId={livroId}
        livroTitulo={livro.titulo}
        capitulo={capitulo}
        tituloOriginal={rascunho?.tituloOriginal ?? capitulo.titulo}
        textoOriginal={rascunho?.textoOriginal ?? textoOriginal}
        rascunho={rascunho}
        anterior={anterior}
        proximo={proximo}
      />
    </div>
  );
}
