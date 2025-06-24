import React, { useState, useEffect } from 'react';
import './FlashcardSolve.css';
import FlashcardSetBlock from './FlashcardSetBlock';
import { httpRequest } from '../utils/http';

function FlashcardSolve({ title, username, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const btn = document.getElementById('back-to-main-btn');
    if (btn) btn.style.display = 'none';
    return () => {
      if (btn) btn.style.display = '';
    };
  }, []);

  useEffect(() => {
    const fetchSet = async () => {
      setLoading(true);
      setError('');
      try {
        const encodedTitle = encodeURIComponent(title);
        const res = await httpRequest(`/api/flashcard/${username}/${encodedTitle}`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success && data.flashcard && Array.isArray(data.flashcard.flashcards)) {
          setQuestions(data.flashcard.flashcards);
        } else {
          setError('Setul nu a fost găsit sau nu are întrebări.');
        }
      } catch (err) {
        console.error('Error fetching flashcard set:', err);
        setError('Eroare la încărcarea setului.');
      }
      setLoading(false);
    };
    fetchSet();
  }, [title, username]);

  if (loading) return <div className="solve-set-block">Loading set...</div>;
  if (error) return <div className="solve-set-block">{error}</div>;

  return (
    <div className="solve-set-block">
      <h3 style={{ color: '#2d3a4b', marginBottom: 18 }}>{title}</h3>
      <div style={{ marginBottom: 18 }}>Number of Questions: {questions.length}</div>
      <div style={{ marginTop: 24 }}>
        {questions.length > 0 ? (
          <>
            <FlashcardSetBlock
              question={questions[current].question}
              answer={questions[current].answer}
              hint={questions[current].hint}
              index={current + 1}
              onNext={current < questions.length - 1 ? () => setCurrent(current + 1) : null}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <button className="back-to-sets-btn" onClick={onBack}>
                Back to Sets
              </button>
            </div>
          </>
        ) : (
          <div>No questions in this set.</div>
        )}
      </div>
    </div>
  );
}

export default FlashcardSolve;
