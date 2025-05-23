'use client';
import Link from 'next/link';
import styles from './History.module.css';

const historyData = [
  { date: '2024-03-20', city: 'Минск', temp: 28, type: 'max' },
  { date: '2024-03-19', city: 'Гомель', temp: 26, type: 'max' },
  { date: '2024-03-18', city: 'Брест', temp: 25, type: 'max' },
  { date: '2024-03-17', city: 'Гродно', temp: 24, type: 'max' },
  { date: '2024-03-16', city: 'Могилёв', temp: 22, type: 'max' },
  { date: '2024-03-15', city: 'Витебск', temp: 20, type: 'max' },
];

const stats = {
  totalSearches: 42,
  hottestCity: 'Минск',
  coldestCity: 'Витебск',
  averageTemp: 23.5
};

export default function History() {
  const hottestDays = [...historyData].sort((a, b) => b.temp - a.temp).slice(0, 3);

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="" className={styles.navLink}>Главная</Link>
        <Link href="/forecast" className={styles.navLink}>Прогноз</Link>
        <Link href="/history" className={styles.navLink}>История</Link>
      </nav>

      <main className={styles.main}>
        <div className={styles.historyCard}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>📜</span>
            История запросов
          </h1>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🔥</div>
              <h3>Самый жаркий день</h3>
              <p className={styles.statValue}>{hottestDays[0].temp}°C</p>
              <p className={styles.statDetails}>
                {new Date(hottestDays[0].date).toLocaleDateString('ru-RU')} в {hottestDays[0].city}
              </p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>❄️</div>
              <h3>Средняя температура</h3>
              <p className={styles.statValue}>{stats.averageTemp}°C</p>
              <p className={styles.statDetails}>За последние 7 дней</p>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🌡️</div>
              <h3>Всего запросов</h3>
              <p className={styles.statValue}>{stats.totalSearches}</p>
              <p className={styles.statDetails}>Обновлено сегодня</p>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Топ-3 жарких дня</h2>
            <div className={styles.heatWave}>
              {hottestDays.map((day, index) => (
                <div key={day.date} className={styles.heatCard}>
                  <div className={styles.heatNumber}>#{index + 1}</div>
                  <div className={styles.heatContent}>
                    <div className={styles.heatTemp}>
                      <span className={styles.tempValue}>{day.temp}°C</span>
                      <span className={styles.tempCity}>{day.city}</span>
                    </div>
                    <div className={styles.heatDate}>
                      {new Date(day.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Последние запросы</h2>
            <div className={styles.historyList}>
              {historyData.map((record) => (
                <div key={record.date} className={styles.historyItem}>
                  <div className={styles.itemDate}>
                    {new Date(record.date).toLocaleDateString('ru-RU')}
                  </div>
                  <div className={styles.itemCity}>{record.city}</div>
                  <div className={styles.itemTemp}>{record.temp}°C</div>
                  <div className={styles.itemBadge}>
                    {record.type === 'max' ? 'Максимум' : 'Минимум'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
