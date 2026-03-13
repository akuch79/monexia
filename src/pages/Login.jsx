import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard'); 
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server is offline. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>StoreWallet</h2>
        <p style={styles.subtitle}>Secure Payment Gateway</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <span onClick={() => navigate('/register')} style={styles.link}>Register</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    // UPDATED: Modern dark gradient background
    background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
    backgroundSize: '400% 400%',
    animation: 'gradientBG 15s ease infinite',
  },
  card: { 
    backgroundColor: '#ffffff', 
    padding: '40px', 
    borderRadius: '16px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)', 
    width: '100%', 
    maxWidth: '400px', 
    textAlign: 'center' 
  },
  title: { margin: '0', color: '#2ecc71', fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' },
  subtitle: { color: '#95a5a6', marginBottom: '30px', fontSize: '14px', fontWeight: '500' },
  form: { textAlign: 'left' },
  inputGroup: { marginBottom: '20px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#34495e', marginLeft: '2px' },
  input: { 
    width: '100%', 
    padding: '12px 15px', 
    marginTop: '6px', 
    borderRadius: '8px', 
    border: '1px solid #dfe6e9', 
    boxSizing: 'border-box',
    fontSize: '15px',
    outline: 'none',
    transition: 'border 0.3s'
  },
  button: { 
    width: '100%', 
    padding: '14px', 
    backgroundColor: '#2ecc71', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontSize: '16px', 
    fontWeight: 'bold', 
    marginTop: '10px',
    transition: 'background 0.3s',
    boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)'
  },
  error: { backgroundColor: '#fadbd8', color: '#c0392b', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', fontWeight: '500' },
  footer: { marginTop: '25px', fontSize: '14px', color: '#7f8c8d' },
  link: { color: '#2ecc71', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }
};

export default Login;