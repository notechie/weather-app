const apiKey = 'c9a4f6bfebmsh1e988414ce71f20p199ad7jsn9341c71285ae';
const apiHost = 'weatherbit-v1-mashape.p.rapidapi.com';

window.onload = function () {
    fetchWeather("delhi");
};

document.getElementById('getWeather').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name.");
    }
});

async function fetchWeather(city) {
    const url = `https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily?city=${city}&units=M&days=10`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            }
        });

        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        updateWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

function updateWeather(data) {
    console.log(data);
    const currentDay = data.data[0]; // Today's weather

    // Update Current Weather
    document.getElementById('cityName').innerHTML = `
        ${data.city_name} 
        <br><span style="font-size: 14px; color: #bbb;">${formatDate(currentDay.valid_date)}</span>
    `;
    document.getElementById('temperature').textContent = `${currentDay.temp}°C`;
    document.getElementById('condition').textContent = currentDay.weather.description;
    document.getElementById('weatherIcon').src = `https://www.weatherbit.io/static/img/icons/${currentDay.weather.icon}.png`;

    document.getElementById('humidity').textContent = `${currentDay.rh}`;
    document.getElementById('pressure').textContent = `${currentDay.pres}`;
    document.getElementById('visibility').textContent = `${currentDay.vis}`;

    document.getElementById('sunrise').textContent = formatTime(currentDay.sunrise_ts);
    document.getElementById('sunset').textContent = formatTime(currentDay.sunset_ts);
    document.getElementById('windSpeed').textContent = `${currentDay.wind_spd}`;
    document.getElementById('windDirection').textContent = currentDay.wind_cdir_full;
    document.getElementById('highTemp').textContent = `${currentDay.high_temp}`;
    document.getElementById('lowTemp').textContent = `${currentDay.low_temp}`;

    // Update 10-Day Forecast
    const forecastContainer = document.getElementById('dayweather');
    forecastContainer.innerHTML = '';

    data.data.forEach(day => {
        const date = new Date(day.valid_date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <img src="https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png" alt="Weather">
            <div>
                <p class="forecast-date">${dayName} | ${formatDate(day.valid_date)}</p>
                <p class="forecast-temp">${day.temp}°C</p>
            </div>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}

// Function to format timestamp into "hh:mm AM/PM" (only time)
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Function to format date from "YYYY-MM-DD" to "DD-MM-YYYY"
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}
