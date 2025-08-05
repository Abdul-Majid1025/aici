import React, { useState } from 'react';
import { register } from '../api';
import '../App.css';

interface RegisterFormProps {
  onRegistered: () => void;
}

export default function RegisterForm({ onRegistered }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      onRegistered();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="card">
        <h2>Register</h2>
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
          Register
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}