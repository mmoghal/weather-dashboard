// Get element references
const searchInput = document.getElementById('search');
const form = document.getElementById('form');
const currentTemp = document.getElementById('temp');
const currentDesc = document.getElementById('desc');
const currentHumidity = document.getElementById('humidity');
const currentWind = document.getElementById('wind');
const forecastEl = document.getElementById('forecast-table');

// Define event listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value;
  if (isValidZip(searchTerm)) {
    getWeatherByZip(searchTerm);
  } else {
    getWeatherByCity(searchTerm);
  }
});

// Functions
function isValidZip(zip) {
  return /^\d{5}(-\d{4})?$/.test(zip);
}

function getWeatherByZip(zip) {
  const apiKey = '81822968b5a226abb1a2fbacd053f10a';
  const units = 'imperial';
  const currentWeatherPath = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=${units}`;
  const forecastPath = `https://api.openweathermap.org/data/2.5/forecast?zip=${zip}&appid=${apiKey}&units=${units}`;

  // Get current weather
  fetch(currentWeatherPath)
    .then(res => res.json())
    .then(json => {
      currentTemp.innerHTML = `${json.main.temp} &deg;F`;
      currentDesc.innerHTML = json.weather[0].description;
      currentHumidity.innerHTML = `Humidity: ${json.main.humidity}%`;
      currentWind.innerHTML = `Wind: ${json.wind.speed} mph`;
      // Call function to get 5-day forecast
      getForecast(json.name);
    })
    .catch(err => console.log(err.message));
}

function getWeatherByCity(city) {
  const apiKey = '81822968b5a226abb1a2fbacd053f10a';
  const units = 'imperial';
  const currentWeatherPath = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  const forecastPath = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;

  // Get current weather
  fetch(currentWeatherPath)
    .then(res => res.json())
    .then(json => {
      currentTemp.innerHTML = `${json.main.temp} &deg;F`;
      currentDesc.innerHTML = json.weather[0].description;
      currentHumidity.innerHTML = `Humidity: ${json.main.humidity}%`;
      currentWind.innerHTML = `Wind: ${json.wind.speed} mph`;
      // Call function to get 5-day forecast
      getForecast(json.name);
    })
    .catch(err => console.log(err.message));
}

// Get 5-day forecast
function getForecast(city) {
  const apiKey = '81822968b5a226abb1a2fbacd053f10a';
  const units = 'imperial';
  const path = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  fetch(path)
    .then(res => res.json())
    .then(json => {
      // Get the forecast data for each day
      const forecasts = json.list.filter(item => item.dt_txt.includes('12:00:00'));
    
      // Clear previous forecast data
      forecastEl.innerHTML = '';

      // Loop through each forecast and display it on the page
      forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US', {
          weekday: 'short'
        });
        const temp = forecast.main.temp;
        const desc = forecast.weather[0].description;

        const forecastItemEl = document.createElement('div');
        forecastItemEl.classList.add('forecast-item');

        const dateEl = document.createElement('p');
        dateEl.textContent = date;
        forecastItemEl.appendChild(dateEl);

        const tempEl = document.createElement('p');
        tempEl.textContent = `Temperature: ${temp}°F`;
        forecastItemEl.appendChild(tempEl);

        const descEl = document.createElement('p');
        descEl.textContent = `Description: ${desc}`;
        forecastItemEl.appendChild(descEl);

        forecastEl.appendChild(forecastItemEl);
      });
    })
    .catch(err => console.log(err.message));
}
