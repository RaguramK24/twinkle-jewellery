import React, { useState, useEffect } from 'react';
import { messageService } from '../services/api';
import { Message } from '../types';
import './AdminMessages.css';

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const messages = await messageService.getAll();
      setMessages(messages);
      setError('');
    } catch (error) {
      setError('Error fetching messages');
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="admin-messages-container"><p>Loading messages...</p></div>;
  }

  return (
    <div className="admin-messages-container">
      <h2>Admin Messages</h2>
      <button onClick={fetchMessages} className="refresh-btn">
        Refresh Messages
      </button>
      
      {error && <div className="error-message">{error}</div>}
      
      {messages.length === 0 ? (
        <p className="no-messages">No messages yet.</p>
      ) : (
        <div className="messages-list">
          {messages.map((message) => (
            <div key={message._id} className="message-card">
              <div className="message-header">
                <h3>{message.name}</h3>
                <span className="message-email">{message.email}</span>
                <span className="message-date">{formatDate(message.timestamp)}</span>
              </div>
              <div className="message-content">
                <p>{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;