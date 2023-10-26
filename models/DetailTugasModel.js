const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize("mysql://root@localhost/gis");

const DetailTugas = sequelize.define('DetailTugas', {
  praktikan_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  tugas_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  asisten_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    },
  laporan: {
    type: DataTypes.STRING(100),
  },
  nilai: {
    type: DataTypes.INTEGER,
  },
}, {
    tableName: 'detail_tugas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = DetailTugas;
