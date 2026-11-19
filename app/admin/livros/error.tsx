'use client';
export default function ErroPainelLivros({ reset }: { reset: () => void }) {
  return <div className="site-container py-10"><h1 className="text-2xl mb-4">Não foi possível abrir o painel de livros</h1><p className="font-sans text-sm mb-4">A conexão com o servidor está indisponível. Seus rascunhos salvos permanecem preservados.</p><button type="button" onClick={reset} className="btn-primary min-h-11">Tentar novamente</button></div>;
}
