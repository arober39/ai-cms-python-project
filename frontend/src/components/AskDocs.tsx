import React, { useState } from 'react';
import axios from '../api/axios';

const AskDocs: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer('');

    try {
      const res = await axios.post('/answer-docs', { question });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error('Error fetching AI answer:', err);
      setAnswer('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ask the AI</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about the documentation..."
        className="w-full p-3 border rounded mb-4"
        rows={4}
      />
      <button
        onClick={handleAsk}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Thinking...' : 'Ask'}
      </button>

      {answer && (
        <div className="mt-6 p-4 border bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">AI Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AskDocs;
