module.exports = (sequelize, DataTypes) => {
    const CollectionPoint = sequelize.define(
        'CollectionPoint', // Nom logique du modèle
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nom: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            adresse: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: 'collectionpoint', // Correspond exactement au nom de la table dans PostgreSQL
            timestamps: false, // Désactive les colonnes `createdAt` et `updatedAt`
        }
    );

    return CollectionPoint;
};
