const TokenRepository = require('../../../src/repositories/token.repository');
const Token = require('../../../src/models/token.model');

jest.mock('../../../src/models/token.model');

describe('TokenRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a token', async () => {
      const mockToken = { Token: 'abc123' };
      Token.create.mockResolvedValue(mockToken);

      const result = await TokenRepository.create(mockToken);
      expect(Token.create).toHaveBeenCalledWith(mockToken);
      expect(result).toEqual(mockToken);
    });
  });

  describe('findByToken', () => {
    it('should find a token by value', async () => {
      const mockToken = { Token: 'abc123' };
      Token.findOne.mockResolvedValue(mockToken);

      const result = await TokenRepository.findByToken('abc123');
      expect(Token.findOne).toHaveBeenCalledWith({ where: { Token: 'abc123' } });
      expect(result).toEqual(mockToken);
    });

    it('should return null if token not found', async () => {
      Token.findOne.mockResolvedValue(null);

      const result = await TokenRepository.findByToken('notfound');
      expect(result).toBeNull();
    });
  });

  describe('deleteByToken', () => {
    it('should delete a token and return affected rows count', async () => {
      Token.destroy.mockResolvedValue(1);

      const result = await TokenRepository.deleteByToken('abc123');
      expect(Token.destroy).toHaveBeenCalledWith({ where: { Token: 'abc123' } });
      expect(result).toBe(1);
    });

    it('should return 0 if token not found to delete', async () => {
      Token.destroy.mockResolvedValue(0);

      const result = await TokenRepository.deleteByToken('missing-token');
      expect(result).toBe(0);
    });
  });
});
