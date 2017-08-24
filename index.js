require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const knex = require('knex')({
  dialect: 'pg',
  connection: process.env.DATABASE_URL
})
const upload = multer({ dest: 'uploads/' })

const app = express()

app.use(bodyParser.json())

app.post('/dogs', upload.single('picture'), (req, res) => {
  console.log(req.body)
  knex('dogs').insert(req.body).then(() => res.sendStatus(201))
})

// app.post('/users', upload.single('picture'), (req, res) => {
//   const user = snakecaseKeys(req.body)
//   if (req.file) {
//     user.picture = req.file.filename
//   }
//   users
//     .create(user)
//     .then(data => {
//       res.json(data)
//       res.sendStatus(201)
//     })
// })

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log('Listening on ' + PORT))
