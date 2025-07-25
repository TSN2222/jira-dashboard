# Jira Web Application

A full-stack web application for interfacing with Jira Server, built to demonstrate web development skills for an internal Junior Programmer opportunity.

## 🚀 Live Demo

Visit the application at: [jira.tsn2222.lol](https://jira.tsn2222.lol) _(Availability may vary; hosted on a local device)_

## 📋 Project Overview

This project demonstrates proficiency in full-stack development, containerization, and deployment practices. It provides a clean interface for viewing and managing Jira issues assigned to specific users.

### Learning Objectives

- Node.js
- Express.js
- React.js
- REST API
- Axios
- CORS
- dotenv
- Docker
- Nginx (as a reverse proxy)
- Raspberry Pi (for hosting)

## 🛠 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Axios** - HTTP client for API requests
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend

- **React** - UI framework

### Infrastructure

- **Docker** - Containerization
- **Nginx** - Web server and reverse proxy
- **Raspberry Pi** - Deployment platform
- **Custom Domain** - Production hosting

### External APIs

- **Jira Server REST API** - Issue management system integration

## 🏗 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│                 │    │                  │    │                 │
│ React Frontend  │◄──►│  Express Backend │◄──►│   Jira Server   │
│  (Port 3000)    │    │    (Port 3001)   │    │    REST API     │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         └───────────┬────────────┘
                     │
           ┌─────────▼──────────┐
           │                    │
           │    Nginx Reverse   │
           │   Proxy (Port 80)  │
           │                    │
           └────────────────────┘
```

## 🔒 Security Considerations

- Personal Access Tokens are stored in environment variables
- Environment files excluded from version control
- Bearer token authentication for Jira API requests

## 🚀 Deployment on Raspberry Pi

The application is containerized and deployed on a Raspberry Pi using:

- Docker containers for both frontend and backend
- Nginx as a reverse proxy
- Custom domain configuration
- SSL/TLS termination

## 📝 Environment Variables

| Variable        | Description                    | Example                    |
| --------------- | ------------------------------ | -------------------------- |
| `JIRA_BASE_URL` | Base URL of your Jira instance | `https://jira.company.com` |
| `JIRA_PAT`      | Personal Access Token for Jira | `Bearer token string`      |
| `PORT`          | Backend server port            | `3001`                     |

## 🤝 Contributing

This is a learning project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📚 Learning Resources

This project was built while learning:

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Docker Documentation](https://docs.docker.com/)
- [Jira REST API Documentation](https://developer.atlassian.com/server/jira/platform/rest-apis/)

## 👨‍💻 Author

Built by Nick Daniel as a portfolio project demonstrating full-stack development skills for junior programming positions.

---

_This project showcases practical experience with modern web development tools, API integration, containerization, and deployment practices._
