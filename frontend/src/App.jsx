import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Chatbot from './components/Chatbot';
// import PasswordReset from './components/PasswordReset';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatbot" element={<Chatbot />} />
        {/* <Route path="/password-reset" element={<PasswordReset />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
