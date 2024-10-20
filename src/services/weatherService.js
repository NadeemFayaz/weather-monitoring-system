// src/services/weatherService.js
const axios = require('axios');
const Weather = require('../models/Weather');

const fetchWeatherForAllCities = async (cities) => {
    const weatherDataArray = [];
    for (const city of cities) {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},in&appid=${process.env.API_KEY}&units=metric`;
        try {
            const response = await axios.get(url);
            const data = response.data;

            const weatherData = {
                city: data.name,
                temp: data.main.temp,
                feels_like: data.main.feels_like,
                weather: data.weather[0].main,
                timestamp: new Date(data.dt * 1000),
            };
            weatherDataArray.push(weatherData);
            console.log(`Fetched weather data for ${city}:`, weatherData);
        } catch (error) {
            console.error(`Error fetching data for ${city}:`, error.message);
        }
    }
    return weatherDataArray;
};

const storeWeatherData = async (data) => {
    const weather = new Weather(data);
    await weather.save();
    console.log(`Weather data for ${data.city} saved to MongoDB.`);
};

module.exports = { fetchWeatherForAllCities, storeWeatherData };
