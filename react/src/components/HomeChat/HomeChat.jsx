import React from 'react';
import { useAuth } from '../../context/AuthContext';

const conversation = [
  { id: 1, author: 'Алиса', text: 'Добро пожаловать в наш чат!', time: '09:24' },
  { id: 2, author: 'Иван', text: 'Расскажите, над чем работаете сегодня.', time: '09:27' },
  { id: 3, author: 'Мария', text: 'Я готовлю новый интерфейс для мобильной версии.', time: '09:31' },
];

export const HomeChat = () => {
  const { profile } = useAuth();

  return (
    <section className="page-section home-chat" data-easytag="id1-src/components/HomeChat/HomeChat.jsx">
      <div className="info-card">
        <h1>Групповой чат EasyChat</h1>
        <p>Общайтесь с командой в одном безопасном пространстве и делитесь идеями в реальном времени.</p>
        {profile ? (
          <p>Вы вошли как {profile.name || profile.email}. Начните беседу прямо сейчас.</p>
        ) : (
          <p>Авторизуйтесь, чтобы писать сообщения и видеть историю диалога.</p>
        )}
      </div>
      <div className="chat-card">
        <div className="chat-messages">
          {conversation.map((message) => (
            <div key={message.id} className="chat-message">
              <div className="chat-author">{message.author}</div>
              <div>{message.text}</div>
              <div className="chat-time">{message.time}</div>
            </div>
          ))}
        </div>
        <div className="chat-input-row">
          <textarea placeholder={profile ? 'Напишите сообщение...' : 'Войдите, чтобы написать сообщение'} disabled={!profile} />
          <button className="primary-btn" type="button" disabled={!profile}>
            Отправить
          </button>
        </div>
      </div>
    </section>
  );
};
