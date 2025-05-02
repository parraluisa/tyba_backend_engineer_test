/**
 * Restaurant Routes: This module defines all the routes related to restaurant search operations
 *
 * Routes:
 * - GET /city: Retrieves a list of restaurants based on a specified city.
 *
 * - GET /coordinate: Retrieves a list of restaurants within a specified geographical coordinate.
 *
 *  Dependencies:
 * - express is imported to create and configure the router.
 * - router is an instance of Express's Router, is used to define specific routes and associate them with handler functions.
 * - RestaurantController module is responsible for containing the business logic that handles incoming requests to these routes.
 * - AutenticateToken is for request that must have authorization token
 */


const express = require('express');
const router = express.Router();
const RestaurantController = require('../controllers/restaurant.controller');
const authenticateToken = require('../middlewares/auth.middleware'); 

router.get('/city', authenticateToken, RestaurantController.city);
router.get('/coordinate', authenticateToken, RestaurantController.coordinate);


module.exports = router;