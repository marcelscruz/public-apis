# API Examples

This directory contains example code for using various APIs listed in the main repository. Each example demonstrates how to interact with a specific API using common programming languages.

## OpenWeatherMap API Example

The OpenWeatherMap example demonstrates how to:
- Fetch current weather data for a city
- Get 5-day/3-hour forecast data
- Handle API responses and errors

### Setup

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Replace `YOUR_API_KEY` in the example code with your actual API key
3. Run the example using Node.js:
   ```bash
   node weather/openweathermap.js
   ```

### Features

- Current weather data including temperature, humidity, and weather description
- 5-day/3-hour forecast data
- Support for different units of measurement (metric, imperial, standard)
- Error handling and response validation

### Example Output

```
Current Weather in London:
Temperature: 15.5°C
Humidity: 65%
Weather: scattered clouds

5-day Forecast for London:
Date: 4/28/2023, 12:00:00 PM
Temperature: 16.2°C
Weather: light rain

Date: 4/28/2023, 3:00:00 PM
Temperature: 17.1°C
Weather: scattered clouds
...
```

## Contributing

Feel free to add more examples for other APIs in the repository. When adding new examples:

1. Create a new directory for the API category if it doesn't exist
2. Add your example code with clear documentation
3. Update this README with information about your example
4. Follow the existing code style and documentation format 