/**
 * Database Configuration: This module initializes and exports a Sequelize instance for interacting with the MySQL database.
 * 
 *  Dependencies:
 * - Sequelize is the library used to interact with the database.
 * - dotenv is used to load database connection parameters from environment variables.
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = { sequelize };
