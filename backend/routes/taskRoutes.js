const express = require('express');
const {
  createTask,
  getAllTasks,
  getProjectTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/insert', auth, createTask);
router.get('/getall', auth, getAllTasks);
router.get('/:projectId', auth, getProjectTasks);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;
