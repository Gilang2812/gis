const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize("mysql://root@localhost/gis");

const Absen = sequelize.define('Absen', {
  absen_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  jam_buka: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  jam_tutup: {
    type: DataTypes.TIME,
    allowNull: false,
  },
}, {
  tableName: 'absen',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Absen;
