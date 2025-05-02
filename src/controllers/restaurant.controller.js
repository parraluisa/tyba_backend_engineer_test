/**
 * RestaurantController: Handles HTTP requests for fetching restaurant data based on city name or geographic coordinates.
 *
 * Methods:
 *  - {@link RestaurantController.city}      
 *  - {@link RestaurantController.coordinate} 
 *
 * Dependencies:
 * - RestaurantService: Business logic to query Overpass API.
 * - TransactionService: Logs request/response data for auditing.
 * - ActionTypes: Enum for transaction categories.
 */

const RestaurantService = require('../services/restaurant.service');
const TransactionService = require('../services/transaction.service');
const ActionTypes = require('../models/transaction.enum');

class RestaurantController {
  /**
   * city: Handles request to fetch restaurants by city name.
   * Logs the transaction and returns the results or error.
   *
   * @param {Object} req - Express request object with `city` in query params.
   * @param {Object} res - Express response object.
   */
  static async city(req, res) {
    const { city } = req.query;
    const time = new Date();
    let statusCode = 200;

    try {
      const result = await RestaurantService.city(city);

      await TransactionService.save({
        userId: req.user?.id || null,
        timeStamp: time,
        actionType: ActionTypes.REST_SEARCH,
        endpoint: req.originalUrl,
        parameters: req.query,
        statusCode,
        response: { message: result }
      });

      res.status(statusCode).json({ message: result });
    } catch (error) {
      console.error('Error accessing restaurants by city:', error);
      statusCode = error.statusCode || 500;

      await TransactionService.save({
        userId: req.user?.id || null,
        timeStamp: time,
        actionType: ActionTypes.REST_SEARCH,
        endpoint: req.originalUrl,
        parameters: req.query,
        statusCode,
        response: { error: error.message }
      });

      res.status(statusCode).send(error.message || 'Unexpected error');
    }
  }

  /**
   * coordinate: Handles request to fetch nearby restaurants using coordinates.
   * Logs the transaction and returns the results or error.
   *
   * @param {Object} req - Express request object with `latitud` and `longitud` in query params.
   * @param {Object} res - Express response object.
   */
  static async coordinate(req, res) {
    const { latitud, longitud } = req.query;
    const time = new Date();
    let statusCode = 200;

    try {
      const result = await RestaurantService.coordinate(latitud, longitud);

      await TransactionService.save({
        userId: req.user?.id || null,
        timeStamp: time,
        actionType: ActionTypes.REST_SEARCH,
        endpoint: req.originalUrl,
        parameters: req.query,
        statusCode,
        response: { message: result }
      });

      res.status(statusCode).json({ message: result });
    } catch (error) {
      console.error('Error accessing restaurants by coordinates:', error);
      statusCode = error.statusCode || 500;

      await TransactionService.save({
        userId: req.user?.id || null,
        timeStamp: time,
        actionType: ActionTypes.REST_SEARCH,
        endpoint: req.originalUrl,
        parameters: req.query,
        statusCode,
        response: { error: error.message }
      });

      res.status(statusCode).send(error.message || 'Unexpected error');
    }
  }
}

module.exports = RestaurantController;
