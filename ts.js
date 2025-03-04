async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const weatherCard = document.getElementById('weatherCard');
    const errorMessage = document.getElementById('errorMessage');

    if (cityInput.value.trim() === "") {
        errorMessage.textContent = "Please enter a city name!";
        errorMessage.style.display = "block";
        return;
    }

    try {
        
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityInput.value}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found');
        }

        const { latitude, longitude, name } = geoData.results[0];

        
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherResponse.json();

        
        document.getElementById('cityName').textContent = name;
        document.getElementById('temperature').textContent = `${weatherData.current_weather.temperature}°C`;
        document.getElementById('feelsLike').textContent = `${weatherData.current_weather.temperature}°C`; // Open-Meteo does not provide "feels like" temp
        document.getElementById('humidity').textContent = `N/A`; // Humidity not available in Open-Meteo free API
        document.getElementById('windSpeed').textContent = `${weatherData.current_weather.windspeed} m/s`;
        document.getElementById('description').textContent = `Weather Code: ${weatherData.current_weather.weathercode}`;

        weatherCard.classList.add('visible');
        errorMessage.style.display = 'none';
    } catch (error) {
        weatherCard.classList.remove('visible');
        errorMessage.textContent = 'Could not fetch weather data. Please try again.';
        errorMessage.style.display = 'block';
    }
}

// Allow Enter key to trigger search
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});
