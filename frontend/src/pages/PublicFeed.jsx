import { useEffect, useState } from 'react';
import { getPublished } from '../services/api';
import Navbar from '../components/layout/Navbar';

export default function PublicFeed() {
  const [posts, setPosts]     = useState([]);
  const [page, setPage]       = useState(0);
  const [total, setTotal]     = useState(0);
  const [pages, setPages]     = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPublished(page)
      .then(({ data }) => {
        setPosts(data.content);
        setTotal(data.totalElements);
        setPages(data.totalPages);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }} className="page-enter">

        {/* Encabezado */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, marginBottom: 8 }}>Publicaciones</h1>
          <p style={{ color: 'var(--muted)' }}>{total} artículo{total !== 1 ? 's' : ''} publicado{total !== 1 ? 's' : ''}</p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div className="spinner" style={{ width: 32, height: 32 }} />
          </div>
        )}

        {/* Sin posts */}
        {!loading && posts.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '56px 24px', color: 'var(--muted)' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>◎</p>
            <p style={{ fontSize: 16 }}>No hay publicaciones aún.</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>Vuelve pronto.</p>
          </div>
        )}

        {/* Lista de posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.map(post => (
            <article key={post.id} className="card"
              style={{ transition: 'border-color .2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>

              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                <h2 style={{ fontSize: 20, fontFamily: 'Syne' }}>{post.title}</h2>
                <span className="badge badge-pub">Publicado</span>
              </div>

              <p style={{
                color: 'var(--muted)', fontSize: 14, lineHeight: 1.75,
                display: '-webkit-box', WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {post.content}
              </p>

              <div style={{ marginTop: 16, display: 'flex', gap: 20,
                fontSize: 12, color: 'var(--muted)', flexWrap: 'wrap' }}>
                <span>✍ {post.authorName}</span>
                <span>📅 {new Date(post.createdAt).toLocaleDateString('es-CO', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Paginación */}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center',
            alignItems: 'center', gap: 12, marginTop: 36 }}>
            <button className="btn btn-ghost btn-sm"
              disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              ← Anterior
            </button>
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>
              Página {page + 1} de {pages}
            </span>
            <button className="btn btn-ghost btn-sm"
              disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}>
              Siguiente →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
