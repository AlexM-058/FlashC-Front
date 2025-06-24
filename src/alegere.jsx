import React, { useState } from 'react';

const JsonFileUploader = ({ buttonLabel = "Încarcă JSON" }) => {
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedData = JSON.parse(e.target.result);
        setJsonData(parsedData);
      } catch  {
        alert("Fișierul nu este un JSON valid!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <label className="block mb-2 font-medium text-lg">{buttonLabel}</label>
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {jsonData && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow max-h-96 overflow-auto">
          <pre className="text-sm">{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default JsonFileUploader;
