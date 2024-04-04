import express from 'express'

var cors = require('cors')

const app = express();

app.use(cors())

app.use(express.json())

app.listen(process.env.PORT)