// Mistura as duas pontas sem inserir silêncio: o fim encontra o começo na mesma
// posição da gravação original. Ganhos de potência constante preservam o fundo.
export function emendaCircular(amostras: Float32Array, sobreposicao: number): Float32Array {
  if (!Number.isInteger(sobreposicao) || sobreposicao < 2 || sobreposicao * 2 >= amostras.length) {
    throw new Error('Sobreposição inválida para a duração do áudio.');
  }
  const tamanho = amostras.length - sobreposicao;
  const resultado = amostras.slice(0, tamanho);
  for (let i = 0; i < sobreposicao; i++) {
    const fase = i / (sobreposicao - 1) * Math.PI / 2;
    resultado[i] = amostras[tamanho + i] * Math.cos(fase) + amostras[i] * Math.sin(fase);
  }
  return resultado;
}

export function unirComSobreposicao(primeiro: Float32Array, segundo: Float32Array, sobreposicao: number): Float32Array {
  if (!Number.isInteger(sobreposicao) || sobreposicao < 2 || sobreposicao >= Math.min(primeiro.length, segundo.length)) {
    throw new Error('Sobreposição inválida para unir os áudios.');
  }
  const posicao = primeiro.length - sobreposicao;
  const resultado = new Float32Array(primeiro.length + segundo.length - sobreposicao);
  resultado.set(primeiro); resultado.set(segundo.subarray(sobreposicao), primeiro.length);
  for (let i = 0; i < sobreposicao; i++) {
    const fase = i / (sobreposicao - 1) * Math.PI / 2;
    resultado[posicao + i] = primeiro[posicao + i] * Math.cos(fase) + segundo[i] * Math.sin(fase);
  }
  return resultado;
}
