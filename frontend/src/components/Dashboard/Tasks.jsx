import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Tasks() {
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Pending',
    completedAt: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/getall');
      setProjects(res.data);
    } catch (err) {
      setError('Failed to load projects');
    }
  };

  const fetchTasks = async (projId) => {
    try {
      const res = await api.get(`/tasks/${projId}`);
      setTasks(res.data);
    } catch (err) {
      setError('Failed to load tasks');
    }
  };

  const handleProjectChange = (e) => {
    const projId = e.target.value;
    setProjectId(projId);
    fetchTasks(projId);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks/insert', { ...form, project: projectId });
      setTasks([...tasks, res.data]);
      setForm({ title: '', description: '', status: 'Pending', completedAt: '' });
    } catch (err) {
      setError('Failed to create task');
    }
  };

  return (
    <div className="tasks-container">
      <h2>Tasks</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>Select Project:</label>
      <select onChange={handleProjectChange} value={projectId}>
        <option value="">-- Select --</option>
        {projects.map(p => (
          <option key={p._id} value={p._id}>{p.title}</option>
        ))}
      </select>

      {projectId && (
        <>
          <form onSubmit={handleCreateTask}>
            <h3>Create Task</h3>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            /><br />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            /><br />
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select><br />
            <label>Completed At (optional):</label>
            <input
              type="date"
              name="completedAt"
              value={form.completedAt}
              onChange={handleChange}
            /><br />
            <button type="submit">Add Task</button>
          </form>

          <h3>Task List</h3>
          <ul>
            {tasks.map(task => (
              <li key={task._id}>
                <strong>{task.title}</strong> - {task.status}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
