export type ReferenciaObra = { titulo: string; url: string; observacao?: string };
export type ObraAcervo = {
  id: string;
  tipo: 'livro' | 'artigo';
  titulo: string;
  autor: string;
  fontePortugues: ReferenciaObra;
  publicacao?: ReferenciaObra;
  descricao?: string;
  notas: string[];
  indice: ReferenciaObra[];
  originais: ReferenciaObra[];
};

export function normalizarBuscaObras(texto: string) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/\s+/g, ' ').trim();
}

export function filtrarObras(obras: ObraAcervo[], busca: string, comOriginal = false) {
  const termos = normalizarBuscaObras(busca).split(' ').filter(Boolean);
  return obras.filter(obra => {
    const texto = normalizarBuscaObras([obra.titulo, obra.autor, obra.publicacao?.titulo ?? '', ...obra.originais.map(original => original.titulo)].join(' '));
    return (!comOriginal || obra.originais.length > 0) && termos.every(termo => texto.includes(termo));
  });
}
