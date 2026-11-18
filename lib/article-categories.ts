import { ARTIGOS } from '../data/studies.ts';

export const DEFAULT_ARTICLE_CATEGORY = 'Reflexão';
export const BUILT_IN_ARTICLE_CATEGORIES = [...new Set([...ARTIGOS.map(article => article.categoria), DEFAULT_ARTICLE_CATEGORY])];

export function cleanArticleCategory(value: string): string {
  return value.normalize('NFC').trim().replace(/\s+/g, ' ');
}

export function articleCategoryKey(value: string): string {
  return cleanArticleCategory(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

export function articleCategoryError(value: string): string {
  const category = cleanArticleCategory(value);
  if (!category || category.length > 80 || !/[\p{L}\p{N}]/u.test(category)) return 'Informe um tema com letras ou números e até 80 caracteres.';
  if (articleCategoryKey(category) === 'todos') return '“Todos” é reservado ao filtro geral. Escolha outro nome para o tema.';
  return '';
}

export function canonicalArticleCategory(value: string, known: readonly string[] = BUILT_IN_ARTICLE_CATEGORIES): string {
  return known.find(category => articleCategoryKey(category) === articleCategoryKey(value)) ?? cleanArticleCategory(value);
}

export function uniqueArticleCategories(values: Iterable<string>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const category = canonicalArticleCategory(value);
    const key = articleCategoryKey(category);
    if (!key || key === 'todos' || seen.has(key)) continue;
    seen.add(key);
    result.push(category);
  }
  return result;
}

export function filterArticlesByCategory<T extends { categoria: string }>(articles: T[], category: string): T[] {
  return articleCategoryKey(category) === 'todos' ? articles : articles.filter(article => articleCategoryKey(article.categoria) === articleCategoryKey(category));
}
