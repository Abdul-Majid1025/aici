import React, { useState } from 'react';
import RegisterForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt') || '');
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (jwt: string) => {
    console.log('Login successful1, token:', jwt);
    
    setToken(jwt);
    localStorage.setItem('jwt', jwt);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('jwt');
  };

  if (!token) {
    return (
      <div>
        {showRegister ? (
          <>
            <RegisterForm onRegistered={() => setShowRegister(false)} />
            <p className='login-text'><span className='link' onClick={() => setShowRegister(false)}>Back to Login</span></p>
          </>
        ) : (
          <>
            <LoginForm onLogin={handleLogin} />
            <p className='login-text'>Do not have an account? <span className='link' onClick={() => setShowRegister(true)}>Register</span></p>
          </>
        )}
      </div>
    );
  }

  return <TodoList token={token} onLogout={handleLogout} />;
}

export default App;