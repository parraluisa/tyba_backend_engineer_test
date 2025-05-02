const AuthService = require('../../../src/services/auth.service');
const UserRepository = require('../../../src/repositories/user.repository');
const bcryptUtil = require('../../../src/utils/bcrypt');
const TokenService = require('../../../src/services/token.service');
const jwt = require('jsonwebtoken');

jest.mock('../../../src/repositories/user.repository');
jest.mock('../../../src/utils/bcrypt');
jest.mock('../../../src/services/token.service');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    describe('register', () => {
        it('should successfully register a new user', async () => {
            const mockUser = {
                UniqueID: '12345abcd',
                Username: 'mari64',
                Name: 'Maria cardona'
            };

            UserRepository.findByUsername.mockResolvedValue(null);
            bcryptUtil.hashString.mockResolvedValue('hashedPassword123');
            UserRepository.create.mockResolvedValue(mockUser);

            const result = await AuthService.register('Maria cardona', 'mari64', 'Password1@');

            expect(result).toEqual({
                uniqueId: '12345abcd',
                username: 'mari64',
                name: 'Maria cardona'
            });
        });

        it('should throw an error if the user already exists', async () => {
            UserRepository.findByUsername.mockResolvedValue({});

            await expect(AuthService.register('Test', 'existingUser', 'Password1@')).rejects.toThrow('Registration failed, user already exist.');
        });

        it('should throw an error if password is weak', async () => {
            await expect(AuthService.register('Name', 'user', 'mari')).rejects.toThrow('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
        });
        
    });

    describe('logIn', () => {
        it('should successfully log in and return a token', async () => {
            const user = {
                UniqueID: 'abc123',
                Username: 'testuser',
                Password: 'hashedPassword'
            };

            UserRepository.findByUsername.mockResolvedValue(user);
            bcryptUtil.compareString.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mocked.jwt.token');

            const token = await AuthService.logIn('testuser', 'Password1@');
            expect(token).toBe('mocked.jwt.token');
        });

        it('should throw an error if user does not exist', async () => {
            UserRepository.findByUsername.mockResolvedValue(null);
            await expect(AuthService.logIn('nonexistent', 'Password1@')).rejects.toThrow('Authentication failed.');
        });

        it('should throw an error if password is incorrect', async () => {
            const user = {
                Username: 'testuser',
                Password: 'hashedPassword'
            };

            UserRepository.findByUsername.mockResolvedValue(user);
            bcryptUtil.compareString.mockResolvedValue(false);

            await expect(AuthService.logIn('testuser', 'WrongPassword')).rejects.toThrow('Authentication failed.');
        });
    });

    describe('logOut', () => {
        it('should delete token if it exists', async () => {
            TokenService.findToken.mockResolvedValue(true);
            TokenService.deleteToken.mockResolvedValue();

            await expect(AuthService.logOut('token')).resolves.toBeUndefined();
            expect(TokenService.deleteToken).toHaveBeenCalledWith('token');
        });
        it('should throw an error if TokenService.findToken throws', async () => {
            const mockError = new Error('DB error');
            TokenService.findToken = jest.fn().mockRejectedValue(mockError);
    
            await expect(AuthService.logOut('invalid-token')).rejects.toThrow('Error while logging out');
        });
    
        it('should throw an error if TokenService.deleteToken throws', async () => {
            TokenService.findToken = jest.fn().mockResolvedValue(true);
            TokenService.deleteToken = jest.fn().mockRejectedValue(new Error('Delete failed'));
    
            await expect(AuthService.logOut('token')).rejects.toThrow('Error while logging out');
        });
    });

    describe('saveToken', () => {
        it('should call saveToken successfully', async () => {
            TokenService.saveToken = jest.fn().mockResolvedValue();
    
            await expect(AuthService.saveToken('token')).resolves.toBeUndefined();
            expect(TokenService.saveToken).toHaveBeenCalledWith('token');
        });
    
        it('should throw an error if TokenService.saveToken fails', async () => {
            const mockError = new Error('DB error');
            TokenService.saveToken = jest.fn().mockRejectedValue(mockError);
    
            await expect(AuthService.saveToken('invalid-token')).rejects.toThrow('Problem handling authentication');
        });
    });
    


    describe('AuthService._validateRegisterFields', () => {
        it('should throw if name is missing', () => {
            expect(() => AuthService._validateRegisterFields({ username: 'user', password: 'Password1!' }))
                .toThrow('name, username and passwrod must be provided.');
        });

        it('should throw if password is weak', () => {
            expect(() => AuthService._validateRegisterFields({ name: 'Test', username: 'user', password: 'weak' }))
                .toThrow('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
        });

        it('should not throw if valid input is provided', () => {
            expect(() =>
                AuthService._validateRegisterFields({
                    name: 'Test',
                    username: 'user',
                    password: 'Password1!',
                })
            ).not.toThrow();
        });
    });

    describe('AuthService._validateLoginFields', () => {
        it('should throw if name is missing', () => {
            expect(() => AuthService._validateLoginFields({ username: 'user' }))
                .toThrow('username and password must be provided.');
        });

        it('should not throw if valid input is provided', () => {
            expect(() =>
                AuthService._validateLoginFields({
                    name: 'Test',
                    username: 'user',
                    password: 'Password1!',
                })
            ).not.toThrow();
        });
    });


});
