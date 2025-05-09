import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <h1 style={styles.title}><Link to="/" style={styles.link}>Task Tracker</Link></h1>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/projects" style={styles.link}>Projects</Link>
            <Link to="/tasks" style={styles.link}>Tasks</Link>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: '10px 20px',
    color: 'white',
  },
  title: {
    margin: 0,
  },
  links: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  button: {
    backgroundColor: '#ef4444',
    border: 'none',
    color: 'white',
    padding: '6px 12px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};
