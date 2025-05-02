
const { hashString, compareString } = require('../../../src/utils/bcrypt');


jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

describe('bcrypt utility functions', () => {
  
  describe('hashString', () => {
    it('should call bcrypt.hash and return a hashed string', async () => {
      const mockHashedString = 'hashed_value';
      
      require('bcrypt').hash.mockResolvedValue(mockHashedString); 

      const result = await hashString('myPassword');
      expect(result).toBe(mockHashedString); 
      expect(require('bcrypt').hash).toHaveBeenCalledWith('myPassword', 10); 
    });
  });

  
  describe('compareString', () => {
    it('should call bcrypt.compare and return true if strings match', async () => {
      const mockComparisonResult = true;
      
      require('bcrypt').compare.mockResolvedValue(mockComparisonResult);

      const result = await compareString('myPassword', 'hashedPassword');
      expect(result).toBe(true); 
      expect(require('bcrypt').compare).toHaveBeenCalledWith('myPassword', 'hashedPassword'); 
    });

    it('should return false if the strings do not match', async () => {
      const mockComparisonResult = false;
      
      require('bcrypt').compare.mockResolvedValue(mockComparisonResult);

      const result = await compareString('myPassword', 'wrongHash');
      expect(result).toBe(false); 
      expect(require('bcrypt').compare).toHaveBeenCalledWith('myPassword', 'wrongHash'); 
    });
  });
});
