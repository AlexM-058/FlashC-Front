import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login.jsx';
import User_Interface from './componenets_user/Userinterface.jsx';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [redirectToUser, setRedirectToUser] = useState(false);

  const handleLogin = (usernameInput) => {
    setIsAuthenticated(true);
    setUsername(usernameInput);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', usernameInput);
    setRedirectToUser(true);
  };

  const shouldRedirectToLogin = !isAuthenticated || !username || username === 'undefined';

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            redirectToUser
              ? <Navigate to={`/user/${username}`} replace />
              : (isAuthenticated && username && username !== 'undefined'
                  ? <Navigate to={`/user/${username}`} replace />
                  : <Login onLogin={handleLogin} />
                )
          }
        />
        <Route
          path="/user/:username"
          element={
            shouldRedirectToLogin
              ? <Navigate to="/" replace />
              : <User_Interface
                  username={username}
                  onLogout={() => {
                    setIsAuthenticated(false);
                    setUsername('');
                    setRedirectToUser(false);
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('username');
                  }}
                />
          }
        />
        <Route path="/user" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;