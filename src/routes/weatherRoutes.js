// src/routes/weatherRoutes.js
const express = require('express');
const Weather = require('../models/Weather'); // Adjust path if necessary
const DailyWeatherSummary = require('../models/DailyWeatherSummary'); // Adjust path if necessary
const router = express.Router();

// Endpoint to get current weather
router.get('/api/weather', async (req, res) => {
    try {
        const weatherData = await Weather.find().sort({ timestamp: -1 }).limit(1);
        res.json(weatherData[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Endpoint to get daily summaries
router.get('/api/daily-summary', async (req, res) => {
    try {
        const summaries = await DailyWeatherSummary.find();
        res.json(summaries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch daily summaries' });
    }
});

module.exports = router;
