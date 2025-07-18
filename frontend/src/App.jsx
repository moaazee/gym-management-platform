import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TrainerDashboard from './pages/TrainerDashboard';
import MemberDashboard from './pages/MemberDashboard';
import MemberPrograms from './pages/MemberPrograms'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/trainer" element={<TrainerDashboard />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member-programs" element={<MemberPrograms />} />
      </Routes>
    </Router>
  );
}

export default App;
