import Link from "next/link";
import { LETRAS_TEMAS, TEMAS_INDICE, encontrarTema } from "@/data/temasVersiculos";

const IMAGENS_TEMAS = [
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
];

export default function CatalogoTemasVersiculos() {
  const temasPorLetra = LETRAS_TEMAS.map((letra) => ({
    letra,
    temas: TEMAS_INDICE.filter((tema) => tema.letra === letra),
  }));

  return (
    <section className="mt-14" aria-labelledby="temas-titulo">
      <div className="text-center mb-8">
        <p className="font-sans text-xs uppercase tracking-[0.2em]" style={{ color: "var(--gold)" }}>
          Escrituras para cada necessidade
        </p>
        <h2
          id="temas-titulo"
          className="text-3xl mt-2"
          style={{
            color: "var(--ink)",
            fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif",
            fontWeight: 300,
          }}
        >
          Versículos por tema
        </h2>
        <p className="font-sans text-sm mt-2" style={{ color: "var(--ink-light)" }}>
          Encontre uma palavra de esperança, fé e conforto organizada de A a Z.
        </p>
      </div>

      <nav
        aria-label="Índice alfabético de temas"
        className="card p-4 md:p-5 mb-8 flex flex-wrap justify-center gap-2"
      >
        {temasPorLetra.map(({ letra, temas }) => (
          <a
            key={letra}
            href={temas.length ? `#letra-${letra}` : undefined}
            aria-disabled={!temas.length}
            className="w-8 h-8 rounded-full flex items-center justify-center font-sans text-sm transition-colors"
            style={{
              color: temas.length ? "var(--gold)" : "var(--ink-light)",
              background: temas.length ? "var(--parchment-dark)" : "transparent",
              opacity: temas.length ? 1 : 0.45,
              pointerEvents: temas.length ? "auto" : "none",
            }}
          >
            {letra}
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-10">
        {temasPorLetra
          .filter(({ temas }) => temas.length > 0)
          .map(({ letra, temas }) => (
            <section key={letra} id={`letra-${letra}`} aria-labelledby={`titulo-letra-${letra}`}>
              <h3
                id={`titulo-letra-${letra}`}
                className="text-2xl mb-4 pb-2"
                style={{
                  color: "var(--gold)",
                  borderBottom: "1px solid var(--parchment-dark)",
                  fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif",
                }}
              >
                {letra}
              </h3>
              <div className="grid gap-5 md:grid-cols-2">
                {temas.map((tema) => (
                  (() => {
                    const detalhe = encontrarTema(tema.slug);
                    const imagem = detalhe?.imagem ?? IMAGENS_TEMAS[TEMAS_INDICE.indexOf(tema) % IMAGENS_TEMAS.length];
                    const conteudo = detalhe?.texto ?? "Uma seleção de versículos para meditar sobre este tema.";
                    const card = (
                      <>
                        <div
                          className="h-48 bg-cover bg-center p-5 flex items-end"
                          style={{
                            backgroundImage: `linear-gradient(180deg, rgba(20,25,30,0.04), rgba(20,25,30,0.82)), url("${imagem}")`,
                          }}
                        >
                          <div>
                            <p className="font-sans text-xs uppercase tracking-[0.16em] text-white/80">
                              Tema bíblico
                            </p>
                            <h4 className="text-2xl text-white mt-1">{tema.titulo}</h4>
                          </div>
                        </div>
                        <div className="p-5">
                          <p
                            className="text-lg leading-relaxed"
                            style={{
                              color: "var(--ink)",
                              fontFamily: "'Artifakt Element Book', 'Artifakt Element', 'Crimson Pro', serif",
                            }}
                          >
                            {detalhe ? `“${conteudo}”` : conteudo}
                          </p>
                          <p className="font-sans text-xs mt-3" style={{ color: "var(--gold)" }}>
                            {detalhe?.referencia ?? "Abrir seleção de versículos"} →
                          </p>
                        </div>
                      </>
                    );

                    return detalhe ? (
                      <Link
                        key={tema.slug}
                        href={`/versiculo/${tema.slug}`}
                        className="group rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(45,33,27,0.12)]"
                        style={{ background: "var(--surface)" }}
                      >
                        {card}
                      </Link>
                    ) : (
                      <a
                        key={tema.slug}
                        href={tema.fonteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(45,33,27,0.12)]"
                        style={{ background: "var(--surface)" }}
                      >
                        {card}
                      </a>
                    );
                  })()
                ))}
              </div>
            </section>
          ))}
      </div>
    </section>
  );
}
