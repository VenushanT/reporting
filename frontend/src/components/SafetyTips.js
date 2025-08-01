import React, { useState } from 'react';
import axios from 'axios';

function SafetyTips() {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAiResponse(null);
    try {
      const res = await axios.post('http://localhost:5000/api/safety-tips/ai', { message: userInput });
      setAiResponse(res.data.response);
    } catch (err) {
      setError('Failed to get safety tip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700 mt-8">
      <h1 className="text-3xl font-bold text-primary-400 mb-4">Safety Tips</h1>
      <ul className="list-disc pl-6 text-gray-200 space-y-2 mb-8">
        <li>Stay aware of your surroundings at all times.</li>
        <li>Report suspicious activity immediately.</li>
        <li>Do not confront suspects; let authorities handle the situation.</li>
        <li>Keep emergency numbers handy.</li>
        <li>Share information anonymously to protect your identity.</li>
        <li>Encourage your community to use this platform for a safer neighborhood.</li>
      </ul>

      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-700 mb-6">
        <label className="block text-lg font-semibold text-primary-400 mb-2">
          Ask for a Medical or Emergency Safety Tip
        </label>
        <textarea
          className="w-full rounded-lg bg-gray-800 text-gray-200 border border-gray-700 p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={3}
          placeholder="Describe your emergency or medical need..."
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors"
          disabled={loading}
        >
          {loading ? 'Getting Tip...' : 'Get Safety Tip'}
        </button>
        {error && <div className="mt-3 text-red-400">{error}</div>}
      </form>

      {aiResponse && (
        <div className="bg-gradient-to-br from-primary-900 via-gray-900 to-gray-800 border border-primary-500 rounded-xl shadow-xl p-6 animate-fade-in mt-4">
          <h2 className="text-xl font-bold text-primary-400 mb-2 flex items-center">
            <svg className="h-6 w-6 mr-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
            AI Safety Tip
          </h2>
          <p className="text-gray-100 text-lg leading-relaxed whitespace-pre-line">
            {aiResponse}
          </p>
        </div>
      )}
    </div>
  );
}

export default SafetyTips; 