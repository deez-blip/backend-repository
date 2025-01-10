// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('token');

    // Redirige vers /login si aucun token trouvé
    if (!token) {
        alert('Vous devez être connecté pour accéder à cette page.');
        return <Navigate to="/login" />;
    }

    // Affiche la page si le token est présent
    return element;
};

export default ProtectedRoute;
