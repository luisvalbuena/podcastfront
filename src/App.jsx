import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import Edit from './pages/Edit';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Protegidas */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/room" element={<ProtectedRoute><Room /></ProtectedRoute>} />
        <Route path="/edit" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
        
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;