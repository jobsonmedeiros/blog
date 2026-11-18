export function verseShareText(texto: string, referencia: string, traducao: string, mensagem = ''): string {
  const verse = `“${texto}”\n— ${referencia} (${traducao})`;
  return mensagem.trim() ? `${mensagem.trim()}\n\n${verse}` : verse;
}

export function verseSocialLinks(texto: string, url: string) {
  return {
    whatsapp: `https://wa.me/?${new URLSearchParams({ text: `${texto}\n\n${url}` })}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: url })}`,
    x: `https://x.com/intent/tweet?${new URLSearchParams({ text: texto, url })}`,
  };
}
