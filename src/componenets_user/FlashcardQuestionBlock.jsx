import React from 'react';

function FlashcardQuestionBlock({ question, answer, hint, index }) {
  return (
    <li style={{ marginBottom: 10 }}>
      <div style={{ fontWeight: 700, color: '#6c63ff', marginBottom: 4 }}>
        Question {index}:
      </div>
      <div style={{ marginBottom: 4 }}>
        <strong>Q:</strong> {question}
      </div>
      <div style={{ marginBottom: 4 }}>
        <strong>A:</strong> {answer}
      </div>
      {hint && (
        <div style={{ color: '#48c6ef', fontStyle: 'italic' }}>
          <strong>Hint:</strong> {hint}
        </div>
      )}
    </li>
  );
}

export default FlashcardQuestionBlock;
