// controllers/authController.js
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { nom, email, password, adresse } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            nom,
            email,
            password: hashedPassword,
            adresse,
            role: 'ROLE_USER' // Par défaut, les utilisateurs ont le rôle USER
        });
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
};

const login = async (req, res) => {
    console.log("here", req.body)
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        console.log(("herehrerhereh"))
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const isPasswordValid = password === user.password;
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
};

module.exports = { register, login };
