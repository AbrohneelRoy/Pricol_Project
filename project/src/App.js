import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Projects from './Projects';
import Register from './Register'; 
import Employee from './Employee';
import Tool from './Tool';
import AuthGuard from './AuthGuard'; // Import the AuthGuard component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/projects"
          element={
            <AuthGuard>
              <Projects />
            </AuthGuard>
          }
        />
        <Route path="/register" element={<Register />} /> 
        <Route
          path="/employee"
          element={
            <AuthGuard>
              <Employee />
            </AuthGuard>
          }
        />
        <Route
          path="/tool"
          element={
            <AuthGuard>
              <Tool />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
