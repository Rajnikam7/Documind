const API_BASE_URL = 'http://localhost:8080';

// service = 'python' | 'node'
export const uploadDocument = async (file, service = 'python') => {
  const formData = new FormData();
  formData.append('file', file);

  const endpoint = service === 'node'
    ? `${API_BASE_URL}/documents/upload/node`
    : `${API_BASE_URL}/documents/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
};

export const getDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/documents`);

  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  return response.json();
};

// service = 'python' | 'node'
export const askQuestion = async (documentId, question, service = 'python') => {
  const endpoint = service === 'node'
    ? `${API_BASE_URL}/documents/${documentId}/ask/node`
    : `${API_BASE_URL}/documents/${documentId}/ask`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error('Failed to get answer');
  }

  return response.json();
};
