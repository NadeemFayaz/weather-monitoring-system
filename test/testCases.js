const assert = require('assert');
const { kelvinToCelsius } = require('../src/utils/temperatureUtils');
const { processWeatherData } = require('../src/controllers/weatherController');

function testTemperatureConversion() {
  assert.strictEqual(kelvinToCelsius(300), 26.85);
}

function testWeatherProcessing() {
  const mockWeatherData = [
    { main: { temp: 300 }, weather: [{ main: 'Clear' }] },
    { main: { temp: 305 }, weather: [{ main: 'Rain' }] }
  ];
  const summary = processWeatherData(mockWeatherData);
  assert.strictEqual(summary.averageTemp, 28.15);
}

testTemperatureConversion();
testWeatherProcessing();

console.log('All test cases passed.');
