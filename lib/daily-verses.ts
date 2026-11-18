// Usa o calendário bissexto como mapa fixo: cada dia/mês mantém seu versículo,
// e 29 de fevereiro recebe uma entrada própria. UTC evita diferenças por horário de verão.
export function dailyVerseIndex(date: Date): number {
  return Math.floor((Date.UTC(2000, date.getMonth(), date.getDate()) - Date.UTC(2000, 0, 1)) / 86400000);
}

export function wrapVerseIndex(index: number, total: number): number {
  return ((index % total) + total) % total;
}

// Um movimento vertical continua sendo rolagem da página; só o gesto
// predominantemente horizontal e intencional troca de versículo.
export function verseSwipeStep(deltaX: number, deltaY: number): number {
  if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.3) return 0;
  return deltaX < 0 ? 1 : -1;
}
