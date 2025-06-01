// src/services/weatherService.ts

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5'; // Для бесплатного тарифа

// Интерфейсы для типизации данных (можно улучшить на основе реальных ответов API)
export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
    icon: string; // Код иконки, например, "01d"
    main: string;
  }[];
  sys: {
    country: string;
  };
  cod: number | string; // Код ответа, 200 если успешно
  message?: string; // Сообщение об ошибке от API
}

export interface ForecastListItem {
  dt: number; // timestamp
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    feels_like: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  dt_txt: string; // "2024-03-25 12:00:00"
  pop: number; // Probability of precipitation
}

export interface ForecastData {
  cod: string;
  message: number | string;
  cnt: number; // Number of 3-hour forecast periods
  list: ForecastListItem[];
  city: {
    id: number;
    name: string;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}


// Функция для получения иконки Emoji по коду OpenWeatherMap
export const getWeatherIconEmoji = (iconCode: string): string => {
  const mapping: { [key: string]: string } = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️', // often 'broken clouds' or 'overcast clouds'
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌦️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return mapping[iconCode] || '🌍'; // Возвращаем глобус, если иконки нет
};


export const getCurrentWeather = async (city: string): Promise<WeatherData | null> => {
  if (!API_KEY) {
    console.error("API_KEY OpenWeatherMap не определен в переменных окружения.");
    return null;
  }
  try {
    // Добавляем ,BY для поиска только по Беларуси
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)},BY&appid=${API_KEY}&units=metric&lang=ru`
    );
    const data: WeatherData = await response.json();

    if (!response.ok || data.cod !== 200) {
      console.error(
        `Ошибка получения текущей погоды для ${city}:`,
        data.message || response.statusText
      );
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Сетевая ошибка или ошибка парсинга при запросе текущей погоды для ${city}:`, error);
    return null;
  }
};

export const get5DayForecast = async (city: string): Promise<ForecastData | null> => {
  if (!API_KEY) {
    console.error("API_KEY OpenWeatherMap не определен в переменных окружения.");
    return null;
  }
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)},BY&appid=${API_KEY}&units=metric&lang=ru`
    );
    const data: ForecastData = await response.json();

    if (!response.ok || data.cod !== "200") { // API прогноза возвращает cod как строку "200"
      console.error(
        `Ошибка получения прогноза для ${city}:`,
        data.message || response.statusText
      );
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Сетевая ошибка или ошибка парсинга при запросе прогноза для ${city}:`, error);
    return null;
  }
};
