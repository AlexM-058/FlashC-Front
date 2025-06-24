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
  const [loadingFlashcards, setLoadingFlashcards] = useState(true);
  const [flashcardError, setFlashcardError] = useState('');

  const handleLogout = () => {
    const authService = new AuthService();
    authService.logout();
    localStorage.setItem('isAuthenticated', 'false');
    if (onLogout) onLogout();
    window.location.href = '/';
  };

  useEffect(() => {
    if (username) {
      const controller = new AbortController();
      const signal = controller.signal;
      setLoadingFlashcards(true);
      setFlashcardError('');
      console.log('User_Interface: Pornesc fetch pentru flashcards pentru', username);
      httpRequest(`/api/flashcards/${username}`, {
        method: 'GET',
        signal,
        credentials: 'include'
      })
        .then(async res => {
          const text = await res.text();
          console.log('User_Interface: Răspuns primit de la backend pentru flashcards:', text);
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
            console.error('User_Interface: Eroare la parsarea JSON:', e);
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
          console.error('User_Interface: Eroare la fetch flashcards:', err);
        });
      return () => controller.abort();
    }
  }, [username]);

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
          <div style={{ marginTop: 40 }}>
            <h3 style={{ marginBottom: 12 }}>Your Flashcard Sets</h3>
            {loadingFlashcards && <div>Loading...</div>}
            {flashcardError && <div className="flashcard-error">{flashcardError}</div>}
            {!loadingFlashcards && !flashcardError && flashcardSets.length > 0 && (
              <table className="flashcard-table">
                <thead>
                  <tr>
                    <th className="flashcard-th">Title</th>
                    <th className="flashcard-th">Number of Questions</th>
                  </tr>
                </thead>
                <tbody>
                  {flashcardSets.map((set, idx) => (
                    <tr key={idx} className={`flashcard-tr ${idx % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                      <td className="flashcard-td flashcard-title-cell">{set.title}</td>
                      <td className="flashcard-td center flashcard-count-cell">{set.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : showCreateFlashC ? (
        <CreateFlashC />
      ) : showPractice ? (
        <Flashcard username={username} sets={flashcardSets} />
      ) : null}
    </div>
  );
}

export default User_Interface;
