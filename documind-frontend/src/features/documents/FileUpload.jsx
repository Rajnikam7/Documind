import { useState } from 'react';
import { uploadDocument } from '../../lib/api';
import './FileUpload.css';

export default function FileUpload({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [service, setService] = useState('python'); // 'python' | 'node'

  const handleFile = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadDocument(file, service);
      onUploadSuccess({ ...result, service });
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="upload-container">
      {/* Service toggle */}
      <div className="service-toggle">
        <button
          className={`toggle-btn ${service === 'python' ? 'active' : ''}`}
          onClick={() => setService('python')}
          type="button"
        >
          🐍 Python AI
        </button>
        <button
          className={`toggle-btn ${service === 'node' ? 'active' : ''}`}
          onClick={() => setService('node')}
          type="button"
        >
          🟢 Node AI
        </button>
      </div>

      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''} ${service}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="upload-status">
            <div className={`spinner ${service}`}></div>
            <p>Uploading & Processing via {service === 'node' ? 'Node AI' : 'Python AI'}...</p>
          </div>
        ) : (
          <>
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <h3>Upload PDF Document</h3>
            <p>Drag & drop or click to browse</p>
            <p className="service-label">
              Using: <strong>{service === 'node' ? '🟢 Node.js AI Service' : '🐍 Python AI Service'}</strong>
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleChange}
              disabled={uploading}
            />
          </>
        )}
      </div>
    </div>
  );
}
