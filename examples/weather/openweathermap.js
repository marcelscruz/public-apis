/**
 * OpenWeatherMap API Example
 * 
 * This example demonstrates how to use the OpenWeatherMap API to fetch current weather data.
 * You'll need to sign up for a free API key at https://openweathermap.org/api
 */

const API_KEY = 'a49b355e8e4ca505a86132863ad9fcc9';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get current weather data for a city
 * @param {string} city - City name
 * @param {string} units - Units of measurement (metric, imperial, standard)
 * @returns {Promise<Object>} Weather data
 */
async function getCurrentWeather(city, units = 'metric') {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

/**
 * Get 5-day/3-hour forecast for a city
 * @param {string} city - City name
 * @param {string} units - Units of measurement (metric, imperial, standard)
 * @returns {Promise<Object>} Forecast data
 */
async function getForecast(city, units = 'metric') {
    try {
        const response = await fetch(
            `${BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        throw error;
    }
}

// Example usage
async function main() {
    try {
        // Get current weather for London
        const weather = await getCurrentWeather('London', 'metric');
        console.log('Current Weather in London:');
        console.log(`Temperature: ${weather.main.temp}°C`);
        console.log(`Humidity: ${weather.main.humidity}%`);
        console.log(`Weather: ${weather.weather[0].description}`);
        
        // Get 5-day forecast for London
        const forecast = await getForecast('London', 'metric');
        console.log('\n5-day Forecast for London:');
        forecast.list.forEach(item => {
            console.log(`\nDate: ${new Date(item.dt * 1000).toLocaleString()}`);
            console.log(`Temperature: ${item.main.temp}°C`);
            console.log(`Weather: ${item.weather[0].description}`);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the example
main(); 