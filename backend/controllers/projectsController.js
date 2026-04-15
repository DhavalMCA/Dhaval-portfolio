const projects = [
  {
    id: 1,
    title: 'StudentConnect+',
    icon: '🎓',
    description: 'AI-powered collaborative learning platform — study rooms, Kanban board, video sharing & real-time chat.',
    stack: ['HTML', 'CSS', 'JS', 'PHP', 'MySQL'],
    github: 'https://github.com/DhavalMCA',
    featured: false,
    category: 'fullstack'
  },
  {
    id: 2,
    title: 'AI Workout & Diet Planner',
    icon: '🤖',
    description: 'ML-based 7-day Indian diet & workout scheduler using LLaMA 3.3 70B via Groq API with personalization.',
    stack: ['Python', 'Flask', 'scikit-learn', 'Groq'],
    github: 'https://github.com/DhavalMCA',
    featured: false,
    category: 'ai'
  },
  {
    id: 3,
    title: 'Face Recognition Attendance',
    icon: '📸',
    description: 'Few-Shot Learning webcam attendance system — auto-marks database records with real-time detection.',
    stack: ['Python', 'Flask', 'OpenCV', 'SQLite'],
    github: 'https://github.com/DhavalMCA',
    featured: false,
    category: 'ai'
  },
  {
    id: 4,
    title: 'Movie Ticket Booking',
    icon: '🎬',
    description: 'Full-stack booking app with seat selection, PDF tickets, age verification, payment & admin panel.',
    stack: ['PHP', 'MySQL', 'HTML', 'CSS'],
    github: 'https://github.com/DhavalMCA',
    featured: false,
    category: 'fullstack'
  },
  {
    id: 5,
    title: 'Car Speed Detector',
    icon: '🚗',
    description: 'Arduino IoT speed detection via dual IR sensors & LCD display — real-time measurement with alerts.',
    stack: ['Arduino', 'IR Sensors', 'I2C LCD'],
    github: 'https://github.com/DhavalMCA',
    featured: false,
    category: 'iot'
  },
  {
    id: 6,
    title: 'Guess the Word',
    icon: '🟩',
    description: "Wordle-inspired word game — 6×5 grid, color-coded feedback & on-screen keyboard. Live Demo Available!",
    stack: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/DhavalMCA',
    liveDemo: 'https://dhavalmca.github.io/Guess-the-Word-Game/',
    featured: true,
    category: 'game'
  },
  {
    id: 7,
    title: 'AI Nutrition Planner',
    icon: '🍽️',
    description: 'Personalized 7-day Indian meal plans — calculates BMI, BMR, TDEE from user inputs via AI API.',
    stack: ['JavaScript', 'AI API', 'HTML/CSS'],
    github: 'https://github.com/DhavalMCA',
    featured: false,
    category: 'ai'
  },
  {
    id: 8,
    title: 'NexLoad',
    icon: '⬇️',
    description: 'Full-stack YouTube & Instagram video downloader with a modern responsive UI and multi-format support.',
    stack: ['HTML', 'CSS', 'JS', 'Backend'],
    github: 'https://github.com/DhavalMCA',
    featured: false,
    category: 'fullstack'
  }
];

const getAllProjects = (req, res) => {
  res.json({
    success: true,
    count: projects.length,
    data: projects
  });
};

const getProjectById = (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }
  res.json({ success: true, data: project });
};

module.exports = { getAllProjects, getProjectById };