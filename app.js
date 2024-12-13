require('dotenv').config();
const express = require('express');
const cors = require('cors');
const notFound = require('./middlewares/notFound');
const errorMiddleware = require('./middlewares/error');
const authRoute = require('./routes/auth-routes');
const fieldRoute = require('./routes/field-routes');
const bookingRoute = require('./routes/booking-touter');
const pullRoute = require('./routes/pull-router')

const app = express();


app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoute);
app.use('/field', fieldRoute);
app.use('/booking', bookingRoute);
app.use('/get', pullRoute)
// Middleware
app.use(notFound);
app.use(errorMiddleware);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
