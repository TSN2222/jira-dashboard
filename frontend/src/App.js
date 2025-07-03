import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [issues, setIssues] = useState([]);
  const [username, setUsername] = useState('nicholas.daniel@oakland.k12.mi.us');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [baseURL, setBaseURL] = useState('');

  const fetchIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/api/issues?username=${username}`
      );
      if (!response.ok) throw new Error('Failed to fetch issues');
      const data = await response.json();
      setIssues(data.issues || data);
      setBaseURL(data.baseURL);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <div className='App'>
      <h1>Jira Issue Dashboard</h1>

      <div>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Enter Jira username'
        />
        <button onClick={fetchIssues}>Fetch Issues</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {issues.map((issue) => (
          <li key={issue.key}>
            <a
              href={`${baseURL}/browse/${issue.key}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <strong>{issue.key}</strong>
            </a>
            : {issue.fields.summary} — <em>{issue.fields.status.name}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
