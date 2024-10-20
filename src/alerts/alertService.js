// src/alerts/alertService.js
const checkAlertConditions = (weatherData, thresholds) => {
    const alerts = [];
    if (weatherData.temp > thresholds.tempHigh) {
        alerts.push(`Alert: ${weatherData.city} temperature exceeded ${thresholds.tempHigh}°C.`);
    }
    return alerts;
};

module.exports = { checkAlertConditions };
