// controllers/logController.js
const { Log, Device, CollectionPoint, User } = require('../models');

// Créer un dépôt (log)
exports.createLog = async (req, res) => {
    const { device_id, collection_point_id } = req.body;

    try {
        // Vérification si le device appartient bien à l'utilisateur
        const device = await Device.findByPk(device_id);
        if (!device || device.user_id !== req.user.id) {
            return res.status(403).json({ message: "Accès interdit à ce device." });
        }

        // Vérification si le point de dépôt existe
        const collectionPoint = await CollectionPoint.findByPk(collection_point_id);
        if (!collectionPoint) {
            return res.status(404).json({ message: "Point de dépôt introuvable." });
        }

        // Création du dépôt (log)
        const newLog = await Log.create({
            device_id,
            collection_point_id,
            action: "en attente de scan",
            date: new Date(), // Timestamp actuel
            performed_by: req.user.id
        });

        res.status(201).json(newLog);
    } catch (error) {
        console.error('Erreur lors de la création du dépôt:', error);
        res.status(500).json({ message: "Erreur serveur lors de la création du dépôt." });
    }
};

// Récupérer l'historique des dépôts pour l'utilisateur connecté
exports.getUserLogs = async (req, res) => {
    try {
        const logs = await Log.findAll({
            where: { performed_by: req.user.id },
            include: [
                { model: Device, attributes: ['type', 'status'] }
            ],
            order: [['date', 'DESC']]
        });

        res.status(200).json(logs);
    } catch (error) {
        console.error('Erreur lors de la récupération des logs:', error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des logs." });
    }
};

// Récupérer tous les logs (réservé aux admins)
exports.getAllLogs = async (req, res) => {
    if (req.user.role !== 'ROLE_ADMIN') {
        return res.status(403).json({ message: "Accès interdit. Réservé aux administrateurs." });
    }

    try {
        const logs = await Log.findAll({
            include: [
                { model: Device, attributes: ['type', 'status'] },
                { model: CollectionPoint, attributes: ['nom', 'adresse'] },
                { model: User, attributes: ['nom', 'email'] }
            ],
            order: [['date', 'DESC']]
        });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des logs." });
    }
};

// Supprimer un dépôt (admin uniquement)
exports.deleteLog = async (req, res) => {
    if (req.user.role !== 'ROLE_ADMIN') {
        return res.status(403).json({ message: "Accès interdit. Réservé aux administrateurs." });
    }

    try {
        const log = await Log.findByPk(req.params.id);
        if (!log) {
            return res.status(404).json({ message: "Dépôt non trouvé." });
        }

        await log.destroy();
        res.status(200).json({ message: "Dépôt supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du dépôt." });
    }
};
