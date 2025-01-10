const express = require('express');
const router = express.Router();
const collectionPointController = require('../controllers/collectionPointController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Route pour obtenir tous les points de collecte
router.get('/', authenticate, collectionPointController.getAllCollectionPoints);

// Route pour obtenir un point de collecte par ID
router.get('/:id', authenticate, authorizeAdmin, collectionPointController.getCollectionPointById);

// Route pour créer un nouveau point de collecte
router.post('/', authenticate, authorizeAdmin, collectionPointController.createCollectionPoint);

// Route pour mettre à jour un point de collecte existant
router.put('/:id', authenticate, authorizeAdmin, collectionPointController.updateCollectionPoint);

// Route pour supprimer un point de collecte
router.delete('/:id', authenticate, authorizeAdmin, collectionPointController.deleteCollectionPoint);

module.exports = router;
