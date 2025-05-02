/**
 * ActionTypes: This object defines the different types of actions that can be recorded
 * in the application's transaction log. 
 *
 * Properties:
 * - AUTH: Represents authentication-related actions (e.g., login, logout).
 * - REST_SEARCH: Represents restaurant searches-related actions.
 * - TRANSACTION: Represents general transaction-related actions within the application.
 *
 */

const ActionTypes = {
    AUTH: 'AUTH',
    REST_SEARCH: 'REST_SEARCH',
    TRANSACTION: 'TRANSACTION',
};

module.exports = ActionTypes;