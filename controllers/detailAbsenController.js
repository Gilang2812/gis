const DetailAbsen = require("../models/DetailAbsenModel"); // Menggunakan model DetailAbsen yang sesuai

const success = "Data berhasil ditambahkan";
const err = "Internal server error";

const getAllDetailAbsen = async (req, res) => {
  try {
    var detailAbsens = await DetailAbsen.findAll();
    console.log(detailAbsens);
    res.status(200).json(detailAbsens); // Menggunakan status 200 untuk OK
  } catch (error) {
    console.log("getAllDetailAbsen Error = " + error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const createDetailAbsen = async (req, res) => {
  try {
    const { praktikan_id, absen_id, status_kehadiran } = req.body;

    const newDetailAbsen = await DetailAbsen.create({
      praktikan_id: praktikan_id,
      absen_id: absen_id,
      status_kehadiran: status_kehadiran,
    });

    let response = {
      data: newDetailAbsen,
      success: success,
    };
    res.status(201).json(response); // Menggunakan status 201 untuk Created
    console.log(response);
  } catch (error) {
    console.log("createDetailAbsen Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const updateDetailAbsen = async (req, res) => {
  try {
    const { praktikan_id, absen_id } = req.params;
    let data = req.body;

    const detailAbsen = await DetailAbsen.findOne({
      where: {
        praktikan_id: praktikan_id,
        absen_id: absen_id,
      },
    });

    if (!detailAbsen) {
      let response = {
        error: "Data tidak ditemukan",
      };
      res.status(404).json(response); // Menggunakan status 404 untuk Not Found
    } else {
      detailAbsen.status_kehadiran = data.status_kehadiran;

      await detailAbsen.save();
      let response = {
        success: "Data berhasil diupdate",
        data: detailAbsen,
      };
      res.status(200).json(response); // Menggunakan status 200 untuk OK
    }
  } catch (error) {
    console.log("updateDetailAbsen Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const deleteDetailAbsen = async (req, res) => {
  try {
    const { praktikan_id, absen_id } = req.params;

    const detailAbsen = await DetailAbsen.findOne({
      where: {
        praktikan_id: praktikan_id,
        absen_id: absen_id,
      },
    });

    if (!detailAbsen) {
      let response = {
        error: "Data tidak ditemukan",
      };
      res.status(404).json(response); // Menggunakan status 404 untuk Not Found
    } else {
      await detailAbsen.destroy();

      let response = {
        success: "Data berhasil dihapus",
      };
      res.status(200).json(response); // Menggunakan status 200 untuk OK
    }
  } catch (error) {
    console.log("deleteDetailAbsen Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

module.exports = { getAllDetailAbsen, createDetailAbsen, updateDetailAbsen, deleteDetailAbsen };
