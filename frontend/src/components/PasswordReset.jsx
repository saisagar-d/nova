import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationVerified, setVerificationVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Send verification code when component mounts
    const sendVerification = async () => {
      try {
        const response = await fetch('/send-verification-email/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            email: getUserEmail(),
          }),
          credentials: 'include',
        });
        if (response.ok) {
          setVerificationSent(true);
        } else {
          setErrorMessage('Failed to send verification code.');
        }
      } catch (error) {
        setErrorMessage('Error sending verification code.');
      }
    };

    sendVerification();
  }, []);

  const getUserEmail = () => {
    // Extract user email from cookie or other means if available
    // For demo, assume email is available in a cookie or global state
    // Adjust this function as per your app's auth implementation
    return '';
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!verificationCode) {
      setErrorMessage('Please enter the verification code.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', getUserEmail());
      formData.append('code', verificationCode);

      const response = await fetch('/verify-code/', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        setVerificationVerified(true);
        setSuccessMessage('Verification successful. You can now reset your password.');
      } else {
        setErrorMessage('Invalid verification code.');
      }
    } catch (error) {
      setErrorMessage('An error occurred during verification.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!verificationVerified) {
      setErrorMessage('Please verify your email first.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('new_password', newPassword);
      formData.append('confirm_password', confirmPassword);
      formData.append('verification_code', verificationCode);

      const response = await fetch('/password-reset/', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.redirected) {
        navigate('/chatbot');
      } else {
        const text = await response.text();
        setErrorMessage('Password reset failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Password Reset</h2>
      {!verificationVerified ? (
        <form onSubmit={handleVerifyCode} style={styles.form}>
          <label style={styles.label} htmlFor="verificationCode">Verification Code</label>
          <input
            id="verificationCode"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={!verificationSent}>
            Verify Code
          </button>
          {errorMessage && <div style={styles.error}>{errorMessage}</div>}
          {successMessage && <div style={styles.success}>{successMessage}</div>}
        </form>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={styles.input}
          />
          <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Reset Password</button>
          {errorMessage && <div style={styles.error}>{errorMessage}</div>}
          {successMessage && <div style={styles.success}>{successMessage}</div>}
        </form>
      )}
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
  success: {
    color: '#4CAF50',
    marginTop: '10px',
    fontWeight: 'bold',
  },
};

export default PasswordReset;
