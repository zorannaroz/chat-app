import React, { useState, useEffect } from "react";
import "./WeatherWidget.css";

const WeatherWidget = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showHourly, setShowHourly] = useState(false);
  const [showWeekly, setShowWeekly] = useState(false);

  const GEOCODING_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported by your browser");
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            const weatherResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const weatherData = await weatherResponse.json();
            setCurrentWeather(weatherData.current_weather);

            const geocodingResponse = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${GEOCODING_API_KEY}`
            );
            const geocodingData = await geocodingResponse.json();
            const city =
              geocodingData.results[0].components.city ||
              geocodingData.results[0].components.town ||
              geocodingData.results[0].components.village;
            setCityName(city);

            const weeklyForecastResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_min,temperature_2m_max,weathercode&timezone=auto`
            );
            const weeklyForecastData = await weeklyForecastResponse.json();
            setWeeklyForecast(weeklyForecastData.daily);

            const hourlyForecastResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation,weathercode&timezone=auto`
            );
            const hourlyForecastData = await hourlyForecastResponse.json();
            const filteredHours = hourlyForecastData.hourly.time.slice(0, 24);
            const filteredTemperatures =
              hourlyForecastData.hourly.temperature_2m.slice(0, 24);
            const filteredPrecipitations =
              hourlyForecastData.hourly.precipitation.slice(0, 24);
            const filteredWeatherCodes =
              hourlyForecastData.hourly.weathercode.slice(0, 24);
            setHourlyForecast({
              time: filteredHours,
              temperature_2m: filteredTemperatures,
              precipitation: filteredPrecipitations,
              weathercode: filteredWeatherCodes,
            });
          },
          (error) => {
            console.error("Error getting geolocation:", error.message);
          }
        );
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [GEOCODING_API_KEY]);

  const toggleCurrentView = () => {
    setShowCurrent((prev) => !prev);
    if (!showCurrent) {
      setShowHourly(false);
      setShowWeekly(false);
    }
  };

  const toggleHourlyView = () => {
    setShowHourly((prev) => !prev);
    setShowWeekly(false);
  };

  const toggleWeeklyView = () => {
    setShowWeekly((prev) => !prev);
    setShowHourly(false);
  };

  const getWeatherIcon = (code) => {
    const iconMapping = {
      0: "wi-day-sunny",
      1: "wi-day-cloudy",
      2: "wi-day-cloudy-high",
      3: "wi-cloudy",
      45: "wi-fog",
      51: "wi-day-showers",
      53: "wi-day-showers",
      61: "wi-day-rain",
      63: "wi-day-rain",
      80: "wi-day-rain",
      81: "wi-day-showers",
      82: "wi-day-showers",
      95: "wi-day-thunderstorm",
      96: "wi-day-thunderstorm",
      99: "wi-day-thunderstorm",
    };

    return iconMapping[code] || "wi-day-sunny";
  };

  return (
    <div className="weather-widget">
      <button onClick={toggleCurrentView}>
        {showCurrent ? "Hide Current Weather" : "Show Current Weather"}
      </button>

      {/* Modal for Current Weather */}
      {showCurrent && (
        <div className="modal current-weather-modal">
          <div className="modal-content">
            <h2>Current Weather</h2>
            {cityName && <p>Location: {cityName}</p>}
            {currentWeather && (
              <>
                <i
                  className={`wi ${getWeatherIcon(currentWeather.weathercode)}`}
                ></i>
                <p>Temperature: {currentWeather.temperature}°C</p>
                <p>Wind Speed: {currentWeather.windspeed} m/s</p>
              </>
            )}
            <div className="forecast-buttons">
              <button onClick={toggleHourlyView}>
                {showHourly ? "Hide Hourly Forecast" : "Show Hourly Forecast"}
              </button>
              <button onClick={toggleWeeklyView}>
                {showWeekly ? "Hide Weekly Forecast" : "Show Weekly Forecast"}
              </button>
            </div>
            <button onClick={() => setShowCurrent(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal for Hourly Forecast */}
      {showHourly && hourlyForecast && (
        <div className="modal hourly-forecast-modal">
          <div className="modal-content">
            <h2>Hourly Forecast</h2>
            <div className="hourly-scroll-container">
              <ul>
                {hourlyForecast.time.map((time, index) => (
                  <li key={index}>
                    <i
                      className={`wi ${getWeatherIcon(
                        hourlyForecast.weathercode[index]
                      )}`}
                    ></i>
                    <strong>{time}</strong>
                    <br />
                    Temperature: {hourlyForecast.temperature_2m[index]}°C
                    <br />
                    Precipitation: {hourlyForecast.precipitation[index]} mm
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => setShowHourly(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal for Weekly Forecast */}
      {showWeekly && weeklyForecast && (
        <div className="modal weekly-forecast-modal">
          <div className="modal-content">
            <h2>Weekly Forecast</h2>
            <div className="weekly-forecast-container">
              <ul>
                {weeklyForecast.time.map((date, index) => (
                  <li key={index}>
                    <i
                      className={`wi ${getWeatherIcon(
                        weeklyForecast.weathercode[index]
                      )}`}
                    ></i>
                    <strong>{date}</strong>
                    <br />
                    Min Temperature: {weeklyForecast.temperature_2m_min[index]}
                    °C
                    <br />
                    Max Temperature: {weeklyForecast.temperature_2m_max[index]}
                    °C
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => setShowWeekly(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
