import React, { useState, useEffect} from 'react';
import './RegisterForm.css';
import Verifyemail from './Verifyemail';

const API_URL = import.meta.env.VITE_API_URL;

const RegisterForm = ({  onBackToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState('idle'); // idle | checking | taken | available
  const [usernameMsg, setUsernameMsg] = useState('');
  const [emailStatus, setEmailStatus] = useState('idle'); // idle | checking | taken | available
  const [emailMsg, setEmailMsg] = useState('');
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [registerData, setRegisterData] = useState(null);
  const [frogJump, setFrogJump] = useState(false);


  // Validare reguli parolă
  const isLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const passwordsValid = isLength && hasUpper && hasLower && hasSpecial && password === confirmPassword && password.length > 0;
  const allValid =
    usernameStatus === 'available' &&
    emailStatus === 'available' &&
    passwordsValid &&
    password.length > 0 &&
    confirmPassword.length > 0;

  const checkUser = async () => {
    if (!username && !email) return;
    setUsernameStatus('checking');
    setEmailStatus('checking');
    setUsernameMsg('');
    setEmailMsg('');
    try {
      const response = await fetch(`${API_URL}/check-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email })
      });
      const data = await response.json();
      if (data.exists) {
        // Poate fi username sau email deja luat
        if (username) {
          setUsernameStatus('taken');
          setUsernameMsg('Username or email already taken');
        }
        if (email) {
          setEmailStatus('taken');
          setEmailMsg('Username or email already taken');
        }
      } else {
        setUsernameStatus('available');
        setUsernameMsg('');
        setEmailStatus('available');
        setEmailMsg('');
      }
    } catch {
      setUsernameStatus('idle');
      setUsernameMsg('');
      setEmailStatus('idle');
      setEmailMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const emailRegex = /^[^\s@]+@[^-\s@]+\.[^\s@]+$/;
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!(isLength && hasUpper && hasLower && hasSpecial)) {
      setError('Password does not meet all requirements.');
      return;
    }
    // Trimit codul de verificare pe email
    try {
      const response = await fetch(`${API_URL}/api/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email,username })
      });
      const data = await response.json();
      if (data.success) {
        setRegisterData({ username, email, password });
        setShowVerifyEmail(true);
      } else {
        setError(data.error || 'Failed to send verification code.');
      }
    } catch {
      setError('Server error.');
    }
  };

  useEffect(() => {
    if (showVerifyEmail) {
      window.history.pushState({ verify: true }, 'Verify Email');
      const handlePop = () => {
        setShowVerifyEmail(false);
      };
      window.addEventListener('popstate', handlePop);
      return () => window.removeEventListener('popstate', handlePop);
    }
  }, [showVerifyEmail]);

  useEffect(() => {
    if (allValid) {
      setFrogJump(true);
      const timer = setTimeout(() => setFrogJump(false), 1100);
      return () => clearTimeout(timer);
    }
  }, [allValid]);

  // Funcție pentru a forța reluarea animației broaștei
  const triggerFrogJump = () => {
    setFrogJump(false);
    setTimeout(() => setFrogJump(true), 10);
  };

  if (showVerifyEmail && registerData) {
    return <Verifyemail registerData={registerData} email={email} />;
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-title">Register</div>
      <input
        className="login_input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => {
          setUsername(e.target.value);
          setUsernameStatus('idle');
          setUsernameMsg('');
        }}
        onBlur={checkUser}
        required
        style={{
          borderColor: usernameStatus === 'taken' ? '#e74c3c' : usernameStatus === 'available' ? '#27ae60' : undefined,
          boxShadow: usernameStatus === 'taken' ? '0 0 0 2px #e74c3c22' : usernameStatus === 'available' ? '0 0 0 2px #27ae6022' : undefined
        }}
      />
      {usernameStatus === 'taken' && (
        <div style={{ color: '#e74c3c', fontSize: '0.97rem', marginTop: '-8px', marginBottom: '8px' }}>{usernameMsg}</div>
      )}
      <input
        className="login_input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => {
          setEmail(e.target.value);
          setEmailStatus('idle');
          setEmailMsg('');
        }}
        onBlur={checkUser}
        required
        style={{
          borderColor: emailStatus === 'taken' ? '#e74c3c' : emailStatus === 'available' ? '#27ae60' : undefined,
          boxShadow: emailStatus === 'taken' ? '0 0 0 2px #e74c3c22' : emailStatus === 'available' ? '0 0 0 2px #27ae6022' : undefined
        }}
      />
      {emailStatus === 'taken' && (
        <div style={{ color: '#e74c3c', fontSize: '0.97rem', marginTop: '-8px', marginBottom: '8px' }}>{emailMsg}</div>
      )}
      <div className="password-login">
        <input
          className="login_input"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onFocus={() => setShowPasswordRules(true)}
          onBlur={() => { if (!password) setShowPasswordRules(false); }}
          required
          style={{
            borderColor: passwordsValid ? '#27ae60' : undefined,
            boxShadow: passwordsValid ? '0 0 0 2px #27ae6022' : undefined
          }}
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
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          style={{
            borderColor: passwordsValid ? '#27ae60' : undefined,
            boxShadow: passwordsValid ? '0 0 0 2px #27ae6022' : undefined
          }}
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
      <button type="submit" className={`login-button${allValid ? ' register-pulse' : ''}`} disabled={!username || !email || !password || !confirmPassword || !isLength || !hasUpper || !hasLower || !hasSpecial || password !== confirmPassword}>Register</button>
      {error && <div style={{ color: '#e74c3c', marginTop: 8 }}>{error}</div>}
      <div className="login-actions">
        <button type="button" onClick={onBackToLogin}>Back to Login</button>
      </div>
      {allValid && (
        <div
          className={`broasca-container${frogJump ? ' sare' : ''}`}
          style={{ margin: '0 auto', marginTop: 24 }}
          tabIndex={0}
          onMouseEnter={triggerFrogJump}
          onClick={triggerFrogJump}
          onKeyDown={e => { if (e.code === 'Space') triggerFrogJump(); }}
        >
          <div className="corp-broasca"></div>
          <div className="ochi stang"><div className="pupila"></div></div>
          <div className="ochi drept"><div className="pupila"></div></div>
          <div className="gura"></div>
          <div className="picior-fata stang"></div>
          <div className="picior-fata drept"></div>
          <div className="picior-spate stang"></div>
          <div className="picior-spate drept"></div>
        </div>
      )}
    </form>
  );
};

export default RegisterForm;
