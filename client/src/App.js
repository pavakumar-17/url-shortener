import React, { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setShortUrl("");

    try {
      const res = await fetch("http://localhost:5050/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl: url }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please check the URL and try again.");
    }
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <p>Create a short link from a long URL.</p>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter long URL"
      />
      <button onClick={handleSubmit}>Shorten</button>

      {error && <p className="error">{error}</p>}
      {shortUrl && (
        <p>
          Short URL:{" "}
          <a href={shortUrl} target="_blank" rel="noreferrer">
            {shortUrl}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;

