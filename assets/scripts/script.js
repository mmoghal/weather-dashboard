// Get element references
const searchInput = document.getElementById("search");
const form = document.getElementById("form");
const currentTemp = document.getElementById("temp");
const currentDesc = document.getElementById("desc");
const currentHumidity = document.getElementById("humidity");
const currentWind = document.getElementById("wind");
const forecastEl = document.getElementById("forecast-table");

// Define event listeners for when the form is submitted
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value;
  if (isValidZip(searchTerm)) {
    getWeatherByZip(searchTerm);
    addToSearchHistory(searchTerm);
  } else {
    getWeatherByCity(searchTerm);
    addToSearchHistory(searchTerm);
  }
  displayDateTime();
});

// Functions to checks if the given zip code is valid or not
function isValidZip(zip) {
  return /^\d{5}(-\d{4})?$/.test(zip);
}

// Function for current date and time
function displayDateTime() {
  const dateTime = new Date();
  const dateTimeEl = document.getElementById("date-time");
  dateTimeEl.textContent = `Current date and time: ${dateTime}`;
}

// Function to define two API endpoint paths for retrieving weather data by zip code
function getWeatherByZip(zip) {
  const apiKey = "81822968b5a226abb1a2fbacd053f10a";
  const units = "imperial";
  const currentWeatherPath = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=${units}`;
  const forecastPath = `https://api.openweathermap.org/data/2.5/forecast?zip=${zip}&appid=${apiKey}&units=${units}`;

  // Get current weather
  fetch(currentWeatherPath)
    .then((res) => res.json())
    .then((json) => {
      currentTemp.innerHTML = `${json.main.temp} &deg;F`;
      currentDesc.innerHTML = json.weather[0].description;
      currentHumidity.innerHTML = `Humidity: ${json.main.humidity}%`;
      currentWind.innerHTML = `Wind: ${json.wind.speed} mph`;

      // Get weather icon
      const iconCode = json.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
      const iconEl = document.createElement("img");
      iconEl.src = iconUrl;
      currentDesc.prepend(iconEl);

      // Call function to get 5-day forecast
      getForecast(json.name);
    })
    .catch((err) => console.log(err.message));
}
// Function to define two API endpoint paths for retrieving weather data by city name
function getWeatherByCity(city) {
  const apiKey = "81822968b5a226abb1a2fbacd053f10a";
  const units = "imperial";
  const currentWeatherPath = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  const forecastPath = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;

  // Get current weather
  fetch(currentWeatherPath)
    .then((res) => res.json())
    .then((json) => {
      currentTemp.innerHTML = `${json.main.temp} &deg;F`;
      currentDesc.innerHTML = json.weather[0].description;
      currentHumidity.innerHTML = `Humidity: ${json.main.humidity}%`;
      currentWind.innerHTML = `Wind: ${json.wind.speed} mph`;

      // Get weather icon
      const iconCode = json.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
      const iconEl = document.createElement("img");
      iconEl.src = iconUrl;
      currentDesc.prepend(iconEl);

      // Call function to get 5-day forecast
      getForecast(json.name);
    })
    .catch((err) => console.log(err.message));
}

// Get 5-day forecast
function getForecast(city) {
  const apiKey = "81822968b5a226abb1a2fbacd053f10a";
  const units = "imperial";
  const path = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  fetch(path)
    .then((res) => res.json())
    .then((json) => {
      // Get the forecast data for each day
      const forecasts = json.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      // Clear previous forecast data
      forecastEl.innerHTML = "";

      // Loop through each forecast and display it on the page
      forecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
          weekday: "short",
        });
        const temp = forecast.main.temp;
        const desc = forecast.weather[0].description;
        const iconCode = forecast.weather[0].icon;

        const forecastItemEl = document.createElement("div");
        forecastItemEl.classList.add("forecast-item");

        const dateEl = document.createElement("p");
        dateEl.textContent = date;
        forecastItemEl.appendChild(dateEl);

        const tempEl = document.createElement("p");
        tempEl.textContent = `Temperature: ${temp}°F`;
        forecastItemEl.appendChild(tempEl);

        const descEl = document.createElement("p");
        descEl.textContent = `Description: ${desc}`;
        forecastItemEl.appendChild(descEl);

        const iconEl = document.createElement("img");
        iconEl.classList.add("forecast-icon");
        iconEl.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
        forecastItemEl.appendChild(iconEl);

        forecastEl.appendChild(forecastItemEl);
      });
    })
    .catch((err) => console.log(err.message));
}

// Function to add the search term to the search history
function addToSearchHistory(searchTerm) {
  // Get the search history array from local storage or create a new one if it doesn't exist
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Add the search term to the search history array
  searchHistory.unshift(searchTerm);

  // Keep only the last 10 search terms in the search history array
  searchHistory = searchHistory.slice(0, 10);

  // Save the updated search history array to local storage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  // Call the function to display the search history
  displaySearchHistory();
}

// Function to display the search history
function displaySearchHistory() {
  // Get the search history array from local storage or create a new one if it doesn't exist
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Get the search history element from the DOM
  const searchHistoryEl = document.getElementById("search-history");

  // Clear the previous search history
  searchHistoryEl.innerHTML = "";

  // Loop through each search term in the search history and display it on the page
  searchHistory.forEach((searchTerm) => {
    const searchItemEl = document.createElement("div");
    searchItemEl.textContent = searchTerm;
    searchHistoryEl.appendChild(searchItemEl);
  });
}
