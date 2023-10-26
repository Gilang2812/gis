const DetailTugas = require("../models/DetailTugasModel");
const Praktikan = require("../models/PraktikanModel");
const Tugas = require("../models/TugasModel"); // Menggunakan model Tugas yang sesuai

const success = "Data berhasil ditambahkan";
const err = "Internal server error";

const getAllTugas = async (req, res) => {
  try {
    var tugas = await Tugas.findAll();
    console.log(tugas);
    res.status(200).json(tugas); // Menggunakan status 200 untuk OK
  } catch (error) {
    console.log("getAllTugas Error = " + error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const createTugas = async (req, res) => {
  try {
    const { judul, deskripsi, deadline } = req.body;
    const file = req.file.filename
    const newTugas = await Tugas.create({
      judul: judul,
      file:file,
      deskripsi: deskripsi,
      deadline: deadline,
    });

    const praktikans = await Praktikan.findAll();


    const detailTugasPromises = praktikans.map(praktikan => {
      return DetailTugas.create({
        praktikan_id: praktikan.praktikan_id,
        tugas_id: newTugas.tugas_id,
        asisten_id: 2,
      });
    });


    await Promise.all(detailTugasPromises);

    let response = {
      data: newTugas,
      success: success,
      detail: detailTugasPromises
    };
    res.status(201).json(response); // Menggunakan status 201 untuk Created
    console.log(response);
  } catch (error) {
    console.log("createTugas Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const updateTugas = async (req, res) => {
  try {
    const tugas_id = req.params.tugas_id;
    let data = req.body;

    const tugas = await Tugas.findByPk(tugas_id);

    if (!tugas) {
      let response = {
        error: "Data tidak ditemukan",
      };
      res.status(404).json(response); // Menggunakan status 404 untuk Not Found
    } else {
      tugas.asisten_id = data.asisten_id;
      tugas.judul = data.judul;
      tugas.file = data.file;
      tugas.deskripsi = data.deskripsi;
      tugas.deadline = data.deadline;

      await tugas.save();
      let response = {
        success: "Data berhasil diupdate",
        data: tugas,
      };
      res.status(200).json(response); // Menggunakan status 200 untuk OK
    }
  } catch (error) {
    console.log("updateTugas Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const deleteTugas = async (req, res) => {
  try {
    const tugas_id = req.params.tugas_id;

    const tugas = await Tugas.findByPk(tugas_id);

    if (!tugas) {
      let response = {
        error: "Data tidak ditemukan",
      };
      res.status(404).json(response); // Menggunakan status 404 untuk Not Found
    } else {
      await tugas.destroy();

      let response = {
        success: "Data berhasil dihapus",
      };
      res.status(200).json(response); // Menggunakan status 200 untuk OK
    }
  } catch (error) {
    console.log("deleteTugas Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

module.exports = { getAllTugas, createTugas, updateTugas, deleteTugas };
