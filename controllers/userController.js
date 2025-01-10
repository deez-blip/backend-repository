const { User } = require('../models');

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'ROLE_ADMIN') {
            return res.status(403).json({ message: 'Accès interdit' });
        }
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
};

// Obtenir un utilisateur par ID (contrôlé par rôle)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Seul un admin ou l'utilisateur lui-même peut accéder à ses propres données
        if (req.user.role !== 'ROLE_ADMIN' && req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ message: 'Accès interdit' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
    try {
        const { nom, email, password, adresse } = req.body;
        // Seul un admin ou l'utilisateur lui-même peut accéder à ses propres données
        console.log('creation User ', req.user.role)
        if (req.user.role !== 'ROLE_ADMIN') {
            return res.status(403).json({ message: 'Accès interdit' });
        }
        // Hachage du mot de passe pour plus de sécurité
        // const hashedPassword = await bcrypt.hash(password, 10);

        console.log('creation User ')
        console.log(nom, email, password, adresse)

        const newUser = await User.create({
            nom,
            email,
            password,
            adresse,
            // role: undefined // Le rôle sera défini seulement s'il est passé, sinon par défaut
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (req.user.role !== 'ROLE_ADMIN' && req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ message: 'Accès interdit' });
        }

        const updatedUser = await user.update(req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        console.log("Delete user 1234")
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Seul un admin ou l'utilisateur lui-même peut accéder à ses propres données
        if (req.user.role !== 'ROLE_ADMIN' && req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ message: 'Accès interdit' });
        }

        await user.destroy();
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
    }
};
