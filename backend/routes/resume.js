const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

router.get('/', resumeController.getResume);
router.get('/info', resumeController.getResumeInfo);

module.exports = router;