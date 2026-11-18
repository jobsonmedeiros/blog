export default function TextoRevista({ titulo, texto, idioma, automatica = false }: { titulo: string; texto: string; idioma: string; automatica?: boolean }) {
  const paragrafos = texto.split(/\n\s*\n/).filter(trecho => trecho.trim());
  return <section lang={idioma} className="revista-coluna grid content-start gap-y-4 min-w-0 rounded-xl border border-[var(--parchment-dark)] bg-[var(--surface)] p-5 sm:p-7">
    <p className="font-sans text-xs uppercase tracking-wider text-[var(--gold)]">{idioma === 'pt-BR' ? `Português${automatica ? ' · tradução automática sem revisão' : ''}` : 'Original'}</p>
    <h2 className="text-2xl leading-tight break-words">{titulo}</h2>
    {paragrafos.map((paragrafo, indice) => <p key={indice} className="text-lg leading-relaxed whitespace-pre-wrap break-words">{paragrafo}</p>)}
  </section>;
}
