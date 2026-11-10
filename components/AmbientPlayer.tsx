"use client";

import { useEffect, useRef, useState } from "react";

const TRACKS = [
  { label: "Chuva suave", emoji: "🌧️" },
  { label: "Floresta", emoji: "🌿" },
  { label: "Oceano", emoji: "🌊" },
  { label: "Silêncio", emoji: "🕊️" },
];

type AmbientSession = {
  context: AudioContext;
  master: GainNode;
  sources: AudioScheduledSourceNode[];
};

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
  timers: { timeouts: number[]; intervals: number[] }
): AmbientSession {
  const master = context.createGain();
  master.gain.value = volume;
  master.connect(context.destination);
  const sources: AudioScheduledSourceNode[] = [];

  if (track === 3) {
    return { context, master, sources };
  }

  // Base de ruído filtrado: chuva (agudo), floresta (médio), oceano (grave)
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
    // Ondas do oceano: LFO lento modulando o ganho do ruído
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
    // Gorjeios de pássaros: rajadas curtas de frequência modulada, em intervalos
    // aleatórios — bem mais natural que um tom senoidal contínuo.
    const chirp = () => {
      if (context.state === "closed") return;
      const t0 = context.currentTime + 0.05;
      const osc = context.createOscillator();
      const g = context.createGain();
      const base = 2200 + Math.random() * 1800; // 2,2–4 kHz
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
      timers.timeouts.push(
        window.setTimeout(chirp, 2500 + Math.random() * 6000)
      );
    };
    timers.timeouts.push(window.setTimeout(chirp, 1200));
  }

  return { context, master, sources };
}

function stopAmbientSession(session: AmbientSession | null) {
  if (!session) return;
  session.sources.forEach((source) => source.stop());
  session.sources.forEach((source) => source.disconnect());
  session.master.disconnect();
  void session.context.close();
}

function lerPreferencias(): { volume: number; track: number } {
  let volume = 0.4;
  let track = 0;
  try {
    const v = Number(localStorage.getItem("ce-volume"));
    if (!Number.isNaN(v) && v >= 0 && v <= 1) volume = v;
    const t = Number(localStorage.getItem("ce-trilha"));
    if (Number.isInteger(t) && t >= 0 && t < TRACKS.length) track = t;
  } catch {
    /* ignora */
  }
  return { volume, track };
}

export default function AmbientPlayer() {
  const [prefs] = useState(lerPreferencias);
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(prefs.track);
  const [volume, setVolume] = useState(prefs.volume);
  const [expanded, setExpanded] = useState(false);
  const sessionRef = useRef<AmbientSession | null>(null);
  const timersRef = useRef({ timeouts: [] as number[], intervals: [] as number[] });

  // Limpa tudo ao desmontar
  useEffect(() => {
    return () => {
      timersRef.current.timeouts.forEach((t) => clearTimeout(t));
      timersRef.current.intervals.forEach((i) => clearInterval(i));
      stopAmbientSession(sessionRef.current);
    };
  }, []);

  const limparTimers = () => {
    timersRef.current.timeouts.forEach((t) => clearTimeout(t));
    timersRef.current.intervals.forEach((i) => clearInterval(i));
    timersRef.current = { timeouts: [], intervals: [] };
  };

  const stop = () => {
    limparTimers();
    stopAmbientSession(sessionRef.current);
    sessionRef.current = null;
    setPlaying(false);
  };

  const start = (selectedTrack = track) => {
    limparTimers();
    stopAmbientSession(sessionRef.current);
    const context = new AudioContext();
    const session = createAmbientSession(context, selectedTrack, volume, timersRef.current);
    sessionRef.current = session;
    void context.resume();
    setPlaying(true);
  };

  const toggle = () => {
    if (playing) {
      stop();
    } else if (track !== 3) {
      start();
    }
  };

  const selectTrack = (selectedTrack: number) => {
    setTrack(selectedTrack);
    try {
      localStorage.setItem("ce-trilha", String(selectedTrack));
    } catch {
      /* ignora */
    }
    if (selectedTrack === 3) {
      stop();
    } else if (playing) {
      start(selectedTrack);
    }
  };

  const changeVolume = (nextVolume: number) => {
    setVolume(nextVolume);
    try {
      localStorage.setItem("ce-volume", String(nextVolume));
    } catch {
      /* ignora */
    }
    if (sessionRef.current) {
      sessionRef.current.master.gain.value = nextVolume;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {expanded && (
        <div
          className="card w-56 p-4 animate-fadeIn"
          style={{ background: "rgba(245,240,232,0.98)", border: "1px solid var(--parchment-dark)" }}
        >
          <p className="font-sans text-xs font-semibold mb-3" style={{ color: "var(--ink-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Som Ambiente
          </p>
          <div className="flex flex-col gap-1 mb-3">
            {TRACKS.map((item, index) => (
              <button
                key={item.label}
                onClick={() => selectTrack(index)}
                className="font-sans text-sm text-left px-2 py-1 rounded transition-colors"
                style={{
                  background: track === index ? "var(--parchment-dark)" : "transparent",
                  color: track === index ? "var(--gold)" : "var(--ink)",
                  fontWeight: track === index ? 600 : 400,
                }}
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs" style={{ color: "var(--ink-light)" }} aria-hidden>🔊</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(event) => changeVolume(Number(event.target.value))}
              className="flex-1 accent-amber-700"
              aria-label="Volume do som ambiente"
            />
          </div>
        </div>
      )}
      <div className="flex gap-2">
        {track !== 3 && (
          <button
            onClick={toggle}
            title={playing ? "Pausar som ambiente" : "Tocar som ambiente"}
            aria-label={playing ? "Pausar som ambiente" : "Tocar som ambiente"}
            className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all"
            style={{ background: "var(--gold)", color: "white", fontSize: "1rem" }}
          >
            {playing ? "⏸" : "▶"}
          </button>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          title="Abrir sons ambientes"
          aria-label="Abrir sons ambientes"
          className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center"
          style={{ background: "var(--ink)", color: "var(--gold-light)", fontSize: "1.1rem" }}
        >
          {playing ? <span className="animate-pulse-soft">♫</span> : "♫"}
        </button>
      </div>
    </div>
  );
}
