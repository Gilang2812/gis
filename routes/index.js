var express = require('express');
var router = express.Router();

const {login} = require('../controllers/authController')
const { getAllAsisten, createAsisten, updateAsisten, deleteAsisten } = require('../controllers/asistenController');
const { getAllPraktikan, createPraktikan, updatePraktikan, deletePraktikan } = require('../controllers/praktikanController');
const { getAllTugas, createTugas, updateTugas, deleteTugas } = require('../controllers/tugasController');
const { getAllAbsen, createAbsen, updateAbsen, deleteAbsen } = require('../controllers/absenController');
const { getAllDetailAbsen, createDetailAbsen, updateDetailAbsen, deleteDetailAbsen } = require('../controllers/detailAbsenController');
const { getAllDetailTugas, createDetailTugas, updateDetailTugas, deleteDetailTugas } = require('../controllers/detailTugasController');
const multer = require('multer');
const { authenticateToken } = require('../middlewares/middleware');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images'); // Direktori penyimpanan gambar
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = new Date().getTime() + '-' + file.fieldname;
    cb(null, uniqueSuffix);
  },
});
const filter = (req, file, cb) => {
  if (
    file.mimetype === 'application/msword'||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
    storage: storage,
    fileFilter: filter
  });

router.post('/login',login)

// router.use(authenticateToken)

router.get('/detailAbsen', getAllDetailAbsen);
router.post('/detailAbsen/create', createDetailAbsen);
router.post('/detailAbsen/:praktikan_id/:absen_id/update', updateDetailAbsen);
router.post('/detailAbsen/:praktikan_id/:absen_id/delete', deleteDetailAbsen);

router.get('/detailTugas', getAllDetailTugas);
router.post('/detailTugas/create', createDetailTugas);
router.post('/detailTugas/:praktikan_id/:tugas_id/update', updateDetailTugas);
router.post('/detailTugas/:praktikan_id/:tugas_id/delete', deleteDetailTugas);

router.get('/absen', getAllAbsen);
router.post('/absen/create', createAbsen);
router.post('/absen/:absen_id/update', updateAbsen);
router.post('/absen/:absen_id/delete', deleteAbsen);


router.get('/tugas', getAllTugas);
router.post('/tugas/create', upload.single('file'),createTugas);
router.post('/tugas/:tugas_id/update', updateTugas);
router.post('/tugas/:tugas_id/delete', deleteTugas);

router.get('/praktikan', getAllPraktikan);
router.post('/praktikan/create', createPraktikan);
router.post('/praktikan/:praktikan_id/update', updatePraktikan);
router.post('/praktikan/:praktikan_id/delete', deletePraktikan);

router.get('/asisten', getAllAsisten);
router.post('/asisten/create', createAsisten);
router.post('/asisten/:asisten_id/update', updateAsisten);
router.post('/asisten/:asisten_id/delete', deleteAsisten);


module.exports = router;
