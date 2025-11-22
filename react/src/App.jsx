import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomeChat } from './components/HomeChat/HomeChat';
import { RegisterPage } from './components/RegisterPage/RegisterPage';
import { LoginPage } from './components/LoginPage/LoginPage';
import { ProfilePage } from './components/ProfilePage/ProfilePage';

const AppShell = () => {
  const { token, profile, logout } = useAuth();

  return (
    <div className="app-shell" data-easytag="id1-src/App.jsx">
      <header className="app-header" data-easytag="id2-src/App.jsx">
        <div className="logo">EasyChat</div>
        <nav className="app-nav">
          <Link className="nav-link" to="/">
            Чат
          </Link>
          {token && (
            <Link className="nav-link" to="/profile">
              Профиль
            </Link>
          )}
          {!token && (
            <Link className="nav-link" to="/login">
              Войти
            </Link>
          )}
          {!token && (
            <Link className="nav-link accent" to="/register">
              Регистрация
            </Link>
          )}
          {token && (
            <button className="logout-btn" type="button" onClick={logout}>
              Выйти
            </button>
          )}
        </nav>
        {token && profile && (
          <div className="user-badge">
            <span className="user-name">{profile.name || 'Участник'}</span>
            <span className="user-email">{profile.email}</span>
          </div>
        )}
      </header>
      <main className="app-main" data-easytag="id3-src/App.jsx">
        <Routes>
          <Route path="/" element={<HomeChat />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      window.handleRoutes(['/', '/register', '/login', '/profile']);
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
