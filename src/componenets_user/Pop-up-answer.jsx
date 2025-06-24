import React from 'react';
import './Pop-up-answer.css';

function PopUpAnswer({ answer, userAnswer, aiNote, aiFeedback, loading, onClose, onNext }) {
  return (
    <div className="popup-answer-overlay">
      <div className="popup-answer-content" style={{ maxWidth: 800 }}>
        <h3 className="popup-answer-title">Answer Review</h3>
        {aiNote !== null && (
          <div className={`popup-answer-score ${aiNote < 5 ? 'score-red' : aiNote < 7 ? 'score-orange' : 'score-green'}`}>
            Score: {aiNote}/10
          </div>
        )}
        <div className="popup-answer-correct">
          <strong className="popup-answer-correct-label">The correct answer:</strong>
          <div className="popup-answer-correct-value">{answer}</div>
        </div>
        <div className="popup-answer-user">
          <strong>Your answer:</strong>
          <div className="popup-answer-user-value">{userAnswer || <span className="popup-answer-empty">(empty)</span>}</div>
        </div>
        <div className="popup-answer-actions">
          <button
            className="flashcard-action-btn popup-answer-close"
            onClick={onClose}
          >
            Close
          </button>
          {onNext && (
            <button
              className="flashcard-action-btn popup-answer-close"
              onClick={() => {
                onClose();
                onNext();
              }}
            >
              Next
            </button>
          )}
        </div>
        <div className="popup-answer-feedback">
          {loading ? 'Evaluating your answer...' : aiFeedback && <span>AI feedback: {aiFeedback}</span>}
        </div>
      </div>
    </div>
  );
}

export default PopUpAnswer;
