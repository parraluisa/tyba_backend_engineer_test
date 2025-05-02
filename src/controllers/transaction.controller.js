/**
 * TransactionController: Handles requests related to transaction records.
 *
 * Methods:
 *  - {@link TransactionController.findAll} Retrieve all transactions stored in the system.
 *
 * Dependencies:
 * - TransactionService: Handles business logic for fetching and saving transactions.
 * - ActionTypes: Enum defining transaction categories.
 */

const TransactionService = require('../services/transaction.service');
const ActionTypes = require('../models/transaction.enum');

class TransactionController {
  /**
   * findAll: Handles the retrieval of all system transactions.
   * Logs the action as a transaction and returns the result or error.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async findAll(req, res) {
    const time = new Date();
    const userId = req.user?.id || null;

    try {
      const result = await TransactionService.findAll();

      await TransactionService.save({
        userId,
        timeStamp: time,
        actionType: ActionTypes.TRANSACTION,
        endpoint: req.originalUrl,
        parameters: null,
        statusCode: 200,
        response: { message: 'Transactions retrieved successfully' }
      });

      res.status(200).json(result);
    } catch (error) {
      await TransactionService.save({
        userId,
        timeStamp: time,
        actionType: ActionTypes.TRANSACTION,
        endpoint: req.originalUrl,
        parameters: null,
        statusCode: error.statusCode || 500,
        response: { error: error.message }
      });

      res.status(error.statusCode || 500).json({ error: error.message || 'Failed to retrieve transactions' });
    }
  }

  
}

module.exports = TransactionController;
