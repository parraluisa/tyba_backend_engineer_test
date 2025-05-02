/**
 * AuthController: Handles user authentication actions such as registration, login, and logout.
 *
 * Methods:
 *  - {@link AuthController.register}
 *  - {@link AuthController.logIn}
 *  - {@link AuthController.logOut}
 *
 * Dependencies:
 * - AuthService: Handles authentication logic.
 * - TransactionService: Logs authentication-related transactions.
 * - ActionTypes: Enum of action categories (e.g., AUTH).
 */

const jwt = require('jsonwebtoken');
const AuthService = require('../services/auth.service');
const TransactionService = require('../services/transaction.service');
const ActionTypes = require('../models/transaction.enum');

class AuthController {
  
  /**
   * register: Registers a new user, then logs the registration as a transaction.
   * Responds with success message or error if registration fails.
   *
   * @param {Object} req - Express request object containing user data.
   * @param {Object} res - Express response object for sending HTTP responses.
   */
  static async register(req, res) {
    const { name, username, password } = req.body;
    const time = new Date();

    try {
      const newUser = await AuthService.register(name, username, password);

      await TransactionService.save({
        userId: newUser.id || newUser.uniqueId,
        timeStamp: time,
        actionType: ActionTypes.AUTH,
        endpoint: req.originalUrl,
        parameters: req.body,
        statusCode: 201,
        response: { message: 'User registered successfully' }
      });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);

      await TransactionService.save({
        userId: null,
        timeStamp: time,
        actionType: ActionTypes.AUTH,
        endpoint: req.originalUrl,
        parameters: req.body,
        statusCode: error.statusCode || 500,
        response: { error: error.message }
      });

      res.status(error.statusCode || 500).json({ error: error.message || 'Registration failed.' });
    }
  }

  /**
   * logIn: Logs in a user by validating credentials, issuing a token, setting a cookie, and logging the action as a transaction.
   *
   * @param {Object} req - Express request object containing credentials.
   * @param {Object} res - Express response object for sending HTTP responses.
   */
  static async logIn(req, res) {
    const { username, password } = req.body;
    const time = new Date();

    try {
      const token = await AuthService.logIn(username, password);
      await AuthService.saveToken(token);

      // Set JWT as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000 // 2 hours
      });

      await TransactionService.save({
        userId: null, // Can optionally decode token to get userId
        timeStamp: time,
        actionType: ActionTypes.AUTH,
        endpoint: req.originalUrl,
        parameters: req.body,
        statusCode: 200,
        response: { message: 'User logged in successfully' }
      });

      res.status(200).json({ message: 'User successfully authenticated' });
    } catch (error) {
      console.error('Error logging in user:', error);

      await TransactionService.save({
        userId: null,
        timeStamp: time,
        actionType: ActionTypes.AUTH,
        endpoint: req.originalUrl,
        parameters: req.body,
        statusCode: error.statusCode || 500,
        response: { error: error.message }
      });

      res.status(error.statusCode || 500).json({ error: error.message || 'Login failed.' });
    }
  }

    /**
   * logOut: Logs out a user by clearing the token cookie, removing the token from storage, and logging the action as a transaction.
   *
   * @param {Object} req - Express request object containing token in cookies or headers.
   * @param {Object} res - Express response object for sending HTTP responses.
   * @returns {void}
   */
  static async logOut(req, res) {
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      return res.status(400).json({ error: 'No token provided for logout' });
    }

    const time = new Date();
    let userId = null;

    try {
      // Decode token to extract user ID (if still valid)
      const decoded = jwt.decode(token);
      userId = decoded?.id || null;

      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      await AuthService.logOut(token);

      await TransactionService.save({
        userId,
        timeStamp: time,
        actionType: ActionTypes.AUTH,
        endpoint: req.originalUrl,
        parameters: null,
        statusCode: 200,
        response: { message: 'User successfully logged out' }
      });

      res.status(200).json({ message: 'User successfully logged out' });
    } catch (error) {
      console.error('Error logging out user:', error);

      await TransactionService.save({
        userId,
        timeStamp: time,
        actionType: ActionTypes.AUTH,
        endpoint: req.originalUrl,
        parameters: null,
        statusCode: 500,
        response: { error: error.message }
      });

      res.status(500).json({ error: 'Failed to log out' });
    }
  }
}

module.exports = AuthController;
