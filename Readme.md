# Real-Time Weather Monitoring System

## Overview
The Real-Time Weather Monitoring System is a Node.js application that continuously retrieves and processes weather data from the OpenWeatherMap API for major metropolitan cities in India. The system aggregates weather information to provide daily summaries, alerts based on user-defined thresholds, and the capability for future visualizations of the data.

## Features
- **Real-time Data Retrieval**: Automatically fetches weather data every 5 minutes for cities including Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad.
- **Daily Weather Summaries**: Calculates and stores daily aggregates, including:
  - Average temperature
  - Maximum temperature
  - Minimum temperature
  - Dominant weather condition
- **Alerting System**: Configurable thresholds to trigger alerts for temperature or weather condition changes.
- **MongoDB Storage**: All fetched weather data and summaries are stored in a MongoDB database for persistent storage.

## Technologies Used
- **Node.js**: JavaScript runtime for server-side programming.
- **Express.js**: Web application framework for Node.js.
- **Axios**: HTTP client for making requests to the OpenWeatherMap API.
- **Mongoose**: ODM for MongoDB to interact with the database.
- **dotenv**: For managing environment variables.

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd weather-monitoring-system



Install Dependencies:
npm install

Start MongoDB (if not already running):
mongod

Run the Application:
node app.js