'use client';
import dynamic from 'next/dynamic';
import type { BiblePassage as PassagemBiblica } from '@/lib/bible-links';
import type { BibleTranslation as VersaoBiblica } from '@/lib/bible-translations';

const LeitorCarregado = dynamic(() => import('./LeitorBiblico'), {
  ssr: false,
  loading: () => <p className="font-sans p-8 text-center" role="status">Preparando sua leitura…</p>,
});
export default function CarregadorLeitorBiblico(propriedades: { destino: PassagemBiblica | null; versao?: VersaoBiblica; portugues?: boolean }) { return <LeitorCarregado {...propriedades} />; }
