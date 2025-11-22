import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ error: '', success: '' });
    try {
      const data = await loginUser(form);
      const nextToken = data?.token || '';
      if (!nextToken) {
        throw new Error('Token missing');
      }
      await login(nextToken);
      setStatus({ error: '', success: 'Вход выполнен.' });
      navigate('/');
    } catch (error) {
      const message = error?.response?.data?.detail || 'Не удалось войти.';
      setStatus({ error: message, success: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section" data-easytag="id1-src/components/LoginPage/LoginPage.jsx">
      <div className="form-card">
        <div>
          <h2 className="form-title">Войти в аккаунт</h2>
          <p>Продолжите общение в коллективном чате.</p>
        </div>
        <form className="form-fields" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-email">Почта</label>
            <input id="login-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-field">
            <label htmlFor="login-password">Пароль</label>
            <input id="login-password" name="password" type="password" placeholder="Ваш пароль" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-actions">
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? 'Входим...' : 'Войти'}
            </button>
            {status.error && <div className="status-message status-error">{status.error}</div>}
            {status.success && <div className="status-message status-success">{status.success}</div>}
            <div className="helper-text">
              Нет учетной записи? <Link className="auth-link" to="/register">Создать</Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
