import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [issues, setIssues] = useState([]);
  const [username, setUsername] = useState('@oakland.k12.mi.us');
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
          className='username-input'
          placeholder='Enter Jira Username'
          style={{
            width: `${Math.max(
              (username || 'Enter Jira Username' || '@oakland.k12.mi.us')
                .length,
              10
            )}ch`,
          }}
        />
        <button onClick={fetchIssues}>Fetch Issues</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {issues.length > 0 ? (
        <table className='issues-table'>
          {issues.map((issue) => (
            <tr key={issue.key}>
              <td>
                <a
                  href={`${baseURL}/browse/${issue.key}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <strong>{issue.key}</strong>
                </a>
              </td>
              <td>{issue.fields.summary}</td>
              <td>
                <em>{issue.fields.status.name}</em>
              </td>
            </tr>
          ))}
        </table>
      ) : (
        !loading && (
          <p>
            <em>No Tickets Found</em>
          </p>
        )
      )}
    </div>
  );
}

export default App;
