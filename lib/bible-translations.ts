export type BibleTranslation = 'ACF' | 'ARA' | 'DBY';
export const BIBLE_TRANSLATIONS = {
  ACF: { label: 'ACF', title: 'Almeida Corrigida Fiel', language: 'pt-BR' },
  ARA: { label: 'ARA', title: 'Almeida Revista e Atualizada', language: 'pt-BR' },
  DBY: { label: 'Darby', title: 'Darby Translation — original em inglês', language: 'en' },
} as const;
export function parseBibleTranslation(value: unknown): BibleTranslation | undefined {
  return value === 'ACF' || value === 'ARA' || value === 'DBY' ? value : undefined;
}
