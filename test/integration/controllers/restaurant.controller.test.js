const request = require('supertest');
const app = require('../../../src/app');  
const RestaurantController = require('../../../src/controllers/restaurant.controller');
const RestaurantService = require('../../../src/services/restaurant.service');
const TransactionService = require('../../../src/services/transaction.service');
const ActionTypes = require('../../../src/models/transaction.enum');


jest.mock('../../../src/services/restaurant.service');
jest.mock('../../../src/services/transaction.service');

describe('RestaurantController', () => {

 /* describe('GET /restaurant/city', () => {
    it('should return restaurants by city successfully', async () => {
      const mockCity = 'London';
      const mockResult = ['Restaurant 1', 'Restaurant 2'];

      RestaurantService.city.mockResolvedValue(mockResult);

      const response = await request(app).get(`/restaurant/city?city=${mockCity}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual(mockResult);
      expect(TransactionService.save).toHaveBeenCalledWith(expect.objectContaining({
        actionType: ActionTypes.REST_SEARCH,
        statusCode: 200,
        response: { message: mockResult }
      }));
    });

    it('should return error if city is not found', async () => {
      const mockCity = 'NonExistentCity';
      const mockError = new Error('City not found');
      mockError.statusCode = 404;

      RestaurantService.city.mockRejectedValue(mockError);

      const response = await request(app).get(`/restaurant/city?city=${mockCity}`);

      expect(response.status).toBe(404);
      expect(response.text).toBe(mockError.message);
      expect(TransactionService.save).toHaveBeenCalledWith(expect.objectContaining({
        actionType: ActionTypes.REST_SEARCH,
        statusCode: 404,
        response: { error: mockError.message }
      }));
    });
  });

  describe('GET /restaurant/coordinate', () => {
    it('should return restaurants by coordinates successfully', async () => {
      const mockLat = '-74.07349429352294';
      const mockLong = '-74.07349429352294';
      const mockResult = ['Restaurant A', 'Restaurant B'];

      RestaurantService.coordinate.mockResolvedValue(mockResult);

      const response = await request(app).get(`/restaurant/coordinate?latitud=${mockLat}&longitud=${mockLong}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual(mockResult);
      expect(TransactionService.save).toHaveBeenCalledWith(expect.objectContaining({
        actionType: ActionTypes.REST_SEARCH,
        statusCode: 200,
        response: { message: mockResult }
      }));
    });

    it('should return error if coordinates are invalid', async () => {
      const mockLat = 'invalid';
      const mockLong = 'invalid';
      const mockError = new Error('Invalid coordinates');
      mockError.statusCode = 400;

      RestaurantService.coordinate.mockRejectedValue(mockError);

      const response = await request(app).get(`/restaurant/coordinate?latitud=${mockLat}&longitud=${mockLong}`);

      expect(response.status).toBe(400);
      expect(response.text).toBe(mockError.message);
      expect(TransactionService.save).toHaveBeenCalledWith(expect.objectContaining({
        actionType: ActionTypes.REST_SEARCH,
        statusCode: 400,
        response: { error: mockError.message }
      }));
    });
  });*/

});
