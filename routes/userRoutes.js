const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Route pour obtenir tous les utilisateurs
router.get('/', authenticate, authorizeAdmin, userController.getAllUsers);

// Route pour obtenir un utilisateur par ID
router.get('/:id', authenticate, userController.getUserById);

// Route pour créer un nouvel utilisateur
router.post('/', authenticate, authorizeAdmin, userController.createUser);

// Route pour mettre à jour un utilisateur existant
router.put('/:id', authenticate, userController.updateUser);

// Route pour supprimer un utilisateur
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;
