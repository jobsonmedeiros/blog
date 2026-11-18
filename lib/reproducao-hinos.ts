export type HinoReproduzivel = { audioUrl: string; cantadoUrl: string | null };

export function enderecoDoHino(hino: HinoReproduzivel, tipo: 'cantado' | 'instrumental') {
  return tipo === 'cantado' && hino.cantadoUrl ? hino.cantadoUrl : hino.audioUrl;
}

export function indiceVizinho(indice: number, variacao: 1 | -1, quantidade: number) {
  return (indice + variacao + quantidade) % quantidade;
}

type ElementoReproduzivel = Pick<HTMLAudioElement, 'getAttribute' | 'setAttribute' | 'play'>;

// A troca e o play acontecem no mesmo evento, no elemento que o visitante já autorizou.
// Não chamar load() depois: ele interromperia a promessa de reprodução em andamento.
export function reproduzirHino(elemento: ElementoReproduzivel, endereco: string) {
  if (elemento.getAttribute('src') !== endereco) elemento.setAttribute('src', endereco);
  return elemento.play();
}
