const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  const { title, description, status, completedAt, project } = req.body;
  try {
    const task = await Task.create({ title, description, status, completedAt, project });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    // Get all projects owned by the logged-in user
    const userProjects = await Project.find({ user: req.user.id }).select('_id');
    const projectIds = userProjects.map(p => p._id);

    // Get all tasks linked to those projects
    const tasks = await Task.find({ project: { $in: projectIds } }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
