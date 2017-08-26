require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const knex = require('knex')({
  dialect: 'pg',
  connection: process.env.DATABASE_URL
})

const app = express()

app.use(bodyParser.json())

app.post('/dogs', upload.single('profile_picture'), (req, res) => {
  const { name, age } = req.body
  const dog = {
    name,
    age,
    profile_picture: req.file.filename
  }
  knex('dogs').insert(dog).then(() => res.sendStatus(201))
})

app.get('/dogs', (req, res) => {
  knex('dogs').orderBy('id', 'desc')
    .then(data => {
      res.json(data)
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log('Listening on ' + PORT))
