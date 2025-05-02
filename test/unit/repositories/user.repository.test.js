const UserRepository = require('../../../src/repositories/user.repository');
const User = require('../../../src/models/user.model');

jest.mock('../../../src/models/user.model');

describe('UserRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUsername', () => {
    it('should return a user if username exists', async () => {
      const mockUser = { UniqueID: 1, Username: 'john_doe' };
      User.findOne.mockResolvedValue(mockUser);

      const result = await UserRepository.findByUsername('john_doe');

      expect(User.findOne).toHaveBeenCalledWith({ where: { Username: 'john_doe' } });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await UserRepository.findByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const mockUserData = { Username: 'new_user', Password: 'hashed', Name: 'New User' };
      const mockCreatedUser = { UniqueID: 2, ...mockUserData };

      User.create.mockResolvedValue(mockCreatedUser);

      const result = await UserRepository.create(mockUserData);

      expect(User.create).toHaveBeenCalledWith(mockUserData);
      expect(result).toEqual(mockCreatedUser);
    });
  });
});
