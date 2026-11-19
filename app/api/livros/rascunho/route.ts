import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/server';
import { isSameOrigin } from '@/lib/article-utils';
import { livroIdValido, capituloSlugValido, chaveCapitulo, encontrarLivro, lerIndiceCapitulos, lerTextoCapitulo } from '@/lib/livros-modelo';
import acervo from '@/data/acervo-darby.json';
import type { ObraAcervo } from '@/lib/acervo-obras';
import { salvarCapitulo, validarTextoCapitulo, TAG_LIVROS_PUBLICADOS } from '@/lib/livros-repositorio';
import { revalidateTag } from 'next/cache';

export async function POST(pedido: Request) {
  if (!isSameOrigin(pedido)) return NextResponse.json({ error: 'Origem não autorizada.' }, { status: 403 });
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Entre com a conta do administrador.' }, { status: 401 });
    const dados = await pedido.json().catch(() => null);
    if (
      !dados ||
      !livroIdValido(dados.livroId) ||
      !capituloSlugValido(dados.capSlug) ||
      !Number.isSafeInteger(dados.versao) || dados.versao < 0 ||
      typeof dados.publicar !== 'boolean'
    ) return NextResponse.json({ error: 'Pedido inválido.' }, { status: 400 });

    const livro = encontrarLivro(acervo.obras as ObraAcervo[], dados.livroId);
    const capitulo = livro && lerIndiceCapitulos(livro.id).find(item => item.slug === dados.capSlug);
    const original = capitulo && lerTextoCapitulo(dados.livroId, dados.capSlug);
    if (!capitulo || !original) return NextResponse.json({ error: 'Capítulo não encontrado.' }, { status: 404 });

    let texto;
    try { texto = validarTextoCapitulo(dados); }
    catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : 'Texto inválido.' }, { status: 400 }); }

    if (dados.publicar && (!texto.tituloRevisado || !texto.textoRevisado))
      return NextResponse.json({ error: 'Preencha o título e o texto revisados antes de publicar.' }, { status: 400 });

    const caminho = chaveCapitulo(dados.livroId, dados.capSlug);
    const salvo = await salvarCapitulo(
      caminho, capitulo.titulo, original,
      texto, dados.versao, dados.publicar, user.id
    );
    if (!salvo) return NextResponse.json({
      error: 'Este rascunho foi alterado em outra janela. Copie suas alterações antes de reabrir o editor.',
    }, { status: 409 });

    if (dados.publicar) revalidateTag(TAG_LIVROS_PUBLICADOS, { expire: 0 });
    return NextResponse.json(salvo);
  } catch {
    return NextResponse.json({ error: 'Não foi possível salvar. Tente novamente.' }, { status: 503 });
  }
}
