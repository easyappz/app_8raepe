import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../../api/auth';

export const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ error: '', success: '' });
    try {
      await registerUser(form);
      setStatus({ error: '', success: 'Аккаунт создан. Теперь войдите.' });
      setForm({ email: '', password: '' });
    } catch (error) {
      const message = error?.response?.data?.detail || 'Не удалось зарегистрироваться.';
      setStatus({ error: message, success: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section" data-easytag="id1-src/components/RegisterPage/RegisterPage.jsx">
      <div className="form-card">
        <div>
          <h2 className="form-title">Создать аккаунт</h2>
          <p>Введите почту и пароль, чтобы присоединиться к команде.</p>
        </div>
        <form className="form-fields" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="register-email">Почта</label>
            <input id="register-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label htmlFor="register-password">Пароль</label>
            <input id="register-password" name="password" type="password" placeholder="Минимум 8 символов" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-actions">
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? 'Создание...' : 'Зарегистрироваться'}
            </button>
            {status.error && <div className="status-message status-error">{status.error}</div>}
            {status.success && <div className="status-message status-success">{status.success}</div>}
            <div className="helper-text">
              Уже есть аккаунт? <Link className="auth-link" to="/login">Войдите</Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
