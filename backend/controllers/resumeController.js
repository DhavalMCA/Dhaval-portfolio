const path = require('path');
const fs = require('fs');

const resumePath = process.env.RESUME_PATH || path.join(__dirname, '../../Dhaval_Prajapati_Resume.pdf');

const getResume = (req, res) => {
  // Check if file exists
  if (!fs.existsSync(resumePath)) {
    return res.status(404).json({
      success: false,
      error: 'Resume file not found'
    });
  }

  // Set headers for PDF download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="Dhaval_Prajapati_Resume.pdf"');
  res.setHeader('Content-Length', fs.statSync(resumePath).size);

  // Send the file
  const fileStream = fs.createReadStream(resumePath);
  fileStream.pipe(res);
};

const getResumeInfo = (req, res) => {
  const resumeFileName = path.basename(resumePath);

  if (!fs.existsSync(resumePath)) {
    return res.status(404).json({
      success: false,
      error: 'Resume file not found'
    });
  }

  const stats = fs.statSync(resumePath);

  res.json({
    success: true,
    data: {
      filename: resumeFileName,
      size: stats.size,
      sizeFormatted: formatBytes(stats.size),
      lastModified: stats.mtime,
      url: '/api/resume'
    }
  });
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = { getResume, getResumeInfo };