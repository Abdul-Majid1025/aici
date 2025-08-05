import React, { useState } from 'react';
import { login } from '../api';
import '../App.css';

interface LoginFormProps {
  onLogin: (token: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { token } = await login(email, password);
      onLogin(token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="card">
        <h2>Login</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input"
          type="email"
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input"
          required
        />
        <button type="submit" className="button primary-button">
          Login
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}