/**
 * Transaction: This class represents the transactions recorded within the application.
 *
 * Attributes:
 * - Id: A unique identifier for each transaction (UUID). This is the primary key.
 * - TimeStamp: The date and time when the transaction occurred (DATE). Defaults to the current time.
 * - UserId: The unique identifier of the user who initiated the transaction (UUID). Allows null values.
 * - ActionType: The type of action performed during the transaction (String). Cannot be null.
 * - EndPoint: The specific endpoint or resource accessed during the transaction (String). Cannot be null.
 * - Parameters: Additional parameters or data associated with the transaction (TEXT).
 * - StatusCode: The HTTP status code resulting from the transaction (String). Cannot be null.
 * - Response: The response data or message received after the transaction (TEXT). Cannot be null.
 *
 * Restrictions:
 * - Id is the primary key for this table.
 * - There is a relationship established with the 'User' model via the 'UserId' foreign key.
 *
 *  Dependencies:
 * - Sequelize is used to define this model and interact with the 'Transaction' table in the database.
 * - The 'User' model is associated with this model to represent the user who performed the transaction, using the 'UserId' foreign key.
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require("../database/database");
const User = require('./user.model'); 

const Transaction = sequelize.define('Transaction', {
    Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    TimeStamp: {
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW, 
        allowNull: true,
        unique: false
    },
    UserId: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: false
    },
    ActionType: {
        type: DataTypes.STRING, 
        allowNull: false,
        unique: false
    },
    EndPoint: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    Parameters: {
        type: DataTypes.TEXT
    },
    StatusCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    Response: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
    }

}, {
    tableName: 'Transaction',
    timestamps: false
});


Transaction.belongsTo(User, { foreignKey: 'UserId', as: 'User' });

module.exports = Transaction;