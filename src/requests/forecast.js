const axios = require('axios')

const BASE_URL = 'https://api.weatherapi.com/v1/forecast.json'
const FORECAST_DAYS = 10

async function fetchForecast(location) {
   return  await axios({
        url: BASE_URL,
        method: 'get',
        params: {
            q: location,
            days: FORECAST_DAYS,
            key: process.env.WEATHER_API_KEY
        },
        responseType: 'json'
    }).then(response => {
        const city = response.data.location.name;
        const country = response.data.location.country;
        const locationName = `${city}, ${country}`
        const weatherData = response.data.forecast.forecastday.map((forecastday) => {
            return {
                date: forecastday.date,
                temperatureMinC: forecastday.day.mintemp_c,
                temperatureMaxC: forecastday.day.maxtemp_c,
                temperatureMinF: forecastday.day.mintemp_f,
                temperatureMaxF: forecastday.day.maxtemp_f,
                sunriseTime: forecastday.astro.sunrise,
                sunsetTime: forecastday.astro.sunset,
                moonriseTime: forecastday.astro.moonrise,
                moonsetTime: forecastday.astro.moonset,
            }
        })

        return {
            locationName,
            weatherData
        }
    }).catch(error => {
        console.error(error)
        throw new Error(`Error fetching forecast for ${locationName}`)
    })
}

module.exports = {
    fetchForecast
}