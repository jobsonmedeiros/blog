import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/server";
import { getDatabase } from "@/lib/db";
import { createSlug } from "@/lib/article-utils";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return jsonError("Não autorizado.", 401);

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
      INSERT INTO articles (author_id, slug, title, category, author, reading_time, excerpt, emoji, content, published_at)
      VALUES (${user.id}, ${slug}, ${title}, ${String(body.category || "Reflexão").trim()}, ${String(body.author || "Conforto das Escrituras").trim()}, ${String(body.reading_time || "5 min").trim()}, ${body.excerpt.trim()}, ${String(body.emoji || "📖").trim()}, ${body.content}, ${body.published ? new Date().toISOString() : null})
      RETURNING id, slug, title, category, author, reading_time, excerpt, emoji, content, published_at
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("unique")
      ? "Já existe um artigo com esse título."
      : "Não foi possível salvar o artigo.";
    return jsonError(message, 400);
  }
}