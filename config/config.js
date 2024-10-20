module.exports = {
    apiKey: '71c047b01f91f19eb5d9e0f9e29bcd76',  // Replace with your OpenWeatherMap API key
    interval: 5 * 60 * 1000, // 5 minutes interval
    locations: ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'],
    alertThresholds: {
      temp: 35,  // Example threshold for temperature
      condition: 'Rain',  // Example condition
    },
  };
  