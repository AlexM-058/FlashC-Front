import React, { useState } from 'react';
import './CreateFlashC.css';
import { httpRequest } from '../utils/http';

const API_URL = import.meta.env.VITE_API_URL;

function CreateFlashC() {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!pdfFile) {
      setMessage('Please select a PDF file.');
      return;
    }
    setUploading(true);
    setMessage('Uploading PDF to backend...');
    try {
      console.log('Selected PDF:', pdfFile);
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      const username = localStorage.getItem('username') || '';
      formData.append('username', username);
      const response = await httpRequest(`${API_URL}/api/gemini-text`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      if (response.ok) {
        setMessage('PDF was successfully uploaded to the backend!');
      } else {
        setMessage('Error uploading PDF to backend.');
      }
    } catch (err) {
      console.error('Error uploading PDF:', err);
      setMessage('Error uploading PDF.');
    }
    setUploading(false);
  };

  return (
    <div className="create-flashc-container">
      <h2>Add Flashcards from PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {pdfFile && (
        <div className="pdf-preview-container">
          <embed
            src={URL.createObjectURL(pdfFile)}
            type="application/pdf"
            className="pdf-preview-embed"
          />
        </div>
      )}
      <button
        className="upload-button"
        style={{ marginBottom: 16, background: '#eee', color: '#6c63ff', border: '1.5px solid #6c63ff' }}
        onClick={() => window.location.href = '/user'}
      >
        Back to main page
      </button>
      <button onClick={handleUpload} disabled={uploading} className="upload-button">Upload PDF to backend</button>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default CreateFlashC;
