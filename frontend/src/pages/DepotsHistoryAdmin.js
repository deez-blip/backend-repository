// src/pages/DepotsHistoryAdmin.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DepotsHistoryAdmin = () => {
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Vous devez être connecté.');
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:3333/api/logs/all-logs', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 403) {
                    alert('Accès interdit. Vous devez être administrateur.');
                    navigate('/home');
                    return;
                }

                const data = await response.json();
                setLogs(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des logs:', error);
            }
        };

        fetchAllLogs();
    }, [navigate]);

    // Suppression d'un dépôt
    const handleDeleteLog = async (logId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce dépôt ?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3333/api/logs/${logId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du dépôt.');
            }

            alert('Dépôt supprimé avec succès.');
            setLogs(logs.filter(log => log.id !== logId));
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    return (
        <div>
            <h1>Historique de tous les dépôts (Admin)</h1>
            {logs.length === 0 ? (
                <p>Aucun dépôt trouvé.</p>
            ) : (
                <ul>
                    {logs.map((log) => (
                        <li key={log.id}>
                            <strong>Device ID:</strong> {log.device_id} | 
                            <strong>Point de dépôt:</strong> {log.collection_point_id} | 
                            <strong>Action:</strong> {log.action} | 
                            <strong>Date:</strong> {new Date(log.date).toLocaleString()} | 
                            <button 
                                onClick={() => handleDeleteLog(log.id)}
                                style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                            >
                                Supprimer
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DepotsHistoryAdmin;
