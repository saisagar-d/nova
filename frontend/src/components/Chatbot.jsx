import React, { useState, useEffect } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Fetch user info to check if logged in
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user-info/', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };
    fetchUserInfo();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.answer || 'Sorry, no answer.', extra_data: data.extra_data || null };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Error contacting chatbot API.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Helper to get CSRF token from cookies
  const getCookie = (name) => {
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
  };

  return (
    <div style={styles.container}>
      <h1> WELCOME TO NOVA</h1>
      {user && (
        <div style={styles.accountIconContainer}>
          <div style={styles.accountIcon} onClick={() => setShowLogoutConfirm(true)} title={`Logged in as ${user.username}`}>
            &#128100;
          </div>
        </div>
      )}
      <div style={styles.chatBox}>
{messages.map((msg, idx) => (
  <div
    key={idx}
    style={{
      ...styles.message,
      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
      backgroundColor: msg.sender === 'user' ? '#f5f5f5' : 'white',
      color: 'black',
    }}
  >
    {msg.text}
    {msg.extra_data && (
      <div style={styles.extraInfo}>
        <ul>
          {Object.entries(msg.extra_data).map(([key, value]) =>
            value ? <li key={key}><strong>{key}:</strong> {value}</li> : null
          )}
        </ul>
      </div>
    )}
  </div>
))}
        {loading && <div style={styles.loading}>Loading...</div>}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        style={styles.textarea}
      />
      {/* Removed the send button as per request */}
      {/* <button onClick={sendMessage} style={styles.button} disabled={loading}>
        Send
      </button> */}

      {showLogoutConfirm && (
        <div style={styles.logoutConfirmOverlay}>
          <div style={styles.logoutConfirmBox}>
            <p>Are you sure you want to logout?</p>
            <div style={styles.logoutConfirmButtons}>
              <button style={styles.logoutButton} onClick={handleLogout}>Yes</button>
              <button style={styles.cancelButton} onClick={() => setShowLogoutConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: '20px',
    boxSizing: 'border-box',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    color: '#f3f3f3',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    animation: 'fadeInUp 0.7s',
  },
  accountIconContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
  accountIcon: {
    fontSize: '24px',
    cursor: 'pointer',
    userSelect: 'none',
    color: '#a18cd1',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '50%',
    padding: '8px',
    transition: 'background 0.2s',
  },
  chatBox: {
    border: 'none',
    borderRadius: '20px',
    padding: '24px',
    flex: 1,
    width: '80%',
    maxWidth: '600px',
    minHeight: '400px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    background: 'rgba(255,255,255,0.08)',
    color: '#f3f3f3',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)',
    marginBottom: '20px',
    animation: 'fadeInUp 0.7s',
  },
  message: {
    padding: '10px 18px',
    borderRadius: '20px',
    maxWidth: '70%',
    color: '#f3f3f3',
    background: 'linear-gradient(90deg, #667eea 60%, #764ba2 100%)',
    boxShadow: '0 2px 8px rgba(76, 99, 255, 0.10)',
    alignSelf: 'flex-end',
    animation: 'fadeInUp 0.5s',
    transition: 'background 0.3s, color 0.3s',
  },
  loading: {
    fontStyle: 'italic',
    color: '#a18cd1',
    alignSelf: 'center',
    marginTop: '10px',
    animation: 'blink 1s infinite',
  },
  textarea: {
    width: '80%',
    maxWidth: '600px',
    height: '60px',
    marginTop: '10px',
    padding: '12px',
    borderRadius: '15px',
    border: '1px solid #444',
    fontSize: '16px',
    resize: 'none',
    background: 'rgba(255,255,255,0.08)',
    color: '#f3f3f3',
    outline: 'none',
    transition: 'border 0.2s, background 0.2s',
  },
  logoutConfirmOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  logoutConfirmBox: {
    background: 'rgba(255,255,255,0.15)',
    color: '#f3f3f3',
    padding: '24px',
    borderRadius: '16px',
    textAlign: 'center',
    minWidth: '300px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)',
  },
  logoutConfirmButtons: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-around',
    gap: '10px',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  cancelButton: {
    backgroundColor: '#5bc0de',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  extraInfo: {
    marginTop: '10px',
    background: 'rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '12px 16px',
    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.05)',
    fontSize: '14px',
    color: '#f3f3f3',
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

export default Chatbot;
