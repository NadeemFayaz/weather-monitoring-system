// src/models/DailyWeatherSummary.js
const mongoose = require('mongoose');

const dailyWeatherSummarySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    avgTemp: { type: Number, required: true }, // Ensure this matches the variable you are passing
    maxTemp: { type: Number, required: true },
    minTemp: { type: Number, required: true },
    dominantWeather: { type: String, required: true }
});

const DailyWeatherSummary = mongoose.model('DailyWeatherSummary', dailyWeatherSummarySchema);

module.exports = DailyWeatherSummary;
