const express = require('express');
const { createProject, getUserProjects, deleteProject } = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/insert', auth, createProject);
router.get('/getall', auth, getUserProjects);
router.delete('/:id', auth, deleteProject); 

module.exports = router;
