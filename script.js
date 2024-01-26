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
    fetchWeatherData(latitude, longitude);
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
    // Use the latitude and longitude in your weather API request
    var apiKey = 'APIKEY'; // Replace with your actual API key
    var apiUrl = `https://api.agromonitoring.com/agro/1.0/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("API response:", data); // Log the API response
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
        });
}

function fetchCurrentWeather() {
    var lat = document.getElementById('latitude').value;
    var lon = document.getElementById('longitude').value;
    var apiKey = 'APIKEY'; // Replace with your actual API key
    var apiUrl = `https://api.agromonitoring.com/agro/1.0/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    console.log("Requesting current weather for lat:", lat, "lon:", lon); // Log the coordinates

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("API response:", data); // Log the API response
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
        });
}

function displayCurrentWeather(data) {
    var weatherDiv = document.getElementById('weather');
    if (data && data.main && data.weather.length > 0) {
        var weather = data.weather[0];
        var main = data.main;
        var wind = data.wind;
        var clouds = data.clouds;
        var iconUrl = `http://openweathermap.org/img/wn/${weather.icon}.png`;

        weatherDiv.innerHTML = `
            <h3>Current Weather</h3>
            <p><strong>Condition:</strong> ${weather.main} (${weather.description})</p>
            <img src="${iconUrl}" alt="${weather.description}">
            <p><strong>Temperature:</strong> ${main.temp} K (Feels like: ${main.feels_like} K)</p>
            <p><strong>Min Temp:</strong> ${main.temp_min} K, <strong>Max Temp:</strong> ${main.temp_max} K</p>
            <p><strong>Pressure:</strong> ${main.pressure} hPa</p>
            <p><strong>Humidity:</strong> ${main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${wind.speed} m/s, <strong>Direction:</strong> ${wind.deg}°, <strong>Gust:</strong> ${wind.gust} m/s</p>
            <p><strong>Cloudiness:</strong> ${clouds.all}%</p>
        `;
    } else {
        weatherDiv.innerHTML = `<p>Current weather data not available.</p>`;
    }
}

function displayError(message) {
    var forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = `<p>${message}</p>`;
}

