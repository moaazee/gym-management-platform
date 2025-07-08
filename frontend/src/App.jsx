import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TrainerDashboard from './pages/TrainerDashboard';
import MemberDashboard from './pages/MemberDashboard';
import ProgramPage from './pages/ProgramPage';
import MealPlanPage from './pages/MealPlanPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trainer" element={<TrainerDashboard />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/trainer/programs" element={<ProgramPage />} />
        <Route path="/trainer/meals" element={<MealPlanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
