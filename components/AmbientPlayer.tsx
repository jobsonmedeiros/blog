"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from 'next/navigation';
import { createAmbientSession as criarSessaoAmbiente, stopAmbientSession as pararSessaoAmbiente, type AmbientSession as SessaoAudio } from '@/lib/ambient-audio';
import ambientesGravados from '@/public/ambientes/catalogo.json';
import Link from 'next/link';
import catalogoHinar from "../public/hinar-playlist.json";
import { useFechamentoPainel } from '@/components/useDismissiblePanel';
import { enderecoDoHino, indiceVizinho, reproduzirHino } from '@/lib/reproducao-hinos';

type HinoDoCatalogo = {
  number: number;
  title: string;
  pageUrl: string;
  audioUrl: string;
  cantadoUrl: string | null;
};

const HINOS_DO_CATALOGO: HinoDoCatalogo[] = catalogoHinar;

const AMBIENTES = [
  { label: "Chuva suave", emoji: "🌧️" },
  { label: "Floresta", emoji: "🌿" },
  { label: "Oceano", emoji: "🌊" },
  { label: "Instrumental suave", emoji: "🎹" },
] as const;

// "hinar" toca os hinos; 0–3 são as gravações de ambiente hospedadas no próprio site.
type Fonte = "hinar" | 0 | 1 | 2 | 3;
type TipoAudio = "cantado" | "instrumental";

function salvar(chave: string, valor: string) {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    /* localStorage indisponível */
  }
}

function formatarTempo(segundos: number) {
  if (!Number.isFinite(segundos) || segundos < 0) return "0:00";
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = Math.floor(segundos % 60);
  return `${minutos}:${String(segundosRestantes).padStart(2, "0")}`;
}

function Icone({ nome }: { nome: "play" | "pause" | "prev" | "next" }) {
  const caminhos = {
    play: "M8 5v14l11-7z",
    pause: "M6 5h4v14H6zM14 5h4v14h-4z",
    prev: "M6 5h2v14H6zM20 5v14L9 12z",
    next: "M16 5h2v14h-2zM4 5v14l11-7z",
  };
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d={caminhos[nome]} />
    </svg>
  );
}

export default function ReprodutorAmbiente() {
  const caminhoAtual = usePathname();
  const naPaginaDeLeitura = caminhoAtual === '/leitura';
  const [fonte, definirFonte] = useState<Fonte>("hinar");
  const [tipoAudio, definirTipoAudio] = useState<TipoAudio>("cantado");
  const [volume, definirVolume] = useState(0.3);
  const [indiceHino, definirIndiceHino] = useState(0);
  const [tocando, definirTocando] = useState(false);
  const [carregandoAudio, definirCarregandoAudio] = useState(false);
  const [erroAudio, definirErroAudio] = useState("");
  const [tempo, definirTempo] = useState({ atual: 0, total: 0 });
  const [aberto, definirAberto] = useState(false);
  const [abaPainel, definirAbaPainel] = useState<'hinos' | 'ambientes'>('hinos');

  const referenciaAudio = useRef<HTMLAudioElement | null>(null);
  const referenciaSessaoAudio = useRef<SessaoAudio | null>(null);
  const referenciaReprodutor = useRef<HTMLDivElement | null>(null);
  useFechamentoPainel(aberto, referenciaReprodutor, definirAberto);

  const hino = HINOS_DO_CATALOGO[indiceHino];
  const enderecoAudio = enderecoDoHino(hino, tipoAudio);
  const cantadoDisponivel = Boolean(hino.cantadoUrl);

  // Só o volume é restaurado: uma nova visita começa no hino 001 cantado.
  /* eslint-disable react-hooks/set-state-in-effect -- localStorage só existe após a hidratação */
  useEffect(() => {
    try {
      const volumeSalvo = Number(localStorage.getItem("ce-volume"));
      if (localStorage.getItem("ce-volume") !== null && volumeSalvo >= 0 && volumeSalvo <= 1) definirVolume(volumeSalvo);
    } catch {
      /* ignora */
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    return () => {
      pararSessaoAmbiente(referenciaSessaoAudio.current);
    };
  }, []);

  // Inicializa a fonte sem reiniciar uma troca que já começou no evento do player.
  useEffect(() => {
    const elementoAudio = referenciaAudio.current;
    if (!elementoAudio) return;
    if (elementoAudio.getAttribute('src') !== enderecoAudio) elementoAudio.setAttribute('src', enderecoAudio);
  }, [enderecoAudio]);

  useEffect(() => {
    if (referenciaAudio.current) referenciaAudio.current.volume = volume;
    if (referenciaSessaoAudio.current) referenciaSessaoAudio.current.master.gain.value = volume;
  }, [volume]);

  const pararAmbiente = () => {
    pararSessaoAmbiente(referenciaSessaoAudio.current);
    referenciaSessaoAudio.current = null;
  };

  const tocarAmbiente = (trilha: number) => {
    referenciaAudio.current?.pause();
    pararAmbiente();
    // Desbloqueia o áudio ainda no toque do visitante. O arquivo é baixado depois.
    const contextoAudio = new AudioContext({ sampleRate: 24000 });
    const retomada = contextoAudio.resume();
    const sessao = criarSessaoAmbiente(contextoAudio, trilha, volume);
    referenciaSessaoAudio.current = sessao;
    definirErroAudio("");
    definirCarregandoAudio(true);
    definirTocando(true);
    void Promise.all([retomada, sessao.pronta]).then(() => {
      if (referenciaSessaoAudio.current === sessao && !sessao.encerrada) definirCarregandoAudio(false);
    }).catch(() => {
      if (referenciaSessaoAudio.current !== sessao || sessao.encerrada) return;
      pararAmbiente(); definirCarregandoAudio(false); definirTocando(false);
      definirErroAudio('Não foi possível carregar o ambiente. Toque novamente para tentar.');
    });
  };

  async function tocarHinar(endereco = enderecoAudio) {
    const elementoAudio = referenciaAudio.current;
    if (!elementoAudio) return;
    pararAmbiente();
    definirErroAudio("");
    definirCarregandoAudio(false);
    elementoAudio.volume = volume;
    try {
      await reproduzirHino(elementoAudio, endereco);
    } catch (erroCapturado) {
      if ((erroCapturado as DOMException)?.name !== "AbortError") {
        definirTocando(false);
        definirCarregandoAudio(false);
        definirErroAudio((erroCapturado as DOMException)?.name === 'NotAllowedError'
          ? 'O navegador interrompeu a reprodução. Toque em reproduzir para continuar.'
          : 'Não foi possível tocar este hino. Tente novamente ou avance para o próximo.');
      }
    }
  }

  const pausar = () => {
    referenciaAudio.current?.pause();
    pararAmbiente();
    definirTocando(false);
    definirCarregandoAudio(false);
  };

  const alternar = () => {
    if (tocando) pausar();
    else if (fonte === "hinar") void tocarHinar();
    else tocarAmbiente(fonte);
  };

  const escolherFonte = (nova: Fonte) => {
    definirFonte(nova);
    if (nova === "hinar") void tocarHinar();
    else tocarAmbiente(nova);
  };

  const trocarHino = (variacao: 1 | -1, continuar = tocando && fonte === "hinar") => {
    const proximo = indiceVizinho(indiceHino, variacao, HINOS_DO_CATALOGO.length);
    definirTempo({ atual: 0, total: 0 });
    definirErroAudio('');
    definirIndiceHino(proximo);
    if (continuar) void tocarHinar(enderecoDoHino(HINOS_DO_CATALOGO[proximo], tipoAudio));
  };

  const trocarTipoAudio = (novoTipo: TipoAudio) => {
    if (novoTipo === "cantado" && !cantadoDisponivel) return;
    if (novoTipo === tipoAudio) return;
    definirTipoAudio(novoTipo);
    if (tocando && fonte === 'hinar') void tocarHinar(enderecoDoHino(hino, novoTipo));
  };

  const mudarVolume = (novo: number) => {
    definirVolume(novo);
    salvar("ce-volume", String(novo));
  };

  const buscarPosicao = (segundos: number) => {
    const elementoAudio = referenciaAudio.current;
    if (elementoAudio && Number.isFinite(elementoAudio.duration)) elementoAudio.currentTime = segundos;
  };

  const rotuloAtual =
    fonte === "hinar"
      ? `Hino ${String(hino.number).padStart(3, "0")} · ${hino.title}`
      : AMBIENTES[fonte].label;

  return (
    <div
      ref={referenciaReprodutor}
      className="fixed right-3 md:right-5 z-40 flex flex-col items-end gap-2 bottom-3 md:bottom-6"
      style={naPaginaDeLeitura ? { bottom: 'calc(var(--altura-rodape-leitura, 0px) + var(--altura-navegacao-capitulos, 5rem) + 1rem + env(safe-area-inset-bottom, 0px))' } : undefined}
    >
      {/* Sempre montado: a música continua ao fechar o painel e ao navegar entre páginas. */}
      <audio
        ref={referenciaAudio}
        preload="none"
        onPlay={() => definirTocando(true)}
        onPause={() => {
          // Ao trocar para um som ambiente, o hino pausa mas a música continua.
          if (!referenciaSessaoAudio.current && referenciaAudio.current?.paused) definirTocando(false);
        }}
        onWaiting={() => { if (fonte === 'hinar') definirCarregandoAudio(true); }}
        onPlaying={() => { if (fonte === 'hinar') { definirCarregandoAudio(false); definirTocando(true); } }}
        onCanPlay={() => { if (fonte === 'hinar') definirCarregandoAudio(false); }}
        onLoadedMetadata={(evento) => definirTempo({ atual: 0, total: evento.currentTarget.duration })}
        onTimeUpdate={(evento) =>
          definirTempo({ atual: evento.currentTarget.currentTime, total: evento.currentTarget.duration })
        }
        onEnded={() => { if (fonte === 'hinar') trocarHino(1, true); }}
        onError={() => {
          if (fonte !== 'hinar') return;
          definirCarregandoAudio(false);
          if (referenciaAudio.current?.getAttribute("src")) {
            definirTocando(false);
            definirErroAudio("Não foi possível carregar este hino. Tente o próximo.");
          }
        }}
        className="hidden"
      />

      {aberto && (
        <div
          id="painel-musica"
          role="dialog"
          aria-label="Música para leitura"
          className="card w-[min(20rem,calc(100vw-2rem))] max-h-[60dvh] overflow-y-auto overscroll-contain px-3 pb-2 animate-fadeIn"
          style={{ background: "rgba(245,240,232,0.98)", border: "1px solid var(--parchment-dark)", ...(naPaginaDeLeitura ? { maxHeight: 'max(6rem, min(60dvh, calc(100dvh - var(--site-nav-height, 4rem) - var(--altura-rodape-leitura, 0px) - var(--altura-navegacao-capitulos, 5rem) - 5rem)))' } : {}) }}
        >
          <div className="sticky top-0 z-10 -mx-3 mb-2 flex items-center justify-between gap-2 border-b border-[var(--parchment-dark)] bg-[var(--parchment)] pl-3 pr-1">
          <p
            className="font-sans text-xs font-semibold"
            style={{ color: "var(--ink-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}
          >
            Música para leitura
          </p>
          <button type="button" onClick={() => definirAberto(false)} aria-label="Fechar player" title="Fechar player" className="flex min-h-9 min-w-9 items-center justify-center rounded-full text-xl text-[var(--ink)] hover:bg-[var(--parchment-dark)]">
            <span aria-hidden="true">×</span>
          </button>
          </div>

          <div role="group" aria-label="Escolher controles de áudio" className="grid grid-cols-2 gap-1 mb-2 font-sans text-xs">
            <button type="button" aria-pressed={abaPainel === 'hinos'} aria-controls="controles-hinos" onClick={() => definirAbaPainel('hinos')} className={`min-h-8 rounded px-2 py-1 ${abaPainel === 'hinos' ? 'bg-[var(--parchment-dark)] text-[var(--gold)]' : 'text-[var(--ink-light)]'}`}>Hinos</button>
            <button type="button" aria-pressed={abaPainel === 'ambientes'} aria-controls="controles-ambientes" onClick={() => definirAbaPainel('ambientes')} className={`min-h-8 rounded px-2 py-1 ${abaPainel === 'ambientes' ? 'bg-[var(--parchment-dark)] text-[var(--gold)]' : 'text-[var(--ink-light)]'}`}>Sons ambientes</button>
          </div>

          <section
            id="controles-hinos"
            hidden={abaPainel !== 'hinos'}
            aria-label="Hinos do Hinar.io"
            className="rounded-lg p-2 mb-2"
            style={{
              background: fonte === "hinar" ? "var(--parchment-dark)" : "transparent",
              border: "1px solid var(--parchment-dark)",
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
            <button
              type="button"
              onClick={() => escolherFonte("hinar")}
              className="font-sans text-xs text-left shrink-0"
              style={{ color: fonte === "hinar" ? "var(--gold)" : "var(--ink)", fontWeight: 600 }}
              aria-pressed={fonte === "hinar"}
            >
              🎵 Hinos
            </button>
            <p className="font-sans text-[11px] leading-snug text-right line-clamp-2 capitalize" style={{ color: "var(--ink)" }}>
              {String(hino.number).padStart(3, "0")} · {hino.title}
            </p>
            </div>

            <label htmlFor="progresso-hino" className="sr-only">
              Posição do hino
            </label>
            <input
              id="progresso-hino"
              type="range"
              min={0}
              max={tempo.total || 0}
              step={1}
              value={Math.min(tempo.atual, tempo.total || 0)}
              onChange={(evento) => buscarPosicao(Number(evento.target.value))}
              disabled={!tempo.total}
              className="block w-full h-4 accent-amber-700"
            />
            <div
              className="flex justify-between font-sans text-[10px] mb-1 tabular-nums"
              style={{ color: "var(--ink-light)" }}
            >
              <span>{formatarTempo(tempo.atual)}</span>
              <span>{carregandoAudio ? "carregando…" : formatarTempo(tempo.total)}</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1">
            <div className="flex gap-1" role="group" aria-label="Versão do hino">
              {(['cantado', 'instrumental'] as const).map(tipo => {
                const ativo = tipo === 'cantado' ? tipoAudio === 'cantado' && cantadoDisponivel : tipoAudio === 'instrumental' || !cantadoDisponivel;
                return <button key={tipo} type="button" onClick={() => trocarTipoAudio(tipo)} disabled={tipo === 'cantado' && !cantadoDisponivel} aria-pressed={ativo}
                  className="min-h-8 font-sans text-[11px] px-1.5 py-1 rounded border"
                  style={{ borderColor: 'var(--gold)', color: ativo ? 'white' : 'var(--gold)', background: ativo ? 'var(--gold)' : 'transparent' }}>
                  {tipo === 'cantado' ? 'Cantado' : 'Instrumental'}
                </button>;
              })}
            </div>
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => trocarHino(-1)}
                aria-label="Hino anterior"
                className="w-7 h-8 rounded-full border flex items-center justify-center"
                style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
              >
                <Icone nome="prev" />
              </button>
              <button
                type="button"
                onClick={() => (tocando && fonte === "hinar" ? pausar() : escolherFonte("hinar"))}
                aria-label={tocando && fonte === "hinar" ? "Pausar hino" : "Tocar hino"}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "var(--gold)", color: "white" }}
              >
                <Icone nome={tocando && fonte === "hinar" ? "pause" : "play"} />
              </button>
              <button
                type="button"
                onClick={() => trocarHino(1)}
                aria-label="Próximo hino"
                className="w-7 h-8 rounded-full border flex items-center justify-center"
                style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
              >
                <Icone nome="next" />
              </button>
            </div>
            </div>

            <a
              href={hino.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[10px] inline-block mt-1"
              style={{ color: "var(--gold)", textDecoration: "underline" }}
            >
              Ver no Hinar.io ↗
            </a>
          </section>

          <section id="controles-ambientes" aria-label="Sons ambientes" hidden={abaPainel !== 'ambientes'}>
          <p
            className="font-sans text-[11px] font-semibold mb-1"
            style={{ color: "var(--ink-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}
          >
            Sons ambientes
          </p>
          <div className="grid grid-cols-2 gap-1 mb-2">
            {AMBIENTES.map((itemAtual, indice) => {
              const ativo = fonte === indice;
              return (
                <button
                  key={itemAtual.label}
                  type="button"
                  onClick={() => escolherFonte(indice as Fonte)}
                  aria-pressed={ativo}
                  className="min-h-8 font-sans text-xs text-left px-1.5 py-1 rounded transition-colors"
                  style={{
                    background: ativo ? "var(--parchment-dark)" : "transparent",
                    color: ativo ? "var(--gold)" : "var(--ink)",
                    fontWeight: ativo ? 600 : 400,
                  }}
                >
                  {itemAtual.emoji} {itemAtual.label}
                </button>
              );
            })}
          </div>
          {fonte !== 'hinar' && <p className="font-sans text-[10px] text-[var(--ink-light)] mb-2">
            {carregandoAudio ? <span role="status">Carregando ambiente…</span> : <span>{Math.floor(ambientesGravados[fonte].segundos / 60)} min de gravação · repetição contínua</span>}
            {' · '}<Link href={`/creditos-dos-sons#${ambientesGravados[fonte].id}`} className="underline">Fontes e créditos</Link>
          </p>}
          </section>

          {erroAudio && <p role="alert" className="font-sans text-xs my-2" style={{ color: 'var(--burgundy)' }}>{erroAudio}</p>}

          <div className="flex items-center gap-2">
            <span className="font-sans text-xs" style={{ color: "var(--ink-light)" }} aria-hidden>
              🔊
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(evento) => mudarVolume(Number(evento.target.value))}
              className="flex-1 accent-amber-700"
              aria-label="Volume"
            />
          </div>
        </div>
      )}

      {!aberto && erroAudio && (
        <p role="alert" className="card max-w-72 p-3 font-sans text-xs" style={{ color: 'var(--burgundy)' }}>
          {erroAudio}
        </p>
      )}
      <div className="flex items-center gap-2">
        {tocando && !aberto && (
          <span
            className="hidden sm:block font-sans text-xs px-3 py-1.5 rounded-full shadow max-w-48 truncate capitalize"
            style={{ background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--parchment-dark)" }}
          >
            {rotuloAtual}
          </span>
        )}
        <button
          type="button"
          onClick={alternar}
          title={tocando ? "Pausar música" : "Tocar música"}
          aria-label={tocando ? "Pausar música" : "Tocar música"}
          className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all"
          style={{ background: "var(--gold)", color: "white", fontSize: "1rem" }}
        >
          <Icone nome={tocando ? "pause" : "play"} />
        </button>
        <button
          type="button"
          onClick={() => definirAberto((volumeSalvo) => !volumeSalvo)}
          title="Escolher música"
          aria-label="Escolher música"
          aria-expanded={aberto}
          aria-controls="painel-musica"
          className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center"
          style={{ background: "var(--ink)", color: "var(--gold-light)", fontSize: "1.1rem" }}
        >
          {tocando ? <span className="animate-pulse-soft">♫</span> : "♫"}
        </button>
      </div>
    </div>
  );
}
