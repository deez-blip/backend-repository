// src/pages/Devices.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Devices = () => {
    const [devices, setDevices] = useState([]);
    const [formData, setFormData] = useState({ type: '', status: '' });
    const navigate = useNavigate();

    // Récupérer uniquement les devices de l'utilisateur connecté
    useEffect(() => {
        const fetchUserDevices = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Vous devez être connecté.');
                    navigate('/login');
                    return;
                }
                
                const response = await fetch('http://localhost:3333/api/devices/my-devices', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des devices');
                }

                const data = await response.json();
                setDevices(data);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchUserDevices();
    }, [navigate]);

    // Créer un nouveau device lié à l'utilisateur
    const handleCreateDevice = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3333/api/devices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création du device');
            }

            alert('Device créé avec succès');
            setFormData({ type: '', status: '' });
            // Recharger la liste des devices
            const updatedDevices = await response.json();
            setDevices((prev) => [...prev, updatedDevices]);

        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Supprimer un device
    const handleDeleteDevice = async (deviceId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce device ?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3333/api/devices/${deviceId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du device');
            }

            alert('Device supprimé avec succès');
            setDevices((prev) => prev.filter(device => device.id !== deviceId));

        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    return (
        <div>
            <h1>Mes Devices</h1>

            {/* Formulaire de création de device */}
            <form onSubmit={handleCreateDevice}>
                <label>
                    Type :
                    <input 
                        type="text"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Statut :
                    <input 
                        type="text"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                    />
                </label>
                <button type="submit">Créer un Device</button>
            </form>

            {/* Liste des devices avec option de suppression */}
            <h2>Liste de vos devices</h2>
            <ul>
                {devices.map((device) => (
                    <li key={device.id}>
                        {device.type} - {device.status}
                        <button 
                            onClick={() => handleDeleteDevice(device.id)} 
                            style={{ marginLeft: '10px', color: 'white', backgroundColor: 'red' }}>
                            Supprimer
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Devices;
