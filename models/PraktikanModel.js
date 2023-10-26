const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize("mysql://root@localhost/gis");

const Praktikan = sequelize.define('Praktikan', {
    praktikan_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    nim: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    kelas: {
        type: DataTypes.STRING(20),
    },
}, {
    tableName: 'praktikan',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Praktikan;
