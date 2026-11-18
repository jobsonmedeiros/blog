import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/server';
import { isSameOrigin } from '@/lib/article-utils';
import { caminhoRevistaValido, validarTextoRevista } from '@/lib/revistas-modelo';
import { salvarTraducaoRevista, TAG_TRADUCOES_PUBLICADAS } from '@/lib/revistas-repositorio';
import { revalidateTag } from 'next/cache';

export async function POST(pedido: Request) {
  if (!isSameOrigin(pedido)) return NextResponse.json({ error: 'Origem não autorizada.' }, { status: 403 });
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Entre com a conta do administrador para salvar.' }, { status: 401 });
    const dados = await pedido.json().catch(() => null);
    if (!dados || !caminhoRevistaValido(dados.caminho) || !Number.isInteger(dados.versao) || dados.versao < 0 || typeof dados.publicar !== 'boolean') return NextResponse.json({ error: 'Pedido inválido.' }, { status: 400 });
    let texto;
    try { texto = validarTextoRevista(dados); }
    catch (erro) { return NextResponse.json({ error: erro instanceof Error ? erro.message : 'Texto inválido.' }, { status: 400 }); }
    if (dados.publicar && (!texto.tituloTraduzido || !texto.textoTraduzido)) return NextResponse.json({ error: 'Preencha o título e o texto traduzidos antes de publicar.' }, { status: 400 });
    const salvo = await salvarTraducaoRevista(dados.caminho, texto, dados.versao, dados.publicar, user.id);
    if (!salvo) return NextResponse.json({ error: 'Este rascunho foi alterado em outra janela. Copie suas alterações antes de reabrir o editor; nada foi sobrescrito.' }, { status: 409 });
    if (dados.publicar) revalidateTag(TAG_TRADUCOES_PUBLICADAS, { expire: 0 });
    return NextResponse.json(salvo);
  } catch { return NextResponse.json({ error: 'Não foi possível salvar no servidor. Mantenha esta página aberta e tente novamente.' }, { status: 503 }); }
}
