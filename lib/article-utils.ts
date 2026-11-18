import { articleCategoryError, canonicalArticleCategory, DEFAULT_ARTICLE_CATEGORY } from './article-categories.ts';

export type CmsArticle = {
  id: string; slug: string; title: string; category: string; author: string;
  reading_time: string; excerpt: string; emoji: string; content: string;
  published_at: string | null;
};

export function createSlug(title: string) {
  return title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 160).replace(/-+$/, '');
}
export class ArticleValidationError extends Error {}

export function parseArticle(value: unknown) {
  if (!value || typeof value !== 'object') throw new ArticleValidationError('Revise os campos do artigo.');
  const input = value as Record<string, unknown>;
  function field(key: string, label: string, max: number, fallback?: string) {
    const raw = input[key] ?? fallback;
    if (typeof raw !== 'string' || !raw.trim() || raw.length > max) {
      throw new ArticleValidationError(`${label}: preencha com até ${max} caracteres.`);
    }
    return raw.trim();
  }
  const title = field('title', 'Título', 240);
  if (!createSlug(title)) throw new ArticleValidationError('O título precisa conter letras ou números.');
  if (typeof input.published !== 'boolean') throw new ArticleValidationError('Informe se o artigo será publicado.');
  const category = canonicalArticleCategory(field('category', 'Tema', 80, DEFAULT_ARTICLE_CATEGORY));
  const categoryError = articleCategoryError(category);
  if (categoryError) throw new ArticleValidationError(categoryError);
  return {
    title, content: field('content', 'Conteúdo', 300000), excerpt: field('excerpt', 'Resumo', 1500),
    category, author: field('author', 'Autor', 120, 'Conforto das Escrituras'),
    reading_time: field('reading_time', 'Tempo de leitura', 30, '5 min'), emoji: field('emoji', 'Ícone', 32, '📖'), published: input.published,
  };
}
export function isUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
export function isAdminEmail(email: string | undefined | null, allowed: string | undefined) {
  return Boolean(email && allowed?.trim() && email.trim().toLowerCase() === allowed.trim().toLowerCase());
}
export function isSameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin;
}
