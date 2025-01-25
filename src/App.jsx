// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Exercises from './pages/Exercises';
import Stats from './pages/Stats';
import Layout from './components/layout/Layout';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const App = () => {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/workouts" element={<PrivateRoute><Workouts /></PrivateRoute>} />
                        <Route path="/exercises" element={<PrivateRoute><Exercises /></PrivateRoute>} />
                        <Route path="/stats" element={<PrivateRoute><Stats /></PrivateRoute>} />
                    </Routes>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
};

export default App;