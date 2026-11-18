import catalogo from '../public/ambientes/catalogo.json';

export type AmbientSession = {
  context: AudioContext;
  master: GainNode;
  sources: AudioBufferSourceNode[];
  pronta: Promise<void>;
  cancelar: AbortController;
  encerrada: boolean;
};

// A gravação já contém a emenda. O motor de áudio repete o buffer sem recarregar
// arquivos, esperar eventos ended ou depender de temporizadores JavaScript.
export function createAmbientSession(context: AudioContext, track: number, volume: number): AmbientSession {
  const trilha = catalogo[track];
  if (!trilha) throw new Error('Ambiente não encontrado.');
  const master = context.createGain(); master.gain.value = volume;
  const entrada = context.createGain(); entrada.gain.value = 0;
  entrada.connect(master).connect(context.destination);
  const sessao: AmbientSession = {
    context, master, sources: [], cancelar: new AbortController(), encerrada: false,
    pronta: Promise.resolve(),
  };
  sessao.pronta = (async () => {
    const resposta = await fetch(`/ambientes/${trilha.arquivo}?v=${trilha.revisao}`, {
      signal: sessao.cancelar.signal, cache: 'force-cache',
    });
    if (!resposta.ok) throw new Error('Não foi possível carregar o ambiente.');
    const dados = await resposta.arrayBuffer();
    if (sessao.encerrada) return;
    const gravacao = await context.decodeAudioData(dados);
    if (sessao.encerrada || context.state === 'closed') return;
    const origem = context.createBufferSource();
    origem.buffer = gravacao; origem.loop = true;
    origem.loopStart = 0; origem.loopEnd = gravacao.duration;
    origem.connect(entrada); sessao.sources.push(origem);
    const inicio = context.currentTime + .025;
    entrada.gain.setValueAtTime(0, inicio);
    entrada.gain.linearRampToValueAtTime(1, inicio + 1.2);
    origem.start(inicio);
  })();
  return sessao;
}

export function stopAmbientSession(sessao: AmbientSession | null) {
  if (!sessao || sessao.encerrada) return;
  sessao.encerrada = true; sessao.cancelar.abort();
  const { context, master } = sessao;
  if (context.state === 'closed') return;
  master.gain.cancelScheduledValues(context.currentTime);
  master.gain.setValueAtTime(master.gain.value, context.currentTime);
  master.gain.linearRampToValueAtTime(0, context.currentTime + .15);
  sessao.sources.forEach(origem => { try { origem.stop(context.currentTime + .17); } catch { /* já encerrada */ } });
  window.setTimeout(() => { if (context.state !== 'closed') void context.close(); }, 220);
}
