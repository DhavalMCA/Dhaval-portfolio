# Dhaval Portfolio

> AI Based Web Developer Portfolio — Built with Express.js, featuring AI-powered projects, Computer Vision applications, and Full Stack Development.

![Portfolio Status](https://img.shields.io/badge/status-ready%20to%20deploy-brightgreen)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![Express.js](https://img.shields.io/badge/express-4.21.0-blue)

## About

Portfolio of **Dhaval Prajapati** — AI Based Web Developer from Gujarat, India.

- 🔗 **Live Demo**: [https://dhavalmca.github.io](https://dhavalmca.github.io)
- 📧 **Email**: dhavalprajapati4518@gmail.com
- 💻 **GitHub**: [github.com/DhavalMCA](https://github.com/DhavalMCA)
- 💼 **LinkedIn**: [linkedin.com/in/dhaval-prajapati-900b8818b](https://linkedin.com/in/dhaval-prajapati-900b8818b)

## Features

- 🤖 **AI-Powered Projects** — LLM integration via Groq API, ML models with scikit-learn
- 👁️ **Computer Vision** — OpenCV-based attendance & image processing systems
- 🌐 **Full Stack Web Apps** — Express.js backend with RESTful API design
- 🕷️ **Spider-Man Themed UI** — Animated web background, particle effects, custom cursor
- 📱 **Fully Responsive** — Mobile-first design with glass morphism aesthetics
- 📬 **Contact Form** — Email notification system with Nodemailer
- 📄 **Resume Download** — PDF resume served via API endpoint
- 🔒 **Security** — Helmet.js, CORS, rate-limiting, input validation

## Tech Stack

### Backend
- **Express.js** — REST API server
- **Node.js** — Runtime (v18+)
- **Nodemailer** — Email notifications
- **Helmet.js** — Security headers
- **express-rate-limit** — Request rate limiting
- **dotenv** — Environment configuration

### Frontend
- **HTML5 / CSS3 / JavaScript** — Vanilla frontend
- **Google Fonts** — Bebas Neue, Rajdhani, Inter, JetBrains Mono
- **Font Awesome 6.5** — Icons
- **Canvas API** — Animated web background & particles

### AI/ML Stack
- **Groq API** — LLaMA 3.3 70B for NLP tasks
- **scikit-learn** — ML model training
- **OpenCV** — Computer vision applications

## Project Structure

```
Dhaval-portfolio/
├── public/
│   ├── index.html          # Main HTML
│   ├── style.css           # All styles
│   ├── script.js           # All JavaScript
│   └── dhaval.jpeg          # Profile photo
├── backend/
│   ├── server.js           # Express server
│   ├── routes/              # API routes
│   │   ├── projects.js
│   │   ├── skills.js
│   │   ├── contact.js
│   │   └── resume.js
│   ├── controllers/         # Route handlers
│   │   ├── projectsController.js
│   │   ├── skillsController.js
│   │   ├── contactController.js
│   │   └── resumeController.js
│   └── .env                 # Environment variables
├── package.json             # Root scripts
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/projects` | All projects |
| GET | `/api/projects/:id` | Single project |
| GET | `/api/skills` | All skills by category |
| GET | `/api/skills/categories` | Skill categories |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/resume` | Download resume PDF |
| GET | `/api/resume/info` | Resume metadata |

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/DhavalMCA/Dhaval-portfolio.git
cd Dhaval-portfolio

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install
cd ..
```

### Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
RESUME_PATH=./Dhaval_Prajapati_Resume.pdf
```

> **Note:** For Gmail SMTP, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

### Running Locally

```bash
# Start the server (auto-kills port 3000 if occupied)
npm start

# Or for development with auto-reload
cd backend && npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deployment

### Backend (Render / Railway / VPS)

1. Push code to GitHub
2. Connect repository to Render.com or Railway.app
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env`

### Frontend (GitHub Pages / Vercel)

For static deployment without backend:
1. Copy `public/` contents to your static host
2. Note: Contact form will not send emails in static-only mode

Full-stack deployment recommended with:
- **Frontend**: Vercel or Netlify
- **Backend**: Render or Railway

## Projects

| # | Project | Tech | Category |
|---|---------|------|----------|
| 1 | StudentConnect+ | HTML, CSS, JS, PHP, MySQL | Full Stack |
| 2 | AI Workout & Diet Planner | Python, Flask, scikit-learn, Groq | AI/ML |
| 3 | Face Recognition Attendance | Python, Flask, OpenCV, SQLite | Computer Vision |
| 4 | Movie Ticket Booking | PHP, MySQL, HTML, CSS | Full Stack |
| 5 | Car Speed Detector | Arduino, IR Sensors, I2C LCD | Hardware |
| 6 | Guess the Word | HTML, CSS, JavaScript | Game |
| 7 | AI Nutrition Planner | JavaScript, AI API, HTML/CSS | AI/ML |
| 8 | NexLoad | HTML, CSS, JS, Backend | Full Stack |

## Skills

- 🌐 **Frontend** — HTML5, CSS3, JavaScript, Bootstrap, Responsive Design
- ⚙️ **Backend** — PHP, Python, Flask, MySQL, SQLite
- 🤖 **AI** — OpenCV, NumPy, Groq API, LLaMA 3
- 🛠️ **Tools** — Git, GitHub, VS Code, Linux, Canva
- 📢 **Marketing** — SEO, Google Analytics, Meta Ads, Content Strategy

## Education

- 🎓 **MCA** — LJ University, Ahmedabad (Pursuing)
- 🎓 **BCA** — Bholabhai Patel College, KSV University (Completed)

## Contact

Feel free to reach out:
- 📧 Email: dhavalprajapati4518@gmail.com
- 💻 GitHub: [github.com/DhavalMCA](https://github.com/DhavalMCA)
- 💼 LinkedIn: [linkedin.com/in/dhaval-prajapati-900b8818b](https://linkedin.com/in/dhaval-prajapati-900b8818b)

---

> *"With Great Power Comes Great Responsibility" — Uncle Ben*

Built with ❤️ by [Dhaval Prajapati](https://github.com/DhavalMCA)