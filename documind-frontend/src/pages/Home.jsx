import { useState } from 'react';
import FileUpload from '../features/documents/FileUpload';
import ChatInterface from '../features/documents/ChatInterface';
import DocumentList from '../features/documents/DocumentList';
import './Home.css';

export default function Home() {
  const [currentDocument, setCurrentDocument] = useState(null);

  const handleUploadSuccess = (document) => {
    setCurrentDocument(document);
  };

  const handleNewDocument = () => {
    setCurrentDocument(null);
  };

  return (
    <div className="home-page">
      {!currentDocument ? (
        <div className="upload-section">
          <div className="intro">
            <h2>Upload & Ask Questions</h2>
            <p>Upload any PDF document and ask questions about its content. Our AI will analyze and provide accurate answers.</p>
          </div>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          <DocumentList onSelectDocument={setCurrentDocument} />
        </div>
      ) : (
        <div className="chat-section">
          <button className="new-doc-btn" onClick={handleNewDocument}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Document
          </button>
          <ChatInterface document={currentDocument} />
        </div>
      )}
    </div>
  );
}
