import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ socket, setUsername }) {
  const [tempUsername, setTempUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Setting up socket listeners');
    
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setError('');  // Clear any previous connection errors
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Server connection failed. Please try again.');
      setIsLoading(false);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setError('Lost connection to server. Reconnecting...');
    });

    socket.on('error', (message) => {
      console.log('Socket error received:', message);
      setError(message);
      setIsLoading(false);
    });

    socket.on('login-success', () => {
      console.log('Login success received');
      setError('');
      setIsLoading(false);
      setUsername(tempUsername);
      navigate('/chat');
    });

    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('error');
      socket.off('login-success');
    };
  }, [socket, tempUsername, setUsername, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!tempUsername.trim() || !password.trim()) {
      setError('Username and password are required');
      setIsLoading(false);
      return;
    }

    const eventName = isNewAccount ? 'create-account' : 'join';
    socket.emit(eventName, { username: tempUsername, password });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>{isNewAccount ? 'Create Account' : 'Login'}</h2>
        {error && <div className="error">{error}</div>}
        <div>
          <input
            type="text"
            placeholder="Enter username"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Please wait...' : (isNewAccount ? 'Create Account' : 'Login')}
        </button>
        <button 
          type="button"
          onClick={() => {
            setIsNewAccount(!isNewAccount);
            setError('');
          }}
          disabled={isLoading}
        >
          {isNewAccount ? 'Already have an account? Login' : 'Don\'t have an account? Create'}
        </button>
      </form>
    </div>
  );
}

export default Login;
