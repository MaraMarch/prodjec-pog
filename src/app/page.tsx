// src/app/page.tsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import styles from './Home.module.css'; // Убедитесь, что путь правильный (если Home.module.css в той же папке)
import { getCurrentWeather, getWeatherIconEmoji } from '../services/weatherService'; // Импорт из вашего сервиса

// Список городов для предложений поиска и галереи
const popularBelarusianCities = [
  "Минск", "Гомель", "Могилёв", "Витебск", "Гродно", "Брест",
];
const allBelarusianCities = [ // Более полный список для поиска
  "Минск", "Гомель", "Могилёв", "Витебск", "Гродно", "Брест",
  "Бобруйск", "Барановичи", "Борисов", "Пинск", "Орша", "Мозырь",
  "Солигорск", "Новополоцк", "Лида", "Молодечно", "Полоцк", "Жлобин",
  "Светлогорск", "Речица", "Слуцк", "Кобрин", "Волковыск", "Калинковичи",
  "Сморгонь", "Рогачёв", "Осиповичи", "Горки", "Новогрудок", "Вилейка"
];


interface CurrentWeatherDisplayData {
  city: string;
  temp: number;
  humidity: number;
  wind: number;
  conditions: string;
  icon: string;
  country: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('Минск');
  const [weatherData, setWeatherData] = useState<CurrentWeatherDisplayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchWeatherForCity = useCallback(async (cityToFetch: string) => {
    setLoading(true);
    setError(null);
    setWeatherData(null); // Сброс предыдущих данных перед новым запросом

    const data = await getCurrentWeather(cityToFetch);

    if (data && data.cod === 200) {
      setWeatherData({
        city: data.name,
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        wind: data.wind.speed,
        conditions: data.weather[0]?.description ? data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1) : 'Нет данных',
        icon: getWeatherIconEmoji(data.weather[0]?.icon || ''),
        country: data.sys.country,
      });
    } else {
      setError(`Не удалось загрузить погоду для "${cityToFetch}". Проверьте название или API ключ.`);
      // Можно оставить предыдущие данные или очистить
      // setWeatherData(null);
    }
    setLoading(false);
  }, []); // useCallback для оптимизации

  useEffect(() => {
    fetchWeatherForCity(selectedCityName);
  }, [selectedCityName, fetchWeatherForCity]); // Добавляем fetchWeatherForCity в зависимости

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (cityName: string) => {
    setSelectedCityName(cityName);
    setSearchTerm(''); // Очищаем поиск после выбора
    setShowSuggestions(false);
  };

  const handleCityThumbClick = (cityName: string) => {
    setSelectedCityName(cityName);
  }

  // Клик вне области поиска для скрытия подсказок
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestCities = searchTerm.trim()
    ? allBelarusianCities.filter(city =>
        city.toLowerCase().includes(searchTerm.trim().toLowerCase())
      ).slice(0, 7) // Показываем не более 7 подсказок
    : [];

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
        <div className={styles.weatherCard}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>🌤️</span>
            Погода в Беларуси
          </h1>

          <div className={styles.searchContainer} ref={searchRef}>
            <div className={styles.searchBox}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Найти город..."
                className={styles.searchInput}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && filteredSuggestCities.length > 0 && (
                <div className={styles.suggestionsList}>
                  {filteredSuggestCities.map((city) => (
                    <button
                      key={city}
                      className={styles.suggestionItem}
                      onClick={() => handleSuggestionClick(city)}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Загрузка погоды для {selectedCityName}...</p>}
          {error && <p style={{ textAlign: 'center', color: 'red', padding: '20px' }}>{error}</p>}

          {weatherData && !loading && !error && (
            <div className={styles.weatherInfo}>
              <div className={styles.weatherHeader}>
                <div>
                  <h2 className={styles.city}>
                    {weatherData.city}
                    {weatherData.country && <span className={styles.cityBadge}>{weatherData.country}</span>}
                  </h2>
                  <p className={styles.conditions}>
                    {weatherData.conditions}
                  </p>
                </div>
                <div className={styles.weatherIcon}>
                  {weatherData.icon}
                </div>
              </div>

              <div className={styles.weatherGrid}>
                <div className={styles.weatherItem}>
                  <span className={styles.weatherValue}>{weatherData.temp}°C</span>
                  <span className={styles.weatherLabel}>Температура</span>
                </div>
                <div className={styles.weatherItem}>
                  <span className={styles.weatherValue}>{weatherData.humidity}%</span>
                  <span className={styles.weatherLabel}>Влажность</span>
                </div>
                <div className={styles.weatherItem}>
                  <span className={styles.weatherValue}>{weatherData.wind.toFixed(1)} м/с</span>
                  <span className={styles.weatherLabel}>Ветер</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.cityGallery}>
            {popularBelarusianCities.map((city) => (
              <button
                key={city}
                className={`${styles.cityThumb} ${selectedCityName === city ? styles.active : ''}`}
                onClick={() => handleCityThumbClick(city)}
                disabled={loading && selectedCityName === city} // Блокируем кнопку во время загрузки для этого города
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
