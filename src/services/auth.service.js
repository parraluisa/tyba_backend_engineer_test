/**AuthService: Service responsible for handling authentication logic.
 * Methods:
 * - Public:
 *      - {@link AuthService.register}
 *      - {@link AuthService.logIn}
 *      - {@link AuthService.logOut}
 *      - {@link AuthService.saveToken}
 * - Private:
 *      - {@link AuthService.validateRegisterFields}
 *      - {@link AuthService.validateLoginFields}
 * 
*  Dependencies:
 * - bcryptUtil is used for hashing and comparing passwords.
 * - jwt is used to sign the authentication token.
 * - UserRepository handles user-related database operations.
 * - TokenService manages session tokens.
 */

const bcryptUtil = require('../utils/bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');
const TokenService = require('./token.service');


class AuthService {

    /**
     * register: Registers a new user after validating input.
     * @param {string} name - User's name.
     * @param {string} username - User's chosen username.
     * @param {string} password - User's password.
     * @returns {Object} - An objetc with the information of the new user.
     * @throws {Error} - Throws error if registration fails or user already exists.
     */
    static async register(name, username, password) {
        //validation of information
        this.#validateRegisterFields({ name, username, password });

        try {
            //Check if username already exist
            const existingUser = await UserRepository.findByUsername(username);
            if (existingUser) {
                const error = new Error('Registration failed, user already exist.');
                error.statusCode = 409;
                throw error;
            }

            //encrypt the password to save it into the database
            const hashedPassword = await bcryptUtil.hashString(password);

            //Create the user
            const newUser = await UserRepository.create({
                Username: username,
                Password: hashedPassword,
                Name: name,
            });

            //Return the new user created
            return {
                uniqueId: newUser.UniqueID,
                username: newUser.Username,
                name: newUser.Name,
            };
        } catch (error) {
            console.error('AuthService register error:', error);
            error.message =error.message || 'Registration failed.';
            error.statusCode = error.statusCode || 500;
            throw error;
        }
    }

    /**
     * logIn: Logs in a user by verifying credentials and returns a JWT token.
     * @param {string} username - User's username.
     * @param {string} password - User's password.
     * @returns {string} - JWT token for authentication.
     * @throws {Error} - Throws error if authentication fails.
     */
    static async logIn(username, password) {
        //Validate fields
        this.#validateLoginFields({ username, password });
    
        try {
            //Check if the username existe on the database
            const user = await UserRepository.findByUsername(username);
            if (!user) {
                const error = new Error('Authentication failed.');
                error.statusCode = 401;
                throw error;
            }
            //Check if the password is correct
            const validPassword = await bcryptUtil.compareString(password, user.Password);
            if (!validPassword) {
                const error = new Error('Authentication failed.');
                error.statusCode = 401;
                throw error;
            }
            //Create the values to save on the token
            const payload = {
                id: user.UniqueID,
                username: user.Username,
            };
            
            //sign the token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION_TIME || '2h' });
            return token;
    
        } catch (error) {
            console.error('AuthService logIn error:', error);
            error.message = error.message || 'Login failed.';
            error.statusCode = error.statusCode || 500;
            throw error;
        }
    }
    
    /**
     * logOut: Logs out a user by deleting their session token from the databse.
     * @param {string} token - JWT token to be invalidated.
     * @throws {Error} - Throws error if logout fails.
     */
    static async logOut(token) {
        try {
            const result = await TokenService.findToken(token);
            if (result) {
                await TokenService.deleteToken(token);
            }
        } catch (error) {
            error.message = "Error while logging out";
            error.statusCode = error.statusCode || 500;
            throw error;
        }
    }

    /**
     * saveToken: Saves a user's session token to keep the whiteList of tokens updated.
     * @param {string} token - JWT token to be saved.
     * @throws {Error} - Throws error if saving the token fails.
     */
    static async saveToken(token) {
        try {
            await TokenService.saveToken(token);
        } catch (error) {
            error.message = "Problem handling authentication";
            error.statusCode = error.statusCode || 500;
            throw error;
        }
    }

    /**
     * validateRegisterFields: Validates input for user registration.
     * @param {Object} param0 - Contains name, username, and password.
     * @throws {Error} - Throws error if input is invalid.
     */
    static #validateRegisterFields({ name, username, password }) {
        if (!name || !username || !password) {
            const error = new Error('name, username and passwrod must be provided.');
            error.statusCode = 400;
            throw error;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
        if (!passwordRegex.test(password)) {
            const error = new Error('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
            error.statusCode = 400;
            throw error;
        }
    }

    /**
     * validateLoginFields: Validates input for user login.
     * @param {Object} param0 - Contains username and password.
     * @throws {Error} - Throws error if input is invalid.
     */
    static #validateLoginFields({ username, password }) {
        if (!username || !password) {
            const error = new Error('name and passwrod must be provided.');
            error.statusCode = 400;
            throw error;
        }
    }

}

module.exports = AuthService;