/**
 * Authentication Routes: This module defines all the routes related to authentication and auhtorization operations
 *
 * Routes:
 * - POST /register: Allows a new user to register in the system.
 *
 * - POST /login: Allows an existing user to log in to the system.
 * 
 * - POST /logout: Allows an authenticated user to log out of the system.
 *
 *  Dependencies:
 * - express is imported to create and configure the router.
 * - router is an instance of Express's Router, is used to define specific routes and associate them with handler functions.
 * - AuthController module is responsible for containing the business logic that handles incoming requests to these routes.
 * - token is for request that must have authorization token
 */



const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const Token = require('../middlewares/auth.middleware');

router.post('/register', AuthController.register);
router.post('/login', AuthController.logIn);
router.post('/logout', Token, AuthController.logOut);

module.exports = router;