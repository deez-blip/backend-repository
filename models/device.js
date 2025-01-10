module.exports = (sequelize, DataTypes) => {
    const Device = sequelize.define(
        'Device', // Nom logique du modèle
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            date_de_collecte: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            date_de_reconditionnement: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            date_de_distribution: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            user_id: {  // Ajout de la clé étrangère
                type: DataTypes.INTEGER,
                allowNull: true, // Peut être null si non attribué
                references: {
                    model: 'User',
                    key: 'id'
                },
                onDelete: 'SET NULL' // Option : si l'utilisateur est supprimé, lier à NULL
            }
        },
        {
            tableName: 'device', // Assurez-vous que cela correspond exactement au nom de la table dans PostgreSQL
            timestamps: false, // Désactive les colonnes `createdAt` et `updatedAt` si elles ne sont pas utilisées
        }
    );

    // Définir la relation dans Sequelize
    Device.associate = (models) => {
        Device.belongsTo(models.User, { foreignKey: 'user_id' });
    };

    return Device;
};
