import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  if (!socket) return <div>Connecting...</div>;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={<Login socket={socket} setUsername={setUsername} />} 
          />
          <Route 
            path="/chat" 
            element={
              username ? (
                <ChatRoom 
                  socket={socket} 
                  username={username} 
                  setUsername={setUsername}
                />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
