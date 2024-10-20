const express = require('express');
const { fetchWeatherForAllCities } = require('./src/services/weatherService');
const { processWeatherData, storeWeatherSummary } = require('./src/controllers/weatherController');
const { checkAlertConditions } = require('./src/alerts/alertService');
const DailyWeatherSummary = require('./src/models/DailyWeatherSummary');
const Weather = require('./src/models/Weather'); // Ensure this path is correct

const weatherRoutes = require('./src/routes/weatherRoutes'); // Adjust the path if necessary
const dotenv = require('dotenv');
const axios = require('axios');
const mongoose = require('mongoose');
const connectDB = require('./database'); // Make sure this is set up correctly

// Initialize dotenv to load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Use the weather routes
app.use('/', weatherRoutes); // You can change this base path if desired

// MongoDB connection
const run = async () => {
    await connectDB(); // Connect to MongoDB

    // Fetch weather data for all cities at regular intervals
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
        const weather = new Weather(data); // Ensure the Weather model is defined correctly
        await weather.save();
        console.log(`Weather data for ${data.city} saved to MongoDB.`);
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
  
          const dailySummary = new DailyWeatherSummary({
              date: startOfDay,
              avgTemp, // Ensure this matches your schema
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
  
  
    const getDominantWeather = (dailyWeatherData) => {
        const weatherCounts = {};
        dailyWeatherData.forEach(data => {
            weatherCounts[data.weather] = (weatherCounts[data.weather] || 0) + 1;
        });

        return Object.keys(weatherCounts).reduce((a, b) => weatherCounts[a] > weatherCounts[b] ? a : b);
    };

    while (true) {
        for (const city of cities) {
            await fetchWeatherData(city);
        }
        await calculateDailySummary(); // Call to calculate daily summary after fetching
        console.log('Waiting for the next fetch...');
        await new Promise((resolve) => setTimeout(resolve, 300000)); // 5 minutes
    }
};

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Call the run function to start fetching data
run();
