"use client";

import { useEffect, useRef, useState } from "react";
import hinarPlaylist from "../public/hinar-playlist.json";

type HinarTrack = { number: number; title: string; pageUrl: string; audioUrl: string };

const HINAR_TRACKS: HinarTrack[] = hinarPlaylist;

const AMBIENTES = [
  { label: "Chuva suave", emoji: "🌧️" },
  { label: "Floresta", emoji: "🌿" },
  { label: "Oceano", emoji: "🌊" },
  { label: "Instrumental contemplativo", emoji: "🎹" },
] as const;

// "hinar" toca os hinos instrumentais; números 0–3 são os sons gerados no navegador.
type Fonte = "hinar" | 0 | 1 | 2 | 3;

type AmbientSession = {
  context: AudioContext;
  master: GainNode;
  sources: AudioScheduledSourceNode[];
};

type Timers = { timeouts: number[]; intervals: number[] };

function createNoise(context: AudioContext, seconds = 2) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createAmbientSession(
  context: AudioContext,
  track: number,
  volume: number,
  timers: Timers
): AmbientSession {
  const master = context.createGain();
  master.gain.value = volume;
  master.connect(context.destination);
  const sources: AudioScheduledSourceNode[] = [];

  if (track === 3) {
    const notas = [261.63, 329.63, 392, 523.25, 392, 329.63];
    const tocarMotivo = () => {
      if (context.state === "closed") return;
      const inicio = context.currentTime + 0.05;
      notas.forEach((frequencia, index) => {
        const oscilador = context.createOscillator();
        const ganho = context.createGain();
        const inicioNota = inicio + index * 1.25;
        oscilador.type = "sine";
        oscilador.frequency.value = frequencia;
        ganho.gain.setValueAtTime(0.0001, inicioNota);
        ganho.gain.exponentialRampToValueAtTime(0.045, inicioNota + 0.08);
        ganho.gain.exponentialRampToValueAtTime(0.0001, inicioNota + 1.1);
        oscilador.connect(ganho).connect(master);
        oscilador.start(inicioNota);
        oscilador.stop(inicioNota + 1.15);
      });
    };
    tocarMotivo();
    timers.intervals.push(window.setInterval(tocarMotivo, 7500));
    return { context, master, sources };
  }

  // Ruído filtrado: chuva (agudo), floresta (médio), oceano (grave)
  const noise = context.createBufferSource();
  noise.buffer = createNoise(context);
  noise.loop = true;
  const filter = context.createBiquadFilter();
  filter.type = track === 0 ? "highpass" : "lowpass";
  filter.frequency.value = track === 0 ? 1400 : track === 1 ? 900 : 400;
  const noiseGain = context.createGain();
  noiseGain.gain.value = track === 0 ? 0.1 : track === 1 ? 0.06 : 0.22;
  noise.connect(filter).connect(noiseGain).connect(master);
  noise.start();
  sources.push(noise);

  if (track === 2) {
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.1;
    lfo.connect(lfoGain).connect(noiseGain.gain);
    lfo.start();
    sources.push(lfo);
  }

  if (track === 1) {
    const chirp = () => {
      if (context.state === "closed") return;
      const t0 = context.currentTime + 0.05;
      const osc = context.createOscillator();
      const g = context.createGain();
      const base = 2200 + Math.random() * 1800;
      osc.type = "sine";
      osc.frequency.setValueAtTime(base, t0);
      const notas = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < notas; i++) {
        const t = t0 + i * (0.09 + Math.random() * 0.06);
        osc.frequency.exponentialRampToValueAtTime(base * (1.1 + Math.random() * 0.5), t + 0.05);
        osc.frequency.exponentialRampToValueAtTime(base * (0.9 + Math.random() * 0.2), t + 0.1);
      }
      const dur = notas * 0.14 + 0.1;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.035 + Math.random() * 0.02, t0 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g).connect(master);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
      timers.timeouts.push(window.setTimeout(chirp, 2500 + Math.random() * 6000));
    };
    timers.timeouts.push(window.setTimeout(chirp, 1200));
  }

  return { context, master, sources };
}

function stopAmbientSession(session: AmbientSession | null) {
  if (!session) return;
  session.sources.forEach((source) => {
    source.stop();
    source.disconnect();
  });
  session.master.disconnect();
  void session.context.close();
}

function salvar(chave: string, valor: string) {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    /* localStorage indisponível */
  }
}

function formatarTempo(segundos: number) {
  if (!Number.isFinite(segundos) || segundos < 0) return "0:00";
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
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

export default function AmbientPlayer() {
  const [fonte, setFonte] = useState<Fonte>("hinar");
  const [volume, setVolume] = useState(0.5);
  const [hinarIndex, setHinarIndex] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [carregandoAudio, setCarregandoAudio] = useState(false);
  const [erroAudio, setErroAudio] = useState("");
  const [tempo, setTempo] = useState({ atual: 0, total: 0 });
  const [aberto, setAberto] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionRef = useRef<AmbientSession | null>(null);
  const timersRef = useRef<Timers>({ timeouts: [], intervals: [] });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tocarAoTrocarRef = useRef(false);

  const hino = HINAR_TRACKS[hinarIndex];

  // Restaura preferências só no cliente, evitando diferença entre servidor e navegador.
  /* eslint-disable react-hooks/set-state-in-effect -- localStorage só existe após a hidratação */
  useEffect(() => {
    try {
      const v = Number(localStorage.getItem("ce-volume"));
      if (localStorage.getItem("ce-volume") !== null && v >= 0 && v <= 1) setVolume(v);
      const f = localStorage.getItem("ce-fonte-musica");
      if (f === "hinar") setFonte("hinar");
      else if (f !== null && ["0", "1", "2", "3"].includes(f)) setFonte(Number(f) as Fonte);
      const h = Number(localStorage.getItem("ce-hino"));
      if (Number.isInteger(h) && h >= 0 && h < HINAR_TRACKS.length) setHinarIndex(h);
    } catch {
      /* ignora */
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const timers = timersRef;
    return () => {
      timers.current.timeouts.forEach((t) => clearTimeout(t));
      timers.current.intervals.forEach((i) => clearInterval(i));
      stopAmbientSession(sessionRef.current);
    };
  }, []);

  // Ao trocar de hino, toca automaticamente se o anterior estava tocando.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !tocarAoTrocarRef.current) return;
    tocarAoTrocarRef.current = false;
    void tocarHinar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hinarIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    if (sessionRef.current) sessionRef.current.master.gain.value = volume;
  }, [volume]);

  useEffect(() => {
    if (!aberto) return;
    const aoTocarFora = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    };
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("pointerdown", aoTocarFora);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("pointerdown", aoTocarFora);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  const limparTimers = () => {
    timersRef.current.timeouts.forEach((t) => clearTimeout(t));
    timersRef.current.intervals.forEach((i) => clearInterval(i));
    timersRef.current = { timeouts: [], intervals: [] };
  };

  const pararAmbiente = () => {
    limparTimers();
    stopAmbientSession(sessionRef.current);
    sessionRef.current = null;
  };

  const tocarAmbiente = (trilha: number) => {
    audioRef.current?.pause();
    pararAmbiente();
    const context = new AudioContext();
    sessionRef.current = createAmbientSession(context, trilha, volume, timersRef.current);
    void context.resume();
    setErroAudio("");
    setTocando(true);
  };

  async function tocarHinar() {
    const audio = audioRef.current;
    if (!audio) return;
    pararAmbiente();
    setErroAudio("");
    audio.volume = volume;
    try {
      await audio.play();
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") {
        setTocando(false);
        setErroAudio("Não foi possível tocar este hino. Tente o próximo.");
      }
    }
  }

  const pausar = () => {
    audioRef.current?.pause();
    pararAmbiente();
    setTocando(false);
  };

  const alternar = () => {
    if (tocando) pausar();
    else if (fonte === "hinar") void tocarHinar();
    else tocarAmbiente(fonte);
  };

  const escolherFonte = (nova: Fonte) => {
    setFonte(nova);
    salvar("ce-fonte-musica", String(nova));
    if (nova === "hinar") void tocarHinar();
    else tocarAmbiente(nova);
  };

  const trocarHino = (delta: 1 | -1) => {
    tocarAoTrocarRef.current = tocando && fonte === "hinar";
    setTempo({ atual: 0, total: 0 });
    setHinarIndex((i) => {
      const proximo = (i + delta + HINAR_TRACKS.length) % HINAR_TRACKS.length;
      salvar("ce-hino", String(proximo));
      return proximo;
    });
  };

  const mudarVolume = (novo: number) => {
    setVolume(novo);
    salvar("ce-volume", String(novo));
  };

  const buscarPosicao = (segundos: number) => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration)) audio.currentTime = segundos;
  };

  const rotuloAtual =
    fonte === "hinar"
      ? `Hino ${String(hino.number).padStart(3, "0")} · ${hino.title}`
      : AMBIENTES[fonte].label;

  return (
    <div
      ref={containerRef}
      className="fixed right-5 z-40 flex flex-col items-end gap-2 bottom-24 md:bottom-6"
    >
      {/* Sempre montado: a música continua ao fechar o painel e ao navegar entre páginas. */}
      <audio
        ref={audioRef}
        src={hino.audioUrl}
        preload="none"
        onPlay={() => setTocando(true)}
        onPause={() => {
          // Ao trocar para um som ambiente, o hino pausa mas a música continua.
          if (!sessionRef.current) setTocando(false);
        }}
        onWaiting={() => setCarregandoAudio(true)}
        onPlaying={() => setCarregandoAudio(false)}
        onCanPlay={() => setCarregandoAudio(false)}
        onLoadedMetadata={(e) => setTempo({ atual: 0, total: e.currentTarget.duration })}
        onTimeUpdate={(e) =>
          setTempo({ atual: e.currentTarget.currentTime, total: e.currentTarget.duration })
        }
        onEnded={() => {
          tocarAoTrocarRef.current = true;
          setHinarIndex((i) => {
            const proximo = (i + 1) % HINAR_TRACKS.length;
            salvar("ce-hino", String(proximo));
            return proximo;
          });
        }}
        onError={() => {
          setCarregandoAudio(false);
          if (audioRef.current?.getAttribute("src")) {
            setTocando(false);
            setErroAudio("Não foi possível carregar este hino. Tente o próximo.");
          }
        }}
        className="hidden"
      />

      {aberto && (
        <div
          id="painel-musica"
          role="dialog"
          aria-label="Música para leitura"
          className="card w-72 p-4 animate-fadeIn"
          style={{ background: "rgba(245,240,232,0.98)", border: "1px solid var(--parchment-dark)" }}
        >
          <p
            className="font-sans text-xs font-semibold mb-3"
            style={{ color: "var(--ink-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}
          >
            Música para leitura
          </p>

          <section
            aria-label="Hinos instrumentais do Hinar.io"
            className="rounded-lg p-3 mb-3"
            style={{
              background: fonte === "hinar" ? "var(--parchment-dark)" : "transparent",
              border: "1px solid var(--parchment-dark)",
            }}
          >
            <button
              type="button"
              onClick={() => escolherFonte("hinar")}
              className="font-sans text-sm text-left w-full mb-1"
              style={{ color: fonte === "hinar" ? "var(--gold)" : "var(--ink)", fontWeight: 600 }}
              aria-pressed={fonte === "hinar"}
            >
              🎵 Hinos instrumentais
            </button>
            <p className="font-sans text-xs leading-snug mb-2 capitalize" style={{ color: "var(--ink)" }}>
              {String(hino.number).padStart(3, "0")} · {hino.title}
            </p>

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
              onChange={(e) => buscarPosicao(Number(e.target.value))}
              disabled={!tempo.total}
              className="w-full accent-amber-700"
            />
            <div
              className="flex justify-between font-sans text-[11px] mb-2 tabular-nums"
              style={{ color: "var(--ink-light)" }}
            >
              <span>{formatarTempo(tempo.atual)}</span>
              <span>{carregandoAudio ? "carregando…" : formatarTempo(tempo.total)}</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => trocarHino(-1)}
                aria-label="Hino anterior"
                className="w-8 h-8 rounded-full border flex items-center justify-center"
                style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
              >
                <Icone nome="prev" />
              </button>
              <button
                type="button"
                onClick={() => (tocando && fonte === "hinar" ? pausar() : escolherFonte("hinar"))}
                aria-label={tocando && fonte === "hinar" ? "Pausar hino" : "Tocar hino"}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "var(--gold)", color: "white" }}
              >
                <Icone nome={tocando && fonte === "hinar" ? "pause" : "play"} />
              </button>
              <button
                type="button"
                onClick={() => trocarHino(1)}
                aria-label="Próximo hino"
                className="w-8 h-8 rounded-full border flex items-center justify-center"
                style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
              >
                <Icone nome="next" />
              </button>
            </div>

            {erroAudio && (
              <p role="alert" className="font-sans text-xs mt-2" style={{ color: "var(--burgundy)" }}>
                {erroAudio}
              </p>
            )}

            <a
              href={hino.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[11px] inline-block mt-2"
              style={{ color: "var(--gold)", textDecoration: "underline" }}
            >
              Ver no Hinar.io ↗
            </a>
          </section>

          <p
            className="font-sans text-[11px] font-semibold mb-1"
            style={{ color: "var(--ink-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}
          >
            Sons ambientes
          </p>
          <div className="flex flex-col gap-1 mb-3">
            {AMBIENTES.map((item, index) => {
              const ativo = fonte === index;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => escolherFonte(index as Fonte)}
                  aria-pressed={ativo}
                  className="font-sans text-sm text-left px-2 py-1 rounded transition-colors"
                  style={{
                    background: ativo ? "var(--parchment-dark)" : "transparent",
                    color: ativo ? "var(--gold)" : "var(--ink)",
                    fontWeight: ativo ? 600 : 400,
                  }}
                >
                  {item.emoji} {item.label}
                </button>
              );
            })}
          </div>

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
              onChange={(event) => mudarVolume(Number(event.target.value))}
              className="flex-1 accent-amber-700"
              aria-label="Volume"
            />
          </div>
        </div>
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
          onClick={() => setAberto((v) => !v)}
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
