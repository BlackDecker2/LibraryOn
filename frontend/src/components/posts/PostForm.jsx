import { useState } from 'react';

export default function PostForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title:   initial.title   || '',
    content: initial.content || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim())   e.title   = 'El título es requerido';
    if (!form.content.trim()) e.content = 'El contenido es requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="form-group">
        <label>Título</label>
        <input value={form.title} maxLength={200}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="Título del artículo" />
        {errors.title && <span className="form-error">{errors.title}</span>}
      </div>
      <div className="form-group">
        <label>Contenido</label>
        <textarea value={form.content} style={{ minHeight: 180 }}
          onChange={e => setForm({ ...form, content: e.target.value })}
          placeholder="Escribe el contenido del artículo..." />
        {errors.content && <span className="form-error">{errors.content}</span>}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        {onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancelar</button>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : (initial.id ? 'Guardar cambios' : 'Crear borrador')}
        </button>
      </div>
    </form>
  );
}
