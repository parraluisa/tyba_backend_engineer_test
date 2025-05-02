const request = require('supertest');
const app = require('../../../src/app');  
const TransactionService = require('../../../src/services/transaction.service');
const TransactionRepository = require('../../../src/repositories/transaction.respository');


jest.mock('../../../src/services/transaction.service');
jest.mock('../../../src/repositories/transaction.respository');

describe('TransactionController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /transaction/all', () => {
    it('should retrieve all transactions successfully', async () => {
      
      const mockTransactions = [
        { id: 1, userId: 1, actionType: 'TRANSACTION', response: 'Success' },
        { id: 2, userId: 2, actionType: 'TRANSACTION', response: 'Success' },
      ];

    
      TransactionService.findAll.mockResolvedValue(mockTransactions);

    
      const response = await request(app).get('/transaction/all');

    
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTransactions);

    
      expect(TransactionService.findAll).toHaveBeenCalled();
      expect(TransactionService.save).toHaveBeenCalled();
    });

    it('should handle errors and return an error response', async () => {
     
      const errorMessage = 'Failed to retrieve transactions';
      const error = new Error(errorMessage);
      error.statusCode = 500;

      
      TransactionService.findAll.mockRejectedValue(error);

      
      const response = await request(app).get('/transaction/all');

      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: errorMessage });

      
      expect(TransactionService.save).toHaveBeenCalled();
    });
  });
});
