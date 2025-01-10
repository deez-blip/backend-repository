// src/pages/DepotsHistory.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DepotsHistory = () => {
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Vous devez être connecté.');
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:3333/api/logs/my-logs', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setLogs(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des logs:', error);
            }
        };

        fetchUserLogs();
    }, [navigate]);

    return (
        <div>
            <h1>Historique de mes Dépôts</h1>
            {logs.length === 0 ? (
                <p>Aucun dépôt trouvé.</p>
            ) : (
                <ul>
                    {logs.map((log) => (
                        <li key={log.id}>
                            <strong>Device ID:</strong> {log.device_id} | 
                            <strong>Point de dépôt:</strong> {log.collection_point_id} | 
                            <strong>Action:</strong> {log.action} | 
                            <strong>Date:</strong> {new Date(log.date).toLocaleString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DepotsHistory;
