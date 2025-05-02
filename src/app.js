

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const transactionRoutes = require('./routes/transaction.routes');

require('./models/user.model');
require('./models/token.model');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/restaurant', restaurantRoutes);
app.use('/transaction', transactionRoutes);

module.exports = app;
