const Absen = require("../models/AbsenModel"); // Menggunakan model Absen yang sesuai
const DetailAbsen = require("../models/DetailAbsenModel");
const Praktikan = require("../models/PraktikanModel");

const success = "Tugas berhasil ";
const err = "Internal server error";

const getAllAbsen = async (req, res) => {
  try {
    var absens = await Absen.findAll();
    console.log(absens);
    res.status(200).json(absens); // Menggunakan status 200 untuk OK
  } catch (error) {
    console.log("getAllAbsen Error = " + error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const createAbsen = async (req, res) => {
  try {
    const {nama, tanggal, jam_buka, jam_tutup } = req.body;

    const newAbsen = await Absen.create({
      nama:nama,
      tanggal: tanggal,
      jam_buka: jam_buka,
      jam_tutup: jam_tutup,
    });

    const praktikans = await Praktikan.findAll()

    const detailAbsenPromises = praktikans.map(praktikan=>{
      return DetailAbsen.create({
        praktikan_id :praktikan.praktikan_id,
        absen_id:newAbsen.absen_id
      })
    })

    await Promise.all(detailAbsenPromises)
    let response = {
      data: newAbsen,
      success: success,
    };
    res.status(201).json(response); // Menggunakan status 201 untuk Created
    console.log(response);
  } catch (error) {
    console.log("createAbsen Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const updateAbsen = async (req, res) => {
  try {
    const absen_id = req.params.absen_id;
    let data = req.body;

    const absen = await Absen.findByPk(absen_id);

    if (!absen) {
      let response = {
        error: "Data tidak ditemukan",
      };
      res.status(404).json(response); // Menggunakan status 404 untuk Not Found
    } else {
      absen.nama = data.nama
      absen.tanggal = data.tanggal;
      absen.jam_buka = data.jam_buka;
      absen.jam_tutup = data.jam_tutup;

      await absen.save();
      let response = {
        success: "Data berhasil diupdate",
        data: absen,
      };
      res.status(200).json(response); // Menggunakan status 200 untuk OK
    }
  } catch (error) {
    console.log("updateAbsen Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const deleteAbsen = async (req, res) => {
  try {
    const absen_id = req.params.absen_id;

    const absen = await Absen.findByPk(absen_id);

    if (!absen) {
      let response = {
        error: "Data tidak ditemukan",
      };
      res.status(404).json(response); // Menggunakan status 404 untuk Not Found
    } else {
      await absen.destroy();

      let response = {
        success: "Data berhasil dihapus",
      };
      res.status(200).json(response); // Menggunakan status 200 untuk OK
    }
  } catch (error) {
    console.log("deleteAbsen Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

module.exports = { getAllAbsen, createAbsen, updateAbsen, deleteAbsen };
