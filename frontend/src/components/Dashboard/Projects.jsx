import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/getall'); 
      setProjects(res.data);
    } catch (err) {
      setError('Failed to fetch projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const res = await api.post('/projects/insert', { title });
      setProjects([...projects, res.data]);
      setTitle('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="projects-container">
      <h2>Your Projects</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Project title"
          required
        />
        <button type="submit">Create Project</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {projects.map(project => (
          <li key={project._id}>{project.title}</li>
        ))}
      </ul>
    </div>
  );
}
