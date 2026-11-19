import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { livroIdValido, capituloSlugValido, lerIndiceCapitulos, lerTextoCapitulo, encontrarLivro, navegacaoCapitulo, chaveCapitulo } from '@/lib/livros-modelo';
import { lerCapituloPublicado } from '@/lib/livros-repositorio';
import acervo from '@/data/acervo-darby.json';
import type { ObraAcervo } from '@/lib/acervo-obras';
import LeitorRevista from '@/components/LeitorRevista';

export const dynamic = 'force-dynamic';

type Params = { id: string; capSlug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id: livroId, capSlug } = await params;
  if (!livroIdValido(livroId) || !capituloSlugValido(capSlug)) return { title: 'Capítulo não encontrado' };
  const livro = encontrarLivro(acervo.obras as ObraAcervo[], livroId);
  const indice = lerIndiceCapitulos(livroId);
  const cap = indice.find(c => c.slug === capSlug);
  return { title: cap && livro ? `${cap.titulo} · ${livro.titulo} | Conforto das Escrituras` : 'Capítulo não encontrado' };
}

export default async function PaginaCapitulo({ params }: { params: Promise<Params> }) {
  const { id: livroId, capSlug } = await params;
  if (!livroIdValido(livroId) || !capituloSlugValido(capSlug)) notFound();

  const livro = encontrarLivro(acervo.obras as ObraAcervo[], livroId);
  if (!livro) notFound();

  const indice = lerIndiceCapitulos(livroId);
  const capitulo = indice.find(c => c.slug === capSlug);
  if (!capitulo) notFound();

  const textoLocal = lerTextoCapitulo(livroId, capSlug);
  if (!textoLocal) notFound();

  const caminho = chaveCapitulo(livroId, capSlug);
  const { publicado, consultaIndisponivel } = await lerCapituloPublicado(caminho)
    .then(publicado => ({ publicado, consultaIndisponivel: false }))
    .catch(() => ({ publicado: null, consultaIndisponivel: true }));
  const { anterior, proximo, posicao, total } = navegacaoCapitulo(indice, capSlug);

  if (capitulo.idioma === 'en') {
    const pagina = { caminho, titulo: publicado?.tituloOriginal || capitulo.titulo, texto: publicado?.textoOriginal || textoLocal, autor: livro.autor, itens: [], anteriores: [] };
    return <article className="site-container py-6 sm:py-10">
      <nav className="font-sans flex flex-wrap gap-4 text-sm text-[var(--gold)] mb-5">
        <Link href={`/livros/${livroId}`} className="underline">← {livro.titulo}</Link>
        <Link href={`/admin/livros/${livroId}/${capSlug}`} className="underline">Editar minha tradução</Link>
        <a href={capitulo.url} target="_blank" rel="noopener noreferrer" className="underline">Fonte em inglês ↗</a>
      </nav>
      <header className="mb-6"><h1 className="text-3xl sm:text-4xl leading-tight break-words">{publicado?.tituloRevisado || livro.titulo}</h1><p className="font-sans text-sm text-[var(--ink-light)] mt-2">{livro.autor}</p></header>
      {consultaIndisponivel && <p role="status" className="font-sans text-sm mb-4">A tradução publicada está temporariamente indisponível. O original continua disponível.</p>}
      <LeitorRevista pagina={pagina} publicada={publicado ? { tituloOriginal: pagina.titulo, textoOriginal: pagina.texto, tituloTraduzido: publicado.tituloRevisado, textoTraduzido: publicado.textoRevisado } : null} />
    </article>;
  }

  // Texto a exibir: revisão publicada tem prioridade, senão usa o original importado
  const tituloExibido = publicado?.tituloRevisado || capitulo.titulo;
  const textoExibido = publicado?.textoRevisado || textoLocal;
  const paragrafos = textoExibido.split(/\n\s*\n/).filter(p => p.trim());

  return (
    <article className="site-container py-8 sm:py-10">
      {/* Navegação de topo */}
      <nav className="font-sans flex flex-wrap gap-4 text-sm text-[var(--gold)] mb-6">
        <Link href="/livros" className="underline">← Livros</Link>
        <Link href={`/livros/${livroId}`} className="underline">{livro.titulo}</Link>
      </nav>

      <header className="mb-8">
        <p className="font-sans text-xs uppercase tracking-widest text-[var(--gold)] mb-2">
          Capítulo {posicao} de {total}
        </p>
        <h1 className="text-3xl sm:text-4xl leading-tight">{tituloExibido}</h1>
        <p className="font-sans text-sm text-[var(--ink-light)] mt-3">{livro.autor}</p>
        <div className="flex flex-wrap gap-4 mt-3 font-sans text-xs text-[var(--gold)]">
          {livro.fontePortugues && (
            <a href={livro.fontePortugues.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              Fonte: Verdades Vivas ↗
            </a>
          )}
          {livro.originais[0] && (
            <a href={livro.originais[0].url} target="_blank" rel="noopener noreferrer" lang="en" className="underline underline-offset-4">
              Original em inglês ↗
            </a>
          )}
        </div>
        {!publicado && (
          <p className="font-sans text-xs mt-3 text-[var(--ink-light)] italic">
            Texto importado da Verdades Vivas · ainda não revisado pelo autor.
          </p>
        )}
      </header>

      {/* Texto */}
      <div className="space-y-5">
        {paragrafos.map((paragrafo, idx) => (
          <p key={idx} className="text-lg leading-relaxed">{paragrafo}</p>
        ))}
      </div>

      {/* Navegação de rodapé */}
      <nav className="font-sans mt-12 pt-6 border-t border-[var(--parchment-dark)] flex justify-between gap-4 text-sm text-[var(--gold)]">
        {anterior
          ? <Link href={`/livros/${livroId}/${anterior.slug}`} className="underline">← {anterior.titulo}</Link>
          : <span />}
        {proximo
          ? <Link href={`/livros/${livroId}/${proximo.slug}`} className="underline">{proximo.titulo} →</Link>
          : <Link href={`/livros/${livroId}`} className="underline">Ver índice do livro →</Link>}
      </nav>

      <p className="font-sans text-xs leading-relaxed mt-8 text-[var(--ink-light)]">
        J. N. Darby (1800–1882). Obras de domínio público. Tradução portuguesa pela Verdades Vivas.
      </p>
    </article>
  );
}
