"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { biblePassageHref as criarLinkPassagem } from "@/lib/bible-links";
import VERSICULOS from "@/data/versiculosDoDia.json";
import { criarFundoNatureza } from '@/data/fundosNatureza';
import { dailyVerseIndex as indiceVersiculoDoDia, verseSwipeStep as direcaoGestoVersiculo, wrapVerseIndex as circularIndiceVersiculo } from "@/lib/daily-verses";

const observarDiaAtual = (notificarAtualizacao: () => void) => {
  const temporizador = setInterval(notificarAtualizacao, 60000);
  return () => clearInterval(temporizador);
};
const obterDiaAtual = () => indiceVersiculoDoDia(new Date());

export default function VersiculoDoDia({ tituloDaPagina = false }: { tituloDaPagina?: boolean }) {
  const Titulo = tituloDaPagina ? "h1" : "h2";
  const gesto = useRef<{ id: number; x: number; y: number } | null>(null);
  const ignorarCliqueAte = useRef(0);
  const hoje = useSyncExternalStore(observarDiaAtual, obterDiaAtual, () => 0);
  const [navegacao, definirNavegacao] = useState({ dia: hoje, deslocamento: 0 });
  const deslocamento = navegacao.dia === hoje ? navegacao.deslocamento : 0;
  const indiceVersiculo = circularIndiceVersiculo(hoje + deslocamento, VERSICULOS.length);
  const versiculo = VERSICULOS[indiceVersiculo];
  const enderecoLeitura = criarLinkPassagem({ livro: versiculo.livro, capitulo: versiculo.capitulo, versiculo: versiculo.numero, ate: versiculo.numero });
  // A confirmação fica vinculada ao versículo copiado, inclusive após navegar.
  const [copiado, definirCopiado] = useState<number | null>(null);

  const navegar = (passo: number) => {
    definirCopiado(null);
    definirNavegacao(anterior => ({ dia: hoje, deslocamento: (anterior.dia === hoje ? anterior.deslocamento : 0) + passo }));
  };
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`"${versiculo.texto}" — ${versiculo.ref} (ACF)`);
      definirCopiado(indiceVersiculo);
    } catch { definirCopiado(null); }
  };

  return (
    <section
      aria-label="Carrossel de versículos"
      aria-roledescription="carrossel"
      onPointerDown={(evento) => {
        gesto.current = null;
        if (!evento.isPrimary || evento.pointerType === "mouse") return;
        const alvo = evento.target as HTMLElement;
        if (alvo.closest("button, a") && !alvo.closest("[data-carousel-edge], [data-verse-link]")) return;
        gesto.current = { id: evento.pointerId, x: evento.clientX, y: evento.clientY };
      }}
      onPointerUp={(evento) => {
        const inicio = gesto.current;
        gesto.current = null;
        if (!inicio || inicio.id !== evento.pointerId) return;
        const passo = direcaoGestoVersiculo(evento.clientX - inicio.x, evento.clientY - inicio.y);
        if (passo) {
          ignorarCliqueAte.current = Date.now() + 400;
          navegar(passo);
        }
      }}
      onPointerCancel={() => { gesto.current = null; }}
      onClickCapture={(evento) => {
        // Impede que o clique gerado após um gesto avance uma segunda vez.
        if (Date.now() < ignorarCliqueAte.current) {
          evento.preventDefault();
          evento.stopPropagation();
        }
      }}
      className="w-full min-w-0 max-w-full rounded-2xl px-9 py-4 sm:px-12 text-center relative overflow-hidden shadow-[0_16px_38px_rgba(45,33,27,0.16)]"
      style={{
        touchAction: "pan-y pinch-zoom",
        color: "var(--parchment)",
        backgroundColor: '#182124',
        backgroundImage: criarFundoNatureza(indiceVersiculo),
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute -right-10 -top-20 opacity-[0.07] select-none pointer-events-none text-[14rem] leading-none" aria-hidden>“</div>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 mb-3">
        <Titulo className="text-2xl leading-tight font-light shrink-0" style={{ color: "var(--gold-light)" }}>🕊️ Versículo do Dia</Titulo>
        <p className="font-sans text-xs opacity-90 sm:text-right">Uma palavra para cada dia — renovação diária pela Escritura</p>
      </header>
      <button type="button" data-carousel-edge onClick={() => navegar(-1)} aria-label="Versículo anterior pela lateral esquerda" className="absolute left-0 inset-y-0 w-8 sm:w-10 flex items-center justify-center hover:bg-white/10 focus-visible:bg-white/10 transition-colors">
        <span aria-hidden="true" className="text-3xl" style={{ color: "var(--gold-light)" }}>‹</span>
      </button>
      <button type="button" data-carousel-edge onClick={() => navegar(1)} aria-label="Próximo versículo pela lateral direita" className="absolute right-0 inset-y-0 w-8 sm:w-10 flex items-center justify-center hover:bg-white/10 focus-visible:bg-white/10 transition-colors">
        <span aria-hidden="true" className="text-3xl" style={{ color: "var(--gold-light)" }}>›</span>
      </button>
      <div aria-live="polite" aria-atomic="true">
        <p className="font-sans text-xs mb-2" style={{ color: "var(--gold-light)" }}>{versiculo.tema}</p>
        <div
          className="grid grid-cols-1 min-w-0 max-w-full text-xl sm:text-2xl leading-[1.35] mb-2 mx-auto break-words"
          style={{ fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif", fontStyle: "italic", fontWeight: 300 }}
        >
          {/* As cópias invisíveis ocupam a mesma célula: o CSS reserva a altura
              do maior texto na largura e fonte atuais, sem fixar pixels ou cortar. */}
          <div aria-hidden="true" className="invisible pointer-events-none grid grid-cols-1 min-w-0 max-w-full [grid-area:1/1] select-none">
            {VERSICULOS.map((itemAtual) => (
              <span key={itemAtual.ref} className="[grid-area:1/1]">&ldquo;{itemAtual.texto}&rdquo;</span>
            ))}
          </div>
          <blockquote className="min-w-0 max-w-full [grid-area:1/1] self-center">
            <Link data-verse-link href={enderecoLeitura} title={`Ler ${versiculo.ref} na Bíblia`} className="no-underline transition-colors duration-200 hover:text-[var(--gold-light)] focus-visible:text-[var(--gold-light)]">
              &ldquo;{versiculo.texto}&rdquo;
            </Link>
          </blockquote>
        </div>
        <p className="font-sans text-xs" style={{ color: "var(--gold-light)" }}>
          <Link data-verse-link href={enderecoLeitura} className="underline underline-offset-4" aria-label={`Ler ${versiculo.ref} na Bíblia`}><cite className="not-italic">{versiculo.ref}</cite> · ACF ↗</Link>
          <span className="ml-3 opacity-80">{indiceVersiculo + 1} de {VERSICULOS.length}</span>
        </p>
      </div>
      <div className="relative mt-3 font-sans text-xs">
      <div className="grid grid-cols-3 items-center gap-1 mx-auto w-full max-w-md sm:flex sm:w-auto sm:max-w-none sm:justify-center sm:gap-2">
        <button type="button" onClick={() => navegar(-1)} aria-label="Ver versículo anterior" className="min-h-11 min-w-0 whitespace-nowrap px-1 sm:px-4 py-2 text-[11px] sm:text-xs rounded-full border border-[var(--gold-light)]/60 hover:bg-white/10 transition-colors">← Anterior</button>
        <button type="button" onClick={copiar} aria-label={copiado === indiceVersiculo ? 'Versículo copiado' : 'Copiar versículo'} className="min-h-11 min-w-0 sm:min-w-40 whitespace-nowrap px-1 sm:px-4 py-2 text-[11px] sm:text-xs rounded-full border border-[var(--gold-light)]/60 hover:bg-white/10 transition-colors" aria-live="polite">
          <span className="sm:hidden">{copiado === indiceVersiculo ? "✓" : "Copiar"}</span>
          <span className="hidden sm:inline">{copiado === indiceVersiculo ? "✓ Copiado!" : "Copiar versículo"}</span>
        </button>
        <button type="button" onClick={() => navegar(1)} aria-label="Ver próximo versículo" className="min-h-11 min-w-0 whitespace-nowrap px-1 sm:px-4 py-2 text-[11px] sm:text-xs rounded-full border border-[var(--gold-light)]/60 hover:bg-white/10 transition-colors">Próximo →</button>
      </div>
        <button type="button" onClick={() => { definirNavegacao({ dia: hoje, deslocamento: 0 }); definirCopiado(null); }} className={`block mx-auto mt-1 lg:absolute lg:right-0 lg:top-0 lg:mt-0 underline underline-offset-4 min-h-8 lg:min-h-11 px-3 ${indiceVersiculo === hoje ? "invisible" : ""}`} style={{ color: "var(--gold-light)" }}>Versículo de hoje</button>
      </div>
    </section>
  );
}
