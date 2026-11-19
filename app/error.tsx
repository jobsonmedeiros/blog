'use client';
export default function PaginaErro({ reset }: { reset: () => void }) {
  return <div className="site-container py-20 text-center">
    <h1 className="text-3xl mb-4">Vamos tentar mais uma vez?</h1>
    <p className="font-sans mb-6">Não foi possível carregar esta página agora.</p>
    <button className="btn-primary" onClick={reset}>Tentar novamente</button>
  </div>;
}
