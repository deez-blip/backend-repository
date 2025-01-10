// routes/logRoutes.js
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { authenticate } = require('../middleware/authMiddleware');

// Créer un dépôt (log)
router.post('/', authenticate, logController.createLog);
router.get('/my-logs', authenticate, logController.getUserLogs);
// Route pour récupérer tous les logs (admin uniquement)
router.get('/all-logs', authenticate, logController.getAllLogs);

// Route pour supprimer un log (admin uniquement)
router.delete('/:id', authenticate, logController.deleteLog);

module.exports = router;
