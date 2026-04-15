# Dhaval's Portfolio Backend

Node.js/Express REST API for the portfolio with:

- **GET /api/projects** - List all 8 projects
- **GET /api/projects/:id** - Single project
- **GET /api/skills** - All skill categories
- **GET /api/skills/categories** - Skill categories summary
- **POST /api/contact** - Submit contact form
- **GET /api/resume** - Download resume PDF
- **GET /api/resume/info** - Resume metadata
- **GET /api/health** - Health check

## Setup

```bash
cd backend
npm install
npm run dev   # development with nodemon
npm start     # production
```

Server runs on **http://localhost:3000**

## Environment Variables (.env)

```
PORT=3000
NODE_ENV=development
RESUME_PATH=./Dhaval_Prajapati_Resume.pdf
```

Copy `.env.example` to `.env` and configure as needed.