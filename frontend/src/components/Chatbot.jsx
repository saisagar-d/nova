import React, { useState, useEffect } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    setIsFirstVisit(!hasVisited);
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
    }

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

  const getGreeting = () => {
    if (isFirstVisit) {
      return (
        <div style={styles.greeting}>
          <span style={styles.greetingName}>NOVA</span>
          <p style={styles.greetingSubtext}>Your Campus AI Assistant</p>
        </div>
      );
    }
    return null;
  };

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
      <div style={styles.content}>
        {getGreeting()}
        <div style={styles.chatContainer}>
          <div style={styles.chatBox}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.message,
                  ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage)
                }}
              >
                <div style={styles.messageContent}>{msg.text}</div>
                {msg.extra_data && (
                  <div style={styles.extraInfo}>
                    <ul style={styles.extraInfoList}>
                      {Object.entries(msg.extra_data).map(([key, value]) =>
                        value ? <li key={key}><strong>{key}:</strong> {value}</li> : null
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {loading && <div style={styles.loadingContainer}>
              <div style={styles.loadingDot}></div>
              <div style={styles.loadingDot}></div>
              <div style={styles.loadingDot}></div>
            </div>}
          </div>
          <div style={styles.inputContainer}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask NOVA anything..."
              style={styles.input}
              rows={1}
            />
            <button 
              onClick={sendMessage} 
              style={styles.sendButton}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#f8f9fd',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
  },
  content: {
    width: '100%',
    maxWidth: '700px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  greeting: {
    textAlign: 'center',
    marginBottom: '2rem',
    animation: 'fadeIn 0.5s ease-in',
  },
  greetingName: {
    fontSize: '3.5rem',
    background: 'linear-gradient(45deg, #2b5876, #4e4376)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
  },
  greetingSubtext: {
    fontSize: '1.2rem',
    color: '#666',
    marginTop: '0.5rem',
  },
  chatContainer: {
    flex: 1,
    width: '100%',
    // maxWidth: '650px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    background: 'transparent',
    padding: '1rem',
  },
  chatBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minHeight: '500px',
    maxHeight: '600px',
    overflowY: 'auto',
    scrollBehavior: 'smooth',
    padding: '0.5rem',
    msOverflowStyle: 'none', /* IE and Edge */
    scrollbarWidth: 'none', /* Firefox */
    '&::-webkit-scrollbar': {
      display: 'none', /* Chrome, Safari and Opera */
    },
  },
  message: {
    maxWidth: '80%',
    padding: '1rem',
    borderRadius: '15px',
    fontSize: '1rem',
    animation: 'slideIn 0.3s ease-out',
  },
  messageContent: {
    lineHeight: '1.5',
  },
  userMessage: {
    alignSelf: 'flex-end',
    background: 'linear-gradient(45deg, #2b5876, #4e4376)',
    color: 'white',
    boxShadow: 'none',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f2f5',
    color: '#202124',
    boxShadow: 'none',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderTop: '1px solid rgba(0,0,0,0.05)',
    marginTop: '1rem',
  },
  input: {
    flex: 1,
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    border: '2px solid #eef0f7',
    fontSize: '1rem',
    resize: 'none',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    fontFamily: 'inherit',
    backgroundColor: '#f8f9fd',
    '&:focus': {
      borderColor: '#2b5876',
    },
  },
  sendButton: {
    padding: '0.8rem 2rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(45deg, #2b5876, #4e4376)',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
    boxShadow: '0 4px 15px rgba(43, 88, 118, 0.2)',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
  },
  loadingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#2b5876',
    animation: 'bounce 0.5s ease infinite',
    '&:nth-child(2)': {
      animationDelay: '0.1s',
    },
    '&:nth-child(3)': {
      animationDelay: '0.2s',
    },
  },
  extraInfo: {
    marginTop: '0.8rem',
    fontSize: '0.9rem',
    opacity: 0.9,
  },
  extraInfoList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes slideIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes bounce': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-5px)' },
  },
};

export default Chatbot;
