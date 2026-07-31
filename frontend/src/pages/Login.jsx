// TICKET-ADV072 — Login page exchanging email/password for a JWT.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext.jsx';
import { api } from '@services/apiService.js';

export default function Login() {
  const { login: _login } = useAuth();
  const _navigate = useNavigate();
  const [email, setEmail] = useState('admin@db.com');
  const [password, setPassword] = useState('admin123');
  const [error, _setError] = useState(null);
  
  async function submit(e) {
    e.preventDefault();
    try {
      _setError(null);
      const { token, role } = await api.login(email, password);
      _login(token, role);
      _navigate('/');
    } catch (err) {
      _setError(err.message || 'Login failed');
    }
  }

  return (
    <form onSubmit={submit} className="login-form">
      <h2>Sign in</h2>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      </label>
      <label>
        Password
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      </label>
      {error && <div role="alert" className="form-error">{error}</div>}
      <button type="submit">Sign in</button>
    </form>
  );
}
