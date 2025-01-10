// src/pages/UserProfil.js
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const UserProfil = () => {
    const [formData, setFormData] = useState({ nom: '', email: '', adresse: '', password: '' });
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
            fetchUserData(decoded.id);
        }
    }, [navigate]);

    // Récupérer les données de l'utilisateur connecté
    const fetchUserData = async (id) => {
        try {
            const response = await fetch(`http://localhost:3333/api/users/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const data = await response.json();
            setFormData(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };

    // Mettre à jour les informations de l'utilisateur
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await fetch(`http://localhost:3333/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });
            alert('Profil mis à jour avec succès !');
        } catch (error) {
            console.error('Erreur lors de la mise à jour :', error);
        }
    };

    // Supprimer le compte utilisateur et déconnecter
    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
            try {
                await fetch(`http://localhost:3333/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                alert('Compte supprimé avec succès.');
                localStorage.removeItem('token');  // Déconnexion
                navigate('/login');
            } catch (error) {
                console.error('Erreur lors de la suppression du compte :', error);
            }
        }
    };

    return (
        <div>
            <h1>Mon Profil</h1>
            <form onSubmit={handleUpdate}>
                <label>
                    Nom:
                    <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        value={formData.email}
                        readOnly
                    />
                </label>
                <br />
                <label>
                    Adresse:
                    <input
                        type="text"
                        value={formData.adresse}
                        onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    />
                </label>
                <br />
                <label>
                    Mot de passe (Laissez vide si inchangé):
                    <input
                        type="password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </label>
                <br />
                <button type="submit">Mettre à jour</button>
            </form>

            {/* Bouton de suppression avec confirmation */}
            <button 
                onClick={handleDelete} 
                style={{ marginTop: '20px', backgroundColor: 'red', color: 'white' }}
            >
                Supprimer Mon Compte
            </button>
        </div>
    );
};

export default UserProfil;
