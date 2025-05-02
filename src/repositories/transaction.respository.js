/**
 * TransactionRepository: This class is a repository responsible for accessing and manipulating Transaction data in the database.
 * 
 * Methods:
 * - {@link TransactionRepository.create}
 * - {@link TransactionRepository.findAll}
 * 
 *  Dependencies:
 * - Transaction model is used to handle the return data of the methods.
 */

const Transaction = require('../models/transaction.model');

class TransactionRepository{

   /**
   * create: Asynchronously creates a new Transaction record in the database.
   *
   * @param {object} newTransaction - An object containing the data for the new transaction.
   * @returns {Promise<Transaction>} A Promise that resolves to the newly created Transaction object.
   */
    static async create(newTransaction){
        return await Transaction.create(newTransaction)
    }

   /**
   * findAll: Asynchronously retrieves all the Transaction records in the database.
   * 
   *@returns {Promise<Array<Transaction>>} A Promise that resolves to an array containing all Transaction objects found.
   */
    static async findAll(){
        return await Transaction.findAll();
    }
}
module.exports = TransactionRepository;