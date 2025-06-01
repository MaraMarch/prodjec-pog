// src/app/forecast-3day/page.tsx
'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import styles from './Forecast3Day.module.css'; // Убедитесь, что CSS файл существует
import { get5DayForecast, getWeatherIconEmoji, ForecastData, ForecastListItem } from '@/services/weatherService';

interface DayForecast {
  date: string;
  temp: { day: number; night: number };
  humidity: number;
  wind: number;
  conditions: string;
  icon: string;
  pop: number;
}

interface ProcessedForecast {
  city: string;
  days: DayForecast[];
}

// Адаптируем processForecastData для нужного количества дней
const processForecastDataForDays = (rawData: ForecastData | null, numberOfDays: number): ProcessedForecast | null => {
  if (!rawData || !rawData.list || !rawData.city) return null;

  const dailyData: { [key: string]: ForecastListItem[] } = {};

  rawData.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(item);
  });

  const daysArray: DayForecast[] = Object.keys(dailyData).slice(0, numberOfDays).map(dateKey => { // Используем numberOfDays
    const dayItems = dailyData[dateKey];
    let dayTemps: number[] = [];
    let nightTemps: number[] = [];
    let humiditySum = 0;
    let windSum = 0;
    let popSum = 0;
    let conditionsCounts: { [key: string]: { count: number, icon: string } } = {};
    let representativeIconCode = dayItems[0].weather[0].icon;

    dayItems.forEach((item: ForecastListItem) => {
      const hour = new Date(item.dt * 1000).getHours();
      if (hour >= 6 && hour < 20) { // Дневное время (шире диапазон для агрегации)
        dayTemps.push(item.main.temp);
      } else {
        nightTemps.push(item.main.temp);
      }
      humiditySum += item.main.humidity;
      windSum += item.wind.speed;
      popSum += item.pop || 0;

      const conditionText = item.weather[0].description;
      const icon = item.weather[0].icon;
      if (!conditionsCounts[conditionText]) {
        conditionsCounts[conditionText] = { count: 0, icon: icon };
      }
      conditionsCounts[conditionText].count++;
      if (hour >= 12 && hour < 15) representativeIconCode = icon;
    });

    let mostCommonConditionText = dayItems[0].weather[0].description;
    if (Object.keys(conditionsCounts).length > 0) {
        mostCommonConditionText = Object.keys(conditionsCounts).reduce((a, b) => conditionsCounts[a].count > conditionsCounts[b].count ? a : b);
        representativeIconCode = conditionsCounts[mostCommonConditionText].icon;
    }


    return {
      date: dateKey,
      temp: {
        day: dayTemps.length > 0 ? Math.round(dayTemps.reduce((a, b) => a + b, 0) / dayTemps.length) : Math.round(dayItems.map(i => i.main.temp_max).reduce((a,b) => Math.max(a,b), -Infinity)),
        night: nightTemps.length > 0 ? Math.round(nightTemps.reduce((a, b) => a + b, 0) / nightTemps.length) : Math.round(dayItems.map(i => i.main.temp_min).reduce((a,b) => Math.min(a,b), Infinity)),
      },
      humidity: Math.round(humiditySum / dayItems.length),
      wind: parseFloat((windSum / dayItems.length).toFixed(1)),
      conditions: mostCommonConditionText.charAt(0).toUpperCase() + mostCommonConditionText.slice(1),
      icon: getWeatherIconEmoji(representativeIconCode),
      pop: Math.round((popSum / dayItems.length) * 100),
    };
  });

  return {
    city: rawData.city.name,
    days: daysArray,
  };
};

export default function Forecast3DayPage() {
  const [forecast, setForecast] = useState<ProcessedForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityName, setCityName] = useState('Минск'); // Можно сделать интерактивным

  const fetchAndProcess = useCallback(async (cityToFetch: string) => {
    setLoading(true);
    setError(null);
    setForecast(null);
    const rawData = await get5DayForecast(cityToFetch); // Все равно получаем 5-дневный
    if (rawData) {
      const processed = processForecastDataForDays(rawData, 3); // Обрабатываем для 3 дней
      if (processed) {
        setForecast(processed);
      } else {
        setError(`Не удалось обработать данные прогноза для "${cityToFetch}".`);
      }
    } else {
      setError(`Не удалось загрузить прогноз для "${cityToFetch}".`);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAndProcess(cityName);
  }, [cityName, fetchAndProcess]);

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>Главная</Link>
        <Link href="/forecast" className={styles.navLink}>Прогноз на 5 дней</Link>
        <Link href="/forecast-3day" className={styles.navLink}>Прогноз на 3 дня</Link>
        <Link href="/forecast-weekend" className={styles.navLink}>Прогноз на выходные</Link>
        <Link href="/forecast-week" className={styles.navLink}>Прогноз на неделю</Link>
        <Link href="/forecast-10day" className={styles.navLink}>Прогноз на 10 дней</Link>
        <Link href="/history" className={styles.navLink}>История</Link>
      </nav>

      <main className={styles.main}>
        <div className={styles.forecastCard}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>📅</span>
            3-дневный прогноз для {forecast?.city || cityName}
          </h1>

          {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Загрузка прогноза...</p>}
          {error && <p style={{ textAlign: 'center', color: 'red', padding: '20px' }}>{error}</p>}

          {forecast && !loading && !error && (
            <div className={styles.forecastGrid}>
              {forecast.days.map((day, index) => (
                <div key={index} className={styles.dayCard}>
                  <div className={styles.dayHeader}>
                    <h3 className={styles.dayDate}>
                      {new Date(day.date + 'T00:00:00').toLocaleDateString('ru-RU', {
                        weekday: 'long', day: 'numeric', month: 'short'
                      })}
                    </h3>
                    <span className={styles.dayIcon}>{day.icon}</span>
                  </div>
                  <div className={styles.tempContainer}>
                    <div className={styles.tempItem}>
                      <span className={styles.tempLabel}>Днём</span>
                      <span className={styles.tempValue}>{day.temp.day}°C</span>
                    </div>
                    <div className={styles.tempItem}>
                      <span className={styles.tempLabel}>Ночью</span>
                      <span className={styles.tempNight}>{day.temp.night}°C</span>
                    </div>
                  </div>
                  <div className={styles.weatherDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>💧</span>{day.humidity}%
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>🌪️</span>{day.wind} м/с
                    </div>
                  </div>
                  {day.pop > 0 && (
                    <div className={styles.weatherDetails} style={{marginTop: '10px', justifyContent: 'center'}}>
                       <div className={styles.detailItem}>
                        <span className={styles.detailIcon}>☔</span>{day.pop}%
                      </div>
                    </div>
                   )}
                  <div className={styles.condition}>{day.conditions}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
