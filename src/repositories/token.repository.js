/**
 * TokenRepository: This class is a repository responsible for accessing and manipulating Token data in the database.
 * 
 * Methods:
 * - {@link TokenRepository.create}
 * - {@link TokenRepository.findByToken}
 * - {@link TokenRepository.deleteByToken}
 * 
 *  Dependencies:
 * - Token model is used to handle the return data of the methods.
 */

const Token = require('../models/token.model');



class TokenRepository{

    /**
   * create: Asynchronously creates a new token record in the database.
   *
   * @param {object} token - An object containing the data for the new user.
   * @returns {Promise<User>} A Promise that resolves to the newly created Token object.
   */
    static async create(token){
        return await Token.create(token);
    }

    /**
   * findByToken: Asynchronously retrieves a token from the database based on the provided token.
   *
   * @param {string} token - The token to search for.
   * @returns {Promise<Token|null>} A Promise that resolves to the Token object if found, or null if not.
   */
    static async findByToken(token){
        return await Token.findOne({where:{Token:token}});

    }

    /**
     * deleteByToken: Asynchronously deletes a token record from the database based on the provided token.
     *
     * @param {string} token - The token string of the record to be deleted.
     * @returns {Promise<number>} A Promise that resolves to the number of rows affected (deleted).
     * This will typically be 1 if the token was found and deleted, or 0 if no matching token was found.
     */
    static async deleteByToken(token){
        return await Token.destroy({where:{Token:token}});
    }

}

module.exports = TokenRepository;