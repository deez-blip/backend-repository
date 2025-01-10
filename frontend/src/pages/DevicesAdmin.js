import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Devices = () => {
    const [devices, setDevices] = useState([]);
    const [formData, setFormData] = useState({ type: '', status: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vous devez être connecté !');
            navigate('/login');
        } else {
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
            fetchDevices(decoded.id);
        }
    }, [navigate]);

    const fetchDevices = async () => {
        try {
            const response = await fetch('http://localhost:3333/api/devices', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const data = await response.json();
            console.log(data)
            setDevices(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des appareils :', error);
        }
    };

    // Supprimer un appareil
    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3333/api/devices/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                method: 'DELETE',
            });
            fetchDevices(); // Recharger la liste après suppression
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'appareil :', error);
        }
    };

    // Soumettre le formulaire (Ajouter ou Modifier)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Modifier un appareil existant
                await fetch(`http://localhost:3333/api/devices/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(formData),
                });
                setIsEditing(false);
                setEditingId(null);
            } else {
                // Ajouter un nouvel appareil
                await fetch('http://localhost:3333/api/devices', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(formData),
                });
            }
            setFormData({ type: '', status: '' });
            fetchDevices(); // Recharger la liste
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données :', error);
        }
    };

    // Pré-remplir le formulaire pour modification
    const handleEdit = (device) => {
        setFormData({ type: device.type, status: device.status });
        setIsEditing(true);
        setEditingId(device.id);
    };

    return (
        <div className="container">
            <h1>Devices</h1>
            {/* Liste des appareils */}
            <ul>
                {devices.map((device) => (
                    <li key={device.id}>
                        <span>Type:</span> {device.type}, <span>Status:</span> {device.status}{' '}, <span>User:</span> {device.user_id}{' '}
                        <button onClick={() => handleEdit(device)}>Edit</button>{' '}
                        <button onClick={() => handleDelete(device.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* Formulaire d'ajout ou de modification */}
            <h2>{isEditing ? 'Edit Device' : 'Add Device'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Type:
                        <input
                            type="text"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Status:
                        <input
                            type="text"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            required
                        />
                    </label>
                </div>
                <button type="submit">{isEditing ? 'Update Device' : 'Add Device'}</button>
            </form>
        </div>
    );
};

export default Devices;
