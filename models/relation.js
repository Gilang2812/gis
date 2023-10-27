const Praktikan = require('./PraktikanModel')
const Tugas = require('./TugasModel')
const DetailTugas = require('./DetailTugasModel')
const DetailAbsen = require('./DetailAbsenModel')
const Absen = require('./AbsenModel')
const Asisten = require('./asistenModel')


Absen.hasMany(DetailAbsen, { foreignKey: "absen_id" })
Praktikan.hasMany(DetailAbsen, { foreignKey: "praktikan_id" })
DetailAbsen.belongsTo(Absen, { foreignKey: "absen_id" })
DetailAbsen.belongsTo(Praktikan, { foreignKey: "praktikan_id" })

Praktikan.hasMany(DetailTugas, { foreignKey: "praktikan_id" })
Asisten.hasMany(DetailTugas, { foreignKey: "asisten_id" })
Tugas.hasMany(DetailTugas, { foreignKey: "tugas_id" })


DetailTugas.belongsTo(Praktikan, { foreignKey: "praktikan_id" })
DetailTugas.belongsTo(Asisten, { foreignKey: "asisten_id", allowNull: true });
DetailTugas.belongsTo(Tugas, { foreignKey: "tugas_id" },)

module.exports = {
    Praktikan,
    Asisten,
    Tugas,
    DetailAbsen,
    DetailTugas,
    Absen
}