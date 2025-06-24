import React, { useState } from 'react';
import './Flashcard.css';
import FlashcardSolve from './FlashcardSolve';

function Flashcard({ username, sets }) {
  const [solveSet, setSolveSet] = useState(null);

  return (
    <div className="flashcard-container">
      <h2 className="flashcard-title">Your Flashcard Sets</h2>
      {solveSet ? (
        <FlashcardSolve title={solveSet.title} username={username} onBack={() => setSolveSet(null)} />
      ) : sets && sets.length > 0 ? (
        <table className="flashcard-table">
          <thead>
            <tr>
              <th className="flashcard-th">Title</th>
              <th className="flashcard-th">Number of Questions</th>
              <th className="flashcard-th"></th>
            </tr>
          </thead>
          <tbody>
            {sets.map((set, idx) => (
              <tr key={idx} className={`flashcard-tr ${idx % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                <td className="flashcard-td flashcard-title-cell">{set.title}</td>
                <td className="flashcard-td center flashcard-count-cell">{set.count}</td>
                <td className="flashcard-td center flashcard-action-cell">
                  <button
                    className="start-solving-btn"
                    onClick={() => setSolveSet({ title: set.title })}
                  >
                    Start Solving
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No flashcard sets found.</div>
      )}
      <button
        className="custom-button"
        id="back-to-main-btn"
        onClick={() => window.location.href = '/user'}
      >
        Back to Main
      </button>
    </div>
  );
}

export default Flashcard;
