/**
 * User: This class represents the user information stored in the database.
 *
 * Attributes:
 * - UniqueID: A unique identifier for each user (UUID). This is the primary key.
 * - Username: The unique username of the user (String). This field cannot be null.
 * - Name: The full name of the user (String). This field cannot be null.
 * - Password: The user's password (String). This field cannot be null.
 *
 * Constraints:
 * - UniqueID is the primary key for this table.
 * - The 'Username' field must be unique across all user records.
 * - The 'Username', 'Name', and 'Password' fields are required and cannot be null.
 *
 *  Dependencies:
 * - Sequelize is used to define this model and interact with the 'User' table in the database.
 */


const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const User = sequelize.define('User', {
  UniqueID: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  Username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  }
}, {
  tableName: 'User',
  timestamps: false
});

module.exports = User;
