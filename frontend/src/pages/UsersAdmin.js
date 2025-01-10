import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const UsersAdmin = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ nom: '', email: '', adresse: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vous devez être connecté !');
            navigate('/login');
        } else {
            const decoded = jwtDecode(token);
            fetchUsers(decoded.id);
        }
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3333/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
        }
    };


    // Supprimer un utilisateur
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:3333/api/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                method: 'DELETE',
            });
            fetchUsers(); // Recharger la liste après suppression
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur :', error);
        }
    };

    // Soumettre le formulaire (Ajouter ou Modifier)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (isEditing) {
                // Modifier un utilisateur existant
                await fetch(`http://localhost:3333/api/users/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                });
                setIsEditing(false);
                setEditingId(null);
            } else {
                console.log(formData)
                // Ajouter un nouvel utilisateur
                await fetch('http://localhost:3333/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                });
            }
            setFormData({ nom: '', email: '', adresse: '', password: '' });
            fetchUsers(); // Recharger la liste
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données :', error);
        }
    };

    // Pré-remplir le formulaire pour modification
    const handleEdit = (user) => {
        setFormData({
            nom: user.nom,
            email: user.email,
            role: user.role,
            adresse: user.adresse,
            password: user.password || '' // Prévenir les cas où le champ est absent
        });
        setIsEditing(true);
        setEditingId(user.id);
    };

    return (
        <div className="container">
            <h1>Users</h1>

            {/* Liste des utilisateurs */}
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <span>Nom:</span> {user.nom},
                        <span>Email:</span> {user.email},
                        <span>Role:</span> {user.role}
                        <button onClick={() => handleEdit(user)}>Edit</button>
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* Formulaire d'ajout ou de modification */}
            <h2>{isEditing ? 'Edit User' : 'Add User'}</h2>
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
                        Email:
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={!isEditing} // Password obligatoire uniquement lors de l'ajout
                        />
                    </label>
                </div>
                <button type="submit">{isEditing ? 'Update User' : 'Add User'}</button>
            </form>
        </div>
    );
};

export default UsersAdmin;
