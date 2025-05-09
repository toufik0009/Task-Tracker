import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
   const navigate = useNavigate();
  const { user,logout } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({
    userName: "",
    userEmail: "",
    userCountry: "",
  });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    completedAt: "",
  });
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

   const fetchProjects = async () => {
    try {
      const res = await api.get("/projects/getall");
      setProjects(res.data);
      localStorage.setItem("Projects", JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      setError("Failed to load projects.");
    }
  };

   useEffect(() => {

    const cachedProjects = localStorage.getItem("Projects");
    if (cachedProjects) {
      try {
        setProjects(JSON.parse(cachedProjects));
      } catch (e) {
        console.warn("Failed to parse cached projects:", e);
      }
    }

    // Then fetch fresh data from server
    fetchProjects();
  }, []);

  const fetchTasks = async (projId) => {
    try {
      const res = await api.get(`/tasks/${projId}`);
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks.");
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
      if (editingTask) {
        const res = await api.put(`/tasks/${editingTask}`, {
          ...form,
          project: projectId,
        });
        setTasks(tasks.map((t) => (t._id === editingTask ? res.data : t)));
        setEditingTask(null);
      } else {
        const res = await api.post("/tasks/insert", {
          ...form,
          project: projectId,
        });
        setTasks([...tasks, res.data]);
      }
      setForm({
        title: "",
        description: "",
        status: "Pending",
        completedAt: "",
      });
    } catch (err) {
      setError("Failed to save task.");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/projects/insert", { title: projectTitle });
      setProjects([...projects, res.data]);
      setProjectTitle("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project.");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      if (projectId === id) {
        setProjectId("");
        setTasks([]);
      }
    } catch (err) {
      setError("Failed to delete project.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      setError("Failed to delete task.");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task._id);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      completedAt: task.completedAt?.split("T")[0] || "",
    });
  };

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userCountry = localStorage.getItem("userCountry");

    setUserInfo({ userName, userEmail, userCountry });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.dashboard}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.userProfile}>
          <h2 style={styles.userName}>{userInfo.userName}</h2>
          <p style={styles.userEmail}>{userInfo.userEmail}</p>
          <p style={styles.userCountry}>{userInfo.userCountry}</p>
        </div>

        <div style={styles.sidebarSection}>
          <h3 style={styles.sidebarTitle}>Projects</h3>
          <form onSubmit={handleCreateProject} style={styles.projectForm}>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="New project name"
              style={styles.projectInput}
              required
            />
            <button type="submit" style={styles.addButton}>
              +
            </button>
          </form>

          <div style={styles.projectList}>
            {projects.map((p) => (
              <div
                key={p._id}
                style={{
                  ...styles.projectItem,
                  ...(projectId === p._id ? styles.activeProject : {}),
                }}
                onClick={() => {
                  setProjectId(p._id);
                  fetchTasks(p._id);
                }}
              >
                <span>{p.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(p._id);
                  }}
                  style={styles.deleteProjectButton}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
         <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {error && <div style={styles.errorAlert}>{error}</div>}

        {projectId ? (
          <>
            <div style={styles.statsContainer}>
              <div style={styles.statCard}>
                <h3>Total Tasks</h3>
                <p style={styles.statNumber}>{tasks.length}</p>
              </div>
              <div style={styles.statCard}>
                <h3>Completed</h3>
                <p style={styles.statNumber}>
                  {tasks.filter((t) => t.status === "Completed").length}
                </p>
              </div>
              <div style={styles.statCard}>
                <h3>In Progress</h3>
                <p style={styles.statNumber}>
                  {tasks.filter((t) => t.status === "In Progress").length}
                </p>
              </div>
              <div style={styles.statCard}>
                <h3>Pending</h3>
                <p style={styles.statNumber}>
                  {tasks.filter((t) => t.status === "Pending").length}
                </p>
              </div>
            </div>

            <div style={styles.taskSection}>
              <div style={styles.taskFormContainer}>
                <h2 style={styles.sectionTitle}>
                  {editingTask ? "Edit Task" : "Add New Task"}
                </h2>
                <form onSubmit={handleCreateTask} style={styles.taskForm}>
                  <div style={styles.formRow}>
                    <input
                      type="text"
                      name="title"
                      placeholder="Task title"
                      value={form.title}
                      onChange={handleChange}
                      style={styles.taskInput}
                      required
                    />
                  </div>
                  <div style={styles.formRow}>
                    <textarea
                      name="description"
                      placeholder="Task description"
                      value={form.description}
                      onChange={handleChange}
                      style={styles.taskTextarea}
                      required
                    />
                  </div>
                  <div style={styles.formRow}>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      style={styles.taskSelect}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div style={styles.formRow}>
                    <label style={styles.dateLabel}>Completion Date:</label>
                    <input
                      type="date"
                      name="completedAt"
                      value={form.completedAt}
                      onChange={handleChange}
                      style={styles.taskDate}
                    />
                  </div>
                  <button type="submit" style={styles.saveButton}>
                    {editingTask ? "Update Task" : "Add Task"}
                  </button>
                </form>
              </div>

              <div style={styles.taskListContainer}>
                <h2 style={styles.sectionTitle}>Task List</h2>
                <div style={styles.taskList}>
                  {tasks.length === 0 ? (
                    <p style={styles.noTasks}>
                      No tasks found for this project
                    </p>
                  ) : (
                    tasks.map((task) => (
                      <div key={task._id} style={styles.taskCard}>
                        <div style={styles.taskHeader}>
                          <h3 style={styles.taskTitle}>{task.title}</h3>
                          <span
                            style={{
                              ...styles.statusBadge,
                              ...(task.status === "Completed"
                                ? styles.completedBadge
                                : {}),
                              ...(task.status === "In Progress"
                                ? styles.inProgressBadge
                                : {}),
                              ...(task.status === "Pending"
                                ? styles.pendingBadge
                                : {}),
                            }}
                          >
                            {task.status}
                          </span>
                        </div>
                        <p style={styles.taskDescription}>{task.description}</p>
                        {task.completedAt && (
                          <p style={styles.taskDateText}>
                            <strong>Create Date:</strong>{" "}
                            {new Date(task.completedAt).toLocaleDateString()}
                          </p>
                        )}
                        <div style={styles.taskActions}>
                          <button
                            onClick={() => handleEditTask(task)}
                            style={styles.editButton}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            style={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={styles.welcomeMessage}>
            <h2>Welcome to Your Dashboard</h2>
            <p>
              Select a project from the sidebar or create a new one to get
              started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  dashboard: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    padding: "20px",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    // height: "100vh",
  },
  userProfile: {
    paddingBottom: "20px",
    borderBottom: "1px solid #34495e",
    marginBottom: "20px",
  },
  userName: {
    fontSize: "1.5rem",
    margin: "0 0 5px 0",
    color: "#fff",
  },
  userEmail: {
    fontSize: "0.9rem",
    color: "#bdc3c7",
    margin: "0 0 5px 0",
  },
  userCountry: {
    fontSize: "0.9rem",
    color: "#bdc3c7",
    margin: "0",
  },
  sidebarSection: {
    marginBottom: "30px",
  },
  sidebarTitle: {
    fontSize: "1.1rem",
    color: "#ecf0f1",
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "1px solid #34495e",
  },
    logoutButton: {
    backgroundColor: "#d32f2f",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    alignSelf: "center",
    marginTop: "auto",
    width:"100%"
  },
  projectForm: {
    display: "flex",
    marginBottom: "15px",
  },
  projectInput: {
    flex: "1",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px 0 0 4px",
    fontSize: "0.9rem",
  },
  addButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "0 4px 4px 0",
    padding: "0 15px",
    cursor: "pointer",
    fontSize: "1.2rem",
  },
  projectList: {
    maxHeight: "calc(100vh - 300px)",
    overflowY: "auto",
  },
  projectItem: {
    padding: "10px 15px",
    marginBottom: "5px",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#34495e",
    transition: "background-color 0.2s",
  },
  activeProject: {
    backgroundColor: "#3498db",
    fontWeight: "bold",
  },
  deleteProjectButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#e74c3c",
    cursor: "pointer",
    fontSize: "1.2rem",
    padding: "0 5px",
  },
  mainContent: {
    flex: "1",
    padding: "30px",
    overflowY: "auto",
  },
  errorAlert: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "10px 15px",
    borderRadius: "4px",
    marginBottom: "20px",
    border: "1px solid #f5c6cb",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  statNumber: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#3498db",
    margin: "10px 0 0 0",
  },
  taskSection: {
    display: "flex",
    gap: "30px",
  },
  taskFormContainer: {
    flex: "0 0 350px",
  },
  taskListContainer: {
    flex: "1",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    color: "#2c3e50",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "2px solid #3498db",
  },
  taskForm: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    marginBottom: "30px",
    overflowX: "hidden",
  },
  formRow: {
    marginBottom: "15px",
  },
  taskInput: {
    width: "90%",
    padding: "10px 15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  taskTextarea: {
    width: "90%",
    padding: "10px 15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    minHeight: "100px",
    resize: "vertical",
  },
  taskSelect: {
    width: "100%",
    padding: "10px 15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    backgroundColor: "white",
  },
  dateLabel: {
    display: "block",
    marginBottom: "5px",
    fontSize: "0.9rem",
    color: "#7f8c8d",
  },
  taskDate: {
    width: "90%",
    padding: "10px 15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "12px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.2s",
  },
  taskList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  noTasks: {
    textAlign: "center",
    color: "#7f8c8d",
    padding: "20px",
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  taskTitle: {
    margin: "0",
    fontSize: "1.2rem",
    color: "#2c3e50",
  },
  statusBadge: {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  completedBadge: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  inProgressBadge: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  pendingBadge: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  taskDescription: {
    color: "#7f8c8d",
    marginBottom: "15px",
    lineHeight: "1.5",
  },
  taskDateText: {
    fontSize: "0.8rem",
    color: "#95a5a6",
    marginBottom: "15px",
  },
  taskActions: {
    display: "flex",
    gap: "10px",
  },
  editButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 15px",
    fontSize: "0.9rem",
    cursor: "pointer",
    flex: "1",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 15px",
    fontSize: "0.9rem",
    cursor: "pointer",
    flex: "1",
  },
  welcomeMessage: {
    textAlign: "center",
    padding: "50px 20px",
    color: "#7f8c8d",
  },
};
