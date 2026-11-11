"use client";
import { useState } from "react";

const CHAVE_PIX = "b140c321-d644-4a63-95c5-c7febb101655";

export default function DoarPix() {
  const [copiado, setCopiado] = useState(false);

  const copiarChave = async () => {
    try {
      await navigator.clipboard.writeText(CHAVE_PIX);
    } catch {
      const area = document.createElement("textarea");
      area.value = CHAVE_PIX;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <span
      className="font-sans text-xs inline-flex items-center gap-1.5"
      style={{ color: "var(--ink-light)", opacity: 0.75 }}
    >
      <button
        onClick={copiarChave}
        title="Doar via PIX — contribuir com esse projeto"
        aria-label="Doar — contribuir com esse projeto"
        className="inline-flex items-center transition-transform hover:scale-110"
        style={{ lineHeight: 0 }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="rgba(178,58,58,0.18)"
          stroke="#b23a3a"
          strokeWidth="1.6"
          aria-hidden
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
      {copiado ? (
        <span role="status">Chave PIX copiada — obrigado! 🙏</span>
      ) : (
        <button
          onClick={copiarChave}
          title="Doar via PIX — contribuir com esse projeto"
          className="underline-offset-2 hover:underline"
          style={{ color: "inherit" }}
        >
          contribuir com esse projeto
        </button>
      )}
    </span>
  );
}
