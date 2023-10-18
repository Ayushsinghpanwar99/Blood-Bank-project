const express = require('express');
const async = require('hbs/lib/async');
const router = express.Router()
const mongoose = require('mongoose');
async function conn() {
  await mongoose.connect('mongodb://127.0.0.1:27017/BloodData')
}
conn();
const Blood = new mongoose.Schema({
  name: String,
  gen: String,
  mob: String,
  bgroup: String
});
const MyModel = mongoose.model('Blood', Blood);

router.get('/', (req, res) => {
  async function show() {
    let data = await MyModel.find();
    res.render('demo', { 'data': data })
  }
  show()
})

router.get('/admin', (req, res) => {
  res.render('admin')
})
router.post('/adminlogin', (req, res) => {
  let uid = req.body.uid;
  let pwd = req.body.pwd;
  if (uid === "admin" && pwd === "12345") {
    res.render('adminhome')
  }
  else {
    res.render('admin')
  }
})
router.get('/addreq', (req, res) => {
  res.render('addreq')
})
router.post('/addreq', (req, res) => {
  let data = {
    name: req.body.name,
    gen: req.body.gen,
    mob: req.body.mob,
    bgroup: req.body.bgroup
  }
  let d = new MyModel(data);
  d.save()
  res.redirect('/addreq')
})

router.get('/delreq', (req, res) => {
  res.render('delreq')
})
router.post('/showdata/:name', (req, res) => {
  let name = req.params.name;
  async function del() {
    let r = await MyModel.findOneAndDelete({ name: name })
    res.redirect('/showdata')
  }
  del()
}) 

router.get('/updatereq', (req, res) => {
  res.render('updatereq')
}) 
router.post('/updatereq', (req, res) => { 
  async function upd() {
    let id= req.body.id
    let name = req.body.name 
    let gen = req.body.gen
    let bgroup = req.body.bgroup
    let mob = req.body.mob
    const r = await MyModel.findOneAndUpdate({_id:id}, {
      $set: {
        name:name,
        gen: gen,
        bgroup: bgroup,
        mob: mob
      }
    })
    let data = await MyModel.find();
    res.render('showdata', { 'data': data })
  }
  upd()
})

router.get('/showdata', (_req, res) => {
  async function show() {
    let data = await MyModel.find();
    res.render('showdata', { 'data': data })
  }
  show()
})

router.get('/login', (req, res) => {
  res.render('login')    
})
module.exports = router