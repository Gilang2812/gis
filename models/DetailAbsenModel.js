const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize("mysql://root@localhost/gis");

const DetailAbsen = sequelize.define('DetailAbsen', {
  praktikan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  absen_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  status_kehadiran: {
    type: DataTypes.STRING,
  },
}, {
    tableName: 'detail_absen',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = DetailAbsen;
