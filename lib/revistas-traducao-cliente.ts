import { translationChunks } from './darby-translation.ts';

export async function traduzirTextoRevista(texto: string, sinal: AbortSignal, aoProgredir: (traduzido: string, feito: number, total: number) => void, idioma: 'en' | 'es' = 'en') {
  const paragrafos = texto.split(/\n\s*\n/).filter(trecho => trecho.trim());
  const blocos = paragrafos.map(paragrafo => translationChunks(paragrafo));
  const total = blocos.reduce((soma, partes) => soma + partes.length, 0);
  const traduzidos: string[][] = [];
  let feito = 0;
  for (const partes of blocos) {
    const paragrafo: string[] = [];
    traduzidos.push(paragrafo);
    for (const trecho of partes) {
      const resposta = await fetch('/api/revistas/traduzir', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ texto: trecho, idioma }), signal: sinal });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || 'Não foi possível traduzir agora.');
      paragrafo.push(dados.texto);
      aoProgredir(traduzidos.map(partes => partes.join(' ')).join('\n\n'), ++feito, total);
    }
  }
  return traduzidos.map(partes => partes.join(' ')).join('\n\n');
}
