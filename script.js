document.addEventListener('DOMContentLoaded', () => {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    hourlyForecastDiv.addEventListener('wheel', function(e) {
        e.preventDefault();
        hourlyForecastDiv.scrollLeft += e.deltaY; // Scroll horizontally
    });

    // Fetch weather for the current location when the page loads
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByLocation(lat, lon);
            },
            error => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location.');
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }

    // Add event listener for the search button
    const searchButton = document.querySelector('button');
    searchButton.addEventListener('click', getWeather);

    // Handle Enter key press for city input
    const cityInput = document.getElementById('city');
    cityInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            getWeather();
        }
    });

    // Start the clock
    startClock();
});
// Function to get weather data by city name
function getWeather() {
    const apiKey = "a6a0a5c812b94c6348cc29dea532d544";
    const city = document.getElementById("city").value.trim(); // Trim any extra spaces

    if (!city) {
        alert("Please Enter a city");
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

// Function to get weather data by geolocation
function getWeatherByLocation(lat, lon) {
    const apiKey = "a6a0a5c812b94c6348cc29dea532d544";
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

// Function to display current weather
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
    weatherIcon.style.display = 'none'; // Hide the image initially

    if (data.cod === 404) {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
        weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description.toUpperCase()}</p>`;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage(); // Show the weather icon
    }
}

// Function to display hourly forecast
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    hourlyForecastDiv.innerHTML = '';

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

// Function to show the weather icon
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}

// Function to start the clock
function startClock() {
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;

        document.getElementById('current-time').textContent = timeString;
    }

    // Update the time immediately
    updateTime();

    // Update the time every second
    setInterval(updateTime, 1000);
}
