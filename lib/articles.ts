import 'server-only';
import { getDatabase } from "@/lib/db";
import type { CmsArticle } from "@/lib/article-utils";

export type { CmsArticle } from "@/lib/article-utils";

export async function getPublishedArticles(): Promise<CmsArticle[]> {
  const sql = getDatabase();
  const rows = await sql`
    SELECT id, slug, title, category, author, reading_time, excerpt, emoji, content, published_at
    FROM articles
    WHERE published_at IS NOT NULL
    ORDER BY published_at DESC
  `;
  // Neon returns generic records; the selected columns match CmsArticle.
  return rows as unknown as CmsArticle[];
}

export async function getPublishedArticle(slug: string): Promise<CmsArticle | null> {
  const sql = getDatabase();
  const rows = await sql`
    SELECT id, slug, title, category, author, reading_time, excerpt, emoji, content, published_at
    FROM articles
    WHERE slug = ${slug} AND published_at IS NOT NULL
    LIMIT 1
  `;
  return (rows as unknown as CmsArticle[])[0] ?? null;
}
