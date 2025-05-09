const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;
  try {
    const existingProjects = await Project.find({ user: userId });
    if (existingProjects.length >= 4)
      return res.status(403).json({ message: 'Maximum 4 projects allowed' });

    const project = await Project.create({ title, user: userId });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;

  try {
    // Ensure the project belongs to the authenticated user
    const project = await Project.findOne({ _id: projectId, user: userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    await Project.deleteOne({ _id: projectId });
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
