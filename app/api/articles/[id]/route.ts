import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/server";
import { getDatabase } from "@/lib/db";
import { createSlug } from "@/lib/article-utils";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return jsonError("Não autorizado.", 401);

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || typeof body.content !== "string" || typeof body.excerpt !== "string") {
    return jsonError("Revise os campos obrigatórios do artigo.", 400);
  }

  const title = body.title.trim();
  const slug = createSlug(title);
  if (!title || !slug) return jsonError("Informe um título válido.", 400);

  try {
    const sql = getDatabase();
    const rows = await sql`
      UPDATE articles SET slug = ${slug}, title = ${title}, category = ${String(body.category || "Reflexão").trim()}, author = ${String(body.author || "Conforto das Escrituras").trim()}, reading_time = ${String(body.reading_time || "5 min").trim()}, excerpt = ${body.excerpt.trim()}, emoji = ${String(body.emoji || "📖").trim()}, content = ${body.content}, published_at = ${body.published ? new Date().toISOString() : null}, updated_at = now()
      WHERE id = ${id} AND author_id = ${user.id}
      RETURNING id, slug, title, category, author, reading_time, excerpt, emoji, content, published_at
    `;
    if (!rows[0]) return jsonError("Artigo não encontrado.", 404);
    return NextResponse.json(rows[0]);
  } catch (error) {
    const message = error instanceof Error && error.message.includes("unique")
      ? "Já existe um artigo com esse título."
      : "Não foi possível atualizar o artigo.";
    return jsonError(message, 400);
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) return jsonError("Não autorizado.", 401);

  const { id } = await context.params;
  const sql = getDatabase();
  const rows = await sql`DELETE FROM articles WHERE id = ${id} AND author_id = ${user.id} RETURNING id`;
  if (!rows[0]) return jsonError("Artigo não encontrado.", 404);
  return NextResponse.json({ ok: true });
}