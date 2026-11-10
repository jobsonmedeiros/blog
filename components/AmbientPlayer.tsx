"use client";
import { useState, useRef, useEffect } from "react";

const TRACKS = [
  { label: "Chuva suave", emoji: "🌧️", url: "https://cdn.pixabay.com/audio/2022/03/10/audio_270f626a4a.mp3" },
  { label: "Floresta", emoji: "🌿", url: "https://cdn.pixabay.com/audio/2022/06/07/audio_b9b7958e22.mp3" },
  { label: "Oceano", emoji: "🌊", url: "https://cdn.pixabay.com/audio/2024/02/28/audio_c4d9a40649.mp3" },
  { label: "Silêncio", emoji: "🕊️", url: "" },
];

export default function AmbientPlayer() {
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Troca ou pausa faixa
  useEffect(() => {
    if (!audioRef.current) return;
    const url = TRACKS[track].url;
    if (!url) { audioRef.current.pause(); setPlaying(false); return; }
    audioRef.current.src = url;
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    if (playing) audioRef.current.play().catch(() => {});
  }, [track]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  const toggle = () => {
    if (!audioRef.current || !TRACKS[track].url) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const selectTrack = (i: number) => {
    if (i === track) return;
    if (audioRef.current) audioRef.current.pause();
    setPlaying(false);
    setTrack(i);
  };

  return (
    <>
      <audio ref={audioRef} />
      {/* Botão flutuante */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {expanded && (
          <div
            className="card p-4 w-56 animate-fadeIn"
            style={{ background: "rgba(245,240,232,0.98)", border: "1px solid var(--parchment-dark)" }}
          >
            <p className="font-sans text-xs font-semibold mb-3" style={{ color: "var(--ink-light)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Som Ambiente
            </p>
            <div className="flex flex-col gap-1 mb-3">
              {TRACKS.map((t, i) => (
                <button
                  key={i}
                  onClick={() => { selectTrack(i); if (t.url) { setTimeout(() => { audioRef.current?.play().catch(() => {}); setPlaying(true); }, 50); } }}
                  className="font-sans text-sm text-left px-2 py-1 rounded transition-colors"
                  style={{
                    background: track === i ? "var(--parchment-dark)" : "transparent",
                    color: track === i ? "var(--gold)" : "var(--ink)",
                    fontWeight: track === i ? 600 : 400,
                  }}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs" style={{ color: "var(--ink-light)" }}>🔊</span>
              <input
                type="range" min={0} max={1} step={0.05} value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 accent-amber-700"
              />
            </div>
          </div>
        )}
        <div className="flex gap-2">
          {TRACKS[track].url && (
            <button
              onClick={toggle}
              title={playing ? "Pausar" : "Tocar"}
              className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all"
              style={{ background: "linear-gradient(135deg, #b8860b, #d4a843)", color: "white", fontSize: "1rem" }}
            >
              {playing ? "⏸" : "▶"}
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            title="Som ambiente"
            className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center"
            style={{ background: "var(--ink)", color: "var(--gold-light)", fontSize: "1.1rem" }}
          >
            {playing ? <span className="animate-pulse-soft">♫</span> : "♫"}
          </button>
        </div>
      </div>
    </>
  );
}
