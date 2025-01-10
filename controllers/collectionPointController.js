const { CollectionPoint } = require('../models');

// Obtenir tous les points de collecte
exports.getAllCollectionPoints = async (req, res) => {
    try {
        const collectionPoints = await CollectionPoint.findAll();
        res.status(200).json(collectionPoints);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des points de collecte' });
    }
};

// Obtenir un point de collecte par ID
exports.getCollectionPointById = async (req, res) => {
    try {
        const point = await CollectionPoint.findByPk(req.params.id);
        if (!point) {
            return res.status(404).json({ message: 'Point de collecte non trouvé' });
        }
        res.status(200).json(point);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du point de collecte' });
    }
};

// Créer un nouveau point de collecte
exports.createCollectionPoint = async (req, res) => {
    try {
        const { nom, adresse, type } = req.body;
        const newPoint = await CollectionPoint.create({ nom, adresse, type });
        res.status(201).json(newPoint);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du point de collecte' });
    }
};

// Mettre à jour un point de collecte
exports.updateCollectionPoint = async (req, res) => {
    try {
        const point = await CollectionPoint.findByPk(req.params.id);
        if (!point) {
            return res.status(404).json({ message: 'Point de collecte non trouvé' });
        }
        const updatedPoint = await point.update(req.body);
        res.status(200).json(updatedPoint);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du point de collecte' });
    }
};

// Supprimer un point de collecte
exports.deleteCollectionPoint = async (req, res) => {
    try {
        const point = await CollectionPoint.findByPk(req.params.id);
        if (!point) {
            return res.status(404).json({ message: 'Point de collecte non trouvé' });
        }
        await point.destroy();
        res.status(200).json({ message: 'Point de collecte supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du point de collecte' });
    }
};
