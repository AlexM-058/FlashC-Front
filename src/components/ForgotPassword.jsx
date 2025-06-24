import React, { useState } from 'react';
import './RegisterForm.css';

import Verifyemail from './Verifyemail';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showNewPassword,] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !email) {
      setError('All fields are required.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username })
      });
      const data = await response.json();
      if (data.success) {
        setShowVerifyEmail(true);
      } else {
        setError(data.error || 'Failed to send verification code.');
      }
    } catch {
      setError('Server error. Please try again.');
    }
  };

  if (showVerifyEmail) {
    return <Verifyemail username={username} email={email} route={1} />;
  }

  if (showNewPassword) {
    return <Verifyemail username={username} email={email} route={1}/>;
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-title">Forgot Password</div>
      <input
        className="login_input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        className="login_input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="login-button">Next Step</button>
      {error && <div style={{ color: '#e74c3c', marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default ForgotPassword;
