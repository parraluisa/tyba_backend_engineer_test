/**
 * authenticateToken: Middleware to verify and validate a JWT from requests.
 * 
 *  Dependencies:
 * - Jwt is require to verify the token
 * - Token service is used to keep update the whitelist on the database
 */

const jwt = require('jsonwebtoken');
const TokenService = require('../services/token.service');


/**
 * 
 * @param {Object} req - Express request object. Expected to contain the token in cookies or headers.
 * @param {Object} res - Express response object. Used to return error responses.
 * @param {Function} next - Express next middleware function. Called if authentication succeeds.
 * @returns {Object|undefined} - Returns a 403 or 401 response if token is invalid or missing. Otherwise, continues the request.
 */
async function authenticateToken(req, res, next) {
  // Try to extract token from cookies or Authorization header
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const token = cookieToken || bearerToken;

  //In case token does not exist, 
  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify JWT and attach user payload to the request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Ensure token is in whitelist
    const isWhitelisted = await TokenService.findToken(token);
    if (!isWhitelisted) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    next();
  } catch (err) {
    // Handle token expiration: remove from whitelist if present
    if (err.name === 'TokenExpiredError') {
      const isWhitelisted = await TokenService.findToken(token);
      if (isWhitelisted) {
        await TokenService.deleteToken(token);
      }
    }

    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authenticateToken;
