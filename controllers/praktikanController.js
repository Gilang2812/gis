const Praktikan = require("../models/PraktikanModel"); 
const bcrypt = require('bcrypt')
const success = "Data berhasil ditambahkan";
const err = "Internal server error";

const getAllPraktikan = async (req, res) => {
  try {
    var praktikans = await Praktikan.findAll();
    console.log(praktikans);
    res.status(200).json(praktikans); // Menggunakan status 200 untuk OK
  } catch (error) {
    console.log("getAllPraktikan Error = " + error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const createPraktikan = async (req, res) => {
  try {
    const { nim, nama, email, password, kelas } = req.body;
    const hashedPassword = await bcrypt.hash(password,10)
    const newPraktikan = await Praktikan.create({
      nim,
      nama,
      email,
      password: hashedPassword,
      kelas,
    });

    let response = {
      data: newPraktikan,
      success: success,
    };
    res.status(201).json(response); 
    console.log(response);
  } catch (error) {
    console.log("createPraktikan Error + ", error);
    res.status(500).json({ error: err });
  }
};

const updatePraktikan = async (req, res) => {
  try {
    const praktikan_id = req.params.praktikan_id;
    let data = req.body;

    const praktikan = await Praktikan.findOne({where:{praktikan_id}});

    if (!praktikan) {
      let response = {
        error: "Data tidak ditemukan",
      };
      res.status(404).json(response); // Menggunakan status 404 untuk Not Found
    } else {
      praktikan.nama = data.nama;
      praktikan.kelas = data.kelas;

      await praktikan.save();
      let response = {
        success: "Data berhasil diupdate",
        data: praktikan,
      };
      res.status(200).json(response); // Menggunakan status 200 untuk OK
    }
  } catch (error) {
    console.log("updatePraktikan Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const deletePraktikan = async (req, res) => {
  try {
    const praktikan_id = req.params.praktikan_id;

    const praktikan = await Praktikan.findOne({where:{praktikan_id}});

    if (!praktikan) {
      let response = {
        error: "Data tidak ditemukan",
      };
      res.status(404).json(response); // Menggunakan status 404 untuk Not Found
    } else {
      await praktikan.destroy();

      let response = {
        success: "Data berhasil dihapus",
      };
      res.status(200).json(response); // Menggunakan status 200 untuk OK
    }
  } catch (error) {
    console.log("deletePraktikan Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

module.exports = { getAllPraktikan, createPraktikan, updatePraktikan, deletePraktikan };
