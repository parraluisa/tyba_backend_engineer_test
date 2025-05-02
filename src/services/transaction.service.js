/**
 * TransactionService: Service responsible for managing Transaction-related operations.
 *
 * Methods:
 *  - {@link TransactionService.save} 
 *  - {@link TransactionService.findAll} 
 *  - {@link TransactionService.sanitizeData} 
 *
 * Dependencies:
 * - TransactionRepository: Handles database operations for transactions.
 */
const TransactionRepository = require('../repositories/transaction.respository')

class TransactionService {

  /**
 * save: Save a transaction record to the database.
 * 
 * @param {Object} transactionData - Transaction details.
 * @param {number} transactionData.userId - ID of the user performing the action.
 * @param {Date} transactionData.TimeStamp - Timestamp of the transaction.
 * @param {string} transactionData.actionType - Type of action performed (e.g., AUTH, TRANSACTION).
 * @param {string} transactionData.endpoint - The API endpoint where the action was performed.
 * @param {Object} transactionData.parameters - Parameters sent with the request.
 * @param {number} transactionData.statusCode - HTTP status code returned.
 * @param {Object} transactionData.response - Response sent to the client.
 */
  static async save({ userId, TimeStamp, actionType, endpoint, parameters, statusCode, response }) {
    try {
      await TransactionRepository.create({
        UserId: userId,
        TimeStamp: TimeStamp,
        ActionType: actionType,
        EndPoint: endpoint,
        Parameters: JSON.stringify(this.sanitizeData(parameters)),
        StatusCode: statusCode.toString(),
        Response: JSON.stringify(response),
      });
    } catch (error) {
      console.error('Failed to record transaction:', error);
    }
  }

  /**
   * findAll: Retrieve all transactions from the database.
   * 
   * @returns {Promise<Array>} - List of all transactions.
   */
  static async findAll() {

    try {
      return await TransactionRepository.findAll();
    } catch (error) {
      console.error('Failed to retrieve transactions:', error);
      throw new Error('Failed to retrieve transactions');
    }
  }

  /**
 * Sanitize sensitive data by removing or anonymizing it.
 * 
 * @param {Object} data - The data to sanitize.
 * @returns {Object} - Sanitized data.
 */
  static sanitizeData(data) {
    const sanitizedData = { ...data };
    if (sanitizedData.password) {
      sanitizedData.password = '*****'; 
    }
    if (sanitizedData.token) {
      sanitizedData.token = '*****'; 
    }
    

    return sanitizedData;
  }

}

module.exports = TransactionService;