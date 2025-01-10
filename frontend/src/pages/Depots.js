// src/pages/Depots.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Depots = () => {
    const [devices, setDevices] = useState([]);
    const [collectionPoints, setCollectionPoints] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');
    const [selectedCollectionPoint, setSelectedCollectionPoint] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Vous devez être connecté.');
                    navigate('/login');
                    return;
                }

                // Récupérer les devices de l'utilisateur
                const devicesResponse = await fetch('http://localhost:3333/api/devices/my-devices', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const devicesData = await devicesResponse.json();
                setDevices(devicesData);

                // Récupérer les points de dépôt
                const pointsResponse = await fetch('http://localhost:3333/api/collection-points', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const pointsData = await pointsResponse.json();
                setCollectionPoints(pointsData);

            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };

        fetchData();
    }, [navigate]);

    // Création d'un dépôt
    const handleCreateDepot = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3333/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    device_id: selectedDevice,
                    collection_point_id: selectedCollectionPoint
                })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création du dépôt.');
            }

            alert('Dépôt créé avec succès !');
            navigate('/');  // Redirection après la création
        } catch (error) {
            console.error('Erreur lors de la création du dépôt:', error);
        }
    };

    return (
        <div>
            <h1>Créer un Dépôt</h1>
            <form onSubmit={handleCreateDepot}>
                {/* Sélection du device */}
                <label>
                    Sélectionner un de vos devices :
                    <select 
                        value={selectedDevice} 
                        onChange={(e) => setSelectedDevice(e.target.value)}
                        required
                    >
                        <option value="">-- Choisissez un device --</option>
                        {devices.map((device) => (
                            <option key={device.id} value={device.id}>
                                {device.type} - {device.status}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Sélection du point de dépôt */}
                <label>
                    Sélectionner un point de dépôt :
                    <select 
                        value={selectedCollectionPoint} 
                        onChange={(e) => setSelectedCollectionPoint(e.target.value)}
                        required
                    >
                        <option value="">-- Choisissez un point de dépôt --</option>
                        {collectionPoints.map((point) => (
                            <option key={point.id} value={point.id}>
                                {point.nom} - {point.adresse}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Bouton de création */}
                <button type="submit" style={{ marginTop: '20px' }}>Créer le dépôt</button>
            </form>
        </div>
    );
};

export default Depots;
