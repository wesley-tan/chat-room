import React, { useEffect, useRef } from 'react';

function MessageList({ messages, currentUser }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className={`message ${msg.username === currentUser ? 'message-own' : 'message-other'}`}
        >
          {msg.username !== currentUser && (
            <div className="message-username">{msg.username}</div>
          )}
          <div className="message-text">{msg.content}</div>
          <div className="message-time">
            {new Date(msg.timestamp).toLocaleTimeString([], { 
              hour: 'numeric', 
              minute: '2-digit'
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;