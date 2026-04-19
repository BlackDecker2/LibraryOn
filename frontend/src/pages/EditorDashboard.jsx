import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import PostForm from '../components/posts/PostForm';
import {
  getMyPosts, createPost, updatePost,
  deletePost, publishPost, unpublishPost,
} from '../services/api';

export default function EditorDashboard() {
  const [posts, setPosts]     = useState([]);
  const [view, setView]       = useState('list');   // 'list' | 'new' | 'edit'
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState({ text: '', type: '' });

  const load = () => getMyPosts().then(r => setPosts(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3500);
  };

  const handleCreate = async (form) => {
    setLoading(true);
    try {
      await createPost(form);
      flash('Post creado como borrador.');
      setView('list');
      load();
    } catch (err) {
      flash(err.response?.data?.error || 'Error al crear el post.', 'error');
    } finally { setLoading(false); }
  };

  const handleUpdate = async (form) => {
    setLoading(true);
    try {
      await updatePost(editing.id, form);
      flash('Post actualizado correctamente.');
      setView('list');
      load();
    } catch (err) {
      flash(err.response?.data?.error || 'Error al actualizar.', 'error');
    } finally { setLoading(false); }
  };

  const handlePublish = async (id) => {
    try {
      await publishPost(id);
      flash('Post publicado exitosamente.');
      load();
    } catch (err) {
      flash(err.response?.data?.error || 'Error al publicar.', 'error');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await unpublishPost(id);
      flash('Post despublicado.');
      load();
    } catch (err) {
      flash(err.response?.data?.error || 'Error al despublicar.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este post? Esta acción no se puede deshacer.')) return;
    try {
      await deletePost(id);
      flash('Post eliminado.');
      load();
    } catch (err) {
      flash(err.response?.data?.error || 'Error al eliminar.', 'error');
    }
  };

  const totalPublicados = posts.filter(p => p.published).length;
  const totalBorradores = posts.filter(p => !p.published).length;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 920, margin: '0 auto', padding: '40px 24px' }} className="page-enter">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 30 }}>Mi contenido</h1>
            <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>
              {posts.length} post{posts.length !== 1 ? 's' : ''} —{' '}
              <span style={{ color: 'var(--success)' }}>{totalPublicados} publicado{totalPublicados !== 1 ? 's' : ''}</span>
              {' · '}
              <span style={{ color: 'var(--muted)' }}>{totalBorradores} borrador{totalBorradores !== 1 ? 'es' : ''}</span>
            </p>
          </div>
          {view === 'list'
            ? <button className="btn btn-primary" onClick={() => setView('new')}>+ Nuevo post</button>
            : <button className="btn btn-ghost" onClick={() => { setView('list'); setEditing(null); }}>← Volver</button>
          }
        </div>

        {/* Alerta flash */}
        {msg.text && (
          <div className={`alert alert-${msg.type}`} style={{ marginBottom: 20 }}>
            {msg.text}
          </div>
        )}

        {/* Vista: Nuevo post */}
        {view === 'new' && (
          <div className="card">
            <h2 style={{ marginBottom: 20, fontSize: 18 }}>Nuevo post</h2>
            <PostForm
              onSubmit={handleCreate}
              onCancel={() => setView('list')}
              loading={loading}
            />
          </div>
        )}

        {/* Vista: Editar post */}
        {view === 'edit' && editing && (
          <div className="card">
            <h2 style={{ marginBottom: 20, fontSize: 18 }}>Editar post</h2>
            <PostForm
              initial={editing}
              onSubmit={handleUpdate}
              onCancel={() => { setView('list'); setEditing(null); }}
              loading={loading}
            />
          </div>
        )}

        {/* Vista: Lista */}
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {posts.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '56px 24px', color: 'var(--muted)' }}>
                <p style={{ fontSize: 36, marginBottom: 12 }}>✏️</p>
                <p style={{ fontSize: 16 }}>No has creado ningún post aún.</p>
                <p style={{ fontSize: 13, marginTop: 6 }}>Haz clic en «+ Nuevo post» para empezar.</p>
              </div>
            )}

            {posts.map(post => (
              <div key={post.id} className="card" style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', gap: 16, flexWrap: 'wrap',
                transition: 'border-color .2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {/* Info del post */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'Syne', fontSize: 17 }}>{post.title}</h3>
                    <span className={`badge ${post.published ? 'badge-pub' : 'badge-draft'}`}>
                      {post.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                  <p style={{
                    color: 'var(--muted)', fontSize: 13, lineHeight: 1.6,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    marginBottom: 10,
                  }}>
                    {post.content}
                  </p>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                    📅 {new Date(post.createdAt).toLocaleDateString('es-CO', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                    {post.updatedAt !== post.createdAt && (
                      <span style={{ marginLeft: 10, opacity: .6 }}>
                        (editado {new Date(post.updatedAt).toLocaleDateString('es-CO')})
                      </span>
                    )}
                  </span>
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                  <button className="btn btn-ghost btn-sm"
                    onClick={() => { setEditing(post); setView('edit'); }}>
                    Editar
                  </button>
                  {!post.published
                    ? <button className="btn btn-success btn-sm" onClick={() => handlePublish(post.id)}>
                        Publicar
                      </button>
                    : <button className="btn btn-ghost btn-sm" onClick={() => handleUnpublish(post.id)}>
                        Despublicar
                      </button>
                  }
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
