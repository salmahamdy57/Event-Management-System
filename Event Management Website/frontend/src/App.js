import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import "./style.css";

const App = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin");
        setIsAdmin(isAdmin);
    }, []);

    return (
        <Router>
            <Header isAdmin={isAdmin}/>
            <Routes>
                <Route path="/" element={<Home isAdmin={isAdmin} />} />
                <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute isAdminOnly={true}>
                        <Dashboard />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
};

export default App;