import { useState, useEffect } from 'react';
import { getDocuments } from '../../lib/api';
import './DocumentList.css';

export default function DocumentList({ onSelectDocument }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="doc-list-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="doc-list">
      <h3>Recent Documents</h3>
      <div className="doc-grid">
        {documents.slice(0, 6).map((doc) => (
          <button
            key={doc.id}
            className="doc-card"
            onClick={() => onSelectDocument(doc)}
          >
            <svg className="doc-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="doc-name">{doc.fileName}</span>
            <span className="doc-date">
              {new Date(doc.uploadedAt).toLocaleDateString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
