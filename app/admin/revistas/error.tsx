"use client";
import Link from 'next/link';
export default function ErroRevistas({ reset }: { reset: () => void }) {
  return <div className="max-w-3xl mx-auto px-4 py-10"><h1 className="text-3xl mb-4">Não foi possível abrir o editor agora</h1><p className="font-sans text-sm mb-5">Seus rascunhos salvos continuam no servidor. Tente novamente em instantes.</p><button type="button" onClick={reset} className="btn-secondary">Tentar novamente</button><Link href="/admin/revistas" className="font-sans text-sm underline ml-4">Voltar aos trabalhos</Link></div>;
}
