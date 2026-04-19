import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      padding: '0 32px', height: 60, display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link to="/" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--accent2)' }}>
        ◈ LibraryOn
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/" className="btn btn-ghost btn-sm">Feed</Link>

        {!user && <>
          <Link to="/login"    className="btn btn-ghost btn-sm">Iniciar sesión</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Registrarse</Link>
        </>}

        {user && !isAdmin() &&
          <Link to="/editor" className="btn btn-ghost btn-sm">Mi contenido</Link>}
        {user && isAdmin() && <>
          <Link to="/editor" className="btn btn-ghost btn-sm">Editor</Link>
          <Link to="/admin"  className="btn btn-ghost btn-sm">Admin</Link>
        </>}

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{user.name}</span>
            <span className={`badge ${isAdmin() ? 'badge-admin' : 'badge-editor'}`}>
              {isAdmin() ? 'Admin' : 'Editor'}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Salir</button>
          </div>
        )}
      </div>
    </nav>
  );
}
