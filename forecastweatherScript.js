function getLocationAndWeather() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(processPosition, handleLocationError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function processPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetchWeatherData(latitude, longitude); // This will also fetch the forecast
}

function handleLocationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation. Please enable it to use this feature.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function fetchWeatherData(lat, lon) {
    var apiKey = 'APIKEY'; // Replace with your actual API key
    var weatherApiUrl = `https://api.agromonitoring.com/agro/1.0/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fetch current weather
    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Current weather API response:", data);
            displayCurrentWeather(data);
            // Fetch forecast after current weather
            fetchWeatherForecast(lat, lon); // Now calls the forecast function
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            displayError('Error fetching current weather data.');
        });
}

function fetchCurrentWeather() {
    var lat = document.getElementById('latitude').value;
    var lon = document.getElementById('longitude').value;
    fetchWeatherData(lat, lon); // This will also fetch the forecast
}

function displayCurrentWeather(data) {
    var weatherDiv = document.getElementById('weather');
    if (data && data.main && data.weather.length > 0) {
        var weather = data.weather[0];
        var main = data.main;
        var wind = data.wind;
        var clouds = data.clouds;
        var iconUrl = `http://openweathermap.org/img/wn/${weather.icon}.png`;

        // Convert temperatures from Kelvin to Celsius
        var tempCelsius = (main.temp - 273.15).toFixed(1); // Round to one decimal place
        var feelsLikeCelsius = (main.feels_like - 273.15).toFixed(1); // Round to one decimal place

        weatherDiv.innerHTML = `
            <div class="current-weather-entry">
                <h2>Current Weather</h2>
                <img src="${iconUrl}" alt="${weather.description}" style="width:50px;height:50px;">
                <p><strong>${weather.main} - ${weather.description}</strong></p>
                <p>Temperature: ${tempCelsius} °C (Feels like: ${feelsLikeCelsius} °C)</p>
                <p>Pressure: ${main.pressure} hPa</p>
                <p>Humidity: ${main.humidity}%</p>
                <p>Wind Speed: ${wind.speed} m/s</p>
                <p>Cloudiness: ${clouds.all}%</p>
            </div>
        `;
    } else {
        weatherDiv.innerHTML = `<p>Current weather data not available.</p>`;
    }
}

function fetchWeatherForecast(lat, lon) {
    var apiKey = 'APIKEY'; // Replace with your actual API key
    var forecastApiUrl = `https://api.agromonitoring.com/agro/1.0/weather/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Forecast API response:", data);
            displayWeatherForecast(data);
        })
        .catch(error => {
            console.error('Error fetching weather forecast data:', error);
            displayError('Error fetching weather forecast data.');
        });
}

function displayWeatherForecast(data) {
    var forecastDiv = document.getElementById('forecast');

    if (data && data.length > 0) {
        let forecastsHTML = data.map(forecast => {
            let date = new Date(forecast.dt * 1000).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            let iconUrl = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
            let tempCelsius = (forecast.main.temp - 273.15).toFixed(1);
            let pressure = forecast.main.pressure;
            let humidity = forecast.main.humidity;
            let windSpeed = forecast.wind.speed;
            let windDeg = forecast.wind.deg;
            let clouds = forecast.clouds.all;
            // Construct forecast HTML entry
            return `
                <div class="forecast-entry">
                    <h3>${date}</h3> <!-- Include the date within each forecast entry -->
                    <img src="${iconUrl}" alt="${forecast.weather[0].description}" style="width:50px;height:50px;">
                    <p><strong>${forecast.weather[0].main} - ${forecast.weather[0].description}</strong></p>
                    <p>Temperature: ${tempCelsius} °C</p>
                    <p>Pressure: ${pressure} hPa</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind: ${windSpeed} m/s, ${windDeg}°</p>
                    <p>Cloudiness: ${clouds}%</p>
                </div>
            `;
        }).join('');

        // Wrap the forecastsHTML string with a container div for styling
        forecastDiv.innerHTML = `
            <div class="forecastWeatherTitle"><h2>Weather Forecast</h2></div>
            <div class="weatherForecastDisplay">${forecastsHTML}</div>
        `;
    } else {
        forecastDiv.innerHTML = `<p>Weather forecast data not available.</p>`;
    }
}

function displayError(message) {
    var forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = `<p>${message}</p>`;
}
