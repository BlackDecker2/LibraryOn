import { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { getAllUsers, toggleUser, deleteUser, getAllPosts } from '../services/api';

export default function AdminDashboard() {
  const [tab, setTab]     = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [msg, setMsg]     = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3500);
  };

  useEffect(() => {
    Promise.all([getAllUsers(), getAllPosts()])
      .then(([u, p]) => { setUsers(u.data); setPosts(p.data); })
      .catch(() => flash('Error al cargar datos.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleUser(id);
      setUsers(prev => prev.map(u => u.id === id ? data : u));
      flash(`Usuario ${data.active ? 'activado' : 'desactivado'}.`);
    } catch { flash('Error al cambiar estado.', 'error'); }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`¿Eliminar al usuario "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      flash('Usuario eliminado.');
    } catch { flash('Error al eliminar usuario.', 'error'); }
  };

  const TabBtn = ({ id, label, count }) => (
    <button onClick={() => setTab(id)} style={{
      background: 'none', border: 'none', padding: '10px 20px', cursor: 'pointer',
      color: tab === id ? 'var(--accent2)' : 'var(--muted)',
      borderBottom: tab === id ? '2px solid var(--accent)' : '2px solid transparent',
      fontFamily: 'Syne', fontWeight: 600, fontSize: 15,
      transition: 'color .15s', display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {label}
      <span style={{
        background: tab === id ? 'rgba(108,99,255,.18)' : 'rgba(139,143,168,.1)',
        color: tab === id ? 'var(--accent2)' : 'var(--muted)',
        borderRadius: 20, padding: '1px 8px', fontSize: 12,
      }}>{count}</span>
    </button>
  );

  const adminCount  = users.filter(u => u.roles.includes('ROLE_ADMIN')).length;
  const editorCount = users.filter(u => u.roles.includes('ROLE_EDITOR')).length;
  const pubCount    = posts.filter(p => p.published).length;
  const draftCount  = posts.filter(p => !p.published).length;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }} className="page-enter">

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 30 }}>Panel de administración</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>
            Gestión global de usuarios y contenido
          </p>
        </div>

        {/* Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Usuarios totales', value: users.length,  color: 'var(--accent2)' },
            { label: 'Admins',           value: adminCount,    color: 'var(--warning)' },
            { label: 'Editores',         value: editorCount,   color: 'var(--success)' },
            { label: 'Posts totales',    value: posts.length,  color: 'var(--text)' },
            { label: 'Publicados',       value: pubCount,      color: 'var(--success)' },
            { label: 'Borradores',       value: draftCount,    color: 'var(--muted)' },
          ].map(m => (
            <div key={m.label} style={{ background: 'var(--surface2)',
              borderRadius: 10, padding: '16px 20px' }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{m.label}</p>
              <p style={{ fontSize: 26, fontFamily: 'Syne', fontWeight: 700, color: m.color }}>
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Flash */}
        {msg.text && (
          <div className={`alert alert-${msg.type}`} style={{ marginBottom: 20 }}>
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 24,
          display: 'flex', gap: 0 }}>
          <TabBtn id="users" label="Usuarios"  count={users.length} />
          <TabBtn id="posts" label="Todos los posts" count={posts.length} />
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
          </div>
        )}

        {/* Tab: Usuarios */}
        {!loading && tab === 'users' && (
          <div className="card table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Registrado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
                    Sin usuarios registrados.
                  </td></tr>
                )}
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>{u.email}</td>
                    <td>
                      {u.roles.map(r => (
                        <span key={r}
                          className={`badge ${r.includes('ADMIN') ? 'badge-admin' : 'badge-editor'}`}
                          style={{ marginRight: 4 }}>
                          {r.replace('ROLE_', '')}
                        </span>
                      ))}
                    </td>
                    <td>
                      <span className={`badge ${u.active ? 'badge-pub' : 'badge-draft'}`}>
                        {u.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {new Date(u.createdAt).toLocaleDateString('es-CO', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleToggle(u.id)}>
                          {u.active ? 'Desactivar' : 'Activar'}
                        </button>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteUser(u.id, u.name)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Posts */}
        {!loading && tab === 'posts' && (
          <div className="card table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Estado</th>
                  <th>Creado</th>
                  <th>Última edición</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
                    Sin posts aún.
                  </td></tr>
                )}
                {posts.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500, maxWidth: 300 }}>
                      <span style={{
                        display: '-webkit-box', WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>{p.title}</span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>{p.authorName}</td>
                    <td>
                      <span className={`badge ${p.published ? 'badge-pub' : 'badge-draft'}`}>
                        {p.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {new Date(p.createdAt).toLocaleDateString('es-CO', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {new Date(p.updatedAt).toLocaleDateString('es-CO', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}
