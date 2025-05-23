
import Link from 'next/link';
import styles from './Forecast.module.css';

const forecastData = {
  city: "Минск",
  days: [
    {
      date: "2024-03-20",
      temp: { day: 22, night: 15 },
      humidity: 65,
      wind: 3.1,
      conditions: "Ясно",
      icon: "☀️"
    },
    {
      date: "2024-03-21",
      temp: { day: 20, night: 13 },
      humidity: 70,
      wind: 3.5,
      conditions: "Облачно",
      icon: "⛅"
    },
    {
      date: "2024-03-22",
      temp: { day: 18, night: 10 },
      humidity: 80,
      wind: 4.2,
      conditions: "Дождь",
      icon: "🌧️"
    },
    {
      date: "2024-03-23",
      temp: { day: 21, night: 14 },
      humidity: 63,
      wind: 2.8,
      conditions: "Солнечно",
      icon: "🌤️"
    },
    {
      date: "2024-03-24",
      temp: { day: 24, night: 16 },
      humidity: 58,
      wind: 3.0,
      conditions: "Ясно",
      icon: "☀️"
    }
  ]
};

export default function Forecast() {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>Главная</Link>
        <Link href="/forecast" className={styles.navLink}>Прогноз</Link>
        <Link href="/history" className={styles.navLink}>История</Link>
      </nav>

      <main className={styles.main}>
        <div className={styles.forecastCard}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>📅</span>
            5-дневный прогноз для {forecastData.city}
          </h1>

          <div className={styles.forecastGrid}>
            {forecastData.days.map((day, index) => (
              <div key={index} className={styles.dayCard}>
                <div className={styles.dayHeader}>
                  <h3 className={styles.dayDate}>
                    {new Date(day.date).toLocaleDateString('ru-RU', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short'
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
                    <span className={styles.detailIcon}>💧</span>
                    {day.humidity}%
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailIcon}>🌪️</span>
                    {day.wind} м/с
                  </div>
                </div>

                <div className={styles.condition}>
                  {day.conditions}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
