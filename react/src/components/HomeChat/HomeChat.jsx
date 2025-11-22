import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchMessages, sendMessage } from '../../api/messages';
import { useAuth } from '../../context/AuthContext';

const formatTimestamp = value => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

export const HomeChat = () => {
  const { token, profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  const canInteract = Boolean(token);

  const loadMessages = useCallback(async () => {
    if (!token) {
      setMessages([]);
      setUpdatedAt('');
      return;
    }
    setLoadingMessages(true);
    setError('');
    try {
      const data = await fetchMessages();
      const list = Array.isArray(data) ? data : data?.results || [];
      setMessages(list);
      setUpdatedAt(new Date().toISOString());
    } catch (err) {
      const message = err?.response?.data?.detail || 'Не удалось загрузить сообщения.';
      setError(message);
    } finally {
      setLoadingMessages(false);
    }
  }, [token]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSubmit = async event => {
    event.preventDefault();
    if (!text.trim() || !canInteract) {
      return;
    }
    setSending(true);
    setError('');
    try {
      await sendMessage(text.trim());
      setText('');
      await loadMessages();
    } catch (err) {
      const message = err?.response?.data?.detail || 'Не удалось отправить сообщение.';
      setError(message);
    } finally {
      setSending(false);
    }
  };

  const placeholderText = canInteract ? 'Напишите сообщение...' : 'Авторизуйтесь, чтобы участвовать в беседе';

  const emptyState = useMemo(() => !loadingMessages && messages.length === 0 && canInteract, [loadingMessages, messages.length, canInteract]);

  return (
    <section className="page-section home-chat" data-easytag="id1-src/components/HomeChat/HomeChat.jsx">
      <div className="info-card home-intro">
        <div>
          <h1>Групповой чат EasyChat</h1>
          <p>Минималистичное пространство для обсуждения идей и быстрого обмена обновлениями.</p>
        </div>
        <div className="muted-text">
          {profile ? `Вы вошли как ${profile.name || profile.email}. Поддерживайте беседу и следите за новостями команды.` : 'Войдите или зарегистрируйтесь, чтобы начать общение и видеть историю сообщений.'}
        </div>
      </div>
      <div className="chat-card">
        <div className="chat-header">
          <div>
            <h2>Общий канал</h2>
            <p className="muted-text">Все участники команды видят обновления в одном месте.</p>
          </div>
          <div className="chat-header-actions">
            {updatedAt && <span className="chat-updated">Обновлено {formatTimestamp(updatedAt)}</span>}
            <button className="secondary-btn" type="button" onClick={loadMessages} disabled={!canInteract || loadingMessages}>
              {loadingMessages ? 'Обновляем...' : 'Обновить'}
            </button>
          </div>
        </div>
        {error && <div className="status-message status-error">{error}</div>}
        <div className="chat-messages" role="log">
          {!canInteract && <div className="chat-placeholder">Авторизуйтесь, чтобы читать и отправлять сообщения.</div>}
          {canInteract && loadingMessages && (
            <div className="chat-skeletons">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="chat-skeleton" />
              ))}
            </div>
          )}
          {emptyState && <div className="chat-empty">Сообщений пока нет. Напишите первое!</div>}
          {canInteract &&
            !loadingMessages &&
            messages.map(message => (
              <article key={message.id} className="chat-message">
                <div className="chat-message-header">
                  <span className="chat-author">{message.author?.nickname || message.author?.email || 'Участник'}</span>
                  <span className="chat-time">{formatTimestamp(message.created_at)}</span>
                </div>
                <p className="chat-text">{message.text}</p>
              </article>
            ))}
        </div>
        <form className="chat-form" onSubmit={handleSubmit}>
          <textarea name="message" placeholder={placeholderText} value={text} onChange={event => setText(event.target.value)} disabled={!canInteract || sending} rows={3} />
          <button className="primary-btn" type="submit" disabled={!canInteract || sending || !text.trim()}>
            {sending ? 'Отправляем...' : 'Отправить'}
          </button>
        </form>
        {!canInteract && <p className="muted-text">Создайте аккаунт или войдите, чтобы участвовать в групповом чате.</p>}
      </div>
    </section>
  );
};
