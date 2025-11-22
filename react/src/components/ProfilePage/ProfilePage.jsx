import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage = () => {
  const { token, profile, loadingProfile, refreshProfile } = useAuth();

  return (
    <section className="page-section" data-easytag="id1-src/components/ProfilePage/ProfilePage.jsx">
      {!token && (
        <div className="info-card">
          <h2>Профиль недоступен</h2>
          <p>Авторизуйтесь, чтобы просматривать и обновлять личные данные.</p>
        </div>
      )}
      {token && (
        <div className="info-card">
          <div className="profile-header">
            <div>
              <h2>Профиль участника</h2>
              <p>Следите за актуальностью своих данных и статусом доступа.</p>
            </div>
            <button className="primary-btn" type="button" onClick={refreshProfile} disabled={loadingProfile}>
              {loadingProfile ? 'Обновление...' : 'Обновить'}
            </button>
          </div>
          {loadingProfile ? (
            <p>Загрузка профиля...</p>
          ) : (
            <div className="profile-grid">
              <div>
                <span className="profile-label">Почта</span>
                <p className="profile-value">{profile?.email || '—'}</p>
              </div>
              <div>
                <span className="profile-label">Имя</span>
                <p className="profile-value">{profile?.name || '—'}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
