/**
 * TokenService: Service responsible for managing token-related operations.
 * 
 * Methods:
 *  - {@link TokenService.saveToken} - Save a token to the repository.
 *  - {@link TokenService.findToken} - Retrieve a token from the repository by its value.
 *  - {@link TokenService.deleteToken} - Delete a token from the repository by its value.
 * 
 *  Dependencies:
 * - TokenRepository is used to perform operations on the database.
 */

const TokenRepository = require('../repositories/token.repository');

class TokenService {

    /**
     * saveToken: Save a new token to the repository.
     * @param {string} token - The token to save.
     * @throws {Error} - If there is an issue saving the token to the repository.
     */
    static async saveToken(token) {
        try {
            await TokenRepository.create({ Token: token });
        } catch (error) {
            console.error("Error occurred while saving token:", error);
            throw new Error('Failed to save the token.');
        }
    }

    /**
     * findToken: Retrieve a token from the repository by its value.
     * @param {string} token - The token to find.
     * @returns {Object|null} - The token object if found, otherwise null.
     * @throws {Error} - If there is an issue retrieving the token.
     */
    static async findToken(token) {
        try {
            return await TokenRepository.findByToken(token);
        } catch (error) {
            console.error("Error occurred while finding token:", error);
            throw new Error('Failed to retrieve the token.');
        }
    }

    /**
     * deleteToken: Delete a token from the repository by its value.
     * @param {string} token - The token to delete.
     * @throws {Error} - If there is an issue deleting the token.
     */
    static async deleteToken(token) {
        try {
            await TokenRepository.deleteByToken(token);
        } catch (error) {
            console.error("Error occurred while deleting token:", error);
            throw new Error('Failed to delete the token.');
        }
    }
}

module.exports = TokenService;
