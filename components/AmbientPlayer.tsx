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

function createAmbientSession(track: number, volume: number): AmbientSession {
  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = volume;
  master.connect(context.destination);
  const sources: AudioScheduledSourceNode[] = [];

  if (track === 3) {
    return { context, master, sources };
  }

  const noise = context.createBufferSource();
  noise.buffer = createNoise(context);
  noise.loop = true;
  const filter = context.createBiquadFilter();
  filter.type = track === 0 ? "highpass" : "lowpass";
  filter.frequency.value = track === 0 ? 900 : track === 1 ? 1800 : 500;
  const noiseGain = context.createGain();
  noiseGain.gain.value = track === 2 ? 0.18 : 0.12;
  noise.connect(filter).connect(noiseGain).connect(master);
  noise.start();
  sources.push(noise);

  if (track === 2) {
    const swell = context.createOscillator();
    const swellGain = context.createGain();
    swell.type = "sine";
    swell.frequency.value = 0.08;
    swellGain.gain.value = 0.08;
    swell.connect(swellGain).connect(master.gain);
    swell.start();
    sources.push(swell);
  }

  if (track === 1) {
    const birds = context.createOscillator();
    const birdGain = context.createGain();
    birds.type = "sine";
    birds.frequency.value = 520;
    birdGain.gain.value = 0.008;
    birds.connect(birdGain).connect(master);
    birds.start();
    sources.push(birds);
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

export default function AmbientPlayer() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [expanded, setExpanded] = useState(false);
  const sessionRef = useRef<AmbientSession | null>(null);

  useEffect(() => () => stopAmbientSession(sessionRef.current), []);

  const stop = () => {
    stopAmbientSession(sessionRef.current);
    sessionRef.current = null;
    setPlaying(false);
  };

  const start = (selectedTrack = track) => {
    stopAmbientSession(sessionRef.current);
    const session = createAmbientSession(selectedTrack, volume);
    sessionRef.current = session;
    void session.context.resume();
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
    if (selectedTrack === 3) {
      stop();
    } else if (playing) {
      start(selectedTrack);
    }
  };

  const changeVolume = (nextVolume: number) => {
    setVolume(nextVolume);
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
