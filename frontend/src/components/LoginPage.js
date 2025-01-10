// src/components/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("email: ", email, "password: ", password)
            const response = await axios.post('http://localhost:3333/api/auth/login', {
                email,
                password
            });
            localStorage.setItem('token', response.data.token);  // Stockage du token dans le localStorage
            alert('Connexion réussie !');
            navigate('/');  // Redirection vers la page principale après connexion
        } catch (error) {
            alert('Erreur de connexion, vérifiez vos identifiants.');
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <br />
                <input 
                    type="password" 
                    placeholder="Mot de passe" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <br />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default LoginPage;
