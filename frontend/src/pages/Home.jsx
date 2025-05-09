import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { token } = useContext(AuthContext);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to Task Tracker</h1>
        <p style={styles.subtitle}>Manage your projects and tasks efficiently with our intuitive platform</p>
        
        {token ? (
          <Link to="/dashboard" style={styles.button}>
            Go to Dashboard
            <svg style={styles.buttonIcon} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        ) : (
          <div style={styles.authLinks}>
            <Link to="/login" style={styles.button}>
              <svg style={styles.buttonIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Login
            </Link>
            <Link to="/signup" style={styles.buttonOutline}>
              <svg style={styles.buttonIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Sign Up
            </Link>
          </div>
        )}
      </div>
      
      <div style={styles.features}>
        <div style={styles.featureCard}>
          <svg style={styles.featureIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <h3 style={styles.featureTitle}>Task Management</h3>
          <p style={styles.featureText}>Organize and prioritize your tasks with ease</p>
        </div>
        
        <div style={styles.featureCard}>
          <svg style={styles.featureIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
          <h3 style={styles.featureTitle}>Collaboration</h3>
          <p style={styles.featureText}>Work together with your team seamlessly</p>
        </div>
        
        <div style={styles.featureCard}>
          <svg style={styles.featureIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <h3 style={styles.featureTitle}>Productivity</h3>
          <p style={styles.featureText}>Boost your efficiency with smart tools</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    padding: '0 20px',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#6b7280',
    maxWidth: '700px',
    margin: '0 auto 40px',
    lineHeight: '1.6',
  },
  authLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '30px',
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: '14px 28px',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)',
    ':hover': {
      backgroundColor: '#4338ca',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 8px rgba(79, 70, 229, 0.3)',
    },
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    border: '2px solid #4f46e5',
    color: '#4f46e5',
    padding: '14px 28px',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    ':hover': {
      backgroundColor: '#f5f3ff',
      transform: 'translateY(-2px)',
    },
  },
  buttonIcon: {
    height: '20px',
    width: '20px',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px 80px',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px 30px',
    textAlign: 'center',
    flex: '1',
    minWidth: '280px',
    maxWidth: '350px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
  },
  featureIcon: {
    height: '48px',
    width: '48px',
    color: '#4f46e5',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '12px',
  },
  featureText: {
    fontSize: '1rem',
    color: '#6b7280',
    lineHeight: '1.6',
  },
};