import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Projects from './Projects';
import Report from './Report';
import Register from './Register'; // Import Register component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/register" element={<Register />} /> {/* Route for Register component */}
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
};

export default App;
