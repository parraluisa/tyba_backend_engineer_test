const TransactionService = require('../../../src/services/transaction.service');
const TransactionRepository = require('../../../src/repositories/transaction.respository');

jest.mock('../../../src/repositories/transaction.respository');

describe('TransactionService', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    const transactionData = {
      userId: 1,
      TimeStamp: new Date(),
      actionType: 'AUTH',
      endpoint: '/auth/login',
      parameters: { username: 'user1', password: 'secret' },
      statusCode: 200,
      response: { success: true }
    };

    it('should save transaction successfully', async () => {
      TransactionRepository.create.mockResolvedValue();

      await expect(TransactionService.save(transactionData)).resolves.toBeUndefined();

      expect(TransactionRepository.create).toHaveBeenCalledWith({
        UserId: 1,
        TimeStamp: transactionData.TimeStamp,
        ActionType: 'AUTH',
        EndPoint: '/auth/login',
        Parameters: JSON.stringify({ username: 'user1', password: '*****' }),
        StatusCode: '200',
        Response: JSON.stringify({ success: true }),
      });
    });

    it('should handle error during save', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      TransactionRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(TransactionService.save(transactionData)).resolves.toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to record transaction:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const mockData = [{ id: 1 }, { id: 2 }];
      TransactionRepository.findAll.mockResolvedValue(mockData);

      const result = await TransactionService.findAll();
      expect(result).toEqual(mockData);
    });

    it('should throw error if findAll fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      TransactionRepository.findAll.mockRejectedValue(new Error('DB error'));

      await expect(TransactionService.findAll()).rejects.toThrow('Failed to retrieve transactions');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to retrieve transactions:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('sanitizeData', () => {
    it('should remove sensitive fields', () => {
      const input = {
        username: 'testuser',
        password: 'myPassword123',
        token: 'abc123xyz'
      };

      const result = TransactionService.sanitizeData(input);

      expect(result).toEqual({
        username: 'testuser',
        password: '*****',
        token: '*****'
      });
    });

    it('should not modify data if no sensitive fields', () => {
      const input = { foo: 'bar' };
      const result = TransactionService.sanitizeData(input);

      expect(result).toEqual({ foo: 'bar' });
    });
  });
});
