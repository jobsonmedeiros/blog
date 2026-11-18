import 'server-only';
import { randomUUID } from 'node:crypto';
import { getDatabase } from '@/lib/db';
import { createSlug, type CmsArticle, type parseArticle } from '@/lib/article-utils';

type ArticleInput = ReturnType<typeof parseArticle>;

export async function saveArticle(input: ArticleInput, userId: string, id?: string) {
  const sql = getDatabase();
  if (id) {
    const rows = await sql`
      UPDATE articles SET title=${input.title}, category=${input.category}, author=${input.author},
        reading_time=${input.reading_time}, excerpt=${input.excerpt}, emoji=${input.emoji},
        content=${input.content}, updated_at=now(),
        published_at=CASE WHEN ${input.published} THEN COALESCE(published_at, now()) ELSE NULL END
      WHERE id=${id}
      RETURNING id, slug, title, category, author, reading_time, excerpt, emoji, content, published_at
    `;
    return (rows[0] as CmsArticle | undefined) ?? null;
  }
  const slug = `${createSlug(input.title)}-${randomUUID().slice(0, 8)}`;
  const rows = await sql`
    INSERT INTO articles (author_id, slug, title, category, author, reading_time, excerpt, emoji, content, published_at)
    VALUES (${userId},${slug},${input.title},${input.category},${input.author},${input.reading_time},
      ${input.excerpt},${input.emoji},${input.content},${input.published ? new Date().toISOString() : null})
    RETURNING id, slug, title, category, author, reading_time, excerpt, emoji, content, published_at
  `;
  return rows[0] as CmsArticle;
}

export async function deleteArticle(id: string) {
  const rows = await getDatabase()`DELETE FROM articles WHERE id=${id} RETURNING id`;
  return rows.length > 0;
}
