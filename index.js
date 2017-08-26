require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const multer  = require('multer')
const upload = multer({ dest: 'public/uploads/' })
const cors = require('cors')
const knex = require('knex')({
  dialect: 'pg',
  connection: process.env.DATABASE_URL
})

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(cors())

app.post('/dogs', upload.single('profile_picture'), (req, res) => {
  const { name, age } = req.body
  const dog = {
    name,
    age,
    profile_picture: req.file.filename
  }
  knex('dogs').insert(dog).then(() => res.sendStatus(201))
})

app.post('/pictures/:dogId', upload.single('picture'), (req, res) => {
  const { note } = req.body
  const dog_id = req.params.dogId
  const picture = {
    picture: req.file.filename,
    note,
    dog_id,
    date
  }
  knex('pictures').insert(picture).then(() => res.sendStatus(201))
})

app.get('/dogs', (req, res) => {
  knex('dogs').orderBy('id', 'desc')
    .then(data => {
      res.json(data)
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log('Listening on ' + PORT))
