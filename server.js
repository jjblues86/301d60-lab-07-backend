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
function getLocation(request, response){
  return searchLatToLng(request.query.data)
    .then(locationData => {
      response.send(locationData);

    })
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
  this.long_name = location.address_components[0].long_name;
  console.log('what?', this.formatted_query)

  console.log('what?', this.long_name)

  // weatherLocations.push(this.latitude);
  // weatherLocations.push(this.longitude);
}

function Daily(dailyForecast){
  this.forecast = dailyForecast.summary;
  console.log('what', dailyForecast.summary);
  this.time = new Date(dailyForecast.time * 1000).toDateString();
}

//Search for data
function searchLatToLng(query){
  const geoDataUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`
  return superagent.get(geoDataUrl)
    .then(geoData => {

      const location = new Location(geoData.body.results[0]);
      console.log('what', location)
      return location;
    })
    .catch(err => console.error(err))
  // const geoData = require('./data/geo.json');
}

function searchWeather(){{
  let darkSkyData = require('./data/darksky.json');
  console.log(darkSkyData);
  let weatheArray = [];
  darkSkyData.daily.data.map(forecast => weatheArray.push(new Daily(forecast)));
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
