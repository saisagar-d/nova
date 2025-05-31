import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const messageListRef = useRef(null);

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

  // Add auto-scroll effect when messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

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
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <span style={styles.logoText}>NOVA</span>
        </div>
        <div style={styles.sidebarContent}>
          <button 
            style={styles.newChatButton}
            onClick={() => setMessages([])}
          >
            + New Chat
          </button>
        </div>
        {user && (
          <div style={styles.userSection}>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user.username}</div>
            </div>
            <button 
              style={styles.logoutButton}
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <div style={styles.mainContent}>
        <div style={styles.chatContainer}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <h1 style={styles.emptyStateTitle}>How can I help you today?</h1>
              <div style={styles.suggestionGrid}>
                <div style={styles.suggestionCard}>
                  "Tell me about campus events"
                </div>
                <div style={styles.suggestionCard}>
                  "What are the library hours?"
                </div>
                <div style={styles.suggestionCard}>
                  "How do I register for classes?"
                </div>
                <div style={styles.suggestionCard}>
                  "Where can I find academic resources?"
                </div>
              </div>
            </div>
          ) : (
            <div 
              ref={messageListRef}
              style={styles.messageList}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.messageWrapper,
                    ...(msg.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper)
                  }}
                >
                  <div style={{
                    ...styles.messageInner,
                    ...(msg.sender === 'user' ? styles.userMessageInner : styles.botMessageInner)
                  }}>
                    <div style={styles.messageSender}>
                      {msg.sender === 'user' ? 'You' : 'NOVA'}
                    </div>
                    <div style={styles.messageContent}>{msg.text}</div>
                    {msg.extra_data && (
                      <div style={{
                        ...styles.extraInfo,
                        backgroundColor: msg.sender === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                      }}>
                        <ul style={styles.extraInfoList}>
                          {Object.entries(msg.extra_data).map(([key, value]) =>
                            value ? <li key={key}><strong>{key}:</strong> {value}</li> : null
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={styles.loadingWrapper}>
                  <div style={styles.loadingContainer}>
                    <div style={styles.loadingDot}></div>
                    <div style={styles.loadingDot}></div>
                    <div style={styles.loadingDot}></div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div style={styles.inputSection}>
            <div style={styles.inputWrapper}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message NOVA..."
                style={styles.input}
                rows={1}
              />
              <button 
                onClick={sendMessage} 
                style={styles.sendButton}
                disabled={loading || !input.trim()}
              >
                Send
              </button>
            </div>
            <div style={styles.inputDisclaimer}>
              NOVA may produce inaccurate information. Verify important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    backgroundColor: '#ffffff',
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#202123',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
  },
  logo: {
    padding: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '1rem',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #70a1ff, #7bed9f)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sidebarContent: {
    flex: 1,
  },
  newChatButton: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
    },
  },
  userSection: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '1rem 0',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  userName: {
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  logoutButton: {
    width: '100%',
    padding: '0.5rem',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    margin: '0 auto',
    width: '100%',
    position: 'relative',
    height: '100%',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  emptyStateTitle: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  suggestionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    maxWidth: '600px',
    width: '100%',
  },
  suggestionCard: {
    padding: '1rem',
    backgroundColor: '#f7f7f8',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#ececf1',
    },
  },
  messageList: {
    flex: 1,
    overflow: 'auto',
    padding: '1rem',
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '4px',
      '&:hover': {
        background: '#666',
      },
    },
  },
  messageWrapper: {
    width: '100%',
    padding: '0.5rem 0',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  userMessageWrapper: {
    backgroundColor: '#ffffff',
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    // backgroundColor: '#f7f7f8',
    justifyContent: 'flex-start',
  },
  messageInner: {
    width: 'fit-content',
    maxWidth: '70%',
    padding: '0.6rem 1rem',
    borderRadius: '12px',
  },
  userMessageInner: {
    backgroundColor: '#2b5876',
    color: 'white',
  },
  botMessageInner: {
    backgroundColor: '#f0f2f5',
    color: '#000',
  },
  messageSender: {
    fontWeight: '600',
    marginBottom: '0.2rem',
    fontSize: '0.8rem',
  },
  messageContent: {
    fontSize: '0.95rem',
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap',
  },
  loadingWrapper: {
    width: '100%',
    padding: '1rem 0',
    backgroundColor: '#f7f7f8',
  },
  loadingContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    gap: '0.5rem',
  },
  loadingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#666',
    animation: 'bounce 0.5s ease infinite',
  },
  inputSection: {
    borderTop: '1px solid #e5e5e5',
    padding: '1rem',
    backgroundColor: '#ffffff',
  },
  inputWrapper: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    gap: '1rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '8px',
    padding: '0.75rem',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '1rem',
    resize: 'none',
    fontFamily: 'inherit',
    padding: '0',
    '&::placeholder': {
      color: '#999',
    },
  },
  sendButton: {
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#2b5876',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    '&:not(:disabled):hover': {
      backgroundColor: '#1e3f53',
    },
  },
  inputDisclaimer: {
    maxWidth: '800px',
    margin: '0.5rem auto 0',
    fontSize: '0.8rem',
    color: '#666',
    textAlign: 'center',
  },
  extraInfo: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: '6px',
  },
  extraInfoList: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  '@keyframes bounce': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-5px)' },
  },
};

export default Chatbot;
