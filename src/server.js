/**
 * server.js handles the configuration to create a REST API server with Express.js.
 * Its main function is 
 *  - To set up the necessary middleware (CORS, JSON parsing)
 *  - Define the API routes related to authentication, user places search and user transactions
 *  - Connect to the Sequelize database, and start the server.
 */


const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database/database');
const cookieParser = require('cookie-parser');



require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
require('./models/user.model');
require('./models/token.model');

const restaurantRoutes = require('./routes/restaurant.routes');

const transactionRoutes = require('./routes/transaction.routes');





const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Available routes
app.use('/auth', authRoutes);
app.use('/restaurant', restaurantRoutes);
app.use('/transaction', transactionRoutes);

//Function to start the server
async function start() {
  try {
    await sequelize.sync(); 
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(' Error starting server:', err);
  }
}

start();