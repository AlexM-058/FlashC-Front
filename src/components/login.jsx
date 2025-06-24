import React, { useState } from 'react';
import AuthService from '../Services/auth.services';
import { getUser } from '../utils/jwt'; // ✅ import necesar

import './login.css';
import RegisterForm from './RegisterForm';
import ForgotPassword from './ForgotPassword';

const LoginForm = ({ onSubmit, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSignUpClick = () => {
    setShowRegisterForm(true);
    setShowLoginForm(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowLoginForm(false);
    setShowRegisterForm(false);
  };

  const handleBackToLogin = () => {
    setShowRegisterForm(false);
    setShowForgotPassword(false);
    setShowLoginForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const authService = new AuthService();
    const success = await authService.login(username, password);
    if (success) {
      if (onSubmit) onSubmit(username);

      if (typeof onLogin === 'function') {
        const user = getUser();
        if (user && user.username) {
          onLogin(user.username); // transmite username-ul din token
        } else {
          onLogin(username); // fallback la username introdus dacă tokenul nu e valid
        }
      }
    } else {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      {showLoginForm && (
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-title">Log In</div>
          <input
            className="login_input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="password-login">
            <input
              className="login_input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                  className="eye-icon"
                  alt="hide password"
                />
              ) : (
                <img
                  src="/assets/icons8-closed-eye-50.png"
                  className="eye-icon"
                  alt="show password"
                />
              )}
            </div>
          </div>
          <button type="submit">Log In</button>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          <div className="login-actions">
            <button type="button" onClick={handleSignUpClick}>
              Sign Up
            </button>
            <button type="button" onClick={handleForgotPasswordClick}>
              Forgot Password?
            </button>
          </div>
        </form>
      )}
      {showRegisterForm && <RegisterForm onBackToLogin={handleBackToLogin} />}
      {showForgotPassword && <ForgotPassword onBackToLogin={handleBackToLogin} />}
    </>
  );
};

export default LoginForm;
