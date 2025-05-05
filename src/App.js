import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/admin/dashboard';  // Import your Dashboard component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Route for the login page */}
        <Route path="/admin/dashboard" element={<Dashboard />} /> {/* Route for the dashboard page */}
      </Routes>
    </Router>
  );
}

export default App;
