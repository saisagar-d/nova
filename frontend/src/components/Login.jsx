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
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    width: '320px',
    margin: 'auto',
    marginTop: '10vh',
    textAlign: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: 'black',
  },
  title: {
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    textAlign: 'left',
  },
  input: {
    padding: '12px 15px',
    marginBottom: '15px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '12px 15px',
    borderRadius: '20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
  },
  error: {
    color: '#ff4d4d',
    marginTop: '10px',
    fontWeight: 'bold',
  },
};

export default Login;
