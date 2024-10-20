// src/controllers/weatherController.js
const { storeWeatherData } = require('../services/weatherService');

const processWeatherData = async (weatherDataArray) => {
    for (const weatherData of weatherDataArray) {
        await storeWeatherData(weatherData);
    }
};

const storeWeatherSummary = async (summary) => {
    // Logic to store the daily summary can be added here
};

module.exports = { processWeatherData, storeWeatherSummary };
