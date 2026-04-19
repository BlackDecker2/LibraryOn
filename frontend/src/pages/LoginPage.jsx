import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { loginFn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await loginFn(form.email, form.password);
      navigate(data.roles?.includes('ROLE_ADMIN') ? '/admin' : '/editor');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales inválidas.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card page-enter" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Iniciar sesión</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Accede con tu cuenta LibraryOn</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="admin@cms.com" />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {loading ? <span className="spinner" /> : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--accent2)' }}>Regístrate</Link>
        </div>

        <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--surface2)',
          borderRadius: 8, fontSize: 12, color: 'var(--muted)', lineHeight: 1.9 }}>
          <strong style={{ color: 'var(--text)' }}>Cuentas demo:</strong><br />
          Admin: <code style={{ color: 'var(--accent2)' }}>admin@cms.com</code> / <code>admin123</code><br />
          Editor: <code style={{ color: 'var(--success)' }}>editor@cms.com</code> / <code>editor123</code>
        </div>
      </div>
    </div>
  );
}
