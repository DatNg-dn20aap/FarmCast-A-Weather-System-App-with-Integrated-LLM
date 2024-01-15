function fetchWeatherForecast() {
    var lat = document.getElementById('latitude').value;
    var lon = document.getElementById('longitude').value;
    var apiKey = 'e50d69d7a95a8eff7bca3548f8608408'; // Replace with your actual API key
    var apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    console.log("Requesting weather forecast for lat:", lat, "lon:", lon); // Log the coordinates

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("API response:", data); // Log the API response
            // Check if the response contains forecast data
            if (data.cod === "200") {
                displayWeatherForecast(data);
            } else {
                console.error('Forecast data not found for these coordinates:', lat, lon);
                displayError('Forecast data not found. Please try different coordinates.');
            }
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function displayWeatherForecast(data) {
    var forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = ''; // Clear previous content

    if (data && data.list) {
        data.list.forEach(forecast => {
            var dateTime = forecast.dt_txt;
            var temp = forecast.main.temp;
            var description = forecast.weather[0].description;
            var iconCode = forecast.weather[0].icon;
            var iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

            forecastDiv.innerHTML += `
                <div class="forecast-entry">
                    <h3>${dateTime}</h3>
                    <p>Temperature: ${temp} K</p>
                    <p>Description: ${description}</p>
                    <img src="${iconUrl}" alt="${description}">
                </div>
            `;
        });
    } else {
        forecastDiv.innerHTML = `<p>Weather forecast data not available.</p>`;
    }
}

function displayError(message) {
    var forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = `<p>${message}</p>`;
}

