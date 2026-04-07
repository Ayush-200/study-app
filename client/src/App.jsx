import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/room/:roomId" element={<PrivateRoute><Room /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/profile/:userId" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/friends" element={<PrivateRoute><Friends /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
