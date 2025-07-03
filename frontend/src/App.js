import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [issues, setIssues] = useState([]);
  const [username, setUsername] = useState('@oakland.k12.mi.us');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [baseURL, setBaseURL] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('open-tickets');

  const fetchIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/api/issues?username=${username}&filter=${selectedFilter}`
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
    if (username) {
      fetchIssues();
    }
  }, [selectedFilter]);

  return (
    <div className='App'>
      <div className='filter-container'>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className='filter-dropdown'
        >
          <option value='open-tickets'>Open Tickets</option>
          <option value='recently-closed'>Recently Closed</option>
          <option value='sla-breached'>SLA Breached</option>
        </select>
      </div>

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
        <button onClick={fetchIssues}>Fetch Tickets</button>
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
