import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      setIsConnecting(false);
    });

    newSocket.on('connect_error', () => {
      setIsConnecting(true);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [SOCKET_URL]);

  if (isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to server...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
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
