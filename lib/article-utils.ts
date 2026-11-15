export type CmsArticle = {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  reading_time: string;
  excerpt: string;
  emoji: string;
  content: string;
  published_at: string | null;
};

export function createSlug(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
