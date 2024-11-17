import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import UserList from './UserList';
import { useNavigate } from 'react-router-dom';

function ChatRoom({ socket, username, setUsername }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('previous-messages', (msgs) => {
      setMessages(msgs.reverse());
    });

    socket.on('new-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('user-list', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off('previous-messages');
      socket.off('new-message');
      socket.off('user-list');
    };
  }, [socket]);

  const handleLogout = () => {
    socket.emit('logout');
    setUsername('');
    navigate('/');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit('send-message', {
      username,
      content: newMessage.trim()
    });
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Welcome, {username}!</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="chat-main">
        <MessageList messages={messages} currentUser={username} />
        <div className="message-input">
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="message-input-field"
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </form>
        </div>
      </div>
      <UserList users={users} />
    </div>
  );
}

export default ChatRoom;
