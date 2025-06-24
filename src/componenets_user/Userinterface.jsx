import { useState, useEffect } from 'react';
import './Userinterface.css';
import CreateFlashC from './CreateFlashC';
import AuthService from '../Services/auth.services';
import Flashcard from './Flashcard';
import { httpRequest } from '../utils/http';

function User_Interface({ username, onLogout }) {
  const [showCreateFlashC, setShowCreateFlashC] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flashcardError, setFlashcardError] = useState('');
  const [, setLoadingFlashcards] = useState(false);

  const handleLogout = () => {
    const authService = new AuthService();
    authService.logout();
    localStorage.setItem('isAuthenticated', 'false');
    if (onLogout) onLogout();
    window.location.href = '/';
  };

  // Fetch flashcard sets only when user clicks "Start Solving Flashcards"
  useEffect(() => {
    if (showPractice && username) {
      setLoadingFlashcards(true);
      setFlashcardError('');
      setFlashcardSets([]);
      const controller = new AbortController();
      const signal = controller.signal;
      httpRequest(`/api/flashcards/${username}`, {
        method: 'GET',
        signal,
        credentials: 'include'
      })
        .then(async res => {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            if (data && data.success && Array.isArray(data.flashcards)) {
              setFlashcardSets(data.flashcards);
              setFlashcardError('');
            } else {
              setFlashcardSets([]);
              setFlashcardError('No flashcard sets found.');
            }
          } catch (e) {
            console.error('User_Interface: Error parsing flashcards JSON:', e);
            setFlashcardSets([]);
            setFlashcardError('Backend did not return JSON.');
          }
          setLoadingFlashcards(false);
        })
        .catch(err => {
          setLoadingFlashcards(false);
          if (err.name === 'AbortError' || err.code === 20) {
            return;
          }
          setFlashcardError('Error loading flashcards.');
        });
      return () => controller.abort();
    }
  }, [showPractice, username]);

  return (
    <div className="user-interface-root">
      <header className="user-header">
        <div className="logo">Logo</div>
        <div className="header-title">Flash Cards App</div>
        <div className="header-user-actions">
          <span className="header-username">User: {username}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      {!showCreateFlashC && !showPractice ? (
        <div style={{ margin: '48px auto', textAlign: 'center', maxWidth: 900 }}>
          <h2 className="ai-title">Turn your PDFs into smart flashcards with Gemini AI!</h2>
          <p className="ai-description">
            Upload your PDF and let our AI instantly generate questions and answers for you.<br />
            <span style={{ color: '#6c63ff', fontWeight: 600 }}>Get ready to learn faster, smarter, and easier!</span>
          </p>
          {flashcardError && (
            <div className="flashcard-error" style={{ color: 'red', margin: '16px 0' }}>
              {flashcardError}
            </div>
          )}
          <div className="ai-btns-row">
            <div className="ai-btn-col">
              <div className="ai-btn-desc">Already have flashcards? Start practicing and boost your knowledge!</div>
              <button className="ai-learn-btn" onClick={() => setShowPractice(true)}>
                Start Solving Flashcards
              </button>
            </div>
            <div className="ai-btn-col">
              <div className="ai-btn-desc">No flashcards yet? Instantly create them from your PDF with one click!</div>
              <button className="ai-create-btn" onClick={() => setShowCreateFlashC(true)}>
                Create Flashcards from PDF
              </button>
            </div>
          </div>
        </div>
      ) : showCreateFlashC ? (
        <CreateFlashC />
      ) : showPractice ? (
        <Flashcard username={username} sets={flashcardSets}  />
      ) : null}
    </div>
  );
}

export default User_Interface;
