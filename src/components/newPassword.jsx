import React, { useState } from 'react';
import './RegisterForm.css';
import LoginForm from './login';

const API_URL = import.meta.env.VITE_API_URL;

const NewPassword = ({ username}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Validare reguli parolă
  const isLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const canSubmit =
    isLength && hasUpper && hasLower && hasSpecial && password === confirmPassword;

  async function hashPassword(pw) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pw);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!canSubmit) {
      setError('Password does not meet all requirements.');
      return;
    }
    try {
      const hashedPassword = await hashPassword(password);
      const response = await fetch(`${API_URL}/ForgotPassword`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword: hashedPassword })
      });
      const data = await response.json();
      console.log('[Set Password PATCH]', {
        status: response.status,
        ok: response.ok,
        responseData: data,
        sent: { username, newPassword: '[SHA-256 hash]' }
      });
      if (response.status === 200) {
        setShowLogin(true);
      } else {
        setError(data.error || 'Password reset failed.');
      }
    } catch (err) {
      console.log('[Set Password PATCH] ERROR', err);
      setError('Server error. Please try again.');
    }
  };

  if (showLogin) {
    return <LoginForm />;
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-title">Set New Password</div>
      <div className="password-login">
        <input
          className="login_input"
          type={showPassword ? 'text' : 'password'}
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onFocus={() => setShowPasswordRules(true)}
          onBlur={() => { if (!password) setShowPasswordRules(false); }}
          required
        />
        <div
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="toggle-password"
          tabIndex={-1}
        >
          {showPassword ? (
            <img
              src="/assets/icons8-eye-50.png"
              className='eye-icon'
              alt="hide password"
            />
          ) : (
            <img
              src="/assets/icons8-closed-eye-50.png"
              className='eye-icon'
              alt="show password"
            />
          )}
        </div>
      </div>
      {(showPasswordRules || password.length > 0) && !(isLength && hasUpper && hasLower && hasSpecial) && (
        <div style={{marginTop: '-10px', marginBottom: '8px'}}>
          <div style={{color: isLength ? '#27ae60' : '#e74c3c', fontSize: '0.97rem'}}>
            {isLength ? '✔' : '✖'} At least 8 characters
          </div>
          <div style={{color: hasUpper ? '#27ae60' : '#e74c3c', fontSize: '0.97rem'}}>
            {hasUpper ? '✔' : '✖'} At least one uppercase letter
          </div>
          <div style={{color: hasLower ? '#27ae60' : '#e74c3c', fontSize: '0.97rem'}}>
            {hasLower ? '✔' : '✖'} At least one lowercase letter
          </div>
          <div style={{color: hasSpecial ? '#27ae60' : '#e74c3c', fontSize: '0.97rem'}}>
            {hasSpecial ? '✔' : '✖'} At least one special character
          </div>
        </div>
      )}
      <div className="password-login">
        <input
          className="login_input"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Repeat New Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <div
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="toggle-password"
          tabIndex={-1}
        >
          {showConfirmPassword ? (
            <img
              src="/assets/icons8-eye-50.png"
              className='eye-icon'
              alt="hide password"
            />
          ) : (
            <img
              src="/assets/icons8-closed-eye-50.png"
              className='eye-icon'
              alt="show password"
            />
          )}
        </div>
      </div>
      {(confirmPassword.length > 0 && password.length > 0 && password !== confirmPassword) && (
        <div style={{ color: '#e74c3c', fontSize: '0.97rem', marginTop: '-8px', marginBottom: '8px' }}>
          Passwords don't match
        </div>
      )}
      <button type="submit" className="login-button" disabled={!canSubmit}>Set Password</button>
      {error && <div style={{ color: '#e74c3c', marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default NewPassword;
