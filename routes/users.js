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

module.exports = router;
