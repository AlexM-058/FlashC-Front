import React, { useState, useEffect, useRef } from 'react';
import './FlashcardSetBlock.css';
import PopUpAnswer from './Pop-up-answer';
import { httpRequest } from '../utils/http';
const API_URL = import.meta.env.VITE_API_URL;
function FlashcardSetBlock({ question, answer, hint, index, onNext }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [aiNote, setAiNote] = useState(null);
  const [aiFeedback, setAiFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef();

 
  useEffect(() => {
    if (!userAnswer || !answer) {
      setAiNote(null);
      setAiFeedback('');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        console.log('Sending user answer for AI feedback:', { Answer: userAnswer, 'Correct answer': answer });
        const requestBody = { Answer: userAnswer, 'Correct answer': answer };
        console.log('Request body sent to backend:', JSON.stringify(requestBody));

        const res = await httpRequest(`/api/compare-answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          credentials: 'include'
        });
        const data = await res.json();              
        console.log('AI feedback data:', data);       

        if (data && data.success && Array.isArray(data.result) && data.result.length >= 2) {
          setAiNote(data.result[0]);
          setAiFeedback(data.result[1]);
        } else {
          setAiNote(null);
          setAiFeedback('No feedback received.');
        }
      } catch (err) {
        console.error('Error getting AI feedback:', err);
        setAiNote(null);
        setAiFeedback('Error getting AI feedback.');
      }
      setLoading(false);
    }, 1000);
    return () => clearTimeout(debounceRef.current);
  }, [userAnswer, answer]);

  const handleNext = () => {
    setUserAnswer('');
    if (onNext) onNext();
  };

  return (
    <div className="selected-set-block">
      <div className="selected-set-block-title">
        Question {index}:
      </div>
      <div className="selected-set-block-question">
        <strong>Q:</strong> {question}
      </div>
      <div className="selected-set-block-input">
        <input
          type="text"
          placeholder="Write your answer..."
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
        />
      </div>
      <div className="selected-set-block-actions">
        <button
          className="flashcard-action-btn"
          onClick={() => setShowAnswer(true)}
        >
          Show Answer
        </button>
        {hint && (
          <button className="flashcard-action-btn" onClick={() => setShowHint(v => !v)}>
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        )}
      </div>
      {showHint && hint && (
        <div className="selected-set-block-hint">
          <strong>Hint:</strong> {hint}
        </div>
      )}
      {showAnswer && (
        <PopUpAnswer
          answer={answer}
          userAnswer={userAnswer}
          aiNote={aiNote}
          aiFeedback={aiFeedback}
          loading={loading}
          onClose={() => setShowAnswer(false)}
          onNext={handleNext}
        />
      )}
    </div>
  );
}

export default FlashcardSetBlock;
