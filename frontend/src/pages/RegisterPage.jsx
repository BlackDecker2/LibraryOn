import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'editor' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form);
      setSuccess('Cuenta creada. Redirigiendo...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card page-enter" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Crear cuenta</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Únete como editor de contenido</p>
        </div>

        {error   && <div className="alert alert-error"   style={{ marginBottom: 16 }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginBottom: 16 }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" required minLength={6} value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres" />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {loading ? <span className="spinner" /> : 'Registrarse'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--accent2)' }}>Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
