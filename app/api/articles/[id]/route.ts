import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/server';
import { deleteArticle, saveArticle } from '@/lib/article-repository';
import { ArticleValidationError, isSameOrigin, isUuid, parseArticle } from '@/lib/article-utils';

type Context = { params: Promise<{ id: string }> };
async function mutate(request: Request, context: Context, remove: boolean) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Origem não autorizada.' }, { status: 403 });
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Entre com a conta do administrador.' }, { status: 401 });
    const { id } = await context.params;
    if (!isUuid(id)) return NextResponse.json({ error: 'Artigo inválido.' }, { status: 400 });
    const result = remove ? await deleteArticle(id) : await saveArticle(parseArticle(await request.json().catch(() => null)), user.id, id);
    if (!result) return NextResponse.json({ error: 'Artigo não encontrado.' }, { status: 404 });
    return NextResponse.json(remove ? { ok: true } : result);
  } catch (error) {
    const invalid = error instanceof ArticleValidationError;
    return NextResponse.json({ error: invalid ? error.message : 'Não foi possível concluir agora. Tente novamente.' }, { status: invalid ? 400 : 503 });
  }
}
export async function PATCH(request: Request, context: Context) { return mutate(request, context, false); }
export async function DELETE(request: Request, context: Context) { return mutate(request, context, true); }
