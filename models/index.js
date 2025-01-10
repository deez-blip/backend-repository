const Sequelize = require('sequelize');
require('dotenv').config();

// Instanciation de Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
        logging: false, // Affiche les requêtes SQL dans la console
    }
);

// Importation des modèles
const Device = require('./device')(sequelize, Sequelize.DataTypes);
const User = require('./user')(sequelize, Sequelize.DataTypes);
const CollectionPoint = require('./collectionpoint')(sequelize, Sequelize.DataTypes);
const Log = require('./log')(sequelize, Sequelize.DataTypes);  // Bien ajouté ici

// Déclaration des associations
Device.belongsTo(User, { foreignKey: 'user_id' });
Log.belongsTo(Device, { foreignKey: 'device_id' });
Log.belongsTo(CollectionPoint, { foreignKey: 'collection_point_id' });
Log.belongsTo(User, { foreignKey: 'performed_by' });
// Export de Sequelize et des modèles
module.exports = {
    sequelize, // Instance Sequelize (pour sync et authenticate)
    Sequelize, // Types Sequelize
    Device,    // Modèle Device
    User,      // Modèle User
    CollectionPoint, // Modèle CollectionPoint
    Log
};
