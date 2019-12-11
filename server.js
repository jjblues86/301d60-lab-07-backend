'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// Load ENV
require('dotenv').config();

app.use(cors());

//Routes
app.get('/', (request, response) => {
  response.send('What up, fam!');
});

app.get('/location', getLocation);
app.get('/weather', getWeather);

//Handlers
function getLocation(request, response){
  const locationData = searchLatToLng(request.query.data || 'Lynnwood, WA, USA');
  response.send(locationData);
}

function getWeather(request, response){
  const weatherData = searchWeather(request.query.data || 'Lynnwood, WA, USA');
  response.send(weatherData);

}

// let weatherLocations = [];

//Constructors
function Location(location){
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
  // weatherLocations.push(this.latitude);
  // weatherLocations.push(this.longitude);
}

function Daily(dailyForecast){
  this.forecast = dailyForecast.summary;
  console.log('what', dailyForecast.summary);
  this.time = new Date(dailyForecast.time * 1000).toDateString();
}

//Search for data
function searchLatToLng(){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  return location;
}

function searchWeather(){{
  let darkSkyData = require('./data/darksky.json');
  console.log(darkSkyData);
  let weatheArray = [];
  darkSkyData.daily.data.forEach(forecast => weatheArray.push(new Daily(forecast)));
  console.log(weatheArray);
  return weatheArray;
}}

//Error handler
app.get('/*', function(request, response){
  response.status(404).send('Try again!')
})

app.listen(PORT, () => {
  console.log(`app running on PORT: ${PORT}`);
});
