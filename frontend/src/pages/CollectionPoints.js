import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const CollectionPoints = () => {
    const [collectionPoints, setCollectionPoints] = useState([]);
    const [formData, setFormData] = useState({ nom: '', adresse: '', type: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    // Charger les points de collecte
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vous devez être connecté !');
            navigate('/login');
        } else {
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
            fetchCollectionPoints(decoded.id);
        }
    }, [navigate]);

    const fetchCollectionPoints = async () => {
        try {
            const response = await fetch('http://localhost:3333/api/collection-points', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const data = await response.json();
            setCollectionPoints(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des points de collecte :', error);
        }
    };

    // Supprimer un point de collecte
    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3333/api/collection-points/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                method: 'DELETE',
            });
            fetchCollectionPoints(); // Recharger la liste après suppression
        } catch (error) {
            console.error('Erreur lors de la suppression du point de collecte :', error);
        }
    };

    // Soumettre le formulaire (Ajouter ou Modifier)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Modifier un point de collecte existant
                await fetch(`http://localhost:3333/api/collection-points/${editingId}`, {
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
                // Ajouter un nouveau point de collecte
                await fetch('http://localhost:3333/api/collection-points', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(formData),
                });
            }
            setFormData({ nom: '', adresse: '', type: '' });
            fetchCollectionPoints(); // Recharger la liste
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données :', error);
        }
    };

    // Pré-remplir le formulaire pour modification
    const handleEdit = (point) => {
        setFormData({ nom: point.nom, adresse: point.adresse, type: point.type });
        setIsEditing(true);
        setEditingId(point.id);
    };

    return (
        <div className="container">
            <h1>Collection Points</h1>

            {/* Liste des points de collecte */}
            <ul>
                {collectionPoints.map((point) => (
                    <li key={point.id}>
                        <span>Nom:</span> {point.nom}, <span>Adresse:</span> {point.adresse}, <span>Type:</span> {point.type}{' '}
                        <button onClick={() => handleEdit(point)}>Edit</button>{' '}
                        <button onClick={() => handleDelete(point.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* Formulaire d'ajout ou de modification */}
            <h2>{isEditing ? 'Edit Collection Point' : 'Add Collection Point'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Nom:
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Adresse:
                        <input
                            type="text"
                            value={formData.adresse}
                            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Type:
                        <input
                            type="text"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        />
                    </label>
                </div>
                <button type="submit">{isEditing ? 'Update Collection Point' : 'Add Collection Point'}</button>
            </form>
        </div>
    );
};

export default CollectionPoints;
