require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })
const uuid = require('uuid/v4')
const cors = require('cors')
const knex = require('knex')({
  dialect: 'pg',
  connection: process.env.DATABASE_URL
})
const AWS = require('aws-sdk')
const BUCKET_NAME = 'dog-diary'

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(cors())

app.post('/dogs', upload.single('profile_picture'), (req, res) => {
  if (!req.file) res.status(400).send('A picture is required.')
  const { name, age } = req.body
  const key = uuid()
  const dog = {
    name,
    age,
    key,
    profile_picture: req.file.originalname
  }
  knex('dogs').insert(dog).then(() => {
    s3.upload({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: req.file.buffer.toString()
    }, (err, data) => {
      if (err) throw err
      res.sendStatus(201)
    })
  })
})

app.post('/pictures/:dogId', upload.single('picture'), (req, res) => {
  const { note } = req.body
  const dog_id = req.params.dogId
  const key = uuid()
  const now = new Date()
  const date = now.toDateString()

  const picture = {
    picture: req.file.originalname,
    note,
    dog_id,
    key,
    date
  }

  knex('pictures').insert(picture).then(() => {
    s3.upload({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: req.file.buffer.toString()
    }, (err, data) => {
      if (err) throw err
      res.sendStatus(201)
    })
  })
})

app.get('/dogs', (req, res) => {
  knex('dogs').orderBy('id', 'desc')
    .then(data => {
      // const promises = []
      // data.forEach(dog => {
      //   promises.push(new Promise(resolve => {
      //     s3.getObject({
      //       Bucket: BUCKET_NAME,
      //       Key: dog.key
      //     })
      //   }))
      // })

      res.json(data)
    })
})

app.get('/pictures/:dogId', (req, res) => {
  knex('pictures')
    .where('dog_id', req.params.dogId)
    .orderBy('id', 'desc')
    .then(data => {
      res.json(data)
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log('Listening on ' + PORT))
