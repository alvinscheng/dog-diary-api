require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const knex = require('knex')({
  dialect: 'pg',
  connection: process.env.DATABASE_URL
})

const app = express()

app.use(bodyParser.json())

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log('Listening on ' + PORT))
