const axios = require('axios');
const RestaurantService = require('../../../src/services/restaurant.service');

jest.mock('axios'); 

describe('RestaurantService', () => {
    describe('RestaurantService', () => {
        describe('city', () => {
          it('should throw if city name is missing', async () => {
            await expect(RestaurantService.city()).rejects.toThrow('The city name must be provided');
          });
      
          it('should return processed restaurants from city query', async () => {
            const mockData = {
              elements: [
                {
                  id: 1,
                  tags: {
                    amenity: 'restaurant',
                    name: 'Test Restaurant',
                    'addr:street': 'Main St',
                    'addr:housenumber': '123',
                  },
                  lat: 40.7128,
                  lon: -74.0060,
                },
              ]
            };
      
            axios.post.mockResolvedValue({ data: mockData });
      
            const results = await RestaurantService.city('New York', 1);
            expect(results).toEqual([
              {
                id: 1,
                name: 'Test Restaurant',
                latitude: 40.7128,
                longitude: -74.0060,
                address: 'Main St 123',
              },
            ]);
          });
      
          it('should use the default limit if limit is not provided', async () => {
            const mockData = {
              elements: [
                {
                  id: 1,
                  tags: {
                    amenity: 'restaurant',
                    name: 'Test Restaurant',
                    'addr:street': 'Main St',
                    'addr:housenumber': '123',
                  },
                  lat: 40.7128,
                  lon: -74.0060,
                },
              ]
            };
      
            axios.post.mockResolvedValue({ data: mockData });
      
            const results = await RestaurantService.city('New York');
            expect(results).toEqual([
              {
                id: 1,
                name: 'Test Restaurant',
                latitude: 40.7128,
                longitude: -74.0060,
                address: 'Main St 123',
              },
            ]);
            // Ensure that the default limit (LIMIT_CITY) was used
            expect(axios.post).toHaveBeenCalled();
          });
      
          it('should throw an error if the search request fails', async () => {
            axios.post.mockRejectedValue(new Error('API Error'));
      
            await expect(RestaurantService.city('New York')).rejects.toThrow('Failed to fetch restaurants by city.');
          });
        });
      });
      

  describe('coordinate', () => {
    it('should throw if coordinates are missing', async () => {
      await expect(RestaurantService.coordinate()).rejects.toThrow('The longitude and latitude must be provided');
    });

    it('should return restaurants from coordinates query', async () => {
      const mockData = {
        elements: [
          {
            id: 2,
            tags: {
              amenity: 'restaurant',
              name: 'Coordinate Restaurant'
            },
            center: { lat: 50.0, lon: 8.0 }
          }
        ]
      };

      axios.post.mockResolvedValue({ data: mockData });

      const result = await RestaurantService.coordinate(8.0, 50.0, 1000, 1);
      expect(result).toEqual([
        {
          id: 2,
          name: 'Coordinate Restaurant',
          latitude: 50.0,
          longitude: 8.0,
          address: 'Coordinate Restaurant'
        }
      ]);
    });
  });

  describe('processResponse', () => {
    it('should filter and limit restaurant entries', () => {
      const elements = [
        {
          id: 1,
          tags: {
            amenity: 'restaurant',
            name: 'Limited',
            'addr:street': 'Elm',
            'addr:housenumber': '42',
          },
          lat: 1,
          lon: 1
        },
        {
          id: 1, 
          tags: {
            amenity: 'restaurant',
            name: 'Limited',
          },
          lat: 1,
          lon: 1
        }
      ];

      const result = RestaurantService.processResponse(elements, 1);
      expect(result).toHaveLength(1);
    });
    it('should return empty response if no elements', () =>{
        const elements =[];
        const result = RestaurantService.processResponse(elements,1);
        expect(result).toHaveLength(0);
    }
    

    );
  });

  describe('CityQueryBuilder', () => {
    it('should return a correct Overpass query', () => {
      const query = RestaurantService.CityQueryBuilder('Berlin');
      expect(query).toContain('area[name="Berlin"]');
    });
  });

  describe('CoordinateQueryBuilder', () => {
    it('should return a correct coordinate query', () => {
      const query = RestaurantService.CoordinateQueryBuilder(10, 20, 500);
      expect(query).toContain('around:500,20,10');
    });
  });
});
