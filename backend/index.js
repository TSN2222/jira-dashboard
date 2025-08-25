const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post('/api/issues', async (req, res) => {
  const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
  const { username, filter, pat } = req.body;

  // Validate required fields
  if (!username || !pat) {
    return res.status(400).json({
      error: 'API Key is required',
    });
  }

  let jql = `assignee = "${username}" `;

  switch (filter) {
    case 'open-tickets':
      jql += 'AND status NOT IN (Resolved, Done, Cancelled)';
      break;
    case 'recently-closed':
      jql += 'AND resolutiondate >= -5d';
      break;
    case 'sla-breached':
      jql +=
        'AND status NOT IN (Resolved, Done, Cancelled) AND ("Time to first response" = breached() OR "Time to resolution" = breached())';
      break;
    case 'needs-update':
      jql +=
        'AND status NOT IN (Resolved, Done, Cancelled) AND updatedDate <= startOfDay()';
      break;
    default:
  }

  jql += ' ORDER BY created DESC';

  try {
    const response = await axios.get(`${JIRA_BASE_URL}/rest/api/2/search`, {
      params: {
        jql: jql,
        fields: 'summary,status,reporter',
        maxResults: 40,
      },
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: 'application/json',
      },
    });

    res.json({
      issues: response.data.issues,
      baseURL: process.env.JIRA_BASE_URL,
    });
  } catch (error) {
    console.error(
      'Error fetching issues:',
      error.response?.data || error.message
    );

    // Provide more specific error messages
    if (error.response?.status === 401) {
      res.status(401).json({ error: 'Invalid API Key' });
    } else if (error.response?.status === 403) {
      res.status(403).json({ error: 'Access denied. Check your permissions.' });
    } else {
      res.status(500).json({ error: 'Failed to fetch issues' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening at http://localhost:${PORT}`);
});
