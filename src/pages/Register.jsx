import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Basic Client-side check
    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      return setError("Passwords do not match");
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login after successful registration
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
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
        <p style={styles.subtitle}>Create your secure account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              name="fullName"
              type="text" 
              placeholder="John Doe"
              onChange={handleChange}
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              name="email"
              type="email" 
              placeholder="name@example.com"
              onChange={handleChange}
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number (M-Pesa)</label>
            <input 
              name="phoneNumber"
              type="text" 
              placeholder="254712345678"
              onChange={handleChange}
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••"
              onChange={handleChange}
              required 
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input 
              name="confirmPassword"
              type="password" 
              placeholder="••••••••"
              onChange={handleChange}
              required 
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <span onClick={() => navigate('/login')} style={styles.link}>Login</span>
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
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
    padding: '20px' // Added padding for mobile
  },
  card: { 
    backgroundColor: '#ffffff', 
    padding: '30px 40px', 
    borderRadius: '16px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)', 
    width: '100%', 
    maxWidth: '450px', 
    textAlign: 'center' 
  },
  title: { margin: '0', color: '#2ecc71', fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' },
  subtitle: { color: '#95a5a6', marginBottom: '20px', fontSize: '14px', fontWeight: '500' },
  form: { textAlign: 'left' },
  inputGroup: { marginBottom: '15px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#34495e' },
  input: { 
    width: '100%', 
    padding: '10px 15px', 
    marginTop: '5px', 
    borderRadius: '8px', 
    border: '1px solid #dfe6e9', 
    boxSizing: 'border-box',
    fontSize: '14px',
    outline: 'none'
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
    boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)'
  },
  error: { backgroundColor: '#fadbd8', color: '#c0392b', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' },
  footer: { marginTop: '20px', fontSize: '14px', color: '#7f8c8d' },
  link: { color: '#2ecc71', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }
};

export default Register;