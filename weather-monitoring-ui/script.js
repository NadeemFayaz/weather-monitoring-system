const fetchWeatherData = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/weather'); // Adjust the URL to your API endpoint
        const data = await response.json();
        displayWeatherInfo(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

const displayWeatherInfo = (data) => {
    const weatherInfoDiv = document.getElementById('weather-info');
    weatherInfoDiv.innerHTML = `
        <h2>Current Weather in ${data.city}</h2>
        <p>Temperature: ${data.temp}°C</p>
        <p>Feels Like: ${data.feels_like}°C</p>
        <p>Weather: ${data.weather}</p>
    `;
};

const fetchDailySummaries = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/daily-summary'); // Adjust the URL to your API endpoint
        const summaries = await response.json();
        displayDailySummaries(summaries);
    } catch (error) {
        console.error('Error fetching daily summaries:', error);
    }
};

const displayDailySummaries = (summaries) => {
    const tbody = document.getElementById('daily-summary').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear previous summaries
    summaries.forEach(summary => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${new Date(summary.date).toLocaleDateString()}</td>
            <td>${summary.averageTemp.toFixed(2)}</td>
            <td>${summary.maxTemp}</td>
            <td>${summary.minTemp}</td>
            <td>${summary.dominantWeather}</td>
        `;
    });
};

const init = () => {
    fetchWeatherData();
    fetchDailySummaries();
    setInterval(fetchWeatherData, 300000); // Refresh weather data every 5 minutes
    setInterval(fetchDailySummaries, 86400000); // Refresh daily summaries every 24 hours
};

window.onload = init;
