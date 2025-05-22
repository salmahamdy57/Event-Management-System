import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminOnly }) => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');

    if (!token) return <Navigate to="/login" />;
    if (isAdminOnly && !isAdmin) return <Navigate to="/" />;

    return children;
};

export default ProtectedRoute;