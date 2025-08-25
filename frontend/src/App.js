import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [issues, setIssues] = useState([]);
  const [username, setUsername] = useState('@oakland.k12.mi.us');
  const [pat, setPat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [baseURL, setBaseURL] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('open-tickets');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPat, setShowPat] = useState(false);

  const filterLabels = {
    'open-tickets': 'Open Tickets',
    'recently-closed': 'Recently Closed',
    'sla-breached': 'SLA Breached',
    'needs-update': 'Daily Check-in Due',
  };

  const fetchIssues = async () => {
    if (!username.trim() || !pat.trim()) {
      setError('Please Enter Your API Key');
      setIssues([]); // Clear existing issues
      return;
    }

    setLoading(true);
    setError(null);
    setIssues([]); // Clear existing issues when starting new fetch

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          filter: selectedFilter,
          pat: pat,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch issues');
      }

      setIssues(data.issues || []);
      setBaseURL(data.baseURL);
    } catch (err) {
      setError(err.message || 'Unknown error');
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username && pat) {
      fetchIssues();
    }
  }, [selectedFilter]);

  // Clear issues when PAT is removed
  useEffect(() => {
    if (!pat.trim()) {
      setIssues([]);
      setError(null);
    }
  }, [pat]);

  return (
    <div className='App'>
      {dropdownOpen && (
        <div className='overlay' onClick={() => setDropdownOpen(false)} />
      )}
      <div className='dropdown'>
        <button
          className='dropdown-button'
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          ▼ {filterLabels[selectedFilter]} ▼
        </button>
        {dropdownOpen && (
          <ul className='dropdown-menu'>
            {Object.entries(filterLabels).map(([key, label]) => (
              <li
                key={key}
                className={`dropdown-item ${
                  key === selectedFilter ? 'selected' : ''
                }`}
                onClick={() => {
                  setSelectedFilter(key);
                  setDropdownOpen(false);
                }}
              >
                {label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='input-section'>
        <div style={{ position: 'relative', margin: '0 0 30px 0' }}>
          <input
            type={showPat ? 'text' : 'password'}
            value={pat}
            onChange={(e) => setPat(e.target.value)}
            className='pat-input'
            placeholder='Enter API Key'
            style={{
              width: `${Math.max((pat || 'Enter API Key').length)}ch`,
            }}
          />
          <button
            type='button'
            onClick={() => setShowPat(!showPat)}
            className='show-pat'
          >
            {showPat ? '👁️' : '👁️‍🗨️'}
          </button>
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
                (username || 'Enter Jira Username').length,
                15
              )}ch`,
            }}
          />
        </div>
        <button onClick={fetchIssues} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Tickets'}
        </button>
      </div>

      {error && <p style={{ color: 'red', margin: '25px 0 0 0' }}>{error}</p>}

      {issues.length > 0 ? (
        <table className='issues-table'>
          <tbody>
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
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(
                        issue.fields.reporter.emailAddress
                      );
                    }}
                    title='Click To Copy Email'
                    className='copy-email'
                  >
                    {issue.fields.reporter.displayName}
                  </a>
                </td>
                <td>
                  <em>{issue.fields.status.name}</em>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading &&
        pat &&
        username && (
          <p>
            <em>No Tickets Found</em>
          </p>
        )
      )}
    </div>
  );
}

export default App;
