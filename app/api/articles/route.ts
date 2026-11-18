import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth/server';
import { getPublishedArticles } from '@/lib/articles';
import { saveArticle } from '@/lib/article-repository';
import { ArticleValidationError, isSameOrigin, parseArticle } from '@/lib/article-utils';

export const dynamic = 'force-dynamic';
export async function GET() {
  try { return NextResponse.json(await getPublishedArticles()); }
  catch { return NextResponse.json({ error: 'Não foi possível carregar os artigos.' }, { status: 503 }); }
}
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Origem não autorizada.' }, { status: 403 });
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: 'Entre com a conta do administrador.' }, { status: 401 });
    const input = parseArticle(await request.json().catch(() => null));
    return NextResponse.json(await saveArticle(input, user.id), { status: 201 });
  } catch (error) {
    const invalid = error instanceof ArticleValidationError;
    return NextResponse.json({ error: invalid ? error.message : 'Não foi possível salvar agora. Tente novamente.' }, { status: invalid ? 400 : 503 });
  }
}
