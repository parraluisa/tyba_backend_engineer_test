/** 
 * RestaurantService: Service responsible for handling restaurant search logic 
 * 
 * Methods:
 *  Public:
 *    - {@link RestaurantService.city} - Fetch restaurants by city name.
 *    - {@link RestaurantService.coordinate} - Fetch nearby restaurants based on coordinates.
 * 
 *  Private:
 *    - {@link RestaurantService.search} - Perform a query to the Overpass API.
 *    - {@link RestaurantService.processResponse} - Process and filter the response from Overpass API.
 *    - {@link RestaurantService.CityQueryBuilder} - Build Overpass query for searching restaurants by city.
 *    - {@link RestaurantService.CoordinateQueryBuilder} - Build Overpass query for searching restaurants around coordinates.
 * 
 *  Dependencies:
 * - axios is used to make requests to the Overpass API.
 * 
 */

const axios = require('axios');

const OVERPASS_API_URL = process.env.OVERPASS_API_URL;
const LIMIT_CITY = 10 ;
const LIMIT_COORDINATE= 10;
const RADIOUS = 1000;

class RestaurantService {

    /**
     * city: Fetch restaurants by city name.
     * @param {string} cityName - Name of the city.
     * @param {number} limit - Number of results to return.
     * @returns {Array} - List of restaurants.
     * @throws {Error} - If there is an error in fetching data.
     */
    static async city(cityName, limit) { 
        if (!cityName) {
            throw new Error('The city name must be provided');
        }
        if(!limit){
            limit = LIMIT_CITY;
        }
        try {
            const overpassQuery = this.CityQueryBuilder(cityName);
            const response = await this.search(overpassQuery);
            return this.processResponse(response.elements, limit);
        } catch (error) {
            console.error('Error fetching restaurants by city:', error);
            throw new Error('Failed to fetch restaurants by city.');
        }
    }

    /**
     * coordinate: Fetch nearby restaurants based on coordinates.
     * @param {number} lon - Longitude.
     * @param {number} lat - Latitude.
     * @param {number} radius - Search radius in meters.
     * @param {number} limit - Number of results to return.
     * @returns {Array} - List of nearby restaurants.
     * @throws {Error} - If there is an error in fetching data.
     */
    static async coordinate(lon, lat, radius, limit ) {
        if (!lon || !lat) {
            throw new Error('The longitude and latitude must be provided');
        }
        if(!radius){
            radius = RADIOUS;

        }
        if(!limit){
            limit= LIMIT_COORDINATE;
        }

        try {
            const overpassQuery = this.CoordinateQueryBuilder(lon, lat, radius);
            const response = await this.search(overpassQuery);
            return this.processResponse(response.elements, limit);
        } catch (error) {
            console.error('Error fetching nearby restaurants:', error);
            throw new Error('Failed to fetch nearby restaurants.');
        }
    }

    /**
     * search: Perform a query to the Overpass API.
     * @param {string} query - Overpass query.
     * @returns {Object} - Response from the API.
     * @throws {Error} - If there is an error with the API request.
     */
    static async search(query) {
        try {
            const response = await axios.post(OVERPASS_API_URL, query);
            return response.data;
        } catch (error) {
            console.error('Error during Overpass API request:', error);
            throw new Error('Error communicating with the Overpass API.');
        }
    }


    /**
     * processResponse: Process Overpass response and filter valid restaurants.
     * @param {Array} elements - Response elements.
     * @param {number} limit - Number of results to return.
     * @returns {Array} - Processed list of restaurants.
     */
    static processResponse(elements, limit) {
        const uniqueRestaurants = new Map();

        if (!elements || elements.length === 0) {
            console.warn("No elements found in Overpass response.");
            return [];
        }

        elements.forEach(element => {
            if (element.tags && element.tags.amenity === 'restaurant') {
                const id = element.id;
                if (!uniqueRestaurants.has(id)) {
                    let address = '';
                    if (element.tags['addr:street'] && element.tags['addr:housenumber']) {
                        address = `${element.tags['addr:street']} ${element.tags['addr:housenumber']}`;
                    } else if (element.tags.name) {
                        address = element.tags.name;
                    }

                    uniqueRestaurants.set(id, {
                        id: id,
                        name: element.tags.name || 'No name',
                        latitude: element.lat || (element.center ? element.center.lat : null),
                        longitude: element.lon || (element.center ? element.center.lon : null),
                        address: address,
                    });
                }
            }
        });

        // Filter and apply the limit
        let filteredRestaurants = Array.from(uniqueRestaurants.values()).filter(
            restaurant => restaurant.latitude !== null && restaurant.longitude !== null
        );

        return filteredRestaurants.slice(0, limit); 
    }
    /**
     * CityQueryBuilder: Build Overpass query to search for restaurants by city.
     * @param {string} cityName - Name of the city.
     * @returns {string} - Overpass query for the city.
     */
    static CityQueryBuilder(cityName) {
        return `
            [out:json][timeout:30];
            area[name="${cityName}"];
            (
                node["amenity"="restaurant"](area);
                way["amenity"="restaurant"](area);
                relation["amenity"="restaurant"](area);
            );
            out center;
        `;
    }

    /**
     * CoordinateQueryBuilder: Build Overpass query to search for restaurants around coordinates.
     * @param {number} lon - Longitude.
     * @param {number} lat - Latitude.
     * @param {number} radius - Search radius.
     * @returns {string} - Overpass query for the coordinates.
     */
    static CoordinateQueryBuilder(lon, lat, radius) {
        return `
            [out:json][timeout:30];
            (
                node(around:${radius},${lat},${lon})["amenity"="restaurant"];
                way(around:${radius},${lat},${lon})["amenity"="restaurant"];
                relation(around:${radius},${lat},${lon})["amenity"="restaurant"];
            );
            out center;
        `;
    }
}



module.exports = RestaurantService;