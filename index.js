require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const knex = require('knex')({
  dialect: 'pg',
  connection: process.env.DATABASE_URL
})

const app = express()

app.use(bodyParser.json())

app.post('/dogs', (req, res) => {
  console.log(req.body)
  knex('dogs').insert(req.body).then(() => res.sendStatus(201))
})

app.get('/dogs', (req, res) => {
  knex('dogs').orderBy('id', 'desc')
    .then(data => {
      res.json(data)
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log('Listening on ' + PORT))
