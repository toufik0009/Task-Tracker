import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/users/register', { 
        email, 
        password, 
        name, 
        country 
      });
      
      if (response.data) {
        navigate('/login', { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Your Account</h1>
          <p style={styles.subtitle}>Join us to start managing your tasks</p>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <svg style={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Full Name</label>
            <div style={styles.inputContainer}>
              <svg style={styles.inputIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <div style={styles.inputContainer}>
              <svg style={styles.inputIcon} viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={styles.inputContainer}>
              <svg style={styles.inputIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="country" style={styles.label}>Country</label>
            <div style={styles.inputContainer}>
              <svg style={styles.inputIcon} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                style={styles.input}
                placeholder="Your country"
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={isLoading ? {...styles.button, ...styles.buttonLoading} : styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg style={styles.spinner} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                Creating account...
              </>
            ) : 'Sign Up'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>Already have an account? <Link to="/login" style={styles.footerLink}>Log in</Link></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '440px',
    padding: '40px',
    textAlign: 'center',
    animation: 'fadeIn 0.5s ease-out',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#718096',
    marginBottom: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4a5568',
    marginBottom: '8px',
  },
  inputContainer: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    height: '20px',
    width: '20px',
    color: '#a0aec0',
    zIndex: '1',
  },
  input: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    fontSize: '15px',
    color: '#1a202c',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    ':focus': {
      outline: 'none',
      borderColor: '#667eea',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    },
  },
  button: {
    padding: '14px',
    backgroundColor: '#667eea',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    ':hover': {
      backgroundColor: '#5a67d8',
      transform: 'translateY(-1px)',
    },
    ':active': {
      transform: 'translateY(0)',
    },
  },
  buttonLoading: {
    backgroundColor: '#a3bffa',
    cursor: 'not-allowed',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
    height: '20px',
    width: '20px',
    color: 'white',
  },
  footer: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0',
  },
  footerText: {
    fontSize: '14px',
    color: '#718096',
    margin: '0',
  },
  footerLink: {
    color: '#667eea',
    fontWeight: '500',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'left',
  },
  errorIcon: {
    height: '20px',
    width: '20px',
    marginRight: '10px',
    flexShrink: '0',
  },
  errorText: {
    fontSize: '14px',
    fontWeight: '500',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  '@keyframes fadeIn': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
};