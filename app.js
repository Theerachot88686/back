require('dotenv').config();
const express = require('express');
const cors = require('cors');
const notFound = require('./middlewares/notFound');
const errorMiddleware = require('./middlewares/error');
const authRoute = require('./routes/auth-routes');
const fieldRoute = require('./routes/field-routes');
const bookingRoute = require('./routes/booking-routes');

const app = express();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Database connection error:', err));

app.use(cors());
app.use(express.json());

// service
app.use('/auth', authRoute);
app.use('/field', fieldRoute);
app.use('/booking', bookingRoute);

// notFound
app.use(notFound);

// error
app.use(errorMiddleware);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log('Server on Port:', port));
