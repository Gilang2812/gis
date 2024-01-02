var express = require('express');
var router = express.Router();
var path = require('path')

const link = path.join(__dirname,'../public/pages/')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', (req, res, next)=> {
  res.sendFile(link+"login.html")
});
router.get('/asisten/index', (req, res, next)=> {
  res.sendFile(link+"asisten.html")
});
router.get('/praktikan/index', (req, res, next)=> {
  res.sendFile(link+"praktikan.html")
});
router.get('/tugas/index', (req, res, next)=> {
  res.sendFile(link+"tugas.html")
});
router.get('/absen/index', (req, res, next)=> {
  res.sendFile(link+"absen.html")
});
router.get('/absen/:praktikan_id', (req, res, next)=> {
  res.sendFile(link+"detailAbsen.html")
});
router.get('/pengumpulan/:tugas_id', (req, res, next)=> {
  res.sendFile(link+"pengumpulan.html")
});
router.get('/praktikan/absen', (req, res, next)=> {
  res.sendFile(link+"PraktikanAbsen.html")
});
router.get('/praktikan/tugas', (req, res, next)=> {
  res.sendFile(link+"TugasPraktikan.html")
});
router.get('/profile', (req, res, next)=> {
  res.sendFile(link+"profile.html")
});


module.exports = router;
