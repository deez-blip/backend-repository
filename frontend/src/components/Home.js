// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../App';

const Home = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Vous devez être connecté !");
            navigate('/login');
        } else {
            try {
                const decodedToken = jwtDecode(token);
                setRole(decodedToken.role);
            } catch (error) {
                console.error('Erreur lors du décodage du token:', error);
                navigate('/login');
            }
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('Vous avez été déconnecté.');
        navigate('/login');
    };

    return (
        <div className="container">
            <h1>Bienvenue sur l'application</h1>
            <p>Vous êtes connecté en tant que : <strong>{role}</strong></p>

            <nav>
                <ul>
                    {/* L'admin voit tout */}
                    {role === 'ROLE_ADMIN' && (
                        <>
                            <li><Link to="/devices-admin">Devices</Link></li>
                            <li><Link to="/users-admin">Users</Link></li>
                            <li><Link to="/collection-points">Collection Points</Link></li>
                            <li><Link to="/depots-history-admin">Depots historique</Link></li>
                        </>
                    )}

                    {/* Le User ne voit que sa propre page */}
                    {role === 'ROLE_USER' && (
                        <>
                            <li><Link to="/userProfil">Mon Profil</Link></li>
                            <li><Link to="/devices">Ajouter un device</Link></li>
                            <li><Link to="/depots">Deposer un objet</Link></li>
                            <li><Link to="/depots-history">Historique de depots</Link></li>
                        </>
                    )}
                </ul>
            </nav>

            <button onClick={handleLogout} style={{ marginTop: '20px' }}>
                Se Déconnecter
            </button>
        </div>
    );
};

export default Home;
