import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add fade-in animation to elements when component mounts
    const elements = document.querySelectorAll('.animate-fade-in');
    elements.forEach((element, index) => {
      element.style.animation = `fadeIn 0.8s ease-out ${index * 0.2}s forwards`;
      element.style.opacity = '0';
    });
  }, []);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundAnimation}></div>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo} className="animate-fade-in">NOVA</h1>
        </div>
        <nav style={styles.nav} className="animate-fade-in">
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#resources" style={styles.navLink}>Resources</a>
          <a href="#contact" style={styles.navLink}>Contact</a>
        </nav>
        <div style={styles.headerRight}>
          <button style={styles.loginButton} className="animate-fade-in" onClick={handleGetStarted}>
            Log in
          </button>
          <button style={styles.tryButton} className="animate-fade-in" onClick={handleGetStarted}>
            Get Started →
          </button>
        </div>
      </header>
      <main style={styles.main}>
        <div style={styles.heroSection}>
          <p style={styles.subheading} className="animate-fade-in">Your Campus AI Assistant</p>
          <h1 style={styles.title} className="animate-fade-in">
            Experience the Future of
            <span style={styles.gradientText}> Campus Assistance</span>
          </h1>
          <p style={styles.description} className="animate-fade-in">
            NOVA is your intelligent campus companion, providing instant answers to your questions, 
            helping you navigate campus resources, and ensuring you never miss important information.
          </p>
          <div style={styles.buttons} className="animate-fade-in">
            <button style={styles.getStartedButton} onClick={handleGetStarted}>
              Start Exploring →
            </button>
            <button style={styles.learnMoreButton}>
              Learn More
            </button>
          </div>
        </div>
        
        <div style={styles.featuresGrid} className="animate-fade-in">
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎓</div>
            <h3 style={styles.featureTitle}>Academic Support</h3>
            <p style={styles.featureDescription}>Get instant answers about courses, schedules, and academic resources</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📅</div>
            <h3 style={styles.featureTitle}>Event Updates</h3>
            <p style={styles.featureDescription}>Stay informed about campus events, workshops, and activities</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📚</div>
            <h3 style={styles.featureTitle}>Library Services</h3>
            <p style={styles.featureDescription}>Access information about library hours, resources, and study spaces</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💡</div>
            <h3 style={styles.featureTitle}>Smart Assistance</h3>
            <p style={styles.featureDescription}>24/7 intelligent support for all your campus-related queries</p>
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 20%, rgba(76, 0, 255, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(255, 0, 128, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(0, 128, 255, 0.15) 0%, transparent 50%)
    `,
    animation: 'backgroundFloat 20s ease-in-out infinite',
    zIndex: 0,
  },
  header: {
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    position: 'relative',
    zIndex: 1,
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    fontSize: '28px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #4c00ff, #ff0080)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-1px',
  },
  nav: {
    display: 'flex',
    gap: '32px',
    margin: '0 20px',
  },
  navLink: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    letterSpacing: '0.3px',
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  loginButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500',
    padding: '8px 16px',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  tryButton: {
    backgroundColor: 'rgba(76, 0, 255, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '10px 20px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    '&:hover': {
      backgroundColor: 'rgba(76, 0, 255, 1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(76, 0, 255, 0.3)',
    },
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    position: 'relative',
    zIndex: 1,
  },
  heroSection: {
    textAlign: 'center',
    marginTop: '60px',
    marginBottom: '80px',
  },
  subheading: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '20px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '64px',
    fontWeight: '800',
    lineHeight: '1.1',
    marginBottom: '30px',
    letterSpacing: '-2px',
  },
  gradientText: {
    background: 'linear-gradient(135deg, #4c00ff, #ff0080)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  description: {
    fontSize: '20px',
    color: 'rgba(255, 255, 255, 0.7)',
    maxWidth: '700px',
    margin: '0 auto 40px',
    lineHeight: '1.6',
  },
  buttons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  },
  getStartedButton: {
    backgroundColor: '#4c00ff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px rgba(76, 0, 255, 0.3)',
    },
  },
  learnMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '16px 32px',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transform: 'translateY(-2px)',
    },
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginTop: '80px',
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    padding: '30px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      transform: 'translateY(-5px)',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
  },
  featureIcon: {
    fontSize: '40px',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '15px',
    background: 'linear-gradient(135deg, #4c00ff, #ff0080)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  featureDescription: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes backgroundFloat': {
    '0%, 100%': {
      transform: 'translate(0, 0)',
    },
    '33%': {
      transform: 'translate(2%, 2%)',
    },
    '66%': {
      transform: 'translate(-2%, -2%)',
    },
  },
};

export default Landing;
