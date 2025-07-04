const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/api/issues', async (req, res) => {
  const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
  const JIRA_PAT = process.env.JIRA_PAT;
  const username = req.query.username;
  const filter = req.query.filter;

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
        fields: 'summary,status',
        maxResults: 40,
      },
      headers: {
        Authorization: `Bearer ${JIRA_PAT}`,
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
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening at http://localhost:${PORT}`);
});
