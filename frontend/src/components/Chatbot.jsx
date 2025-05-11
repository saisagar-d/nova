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
    background: 'white',
    borderRadius: '0',
    boxShadow: 'none',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
  },
  chatBox: {
    border: 'none',
    borderRadius: '0',
    padding: '0',
    flex: 1,
    width: '80%',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'none', /* Firefox */
    msOverflowStyle: 'none', /* IE 10+ */
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: 'white',
    color: 'black',
    /* Hide scrollbar for Chrome, Safari and Opera */
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  message: {
    padding: '8px 16px',
    borderRadius: '20px',
    maxWidth: '70%',
    color: 'black',
  },
  loading: {
    fontStyle: 'italic',
    color: '#888',
  },
  textarea: {
    width: '80%',
    height: '70px',
    marginTop: '10px',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '16px',
    resize: 'none',
  },
  button: {
    marginTop: '10px',
    padding: '12px 20px',
    borderRadius: '20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
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
  },
  logoutConfirmBox: {
    backgroundColor: 'white',
    color: 'black',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    minWidth: '300px',
  },
  logoutConfirmButtons: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-around',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#5bc0de',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  extraInfo: {
    marginTop: '10px',
    backgroundColor: 'whitesmoke',
    borderRadius: '12px',
    padding: '12px 16px',
    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.05)',
    fontSize: '14px',
    color: 'black',
  },
};

export default Chatbot;
