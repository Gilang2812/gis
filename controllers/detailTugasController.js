const { DetailTugas, Praktikan, Asisten } = require("../models/relation"); // Menggunakan model DetailTugas yang sesuai
const Tugas = require("../models/TugasModel");

const success = "Data berhasil ditambahkan";
const err = "Internal server error";

const getAllDetailTugas = async (req, res) => {
  try {
    let tugas_id = req.params.tugas_id
    var detailTugas = await DetailTugas.findAll({
      include: [{
        model: Tugas,
        attributes: ["judul", "file", 'deskripsi', 'deadline']
      }, {
        model: Praktikan,
        attributes: ["nama", "nim", "kelas"]
      }, {
        model: Asisten,
        attributes: ["nama"]
      }],
      where: { tugas_id: tugas_id },
    });
    console.log(detailTugas);
    res.status(200).json(detailTugas); // Menggunakan status 200 untuk OK
  } catch (error) {
    console.log("getAllDetailTugas Error = " + error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const createDetailTugas = async (req, res) => {
  try {
    const { praktikan_id, tugas_id, asisten_id, laporan, nilai } = req.body;

    const newDetailTugas = await DetailTugas.create({
      praktikan_id: praktikan_id,
      tugas_id: tugas_id,
      asisten_id: asisten_id,
      laporan: laporan,
      nilai: nilai,
    });

    let response = {
      data: newDetailTugas,
      success: success,
    };
    res.status(201).json(response); // Menggunakan status 201 untuk Created
    console.log(response);
  } catch (error) {
    console.log("createDetailTugas Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const updateDetailTugas = async (req, res) => {
  try {
    const { praktikan_id, tugas_id } = req.params;
    let data = req.body;

    const detailTugas = await DetailTugas.findOne({
      where: {
        praktikan_id: praktikan_id,
        tugas_id: tugas_id,
      },
    });

    if (!detailTugas) {
      let response = {
        error: "Data tidak ditemukan",
      };
      res.status(404).json(response); // Menggunakan status 404 untuk Not Found
    } else {
      detailTugas.asisten_id = req.user.user.asisten_id,
        detailTugas.nilai = data.nilai;
      await detailTugas.save();
      let response = {
        success: "Data berhasil diupdate",
        data: detailTugas,
      };
      res.status(200).json(response); // Menggunakan status 200 untuk OK
    }
  } catch (error) {
    console.log("updateDetailTugas Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const deleteDetailTugas = async (req, res) => {
  try {
    const { praktikan_id, tugas_id } = req.params;

    const detailTugas = await DetailTugas.findOne({
      where: {
        praktikan_id: praktikan_id,
        tugas_id: tugas_id,
      },
    });

    if (!detailTugas) {
      let response = {
        error: "Data tidak ditemukan",
      };
      res.status(404).json(response); // Menggunakan status 404 untuk Not Found
    } else {
      await detailTugas.destroy();

      let response = {
        success: "Data berhasil dihapus",
      };
      res.status(200).json(response); // Menggunakan status 200 untuk OK
    }
  } catch (error) {
    console.log("deleteDetailTugas Error + ", error);
    res.status(500).json({ error: err }); // Menggunakan status 500 untuk Internal Server Error
  }
};

const praktikanTask = async (req, res) => {
  try {

    const test = req.user.user.praktikan_id
    if (!test) {
      res.status(403).json({ message: "anda bukan praktikan" })
    } else {
      const task = await DetailTugas.findAll({
        include: [{
          model: Tugas,
          attributes: ['judul', 'file', 'deadline', 'deskripsi']
        }],
        where: {
          praktikan_id: test
        }
      })

      res.status(201).json(task)
    }
  } catch (error) {
    console.log("deleteDetailTugas Error + ", error);
    res.status(500).json({ error: err });
  }
}

const submitLaporan = async (req, res) => {
  try {
    const tugas_id = req.params.tugas_id
    const laporan = req.file.filename
    const praktikan_id = req.user.user.praktikan_id

    const tugas = await DetailTugas.findOne({
      where: {
        praktikan_id: praktikan_id,
        tugas_id: tugas_id
      }
    })

    if (!tugas) {
      res.status(404).json({ error: "data tidak ditemukan" })
    } else {

      tugas.laporan = laporan;
      await tugas.save()
      let response = {
        success: "Data berhasil diupdate",
        data: tugas,
      };
      res.status(201).json(response)
    }

  } catch (error) {
    console.log("deleteDetailTugas Error + ", error);
    res.status(500).json({ error: err });
  }
}
module.exports = { submitLaporan, praktikanTask, getAllDetailTugas, createDetailTugas, updateDetailTugas, deleteDetailTugas };
