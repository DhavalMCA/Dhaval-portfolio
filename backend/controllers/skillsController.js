const skills = {
  frontend: {
    name: 'Frontend',
    icon: '🌐',
    items: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Responsive Design']
  },
  backend: {
    name: 'Backend',
    icon: '⚙️',
    items: ['PHP', 'Python', 'Flask', 'MySQL', 'SQLite']
  },
  ai: {
    name: 'AI / ML',
    icon: '🤖',
    items: ['scikit-learn', 'OpenCV', 'NumPy', 'Groq API', 'LLaMA 3']
  },
  iot: {
    name: 'IoT',
    icon: '📡',
    items: ['Arduino', 'IR Sensors', 'LCD Display', 'I2C Module']
  },
  tools: {
    name: 'Tools',
    icon: '🛠️',
    items: ['Git', 'GitHub', 'VS Code', 'Linux', 'Canva']
  },
  marketing: {
    name: 'Digital',
    icon: '📢',
    items: ['SEO', 'Google Analytics', 'Meta Ads', 'Content Strategy', 'Social Media Marketing', 'Email Marketing', 'Copywriting', 'Canva']
  }
};

const getAllSkills = (req, res) => {
  res.json({
    success: true,
    data: skills
  });
};

const getCategories = (req, res) => {
  const categories = Object.keys(skills).map(key => ({
    id: key,
    name: skills[key].name,
    icon: skills[key].icon,
    count: skills[key].items.length
  }));
  res.json({
    success: true,
    count: categories.length,
    data: categories
  });
};

module.exports = { getAllSkills, getCategories };