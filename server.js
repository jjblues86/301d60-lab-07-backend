'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const superagent = require('superagent');


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
function getLocation(request, response) {
  return searchLatToLng(request.query.data)
    .then(locationData => {
      response.send(locationData);
    })
}

function getWeather(request, response) {
  return searchWeather(request.query.data)
    .then(weatheData => {
      response.send(weatheData);
    })
}

// let weatherLocations = [];

//Constructors
function Location(location) {
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
  this.long_name = location.address_components[0].long_name;
  console.log('what?', this.formatted_query)

  console.log('what?', this.long_name)

  // weatherLocations.push(this.latitude);
  // weatherLocations.push(this.longitude);
}

function Daily(dailyForecast) {
  this.forecast = dailyForecast.summary;
  console.log('what', dailyForecast.summary);
  this.time = new Date(dailyForecast.time * 1000).toDateString();
}

//Search for data
function searchLatToLng(query) {
  const geoDataUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`
  return superagent.get(geoDataUrl)
    .then(geoData => {
      const location = new Location(response.body.results[0]);
      console.log('what', geoData.body.results)
      return location;
    })
    .catch(err => console.error(err))
  // const geoData = require('./data/geo.json');
}

function searchWeather(query) {
  const darkSkyDataUrl = `https://api.darksky.net/forecast/${WEATHER_API_KEY}/${query.locationData.lat},${query.locationData.lng}`
  return superagent.get(darkSkyDataUrl)
    .then(weatherData => {
      let weatherArray = [];
      weatherData.body.daily.data.map(forcast =>
        weatherArray.push(new Daily(forcast)))
      return weatherArray
    })
}

function searchEvents(query) {
  const eventBriteUrl = `http://api.eventful.com/json/events/search?location=${request.query.data.formatted_query}&app_key=${process.env.EVENTBRITE_API_KEY}`
  return superagent.get(eventBriteUrl)
    .then(eventData => {
      console.log(eventData)
      let eventArray = [];
      eventData.body.daily.data.map(forcast =>
        eventArray.push(new Daily(forcast)))
      return eventArray
    })
}


//Error handler
app.get('/*', function (request, response) {
  response.status(404).send('Try again!')
})

app.listen(PORT, () => {
  console.log(`app running on PORT: ${PORT}`);
});
