function fetchWeatherHistory() {
    const lat = document.getElementById('latitude').value;
    const lon = document.getElementById('longitude').value;
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

    // Convert user input (YYYY-MM-DD) to UNIX timestamps
    const startTimestamp = dateToUnixTimestamp(start);
    const endTimestamp = dateToUnixTimestamp(end);

    const apiKey = 'APIKEY'; // Replace with your actual API key
    const historyApiUrl = `https://api.agromonitoring.com/agro/1.0/weather/history?lat=${lat}&lon=${lon}&start=${startTimestamp}&end=${endTimestamp}&appid=${apiKey}`;

    fetch(historyApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('NetworkError'); // Assign a custom error message for handling
            }
            return response.json();
        })
        .then(data => {
            displayWeatherHistory(data);
        })
        .catch(error => {
            console.error('Error fetching weather history data:', error);
            handleFetchError(error.message); // Pass the custom error message to the error handler
        });
}

function dateToUnixTimestamp(date) {
    return Math.floor(new Date(date).getTime() / 1000);
}

function displayWeatherHistory(data) {
    const historyDiv = document.getElementById('weatherHistory');
    if (data && data.length > 0) {
        const historyHTML = data.map(entry => {
            // Convert UNIX timestamp to a readable date format
            const date = new Date(entry.dt * 1000);
            const formattedDate = date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            const weather = entry.weather[0];
            const main = entry.main;
            const wind = entry.wind;
            const iconUrl = `http://openweathermap.org/img/wn/${weather.icon}.png`;
            const tempCelsius = (main.temp - 273.15).toFixed(1); // Convert to Celsius

            return `
                <div class="history-entry">
                    <h3>${formattedDate}</h3> <!-- Display the formatted date -->
                    <img src="${iconUrl}" alt="${weather.description}" style="width:50px;height:50px;">
                    <p><strong>${weather.main} - ${weather.description}</strong></p>
                    <p>Temperature: ${tempCelsius} °C</p>
                    <p>Pressure: ${main.pressure} hPa</p>
                    <p>Humidity: ${main.humidity}%</p>
                    <p>Wind Speed: ${wind.speed} m/s</p>
                    <p>Cloudiness: ${entry.clouds.all}%</p>
                </div>
            `;
        }).join('');
        historyDiv.innerHTML = historyHTML;
    } else {
        displayError('Weather history data not available.');
    }
}

function displayError(message) {
    alert(message); // Use an alert to display error messages
}

function handleFetchError(errorMessage) {
    let errorCode;
    // Simulate different error codes based on errorMessage
    switch (errorMessage) {
        case 'NetworkError':
            errorCode = 'NETWORK_ERROR';
            break;
        // Add more cases as needed
        default:
            errorCode = 'UNKNOWN_ERROR';
    }

    // Handle different errors based on errorCode
    switch (errorCode) {
        case 'NETWORK_ERROR':
            displayError('Network error: Unable to fetch data. Check your internet connection and API key.');
            break;
        // Handle other error codes as necessary
        case 'UNKNOWN_ERROR':
        default:
            displayError('An unknown error occurred. Please try again later.');
            break;
    }
}