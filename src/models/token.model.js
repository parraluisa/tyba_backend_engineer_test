/**
 * Token: This class represents the token information to be saved in the database,
 * representing the whitelisted tokens for authentication and authorization.
 *
 * Attributes:
 * - Id: A unique identifier for each token record (UUID). This is the primary key.
 * - Token: The actual token string (String). This field cannot be null and must be unique.
 *
 *  Dependencies:
 * - Sequelize is used to define this model and interact with the 'Token' table in the database.
 */
const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const Token = sequelize.define('Token',{
    Id:{
        type: DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    Token:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    }
},{
    tableName:'Token',
    timestamps : false
}

);


module.exports = Token;