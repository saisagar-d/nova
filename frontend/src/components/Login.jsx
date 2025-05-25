import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Call CSRF token endpoint to set CSRF cookie
    fetch('/api/csrf/', {
      method: 'GET',
      credentials: 'include',
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const csrftoken = getCookie('csrftoken');
      const response = await fetch('/login/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrftoken,
        },
        body: formData,
        credentials: 'include', // to include cookies for session
      });

      if (response.redirected) {
        // If backend redirects on successful login
        const redirectedUrl = new URL(response.url);
        if (redirectedUrl.pathname === '/password-reset/') {
          navigate('/password-reset');
        } else if (redirectedUrl.pathname === '/chatbot/') {
          navigate('/chatbot');
        } else {
          // fallback
          navigate('/');
        }
      } else {
        const text = await response.text();
        // Try to extract error message from response HTML or fallback
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const errorElem = doc.querySelector('.error, #error, .error-message');
        if (errorElem) {
          setErrorMessage(errorElem.textContent || 'Login failed.');
        } else {
          setErrorMessage('Invalid email or password.');
        }
      }
    } catch (error) {
      setErrorMessage('An error occurred during login.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login to NOVA</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label} htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. 1DT23CS189@dsatm.edu.in"
          required
          style={styles.input}
        />
        <label style={styles.label} htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
        {errorMessage && <div style={styles.error}>{errorMessage}</div>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    width: '340px',
    margin: 'auto',
    marginTop: '10vh',
    textAlign: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#f3f3f3',
    animation: 'fadeInUp 0.7s',
  },
  title: {
    marginBottom: '20px',
    color: '#a18cd1',
    fontWeight: 700,
    letterSpacing: '1px',
    fontSize: '1.7em',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '10px',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    textAlign: 'left',
    color: '#f3f3f3',
  },
  input: {
    padding: '12px 15px',
    marginBottom: '10px',
    borderRadius: '20px',
    border: '1px solid #444',
    fontSize: '16px',
    background: 'rgba(255,255,255,0.08)',
    color: '#f3f3f3',
    outline: 'none',
    transition: 'border 0.2s, background 0.2s',
  },
  button: {
    padding: '12px 15px',
    borderRadius: '20px',
    background: 'linear-gradient(90deg, #667eea 60%, #764ba2 100%)',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 600,
    marginTop: '10px',
    boxShadow: '0 2px 8px rgba(76, 99, 255, 0.10)',
    transition: 'background 0.3s',
  },
  error: {
    color: '#ff4d4d',
    marginTop: '10px',
    fontWeight: 'bold',
    animation: 'blink 1s infinite',
  },
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes blink': {
    '0%,100%': { opacity: 1 },
    '50%': { opacity: 0.3 },
  },
};

export default Login;
