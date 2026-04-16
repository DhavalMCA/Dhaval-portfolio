const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { inject } = require('@vercel/analytics');
require('dotenv').config();

const projectsRouter = require('./routes/projects');
const skillsRouter = require('./routes/skills');
const contactRouter = require('./routes/contact');
const resumeRouter = require('./routes/resume');
const { initializeTransporter, verifyTransporter } = require('./controllers/contactController');

// Vercel Analytics
inject();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS - Define allowed origins
const allowedOrigins = [
  'https://dhavalmca.github.io',
  'https://dhaval-portfolio-019o.onrender.com'
];

// Add localhost only in development
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000');
}

// CORS options with function-based origin validation
const corsOptions = {
  origin: (origin, callback) => {
    // Null origin (mobile apps, curl without --origin header):
    // Allow but credentials only for whitelisted origins
    if (!origin) {
      // Allow null-origin requests but they won't get cookie credentials
      callback(null, true);
      return;
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Only applies to requests with valid origin
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/resume', resumeRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Error handler for port already in use
const handleServerError = (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Run: npx kill-port ${PORT}`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
};

app.listen(PORT, '0.0.0.0')
  .on('error', handleServerError)
  .on('listening', () => {
    console.log('Portfolio API running on http://localhost:' + PORT);
    console.log('Environment: ' + (process.env.NODE_ENV || 'development'));

    initializeTransporter();

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      console.log('✅ Email service initialized');

      // Verify SMTP connection (non-blocking, don't crash server on failure)
      verifyTransporter()
        .then((result) => {
          if (result.success) {
            console.log('✅ SMTP connection verified - email ready');
          } else {
            console.error('❌ SMTP verification failed:', result.error);
            console.error('⚠️ Email may not send. Common causes:');
            console.error('   1. Invalid app password');
            console.error('   2. Gmail blocking the sign-in');
            console.error('   3. Check your Gmail for a "Blocked" security alert');
          }
        })
        .catch((err) => {
          console.error('❌ SMTP verify error:', err.message);
        });
    } else {
      console.warn('⚠️ Email service not configured - contact forms will still be received but emails won\'t be sent');
    }
  });

module.exports = app;