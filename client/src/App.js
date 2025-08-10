import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortenedUrl(null);

    if (!longUrl) {
      setError('Please enter a URL to shorten.');
      return;
    }

    const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

    try {
      const response = await axios.post(`${backendUrl}/api/shorten`, {
        longUrl: longUrl,
      });

      // ---- THIS IS THE NEW DEBUGGING LINE ----
      console.log('Backend Response:', response.data); 
      // -----------------------------------------

      const fullShortUrl = `${backendUrl}/${response.data.short_code}`;
      setShortenedUrl(fullShortUrl);
      setLongUrl('');

    } catch (err) {
      setError('An error occurred. Please check the URL and try again.');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>URL Shortener</h1>
        <p>Create a short link from a long URL.</p>
        <form onSubmit={handleSubmit} className="url-form">
          <input
            type="url"
            placeholder="https://example.com/very/long/url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <button type="submit">Shorten</button>
        </form>

        {error && <p className="error">{error}</p>}

        {shortenedUrl && (
          <div className="result">
            <p>Your shortened URL is ready:</p>
            <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
              {shortenedUrl}
            </a>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;