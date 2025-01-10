const { Device, User } = require('../models'); // Importer le modèle `Device` depuis `models/index.js`

// Obtenir tous les appareils
exports.getAllDevices = async (req, res) => {
    try {
        const devices = await Device.findAll();
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des appareils' });
    }
};

// Obtenir un appareil par ID
exports.getDeviceById = async (req, res) => {
    try {
        const device = await Device.findByPk(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }
        res.status(200).json(device);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'appareil' });
    }
};

// Récupérer tous les devices de l'utilisateur connecté
exports.getUserDevices = async (req, res) => {
    try {
        const devices = await Device.findAll({
            where: { user_id: req.user.id }
        });
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des devices." });
    }
};

// Créer un device et l'associer à l'utilisateur
exports.createDevice = async (req, res) => {
    const { type, status, date_de_collecte, date_de_reconditionnement, date_de_distribution } = req.body;
    
    try {
        const newDevice = await Device.create({
            type,
            status,
            date_de_collecte,
            date_de_reconditionnement,
            date_de_distribution,
            user_id: req.user.id  // Lien direct avec l'utilisateur connecté
        });
        res.status(201).json(newDevice);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du device." });
    }
};

// Mettre à jour un appareil
exports.updateDevice = async (req, res) => {
    try {
        const device = await Device.findByPk(req.params.id);
        if (!device) {
            return res.status(404).json({ message: 'Appareil non trouvé' });
        }
        const updatedDevice = await device.update(req.body);
        res.status(200).json(updatedDevice);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'appareil' });
    }
};

// controllers/deviceController.js
exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findByPk(req.params.id);

        if (!device) {
            return res.status(404).json({ message: "Device non trouvé." });
        }

        // Vérifie que l'utilisateur est le propriétaire ou un admin
        if (device.user_id !== req.user.id && req.user.role !== 'ROLE_ADMIN') {
            return res.status(403).json({ message: "Accès interdit." });
        }

        await device.destroy();
        res.status(200).json({ message: "Device supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression." });
    }
};
