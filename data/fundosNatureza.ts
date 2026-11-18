export const FUNDOS_NATUREZA = [
  '/imagens/natureza/lago-alpino.webp',
  '/imagens/natureza/montanhas-entardecer.webp',
  '/imagens/natureza/lago-floresta.webp',
];

export function criarFundoNatureza(indice: number, claro = false) {
  const imagem = FUNDOS_NATUREZA[((indice % FUNDOS_NATUREZA.length) + FUNDOS_NATUREZA.length) % FUNDOS_NATUREZA.length];
  const camada = claro
    ? 'linear-gradient(105deg, rgba(250,247,240,0.97), rgba(250,247,240,0.85))'
    : 'linear-gradient(110deg, rgba(15,27,28,0.78), rgba(15,27,28,0.62))';
  return `${camada}, url("${imagem}")`;
}
