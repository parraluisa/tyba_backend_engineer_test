/**
 * UserRepository: This class is a repository responsible for accessing and manipulating User data in the database.
 * 
 * Methods:
 * - {@link UserRepository.findByUsername}
 * - {@link UserRepository.create}
 * 
 *  Dependencies:
 * - User model is used to handle the return data of the methods.
 */


const User = require('../models/user.model');

class UserRepository {

  /**
   * findByUsername: Asynchronously retrieves a user from the database based on the provided username.
   *
   * @param {string} username - The username to search for.
   * @returns {Promise<User|null>} A Promise that resolves to the User object if found, or null if not.
   */
  static async findByUsername(username) {
    return await User.findOne({ where: { Username: username } });
  }


  /**
   * create: Asynchronously creates a new user record in the database.
   *
   * @param {object} userData - An object containing the data for the new user.
   * @returns {Promise<User>} A Promise that resolves to the newly created User object.
   */
  static async create(userData) {
    return await User.create(userData);
  }

}

module.exports = UserRepository;