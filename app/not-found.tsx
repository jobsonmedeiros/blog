import Link from 'next/link';
export default function PaginaNaoEncontrada() {
  return <div className="site-container py-20 text-center">
    <h1 className="text-4xl mb-4">Página não encontrada</h1>
    <p className="font-sans mb-6">Continue sua leitura ou conheça os estudos disponíveis.</p>
    <Link className="btn-primary" href="/estudos">Ir para os estudos</Link>
  </div>;
}
