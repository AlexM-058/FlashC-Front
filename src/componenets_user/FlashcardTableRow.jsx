import React from 'react';

function FlashcardTableRow({ set, onStart }) {
  return (
    <tr className="flashcard-tr">
      <td className="flashcard-td">{set.title}</td>
      <td className="flashcard-td center">{set.flashcards?.length || 0}</td>
      <td className="flashcard-td center">
        <button
          className="start-solving-btn"
          onClick={() => onStart(set)}
        >
          Start Solving
        </button>
      </td>
    </tr>
  );
}

export default FlashcardTableRow;
