const TokenService = require('../../../src/services/token.service');
const TokenRepository = require('../../../src/repositories/token.repository');

jest.mock('../../../src/repositories/token.repository');

describe('TokenService', () => {
  describe('saveToken', () => {
    it('should save token successfully', async () => {
      TokenRepository.create.mockResolvedValue();

      await expect(TokenService.saveToken('valid-token')).resolves.toBeUndefined();
      expect(TokenRepository.create).toHaveBeenCalledWith({ Token: 'valid-token' });
    });

    it('should throw error when saving token fails', async () => {
      TokenRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(TokenService.saveToken('bad-token')).rejects.toThrow('Failed to save the token.');
    });
  });

  describe('findToken', () => {
    it('should find token successfully', async () => {
      const mockToken = { Token: 'valid-token' };
      TokenRepository.findByToken.mockResolvedValue(mockToken);

      const result = await TokenService.findToken('valid-token');
      expect(result).toEqual(mockToken);
      expect(TokenRepository.findByToken).toHaveBeenCalledWith('valid-token');
    });

    it('should throw error when finding token fails', async () => {
      TokenRepository.findByToken.mockRejectedValue(new Error('DB error'));

      await expect(TokenService.findToken('bad-token')).rejects.toThrow('Failed to retrieve the token.');
    });
  });

  describe('deleteToken', () => {
    it('should delete token successfully', async () => {
      TokenRepository.deleteByToken.mockResolvedValue();

      await expect(TokenService.deleteToken('valid-token')).resolves.toBeUndefined();
      expect(TokenRepository.deleteByToken).toHaveBeenCalledWith('valid-token');
    });

    it('should throw error when deleting token fails', async () => {
      TokenRepository.deleteByToken.mockRejectedValue(new Error('DB error'));

      await expect(TokenService.deleteToken('bad-token')).rejects.toThrow('Failed to delete the token.');
    });
  });
});
