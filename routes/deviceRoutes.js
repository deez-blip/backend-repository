// routes/deviceRoutes.js
const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticate, authorizeAdmin, deviceController.getAllDevices);
router.post('/', authenticate, deviceController.createDevice);
router.delete('/:id', authenticate, deviceController.deleteDevice);
router.get('/my-devices', authenticate, deviceController.getUserDevices);

module.exports = router;
