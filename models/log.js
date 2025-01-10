// models/log.js
module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        device_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Device',
                key: 'id'
            }
        },
        collection_point_id: {  // Nouvelle clé étrangère ajoutée
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'CollectionPoint',
                key: 'id'
            }
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        performed_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        }
    }, {
        tableName: 'logs',
        timestamps: false
    });

    Log.associate = (models) => {
        Log.belongsTo(models.Device, { foreignKey: 'device_id' });
        Log.belongsTo(models.User, { foreignKey: 'performed_by' });
        Log.belongsTo(models.CollectionPoint, { foreignKey: 'collection_point_id' });
    };

    return Log;
};
