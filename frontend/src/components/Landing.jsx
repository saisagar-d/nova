import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>CampusBot</h1>
        {/* <nav style={styles.nav}>
          <a href="#home" style={styles.navLink}>Home</a>
          <a href="#about" style={styles.navLink}>About Us</a>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#howtouse" style={styles.navLink}>How To Use</a>
          <a href="#pricing" style={styles.navLink}>Pricing</a>
        </nav> */}
        <button style={styles.tryButton} onClick={handleGetStarted}>
          Try It Now &#9654;
        </button>
      </header>
      <main style={styles.main}>
        <p style={styles.subheading}>Transform Ideas into Reality</p>
        <h1 style={styles.title}>
          Examine the Potential of Genius’s{' '}
          <span style={styles.highlightPink}>Campus </span>
          <span style={styles.highlightPurple}>ChatBot</span>
        </h1>
        {/* Fix: Add a space after the last span to avoid JSX parsing issues */}
        {' '}
        <p style={styles.description}>
        CampusBot is an intelligent assistant designed to enhance student experiences by providing seamless access to campus resources. Whether you need help with academic schedules, event updates, faculty contacts, CampusBot simplifies navigation and streamlines communication.        </p>
        <div style={styles.buttons}>
          <button style={styles.getStartedButton} onClick={handleGetStarted}>
            Get Started &#9654;
          </button>
          <button style={styles.watchVideoButton}>
            &#9654; Watch Video
          </button>
        </div>
        {/* Colored tags with arrows */}
        <div style={{...styles.tag, ...styles.tagSocialMedia}}>Social media <span style={styles.arrowRight}>▶</span></div>
        <div style={{...styles.tag, ...styles.tagChat}}>Chat <span style={styles.arrowRight}>▶</span></div>
        <div style={{...styles.tag, ...styles.tagCoding}}>Coding <span style={styles.arrowRight}>▶</span></div>
        <div style={{...styles.tag, ...styles.tagBlog}}>Blog <span style={styles.arrowRight}>▶</span></div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: 'white',
    background: `
      linear-gradient(135deg, #1a1a2e, #000000),
      radial-gradient(circle 30px at 10% 20%, rgba(255, 110, 161, 0.3), transparent 40%),
      radial-gradient(circle 25px at 80% 30%, rgba(212, 122, 255, 0.3), transparent 40%),
      radial-gradient(circle 35px at 50% 80%, rgba(75, 184, 255, 0.3), transparent 45%),
      radial-gradient(circle 20px at 30% 60%, rgba(255, 110, 161, 0.2), transparent 40%),
      radial-gradient(circle 15px at 70% 70%, rgba(212, 122, 255, 0.2), transparent 40%)
    `,
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='20' cy='20' r='10' fill='%23ff6ea1' fill-opacity='0.1'/%3e%3ccircle cx='80' cy='30' r='8' fill='%23d47aff' fill-opacity='0.1'/%3e%3ccircle cx='50' cy='80' r='12' fill='%234bb8ff' fill-opacity='0.1'/%3e%3ccircle cx='30' cy='60' r='7' fill='%23ffcc00' fill-opacity='0.1'/%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  containerVariation2: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: 'white',
    background: `
      linear-gradient(135deg, #0d0d1a, #000000),
      polygonal-gradient(45deg, #ff6ea1 25%, #d47aff 50%, #4bb8ff 75%, #ffcc00 100%)
    `,
    backgroundImage: `url("data:image/svg+xml,%3csvg width='120' height='120' viewBox='0 0 120 120' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpolygon points='10,10 110,10 110,110 10,110' fill='%23ff6ea1' fill-opacity='0.1'/%3e%3cpolygon points='20,20 100,20 100,100 20,100' fill='%23d47aff' fill-opacity='0.1'/%3e%3cpolygon points='30,30 90,30 90,90 30,90' fill='%234bb8ff' fill-opacity='0.1'/%3e%3cpolygon points='40,40 80,40 80,80 40,80' fill='%23ffcc00' fill-opacity='0.1'/%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  containerVariation3: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: 'white',
    background: `
      linear-gradient(135deg, #1a1a2e, #000000),
      repeating-linear-gradient(45deg, rgba(255, 110, 161, 0.1) 0, rgba(255, 110, 161, 0.1) 10px, transparent 10px, transparent 20px),
      repeating-linear-gradient(-45deg, rgba(212, 122, 255, 0.1) 0, rgba(212, 122, 255, 0.1) 10px, transparent 10px, transparent 20px)
    `,
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='15' cy='15' r='8' fill='%23ff6ea1' fill-opacity='0.1'/%3e%3ccircle cx='85' cy='85' r='8' fill='%23d47aff' fill-opacity='0.1'/%3e%3ccircle cx='50' cy='50' r='10' fill='%234bb8ff' fill-opacity='0.1'/%3e%3c/svg%3e")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '50px 50px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  containerVariation4: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: 'white',
    backgroundColor: '#1a1a2e',
    backgroundImage: `url("data:image/svg+xml,%3csvg width='200' height='200' viewBox='0 0 200 200' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0 100 Q50 0 100 100 T200 100' stroke='%23ff6ea1' stroke-opacity='0.2' stroke-width='10' fill='none'/%3e%3cpath d='M0 120 Q50 20 100 120 T200 120' stroke='%23d47aff' stroke-opacity='0.2' stroke-width='10' fill='none'/%3e%3c/svg%3e")`,
    backgroundRepeat: 'repeat-x',
    backgroundPosition: 'center top',
    backgroundSize: '200px 100px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  containerVariation5: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: 'white',
    background: `
      linear-gradient(135deg, #1a1a2e, #000000),
      repeating-linear-gradient(45deg, rgba(255, 110, 161, 0.3) 0, rgba(255, 110, 161, 0.3) 15px, transparent 15px, transparent 30px),
      repeating-linear-gradient(-45deg, rgba(212, 122, 255, 0.3) 0, rgba(212, 122, 255, 0.3) 15px, transparent 15px, transparent 30px)
    `,
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100' height='100' fill='%23ff6ea1' fill-opacity='0.05'/%3e%3crect x='50' width='50' height='50' fill='%23d47aff' fill-opacity='0.05'/%3e%3crect y='50' width='50' height='50' fill='%234bb8ff' fill-opacity='0.05'/%3e%3crect x='50' y='50' width='50' height='50' fill='%23ffcc00' fill-opacity='0.05'/%3e%3c/svg%3e")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '50px 50px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 40px',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ddd',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    zIndex: 1000,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '24px',
  },
  nav: {
    display: 'flex',
    gap: '24px',
  },
  navLink: {
    textDecoration: 'none',
    color: 'white',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
  },
  tryButton: {
    backgroundColor: '#ff6ea1',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 20px',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  main: {
    flex: 1,
    marginTop: '80px',
    padding: '40px',
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
    position: 'relative',
    color :'black'
    
  },
  subheading: {
    fontSize: '16px',
    color: 'white smoke',
    marginBottom: '12px',
  },
  title: {
    fontSize: '48px',
    fontWeight: '900',
    lineHeight: '1.1',
    marginBottom: '24px',
  },
  highlightPink: {
    color: '#ff6ea1',
  },
  highlightPurple: {
    color: '#d47aff',
  },
  description: {
    fontSize: '16px',
    color: 'black',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '40px',
  },
  buttons: {
    display: 'inline-flex',
    gap: '16px',
    justifyContent: 'center',
  },
  getStartedButton: {
    backgroundColor: '#ff6ea1',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 28px',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
  },
  watchVideoButton: {
    backgroundColor: '#333',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 28px',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
  },
  tag: {
    position: 'absolute',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'default',
  },
  tagSocialMedia: {
    backgroundColor: '#ff6ea1',
    color: '#fff',
    top: '30%',
    left: '5%',
  },
  tagChat: {
    backgroundColor: '#d47aff',
    color: '#fff',
    top: '40%',
    right: '10%',
  },
  tagCoding: {
    backgroundColor: '#4bb8ff',
    color: '#fff',
    bottom: '35%',
    right: '15%',
  },
  tagBlog: {
    backgroundColor: '#ffcc00',
    color: '#000',
    bottom: '30%',
    left: '10%',
  },
  arrowRight: {
    fontSize: '16px',
  },
};

export default Landing;
