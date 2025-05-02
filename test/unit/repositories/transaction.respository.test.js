const TransactionRepository = require('../../../src/repositories/transaction.respository');
const Transaction = require('../../../src/models/transaction.model');

jest.mock('../../../src/models/transaction.model');

describe('TransactionRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const mockTransaction = { id: 1, ActionType: 'AUTH' };
      Transaction.create.mockResolvedValue(mockTransaction);

      const result = await TransactionRepository.create(mockTransaction);

      expect(Transaction.create).toHaveBeenCalledWith(mockTransaction);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const mockTransactions = [
        { id: 1, ActionType: 'AUTH' },
        { id: 2, ActionType: 'TRANSACTION' }
      ];
      Transaction.findAll.mockResolvedValue(mockTransactions);

      const result = await TransactionRepository.findAll();

      expect(Transaction.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTransactions);
    });

    it('should return empty array if no transactions found', async () => {
      Transaction.findAll.mockResolvedValue([]);

      const result = await TransactionRepository.findAll();

      expect(result).toEqual([]);
    });
  });
});
