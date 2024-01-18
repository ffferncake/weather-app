import { useState, useEffect } from "react";
import Search from "./components/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  // Function to fetch weather data
  const fetchWeather = (lat, lon) => {
    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: weatherResponse.name, ...weatherResponse });
        setForecast({ city: forecastResponse.city.name, ...forecastResponse });
      })
      .catch(console.log);
  };

  // Function to handle search changes
  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");
    fetchWeather(lat, lon);
  };

  // Use effect to get current location and fetch weather
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error(err);
        // Handle error or set a default location
      }
    );
  }, []);

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
      {currentWeather && (
        <style>
          {`
            body {
              background-image: url('bg/${currentWeather.weather[0].icon}.gif');
              background-size: cover;
              background-repeat: no-repeat;
              background-attachment: fixed;
            }
          `}
        </style>
      )}
    </div>
  );
}

export default App;
