type AreaRolagem = { scrollTop: number; scrollHeight: number; clientHeight: number };

export function criarRolagemConjunta() {
  const posicoesProgramadas = new WeakMap<AreaRolagem, number>();
  return (origem: AreaRolagem, destino: AreaRolagem) => {
    const esperada = posicoesProgramadas.get(origem);
    posicoesProgramadas.delete(origem);
    // O evento provocado pela sincronização não deve voltar a mover o primeiro campo.
    if (esperada !== undefined && Math.abs(origem.scrollTop - esperada) < 1) return;
    const alcanceOrigem = Math.max(0, origem.scrollHeight - origem.clientHeight);
    const alcanceDestino = Math.max(0, destino.scrollHeight - destino.clientHeight);
    const proporcao = alcanceOrigem ? Math.min(1, Math.max(0, origem.scrollTop / alcanceOrigem)) : 0;
    const posicao = proporcao * alcanceDestino;
    if (Math.abs(destino.scrollTop - posicao) < 1) return;
    posicoesProgramadas.set(destino, posicao);
    destino.scrollTop = posicao;
  };
}
