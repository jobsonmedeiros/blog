import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth/server';
import { lerIndiceCapitulos } from '@/lib/livros-modelo';
import { listarCapitulosPublicados } from '@/lib/livros-repositorio';
import acervo from '@/data/acervo-darby.json';
import type { ObraAcervo } from '@/lib/acervo-obras';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Livros de Darby | Admin' };

export default async function PainelLivros() {
  if (!await getAdminUser()) redirect('/login?retorno=/admin/livros');
  const livros = (acervo.obras as ObraAcervo[]).filter(o => o.tipo === 'livro');
  const publicados = await listarCapitulosPublicados();

  return (
    <div className="site-container py-8">
      <Link href="/admin" className="font-sans text-sm text-[var(--gold)]">← Admin</Link>
      <header className="mt-5 mb-7">
        <p className="font-sans text-xs uppercase tracking-wider text-[var(--gold)] mb-2">Painel</p>
        <h1 className="text-3xl">Livros de Darby</h1>
        <p className="font-sans text-sm text-[var(--ink-light)] mt-2">
          Traduza os originais em inglês e revise seus textos. Rascunhos só se tornam públicos quando você os publica.
        </p>
      </header>
      <ul className="space-y-4">
        {livros.map(livro => {
          const indice = lerIndiceCapitulos(livro.id);
          const publicadosLivro = publicados.filter(p => p.caminho.startsWith(`${livro.id}/`)).length;
          return (
            <li key={livro.id} className="rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl leading-snug">{livro.titulo}</h2>
                  <p className="font-sans text-xs text-[var(--ink-light)] mt-1">{livro.autor}</p>
                  <p className="font-sans text-xs text-[var(--gold)] mt-2">
                    {indice.length} capítulos · {publicadosLivro} publicados
                  </p>
                </div>
                <Link href={`/admin/livros/${livro.id}`}
                  className="shrink-0 font-sans text-sm text-[var(--gold)] underline underline-offset-4">
                  Abrir →
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
