'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Article {
  id: number;
  title: string;
  content: string;
  slug: string;
  created_at: string;
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchArticles();
  }, []);

  async function fetchArticles() {
    const token = localStorage.getItem('adminToken');
    const response = await fetch('/api/articles', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setArticles(data);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('adminToken');
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const response = await fetch('/api/articles', {
      method: editingId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: editingId,
        title,
        content,
        slug,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(editingId ? 'Artigo atualizado!' : 'Artigo publicado!');
      setEditingId(null);
      setTitle('');
      setContent('');
      fetchArticles();
    } else {
      setMessage(data.message || 'Erro ao salvar');
    }

    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;

    const token = localStorage.getItem('adminToken');
    await fetch(`/api/articles?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchArticles();
  }

  function handleEdit(article: Article) {
    setEditingId(article.id);
    setTitle(article.title);
    setContent(article.content);
  }

  function handleCancel() {
    setEditingId(null);
    setTitle('');
    setContent('');
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Editar Artigo' : 'Novo Artigo'}
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Conteúdo (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-64"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Publicar'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pré-visualização</h2>
        <div className="prose max-w-none p-4 bg-white rounded border">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || 'Comece a escrever para ver a pré-visualização...'}
          </ReactMarkdown>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Artigos Publicados</h2>
        {articles.map((article) => (
          <div
            key={article.id}
            className="p-4 bg-white rounded border mb-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{article.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(article.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(article)}
                className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(article.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}