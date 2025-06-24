import React, { useState, useEffect } from 'react';
import './Verifyemail.css';
import LoginForm from './login';
import NewPassword from './newPassword';
const API_URL = import.meta.env.VITE_API_URL;

const Verifyemail = ({ registerData, email, route,username }) => {
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('code'); // 'code' | 'success'
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const codeInputs = [];

  const handleDigitChange = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...codeDigits];
    newDigits[idx] = value;
    setCodeDigits(newDigits);
    if (value && idx < 5 && codeInputs[idx + 1]) {
      codeInputs[idx + 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setCodeDigits(paste.split(''));
      setTimeout(() => {
        if (codeInputs[5]) codeInputs[5].focus();
      }, 0);
    }
    e.preventDefault();
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const code = codeDigits.join('');
    if (code.length !== 6) {
      setError('Code is required.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await response.json();
      if (data.valid) {
        setStep('success');
        setInfo('Email verified successfully!');
      } else {
        setError('Invalid or expired code.');
      }
    } catch {
      setError('Server error.');
    }
  };

  useEffect(() => {
    window.history.pushState({ verify: true }, 'Verify Email');
    const handlePop = () => {
      window.history.back(); // va reveni la RegisterForm
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  useEffect(() => {
    const registerUser = async () => {
      if (step === 'success' && registerData) {
        try {
          const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData),
            credentials: 'include',
          });
          const data = await response.json();
          if (!response.ok) {
            setError(data.message || 'Registration failed.');
            setInfo('');
            return;
          }
        } catch (err) {
            console.error('Registration error:', err);  
            setError('Server error during registration.');
          setInfo('');
          return;
        }
        // dacă totul e ok, continuă cu redirectul după 2 secunde
        const timer = setTimeout(() => {
          setShowLogin(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    };
    registerUser();
  }, [step, registerData]);

  if (showLogin || route === 0) {
    return <LoginForm />;
  }
  if (step === 'success' && route === 1) {
    return <NewPassword username={username} email={email} />;
}

  return (
    <div className="verify-email-container">
      {step === 'code' && (
        <form className="login-form" onSubmit={handleVerifyCode}>
          <div className="login-title">Enter Verification Code</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
            {codeDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={el => codeInputs[idx] = el}
                className="login_input"
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleDigitChange(idx, e.target.value)}
                onPaste={handlePaste}
                style={{ width: 36, textAlign: 'center', fontSize: '1.3rem' }}
              />
            ))}
          </div>
          <button type="submit" className="login-button">Verify Code</button>
          {error && <div className="verifyemail-error">{error}</div>}
          {info && <div className="verifyemail-success">{info}</div>}
        </form>
      )}
      {step === 'success' && (
        <div className="login-form">
          <div className="login-title">Email Verified!</div>
          <div className="verifyemail-success">{info}</div>
        </div>
      )}
    </div>
  );
};

export default Verifyemail;
