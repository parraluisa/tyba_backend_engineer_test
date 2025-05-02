const request = require('supertest');
const jwt = require('jsonwebtoken');
const AuthController = require('../../../src/controllers/auth.controller');
const AuthService = require('../../../src/services/auth.service');
const TransactionService = require('../../../src/services/transaction.service');

jest.mock('../../../src/services/auth.service');
jest.mock('../../../src/services/transaction.service');
jest.mock('jsonwebtoken');

describe('AuthController', () => {

  
  describe('POST /register', () => {
    it('should successfully register a user', async () => {
      const mockRequest = {
        body: { name: 'Laura Gomez', username: 'lau64', password: '9&M2sMKGTfEU@2' }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      AuthService.register.mockResolvedValue({
        id: '12345',
        uniqueId: '12345',
        username: 'lau64',
        name: 'Laura Gomez'
      });

      TransactionService.save.mockResolvedValue();

      await AuthController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
      expect(TransactionService.save).toHaveBeenCalledWith(expect.objectContaining({
        userId: '12345',
        statusCode: 201,
        response: { message: 'User registered successfully' }
      }));
    });

    it('should return an error when registration fails', async () => {
      const mockRequest = {
        body: { name: '', username: '', password: '' }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const error = new Error('Name, username, and password are required.');
      error.statusCode = 400;
      AuthService.register.mockRejectedValue(error);

      await AuthController.register(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Name, username, and password are required.' });
    });
  });

  
  describe('POST /login', () => {
    it('should successfully log in a user and return a token', async () => {
      const mockRequest = {
        body: { username: 'lau64', password: '9&M2sMKGTfEU@2' }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn()
      };

      const token = 'fake-jwt-token';
      AuthService.logIn.mockResolvedValue(token);
      AuthService.saveToken.mockResolvedValue();
      TransactionService.save.mockResolvedValue();

      await AuthController.logIn(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User successfully authenticated' });
      expect(mockResponse.cookie).toHaveBeenCalledWith('token', token, expect.objectContaining({
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 2 * 60 * 60 * 1000
      }));
      expect(TransactionService.save).toHaveBeenCalledWith(expect.objectContaining({
        statusCode: 200,
        response: { message: 'User logged in successfully' }
      }));
    });

    it('should return an error when login fails', async () => {
      const mockRequest = {
        body: { username: 'lau64', password: 'abc123' }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      AuthService.logIn.mockRejectedValue(error);

      await AuthController.logIn(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });


describe('POST /logout', () => {
  it('should successfully log out a user', async () => {
    const mockRequest = {
      cookies: { token: 'fake-jwt-token' },
      headers: {}
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn()
    };

    const decodedToken = { id: '12345' };
    jwt.decode.mockReturnValue(decodedToken);

    AuthService.logOut.mockResolvedValue();
    TransactionService.save.mockResolvedValue();

    await AuthController.logOut(mockRequest, mockResponse);

    expect(mockResponse.clearCookie).toHaveBeenCalledWith('token', expect.objectContaining({
      httpOnly: true,
      secure: false,
      sameSite: 'strict'
    }));
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User successfully logged out' });
    expect(TransactionService.save).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 200,
      response: { message: 'User successfully logged out' }
    }));
  });

  it('should return an error if no token is provided', async () => {
    const mockRequest = {
      cookies: {},
      headers: {}
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await AuthController.logOut(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No token provided for logout' });
  });

  it('should return an error if jwt.decode fails (invalid token)', async () => {
    const mockRequest = {
      cookies: { token: 'invalid-token' },
      headers: {}
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jwt.decode.mockReturnValue(null);

    await AuthController.logOut(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to log out' });
  });

  it('should handle errors from AuthService.logOut', async () => {
    const mockRequest = {
      cookies: { token: 'fake-jwt-token' },
      headers: {}
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn()
    };

    const decodedToken = { id: '12345' };
    jwt.decode.mockReturnValue(decodedToken);

    AuthService.logOut.mockRejectedValue(new Error('LogOut failed'));

    await AuthController.logOut(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to log out' });
    expect(TransactionService.save).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 500,
      response: { error: 'LogOut failed' }
    }));
  });

  /**it('should handle errors from TransactionService.save', async () => {
    const mockRequest = {
      cookies: { token: 'fake-jwt-token' },
      headers: {}
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn()
    };

    const decodedToken = { id: '12345' };
    jwt.decode.mockReturnValue(decodedToken);

    AuthService.logOut.mockResolvedValue();
    jest.spyOn(TransactionService, 'save').mockRejectedValue(new Error('Failed to save transaction'));

    await AuthController.logOut(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to log out' });
  });*/
});

});
