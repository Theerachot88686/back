require('dotenv').config()
const express = require('express')
const cors = require('cors')
const notFound = require('./middlewares/notFound')
const errorMiddleware = require('./middlewares/error')
const authRoute = require('./routes/auth-routes')
const fieldRoute = require('./routes/field-routes')
const booking  = require('./routes/booking-touter')

const app = express()

app.use(cors())
app.use(express.json())

// service
app.use('/auth', authRoute)

app.use('/field',fieldRoute)
app.use('/booking',booking)

// notFound
app.use( notFound )

// error
app.use(errorMiddleware)

let port = process.env.PORT || 8000
app.listen(port, ()=> console.log('Server on Port :', port))