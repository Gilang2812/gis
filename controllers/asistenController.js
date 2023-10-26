const Asisten = require("../models/AsistenModel");
const bcrypt = require('bcrypt')
const success = "Data berhasil ditambahkan";
const err = "Internal server error";

const getAllAsisten = async (req, res) => {
  try {
    var asistens = await Asisten.findAll();
    console.log(asistens);
    res.status(200).json(asistens); // Menggunakan status 200 untuk OK
  } catch (error) {
    console.log("getAllAsisten Error = " + error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const createAsisten = async (req, res) => {
  try {
    const { nim_aslab, nama, email, password, } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10)

    const newAsisten = await Asisten.create({
      nim_aslab,
      nama,
      email,
      password: hashedPassword,
    });

    let response = {
      data: newAsisten,
      success: success,
    };
    res.status(201).json(response); // Menggunakan status 201 untuk Created
    console.log(response);
  } catch (error) {
    console.log("createAsisten Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const updateAsisten = async (req, res) => {
  try {
    const asisten_id = req.params.asisten_id;
    let data = req.body;

    const asisten = await Asisten.findOne({ where: { asisten_id } });

    if (!asisten) {
      let response = {
        error: "Data tidak ditemukan",
      };
      res.status(404).json(response); // Menggunakan status 404 untuk Not Found
    } else {
      asisten.nama = data.nama;
      asisten.updated_at = new Date();

      await asisten.save();
      let response = {
        success: "Data berhasil diupdate",
        data: asisten,
      };
      res.status(200).json(response); // Menggunakan status 200 untuk OK
    }
  } catch (error) {
    console.log("updateAsisten Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const deleteAsisten = async (req, res) => {
  try {
    const asisten_id = req.params.asisten_id;
    const asisten = await Asisten.findOne({ where: { asisten_id } });

    if (!asisten) {
      let response = {
        error: "Data tidak ditemukan",
      };
      res.status(404).json(response); // Menggunakan status 404 untuk Not Found
    } else {
      await asisten.destroy();

      let response = {
        success: "Data berhasil dihapus",
      };
      res.status(200).json(response); // Menggunakan status 200 untuk OK
    }
  } catch (error) {
    console.log("deleteAsisten Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

module.exports = { getAllAsisten, createAsisten, updateAsisten, deleteAsisten };
