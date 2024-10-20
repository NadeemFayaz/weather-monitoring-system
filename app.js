const { fetchWeatherForAllCities } = require('./src/services/weatherService');
const { processWeatherData, storeWeatherSummary } = require('./src/controllers/weatherController');
const { checkAlertConditions } = require('./src/alerts/alertService');
const { interval } = require('./config/config');

require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const connectDB = require('./database');
const Weather = require('./src/models/Weather'); // Ensure this points to your Weather model
const DailySummary = require('./src/models/DailySummary'); // Import the DailySummary model

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

const fetchWeatherData = async (city) => {
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

        console.log(`Fetched weather data for ${city}:`, weatherData);
        await storeWeatherData(weatherData);
    } catch (error) {
        console.error(`Error fetching data for ${city}:`, error.message);
    }
};

const storeWeatherData = async (data) => {
    const weather = new Weather(data);
    await weather.save();
    console.log(`Weather data for ${data.city} saved to MongoDB.`);
};

const getDominantWeather = (dailyWeatherData) => {
    const weatherCounts = {};
    dailyWeatherData.forEach(data => {
        weatherCounts[data.weather] = (weatherCounts[data.weather] || 0) + 1;
    });

    return Object.keys(weatherCounts).reduce((a, b) => weatherCounts[a] > weatherCounts[b] ? a : b);
};

const calculateDailySummary = async () => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const dailyWeatherData = await Weather.find({
        timestamp: { $gte: startOfDay, $lt: endOfDay }
    });

    if (dailyWeatherData.length > 0) {
        const avgTemp = dailyWeatherData.reduce((sum, data) => sum + data.temp, 0) / dailyWeatherData.length;
        const maxTemp = Math.max(...dailyWeatherData.map(data => data.temp));
        const minTemp = Math.min(...dailyWeatherData.map(data => data.temp));
        const dominantWeather = getDominantWeather(dailyWeatherData);

        const dailySummary = new DailySummary({
            date: startOfDay,
            avgTemp,
            maxTemp,
            minTemp,
            dominantWeather,
        });

        await dailySummary.save();
        console.log(`Daily summary for ${startOfDay.toISOString().slice(0, 10)} saved to MongoDB.`);
    } else {
        console.log('No weather data available for today to calculate summary.');
    }
};

const run = async () => {
    await connectDB(); // Connect to MongoDB
    while (true) {
        for (const city of cities) {
            await fetchWeatherData(city);
        }
        await calculateDailySummary(); // Call to calculate daily summary after fetching
        console.log('Waiting for the next fetch...');
        await new Promise((resolve) => setTimeout(resolve, 300000)); // 5 minutes
    }
};

run();
