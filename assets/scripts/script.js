const apiKey = '2ee845417845467b6f6b76e70052809b';
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

const searchForm = document.querySelector('form');
const cityInput = document.querySelector('#city-input');
const searchButton = document.querySelector('#search-button');
const currentWeatherEl = document.querySelector('#current-weather');
const forecastEl = document.querySelector('#forecast');
const searchHistoryEl = document.querySelector('#search-history');

let searchHistory = [];

// Add event listener to search button
searchButton.addEventListener('click', function() {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
    cityInput.value = '';
  }
});

// Add event listener to search history list
searchHistoryEl.addEventListener('click', function(event) {
  const city = event.target.textContent;
  if (city) {
    getWeather(city);
  }
});

// Retrieve weather data from API
function getWeather(city) {
  const currentWeatherUrl = `${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `${apiUrl}forecast?q=${city}&appid=${apiKey}&units=metric`;

  // Fetch current weather data
  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      const { name, main, wind, weather, dt } = data;
      const date = new Date(dt * 1000);

      // Create current weather HTML
      const currentWeatherHTML = `
        <h2>${name} (${date.toLocaleDateString()}) <img src="https://openweathermap.org/img/w/${weather[0].icon}.png" alt="${weather[0].description}"></h2>
        <p>Temperature: ${main.temp} °C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
      `;
      currentWeatherEl.innerHTML = currentWeatherHTML;

      // Add city to search history
      addToSearchHistory(name);
    })
    .catch(error => console.error(error));

  // Fetch forecast data
  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      const forecast = data.list;
      const forecastHTML = [];

      // Loop through each forecast data and create HTML
      forecast.forEach(item => {
        const { dt_txt, main, weather } = item;
        const date = new Date(dt_txt);

        if (date.getHours() === 12) {
          forecastHTML.push(`
            <div class="forecast-item">
              <p>${date.toLocaleDateString()}</p>
              <img src="https://openweathermap.org/img/w/${weather[0].icon}.png" alt="${weather[0].description}">
              <p>Temperature: ${main.temp} °C</p>
              <p>Humidity: ${main.humidity}%</p>
              </div>
              `);
              }
              });
  // Add forecast HTML to forecast element
  forecastEl.innerHTML = forecastHTML.join('');

})
.catch(error => console.error(error));
}

// Add city to search history and localStorage
function addToSearchHistory(city) {
// Check if city is already in search history
if (!searchHistory.includes(city)) {
// Add city to search history array
searchHistory.push(city);

// Create search history HTML and add to search history element
const searchHistoryHTML = searchHistory.map(city => `<li class="list-group-item">${city}</li>`).join('');
searchHistoryEl.innerHTML = searchHistoryHTML;

// Save search history to localStorage
localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}
}

// Retrieve search history from localStorage
function initSearchHistory() {
  const searchHistoryData = JSON.parse(localStorage.getItem('searchHistory'));
  if (searchHistoryData) {
    searchHistory = searchHistoryData;
    const searchHistoryHTML = searchHistory.map(city => `<li class="list-group-item">${city}</li>`).join('');
    searchHistoryEl.innerHTML = searchHistoryHTML;
  }
}

// Initialize search history on page load
initSearchHistory();
