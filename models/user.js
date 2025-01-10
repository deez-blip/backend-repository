// models/user.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
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
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('ROLE_USER', 'ROLE_ADMIN'),
                defaultValue: 'ROLE_USER',  // Défini par défaut
                allowNull: false,
            },
            adresse: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: 'User',
            timestamps: false,
        }
    );

    return User;
};
