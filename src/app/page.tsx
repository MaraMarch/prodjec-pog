// app/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Home.module.css';

const citiesWeather = [
  {
    city: "Минск",
    temp: 23,
    humidity: 60,
    wind: 2.8,
    conditions: "Ясно",
    icon: "☀️"
  },
  {
    city: "Гомель",
    temp: 25,
    humidity: 58,
    wind: 3.1,
    conditions: "Облачно",
    icon: "⛅"
  },
  {
    city: "Могилёв",
    temp: 20,
    humidity: 65,
    wind: 2.5,
    conditions: "Дождь",
    icon: "🌧️"
  },
  {
    city: "Витебск",
    temp: 18,
    humidity: 70,
    wind: 3.4,
    conditions: "Пасмурно",
    icon: "☁️"
  },
  {
    city: "Гродно",
    temp: 22,
    humidity: 62,
    wind: 2.9,
    conditions: "Ясно",
    icon: "☀️"
  },
  {
    city: "Брест",
    temp: 24,
    humidity: 57,
    wind: 3.0,
    conditions: "Облачно",
    icon: "⛅"
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(citiesWeather[0]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredCities = citiesWeather.filter(city =>
    city.city.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const handleSelectCity = (city: typeof citiesWeather[number]) => {
    setSelectedCity(city);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>Главная</Link>
        <Link href="/forecast" className={styles.navLink}>Прогноз</Link>
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Найти город..."
                className={styles.searchInput}
                onFocus={() => setShowSuggestions(true)}
              />

              {showSuggestions && filteredCities.length > 0 && (
                <div className={styles.suggestionsList}>
                  {filteredCities.map((city) => (
                    <button
                      key={city.city}
                      className={styles.suggestionItem}
                      onClick={() => handleSelectCity(city)}
                    >
                      {city.city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.weatherInfo}>
            <div className={styles.weatherHeader}>
              <div>
                <h2 className={styles.city}>
                  {selectedCity.city}
                  <span className={styles.cityBadge}>Беларусь</span>
                </h2>
                <p className={styles.conditions}>
                  {selectedCity.conditions}
                </p>
              </div>
              <div className={styles.weatherIcon}>
                {selectedCity.icon}
              </div>
            </div>

            <div className={styles.weatherGrid}>
              <div className={styles.weatherItem}>
                <span className={styles.weatherValue}>{selectedCity.temp}°C</span>
                <span className={styles.weatherLabel}>Температура</span>
              </div>
              <div className={styles.weatherItem}>
                <span className={styles.weatherValue}>{selectedCity.humidity}%</span>
                <span className={styles.weatherLabel}>Влажность</span>
              </div>
              <div className={styles.weatherItem}>
                <span className={styles.weatherValue}>{selectedCity.wind} м/с</span>
                <span className={styles.weatherLabel}>Ветер</span>
              </div>
            </div>

            <div className={styles.cityGallery}>
              {citiesWeather.map((city) => (
                <button
                  key={city.city}
                  className={`${styles.cityThumb} ${selectedCity.city === city.city ? styles.active : ''}`}
                  onClick={() => setSelectedCity(city)}
                >
                  {city.city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
