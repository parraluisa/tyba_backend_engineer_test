/**
 * Transaction Routes: This module defines all the routes related to transaction operations
 * 
 * Routes:
 *  - GET /All: Retrieves a list of all transactions made in the system.
 * 
 *  Dependencies:
 * - express is imported to create and configure the router.
 * - router is an instance of Express's Router, is used to define specific routes and associate them with handler functions.
 * - TransactionController module is responsible for containing the business logic that handles incoming requests to these routes.
 * 
 */
const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction.controller');

router.get('/all', TransactionController.findAll);


module.exports = router;