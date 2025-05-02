/**
 * bcrypt is a utility for handling passwords or data that needs to be encrypted.
 * 
 * Methods:
 * - hashString: Generates a secure hash from a string.
 * - compareString: Compares a plain string with a hashed string to verify if they match.
 * 
 * Dependencies:
 * - bcrypt is used access the encryption methods.
 * 
 */
const bcrypt = require('bcrypt');


/**
 * hashString:  a string using bcrypt with a specified number of salt rounds.
 * 
 * @param {string} string - The value to be hashed or encrypted.
 * @param {number} [saltRounds=10] - The number of salt rounds (default is 10).
 * @returns {Promise<string>} - A promise that resolves to the hashed string.
 */
async function hashString(string, saltRounds = 10) {
  return await bcrypt.hash(string, saltRounds);
}

/**
 * compareString: Compares a plain string with a hashed string to check if they match.
 * 
 * @param {string} plainString - The plain text string to compare.
 * @param {string} hashedString - The hashed string to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the values match, false if they don't.
 */
async function compareString(plainString, hashedString) {
  return await bcrypt.compare(plainString, hashedString);
}

module.exports = { hashString, compareString };